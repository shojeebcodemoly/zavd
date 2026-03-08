import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getLegalPageModelSync,
	type ILegalPage,
	type ILegalSectionVisibility,
	type ILegalHeroSection,
	type ILegalCard,
	type ILegalCompanyInfo,
	type ILegalTermsSection,
	type ILegalGdprSection,
	type ILegalCtaSection,
	type ILegalPageSeo,
} from "@/models/legal-page.model";

/**
 * Type for updating legal page
 */
export interface UpdateLegalPageInput {
	sectionVisibility?: ILegalSectionVisibility;
	hero?: Partial<ILegalHeroSection>;
	legalCards?: ILegalCard[];
	companyInfo?: Partial<ILegalCompanyInfo>;
	termsSection?: Partial<ILegalTermsSection>;
	gdprSection?: Partial<ILegalGdprSection>;
	ctaSection?: Partial<ILegalCtaSection>;
	seo?: Partial<ILegalPageSeo>;
}

/**
 * Plain object type for LegalPage
 */
export type LegalPageData = Omit<ILegalPage, keyof Document>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

/**
 * LegalPage Repository
 */
class LegalPageRepository {
	/**
	 * Get legal page content
	 */
	async get(): Promise<LegalPageData> {
		await connectMongoose();
		const LegalPage = getLegalPageModelSync();

		let legalPage = await LegalPage.findOne().lean<LegalPageData>();

		if (!legalPage) {
			const created = await LegalPage.create({});
			legalPage = created.toObject() as LegalPageData;
		}

		return serialize(legalPage);
	}

	/**
	 * Update legal page content
	 */
	async update(data: UpdateLegalPageInput): Promise<LegalPageData> {
		await connectMongoose();
		const LegalPage = getLegalPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.sectionVisibility) {
			updateData.sectionVisibility = data.sectionVisibility;
		}

		if (data.hero) {
			Object.entries(data.hero).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`hero.${key}`] = value;
				}
			});
		}

		if (data.legalCards) {
			updateData.legalCards = data.legalCards;
		}

		if (data.companyInfo) {
			Object.entries(data.companyInfo).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`companyInfo.${key}`] = value;
				}
			});
		}

		if (data.termsSection) {
			Object.entries(data.termsSection).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`termsSection.${key}`] = value;
				}
			});
		}

		if (data.gdprSection) {
			Object.entries(data.gdprSection).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`gdprSection.${key}`] = value;
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

		const legalPage = await LegalPage.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<LegalPageData>();

		if (!legalPage) {
			throw new Error("Failed to update legal page");
		}

		return serialize(legalPage);
	}

	/**
	 * Get SEO settings only
	 */
	async getSeo(): Promise<ILegalPageSeo> {
		const legalPage = await this.get();
		return legalPage.seo;
	}
}

// Export singleton instance
export const legalPageRepository = new LegalPageRepository();
