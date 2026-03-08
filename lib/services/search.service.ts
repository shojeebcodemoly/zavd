import { productRepository } from "@/lib/repositories/product.repository";
import { blogPostRepository } from "@/lib/repositories/blog-post.repository";
import { categoryRepository } from "@/lib/repositories/category.repository";
import { logger } from "@/lib/utils/logger";

export interface ProductSearchResult {
	_id: string;
	title: string;
	slug: string;
	shortDescription?: string;
	productImages: string[];
	primaryCategory?: {
		_id: string;
		name: string;
		slug: string;
	};
	categories: {
		_id: string;
		name: string;
		slug: string;
	}[];
}

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

export interface CategorySearchResult {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	productCount?: number;
}

export interface SearchResults {
	products: {
		data: ProductSearchResult[];
		total: number;
	};
	posts: {
		data: BlogPostSearchResult[];
		total: number;
	};
	categories: {
		data: CategorySearchResult[];
		total: number;
	};
	totalResults: number;
	query: string;
}

interface SearchOptions {
	query: string;
	page?: number;
	limit?: number;
	includeProducts?: boolean;
	includePosts?: boolean;
	includeCategories?: boolean;
}

class SearchService {
	/**
	 * Unified search across products, blog posts, and categories
	 */
	async search(options: SearchOptions): Promise<SearchResults> {
		const {
			query,
			page = 1,
			limit = 10,
			includeProducts = true,
			includePosts = true,
			includeCategories = true,
		} = options;

		const trimmedQuery = query.trim();

		if (!trimmedQuery || trimmedQuery.length < 2) {
			return {
				products: { data: [], total: 0 },
				posts: { data: [], total: 0 },
				categories: { data: [], total: 0 },
				totalResults: 0,
				query: trimmedQuery,
			};
		}

		try {
			const searchPromises: Promise<unknown>[] = [];

			// Search products
			if (includeProducts) {
				searchPromises.push(this.searchProducts(trimmedQuery, page, limit));
			} else {
				searchPromises.push(Promise.resolve({ data: [], total: 0 }));
			}

			// Search blog posts
			if (includePosts) {
				searchPromises.push(this.searchBlogPosts(trimmedQuery, page, limit));
			} else {
				searchPromises.push(Promise.resolve({ data: [], total: 0 }));
			}

			// Search categories
			if (includeCategories) {
				searchPromises.push(this.searchCategories(trimmedQuery, limit));
			} else {
				searchPromises.push(Promise.resolve({ data: [], total: 0 }));
			}

			const [productsResult, postsResult, categoriesResult] = await Promise.all(
				searchPromises
			);

			const products = productsResult as { data: ProductSearchResult[]; total: number };
			const posts = postsResult as { data: BlogPostSearchResult[]; total: number };
			const categories = categoriesResult as { data: CategorySearchResult[]; total: number };

			const totalResults = products.total + posts.total + categories.total;

			return {
				products,
				posts,
				categories,
				totalResults,
				query: trimmedQuery,
			};
		} catch (error) {
			logger.error("Search error", error);
			throw new Error("Failed to perform search");
		}
	}

	/**
	 * Search products (published and public only)
	 */
	private async searchProducts(
		query: string,
		page: number,
		limit: number
	): Promise<{ data: ProductSearchResult[]; total: number }> {
		try {
			const result = await productRepository.findWithFilters({
				search: query,
				page,
				limit,
				publishType: "publish",
				visibility: "public",
				sort: "-publishedAt",
			});

			const data: ProductSearchResult[] = result.data.map((product) => ({
				_id: product._id.toString(),
				title: product.title,
				slug: product.slug,
				shortDescription: product.shortDescription,
				productImages: product.productImages || [],
				primaryCategory: product.primaryCategory
					? {
							_id: (product.primaryCategory as unknown as { _id: string; name: string; slug: string })._id?.toString() || "",
							name: (product.primaryCategory as unknown as { name: string }).name || "",
							slug: (product.primaryCategory as unknown as { slug: string }).slug || "",
						}
					: undefined,
				categories: (product.categories || []).map((cat) => ({
					_id: (cat as unknown as { _id: string })._id?.toString() || "",
					name: (cat as unknown as { name: string }).name || "",
					slug: (cat as unknown as { slug: string }).slug || "",
				})),
			}));

			return { data, total: result.total };
		} catch (error) {
			logger.error("Product search error", error);
			return { data: [], total: 0 };
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
	 * Search categories (active only)
	 */
	private async searchCategories(
		query: string,
		limit: number
	): Promise<{ data: CategorySearchResult[]; total: number }> {
		try {
			const categories = await categoryRepository.searchByName(query, limit);

			// Filter to only active categories
			const activeCategories = categories.filter((cat) => cat.isActive);

			const data: CategorySearchResult[] = activeCategories.map((cat) => ({
				_id: cat._id.toString(),
				name: cat.name,
				slug: cat.slug,
				description: cat.description,
			}));

			return { data, total: data.length };
		} catch (error) {
			logger.error("Category search error", error);
			return { data: [], total: 0 };
		}
	}

	/**
	 * Get popular search terms (can be extended later with analytics)
	 */
	getPopularSearchTerms(): string[] {
		return [
			"MOTUS PRO",
			"Soprano",
			"Hårborttagning",
			"Laserbehandling",
			"CO2 Laser",
		];
	}
}

export const searchService = new SearchService();
