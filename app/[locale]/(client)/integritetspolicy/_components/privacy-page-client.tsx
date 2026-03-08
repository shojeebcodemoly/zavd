"use client";

import Link from "next/link";
import type { PrivacyPageData } from "@/lib/repositories/privacy-page.repository";

interface PrivacyPageClientProps {
	data: PrivacyPageData;
}

// Helper component for content sections
function ContentSection({
	section,
	isVisible,
}: {
	section: {
		sectionNumber?: string;
		title?: string;
		intro?: string;
		items?: { title?: string; description?: string }[];
		outro?: string;
		highlighted?: boolean;
	};
	isVisible: boolean;
}) {
	if (!isVisible) return null;

	const hasContent = section.title || section.intro || (section.items && section.items.length > 0) || section.outro;
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
				{section.title && (
					<h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
						{section.title}
					</h2>
				)}
				{section.intro && (
					<p className="text-slate-600 mb-6 leading-relaxed">{section.intro}</p>
				)}
				{section.items && section.items.length > 0 && (
					<ul className="space-y-4 mb-6">
						{section.items.map((item, index) => (
							<li key={index} className="flex items-start gap-3">
								<span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
								<div>
									{item.title && (
										<strong className="text-slate-900">{item.title}: </strong>
									)}
									{item.description && (
										<span className="text-slate-600">{item.description}</span>
									)}
								</div>
							</li>
						))}
					</ul>
				)}
				{section.outro && (
					<p className="text-slate-600 leading-relaxed">{section.outro}</p>
				)}
			</div>
		</section>
	);
}

export function PrivacyPageClient({ data }: PrivacyPageClientProps) {
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

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			{visibility.hero && (data.hero?.title || data.hero?.subtitle) && (
				<section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-28 md:pt-32 pb-16 md:pb-24">
					<div className="_container">
						<div className="max-w-3xl">
							{data.hero?.title && (
								<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
									{data.hero.title}
								</h1>
							)}
							{data.hero?.subtitle && (
								<p className="text-lg md:text-xl text-slate-300 mb-4">
									{data.hero.subtitle}
								</p>
							)}
							{data.hero?.lastUpdated && (
								<p className="text-sm text-slate-400">
									Senast uppdaterad: {data.hero.lastUpdated}
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
					/>

					{/* Data Collection */}
					<ContentSection
						section={data.dataCollection || {}}
						isVisible={visibility.dataCollection}
					/>

					{/* Purpose of Processing */}
					<ContentSection
						section={data.purposeOfProcessing || {}}
						isVisible={visibility.purposeOfProcessing}
					/>

					{/* Legal Basis */}
					<ContentSection
						section={data.legalBasis || {}}
						isVisible={visibility.legalBasis}
					/>

					{/* Data Retention */}
					<ContentSection
						section={data.dataRetention || {}}
						isVisible={visibility.dataRetention}
					/>

					{/* Data Sharing */}
					<ContentSection
						section={data.dataSharing || {}}
						isVisible={visibility.dataSharing}
					/>

					{/* Your Rights */}
					<ContentSection
						section={data.yourRights || {}}
						isVisible={visibility.yourRights}
					/>

					{/* Security */}
					<ContentSection
						section={data.security || {}}
						isVisible={visibility.security}
					/>

					{/* Cookies */}
					<ContentSection
						section={data.cookies || {}}
						isVisible={visibility.cookies}
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
								{data.contact.title && (
									<h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
										{data.contact.title}
									</h2>
								)}
								{data.contact.intro && (
									<p className="text-slate-600 mb-6 leading-relaxed">
										{data.contact.intro}
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
											Org.nr: {data.contact.organizationNumber}
										</p>
									)}
									{data.contact.email && (
										<p className="text-slate-600">
											E-post:{" "}
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
											Telefon:{" "}
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
											<p className="font-medium">Adress:</p>
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
					/>

					{/* CTA Section */}
					{visibility.cta && data.ctaSection && (data.ctaSection.text || data.ctaSection.primaryCta?.text) && (
						<section className="py-12 md:py-16 mt-8 bg-gradient-to-r from-primary/10 to-primary/5 -mx-4 px-4 md:-mx-8 md:px-8 rounded-xl text-center">
							{data.ctaSection.text && (
								<p className="text-lg text-slate-700 mb-6">
									{data.ctaSection.text}
								</p>
							)}
							<div className="flex flex-wrap justify-center gap-4">
								{data.ctaSection.primaryCta?.text && data.ctaSection.primaryCta?.href && (
									<Link
										href={data.ctaSection.primaryCta.href}
										className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
									>
										{data.ctaSection.primaryCta.text}
									</Link>
								)}
								{data.ctaSection.secondaryCta?.text && data.ctaSection.secondaryCta?.href && (
									<Link
										href={data.ctaSection.secondaryCta.href}
										className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
									>
										{data.ctaSection.secondaryCta.text}
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
