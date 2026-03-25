import { blogPostRepository } from "@/lib/repositories/blog-post.repository";
import { logger } from "@/lib/utils/logger";

export interface BlogPostSearchResult {
	_id: string;
	title: string;
	slug: string;
	excerpt: string;
	featuredImage?: {
		url: string;
		alt?: string;
	};
	publishedAt?: Date;
	categories: {
		_id: string;
		name: string;
		slug: string;
	}[];
}

export interface SearchResults {
	posts: {
		data: BlogPostSearchResult[];
		total: number;
	};
	totalResults: number;
	query: string;
}

interface SearchOptions {
	query: string;
	page?: number;
	limit?: number;
	includePosts?: boolean;
}

class SearchService {
	/**
	 * Unified search across blog posts
	 */
	async search(options: SearchOptions): Promise<SearchResults> {
		const {
			query,
			page = 1,
			limit = 10,
			includePosts = true,
		} = options;

		const trimmedQuery = query.trim();

		if (!trimmedQuery || trimmedQuery.length < 2) {
			return {
				posts: { data: [], total: 0 },
				totalResults: 0,
				query: trimmedQuery,
			};
		}

		try {
			let postsResult: { data: BlogPostSearchResult[]; total: number } = { data: [], total: 0 };

			if (includePosts) {
				postsResult = await this.searchBlogPosts(trimmedQuery, page, limit);
			}

			return {
				posts: postsResult,
				totalResults: postsResult.total,
				query: trimmedQuery,
			};
		} catch (error) {
			logger.error("Search error", error);
			throw new Error("Failed to perform search");
		}
	}

	/**
	 * Search blog posts (published only)
	 */
	private async searchBlogPosts(
		query: string,
		page: number,
		limit: number
	): Promise<{ data: BlogPostSearchResult[]; total: number }> {
		try {
			const result = await blogPostRepository.findWithFilters({
				search: query,
				page,
				limit,
				publishType: "publish",
				sort: "-publishedAt",
			});

			const data: BlogPostSearchResult[] = result.data.map((post) => ({
				_id: post._id.toString(),
				title: post.title,
				slug: post.slug,
				excerpt: post.excerpt || "",
				featuredImage: post.featuredImage
					? {
							url: post.featuredImage.url,
							alt: post.featuredImage.alt,
						}
					: undefined,
				publishedAt: post.publishedAt,
				categories: (post.categories || []).map((cat) => ({
					_id: (cat as unknown as { _id: string })._id?.toString() || "",
					name: (cat as unknown as { name: string }).name || "",
					slug: (cat as unknown as { slug: string }).slug || "",
				})),
			}));

			return { data, total: result.total };
		} catch (error) {
			logger.error("Blog post search error", error);
			return { data: [], total: 0 };
		}
	}

	/**
	 * Get popular search terms
	 */
	getPopularSearchTerms(): string[] {
		return [
			"ZAVD",
			"Projekte",
			"Spenden",
			"Beratung",
			"Integration",
		];
	}
}

export const searchService = new SearchService();
