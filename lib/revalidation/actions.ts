"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS, PATHS } from "./index";

/**
 * Revalidate product-related caches
 * Call this when a product is created, updated, published, unpublished, or deleted
 */
export async function revalidateProduct(
	slug: string,
	categorySlug?: string
): Promise<void> {
	// Revalidate product-specific tag (Next.js 16 requires second argument)
	revalidateTag(CACHE_TAGS.PRODUCT(slug));

	// Revalidate products list
	revalidateTag(CACHE_TAGS.PRODUCTS);

	// Revalidate product detail pages for the specific category
	if (categorySlug) {
		// New product detail page paths (English routes)
		revalidatePath(`${PATHS.PRODUCTS_CATEGORY}/${categorySlug}/${slug}`);
		revalidatePath(`${PATHS.PRODUCTS_CATEGORY}/${categorySlug}`);
		// Legacy paths (Swedish routes)
		revalidatePath(`${PATHS.KATEGORI}/${categorySlug}/${slug}`);
		revalidatePath(`${PATHS.KLINIKUTRUSTNING}/${categorySlug}/${slug}`);
		revalidatePath(`${PATHS.KATEGORI}/${categorySlug}`);
		revalidatePath(`${PATHS.KLINIKUTRUSTNING}/${categorySlug}`);
	}

	// Always revalidate uncategorized paths (product might have been moved)
	revalidatePath(`${PATHS.PRODUCTS_CATEGORY}/uncategorized/${slug}`);
	revalidatePath(`${PATHS.KATEGORI}/uncategorized/${slug}`);
	revalidatePath(`${PATHS.KLINIKUTRUSTNING}/uncategorized/${slug}`);

	// Revalidate the direct product page
	revalidatePath(`${PATHS.PRODUCTS}/produkt/${slug}`);

	// Revalidate listing pages
	revalidatePath(PATHS.PRODUCTS);
	revalidatePath(PATHS.PRODUCTS_EN);
	revalidatePath(PATHS.KATEGORI);
	revalidatePath(PATHS.KLINIKUTRUSTNING);

	// Revalidate sitemaps
	revalidateTag(CACHE_TAGS.SITEMAPS);
}

/**
 * Revalidate all products (use sparingly)
 * Call this when bulk operations are performed
 */
export async function revalidateAllProducts(): Promise<void> {
	revalidateTag(CACHE_TAGS.PRODUCTS);
	revalidatePath(PATHS.PRODUCTS);
	revalidatePath(PATHS.KATEGORI);
	revalidatePath(PATHS.KLINIKUTRUSTNING);
	revalidateTag(CACHE_TAGS.SITEMAPS);
}

/**
 * Revalidate category-related caches
 * Call this when a category is created, updated, or deleted
 */
export async function revalidateCategory(slug?: string): Promise<void> {
	if (slug) {
		revalidateTag(CACHE_TAGS.CATEGORY(slug));
		revalidatePath(`${PATHS.KATEGORI}/${slug}`);
		revalidatePath(`${PATHS.KLINIKUTRUSTNING}/${slug}`);
	}
	revalidateTag(CACHE_TAGS.CATEGORIES);
	revalidatePath(PATHS.KATEGORI);
	revalidatePath(PATHS.KLINIKUTRUSTNING);
	revalidateTag(CACHE_TAGS.SITEMAPS);
}

/**
 * Revalidate blog post-related caches
 * Call this when a blog post is created, updated, published, or deleted
 */
export async function revalidateBlogPost(slug: string): Promise<void> {
	// Revalidate post-specific tag
	revalidateTag(CACHE_TAGS.BLOG_POST(slug));

	// Revalidate blog posts list
	revalidateTag(CACHE_TAGS.BLOG_POSTS);

	// Revalidate blog detail pages (all blog routes use same content)
	revalidatePath(`${PATHS.BLOG}/${slug}`);
	revalidatePath(`${PATHS.BLOG_EN}/${slug}`);
	revalidatePath(`${PATHS.NEWS}/${slug}`);

	// Revalidate listing pages
	revalidatePath(PATHS.BLOG);
	revalidatePath(PATHS.BLOG_EN);
	revalidatePath(PATHS.NEWS);

	// Revalidate sitemaps
	revalidateTag(CACHE_TAGS.SITEMAPS);
}

/**
 * Revalidate all blog posts (use sparingly)
 * Call this when bulk operations are performed
 */
export async function revalidateAllBlogPosts(): Promise<void> {
	revalidateTag(CACHE_TAGS.BLOG_POSTS);
	revalidatePath(PATHS.BLOG);
	revalidatePath(PATHS.BLOG_EN);
	revalidatePath(PATHS.NEWS);
	revalidateTag(CACHE_TAGS.SITEMAPS);
}

/**
 * Revalidate blog category-related caches
 * Call this when a blog category is created, updated, or deleted
 */
export async function revalidateBlogCategory(slug: string): Promise<void> {
	revalidateTag(CACHE_TAGS.BLOG_CATEGORY(slug));
	revalidateTag(CACHE_TAGS.BLOG_CATEGORIES);
	revalidatePath(`${PATHS.BLOG}/category/${slug}`);
	revalidatePath(`${PATHS.BLOG_EN}/category/${slug}`);
	revalidatePath(`${PATHS.NEWS}/category/${slug}`);
	revalidatePath(PATHS.BLOG);
	revalidatePath(PATHS.BLOG_EN);
	revalidatePath(PATHS.NEWS);
	revalidateTag(CACHE_TAGS.SITEMAPS);
}

/**
 * Revalidate blog tags
 * Call this when posts with tags are created/updated/deleted
 */
export async function revalidateBlogTags(): Promise<void> {
	revalidateTag(CACHE_TAGS.BLOG_TAGS);
	revalidateTag(CACHE_TAGS.SITEMAPS);
}

/**
 * Revalidate author-related caches
 * Call this when author info changes or posts by author change
 */
export async function revalidateAuthor(authorId: string): Promise<void> {
	revalidateTag(CACHE_TAGS.AUTHOR(authorId));
	revalidateTag(CACHE_TAGS.AUTHORS);
	revalidatePath(`${PATHS.BLOG}/author/${authorId}`);
	revalidatePath(`${PATHS.NEWS}/author/${authorId}`);
}

/**
 * Revalidate homepage
 * Call this when homepage content is updated
 */
export async function revalidateHomePage(): Promise<void> {
	revalidateTag(CACHE_TAGS.HOME_PAGE);
	revalidatePath(PATHS.HOME);
}

/**
 * Revalidate sitemaps
 * Call this when any content that affects sitemaps changes
 */
export async function revalidateSitemaps(): Promise<void> {
	revalidateTag(CACHE_TAGS.SITEMAPS);
}

// ============ Static Page Revalidation Functions ============

/**
 * Revalidate about page
 * Call this when about page content is updated
 */
export async function revalidateAboutPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.ABOUT_PAGE);
	revalidatePath(PATHS.ABOUT);
	revalidatePath(PATHS.ABOUT_US);
	// Also revalidate with locale prefixes
	revalidatePath(`/en${PATHS.ABOUT}`);
	revalidatePath(`/sv${PATHS.ABOUT}`);
	revalidatePath(`/en${PATHS.ABOUT_US}`);
	revalidatePath(`/sv${PATHS.ABOUT_US}`);
}

/**
 * Revalidate team page
 * Call this when team page content is updated
 */
export async function revalidateTeamPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.TEAM_PAGE);
	revalidatePath(PATHS.TEAM);
	revalidatePath(`/en${PATHS.TEAM}`);
	revalidatePath(`/sv${PATHS.TEAM}`);
}

/**
 * Revalidate legal page
 * Call this when legal page content is updated
 */
export async function revalidateLegalPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.LEGAL_PAGE);
	revalidatePath(PATHS.LEGAL);
	revalidatePath(`/en${PATHS.LEGAL}`);
	revalidatePath(`/sv${PATHS.LEGAL}`);
}

/**
 * Revalidate privacy page
 * Call this when privacy policy content is updated
 */
export async function revalidatePrivacyPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.PRIVACY_PAGE);
	revalidatePath(PATHS.PRIVACY);
	// Also revalidate with locale prefixes
	revalidatePath(`/en${PATHS.PRIVACY}`);
	revalidatePath(`/sv${PATHS.PRIVACY}`);
}

/**
 * Revalidate careers page
 * Call this when careers page content is updated
 */
export async function revalidateCareersPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.CAREERS_PAGE);
	revalidatePath(PATHS.CAREERS);
}

/**
 * Revalidate starta eget page
 * Call this when start business page content is updated
 */
export async function revalidateStartaEgetPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.STARTA_EGET_PAGE);
	revalidatePath(PATHS.STARTA_EGET);
	// Also revalidate sub-pages
	revalidatePath(PATHS.KOPGUIDE);
	revalidatePath(PATHS.MINIUTBILDNING);
	revalidatePath(PATHS.VARFOR_VALJA_ZAVD);
}

/**
 * Revalidate Varför Välja Zavd page
 * Call this when the page content is updated
 */
export async function revalidateVarforValjaZavdPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.VARFOR_VALJA_ZAVD_PAGE);
	revalidatePath(PATHS.VARFOR_VALJA_ZAVD);
}

/**
 * Revalidate Köpguide page
 * Call this when the page content is updated
 */
export async function revalidateKopguidePage(): Promise<void> {
	revalidateTag(CACHE_TAGS.KOPGUIDE_PAGE);
	revalidatePath(PATHS.KOPGUIDE);
}

/**
 * Revalidate Miniutbildning page
 * Call this when the page content is updated
 */
export async function revalidateMiniutbildningPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.MINIUTBILDNING_PAGE);
	revalidatePath(PATHS.MINIUTBILDNING);
}

/**
 * Revalidate training page
 * Call this when training/education page content is updated
 */
export async function revalidateTrainingPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.TRAINING_PAGE);
	revalidatePath(PATHS.TRAINING);
}

/**
 * Revalidate FAQ page
 * Call this when FAQ page content is updated
 */
export async function revalidateFaqPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.FAQ_PAGE);
	revalidatePath(PATHS.FAQ);
	revalidatePath(`/en${PATHS.FAQ}`);
	revalidatePath(`/sv${PATHS.FAQ}`);
}

/**
 * Revalidate contact page
 * Call this when contact page content is updated
 */
export async function revalidateContactPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.CONTACT_PAGE);
	revalidatePath(PATHS.CONTACT);
	revalidatePath(`/en${PATHS.CONTACT}`);
	revalidatePath(`/sv${PATHS.CONTACT}`);
	revalidatePath("/en/contact-us");
	revalidatePath("/sv/contact-us");
}

/**
 * Revalidate store page
 * Call this when store page content is updated
 */
export async function revalidateStorePage(): Promise<void> {
	revalidateTag(CACHE_TAGS.STORE_PAGE);
	revalidatePath(PATHS.STORE);
	revalidatePath(`/en${PATHS.STORE}`);
	revalidatePath(`/sv${PATHS.STORE}`);
	revalidatePath("/en/our-store");
	revalidatePath("/sv/our-store");
}

/**
 * Revalidate quality page
 * Call this when quality/certifications page content is updated
 */
export async function revalidateQualityPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.QUALITY_PAGE);
	revalidatePath(PATHS.QUALITY);
	revalidatePath(`/en${PATHS.QUALITY}`);
	revalidatePath(`/sv${PATHS.QUALITY}`);
}

/**
 * Revalidate Über ZAVD about page
 * Call this when uber-zavd page content is updated
 */
export async function revalidateUberZavdPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.UBER_ZAVD_PAGE);
	revalidatePath(PATHS.UBER_ZAVD);
	revalidatePath(`/en${PATHS.UBER_ZAVD}`);
	revalidatePath(`/de${PATHS.UBER_ZAVD}`);
}

/**
 * Revalidate Vorstand & Team page
 * Call this when vorstand-team page content is updated
 */
export async function revalidateVorstandTeamPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.VORSTAND_TEAM_PAGE);
	revalidatePath(PATHS.VORSTAND_TEAM);
	revalidatePath(`/en${PATHS.VORSTAND_TEAM}`);
	revalidatePath(`/de${PATHS.VORSTAND_TEAM}`);
}

/**
 * Revalidate Geschichte (History) page
 * Call this when geschichte page content is updated
 */
export async function revalidateGeschichtePage(): Promise<void> {
	revalidateTag(CACHE_TAGS.GESCHICHTE_PAGE);
	revalidatePath(PATHS.GESCHICHTE);
	revalidatePath(`/en${PATHS.GESCHICHTE}`);
	revalidatePath(`/de${PATHS.GESCHICHTE}`);
}

/**
 * Revalidate Mission & Werte page
 * Call this when mission-werte page content is updated
 */
export async function revalidateMissionWertePage(): Promise<void> {
	revalidateTag(CACHE_TAGS.MISSION_WERTE_PAGE);
	revalidatePath(PATHS.MISSION_WERTE);
	revalidatePath(`/en${PATHS.MISSION_WERTE}`);
	revalidatePath(`/de${PATHS.MISSION_WERTE}`);
}

/**
 * Revalidate Satzung (Statutes) page
 * Call this when satzung page content is updated
 */
export async function revalidateSatzungPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.SATZUNG_PAGE);
	revalidatePath(PATHS.SATZUNG);
	revalidatePath(`/en${PATHS.SATZUNG}`);
	revalidatePath(`/de${PATHS.SATZUNG}`);
}

export async function revalidateSpendenPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.SPENDEN_PAGE);
	revalidatePath(PATHS.SPENDEN);
	revalidatePath(`/en${PATHS.SPENDEN}`);
	revalidatePath(`/de${PATHS.SPENDEN}`);
}

export async function revalidateHumanitaereHilfePage(): Promise<void> {
	revalidateTag(CACHE_TAGS.HUMANITAERE_HILFE_PAGE);
	revalidatePath(PATHS.HUMANITAERE_HILFE);
	revalidatePath(`/en${PATHS.HUMANITAERE_HILFE}`);
	revalidatePath(`/de${PATHS.HUMANITAERE_HILFE}`);
}

export async function revalidateZavdSpendenkontoPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.ZAVD_SPENDENKONTO_PAGE);
	revalidatePath(PATHS.ZAVD_SPENDENKONTO);
	revalidatePath(`/en${PATHS.ZAVD_SPENDENKONTO}`);
	revalidatePath(`/de${PATHS.ZAVD_SPENDENKONTO}`);
}

export async function revalidateAngeboteBeratungPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.ANGEBOTE_BERATUNG_PAGE);
	revalidatePath(PATHS.ANGEBOTE_BERATUNG);
	revalidatePath(`/en${PATHS.ANGEBOTE_BERATUNG}`);
	revalidatePath(`/de${PATHS.ANGEBOTE_BERATUNG}`);
}

export async function revalidateThemenPage(): Promise<void> {
	revalidateTag(CACHE_TAGS.THEMEN_PAGE);
	revalidatePath(PATHS.THEMEN);
	revalidatePath(`/en${PATHS.THEMEN}`);
	revalidatePath(`/de${PATHS.THEMEN}`);
}
