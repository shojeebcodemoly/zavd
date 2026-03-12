import {
	vorstandTeamPageRepository,
	type VorstandTeamPageData,
	type UpdateVorstandTeamPageInput,
} from "@/lib/repositories/vorstand-team-page.repository";

export async function getVorstandTeamPage(): Promise<VorstandTeamPageData> {
	return vorstandTeamPageRepository.get();
}

export async function updateVorstandTeamPage(
	data: UpdateVorstandTeamPageInput
): Promise<VorstandTeamPageData> {
	return vorstandTeamPageRepository.update(data);
}
