import { NextRequest } from "next/server";
import { blogPostService } from "@/lib/services/blog-post.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	notFoundResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { z } from "zod";
import mongoose from "mongoose";

interface RouteParams {
	params: Promise<{ id: string }>;
}

const querySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
});

/**
 * GET /api/blog-posts/public/author/[id]
 * Get published blog posts by author ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const { searchParams } = new URL(request.url);

		// Parse pagination params
		const queryResult = querySchema.safeParse({
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "10",
		});

		const { page, limit } = queryResult.success
			? queryResult.data
			: { page: 1, limit: 10 };

		// Get author info
		const User =
			mongoose.models.user ||
			mongoose.model("user", new mongoose.Schema({}, { strict: false }));
		const author = await User.findById(id).select("name email image").exec();

		if (!author) {
			return notFoundResponse("Author not found");
		}

		// Get posts for this author
		const result = await blogPostService.getPostsByAuthor(id, {
			page,
			limit,
		});

		return successResponse(
			{
				author: {
					_id: author._id,
					name: author.name,
					image: author.image,
				},
				posts: result.data,
				pagination: {
					page: result.page,
					limit: result.limit,
					total: result.total,
					totalPages: result.totalPages,
				},
			},
			"Author posts retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching posts by author", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to fetch author posts";
		return internalServerErrorResponse(message);
	}
}
