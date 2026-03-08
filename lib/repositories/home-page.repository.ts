import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getHomePageModelSync,
	type IHomePage,
	type IHeroSection,
	type IFeatureHighlight,
	type IAboutSection,
	type ICtaSection,
	type IHomePageSeo,
	type IProductShowcaseSection,
	type IImageGallerySection,
	type ISectionVisibility,
	type ITestimonialsSection,
} from "@/models/home-page.model";

/**
 * Type for updating home page
 */
export interface UpdateHomePageInput {
	sectionVisibility?: ISectionVisibility;
	hero?: Partial<IHeroSection>;
	categoryShowcase?: {
		badge?: string;
		title?: string;
		maxCategories?: number;
	};
	productCarousel?: {
		badge?: string;
		title?: string;
		maxProducts?: number;
	};
	promoBanner?: {
		leftBanner?: {
			badge?: string;
			title?: string;
			subtitle?: string;
			description?: string;
			image?: string;
			ctaText?: string;
			ctaHref?: string;
		};
		rightBanner?: {
			badge?: string;
			title?: string;
			subtitle?: string;
			description?: string;
			image?: string;
			ctaText?: string;
			ctaHref?: string;
		};
	};
	featureBanner?: {
		image?: string;
		title?: string;
		titleHighlight?: string;
		features?: Array<{
			icon?: string;
			title?: string;
			description?: string;
		}>;
	};
	features?: IFeatureHighlight[];
	productShowcase?: Partial<IProductShowcaseSection>;
	imageGallery?: Partial<IImageGallerySection>;
	aboutSection?: Partial<IAboutSection>;
	testimonialsSection?: Partial<ITestimonialsSection>;
	ctaSection?: Partial<ICtaSection>;
	seo?: Partial<IHomePageSeo>;
	richContent?: string;
}

/**
 * Plain object type for HomePage (without Mongoose Document methods)
 */
export type HomePageData = Omit<IHomePage, keyof Document>;

/**
 * HomePage Repository
 * Handles all database operations for the home page singleton
 */
class HomePageRepository {
	/**
	 * Get home page content
	 * Creates default content if none exists (singleton pattern)
	 * Returns plain JavaScript object to avoid circular reference issues
	 */
	async get(): Promise<HomePageData> {
		await connectMongoose();
		const HomePage = getHomePageModelSync();

		// Try to find existing home page - use lean() to get plain object
		let homePage = await HomePage.findOne().lean<HomePageData>();

		// If no home page exists, create one with defaults
		if (!homePage) {
			const created = await HomePage.create({});
			// Convert to plain object after creation
			homePage = created.toObject() as HomePageData;
		}

		return homePage;
	}

	/**
	 * Update home page content
	 * Uses upsert to create if not exists
	 * Returns plain JavaScript object to avoid circular reference issues
	 */
	async update(data: UpdateHomePageInput): Promise<HomePageData> {
		await connectMongoose();
		const HomePage = getHomePageModelSync();

		// Build update object, only including provided fields
		const updateData: Record<string, unknown> = {};

		// Section visibility - update entire object
		if (data.sectionVisibility) {
			updateData.sectionVisibility = data.sectionVisibility;
		}

		if (data.hero) {
			// For nested objects, we need to update each field individually
			// to avoid overwriting the entire object
			Object.entries(data.hero).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`hero.${key}`] = value;
				}
			});
		}

		if (data.categoryShowcase) {
			Object.entries(data.categoryShowcase).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`categoryShowcase.${key}`] = value;
				}
			});
		}

		if (data.productCarousel) {
			Object.entries(data.productCarousel).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`productCarousel.${key}`] = value;
				}
			});
		}

		if (data.promoBanner) {
			Object.entries(data.promoBanner).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`promoBanner.${key}`] = value;
				}
			});
		}

		if (data.featureBanner) {
			Object.entries(data.featureBanner).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`featureBanner.${key}`] = value;
				}
			});
		}

		if (data.features) {
			updateData.features = data.features;
		}

		if (data.productShowcase) {
			Object.entries(data.productShowcase).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`productShowcase.${key}`] = value;
				}
			});
		}

		if (data.imageGallery) {
			Object.entries(data.imageGallery).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`imageGallery.${key}`] = value;
				}
			});
		}

		if (data.aboutSection) {
			Object.entries(data.aboutSection).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`aboutSection.${key}`] = value;
				}
			});
		}

		// Testimonials section - update entire object (has array)
		if (data.testimonialsSection) {
			Object.entries(data.testimonialsSection).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`testimonialsSection.${key}`] = value;
				}
			});
		}

		if (data.ctaSection) {
			Object.entries(data.ctaSection).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`ctaSection.${key}`] = value;
				}
			});
		}

		if (data.seo) {
			Object.entries(data.seo).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`seo.${key}`] = value;
				}
			});
		}

		if (data.richContent !== undefined) {
			updateData.richContent = data.richContent;
		}

		// Use findOneAndUpdate with upsert and lean() to get plain object
		const homePage = await HomePage.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<HomePageData>();

		if (!homePage) {
			throw new Error("Failed to update home page");
		}

		return homePage;
	}

	/**
	 * Replace entire home page content
	 * Used when you want to completely replace the content
	 * Returns plain JavaScript object to avoid circular reference issues
	 */
	async replace(data: UpdateHomePageInput): Promise<HomePageData> {
		await connectMongoose();
		const HomePage = getHomePageModelSync();

		const homePage = await HomePage.findOneAndUpdate({}, data, {
			new: true,
			upsert: true,
			runValidators: true,
		}).lean<HomePageData>();

		if (!homePage) {
			throw new Error("Failed to replace home page");
		}

		return homePage;
	}

	/**
	 * Get hero section only
	 */
	async getHero(): Promise<IHeroSection> {
		const homePage = await this.get();
		return homePage.hero;
	}

	/**
	 * Get features only
	 */
	async getFeatures(): Promise<IFeatureHighlight[]> {
		const homePage = await this.get();
		return homePage.features;
	}

	/**
	 * Get product showcase section only
	 */
	async getProductShowcase(): Promise<IProductShowcaseSection> {
		const homePage = await this.get();
		return homePage.productShowcase;
	}

	/**
	 * Get image gallery section only
	 */
	async getImageGallery(): Promise<IImageGallerySection> {
		const homePage = await this.get();
		return homePage.imageGallery;
	}

	/**
	 * Get about section only
	 */
	async getAboutSection(): Promise<IAboutSection> {
		const homePage = await this.get();
		return homePage.aboutSection;
	}

	/**
	 * Get CTA section only
	 */
	async getCtaSection(): Promise<ICtaSection> {
		const homePage = await this.get();
		return homePage.ctaSection;
	}

	/**
	 * Get SEO settings only
	 */
	async getSeo(): Promise<IHomePageSeo> {
		const homePage = await this.get();
		return homePage.seo;
	}
}

// Export singleton instance
export const homePageRepository = new HomePageRepository();
