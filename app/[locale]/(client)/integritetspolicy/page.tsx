import type { Metadata } from "next";
import { privacyPageService } from "@/lib/services/privacy-page.service";
import { PrivacyPageClient } from "./_components/privacy-page-client";

// Revalidate every hour to pick up content changes
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
	const data = await privacyPageService.getPrivacyPage();

	const title = data.seo?.title || "Integritetspolicy - Glada Bonden Mejeri AB";
	const description =
		data.seo?.description ||
		"Läs om hur Glada Bonden Mejeri AB behandlar dina personuppgifter enligt GDPR. Information om datainsamling, cookies och dina rättigheter.";

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "website",
			locale: "sv_SE",
			...(data.seo?.ogImage && { images: [{ url: data.seo.ogImage }] }),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
	};
}

export default async function IntegritetspolicyPage() {
	const data = await privacyPageService.getPrivacyPage();

	// Serialize MongoDB object to plain object for client component
	const serializedData = JSON.parse(JSON.stringify(data));

	return <PrivacyPageClient data={serializedData} />;
}
