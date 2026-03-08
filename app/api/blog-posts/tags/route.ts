import { NextRequest } from "next/server";
import { blogPostService } from "@/lib/services/blog-post.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/blog-posts/tags
 * Get all unique tags from blog posts
 */
export async function GET(_request: NextRequest) {
	try {
		const tags = await blogPostService.getAllTags();

		return successResponse(tags, "Tags retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching blog post tags", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch tags";
		return internalServerErrorResponse(message);
	}
}
