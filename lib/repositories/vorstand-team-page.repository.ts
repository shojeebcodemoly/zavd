import { connectMongoose } from "@/lib/db/db-connect";
import {
	getVorstandTeamPageModelSync,
	type IVorstandTeamHero,
	type IVorstandSection,
	type ITeamSection,
} from "@/models/vorstand-team-page.model";

function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

export interface VorstandTeamPageData {
	_id: string;
	hero: IVorstandTeamHero;
	vorstand: IVorstandSection;
	team: ITeamSection;
	updatedAt: Date;
	createdAt: Date;
}

export interface UpdateVorstandTeamPageInput {
	hero?: Partial<IVorstandTeamHero>;
	vorstand?: Partial<IVorstandSection>;
	team?: Partial<ITeamSection>;
}

class VorstandTeamPageRepository {
	async get(): Promise<VorstandTeamPageData> {
		await connectMongoose();
		const Model = getVorstandTeamPageModelSync();

		let page = await Model.findOne().lean<VorstandTeamPageData>();

		if (!page) {
			const created = await Model.create({});
			page = toPlainObject(created.toObject()) as unknown as VorstandTeamPageData;
		}

		return toPlainObject(page);
	}

	async update(data: UpdateVorstandTeamPageInput): Promise<VorstandTeamPageData> {
		await connectMongoose();
		const Model = getVorstandTeamPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) updateData.hero = data.hero;
		if (data.vorstand) updateData.vorstand = data.vorstand;
		if (data.team) updateData.team = data.team;

		const page = await Model.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<VorstandTeamPageData>();

		if (!page) throw new Error("Failed to update vorstand-team page");

		return toPlainObject(page);
	}
}

export const vorstandTeamPageRepository = new VorstandTeamPageRepository();
