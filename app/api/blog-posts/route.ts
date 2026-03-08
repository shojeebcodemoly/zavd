import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { blogPostService } from "@/lib/services/blog-post.service";
import {
	createBlogPostSchema,
	blogPostListQuerySchema,
} from "@/lib/validations/blog-post.validation";
import { logger } from "@/lib/utils/logger";
import {
	createdResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
	paginatedResponse,
	conflictResponse,
} from "@/lib/utils/api-response";
import { revalidateBlogPost, revalidateBlogTags } from "@/lib/revalidation/actions";

/**
 * GET /api/blog-posts
 * List blog posts with filtering and pagination
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// Helper to get param value or undefined (not null)
		const getParam = (key: string): string | undefined => {
			const value = searchParams.get(key);
			return value ?? undefined;
		};

		// Parse query params - convert null to undefined for Zod compatibility
		const queryResult = blogPostListQuerySchema.safeParse({
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "10",
			search: getParam("search"),
			category: getParam("category"),
			tag: getParam("tag"),
			author: getParam("author"),
			publishType: getParam("publishType"),
			sort: searchParams.get("sort") || "-createdAt",
		});

		if (!queryResult.success) {
			return badRequestResponse(
				"Invalid query parameters",
				queryResult.error.issues
			);
		}

		const { page, limit, search, category, tag, author, publishType, sort } =
			queryResult.data;

		const result = await blogPostService.getPosts({
			page,
			limit,
			search,
			category,
			tag,
			author,
			publishType,
			sort,
		});

		return paginatedResponse(
			result.data,
			result.page,
			result.limit,
			result.total,
			"Blog posts retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching blog posts", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch blog posts";
		return internalServerErrorResponse(message);
	}
}

/**
 * POST /api/blog-posts
 * Create a new blog post (requires authentication)
 */
export async function POST(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to create blog post");
			return unauthorizedResponse(
				"You must be logged in to create blog posts"
			);
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = createBlogPostSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Blog post creation validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Create blog post
		const post = await blogPostService.createPost(
			validationResult.data,
			session.user.id
		);

		// Revalidate ISR cache
		await revalidateBlogPost(post.slug);
		// Revalidate tags if the post has tags
		if (post.tags && post.tags.length > 0) {
			await revalidateBlogTags();
		}

		logger.info("Blog post created", {
			postId: post._id,
			title: post.title,
			createdBy: session.user.id,
		});

		return createdResponse(post, "Blog post created successfully");
	} catch (error: unknown) {
		logger.error("Error creating blog post", error);

		if (error instanceof Error) {
			if (error.message.includes("already exists")) {
				return conflictResponse(error.message);
			}
			if (error.message.includes("not found")) {
				return badRequestResponse(error.message);
			}
		}

		const message =
			error instanceof Error ? error.message : "Failed to create blog post";
		return internalServerErrorResponse(message);
	}
}
