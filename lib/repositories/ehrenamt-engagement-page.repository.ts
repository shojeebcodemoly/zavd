import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getEhrenamtEngagementPageModelSync,
	type IEhrenamtEngagementPage,
	type IEhrenamtEngagementHero,
} from "@/models/ehrenamt-engagement-page.model";

export interface UpdateEhrenamtEngagementPageInput {
	hero?: Partial<IEhrenamtEngagementHero>;
}

export type EhrenamtEngagementPageData = Omit<
	IEhrenamtEngagementPage,
	keyof Document
>;

class EhrenamtEngagementPageRepository {
	async get(): Promise<EhrenamtEngagementPageData> {
		await connectMongoose();
		const Model = getEhrenamtEngagementPageModelSync();

		let page = await Model.findOne().lean<EhrenamtEngagementPageData>();

		if (!page) {
			const created = await Model.create({});
			page = created.toObject() as EhrenamtEngagementPageData;
		}

		return page;
	}

	async update(
		data: UpdateEhrenamtEngagementPageInput
	): Promise<EhrenamtEngagementPageData> {
		await connectMongoose();
		const Model = getEhrenamtEngagementPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) {
			Object.entries(data.hero).forEach(([key, value]) => {
				if (value !== undefined) updateData[`hero.${key}`] = value;
			});
		}

		const page = await Model.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<EhrenamtEngagementPageData>();

		if (!page) throw new Error("Failed to update ehrenamt-engagement page");

		return page;
	}
}

export const ehrenamtEngagementPageRepository =
	new EhrenamtEngagementPageRepository();
