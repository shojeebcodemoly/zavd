import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const careersSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	benefits: z.boolean(),
	jobOpenings: z.boolean(),
	values: z.boolean(),
	applicationForm: z.boolean(),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const careersHeroSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	titleHighlight: z.string().max(200).optional(),
	subtitle: z.string().max(1000).optional(),
});

// ============================================================================
// BENEFIT
// ============================================================================
export const careersBenefitSchema = z.object({
	icon: z.string().max(50).optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
});

// ============================================================================
// BENEFITS SECTION
// ============================================================================
export const careersBenefitsSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	benefits: z.array(careersBenefitSchema).optional(),
});

// ============================================================================
// JOB OPENING
// ============================================================================
export const careersJobOpeningSchema = z.object({
	_id: z.string().optional(),
	slug: z.string().max(200).optional(),
	title: z.string().max(200).optional(),
	location: z.string().max(200).optional(),
	workType: z.string().max(100).optional(),
	employmentType: z.string().max(100).optional(),
	shortDescription: z.string().max(500).optional(),
	featuredImage: z.string().max(500).optional(),
	description: z.string().max(10000).optional(),
	requirements: z.array(z.string().max(500)).optional(),
	responsibilities: z.array(z.string().max(500)).optional(),
	applyLink: z.string().max(500).optional(),
	isActive: z.boolean().optional(),
	publishedAt: z.string().or(z.date()).optional(),
});

// ============================================================================
// JOB OPENINGS SECTION
// ============================================================================
export const careersJobOpeningsSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	noJobsMessage: z.string().max(500).optional(),
	jobOpenings: z.array(careersJobOpeningSchema).optional(),
});

// ============================================================================
// VALUES SECTION
// ============================================================================
export const careersValuesSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	values: z.array(z.string().max(500)).optional(),
});

// ============================================================================
// CONTACT SIDEBAR SECTION
// ============================================================================
export const careersContactSidebarSchema = z.object({
	title: z.string().max(100).optional(),
	address: z.string().max(500).optional(),
	email: z.string().max(200).optional(),
	phone: z.string().max(50).optional(),
	secondaryPhone: z.string().max(50).optional(),
	formTitle: z.string().max(100).optional(),
});

// ============================================================================
// EXPERT CTA SECTION
// ============================================================================
export const careersExpertCtaSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
});

// ============================================================================
// SEO
// ============================================================================
export const careersPageSeoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(300).optional(),
	ogImage: z.string().max(500).optional(),
});

// ============================================================================
// UPDATE CAREERS PAGE SCHEMA
// ============================================================================
export const updateCareersPageSchema = z.object({
	sectionVisibility: careersSectionVisibilitySchema.optional(),
	hero: careersHeroSectionSchema.optional(),
	benefitsSection: careersBenefitsSectionSchema.optional(),
	jobOpeningsSection: careersJobOpeningsSectionSchema.optional(),
	valuesSection: careersValuesSectionSchema.optional(),
	contactSidebar: careersContactSidebarSchema.optional(),
	expertCta: careersExpertCtaSchema.optional(),
	seo: careersPageSeoSchema.optional(),
});

// Type exports
export type CareersSectionVisibilityInput = z.infer<
	typeof careersSectionVisibilitySchema
>;
export type CareersHeroSectionInput = z.infer<typeof careersHeroSectionSchema>;
export type CareersBenefitInput = z.infer<typeof careersBenefitSchema>;
export type CareersBenefitsSectionInput = z.infer<
	typeof careersBenefitsSectionSchema
>;
export type CareersJobOpeningInput = z.infer<typeof careersJobOpeningSchema>;
export type CareersJobOpeningsSectionInput = z.infer<
	typeof careersJobOpeningsSectionSchema
>;
export type CareersValuesSectionInput = z.infer<
	typeof careersValuesSectionSchema
>;
export type CareersContactSidebarInput = z.infer<
	typeof careersContactSidebarSchema
>;
export type CareersExpertCtaInput = z.infer<typeof careersExpertCtaSchema>;
export type CareersPageSeoInput = z.infer<typeof careersPageSeoSchema>;
export type UpdateCareersPageInput = z.infer<typeof updateCareersPageSchema>;
