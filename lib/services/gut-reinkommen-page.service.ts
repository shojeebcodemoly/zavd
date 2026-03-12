import { unstable_cache } from "next/cache";
import {
	gutReinkommenPageRepository,
	type GutReinkommenPageData,
} from "@/lib/repositories/gut-reinkommen-page.repository";

export const GUT_REINKOMMEN_PAGE_CACHE_TAG = "gut-reinkommen-page";

export const getGutReinkommenPage = unstable_cache(
	async (): Promise<GutReinkommenPageData> => {
		return gutReinkommenPageRepository.get();
	},
	["gut-reinkommen-page"],
	{
		tags: [GUT_REINKOMMEN_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);
