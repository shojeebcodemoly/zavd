import {
	themenPageRepository,
	type ThemenPageData,
	type UpdateThemenPageInput,
} from "@/lib/repositories/themen-page.repository";

export async function getThemenPage(): Promise<ThemenPageData> {
	return themenPageRepository.get();
}

export async function updateThemenPage(
	data: UpdateThemenPageInput
): Promise<ThemenPageData> {
	return themenPageRepository.update(data);
}
