import {
	missionWertePageRepository,
	type MissionWertePageData,
	type UpdateMissionWertePageInput,
} from "@/lib/repositories/mission-werte-page.repository";

export async function getMissionWertePage(): Promise<MissionWertePageData> {
	return missionWertePageRepository.get();
}

export async function updateMissionWertePage(
	data: UpdateMissionWertePageInput
): Promise<MissionWertePageData> {
	return missionWertePageRepository.update(data);
}
