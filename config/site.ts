/**
 * Site Configuration - Database-Driven
 *
 * All site configuration is now fetched from the database.
 * This file provides type definitions and helper functions for
 * backwards compatibility with existing code.
 */

import { getLegacySiteConfig } from "@/lib/services/site-settings.service";

// Type for company address (legacy format)
export interface CompanyAddress {
	name: string;
	street: string;
	postalCode: string;
	city: string;
	country: string;
	lat: number;
	lng: number;
}

// Site config type definition (legacy format)
export interface SiteConfigType {
	name: string;
	description: string;
	url: string;
	ogImage: string;
	links: {
		facebook?: string;
		instagram?: string;
		linkedin?: string;
		twitter?: string;
		youtube?: string;
	};
	company: {
		name: string;
		orgNumber: string;
		email: string;
		phone: string;
		noreplyEmail: string;
		addresses: CompanyAddress[];
	};
}

/**
 * Get site URL - the only value that still comes from environment
 * This is required for Next.js auth and absolute URLs
 */
export function getSiteUrl(): string {
	const url =
		process.env.SITE_URL ||
		process.env.BETTER_AUTH_URL ||
		"http://localhost:3000";

	// Remove trailing slash if present
	return url.replace(/\/$/, "");
}

/**
 * Get site configuration from database
 * This is the primary way to fetch site config - all values come from DB
 */
export async function getSiteConfig(): Promise<SiteConfigType> {
	const config = await getLegacySiteConfig();

	return {
		name: config.name,
		description: config.description,
		url: getSiteUrl(),
		ogImage: config.ogImage.startsWith("http")
			? config.ogImage
			: `${getSiteUrl()}${config.ogImage.startsWith("/") ? "" : "/"}${config.ogImage}`,
		links: config.links,
		company: {
			name: config.company.name,
			orgNumber: config.company.orgNumber,
			email: config.company.email,
			phone: config.company.phone,
			noreplyEmail: config.company.noreplyEmail,
			addresses: config.company.addresses,
		},
	};
}

/**
 * @deprecated Use getSiteConfig() instead
 * This synchronous export is kept for backwards compatibility during migration
 * but will eventually be removed. All new code should use getSiteConfig().
 */
export const siteConfig: SiteConfigType = {
	// Fallback values - these will be overwritten at runtime by database values
	name: "Your Company",
	description: "Your company description goes here.",
	url: getSiteUrl(),
	ogImage: `${getSiteUrl()}/og-image.jpg`,
	links: {
		facebook: "",
		instagram: "",
		linkedin: "",
	},
	company: {
		name: "Your Company AB",
		orgNumber: "000000-0000",
		email: "info@example.com",
		phone: "000-000 00 00",
		noreplyEmail: "noreply@example.com",
		addresses: [
			{
				name: "Main Office",
				street: "Street Address",
				postalCode: "00000",
				city: "City",
				country: "Sverige",
				lat: 0,
				lng: 0,
			},
		],
	},
};

// Legacy type exports for backwards compatibility
export type SiteConfig = SiteConfigType;
export type CompanyAddressType = CompanyAddress;
