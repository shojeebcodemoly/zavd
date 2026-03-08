import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import {
	getTeamPageModelSync,
	type ITeamPage,
	type ITeamSectionVisibility,
	type ITeamHeroSection,
	type ITeamStat,
	type ITeamMember,
	type ITeamValuesSection,
	type ITeamJoinUsSection,
	type ITeamContactSection,
	type ITeamPageSeo,
} from "@/models/team-page.model";

/**
 * Type for updating team page
 */
export interface UpdateTeamPageInput {
	sectionVisibility?: ITeamSectionVisibility;
	hero?: Partial<ITeamHeroSection>;
	stats?: ITeamStat[];
	teamMembers?: ITeamMember[];
	valuesSection?: Partial<ITeamValuesSection>;
	joinUs?: Partial<ITeamJoinUsSection>;
	contact?: Partial<ITeamContactSection>;
	seo?: Partial<ITeamPageSeo>;
}

/**
 * Plain object type for TeamPage
 */
export type TeamPageData = Omit<ITeamPage, keyof Document>;

/**
 * Serialize MongoDB document to plain object (removes ObjectId, Date special methods)
 */
function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

/**
 * TeamPage Repository
 */
class TeamPageRepository {
	/**
	 * Get team page content
	 */
	async get(): Promise<TeamPageData> {
		await connectMongoose();
		const TeamPage = getTeamPageModelSync();

		let teamPage = await TeamPage.findOne().lean<TeamPageData>();

		if (!teamPage) {
			const created = await TeamPage.create({});
			teamPage = created.toObject() as TeamPageData;
		}

		return serialize(teamPage);
	}

	/**
	 * Update team page content
	 */
	async update(data: UpdateTeamPageInput): Promise<TeamPageData> {
		await connectMongoose();
		const TeamPage = getTeamPageModelSync();

		const updateData: Record<string, unknown> = {};

		if (data.sectionVisibility) {
			updateData.sectionVisibility = data.sectionVisibility;
		}

		if (data.hero) {
			Object.entries(data.hero).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`hero.${key}`] = value;
				}
			});
		}

		if (data.stats) {
			updateData.stats = data.stats;
		}

		if (data.teamMembers) {
			updateData.teamMembers = data.teamMembers;
		}

		if (data.valuesSection) {
			Object.entries(data.valuesSection).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`valuesSection.${key}`] = value;
				}
			});
		}

		if (data.joinUs) {
			Object.entries(data.joinUs).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`joinUs.${key}`] = value;
				}
			});
		}

		if (data.contact) {
			Object.entries(data.contact).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`contact.${key}`] = value;
				}
			});
		}

		if (data.seo) {
			Object.entries(data.seo).forEach(([key, value]) => {
				if (value !== undefined) {
					updateData[`seo.${key}`] = value;
				}
			});
		}

		const teamPage = await TeamPage.findOneAndUpdate(
			{},
			{ $set: updateData },
			{ new: true, upsert: true, runValidators: true }
		).lean<TeamPageData>();

		if (!teamPage) {
			throw new Error("Failed to update team page");
		}

		return serialize(teamPage);
	}

	/**
	 * Get SEO settings only
	 */
	async getSeo(): Promise<ITeamPageSeo> {
		const teamPage = await this.get();
		return teamPage.seo;
	}
}

// Export singleton instance
export const teamPageRepository = new TeamPageRepository();
