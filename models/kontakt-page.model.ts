import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * Hero Section interface
 */
export interface IKontaktHero {
	backgroundImage?: string;
	breadcrumb?: string;
	titleDe: string;
	titleEn: string;
	subtitleDe: string;
	subtitleEn: string;
	responseTime?: string;
	officeLocationsText?: string;
}

/**
 * Contact Card interface
 */
export interface IContactCard {
	icon: string;
	titleDe: string;
	titleEn: string;
	subtitleDe?: string;
	subtitleEn?: string;
}

/**
 * Contact Info Section interface (left column)
 */
export interface IKontaktContactInfo {
	badgeDe?: string;
	badgeEn?: string;
	headingDe?: string;
	headingEn?: string;
	addressLabelDe?: string;
	addressLabelEn?: string;
	address?: string;
	emailLabelDe?: string;
	emailLabelEn?: string;
	email?: string;
	phoneLabelDe?: string;
	phoneLabelEn?: string;
	phone?: string;
}

/**
 * Form Section interface
 */
export interface IKontaktFormSection {
	headingDe?: string;
	headingEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
}

/**
 * Map Section interface
 */
export interface IKontaktMapSection {
	embedUrl?: string;
}

/**
 * Connect Section interface (top cyan banner + dark social section)
 */
export interface IKontaktConnectSection {
	badgeDe?: string;
	badgeEn?: string;
	backgroundImage?: string;
	headingDe?: string;
	headingEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

/**
 * Office Section interface
 */
export interface IKontaktOfficeSection {
	badgeDe?: string;
	badgeEn?: string;
	titleDe: string;
	titleEn: string;
	subtitleDe: string;
	subtitleEn: string;
	openingHoursDe?: string;
	openingHoursEn?: string;
	closedTextDe?: string;
	closedTextEn?: string;
}

/**
 * FAQ Item interface for contact page
 */
export interface IKontaktFaq {
	questionDe: string;
	questionEn: string;
	answerDe: string;
	answerEn: string;
}

/**
 * FAQ Section interface
 */
export interface IKontaktFaqSection {
	badgeDe?: string;
	badgeEn?: string;
	titleDe: string;
	titleEn: string;
	subtitleDe: string;
	subtitleEn: string;
	faqs: IKontaktFaq[];
}

/**
 * SEO Settings interface
 */
export interface IKontaktPageSeo {
	title?: string;
	description?: string;
	ogImage?: string;
}

/**
 * Section Visibility interface
 */
export interface IKontaktSectionVisibility {
	hero: boolean;
	contactCards: boolean;
	formSection: boolean;
	officeSection: boolean;
	faqSection: boolean;
	richContent: boolean;
}

/**
 * KontaktPage interface extending Mongoose Document
 * Singleton model for contact page content
 */
export interface IKontaktPage extends Document {
	_id: mongoose.Types.ObjectId;

	// Section Visibility
	sectionVisibility: IKontaktSectionVisibility;

	// Hero Section
	hero: IKontaktHero;

	// Contact Info (left column)
	contactInfo: IKontaktContactInfo;

	// Contact Cards (labels/titles only - actual contact info from SiteSettings)
	phoneCard: IContactCard;
	emailCard: IContactCard;
	socialCard: IContactCard;

	// Form Section
	formSection: IKontaktFormSection;

	// Map Section
	mapSection: IKontaktMapSection;

	// Connect Section
	connectSection: IKontaktConnectSection;

	// Office Section
	officeSection: IKontaktOfficeSection;

	// FAQ Section
	faqSection: IKontaktFaqSection;

	// Rich Content (HTML from text editor)
	richContent?: string;

	// SEO
	seo: IKontaktPageSeo;

	// Timestamps
	updatedAt: Date;
	createdAt: Date;
}

/**
 * Hero Section sub-schema
 */
const KontaktHeroSchema = new Schema<IKontaktHero>(
	{
		backgroundImage: { type: String, trim: true },
		breadcrumb: { type: String, trim: true },
		titleDe: { type: String, required: true, trim: true },
		titleEn: { type: String, required: true, trim: true },
		subtitleDe: { type: String, required: true, trim: true },
		subtitleEn: { type: String, required: true, trim: true },
		responseTime: { type: String, trim: true },
		officeLocationsText: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Contact Card sub-schema
 */
const ContactCardSchema = new Schema<IContactCard>(
	{
		icon: { type: String, required: true, trim: true },
		titleDe: { type: String, required: true, trim: true },
		titleEn: { type: String, required: true, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Contact Info sub-schema
 */
const KontaktContactInfoSchema = new Schema<IKontaktContactInfo>(
	{
		badgeDe: { type: String, trim: true },
		badgeEn: { type: String, trim: true },
		headingDe: { type: String, trim: true },
		headingEn: { type: String, trim: true },
		addressLabelDe: { type: String, trim: true },
		addressLabelEn: { type: String, trim: true },
		address: { type: String, trim: true },
		emailLabelDe: { type: String, trim: true },
		emailLabelEn: { type: String, trim: true },
		email: { type: String, trim: true },
		phoneLabelDe: { type: String, trim: true },
		phoneLabelEn: { type: String, trim: true },
		phone: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Form Section sub-schema
 */
const KontaktFormSectionSchema = new Schema<IKontaktFormSection>(
	{
		headingDe: { type: String, trim: true },
		headingEn: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Map Section sub-schema
 */
const KontaktMapSectionSchema = new Schema<IKontaktMapSection>(
	{
		embedUrl: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Connect Section sub-schema
 */
const KontaktConnectSectionSchema = new Schema<IKontaktConnectSection>(
	{
		badgeDe: { type: String, trim: true },
		badgeEn: { type: String, trim: true },
		backgroundImage: { type: String, trim: true },
		headingDe: { type: String, trim: true },
		headingEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Office Section sub-schema
 */
const KontaktOfficeSectionSchema = new Schema<IKontaktOfficeSection>(
	{
		badgeDe: { type: String, trim: true },
		badgeEn: { type: String, trim: true },
		titleDe: { type: String, required: true, trim: true },
		titleEn: { type: String, required: true, trim: true },
		subtitleDe: { type: String, required: true, trim: true },
		subtitleEn: { type: String, required: true, trim: true },
		openingHoursDe: { type: String, trim: true },
		openingHoursEn: { type: String, trim: true },
		closedTextDe: { type: String, trim: true },
		closedTextEn: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * FAQ Item sub-schema
 */
const KontaktFaqSchema = new Schema<IKontaktFaq>(
	{
		questionDe: { type: String, required: true, trim: true },
		questionEn: { type: String, required: true, trim: true },
		answerDe: { type: String, required: true, trim: true },
		answerEn: { type: String, required: true, trim: true },
	},
	{ _id: false }
);

/**
 * FAQ Section sub-schema
 */
const KontaktFaqSectionSchema = new Schema<IKontaktFaqSection>(
	{
		badgeDe: { type: String, trim: true },
		badgeEn: { type: String, trim: true },
		titleDe: { type: String, required: true, trim: true },
		titleEn: { type: String, required: true, trim: true },
		subtitleDe: { type: String, required: true, trim: true },
		subtitleEn: { type: String, required: true, trim: true },
		faqs: { type: [KontaktFaqSchema], default: [] },
	},
	{ _id: false }
);

/**
 * SEO sub-schema
 */
const KontaktPageSeoSchema = new Schema<IKontaktPageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Section Visibility sub-schema
 */
const KontaktSectionVisibilitySchema = new Schema<IKontaktSectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		contactCards: { type: Boolean, default: true },
		formSection: { type: Boolean, default: true },
		officeSection: { type: Boolean, default: true },
		faqSection: { type: Boolean, default: true },
		richContent: { type: Boolean, default: false },
	},
	{ _id: false }
);

/**
 * KontaktPage Schema
 * Singleton model - only one document should exist
 */
const KontaktPageSchema = new Schema<IKontaktPage>(
	{
		sectionVisibility: {
			type: KontaktSectionVisibilitySchema,
			default: {
				hero: true,
				contactCards: true,
				formSection: true,
				officeSection: true,
				faqSection: true,
				richContent: false,
			},
		},
		hero: {
			type: KontaktHeroSchema,
			required: true,
			default: {
				backgroundImage: "",
				breadcrumb: "Home > Contact Us",
				titleDe: "Kontaktieren Sie uns",
				titleEn: "Contact Us",
				subtitleDe: "Nehmen Sie Kontakt mit uns auf. Wir sind hier, um Ihnen zu helfen.",
				subtitleEn: "Get in touch with us. We are here to help you.",
				responseTime: "",
				officeLocationsText: "",
			},
		},
		contactInfo: {
			type: KontaktContactInfoSchema,
			default: {
				badgeDe: "Kontakt",
				badgeEn: "Contact",
				headingDe: "Kontaktieren Sie uns",
				headingEn: "Get in Touch",
				addressLabelDe: "Unsere Adresse",
				addressLabelEn: "Our Address",
				address: "",
				emailLabelDe: "E-Mail-Adresse",
				emailLabelEn: "Email Address",
				phoneLabelDe: "Telefonnummer",
				phoneLabelEn: "Phone Number",
			},
		},
		phoneCard: {
			type: ContactCardSchema,
			required: true,
			default: {
				icon: "Phone",
				titleDe: "Telefon",
				titleEn: "Phone",
				subtitleDe: "Mo-Fr 09:00-17:00",
				subtitleEn: "Mon-Fri 09:00-17:00",
			},
		},
		emailCard: {
			type: ContactCardSchema,
			required: true,
			default: {
				icon: "Mail",
				titleDe: "E-Mail",
				titleEn: "Email",
				subtitleDe: "Antwort innerhalb von 24 Stunden",
				subtitleEn: "Response within 24 hours",
			},
		},
		socialCard: {
			type: ContactCardSchema,
			required: true,
			default: {
				icon: "MessageCircle",
				titleDe: "Soziale Medien",
				titleEn: "Social Media",
				subtitleDe: "Folgen Sie uns für Updates",
				subtitleEn: "Follow us for updates",
			},
		},
		formSection: {
			type: KontaktFormSectionSchema,
			required: true,
			default: {
				headingDe: "Haben Sie Fragen?",
				headingEn: "Have Any Question?",
				titleDe: "Erzählen Sie uns von Ihrem Projekt",
				titleEn: "Tell us about your project",
				subtitleDe: "Füllen Sie das Formular aus und wir melden uns so schnell wie möglich bei Ihnen.",
				subtitleEn: "Fill out the form and we'll get back to you as soon as possible.",
			},
		},
		mapSection: {
			type: KontaktMapSectionSchema,
			default: {
				embedUrl: "",
			},
		},
		connectSection: {
			type: KontaktConnectSectionSchema,
			default: {
				badgeDe: "Verbinden Sie sich mit uns",
				badgeEn: "Connect With Us",
				backgroundImage: "",
				headingDe: "KONTAKTIEREN SIE UNS",
				headingEn: "GET IN TOUCH",
				descriptionDe: "Verbinden Sie sich mit uns in den sozialen Medien und bleiben Sie über unsere neuesten Nachrichten und Veranstaltungen auf dem Laufenden.",
				descriptionEn: "Connect with us on social media and stay updated with our latest news and events.",
			},
		},
		officeSection: {
			type: KontaktOfficeSectionSchema,
			required: true,
			default: {
				badgeDe: "Unsere Büros",
				badgeEn: "Our Offices",
				titleDe: "Besuchen Sie uns",
				titleEn: "Visit Us",
				subtitleDe:
					"Wir haben Büros in Stockholm und Linköping. Besuchen Sie uns gerne!",
				subtitleEn:
					"We have offices in Stockholm and Linköping. Welcome to visit us!",
				openingHoursDe: "Mo-Fr 09:00-17:00",
				openingHoursEn: "Mon-Fri 09:00-17:00",
				closedTextDe: "Wochenenden geschlossen",
				closedTextEn: "Weekends closed",
			},
		},
		faqSection: {
			type: KontaktFaqSectionSchema,
			required: true,
			default: {
				badgeDe: "FAQ",
				badgeEn: "FAQ",
				titleDe: "Haben Sie Fragen?",
				titleEn: "Have Questions?",
				subtitleDe: "Hier finden Sie Antworten auf die häufigsten Fragen. Keine Antwort gefunden? Kontaktieren Sie uns!",
				subtitleEn: "Here you'll find answers to the most common questions. Can't find an answer? Feel free to contact us!",
				faqs: [],
			},
		},
		richContent: {
			type: String,
			default: "",
		},
		seo: {
			type: KontaktPageSeoSchema,
			default: {
				title: "Contact Us - ZAVD",
				description:
					"Contact ZAVD for questions about our community programs, services, or organization.",
			},
		},
	},
	{
		timestamps: true,
		collection: "kontakt_page",
	}
);

// Ensure virtuals are included in JSON
KontaktPageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

KontaktPageSchema.set("toObject", { virtuals: true });

/**
 * Get KontaktPage Model
 * Uses function to prevent model overwrite during hot reload
 */
export const getKontaktPageModel = async (): Promise<Model<IKontaktPage>> => {
	await connectMongoose();

	if (process.env.NODE_ENV !== "production" && mongoose.models.KontaktPage) {
		mongoose.deleteModel("KontaktPage");
	}

	return (
		(mongoose.models.KontaktPage as Model<IKontaktPage>) ||
		mongoose.model<IKontaktPage>("KontaktPage", KontaktPageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getKontaktPageModelSync(): Model<IKontaktPage> {
	if (process.env.NODE_ENV !== "production" && mongoose.models.KontaktPage) {
		mongoose.deleteModel("KontaktPage");
	}

	return (
		(mongoose.models.KontaktPage as Model<IKontaktPage>) ||
		mongoose.model<IKontaktPage>("KontaktPage", KontaktPageSchema)
	);
}
