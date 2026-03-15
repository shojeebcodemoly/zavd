import { z } from "zod";

export const humanitaereHilfeHeroSchema = z.object({
	taglineDe: z.string().max(200).optional(),
	taglineEn: z.string().max(200).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

export const humanitaereHilfeLeftSchema = z.object({
	sectionTitleDe: z.string().max(300).optional(),
	sectionTitleEn: z.string().max(300).optional(),
	donationArrivesTitleDe: z.string().max(200).optional(),
	donationArrivesTitleEn: z.string().max(200).optional(),
	transparencyTitleDe: z.string().max(200).optional(),
	transparencyTitleEn: z.string().max(200).optional(),
	transparencyTextDe: z.string().optional(),
	transparencyTextEn: z.string().optional(),
	certificateTitleDe: z.string().max(200).optional(),
	certificateTitleEn: z.string().max(200).optional(),
	certificateText1De: z.string().optional(),
	certificateText1En: z.string().optional(),
	certificateText2De: z.string().optional(),
	certificateText2En: z.string().optional(),
	certificateLinkDe: z.string().max(200).optional(),
	certificateLinkEn: z.string().max(200).optional(),
	certificateText3De: z.string().max(200).optional(),
	certificateText3En: z.string().max(200).optional(),
	certificateText4De: z.string().optional(),
	certificateText4En: z.string().optional(),
});

export const humanitaereHilfeSpecialtyItemSchema = z.object({
	textDe: z.string().optional(),
	textEn: z.string().optional(),
});

export const humanitaereHilfeMiddleSchema = z.object({
	whyTitleDe: z.string().max(200).optional(),
	whyTitleEn: z.string().max(200).optional(),
	whyTextDe: z.string().optional(),
	whyTextEn: z.string().optional(),
	specialtyTitleDe: z.string().max(200).optional(),
	specialtyTitleEn: z.string().max(200).optional(),
	specialtyItems: z.array(humanitaereHilfeSpecialtyItemSchema).optional(),
});

export const humanitaereHilfeRightSchema = z.object({
	transferTitleDe: z.string().max(200).optional(),
	transferTitleEn: z.string().max(200).optional(),
	recipientLabelDe: z.string().max(100).optional(),
	recipientLabelEn: z.string().max(100).optional(),
	bankLabelDe: z.string().max(100).optional(),
	bankLabelEn: z.string().max(100).optional(),
	bankName: z.string().max(200).optional(),
	purposeLabelDe: z.string().max(100).optional(),
	purposeLabelEn: z.string().max(100).optional(),
	purposeValueDe: z.string().max(200).optional(),
	purposeValueEn: z.string().max(200).optional(),
	iban: z.string().max(50).optional(),
	bic: z.string().max(20).optional(),
	paypalTitleDe: z.string().max(200).optional(),
	paypalTitleEn: z.string().max(200).optional(),
	paypalTextDe: z.string().optional(),
	paypalTextEn: z.string().optional(),
	paypalButtonDe: z.string().max(100).optional(),
	paypalButtonEn: z.string().max(100).optional(),
});

export const updateHumanitaereHilfePageSchema = z.object({
	hero: humanitaereHilfeHeroSchema.optional(),
	left: humanitaereHilfeLeftSchema.optional(),
	middle: humanitaereHilfeMiddleSchema.optional(),
	right: humanitaereHilfeRightSchema.optional(),
});

export type UpdateHumanitaereHilfePageInput = z.infer<typeof updateHumanitaereHilfePageSchema>;
