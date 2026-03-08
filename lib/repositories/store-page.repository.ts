import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getStorePageModelSync,
	type IStorePage,
	type IStoreSectionVisibility,
	type IStoreHeroSection,
	type IStoreInfoSection,
	type IStoreOpeningHoursSection,
	type IStoreMapSection,
	type IStoreGallerySection,
	type IStorePageSeo,
} from "@/models/store-page.model";

/**
 * Helper to convert Mongoose documents to plain serializable objects
 */
function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

/**
 * Type for updating store page
 */
export interface UpdateStorePageInput {
	sectionVisibility?: IStoreSectionVisibility;
	hero?: Partial<IStoreHeroSection>;
	info?: Partial<IStoreInfoSection>;
	openingHours?: Partial<IStoreOpeningHoursSection>;
	map?: Partial<IStoreMapSection>;
	gallery?: Partial<IStoreGallerySection>;
	seo?: Partial<IStorePageSeo>;
}

/**
 * Plain object type for StorePage
 */
export type StorePageData = Omit<IStorePage, keyof Document>;

/**
 * StorePage Repository
 */
class StorePageRepository {
	/**
	 * Get store page content
	 */
	async get(): Promise<StorePageData> {
		await connectMongoose();
		const StorePage = getStorePageModelSync();

		let storePage = await StorePage.findOne().lean<StorePageData>();

		if (!storePage) {
			const created = await StorePage.create({});
			storePage = created.toObject() as StorePageData;
		}

		return toPlainObject(storePage);
	}

	/**
	 * Update store page content
	 */
	async update(data: UpdateStorePageInput): Promise<StorePageData> {
		await connectMongoose();
		const StorePage = getStorePageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.sectionVisibility) {
			updateData.sectionVisibility = data.sectionVisibility;
		}

		if (data.hero) {
			updateData.hero = data.hero;
		}

		if (data.info) {
			updateData.info = data.info;
		}

		if (data.openingHours) {
			updateData.openingHours = data.openingHours;
		}

		if (data.map) {
			updateData.map = data.map;
		}

		if (data.gallery) {
			updateData.gallery = data.gallery;
		}

		if (data.seo) {
			Object.entries(data.seo).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`seo.${key}`] = value;
				}
			});
		}

		const storePage = await StorePage.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<StorePageData>();

		if (!storePage) {
			throw new Error("Failed to update store page");
		}

		return toPlainObject(storePage);
	}

	/**
	 * Get SEO settings only
	 */
	async getSeo(): Promise<IStorePageSeo> {
		const storePage = await this.get();
		return storePage.seo;
	}
}

// Export singleton instance
export const storePageRepository = new StorePageRepository();
