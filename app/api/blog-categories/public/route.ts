import { blogCategoryService } from "@/lib/services/blog-category.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/blog-categories/public
 * List active blog categories for public/frontend use
 * No authentication required
 */
export async function GET() {
	try {
		// Get all active categories as a flat list
		const result = await blogCategoryService.getCategories({
			isActive: true,
			limit: 100,
		});

		// Extract category names from the result
		const categories = Array.isArray(result)
			? result.map((cat) => cat.name)
			: result.data.map((cat) => cat.name);

		return successResponse(
			categories,
			"Blog categories retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching public blog categories", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to fetch blog categories";
		return internalServerErrorResponse(message);
	}
}
