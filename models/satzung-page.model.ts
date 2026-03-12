import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

// ============================================================================
// HERO SECTION
// ============================================================================
export interface ISatzungHero {
	taglineDe?: string;
	taglineEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

const SatzungHeroSchema = new Schema<ISatzungHero>(
	{
		taglineDe: { type: String, default: "Rechtliches Rahmenwerk" },
		taglineEn: { type: String, default: "Legal Framework" },
		titleDe: { type: String, default: "Satzung" },
		titleEn: { type: String, default: "Statutes" },
		subtitleDe: { type: String, default: "Das rechtliche Fundament, das den ZAVD regelt und die Mission und Werte unserer Gemeinschaft leitet." },
		subtitleEn: { type: String, default: "The legal foundation that governs the ZAVD and guides our community's mission and values." },
		image: { type: String, default: "/images/about/aboutbanner.jpg" },
	},
	{ _id: false }
);

// ============================================================================
// SEARCH SECTION
// ============================================================================
export interface ISatzungSearchSection {
	tagDe?: string;
	tagEn?: string;
	headingDe?: string;
	headingEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	placeholderDe?: string;
	placeholderEn?: string;
}

const SatzungSearchSectionSchema = new Schema<ISatzungSearchSection>(
	{
		tagDe: { type: String, default: "Verfassung" },
		tagEn: { type: String, default: "Constitution" },
		headingDe: { type: String, default: "Alle 14 Abschnitte erkunden" },
		headingEn: { type: String, default: "Explore All 14 Sections" },
		descriptionDe: { type: String, default: "Durchsuchen Sie die vollständige Satzung des ZAVD. Nutzen Sie die Suche, um den gewünschten Abschnitt schnell zu finden." },
		descriptionEn: { type: String, default: "Browse through the complete statutes of the ZAVD. Use the search to quickly find the section you need." },
		placeholderDe: { type: String, default: "Abschnitte suchen…" },
		placeholderEn: { type: String, default: "Search sections…" },
	},
	{ _id: false }
);

// ============================================================================
// FAQ ITEM
// ============================================================================
export interface ISatzungFaqItem {
	titleDe?: string;
	titleEn?: string;
	contentDe?: string[];
	contentEn?: string[];
}

const SatzungFaqItemSchema = new Schema<ISatzungFaqItem>(
	{
		titleDe: { type: String },
		titleEn: { type: String },
		contentDe: { type: [String], default: [] },
		contentEn: { type: [String], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// FAQ SECTION
// ============================================================================
export interface ISatzungFaqSection {
	tagDe?: string;
	tagEn?: string;
	headingDe?: string;
	headingEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	items?: ISatzungFaqItem[];
}

const SatzungFaqSectionSchema = new Schema<ISatzungFaqSection>(
	{
		tagDe: { type: String, default: "Satzung" },
		tagEn: { type: String, default: "Statutes" },
		headingDe: { type: String, default: "Häufig gestellte Fragen" },
		headingEn: { type: String, default: "Frequently Asked Questions" },
		descriptionDe: { type: String, default: "Hier finden Sie Antworten auf häufige Fragen zur ZAVD-Satzung und ihrer Organisationsstruktur." },
		descriptionEn: { type: String, default: "Find answers to common questions about the ZAVD statutes and its governing structure." },
		items: { type: [SatzungFaqItemSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// TESTIMONIAL ITEM
// ============================================================================
export interface ISatzungTestimonial {
	nameDe?: string;
	nameEn?: string;
	roleDe?: string;
	roleEn?: string;
	quoteDe?: string;
	quoteEn?: string;
	image?: string;
}

const SatzungTestimonialSchema = new Schema<ISatzungTestimonial>(
	{
		nameDe: { type: String },
		nameEn: { type: String },
		roleDe: { type: String },
		roleEn: { type: String },
		quoteDe: { type: String },
		quoteEn: { type: String },
		image: { type: String },
	},
	{ _id: false }
);

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================
export interface ISatzungTestimonialsSection {
	headingDe?: string;
	headingEn?: string;
	items?: ISatzungTestimonial[];
}

const SatzungTestimonialsSectionSchema = new Schema<ISatzungTestimonialsSection>(
	{
		headingDe: { type: String, default: "Was unsere Gemeinschaft sagt" },
		headingEn: { type: String, default: "What Our Community Says" },
		items: { type: [SatzungTestimonialSchema], default: [] },
	},
	{ _id: false }
);

// ============================================================================
// MAIN DOCUMENT
// ============================================================================
export interface ISatzungPage extends Document {
	hero: ISatzungHero;
	searchSection: ISatzungSearchSection;
	faqSection: ISatzungFaqSection;
	testimonials: ISatzungTestimonialsSection;
	createdAt: Date;
	updatedAt: Date;
}

const SatzungPageSchema = new Schema<ISatzungPage>(
	{
		hero: { type: SatzungHeroSchema, default: () => ({}) },
		searchSection: { type: SatzungSearchSectionSchema, default: () => ({}) },
		faqSection: { type: SatzungFaqSectionSchema, default: () => ({}) },
		testimonials: { type: SatzungTestimonialsSectionSchema, default: () => ({}) },
	},
	{ timestamps: true }
);

let SatzungPageModel: Model<ISatzungPage> | null = null;

export function getSatzungPageModelSync(): Model<ISatzungPage> {
	if (SatzungPageModel) return SatzungPageModel;
	SatzungPageModel =
		(mongoose.models.SatzungPage as Model<ISatzungPage>) ||
		mongoose.model<ISatzungPage>("SatzungPage", SatzungPageSchema);
	return SatzungPageModel;
}

export async function getSatzungPageModel(): Promise<Model<ISatzungPage>> {
	await connectMongoose();
	return getSatzungPageModelSync();
}
