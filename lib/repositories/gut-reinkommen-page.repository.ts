import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getGutReinkommenPageModelSync,
	type IGutReinkommenPage,
	type IGutReinkommenHero,
	type IGutReinkommenContent,
	type IGutReinkommenGallery,
	type IGutReinkommenPartners,
} from "@/models/gut-reinkommen-page.model";

export interface UpdateGutReinkommenPageInput {
	hero?: Partial<IGutReinkommenHero>;
	content?: Partial<IGutReinkommenContent>;
	gallery?: Partial<IGutReinkommenGallery>;
	partners?: Partial<IGutReinkommenPartners>;
}

export type GutReinkommenPageData = Omit<IGutReinkommenPage, keyof Document>;

class GutReinkommenPageRepository {
	async get(): Promise<GutReinkommenPageData> {
		await connectMongoose();
		const Model = getGutReinkommenPageModelSync();

		let page = await Model.findOne().lean<GutReinkommenPageData>();

		if (!page) {
			const created = await Model.create({});
			page = created.toObject() as GutReinkommenPageData;
		}

		return page;
	}

	async update(
		data: UpdateGutReinkommenPageInput
	): Promise<GutReinkommenPageData> {
		await connectMongoose();
		const Model = getGutReinkommenPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) {
			Object.entries(data.hero).forEach(([key, value]) => {
				if (value !== undefined) updateData[`hero.${key}`] = value;
			});
		}

		if (data.content) {
			const { blocks, ...rest } = data.content;
			Object.entries(rest).forEach(([key, value]) => {
				if (value !== undefined) updateData[`content.${key}`] = value;
			});
			if (blocks !== undefined) updateData["content.blocks"] = blocks;
		}

		if (data.gallery) {
			const { images, ...rest } = data.gallery;
			Object.entries(rest).forEach(([key, value]) => {
				if (value !== undefined) updateData[`gallery.${key}`] = value;
			});
			if (images !== undefined) updateData["gallery.images"] = images;
		}

		if (data.partners) {
			const { logos, ...rest } = data.partners;
			Object.entries(rest).forEach(([key, value]) => {
				if (value !== undefined) updateData[`partners.${key}`] = value;
			});
			if (logos !== undefined) updateData["partners.logos"] = logos;
		}

		const page = await Model.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<GutReinkommenPageData>();

		if (!page) throw new Error("Failed to update gut-reinkommen page");

		return page;
	}
}

export const gutReinkommenPageRepository = new GutReinkommenPageRepository();
