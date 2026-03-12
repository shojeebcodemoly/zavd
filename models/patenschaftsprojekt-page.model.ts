import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ─── Hero Section ────────────────────────────────────────────────────────────
export interface IPatenschaftsprojektHero {
	backgroundImage?: string;
	title: string;
	breadcrumb?: string;
}

// ─── Partners Section ─────────────────────────────────────────────────────────
export interface IProjectPartnerLogo {
	image?: string;
	name?: string;
	href?: string;
}

export interface IPatenschaftsprojektPartners {
	heading?: string;
	logos: IProjectPartnerLogo[];
}

// ─── Content Section ──────────────────────────────────────────────────────────
export interface IContentBlock {
	heading?: string;
	body?: string;
}

export interface IPatenschaftsprojektContent {
	title?: string;
	body?: string;
	image?: string;
	blocks: IContentBlock[];
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
export interface IGalleryImage {
	url: string;
	alt?: string;
	caption?: string;
}

export interface IPatenschaftsprojektGallery {
	title?: string;
	subtitle?: string;
	images: IGalleryImage[];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export interface IPatenschaftsprojektPage {
	hero: IPatenschaftsprojektHero;
	content: IPatenschaftsprojektContent;
	gallery: IPatenschaftsprojektGallery;
	partners: IPatenschaftsprojektPartners;
}

// ─── Document ─────────────────────────────────────────────────────────────────
export interface IPatenschaftsprojektPageDocument
	extends IPatenschaftsprojektPage,
		Document {}

// ─── Schemas ──────────────────────────────────────────────────────────────────
const heroSchema = new Schema<IPatenschaftsprojektHero>(
	{
		backgroundImage: { type: String, default: "" },
		title: { type: String, default: "Patenschaftsprojekt" },
		breadcrumb: { type: String, default: "Patenschaftsprojekt" },
	},
	{ _id: false }
);

const contentBlockSchema = new Schema<IContentBlock>(
	{
		heading: { type: String, default: "" },
		body: { type: String, default: "" },
	},
	{ _id: false }
);

const contentSchema = new Schema<IPatenschaftsprojektContent>(
	{
		title: { type: String, default: "" },
		body: { type: String, default: "" },
		image: { type: String, default: "" },
		blocks: { type: [contentBlockSchema], default: [] },
	},
	{ _id: false }
);

const galleryImageSchema = new Schema<IGalleryImage>(
	{
		url: { type: String, required: true },
		alt: { type: String, default: "" },
		caption: { type: String, default: "" },
	},
	{ _id: false }
);

const gallerySchema = new Schema<IPatenschaftsprojektGallery>(
	{
		title: { type: String, default: "" },
		subtitle: { type: String, default: "" },
		images: { type: [galleryImageSchema], default: [] },
	},
	{ _id: false }
);

const partnerLogoSchema = new Schema<IProjectPartnerLogo>(
	{
		image: { type: String, default: "" },
		name: { type: String, default: "" },
		href: { type: String, default: "" },
	},
	{ _id: false }
);

const partnersSchema = new Schema<IPatenschaftsprojektPartners>(
	{
		heading: { type: String, default: "" },
		logos: { type: [partnerLogoSchema], default: [] },
	},
	{ _id: false }
);

const patenschaftsprojektPageSchema =
	new Schema<IPatenschaftsprojektPageDocument>(
		{
			hero: { type: heroSchema, default: () => ({}) },
			content: { type: contentSchema, default: () => ({}) },
			gallery: { type: gallerySchema, default: () => ({}) },
			partners: { type: partnersSchema, default: () => ({}) },
		},
		{ timestamps: true }
	);

// ─── Model (singleton) ────────────────────────────────────────────────────────
let PatenschaftsprojektPageModel: Model<IPatenschaftsprojektPageDocument> | null =
	null;

export async function getPatenschaftsprojektPageModel(): Promise<
	Model<IPatenschaftsprojektPageDocument>
> {
	await connectMongoose();
	return getPatenschaftsprojektPageModelSync();
}

export function getPatenschaftsprojektPageModelSync(): Model<IPatenschaftsprojektPageDocument> {
	if (!PatenschaftsprojektPageModel) {
		PatenschaftsprojektPageModel =
			(mongoose.models
				.PatenschaftsprojektPage as Model<IPatenschaftsprojektPageDocument>) ||
			mongoose.model<IPatenschaftsprojektPageDocument>(
				"PatenschaftsprojektPage",
				patenschaftsprojektPageSchema
			);
	}
	return PatenschaftsprojektPageModel;
}
