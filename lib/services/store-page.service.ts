import {
	storePageRepository,
	type StorePageData,
	type UpdateStorePageInput,
} from "@/lib/repositories/store-page.repository";
import type { IStorePageSeo } from "@/models/store-page.model";

/**
 * Get full store page content
 */
export async function getStorePage(): Promise<StorePageData> {
	return storePageRepository.get();
}

/**
 * Update store page content
 */
export async function updateStorePage(
	data: UpdateStorePageInput
): Promise<StorePageData> {
	return storePageRepository.update(data);
}

/**
 * Get store page SEO settings
 */
export async function getStorePageSeo(): Promise<IStorePageSeo> {
	return storePageRepository.getSeo();
}
