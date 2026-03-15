import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getProjektePageModelSync,
	type IProjektePage,
	type IProjekteHero,
	type IProjekteIntro,
	type IProjekteProjectsSection,
} from "@/models/projekte-page.model";

export interface UpdateProjektePageInput {
	hero?: Partial<IProjekteHero>;
	intro?: Partial<IProjekteIntro>;
	projects?: Partial<IProjekteProjectsSection>;
}

export type ProjektePageData = Omit<IProjektePage, keyof Document>;

class ProjektePageRepository {
	async get(): Promise<ProjektePageData> {
		await connectMongoose();
		const Model = getProjektePageModelSync();

		let page = await Model.findOne().lean<ProjektePageData>();

		if (!page) {
			const created = await Model.create({});
			page = created.toObject() as ProjektePageData;
		}

		return page;
	}

	async update(data: UpdateProjektePageInput): Promise<ProjektePageData> {
		await connectMongoose();
		const Model = getProjektePageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) {
			Object.entries(data.hero).forEach(([key, value]) => {
				if (value !== undefined) updateData[`hero.${key}`] = value;
			});
		}

		if (data.intro) {
			const { images, ...restIntro } = data.intro;
			Object.entries(restIntro).forEach(([key, value]) => {
				if (value !== undefined) updateData[`intro.${key}`] = value;
			});
			if (images !== undefined) updateData["intro.images"] = images;
		}

		if (data.projects) {
			const { items, categories, ...restProjects } = data.projects;
			Object.entries(restProjects).forEach(([key, value]) => {
				if (value !== undefined) updateData[`projects.${key}`] = value;
			});
			if (categories !== undefined) updateData["projects.categories"] = categories;
			if (items !== undefined) updateData["projects.items"] = items;
		}

		const page = await Model.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<ProjektePageData>();

		if (!page) throw new Error("Failed to update projekte page");

		return page;
	}
}

export const projektePageRepository = new ProjektePageRepository();
