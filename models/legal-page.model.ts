import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface ILegalSectionVisibility {
	hero: boolean;
	legalCards: boolean;
	companyInfo: boolean;
	terms: boolean;
	gdprRights: boolean;
	cta: boolean;
}

const LegalSectionVisibilitySchema = new Schema<ILegalSectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		legalCards: { type: Boolean, default: true },
		companyInfo: { type: Boolean, default: true },
		terms: { type: Boolean, default: true },
		gdprRights: { type: Boolean, default: true },
		cta: { type: Boolean, default: true },
	},
	{ _id: false }
);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface ILegalHeroSection {
	badgeDe?: string;
	badgeEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
}

const LegalHeroSectionSchema = new Schema<ILegalHeroSection>(
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
// LEGAL CARD
// ============================================================================
export interface ILegalCard {
	icon?: string;
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	href?: string;
	highlightsDe?: string[];
	highlightsEn?: string[];
}

const LegalCardSchema = new Schema<ILegalCard>(
	{
		icon: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
		href: { type: String, trim: true },
		highlightsDe: [{ type: String, trim: true }],
		highlightsEn: [{ type: String, trim: true }],
	},
	{ _id: false }
);

// ============================================================================
// COMPANY INFO
// ============================================================================
export interface ILegalOfficeAddress {
	name?: string;
	address?: string;
}

const LegalOfficeAddressSchema = new Schema<ILegalOfficeAddress>(
	{
		name: { type: String, trim: true },
		address: { type: String, trim: true },
	},
	{ _id: false }
);

export interface ILegalCompanyInfo {
	companyName?: string;
	organizationNumber?: string;
	vatNumber?: string;
	registeredSeat?: string;
	offices?: ILegalOfficeAddress[];
	email?: string;
	phone?: string;
}

const LegalCompanyInfoSchema = new Schema<ILegalCompanyInfo>(
	{
		companyName: { type: String, trim: true },
		organizationNumber: { type: String, trim: true },
		vatNumber: { type: String, trim: true },
		registeredSeat: { type: String, trim: true },
		offices: { type: [LegalOfficeAddressSchema], default: [] },
		email: { type: String, trim: true },
		phone: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// TERMS SECTION
// ============================================================================
export interface ILegalTerm {
	titleDe?: string;
	titleEn?: string;
	contentDe?: string;
	contentEn?: string;
}

const LegalTermSchema = new Schema<ILegalTerm>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		contentDe: { type: String, trim: true },
		contentEn: { type: String, trim: true },
	},
	{ _id: false }
);

export interface ILegalTermsSection {
	titleDe?: string;
	titleEn?: string;
	terms?: ILegalTerm[];
}

const LegalTermsSectionSchema = new Schema<ILegalTermsSection>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		terms: { type: [LegalTermSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// GDPR RIGHTS SECTION
// ============================================================================
export interface ILegalGdprRight {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

const LegalGdprRightSchema = new Schema<ILegalGdprRight>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
	},
	{ _id: false }
);

export interface ILegalGdprSection {
	titleDe?: string;
	titleEn?: string;
	rights?: ILegalGdprRight[];
	primaryCta?: {
		textDe?: string;
		textEn?: string;
		href?: string;
	};
	secondaryCta?: {
		textDe?: string;
		textEn?: string;
		href?: string;
	};
}

const LegalGdprSectionSchema = new Schema<ILegalGdprSection>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		rights: { type: [LegalGdprRightSchema], default: [] },
		primaryCta: {
			type: new Schema(
				{
					textDe: { type: String, trim: true },
					textEn: { type: String, trim: true },
					href: { type: String, trim: true },
				},
				{ _id: false }
			),
		},
		secondaryCta: {
			type: new Schema(
				{
					textDe: { type: String, trim: true },
					textEn: { type: String, trim: true },
					href: { type: String, trim: true },
				},
				{ _id: false }
			),
		},
	},
	{ _id: false }
);

// ============================================================================
// CTA SECTION
// ============================================================================
export interface ILegalCtaSection {
	textDe?: string;
	textEn?: string;
	primaryCta?: {
		textDe?: string;
		textEn?: string;
		href?: string;
	};
	secondaryCta?: {
		textDe?: string;
		textEn?: string;
		href?: string;
	};
}

const LegalCtaSectionSchema = new Schema<ILegalCtaSection>(
	{
		textDe: { type: String, trim: true },
		textEn: { type: String, trim: true },
		primaryCta: {
			type: new Schema(
				{
					textDe: { type: String, trim: true },
					textEn: { type: String, trim: true },
					href: { type: String, trim: true },
				},
				{ _id: false }
			),
		},
		secondaryCta: {
			type: new Schema(
				{
					textDe: { type: String, trim: true },
					textEn: { type: String, trim: true },
					href: { type: String, trim: true },
				},
				{ _id: false }
			),
		},
	},
	{ _id: false }
);

// ============================================================================
// SEO
// ============================================================================
export interface ILegalPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

const LegalPageSeoSchema = new Schema<ILegalPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN LEGAL PAGE
// ============================================================================
export interface ILegalPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: ILegalSectionVisibility;
	hero: ILegalHeroSection;
	legalCards: ILegalCard[];
	companyInfo: ILegalCompanyInfo;
	termsSection: ILegalTermsSection;
	gdprSection: ILegalGdprSection;
	ctaSection: ILegalCtaSection;
	seo: ILegalPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const LegalPageSchema = new Schema<ILegalPage>(
	{
		sectionVisibility: {
			type: LegalSectionVisibilitySchema,
			default: {
				hero: true,
				legalCards: true,
				companyInfo: true,
				terms: true,
				gdprRights: true,
				cta: true,
			},
		},
		hero: { type: LegalHeroSectionSchema, default: {} },
		legalCards: { type: [LegalCardSchema], default: [] },
		companyInfo: { type: LegalCompanyInfoSchema, default: {} },
		termsSection: { type: LegalTermsSectionSchema, default: {} },
		gdprSection: { type: LegalGdprSectionSchema, default: {} },
		ctaSection: { type: LegalCtaSectionSchema, default: {} },
		seo: { type: LegalPageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "legal_page",
	}
);

// Ensure virtuals are included in JSON
LegalPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

LegalPageSchema.set("toObject", { virtuals: true });

/**
 * Get LegalPage Model
 */
export const getLegalPageModel = async (): Promise<Model<ILegalPage>> => {
	await connectMongoose();

	return (
		(mongoose.models.LegalPage as Model<ILegalPage>) ||
		mongoose.model<ILegalPage>("LegalPage", LegalPageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 */
export function getLegalPageModelSync(): Model<ILegalPage> {
	return (
		(mongoose.models.LegalPage as Model<ILegalPage>) ||
		mongoose.model<ILegalPage>("LegalPage", LegalPageSchema)
	);
}
