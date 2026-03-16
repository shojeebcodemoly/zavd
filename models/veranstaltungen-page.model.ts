import mongoose, { Schema, type Model } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

export interface IVeranstaltungenHero {
	backgroundImage?: string;
	titleDe?: string;
	titleEn?: string;
	subtitle?: string;
}

export interface IVeranstaltungenPressSection {
	backgroundImage?: string;
	heading?: string;
	subtext?: string;
	email?: string;
}

export interface IVeranstaltungenPage {
	hero: IVeranstaltungenHero;
	pressSection: IVeranstaltungenPressSection;
}

const VeranstaltungenHeroSchema = new Schema<IVeranstaltungenHero>(
	{
		backgroundImage: { type: String },
		titleDe: { type: String, default: "Veranstaltungen" },
		titleEn: { type: String, default: "Events" },
		subtitle: { type: String },
	},
	{ _id: false }
);

const VeranstaltungenPressSectionSchema = new Schema<IVeranstaltungenPressSection>(
	{
		backgroundImage: { type: String },
		heading: { type: String, default: "Upcoming Events" },
		subtext: { type: String, default: "Simply contact us at" },
		email: { type: String, default: "info@zavd.de" },
	},
	{ _id: false }
);

const VeranstaltungenPageSchema = new Schema<IVeranstaltungenPage>(
	{
		hero: { type: VeranstaltungenHeroSchema, default: () => ({}) },
		pressSection: { type: VeranstaltungenPressSectionSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

export function getVeranstaltungenPageModelSync(): Model<IVeranstaltungenPage> {
	if (process.env.NODE_ENV !== "production" && mongoose.models.VeranstaltungenPage) {
		delete (mongoose.models as Record<string, unknown>).VeranstaltungenPage;
	}
	return (
		(mongoose.models.VeranstaltungenPage as Model<IVeranstaltungenPage>) ||
		mongoose.model<IVeranstaltungenPage>("VeranstaltungenPage", VeranstaltungenPageSchema)
	);
}

export async function getVeranstaltungenPageModel(): Promise<Model<IVeranstaltungenPage>> {
	await connectMongoose();
	return getVeranstaltungenPageModelSync();
}
