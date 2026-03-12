import { z } from "zod";

export const missionWerteHeroSchema = z.object({
	taglineDe: z.string().max(200).optional(),
	taglineEn: z.string().max(200).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

export const missionWerteIntroSchema = z.object({
	taglineDe: z.string().max(200).optional(),
	taglineEn: z.string().max(200).optional(),
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	paragraphDe: z.string().optional(),
	paragraphEn: z.string().optional(),
});

export const missionWerteValueSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	image: z.string().optional(),
});

export const updateMissionWertePageSchema = z.object({
	hero: missionWerteHeroSchema.optional(),
	intro: missionWerteIntroSchema.optional(),
	values: z.array(missionWerteValueSchema).optional(),
});

export type UpdateMissionWertePageInput = z.infer<typeof updateMissionWertePageSchema>;
