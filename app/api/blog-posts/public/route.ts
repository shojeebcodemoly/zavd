import { NextRequest } from "next/server";
import { blogPostService } from "@/lib/services/blog-post.service";
import { logger } from "@/lib/utils/logger";
import {
	paginatedResponse,
	badRequestResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { z } from "zod";

/**
 * Query schema for public blog posts
 */
const publicBlogListQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
	search: z.string().optional(),
	category: z.string().optional(),
	tag: z.string().optional(),
	sort: z.string().default("-publishedAt"),
});

/**
 * GET /api/blog-posts/public
 * List published blog posts for public/frontend use
 * No authentication required
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// Parse query params
		const queryResult = publicBlogListQuerySchema.safeParse({
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "10",
			search: searchParams.get("search"),
			category: searchParams.get("category"),
			tag: searchParams.get("tag"),
			sort: searchParams.get("sort") || "-publishedAt",
		});

		if (!queryResult.success) {
			return badRequestResponse(
				"Invalid query parameters",
				queryResult.error.issues
			);
		}

		const { page, limit, search, category, tag, sort } = queryResult.data;

		// Use getPublishedPosts which only returns published posts
		const result = await blogPostService.getPublishedPosts({
			page,
			limit,
			category,
			tag,
			sort,
		});

		// If search is provided, filter results (since getPublishedPosts doesn't support search directly)
		let filteredData = result.data;
		if (search && search.trim()) {
			const searchLower = search.toLowerCase().trim();
			filteredData = result.data.filter(
				(post) =>
					post.title.toLowerCase().includes(searchLower) ||
					post.excerpt.toLowerCase().includes(searchLower) ||
					post.tags.some((t) => t.toLowerCase().includes(searchLower))
			);
		}

		return paginatedResponse(
			filteredData,
			result.page,
			result.limit,
			search ? filteredData.length : result.total,
			"Published blog posts retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching published blog posts", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to fetch blog posts";
		return internalServerErrorResponse(message);
	}
}
