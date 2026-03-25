import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ─── Hero Section ─────────────────────────────────────────────────────────────
export interface IProjekteHero {
	backgroundImage?: string;
	titleDe: string;
	titleEn: string;
	subtitleDe?: string;
	subtitleEn?: string;
}

// ─── Intro Section ────────────────────────────────────────────────────────────
export interface IProjekteIntroImage {
	url: string;
	alt?: string;
}

export interface IProjekteIntro {
	badgeDe?: string;
	badgeEn?: string;
	headingBoldDe?: string;
	headingBoldEn?: string;
	headingLightDe?: string;
	headingLightEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	ctaTextDe?: string;
	ctaTextEn?: string;
	ctaHref?: string;
	images: IProjekteIntroImage[];
}

// ─── Projects Grid Section ────────────────────────────────────────────────────
export interface IProjekteProjectItem {
	image?: string;
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	location?: string;
	date?: string;
	category?: string;
	href?: string;
}

export interface IProjekteProjectsSection {
	badgeDe?: string;
	badgeEn?: string;
	headingDe?: string;
	headingEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
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
		subtitleDe: { type: String, default: "" },
		subtitleEn: { type: String, default: "" },
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
		badgeDe: { type: String, default: "" },
		badgeEn: { type: String, default: "" },
		headingBoldDe: { type: String, default: "Unsere Arbeit." },
		headingBoldEn: { type: String, default: "Our Work." },
		headingLightDe: { type: String, default: "Ihre Vision verwirklicht." },
		headingLightEn: { type: String, default: "Your Vision Realized." },
		descriptionDe: { type: String, default: "" },
		descriptionEn: { type: String, default: "" },
		ctaTextDe: { type: String, default: "Unsere Projekte" },
		ctaTextEn: { type: String, default: "Our Projects" },
		ctaHref: { type: String, default: "/projekte" },
		images: { type: [introImageSchema], default: [] },
	},
	{ _id: false }
);

const projectItemSchema = new Schema<IProjekteProjectItem>(
	{
		image: { type: String, default: "" },
		titleDe: { type: String, default: "" },
		titleEn: { type: String, default: "" },
		descriptionDe: { type: String, default: "" },
		descriptionEn: { type: String, default: "" },
		location: { type: String, default: "" },
		date: { type: String, default: "" },
		category: { type: String, default: "" },
		href: { type: String, default: "" },
	},
	{ _id: false }
);

const projectsSectionSchema = new Schema<IProjekteProjectsSection>(
	{
		badgeDe: { type: String, default: "" },
		badgeEn: { type: String, default: "" },
		headingDe: { type: String, default: "Entdecken Sie unsere abgeschlossenen Projekte" },
		headingEn: { type: String, default: "Discover Our Completed Projects" },
		descriptionDe: { type: String, default: "" },
		descriptionEn: { type: String, default: "" },
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
