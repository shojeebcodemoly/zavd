import { NextRequest } from "next/server";
import { blogPostService } from "@/lib/services/blog-post.service";
import { blogCategoryRepository } from "@/lib/repositories/blog-category.repository";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	notFoundResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { z } from "zod";

interface RouteParams {
	params: Promise<{ slug: string }>;
}

const querySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
});

/**
 * GET /api/blog-posts/public/category/[slug]
 * Get published blog posts by category slug
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { slug } = await params;
		const { searchParams } = new URL(request.url);

		// Parse pagination params
		const queryResult = querySchema.safeParse({
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "10",
		});

		const { page, limit } = queryResult.success
			? queryResult.data
			: { page: 1, limit: 10 };

		// Get category info
		const category = await blogCategoryRepository.findBySlug(slug);

		if (!category) {
			return notFoundResponse("Category not found");
		}

		// Get posts for this category
		const result = await blogPostService.getPostsByCategorySlug(slug, {
			page,
			limit,
		});

		return successResponse(
			{
				category: {
					_id: category._id,
					name: category.name,
					slug: category.slug,
					description: category.description,
				},
				posts: result.data,
				pagination: {
					page: result.page,
					limit: result.limit,
					total: result.total,
					totalPages: result.totalPages,
				},
			},
			"Category posts retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching posts by category", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to fetch category posts";
		return internalServerErrorResponse(message);
	}
}
