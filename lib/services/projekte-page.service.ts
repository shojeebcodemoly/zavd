import { unstable_cache } from "next/cache";
import {
	projektePageRepository,
	type ProjektePageData,
} from "@/lib/repositories/projekte-page.repository";

export const PROJEKTE_PAGE_CACHE_TAG = "projekte-page";

export const getProjektePage = unstable_cache(
	async (): Promise<ProjektePageData> => {
		return projektePageRepository.get();
	},
	["projekte-page"],
	{
		tags: [PROJEKTE_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);
