import {
	teamPageRepository,
	type TeamPageData,
	type UpdateTeamPageInput,
} from "@/lib/repositories/team-page.repository";
import type { ITeamPageSeo } from "@/models/team-page.model";

export async function getTeamPage(): Promise<TeamPageData> {
	return teamPageRepository.get();
}

export async function updateTeamPage(
	data: UpdateTeamPageInput
): Promise<TeamPageData> {
	return teamPageRepository.update(data);
}

export async function getTeamPageSeo(): Promise<ITeamPageSeo> {
	const page = await teamPageRepository.get();
	return page.seo || {};
}
