import { connectMongoose } from "@/lib/db/db-connect";
import {
	getVeranstaltungenPageModelSync,
	type IVeranstaltungenPage,
	type IVeranstaltungenHero,
	type IVeranstaltungenPressSection,
} from "@/models/veranstaltungen-page.model";
import type { Document } from "mongoose";

export interface UpdateVeranstaltungenPageInput {
	hero?: Partial<IVeranstaltungenHero>;
	pressSection?: Partial<IVeranstaltungenPressSection>;
}

export type VeranstaltungenPageData = Omit<IVeranstaltungenPage, keyof Document>;

class VeranstaltungenPageRepository {
	async get(): Promise<VeranstaltungenPageData> {
		await connectMongoose();
		const Model = getVeranstaltungenPageModelSync();
		let page = await Model.findOne().lean<VeranstaltungenPageData>();
		if (!page) {
			const created = await Model.create({});
			page = created.toObject() as VeranstaltungenPageData;
		}
		return page;
	}

	async update(data: UpdateVeranstaltungenPageInput): Promise<VeranstaltungenPageData> {
		await connectMongoose();
		const Model = getVeranstaltungenPageModelSync();
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
		).lean<VeranstaltungenPageData>();

		if (!page) throw new Error("Failed to update veranstaltungen page");
		return page;
	}
}

export const veranstaltungenPageRepository = new VeranstaltungenPageRepository();
