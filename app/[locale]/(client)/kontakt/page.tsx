import type { Metadata } from "next";
import { KontaktHero } from "./_components/kontakt-hero";
import { KontaktInfoSection } from "./_components/kontakt-info-section";
import { KontaktMap } from "./_components/kontakt-map";
import { KontaktConnectSection } from "./_components/kontakt-connect-section";
import {
	getKontaktPage,
	getKontaktPageSeo,
} from "@/lib/services/kontakt-page.service";
import { getSiteSettings } from "@/lib/services/site-settings.service";

export async function generateMetadata(): Promise<Metadata> {
	const [seo, siteSettings] = await Promise.all([
		getKontaktPageSeo(),
		getSiteSettings(),
	]);

	const siteName = siteSettings.seo?.siteName || "ZAVD";
	const title = seo?.title || `Contact - ${siteName}`;
	const description =
		seo?.description ||
		`Contact ${siteName} for questions about our community programs, services, or organization.`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "website",
			siteName,
			...(seo?.ogImage && { images: [{ url: seo.ogImage }] }),
		},
	};
}

export default async function KontaktPage() {
	const [kontaktPage, siteSettings] = await Promise.all([
		getKontaktPage(),
		getSiteSettings(),
	]);

	return (
		<div className="flex flex-col min-h-screen">
			{/* Section 1: Hero */}
			<KontaktHero data={kontaktPage.hero} />

			{/* Section 2: Contact Info + Form */}
			<KontaktInfoSection
				contactInfo={kontaktPage.contactInfo ?? {}}
				formSection={kontaktPage.formSection}
				phone={siteSettings.phone}
				email={siteSettings.email}
			/>

			{/* Section 3: Connect With Us */}
			<KontaktConnectSection
				data={kontaktPage.connectSection ?? {}}
				socialLinks={siteSettings.socialMedia}
			/>

			{/* Section 4: Google Map */}
			<KontaktMap embedUrl={kontaktPage.mapSection?.embedUrl} />
		</div>
	);
}
