import { connectMongoose } from "@/lib/db/db-connect";
import {
	getAngeboteBeratungPageModelSync,
	type IAngeboteBeratungHero,
	type IAngeboteFluchtAsyl,
	type IAngeboteNamensaenderung,
	type IAngeboteBeratung,
	type IAngeboteWichtigeLinks,
} from "@/models/angebote-beratung-page.model";

function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

export interface AngeboteBeratungPageData {
	_id: string;
	hero: IAngeboteBeratungHero;
	fluchtAsyl: IAngeboteFluchtAsyl;
	namensaenderung: IAngeboteNamensaenderung;
	beratung: IAngeboteBeratung;
	wichtigeLinks: IAngeboteWichtigeLinks;
	updatedAt: Date;
	createdAt: Date;
}

export interface UpdateAngeboteBeratungPageInput {
	hero?: Partial<IAngeboteBeratungHero>;
	fluchtAsyl?: Partial<IAngeboteFluchtAsyl>;
	namensaenderung?: Partial<IAngeboteNamensaenderung>;
	beratung?: Partial<IAngeboteBeratung>;
	wichtigeLinks?: Partial<IAngeboteWichtigeLinks>;
}

class AngeboteBeratungPageRepository {
	async get(): Promise<AngeboteBeratungPageData> {
		await connectMongoose();
		const AngeboteBeratungPage = getAngeboteBeratungPageModelSync();

		let page = await AngeboteBeratungPage.findOne().lean<AngeboteBeratungPageData>();

		if (!page) {
			const created = await AngeboteBeratungPage.create({});
			page = toPlainObject(created.toObject()) as unknown as AngeboteBeratungPageData;
		}

		return toPlainObject(page);
	}

	async update(data: UpdateAngeboteBeratungPageInput): Promise<AngeboteBeratungPageData> {
		await connectMongoose();
		const AngeboteBeratungPage = getAngeboteBeratungPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) updateData.hero = data.hero;
		if (data.fluchtAsyl) updateData.fluchtAsyl = data.fluchtAsyl;
		if (data.namensaenderung) updateData.namensaenderung = data.namensaenderung;
		if (data.beratung) updateData.beratung = data.beratung;
		if (data.wichtigeLinks) updateData.wichtigeLinks = data.wichtigeLinks;

		const page = await AngeboteBeratungPage.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<AngeboteBeratungPageData>();

		if (!page) throw new Error("Failed to update angebote-beratung page");

		return toPlainObject(page);
	}
}

export const angeboteBeratungPageRepository = new AngeboteBeratungPageRepository();
