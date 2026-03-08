import {
	legalPageRepository,
	type LegalPageData,
	type UpdateLegalPageInput,
} from "@/lib/repositories/legal-page.repository";
import type { ILegalPageSeo } from "@/models/legal-page.model";

export async function getLegalPage(): Promise<LegalPageData> {
	return legalPageRepository.get();
}

export async function updateLegalPage(
	data: UpdateLegalPageInput
): Promise<LegalPageData> {
	return legalPageRepository.update(data);
}

export async function getLegalPageSeo(): Promise<ILegalPageSeo> {
	return legalPageRepository.getSeo();
}
