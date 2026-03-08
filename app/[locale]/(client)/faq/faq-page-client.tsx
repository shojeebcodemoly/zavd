"use client";

import { FAQHeroClient } from "./_components/faq-hero-client";
import { FAQAccordionClient } from "./_components/faq-accordion-client";
import { FAQSidebarClient } from "./_components/faq-sidebar-client";
import { FAQNewsletterClient } from "./_components/faq-newsletter-client";
import type { FAQPageData } from "@/lib/repositories/faq-page.repository";

interface FAQPageClientProps {
	data: FAQPageData;
}

export function FAQPageClient({ data }: FAQPageClientProps) {
	const visibility = data.sectionVisibility || {
		hero: true,
		faqContent: true,
		sidebar: true,
		newsletter: true,
	};

	// Check if we have content
	const hasHero =
		data.hero?.badge ||
		data.hero?.title ||
		data.hero?.titleHighlight ||
		data.hero?.subtitle ||
		(data.hero?.stats && data.hero.stats.filter((s) => s.value).length > 0);

	const hasFaqContent =
		data.faqContent?.items &&
		data.faqContent.items.filter((i) => i.question).length > 0;

	const hasSidebar =
		data.sidebar?.contactTitle ||
		data.sidebar?.phone ||
		data.sidebar?.email ||
		(data.sidebar?.quickLinks &&
			data.sidebar.quickLinks.filter((l) => l.label).length > 0) ||
		(data.sidebar?.offices &&
			data.sidebar.offices.filter((o) => o.name).length > 0);

	const hasNewsletter =
		data.newsletter?.title || data.newsletter?.subtitle;

	// Get valid FAQ items
	const faqItems = (data.faqContent?.items || [])
		.filter((i) => i.question)
		.sort((a, b) => (a.order || 0) - (b.order || 0));

	return (
		<div className="min-h-screen bg-muted">
			{/* Hero Section */}
			{visibility.hero && hasHero && <FAQHeroClient data={data.hero} />}

			{/* Main Content Section */}
			{(visibility.faqContent && hasFaqContent) ||
			(visibility.sidebar && hasSidebar) ? (
				<section className="py-16 md:py-24">
					<div className="_container">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
							{/* FAQ Accordion - Main Content */}
							{visibility.faqContent && hasFaqContent && (
								<div className="lg:col-span-2 order-2 lg:order-1">
									<FAQAccordionClient
										items={faqItems}
										searchPlaceholder={data.faqContent?.searchPlaceholder}
										noResultsText={data.faqContent?.noResultsText}
										helpText={data.faqContent?.helpText}
										helpButtonText={data.faqContent?.helpButtonText}
										helpButtonHref={data.faqContent?.helpButtonHref}
									/>
								</div>
							)}

							{/* Sidebar */}
							{visibility.sidebar && hasSidebar && (
								<div
									className={`lg:col-span-1 order-1 lg:order-2 ${
										!visibility.faqContent || !hasFaqContent
											? "lg:col-span-3"
											: ""
									}`}
								>
									<div className="lg:sticky lg:top-24">
										<FAQSidebarClient data={data.sidebar} />
									</div>
								</div>
							)}
						</div>
					</div>
				</section>
			) : null}

			{/* Newsletter Section */}
			{visibility.newsletter && hasNewsletter && (
				<FAQNewsletterClient data={data.newsletter} />
			)}

			{/* Structured Data for SEO */}
			{faqItems.length > 0 && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "FAQPage",
							mainEntity: faqItems.map((faq) => ({
								"@type": "Question",
								name: faq.question,
								acceptedAnswer: {
									"@type": "Answer",
									text: faq.answer,
								},
							})),
						}),
					}}
				/>
			)}
		</div>
	);
}
