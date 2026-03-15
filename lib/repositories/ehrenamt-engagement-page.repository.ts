import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getEhrenamtEngagementPageModelSync,
	type IEhrenamtEngagementPage,
	type IEhrenamtEngagementHero,
	type IEhrenamtEngagementGallery,
	type IEhrenamtEngagementContent,
	type IEhrenamtEngagementPartners,
} from "@/models/ehrenamt-engagement-page.model";

export interface UpdateEhrenamtEngagementPageInput {
	hero?: Partial<IEhrenamtEngagementHero>;
	gallery?: Partial<IEhrenamtEngagementGallery>;
	content?: Partial<IEhrenamtEngagementContent>;
	partners?: Partial<IEhrenamtEngagementPartners>;
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

		if (data.gallery !== undefined) {
			if (data.gallery.images !== undefined) updateData["gallery.images"] = data.gallery.images;
			if (data.gallery.title !== undefined) updateData["gallery.title"] = data.gallery.title;
			if (data.gallery.subtitle !== undefined) updateData["gallery.subtitle"] = data.gallery.subtitle;
		}

		if (data.content !== undefined) {
			if (data.content.blocks !== undefined) updateData["content.blocks"] = data.content.blocks;
			if (data.content.title !== undefined) updateData["content.title"] = data.content.title;
			if (data.content.body !== undefined) updateData["content.body"] = data.content.body;
			if (data.content.image !== undefined) updateData["content.image"] = data.content.image;
		}

		if (data.partners !== undefined) {
			if (data.partners.logos !== undefined) updateData["partners.logos"] = data.partners.logos;
			if (data.partners.heading !== undefined) updateData["partners.heading"] = data.partners.heading;
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
