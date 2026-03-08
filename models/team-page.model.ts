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
	badge?: string;
	title?: string;
	subtitle?: string;
}

const TeamHeroSectionSchema = new Schema<ITeamHeroSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// STATS SECTION
// ============================================================================
export interface ITeamStat {
	value?: string;
	label?: string;
	suffix?: string;
}

const TeamStatSchema = new Schema<ITeamStat>(
	{
		value: { type: String, trim: true },
		label: { type: String, trim: true },
		suffix: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// TEAM MEMBER
// ============================================================================
export interface ITeamMember {
	name?: string;
	role?: string;
	department?: string;
	bio?: string;
	image?: string;
	email?: string;
	linkedin?: string;
	phone?: string;
}

const TeamMemberSchema = new Schema<ITeamMember>(
	{
		name: { type: String, trim: true },
		role: { type: String, trim: true },
		department: { type: String, trim: true },
		bio: { type: String, trim: true },
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
	title?: string;
	description?: string;
}

const TeamValueSchema = new Schema<ITeamValue>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

export interface ITeamValuesSection {
	title?: string;
	subtitle?: string;
	values?: ITeamValue[];
}

const TeamValuesSectionSchema = new Schema<ITeamValuesSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		values: { type: [TeamValueSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// CTA BUTTON
// ============================================================================
export interface ITeamCtaButton {
	text?: string;
	href?: string;
}

const TeamCtaButtonSchema = new Schema<ITeamCtaButton>(
	{
		text: { type: String, trim: true },
		href: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// JOIN US SECTION
// ============================================================================
export interface ITeamJoinUsSection {
	title?: string;
	description?: string;
	primaryCta?: ITeamCtaButton;
	secondaryCta?: ITeamCtaButton;
}

const TeamJoinUsSectionSchema = new Schema<ITeamJoinUsSection>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		primaryCta: { type: TeamCtaButtonSchema },
		secondaryCta: { type: TeamCtaButtonSchema },
	},
	{ _id: false }
);

// ============================================================================
// CONTACT SECTION
// ============================================================================
export interface ITeamContactSection {
	title?: string;
	description?: string;
	phone?: string;
	email?: string;
}

const TeamContactSectionSchema = new Schema<ITeamContactSection>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
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
