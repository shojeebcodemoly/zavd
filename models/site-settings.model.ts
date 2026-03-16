import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * Office address interface
 */
export interface IOffice {
	name: string; // "Stockholm", "Linköping"
	street: string; // "Turebergsvägen 5"
	postalCode: string; // "191 47"
	city: string; // "Sollentuna"
	country: string; // "Sverige"
	isHeadquarters: boolean;
	isVisible: boolean; // Show/hide office on frontend
	// Google Maps embed URL - user-friendly input
	mapEmbedUrl?: string;
}

/**
 * Social media links interface
 */
export interface ISocialMedia {
	facebook?: string;
	instagram?: string;
	linkedin?: string;
	twitter?: string;
	youtube?: string;
	pinterest?: string;
}

/**
 * SEO settings interface
 */
export interface ISeoSettings {
	siteName: string; // "Zavd Medical"
	siteTagline?: string; // "Ost från Boxholm"
	siteDescription: string; // Default meta description
	ogImage?: string; // Default OG image URL
	keywords?: string[]; // Default keywords
	twitterHandle?: string; // @zavdmedical
}

/**
 * Branding settings interface
 */
export interface IBrandingSettings {
	logoUrl: string; // "/storage/zavd-logo-beige-glow.svg"
	faviconUrl?: string; // "/storage/favicon.ico"
	dashboardLogoUrl?: string; // Logo for admin dashboard
}

/**
 * Footer link interface
 */
export interface IFooterLink {
	label: string;
	href: string;
	isExternal?: boolean;
}

/**
 * Footer banner settings interface (pre-footer CTA section with background image)
 */
export interface IFooterBanner {
	enabled: boolean;
	backgroundImage?: string;
	badge?: string; // e.g., "ZAVDMAKING"
	title?: string; // e.g., "We make the creative solutions for modern brands."
	ctaText?: string; // e.g., "About Us"
	ctaHref?: string; // e.g., "/about"
}

/**
 * Footer settings interface
 */
export interface IFooterSettings {
	// Banner/CTA section above footer
	banner?: IFooterBanner;
	// Quick links section
	quickLinksTitle: string; // "Snabblänkar"
	contactTitle: string; // "Kontakta oss"
	newsletterTitle: string; // "Håll dig uppdaterad"
	quickLinks: IFooterLink[];
	newsletterDescription: string;
	newsletterPlaceholder: string; // "Din e-postadress"
	newsletterButtonText: string; // "Prenumerera"
	bottomLinks: IFooterLink[];
}

/**
 * Coming Soon page settings interface
 */
export interface IComingSoonSettings {
	enabled: boolean; // Whether coming soon mode is active
	heading: string; // "Kommer snart"
	description: string; // Main body text
	newsletterTitle: string; // "Nyhetsbrev"
	newsletterDescription: string; // Newsletter sub-text
	emailPlaceholder: string; // "E-postadress"
	buttonText: string; // "Skicka"
	designedBy: string; // "ZAVD - Zentralverband Assyrischer Vereinigungen in Deutschland"
}

/**
 * Donation widget settings interface
 */
export interface IDonationWidget {
	enabled: boolean;
	title?: string;
	amounts: number[];
	currency?: string;
	buttonText?: string;
	donationLink?: string;
}

/**
 * SMTP / Email notification settings interface
 */
export interface ISmtpSettings {
	host?: string;
	port?: number;
	username?: string;
	password?: string;
	encryption?: "none" | "ssl" | "tls";
	fromName?: string;
	fromEmail?: string;
	adminNotificationEmail?: string;
	enabled?: boolean;
}

/**
 * SiteSettings interface extending Mongoose Document
 * Singleton model for site-wide configuration
 */
export interface ISiteSettings extends Document {
	_id: mongoose.Types.ObjectId;

	// Company Information
	companyName: string; // "Zavd Medical AB"
	orgNumber: string; // "556871-8075"
	vatNumber?: string; // "SE556871807501"

	// Contact Information
	phone: string; // "010-205 15 01"
	email: string; // "info@zavd.se"
	noreplyEmail?: string; // "noreply@zavd.se"

	// Office Locations
	offices: IOffice[];

	// Social Media
	socialMedia: ISocialMedia;

	// SEO Defaults
	seo: ISeoSettings;

	// Branding (logo, favicon)
	branding: IBrandingSettings;

	// Footer settings
	footer: IFooterSettings;

	// Coming Soon page
	comingSoon: IComingSoonSettings;

	// SMTP / Email notifications
	smtp: ISmtpSettings;

	// Contact card background image (shown in project page sidebars)
	contactBackground?: string;

	// Donation widget (shown in project page sidebars)
	donationWidget: IDonationWidget;

	// Timestamps
	updatedAt: Date;
	createdAt: Date;
}

/**
 * Office sub-schema
 */
const OfficeSchema = new Schema<IOffice>(
	{
		name: {
			type: String,
			required: [true, "Office name is required"],
			trim: true,
		},
		street: {
			type: String,
			required: [true, "Street address is required"],
			trim: true,
		},
		postalCode: {
			type: String,
			required: [true, "Postal code is required"],
			trim: true,
		},
		city: {
			type: String,
			required: [true, "City is required"],
			trim: true,
		},
		country: {
			type: String,
			default: "Sverige",
			trim: true,
		},
		isHeadquarters: {
			type: Boolean,
			default: false,
		},
		isVisible: {
			type: Boolean,
			default: true,
		},
		mapEmbedUrl: {
			type: String,
			trim: true,
		},
	},
	{ _id: false }
);

/**
 * Social Media sub-schema
 */
const SocialMediaSchema = new Schema<ISocialMedia>(
	{
		facebook: { type: String, trim: true },
		instagram: { type: String, trim: true },
		linkedin: { type: String, trim: true },
		twitter: { type: String, trim: true },
		youtube: { type: String, trim: true },
		pinterest: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * SEO sub-schema
 */
const SeoSettingsSchema = new Schema<ISeoSettings>(
	{
		siteName: {
			type: String,
			required: [true, "Site name is required"],
			trim: true,
			default: "Your Company",
		},
		siteTagline: {
			type: String,
			trim: true,
			maxlength: 150,
		},
		siteDescription: {
			type: String,
			trim: true,
			default: "Your company description goes here.",
		},
		ogImage: { type: String, trim: true },
		keywords: [{ type: String, trim: true }],
		twitterHandle: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Branding sub-schema
 */
const BrandingSettingsSchema = new Schema<IBrandingSettings>(
	{
		logoUrl: {
			type: String,
			trim: true,
			default: "/storage/zavd-logo-mobile-2000x485.png",
		},
		faviconUrl: { type: String, trim: true },
		dashboardLogoUrl: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Footer banner sub-schema
 */
const FooterBannerSchema = new Schema<IFooterBanner>(
	{
		enabled: { type: Boolean, default: true },
		backgroundImage: { type: String, trim: true },
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		ctaText: { type: String, trim: true },
		ctaHref: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Footer link sub-schema
 */
const FooterLinkSchema = new Schema<IFooterLink>(
	{
		label: {
			type: String,
			required: [true, "Link label is required"],
			trim: true,
		},
		href: {
			type: String,
			required: [true, "Link URL is required"],
			trim: true,
		},
		isExternal: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
);

/**
 * Footer settings sub-schema
 */
const FooterSettingsSchema = new Schema<IFooterSettings>(
	{
		banner: {
			type: FooterBannerSchema,
			default: {
				enabled: true,
				badge: "ZAVD",
				title: "We make the creative solutions for modern brands.",
				ctaText: "About Us",
				ctaHref: "/about",
			},
		},
		quickLinksTitle: {
			type: String,
			trim: true,
			default: "Snabblänkar",
		},
		contactTitle: {
			type: String,
			trim: true,
			default: "Kontakta oss",
		},
		newsletterTitle: {
			type: String,
			trim: true,
			default: "Håll dig uppdaterad",
		},
		quickLinks: {
			type: [FooterLinkSchema],
			default: [
				{ label: "Om oss", href: "/om-oss" },
				{ label: "Produkter", href: "/produkter" },
				{ label: "Tjänster", href: "/service" },
				{ label: "Utbildningar", href: "/utbildningar" },
				{ label: "Nyheter", href: "/nyheter" },
				{ label: "Kontakt", href: "/kontakt" },
			],
		},
		newsletterDescription: {
			type: String,
			trim: true,
			default:
				"Prenumerera på vårt nyhetsbrev för de senaste produktuppdateringarna och branschnyheter.",
		},
		newsletterPlaceholder: {
			type: String,
			trim: true,
			default: "Din e-postadress",
		},
		newsletterButtonText: {
			type: String,
			trim: true,
			default: "Prenumerera",
		},
		bottomLinks: {
			type: [FooterLinkSchema],
			default: [
				{ label: "Integritetspolicy", href: "/integritetspolicy" },
				{ label: "Villkor", href: "/villkor" },
				{ label: "Sitemap", href: "/sitemap.xml" },
			],
		},
	},
	{ _id: false }
);

/**
 * Coming Soon settings sub-schema
 */
const ComingSoonSettingsSchema = new Schema<IComingSoonSettings>(
	{
		enabled: { type: Boolean, default: false },
		heading: { type: String, trim: true, default: "Kommer snart" },
		description: {
			type: String,
			trim: true,
			default:
				"Något nytt är på väg… Vi förbereder lanseringen av något spännande. Vi finjusterar detaljerna och ses snart!",
		},
		newsletterTitle: { type: String, trim: true, default: "Nyhetsbrev" },
		newsletterDescription: {
			type: String,
			trim: true,
			default:
				"Prenumerera för att hålla dig uppdaterad om ny webbdesign och senaste uppdateringar. Låt oss göra det!",
		},
		emailPlaceholder: { type: String, trim: true, default: "E-postadress" },
		buttonText: { type: String, trim: true, default: "Skicka" },
		designedBy: { type: String, trim: true, default: "ZAVD - Zentralverband Assyrischer Vereinigungen in Deutschland" },
	},
	{ _id: false }
);

/**
 * SMTP Settings sub-schema
 */
const SmtpSettingsSchema = new Schema<ISmtpSettings>(
	{
		enabled: { type: Boolean, default: false },
		host: { type: String, trim: true },
		port: { type: Number, default: 587 },
		username: { type: String, trim: true },
		password: { type: String, trim: true },
		encryption: {
			type: String,
			enum: ["none", "ssl", "tls"],
			default: "tls",
		},
		fromName: { type: String, trim: true },
		fromEmail: { type: String, trim: true, lowercase: true },
		adminNotificationEmail: { type: String, trim: true, lowercase: true },
	},
	{ _id: false }
);

/**
 * Donation widget sub-schema
 */
const DonationWidgetSchema = new Schema<IDonationWidget>(
	{
		enabled: { type: Boolean, default: false },
		title: { type: String, default: "Make a Donation" },
		amounts: { type: [Number], default: [5, 10, 25, 50, 100, 200, 300] },
		currency: { type: String, default: "€" },
		buttonText: { type: String, default: "Donate Now" },
		donationLink: { type: String, default: "" },
	},
	{ _id: false }
);

/**
 * SiteSettings Schema
 * Singleton model - only one document should exist
 */
const SiteSettingsSchema = new Schema<ISiteSettings>(
	{
		companyName: {
			type: String,
			required: [true, "Company name is required"],
			trim: true,
			default: "Your Company AB",
		},
		orgNumber: {
			type: String,
			required: [true, "Organization number is required"],
			trim: true,
			default: "000000-0000",
		},
		vatNumber: {
			type: String,
			trim: true,
		},
		phone: {
			type: String,
			required: [true, "Phone number is required"],
			trim: true,
			default: "000-000 00 00",
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			trim: true,
			lowercase: true,
			default: "info@example.com",
		},
		noreplyEmail: {
			type: String,
			trim: true,
			lowercase: true,
		},
		offices: {
			type: [OfficeSchema],
			default: [
				{
					name: "Main Office",
					street: "Street Address",
					postalCode: "00000",
					city: "City",
					country: "Sverige",
					isHeadquarters: true,
					isVisible: true,
				},
			],
		},
		socialMedia: {
			type: SocialMediaSchema,
			default: {},
		},
		seo: {
			type: SeoSettingsSchema,
			default: {
				siteName: "Your Company",
				siteDescription: "Your company description goes here.",
			},
		},
		branding: {
			type: BrandingSettingsSchema,
			default: {
				logoUrl: "/storage/logo.svg",
			},
		},
		footer: {
			type: FooterSettingsSchema,
			default: {},
		},
		comingSoon: {
			type: ComingSoonSettingsSchema,
			default: {},
		},
		smtp: {
			type: SmtpSettingsSchema,
			default: {},
		},
		contactBackground: {
			type: String,
			default: "",
		},
		donationWidget: {
			type: DonationWidgetSchema,
			default: {},
		},
	},
	{
		timestamps: true,
		collection: "site_settings",
	}
);

// Ensure virtuals are included in JSON
SiteSettingsSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

SiteSettingsSchema.set("toObject", { virtuals: true });

/**
 * Get SiteSettings Model
 * In dev, always delete the cached model so schema changes (e.g. new fields)
 * are picked up on the next request without needing a full server restart.
 * In production the model is compiled once on startup and reused.
 */
export const getSiteSettingsModel = async (): Promise<Model<ISiteSettings>> => {
	await connectMongoose();

	if (process.env.NODE_ENV !== "production" && mongoose.models.SiteSettings) {
		delete (mongoose.models as Record<string, unknown>).SiteSettings;
	}

	return (
		(mongoose.models.SiteSettings as Model<ISiteSettings>) ||
		mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getSiteSettingsModelSync(): Model<ISiteSettings> {
	return (
		(mongoose.models.SiteSettings as Model<ISiteSettings>) ||
		mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema)
	);
}
