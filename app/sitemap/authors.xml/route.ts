/**
 * Authors Sitemap
 *
 * Generates sitemap for all news/blog authors.
 * URL Pattern: /nyheter/author/[slug]/
 */

import { NextResponse } from "next/server";
import { blogArticles } from "@/data/blog/blog-data";
import {
	generateSitemapXml,
	buildAuthorUrl,
	formatSitemapDate,
	SITEMAP_CONFIG,
	type SitemapUrl,
} from "../sitemap.config";

// ISR: Revalidate every hour
export const revalidate = 3600;

/**
 * Authors from the WordPress site
 * These are the exact authors from author-sitemap.xml
 */
const AUTHORS = [
	{ name: "Agnes", slug: "agnessynos-se" },
	{ name: "Andreas", slug: "andreassynos-se" },
];

/**
 * Create author slug from name (matching WordPress format)
 */
function createAuthorSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[åä]/g, "a")
		.replace(/ö/g, "o")
		.replace(/@/g, "")
		.replace(/\./g, "-")
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

export async function GET(): Promise<NextResponse> {
	try {
		// Use predefined authors + extract any additional from blog data
		const authorMap = new Map<string, string>();

		// Add predefined authors
		AUTHORS.forEach((author) => {
			authorMap.set(author.slug, author.name);
		});

		// Also extract authors from actual blog articles
		blogArticles.forEach((article) => {
			if (article.author?.name) {
				const slug = createAuthorSlug(article.author.name);
				if (slug && !authorMap.has(slug)) {
					authorMap.set(slug, article.author.name);
				}
			}
		});

		// Build author URL list
		const urls: SitemapUrl[] = Array.from(authorMap.entries()).map(
			([slug]) => ({
				loc: buildAuthorUrl(slug),
				lastmod: formatSitemapDate(new Date()),
				changefreq: SITEMAP_CONFIG.changeFreq.author,
				priority: SITEMAP_CONFIG.priority.author,
			})
		);

		const xml = generateSitemapXml(urls);

		return new NextResponse(xml, {
			status: 200,
			headers: {
				"Content-Type": "application/xml",
				"Cache-Control": "public, max-age=3600, s-maxage=3600",
			},
		});
	} catch (error) {
		console.error("[Sitemap] Error generating authors sitemap:", error);
		return new NextResponse("Error generating sitemap", { status: 500 });
	}
}
