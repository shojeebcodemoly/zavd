import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface IPrivacySectionVisibility {
	hero: boolean;
	introduction: boolean;
	dataCollection: boolean;
	purposeOfProcessing: boolean;
	legalBasis: boolean;
	dataRetention: boolean;
	dataSharing: boolean;
	yourRights: boolean;
	security: boolean;
	cookies: boolean;
	contact: boolean;
	policyChanges: boolean;
	cta: boolean;
}

const PrivacySectionVisibilitySchema = new Schema<IPrivacySectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		introduction: { type: Boolean, default: true },
		dataCollection: { type: Boolean, default: true },
		purposeOfProcessing: { type: Boolean, default: true },
		legalBasis: { type: Boolean, default: true },
		dataRetention: { type: Boolean, default: true },
		dataSharing: { type: Boolean, default: true },
		yourRights: { type: Boolean, default: true },
		security: { type: Boolean, default: true },
		cookies: { type: Boolean, default: true },
		contact: { type: Boolean, default: true },
		policyChanges: { type: Boolean, default: true },
		cta: { type: Boolean, default: true },
	},
	{ _id: false }
);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IPrivacyHeroSection {
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	lastUpdated?: string;
}

const PrivacyHeroSectionSchema = new Schema<IPrivacyHeroSection>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		lastUpdated: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// CONTENT SECTION (Generic for policy sections)
// ============================================================================
export interface IPrivacyContentItem {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

const PrivacyContentItemSchema = new Schema<IPrivacyContentItem>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
	},
	{ _id: false }
);

export interface IPrivacyContentSection {
	sectionNumber?: string;
	titleDe?: string;
	titleEn?: string;
	introDe?: string;
	introEn?: string;
	items?: IPrivacyContentItem[];
	outroDe?: string;
	outroEn?: string;
	highlighted?: boolean;
}

const PrivacyContentSectionSchema = new Schema<IPrivacyContentSection>(
	{
		sectionNumber: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		introDe: { type: String, trim: true },
		introEn: { type: String, trim: true },
		items: { type: [PrivacyContentItemSchema], default: [] },
		outroDe: { type: String, trim: true },
		outroEn: { type: String, trim: true },
		highlighted: { type: Boolean, default: false },
	},
	{ _id: false }
);

// ============================================================================
// CONTACT SECTION
// ============================================================================
export interface IPrivacyContactSection {
	sectionNumber?: string;
	titleDe?: string;
	titleEn?: string;
	introDe?: string;
	introEn?: string;
	companyName?: string;
	organizationNumber?: string;
	email?: string;
	phone?: string;
	addresses?: string[];
	highlighted?: boolean;
}

const PrivacyContactSectionSchema = new Schema<IPrivacyContactSection>(
	{
		sectionNumber: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		introDe: { type: String, trim: true },
		introEn: { type: String, trim: true },
		companyName: { type: String, trim: true },
		organizationNumber: { type: String, trim: true },
		email: { type: String, trim: true },
		phone: { type: String, trim: true },
		addresses: { type: [String], default: [] },
		highlighted: { type: Boolean, default: false },
	},
	{ _id: false }
);

// ============================================================================
// CTA BUTTON
// ============================================================================
export interface IPrivacyCtaButton {
	textDe?: string;
	textEn?: string;
	href?: string;
}

const PrivacyCtaButtonSchema = new Schema<IPrivacyCtaButton>(
	{
		textDe: { type: String, trim: true },
		textEn: { type: String, trim: true },
		href: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// CTA SECTION
// ============================================================================
export interface IPrivacyCtaSection {
	textDe?: string;
	textEn?: string;
	primaryCta?: IPrivacyCtaButton;
	secondaryCta?: IPrivacyCtaButton;
}

const PrivacyCtaSectionSchema = new Schema<IPrivacyCtaSection>(
	{
		textDe: { type: String, trim: true },
		textEn: { type: String, trim: true },
		primaryCta: { type: PrivacyCtaButtonSchema },
		secondaryCta: { type: PrivacyCtaButtonSchema },
	},
	{ _id: false }
);

// ============================================================================
// SEO
// ============================================================================
export interface IPrivacyPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const PrivacyPageSeoSchema = new Schema<IPrivacyPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN PRIVACY PAGE
// ============================================================================
export interface IPrivacyPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: IPrivacySectionVisibility;
	hero: IPrivacyHeroSection;
	introduction: IPrivacyContentSection;
	dataCollection: IPrivacyContentSection;
	purposeOfProcessing: IPrivacyContentSection;
	legalBasis: IPrivacyContentSection;
	dataRetention: IPrivacyContentSection;
	dataSharing: IPrivacyContentSection;
	yourRights: IPrivacyContentSection;
	security: IPrivacyContentSection;
	cookies: IPrivacyContentSection;
	contact: IPrivacyContactSection;
	policyChanges: IPrivacyContentSection;
	ctaSection: IPrivacyCtaSection;
	seo: IPrivacyPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const PrivacyPageSchema = new Schema<IPrivacyPage>(
	{
		sectionVisibility: {
			type: PrivacySectionVisibilitySchema,
			default: {
				hero: true,
				introduction: true,
				dataCollection: true,
				purposeOfProcessing: true,
				legalBasis: true,
				dataRetention: true,
				dataSharing: true,
				yourRights: true,
				security: true,
				cookies: true,
				contact: true,
				policyChanges: true,
				cta: true,
			},
		},
		hero: { type: PrivacyHeroSectionSchema, default: {} },
		introduction: { type: PrivacyContentSectionSchema, default: {} },
		dataCollection: { type: PrivacyContentSectionSchema, default: {} },
		purposeOfProcessing: { type: PrivacyContentSectionSchema, default: {} },
		legalBasis: { type: PrivacyContentSectionSchema, default: {} },
		dataRetention: { type: PrivacyContentSectionSchema, default: {} },
		dataSharing: { type: PrivacyContentSectionSchema, default: {} },
		yourRights: { type: PrivacyContentSectionSchema, default: {} },
		security: { type: PrivacyContentSectionSchema, default: {} },
		cookies: { type: PrivacyContentSectionSchema, default: {} },
		contact: { type: PrivacyContactSectionSchema, default: {} },
		policyChanges: { type: PrivacyContentSectionSchema, default: {} },
		ctaSection: { type: PrivacyCtaSectionSchema, default: {} },
		seo: { type: PrivacyPageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "privacy_page",
	}
);

// Ensure virtuals are included in JSON
PrivacyPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

PrivacyPageSchema.set("toObject", { virtuals: true });

/**
 * Get PrivacyPage Model
 */
export const getPrivacyPageModel = async (): Promise<Model<IPrivacyPage>> => {
	await connectMongoose();

	return (
		(mongoose.models.PrivacyPage as Model<IPrivacyPage>) ||
		mongoose.model<IPrivacyPage>("PrivacyPage", PrivacyPageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 */
export function getPrivacyPageModelSync(): Model<IPrivacyPage> {
	return (
		(mongoose.models.PrivacyPage as Model<IPrivacyPage>) ||
		mongoose.model<IPrivacyPage>("PrivacyPage", PrivacyPageSchema)
	);
}
