import { z } from "zod";

/**
 * Optional URL validation
 */
const optionalUrlSchema = z.string().url().optional().or(z.literal(""));

/**
 * Office schema
 */
export const officeSchema = z.object({
	name: z
		.string()
		.min(1, "Office name is required")
		.max(100, "Office name cannot exceed 100 characters"),
	street: z
		.string()
		.min(1, "Street address is required")
		.max(200, "Street address cannot exceed 200 characters"),
	postalCode: z
		.string()
		.min(1, "Postal code is required")
		.max(20, "Postal code cannot exceed 20 characters"),
	city: z
		.string()
		.min(1, "City is required")
		.max(100, "City cannot exceed 100 characters"),
	country: z.string().max(100).default("Sverige"),
	isHeadquarters: z.boolean().default(false),
	isVisible: z.boolean().default(true),
	mapEmbedUrl: z.string().optional(),
});

/**
 * Social media schema
 */
export const socialMediaSchema = z.object({
	facebook: optionalUrlSchema,
	instagram: optionalUrlSchema,
	linkedin: optionalUrlSchema,
	twitter: optionalUrlSchema,
	youtube: optionalUrlSchema,
});

/**
 * SEO settings schema
 */
export const seoSettingsSchema = z.object({
	siteName: z
		.string()
		.min(1, "Site name is required")
		.max(100, "Site name cannot exceed 100 characters"),
	siteTagline: z
		.string()
		.max(150, "Site tagline cannot exceed 150 characters")
		.optional(),
	siteDescription: z
		.string()
		.max(500, "Site description cannot exceed 500 characters")
		.optional(),
	ogImage: z.string().optional(),
	keywords: z.array(z.string()).optional(),
	twitterHandle: z
		.string()
		.max(50, "Twitter handle cannot exceed 50 characters")
		.optional(),
});

/**
 * Branding settings schema
 */
export const brandingSettingsSchema = z.object({
	logoUrl: z
		.string()
		.max(500, "Logo URL cannot exceed 500 characters")
		.optional(),
	faviconUrl: z
		.string()
		.max(500, "Favicon URL cannot exceed 500 characters")
		.optional(),
	dashboardLogoUrl: z
		.string()
		.max(500, "Dashboard logo URL cannot exceed 500 characters")
		.optional(),
});

/**
 * Footer link schema
 */
export const footerLinkSchema = z.object({
	label: z
		.string()
		.min(1, "Link label is required")
		.max(50, "Link label cannot exceed 50 characters"),
	href: z
		.string()
		.min(1, "Link URL is required")
		.max(200, "Link URL cannot exceed 200 characters"),
	isExternal: z.boolean().default(false),
});

/**
 * Footer settings schema
 */
export const footerSettingsSchema = z.object({
	quickLinksTitle: z
		.string()
		.max(50, "Quick links title cannot exceed 50 characters")
		.optional(),
	contactTitle: z
		.string()
		.max(50, "Contact title cannot exceed 50 characters")
		.optional(),
	newsletterTitle: z
		.string()
		.max(50, "Newsletter title cannot exceed 50 characters")
		.optional(),
	quickLinks: z.array(footerLinkSchema).optional(),
	newsletterDescription: z
		.string()
		.max(300, "Newsletter description cannot exceed 300 characters")
		.optional(),
	newsletterPlaceholder: z
		.string()
		.max(50, "Newsletter placeholder cannot exceed 50 characters")
		.optional(),
	newsletterButtonText: z
		.string()
		.max(30, "Newsletter button text cannot exceed 30 characters")
		.optional(),
	bottomLinks: z.array(footerLinkSchema).optional(),
});

/**
 * Coming Soon settings schema
 */
export const comingSoonSettingsSchema = z.object({
	enabled: z.boolean().optional(),
	heading: z.string().max(100).optional(),
	description: z.string().max(500).optional(),
	newsletterTitle: z.string().max(100).optional(),
	newsletterDescription: z.string().max(500).optional(),
	emailPlaceholder: z.string().max(100).optional(),
	buttonText: z.string().max(50).optional(),
	designedBy: z.string().max(100).optional(),
});

/**
 * Update site settings schema
 */
export const updateSiteSettingsSchema = z.object({
	// Company info
	companyName: z
		.string()
		.min(1, "Company name is required")
		.max(200, "Company name cannot exceed 200 characters")
		.optional(),
	orgNumber: z
		.string()
		.min(1, "Organization number is required")
		.max(50, "Organization number cannot exceed 50 characters")
		.optional(),
	vatNumber: z.string().max(50, "VAT number cannot exceed 50 characters").optional(),

	// Contact info
	phone: z
		.string()
		.min(1, "Phone number is required")
		.max(50, "Phone number cannot exceed 50 characters")
		.optional(),
	email: z
		.string()
		.email("Invalid email address")
		.optional()
		.or(z.literal("")),
	noreplyEmail: z
		.string()
		.email("Invalid email address")
		.optional()
		.or(z.literal("")),

	// Offices
	offices: z.array(officeSchema).optional(),

	// Social media
	socialMedia: socialMediaSchema.partial().optional(),

	// SEO
	seo: seoSettingsSchema.partial().optional(),

	// Branding
	branding: brandingSettingsSchema.partial().optional(),

	// Footer
	footer: footerSettingsSchema.partial().optional(),

	// Coming Soon
	comingSoon: comingSoonSettingsSchema.partial().optional(),

	// SMTP / Email notifications
	smtp: z
		.object({
			enabled: z.boolean().optional(),
			host: z.string().max(200).optional(),
			port: z.number().int().min(1).max(65535).optional(),
			username: z.string().max(200).optional(),
			password: z.string().max(500).optional(),
			encryption: z.enum(["none", "ssl", "tls"]).optional(),
			fromName: z.string().max(100).optional(),
			fromEmail: z.string().email().optional().or(z.literal("")),
			adminNotificationEmail: z.string().email().optional().or(z.literal("")),
		})
		.partial()
		.optional(),
});

// Type exports
export type OfficeInput = z.infer<typeof officeSchema>;
export type SocialMediaInput = z.infer<typeof socialMediaSchema>;
export type SeoSettingsInput = z.infer<typeof seoSettingsSchema>;
export type BrandingSettingsInput = z.infer<typeof brandingSettingsSchema>;
export type FooterLinkInput = z.infer<typeof footerLinkSchema>;
export type FooterSettingsInput = z.infer<typeof footerSettingsSchema>;
export type ComingSoonSettingsInput = z.infer<typeof comingSoonSettingsSchema>;
export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;
