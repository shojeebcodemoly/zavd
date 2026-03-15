import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IMissionWerteHero {
	taglineDe?: string;
	taglineEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

const MissionWerteHeroSchema = new Schema<IMissionWerteHero>(
	{
		taglineDe: { type: String, default: "Unsere Grundwerte" },
		taglineEn: { type: String, default: "Our Core Values" },
		titleDe: { type: String, default: "Mission & Werte" },
		titleEn: { type: String, default: "Mission & Values" },
		subtitleDe: { type: String, default: "Was uns antreibt und wie wir handeln." },
		subtitleEn: { type: String, default: "What drives us and how we act." },
		image: { type: String, default: "/images/about/aboutbanner.jpg" },
	},
	{ _id: false }
);

// ============================================================================
// INTRO SECTION
// ============================================================================
export interface IMissionWerteIntro {
	taglineDe?: string;
	taglineEn?: string;
	headingDe?: string;
	headingEn?: string;
	paragraphDe?: string;
	paragraphEn?: string;
	image?: string;
}

const MissionWerteIntroSchema = new Schema<IMissionWerteIntro>(
	{
		taglineDe: { type: String },
		taglineEn: { type: String },
		headingDe: { type: String, default: "We Working For" },
		headingEn: { type: String, default: "We Working For" },
		paragraphDe: { type: String },
		paragraphEn: { type: String },
		image: { type: String, default: "/images/about/office1pg.jpg" },
	},
	{ _id: false }
);

// ============================================================================
// VALUE ITEM
// ============================================================================
export interface IMissionWerteValue {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	image?: string;
}

const MissionWerteValueSchema = new Schema<IMissionWerteValue>(
	{
		titleDe: { type: String },
		titleEn: { type: String },
		descriptionDe: { type: String },
		descriptionEn: { type: String },
		image: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// STATS / ZAHLEN & FAKTEN
// ============================================================================
export interface IMissionWerteStat {
	value?: number;
	suffix?: string;
	labelDe?: string;
	labelEn?: string;
}

export interface IMissionWerteStats {
	headingDe?: string;
	headingEn?: string;
	items: IMissionWerteStat[];
}

const MissionWerteStatSchema = new Schema<IMissionWerteStat>(
	{
		value: { type: Number, default: 0 },
		suffix: { type: String, default: "+" },
		labelDe: { type: String },
		labelEn: { type: String },
	},
	{ _id: false }
);

const MissionWerteStatsSchema = new Schema<IMissionWerteStats>(
	{
		headingDe: { type: String, default: "Zahlen & Fakten" },
		headingEn: { type: String, default: "Facts & Figures" },
		items: { type: [MissionWerteStatSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// TEAM / UNSER TEAM
// ============================================================================
export interface IMissionWerteTeamMember {
	name?: string;
	roleDe?: string;
	roleEn?: string;
	image?: string;
}

export interface IMissionWerteTeam {
	headingDe?: string;
	headingEn?: string;
	members: IMissionWerteTeamMember[];
}

const MissionWerteTeamMemberSchema = new Schema<IMissionWerteTeamMember>(
	{
		name: { type: String },
		roleDe: { type: String },
		roleEn: { type: String },
		image: { type: String },
	},
	{ _id: false }
);

const MissionWerteTeamSchema = new Schema<IMissionWerteTeam>(
	{
		headingDe: { type: String, default: "Unser Team" },
		headingEn: { type: String, default: "Our Team" },
		members: { type: [MissionWerteTeamMemberSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// GOALS / ZIELE
// ============================================================================
export interface IMissionWerteGoal {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

export interface IMissionWerteGoals {
	headingDe?: string;
	headingEn?: string;
	items: IMissionWerteGoal[];
}

const MissionWerteGoalSchema = new Schema<IMissionWerteGoal>(
	{
		titleDe: { type: String },
		titleEn: { type: String },
		descriptionDe: { type: String },
		descriptionEn: { type: String },
	},
	{ _id: false }
);

const MissionWerteGoalsSchema = new Schema<IMissionWerteGoals>(
	{
		headingDe: { type: String, default: "Unsere Ziele" },
		headingEn: { type: String, default: "Our Goals" },
		items: { type: [MissionWerteGoalSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// APPROACH / UNSERE ANSATZ
// ============================================================================
export interface IMissionWerteStep {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

export interface IMissionWerteApproach {
	headingDe?: string;
	headingEn?: string;
	steps: IMissionWerteStep[];
}

const MissionWerteStepSchema = new Schema<IMissionWerteStep>(
	{
		titleDe: { type: String },
		titleEn: { type: String },
		descriptionDe: { type: String },
		descriptionEn: { type: String },
	},
	{ _id: false }
);

const MissionWerteApproachSchema = new Schema<IMissionWerteApproach>(
	{
		headingDe: { type: String, default: "Unser Ansatz" },
		headingEn: { type: String, default: "Our Approach" },
		steps: { type: [MissionWerteStepSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// PARTNERS / PARTNER & FÖRDER
// ============================================================================
export interface IMissionWertePartner {
	name?: string;
	logo?: string;
	url?: string;
}

export interface IMissionWertePartners {
	headingDe?: string;
	headingEn?: string;
	items: IMissionWertePartner[];
}

const MissionWertePartnerSchema = new Schema<IMissionWertePartner>(
	{
		name: { type: String },
		logo: { type: String },
		url: { type: String },
	},
	{ _id: false }
);

const MissionWertePartnersSchema = new Schema<IMissionWertePartners>(
	{
		headingDe: { type: String, default: "Partner & Förderer" },
		headingEn: { type: String, default: "Partners & Supporters" },
		items: { type: [MissionWertePartnerSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// MAIN DOCUMENT
// ============================================================================
export interface IMissionWertePage extends Document {
	hero: IMissionWerteHero;
	intro: IMissionWerteIntro;
	values: IMissionWerteValue[];
	stats: IMissionWerteStats;
	team: IMissionWerteTeam;
	goals: IMissionWerteGoals;
	approach: IMissionWerteApproach;
	partners: IMissionWertePartners;
	createdAt: Date;
	updatedAt: Date;
}

const MissionWertePageSchema = new Schema<IMissionWertePage>(
	{
		hero: { type: MissionWerteHeroSchema, default: () => ({}) },
		intro: { type: MissionWerteIntroSchema, default: () => ({}) },
		values: { type: [MissionWerteValueSchema], default: [] },
		stats: { type: MissionWerteStatsSchema, default: () => ({}) },
		team: { type: MissionWerteTeamSchema, default: () => ({}) },
		goals: { type: MissionWerteGoalsSchema, default: () => ({}) },
		approach: { type: MissionWerteApproachSchema, default: () => ({}) },
		partners: { type: MissionWertePartnersSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

let MissionWertePageModel: Model<IMissionWertePage> | null = null;

export function getMissionWertePageModelSync(): Model<IMissionWertePage> {
	if (MissionWertePageModel) return MissionWertePageModel;
	MissionWertePageModel =
		(mongoose.models.MissionWertePage as Model<IMissionWertePage>) ||
		mongoose.model<IMissionWertePage>("MissionWertePage", MissionWertePageSchema);
	return MissionWertePageModel;
}

export async function getMissionWertePageModel(): Promise<Model<IMissionWertePage>> {
	await connectMongoose();
	return getMissionWertePageModelSync();
}
