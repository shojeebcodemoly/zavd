import { connectMongoose } from "@/lib/db/db-connect";
import { getQualityPageModelSync, type IQualityPage } from "@/models/quality-page.model";
import type { Document } from "mongoose";

// Type for the data returned from the repository (without Mongoose document methods)
export type QualityPageData = Omit<IQualityPage, keyof Document>;

// Type for update input
export type UpdateQualityPageInput = Partial<QualityPageData>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class QualityPageRepository {
	/**
	 * Get the Quality page data
	 * Creates a default document if none exists
	 */
	async get(): Promise<QualityPageData> {
		await connectMongoose();
		const QualityPage = getQualityPageModelSync();

		let qualityPage = await QualityPage.findOne().lean<QualityPageData>();

		if (!qualityPage) {
			// Create default document
			const newPage = await QualityPage.create({});
			qualityPage = newPage.toObject() as QualityPageData;
		}

		return serialize(qualityPage);
	}

	/**
	 * Update the Quality page data
	 */
	async update(data: Partial<QualityPageData>): Promise<QualityPageData> {
		await connectMongoose();
		const QualityPage = getQualityPageModelSync();

		// Find and update, or create if doesn't exist
		const updated = await QualityPage.findOneAndUpdate(
			{},
			{ $set: data },
			{ new: true, upsert: true, runValidators: true }
		).lean<QualityPageData>();

		if (!updated) {
			throw new Error("Failed to update Quality page");
		}

		return serialize(updated);
	}
}

export const qualityPageRepository = new QualityPageRepository();
