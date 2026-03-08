import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { categoryService } from "@/lib/services/category.service";
import {
	createCategorySchema,
	categoryListQuerySchema,
} from "@/lib/validations/category.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	createdResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
	paginatedResponse,
	conflictResponse,
} from "@/lib/utils/api-response";
import { revalidateCategory } from "@/lib/revalidation/actions";

/**
 * GET /api/categories
 * List categories with optional filtering and tree structure
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// Parse query params
		const queryResult = categoryListQuerySchema.safeParse({
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "50",
			parent: searchParams.get("parent"),
			isActive: searchParams.get("isActive"),
			tree: searchParams.get("tree") || "false",
			search: searchParams.get("search"),
		});

		if (!queryResult.success) {
			return badRequestResponse(
				"Invalid query parameters",
				queryResult.error.issues
			);
		}

		const { page, limit, parent, isActive, tree, search } = queryResult.data;

		const result = await categoryService.getCategories({
			page,
			limit,
			parent,
			isActive,
			search,
			tree,
		});

		// If tree structure was requested, return as is
		if (Array.isArray(result)) {
			return successResponse(result, "Categories retrieved successfully");
		}

		// Return paginated response
		return paginatedResponse(
			result.data,
			result.page,
			result.limit,
			result.total,
			"Categories retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching categories", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch categories";
		return internalServerErrorResponse(message);
	}
}

/**
 * POST /api/categories
 * Create a new category (requires authentication)
 */
export async function POST(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to create category");
			return unauthorizedResponse(
				"You must be logged in to create categories"
			);
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = createCategorySchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Category creation validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Create category
		const category = await categoryService.createCategory(
			validationResult.data
		);

		// Revalidate category caches
		await revalidateCategory(category.slug);

		logger.info("Category created", {
			categoryId: category._id,
			name: category.name,
			createdBy: session.user.id,
		});

		return createdResponse(category, "Category created successfully");
	} catch (error: unknown) {
		logger.error("Error creating category", error);

		if (error instanceof Error) {
			if (error.message.includes("already exists")) {
				return conflictResponse(error.message);
			}
			if (error.message.includes("not found")) {
				return badRequestResponse(error.message);
			}
		}

		const message =
			error instanceof Error ? error.message : "Failed to create category";
		return internalServerErrorResponse(message);
	}
}
