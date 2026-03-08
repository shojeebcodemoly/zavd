import { NextRequest } from "next/server";
import { blogPostService } from "@/lib/services/blog-post.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/blog-posts/stats
 * Get blog post statistics
 */
export async function GET(_request: NextRequest) {
	try {
		const stats = await blogPostService.getPostStats();

		return successResponse(stats, "Blog post stats retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching blog post stats", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to fetch blog post stats";
		return internalServerErrorResponse(message);
	}
}
