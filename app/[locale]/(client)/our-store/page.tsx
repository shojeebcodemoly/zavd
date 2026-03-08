import type { Metadata } from "next";
import { getStorePage, getStorePageSeo } from "@/lib/services/store-page.service";
import { StorePageClient } from "./_components/store-page-client";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
	const seo = await getStorePageSeo();

	const title = seo?.title || "Store in Boxholm - Boxholm Cheese";
	const description =
		seo?.description ||
		"Visit our cheese store in Boxholm. Taste and purchase our handcrafted artisan cheeses directly from the source.";

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

export default async function StorePage() {
	const storePage = await getStorePage();

	// Serialize MongoDB object to plain object for client component
	const serializedData = JSON.parse(JSON.stringify(storePage));

	return <StorePageClient data={serializedData} />;
}
