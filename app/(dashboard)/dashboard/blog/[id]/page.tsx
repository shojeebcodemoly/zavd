import { redirect, notFound } from "next/navigation";
import { getAuth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { blogCategoryService } from "@/lib/services/blog-category.service";
import { blogPostService } from "@/lib/services/blog-post.service";
import { EditBlogPostClient } from "./_components/edit-blog-post-client";

interface EditBlogPostPageProps {
	params: Promise<{ id: string }>;
}

/**
 * Edit Blog Post Page (Server Component)
 * Handles auth check and initial data fetching
 */
export default async function EditBlogPostPage({
	params,
}: EditBlogPostPageProps) {
	const { id: postId } = await params;

	// Auth check on server
	const auth = await getAuth();
	const headersList = await headers();
	const session = await auth.api.getSession({ headers: headersList });

	if (!session) {
		redirect(`/login?callbackUrl=/dashboard/blog/${postId}`);
	}

	// Fetch initial data on server
	try {
		const [post, categoryTree, tags] = await Promise.all([
			blogPostService.getPostById(postId),
			blogCategoryService.getCategoryTree(),
			blogPostService.getAllTags(),
		]);

		return (
			<EditBlogPostClient
				postId={postId}
				initialPost={JSON.parse(JSON.stringify(post))}
				categoryTree={JSON.parse(JSON.stringify(categoryTree))}
				tagSuggestions={tags}
			/>
		);
	} catch {
		notFound();
	}
}
