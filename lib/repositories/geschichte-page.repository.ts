import { connectMongoose } from "@/lib/db/db-connect";
import {
	getGeschichtePageModelSync,
	type IGeschichteHero,
	type IGeschichteStat,
	type IGeschichteIntro,
	type IGeschichteArticle,
	type IGeschichteEvent,
} from "@/models/geschichte-page.model";

function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

export interface GeschichtePageData {
	_id: string;
	hero: IGeschichteHero;
	stats: IGeschichteStat[];
	intro: IGeschichteIntro;
	articles: IGeschichteArticle[];
	events: IGeschichteEvent[];
	updatedAt: Date;
	createdAt: Date;
}

export interface UpdateGeschichtePageInput {
	hero?: Partial<IGeschichteHero>;
	stats?: IGeschichteStat[];
	intro?: Partial<IGeschichteIntro>;
	articles?: IGeschichteArticle[];
	events?: IGeschichteEvent[];
}

class GeschichtePageRepository {
	async get(): Promise<GeschichtePageData> {
		await connectMongoose();
		const Model = getGeschichtePageModelSync();

		let page = await Model.findOne().lean<GeschichtePageData>();

		if (!page) {
			const created = await Model.create({});
			page = toPlainObject(created.toObject()) as unknown as GeschichtePageData;
		}

		return toPlainObject(page);
	}

	async update(data: UpdateGeschichtePageInput): Promise<GeschichtePageData> {
		await connectMongoose();
		const Model = getGeschichtePageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) updateData.hero = data.hero;
		if (data.stats !== undefined) updateData.stats = data.stats;
		if (data.intro) updateData.intro = data.intro;
		if (data.articles !== undefined) updateData.articles = data.articles;
		if (data.events !== undefined) updateData.events = data.events;

		const page = await Model.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<GeschichtePageData>();

		if (!page) throw new Error("Failed to update geschichte page");

		return toPlainObject(page);
	}
}

export const geschichtePageRepository = new GeschichtePageRepository();
