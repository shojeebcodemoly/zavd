"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import type { PrivacyPageData } from "@/lib/repositories/privacy-page.repository";

interface PrivacyPageClientProps {
	data: PrivacyPageData;
}

// Helper component for content sections
function ContentSection({
	section,
	isVisible,
	isEn,
}: {
	section: {
		sectionNumber?: string;
		titleDe?: string;
		titleEn?: string;
		introDe?: string;
		introEn?: string;
		items?: { titleDe?: string; titleEn?: string; descriptionDe?: string; descriptionEn?: string }[];
		outroDe?: string;
		outroEn?: string;
		highlighted?: boolean;
	};
	isVisible: boolean;
	isEn: boolean;
}) {
	if (!isVisible) return null;

	const title = (isEn ? section.titleEn : section.titleDe) || section.titleDe || section.titleEn;
	const intro = (isEn ? section.introEn : section.introDe) || section.introDe || section.introEn;
	const outro = (isEn ? section.outroEn : section.outroDe) || section.outroDe || section.outroEn;

	const hasContent = title || intro || (section.items && section.items.length > 0) || outro;
	if (!hasContent) return null;

	return (
		<section
			className={`py-8 md:py-12 ${section.highlighted ? "bg-primary/5 -mx-4 px-4 md:-mx-8 md:px-8 rounded-xl" : ""}`}
		>
			<div className="max-w-3xl">
				{section.sectionNumber && (
					<span className="text-sm font-medium text-primary mb-2 block">
						{section.sectionNumber}
					</span>
				)}
				{title && (
					<h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
						{title}
					</h2>
				)}
				{intro && (
					<p className="text-slate-600 mb-6 leading-relaxed">{intro}</p>
				)}
				{section.items && section.items.length > 0 && (
					<ul className="space-y-4 mb-6">
						{section.items.map((item, index) => {
							const itemTitle = (isEn ? item.titleEn : item.titleDe) || item.titleDe || item.titleEn;
							const itemDescription = (isEn ? item.descriptionEn : item.descriptionDe) || item.descriptionDe || item.descriptionEn;
							return (
								<li key={index} className="flex items-start gap-3">
									<span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
									<div>
										{itemTitle && (
											<strong className="text-slate-900">{itemTitle}: </strong>
										)}
										{itemDescription && (
											<span className="text-slate-600">{itemDescription}</span>
										)}
									</div>
								</li>
							);
						})}
					</ul>
				)}
				{outro && (
					<p className="text-slate-600 leading-relaxed">{outro}</p>
				)}
			</div>
		</section>
	);
}

export function PrivacyPageClient({ data }: PrivacyPageClientProps) {
	const locale = useLocale();
	const isEn = locale === "en";

	const visibility = data.sectionVisibility || {
		hero: true,
		introduction: true,
		dataCollection: true,
		purposeOfProcessing: true,
		legalBasis: true,
		dataRetention: true,
		dataSharing: true,
		yourRights: true,
		security: true,
		cookies: true,
		contact: true,
		policyChanges: true,
		cta: true,
	};

	const heroTitle = (isEn ? data.hero?.titleEn : data.hero?.titleDe) || data.hero?.titleDe || data.hero?.titleEn;
	const heroSubtitle = (isEn ? data.hero?.subtitleEn : data.hero?.subtitleDe) || data.hero?.subtitleDe || data.hero?.subtitleEn;

	const contactTitle = (isEn ? data.contact?.titleEn : data.contact?.titleDe) || data.contact?.titleDe || data.contact?.titleEn;
	const contactIntro = (isEn ? data.contact?.introEn : data.contact?.introDe) || data.contact?.introDe || data.contact?.introEn;

	const ctaText = (isEn ? data.ctaSection?.textEn : data.ctaSection?.textDe) || data.ctaSection?.textDe || data.ctaSection?.textEn;
	const primaryCtaText = (isEn ? data.ctaSection?.primaryCta?.textEn : data.ctaSection?.primaryCta?.textDe) || data.ctaSection?.primaryCta?.textDe || data.ctaSection?.primaryCta?.textEn;
	const secondaryCtaText = (isEn ? data.ctaSection?.secondaryCta?.textEn : data.ctaSection?.secondaryCta?.textDe) || data.ctaSection?.secondaryCta?.textDe || data.ctaSection?.secondaryCta?.textEn;

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			{visibility.hero && (heroTitle || heroSubtitle) && (
				<section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-28 md:pt-32 pb-16 md:pb-24">
					<div className="_container">
						<div className="max-w-3xl">
							{heroTitle && (
								<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
									{heroTitle}
								</h1>
							)}
							{heroSubtitle && (
								<p className="text-lg md:text-xl text-slate-300 mb-4">
									{heroSubtitle}
								</p>
							)}
							{data.hero?.lastUpdated && (
								<p className="text-sm text-slate-400">
									{isEn ? "Last updated" : "Zuletzt aktualisiert"}: {data.hero.lastUpdated}
								</p>
							)}
						</div>
					</div>
				</section>
			)}

			{/* Main Content */}
			<div className="_container py-12 md:py-16">
				<div className="max-w-4xl mx-auto">
					{/* Introduction */}
					<ContentSection
						section={data.introduction || {}}
						isVisible={visibility.introduction}
						isEn={isEn}
					/>

					{/* Data Collection */}
					<ContentSection
						section={data.dataCollection || {}}
						isVisible={visibility.dataCollection}
						isEn={isEn}
					/>

					{/* Purpose of Processing */}
					<ContentSection
						section={data.purposeOfProcessing || {}}
						isVisible={visibility.purposeOfProcessing}
						isEn={isEn}
					/>

					{/* Legal Basis */}
					<ContentSection
						section={data.legalBasis || {}}
						isVisible={visibility.legalBasis}
						isEn={isEn}
					/>

					{/* Data Retention */}
					<ContentSection
						section={data.dataRetention || {}}
						isVisible={visibility.dataRetention}
						isEn={isEn}
					/>

					{/* Data Sharing */}
					<ContentSection
						section={data.dataSharing || {}}
						isVisible={visibility.dataSharing}
						isEn={isEn}
					/>

					{/* Your Rights */}
					<ContentSection
						section={data.yourRights || {}}
						isVisible={visibility.yourRights}
						isEn={isEn}
					/>

					{/* Security */}
					<ContentSection
						section={data.security || {}}
						isVisible={visibility.security}
						isEn={isEn}
					/>

					{/* Cookies */}
					<ContentSection
						section={data.cookies || {}}
						isVisible={visibility.cookies}
						isEn={isEn}
					/>

					{/* Contact Section */}
					{visibility.contact && data.contact && (
						<section
							className={`py-8 md:py-12 ${data.contact.highlighted ? "bg-primary/5 -mx-4 px-4 md:-mx-8 md:px-8 rounded-xl" : ""}`}
						>
							<div className="max-w-3xl">
								{data.contact.sectionNumber && (
									<span className="text-sm font-medium text-primary mb-2 block">
										{data.contact.sectionNumber}
									</span>
								)}
								{contactTitle && (
									<h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
										{contactTitle}
									</h2>
								)}
								{contactIntro && (
									<p className="text-slate-600 mb-6 leading-relaxed">
										{contactIntro}
									</p>
								)}
								<div className="bg-slate-50 rounded-lg p-6 space-y-3">
									{data.contact.companyName && (
										<p className="font-semibold text-slate-900">
											{data.contact.companyName}
										</p>
									)}
									{data.contact.organizationNumber && (
										<p className="text-slate-600">
											{isEn ? "Org. no." : "Org.nr"}: {data.contact.organizationNumber}
										</p>
									)}
									{data.contact.email && (
										<p className="text-slate-600">
											{isEn ? "Email" : "E-Mail"}:{" "}
											<a
												href={`mailto:${data.contact.email}`}
												className="text-primary hover:underline"
											>
												{data.contact.email}
											</a>
										</p>
									)}
									{data.contact.phone && (
										<p className="text-slate-600">
											{isEn ? "Phone" : "Telefon"}:{" "}
											<a
												href={`tel:${data.contact.phone}`}
												className="text-primary hover:underline"
											>
												{data.contact.phone}
											</a>
										</p>
									)}
									{data.contact.addresses && data.contact.addresses.length > 0 && (
										<div className="text-slate-600">
											<p className="font-medium">{isEn ? "Address" : "Adresse"}:</p>
											{data.contact.addresses.map((addr, i) => (
												<p key={i}>{addr}</p>
											))}
										</div>
									)}
								</div>
							</div>
						</section>
					)}

					{/* Policy Changes */}
					<ContentSection
						section={data.policyChanges || {}}
						isVisible={visibility.policyChanges}
						isEn={isEn}
					/>

					{/* CTA Section */}
					{visibility.cta && data.ctaSection && (ctaText || primaryCtaText) && (
						<section className="py-12 md:py-16 mt-8 bg-gradient-to-r from-primary/10 to-primary/5 -mx-4 px-4 md:-mx-8 md:px-8 rounded-xl text-center">
							{ctaText && (
								<p className="text-lg text-slate-700 mb-6">
									{ctaText}
								</p>
							)}
							<div className="flex flex-wrap justify-center gap-4">
								{primaryCtaText && data.ctaSection.primaryCta?.href && (
									<Link
										href={data.ctaSection.primaryCta.href}
										className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
									>
										{primaryCtaText}
									</Link>
								)}
								{secondaryCtaText && data.ctaSection.secondaryCta?.href && (
									<Link
										href={data.ctaSection.secondaryCta.href}
										className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
									>
										{secondaryCtaText}
									</Link>
								)}
							</div>
						</section>
					)}
				</div>
			</div>
		</div>
	);
}
