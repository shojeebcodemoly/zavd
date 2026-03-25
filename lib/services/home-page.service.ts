import { unstable_cache } from "next/cache";
import {
	homePageRepository,
	type HomePageData,
} from "@/lib/repositories/home-page.repository";
import type {
	IHeroSection,
	IFeatureHighlight,
	IAboutSection,
	ICtaSection,
	IHomePageSeo,
	IImageGallerySection,
} from "@/models/home-page.model";

/**
 * Cache tag for home page
 * Use this to revalidate when content changes
 */
export const HOME_PAGE_CACHE_TAG = "home-page";

/**
 * Get home page content - fetches directly from DB (no cache)
 * Page uses force-dynamic so every request gets fresh data
 */
export const getHomePage = async (): Promise<HomePageData> => {
	return homePageRepository.get();
};

/**
 * Get hero section only
 */
export const getHeroSection = unstable_cache(
	async (): Promise<IHeroSection> => {
		return homePageRepository.getHero();
	},
	["home-page-hero"],
	{
		tags: [HOME_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get feature highlights only
 */
export const getFeatureHighlights = unstable_cache(
	async (): Promise<IFeatureHighlight[]> => {
		return homePageRepository.getFeatures();
	},
	["home-page-features"],
	{
		tags: [HOME_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get image gallery section only
 */
export const getImageGallerySection = unstable_cache(
	async (): Promise<IImageGallerySection> => {
		return homePageRepository.getImageGallery();
	},
	["home-page-image-gallery"],
	{
		tags: [HOME_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get about section only
 */
export const getAboutSection = unstable_cache(
	async (): Promise<IAboutSection> => {
		return homePageRepository.getAboutSection();
	},
	["home-page-about"],
	{
		tags: [HOME_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get CTA section only
 */
export const getCtaSection = unstable_cache(
	async (): Promise<ICtaSection> => {
		return homePageRepository.getCtaSection();
	},
	["home-page-cta"],
	{
		tags: [HOME_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);

/**
 * Get SEO settings only
 */
export const getHomePageSeo = async (): Promise<IHomePageSeo> => {
	return homePageRepository.getSeo();
};
