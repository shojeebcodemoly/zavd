import { connectMongoose } from "@/lib/db/db-connect";
import {
	getPrivacyPageModelSync,
	type IPrivacyPage,
} from "@/models/privacy-page.model";
import type { Document } from "mongoose";

// Type for the data returned from the repository (without Mongoose document methods)
export type PrivacyPageData = Omit<IPrivacyPage, keyof Document>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class PrivacyPageRepository {
	/**
	 * Get the privacy page data
	 * Creates a default document if none exists
	 */
	async get(): Promise<PrivacyPageData> {
		await connectMongoose();
		const PrivacyPage = getPrivacyPageModelSync();

		let privacyPage = await PrivacyPage.findOne().lean<PrivacyPageData>();

		if (!privacyPage) {
			// Create default document
			const newPage = await PrivacyPage.create({});
			privacyPage = newPage.toObject() as PrivacyPageData;
		}

		return serialize(privacyPage);
	}

	/**
	 * Update the privacy page data
	 */
	async update(data: Partial<PrivacyPageData>): Promise<PrivacyPageData> {
		await connectMongoose();
		const PrivacyPage = getPrivacyPageModelSync();

		// Find and update, or create if doesn't exist
		const updated = await PrivacyPage.findOneAndUpdate(
			{},
			{ $set: data },
			{ new: true, upsert: true, runValidators: true }
		).lean<PrivacyPageData>();

		if (!updated) {
			throw new Error("Failed to update privacy page");
		}

		return serialize(updated);
	}
}

export const privacyPageRepository = new PrivacyPageRepository();
