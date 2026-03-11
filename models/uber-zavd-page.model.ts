import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IUberZavdHero {
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

const UberZavdHeroSchema = new Schema<IUberZavdHero>(
	{
		titleDe: { type: String, default: "Über ZAVD" },
		titleEn: { type: String, default: "About ZAVD" },
		subtitleDe: { type: String, default: "Zentralverband Arabischer und Deutsch-Arabischer Vereine in Deutschland e.V." },
		subtitleEn: { type: String, default: "Central Association of Arab and German-Arab Associations in Germany" },
		image: { type: String, default: "/images/about/aboutbanner.jpg" },
	},
	{ _id: false }
);

// ============================================================================
// INTRO SECTION
// ============================================================================
export interface IUberZavdIntro {
	headingDe?: string;
	headingEn?: string;
	paragraph1De?: string;
	paragraph1En?: string;
	paragraph2De?: string;
	paragraph2En?: string;
}

const UberZavdIntroSchema = new Schema<IUberZavdIntro>(
	{
		headingDe: { type: String, default: "Über uns" },
		headingEn: { type: String, default: "About Us" },
		paragraph1De: { type: String },
		paragraph1En: { type: String },
		paragraph2De: { type: String },
		paragraph2En: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// ADDRESS SECTION
// ============================================================================
export interface IUberZavdAddress {
	headingDe?: string;
	headingEn?: string;
	name?: string;
	line1?: string;
	line2?: string;
	line3?: string;
	phone?: string;
	email?: string;
}

const UberZavdAddressSchema = new Schema<IUberZavdAddress>(
	{
		headingDe: { type: String, default: "Anschrift" },
		headingEn: { type: String, default: "Address" },
		name: { type: String, default: "ZAVD e.V." },
		line1: { type: String },
		line2: { type: String },
		line3: { type: String },
		phone: { type: String },
		email: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// STRUCTURE SECTION
// ============================================================================
export interface IUberZavdStructure {
	headingDe?: string;
	headingEn?: string;
	paragraph1De?: string;
	paragraph1En?: string;
	paragraph2De?: string;
	paragraph2En?: string;
	paragraph3De?: string;
	paragraph3En?: string;
}

const UberZavdStructureSchema = new Schema<IUberZavdStructure>(
	{
		headingDe: { type: String, default: "Was macht unseren Verband besonders?" },
		headingEn: { type: String, default: "What is special about our association?" },
		paragraph1De: { type: String },
		paragraph1En: { type: String },
		paragraph2De: { type: String },
		paragraph2En: { type: String },
		paragraph3De: { type: String },
		paragraph3En: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// TEAM SECTION
// ============================================================================
export interface IUberZavdTeam {
	headingDe?: string;
	headingEn?: string;
	subtextDe?: string;
	subtextEn?: string;
	paragraph1De?: string;
	paragraph1En?: string;
	paragraph2De?: string;
	paragraph2En?: string;
	image?: string;
}

const UberZavdTeamSchema = new Schema<IUberZavdTeam>(
	{
		headingDe: { type: String, default: "Unser Team" },
		headingEn: { type: String, default: "Our Team" },
		subtextDe: { type: String },
		subtextEn: { type: String },
		paragraph1De: { type: String },
		paragraph1En: { type: String },
		paragraph2De: { type: String },
		paragraph2En: { type: String },
		image: { type: String, default: "/images/about/zavd-team.jpg" },
	},
	{ _id: false }
);

// ============================================================================
// OFFICE TIMELINE ITEM
// ============================================================================
export interface IUberZavdTimelineItem {
	year?: string;
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	image?: string;
}

const UberZavdTimelineItemSchema = new Schema<IUberZavdTimelineItem>(
	{
		year: { type: String },
		titleDe: { type: String },
		titleEn: { type: String },
		descriptionDe: { type: String },
		descriptionEn: { type: String },
		image: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// OFFICE SECTION
// ============================================================================
export interface IUberZavdOffice {
	headingDe?: string;
	headingEn?: string;
	items?: IUberZavdTimelineItem[];
}

const UberZavdOfficeSchema = new Schema<IUberZavdOffice>(
	{
		headingDe: { type: String, default: "Unsere Büros & Aktivitäten" },
		headingEn: { type: String, default: "Our Offices & Activities" },
		items: { type: [UberZavdTimelineItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// GALLERY ITEM
// ============================================================================
export interface IUberZavdGalleryItem {
	image?: string;
	captionDe?: string;
	captionEn?: string;
}

const UberZavdGalleryItemSchema = new Schema<IUberZavdGalleryItem>(
	{
		image: { type: String },
		captionDe: { type: String },
		captionEn: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// GALLERY SECTION
// ============================================================================
export interface IUberZavdGallery {
	headingDe?: string;
	headingEn?: string;
	items?: IUberZavdGalleryItem[];
}

const UberZavdGallerySchema = new Schema<IUberZavdGallery>(
	{
		headingDe: { type: String, default: "Aus unserem Alltag" },
		headingEn: { type: String, default: "From Our Daily Life" },
		items: { type: [UberZavdGalleryItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// CTA SECTION
// ============================================================================
export interface IUberZavdCta {
	headingDe?: string;
	headingEn?: string;
	textDe?: string;
	textEn?: string;
	buttonDe?: string;
	buttonEn?: string;
}

const UberZavdCtaSchema = new Schema<IUberZavdCta>(
	{
		headingDe: { type: String, default: "Werden Sie Mitglied" },
		headingEn: { type: String, default: "Become a Member" },
		textDe: { type: String },
		textEn: { type: String },
		buttonDe: { type: String, default: "Kontakt aufnehmen" },
		buttonEn: { type: String, default: "Get in touch" },
	},
	{ _id: false }
);

// ============================================================================
// MAIN DOCUMENT
// ============================================================================
export interface IUberZavdPage extends Document {
	hero: IUberZavdHero;
	intro: IUberZavdIntro;
	address: IUberZavdAddress;
	structure: IUberZavdStructure;
	team: IUberZavdTeam;
	office: IUberZavdOffice;
	gallery: IUberZavdGallery;
	cta: IUberZavdCta;
	createdAt: Date;
	updatedAt: Date;
}

const UberZavdPageSchema = new Schema<IUberZavdPage>(
	{
		hero: { type: UberZavdHeroSchema, default: () => ({}) },
		intro: { type: UberZavdIntroSchema, default: () => ({}) },
		address: { type: UberZavdAddressSchema, default: () => ({}) },
		structure: { type: UberZavdStructureSchema, default: () => ({}) },
		team: { type: UberZavdTeamSchema, default: () => ({}) },
		office: { type: UberZavdOfficeSchema, default: () => ({}) },
		gallery: { type: UberZavdGallerySchema, default: () => ({}) },
		cta: { type: UberZavdCtaSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

let UberZavdPageModel: Model<IUberZavdPage> | null = null;

export function getUberZavdPageModelSync(): Model<IUberZavdPage> {
	if (UberZavdPageModel) return UberZavdPageModel;
	UberZavdPageModel =
		(mongoose.models.UberZavdPage as Model<IUberZavdPage>) ||
		mongoose.model<IUberZavdPage>("UberZavdPage", UberZavdPageSchema);
	return UberZavdPageModel;
}

export async function getUberZavdPageModel(): Promise<Model<IUberZavdPage>> {
	await connectMongoose();
	return getUberZavdPageModelSync();
}
