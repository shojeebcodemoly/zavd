import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { ImageGallery } from "@/components/home/ImageGallery";
import { Testimonials } from "@/components/home/Testimonials";
import CtaSection from "@/components/home/CtaSection";
import { IntegrationSection } from "@/components/home/IntegrationSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { VolunteeringSection } from "@/components/home/VolunteeringSection";
import { PartnersCarousel } from "@/components/home/PartnersCarousel";
import { getHomePage, getHomePageSeo } from "@/lib/services/home-page.service";
import { getSiteSettings } from "@/lib/services/site-settings.service";
import { searchService } from "@/lib/services/search.service";
import { SearchPageClient } from "./search-page";
import { SearchPageSkeleton } from "@/components/search/SearchSkeleton";

// Dynamic rendering: always fetch fresh data from DB on each request
// This ensures dashboard changes are reflected immediately
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	const [seo, siteSettings] = await Promise.all([
		getHomePageSeo(),
		getSiteSettings(),
	]);

	const siteName = siteSettings.seo?.siteName || "ZAVD";
	const siteDescription =
		siteSettings.seo?.siteDescription ||
		"Zentralverband der Assyrischen Vereinigungen in Deutschland und europäischen Sektionen.";

	const title = seo?.titleDe || `${siteName} - Zentralverband Assyrischer Vereinigungen`;
	const description = seo?.descriptionDe || siteDescription;

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

interface HomeProps {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ s?: string; page?: string }>;
}

export default async function Home({ params, searchParams }: HomeProps) {
	const { locale } = await params;
	const isEn = locale === "en";
	const sp = await searchParams;
	const searchQuery = sp?.s || "";
	const isSearchMode = searchQuery.length >= 2;

	// If in search mode, fetch search results server-side
	if (isSearchMode) {
		const page = parseInt(sp?.page || "1");
		let initialResults = null;

		try {
			initialResults = await searchService.search({
				query: searchQuery,
				page,
				limit: 10,
			});
		} catch (error) {
			console.error("Server-side search error:", error);
		}

		return (
			<div className="flex flex-col min-h-screen pt-20">
				<Suspense
					fallback={
						<div className="_container py-12">
							<SearchPageSkeleton />
						</div>
					}
				>
					<SearchPageClient
						initialResults={initialResults}
						initialQuery={searchQuery}
					/>
				</Suspense>
			</div>
		);
	}

	// Fetch CMS data for homepage
	const [homePage, siteSettings] = await Promise.all([
		getHomePage(),
		getSiteSettings(),
	]);

	// Section visibility settings (defaults to all visible if not set)
	const defaultVisibility = {
		hero: true,
		integrationSection: true,
		sponsorsSection: true,
		volunteeringSection: true,
		partnersCarousel: true,
		imageGallery: true,
		testimonials: true,
		cta: true,
	};
	const visibility = {
		...defaultVisibility,
		...homePage.sectionVisibility,
		integrationSection: homePage.sectionVisibility?.integrationSection ?? true,
		sponsorsSection: homePage.sectionVisibility?.sponsorsSection ?? true,
		volunteeringSection: homePage.sectionVisibility?.volunteeringSection ?? true,
		partnersCarousel: homePage.sectionVisibility?.partnersCarousel ?? true,
	};

	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			{visibility.hero && homePage.hero && <Hero data={homePage.hero} isEn={isEn} />}

			{/* Integration Section */}
			{visibility.integrationSection && (
				<IntegrationSection data={homePage.integrationSection} isEn={isEn} />
			)}

			{/* Sponsors Section */}
			{visibility.sponsorsSection && (
				<SponsorsSection data={homePage.sponsorsSection} isEn={isEn} />
			)}

			{/* Volunteering Section */}
			{visibility.volunteeringSection && (
				<VolunteeringSection data={homePage.volunteeringSection} isEn={isEn} />
			)}


			{/* Partners Carousel Section */}
			{visibility.partnersCarousel && (
				<PartnersCarousel data={homePage.partnersCarouselSection} isEn={isEn} />
			)}

			{/* CTA Section */}
			{visibility.cta && homePage.ctaSection && (
				<CtaSection
					data={homePage.ctaSection}
					phone={siteSettings.phone}
					email={siteSettings.email}
					isEn={isEn}
				/>
			)}

			{/* Testimonials — after CTA */}
			{visibility.testimonials &&
				(homePage.testimonialsSection?.testimonials?.length ?? 0) > 0 && (
					<Testimonials data={homePage.testimonialsSection} isEn={isEn} />
				)}

				{/* Image Gallery */}
			{visibility.imageGallery &&
				(homePage.imageGallery?.images?.length ?? 0) > 0 && (
					<ImageGallery data={homePage.imageGallery} isEn={isEn} />
				)}

			{/* Floating Contact Button - Always visible */}
			{/* <FloatingContactButton /> */}
		</div>
	);
}
