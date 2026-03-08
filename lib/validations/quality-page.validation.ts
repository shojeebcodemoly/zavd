import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const qualitySectionVisibilitySchema = z.object({
	hero: z.boolean().optional(),
	certificates: z.boolean().optional(),
	description: z.boolean().optional(),
});

export type QualitySectionVisibilityInput = z.infer<typeof qualitySectionVisibilitySchema>;

// ============================================================================
// HERO SECTION
// ============================================================================
export const qualityHeroSectionSchema = z.object({
	badge: z.string().optional(),
	title: z.string().optional(),
	titleHighlight: z.string().optional(),
	subtitle: z.string().optional(),
	backgroundImage: z.string().optional(),
});

export type QualityHeroSectionInput = z.infer<typeof qualityHeroSectionSchema>;

// ============================================================================
// CERTIFICATE ITEM
// ============================================================================
export const qualityCertificateSchema = z.object({
	_id: z.string().optional(),
	title: z.string().optional(),
	image: z.string().optional(),
	description: z.string().optional(),
	order: z.number().optional(),
});

export type QualityCertificateInput = z.infer<typeof qualityCertificateSchema>;

// ============================================================================
// DESCRIPTION SECTION
// ============================================================================
export const qualityDescriptionSectionSchema = z.object({
	title: z.string().optional(),
	content: z.string().optional(),
});

export type QualityDescriptionSectionInput = z.infer<typeof qualityDescriptionSectionSchema>;

// ============================================================================
// SEO SECTION
// ============================================================================
export const qualitySeoSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	keywords: z.array(z.string()).optional(),
	ogImage: z.string().optional(),
});

export type QualitySeoInput = z.infer<typeof qualitySeoSchema>;

// ============================================================================
// UPDATE QUALITY PAGE SCHEMA
// ============================================================================
export const updateQualityPageSchema = z.object({
	sectionVisibility: qualitySectionVisibilitySchema.optional(),
	hero: qualityHeroSectionSchema.optional(),
	certificates: z.array(qualityCertificateSchema).optional(),
	description: qualityDescriptionSectionSchema.optional(),
	seo: qualitySeoSchema.optional(),
});

export type UpdateQualityPageInput = z.infer<typeof updateQualityPageSchema>;
