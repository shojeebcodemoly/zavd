import { NextRequest } from "next/server";
import { getBlogCommentModel } from "@/models/blog-comment.model";
import { getBlogPostModel } from "@/models/blog-post.model";
import { logger } from "@/lib/utils/logger";
import { isValidObjectId } from "@/lib/utils/product-helpers";
import {
	successResponse,
	badRequestResponse,
	notFoundResponse,
	internalServerErrorResponse,
	createdResponse,
} from "@/lib/utils/api-response";
import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * Comment validation schema
 * Uses libphonenumber-js for international phone validation
 */
const createCommentSchema = z
	.object({
		name: z
			.string()
			.min(2, "Namn måste vara minst 2 tecken")
			.max(100, "Namn kan inte överstiga 100 tecken")
			.trim(),
		email: z
			.string()
			.email("Ogiltig e-postadress")
			.max(255, "E-post kan inte överstiga 255 tecken")
			.trim()
			.toLowerCase(),
		countryCode: z
			.string()
			.min(2, "Landskod krävs")
			.max(10, "Landskod kan inte överstiga 10 tecken"),
		phone: z
			.string()
			.min(6, "Telefonnummer måste vara minst 6 siffror")
			.max(20, "Telefonnummer kan inte överstiga 20 tecken"),
		comment: z
			.string()
			.min(10, "Kommentar måste vara minst 10 tecken")
			.max(2000, "Kommentar kan inte överstiga 2000 tecken")
			.trim(),
	})
	.refine(
		(data) => {
			const fullPhone =
				data.countryCode + data.phone.replace(/[\s\-]/g, "");
			return isValidPhoneNumber(fullPhone);
		},
		{
			message: "Ogiltigt telefonnummer för valt land",
			path: ["phone"],
		}
	);

/**
 * GET /api/blog-posts/[id]/comments
 * Get all approved comments for a blog post
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid blog post ID format");
		}

		// Check if post exists
		const BlogPost = await getBlogPostModel();
		const post = await BlogPost.findById(id);
		if (!post) {
			return notFoundResponse("Blog post not found");
		}

		// Get approved comments
		const BlogComment = await getBlogCommentModel();
		const comments = await BlogComment.find({
			postId: id,
			status: "approved",
		})
			.sort({ createdAt: -1 })
			.lean();

		// Map to remove sensitive info (email, phone)
		const publicComments = comments.map((comment) => ({
			id: comment._id.toString(),
			name: comment.name,
			comment: comment.comment,
			createdAt: comment.createdAt,
		}));

		return successResponse(publicComments, "Comments retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching comments", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch comments";
		return internalServerErrorResponse(message);
	}
}

/**
 * POST /api/blog-posts/[id]/comments
 * Submit a new comment for a blog post
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid blog post ID format");
		}

		// Check if post exists
		const BlogPost = await getBlogPostModel();
		const post = await BlogPost.findById(id);
		if (!post) {
			return notFoundResponse("Blog post not found");
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = createCommentSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Comment validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				validationResult.error.issues[0].message,
				validationResult.error.issues
			);
		}

		const { name, email, countryCode, phone, comment } = validationResult.data;

		// Store full phone number with country code
		const fullPhone = countryCode + phone.replace(/[\s\-]/g, "");

		// Create comment (pending approval)
		const BlogComment = await getBlogCommentModel();
		const newComment = await BlogComment.create({
			postId: id,
			name,
			email,
			phone: fullPhone,
			comment,
			status: "pending",
		});

		logger.info("New comment submitted", {
			postId: id,
			commentId: newComment._id.toString(),
			name,
		});

		return createdResponse(
			{
				id: newComment._id.toString(),
				name: newComment.name,
				createdAt: newComment.createdAt,
			},
			"Tack för din kommentar! Den kommer att granskas innan publicering."
		);
	} catch (error: unknown) {
		logger.error("Error creating comment", error);
		const message =
			error instanceof Error ? error.message : "Failed to create comment";
		return internalServerErrorResponse(message);
	}
}
