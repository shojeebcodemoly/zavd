import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { blogPostService } from "@/lib/services/blog-post.service";
import { BlogPostsClient } from "./_components/blog-posts-client";

/**
 * Blog Posts Dashboard Page (Server Component)
 * Handles auth check and initial data fetching, passes to client for interactivity
 */
export default async function BlogPostsPage() {
	// Auth check on server
	const auth = await getAuth();
	const headersList = await headers();
	const session = await auth.api.getSession({ headers: headersList });

	if (!session) {
		redirect("/login?callbackUrl=/dashboard/blog");
	}

	// Fetch initial data on server
	const [postsResult, stats] = await Promise.all([
		blogPostService.getPosts({ page: 1, limit: 10, sort: "-createdAt" }),
		blogPostService.getPostStats(),
	]);

	return (
		<Suspense fallback={<BlogPostsLoading />}>
			<BlogPostsClient
				initialPosts={JSON.parse(JSON.stringify(postsResult.data))}
				initialMeta={{
					total: postsResult.total,
					page: postsResult.page,
					limit: postsResult.limit,
					totalPages: postsResult.totalPages,
				}}
				initialStats={stats}
			/>
		</Suspense>
	);
}

function BlogPostsLoading() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<p>Loading...</p>
		</div>
	);
}
