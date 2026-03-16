import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IThemenHero {
	taglineDe?: string;
	taglineEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

const ThemenHeroSchema = new Schema<IThemenHero>(
	{
		taglineDe: { type: String, default: "Unsere Themen" },
		taglineEn: { type: String, default: "Our Topics" },
		titleDe: { type: String, default: "Themen" },
		titleEn: { type: String, default: "Topics" },
		subtitleDe: { type: String, default: "Integration von Geflüchteten und die Situation der Assyrer in Irak und Syrien — unsere zwei zentralen Themenfelder." },
		subtitleEn: { type: String, default: "Integration of refugees and the situation of Assyrians in Iraq and Syria — our two key areas of advocacy." },
		image: { type: String, default: "/images/about/aboutbanner.jpg" },
	},
	{ _id: false }
);

// ============================================================================
// READ MORE LINK ITEM
// ============================================================================
export interface IThemenReadMoreLink {
	labelDe?: string;
	labelEn?: string;
	href?: string;
}

const ThemenReadMoreLinkSchema = new Schema<IThemenReadMoreLink>(
	{
		labelDe: { type: String },
		labelEn: { type: String },
		href: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// INTEGRATION SECTION
// ============================================================================
export interface IThemenIntegration {
	headingDe?: string;
	headingEn?: string;
	paragraph1De?: string;
	paragraph1En?: string;
	paragraph2De?: string;
	paragraph2En?: string;
	image?: string;
	badgeTitleDe?: string;
	badgeTitleEn?: string;
	badgeSubtitleDe?: string;
	badgeSubtitleEn?: string;
	ctaLabelDe?: string;
	ctaLabelEn?: string;
	ctaHref?: string;
	readMoreLinks?: IThemenReadMoreLink[];
}

const ThemenIntegrationSchema = new Schema<IThemenIntegration>(
	{
		headingDe: { type: String, default: "Integration" },
		headingEn: { type: String, default: "Integration" },
		paragraph1De: { type: String },
		paragraph1En: { type: String },
		paragraph2De: { type: String },
		paragraph2En: { type: String },
		image: { type: String, default: "/images/about/office1pg.jpg" },
		badgeTitleDe: { type: String, default: "Seit 2009" },
		badgeTitleEn: { type: String, default: "Since 2009" },
		badgeSubtitleDe: { type: String, default: "Aktive Integrationsarbeit" },
		badgeSubtitleEn: { type: String, default: "Active integration work" },
		ctaLabelDe: { type: String, default: "Unsere Angebote" },
		ctaLabelEn: { type: String, default: "Our Services" },
		ctaHref: { type: String, default: "/angebote-beratung" },
		readMoreLinks: { type: [ThemenReadMoreLinkSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// CORE DEMAND ITEM
// ============================================================================
export interface IThemenCoreDemand {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

const ThemenCoreDemandSchema = new Schema<IThemenCoreDemand>(
	{
		titleDe: { type: String },
		titleEn: { type: String },
		descriptionDe: { type: String },
		descriptionEn: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// IRAK & SYRIEN SECTION
// ============================================================================
export interface IThemenIrakSyrien {
	headingDe?: string;
	headingEn?: string;
	paragraphDe?: string;
	paragraphEn?: string;
	image?: string;
	coreDemands?: IThemenCoreDemand[];
	dokumentationTitleDe?: string;
	dokumentationTitleEn?: string;
	dokumentationDescDe?: string;
	dokumentationDescEn?: string;
	dokumentationLinkLabelDe?: string;
	dokumentationLinkLabelEn?: string;
	dokumentationLinkHref?: string;
}

const ThemenIrakSyrienSchema = new Schema<IThemenIrakSyrien>(
	{
		headingDe: { type: String, default: "Irak & Syrien" },
		headingEn: { type: String, default: "Iraq & Syria" },
		paragraphDe: { type: String },
		paragraphEn: { type: String },
		image: { type: String, default: "/images/donate/Spenden-Syrien.jpg" },
		coreDemands: { type: [ThemenCoreDemandSchema], default: [] },
		dokumentationTitleDe: { type: String, default: "Augenzeugenberichte & Dokumentationen" },
		dokumentationTitleEn: { type: String, default: "Eyewitness Reports & Documentation" },
		dokumentationDescDe: { type: String },
		dokumentationDescEn: { type: String },
		dokumentationLinkLabelDe: { type: String, default: "ZAVD – Dokumentation – Ereignisse Irak 2014" },
		dokumentationLinkLabelEn: { type: String, default: "ZAVD – Documentation – Events Iraq 2014" },
		dokumentationLinkHref: { type: String, default: "#" },
	},
	{ _id: false }
);

// ============================================================================
// MAIN DOCUMENT
// ============================================================================
export interface IThemenPage extends Document {
	hero: IThemenHero;
	integration: IThemenIntegration;
	irakSyrien: IThemenIrakSyrien;
	createdAt: Date;
	updatedAt: Date;
}

const ThemenPageSchema = new Schema<IThemenPage>(
	{
		hero: { type: ThemenHeroSchema, default: () => ({}) },
		integration: { type: ThemenIntegrationSchema, default: () => ({}) },
		irakSyrien: { type: ThemenIrakSyrienSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

let ThemenPageModel: Model<IThemenPage> | null = null;

export function getThemenPageModelSync(): Model<IThemenPage> {
	if (ThemenPageModel) return ThemenPageModel;
	// After hot reload the module-level cache is null but mongoose.models may
	// still hold a stale model compiled against the old schema.
	// Delete it so we always register the up-to-date ThemenPageSchema.
	if (mongoose.models.ThemenPage) {
		delete mongoose.models.ThemenPage;
	}
	ThemenPageModel = mongoose.model<IThemenPage>("ThemenPage", ThemenPageSchema);
	return ThemenPageModel;
}

export async function getThemenPageModel(): Promise<Model<IThemenPage>> {
	await connectMongoose();
	return getThemenPageModelSync();
}
