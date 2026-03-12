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
}

const MissionWerteIntroSchema = new Schema<IMissionWerteIntro>(
	{
		taglineDe: { type: String },
		taglineEn: { type: String },
		headingDe: { type: String, default: "Unsere Mission" },
		headingEn: { type: String, default: "Our Mission" },
		paragraphDe: { type: String },
		paragraphEn: { type: String },
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
// MAIN DOCUMENT
// ============================================================================
export interface IMissionWertePage extends Document {
	hero: IMissionWerteHero;
	intro: IMissionWerteIntro;
	values: IMissionWerteValue[];
	createdAt: Date;
	updatedAt: Date;
}

const MissionWertePageSchema = new Schema<IMissionWertePage>(
	{
		hero: { type: MissionWerteHeroSchema, default: () => ({}) },
		intro: { type: MissionWerteIntroSchema, default: () => ({}) },
		values: { type: [MissionWerteValueSchema], default: [] },
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
