"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import type { LegalPageData } from "@/lib/repositories/legal-page.repository";

interface LegalPageClientProps {
	data: LegalPageData;
}

export function LegalPageClient({ data }: LegalPageClientProps) {
	const locale = useLocale();
	const isEn = locale === "en";

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
			{visibility.hero && (data.hero?.titleDe || data.hero?.titleEn || data.hero?.subtitleDe || data.hero?.subtitleEn) && (
				<section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-28 md:pt-32 pb-16 md:pb-24">
					<div className="_container">
						<div className="max-w-3xl">
							{(isEn ? data.hero?.badgeEn : data.hero?.badgeDe) && (
								<span className="inline-block text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-4">
									{isEn ? data.hero?.badgeEn : data.hero?.badgeDe}
								</span>
							)}
							{(isEn ? data.hero?.titleEn : data.hero?.titleDe) && (
								<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
									{isEn ? data.hero?.titleEn : data.hero?.titleDe}
								</h1>
							)}
							{(isEn ? data.hero?.subtitleEn : data.hero?.subtitleDe) && (
								<p className="text-lg md:text-xl text-slate-300">
									{isEn ? data.hero?.subtitleEn : data.hero?.subtitleDe}
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
								{data.legalCards.map((card, index) => {
									const cardTitle = isEn ? card.titleEn : card.titleDe;
									const cardDescription = isEn ? card.descriptionEn : card.descriptionDe;
									const cardHighlights = isEn ? card.highlightsEn : card.highlightsDe;
									return (
										<div key={index} className="border border-slate-200 rounded-xl p-6 space-y-3">
											{cardTitle && (
												<h3 className="text-lg font-bold text-slate-900">{cardTitle}</h3>
											)}
											{cardDescription && (
												<p className="text-slate-600 text-sm leading-relaxed">{cardDescription}</p>
											)}
											{cardHighlights && cardHighlights.length > 0 && (
												<ul className="space-y-1">
													{cardHighlights.map((h, i) => (
														<li key={i} className="flex items-center gap-2 text-sm text-slate-600">
															<span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
															{h}
														</li>
													))}
												</ul>
											)}
											{card.href && cardTitle && (
												<Link href={card.href} className="text-sm text-primary hover:underline font-medium">
													{cardTitle} &rarr;
												</Link>
											)}
										</div>
									);
								})}
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
									<p><span className="font-medium text-slate-800">{isEn ? "Registered Seat:" : "Sitz:"}</span> {data.companyInfo.registeredSeat}</p>
								)}
								{data.companyInfo.email && (
									<p>
										<span className="font-medium text-slate-800">{isEn ? "Email:" : "E-Mail:"}</span>{" "}
										<a href={`mailto:${data.companyInfo.email}`} className="text-primary hover:underline">
											{data.companyInfo.email}
										</a>
									</p>
								)}
								{data.companyInfo.phone && (
									<p>
										<span className="font-medium text-slate-800">{isEn ? "Phone:" : "Telefon:"}</span>{" "}
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
					{visibility.terms && data.termsSection && ((isEn ? data.termsSection.titleEn : data.termsSection.titleDe) || (data.termsSection.terms && data.termsSection.terms.length > 0)) && (
						<section>
							{(isEn ? data.termsSection.titleEn : data.termsSection.titleDe) && (
								<h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">{isEn ? data.termsSection.titleEn : data.termsSection.titleDe}</h2>
							)}
							{data.termsSection.terms && data.termsSection.terms.length > 0 && (
								<div className="space-y-6">
									{data.termsSection.terms.map((term, index) => {
										const termTitle = isEn ? term.titleEn : term.titleDe;
										const termContent = isEn ? term.contentEn : term.contentDe;
										return (
											<div key={index} className="border-l-2 border-primary/30 pl-5">
												{termTitle && (
													<h3 className="font-semibold text-slate-900 mb-2">{termTitle}</h3>
												)}
												{termContent && (
													<p className="text-slate-600 text-sm leading-relaxed">{termContent}</p>
												)}
											</div>
										);
									})}
								</div>
							)}
						</section>
					)}

					{/* GDPR Rights Section */}
					{visibility.gdprRights && data.gdprSection && ((isEn ? data.gdprSection.titleEn : data.gdprSection.titleDe) || (data.gdprSection.rights && data.gdprSection.rights.length > 0)) && (
						<section>
							{(isEn ? data.gdprSection.titleEn : data.gdprSection.titleDe) && (
								<h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">{isEn ? data.gdprSection.titleEn : data.gdprSection.titleDe}</h2>
							)}
							{data.gdprSection.rights && data.gdprSection.rights.length > 0 && (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{data.gdprSection.rights.map((right, index) => {
										const rightTitle = isEn ? right.titleEn : right.titleDe;
										const rightDescription = isEn ? right.descriptionEn : right.descriptionDe;
										return (
											<div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
												<span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
												<div>
													{rightTitle && <p className="font-medium text-slate-900 text-sm">{rightTitle}</p>}
													{rightDescription && <p className="text-slate-600 text-sm mt-1">{rightDescription}</p>}
												</div>
											</div>
										);
									})}
								</div>
							)}
							{((isEn ? data.gdprSection.primaryCta?.textEn : data.gdprSection.primaryCta?.textDe) || (isEn ? data.gdprSection.secondaryCta?.textEn : data.gdprSection.secondaryCta?.textDe)) && (
								<div className="flex flex-wrap gap-4 mt-6">
									{(isEn ? data.gdprSection.primaryCta?.textEn : data.gdprSection.primaryCta?.textDe) && data.gdprSection.primaryCta?.href && (
										<Link href={data.gdprSection.primaryCta.href} className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm">
											{isEn ? data.gdprSection.primaryCta.textEn : data.gdprSection.primaryCta.textDe}
										</Link>
									)}
									{(isEn ? data.gdprSection.secondaryCta?.textEn : data.gdprSection.secondaryCta?.textDe) && data.gdprSection.secondaryCta?.href && (
										<Link href={data.gdprSection.secondaryCta.href} className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
											{isEn ? data.gdprSection.secondaryCta.textEn : data.gdprSection.secondaryCta.textDe}
										</Link>
									)}
								</div>
							)}
						</section>
					)}

					{/* CTA Section */}
					{visibility.cta && data.ctaSection && ((isEn ? data.ctaSection.textEn : data.ctaSection.textDe) || (isEn ? data.ctaSection.primaryCta?.textEn : data.ctaSection.primaryCta?.textDe)) && (
						<section className="py-12 bg-gradient-to-r from-primary/10 to-primary/5 -mx-4 px-4 md:-mx-8 md:px-8 rounded-xl text-center">
							{(isEn ? data.ctaSection.textEn : data.ctaSection.textDe) && (
								<p className="text-lg text-slate-700 mb-6">{isEn ? data.ctaSection.textEn : data.ctaSection.textDe}</p>
							)}
							<div className="flex flex-wrap justify-center gap-4">
								{(isEn ? data.ctaSection.primaryCta?.textEn : data.ctaSection.primaryCta?.textDe) && data.ctaSection.primaryCta?.href && (
									<Link href={data.ctaSection.primaryCta.href} className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
										{isEn ? data.ctaSection.primaryCta.textEn : data.ctaSection.primaryCta.textDe}
									</Link>
								)}
								{(isEn ? data.ctaSection.secondaryCta?.textEn : data.ctaSection.secondaryCta?.textDe) && data.ctaSection.secondaryCta?.href && (
									<Link href={data.ctaSection.secondaryCta.href} className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
										{isEn ? data.ctaSection.secondaryCta.textEn : data.ctaSection.secondaryCta.textDe}
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
