import { z } from "zod";

export const spendenHeroSchema = z.object({
	taglineDe: z.string().max(200).optional(),
	taglineEn: z.string().max(200).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

export const spendenCardSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(500).optional(),
	descriptionEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

export const spendenCardsSchema = z.object({
	sectionTitleDe: z.string().max(200).optional(),
	sectionTitleEn: z.string().max(200).optional(),
	humanitaer: spendenCardSchema.optional(),
	zavd: spendenCardSchema.optional(),
});

export const updateSpendenPageSchema = z.object({
	hero: spendenHeroSchema.optional(),
	cards: spendenCardsSchema.optional(),
});

export type UpdateSpendenPageInput = z.infer<typeof updateSpendenPageSchema>;
