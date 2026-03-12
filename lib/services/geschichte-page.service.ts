import {
	geschichtePageRepository,
	type GeschichtePageData,
	type UpdateGeschichtePageInput,
} from "@/lib/repositories/geschichte-page.repository";

export async function getGeschichtePage(): Promise<GeschichtePageData> {
	return geschichtePageRepository.get();
}

export async function updateGeschichtePage(
	data: UpdateGeschichtePageInput
): Promise<GeschichtePageData> {
	return geschichtePageRepository.update(data);
}
