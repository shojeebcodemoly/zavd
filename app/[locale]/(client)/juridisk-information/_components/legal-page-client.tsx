"use client";

import Link from "next/link";
import type { LegalPageData } from "@/lib/repositories/legal-page.repository";

interface LegalPageClientProps {
	data: LegalPageData;
}

export function LegalPageClient({ data }: LegalPageClientProps) {
	const visibility = data.sectionVisibility || {
		hero: true,
		legalCards: true,
		companyInfo: true,
		terms: true,
		gdprRights: true,
		cta: true,
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			{visibility.hero && (data.hero?.title || data.hero?.subtitle) && (
				<section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-28 md:pt-32 pb-16 md:pb-24">
					<div className="_container">
						<div className="max-w-3xl">
							{data.hero?.badge && (
								<span className="inline-block text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-4">
									{data.hero.badge}
								</span>
							)}
							{data.hero?.title && (
								<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
									{data.hero.title}
								</h1>
							)}
							{data.hero?.subtitle && (
								<p className="text-lg md:text-xl text-slate-300">
									{data.hero.subtitle}
								</p>
							)}
						</div>
					</div>
				</section>
			)}

			<div className="_container py-12 md:py-16">
				<div className="max-w-4xl mx-auto space-y-12">

					{/* Legal Cards */}
					{visibility.legalCards && data.legalCards && data.legalCards.length > 0 && (
						<section>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								{data.legalCards.map((card, index) => (
									<div key={index} className="border border-slate-200 rounded-xl p-6 space-y-3">
										{card.title && (
											<h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
										)}
										{card.description && (
											<p className="text-slate-600 text-sm leading-relaxed">{card.description}</p>
										)}
										{card.highlights && card.highlights.length > 0 && (
											<ul className="space-y-1">
												{card.highlights.map((h, i) => (
													<li key={i} className="flex items-center gap-2 text-sm text-slate-600">
														<span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
														{h}
													</li>
												))}
											</ul>
										)}
										{card.href && card.title && (
											<Link href={card.href} className="text-sm text-primary hover:underline font-medium">
												{card.title} &rarr;
											</Link>
										)}
									</div>
								))}
							</div>
						</section>
					)}

					{/* Company Info */}
					{visibility.companyInfo && data.companyInfo && (
						<section className="bg-slate-50 rounded-xl p-8">
							{data.companyInfo.companyName && (
								<h2 className="text-2xl font-bold text-slate-900 mb-6">{data.companyInfo.companyName}</h2>
							)}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
								{data.companyInfo.organizationNumber && (
									<p><span className="font-medium text-slate-800">Org.nr:</span> {data.companyInfo.organizationNumber}</p>
								)}
								{data.companyInfo.vatNumber && (
									<p><span className="font-medium text-slate-800">VAT:</span> {data.companyInfo.vatNumber}</p>
								)}
								{data.companyInfo.registeredSeat && (
									<p><span className="font-medium text-slate-800">Säte:</span> {data.companyInfo.registeredSeat}</p>
								)}
								{data.companyInfo.email && (
									<p>
										<span className="font-medium text-slate-800">E-post:</span>{" "}
										<a href={`mailto:${data.companyInfo.email}`} className="text-primary hover:underline">
											{data.companyInfo.email}
										</a>
									</p>
								)}
								{data.companyInfo.phone && (
									<p>
										<span className="font-medium text-slate-800">Telefon:</span>{" "}
										<a href={`tel:${data.companyInfo.phone}`} className="text-primary hover:underline">
											{data.companyInfo.phone}
										</a>
									</p>
								)}
							</div>
							{data.companyInfo.offices && data.companyInfo.offices.length > 0 && (
								<div className="mt-4 space-y-2">
									{data.companyInfo.offices.map((office, i) => (
										<div key={i} className="text-sm text-slate-600">
											{office.name && <span className="font-medium text-slate-800">{office.name}: </span>}
											{office.address}
										</div>
									))}
								</div>
							)}
						</section>
					)}

					{/* Terms Section */}
					{visibility.terms && data.termsSection && (data.termsSection.title || (data.termsSection.terms && data.termsSection.terms.length > 0)) && (
						<section>
							{data.termsSection.title && (
								<h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">{data.termsSection.title}</h2>
							)}
							{data.termsSection.terms && data.termsSection.terms.length > 0 && (
								<div className="space-y-6">
									{data.termsSection.terms.map((term, index) => (
										<div key={index} className="border-l-2 border-primary/30 pl-5">
											{term.title && (
												<h3 className="font-semibold text-slate-900 mb-2">{term.title}</h3>
											)}
											{term.content && (
												<p className="text-slate-600 text-sm leading-relaxed">{term.content}</p>
											)}
										</div>
									))}
								</div>
							)}
						</section>
					)}

					{/* GDPR Rights Section */}
					{visibility.gdprRights && data.gdprSection && (data.gdprSection.title || (data.gdprSection.rights && data.gdprSection.rights.length > 0)) && (
						<section>
							{data.gdprSection.title && (
								<h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">{data.gdprSection.title}</h2>
							)}
							{data.gdprSection.rights && data.gdprSection.rights.length > 0 && (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{data.gdprSection.rights.map((right, index) => (
										<div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
											<span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
											<div>
												{right.title && <p className="font-medium text-slate-900 text-sm">{right.title}</p>}
												{right.description && <p className="text-slate-600 text-sm mt-1">{right.description}</p>}
											</div>
										</div>
									))}
								</div>
							)}
							{(data.gdprSection.primaryCta?.text || data.gdprSection.secondaryCta?.text) && (
								<div className="flex flex-wrap gap-4 mt-6">
									{data.gdprSection.primaryCta?.text && data.gdprSection.primaryCta?.href && (
										<Link href={data.gdprSection.primaryCta.href} className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm">
											{data.gdprSection.primaryCta.text}
										</Link>
									)}
									{data.gdprSection.secondaryCta?.text && data.gdprSection.secondaryCta?.href && (
										<Link href={data.gdprSection.secondaryCta.href} className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
											{data.gdprSection.secondaryCta.text}
										</Link>
									)}
								</div>
							)}
						</section>
					)}

					{/* CTA Section */}
					{visibility.cta && data.ctaSection && (data.ctaSection.text || data.ctaSection.primaryCta?.text) && (
						<section className="py-12 bg-gradient-to-r from-primary/10 to-primary/5 -mx-4 px-4 md:-mx-8 md:px-8 rounded-xl text-center">
							{data.ctaSection.text && (
								<p className="text-lg text-slate-700 mb-6">{data.ctaSection.text}</p>
							)}
							<div className="flex flex-wrap justify-center gap-4">
								{data.ctaSection.primaryCta?.text && data.ctaSection.primaryCta?.href && (
									<Link href={data.ctaSection.primaryCta.href} className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
										{data.ctaSection.primaryCta.text}
									</Link>
								)}
								{data.ctaSection.secondaryCta?.text && data.ctaSection.secondaryCta?.href && (
									<Link href={data.ctaSection.secondaryCta.href} className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
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
