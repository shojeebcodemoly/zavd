"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ImageComponent } from "../common/image-component";
import type { IIntroSection } from "@/models/home-page.model";

interface IntroSectionProps {
	data: IIntroSection;
	isEn?: boolean;
}

export function IntroSection({ data, isEn }: IntroSectionProps) {
	const badge = (isEn ? data?.badgeEn : data?.badgeDe) || data?.badgeDe || data?.badgeEn;
	const title = (isEn ? data?.titleEn : data?.titleDe) || data?.titleDe || data?.titleEn;
	const subtitle = (isEn ? data?.subtitleEn : data?.subtitleDe) || data?.subtitleDe || data?.subtitleEn;
	const description = (isEn ? data?.descriptionEn : data?.descriptionDe) || data?.descriptionDe || data?.descriptionEn;
	const ctaText = (isEn ? data?.ctaTextEn : data?.ctaTextDe) || data?.ctaTextDe || data?.ctaTextEn;

	const hasContent = badge || title || subtitle || description || ctaText;

	if (!hasContent && !data?.image) return null;

	const hasPartners = data?.partnerLogos && data.partnerLogos.length > 0;

	return (
		<section className="bg-white py-16 md:py-24">
			<div className="_container">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					{/* Left: text content */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.55 }}
						className="flex flex-col"
					>
						{/* Badge */}
						{badge && (
							<div className="flex items-center gap-2 mb-5">
								<span className="w-8 h-[2px] bg-primary block" />
								<span className="text-primary text-sm font-semibold tracking-widest uppercase">
									{badge}
								</span>
							</div>
						)}

						{/* Title */}
						{title && (
							<h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
								{title}
							</h2>
						)}

						{/* Subtitle */}
						{subtitle && (
							<p className="text-lg font-semibold text-gray-700 mb-4 leading-snug">
								{subtitle}
							</p>
						)}

						{/* Divider accent */}
						<div className="w-12 h-1 bg-primary rounded-full mb-6" />

						{/* Description */}
						{description && (
							<p className="text-gray-500 text-base leading-relaxed mb-8">
								{description}
							</p>
						)}

						{/* CTA */}
						{ctaText && data?.ctaHref && (
							<Link
								href={data.ctaHref}
								className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-fit mb-10"
							>
								{ctaText}
								<ArrowRight className="w-4 h-4" />
							</Link>
						)}

						{/* Partner Logos */}
						{hasPartners && (
							<div className="border-t border-gray-100 pt-8">
								<p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
									Partner
								</p>
								<div className="flex flex-wrap items-center gap-8">
									{data.partnerLogos!.map((partner, i) => (
										<motion.div
											key={i}
											initial={{ opacity: 0, y: 8 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true }}
											transition={{ duration: 0.4, delay: i * 0.1 }}
											className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
										>
											{partner.href ? (
												<Link
													href={partner.href}
													target="_blank"
													rel="noopener noreferrer"
													className="block"
												>
													{partner.image ? (
														<div className="flex items-center justify-center h-10 w-24 overflow-hidden">
															<ImageComponent
																src={partner.image}
																alt={partner.name ?? "Partner"}
																width={96}
																height={40}
																className="object-contain max-h-10 w-auto"
																showLoader={false}
															/>
														</div>
													) : (
														partner.name && (
															<span className="text-sm font-semibold text-gray-600">
																{partner.name}
															</span>
														)
													)}
												</Link>
											) : (
												<>
													{partner.image ? (
														<div className="flex items-center justify-center h-10 w-24 overflow-hidden">
															<ImageComponent
																src={partner.image}
																alt={partner.name ?? "Partner"}
																width={96}
																height={40}
																className="object-contain max-h-10 w-auto"
																showLoader={false}
															/>
														</div>
													) : (
														partner.name && (
															<span className="text-sm font-semibold text-gray-600">
																{partner.name}
															</span>
														)
													)}
												</>
											)}
										</motion.div>
									))}
								</div>
							</div>
						)}
					</motion.div>

					{/* Right: main image */}
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.55, delay: 0.15 }}
						className="relative flex items-center justify-center"
					>
						{data?.image ? (
							<div className="relative w-full max-w-md mx-auto">
								{/* Decorative blob behind image */}
								<div className="absolute inset-0 bg-gray-50 rounded-3xl -rotate-3 scale-105" />
								<div className="relative rounded-3xl overflow-hidden bg-white shadow-md p-8 min-h-[320px] flex items-center justify-center">
									<div className="relative w-full h-72">
										<ImageComponent
											src={data.image}
											alt={title ?? ""}
											fill
											className="object-contain"
										/>
									</div>
								</div>
							</div>
						) : (
							<div className="w-full max-w-md mx-auto h-72 bg-gray-100 rounded-3xl" />
						)}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
