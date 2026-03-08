/**
 * Blog/News Tags Sitemap
 *
 * Generates sitemap for all news/blog tags.
 * URL Pattern: /nyheter/tag/[slug]/
 */

import { NextResponse } from "next/server";
import { blogArticles } from "@/data/blog/blog-data";
import {
	generateSitemapXml,
	buildBlogTagUrl,
	formatSitemapDate,
	createSlug,
	SITEMAP_CONFIG,
	type SitemapUrl,
} from "../sitemap.config";

// ISR: Revalidate every hour
export const revalidate = 3600;

/**
 * Blog tags from the WordPress site
 * These are the exact tags from post_tag-sitemap.xml
 */
const BLOG_TAGS = [
	{ name: "Före och efter bilder", slug: "fore-och-efter-bilder" },
	{ name: "Again Pro", slug: "again-pro" },
	{ name: "Akneärr", slug: "aknearr" },
	{ name: "CO2 laser", slug: "co2-laser" },
	{ name: "CoolPeel", slug: "coolpeel" },
	{ name: "DuoGlide", slug: "duoglide" },
	{ name: "Eftervård", slug: "eftervard" },
	{ name: "Födelsemärken", slug: "fodelsemarken" },
	{ name: "Frågor och svar", slug: "fragor-och-svar" },
	{ name: "Fräknar", slug: "fraknar" },
	{ name: "Hudvård", slug: "hudvard" },
	{ name: "Koldioxidlaser", slug: "koldioxidlaser" },
	{ name: "Kosmetiska tatueringar", slug: "kosmetiska-tatueringar" },
	{ name: "Leverfläckar", slug: "leverflackar" },
	{ name: "Luxea", slug: "luxea" },
	{ name: "Motus AX", slug: "motus-ax" },
	{ name: "Motus AY", slug: "motus-ay" },
	{ name: "Moveo", slug: "moveo" },
	{ name: "Nd:YAG", slug: "ndyag" },
	{ name: "Picolaser", slug: "picolaser" },
	{ name: "Pigment", slug: "pigment" },
	{ name: "Punto", slug: "punto" },
	{ name: "Q-switching", slug: "q-switching" },
	{ name: "Q-Terra", slug: "q-terra" },
	{ name: "Q-Terra Q10", slug: "q-terra-q10" },
	{ name: "Rynkor", slug: "rynkor" },
	{ name: "SmartPico", slug: "smartpico" },
	{ name: "Tatueringar", slug: "tatueringar" },
	{ name: "Tatueringsborttagning", slug: "tatueringsborttagning" },
	{ name: "Vårtor", slug: "vartor" },
	{ name: "Vinterhud", slug: "vinterhud" },
	{ name: "Vintertorr hud", slug: "vintertorrhud" },
];

export async function GET(): Promise<NextResponse> {
	try {
		// Use predefined tags + extract any additional from blog data
		const tagSet = new Set<string>(BLOG_TAGS.map((t) => t.slug));

		// Also extract tags from actual blog articles
		blogArticles.forEach((article) => {
			article.tags.forEach((tag) => {
				const slug = createSlug(tag);
				if (slug) {
					tagSet.add(slug);
				}
			});
		});

		// Build tag URL list
		const urls: SitemapUrl[] = Array.from(tagSet).map((slug) => ({
			loc: buildBlogTagUrl(slug),
			lastmod: formatSitemapDate(new Date()),
			changefreq: SITEMAP_CONFIG.changeFreq.tag,
			priority: SITEMAP_CONFIG.priority.tag,
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
		console.error("[Sitemap] Error generating blog tags sitemap:", error);
		return new NextResponse("Error generating sitemap", { status: 500 });
	}
}
