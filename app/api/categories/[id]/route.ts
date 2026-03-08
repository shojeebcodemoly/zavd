import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { categoryService } from "@/lib/services/category.service";
import { updateCategorySchema } from "@/lib/validations/category.validation";
import { logger } from "@/lib/utils/logger";
import { isValidObjectId } from "@/lib/utils/product-helpers";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
	noContentResponse,
	conflictResponse,
} from "@/lib/utils/api-response";
import { revalidateCategory } from "@/lib/revalidation/actions";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * GET /api/categories/[id]
 * Get a single category by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid category ID format");
		}

		const category = await categoryService.getCategoryById(id);

		return successResponse(category, "Category retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching category", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse("Category not found");
		}

		const message =
			error instanceof Error ? error.message : "Failed to fetch category";
		return internalServerErrorResponse(message);
	}
}

/**
 * PUT /api/categories/[id]
 * Update a category (requires authentication)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update category");
			return unauthorizedResponse(
				"You must be logged in to update categories"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid category ID format");
		}

		// Get old category to check if slug changes
		const oldCategory = await categoryService.getCategoryById(id);
		const oldSlug = oldCategory.slug;

		// Parse and validate request body
		const body = await request.json();
		const validationResult = updateCategorySchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Category update validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Update category
		const category = await categoryService.updateCategory(
			id,
			validationResult.data
		);

		// Revalidate category caches (both old and new slugs if changed)
		await revalidateCategory(category.slug);
		if (oldSlug !== category.slug) {
			await revalidateCategory(oldSlug);
		}

		logger.info("Category updated", {
			categoryId: id,
			updatedBy: session.user.id,
			updates: Object.keys(validationResult.data),
		});

		return successResponse(category, "Category updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating category", error);

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
			error instanceof Error ? error.message : "Failed to update category";
		return internalServerErrorResponse(message);
	}
}

/**
 * DELETE /api/categories/[id]
 * Delete a category (requires authentication)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to delete category");
			return unauthorizedResponse(
				"You must be logged in to delete categories"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid category ID format");
		}

		// Get category slug before deletion for cache invalidation
		const categoryToDelete = await categoryService.getCategoryById(id);
		const categorySlug = categoryToDelete.slug;

		// Check for reparent option in query
		const { searchParams } = new URL(request.url);
		const reparentChildren = searchParams.get("reparentChildren") === "true";

		// Delete category
		await categoryService.deleteCategory(id, { reparentChildren });

		// Revalidate category caches
		await revalidateCategory(categorySlug);

		logger.info("Category deleted", {
			categoryId: id,
			deletedBy: session.user.id,
			reparentChildren,
		});

		return noContentResponse();
	} catch (error: unknown) {
		logger.error("Error deleting category", error);

		if (error instanceof Error) {
			if (error.message.includes("not found")) {
				return notFoundResponse(error.message);
			}
			if (error.message.includes("children")) {
				return badRequestResponse(error.message);
			}
		}

		const message =
			error instanceof Error ? error.message : "Failed to delete category";
		return internalServerErrorResponse(message);
	}
}
