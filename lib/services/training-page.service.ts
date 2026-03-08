import {
	trainingPageRepository,
	type TrainingPageData,
} from "@/lib/repositories/training-page.repository";
import type { ITrainingPageSeo } from "@/models/training-page.model";

class TrainingPageService {
	async getTrainingPage(): Promise<TrainingPageData> {
		return trainingPageRepository.get();
	}

	async updateTrainingPage(
		data: Partial<TrainingPageData>
	): Promise<TrainingPageData> {
		return trainingPageRepository.update(data);
	}

	async getTrainingPageSeo(): Promise<ITrainingPageSeo> {
		const page = await trainingPageRepository.get();
		return page.seo || {};
	}
}

export const trainingPageService = new TrainingPageService();
