import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ─── Hero Section ────────────────────────────────────────────────────────────
export interface IGemeinsamAktivHero {
	backgroundImage?: string;
	titleDe: string;
	titleEn?: string;
	breadcrumb?: string;
}

// ─── Content Section ──────────────────────────────────────────────────────────
export interface IGemeinsamAktivContentBlock {
	heading?: string;
	body?: string;
}

export interface IGemeinsamAktivContent {
	title?: string;
	body?: string;
	image?: string;
	blocks: IGemeinsamAktivContentBlock[];
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
export interface IGemeinsamAktivGalleryImage {
	url: string;
	alt?: string;
	caption?: string;
}

export interface IGemeinsamAktivGallery {
	title?: string;
	subtitle?: string;
	images: IGemeinsamAktivGalleryImage[];
}

// ─── Partners Section ─────────────────────────────────────────────────────────
export interface IGemeinsamAktivPartnerLogo {
	image?: string;
	name?: string;
	href?: string;
}

export interface IGemeinsamAktivPartners {
	heading?: string;
	logos: IGemeinsamAktivPartnerLogo[];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export interface IGemeinsamAktivPage {
	hero: IGemeinsamAktivHero;
	content: IGemeinsamAktivContent;
	gallery: IGemeinsamAktivGallery;
	partners: IGemeinsamAktivPartners;
}

// ─── Document ─────────────────────────────────────────────────────────────────
export interface IGemeinsamAktivPageDocument
	extends IGemeinsamAktivPage,
		Document {}

// ─── Schemas ──────────────────────────────────────────────────────────────────
const heroSchema = new Schema<IGemeinsamAktivHero>(
	{
		backgroundImage: { type: String, default: "" },
		titleDe: { type: String, default: "Gemeinsam Aktiv" },
		titleEn: { type: String, default: "Active Together" },
		breadcrumb: { type: String, default: "Gemeinsam Aktiv" },
	},
	{ _id: false }
);

const contentBlockSchema = new Schema<IGemeinsamAktivContentBlock>(
	{
		heading: { type: String, default: "" },
		body: { type: String, default: "" },
	},
	{ _id: false }
);

const contentSchema = new Schema<IGemeinsamAktivContent>(
	{
		title: { type: String, default: "" },
		body: { type: String, default: "" },
		image: { type: String, default: "" },
		blocks: { type: [contentBlockSchema], default: [] },
	},
	{ _id: false }
);

const galleryImageSchema = new Schema<IGemeinsamAktivGalleryImage>(
	{
		url: { type: String, required: true },
		alt: { type: String, default: "" },
		caption: { type: String, default: "" },
	},
	{ _id: false }
);

const gallerySchema = new Schema<IGemeinsamAktivGallery>(
	{
		title: { type: String, default: "" },
		subtitle: { type: String, default: "" },
		images: { type: [galleryImageSchema], default: [] },
	},
	{ _id: false }
);

const partnerLogoSchema = new Schema<IGemeinsamAktivPartnerLogo>(
	{
		image: { type: String, default: "" },
		name: { type: String, default: "" },
		href: { type: String, default: "" },
	},
	{ _id: false }
);

const partnersSchema = new Schema<IGemeinsamAktivPartners>(
	{
		heading: { type: String, default: "" },
		logos: { type: [partnerLogoSchema], default: [] },
	},
	{ _id: false }
);

const gemeinsamAktivPageSchema = new Schema<IGemeinsamAktivPageDocument>(
	{
		hero: { type: heroSchema, default: () => ({}) },
		content: { type: contentSchema, default: () => ({}) },
		gallery: { type: gallerySchema, default: () => ({}) },
		partners: { type: partnersSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

// ─── Model (singleton) ────────────────────────────────────────────────────────
let GemeinsamAktivPageModel: Model<IGemeinsamAktivPageDocument> | null = null;

export async function getGemeinsamAktivPageModel(): Promise<
	Model<IGemeinsamAktivPageDocument>
> {
	await connectMongoose();
	return getGemeinsamAktivPageModelSync();
}

export function getGemeinsamAktivPageModelSync(): Model<IGemeinsamAktivPageDocument> {
	if (!GemeinsamAktivPageModel) {
		GemeinsamAktivPageModel =
			(mongoose.models
				.GemeinsamAktivPage as Model<IGemeinsamAktivPageDocument>) ||
			mongoose.model<IGemeinsamAktivPageDocument>(
				"GemeinsamAktivPage",
				gemeinsamAktivPageSchema
			);
	}
	return GemeinsamAktivPageModel;
}
