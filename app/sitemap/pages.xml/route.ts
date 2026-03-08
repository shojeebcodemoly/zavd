/**
 * Static Pages Sitemap
 *
 * Generates sitemap for all static pages.
 * Matches WordPress: page-sitemap.xml
 */

import { NextResponse } from "next/server";
import {
	generateSitemapXml,
	formatSitemapDate,
	SITEMAP_CONFIG,
	type SitemapUrl,
} from "../sitemap.config";

// ISR: Revalidate every hour
export const revalidate = 3600;

export async function GET(): Promise<NextResponse> {
	try {
		const now = formatSitemapDate(new Date());

		const urls: SitemapUrl[] = [
			// Homepage
			{
				loc: SITEMAP_CONFIG.baseUrl,
				lastmod: now,
				changefreq: SITEMAP_CONFIG.changeFreq.homepage,
				priority: SITEMAP_CONFIG.priority.homepage,
			},
			// Contact
			{
				loc: `${SITEMAP_CONFIG.baseUrl}/kontakt`,
				lastmod: now,
				changefreq: SITEMAP_CONFIG.changeFreq.category,
				priority: SITEMAP_CONFIG.priority.important,
			},
			// About us
			{
				loc: `${SITEMAP_CONFIG.baseUrl}/om-oss`,
				lastmod: now,
				changefreq: SITEMAP_CONFIG.changeFreq.category,
				priority: SITEMAP_CONFIG.priority.important,
			},
			// FAQ
			{
				loc: `${SITEMAP_CONFIG.baseUrl}/faq`,
				lastmod: now,
				changefreq: SITEMAP_CONFIG.changeFreq.category,
				priority: SITEMAP_CONFIG.priority.category,
			},
			// Privacy policy
			{
				loc: `${SITEMAP_CONFIG.baseUrl}/integritetspolicy`,
				lastmod: now,
				changefreq: SITEMAP_CONFIG.changeFreq.legal,
				priority: SITEMAP_CONFIG.priority.legal,
			},
		];

		const xml = generateSitemapXml(urls);

		return new NextResponse(xml, {
			status: 200,
			headers: {
				"Content-Type": "application/xml",
				"Cache-Control": "public, max-age=3600, s-maxage=3600",
			},
		});
	} catch (error) {
		console.error("[Sitemap] Error generating pages sitemap:", error);
		return new NextResponse("Error generating sitemap", { status: 500 });
	}
}
