import { connectMongoose } from "@/lib/db/db-connect";
import {
	getZavdSpendenkontoPageModelSync,
	type IZavdSpendenkontoHero,
	type IZavdSpendenkontoLeft,
	type IZavdSpendenkontoMiddle,
	type IZavdSpendenkontoRight,
} from "@/models/zavd-spendenkonto-page.model";

function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

export interface ZavdSpendenkontoPageData {
	_id: string;
	hero: IZavdSpendenkontoHero;
	left: IZavdSpendenkontoLeft;
	middle: IZavdSpendenkontoMiddle;
	right: IZavdSpendenkontoRight;
	updatedAt: Date;
	createdAt: Date;
}

export interface UpdateZavdSpendenkontoPageInput {
	hero?: Partial<IZavdSpendenkontoHero>;
	left?: Partial<IZavdSpendenkontoLeft>;
	middle?: Partial<IZavdSpendenkontoMiddle>;
	right?: Partial<IZavdSpendenkontoRight>;
}

class ZavdSpendenkontoPageRepository {
	async get(): Promise<ZavdSpendenkontoPageData> {
		await connectMongoose();
		const Model = getZavdSpendenkontoPageModelSync();
		let page = await Model.findOne().lean<ZavdSpendenkontoPageData>();
		if (!page) {
			const created = await Model.create({});
			page = toPlainObject(created.toObject()) as unknown as ZavdSpendenkontoPageData;
		}
		return toPlainObject(page);
	}

	async update(data: UpdateZavdSpendenkontoPageInput): Promise<ZavdSpendenkontoPageData> {
		await connectMongoose();
		const Model = getZavdSpendenkontoPageModelSync();
		const updateData: Record<string, unknown> = {};
		if (data.hero) updateData.hero = data.hero;
		if (data.left) updateData.left = data.left;
		if (data.middle) updateData.middle = data.middle;
		if (data.right) updateData.right = data.right;
		const page = await Model.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<ZavdSpendenkontoPageData>();
		if (!page) throw new Error("Failed to update zavd-spendenkonto page");
		return toPlainObject(page);
	}
}

export const zavdSpendenkontoPageRepository = new ZavdSpendenkontoPageRepository();
