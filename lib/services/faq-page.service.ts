import {
	faqPageRepository,
	type FAQPageData,
} from "@/lib/repositories/faq-page.repository";

class FAQPageService {
	/**
	 * Get the FAQ page data
	 */
	async getFAQPage(): Promise<FAQPageData> {
		return faqPageRepository.get();
	}

	/**
	 * Update the FAQ page data
	 */
	async updateFAQPage(data: Partial<FAQPageData>): Promise<FAQPageData> {
		return faqPageRepository.update(data);
	}
}

export const faqPageService = new FAQPageService();
