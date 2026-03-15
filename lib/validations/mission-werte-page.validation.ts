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
	image: z.string().optional(),
});

export const missionWerteValueSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	image: z.string().optional(),
});

export const missionWerteStatItemSchema = z.object({
	value: z.coerce.number().min(0).optional(),
	suffix: z.string().max(10).optional(),
	labelDe: z.string().max(200).optional(),
	labelEn: z.string().max(200).optional(),
});

export const missionWerteStatsSchema = z.object({
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	items: z.array(missionWerteStatItemSchema).optional(),
});

export const missionWerteTeamMemberSchema = z.object({
	name: z.string().max(200).optional(),
	roleDe: z.string().max(200).optional(),
	roleEn: z.string().max(200).optional(),
	image: z.string().optional(),
});

export const missionWerteTeamSchema = z.object({
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	members: z.array(missionWerteTeamMemberSchema).optional(),
});

export const missionWerteGoalItemSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
});

export const missionWerteGoalsSchema = z.object({
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	items: z.array(missionWerteGoalItemSchema).optional(),
});

export const missionWerteStepSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
});

export const missionWerteApproachSchema = z.object({
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	steps: z.array(missionWerteStepSchema).optional(),
});

export const missionWertePartnerItemSchema = z.object({
	name: z.string().max(200).optional(),
	logo: z.string().optional(),
	url: z.string().optional(),
});

export const missionWertePartnersSchema = z.object({
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	items: z.array(missionWertePartnerItemSchema).optional(),
});

export const updateMissionWertePageSchema = z.object({
	hero: missionWerteHeroSchema.optional(),
	intro: missionWerteIntroSchema.optional(),
	values: z.array(missionWerteValueSchema).optional(),
	stats: missionWerteStatsSchema.optional(),
	team: missionWerteTeamSchema.optional(),
	goals: missionWerteGoalsSchema.optional(),
	approach: missionWerteApproachSchema.optional(),
	partners: missionWertePartnersSchema.optional(),
});

export type UpdateMissionWertePageInput = z.infer<typeof updateMissionWertePageSchema>;
