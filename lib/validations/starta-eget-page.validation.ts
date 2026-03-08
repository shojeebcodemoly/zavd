import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const startaEgetSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	mainContent: z.boolean(),
	benefits: z.boolean(),
	features: z.boolean(),
	contactForm: z.boolean(),
	resources: z.boolean(),
	richContent: z.boolean().default(false),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const startaEgetHeroSectionSchema = z.object({
	title: z.string().max(200).optional(),
	titleHighlight: z.string().max(200).optional(),
	subtitle: z.string().max(1000).optional(),
	callout: z.string().max(300).optional(),
});

// ============================================================================
// MAIN CONTENT SECTION
// ============================================================================
export const startaEgetMainContentSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(300).optional(),
	paragraphs: z.array(z.string().max(2000)).optional(),
});

// ============================================================================
// BENEFIT CARD
// ============================================================================
export const startaEgetBenefitCardSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
	icon: z.string().max(50).optional(),
});

// ============================================================================
// FEATURE ITEM
// ============================================================================
export const startaEgetFeatureItemSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
});

// ============================================================================
// FEATURES SECTION
// ============================================================================
export const startaEgetFeaturesSectionSchema = z.object({
	title: z.string().max(200).optional(),
	intro: z.string().max(500).optional(),
	features: z.array(startaEgetFeatureItemSchema).optional(),
});

// ============================================================================
// RESOURCE CARD
// ============================================================================
export const startaEgetResourceCardSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
	href: z.string().max(500).optional(),
	buttonText: z.string().max(100).optional(),
});

// ============================================================================
// RESOURCES SECTION
// ============================================================================
export const startaEgetResourcesSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(300).optional(),
	resources: z.array(startaEgetResourceCardSchema).optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const startaEgetPageSeoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(300).optional(),
	ogImage: z.string().max(500).optional(),
});

// ============================================================================
// UPDATE STARTA EGET PAGE SCHEMA
// ============================================================================
export const updateStartaEgetPageSchema = z.object({
	sectionVisibility: startaEgetSectionVisibilitySchema.optional(),
	hero: startaEgetHeroSectionSchema.optional(),
	mainContent: startaEgetMainContentSectionSchema.optional(),
	benefits: z.array(startaEgetBenefitCardSchema).optional(),
	featuresSection: startaEgetFeaturesSectionSchema.optional(),
	resourcesSection: startaEgetResourcesSectionSchema.optional(),
	seo: startaEgetPageSeoSchema.optional(),
});

// Type exports
export type StartaEgetSectionVisibilityInput = z.infer<
	typeof startaEgetSectionVisibilitySchema
>;
export type StartaEgetHeroSectionInput = z.infer<
	typeof startaEgetHeroSectionSchema
>;
export type StartaEgetMainContentSectionInput = z.infer<
	typeof startaEgetMainContentSectionSchema
>;
export type StartaEgetBenefitCardInput = z.infer<
	typeof startaEgetBenefitCardSchema
>;
export type StartaEgetFeatureItemInput = z.infer<
	typeof startaEgetFeatureItemSchema
>;
export type StartaEgetFeaturesSectionInput = z.infer<
	typeof startaEgetFeaturesSectionSchema
>;
export type StartaEgetResourceCardInput = z.infer<
	typeof startaEgetResourceCardSchema
>;
export type StartaEgetResourcesSectionInput = z.infer<
	typeof startaEgetResourcesSectionSchema
>;
export type StartaEgetPageSeoInput = z.infer<typeof startaEgetPageSeoSchema>;
export type UpdateStartaEgetPageInput = z.infer<
	typeof updateStartaEgetPageSchema
>;
