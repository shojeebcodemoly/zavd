import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { getBlogCommentModel, type CommentStatus } from "@/models/blog-comment.model";
import { logger } from "@/lib/utils/logger";
import { isValidObjectId } from "@/lib/utils/product-helpers";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
	noContentResponse,
} from "@/lib/utils/api-response";
import { z } from "zod";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * Update comment status schema
 */
const updateStatusSchema = z.object({
	status: z.enum(["pending", "approved", "rejected"]),
});

/**
 * GET /api/comments/[id]
 * Get a single comment by ID (admin only)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			return unauthorizedResponse("You must be logged in to view comments");
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid comment ID format");
		}

		const BlogComment = await getBlogCommentModel();
		const comment = await BlogComment.findById(id).lean();

		if (!comment) {
			return notFoundResponse("Comment not found");
		}

		return successResponse(
			{
				_id: comment._id.toString(),
				postId: comment.postId.toString(),
				name: comment.name,
				email: comment.email,
				phone: comment.phone,
				comment: comment.comment,
				status: comment.status,
				createdAt: comment.createdAt,
				updatedAt: comment.updatedAt,
			},
			"Comment retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching comment", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch comment";
		return internalServerErrorResponse(message);
	}
}

/**
 * PATCH /api/comments/[id]
 * Update comment status (admin only)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			return unauthorizedResponse(
				"You must be logged in to update comments"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid comment ID format");
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = updateStatusSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse(
				"Invalid status",
				validationResult.error.issues
			);
		}

		const { status } = validationResult.data;

		const BlogComment = await getBlogCommentModel();
		const comment = await BlogComment.findByIdAndUpdate(
			id,
			{ status: status as CommentStatus },
			{ new: true }
		).lean();

		if (!comment) {
			return notFoundResponse("Comment not found");
		}

		logger.info("Comment status updated", {
			commentId: id,
			newStatus: status,
			updatedBy: session.user.id,
		});

		return successResponse(
			{
				_id: comment._id.toString(),
				status: comment.status,
			},
			`Comment ${status === "approved" ? "approved" : status === "rejected" ? "rejected" : "updated"} successfully`
		);
	} catch (error: unknown) {
		logger.error("Error updating comment", error);
		const message =
			error instanceof Error ? error.message : "Failed to update comment";
		return internalServerErrorResponse(message);
	}
}

/**
 * DELETE /api/comments/[id]
 * Delete a comment (admin only)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			return unauthorizedResponse(
				"You must be logged in to delete comments"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid comment ID format");
		}

		const BlogComment = await getBlogCommentModel();
		const comment = await BlogComment.findByIdAndDelete(id);

		if (!comment) {
			return notFoundResponse("Comment not found");
		}

		logger.info("Comment deleted", {
			commentId: id,
			deletedBy: session.user.id,
		});

		return noContentResponse();
	} catch (error: unknown) {
		logger.error("Error deleting comment", error);
		const message =
			error instanceof Error ? error.message : "Failed to delete comment";
		return internalServerErrorResponse(message);
	}
}
