import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { ProductCategorySection } from "@/components/home/ProductCategorySection";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { PromoBanner } from "@/components/home/PromoBanner";
import { FeatureBanner } from "@/components/home/FeatureBanner";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { ImageGallery } from "@/components/home/ImageGallery";
import { Testimonials } from "@/components/home/Testimonials";
import AboutSection from "@/components/home/AboutSection";
import CtaSection from "@/components/home/CtaSection";
import { getHomePage, getHomePageSeo } from "@/lib/services/home-page.service";
import { getSiteSettings } from "@/lib/services/site-settings.service";
import { categoryService } from "@/lib/services/category.service";
import { productRepository } from "@/lib/repositories/product.repository";
import { searchService } from "@/lib/services/search.service";
import { SearchPageClient } from "./search-page";
import { SearchPageSkeleton } from "@/components/search/SearchSkeleton";

// ISR: Revalidate every 24 hours
// Note: Search mode uses searchParams which makes those requests dynamic
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
	const [seo, siteSettings] = await Promise.all([
		getHomePageSeo(),
		getSiteSettings(),
	]);

	const siteName = siteSettings.seo?.siteName || "Milatte Farm";
	const siteDescription =
		siteSettings.seo?.siteDescription ||
		"Premium artisan cheeses and natural dairy products from our family farm";

	const title = seo?.title || `${siteName} - Artisan Cheese & Dairy`;
	const description = seo?.description || siteDescription;

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
	searchParams: Promise<{ s?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
	const params = await searchParams;
	const searchQuery = params?.s || "";
	const isSearchMode = searchQuery.length >= 2;

	// If in search mode, fetch search results server-side
	if (isSearchMode) {
		const page = parseInt(params?.page || "1");
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
	const [homePage, siteSettings, activeCategories, publishedProducts] = await Promise.all([
		getHomePage(),
		getSiteSettings(),
		categoryService.getActiveCategories(),
		productRepository.findPublished({ page: 1, limit: 12 }),
	]);

	// Section visibility settings (defaults to all visible if not set)
	// Use spread to ensure categoryShowcase and productCarousel default to true even if DB doesn't have them
	const defaultVisibility = {
		hero: true,
		categoryShowcase: true,
		productCarousel: true,
		promoBanner: true,
		featureBanner: true,
		productShowcase: true,
		imageGallery: true,
		about: true,
		testimonials: true,
		cta: true,
	};
	const visibility = {
		...defaultVisibility,
		...homePage.sectionVisibility,
		// Explicitly default sections to true if not in DB
		categoryShowcase: homePage.sectionVisibility?.categoryShowcase ?? true,
		productCarousel: homePage.sectionVisibility?.productCarousel ?? true,
		promoBanner: homePage.sectionVisibility?.promoBanner ?? true,
		featureBanner: homePage.sectionVisibility?.featureBanner ?? true,
	};

	// Limit categories to configured max (default 3)
	const maxCategories = homePage.categoryShowcase?.maxCategories || 3;
	// Serialize categories to plain objects for client component
	const categoriesToShow = activeCategories.slice(0, maxCategories).map((cat) => ({
		_id: cat._id?.toString(),
		name: cat.name,
		slug: cat.slug,
		description: cat.description,
		image: cat.image ?? undefined,
		order: cat.order,
		isActive: cat.isActive,
	}));

	// Limit products to configured max (default 6)
	const maxProducts = homePage.productCarousel?.maxProducts || 6;
	// Serialize products to plain objects for client component
	const productsToShow = publishedProducts.data.slice(0, maxProducts).map((product) => {
		// Get category slug from primaryCategory or first category
		const primaryCat = product.primaryCategory as { slug?: string } | null;
		const categorySlug = primaryCat?.slug || "uncategorized";

		return {
			_id: product._id?.toString(),
			name: product.title,
			slug: product.slug,
			categorySlug,
			images: product.productImages,
			rating: 5, // Default 5 star rating for all products
			reviewCount: 0,
		};
	});

	return (
		<div className="flex flex-col min-h-screen">
			{/* Hero Section */}
			{visibility.hero && homePage.hero && <Hero data={homePage.hero} />}

			{/* Category Showcase Section - Right after Hero */}
			{visibility.categoryShowcase && categoriesToShow.length > 0 && (
				<ProductCategorySection
					badge={homePage.categoryShowcase?.badge}
					title={homePage.categoryShowcase?.title}
					categories={categoriesToShow}
				/>
			)}

			{/* Product Carousel Section - After Categories */}
			{visibility.productCarousel && productsToShow.length > 0 && (
				<ProductCarousel
					badge={homePage.productCarousel?.badge}
					title={homePage.productCarousel?.title}
					products={productsToShow}
				/>
			)}

			{/* Promo Banner Section - After Product Carousel */}
			{visibility.promoBanner && homePage.promoBanner && (
				<PromoBanner
					leftBanner={homePage.promoBanner.leftBanner}
					rightBanner={homePage.promoBanner.rightBanner}
				/>
			)}

			{/* Feature Banner Section - After Promo Banner */}
			{visibility.featureBanner && homePage.featureBanner && (
				<FeatureBanner data={homePage.featureBanner} />
			)}

			{/* Product Showcase Section */}
			{visibility.productShowcase &&
				(homePage.productShowcase?.products?.length ?? 0) > 0 && (
					<ProductShowcase data={homePage.productShowcase} />
				)}

			{/* Image Gallery */}
			{visibility.imageGallery &&
				(homePage.imageGallery?.images?.length ?? 0) > 0 && (
					<ImageGallery data={homePage.imageGallery} />
				)}

			{/* About Section */}
			{visibility.about && homePage.aboutSection && (
				<AboutSection data={homePage.aboutSection} />
			)}

			{/* Testimonials */}
			{visibility.testimonials &&
				(homePage.testimonialsSection?.testimonials?.length ?? 0) > 0 && (
					<Testimonials data={homePage.testimonialsSection} />
				)}

			{/* CTA Section */}
			{visibility.cta && homePage.ctaSection && (
				<CtaSection
					data={homePage.ctaSection}
					phone={siteSettings.phone}
					email={siteSettings.email}
				/>
			)}

			{/* Floating Contact Button - Always visible */}
			{/* <FloatingContactButton /> */}
		</div>
	);
}
