import {
	privacyPageRepository,
	type PrivacyPageData,
} from "@/lib/repositories/privacy-page.repository";

class PrivacyPageService {
	/**
	 * Get the privacy page data
	 */
	async getPrivacyPage(): Promise<PrivacyPageData> {
		return privacyPageRepository.get();
	}

	/**
	 * Update the privacy page data
	 */
	async updatePrivacyPage(
		data: Partial<PrivacyPageData>
	): Promise<PrivacyPageData> {
		return privacyPageRepository.update(data);
	}
}

export const privacyPageService = new PrivacyPageService();
