import { z } from "zod";

/**
 * Section visibility schema
 */
export const resellerSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	benefits: z.boolean(),
	form: z.boolean(),
});

/**
 * Hero section schema
 */
export const resellerHeroSchema = z.object({
	badge: z.string().optional(),
	title: z.string().optional(),
	titleHighlight: z.string().optional(),
	subtitle: z.string().optional(),
	backgroundImage: z.string().optional(),
});

/**
 * Benefit item schema
 */
export const resellerBenefitSchema = z.object({
	icon: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
});

/**
 * Benefits section schema
 */
export const resellerBenefitsSectionSchema = z.object({
	title: z.string().optional(),
	subtitle: z.string().optional(),
	benefits: z.array(resellerBenefitSchema).optional(),
});

/**
 * Form section schema
 */
export const resellerFormSectionSchema = z.object({
	title: z.string().optional(),
	subtitle: z.string().optional(),
	successMessage: z.string().optional(),
	successDescription: z.string().optional(),
});

/**
 * SEO schema
 */
export const resellerPageSeoSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	ogImage: z.string().optional(),
});

/**
 * Full update schema
 */
export const updateResellerPageSchema = z.object({
	sectionVisibility: resellerSectionVisibilitySchema.optional(),
	hero: resellerHeroSchema.optional(),
	benefits: resellerBenefitsSectionSchema.optional(),
	formSection: resellerFormSectionSchema.optional(),
	seo: resellerPageSeoSchema.optional(),
});

export type UpdateResellerPageInput = z.infer<typeof updateResellerPageSchema>;
