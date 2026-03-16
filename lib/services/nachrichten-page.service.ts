import { unstable_cache } from "next/cache";
import { nachrichtenPageRepository, type UpdateNachrichtenPageInput } from "@/lib/repositories/nachrichten-page.repository";

export const getNachrichtenPage = unstable_cache(
	async () => {
		return nachrichtenPageRepository.get();
	},
	["nachrichten-page"],
	{ revalidate: 3600, tags: ["nachrichten-page"] }
);

export async function updateNachrichtenPage(data: UpdateNachrichtenPageInput) {
	return nachrichtenPageRepository.update(data);
}
