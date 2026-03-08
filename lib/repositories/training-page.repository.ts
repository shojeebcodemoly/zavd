import { connectMongoose } from "@/lib/db/db-connect";
import {
	getTrainingPageModelSync,
	type ITrainingPage,
} from "@/models/training-page.model";
import type { Document } from "mongoose";

// Type for the data returned from the repository (without Mongoose document methods)
export type TrainingPageData = Omit<ITrainingPage, keyof Document>;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class TrainingPageRepository {
	/**
	 * Get the training page data
	 * Creates a default document if none exists
	 */
	async get(): Promise<TrainingPageData> {
		await connectMongoose();
		const TrainingPage = getTrainingPageModelSync();

		let trainingPage = await TrainingPage.findOne().lean<TrainingPageData>();

		if (!trainingPage) {
			// Create default document
			const newPage = await TrainingPage.create({});
			trainingPage = newPage.toObject() as TrainingPageData;
		}

		return serialize(trainingPage);
	}

	/**
	 * Update the training page data
	 */
	async update(data: Partial<TrainingPageData>): Promise<TrainingPageData> {
		await connectMongoose();
		const TrainingPage = getTrainingPageModelSync();

		// Find and update, or create if doesn't exist
		const updated = await TrainingPage.findOneAndUpdate(
			{},
			{ $set: data },
			{ new: true, upsert: true, runValidators: true }
		).lean<TrainingPageData>();

		if (!updated) {
			throw new Error("Failed to update training page");
		}

		return serialize(updated);
	}
}

export const trainingPageRepository = new TrainingPageRepository();
