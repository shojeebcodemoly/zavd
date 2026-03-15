import mongoose, { Schema, type Model } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

export interface INachrichtenHero {
	backgroundImage?: string;
	titleDe?: string;
	titleEn?: string;
	subtitle?: string;
}

export interface INachrichtenPressSection {
	backgroundImage?: string;
	heading?: string;
	subtext?: string;
	email?: string;
}

export interface INachrichtenPage {
	hero: INachrichtenHero;
	pressSection: INachrichtenPressSection;
}

const NachrichtenHeroSchema = new Schema<INachrichtenHero>(
	{
		backgroundImage: { type: String },
		titleDe: { type: String, default: "Nachrichten" },
		titleEn: { type: String, default: "News" },
		subtitle: { type: String },
	},
	{ _id: false }
);

const NachrichtenPressSectionSchema = new Schema<INachrichtenPressSection>(
	{
		backgroundImage: { type: String },
		heading: { type: String, default: "Latest press releases" },
		subtext: { type: String, default: "Simply contact us at" },
		email: { type: String, default: "info@zavd.de" },
	},
	{ _id: false }
);

const NachrichtenPageSchema = new Schema<INachrichtenPage>(
	{
		hero: { type: NachrichtenHeroSchema, default: () => ({}) },
		pressSection: { type: NachrichtenPressSectionSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

export function getNachrichtenPageModelSync(): Model<INachrichtenPage> {
	if (process.env.NODE_ENV !== "production" && mongoose.models.NachrichtenPage) {
		delete (mongoose.models as Record<string, unknown>).NachrichtenPage;
	}
	return (
		(mongoose.models.NachrichtenPage as Model<INachrichtenPage>) ||
		mongoose.model<INachrichtenPage>("NachrichtenPage", NachrichtenPageSchema)
	);
}

export async function getNachrichtenPageModel(): Promise<Model<INachrichtenPage>> {
	await connectMongoose();
	return getNachrichtenPageModelSync();
}
