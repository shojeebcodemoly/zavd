import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { blogPostService } from "@/lib/services/blog-post.service";
import { updateBlogPostSchema } from "@/lib/validations/blog-post.validation";
import { logger } from "@/lib/utils/logger";
import { isValidObjectId } from "@/lib/utils/product-helpers";
import { revalidateBlogPost } from "@/lib/revalidation/actions";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
	noContentResponse,
	conflictResponse,
} from "@/lib/utils/api-response";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * GET /api/blog-posts/[id]
 * Get a single blog post by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid blog post ID format");
		}

		const post = await blogPostService.getPostById(id);

		return successResponse(post, "Blog post retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching blog post", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse("Blog post not found");
		}

		const message =
			error instanceof Error ? error.message : "Failed to fetch blog post";
		return internalServerErrorResponse(message);
	}
}

/**
 * PUT /api/blog-posts/[id]
 * Update a blog post (requires authentication)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update blog post");
			return unauthorizedResponse(
				"You must be logged in to update blog posts"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid blog post ID format");
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = updateBlogPostSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Blog post update validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Update blog post
		const post = await blogPostService.updatePost(id, validationResult.data);

		// Revalidate ISR cache for this post
		await revalidateBlogPost(post.slug);

		logger.info("Blog post updated", {
			postId: id,
			updatedBy: session.user.id,
			updates: Object.keys(validationResult.data),
		});

		return successResponse(post, "Blog post updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating blog post", error);

		if (error instanceof Error) {
			if (error.message.includes("not found")) {
				return notFoundResponse(error.message);
			}
			if (error.message.includes("already exists")) {
				return conflictResponse(error.message);
			}
		}

		const message =
			error instanceof Error ? error.message : "Failed to update blog post";
		return internalServerErrorResponse(message);
	}
}

/**
 * DELETE /api/blog-posts/[id]
 * Delete a blog post (requires authentication)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to delete blog post");
			return unauthorizedResponse(
				"You must be logged in to delete blog posts"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid blog post ID format");
		}

		// Get post info before deletion for revalidation
		const postToDelete = await blogPostService.getPostById(id);
		const postSlug = postToDelete?.slug;

		// Delete blog post
		await blogPostService.deletePost(id);

		// Revalidate ISR cache
		if (postSlug) {
			await revalidateBlogPost(postSlug);
		}

		logger.info("Blog post deleted", {
			postId: id,
			deletedBy: session.user.id,
		});

		return noContentResponse();
	} catch (error: unknown) {
		logger.error("Error deleting blog post", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse(error.message);
		}

		const message =
			error instanceof Error ? error.message : "Failed to delete blog post";
		return internalServerErrorResponse(message);
	}
}
