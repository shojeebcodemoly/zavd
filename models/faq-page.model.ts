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
	label?: string;
}

const FAQHeroStatSchema = new Schema<IFAQHeroStat>(
	{
		value: { type: String, trim: true },
		label: { type: String, trim: true },
	},
	{ _id: false }
);

// ============================================================================
// HERO SECTION
// ============================================================================
export interface IFAQHeroSection {
	badge?: string;
	title?: string;
	titleHighlight?: string;
	subtitle?: string;
	stats?: IFAQHeroStat[];
}

const FAQHeroSectionSchema = new Schema<IFAQHeroSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		titleHighlight: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		stats: { type: [FAQHeroStatSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// FAQ ITEM
// ============================================================================
export interface IFAQItem {
	question?: string;
	answer?: string;
	category?: string;
	order?: number;
}

const FAQItemSchema = new Schema<IFAQItem>(
	{
		question: { type: String, trim: true },
		answer: { type: String, trim: true },
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
	name?: string;
	icon?: string;
	order?: number;
}

const FAQCategorySchema = new Schema<IFAQCategory>(
	{
		id: { type: String, trim: true },
		name: { type: String, trim: true },
		icon: { type: String, trim: true },
		order: { type: Number, default: 0 },
	},
	{ _id: false }
);

// ============================================================================
// FAQ CONTENT SECTION
// ============================================================================
export interface IFAQContentSection {
	searchPlaceholder?: string;
	noResultsText?: string;
	helpText?: string;
	helpButtonText?: string;
	helpButtonHref?: string;
	categories?: IFAQCategory[];
	items?: IFAQItem[];
}

const FAQContentSectionSchema = new Schema<IFAQContentSection>(
	{
		searchPlaceholder: { type: String, trim: true },
		noResultsText: { type: String, trim: true },
		helpText: { type: String, trim: true },
		helpButtonText: { type: String, trim: true },
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
	label?: string;
	href?: string;
}

const FAQQuickLinkSchema = new Schema<IFAQQuickLink>(
	{
		label: { type: String, trim: true },
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
	contactTitle?: string;
	contactDescription?: string;
	phone?: string;
	email?: string;
	officeHours?: string;
	contactButtonText?: string;
	contactButtonHref?: string;
	quickLinksTitle?: string;
	quickLinks?: IFAQQuickLink[];
	officesTitle?: string;
	offices?: IFAQOffice[];
}

const FAQSidebarSectionSchema = new Schema<IFAQSidebarSection>(
	{
		contactTitle: { type: String, trim: true },
		contactDescription: { type: String, trim: true },
		phone: { type: String, trim: true },
		email: { type: String, trim: true },
		officeHours: { type: String, trim: true },
		contactButtonText: { type: String, trim: true },
		contactButtonHref: { type: String, trim: true },
		quickLinksTitle: { type: String, trim: true },
		quickLinks: { type: [FAQQuickLinkSchema], default: [] },
		officesTitle: { type: String, trim: true },
		offices: { type: [FAQOfficeSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// NEWSLETTER SECTION
// ============================================================================
export interface IFAQNewsletterSection {
	title?: string;
	subtitle?: string;
	inputPlaceholder?: string;
	buttonText?: string;
	loadingText?: string;
	successText?: string;
	privacyNote?: string;
}

const FAQNewsletterSectionSchema = new Schema<IFAQNewsletterSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		inputPlaceholder: { type: String, trim: true },
		buttonText: { type: String, trim: true },
		loadingText: { type: String, trim: true },
		successText: { type: String, trim: true },
		privacyNote: { type: String, trim: true },
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
