import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { blogCategoryService } from "@/lib/services/blog-category.service";
import {
	createBlogCategorySchema,
	blogCategoryListQuerySchema,
} from "@/lib/validations/blog-category.validation";
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
import { revalidateBlogCategory } from "@/lib/revalidation/actions";

/**
 * GET /api/blog-categories
 * List blog categories with optional filtering and tree structure
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// Parse query params
		const queryResult = blogCategoryListQuerySchema.safeParse({
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

		const result = await blogCategoryService.getCategories({
			page,
			limit,
			parent,
			isActive,
			search,
			tree,
		});

		// If tree structure was requested, return as is
		if (Array.isArray(result)) {
			return successResponse(
				result,
				"Blog categories retrieved successfully"
			);
		}

		// Return paginated response
		return paginatedResponse(
			result.data,
			result.page,
			result.limit,
			result.total,
			"Blog categories retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching blog categories", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to fetch blog categories";
		return internalServerErrorResponse(message);
	}
}

/**
 * POST /api/blog-categories
 * Create a new blog category (requires authentication)
 */
export async function POST(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to create blog category");
			return unauthorizedResponse(
				"You must be logged in to create blog categories"
			);
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = createBlogCategorySchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Blog category creation validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Create blog category
		const category = await blogCategoryService.createCategory(
			validationResult.data
		);

		// Revalidate ISR cache
		await revalidateBlogCategory(category.slug);

		logger.info("Blog category created", {
			categoryId: category._id,
			name: category.name,
			createdBy: session.user.id,
		});

		return createdResponse(category, "Blog category created successfully");
	} catch (error: unknown) {
		logger.error("Error creating blog category", error);

		if (error instanceof Error) {
			if (error.message.includes("already exists")) {
				return conflictResponse(error.message);
			}
			if (error.message.includes("not found")) {
				return badRequestResponse(error.message);
			}
		}

		const message =
			error instanceof Error
				? error.message
				: "Failed to create blog category";
		return internalServerErrorResponse(message);
	}
}
