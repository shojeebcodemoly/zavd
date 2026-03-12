import { unstable_cache } from "next/cache";
import {
	gemeinsamAktivPageRepository,
	type GemeinsamAktivPageData,
} from "@/lib/repositories/gemeinsam-aktiv-page.repository";

export const GEMEINSAM_AKTIV_PAGE_CACHE_TAG = "gemeinsam-aktiv-page";

export const getGemeinsamAktivPage = unstable_cache(
	async (): Promise<GemeinsamAktivPageData> => {
		return gemeinsamAktivPageRepository.get();
	},
	["gemeinsam-aktiv-page"],
	{
		tags: [GEMEINSAM_AKTIV_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);
