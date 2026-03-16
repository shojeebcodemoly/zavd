import type { Metadata } from "next";
import { getStorePage, getStorePageSeo } from "@/lib/services/store-page.service";
import { StorePageClient } from "./_components/store-page-client";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	const seo = await getStorePageSeo();

	const title = seo?.title || "Our Office - ZAVD";
	const description =
		seo?.description ||
		"Visit the ZAVD community organization office. Learn about our services and how we support the Assyrian community in Germany.";

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
