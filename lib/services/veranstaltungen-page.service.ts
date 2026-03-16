import { unstable_cache } from "next/cache";
import { veranstaltungenPageRepository, type UpdateVeranstaltungenPageInput } from "@/lib/repositories/veranstaltungen-page.repository";

export const getVeranstaltungenPage = unstable_cache(
	async () => {
		return veranstaltungenPageRepository.get();
	},
	["veranstaltungen-page"],
	{ revalidate: 3600, tags: ["veranstaltungen-page"] }
);

export async function updateVeranstaltungenPage(data: UpdateVeranstaltungenPageInput) {
	return veranstaltungenPageRepository.update(data);
}
