import { z } from "zod";

/**
 * Hero Section schema
 */
export const kontaktHeroSchema = z.object({
	backgroundImage: z.string().optional(),
	breadcrumb: z.string().max(200).optional(),
	titleDe: z.string().min(1, "Title (DE) is required").max(200),
	titleEn: z.string().min(1, "Title (EN) is required").max(200),
	subtitleDe: z.string().min(1, "Subtitle (DE) is required").max(500),
	subtitleEn: z.string().min(1, "Subtitle (EN) is required").max(500),
	responseTime: z.string().max(100).optional(),
	officeLocationsText: z.string().max(100).optional(),
});

/**
 * Contact Card schema
 */
export const contactCardSchema = z.object({
	icon: z.string().min(1, "Icon is required").max(50),
	titleDe: z.string().min(1, "Title (DE) is required").max(100),
	titleEn: z.string().min(1, "Title (EN) is required").max(100),
	subtitleDe: z.string().max(200).optional(),
	subtitleEn: z.string().max(200).optional(),
});

/**
 * Contact Info schema (left column)
 */
export const kontaktContactInfoSchema = z.object({
	badgeDe: z.string().max(100).optional(),
	badgeEn: z.string().max(100).optional(),
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	addressLabelDe: z.string().max(100).optional(),
	addressLabelEn: z.string().max(100).optional(),
	address: z.string().max(500).optional(),
	emailLabelDe: z.string().max(100).optional(),
	emailLabelEn: z.string().max(100).optional(),
	email: z.string().max(200).optional(),
	phoneLabelDe: z.string().max(100).optional(),
	phoneLabelEn: z.string().max(100).optional(),
	phone: z.string().max(50).optional(),
});

/**
 * Form Section schema
 */
export const kontaktFormSectionSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	titleDe: z.string().min(1, "Title (DE) is required").max(200),
	titleEn: z.string().min(1, "Title (EN) is required").max(200),
	subtitleDe: z.string().min(1, "Subtitle (DE) is required").max(500),
	subtitleEn: z.string().min(1, "Subtitle (EN) is required").max(500),
});

/**
 * Map Section schema
 */
export const kontaktMapSectionSchema = z.object({
	embedUrl: z.string().optional(),
});

/**
 * Connect Section schema
 */
export const kontaktConnectSectionSchema = z.object({
	badgeDe: z.string().max(100).optional(),
	badgeEn: z.string().max(100).optional(),
	backgroundImage: z.string().optional(),
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(500).optional(),
	descriptionEn: z.string().max(500).optional(),
});

/**
 * Office Section schema
 */
export const kontaktOfficeSectionSchema = z.object({
	badgeDe: z.string().max(100).optional(),
	badgeEn: z.string().max(100).optional(),
	titleDe: z.string().min(1, "Title (DE) is required").max(200),
	titleEn: z.string().min(1, "Title (EN) is required").max(200),
	subtitleDe: z.string().min(1, "Subtitle (DE) is required").max(500),
	subtitleEn: z.string().min(1, "Subtitle (EN) is required").max(500),
	openingHoursDe: z.string().max(100).optional(),
	openingHoursEn: z.string().max(100).optional(),
	closedTextDe: z.string().max(100).optional(),
	closedTextEn: z.string().max(100).optional(),
});

/**
 * FAQ Item schema
 */
export const kontaktFaqItemSchema = z.object({
	questionDe: z.string().min(1, "Question (DE) is required").max(300),
	questionEn: z.string().min(1, "Question (EN) is required").max(300),
	answerDe: z.string().min(1, "Answer (DE) is required").max(1000),
	answerEn: z.string().min(1, "Answer (EN) is required").max(1000),
});

/**
 * FAQ Section schema
 */
export const kontaktFaqSectionSchema = z.object({
	badgeDe: z.string().max(100).optional(),
	badgeEn: z.string().max(100).optional(),
	titleDe: z.string().min(1, "Title (DE) is required").max(200),
	titleEn: z.string().min(1, "Title (EN) is required").max(200),
	subtitleDe: z.string().min(1, "Subtitle (DE) is required").max(500),
	subtitleEn: z.string().min(1, "Subtitle (EN) is required").max(500),
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
	contactInfo: kontaktContactInfoSchema.partial().optional(),
	phoneCard: contactCardSchema.partial().optional(),
	emailCard: contactCardSchema.partial().optional(),
	socialCard: contactCardSchema.partial().optional(),
	formSection: kontaktFormSectionSchema.partial().optional(),
	mapSection: kontaktMapSectionSchema.partial().optional(),
	connectSection: kontaktConnectSectionSchema.partial().optional(),
	officeSection: kontaktOfficeSectionSchema.partial().optional(),
	faqSection: kontaktFaqSectionSchema.partial().optional(),
	seo: kontaktPageSeoSchema.partial().optional(),
});

// Type exports
export type KontaktHeroInput = z.infer<typeof kontaktHeroSchema>;
export type ContactCardInput = z.infer<typeof contactCardSchema>;
export type KontaktContactInfoInput = z.infer<typeof kontaktContactInfoSchema>;
export type KontaktFormSectionInput = z.infer<typeof kontaktFormSectionSchema>;
export type KontaktMapSectionInput = z.infer<typeof kontaktMapSectionSchema>;
export type KontaktConnectSectionInput = z.infer<typeof kontaktConnectSectionSchema>;
export type KontaktOfficeSectionInput = z.infer<typeof kontaktOfficeSectionSchema>;
export type KontaktFaqItemInput = z.infer<typeof kontaktFaqItemSchema>;
export type KontaktFaqSectionInput = z.infer<typeof kontaktFaqSectionSchema>;
export type KontaktPageSeoInput = z.infer<typeof kontaktPageSeoSchema>;
export type UpdateKontaktPageInput = z.infer<typeof updateKontaktPageSchema>;
