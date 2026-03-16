import { connectMongoose } from "@/lib/db/db-connect";
import {
	getNachrichtenPageModelSync,
	type INachrichtenPage,
	type INachrichtenHero,
	type INachrichtenPressSection,
} from "@/models/nachrichten-page.model";
import type { Document } from "mongoose";

export interface UpdateNachrichtenPageInput {
	hero?: Partial<INachrichtenHero>;
	pressSection?: Partial<INachrichtenPressSection>;
}

export type NachrichtenPageData = Omit<INachrichtenPage, keyof Document>;

class NachrichtenPageRepository {
	async get(): Promise<NachrichtenPageData> {
		await connectMongoose();
		const Model = getNachrichtenPageModelSync();

		let page = await Model.findOne().lean<NachrichtenPageData>();

		if (!page) {
			const created = await Model.create({});
			page = created.toObject() as NachrichtenPageData;
		}

		return page;
	}

	async update(data: UpdateNachrichtenPageInput): Promise<NachrichtenPageData> {
		await connectMongoose();
		const Model = getNachrichtenPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) {
			Object.entries(data.hero).forEach(([key, value]) => {
				if (value !== undefined) updateData[`hero.${key}`] = value;
			});
		}

		if (data.pressSection) {
			Object.entries(data.pressSection).forEach(([key, value]) => {
				if (value !== undefined) updateData[`pressSection.${key}`] = value;
			});
		}

		const page = await Model.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<NachrichtenPageData>();

		if (!page) throw new Error("Failed to update nachrichten page");

		return page;
	}
}

export const nachrichtenPageRepository = new NachrichtenPageRepository();
