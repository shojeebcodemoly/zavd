import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const legalSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	legalCards: z.boolean(),
	companyInfo: z.boolean(),
	terms: z.boolean(),
	gdprRights: z.boolean(),
	cta: z.boolean(),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const legalHeroSectionSchema = z.object({
	badgeDe: z.string().max(100).optional(),
	badgeEn: z.string().max(100).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(1000).optional(),
	subtitleEn: z.string().max(1000).optional(),
});

// ============================================================================
// LEGAL CARD
// ============================================================================
export const legalCardSchema = z.object({
	icon: z.string().max(50).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(1000).optional(),
	descriptionEn: z.string().max(1000).optional(),
	href: z.string().max(500).optional(),
	highlightsDe: z.array(z.string().max(200)).optional(),
	highlightsEn: z.array(z.string().max(200)).optional(),
});

// ============================================================================
// OFFICE ADDRESS
// ============================================================================
export const legalOfficeAddressSchema = z.object({
	name: z.string().max(200).optional(),
	address: z.string().max(500).optional(),
});

// ============================================================================
// COMPANY INFO
// ============================================================================
export const legalCompanyInfoSchema = z.object({
	companyName: z.string().max(200).optional(),
	organizationNumber: z.string().max(50).optional(),
	vatNumber: z.string().max(50).optional(),
	registeredSeat: z.string().max(200).optional(),
	offices: z.array(legalOfficeAddressSchema).optional(),
	email: z.string().email().max(200).optional().or(z.literal("")),
	phone: z.string().max(50).optional(),
});

// ============================================================================
// TERM
// ============================================================================
export const legalTermSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	contentDe: z.string().max(5000).optional(),
	contentEn: z.string().max(5000).optional(),
});

// ============================================================================
// TERMS SECTION
// ============================================================================
export const legalTermsSectionSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	terms: z.array(legalTermSchema).optional(),
});

// ============================================================================
// GDPR RIGHT
// ============================================================================
export const legalGdprRightSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(500).optional(),
	descriptionEn: z.string().max(500).optional(),
});

// ============================================================================
// CTA BUTTON
// ============================================================================
export const legalCtaButtonSchema = z.object({
	textDe: z.string().max(100).optional(),
	textEn: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
});

// ============================================================================
// GDPR SECTION
// ============================================================================
export const legalGdprSectionSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	rights: z.array(legalGdprRightSchema).optional(),
	primaryCta: legalCtaButtonSchema.optional(),
	secondaryCta: legalCtaButtonSchema.optional(),
});

// ============================================================================
// CTA SECTION
// ============================================================================
export const legalCtaSectionSchema = z.object({
	textDe: z.string().max(500).optional(),
	textEn: z.string().max(500).optional(),
	primaryCta: legalCtaButtonSchema.optional(),
	secondaryCta: legalCtaButtonSchema.optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const legalPageSeoSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
	ogImage: z.string().optional(),
});

// ============================================================================
// UPDATE LEGAL PAGE SCHEMA
// ============================================================================
export const updateLegalPageSchema = z.object({
	sectionVisibility: legalSectionVisibilitySchema.optional(),
	hero: legalHeroSectionSchema.optional(),
	legalCards: z.array(legalCardSchema).optional(),
	companyInfo: legalCompanyInfoSchema.optional(),
	termsSection: legalTermsSectionSchema.optional(),
	gdprSection: legalGdprSectionSchema.optional(),
	ctaSection: legalCtaSectionSchema.optional(),
	seo: legalPageSeoSchema.optional(),
});

// Type exports
export type LegalSectionVisibilityInput = z.infer<typeof legalSectionVisibilitySchema>;
export type LegalHeroSectionInput = z.infer<typeof legalHeroSectionSchema>;
export type LegalCardInput = z.infer<typeof legalCardSchema>;
export type LegalOfficeAddressInput = z.infer<typeof legalOfficeAddressSchema>;
export type LegalCompanyInfoInput = z.infer<typeof legalCompanyInfoSchema>;
export type LegalTermInput = z.infer<typeof legalTermSchema>;
export type LegalTermsSectionInput = z.infer<typeof legalTermsSectionSchema>;
export type LegalGdprRightInput = z.infer<typeof legalGdprRightSchema>;
export type LegalGdprSectionInput = z.infer<typeof legalGdprSectionSchema>;
export type LegalCtaSectionInput = z.infer<typeof legalCtaSectionSchema>;
export type LegalPageSeoInput = z.infer<typeof legalPageSeoSchema>;
export type UpdateLegalPageInput = z.infer<typeof updateLegalPageSchema>;
