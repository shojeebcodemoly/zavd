import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface ITrainingPageSectionVisibility {
	hero: boolean;
	mainContent: boolean;
	benefits: boolean;
	process: boolean;
	support: boolean;
	inquiryForm: boolean;
	resources: boolean;
	richContent: boolean;
}

const TrainingPageSectionVisibilitySchema =
	new Schema<ITrainingPageSectionVisibility>(
		{
			hero: { type: Boolean, default: true },
			mainContent: { type: Boolean, default: true },
			benefits: { type: Boolean, default: true },
			process: { type: Boolean, default: true },
			support: { type: Boolean, default: true },
			inquiryForm: { type: Boolean, default: true },
			resources: { type: Boolean, default: true },
			richContent: { type: Boolean, default: false },
		},
		{ _id: false }
	);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface ITrainingHeroSection {
	title?: string;
	titleHighlight?: string;
	subtitle?: string;
}

const TrainingHeroSectionSchema = new Schema<ITrainingHeroSection>(
	{
		title: { type: String, trim: true },
		titleHighlight: { type: String, trim: true },
		subtitle: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN CONTENT SECTION
// ============================================================================
export interface ITrainingMainContentSection {
	title?: string;
	paragraphs?: string[];
}

const TrainingMainContentSectionSchema = new Schema<ITrainingMainContentSection>(
	{
		title: { type: String, trim: true },
		paragraphs: { type: [String], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// BENEFIT CARD
// ============================================================================
export interface ITrainingBenefitCard {
	icon?: string;
	title?: string;
	description?: string;
}

const TrainingBenefitCardSchema = new Schema<ITrainingBenefitCard>(
	{
		icon: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// PROCESS STEP
// ============================================================================
export interface ITrainingProcessStep {
	number?: string;
	title?: string;
	description?: string;
}

const TrainingProcessStepSchema = new Schema<ITrainingProcessStep>(
	{
		number: { type: String, trim: true },
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// PROCESS SECTION
// ============================================================================
export interface ITrainingProcessSection {
	title?: string;
	subtitle?: string;
	steps?: ITrainingProcessStep[];
}

const TrainingProcessSectionSchema = new Schema<ITrainingProcessSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		steps: { type: [TrainingProcessStepSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// SUPPORT SECTION
// ============================================================================
export interface ITrainingSupportSection {
	title?: string;
	paragraphs?: string[];
	phone?: string;
	email?: string;
}

const TrainingSupportSectionSchema = new Schema<ITrainingSupportSection>(
	{
		title: { type: String, trim: true },
		paragraphs: { type: [String], default: [] },
		phone: { type: String, trim: true },
		email: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// INQUIRY SECTION
// ============================================================================
export interface ITrainingInquirySection {
	badge?: string;
	title?: string;
	subtitle?: string;
}

const TrainingInquirySectionSchema = new Schema<ITrainingInquirySection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// RESOURCE CARD
// ============================================================================
export interface ITrainingResourceCard {
	title?: string;
	description?: string;
	href?: string;
	buttonText?: string;
}

const TrainingResourceCardSchema = new Schema<ITrainingResourceCard>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		href: { type: String, trim: true },
		buttonText: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// RESOURCES SECTION
// ============================================================================
export interface ITrainingResourcesSection {
	title?: string;
	subtitle?: string;
	resources?: ITrainingResourceCard[];
}

const TrainingResourcesSectionSchema = new Schema<ITrainingResourcesSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		resources: { type: [TrainingResourceCardSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// SEO
// ============================================================================
export interface ITrainingPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const TrainingPageSeoSchema = new Schema<ITrainingPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN TRAINING PAGE
// ============================================================================
export interface ITrainingPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: ITrainingPageSectionVisibility;
	hero: ITrainingHeroSection;
	mainContent: ITrainingMainContentSection;
	benefits: ITrainingBenefitCard[];
	processSection: ITrainingProcessSection;
	supportSection: ITrainingSupportSection;
	inquirySection: ITrainingInquirySection;
	resourcesSection: ITrainingResourcesSection;
	richContent?: string;
	seo: ITrainingPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const TrainingPageSchema = new Schema<ITrainingPage>(
	{
		sectionVisibility: {
			type: TrainingPageSectionVisibilitySchema,
			default: {
				hero: true,
				mainContent: true,
				benefits: true,
				process: true,
				support: true,
				inquiryForm: true,
				resources: true,
				richContent: false,
			},
		},
		hero: { type: TrainingHeroSectionSchema, default: {} },
		mainContent: { type: TrainingMainContentSectionSchema, default: {} },
		benefits: { type: [TrainingBenefitCardSchema], default: [] },
		processSection: { type: TrainingProcessSectionSchema, default: {} },
		supportSection: { type: TrainingSupportSectionSchema, default: {} },
		inquirySection: { type: TrainingInquirySectionSchema, default: {} },
		resourcesSection: { type: TrainingResourcesSectionSchema, default: {} },
		richContent: { type: String, default: "" },
		seo: { type: TrainingPageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "training_page",
	}
);

// Ensure virtuals are included in JSON
TrainingPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

TrainingPageSchema.set("toObject", { virtuals: true });

/**
 * Get TrainingPage Model
 */
export const getTrainingPageModel = async (): Promise<Model<ITrainingPage>> => {
	await connectMongoose();

	return (
		(mongoose.models.TrainingPage as Model<ITrainingPage>) ||
		mongoose.model<ITrainingPage>("TrainingPage", TrainingPageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 */
export function getTrainingPageModelSync(): Model<ITrainingPage> {
	return (
		(mongoose.models.TrainingPage as Model<ITrainingPage>) ||
		mongoose.model<ITrainingPage>("TrainingPage", TrainingPageSchema)
	);
}
