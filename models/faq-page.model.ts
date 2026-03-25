import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export interface IFAQSectionVisibility {
	hero: boolean;
	faqContent: boolean;
	sidebar: boolean;
	newsletter: boolean;
	richContent: boolean;
}

const FAQSectionVisibilitySchema = new Schema<IFAQSectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		faqContent: { type: Boolean, default: true },
		sidebar: { type: Boolean, default: true },
		newsletter: { type: Boolean, default: true },
		richContent: { type: Boolean, default: false },
	},
	{ _id: false }
);

// ============================================================================
// HERO STAT
// ============================================================================
export interface IFAQHeroStat {
	value?: string;
	labelDe?: string;
	labelEn?: string;
}

const FAQHeroStatSchema = new Schema<IFAQHeroStat>(
	{
		value: { type: String, trim: true },
		labelDe: { type: String, trim: true },
		labelEn: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IFAQHeroSection {
	badgeDe?: string;
	badgeEn?: string;
	titleDe?: string;
	titleEn?: string;
	titleHighlightDe?: string;
	titleHighlightEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	stats?: IFAQHeroStat[];
}

const FAQHeroSectionSchema = new Schema<IFAQHeroSection>(
	{
		badgeDe: { type: String, trim: true },
		badgeEn: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		titleHighlightDe: { type: String, trim: true },
		titleHighlightEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		stats: { type: [FAQHeroStatSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// FAQ ITEM
// ============================================================================
export interface IFAQItem {
	questionDe?: string;
	questionEn?: string;
	answerDe?: string;
	answerEn?: string;
	category?: string;
	order?: number;
}

const FAQItemSchema = new Schema<IFAQItem>(
	{
		questionDe: { type: String, trim: true },
		questionEn: { type: String, trim: true },
		answerDe: { type: String, trim: true },
		answerEn: { type: String, trim: true },
		category: { type: String, trim: true },
		order: { type: Number, default: 0 },
	},
	{ _id: false }
);

// ============================================================================
// FAQ CATEGORY
// ============================================================================
export interface IFAQCategory {
	id?: string;
	nameDe?: string;
	nameEn?: string;
	icon?: string;
	order?: number;
}

const FAQCategorySchema = new Schema<IFAQCategory>(
	{
		id: { type: String, trim: true },
		nameDe: { type: String, trim: true },
		nameEn: { type: String, trim: true },
		icon: { type: String, trim: true },
		order: { type: Number, default: 0 },
	},
	{ _id: false }
);

// ============================================================================
// FAQ CONTENT SECTION
// ============================================================================
export interface IFAQContentSection {
	searchPlaceholderDe?: string;
	searchPlaceholderEn?: string;
	noResultsTextDe?: string;
	noResultsTextEn?: string;
	helpTextDe?: string;
	helpTextEn?: string;
	helpButtonTextDe?: string;
	helpButtonTextEn?: string;
	helpButtonHref?: string;
	categories?: IFAQCategory[];
	items?: IFAQItem[];
}

const FAQContentSectionSchema = new Schema<IFAQContentSection>(
	{
		searchPlaceholderDe: { type: String, trim: true },
		searchPlaceholderEn: { type: String, trim: true },
		noResultsTextDe: { type: String, trim: true },
		noResultsTextEn: { type: String, trim: true },
		helpTextDe: { type: String, trim: true },
		helpTextEn: { type: String, trim: true },
		helpButtonTextDe: { type: String, trim: true },
		helpButtonTextEn: { type: String, trim: true },
		helpButtonHref: { type: String, trim: true },
		categories: { type: [FAQCategorySchema], default: [] },
		items: { type: [FAQItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// QUICK LINK
// ============================================================================
export interface IFAQQuickLink {
	labelDe?: string;
	labelEn?: string;
	href?: string;
}

const FAQQuickLinkSchema = new Schema<IFAQQuickLink>(
	{
		labelDe: { type: String, trim: true },
		labelEn: { type: String, trim: true },
		href: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// OFFICE
// ============================================================================
export interface IFAQOffice {
	name?: string;
	address?: string;
}

const FAQOfficeSchema = new Schema<IFAQOffice>(
	{
		name: { type: String, trim: true },
		address: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// SIDEBAR SECTION
// ============================================================================
export interface IFAQSidebarSection {
	contactTitleDe?: string;
	contactTitleEn?: string;
	contactDescriptionDe?: string;
	contactDescriptionEn?: string;
	phone?: string;
	email?: string;
	officeHours?: string;
	contactButtonTextDe?: string;
	contactButtonTextEn?: string;
	contactButtonHref?: string;
	quickLinksTitleDe?: string;
	quickLinksTitleEn?: string;
	quickLinks?: IFAQQuickLink[];
	officesTitleDe?: string;
	officesTitleEn?: string;
	offices?: IFAQOffice[];
}

const FAQSidebarSectionSchema = new Schema<IFAQSidebarSection>(
	{
		contactTitleDe: { type: String, trim: true },
		contactTitleEn: { type: String, trim: true },
		contactDescriptionDe: { type: String, trim: true },
		contactDescriptionEn: { type: String, trim: true },
		phone: { type: String, trim: true },
		email: { type: String, trim: true },
		officeHours: { type: String, trim: true },
		contactButtonTextDe: { type: String, trim: true },
		contactButtonTextEn: { type: String, trim: true },
		contactButtonHref: { type: String, trim: true },
		quickLinksTitleDe: { type: String, trim: true },
		quickLinksTitleEn: { type: String, trim: true },
		quickLinks: { type: [FAQQuickLinkSchema], default: [] },
		officesTitleDe: { type: String, trim: true },
		officesTitleEn: { type: String, trim: true },
		offices: { type: [FAQOfficeSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// NEWSLETTER SECTION
// ============================================================================
export interface IFAQNewsletterSection {
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	inputPlaceholderDe?: string;
	inputPlaceholderEn?: string;
	buttonTextDe?: string;
	buttonTextEn?: string;
	loadingTextDe?: string;
	loadingTextEn?: string;
	successTextDe?: string;
	successTextEn?: string;
	privacyNoteDe?: string;
	privacyNoteEn?: string;
}

const FAQNewsletterSectionSchema = new Schema<IFAQNewsletterSection>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		inputPlaceholderDe: { type: String, trim: true },
		inputPlaceholderEn: { type: String, trim: true },
		buttonTextDe: { type: String, trim: true },
		buttonTextEn: { type: String, trim: true },
		loadingTextDe: { type: String, trim: true },
		loadingTextEn: { type: String, trim: true },
		successTextDe: { type: String, trim: true },
		successTextEn: { type: String, trim: true },
		privacyNoteDe: { type: String, trim: true },
		privacyNoteEn: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// SEO
// ============================================================================
export interface IFAQPageSeo {
	title?: string;
	description?: string;
	keywords?: string[];
	ogImage?: string;
}

const FAQPageSeoSchema = new Schema<IFAQPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		keywords: { type: [String], default: [] },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// MAIN FAQ PAGE
// ============================================================================
export interface IFAQPage extends Document {
	_id: mongoose.Types.ObjectId;
	sectionVisibility: IFAQSectionVisibility;
	hero: IFAQHeroSection;
	faqContent: IFAQContentSection;
	sidebar: IFAQSidebarSection;
	newsletter: IFAQNewsletterSection;
	richContent?: string;
	seo: IFAQPageSeo;
	updatedAt: Date;
	createdAt: Date;
}

const FAQPageSchema = new Schema<IFAQPage>(
	{
		sectionVisibility: {
			type: FAQSectionVisibilitySchema,
			default: {
				hero: true,
				faqContent: true,
				sidebar: true,
				newsletter: true,
				richContent: false,
			},
		},
		hero: { type: FAQHeroSectionSchema, default: {} },
		faqContent: { type: FAQContentSectionSchema, default: {} },
		sidebar: { type: FAQSidebarSectionSchema, default: {} },
		newsletter: { type: FAQNewsletterSectionSchema, default: {} },
		richContent: { type: String, default: "" },
		seo: { type: FAQPageSeoSchema, default: {} },
	},
	{
		timestamps: true,
		collection: "faq_page",
	}
);

// Ensure virtuals are included in JSON
FAQPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

FAQPageSchema.set("toObject", { virtuals: true });

/**
 * Get FAQPage Model
 */
export const getFAQPageModel = async (): Promise<Model<IFAQPage>> => {
	await connectMongoose();

	return (
		(mongoose.models.FAQPage as Model<IFAQPage>) ||
		mongoose.model<IFAQPage>("FAQPage", FAQPageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 */
export function getFAQPageModelSync(): Model<IFAQPage> {
	return (
		(mongoose.models.FAQPage as Model<IFAQPage>) ||
		mongoose.model<IFAQPage>("FAQPage", FAQPageSchema)
	);
}
