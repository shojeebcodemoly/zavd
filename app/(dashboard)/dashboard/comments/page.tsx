import { headers } from "next/headers";
import { getAuth } from "@/lib/db/auth";
import { getBlogCommentModel } from "@/models/blog-comment.model";
import { getBlogPostModel } from "@/models/blog-post.model";
import { CommentsList } from "./comments-list";
import type { CommentStatus } from "@/models/blog-comment.model";

interface PageProps {
	searchParams: Promise<{
		page?: string;
		search?: string;
		status?: string;
		postId?: string;
	}>;
}

/**
 * Comments Dashboard Page - Server Component
 * Fetches initial data on the server and passes to client component
 */
export default async function CommentsPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = parseInt(params.page || "1", 10);
	const search = params.search || "";
	const status = (params.status || "") as CommentStatus | "";
	const postId = params.postId || "";

	// Get session from server
	const auth = await getAuth();
	const headersList = await headers();
	const session = await auth.api.getSession({ headers: headersList });

	// Initialize data
	interface CommentData {
		_id: string;
		postId: string;
		postTitle: string;
		postSlug: string;
		name: string;
		email: string;
		phone: string;
		comment: string;
		status: CommentStatus;
		createdAt: string;
	}

	let comments: CommentData[] = [];
	let totalPages = 1;
	let total = 0;
	let stats = null;

	if (session?.user?.id) {
		try {
			const BlogComment = await getBlogCommentModel();
			const BlogPost = await getBlogPostModel();

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

			// Get total count
			total = await BlogComment.countDocuments(query);
			totalPages = Math.ceil(total / 20);

			// Get comments with pagination
			const rawComments = await BlogComment.find(query)
				.sort({ createdAt: -1 })
				.skip((page - 1) * 20)
				.limit(20)
				.lean();

			// Get post titles for each comment
			const postIds = [
				...new Set(rawComments.map((c) => c.postId.toString())),
			];
			const posts = await BlogPost.find({ _id: { $in: postIds } })
				.select("_id title slug")
				.lean();

			const postMap = new Map(posts.map((p) => [p._id.toString(), p]));

			// Map comments with post info
			comments = rawComments.map((comment) => {
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
					createdAt: comment.createdAt.toISOString(),
				};
			});

			// Fetch stats
			const [totalCount, pendingCount, approvedCount, rejectedCount] =
				await Promise.all([
					BlogComment.countDocuments(),
					BlogComment.countDocuments({ status: "pending" }),
					BlogComment.countDocuments({ status: "approved" }),
					BlogComment.countDocuments({ status: "rejected" }),
				]);

			stats = {
				total: totalCount,
				pending: pendingCount,
				approved: approvedCount,
				rejected: rejectedCount,
			};
		} catch (error) {
			console.error("Failed to fetch comments:", error);
		}
	}

	return (
		<CommentsList
			initialComments={comments}
			initialStats={stats}
			initialPage={page}
			initialTotalPages={totalPages}
			initialTotal={total}
			initialSearch={search}
			initialStatus={status}
			initialPostId={postId}
		/>
	);
}
