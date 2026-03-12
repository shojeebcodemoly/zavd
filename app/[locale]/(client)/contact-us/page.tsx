import type { Metadata } from "next";
import { AnimatedHero } from "./_components/animated-hero";
import { ContactSection } from "@/components/shared/ContactSection";
import { ContactMap } from "@/components/shared/ContactMap";
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
	const title = seo?.title || `Contact Us - ${siteName}`;
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
		twitter: {
			card: "summary_large_image",
			title,
			description,
			...(seo?.ogImage && { images: [seo.ogImage] }),
		},
	};
}

export default async function ContactUsPage() {
	const [kontaktPage, siteSettings] = await Promise.all([
		getKontaktPage(),
		getSiteSettings(),
	]);

	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<AnimatedHero data={kontaktPage.hero} />

			{/* Contact Info + Form (two columns) */}
			<ContactSection
				contactInfo={kontaktPage.contactInfo ?? {}}
				formSection={kontaktPage.formSection}
				phone={siteSettings.phone}
				email={siteSettings.email}
			/>

			{/* Google Map */}
			<ContactMap embedUrl={kontaktPage.mapSection?.embedUrl} />
		</div>
	);
}
