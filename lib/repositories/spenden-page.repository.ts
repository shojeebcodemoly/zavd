import { connectMongoose } from "@/lib/db/db-connect";
import {
	getSpendenPageModelSync,
	type ISpendenHero,
	type ISpendenCards,
} from "@/models/spenden-page.model";

function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

export interface SpendenPageData {
	_id: string;
	hero: ISpendenHero;
	cards: ISpendenCards;
	updatedAt: Date;
	createdAt: Date;
}

export interface UpdateSpendenPageInput {
	hero?: Partial<ISpendenHero>;
	cards?: Partial<ISpendenCards>;
}

class SpendenPageRepository {
	async get(): Promise<SpendenPageData> {
		await connectMongoose();
		const Model = getSpendenPageModelSync();
		let page = await Model.findOne().lean<SpendenPageData>();
		if (!page) {
			const created = await Model.create({});
			page = toPlainObject(created.toObject()) as unknown as SpendenPageData;
		}
		return toPlainObject(page);
	}

	async update(data: UpdateSpendenPageInput): Promise<SpendenPageData> {
		await connectMongoose();
		const Model = getSpendenPageModelSync();
		const updateData: Record<string, unknown> = {};
		if (data.hero) updateData.hero = data.hero;
		if (data.cards) updateData.cards = data.cards;
		const page = await Model.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<SpendenPageData>();
		if (!page) throw new Error("Failed to update spenden page");
		return toPlainObject(page);
	}
}

export const spendenPageRepository = new SpendenPageRepository();
