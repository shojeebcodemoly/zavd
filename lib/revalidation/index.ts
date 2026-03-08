/**
 * Cache Tags and Revalidation Constants
 *
 * Centralized configuration for ISR cache tags and revalidation paths.
 * Used for on-demand revalidation when content is created/updated/deleted.
 */

// Cache tags for granular revalidation
export const CACHE_TAGS = {
	// Products
	PRODUCTS: "products",
	PRODUCT: (slug: string) => `product-${slug}`,

	// Categories
	CATEGORIES: "categories",
	CATEGORY: (slug: string) => `category-${slug}`,

	// Blog posts
	BLOG_POSTS: "blog-posts",
	BLOG_POST: (slug: string) => `blog-post-${slug}`,

	// Blog categories and tags
	BLOG_CATEGORIES: "blog-categories",
	BLOG_CATEGORY: (slug: string) => `blog-category-${slug}`,
	BLOG_TAGS: "blog-tags",

	// Authors
	AUTHORS: "authors",
	AUTHOR: (id: string) => `author-${id}`,

	// Static Pages
	HOME_PAGE: "home-page",
	ABOUT_PAGE: "about-page",
	TEAM_PAGE: "team-page",
	LEGAL_PAGE: "legal-page",
	PRIVACY_PAGE: "privacy-page",
	FAQ_PAGE: "faq-page",
	CONTACT_PAGE: "contact-page",
	STORE_PAGE: "store-page",
	CAREERS_PAGE: "careers-page",
	TRAINING_PAGE: "training-page",
	STARTA_EGET_PAGE: "starta-eget-page",
	VARFOR_VALJA_SYNOS_PAGE: "varfor-valja-synos-page",
	KOPGUIDE_PAGE: "kopguide-page",
	MINIUTBILDNING_PAGE: "miniutbildning-page",
	RESELLER_PAGE: "reseller-page",
	QUALITY_PAGE: "quality-page",

	// Sitemaps
	SITEMAPS: "sitemaps",

	// Site Settings (global settings affecting layout)
	SITE_SETTINGS: "site-settings",
} as const;

// Revalidation paths
export const PATHS = {
	HOME: "/",
	PRODUCTS: "/produkter",
	PRODUCTS_EN: "/products",
	PRODUCTS_CATEGORY: "/products/category",
	KATEGORI: "/kategori",
	KLINIKUTRUSTNING: "/klinikutrustning",
	BLOG: "/blogg",
	BLOG_EN: "/blog",
	NEWS: "/nyheter",
	// Static pages
	ABOUT: "/om-oss",
	ABOUT_US: "/about-us",
	TEAM: "/om-oss/team",
	LEGAL: "/om-oss/juridisk-information",
	PRIVACY: "/integritetspolicy",
	FAQ: "/faq",
	CONTACT: "/kontakt",
	STORE: "/butik-i-boxholm",
	CAREERS: "/karriar",
	TRAINING: "/utbildning",
	STARTA_EGET: "/starta-eget",
	VARFOR_VALJA_SYNOS: "/starta-eget/varfor-valja-synos",
	KOPGUIDE: "/starta-eget/kopguide",
	MINIUTBILDNING: "/starta-eget/miniutbildning",
	RESELLER: "/aterforsaljare",
	QUALITY: "/quality",
} as const;

// Default revalidation time in seconds (24 hours)
export const DEFAULT_REVALIDATE = 86400;
