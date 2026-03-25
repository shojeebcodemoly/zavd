import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ─── Hero Section ────────────────────────────────────────────────────────────
export interface IGutReinkommenHero {
	backgroundImage?: string;
	titleDe: string;
	titleEn?: string;
	breadcrumb?: string;
}

// ─── Content Section ──────────────────────────────────────────────────────────
export interface IGutReinkommenContentBlock {
	headingDe?: string;
	headingEn?: string;
	bodyDe?: string;
	bodyEn?: string;
}

export interface IGutReinkommenContent {
	titleDe?: string;
	titleEn?: string;
	bodyDe?: string;
	bodyEn?: string;
	image?: string;
	blocks: IGutReinkommenContentBlock[];
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
export interface IGutReinkommenGalleryImage {
	url: string;
	alt?: string;
	caption?: string;
}

export interface IGutReinkommenGallery {
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	images: IGutReinkommenGalleryImage[];
}

// ─── Partners Section ─────────────────────────────────────────────────────────
export interface IGutReinkommenPartnerLogo {
	image?: string;
	name?: string;
	href?: string;
}

export interface IGutReinkommenPartners {
	headingDe?: string;
	headingEn?: string;
	logos: IGutReinkommenPartnerLogo[];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export interface IGutReinkommenPage {
	hero: IGutReinkommenHero;
	content: IGutReinkommenContent;
	gallery: IGutReinkommenGallery;
	partners: IGutReinkommenPartners;
}

// ─── Document ─────────────────────────────────────────────────────────────────
export interface IGutReinkommenPageDocument
	extends IGutReinkommenPage,
		Document {}

// ─── Schemas ──────────────────────────────────────────────────────────────────
const heroSchema = new Schema<IGutReinkommenHero>(
	{
		backgroundImage: { type: String, default: "" },
		titleDe: { type: String, default: "Gut Reinkommen" },
		titleEn: { type: String, default: "Successful Integration" },
		breadcrumb: { type: String, default: "Gut Reinkommen" },
	},
	{ _id: false }
);

const contentBlockSchema = new Schema<IGutReinkommenContentBlock>(
	{
		headingDe: { type: String, default: "" },
		headingEn: { type: String, default: "" },
		bodyDe: { type: String, default: "" },
		bodyEn: { type: String, default: "" },
	},
	{ _id: false }
);

const contentSchema = new Schema<IGutReinkommenContent>(
	{
		titleDe: { type: String, default: "" },
		titleEn: { type: String, default: "" },
		bodyDe: { type: String, default: "" },
		bodyEn: { type: String, default: "" },
		image: { type: String, default: "" },
		blocks: { type: [contentBlockSchema], default: [] },
	},
	{ _id: false }
);

const galleryImageSchema = new Schema<IGutReinkommenGalleryImage>(
	{
		url: { type: String, required: true },
		alt: { type: String, default: "" },
		caption: { type: String, default: "" },
	},
	{ _id: false }
);

const gallerySchema = new Schema<IGutReinkommenGallery>(
	{
		titleDe: { type: String, default: "" },
		titleEn: { type: String, default: "" },
		subtitleDe: { type: String, default: "" },
		subtitleEn: { type: String, default: "" },
		images: { type: [galleryImageSchema], default: [] },
	},
	{ _id: false }
);

const partnerLogoSchema = new Schema<IGutReinkommenPartnerLogo>(
	{
		image: { type: String, default: "" },
		name: { type: String, default: "" },
		href: { type: String, default: "" },
	},
	{ _id: false }
);

const partnersSchema = new Schema<IGutReinkommenPartners>(
	{
		headingDe: { type: String, default: "" },
		headingEn: { type: String, default: "" },
		logos: { type: [partnerLogoSchema], default: [] },
	},
	{ _id: false }
);

const gutReinkommenPageSchema = new Schema<IGutReinkommenPageDocument>(
	{
		hero: { type: heroSchema, default: () => ({}) },
		content: { type: contentSchema, default: () => ({}) },
		gallery: { type: gallerySchema, default: () => ({}) },
		partners: { type: partnersSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

// ─── Model (singleton) ────────────────────────────────────────────────────────
let GutReinkommenPageModel: Model<IGutReinkommenPageDocument> | null = null;

export async function getGutReinkommenPageModel(): Promise<
	Model<IGutReinkommenPageDocument>
> {
	await connectMongoose();
	return getGutReinkommenPageModelSync();
}

export function getGutReinkommenPageModelSync(): Model<IGutReinkommenPageDocument> {
	if (!GutReinkommenPageModel) {
		if (process.env.NODE_ENV !== "production") {
			delete mongoose.models.GutReinkommenPage;
		}
		GutReinkommenPageModel =
			(mongoose.models
				.GutReinkommenPage as Model<IGutReinkommenPageDocument>) ||
			mongoose.model<IGutReinkommenPageDocument>(
				"GutReinkommenPage",
				gutReinkommenPageSchema
			);
	}
	return GutReinkommenPageModel;
}
