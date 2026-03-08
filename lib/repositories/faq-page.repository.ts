import { connectMongoose } from "@/lib/db/db-connect";
import { getFAQPageModelSync, type IFAQPage } from "@/models/faq-page.model";
import type { Document } from "mongoose";

// Type for the data returned from the repository (without Mongoose document methods)
export type FAQPageData = Omit<IFAQPage, keyof Document>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class FAQPageRepository {
	/**
	 * Get the FAQ page data
	 * Creates a default document if none exists
	 */
	async get(): Promise<FAQPageData> {
		await connectMongoose();
		const FAQPage = getFAQPageModelSync();

		let faqPage = await FAQPage.findOne().lean<FAQPageData>();

		if (!faqPage) {
			// Create default document
			const newPage = await FAQPage.create({});
			faqPage = newPage.toObject() as FAQPageData;
		}

		return serialize(faqPage);
	}

	/**
	 * Update the FAQ page data
	 */
	async update(data: Partial<FAQPageData>): Promise<FAQPageData> {
		await connectMongoose();
		const FAQPage = getFAQPageModelSync();

		// Find and update, or create if doesn't exist
		const updated = await FAQPage.findOneAndUpdate(
			{},
			{ $set: data },
			{ new: true, upsert: true, runValidators: true }
		).lean<FAQPageData>();

		if (!updated) {
			throw new Error("Failed to update FAQ page");
		}

		return serialize(updated);
	}
}

export const faqPageRepository = new FAQPageRepository();
