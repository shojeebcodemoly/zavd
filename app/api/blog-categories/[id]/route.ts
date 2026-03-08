import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { blogCategoryService } from "@/lib/services/blog-category.service";
import { updateBlogCategorySchema } from "@/lib/validations/blog-category.validation";
import { logger } from "@/lib/utils/logger";
import { isValidObjectId } from "@/lib/utils/product-helpers";
import { revalidateBlogCategory } from "@/lib/revalidation/actions";
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
 * GET /api/blog-categories/[id]
 * Get a single blog category by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid blog category ID format");
		}

		const category = await blogCategoryService.getCategoryById(id);

		return successResponse(category, "Blog category retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching blog category", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse("Blog category not found");
		}

		const message =
			error instanceof Error
				? error.message
				: "Failed to fetch blog category";
		return internalServerErrorResponse(message);
	}
}

/**
 * PUT /api/blog-categories/[id]
 * Update a blog category (requires authentication)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update blog category");
			return unauthorizedResponse(
				"You must be logged in to update blog categories"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid blog category ID format");
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = updateBlogCategorySchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Blog category update validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Get old slug before update for revalidation
		const oldCategory = await blogCategoryService.getCategoryById(id);
		const oldSlug = oldCategory?.slug;

		// Update blog category
		const category = await blogCategoryService.updateCategory(
			id,
			validationResult.data
		);

		// Revalidate ISR cache - both old and new slugs if changed
		if (oldSlug && oldSlug !== category.slug) {
			await revalidateBlogCategory(oldSlug);
		}
		await revalidateBlogCategory(category.slug);

		logger.info("Blog category updated", {
			categoryId: id,
			updatedBy: session.user.id,
			updates: Object.keys(validationResult.data),
		});

		return successResponse(category, "Blog category updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating blog category", error);

		if (error instanceof Error) {
			if (error.message.includes("not found")) {
				return notFoundResponse(error.message);
			}
			if (error.message.includes("already exists")) {
				return conflictResponse(error.message);
			}
			if (
				error.message.includes("circular") ||
				error.message.includes("cycle")
			) {
				return badRequestResponse(error.message);
			}
		}

		const message =
			error instanceof Error
				? error.message
				: "Failed to update blog category";
		return internalServerErrorResponse(message);
	}
}

/**
 * DELETE /api/blog-categories/[id]
 * Delete a blog category (requires authentication)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to delete blog category");
			return unauthorizedResponse(
				"You must be logged in to delete blog categories"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid blog category ID format");
		}

		// Check for reparent option in query
		const { searchParams } = new URL(request.url);
		const reparentChildren = searchParams.get("reparentChildren") === "true";

		// Get category info before deletion for revalidation
		const categoryToDelete = await blogCategoryService.getCategoryById(id);
		const categorySlug = categoryToDelete?.slug;

		// Delete blog category
		await blogCategoryService.deleteCategory(id, { reparentChildren });

		// Revalidate ISR cache
		if (categorySlug) {
			await revalidateBlogCategory(categorySlug);
		}

		logger.info("Blog category deleted", {
			categoryId: id,
			deletedBy: session.user.id,
			reparentChildren,
		});

		return noContentResponse();
	} catch (error: unknown) {
		logger.error("Error deleting blog category", error);

		if (error instanceof Error) {
			if (error.message.includes("not found")) {
				return notFoundResponse(error.message);
			}
			if (error.message.includes("children")) {
				return badRequestResponse(error.message);
			}
		}

		const message =
			error instanceof Error
				? error.message
				: "Failed to delete blog category";
		return internalServerErrorResponse(message);
	}
}
