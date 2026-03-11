import { z } from "zod";

// ============================================================================
// HERO SECTION
// ============================================================================
export const uberZavdHeroSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

// ============================================================================
// INTRO SECTION
// ============================================================================
export const uberZavdIntroSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
});

// ============================================================================
// ADDRESS SECTION
// ============================================================================
export const uberZavdAddressSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	name: z.string().max(200).optional(),
	line1: z.string().max(200).optional(),
	line2: z.string().max(200).optional(),
	line3: z.string().max(200).optional(),
	phone: z.string().max(100).optional(),
	email: z.string().max(200).optional(),
});

// ============================================================================
// STRUCTURE SECTION
// ============================================================================
export const uberZavdStructureSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
	paragraph3De: z.string().optional(),
	paragraph3En: z.string().optional(),
});

// ============================================================================
// TEAM SECTION
// ============================================================================
export const uberZavdTeamSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	subtextDe: z.string().optional(),
	subtextEn: z.string().optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
	image: z.string().optional(),
});

// ============================================================================
// OFFICE TIMELINE ITEM
// ============================================================================
export const uberZavdTimelineItemSchema = z.object({
	year: z.string().max(20).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	image: z.string().optional(),
});

// ============================================================================
// OFFICE SECTION
// ============================================================================
export const uberZavdOfficeSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	items: z.array(uberZavdTimelineItemSchema).optional(),
});

// ============================================================================
// GALLERY ITEM
// ============================================================================
export const uberZavdGalleryItemSchema = z.object({
	image: z.string().optional(),
	captionDe: z.string().max(300).optional(),
	captionEn: z.string().max(300).optional(),
});

// ============================================================================
// GALLERY SECTION
// ============================================================================
export const uberZavdGallerySchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	items: z.array(uberZavdGalleryItemSchema).optional(),
});

// ============================================================================
// CTA SECTION
// ============================================================================
export const uberZavdCtaSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	textDe: z.string().optional(),
	textEn: z.string().optional(),
	buttonDe: z.string().max(100).optional(),
	buttonEn: z.string().max(100).optional(),
});

// ============================================================================
// UPDATE SCHEMA
// ============================================================================
export const updateUberZavdPageSchema = z.object({
	hero: uberZavdHeroSchema.optional(),
	intro: uberZavdIntroSchema.optional(),
	address: uberZavdAddressSchema.optional(),
	structure: uberZavdStructureSchema.optional(),
	team: uberZavdTeamSchema.optional(),
	office: uberZavdOfficeSchema.optional(),
	gallery: uberZavdGallerySchema.optional(),
	cta: uberZavdCtaSchema.optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type UberZavdHeroInput = z.infer<typeof uberZavdHeroSchema>;
export type UberZavdIntroInput = z.infer<typeof uberZavdIntroSchema>;
export type UberZavdAddressInput = z.infer<typeof uberZavdAddressSchema>;
export type UberZavdStructureInput = z.infer<typeof uberZavdStructureSchema>;
export type UberZavdTeamInput = z.infer<typeof uberZavdTeamSchema>;
export type UberZavdTimelineItemInput = z.infer<typeof uberZavdTimelineItemSchema>;
export type UberZavdOfficeInput = z.infer<typeof uberZavdOfficeSchema>;
export type UberZavdGalleryItemInput = z.infer<typeof uberZavdGalleryItemSchema>;
export type UberZavdGalleryInput = z.infer<typeof uberZavdGallerySchema>;
export type UberZavdCtaInput = z.infer<typeof uberZavdCtaSchema>;
export type UpdateUberZavdPageInput = z.infer<typeof updateUberZavdPageSchema>;
