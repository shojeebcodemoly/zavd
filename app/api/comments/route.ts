import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { getBlogCommentModel } from "@/models/blog-comment.model";
import { getBlogPostModel } from "@/models/blog-post.model";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/comments
 * Get all comments with pagination and filtering (admin only)
 */
export async function GET(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			return unauthorizedResponse("You must be logged in to view comments");
		}

		// Parse query params
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "20", 10);
		const status = searchParams.get("status") || "";
		const search = searchParams.get("search") || "";
		const postId = searchParams.get("postId") || "";

		// Build query
		const query: Record<string, unknown> = {};

		if (status) {
			query.status = status;
		}

		if (postId) {
			query.postId = postId;
		}

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
				{ comment: { $regex: search, $options: "i" } },
			];
		}

		const BlogComment = await getBlogCommentModel();
		const BlogPost = await getBlogPostModel();

		// Get total count
		const total = await BlogComment.countDocuments(query);
		const totalPages = Math.ceil(total / limit);

		// Get comments with pagination
		const comments = await BlogComment.find(query)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean();

		// Get post titles for each comment
		const postIds = [...new Set(comments.map((c) => c.postId.toString()))];
		const posts = await BlogPost.find({ _id: { $in: postIds } })
			.select("_id title slug")
			.lean();

		const postMap = new Map(posts.map((p) => [p._id.toString(), p]));

		// Map comments with post info
		const mappedComments = comments.map((comment) => {
			const post = postMap.get(comment.postId.toString());
			return {
				_id: comment._id.toString(),
				postId: comment.postId.toString(),
				postTitle: post?.title || "Unknown Post",
				postSlug: post?.slug || "",
				name: comment.name,
				email: comment.email,
				phone: comment.phone,
				comment: comment.comment,
				status: comment.status,
				createdAt: comment.createdAt,
				updatedAt: comment.updatedAt,
			};
		});

		return successResponse(
			mappedComments,
			"Comments retrieved successfully",
			200,
			{
				page,
				limit,
				total,
				totalPages,
			}
		);
	} catch (error: unknown) {
		logger.error("Error fetching comments", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch comments";
		return internalServerErrorResponse(message);
	}
}
