import { connectMongoose } from "@/lib/db/db-connect";
import {
	getMissionWertePageModelSync,
	type IMissionWerteHero,
	type IMissionWerteIntro,
	type IMissionWerteValue,
	type IMissionWerteStats,
	type IMissionWerteTeam,
	type IMissionWerteGoals,
	type IMissionWerteApproach,
	type IMissionWertePartners,
} from "@/models/mission-werte-page.model";

function toPlainObject<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

export interface MissionWertePageData {
	_id: string;
	hero: IMissionWerteHero;
	intro: IMissionWerteIntro;
	values: IMissionWerteValue[];
	stats: IMissionWerteStats;
	team: IMissionWerteTeam;
	goals: IMissionWerteGoals;
	approach: IMissionWerteApproach;
	partners: IMissionWertePartners;
	updatedAt: Date;
	createdAt: Date;
}

export interface UpdateMissionWertePageInput {
	hero?: Partial<IMissionWerteHero>;
	intro?: Partial<IMissionWerteIntro>;
	values?: IMissionWerteValue[];
	stats?: Partial<IMissionWerteStats>;
	team?: Partial<IMissionWerteTeam>;
	goals?: Partial<IMissionWerteGoals>;
	approach?: Partial<IMissionWerteApproach>;
	partners?: Partial<IMissionWertePartners>;
}

class MissionWertePageRepository {
	async get(): Promise<MissionWertePageData> {
		await connectMongoose();
		const Model = getMissionWertePageModelSync();

		let page = await Model.findOne().lean<MissionWertePageData>();

		if (!page) {
			const created = await Model.create({});
			page = toPlainObject(created.toObject()) as unknown as MissionWertePageData;
		}

		return toPlainObject(page);
	}

	async update(data: UpdateMissionWertePageInput): Promise<MissionWertePageData> {
		await connectMongoose();
		const Model = getMissionWertePageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.hero) updateData.hero = data.hero;
		if (data.intro) updateData.intro = data.intro;
		if (data.values !== undefined) updateData.values = data.values;
		if (data.stats) updateData.stats = data.stats;
		if (data.team) updateData.team = data.team;
		if (data.goals) updateData.goals = data.goals;
		if (data.approach) updateData.approach = data.approach;
		if (data.partners) updateData.partners = data.partners;

		const page = await Model.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<MissionWertePageData>();

		if (!page) throw new Error("Failed to update mission-werte page");

		return toPlainObject(page);
	}
}

export const missionWertePageRepository = new MissionWertePageRepository();
