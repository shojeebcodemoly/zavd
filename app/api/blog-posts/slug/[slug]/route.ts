import { NextRequest } from "next/server";
import { blogPostService } from "@/lib/services/blog-post.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	notFoundResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

interface RouteParams {
	params: Promise<{ slug: string }>;
}

/**
 * GET /api/blog-posts/slug/[slug]
 * Get a published blog post by slug (for public/frontend use)
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
	try {
		const { slug } = await params;

		const post = await blogPostService.getPublicPostBySlug(slug);

		return successResponse(post, "Blog post retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching blog post by slug", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse("Blog post not found");
		}

		const message =
			error instanceof Error ? error.message : "Failed to fetch blog post";
		return internalServerErrorResponse(message);
	}
}
