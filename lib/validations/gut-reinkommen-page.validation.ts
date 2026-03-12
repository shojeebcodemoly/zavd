import { z } from "zod";

const contentBlockSchema = z.object({
	heading: z.string().optional(),
	body: z.string().optional(),
});

const galleryImageSchema = z.object({
	url: z.string().min(1),
	alt: z.string().optional(),
	caption: z.string().optional(),
});

const partnerLogoSchema = z.object({
	image: z.string().optional(),
	name: z.string().optional(),
	href: z.string().optional(),
});

export const updateGutReinkommenPageSchema = z.object({
	hero: z
		.object({
			backgroundImage: z.string().optional(),
			titleDe: z.string().optional(),
			titleEn: z.string().optional(),
			breadcrumb: z.string().optional(),
		})
		.optional(),
	content: z
		.object({
			title: z.string().optional(),
			body: z.string().optional(),
			image: z.string().optional(),
			blocks: z.array(contentBlockSchema).optional(),
		})
		.optional(),
	gallery: z
		.object({
			title: z.string().optional(),
			subtitle: z.string().optional(),
			images: z.array(galleryImageSchema).optional(),
		})
		.optional(),
	partners: z
		.object({
			heading: z.string().optional(),
			logos: z.array(partnerLogoSchema).optional(),
		})
		.optional(),
});

export type UpdateGutReinkommenPageInput = z.infer<
	typeof updateGutReinkommenPageSchema
>;
