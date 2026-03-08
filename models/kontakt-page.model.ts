import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * Hero Section interface
 */
export interface IKontaktHero {
	badge?: string;
	title: string;
	subtitle: string;
	responseTime?: string;
	officeLocationsText?: string;
}

/**
 * Contact Card interface
 */
export interface IContactCard {
	icon: string;
	title: string;
	subtitle?: string;
}

/**
 * Form Section interface
 */
export interface IKontaktFormSection {
	badge?: string;
	title: string;
	subtitle: string;
}

/**
 * Office Section interface
 */
export interface IKontaktOfficeSection {
	badge?: string;
	title: string;
	subtitle: string;
	openingHours?: string;
	closedText?: string;
}

/**
 * FAQ Item interface for contact page
 */
export interface IKontaktFaq {
	question: string;
	answer: string;
}

/**
 * FAQ Section interface
 */
export interface IKontaktFaqSection {
	badge?: string;
	title: string;
	subtitle: string;
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

	// Contact Cards (labels/titles only - actual contact info from SiteSettings)
	phoneCard: IContactCard;
	emailCard: IContactCard;
	socialCard: IContactCard;

	// Form Section
	formSection: IKontaktFormSection;

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
		badge: { type: String, trim: true },
		title: { type: String, required: true, trim: true },
		subtitle: { type: String, required: true, trim: true },
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
		title: { type: String, required: true, trim: true },
		subtitle: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Form Section sub-schema
 */
const KontaktFormSectionSchema = new Schema<IKontaktFormSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, required: true, trim: true },
		subtitle: { type: String, required: true, trim: true },
	},
	{ _id: false }
);

/**
 * Office Section sub-schema
 */
const KontaktOfficeSectionSchema = new Schema<IKontaktOfficeSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, required: true, trim: true },
		subtitle: { type: String, required: true, trim: true },
		openingHours: { type: String, trim: true },
		closedText: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * FAQ Item sub-schema
 */
const KontaktFaqSchema = new Schema<IKontaktFaq>(
	{
		question: { type: String, required: true, trim: true },
		answer: { type: String, required: true, trim: true },
	},
	{ _id: false }
);

/**
 * FAQ Section sub-schema
 */
const KontaktFaqSectionSchema = new Schema<IKontaktFaqSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, required: true, trim: true },
		subtitle: { type: String, required: true, trim: true },
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
				badge: "We're here for you",
				title: "Let's talk about your project",
				subtitle:
					"Do you have questions about our products, training or want to know more about how to start your own clinic? Our team is here to help you.",
				responseTime: "Response within 24 hours",
				officeLocationsText: "Offices in Stockholm & Linköping",
			},
		},
		phoneCard: {
			type: ContactCardSchema,
			required: true,
			default: {
				icon: "Phone",
				title: "Phone",
				subtitle: "Mon-Fri 09:00-17:00",
			},
		},
		emailCard: {
			type: ContactCardSchema,
			required: true,
			default: {
				icon: "Mail",
				title: "Email",
				subtitle: "Response within 24 hours",
			},
		},
		socialCard: {
			type: ContactCardSchema,
			required: true,
			default: {
				icon: "MessageCircle",
				title: "Social Media",
				subtitle: "Follow us for updates",
			},
		},
		formSection: {
			type: KontaktFormSectionSchema,
			required: true,
			default: {
				badge: "Send Message",
				title: "Tell us about your project",
				subtitle:
					"Fill out the form and we'll get back to you as soon as possible.",
			},
		},
		officeSection: {
			type: KontaktOfficeSectionSchema,
			required: true,
			default: {
				badge: "Our Offices",
				title: "Visit Us",
				subtitle:
					"We have offices in Stockholm and Linköping. Welcome to visit us!",
				openingHours: "Mon-Fri 09:00-17:00",
				closedText: "Weekends closed",
			},
		},
		faqSection: {
			type: KontaktFaqSectionSchema,
			required: true,
			default: {
				badge: "FAQ",
				title: "Have Questions?",
				subtitle:
					"Here you'll find answers to the most common questions. Can't find an answer? Feel free to contact us!",
				faqs: [
					{
						question: "How quickly will I get a response?",
						answer:
							"We strive to respond to all inquiries within 24 hours on business days.",
					},
					{
						question: "Can I book a meeting?",
						answer:
							"Absolutely! Indicate in your message that you'd like to book a meeting and we'll get back to you with suggested times.",
					},
					{
						question: "Do you offer demonstrations?",
						answer:
							"Yes, we offer free product demonstrations at our offices or at your location.",
					},
					{
						question: "Are you available on-site?",
						answer:
							"We recommend booking an appointment before visiting to ensure the right person is available.",
					},
				],
			},
		},
		richContent: {
			type: String,
			default: "",
		},
		seo: {
			type: KontaktPageSeoSchema,
			default: {
				title: "Contact Us - Synos Medical",
				description:
					"Contact Synos Medical for questions about medical equipment, training or starting your own clinic. We're located in Stockholm and Linköping.",
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
	return (
		(mongoose.models.KontaktPage as Model<IKontaktPage>) ||
		mongoose.model<IKontaktPage>("KontaktPage", KontaktPageSchema)
	);
}
