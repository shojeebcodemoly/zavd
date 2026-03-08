import { unstable_cache } from "next/cache";
import { productRepository } from "@/lib/repositories/product.repository";
import { categoryRepository } from "@/lib/repositories/category.repository";
import type { IProduct } from "@/models/product.model";
import type { ICategory } from "@/models/category.model";

/**
 * Cache tags for products and categories
 * Use these to revalidate when content changes
 */
export const PRODUCTS_CACHE_TAG = "products";
export const CATEGORIES_CACHE_TAG = "categories";

// 24 hours in seconds
const CACHE_REVALIDATE = 86400;

/**
 * Get published products with ISR caching (24 hours)
 * For use on /produkter and /kategori pages
 */
export const getPublishedProducts = unstable_cache(
	async (options?: {
		limit?: number;
		sort?: string;
	}): Promise<IProduct[]> => {
		const { data } = await productRepository.findPublished({
			limit: options?.limit ?? 100,
			sort: options?.sort,
		});
		return data;
	},
	["published-products"],
	{
		tags: [PRODUCTS_CACHE_TAG],
		revalidate: CACHE_REVALIDATE,
	}
);

/**
 * Get published products sorted by newest first
 * For /produkter page
 */
export const getNewestProducts = unstable_cache(
	async (limit: number = 100): Promise<IProduct[]> => {
		const { data } = await productRepository.findPublished({
			limit,
			sort: "-createdAt",
		});
		return data;
	},
	["newest-products"],
	{
		tags: [PRODUCTS_CACHE_TAG],
		revalidate: CACHE_REVALIDATE,
	}
);

/**
 * Get active categories with ISR caching (24 hours)
 * For use on sidebar filters
 */
export const getActiveCategories = unstable_cache(
	async (): Promise<ICategory[]> => {
		return categoryRepository.findActiveCategories();
	},
	["active-categories"],
	{
		tags: [CATEGORIES_CACHE_TAG],
		revalidate: CACHE_REVALIDATE,
	}
);

/**
 * Get products by category with ISR caching (24 hours)
 */
export const getProductsByCategory = unstable_cache(
	async (
		categoryId: string,
		limit: number = 100
	): Promise<IProduct[]> => {
		const { data } = await productRepository.findByCategory(categoryId, {
			limit,
			publishedOnly: true,
		});
		return data;
	},
	["products-by-category"],
	{
		tags: [PRODUCTS_CACHE_TAG, CATEGORIES_CACHE_TAG],
		revalidate: CACHE_REVALIDATE,
	}
);

/**
 * Get category by slug with ISR caching (24 hours)
 */
export const getCategoryBySlug = unstable_cache(
	async (slug: string): Promise<ICategory | null> => {
		return categoryRepository.findBySlug(slug);
	},
	["category-by-slug"],
	{
		tags: [CATEGORIES_CACHE_TAG],
		revalidate: CACHE_REVALIDATE,
	}
);
