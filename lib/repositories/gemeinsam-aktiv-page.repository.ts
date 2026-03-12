import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getGemeinsamAktivPageModelSync,
	type IGemeinsamAktivPage,
	type IGemeinsamAktivHero,
	type IGemeinsamAktivContent,
	type IGemeinsamAktivGallery,
	type IGemeinsamAktivPartners,
} from "@/models/gemeinsam-aktiv-page.model";

export interface UpdateGemeinsamAktivPageInput {
	hero?: Partial<IGemeinsamAktivHero>;
	content?: Partial<IGemeinsamAktivContent>;
	gallery?: Partial<IGemeinsamAktivGallery>;
	partners?: Partial<IGemeinsamAktivPartners>;
}

export type GemeinsamAktivPageData = Omit<IGemeinsamAktivPage, keyof Document>;

class GemeinsamAktivPageRepository {
	async get(): Promise<GemeinsamAktivPageData> {
		await connectMongoose();
		const Model = getGemeinsamAktivPageModelSync();

		let page = await Model.findOne().lean<GemeinsamAktivPageData>();

		if (!page) {
			const created = await Model.create({});
			page = created.toObject() as GemeinsamAktivPageData;
		}

		return page;
	}

	async update(
		data: UpdateGemeinsamAktivPageInput
	): Promise<GemeinsamAktivPageData> {
		await connectMongoose();
		const Model = getGemeinsamAktivPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) {
			Object.entries(data.hero).forEach(([key, value]) => {
				if (value !== undefined) updateData[`hero.${key}`] = value;
			});
		}

		if (data.content) {
			const { blocks, ...restContent } = data.content;
			Object.entries(restContent).forEach(([key, value]) => {
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
		).lean<GemeinsamAktivPageData>();

		if (!page) throw new Error("Failed to update gemeinsam-aktiv page");

		return page;
	}
}

export const gemeinsamAktivPageRepository = new GemeinsamAktivPageRepository();
