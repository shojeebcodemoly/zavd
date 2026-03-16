import { connectMongoose } from "@/lib/db/db-connect";
import {
	getThemenPageModelSync,
	type IThemenHero,
	type IThemenIntegration,
	type IThemenIrakSyrien,
} from "@/models/themen-page.model";

function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

export interface ThemenPageData {
	_id: string;
	hero: IThemenHero;
	integration: IThemenIntegration;
	irakSyrien: IThemenIrakSyrien;
	updatedAt: Date;
	createdAt: Date;
}

export interface UpdateThemenPageInput {
	hero?: Partial<IThemenHero>;
	integration?: Partial<IThemenIntegration>;
	irakSyrien?: Partial<IThemenIrakSyrien>;
}

class ThemenPageRepository {
	async get(): Promise<ThemenPageData> {
		await connectMongoose();
		const ThemenPage = getThemenPageModelSync();

		let page = await ThemenPage.findOne().lean<ThemenPageData>();

		if (!page) {
			const created = await ThemenPage.create({});
			page = toPlainObject(created.toObject()) as unknown as ThemenPageData;
		}

		return toPlainObject(page);
	}

	async update(data: UpdateThemenPageInput): Promise<ThemenPageData> {
		await connectMongoose();
		const ThemenPage = getThemenPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) updateData.hero = data.hero;
		if (data.integration) updateData.integration = data.integration;
		if (data.irakSyrien) updateData.irakSyrien = data.irakSyrien;

		const page = await ThemenPage.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, strict: false }
		).lean<ThemenPageData>();

		if (!page) throw new Error("Failed to update themen page");

		return toPlainObject(page);
	}
}

export const themenPageRepository = new ThemenPageRepository();
