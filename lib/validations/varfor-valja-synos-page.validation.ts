import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const varforValjaSynosSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	reasons: z.boolean(),
	benefits: z.boolean(),
	cta: z.boolean(),
	contactForm: z.boolean(),
	richContent: z.boolean().default(false),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const varforValjaSynosHeroSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	titleHighlight: z.string().max(200).optional(),
	subtitle: z.string().max(1000).optional(),
});

// ============================================================================
// REASON CARD
// ============================================================================
export const varforValjaSynosReasonCardSchema = z.object({
	icon: z.string().max(50).optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
});

// ============================================================================
// BENEFITS SECTION
// ============================================================================
export const varforValjaSynosBenefitsSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	items: z.array(z.string().max(200)).optional(),
});

// ============================================================================
// CTA SECTION
// ============================================================================
export const varforValjaSynosCtaSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	primaryButtonText: z.string().max(100).optional(),
	primaryButtonHref: z.string().max(500).optional(),
	secondaryButtonText: z.string().max(100).optional(),
	secondaryButtonHref: z.string().max(500).optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const varforValjaSynosPageSeoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(300).optional(),
	ogImage: z.string().max(500).optional(),
});

// ============================================================================
// UPDATE VARFOR VALJA SYNOS PAGE SCHEMA
// ============================================================================
export const updateVarforValjaSynosPageSchema = z.object({
	sectionVisibility: varforValjaSynosSectionVisibilitySchema.optional(),
	hero: varforValjaSynosHeroSectionSchema.optional(),
	reasons: z.array(varforValjaSynosReasonCardSchema).optional(),
	benefitsSection: varforValjaSynosBenefitsSectionSchema.optional(),
	ctaSection: varforValjaSynosCtaSectionSchema.optional(),
	richContent: z.string().optional(),
	seo: varforValjaSynosPageSeoSchema.optional(),
});

// Type exports
export type VarforValjaSynosSectionVisibilityInput = z.infer<
	typeof varforValjaSynosSectionVisibilitySchema
>;
export type VarforValjaSynosHeroSectionInput = z.infer<
	typeof varforValjaSynosHeroSectionSchema
>;
export type VarforValjaSynosReasonCardInput = z.infer<
	typeof varforValjaSynosReasonCardSchema
>;
export type VarforValjaSynosBenefitsSectionInput = z.infer<
	typeof varforValjaSynosBenefitsSectionSchema
>;
export type VarforValjaSynosCtaSectionInput = z.infer<
	typeof varforValjaSynosCtaSectionSchema
>;
export type VarforValjaSynosPageSeoInput = z.infer<
	typeof varforValjaSynosPageSeoSchema
>;
export type UpdateVarforValjaSynosPageInput = z.infer<
	typeof updateVarforValjaSynosPageSchema
>;
