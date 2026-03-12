import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IVorstandTeamHero {
	taglineDe?: string;
	taglineEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

const VorstandTeamHeroSchema = new Schema<IVorstandTeamHero>(
	{
		taglineDe: { type: String, default: "Unsere Leute" },
		taglineEn: { type: String, default: "Our People" },
		titleDe: { type: String, default: "Vorstand & Team" },
		titleEn: { type: String, default: "Board & Team" },
		subtitleDe: { type: String, default: "Die Menschen, die ZAVD gestalten und leiten – engagiert, erfahren und leidenschaftlich." },
		subtitleEn: { type: String, default: "The people who shape and guide ZAVD – committed, experienced, and passionate." },
		image: { type: String, default: "/images/about/aboutbanner.jpg" },
	},
	{ _id: false }
);

// ============================================================================
// BOARD MEMBER
// ============================================================================
export interface IVorstandMember {
	nameDe?: string;
	nameEn?: string;
	roleDe?: string;
	roleEn?: string;
	phone?: string;
	email?: string;
	image?: string;
}

const VorstandMemberSchema = new Schema<IVorstandMember>(
	{
		nameDe: { type: String },
		nameEn: { type: String },
		roleDe: { type: String },
		roleEn: { type: String },
		phone: { type: String },
		email: { type: String },
		image: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// BOARD SECTION
// ============================================================================
export interface IVorstandSection {
	sectionLabelDe?: string;
	sectionLabelEn?: string;
	headingDe?: string;
	headingEn?: string;
	members?: IVorstandMember[];
}

const VorstandSectionSchema = new Schema<IVorstandSection>(
	{
		sectionLabelDe: { type: String, default: "Vorstand" },
		sectionLabelEn: { type: String, default: "Executive Board" },
		headingDe: { type: String, default: "Unsere Führung" },
		headingEn: { type: String, default: "Our Leadership" },
		members: { type: [VorstandMemberSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// TEAM MEMBER
// ============================================================================
export interface ITeamMember {
	nameDe?: string;
	nameEn?: string;
	roleDe?: string;
	roleEn?: string;
	bioDe?: string;
	bioEn?: string;
	phone?: string;
	email?: string;
	image?: string;
}

const TeamMemberSchema = new Schema<ITeamMember>(
	{
		nameDe: { type: String },
		nameEn: { type: String },
		roleDe: { type: String },
		roleEn: { type: String },
		bioDe: { type: String },
		bioEn: { type: String },
		phone: { type: String },
		email: { type: String },
		image: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// TEAM SECTION
// ============================================================================
export interface ITeamSection {
	sectionLabelDe?: string;
	sectionLabelEn?: string;
	headingDe?: string;
	headingEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	members?: ITeamMember[];
}

const TeamSectionSchema = new Schema<ITeamSection>(
	{
		sectionLabelDe: { type: String, default: "Unser Team" },
		sectionLabelEn: { type: String, default: "Team" },
		headingDe: { type: String, default: "Leitende Köpfe" },
		headingEn: { type: String, default: "Leading Heads" },
		descriptionDe: { type: String },
		descriptionEn: { type: String },
		members: { type: [TeamMemberSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// MAIN DOCUMENT
// ============================================================================
export interface IVorstandTeamPage extends Document {
	hero: IVorstandTeamHero;
	vorstand: IVorstandSection;
	team: ITeamSection;
	createdAt: Date;
	updatedAt: Date;
}

const VorstandTeamPageSchema = new Schema<IVorstandTeamPage>(
	{
		hero: { type: VorstandTeamHeroSchema, default: () => ({}) },
		vorstand: { type: VorstandSectionSchema, default: () => ({}) },
		team: { type: TeamSectionSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

let VorstandTeamPageModel: Model<IVorstandTeamPage> | null = null;

export function getVorstandTeamPageModelSync(): Model<IVorstandTeamPage> {
	if (VorstandTeamPageModel) return VorstandTeamPageModel;
	VorstandTeamPageModel =
		(mongoose.models.VorstandTeamPage as Model<IVorstandTeamPage>) ||
		mongoose.model<IVorstandTeamPage>("VorstandTeamPage", VorstandTeamPageSchema);
	return VorstandTeamPageModel;
}

export async function getVorstandTeamPageModel(): Promise<Model<IVorstandTeamPage>> {
	await connectMongoose();
	return getVorstandTeamPageModelSync();
}
