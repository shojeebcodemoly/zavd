/**
 * Blog/News Posts Sitemap
 *
 * Generates sitemap for all blog/news posts.
 * URL Pattern: /nyheter/[slug]/
 */

import { NextResponse } from "next/server";
import { blogArticles } from "@/data/blog/blog-data";
import {
	generateSitemapXml,
	buildBlogPostUrl,
	formatSitemapDate,
	SITEMAP_CONFIG,
	type SitemapUrl,
} from "../sitemap.config";

// ISR: Revalidate every hour
export const revalidate = 3600;

export async function GET(): Promise<NextResponse> {
	try {
		const urls: SitemapUrl[] = blogArticles.map((article) => ({
			loc: buildBlogPostUrl(article.slug),
			lastmod: formatSitemapDate(article.updatedAt || article.publishedAt),
			changefreq: SITEMAP_CONFIG.changeFreq.blogPost,
			priority: SITEMAP_CONFIG.priority.blogPost,
			images: article.featuredImage
				? [
						{
							loc: article.featuredImage.url.startsWith("http")
								? article.featuredImage.url
								: `${SITEMAP_CONFIG.baseUrl}${article.featuredImage.url}`,
							title: article.featuredImage.alt,
						},
					]
				: undefined,
		}));

		// Add news listing page
		urls.unshift({
			loc: `${SITEMAP_CONFIG.baseUrl}/nyheter`,
			lastmod: formatSitemapDate(new Date()),
			changefreq: SITEMAP_CONFIG.changeFreq.listing,
			priority: SITEMAP_CONFIG.priority.mainListing,
		});

		const xml = generateSitemapXml(urls);

		return new NextResponse(xml, {
			status: 200,
			headers: {
				"Content-Type": "application/xml",
				"Cache-Control": "public, max-age=3600, s-maxage=3600",
			},
		});
	} catch (error) {
		console.error("[Sitemap] Error generating posts sitemap:", error);
		return new NextResponse("Error generating sitemap", { status: 500 });
	}
}
