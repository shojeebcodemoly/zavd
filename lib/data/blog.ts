import { blogPostService } from "@/lib/services/blog-post.service";
import { blogCategoryService } from "@/lib/services/blog-category.service";
import type { Article, Author } from "@/types/article";
import type { IBlogPost } from "@/models/blog-post.model";

/**
 * Convert database blog post to Article format for public pages
 */
function convertToArticle(post: IBlogPost): Article {
	// Handle populated author
	const authorData = post.author as unknown as {
		_id: string;
		name?: string;
		email?: string;
		image?: string;
	};

	const author: Author = {
		name: authorData?.name || "Synos Medical",
		role: "Redaktionen",
		image: authorData?.image || undefined,
		bio: undefined,
	};

	// Handle populated categories - extract names
	const categoryNames: string[] = [];
	if (post.categories && Array.isArray(post.categories)) {
		for (const cat of post.categories) {
			if (typeof cat === "object" && cat !== null && "name" in cat) {
				categoryNames.push((cat as { name: string }).name);
			} else if (typeof cat === "string") {
				categoryNames.push(cat);
			}
		}
	}

	return {
		id: post._id.toString(),
		slug: post.slug,
		title: post.title,
		excerpt: post.excerpt || "",
		content: post.content || "",
		author,
		publishedAt:
			post.publishedAt?.toISOString() || post.createdAt.toISOString(),
		updatedAt: post.updatedAt.toISOString(),
		featuredImage: post.featuredImage
			? {
					url: post.featuredImage.url,
					alt: post.featuredImage.alt || post.title,
			  }
			: undefined,
		categories: categoryNames,
		tags: post.tags || [],
		seo: {
			title: post.seo?.title || post.title,
			description: post.seo?.description || post.excerpt || "",
			keywords: post.seo?.keywords || post.tags || [],
			ogImage: post.seo?.ogImage || post.featuredImage?.url || undefined,
		},
	};
}

/**
 * Get all published blog posts as Articles
 */
export async function getAllArticles(): Promise<Article[]> {
	try {
		// Fetch all published posts (use high limit to get all)
		const result = await blogPostService.getPublishedPosts({
			page: 1,
			limit: 1000, // High limit to fetch all posts
			sort: "-publishedAt",
		});

		return result.data.map(convertToArticle);
	} catch (error) {
		console.error("Failed to fetch articles:", error);
		return [];
	}
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
	try {
		const post = await blogPostService.getPublicPostBySlug(slug);
		return convertToArticle(post);
	} catch (error) {
		console.error("Failed to fetch article by slug:", error);
		return null;
	}
}

/**
 * Get articles by category slug
 */
export async function getArticlesByCategory(
	categorySlug: string
): Promise<Article[]> {
	try {
		const result = await blogPostService.getPostsByCategorySlug(
			categorySlug,
			{
				page: 1,
				limit: 100,
			}
		);

		return result.data.map(convertToArticle);
	} catch (error) {
		console.error("Failed to fetch articles by category:", error);
		return [];
	}
}

/**
 * Get articles by tag
 */
export async function getArticlesByTag(tag: string): Promise<Article[]> {
	try {
		const result = await blogPostService.getPostsByTag(tag, {
			page: 1,
			limit: 100,
		});

		return result.data.map(convertToArticle);
	} catch (error) {
		console.error("Failed to fetch articles by tag:", error);
		return [];
	}
}

/**
 * Get recent articles
 */
export async function getRecentArticles(limit: number = 5): Promise<Article[]> {
	try {
		const result = await blogPostService.getPublishedPosts({
			page: 1,
			limit,
			sort: "-publishedAt",
		});

		return result.data.map(convertToArticle);
	} catch (error) {
		console.error("Failed to fetch recent articles:", error);
		return [];
	}
}

/**
 * Get all unique categories from published posts
 */
export async function getAllCategories(): Promise<string[]> {
	try {
		const categories = await blogCategoryService.getActiveCategories();
		return categories.map((cat) => cat.name);
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		return [];
	}
}

/**
 * Get all unique tags from published posts
 */
export async function getAllTags(): Promise<string[]> {
	try {
		return await blogPostService.getAllTags();
	} catch (error) {
		console.error("Failed to fetch tags:", error);
		return [];
	}
}

/**
 * Get related articles (same category, excluding current)
 */
export async function getRelatedArticles(
	currentPostId: string,
	limit: number = 3
): Promise<Article[]> {
	try {
		// Get the current post to find its categories
		const currentPost = await blogPostService.getPostById(currentPostId);
		const categoryIds = (currentPost.categories || []).map((cat) => {
			if (typeof cat === "object" && cat !== null && "_id" in cat) {
				return String((cat as { _id: unknown })._id);
			}
			return String(cat);
		});

		if (categoryIds.length === 0) {
			return [];
		}

		const posts = await blogPostService.getRelatedPosts(
			currentPostId,
			categoryIds,
			limit
		);
		return posts.map(convertToArticle);
	} catch (error) {
		console.error("Failed to fetch related articles:", error);
		return [];
	}
}

/**
 * Get articles by author ID
 */
export async function getArticlesByAuthorId(
	authorId: string
): Promise<Article[]> {
	try {
		const result = await blogPostService.getPostsByAuthor(authorId, {
			page: 1,
			limit: 100,
		});
		return result.data.map(convertToArticle);
	} catch (error) {
		console.error("Failed to fetch articles by author:", error);
		return [];
	}
}
