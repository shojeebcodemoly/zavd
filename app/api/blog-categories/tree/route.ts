import { NextRequest } from "next/server";
import { blogCategoryService } from "@/lib/services/blog-category.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/blog-categories/tree
 * Get blog categories as tree structure
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const activeOnly = searchParams.get("activeOnly") === "true";

		const tree = await blogCategoryService.getCategoryTree(activeOnly);

		return successResponse(tree, "Blog category tree retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching blog category tree", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to fetch blog category tree";
		return internalServerErrorResponse(message);
	}
}
