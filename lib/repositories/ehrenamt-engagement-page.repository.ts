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
			if (data.gallery.titleDe !== undefined) updateData["gallery.titleDe"] = data.gallery.titleDe;
			if (data.gallery.titleEn !== undefined) updateData["gallery.titleEn"] = data.gallery.titleEn;
			if (data.gallery.subtitleDe !== undefined) updateData["gallery.subtitleDe"] = data.gallery.subtitleDe;
			if (data.gallery.subtitleEn !== undefined) updateData["gallery.subtitleEn"] = data.gallery.subtitleEn;
		}

		if (data.content !== undefined) {
			if (data.content.blocks !== undefined) updateData["content.blocks"] = data.content.blocks;
			if (data.content.titleDe !== undefined) updateData["content.titleDe"] = data.content.titleDe;
			if (data.content.titleEn !== undefined) updateData["content.titleEn"] = data.content.titleEn;
			if (data.content.bodyDe !== undefined) updateData["content.bodyDe"] = data.content.bodyDe;
			if (data.content.bodyEn !== undefined) updateData["content.bodyEn"] = data.content.bodyEn;
			if (data.content.image !== undefined) updateData["content.image"] = data.content.image;
		}

		if (data.partners !== undefined) {
			if (data.partners.logos !== undefined) updateData["partners.logos"] = data.partners.logos;
			if (data.partners.headingDe !== undefined) updateData["partners.headingDe"] = data.partners.headingDe;
			if (data.partners.headingEn !== undefined) updateData["partners.headingEn"] = data.partners.headingEn;
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
