import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const privacySectionVisibilitySchema = z.object({
	hero: z.boolean(),
	introduction: z.boolean(),
	dataCollection: z.boolean(),
	purposeOfProcessing: z.boolean(),
	legalBasis: z.boolean(),
	dataRetention: z.boolean(),
	dataSharing: z.boolean(),
	yourRights: z.boolean(),
	security: z.boolean(),
	cookies: z.boolean(),
	contact: z.boolean(),
	policyChanges: z.boolean(),
	cta: z.boolean(),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const privacyHeroSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	lastUpdated: z.string().max(100).optional(),
});

// ============================================================================
// CONTENT ITEM
// ============================================================================
export const privacyContentItemSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(2000).optional(),
});

// ============================================================================
// CONTENT SECTION
// ============================================================================
export const privacyContentSectionSchema = z.object({
	sectionNumber: z.string().max(20).optional(),
	title: z.string().max(200).optional(),
	intro: z.string().max(2000).optional(),
	items: z.array(privacyContentItemSchema).optional(),
	outro: z.string().max(2000).optional(),
	highlighted: z.boolean().optional(),
});

// ============================================================================
// CONTACT SECTION
// ============================================================================
export const privacyContactSectionSchema = z.object({
	sectionNumber: z.string().max(20).optional(),
	title: z.string().max(200).optional(),
	intro: z.string().max(1000).optional(),
	companyName: z.string().max(200).optional(),
	organizationNumber: z.string().max(50).optional(),
	email: z.string().email().max(200).optional().or(z.literal("")),
	phone: z.string().max(50).optional(),
	addresses: z.array(z.string().max(500)).optional(),
	highlighted: z.boolean().optional(),
});

// ============================================================================
// CTA BUTTON
// ============================================================================
export const privacyCtaButtonSchema = z.object({
	text: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
});

// ============================================================================
// CTA SECTION
// ============================================================================
export const privacyCtaSectionSchema = z.object({
	text: z.string().max(500).optional(),
	primaryCta: privacyCtaButtonSchema.optional(),
	secondaryCta: privacyCtaButtonSchema.optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const privacyPageSeoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(300).optional(),
	ogImage: z.string().max(500).optional(),
});

// ============================================================================
// UPDATE PRIVACY PAGE SCHEMA
// ============================================================================
export const updatePrivacyPageSchema = z.object({
	sectionVisibility: privacySectionVisibilitySchema.optional(),
	hero: privacyHeroSectionSchema.optional(),
	introduction: privacyContentSectionSchema.optional(),
	dataCollection: privacyContentSectionSchema.optional(),
	purposeOfProcessing: privacyContentSectionSchema.optional(),
	legalBasis: privacyContentSectionSchema.optional(),
	dataRetention: privacyContentSectionSchema.optional(),
	dataSharing: privacyContentSectionSchema.optional(),
	yourRights: privacyContentSectionSchema.optional(),
	security: privacyContentSectionSchema.optional(),
	cookies: privacyContentSectionSchema.optional(),
	contact: privacyContactSectionSchema.optional(),
	policyChanges: privacyContentSectionSchema.optional(),
	ctaSection: privacyCtaSectionSchema.optional(),
	seo: privacyPageSeoSchema.optional(),
});

// Type exports
export type PrivacySectionVisibilityInput = z.infer<
	typeof privacySectionVisibilitySchema
>;
export type PrivacyHeroSectionInput = z.infer<typeof privacyHeroSectionSchema>;
export type PrivacyContentItemInput = z.infer<typeof privacyContentItemSchema>;
export type PrivacyContentSectionInput = z.infer<
	typeof privacyContentSectionSchema
>;
export type PrivacyContactSectionInput = z.infer<
	typeof privacyContactSectionSchema
>;
export type PrivacyCtaButtonInput = z.infer<typeof privacyCtaButtonSchema>;
export type PrivacyCtaSectionInput = z.infer<typeof privacyCtaSectionSchema>;
export type PrivacyPageSeoInput = z.infer<typeof privacyPageSeoSchema>;
export type UpdatePrivacyPageInput = z.infer<typeof updatePrivacyPageSchema>;
