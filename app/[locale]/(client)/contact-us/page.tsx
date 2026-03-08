import type { Metadata } from "next";
import { AnimatedHero } from "./_components/animated-hero";
import { AnimatedContactCards } from "./_components/animated-contact-cards";
import { AnimatedFormSection } from "./_components/animated-form-section";
import { AnimatedOfficeLocations } from "./_components/animated-office-locations";
import { AnimatedFAQ } from "./_components/animated-faq";
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

	const siteName = siteSettings.seo?.siteName || "Milatte Farm";
	const title = seo?.title || `Contact Us - ${siteName}`;
	const description =
		seo?.description ||
		`Contact ${siteName} for questions about our artisan cheese, dairy products, or farm visits.`;

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
	// Fetch CMS data
	const [kontaktPage, siteSettings] = await Promise.all([
		getKontaktPage(),
		getSiteSettings(),
	]);

	// Filter visible offices
	const visibleOffices = siteSettings.offices.filter(
		(office) => office.isVisible !== false
	);

	return (
		<div className="bg-primary/50 w-full">
			{/* Hero Section */}
			<AnimatedHero
				data={kontaktPage.hero}
				phone={siteSettings.phone}
				email={siteSettings.email}
			/>

			{/* Contact Methods Section */}
			<AnimatedContactCards
				phoneCard={kontaktPage.phoneCard}
				emailCard={kontaktPage.emailCard}
				socialCard={kontaktPage.socialCard}
				phone={siteSettings.phone}
				email={siteSettings.email}
				facebookUrl={siteSettings.socialMedia?.facebook || ""}
				instagramUrl={siteSettings.socialMedia?.instagram || ""}
				linkedinUrl={siteSettings.socialMedia?.linkedin || ""}
			/>

			{/* Contact Form Section */}
			<section className="section-padding bg-background">
				<div className="_container">
					<div className="mx-auto max-w-3xl">
						<AnimatedFormSection data={kontaktPage.formSection} />
					</div>
				</div>
			</section>

			{/* Office Locations Section */}
			<section className="section-padding bg-muted">
				<div className="_container overflow-hidden">
					<AnimatedOfficeLocations
						data={kontaktPage.officeSection}
						addresses={visibleOffices}
					/>
				</div>
			</section>

			{/* FAQ Section */}
			<AnimatedFAQ data={kontaktPage.faqSection} />
		</div>
	);
}
