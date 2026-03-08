import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { getBlogCommentModel } from "@/models/blog-comment.model";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/comments/stats
 * Get comment statistics (admin only)
 */
export async function GET(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			return unauthorizedResponse("You must be logged in to view stats");
		}

		const BlogComment = await getBlogCommentModel();

		// Get counts by status
		const [total, pending, approved, rejected] = await Promise.all([
			BlogComment.countDocuments(),
			BlogComment.countDocuments({ status: "pending" }),
			BlogComment.countDocuments({ status: "approved" }),
			BlogComment.countDocuments({ status: "rejected" }),
		]);

		return successResponse(
			{
				total,
				pending,
				approved,
				rejected,
			},
			"Stats retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching comment stats", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch stats";
		return internalServerErrorResponse(message);
	}
}
