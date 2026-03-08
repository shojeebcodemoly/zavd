import { redirect } from "next/navigation";
import { getAuth } from "@/lib/db/auth";
import { headers } from "next/headers";
import { blogCategoryService } from "@/lib/services/blog-category.service";
import { blogPostService } from "@/lib/services/blog-post.service";
import { NewBlogPostClient } from "./_components/new-blog-post-client";

/**
 * New Blog Post Page (Server Component)
 * Handles auth check and initial data fetching
 */
export default async function NewBlogPostPage() {
	// Auth check on server
	const auth = await getAuth();
	const headersList = await headers();
	const session = await auth.api.getSession({ headers: headersList });

	if (!session) {
		redirect("/login?callbackUrl=/dashboard/blog/new");
	}

	// Fetch initial data on server
	const [categoryTree, tags] = await Promise.all([
		blogCategoryService.getCategoryTree(),
		blogPostService.getAllTags(),
	]);

	return (
		<NewBlogPostClient
			categoryTree={JSON.parse(JSON.stringify(categoryTree))}
			tagSuggestions={tags}
		/>
	);
}
