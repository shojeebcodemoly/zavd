/**
 * Robots.txt Generator
 *
 * Generates a dynamic robots.txt file following SEO best practices.
 * This file controls how search engine crawlers interact with the site.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = getSiteUrl();

	return {
		rules: [
			{
				// Main crawlers (Google, Bing, etc.)
				userAgent: "*",
				allow: "/",
				disallow: [
					// Admin and dashboard areas
					"/dashboard/",
					"/admin/",
					// API endpoints (not for crawling)
					"/api/",
					// Authentication pages
					"/auth/",
					"/login/",
					"/register/",
					"/forgot-password/",
					"/reset-password/",
					// Search results (to prevent duplicate content)
					"/search?",
					// Query parameters that create duplicate content
					"/*?*sort=",
					"/*?*page=",
					"/*?*filter=",
					// Preview and draft content
					"/preview/",
					"/draft/",
					// User-specific pages
					"/profile/",
					"/settings/",
					// Internal pages
					"/_next/",
					"/_vercel/",
					// Temporary files
					"*.json$",
				],
			},
			{
				// Block aggressive crawlers
				userAgent: "AhrefsBot",
				crawlDelay: 10,
				allow: "/",
			},
			{
				userAgent: "SemrushBot",
				crawlDelay: 10,
				allow: "/",
			},
		],
		// Point to the dynamic sitemap
		sitemap: `${baseUrl}/sitemap.xml`,
		// Optional: Add host directive for older crawlers
		host: baseUrl,
	};
}
