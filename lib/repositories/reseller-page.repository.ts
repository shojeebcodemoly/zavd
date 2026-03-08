import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getResellerPageModelSync,
	type IResellerPage,
	type IResellerSectionVisibility,
	type IResellerHeroSection,
	type IResellerBenefitsSection,
	type IResellerFormSection,
	type IResellerPageSeo,
} from "@/models/reseller-page.model";

/**
 * Helper to convert Mongoose documents to plain serializable objects
 */
function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

/**
 * Type for updating reseller page
 */
export interface UpdateResellerPageInput {
	sectionVisibility?: IResellerSectionVisibility;
	hero?: Partial<IResellerHeroSection>;
	benefits?: Partial<IResellerBenefitsSection>;
	formSection?: Partial<IResellerFormSection>;
	seo?: Partial<IResellerPageSeo>;
}

/**
 * Plain object type for ResellerPage
 */
export type ResellerPageData = Omit<IResellerPage, keyof Document>;

/**
 * ResellerPage Repository
 */
class ResellerPageRepository {
	/**
	 * Get reseller page content
	 */
	async get(): Promise<ResellerPageData> {
		await connectMongoose();
		const ResellerPage = getResellerPageModelSync();

		let resellerPage = await ResellerPage.findOne().lean<ResellerPageData>();

		if (!resellerPage) {
			const created = await ResellerPage.create({});
			resellerPage = created.toObject() as ResellerPageData;
		}

		return toPlainObject(resellerPage);
	}

	/**
	 * Update reseller page content
	 */
	async update(data: UpdateResellerPageInput): Promise<ResellerPageData> {
		await connectMongoose();
		const ResellerPage = getResellerPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.sectionVisibility) {
			updateData.sectionVisibility = data.sectionVisibility;
		}

		if (data.hero) {
			updateData.hero = data.hero;
		}

		if (data.benefits) {
			updateData.benefits = data.benefits;
		}

		if (data.formSection) {
			updateData.formSection = data.formSection;
		}

		if (data.seo) {
			Object.entries(data.seo).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`seo.${key}`] = value;
				}
			});
		}

		const resellerPage = await ResellerPage.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<ResellerPageData>();

		if (!resellerPage) {
			throw new Error("Failed to update reseller page");
		}

		return toPlainObject(resellerPage);
	}

	/**
	 * Get SEO settings only
	 */
	async getSeo(): Promise<IResellerPageSeo> {
		const resellerPage = await this.get();
		return resellerPage.seo;
	}
}

// Export singleton instance
export const resellerPageRepository = new ResellerPageRepository();
