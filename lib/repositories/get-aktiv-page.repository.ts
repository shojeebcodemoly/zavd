import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getGetAktivPageModelSync,
	type IGetAktivPage,
	type IGetAktivHero,
	type IGetAktivContent,
	type IGetAktivGallery,
	type IGetAktivPartners,
} from "@/models/get-aktiv-page.model";

export interface UpdateGetAktivPageInput {
	hero?: Partial<IGetAktivHero>;
	content?: Partial<IGetAktivContent>;
	gallery?: Partial<IGetAktivGallery>;
	partners?: Partial<IGetAktivPartners>;
}

export type GetAktivPageData = Omit<IGetAktivPage, keyof Document>;

class GetAktivPageRepository {
	async get(): Promise<GetAktivPageData> {
		await connectMongoose();
		const Model = getGetAktivPageModelSync();

		let page = await Model.findOne().lean<GetAktivPageData>();

		if (!page) {
			const created = await Model.create({});
			page = created.toObject() as GetAktivPageData;
		}

		return page;
	}

	async update(data: UpdateGetAktivPageInput): Promise<GetAktivPageData> {
		await connectMongoose();
		const Model = getGetAktivPageModelSync();

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
		).lean<GetAktivPageData>();

		if (!page) throw new Error("Failed to update get-aktiv page");

		return page;
	}
}

export const getAktivPageRepository = new GetAktivPageRepository();
