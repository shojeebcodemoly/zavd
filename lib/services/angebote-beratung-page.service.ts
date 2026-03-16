import {
	angeboteBeratungPageRepository,
	type AngeboteBeratungPageData,
	type UpdateAngeboteBeratungPageInput,
} from "@/lib/repositories/angebote-beratung-page.repository";

export async function getAngeboteBeratungPage(): Promise<AngeboteBeratungPageData> {
	return angeboteBeratungPageRepository.get();
}

export async function updateAngeboteBeratungPage(
	data: UpdateAngeboteBeratungPageInput
): Promise<AngeboteBeratungPageData> {
	return angeboteBeratungPageRepository.update(data);
}
