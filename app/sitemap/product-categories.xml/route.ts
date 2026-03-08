/**
 * Product Categories Sitemap
 *
 * Generates sitemap for all product categories.
 * URL Pattern: /products/category/[slug]/
 *
 * Matches WordPress: product_category-sitemap.xml
 */

import { NextResponse } from "next/server";
import { categoryRepository } from "@/lib/repositories/category.repository";
import {
	generateSitemapXml,
	buildProductCategoryUrl,
	formatSitemapDate,
	SITEMAP_CONFIG,
	type SitemapUrl,
} from "../sitemap.config";

// ISR: Revalidate every hour
export const revalidate = 3600;

/**
 * Product categories from the WordPress site
 * These are the exact categories from product_category-sitemap.xml
 */
const PRODUCT_CATEGORIES = [
	{ name: "Hårborttagning", slug: "harborttagning" },
	{ name: "Tatueringsborttagning", slug: "tatueringsborttagning" },
	{ name: "Hudföryngring", slug: "hudforyngring" },
	{ name: "CO2 Laser", slug: "co2laser" },
	{ name: "Kropp, muskler & fett", slug: "kropp-muskler-fett" },
	{ name: "Ansiktsbehandlingar", slug: "ansiktsbehandlingar" },
	{ name: "Pigmentfläckar", slug: "pigmentflackar" },
	{ name: "Akne", slug: "akne" },
	{ name: "Ytliga blodkärl & angiom", slug: "ytliga-blodkarl-angiom" },
	{ name: "Kirurgisk utrustning", slug: "kirurgisk-utrustning" },
];

export async function GET(): Promise<NextResponse> {
	try {
		const urls: SitemapUrl[] = [];

		// First, try to get categories from database
		try {
			const dbCategories = await categoryRepository.findActiveCategories();

			if (dbCategories.length > 0) {
				// Use database categories
				for (const category of dbCategories) {
					urls.push({
						loc: buildProductCategoryUrl(category.slug),
						lastmod: formatSitemapDate(category.updatedAt),
						changefreq: SITEMAP_CONFIG.changeFreq.category,
						priority: SITEMAP_CONFIG.priority.productCategory,
						images: category.image
							? [
									{
										loc: category.image.startsWith("http")
											? category.image
											: `${SITEMAP_CONFIG.baseUrl}${category.image}`,
										title: category.name,
									},
								]
							: undefined,
					});
				}
			}
		} catch (dbError) {
			console.warn("[Sitemap] Could not fetch categories from DB, using fallback:", dbError);
		}

		// If no database categories, use predefined list
		if (urls.length === 0) {
			const now = formatSitemapDate(new Date());

			for (const category of PRODUCT_CATEGORIES) {
				urls.push({
					loc: buildProductCategoryUrl(category.slug),
					lastmod: now,
					changefreq: SITEMAP_CONFIG.changeFreq.category,
					priority: SITEMAP_CONFIG.priority.productCategory,
				});
			}
		}

		const xml = generateSitemapXml(urls);

		return new NextResponse(xml, {
			status: 200,
			headers: {
				"Content-Type": "application/xml",
				"Cache-Control": "public, max-age=3600, s-maxage=3600",
			},
		});
	} catch (error) {
		console.error("[Sitemap] Error generating product categories sitemap:", error);
		return new NextResponse("Error generating sitemap", { status: 500 });
	}
}
