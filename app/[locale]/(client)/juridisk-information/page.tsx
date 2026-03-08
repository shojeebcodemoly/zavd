import type { Metadata } from "next";
import { getLegalPage } from "@/lib/services/legal-page.service";
import { LegalPageClient } from "./_components/legal-page-client";

// Revalidate every hour to pick up content changes
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
	const data = await getLegalPage();

	const title = data.seo?.title || "Juridisk Information";
	const description = data.seo?.description || "Juridisk information, användarvillkor och GDPR-rättigheter.";

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "website",
			...(data.seo?.ogImage && { images: [{ url: data.seo.ogImage }] }),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
	};
}

export default async function JuridiskInformationPage() {
	const data = await getLegalPage();

	// Serialize MongoDB object to plain object for client component
	const serializedData = JSON.parse(JSON.stringify(data));

	return <LegalPageClient data={serializedData} />;
}
