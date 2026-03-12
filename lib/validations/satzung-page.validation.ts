import { z } from "zod";

// ============================================================================
// HERO SECTION
// ============================================================================
export const satzungHeroSchema = z.object({
	taglineDe: z.string().max(200).optional(),
	taglineEn: z.string().max(200).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

// ============================================================================
// SEARCH SECTION
// ============================================================================
export const satzungSearchSectionSchema = z.object({
	tagDe: z.string().max(100).optional(),
	tagEn: z.string().max(100).optional(),
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	descriptionDe: z.string().max(1000).optional(),
	descriptionEn: z.string().max(1000).optional(),
	placeholderDe: z.string().max(200).optional(),
	placeholderEn: z.string().max(200).optional(),
});

// ============================================================================
// FAQ ITEM
// ============================================================================
export const satzungFaqItemSchema = z.object({
	titleDe: z.string().max(300).optional(),
	titleEn: z.string().max(300).optional(),
	contentDe: z.array(z.string()).optional(),
	contentEn: z.array(z.string()).optional(),
});

// ============================================================================
// FAQ SECTION
// ============================================================================
export const satzungFaqSectionSchema = z.object({
	tagDe: z.string().max(100).optional(),
	tagEn: z.string().max(100).optional(),
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	descriptionDe: z.string().max(1000).optional(),
	descriptionEn: z.string().max(1000).optional(),
	items: z.array(satzungFaqItemSchema).optional(),
});

// ============================================================================
// TESTIMONIAL ITEM
// ============================================================================
export const satzungTestimonialSchema = z.object({
	nameDe: z.string().max(200).optional(),
	nameEn: z.string().max(200).optional(),
	roleDe: z.string().max(200).optional(),
	roleEn: z.string().max(200).optional(),
	quoteDe: z.string().max(1000).optional(),
	quoteEn: z.string().max(1000).optional(),
	image: z.string().optional(),
});

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================
export const satzungTestimonialsSectionSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	items: z.array(satzungTestimonialSchema).optional(),
});

// ============================================================================
// UPDATE SCHEMA
// ============================================================================
export const updateSatzungPageSchema = z.object({
	hero: satzungHeroSchema.optional(),
	searchSection: satzungSearchSectionSchema.optional(),
	faqSection: satzungFaqSectionSchema.optional(),
	testimonials: satzungTestimonialsSectionSchema.optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type SatzungHeroInput = z.infer<typeof satzungHeroSchema>;
export type SatzungSearchSectionInput = z.infer<typeof satzungSearchSectionSchema>;
export type SatzungFaqItemInput = z.infer<typeof satzungFaqItemSchema>;
export type SatzungFaqSectionInput = z.infer<typeof satzungFaqSectionSchema>;
export type SatzungTestimonialInput = z.infer<typeof satzungTestimonialSchema>;
export type SatzungTestimonialsSectionInput = z.infer<typeof satzungTestimonialsSectionSchema>;
export type UpdateSatzungPageInput = z.infer<typeof updateSatzungPageSchema>;
