import {
	careersPageRepository,
	type CareersPageData,
	type JobOpeningData,
} from "@/lib/repositories/careers-page.repository";
import type { ICareersPageSeo } from "@/models/careers-page.model";

class CareersPageService {
	async getCareersPage(): Promise<CareersPageData> {
		return careersPageRepository.get();
	}

	async getPublicCareersPage(): Promise<CareersPageData> {
		return careersPageRepository.getPublic();
	}

	async updateCareersPage(
		data: Partial<CareersPageData>
	): Promise<CareersPageData> {
		return careersPageRepository.update(data);
	}

	async getCareersPageSeo(): Promise<ICareersPageSeo> {
		const page = await careersPageRepository.get();
		return page.seo || {};
	}

	async getJobBySlug(slug: string): Promise<JobOpeningData | null> {
		return careersPageRepository.getJobBySlug(slug);
	}

	async getActiveJobs(): Promise<JobOpeningData[]> {
		return careersPageRepository.getActiveJobs();
	}
}

export const careersPageService = new CareersPageService();
