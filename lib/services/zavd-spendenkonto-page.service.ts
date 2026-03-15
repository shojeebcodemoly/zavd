import {
	zavdSpendenkontoPageRepository,
	type ZavdSpendenkontoPageData,
	type UpdateZavdSpendenkontoPageInput,
} from "@/lib/repositories/zavd-spendenkonto-page.repository";

export async function getZavdSpendenkontoPage(): Promise<ZavdSpendenkontoPageData> {
	return zavdSpendenkontoPageRepository.get();
}

export async function updateZavdSpendenkontoPage(data: UpdateZavdSpendenkontoPageInput): Promise<ZavdSpendenkontoPageData> {
	return zavdSpendenkontoPageRepository.update(data);
}
