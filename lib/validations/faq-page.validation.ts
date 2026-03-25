import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const faqSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	faqContent: z.boolean(),
	sidebar: z.boolean(),
	newsletter: z.boolean(),
	richContent: z.boolean().default(false),
});

// ============================================================================
// HERO STAT
// ============================================================================
export const faqHeroStatSchema = z.object({
	value: z.string().max(50).optional(),
	labelDe: z.string().max(100).optional(),
	labelEn: z.string().max(100).optional(),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const faqHeroSectionSchema = z.object({
	badgeDe: z.string().max(100).optional(),
	badgeEn: z.string().max(100).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	titleHighlightDe: z.string().max(200).optional(),
	titleHighlightEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(1000).optional(),
	subtitleEn: z.string().max(1000).optional(),
	stats: z.array(faqHeroStatSchema).optional(),
});

// ============================================================================
// FAQ ITEM
// ============================================================================
export const faqItemSchema = z.object({
	questionDe: z.string().max(500).optional(),
	questionEn: z.string().max(500).optional(),
	answerDe: z.string().max(5000).optional(),
	answerEn: z.string().max(5000).optional(),
	category: z.string().max(100).optional(),
	order: z.number().optional(),
});

// ============================================================================
// FAQ CATEGORY
// ============================================================================
export const faqCategorySchema = z.object({
	id: z.string().max(50).optional(),
	nameDe: z.string().max(100).optional(),
	nameEn: z.string().max(100).optional(),
	icon: z.string().max(50).optional(),
	order: z.number().optional(),
});

// ============================================================================
// FAQ CONTENT SECTION
// ============================================================================
export const faqContentSectionSchema = z.object({
	searchPlaceholderDe: z.string().max(200).optional(),
	searchPlaceholderEn: z.string().max(200).optional(),
	noResultsTextDe: z.string().max(500).optional(),
	noResultsTextEn: z.string().max(500).optional(),
	helpTextDe: z.string().max(500).optional(),
	helpTextEn: z.string().max(500).optional(),
	helpButtonTextDe: z.string().max(100).optional(),
	helpButtonTextEn: z.string().max(100).optional(),
	helpButtonHref: z.string().max(500).optional(),
	categories: z.array(faqCategorySchema).optional(),
	items: z.array(faqItemSchema).optional(),
});

// ============================================================================
// QUICK LINK
// ============================================================================
export const faqQuickLinkSchema = z.object({
	labelDe: z.string().max(100).optional(),
	labelEn: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
});

// ============================================================================
// OFFICE
// ============================================================================
export const faqOfficeSchema = z.object({
	name: z.string().max(100).optional(),
	address: z.string().max(500).optional(),
});

// ============================================================================
// SIDEBAR SECTION
// ============================================================================
export const faqSidebarSectionSchema = z.object({
	contactTitleDe: z.string().max(200).optional(),
	contactTitleEn: z.string().max(200).optional(),
	contactDescriptionDe: z.string().max(1000).optional(),
	contactDescriptionEn: z.string().max(1000).optional(),
	phone: z.string().max(50).optional(),
	email: z.string().email().max(200).optional().or(z.literal("")),
	officeHours: z.string().max(100).optional(),
	contactButtonTextDe: z.string().max(100).optional(),
	contactButtonTextEn: z.string().max(100).optional(),
	contactButtonHref: z.string().max(500).optional(),
	quickLinksTitleDe: z.string().max(200).optional(),
	quickLinksTitleEn: z.string().max(200).optional(),
	quickLinks: z.array(faqQuickLinkSchema).optional(),
	officesTitleDe: z.string().max(200).optional(),
	officesTitleEn: z.string().max(200).optional(),
	offices: z.array(faqOfficeSchema).optional(),
});

// ============================================================================
// NEWSLETTER SECTION
// ============================================================================
export const faqNewsletterSectionSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	inputPlaceholderDe: z.string().max(200).optional(),
	inputPlaceholderEn: z.string().max(200).optional(),
	buttonTextDe: z.string().max(100).optional(),
	buttonTextEn: z.string().max(100).optional(),
	loadingTextDe: z.string().max(100).optional(),
	loadingTextEn: z.string().max(100).optional(),
	successTextDe: z.string().max(200).optional(),
	successTextEn: z.string().max(200).optional(),
	privacyNoteDe: z.string().max(500).optional(),
	privacyNoteEn: z.string().max(500).optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const faqPageSeoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(300).optional(),
	keywords: z.array(z.string().max(50)).optional(),
	ogImage: z.string().max(500).optional(),
});

// ============================================================================
// UPDATE FAQ PAGE SCHEMA
// ============================================================================
export const updateFAQPageSchema = z.object({
	sectionVisibility: faqSectionVisibilitySchema.optional(),
	hero: faqHeroSectionSchema.optional(),
	faqContent: faqContentSectionSchema.optional(),
	sidebar: faqSidebarSectionSchema.optional(),
	newsletter: faqNewsletterSectionSchema.optional(),
	seo: faqPageSeoSchema.optional(),
});

// Type exports
export type FAQSectionVisibilityInput = z.infer<
	typeof faqSectionVisibilitySchema
>;
export type FAQHeroStatInput = z.infer<typeof faqHeroStatSchema>;
export type FAQHeroSectionInput = z.infer<typeof faqHeroSectionSchema>;
export type FAQItemInput = z.infer<typeof faqItemSchema>;
export type FAQCategoryInput = z.infer<typeof faqCategorySchema>;
export type FAQContentSectionInput = z.infer<typeof faqContentSectionSchema>;
export type FAQQuickLinkInput = z.infer<typeof faqQuickLinkSchema>;
export type FAQOfficeInput = z.infer<typeof faqOfficeSchema>;
export type FAQSidebarSectionInput = z.infer<typeof faqSidebarSectionSchema>;
export type FAQNewsletterSectionInput = z.infer<
	typeof faqNewsletterSectionSchema
>;
export type FAQPageSeoInput = z.infer<typeof faqPageSeoSchema>;
export type UpdateFAQPageInput = z.infer<typeof updateFAQPageSchema>;
