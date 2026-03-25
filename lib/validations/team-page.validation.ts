import { z } from "zod";

// ============================================================================
// SECTION VISIBILITY
// ============================================================================
export const teamSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	stats: z.boolean(),
	teamMembers: z.boolean(),
	values: z.boolean(),
	joinUs: z.boolean(),
	contact: z.boolean(),
	richContent: z.boolean().default(false),
});

// ============================================================================
// HERO SECTION
// ============================================================================
export const teamHeroSectionSchema = z.object({
	badgeDe: z.string().max(100).optional(),
	badgeEn: z.string().max(100).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(1000).optional(),
	subtitleEn: z.string().max(1000).optional(),
});

// ============================================================================
// STATS
// ============================================================================
export const teamStatSchema = z.object({
	value: z.string().max(50).optional(),
	labelDe: z.string().max(100).optional(),
	labelEn: z.string().max(100).optional(),
});

// ============================================================================
// TEAM MEMBER
// ============================================================================
export const teamMemberSchema = z.object({
	name: z.string().max(200).optional(),
	roleDe: z.string().max(200).optional(),
	roleEn: z.string().max(200).optional(),
	departmentDe: z.string().max(100).optional(),
	departmentEn: z.string().max(100).optional(),
	bioDe: z.string().max(2000).optional(),
	bioEn: z.string().max(2000).optional(),
	image: z.string().max(500).optional(),
	email: z.string().email().max(200).optional().or(z.literal("")),
	linkedin: z.string().max(500).optional(),
	phone: z.string().max(50).optional(),
});

// ============================================================================
// VALUES SECTION
// ============================================================================
export const teamValueSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(1000).optional(),
	descriptionEn: z.string().max(1000).optional(),
});

export const teamValuesSectionSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	values: z.array(teamValueSchema).optional(),
});

// ============================================================================
// JOIN US SECTION
// ============================================================================
export const teamJoinUsSectionSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(1000).optional(),
	descriptionEn: z.string().max(1000).optional(),
	primaryCta: z
		.object({
			textDe: z.string().max(100).optional(),
			textEn: z.string().max(100).optional(),
			href: z.string().max(500).optional(),
		})
		.optional(),
	secondaryCta: z
		.object({
			textDe: z.string().max(100).optional(),
			textEn: z.string().max(100).optional(),
			href: z.string().max(500).optional(),
		})
		.optional(),
});

// ============================================================================
// CONTACT SECTION
// ============================================================================
export const teamContactSectionSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(500).optional(),
	descriptionEn: z.string().max(500).optional(),
	phone: z.string().max(50).optional(),
	email: z.string().email().max(200).optional().or(z.literal("")),
});

// ============================================================================
// SEO
// ============================================================================
export const teamPageSeoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(300).optional(),
	ogImage: z.string().max(500).optional(),
});

// ============================================================================
// UPDATE TEAM PAGE SCHEMA
// ============================================================================
export const updateTeamPageSchema = z.object({
	sectionVisibility: teamSectionVisibilitySchema.optional(),
	hero: teamHeroSectionSchema.optional(),
	stats: z.array(teamStatSchema).optional(),
	teamMembers: z.array(teamMemberSchema).optional(),
	valuesSection: teamValuesSectionSchema.optional(),
	joinUs: teamJoinUsSectionSchema.optional(),
	contact: teamContactSectionSchema.optional(),
	seo: teamPageSeoSchema.optional(),
});

// Type exports
export type TeamSectionVisibilityInput = z.infer<typeof teamSectionVisibilitySchema>;
export type TeamHeroSectionInput = z.infer<typeof teamHeroSectionSchema>;
export type TeamStatInput = z.infer<typeof teamStatSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type TeamValueInput = z.infer<typeof teamValueSchema>;
export type TeamValuesSectionInput = z.infer<typeof teamValuesSectionSchema>;
export type TeamJoinUsSectionInput = z.infer<typeof teamJoinUsSectionSchema>;
export type TeamContactSectionInput = z.infer<typeof teamContactSectionSchema>;
export type TeamPageSeoInput = z.infer<typeof teamPageSeoSchema>;
export type UpdateTeamPageInput = z.infer<typeof updateTeamPageSchema>;
