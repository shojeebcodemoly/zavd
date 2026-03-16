import { z } from "zod";

// ============================================================================
// HERO SECTION
// ============================================================================
export const angeboteBeratungHeroSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

// ============================================================================
// PDF RESOURCE ITEM
// ============================================================================
export const angebotePdfItemSchema = z.object({
	titleDe: z.string().max(300).optional(),
	titleEn: z.string().max(300).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	downloadLabelDe: z.string().max(200).optional(),
	downloadLabelEn: z.string().max(200).optional(),
	href: z.string().optional(),
});

// ============================================================================
// FLUCHT & ASYL SECTION
// ============================================================================
export const angeboteFluchtAsylSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
	infoBoxDe: z.string().optional(),
	infoBoxEn: z.string().optional(),
	pdfResources: z.array(angebotePdfItemSchema).optional(),
});

// ============================================================================
// NAMENSÄNDERUNG SECTION
// ============================================================================
export const angeboteNamensaenderungSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
	paragraph3De: z.string().optional(),
	paragraph3En: z.string().optional(),
	blockquoteDe: z.string().optional(),
	blockquoteEn: z.string().optional(),
	pdfLabelDe: z.string().max(200).optional(),
	pdfLabelEn: z.string().max(200).optional(),
	pdfHref: z.string().optional(),
});

// ============================================================================
// SERVICE ITEM
// ============================================================================
export const angeboteServiceItemSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
});

// ============================================================================
// BERATUNG & UNTERSTÜTZUNG SECTION
// ============================================================================
export const angeboteBeratungSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	subtitleDe: z.string().optional(),
	subtitleEn: z.string().optional(),
	ctaLabelDe: z.string().max(100).optional(),
	ctaLabelEn: z.string().max(100).optional(),
	services: z.array(angeboteServiceItemSchema).optional(),
});

// ============================================================================
// LINK ITEM
// ============================================================================
export const angeboteLinkItemSchema = z.object({
	name: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	href: z.string().optional(),
});

// ============================================================================
// WICHTIGE LINKS SECTION
// ============================================================================
export const angeboteWichtigeLinksSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	subtitleDe: z.string().optional(),
	subtitleEn: z.string().optional(),
	links: z.array(angeboteLinkItemSchema).optional(),
});

// ============================================================================
// UPDATE SCHEMA
// ============================================================================
export const updateAngeboteBeratungPageSchema = z.object({
	hero: angeboteBeratungHeroSchema.optional(),
	fluchtAsyl: angeboteFluchtAsylSchema.optional(),
	namensaenderung: angeboteNamensaenderungSchema.optional(),
	beratung: angeboteBeratungSchema.optional(),
	wichtigeLinks: angeboteWichtigeLinksSchema.optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type AngeboteBeratungHeroInput = z.infer<typeof angeboteBeratungHeroSchema>;
export type AngebotePdfItemInput = z.infer<typeof angebotePdfItemSchema>;
export type AngeboteFluchtAsylInput = z.infer<typeof angeboteFluchtAsylSchema>;
export type AngeboteNamensaenderungInput = z.infer<typeof angeboteNamensaenderungSchema>;
export type AngeboteServiceItemInput = z.infer<typeof angeboteServiceItemSchema>;
export type AngeboteBeratungInput = z.infer<typeof angeboteBeratungSchema>;
export type AngeboteLinkItemInput = z.infer<typeof angeboteLinkItemSchema>;
export type AngeboteWichtigeLinksInput = z.infer<typeof angeboteWichtigeLinksSchema>;
export type UpdateAngeboteBeratungPageInput = z.infer<typeof updateAngeboteBeratungPageSchema>;
