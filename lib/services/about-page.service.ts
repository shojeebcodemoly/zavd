import {
	aboutPageRepository,
	type AboutPageData,
	type UpdateAboutPageInput,
} from "@/lib/repositories/about-page.repository";
import type { IAboutPageSeo } from "@/models/about-page.model";

/**
 * Get full about page content
 */
export async function getAboutPage(): Promise<AboutPageData> {
	return aboutPageRepository.get();
}

/**
 * Update about page content
 */
export async function updateAboutPage(
	data: UpdateAboutPageInput
): Promise<AboutPageData> {
	return aboutPageRepository.update(data);
}

/**
 * Get about page SEO settings
 */
export async function getAboutPageSeo(): Promise<IAboutPageSeo> {
	return aboutPageRepository.getSeo();
}
