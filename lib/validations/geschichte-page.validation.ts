import { z } from "zod";

export const geschichteHeroSchema = z.object({
	taglineDe: z.string().max(200).optional(),
	taglineEn: z.string().max(200).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

export const geschichteStatSchema = z.object({
	value: z.number().optional(),
	suffix: z.string().max(20).optional(),
	labelDe: z.string().max(200).optional(),
	labelEn: z.string().max(200).optional(),
});

export const geschichteIntroSchema = z.object({
	taglineDe: z.string().max(200).optional(),
	taglineEn: z.string().max(200).optional(),
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	paragraphDe: z.string().optional(),
	paragraphEn: z.string().optional(),
});

export const geschichteArticleSchema = z.object({
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
	image: z.string().optional(),
	captionDe: z.string().max(300).optional(),
	captionEn: z.string().max(300).optional(),
	direction: z.enum(["left", "right"]).optional(),
});

export const geschichteEventSchema = z.object({
	yearDe: z.string().max(20).optional(),
	yearEn: z.string().max(20).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	textDe: z.string().optional(),
	textEn: z.string().optional(),
	image: z.string().optional(),
});

export const updateGeschichtePageSchema = z.object({
	hero: geschichteHeroSchema.optional(),
	stats: z.array(geschichteStatSchema).optional(),
	intro: geschichteIntroSchema.optional(),
	articles: z.array(geschichteArticleSchema).optional(),
	events: z.array(geschichteEventSchema).optional(),
});

export type UpdateGeschichtePageInput = z.infer<typeof updateGeschichtePageSchema>;
