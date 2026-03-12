import { unstable_cache } from "next/cache";
import {
	getAktivPageRepository,
	type GetAktivPageData,
} from "@/lib/repositories/get-aktiv-page.repository";

export const GET_AKTIV_PAGE_CACHE_TAG = "get-aktiv-page";

export const getGetAktivPage = unstable_cache(
	async (): Promise<GetAktivPageData> => {
		return getAktivPageRepository.get();
	},
	["get-aktiv-page"],
	{
		tags: [GET_AKTIV_PAGE_CACHE_TAG],
		revalidate: 3600,
	}
);
