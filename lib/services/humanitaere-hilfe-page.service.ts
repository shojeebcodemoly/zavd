import {
	humanitaereHilfePageRepository,
	type HumanitaereHilfePageData,
	type UpdateHumanitaereHilfePageInput,
} from "@/lib/repositories/humanitaere-hilfe-page.repository";

export async function getHumanitaereHilfePage(): Promise<HumanitaereHilfePageData> {
	return humanitaereHilfePageRepository.get();
}

export async function updateHumanitaereHilfePage(data: UpdateHumanitaereHilfePageInput): Promise<HumanitaereHilfePageData> {
	return humanitaereHilfePageRepository.update(data);
}
