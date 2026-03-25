import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ─── Hero Section ────────────────────────────────────────────────────────────
export interface IEhrenamtEngagementHero {
	backgroundImage?: string;
	titleDe?: string;
	titleEn?: string;
	breadcrumb?: string;
}

// ─── Content Section ──────────────────────────────────────────────────────────
export interface IEhrenamtContentBlock {
	headingDe?: string;
	headingEn?: string;
	bodyDe?: string;
	bodyEn?: string;
}

export interface IEhrenamtEngagementContent {
	titleDe?: string;
	titleEn?: string;
	bodyDe?: string;
	bodyEn?: string;
	image?: string;
	blocks: IEhrenamtContentBlock[];
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
export interface IEhrenamtGalleryImage {
	url: string;
	alt?: string;
	caption?: string;
}

export interface IEhrenamtEngagementGallery {
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	images: IEhrenamtGalleryImage[];
}

// ─── Partners Section ─────────────────────────────────────────────────────────
export interface IEhrenamtPartnerLogo {
	image?: string;
	name?: string;
	href?: string;
}

export interface IEhrenamtEngagementPartners {
	headingDe?: string;
	headingEn?: string;
	logos: IEhrenamtPartnerLogo[];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export interface IEhrenamtEngagementPage {
	hero: IEhrenamtEngagementHero;
	gallery: IEhrenamtEngagementGallery;
	content: IEhrenamtEngagementContent;
	partners: IEhrenamtEngagementPartners;
}

// ─── Document ─────────────────────────────────────────────────────────────────
export interface IEhrenamtEngagementPageDocument
	extends IEhrenamtEngagementPage,
		Document {}

// ─── Schemas ──────────────────────────────────────────────────────────────────
const heroSchema = new Schema<IEhrenamtEngagementHero>(
	{
		backgroundImage: { type: String, default: "" },
		titleDe: { type: String, default: "Ehrenamt & Engagement" },
		titleEn: { type: String, default: "Volunteering" },
		breadcrumb: { type: String, default: "Ehrenamt & Engagement" },
	},
	{ _id: false }
);

const contentBlockSchema = new Schema<IEhrenamtContentBlock>(
	{
		headingDe: { type: String, default: "" },
		headingEn: { type: String, default: "" },
		bodyDe: { type: String, default: "" },
		bodyEn: { type: String, default: "" },
	},
	{ _id: false }
);

const contentSchema = new Schema<IEhrenamtEngagementContent>(
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

const galleryImageSchema = new Schema<IEhrenamtGalleryImage>(
	{
		url: { type: String, required: true },
		alt: { type: String, default: "" },
		caption: { type: String, default: "" },
	},
	{ _id: false }
);

const gallerySchema = new Schema<IEhrenamtEngagementGallery>(
	{
		titleDe: { type: String, default: "" },
		titleEn: { type: String, default: "" },
		subtitleDe: { type: String, default: "" },
		subtitleEn: { type: String, default: "" },
		images: { type: [galleryImageSchema], default: [] },
	},
	{ _id: false }
);

const partnerLogoSchema = new Schema<IEhrenamtPartnerLogo>(
	{
		image: { type: String, default: "" },
		name: { type: String, default: "" },
		href: { type: String, default: "" },
	},
	{ _id: false }
);

const partnersSchema = new Schema<IEhrenamtEngagementPartners>(
	{
		headingDe: { type: String, default: "" },
		headingEn: { type: String, default: "" },
		logos: { type: [partnerLogoSchema], default: [] },
	},
	{ _id: false }
);

const ehrenamtEngagementPageSchema =
	new Schema<IEhrenamtEngagementPageDocument>(
		{
			hero: { type: heroSchema, default: () => ({}) },
			gallery: { type: gallerySchema, default: () => ({}) },
			content: { type: contentSchema, default: () => ({}) },
			partners: { type: partnersSchema, default: () => ({}) },
		},
		{ timestamps: true }
	);

// ─── Model (singleton) ────────────────────────────────────────────────────────
let EhrenamtEngagementPageModel: Model<IEhrenamtEngagementPageDocument> | null =
	null;

export async function getEhrenamtEngagementPageModel(): Promise<
	Model<IEhrenamtEngagementPageDocument>
> {
	await connectMongoose();
	return getEhrenamtEngagementPageModelSync();
}

export function getEhrenamtEngagementPageModelSync(): Model<IEhrenamtEngagementPageDocument> {
	if (!EhrenamtEngagementPageModel) {
		if (process.env.NODE_ENV !== "production") {
			delete mongoose.models.EhrenamtEngagementPage;
		}
		EhrenamtEngagementPageModel =
			(mongoose.models
				.EhrenamtEngagementPage as Model<IEhrenamtEngagementPageDocument>) ||
			mongoose.model<IEhrenamtEngagementPageDocument>(
				"EhrenamtEngagementPage",
				ehrenamtEngagementPageSchema
			);
	}
	return EhrenamtEngagementPageModel;
}
