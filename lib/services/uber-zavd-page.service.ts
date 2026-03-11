import {
	uberZavdPageRepository,
	type UberZavdPageData,
	type UpdateUberZavdPageInput,
} from "@/lib/repositories/uber-zavd-page.repository";

export async function getUberZavdPage(): Promise<UberZavdPageData> {
	return uberZavdPageRepository.get();
}

export async function updateUberZavdPage(
	data: UpdateUberZavdPageInput
): Promise<UberZavdPageData> {
	return uberZavdPageRepository.update(data);
}
