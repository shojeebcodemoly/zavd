import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

export interface ISpendenHero {
	taglineDe?: string;
	taglineEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

const SpendenHeroSchema = new Schema<ISpendenHero>(
	{
		taglineDe: { type: String, default: "Helfen Sie uns" },
		taglineEn: { type: String, default: "Help Us" },
		titleDe: { type: String, default: "Spenden" },
		titleEn: { type: String, default: "Donate" },
		subtitleDe: { type: String, default: "Unterstützen Sie die assyrischen Gemeinschaften in Deutschland und in den Krisengebieten des Nahen Ostens." },
		subtitleEn: { type: String, default: "Support the Assyrian communities in Germany and in the crisis regions of the Middle East." },
		image: { type: String, default: "/images/donate/Spenden-Syrien.jpg" },
	},
	{ _id: false }
);

export interface ISpendenCard {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	image?: string;
}

const SpendenCardSchema = new Schema<ISpendenCard>(
	{
		titleDe: { type: String },
		titleEn: { type: String },
		descriptionDe: { type: String },
		descriptionEn: { type: String },
		image: { type: String },
	},
	{ _id: false }
);

export interface ISpendenCards {
	sectionTitleDe?: string;
	sectionTitleEn?: string;
	humanitaer: ISpendenCard;
	zavd: ISpendenCard;
}

const SpendenCardsSchema = new Schema<ISpendenCards>(
	{
		sectionTitleDe: { type: String, default: "Spenden" },
		sectionTitleEn: { type: String, default: "Donate" },
		humanitaer: {
			type: SpendenCardSchema,
			default: () => ({
				titleDe: "Humanitäres Konto",
				titleEn: "Humanitarian Account",
				descriptionDe: "Humanitäres Konto für die im Krieg und Katastrophen in Not geratene Assyrier in ihren Heimatländern",
				descriptionEn: "Humanitarian account for Assyrians in need due to war and disasters in their home countries",
				image: "/images/donate/Spenden-Syrien.jpg",
			}),
		},
		zavd: {
			type: SpendenCardSchema,
			default: () => ({
				titleDe: "ZAVD Spendenkonto",
				titleEn: "ZAVD Donation Account",
				descriptionDe: "Unterstützen Sie die Arbeit des ZAVD für Flüchtlinge und Migranten in Deutschland und Europa",
				descriptionEn: "Support the work of ZAVD for refugees and migrants in Germany and Europe",
				image: "/images/donate/Association1.jpg",
			}),
		},
	},
	{ _id: false }
);

export interface ISpendenPage extends Document {
	hero: ISpendenHero;
	cards: ISpendenCards;
	createdAt: Date;
	updatedAt: Date;
}

const SpendenPageSchema = new Schema<ISpendenPage>(
	{
		hero: { type: SpendenHeroSchema, default: () => ({}) },
		cards: { type: SpendenCardsSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

let SpendenPageModel: Model<ISpendenPage> | null = null;

export function getSpendenPageModelSync(): Model<ISpendenPage> {
	if (SpendenPageModel) return SpendenPageModel;
	SpendenPageModel =
		(mongoose.models.SpendenPage as Model<ISpendenPage>) ||
		mongoose.model<ISpendenPage>("SpendenPage", SpendenPageSchema);
	return SpendenPageModel;
}

export async function getSpendenPageModel(): Promise<Model<ISpendenPage>> {
	await connectMongoose();
	return getSpendenPageModelSync();
}
