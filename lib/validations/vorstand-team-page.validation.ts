import { z } from "zod";

// ============================================================================
// HERO SECTION
// ============================================================================
export const vorstandTeamHeroSchema = z.object({
	taglineDe: z.string().max(200).optional(),
	taglineEn: z.string().max(200).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

// ============================================================================
// BOARD MEMBER
// ============================================================================
export const vorstandMemberSchema = z.object({
	nameDe: z.string().max(200).optional(),
	nameEn: z.string().max(200).optional(),
	roleDe: z.string().max(200).optional(),
	roleEn: z.string().max(200).optional(),
	phone: z.string().max(100).optional(),
	email: z.string().max(200).optional(),
	image: z.string().optional(),
});

// ============================================================================
// BOARD SECTION
// ============================================================================
export const vorstandSectionSchema = z.object({
	sectionLabelDe: z.string().max(200).optional(),
	sectionLabelEn: z.string().max(200).optional(),
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	members: z.array(vorstandMemberSchema).optional(),
});

// ============================================================================
// TEAM MEMBER
// ============================================================================
export const teamMemberSchema = z.object({
	nameDe: z.string().max(200).optional(),
	nameEn: z.string().max(200).optional(),
	roleDe: z.string().max(200).optional(),
	roleEn: z.string().max(200).optional(),
	bioDe: z.string().optional(),
	bioEn: z.string().optional(),
	phone: z.string().max(100).optional(),
	email: z.string().max(200).optional(),
	image: z.string().optional(),
});

// ============================================================================
// TEAM SECTION
// ============================================================================
export const teamSectionSchema = z.object({
	sectionLabelDe: z.string().max(200).optional(),
	sectionLabelEn: z.string().max(200).optional(),
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	members: z.array(teamMemberSchema).optional(),
});

// ============================================================================
// UPDATE SCHEMA
// ============================================================================
export const updateVorstandTeamPageSchema = z.object({
	hero: vorstandTeamHeroSchema.optional(),
	vorstand: vorstandSectionSchema.optional(),
	team: teamSectionSchema.optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type VorstandTeamHeroInput = z.infer<typeof vorstandTeamHeroSchema>;
export type VorstandMemberInput = z.infer<typeof vorstandMemberSchema>;
export type VorstandSectionInput = z.infer<typeof vorstandSectionSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type TeamSectionInput = z.infer<typeof teamSectionSchema>;
export type UpdateVorstandTeamPageInput = z.infer<typeof updateVorstandTeamPageSchema>;
