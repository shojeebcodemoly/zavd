import type { Metadata } from "next";
import {
	getAboutPage,
	getAboutPageSeo,
} from "@/lib/services/about-page.service";
import { getKontaktPage } from "@/lib/services/kontakt-page.service";
import { getSiteSettings } from "@/lib/services/site-settings.service";
import { AboutUsPageClient } from "./_components/about-us-page-client";

export async function generateMetadata(): Promise<Metadata> {
	const seo = await getAboutPageSeo();

	const title = seo?.title || "About Us - Milatte Farm";
	const description =
		seo?.description ||
		"Learn about our history, meet our team, and discover the passion behind our artisan cheese products.";

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

export default async function AboutUsPage() {
	const [aboutPage, kontaktPage, siteSettings] = await Promise.all([
		getAboutPage(),
		getKontaktPage(),
		getSiteSettings(),
	]);

	// Filter visible offices
	const visibleOffices = siteSettings.offices.filter(
		(office) => office.isVisible !== false
	);

	// Serialize MongoDB objects to plain objects for client component
	const serializedAboutPage = JSON.parse(JSON.stringify(aboutPage));
	const serializedKontaktPage = JSON.parse(JSON.stringify(kontaktPage));
	const serializedSiteSettings = JSON.parse(JSON.stringify(siteSettings));
	const serializedOffices = JSON.parse(JSON.stringify(visibleOffices));

	return (
		<AboutUsPageClient
			data={serializedAboutPage}
			kontaktData={serializedKontaktPage}
			siteSettings={serializedSiteSettings}
			offices={serializedOffices}
		/>
	);
}
