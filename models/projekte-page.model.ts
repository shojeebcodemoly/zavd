import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ─── Hero Section ─────────────────────────────────────────────────────────────
export interface IProjekteHero {
	backgroundImage?: string;
	titleDe: string;
	titleEn: string;
	subtitle?: string;
}

// ─── Intro Section ────────────────────────────────────────────────────────────
export interface IProjekteIntroImage {
	url: string;
	alt?: string;
}

export interface IProjekteIntro {
	badge?: string;
	headingBold?: string;
	headingLight?: string;
	description?: string;
	ctaText?: string;
	ctaHref?: string;
	images: IProjekteIntroImage[];
}

// ─── Projects Grid Section ────────────────────────────────────────────────────
export interface IProjekteProjectItem {
	image?: string;
	title?: string;
	description?: string;
	location?: string;
	date?: string;
	category?: string;
	href?: string;
}

export interface IProjekteProjectsSection {
	badge?: string;
	heading?: string;
	description?: string;
	categories: string[];
	items: IProjekteProjectItem[];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export interface IProjektePage {
	hero: IProjekteHero;
	intro: IProjekteIntro;
	projects: IProjekteProjectsSection;
}

export interface IProjektePageDocument extends IProjektePage, Document {}

// ─── Schemas ──────────────────────────────────────────────────────────────────
const heroSchema = new Schema<IProjekteHero>(
	{
		backgroundImage: { type: String, default: "" },
		titleDe: { type: String, default: "Projekte" },
		titleEn: { type: String, default: "Projects" },
		subtitle: { type: String, default: "" },
	},
	{ _id: false }
);

const introImageSchema = new Schema<IProjekteIntroImage>(
	{
		url: { type: String, default: "" },
		alt: { type: String, default: "" },
	},
	{ _id: false }
);

const introSchema = new Schema<IProjekteIntro>(
	{
		badge: { type: String, default: "" },
		headingBold: { type: String, default: "Our Work." },
		headingLight: { type: String, default: "Your Vision Realized." },
		description: { type: String, default: "" },
		ctaText: { type: String, default: "Our Projects" },
		ctaHref: { type: String, default: "/projekte" },
		images: { type: [introImageSchema], default: [] },
	},
	{ _id: false }
);

const projectItemSchema = new Schema<IProjekteProjectItem>(
	{
		image: { type: String, default: "" },
		title: { type: String, default: "" },
		description: { type: String, default: "" },
		location: { type: String, default: "" },
		date: { type: String, default: "" },
		category: { type: String, default: "" },
		href: { type: String, default: "" },
	},
	{ _id: false }
);

const projectsSectionSchema = new Schema<IProjekteProjectsSection>(
	{
		badge: { type: String, default: "" },
		heading: { type: String, default: "Discover Our Completed Projects" },
		description: { type: String, default: "" },
		categories: { type: [String], default: [] },
		items: { type: [projectItemSchema], default: [] },
	},
	{ _id: false }
);

const projektePageSchema = new Schema<IProjektePageDocument>(
	{
		hero: { type: heroSchema, default: () => ({}) },
		intro: { type: introSchema, default: () => ({}) },
		projects: { type: projectsSectionSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

// ─── Model (singleton, dev-safe) ──────────────────────────────────────────────
let ProjektePageModel: Model<IProjektePageDocument> | null = null;

export async function getProjektePageModel(): Promise<Model<IProjektePageDocument>> {
	await connectMongoose();
	return getProjektePageModelSync();
}

export function getProjektePageModelSync(): Model<IProjektePageDocument> {
	if (!ProjektePageModel) {
		if (process.env.NODE_ENV !== "production" && mongoose.models.ProjektePage) {
			delete (mongoose.models as Record<string, unknown>).ProjektePage;
		}
		ProjektePageModel =
			(mongoose.models.ProjektePage as Model<IProjektePageDocument>) ||
			mongoose.model<IProjektePageDocument>("ProjektePage", projektePageSchema);
	}
	return ProjektePageModel;
}
