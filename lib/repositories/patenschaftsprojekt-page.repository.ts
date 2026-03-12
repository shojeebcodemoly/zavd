import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getPatenschaftsprojektPageModelSync,
	type IPatenschaftsprojektPage,
	type IPatenschaftsprojektHero,
	type IPatenschaftsprojektContent,
	type IPatenschaftsprojektGallery,
	type IPatenschaftsprojektPartners,
} from "@/models/patenschaftsprojekt-page.model";

export interface UpdatePatenschaftsprojektPageInput {
	hero?: Partial<IPatenschaftsprojektHero>;
	content?: Partial<IPatenschaftsprojektContent>;
	gallery?: Partial<IPatenschaftsprojektGallery>;
	partners?: Partial<IPatenschaftsprojektPartners>;
}

export type PatenschaftsprojektPageData = Omit<
	IPatenschaftsprojektPage,
	keyof Document
>;

class PatenschaftsprojektPageRepository {
	async get(): Promise<PatenschaftsprojektPageData> {
		await connectMongoose();
		const Model = getPatenschaftsprojektPageModelSync();

		let page = await Model.findOne().lean<PatenschaftsprojektPageData>();

		if (!page) {
			const created = await Model.create({});
			page = created.toObject() as PatenschaftsprojektPageData;
		}

		return page;
	}

	async update(
		data: UpdatePatenschaftsprojektPageInput
	): Promise<PatenschaftsprojektPageData> {
		await connectMongoose();
		const Model = getPatenschaftsprojektPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) {
			Object.entries(data.hero).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`hero.${key}`] = value;
				}
			});
		}

		if (data.content) {
			const { blocks, ...restContent } = data.content;
			Object.entries(restContent).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`content.${key}`] = value;
				}
			});
			if (blocks !== undefined) {
				updateData["content.blocks"] = blocks;
			}
		}

		if (data.gallery) {
			const { images, ...rest } = data.gallery;
			Object.entries(rest).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`gallery.${key}`] = value;
				}
			});
			if (images !== undefined) {
				updateData["gallery.images"] = images;
			}
		}

		if (data.partners) {
			const { logos, ...rest } = data.partners;
			Object.entries(rest).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`partners.${key}`] = value;
				}
			});
			if (logos !== undefined) {
				updateData["partners.logos"] = logos;
			}
		}

		const page = await Model.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<PatenschaftsprojektPageData>();

		if (!page) throw new Error("Failed to update patenschaftsprojekt page");

		return page;
	}

	async getHero(): Promise<IPatenschaftsprojektHero> {
		const page = await this.get();
		return page.hero;
	}
}

export const patenschaftsprojektPageRepository =
	new PatenschaftsprojektPageRepository();
