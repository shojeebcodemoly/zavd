import { NextResponse } from "next/server";
import { categoryRepository } from "@/lib/repositories/category.repository";
import { productRepository } from "@/lib/repositories/product.repository";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

export interface NavProduct {
	_id: string;
	title: string;
	slug: string;
	primaryCategorySlug: string | null;
}

export interface NavCategory {
	_id: string;
	name: string;
	slug: string;
	products: NavProduct[];
}

export interface NavigationData {
	categories: NavCategory[];
}

/**
 * GET /api/navigation
 * Get navigation data for the navbar (categories with their products)
 * This endpoint is optimized for the navbar dropdown menu
 */
export async function GET() {
	try {
		// Fetch active categories
		const categories = await categoryRepository.findActiveCategories();

		// Fetch all published products with their categories populated
		const { data: products } = await productRepository.findPublished({
			limit: 200,
		});

		// Helper to get category ID from populated or non-populated reference
		const getCategoryId = (cat: unknown): string | null => {
			if (!cat) return null;
			if (typeof cat === "string") return cat;
			if (typeof cat === "object" && cat !== null) {
				if ("_id" in cat) {
					const id = (cat as { _id: unknown })._id;
					if (typeof id === "string") return id;
					if (typeof id === "object" && id !== null && "toString" in id) {
						return (id as { toString(): string }).toString();
					}
				}
				if ("toString" in cat) {
					return (cat as { toString(): string }).toString();
				}
			}
			return null;
		};

		// Helper to get category slug from populated reference
		const getCategorySlug = (cat: unknown): string | null => {
			if (!cat) return null;
			if (typeof cat === "object" && cat !== null && "slug" in cat) {
				return (cat as { slug: string }).slug;
			}
			return null;
		};

		// Build navigation structure
		const navCategories: NavCategory[] = categories.map((category) => {
			// Find products that belong to this category
			const categoryProducts = products.filter((product) => {
				if (!product.categories || product.categories.length === 0)
					return false;

				// Check if product belongs to this category
				return product.categories.some((cat) => {
					const catId = getCategoryId(cat);
					return catId === category._id.toString();
				});
			});

			// Map products to nav format
			const navProducts: NavProduct[] = categoryProducts.map((product) => {
				// Determine primary category slug for URL
				let primaryCategorySlug: string | null = null;

				// Check if product has primaryCategory
				const primaryCatSlug = getCategorySlug(product.primaryCategory);
				if (primaryCatSlug) {
					primaryCategorySlug = primaryCatSlug;
				} else if (product.categories && product.categories.length > 0) {
					// Fall back to first category
					const firstCatSlug = getCategorySlug(product.categories[0]);
					if (firstCatSlug) {
						primaryCategorySlug = firstCatSlug;
					}
				}

				// If still null, use current category as fallback
				if (!primaryCategorySlug) {
					primaryCategorySlug = category.slug;
				}

				return {
					_id: product._id.toString(),
					title: product.title,
					slug: product.slug,
					primaryCategorySlug,
				};
			});

			return {
				_id: category._id.toString(),
				name: category.name,
				slug: category.slug,
				products: navProducts,
			};
		});

		// Filter out categories with no products
		const filteredCategories = navCategories.filter(
			(cat) => cat.products.length > 0
		);

		const navigationData: NavigationData = {
			categories: filteredCategories,
		};

		// Set cache headers for performance (cache for 5 minutes)
		const response = successResponse(
			navigationData,
			"Navigation data retrieved successfully"
		);

		response.headers.set(
			"Cache-Control",
			"public, s-maxage=300, stale-while-revalidate=600"
		);

		return response;
	} catch (error: unknown) {
		logger.error("Error fetching navigation data", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch navigation data";
		return internalServerErrorResponse(message);
	}
}
