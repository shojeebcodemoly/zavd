import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { blogPostService } from "@/lib/services/blog-post.service";
import { updatePublishTypeSchema } from "@/lib/validations/blog-post.validation";
import { logger } from "@/lib/utils/logger";
import { isValidObjectId } from "@/lib/utils/product-helpers";
import { revalidateBlogPost } from "@/lib/revalidation/actions";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * PUT /api/blog-posts/[id]/publish
 * Update publish type (publish, draft, private)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update publish status");
			return unauthorizedResponse(
				"You must be logged in to update publish status"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid blog post ID format");
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = updatePublishTypeSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		const { publishType } = validationResult.data;

		// Update publish type
		if (publishType === "publish") {
			const result = await blogPostService.publishPost(id);

			// Revalidate ISR cache for this post
			await revalidateBlogPost(result.post.slug);

			logger.info("Blog post published", {
				postId: id,
				publishedBy: session.user.id,
				warnings: result.warnings.length,
			});
			return successResponse(
				{ post: result.post, warnings: result.warnings },
				"Blog post published successfully"
			);
		} else {
			const post = await blogPostService.updatePublishType(id, publishType);

			// Revalidate ISR cache for this post
			await revalidateBlogPost(post.slug);

			logger.info("Blog post publish type updated", {
				postId: id,
				updatedBy: session.user.id,
				publishType,
			});
			return successResponse(
				{ post, warnings: [] },
				`Blog post set to ${publishType}`
			);
		}
	} catch (error: unknown) {
		logger.error("Error updating blog post publish status", error);

		if (error instanceof Error) {
			if (error.message.includes("not found")) {
				return notFoundResponse(error.message);
			}
			if (error.message.includes("cannot be published")) {
				// Return validation errors from the service
				return badRequestResponse(error.message, (error as any).details);
			}
		}

		const message =
			error instanceof Error
				? error.message
				: "Failed to update publish status";
		return internalServerErrorResponse(message);
	}
}
