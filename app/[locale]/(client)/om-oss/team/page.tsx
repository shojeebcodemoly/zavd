import type { Metadata } from "next";
import { getTeamPage, getTeamPageSeo } from "@/lib/services/team-page.service";
import { TeamPageClient } from "./_components/team-page-client";

export async function generateMetadata(): Promise<Metadata> {
	const seo = await getTeamPageSeo();

	const title = seo?.title || "Vårt Team - Boxholm Cheese";
	const description =
		seo?.description ||
		"Möt vårt passionerade team av ostmakare och experter som arbetar för att leverera de finaste ostarna.";

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			...(seo?.ogImage && { images: [{ url: seo.ogImage }] }),
		},
	};
}

export default async function TeamPage() {
	const teamPage = await getTeamPage();

	// Serialize MongoDB objects to plain objects for client component
	const serializedData = JSON.parse(JSON.stringify(teamPage));

	return <TeamPageClient data={serializedData} />;
}
