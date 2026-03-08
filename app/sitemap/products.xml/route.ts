/**
 * Products Sitemap
 *
 * Generates sitemap for all published products.
 * URL Pattern: /products/[category]/[slug]/
 *
 * Matches WordPress: product-sitemap.xml
 */

import { NextResponse } from "next/server";
import { productRepository } from "@/lib/repositories/product.repository";
import {
	generateSitemapXml,
	buildProductUrl,
	formatSitemapDate,
	SITEMAP_CONFIG,
	type SitemapUrl,
} from "../sitemap.config";

// ISR: Revalidate every hour
export const revalidate = 3600;

export async function GET(): Promise<NextResponse> {
	try {
		// Fetch all published products with populated categories
		const { data: products } = await productRepository.findPublished({
			limit: 1000,
		});

		const urls: SitemapUrl[] = [];

		// Add main products listing page (at /products/)
		urls.push({
			loc: `${SITEMAP_CONFIG.baseUrl}/products`,
			lastmod: formatSitemapDate(new Date()),
			changefreq: SITEMAP_CONFIG.changeFreq.listing,
			priority: SITEMAP_CONFIG.priority.mainListing,
		});

		// Add each product
		for (const product of products) {
			// Get the first category slug for the URL
			// Products are populated with categories having {name, slug}
			let categorySlug = "uncategorized";

			if (product.categories && product.categories.length > 0) {
				const firstCategory = product.categories[0] as unknown as {
					name: string;
					slug: string;
				};
				if (firstCategory?.slug) {
					categorySlug = firstCategory.slug;
				}
			}

			// Build images array from product images
			const images = product.productImages
				?.filter((img) => img && img.trim())
				.map((img) => ({
					loc: img.startsWith("http") ? img : `${SITEMAP_CONFIG.baseUrl}${img}`,
					title: product.title,
				}));

			urls.push({
				loc: buildProductUrl(categorySlug, product.slug),
				lastmod: formatSitemapDate(product.updatedAt || product.createdAt),
				changefreq: SITEMAP_CONFIG.changeFreq.product,
				priority: SITEMAP_CONFIG.priority.product,
				images: images && images.length > 0 ? images : undefined,
			});
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
		console.error("[Sitemap] Error generating products sitemap:", error);
		return new NextResponse("Error generating sitemap", { status: 500 });
	}
}
