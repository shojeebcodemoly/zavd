import { connectMongoose } from "@/lib/db/db-connect";
import {
	getHumanitaereHilfePageModelSync,
	type IHumanitaereHilfeHero,
	type IHumanitaereHilfeLeft,
	type IHumanitaereHilfeMiddle,
	type IHumanitaereHilfeRight,
} from "@/models/humanitaere-hilfe-page.model";

function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

export interface HumanitaereHilfePageData {
	_id: string;
	hero: IHumanitaereHilfeHero;
	left: IHumanitaereHilfeLeft;
	middle: IHumanitaereHilfeMiddle;
	right: IHumanitaereHilfeRight;
	updatedAt: Date;
	createdAt: Date;
}

export interface UpdateHumanitaereHilfePageInput {
	hero?: Partial<IHumanitaereHilfeHero>;
	left?: Partial<IHumanitaereHilfeLeft>;
	middle?: Partial<IHumanitaereHilfeMiddle>;
	right?: Partial<IHumanitaereHilfeRight>;
}

class HumanitaereHilfePageRepository {
	async get(): Promise<HumanitaereHilfePageData> {
		await connectMongoose();
		const Model = getHumanitaereHilfePageModelSync();
		let page = await Model.findOne().lean<HumanitaereHilfePageData>();
		if (!page) {
			const created = await Model.create({});
			page = toPlainObject(created.toObject()) as unknown as HumanitaereHilfePageData;
		}
		return toPlainObject(page);
	}

	async update(data: UpdateHumanitaereHilfePageInput): Promise<HumanitaereHilfePageData> {
		await connectMongoose();
		const Model = getHumanitaereHilfePageModelSync();
		const updateData: Record<string, unknown> = {};
		if (data.hero) updateData.hero = data.hero;
		if (data.left) updateData.left = data.left;
		if (data.middle) updateData.middle = data.middle;
		if (data.right) updateData.right = data.right;
		const page = await Model.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<HumanitaereHilfePageData>();
		if (!page) throw new Error("Failed to update humanitaere-hilfe page");
		return toPlainObject(page);
	}
}

export const humanitaereHilfePageRepository = new HumanitaereHilfePageRepository();
