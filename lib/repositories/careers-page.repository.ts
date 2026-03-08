import { connectMongoose } from "@/lib/db/db-connect";
import {
	getCareersPageModelSync,
	type ICareersPage,
	type ICareersJobOpening,
} from "@/models/careers-page.model";
import type { Document } from "mongoose";

// Type for the data returned from the repository (without Mongoose document methods)
export type CareersPageData = Omit<ICareersPage, keyof Document>;
export type JobOpeningData = ICareersJobOpening;

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

class CareersPageRepository {
	/**
	 * Get the careers page data
	 * Creates a default document if none exists
	 */
	async get(): Promise<CareersPageData> {
		await connectMongoose();
		const CareersPage = getCareersPageModelSync();

		let careersPage = await CareersPage.findOne().lean<CareersPageData>();

		if (!careersPage) {
			// Create default document
			const newPage = await CareersPage.create({});
			careersPage = newPage.toObject() as CareersPageData;
		}

		return serialize(careersPage);
	}

	/**
	 * Update the careers page data
	 */
	async update(data: Partial<CareersPageData>): Promise<CareersPageData> {
		await connectMongoose();
		const CareersPage = getCareersPageModelSync();

		// Find and update, or create if doesn't exist
		const updated = await CareersPage.findOneAndUpdate(
			{},
			{ $set: data },
			{ new: true, upsert: true, runValidators: true }
		).lean<CareersPageData>();

		if (!updated) {
			throw new Error("Failed to update careers page");
		}

		return serialize(updated);
	}

	/**
	 * Get a single job opening by slug
	 */
	async getJobBySlug(slug: string): Promise<JobOpeningData | null> {
		await connectMongoose();
		const CareersPage = getCareersPageModelSync();

		const careersPage = await CareersPage.findOne().lean<CareersPageData>();

		if (!careersPage || !careersPage.jobOpeningsSection?.jobOpenings) {
			return null;
		}

		const job = careersPage.jobOpeningsSection.jobOpenings.find(
			(j) => j.slug === slug && j.isActive === true
		);

		return job ? serialize(job) : null;
	}

	/**
	 * Get all active job openings
	 */
	async getActiveJobs(): Promise<JobOpeningData[]> {
		await connectMongoose();
		const CareersPage = getCareersPageModelSync();

		const careersPage = await CareersPage.findOne().lean<CareersPageData>();

		if (!careersPage || !careersPage.jobOpeningsSection?.jobOpenings) {
			return [];
		}

		const activeJobs = careersPage.jobOpeningsSection.jobOpenings.filter(
			(j) => j.isActive === true && j.title
		);

		return serialize(activeJobs);
	}

	/**
	 * Get careers page data with only active jobs
	 */
	async getPublic(): Promise<CareersPageData> {
		const careersPage = await this.get();

		// Create a copy to avoid mutating the original and filter to only show active jobs
		const publicPage = { ...careersPage };
		if (publicPage.jobOpeningsSection?.jobOpenings) {
			publicPage.jobOpeningsSection = {
				...publicPage.jobOpeningsSection,
				jobOpenings: publicPage.jobOpeningsSection.jobOpenings.filter(
					(j) => j.isActive === true && j.title
				),
			};
		}

		return publicPage;
	}
}

export const careersPageRepository = new CareersPageRepository();
