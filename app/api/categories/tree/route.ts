import { NextRequest } from "next/server";
import { categoryService } from "@/lib/services/category.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/categories/tree
 * Get full category tree structure
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const activeOnly = searchParams.get("activeOnly") === "true";

		const tree = await categoryService.getCategoryTree(activeOnly);

		return successResponse(tree, "Category tree retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching category tree", error);
		const message = error instanceof Error ? error.message : "Failed to fetch category tree";
		return internalServerErrorResponse(message);
	}
}
