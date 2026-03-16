import type { Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";
import { DatabaseError } from "@/lib/utils/api-error";
import { logger } from "@/lib/utils/logger";
import {
	getSiteSettingsModel,
	type ISiteSettings,
	type IOffice,
	type ISocialMedia,
	type ISeoSettings,
	type IBrandingSettings,
	type IFooterSettings,
	type IComingSoonSettings,
	type ISmtpSettings,
	type IDonationWidget,
} from "@/models/site-settings.model";

/**
 * Input type for updating site settings
 */
export interface UpdateSiteSettingsInput {
	companyName?: string;
	orgNumber?: string;
	vatNumber?: string;
	phone?: string;
	email?: string;
	noreplyEmail?: string;
	offices?: IOffice[];
	socialMedia?: Partial<ISocialMedia>;
	seo?: Partial<ISeoSettings>;
	branding?: Partial<IBrandingSettings>;
	footer?: Partial<IFooterSettings>;
	comingSoon?: Partial<IComingSoonSettings>;
	smtp?: Partial<ISmtpSettings>;
	donationWidget?: Partial<IDonationWidget>;
	contactBackground?: string;
}

/**
 * Plain object type for SiteSettings (without Mongoose Document methods)
 */
export type SiteSettingsData = Omit<ISiteSettings, keyof Document>;

/**
 * SiteSettings Repository
 * Handles singleton pattern for site-wide configuration
 */
class SiteSettingsRepository {
	/**
	 * Ensure database connection
	 */
	private async ensureConnection(): Promise<void> {
		await connectMongoose();
	}

	/**
	 * Get the singleton site settings document
	 * Creates one with defaults if it doesn't exist
	 * Returns plain JavaScript object to avoid circular reference issues
	 */
	async get(): Promise<SiteSettingsData> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();
			const SiteSettings = await getSiteSettingsModel();

			// Try to find existing settings - use lean() to get plain object
			let settings = await SiteSettings.findOne({}).lean<SiteSettingsData>().exec();

			// If no settings exist, create with defaults
			if (!settings) {
				const created = await SiteSettings.create({});
				settings = created.toObject() as SiteSettingsData;
				logger.info("Created default site settings");
			}

			logger.db("get", "SiteSettings", Date.now() - startTime);
			return settings;
		} catch (error) {
			logger.error("Error getting site settings", error);
			throw new DatabaseError("Failed to get site settings");
		}
	}

	/**
	 * Update site settings
	 * Uses upsert to ensure document exists
	 * Returns plain JavaScript object to avoid circular reference issues
	 */
	async update(data: UpdateSiteSettingsInput): Promise<SiteSettingsData> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();
			const SiteSettings = await getSiteSettingsModel();

			// Build update object, handling nested objects properly
			const updateData: Record<string, unknown> = {};

			// Direct fields
			if (data.companyName !== undefined)
				updateData.companyName = data.companyName;
			if (data.orgNumber !== undefined) updateData.orgNumber = data.orgNumber;
			if (data.vatNumber !== undefined) updateData.vatNumber = data.vatNumber;
			if (data.phone !== undefined) updateData.phone = data.phone;
			if (data.email !== undefined) updateData.email = data.email;
			if (data.noreplyEmail !== undefined)
				updateData.noreplyEmail = data.noreplyEmail;
			if (data.offices !== undefined) updateData.offices = data.offices;
		if (data.contactBackground !== undefined)
			updateData.contactBackground = data.contactBackground;

			// Nested objects - single DB fetch, then merge
			const needsExisting =
				data.socialMedia !== undefined ||
				data.seo !== undefined ||
				data.branding !== undefined ||
				data.footer !== undefined ||
				data.comingSoon !== undefined ||
				data.smtp !== undefined ||
				data.donationWidget !== undefined;

			const existing = needsExisting ? await this.get() : null;

			if (data.socialMedia !== undefined) {
				updateData.socialMedia = {
					...existing!.socialMedia,
					...data.socialMedia,
				};
			}

			if (data.seo !== undefined) {
				updateData.seo = {
					...existing!.seo,
					...data.seo,
				};
			}

			if (data.branding !== undefined) {
				updateData.branding = {
					...existing!.branding,
					...data.branding,
				};
			}

			if (data.footer !== undefined) {
				updateData.footer = {
					...existing!.footer,
					...data.footer,
				};
			}

			if (data.comingSoon !== undefined) {
				updateData.comingSoon = {
					...existing!.comingSoon,
					...data.comingSoon,
				};
			}

			if (data.smtp !== undefined) {
				updateData.smtp = {
					...existing!.smtp,
					...data.smtp,
				};
			}

			if (data.donationWidget !== undefined) {
				updateData.donationWidget = {
					...existing!.donationWidget,
					...data.donationWidget,
				};
			}

			// Upsert: update if exists, create if not - use lean() to get plain object
			const settings = await SiteSettings.findOneAndUpdate(
				{},
				{ $set: updateData },
				{ new: true, upsert: true, runValidators: true }
			).lean<SiteSettingsData>().exec();

			if (!settings) {
				throw new DatabaseError("Failed to update site settings");
			}

			logger.db("update", "SiteSettings", Date.now() - startTime);
			logger.info("Site settings updated");

			return settings;
		} catch (error) {
			logger.error("Error updating site settings", error);
			throw new DatabaseError("Failed to update site settings");
		}
	}

	/**
	 * Get contact information only
	 */
	async getContact(): Promise<{
		phone: string;
		email: string;
		offices: IOffice[];
	}> {
		const settings = await this.get();
		return {
			phone: settings.phone,
			email: settings.email,
			offices: settings.offices,
		};
	}

	/**
	 * Get company information only
	 */
	async getCompanyInfo(): Promise<{
		companyName: string;
		orgNumber: string;
		vatNumber?: string;
	}> {
		const settings = await this.get();
		return {
			companyName: settings.companyName,
			orgNumber: settings.orgNumber,
			vatNumber: settings.vatNumber,
		};
	}

	/**
	 * Get social media links only
	 */
	async getSocialMedia(): Promise<ISocialMedia> {
		const settings = await this.get();
		return settings.socialMedia;
	}

	/**
	 * Get SEO settings only
	 */
	async getSeo(): Promise<ISeoSettings> {
		const settings = await this.get();
		return settings.seo;
	}

	/**
	 * Get headquarters office
	 */
	async getHeadquarters(): Promise<IOffice | undefined> {
		const settings = await this.get();
		return settings.offices.find((office) => office.isHeadquarters);
	}

	/**
	 * Get branding settings only
	 */
	async getBranding(): Promise<IBrandingSettings> {
		const settings = await this.get();
		return (
			settings.branding || {
				logoUrl: "/storage/zavd-logo-mobile-2000x485.png",
			}
		);
	}

	/**
	 * Get footer settings only
	 */
	async getFooter(): Promise<IFooterSettings> {
		const settings = await this.get();
		return (
			settings.footer || {
				quickLinksTitle: "Snabblänkar",
				contactTitle: "Kontakta oss",
				newsletterTitle: "Håll dig uppdaterad",
				quickLinks: [
					{ label: "Om oss", href: "/om-oss" },
					{ label: "Produkter", href: "/produkter" },
					{ label: "Tjänster", href: "/service" },
					{ label: "Utbildningar", href: "/utbildningar" },
					{ label: "Nyheter", href: "/nyheter" },
					{ label: "Kontakt", href: "/kontakt" },
				],
				newsletterDescription:
					"Prenumerera på vårt nyhetsbrev för de senaste produktuppdateringarna och branschnyheter.",
				newsletterPlaceholder: "Din e-postadress",
				newsletterButtonText: "Prenumerera",
				bottomLinks: [
					{ label: "Integritetspolicy", href: "/integritetspolicy" },
					{ label: "Villkor", href: "/villkor" },
					{ label: "Sitemap", href: "/sitemap.xml" },
				],
			}
		);
	}

	/**
	 * Get coming soon settings only
	 */
	async getComingSoon(): Promise<IComingSoonSettings> {
		const settings = await this.get();
		return (
			settings.comingSoon || {
				enabled: false,
				heading: "Demnächst verfügbar",
				description:
					"Wir arbeiten an etwas Besonderem für die assyrische Gemeinschaft. Unsere neue Website wird in Kürze online gehen – bleiben Sie gespannt!",
				newsletterTitle: "Newsletter",
				newsletterDescription:
					"Abonnieren Sie unseren Newsletter und bleiben Sie über die neuesten Nachrichten und Veranstaltungen von ZAVD informiert.",
				emailPlaceholder: "E-Mail-Adresse",
				buttonText: "Anmelden",
				designedBy: "ZAVD – Zentralverband Assyrischer Vereinigungen in Deutschland",
			}
		);
	}
}

// Export singleton instance
export const siteSettingsRepository = new SiteSettingsRepository();