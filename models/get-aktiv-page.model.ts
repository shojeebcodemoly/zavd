import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ─── Hero Section ────────────────────────────────────────────────────────────
export interface IGetAktivHero {
	backgroundImage?: string;
	titleDe: string;
	titleEn?: string;
	breadcrumb?: string;
}

// ─── Content Section ──────────────────────────────────────────────────────────
export interface IGetAktivContentBlock {
	heading?: string;
	body?: string;
}

export interface IGetAktivContent {
	title?: string;
	body?: string;
	image?: string;
	blocks: IGetAktivContentBlock[];
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
export interface IGetAktivGalleryImage {
	url: string;
	alt?: string;
	caption?: string;
}

export interface IGetAktivGallery {
	title?: string;
	subtitle?: string;
	images: IGetAktivGalleryImage[];
}

// ─── Partners Section ─────────────────────────────────────────────────────────
export interface IGetAktivPartnerLogo {
	image?: string;
	name?: string;
	href?: string;
}

export interface IGetAktivPartners {
	heading?: string;
	logos: IGetAktivPartnerLogo[];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export interface IGetAktivPage {
	hero: IGetAktivHero;
	content: IGetAktivContent;
	gallery: IGetAktivGallery;
	partners: IGetAktivPartners;
}

// ─── Document ─────────────────────────────────────────────────────────────────
export interface IGetAktivPageDocument extends IGetAktivPage, Document {}

// ─── Schemas ──────────────────────────────────────────────────────────────────
const heroSchema = new Schema<IGetAktivHero>(
	{
		backgroundImage: { type: String, default: "" },
		titleDe: { type: String, default: "GeT AKTIV" },
		titleEn: { type: String, default: "Get Active Program" },
		breadcrumb: { type: String, default: "GeT AKTIV" },
	},
	{ _id: false }
);

const contentBlockSchema = new Schema<IGetAktivContentBlock>(
	{
		heading: { type: String, default: "" },
		body: { type: String, default: "" },
	},
	{ _id: false }
);

const contentSchema = new Schema<IGetAktivContent>(
	{
		title: { type: String, default: "" },
		body: { type: String, default: "" },
		image: { type: String, default: "" },
		blocks: { type: [contentBlockSchema], default: [] },
	},
	{ _id: false }
);

const galleryImageSchema = new Schema<IGetAktivGalleryImage>(
	{
		url: { type: String, required: true },
		alt: { type: String, default: "" },
		caption: { type: String, default: "" },
	},
	{ _id: false }
);

const gallerySchema = new Schema<IGetAktivGallery>(
	{
		title: { type: String, default: "" },
		subtitle: { type: String, default: "" },
		images: { type: [galleryImageSchema], default: [] },
	},
	{ _id: false }
);

const partnerLogoSchema = new Schema<IGetAktivPartnerLogo>(
	{
		image: { type: String, default: "" },
		name: { type: String, default: "" },
		href: { type: String, default: "" },
	},
	{ _id: false }
);

const partnersSchema = new Schema<IGetAktivPartners>(
	{
		heading: { type: String, default: "" },
		logos: { type: [partnerLogoSchema], default: [] },
	},
	{ _id: false }
);

const getAktivPageSchema = new Schema<IGetAktivPageDocument>(
	{
		hero: { type: heroSchema, default: () => ({}) },
		content: { type: contentSchema, default: () => ({}) },
		gallery: { type: gallerySchema, default: () => ({}) },
		partners: { type: partnersSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

// ─── Model (singleton) ────────────────────────────────────────────────────────
let GetAktivPageModel: Model<IGetAktivPageDocument> | null = null;

export async function getGetAktivPageModel(): Promise<
	Model<IGetAktivPageDocument>
> {
	await connectMongoose();
	return getGetAktivPageModelSync();
}

export function getGetAktivPageModelSync(): Model<IGetAktivPageDocument> {
	if (!GetAktivPageModel) {
		if (process.env.NODE_ENV !== "production") {
			delete mongoose.models.GetAktivPage;
		}
		GetAktivPageModel =
			(mongoose.models.GetAktivPage as Model<IGetAktivPageDocument>) ||
			mongoose.model<IGetAktivPageDocument>("GetAktivPage", getAktivPageSchema);
	}
	return GetAktivPageModel;
}
