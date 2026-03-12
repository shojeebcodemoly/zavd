import {
	satzungPageRepository,
	type SatzungPageData,
	type UpdateSatzungPageInput,
} from "@/lib/repositories/satzung-page.repository";

export async function getSatzungPage(): Promise<SatzungPageData> {
	return satzungPageRepository.get();
}

export async function updateSatzungPage(
	data: UpdateSatzungPageInput
): Promise<SatzungPageData> {
	return satzungPageRepository.update(data);
}
