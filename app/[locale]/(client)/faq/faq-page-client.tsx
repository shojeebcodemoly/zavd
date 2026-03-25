"use client";

import { FAQHeroClient } from "./_components/faq-hero-client";
import { FAQAccordionClient } from "./_components/faq-accordion-client";
import { FAQSidebarClient } from "./_components/faq-sidebar-client";
import { FAQNewsletterClient } from "./_components/faq-newsletter-client";
import type { FAQPageData } from "@/lib/repositories/faq-page.repository";

interface FAQPageClientProps {
	data: FAQPageData;
	isEn?: boolean;
}

export function FAQPageClient({ data, isEn = false }: FAQPageClientProps) {
	const visibility = data.sectionVisibility || {
		hero: true,
		faqContent: true,
		sidebar: true,
		newsletter: true,
	};

	// Check if we have content
	const hasHero =
		(isEn ? data.hero?.badgeEn : data.hero?.badgeDe) ||
		(isEn ? data.hero?.titleEn : data.hero?.titleDe) ||
		(isEn ? data.hero?.titleHighlightEn : data.hero?.titleHighlightDe) ||
		(isEn ? data.hero?.subtitleEn : data.hero?.subtitleDe) ||
		(data.hero?.stats && data.hero.stats.filter((s) => s.value).length > 0);

	const hasFaqContent =
		data.faqContent?.items &&
		data.faqContent.items.filter((i) =>
			isEn ? i.questionEn : i.questionDe
		).length > 0;

	const hasSidebar =
		(isEn ? data.sidebar?.contactTitleEn : data.sidebar?.contactTitleDe) ||
		data.sidebar?.phone ||
		data.sidebar?.email ||
		(data.sidebar?.quickLinks &&
			data.sidebar.quickLinks.filter((l) =>
				isEn ? l.labelEn : l.labelDe
			).length > 0) ||
		(data.sidebar?.offices &&
			data.sidebar.offices.filter((o) => o.name).length > 0);

	const hasNewsletter =
		(isEn ? data.newsletter?.titleEn : data.newsletter?.titleDe) ||
		(isEn ? data.newsletter?.subtitleEn : data.newsletter?.subtitleDe);

	// Get valid FAQ items
	const faqItems = (data.faqContent?.items || [])
		.filter((i) => (isEn ? i.questionEn : i.questionDe))
		.sort((a, b) => (a.order || 0) - (b.order || 0));

	return (
		<div className="min-h-screen bg-muted">
			{/* Hero Section */}
			{visibility.hero && hasHero && (
				<FAQHeroClient data={data.hero} isEn={isEn} />
			)}

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
										isEn={isEn}
										searchPlaceholder={
											isEn
												? data.faqContent?.searchPlaceholderEn
												: data.faqContent?.searchPlaceholderDe
										}
										noResultsText={
											isEn
												? data.faqContent?.noResultsTextEn
												: data.faqContent?.noResultsTextDe
										}
										helpText={
											isEn
												? data.faqContent?.helpTextEn
												: data.faqContent?.helpTextDe
										}
										helpButtonText={
											isEn
												? data.faqContent?.helpButtonTextEn
												: data.faqContent?.helpButtonTextDe
										}
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
										<FAQSidebarClient data={data.sidebar} isEn={isEn} />
									</div>
								</div>
							)}
						</div>
					</div>
				</section>
			) : null}

			{/* Newsletter Section */}
			{visibility.newsletter && hasNewsletter && (
				<FAQNewsletterClient data={data.newsletter} isEn={isEn} />
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
								name: isEn
									? faq.questionEn || faq.questionDe
									: faq.questionDe || faq.questionEn,
								acceptedAnswer: {
									"@type": "Answer",
									text: isEn
										? faq.answerEn || faq.answerDe
										: faq.answerDe || faq.answerEn,
								},
							})),
						}),
					}}
				/>
			)}
		</div>
	);
}
