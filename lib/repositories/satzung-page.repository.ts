import { connectMongoose } from "@/lib/db/db-connect";
import {
	getSatzungPageModelSync,
	type ISatzungHero,
	type ISatzungSearchSection,
	type ISatzungFaqSection,
	type ISatzungTestimonialsSection,
} from "@/models/satzung-page.model";

function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

export interface SatzungPageData {
	_id: string;
	hero: ISatzungHero;
	searchSection: ISatzungSearchSection;
	faqSection: ISatzungFaqSection;
	testimonials: ISatzungTestimonialsSection;
	updatedAt: Date;
	createdAt: Date;
}

export interface UpdateSatzungPageInput {
	hero?: Partial<ISatzungHero>;
	searchSection?: Partial<ISatzungSearchSection>;
	faqSection?: Partial<ISatzungFaqSection>;
	testimonials?: Partial<ISatzungTestimonialsSection>;
}

class SatzungPageRepository {
	async get(): Promise<SatzungPageData> {
		await connectMongoose();
		const Model = getSatzungPageModelSync();

		let page = await Model.findOne().lean<SatzungPageData>();

		if (!page) {
			const created = await Model.create({});
			page = toPlainObject(created.toObject()) as unknown as SatzungPageData;
		}

		return toPlainObject(page);
	}

	async update(data: UpdateSatzungPageInput): Promise<SatzungPageData> {
		await connectMongoose();
		const Model = getSatzungPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) updateData.hero = data.hero;
		if (data.searchSection) updateData.searchSection = data.searchSection;
		if (data.faqSection) updateData.faqSection = data.faqSection;
		if (data.testimonials) updateData.testimonials = data.testimonials;

		const page = await Model.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<SatzungPageData>();

		if (!page) throw new Error("Failed to update satzung page");

		return toPlainObject(page);
	}
}

export const satzungPageRepository = new SatzungPageRepository();
