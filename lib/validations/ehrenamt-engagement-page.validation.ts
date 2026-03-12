import { z } from "zod";

export const updateEhrenamtEngagementPageSchema = z.object({
	hero: z
		.object({
			backgroundImage: z.string().optional(),
			titleDe: z.string().optional(),
			titleEn: z.string().optional(),
			breadcrumb: z.string().optional(),
		})
		.optional(),
});

export type UpdateEhrenamtEngagementPageInput = z.infer<
	typeof updateEhrenamtEngagementPageSchema
>;
