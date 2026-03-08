import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const trainingSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	mainContent: z.boolean(),
	benefits: z.boolean(),
	process: z.boolean(),
	support: z.boolean(),
	inquiryForm: z.boolean(),
	resources: z.boolean(),
	richContent: z.boolean().default(false),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const trainingHeroSectionSchema = z.object({
	title: z.string().max(200).optional(),
	titleHighlight: z.string().max(200).optional(),
	subtitle: z.string().max(1000).optional(),
});

// ============================================================================
// MAIN CONTENT SECTION
// ============================================================================
export const trainingMainContentSectionSchema = z.object({
	title: z.string().max(200).optional(),
	paragraphs: z.array(z.string().max(2000)).optional(),
});

// ============================================================================
// BENEFIT CARD
// ============================================================================
export const trainingBenefitCardSchema = z.object({
	icon: z.string().max(50).optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
});

// ============================================================================
// PROCESS STEP
// ============================================================================
export const trainingProcessStepSchema = z.object({
	number: z.string().max(10).optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
});

// ============================================================================
// PROCESS SECTION
// ============================================================================
export const trainingProcessSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	steps: z.array(trainingProcessStepSchema).optional(),
});

// ============================================================================
// SUPPORT SECTION
// ============================================================================
export const trainingSupportSectionSchema = z.object({
	title: z.string().max(200).optional(),
	paragraphs: z.array(z.string().max(1000)).optional(),
	phone: z.string().max(50).optional(),
	email: z.string().email().max(200).optional().or(z.literal("")),
});

// ============================================================================
// INQUIRY SECTION
// ============================================================================
export const trainingInquirySectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
});

// ============================================================================
// RESOURCE CARD
// ============================================================================
export const trainingResourceCardSchema = z.object({
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
	href: z.string().max(500).optional(),
	buttonText: z.string().max(100).optional(),
});

// ============================================================================
// RESOURCES SECTION
// ============================================================================
export const trainingResourcesSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(300).optional(),
	resources: z.array(trainingResourceCardSchema).optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const trainingPageSeoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(300).optional(),
	ogImage: z.string().max(500).optional(),
});

// ============================================================================
// UPDATE TRAINING PAGE SCHEMA
// ============================================================================
export const updateTrainingPageSchema = z.object({
	sectionVisibility: trainingSectionVisibilitySchema.optional(),
	hero: trainingHeroSectionSchema.optional(),
	mainContent: trainingMainContentSectionSchema.optional(),
	benefits: z.array(trainingBenefitCardSchema).optional(),
	processSection: trainingProcessSectionSchema.optional(),
	supportSection: trainingSupportSectionSchema.optional(),
	inquirySection: trainingInquirySectionSchema.optional(),
	resourcesSection: trainingResourcesSectionSchema.optional(),
	seo: trainingPageSeoSchema.optional(),
});

// Type exports
export type TrainingSectionVisibilityInput = z.infer<
	typeof trainingSectionVisibilitySchema
>;
export type TrainingHeroSectionInput = z.infer<typeof trainingHeroSectionSchema>;
export type TrainingMainContentSectionInput = z.infer<
	typeof trainingMainContentSectionSchema
>;
export type TrainingBenefitCardInput = z.infer<typeof trainingBenefitCardSchema>;
export type TrainingProcessStepInput = z.infer<typeof trainingProcessStepSchema>;
export type TrainingProcessSectionInput = z.infer<
	typeof trainingProcessSectionSchema
>;
export type TrainingSupportSectionInput = z.infer<
	typeof trainingSupportSectionSchema
>;
export type TrainingInquirySectionInput = z.infer<
	typeof trainingInquirySectionSchema
>;
export type TrainingResourceCardInput = z.infer<
	typeof trainingResourceCardSchema
>;
export type TrainingResourcesSectionInput = z.infer<
	typeof trainingResourcesSectionSchema
>;
export type TrainingPageSeoInput = z.infer<typeof trainingPageSeoSchema>;
export type UpdateTrainingPageInput = z.infer<typeof updateTrainingPageSchema>;
