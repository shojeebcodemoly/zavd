import {
	resellerPageRepository,
	type ResellerPageData,
	type UpdateResellerPageInput,
} from "@/lib/repositories/reseller-page.repository";
import type { IResellerPageSeo } from "@/models/reseller-page.model";

/**
 * Get full reseller page content
 */
export async function getResellerPage(): Promise<ResellerPageData> {
	return resellerPageRepository.get();
}

/**
 * Update reseller page content
 */
export async function updateResellerPage(
	data: UpdateResellerPageInput
): Promise<ResellerPageData> {
	return resellerPageRepository.update(data);
}

/**
 * Get reseller page SEO settings
 */
export async function getResellerPageSeo(): Promise<IResellerPageSeo> {
	return resellerPageRepository.getSeo();
}
