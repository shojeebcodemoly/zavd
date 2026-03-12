import { unstable_cache } from "next/cache";
import {
	patenschaftsprojektPageRepository,
	type PatenschaftsprojektPageData,
} from "@/lib/repositories/patenschaftsprojekt-page.repository";

export const PATENSCHAFTSPROJEKT_PAGE_CACHE_TAG = "patenschaftsprojekt-page";

export const getPatenschaftsprojektPage = unstable_cache(
	async (): Promise<PatenschaftsprojektPageData> => {
		return patenschaftsprojektPageRepository.get();
	},
	["patenschaftsprojekt-page"],
	{
		tags: [PATENSCHAFTSPROJEKT_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);
