import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IAngeboteBeratungHero {
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

const AngeboteBeratungHeroSchema = new Schema<IAngeboteBeratungHero>(
	{
		titleDe: { type: String, default: "Angebote &\nBeratung" },
		titleEn: { type: String, default: "Services &\nCounseling" },
		subtitleDe: { type: String, default: "Wir unterstützen Flüchtlinge, Familien und Einzelpersonen mit professioneller Beratung, rechtlicher Begleitung und gemeinschaftlichen Ressourcen." },
		subtitleEn: { type: String, default: "We support refugees, families, and individuals with professional counseling, legal guidance, and community resources." },
		image: { type: String, default: "/images/about/aboutbanner.jpg" },
	},
	{ _id: false }
);

// ============================================================================
// PDF RESOURCE ITEM
// ============================================================================
export interface IAngebotePdfItem {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	downloadLabelDe?: string;
	downloadLabelEn?: string;
	href?: string;
}

const AngebotePdfItemSchema = new Schema<IAngebotePdfItem>(
	{
		titleDe: { type: String },
		titleEn: { type: String },
		descriptionDe: { type: String },
		descriptionEn: { type: String },
		downloadLabelDe: { type: String },
		downloadLabelEn: { type: String },
		href: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// FLUCHT & ASYL SECTION
// ============================================================================
export interface IAngeboteFluchtAsyl {
	headingDe?: string;
	headingEn?: string;
	paragraph1De?: string;
	paragraph1En?: string;
	paragraph2De?: string;
	paragraph2En?: string;
	infoBoxDe?: string;
	infoBoxEn?: string;
	pdfResources?: IAngebotePdfItem[];
}

const AngeboteFluchtAsylSchema = new Schema<IAngeboteFluchtAsyl>(
	{
		headingDe: { type: String, default: "Betreuung von Flüchtlingen" },
		headingEn: { type: String, default: "Refugee & Asylum Support" },
		paragraph1De: { type: String },
		paragraph1En: { type: String },
		paragraph2De: { type: String },
		paragraph2En: { type: String },
		infoBoxDe: { type: String },
		infoBoxEn: { type: String },
		pdfResources: { type: [AngebotePdfItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// NAMENSÄNDERUNG SECTION
// ============================================================================
export interface IAngeboteNamensaenderung {
	headingDe?: string;
	headingEn?: string;
	paragraph1De?: string;
	paragraph1En?: string;
	paragraph2De?: string;
	paragraph2En?: string;
	paragraph3De?: string;
	paragraph3En?: string;
	blockquoteDe?: string;
	blockquoteEn?: string;
	pdfLabelDe?: string;
	pdfLabelEn?: string;
	pdfHref?: string;
}

const AngeboteNamensaenderungSchema = new Schema<IAngeboteNamensaenderung>(
	{
		headingDe: { type: String, default: "Namensänderung" },
		headingEn: { type: String, default: "Name Change Assistance" },
		paragraph1De: { type: String },
		paragraph1En: { type: String },
		paragraph2De: { type: String },
		paragraph2En: { type: String },
		paragraph3De: { type: String },
		paragraph3En: { type: String },
		blockquoteDe: { type: String },
		blockquoteEn: { type: String },
		pdfLabelDe: { type: String, default: "Bekanntmachung im Bundesanzeiger (PDF)" },
		pdfLabelEn: { type: String, default: "Announcement in the Bundesanzeiger (PDF)" },
		pdfHref: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// SERVICE ITEM (Beratung & Unterstützung)
// ============================================================================
export interface IAngeboteServiceItem {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

const AngeboteServiceItemSchema = new Schema<IAngeboteServiceItem>(
	{
		titleDe: { type: String },
		titleEn: { type: String },
		descriptionDe: { type: String },
		descriptionEn: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// BERATUNG & UNTERSTÜTZUNG SECTION
// ============================================================================
export interface IAngeboteBeratung {
	headingDe?: string;
	headingEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	ctaLabelDe?: string;
	ctaLabelEn?: string;
	services?: IAngeboteServiceItem[];
}

const AngeboteBeratungSchema = new Schema<IAngeboteBeratung>(
	{
		headingDe: { type: String, default: "Beratung & Unterstützung" },
		headingEn: { type: String, default: "Counseling & Support" },
		subtitleDe: { type: String },
		subtitleEn: { type: String },
		ctaLabelDe: { type: String, default: "Kontakt aufnehmen" },
		ctaLabelEn: { type: String, default: "Contact Us" },
		services: { type: [AngeboteServiceItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// LINK ITEM (Wichtige Links)
// ============================================================================
export interface IAngeboteLinkItem {
	name?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	href?: string;
}

const AngeboteLinkItemSchema = new Schema<IAngeboteLinkItem>(
	{
		name: { type: String },
		descriptionDe: { type: String },
		descriptionEn: { type: String },
		href: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// WICHTIGE LINKS SECTION
// ============================================================================
export interface IAngeboteWichtigeLinks {
	headingDe?: string;
	headingEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	links?: IAngeboteLinkItem[];
}

const AngeboteWichtigeLinksSchema = new Schema<IAngeboteWichtigeLinks>(
	{
		headingDe: { type: String, default: "Wichtige Links" },
		headingEn: { type: String, default: "Useful Links" },
		subtitleDe: { type: String, default: "Hier finden Sie eine Auswahl interessanter Links." },
		subtitleEn: { type: String, default: "Here you will find a selection of interesting links." },
		links: { type: [AngeboteLinkItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// MAIN DOCUMENT
// ============================================================================
export interface IAngeboteBeratungPage extends Document {
	hero: IAngeboteBeratungHero;
	fluchtAsyl: IAngeboteFluchtAsyl;
	namensaenderung: IAngeboteNamensaenderung;
	beratung: IAngeboteBeratung;
	wichtigeLinks: IAngeboteWichtigeLinks;
	createdAt: Date;
	updatedAt: Date;
}

const AngeboteBeratungPageSchema = new Schema<IAngeboteBeratungPage>(
	{
		hero: { type: AngeboteBeratungHeroSchema, default: () => ({}) },
		fluchtAsyl: { type: AngeboteFluchtAsylSchema, default: () => ({}) },
		namensaenderung: { type: AngeboteNamensaenderungSchema, default: () => ({}) },
		beratung: { type: AngeboteBeratungSchema, default: () => ({}) },
		wichtigeLinks: { type: AngeboteWichtigeLinksSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

let AngeboteBeratungPageModel: Model<IAngeboteBeratungPage> | null = null;

export function getAngeboteBeratungPageModelSync(): Model<IAngeboteBeratungPage> {
	if (AngeboteBeratungPageModel) return AngeboteBeratungPageModel;
	AngeboteBeratungPageModel =
		(mongoose.models.AngeboteBeratungPage as Model<IAngeboteBeratungPage>) ||
		mongoose.model<IAngeboteBeratungPage>("AngeboteBeratungPage", AngeboteBeratungPageSchema);
	return AngeboteBeratungPageModel;
}

export async function getAngeboteBeratungPageModel(): Promise<Model<IAngeboteBeratungPage>> {
	await connectMongoose();
	return getAngeboteBeratungPageModelSync();
}
