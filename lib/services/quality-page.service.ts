import { qualityPageRepository, type QualityPageData } from "@/lib/repositories/quality-page.repository";

/**
 * Get Quality Page data
 */
export async function getQualityPage(): Promise<QualityPageData> {
	return qualityPageRepository.get();
}

/**
 * Update Quality Page data
 */
export async function updateQualityPage(data: Partial<QualityPageData>): Promise<QualityPageData> {
	return qualityPageRepository.update(data);
}

/**
 * Get Quality Page SEO data only
 */
export async function getQualityPageSeo() {
	const page = await qualityPageRepository.get();
	return page.seo;
}
