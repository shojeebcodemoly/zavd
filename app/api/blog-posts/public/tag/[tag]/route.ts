import { NextRequest } from "next/server";
import { blogPostService } from "@/lib/services/blog-post.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { z } from "zod";

interface RouteParams {
	params: Promise<{ tag: string }>;
}

const querySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
});

/**
 * GET /api/blog-posts/public/tag/[tag]
 * Get published blog posts by tag
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { tag } = await params;
		const { searchParams } = new URL(request.url);

		// Decode the tag from URL
		const decodedTag = decodeURIComponent(tag);

		// Parse pagination params
		const queryResult = querySchema.safeParse({
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "10",
		});

		const { page, limit } = queryResult.success
			? queryResult.data
			: { page: 1, limit: 10 };

		// Get posts for this tag
		const result = await blogPostService.getPostsByTag(decodedTag, {
			page,
			limit,
		});

		return successResponse(
			{
				tag: decodedTag,
				posts: result.data,
				pagination: {
					page: result.page,
					limit: result.limit,
					total: result.total,
					totalPages: result.totalPages,
				},
			},
			"Tag posts retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching posts by tag", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch tag posts";
		return internalServerErrorResponse(message);
	}
}
