import { unstable_cache } from "next/cache";
import {
	kontaktPageRepository,
	type KontaktPageData,
} from "@/lib/repositories/kontakt-page.repository";
import type {
	IKontaktHero,
	IKontaktFaqSection,
	IKontaktPageSeo,
} from "@/models/kontakt-page.model";

/**
 * Cache tag for kontakt page
 * Use this to revalidate when content changes
 */
export const KONTAKT_PAGE_CACHE_TAG = "kontakt-page";

/**
 * Get kontakt page content with caching
 * Cached for 1 hour, revalidated on-demand when content is updated
 */
export const getKontaktPage = unstable_cache(
	async (): Promise<KontaktPageData> => {
		return kontaktPageRepository.get();
	},
	["kontakt-page"],
	{
		tags: [KONTAKT_PAGE_CACHE_TAG],
		revalidate: 3600, // 1 hour
	}
);

/**
 * Get hero section only
 */
export const getKontaktHero = unstable_cache(
	async (): Promise<IKontaktHero> => {
		return kontaktPageRepository.getHero();
	},
	["kontakt-page-hero"],
	{
		tags: [KONTAKT_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get FAQ section only
 */
export const getKontaktFaqSection = unstable_cache(
	async (): Promise<IKontaktFaqSection> => {
		return kontaktPageRepository.getFaqSection();
	},
	["kontakt-page-faq"],
	{
		tags: [KONTAKT_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get SEO settings only
 */
export const getKontaktPageSeo = unstable_cache(
	async (): Promise<IKontaktPageSeo> => {
		return kontaktPageRepository.getSeo();
	},
	["kontakt-page-seo"],
	{
		tags: [KONTAKT_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);
