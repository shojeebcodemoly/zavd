import { z } from "zod";

/**
 * Hero Section schema
 */
export const kontaktHeroSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().min(1, "Title is required").max(200),
	subtitle: z.string().min(1, "Subtitle is required").max(500),
	responseTime: z.string().max(100).optional(),
	officeLocationsText: z.string().max(100).optional(),
});

/**
 * Contact Card schema
 */
export const contactCardSchema = z.object({
	icon: z.string().min(1, "Icon is required").max(50),
	title: z.string().min(1, "Title is required").max(100),
	subtitle: z.string().max(200).optional(),
});

/**
 * Form Section schema
 */
export const kontaktFormSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().min(1, "Title is required").max(200),
	subtitle: z.string().min(1, "Subtitle is required").max(500),
});

/**
 * Office Section schema
 */
export const kontaktOfficeSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().min(1, "Title is required").max(200),
	subtitle: z.string().min(1, "Subtitle is required").max(500),
	openingHours: z.string().max(100).optional(),
	closedText: z.string().max(100).optional(),
});

/**
 * FAQ Item schema
 */
export const kontaktFaqItemSchema = z.object({
	question: z.string().min(1, "Question is required").max(300),
	answer: z.string().min(1, "Answer is required").max(1000),
});

/**
 * FAQ Section schema
 */
export const kontaktFaqSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().min(1, "Title is required").max(200),
	subtitle: z.string().min(1, "Subtitle is required").max(500),
	faqs: z.array(kontaktFaqItemSchema).default([]),
});

/**
 * SEO Settings schema
 */
export const kontaktPageSeoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(500).optional(),
	ogImage: z.string().optional(),
});

/**
 * Update Kontakt Page schema
 */
export const updateKontaktPageSchema = z.object({
	hero: kontaktHeroSchema.partial().optional(),
	phoneCard: contactCardSchema.partial().optional(),
	emailCard: contactCardSchema.partial().optional(),
	socialCard: contactCardSchema.partial().optional(),
	formSection: kontaktFormSectionSchema.partial().optional(),
	officeSection: kontaktOfficeSectionSchema.partial().optional(),
	faqSection: kontaktFaqSectionSchema.partial().optional(),
	seo: kontaktPageSeoSchema.partial().optional(),
});

// Type exports
export type KontaktHeroInput = z.infer<typeof kontaktHeroSchema>;
export type ContactCardInput = z.infer<typeof contactCardSchema>;
export type KontaktFormSectionInput = z.infer<typeof kontaktFormSectionSchema>;
export type KontaktOfficeSectionInput = z.infer<typeof kontaktOfficeSectionSchema>;
export type KontaktFaqItemInput = z.infer<typeof kontaktFaqItemSchema>;
export type KontaktFaqSectionInput = z.infer<typeof kontaktFaqSectionSchema>;
export type KontaktPageSeoInput = z.infer<typeof kontaktPageSeoSchema>;
export type UpdateKontaktPageInput = z.infer<typeof updateKontaktPageSchema>;
