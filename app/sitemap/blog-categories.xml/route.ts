/**
 * Blog/News Categories Sitemap
 *
 * Generates sitemap for all news/blog categories.
 * URL Pattern: /nyheter/category/[slug]/
 */

import { NextResponse } from "next/server";
import { blogArticles } from "@/data/blog/blog-data";
import {
	generateSitemapXml,
	buildBlogCategoryUrl,
	formatSitemapDate,
	createSlug,
	SITEMAP_CONFIG,
	type SitemapUrl,
} from "../sitemap.config";

// ISR: Revalidate every hour
export const revalidate = 3600;

/**
 * Blog categories from the WordPress site
 * These are the exact categories from category-sitemap.xml
 */
const BLOG_CATEGORIES = [
	{ name: "Artikelserier", slug: "artikelserier" },
	{ name: "Behandlingar", slug: "behandlingar" },
	{ name: "Eftervård", slug: "eftervard" },
	{ name: "Gynekologi", slug: "gynekologi" },
	{ name: "Hårborttagning", slug: "harborttagning" },
	{ name: "Hudåtstramning", slug: "hudatstramning" },
	{ name: "Hudföryngring", slug: "hudforyngring" },
	{ name: "Inkontinens", slug: "inkontinens" },
	{ name: "Klinikutrustning", slug: "klinikutrustning" },
	{ name: "Muskelatstramning", slug: "muskelatstramning" },
	{ name: "Nyheter", slug: "nyheter" },
	{ name: "Okategoriserade", slug: "okategoriserade" },
	{ name: "Produkter", slug: "produkter" },
	{ name: "Tatueringsborttagning", slug: "tatueringsborttagning" },
];

export async function GET(): Promise<NextResponse> {
	try {
		// Use predefined categories + extract any additional from blog data
		const categorySet = new Set<string>(BLOG_CATEGORIES.map((c) => c.slug));

		// Also extract categories from actual blog articles
		blogArticles.forEach((article) => {
			article.categories.forEach((cat) => {
				const slug = createSlug(cat);
				categorySet.add(slug);
			});
		});

		// Build category URL list
		const urls: SitemapUrl[] = Array.from(categorySet).map((slug) => ({
			loc: buildBlogCategoryUrl(slug),
			lastmod: formatSitemapDate(new Date()),
			changefreq: SITEMAP_CONFIG.changeFreq.category,
			priority: SITEMAP_CONFIG.priority.blogCategory,
		}));

		const xml = generateSitemapXml(urls);

		return new NextResponse(xml, {
			status: 200,
			headers: {
				"Content-Type": "application/xml",
				"Cache-Control": "public, max-age=3600, s-maxage=3600",
			},
		});
	} catch (error) {
		console.error("[Sitemap] Error generating blog categories sitemap:", error);
		return new NextResponse("Error generating sitemap", { status: 500 });
	}
}
