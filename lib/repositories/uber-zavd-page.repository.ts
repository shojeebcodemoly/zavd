import { connectMongoose } from "@/lib/db/db-connect";
import {
	getUberZavdPageModelSync,
	type IUberZavdHero,
	type IUberZavdIntro,
	type IUberZavdAddress,
	type IUberZavdStructure,
	type IUberZavdTeam,
	type IUberZavdOffice,
	type IUberZavdGallery,
	type IUberZavdCta,
} from "@/models/uber-zavd-page.model";

function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

export interface UberZavdPageData {
	_id: string;
	hero: IUberZavdHero;
	intro: IUberZavdIntro;
	address: IUberZavdAddress;
	structure: IUberZavdStructure;
	team: IUberZavdTeam;
	office: IUberZavdOffice;
	gallery: IUberZavdGallery;
	cta: IUberZavdCta;
	updatedAt: Date;
	createdAt: Date;
}

export interface UpdateUberZavdPageInput {
	hero?: Partial<IUberZavdHero>;
	intro?: Partial<IUberZavdIntro>;
	address?: Partial<IUberZavdAddress>;
	structure?: Partial<IUberZavdStructure>;
	team?: Partial<IUberZavdTeam>;
	office?: Partial<IUberZavdOffice>;
	gallery?: Partial<IUberZavdGallery>;
	cta?: Partial<IUberZavdCta>;
}

class UberZavdPageRepository {
	async get(): Promise<UberZavdPageData> {
		await connectMongoose();
		const UberZavdPage = getUberZavdPageModelSync();

		let page = await UberZavdPage.findOne().lean<UberZavdPageData>();

		if (!page) {
			const created = await UberZavdPage.create({});
			page = toPlainObject(created.toObject()) as unknown as UberZavdPageData;
		}

		return toPlainObject(page);
	}

	async update(data: UpdateUberZavdPageInput): Promise<UberZavdPageData> {
		await connectMongoose();
		const UberZavdPage = getUberZavdPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) updateData.hero = data.hero;
		if (data.intro) updateData.intro = data.intro;
		if (data.address) updateData.address = data.address;
		if (data.structure) updateData.structure = data.structure;
		if (data.team) updateData.team = data.team;
		if (data.office) updateData.office = data.office;
		if (data.gallery) updateData.gallery = data.gallery;
		if (data.cta) updateData.cta = data.cta;

		const page = await UberZavdPage.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<UberZavdPageData>();

		if (!page) throw new Error("Failed to update uber-zavd page");

		return toPlainObject(page);
	}
}

export const uberZavdPageRepository = new UberZavdPageRepository();
