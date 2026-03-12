import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IGeschichteHero {
	taglineDe?: string;
	taglineEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

const GeschichteHeroSchema = new Schema<IGeschichteHero>(
	{
		taglineDe: { type: String, default: "Unsere Geschichte" },
		taglineEn: { type: String, default: "Our Story" },
		titleDe: { type: String, default: "Geschichte" },
		titleEn: { type: String, default: "History" },
		subtitleDe: { type: String, default: "Über 60 Jahre Gemeinschaft, Engagement und Kultur in Deutschland." },
		subtitleEn: { type: String, default: "Over 60 years of community, commitment and culture in Germany." },
		image: { type: String, default: "/images/about/aboutbanner.jpg" },
	},
	{ _id: false }
);

// ============================================================================
// STATS SECTION
// ============================================================================
export interface IGeschichteStat {
	value?: number;
	suffix?: string;
	labelDe?: string;
	labelEn?: string;
}

const GeschichteStatSchema = new Schema<IGeschichteStat>(
	{
		value: { type: Number },
		suffix: { type: String },
		labelDe: { type: String },
		labelEn: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// INTRO SECTION
// ============================================================================
export interface IGeschichteIntro {
	taglineDe?: string;
	taglineEn?: string;
	headingDe?: string;
	headingEn?: string;
	paragraphDe?: string;
	paragraphEn?: string;
}

const GeschichteIntroSchema = new Schema<IGeschichteIntro>(
	{
		taglineDe: { type: String, default: "Unsere Wurzeln" },
		taglineEn: { type: String, default: "Our Roots" },
		headingDe: { type: String, default: "Von Gastarbeitern zu einer starken Gemeinschaft" },
		headingEn: { type: String, default: "From Guest Workers to a Strong Community" },
		paragraphDe: { type: String },
		paragraphEn: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// ARTICLE SECTION
// ============================================================================
export interface IGeschichteArticle {
	headingDe?: string;
	headingEn?: string;
	paragraph1De?: string;
	paragraph1En?: string;
	paragraph2De?: string;
	paragraph2En?: string;
	image?: string;
	captionDe?: string;
	captionEn?: string;
	direction?: string;
}

const GeschichteArticleSchema = new Schema<IGeschichteArticle>(
	{
		headingDe: { type: String },
		headingEn: { type: String },
		paragraph1De: { type: String },
		paragraph1En: { type: String },
		paragraph2De: { type: String },
		paragraph2En: { type: String },
		image: { type: String },
		captionDe: { type: String },
		captionEn: { type: String },
		direction: { type: String, default: "left" },
	},
	{ _id: false }
);

// ============================================================================
// TIMELINE EVENT
// ============================================================================
export interface IGeschichteEvent {
	yearDe?: string;
	yearEn?: string;
	titleDe?: string;
	titleEn?: string;
	textDe?: string;
	textEn?: string;
	image?: string;
}

const GeschichteEventSchema = new Schema<IGeschichteEvent>(
	{
		yearDe: { type: String },
		yearEn: { type: String },
		titleDe: { type: String },
		titleEn: { type: String },
		textDe: { type: String },
		textEn: { type: String },
		image: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// MAIN DOCUMENT
// ============================================================================
export interface IGeschichtePage extends Document {
	hero: IGeschichteHero;
	stats: IGeschichteStat[];
	intro: IGeschichteIntro;
	articles: IGeschichteArticle[];
	events: IGeschichteEvent[];
	createdAt: Date;
	updatedAt: Date;
}

const GeschichtePageSchema = new Schema<IGeschichtePage>(
	{
		hero: { type: GeschichteHeroSchema, default: () => ({}) },
		stats: { type: [GeschichteStatSchema], default: [] },
		intro: { type: GeschichteIntroSchema, default: () => ({}) },
		articles: { type: [GeschichteArticleSchema], default: [] },
		events: { type: [GeschichteEventSchema], default: [] },
	},
	{ timestamps: true }
);

let GeschichtePageModel: Model<IGeschichtePage> | null = null;

export function getGeschichtePageModelSync(): Model<IGeschichtePage> {
	if (GeschichtePageModel) return GeschichtePageModel;
	GeschichtePageModel =
		(mongoose.models.GeschichtePage as Model<IGeschichtePage>) ||
		mongoose.model<IGeschichtePage>("GeschichtePage", GeschichtePageSchema);
	return GeschichtePageModel;
}

export async function getGeschichtePageModel(): Promise<Model<IGeschichtePage>> {
	await connectMongoose();
	return getGeschichtePageModelSync();
}
