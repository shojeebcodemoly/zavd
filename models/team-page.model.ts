import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface ITeamSectionVisibility {
	hero: boolean;
	stats: boolean;
	teamMembers: boolean;
	values: boolean;
	joinUs: boolean;
	contact: boolean;
	richContent: boolean;
}

const TeamSectionVisibilitySchema = new Schema<ITeamSectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		stats: { type: Boolean, default: true },
		teamMembers: { type: Boolean, default: true },
		values: { type: Boolean, default: true },
		joinUs: { type: Boolean, default: true },
		contact: { type: Boolean, default: true },
		richContent: { type: Boolean, default: false },
	},
	{ _id: false }
);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface ITeamHeroSection {
	badgeDe?: string;
	badgeEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
}

const TeamHeroSectionSchema = new Schema<ITeamHeroSection>(
	{
		badgeDe: { type: String, trim: true },
		badgeEn: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// STATS SECTION
// ============================================================================
export interface ITeamStat {
	value?: string;
	labelDe?: string;
	labelEn?: string;
	suffix?: string;
}

const TeamStatSchema = new Schema<ITeamStat>(
	{
		value: { type: String, trim: true },
		labelDe: { type: String, trim: true },
		labelEn: { type: String, trim: true },
		suffix: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// TEAM MEMBER
// ============================================================================
export interface ITeamMember {
	name?: string;
	roleDe?: string;
	roleEn?: string;
	departmentDe?: string;
	departmentEn?: string;
	bioDe?: string;
	bioEn?: string;
	image?: string;
	email?: string;
	linkedin?: string;
	phone?: string;
}

const TeamMemberSchema = new Schema<ITeamMember>(
	{
		name: { type: String, trim: true },
		roleDe: { type: String, trim: true },
		roleEn: { type: String, trim: true },
		departmentDe: { type: String, trim: true },
		departmentEn: { type: String, trim: true },
		bioDe: { type: String, trim: true },
		bioEn: { type: String, trim: true },
		image: { type: String, trim: true },
		email: { type: String, trim: true },
		linkedin: { type: String, trim: true },
		phone: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// VALUES SECTION
// ============================================================================
export interface ITeamValue {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

const TeamValueSchema = new Schema<ITeamValue>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
	},
	{ _id: false }
);

export interface ITeamValuesSection {
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	values?: ITeamValue[];
}

const TeamValuesSectionSchema = new Schema<ITeamValuesSection>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		values: { type: [TeamValueSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// CTA BUTTON
// ============================================================================
export interface ITeamCtaButton {
	textDe?: string;
	textEn?: string;
	href?: string;
}

const TeamCtaButtonSchema = new Schema<ITeamCtaButton>(
	{
		textDe: { type: String, trim: true },
		textEn: { type: String, trim: true },
		href: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// JOIN US SECTION
// ============================================================================
export interface ITeamJoinUsSection {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	primaryCta?: ITeamCtaButton;
	secondaryCta?: ITeamCtaButton;
}

const TeamJoinUsSectionSchema = new Schema<ITeamJoinUsSection>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
		primaryCta: { type: TeamCtaButtonSchema },
		secondaryCta: { type: TeamCtaButtonSchema },
	},
	{ _id: false }
);

// ============================================================================
// CONTACT SECTION
// ============================================================================
export interface ITeamContactSection {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	phone?: string;
	email?: string;
}

const TeamContactSectionSchema = new Schema<ITeamContactSection>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
		phone: { type: String, trim: true },
		email: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// SEO
// ============================================================================
export interface ITeamPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const TeamPageSeoSchema = new Schema<ITeamPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN TEAM PAGE
// ============================================================================
export interface ITeamPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: ITeamSectionVisibility;
	hero: ITeamHeroSection;
	stats: ITeamStat[];
	teamMembers: ITeamMember[];
	valuesSection: ITeamValuesSection;
	joinUs: ITeamJoinUsSection;
	contact: ITeamContactSection;
	richContent?: string;
	seo: ITeamPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const TeamPageSchema = new Schema<ITeamPage>(
	{
		sectionVisibility: {
			type: TeamSectionVisibilitySchema,
			default: {
				hero: true,
				stats: true,
				teamMembers: true,
				values: true,
				joinUs: true,
				contact: true,
				richContent: false,
			},
		},
		hero: { type: TeamHeroSectionSchema, default: {} },
		stats: { type: [TeamStatSchema], default: [] },
		teamMembers: { type: [TeamMemberSchema], default: [] },
		valuesSection: { type: TeamValuesSectionSchema, default: {} },
		joinUs: { type: TeamJoinUsSectionSchema, default: {} },
		contact: { type: TeamContactSectionSchema, default: {} },
		richContent: { type: String, default: "" },
		seo: { type: TeamPageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "team_page",
	}
);

// Ensure virtuals are included in JSON
TeamPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

TeamPageSchema.set("toObject", { virtuals: true });

/**
 * Get TeamPage Model
 */
export const getTeamPageModel = async (): Promise<Model<ITeamPage>> => {
	await connectMongoose();

	return (
		(mongoose.models.TeamPage as Model<ITeamPage>) ||
		mongoose.model<ITeamPage>("TeamPage", TeamPageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 */
export function getTeamPageModelSync(): Model<ITeamPage> {
	return (
		(mongoose.models.TeamPage as Model<ITeamPage>) ||
		mongoose.model<ITeamPage>("TeamPage", TeamPageSchema)
	);
}
