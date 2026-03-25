import { z } from "zod";

export const updateProjektePageSchema = z.object({
	hero: z
		.object({
			backgroundImage: z.string().optional(),
			titleDe: z.string().optional(),
			titleEn: z.string().optional(),
			subtitleDe: z.string().optional(),
			subtitleEn: z.string().optional(),
		})
		.optional(),
	intro: z
		.object({
			badgeDe: z.string().optional(),
			badgeEn: z.string().optional(),
			headingBoldDe: z.string().optional(),
			headingBoldEn: z.string().optional(),
			headingLightDe: z.string().optional(),
			headingLightEn: z.string().optional(),
			descriptionDe: z.string().optional(),
			descriptionEn: z.string().optional(),
			ctaTextDe: z.string().optional(),
			ctaTextEn: z.string().optional(),
			ctaHref: z.string().optional(),
			images: z
				.array(z.object({ url: z.string(), alt: z.string().optional() }))
				.optional(),
		})
		.optional(),
	projects: z
		.object({
			badgeDe: z.string().optional(),
			badgeEn: z.string().optional(),
			headingDe: z.string().optional(),
			headingEn: z.string().optional(),
			descriptionDe: z.string().optional(),
			descriptionEn: z.string().optional(),
			categories: z.array(z.string()).optional(),
			items: z
				.array(
					z.object({
						image: z.string().optional(),
						titleDe: z.string().optional(),
						titleEn: z.string().optional(),
						descriptionDe: z.string().optional(),
						descriptionEn: z.string().optional(),
						location: z.string().optional(),
						date: z.string().optional(),
						category: z.string().optional(),
						href: z.string().optional(),
					})
				)
				.optional(),
		})
		.optional(),
});

export type UpdateProjektePageInput = z.infer<typeof updateProjektePageSchema>;
