import { unstable_cache } from "next/cache";
import { ehrenamtEngagementPageRepository } from "@/lib/repositories/ehrenamt-engagement-page.repository";

export const EHRENAMT_ENGAGEMENT_PAGE_CACHE_TAG = "ehrenamt-engagement-page";

export const getEhrenamtEngagementPage = unstable_cache(
	async () => {
		return ehrenamtEngagementPageRepository.get();
	},
	[EHRENAMT_ENGAGEMENT_PAGE_CACHE_TAG],
	{ tags: [EHRENAMT_ENGAGEMENT_PAGE_CACHE_TAG], revalidate: 3600 }
);
