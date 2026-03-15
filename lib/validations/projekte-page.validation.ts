import { z } from "zod";

export const updateProjektePageSchema = z.object({
	hero: z
		.object({
			backgroundImage: z.string().optional(),
			titleDe: z.string().optional(),
			titleEn: z.string().optional(),
			subtitle: z.string().optional(),
		})
		.optional(),
	intro: z
		.object({
			badge: z.string().optional(),
			headingBold: z.string().optional(),
			headingLight: z.string().optional(),
			description: z.string().optional(),
			ctaText: z.string().optional(),
			ctaHref: z.string().optional(),
			images: z
				.array(z.object({ url: z.string(), alt: z.string().optional() }))
				.optional(),
		})
		.optional(),
	projects: z
		.object({
			badge: z.string().optional(),
			heading: z.string().optional(),
			description: z.string().optional(),
			categories: z.array(z.string()).optional(),
			items: z
				.array(
					z.object({
						image: z.string().optional(),
						title: z.string().optional(),
						description: z.string().optional(),
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
