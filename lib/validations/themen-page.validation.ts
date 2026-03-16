import { z } from "zod";

// ============================================================================
// HERO SECTION
// ============================================================================
export const themenHeroSchema = z.object({
	taglineDe: z.string().max(200).optional(),
	taglineEn: z.string().max(200).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

// ============================================================================
// READ MORE LINK ITEM
// ============================================================================
export const themenReadMoreLinkSchema = z.object({
	labelDe: z.string().max(200).optional(),
	labelEn: z.string().max(200).optional(),
	href: z.string().optional(),
});

// ============================================================================
// INTEGRATION SECTION
// ============================================================================
export const themenIntegrationSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
	image: z.string().optional(),
	badgeTitleDe: z.string().max(100).optional(),
	badgeTitleEn: z.string().max(100).optional(),
	badgeSubtitleDe: z.string().max(200).optional(),
	badgeSubtitleEn: z.string().max(200).optional(),
	ctaLabelDe: z.string().max(100).optional(),
	ctaLabelEn: z.string().max(100).optional(),
	ctaHref: z.string().optional(),
	readMoreLinks: z.array(themenReadMoreLinkSchema).optional(),
});

// ============================================================================
// CORE DEMAND ITEM
// ============================================================================
export const themenCoreDemandSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
});

// ============================================================================
// IRAK & SYRIEN SECTION
// ============================================================================
export const themenIrakSyrienSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	paragraphDe: z.string().optional(),
	paragraphEn: z.string().optional(),
	image: z.string().optional(),
	coreDemands: z.array(themenCoreDemandSchema).optional(),
	dokumentationTitleDe: z.string().max(300).optional(),
	dokumentationTitleEn: z.string().max(300).optional(),
	dokumentationDescDe: z.string().optional(),
	dokumentationDescEn: z.string().optional(),
	dokumentationLinkLabelDe: z.string().max(300).optional(),
	dokumentationLinkLabelEn: z.string().max(300).optional(),
	dokumentationLinkHref: z.string().optional(),
});

// ============================================================================
// UPDATE SCHEMA
// ============================================================================
export const updateThemenPageSchema = z.object({
	hero: themenHeroSchema.optional(),
	integration: themenIntegrationSchema.optional(),
	irakSyrien: themenIrakSyrienSchema.optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type ThemenHeroInput = z.infer<typeof themenHeroSchema>;
export type ThemenReadMoreLinkInput = z.infer<typeof themenReadMoreLinkSchema>;
export type ThemenIntegrationInput = z.infer<typeof themenIntegrationSchema>;
export type ThemenCoreDemandInput = z.infer<typeof themenCoreDemandSchema>;
export type ThemenIrakSyrienInput = z.infer<typeof themenIrakSyrienSchema>;
export type UpdateThemenPageInput = z.infer<typeof updateThemenPageSchema>;
