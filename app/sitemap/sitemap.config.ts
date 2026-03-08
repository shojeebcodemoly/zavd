/**
 * Sitemap Configuration
 *
 * Central configuration for sitemap generation.
 * Defines URL patterns matching the site structure.
 *
 * URL Structure:
 * - News/Blog posts: /nyheter/[slug]/
 * - News categories: /nyheter/category/[slug]/
 * - News tags: /nyheter/tag/[slug]/
 * - News authors: /nyheter/author/[slug]/
 * - Products: /products/category/[category]/[slug]/
 * - Product categories: /products/category/[slug]/
 */

import { getSiteUrl } from "@/config/site";

// ============================================================================
// Configuration
// ============================================================================

// Get base URL synchronously from environment (SITE_URL is still in .env)
const baseUrl = getSiteUrl();

export const SITEMAP_CONFIG = {
	baseUrl,
	defaultChangeFreq: "weekly" as const,
	revalidate: 3600, // 1 hour ISR

	// Priority levels
	priority: {
		homepage: 1.0,
		mainListing: 0.9,
		important: 0.8,
		product: 0.8,
		blogPost: 0.7,
		category: 0.7,
		productCategory: 0.7,
		blogCategory: 0.6,
		tag: 0.5,
		author: 0.5,
		legal: 0.3,
	},

	// Change frequencies
	changeFreq: {
		homepage: "daily" as const,
		listing: "daily" as const,
		product: "weekly" as const,
		blogPost: "monthly" as const,
		category: "weekly" as const,
		tag: "monthly" as const,
		author: "monthly" as const,
		legal: "yearly" as const,
	},
} as const;

// ============================================================================
// URL Builders
// ============================================================================

/**
 * Build blog/news post URL
 * Pattern: /nyheter/[slug]/
 */
export function buildBlogPostUrl(slug: string): string {
	return `${SITEMAP_CONFIG.baseUrl}/nyheter/${slug}`;
}

/**
 * Build blog/news category URL
 * Pattern: /nyheter/category/[slug]/
 */
export function buildBlogCategoryUrl(slug: string): string {
	return `${SITEMAP_CONFIG.baseUrl}/nyheter/category/${slug}`;
}

/**
 * Build blog/news tag URL
 * Pattern: /nyheter/tag/[slug]/
 */
export function buildBlogTagUrl(slug: string): string {
	return `${SITEMAP_CONFIG.baseUrl}/nyheter/tag/${slug}`;
}

/**
 * Build author URL
 * Pattern: /nyheter/author/[slug]/
 */
export function buildAuthorUrl(slug: string): string {
	return `${SITEMAP_CONFIG.baseUrl}/nyheter/author/${slug}`;
}

/**
 * Build product URL
 * Pattern: /products/category/[category]/[slug]/
 */
export function buildProductUrl(
	categorySlug: string,
	productSlug: string
): string {
	return `${SITEMAP_CONFIG.baseUrl}/products/category/${categorySlug}/${productSlug}`;
}

/**
 * Build product category URL
 * Pattern: /products/category/[slug]/
 */
export function buildProductCategoryUrl(slug: string): string {
	return `${SITEMAP_CONFIG.baseUrl}/products/category/${slug}`;
}

// ============================================================================
// XML Generation Helpers
// ============================================================================

export type ChangeFrequency =
	| "always"
	| "hourly"
	| "daily"
	| "weekly"
	| "monthly"
	| "yearly"
	| "never";

export interface SitemapUrl {
	loc: string;
	lastmod?: string;
	changefreq?: ChangeFrequency;
	priority?: number;
	images?: {
		loc: string;
		title?: string;
		caption?: string;
	}[];
}

/**
 * Generate XML sitemap from URL entries
 */
export function generateSitemapXml(urls: SitemapUrl[]): string {
	const urlElements = urls
		.map((url) => {
			let xml = `  <url>\n    <loc>${escapeXml(url.loc)}</loc>`;

			if (url.lastmod) {
				xml += `\n    <lastmod>${url.lastmod}</lastmod>`;
			}

			if (url.changefreq) {
				xml += `\n    <changefreq>${url.changefreq}</changefreq>`;
			}

			if (url.priority !== undefined) {
				xml += `\n    <priority>${url.priority.toFixed(1)}</priority>`;
			}

			// Add image sitemap entries if present
			if (url.images && url.images.length > 0) {
				url.images.forEach((image) => {
					xml += `\n    <image:image>`;
					xml += `\n      <image:loc>${escapeXml(image.loc)}</image:loc>`;
					if (image.title) {
						xml += `\n      <image:title>${escapeXml(image.title)}</image:title>`;
					}
					if (image.caption) {
						xml += `\n      <image:caption>${escapeXml(image.caption)}</image:caption>`;
					}
					xml += `\n    </image:image>`;
				});
			}

			xml += `\n  </url>`;
			return xml;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`;
}

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

/**
 * Format date for sitemap (W3C Datetime format)
 */
export function formatSitemapDate(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toISOString().split("T")[0]; // YYYY-MM-DD format
}

/**
 * Create a slug from a string (Swedish-aware)
 */
export function createSlug(str: string): string {
	return str
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[åä]/g, "a")
		.replace(/ö/g, "o")
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}
