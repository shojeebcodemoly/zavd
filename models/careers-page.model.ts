import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface ICareersPageSectionVisibility {
	hero: boolean;
	benefits: boolean;
	jobOpenings: boolean;
	values: boolean;
	applicationForm: boolean;
}

const CareersPageSectionVisibilitySchema =
	new Schema<ICareersPageSectionVisibility>(
		{
			hero: { type: Boolean, default: true },
			benefits: { type: Boolean, default: true },
			jobOpenings: { type: Boolean, default: true },
			values: { type: Boolean, default: true },
			applicationForm: { type: Boolean, default: true },
		},
		{ _id: false }
	);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface ICareersHeroSection {
	badge?: string;
	title?: string;
	titleHighlight?: string;
	subtitle?: string;
}

const CareersHeroSectionSchema = new Schema<ICareersHeroSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		titleHighlight: { type: String, trim: true },
		subtitle: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// BENEFIT
// ============================================================================
export interface ICareersBenefit {
	icon?: string;
	title?: string;
	description?: string;
}

const CareersBenefitSchema = new Schema<ICareersBenefit>(
	{
		icon: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// BENEFITS SECTION
// ============================================================================
export interface ICareersBenefitsSection {
	title?: string;
	subtitle?: string;
	benefits?: ICareersBenefit[];
}

const CareersBenefitsSectionSchema = new Schema<ICareersBenefitsSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		benefits: { type: [CareersBenefitSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// JOB OPENING
// ============================================================================
export interface ICareersJobOpening {
	_id?: mongoose.Types.ObjectId;
	slug?: string;
	title?: string;
	location?: string;
	workType?: string;
	employmentType?: string;
	shortDescription?: string;
	featuredImage?: string;
	description?: string;
	requirements?: string[];
	responsibilities?: string[];
	applyLink?: string;
	isActive?: boolean;
	publishedAt?: Date;
}

const CareersJobOpeningSchema = new Schema<ICareersJobOpening>(
	{
		slug: { type: String, trim: true },
		title: { type: String, trim: true },
		location: { type: String, trim: true },
		workType: { type: String, trim: true },
		employmentType: { type: String, trim: true },
		shortDescription: { type: String, trim: true },
		featuredImage: { type: String, trim: true },
		description: { type: String, trim: true },
		requirements: { type: [String], default: [] },
		responsibilities: { type: [String], default: [] },
		applyLink: { type: String, trim: true },
		isActive: { type: Boolean, default: true },
		publishedAt: { type: Date },
	},
	{ _id: true }
);

// ============================================================================
// JOB OPENINGS SECTION
// ============================================================================
export interface ICareersJobOpeningsSection {
	title?: string;
	subtitle?: string;
	noJobsMessage?: string;
	jobOpenings?: ICareersJobOpening[];
}

const CareersJobOpeningsSectionSchema = new Schema<ICareersJobOpeningsSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		noJobsMessage: { type: String, trim: true },
		jobOpenings: { type: [CareersJobOpeningSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// VALUES SECTION
// ============================================================================
export interface ICareersValuesSection {
	title?: string;
	subtitle?: string;
	values?: string[];
}

const CareersValuesSectionSchema = new Schema<ICareersValuesSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		values: { type: [String], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// CONTACT SIDEBAR
// ============================================================================
export interface ICareersContactSidebar {
	title?: string;
	address?: string;
	email?: string;
	phone?: string;
	secondaryPhone?: string;
	formTitle?: string;
}

const CareersContactSidebarSchema = new Schema<ICareersContactSidebar>(
	{
		title: { type: String, trim: true },
		address: { type: String, trim: true },
		email: { type: String, trim: true },
		phone: { type: String, trim: true },
		secondaryPhone: { type: String, trim: true },
		formTitle: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// EXPERT CTA
// ============================================================================
export interface ICareersExpertCta {
	badge?: string;
	title?: string;
	subtitle?: string;
}

const CareersExpertCtaSchema = new Schema<ICareersExpertCta>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// SEO
// ============================================================================
export interface ICareersPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const CareersPageSeoSchema = new Schema<ICareersPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN CAREERS PAGE
// ============================================================================
export interface ICareersPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: ICareersPageSectionVisibility;
	hero: ICareersHeroSection;
	benefitsSection: ICareersBenefitsSection;
	jobOpeningsSection: ICareersJobOpeningsSection;
	valuesSection: ICareersValuesSection;
	contactSidebar: ICareersContactSidebar;
	expertCta: ICareersExpertCta;
	seo: ICareersPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const CareersPageSchema = new Schema<ICareersPage>(
	{
		sectionVisibility: {
			type: CareersPageSectionVisibilitySchema,
			default: {
				hero: true,
				benefits: true,
				jobOpenings: true,
				values: true,
				applicationForm: true,
			},
		},
		hero: { type: CareersHeroSectionSchema, default: {} },
		benefitsSection: { type: CareersBenefitsSectionSchema, default: {} },
		jobOpeningsSection: { type: CareersJobOpeningsSectionSchema, default: {} },
		valuesSection: { type: CareersValuesSectionSchema, default: {} },
		contactSidebar: { type: CareersContactSidebarSchema, default: {} },
		expertCta: { type: CareersExpertCtaSchema, default: {} },
		seo: { type: CareersPageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "careers_page",
	}
);

// Ensure virtuals are included in JSON
CareersPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

CareersPageSchema.set("toObject", { virtuals: true });

/**
 * Get CareersPage Model
 */
export const getCareersPageModel = async (): Promise<Model<ICareersPage>> => {
	await connectMongoose();

	return (
		(mongoose.models.CareersPage as Model<ICareersPage>) ||
		mongoose.model<ICareersPage>("CareersPage", CareersPageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 */
export function getCareersPageModelSync(): Model<ICareersPage> {
	return (
		(mongoose.models.CareersPage as Model<ICareersPage>) ||
		mongoose.model<ICareersPage>("CareersPage", CareersPageSchema)
	);
}
