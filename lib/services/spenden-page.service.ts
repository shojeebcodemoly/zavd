import {
	spendenPageRepository,
	type SpendenPageData,
	type UpdateSpendenPageInput,
} from "@/lib/repositories/spenden-page.repository";

export async function getSpendenPage(): Promise<SpendenPageData> {
	return spendenPageRepository.get();
}

export async function updateSpendenPage(data: UpdateSpendenPageInput): Promise<SpendenPageData> {
	return spendenPageRepository.update(data);
}
