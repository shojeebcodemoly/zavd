import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getKontaktPageModelSync,
	type IKontaktPage,
	type IKontaktHero,
	type IContactCard,
	type IKontaktFormSection,
	type IKontaktOfficeSection,
	type IKontaktFaqSection,
	type IKontaktPageSeo,
} from "@/models/kontakt-page.model";

/**
 * Type for updating kontakt page
 */
export interface UpdateKontaktPageInput {
	hero?: Partial<IKontaktHero>;
	phoneCard?: Partial<IContactCard>;
	emailCard?: Partial<IContactCard>;
	socialCard?: Partial<IContactCard>;
	formSection?: Partial<IKontaktFormSection>;
	officeSection?: Partial<IKontaktOfficeSection>;
	faqSection?: Partial<IKontaktFaqSection>;
	seo?: Partial<IKontaktPageSeo>;
}

/**
 * Plain object type for KontaktPage (without Mongoose Document methods)
 */
export type KontaktPageData = Omit<IKontaktPage, keyof Document>;

/**
 * KontaktPage Repository
 * Handles all database operations for the kontakt page singleton
 */
class KontaktPageRepository {
	/**
	 * Get kontakt page content
	 * Creates default content if none exists (singleton pattern)
	 * Returns plain JavaScript object to avoid circular reference issues
	 */
	async get(): Promise<KontaktPageData> {
		await connectMongoose();
		const KontaktPage = getKontaktPageModelSync();

		// Try to find existing kontakt page - use lean() to get plain object
		let kontaktPage = await KontaktPage.findOne().lean<KontaktPageData>();

		// If no kontakt page exists, create one with defaults
		if (!kontaktPage) {
			const created = await KontaktPage.create({});
			// Convert to plain object after creation
			kontaktPage = created.toObject() as KontaktPageData;
		}

		return kontaktPage;
	}

	/**
	 * Update kontakt page content
	 * Uses upsert to create if not exists
	 * Returns plain JavaScript object to avoid circular reference issues
	 */
	async update(data: UpdateKontaktPageInput): Promise<KontaktPageData> {
		await connectMongoose();
		const KontaktPage = getKontaktPageModelSync();

		// Build update object, only including provided fields
		const updateData: Record<string, unknown> = {};

		if (data.hero) {
			Object.entries(data.hero).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`hero.${key}`] = value;
				}
			});
		}

		if (data.phoneCard) {
			Object.entries(data.phoneCard).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`phoneCard.${key}`] = value;
				}
			});
		}

		if (data.emailCard) {
			Object.entries(data.emailCard).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`emailCard.${key}`] = value;
				}
			});
		}

		if (data.socialCard) {
			Object.entries(data.socialCard).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`socialCard.${key}`] = value;
				}
			});
		}

		if (data.formSection) {
			Object.entries(data.formSection).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`formSection.${key}`] = value;
				}
			});
		}

		if (data.officeSection) {
			Object.entries(data.officeSection).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`officeSection.${key}`] = value;
				}
			});
		}

		if (data.faqSection) {
			// For faqSection, if faqs array is provided, replace it entirely
			if (data.faqSection.faqs !== undefined) {
				updateData["faqSection.faqs"] = data.faqSection.faqs;
			}
			Object.entries(data.faqSection).forEach(([key, value]) => {
				if (value !== undefined && key !== "faqs") {
					updateData[`faqSection.${key}`] = value;
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

		// Use findOneAndUpdate with upsert and lean() to get plain object
		const kontaktPage = await KontaktPage.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<KontaktPageData>();

		if (!kontaktPage) {
			throw new Error("Failed to update kontakt page");
		}

		return kontaktPage;
	}

	/**
	 * Replace entire kontakt page content
	 * Used when you want to completely replace the content
	 * Returns plain JavaScript object to avoid circular reference issues
	 */
	async replace(data: UpdateKontaktPageInput): Promise<KontaktPageData> {
		await connectMongoose();
		const KontaktPage = getKontaktPageModelSync();

		const kontaktPage = await KontaktPage.findOneAndUpdate({}, data, {
			new: true,
			upsert: true,
			runValidators: true,
		}).lean<KontaktPageData>();

		if (!kontaktPage) {
			throw new Error("Failed to replace kontakt page");
		}

		return kontaktPage;
	}

	/**
	 * Get hero section only
	 */
	async getHero(): Promise<IKontaktHero> {
		const kontaktPage = await this.get();
		return kontaktPage.hero;
	}

	/**
	 * Get FAQ section only
	 */
	async getFaqSection(): Promise<IKontaktFaqSection> {
		const kontaktPage = await this.get();
		return kontaktPage.faqSection;
	}

	/**
	 * Get SEO settings only
	 */
	async getSeo(): Promise<IKontaktPageSeo> {
		const kontaktPage = await this.get();
		return kontaktPage.seo;
	}
}

// Export singleton instance
export const kontaktPageRepository = new KontaktPageRepository();
