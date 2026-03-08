"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface BannerData {
	badge?: string;
	title?: string;
	subtitle?: string;
	description?: string;
	image?: string;
	ctaText?: string;
	ctaHref?: string;
}

interface PromoBannerProps {
	leftBanner?: BannerData;
	rightBanner?: BannerData;
}

export function PromoBanner({ leftBanner, rightBanner }: PromoBannerProps) {
	// Check if banner has any actual content
	const hasContent = (banner?: BannerData) => {
		if (!banner) return false;
		return banner.title || banner.badge || banner.description || banner.image;
	};

	// Don't render if no banners have content
	if (!hasContent(leftBanner) && !hasContent(rightBanner)) return null;

	return (
		<section className="section-padding bg-white">
			<div className="_container">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
					{/* Left Banner - Image with text overlay (1/3 width) */}
					{hasContent(leftBanner) && leftBanner && (
						<motion.div
							className="relative aspect-square md:aspect-auto md:h-[500px] rounded-xl overflow-hidden group md:col-span-1"
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
						>
							{/* Background Image */}
							{leftBanner.image ? (
								<Image
									src={leftBanner.image}
									alt={leftBanner.title || "Banner"}
									fill
									className="object-cover transition-transform duration-700 group-hover:scale-105"
									sizes="(max-width: 768px) 100vw, 50vw"
								/>
							) : (
								<div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-400" />
							)}

							{/* Content Overlay */}
							<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

							{/* Text Content */}
							<div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
								{leftBanner.badge && (
									<span className="text-sm md:text-base tracking-[0.3em] uppercase text-primary mb-4">
										{leftBanner.badge}
									</span>
								)}
								{leftBanner.title && (
									<h3 className="text-3xl md:text-4xl lg:text-5xl font-heading text-white leading-tight mb-4">
										{leftBanner.title}
									</h3>
								)}
								{leftBanner.description && (
									<p className="text-base md:text-lg text-white/80 max-w-md leading-relaxed">
										{leftBanner.description}
									</p>
								)}
							</div>
						</motion.div>
					)}

					{/* Right Banner - Award/Feature style with CTA (2/3 width) */}
					{hasContent(rightBanner) && rightBanner && (
						<motion.div
							className="relative aspect-square md:aspect-auto md:h-[500px] rounded-xl overflow-hidden group md:col-span-2"
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
						>
							{/* Background Image */}
							{rightBanner.image ? (
								<Image
									src={rightBanner.image}
									alt={rightBanner.title || "Banner"}
									fill
									className="object-cover transition-transform duration-700 group-hover:scale-105"
									sizes="(max-width: 768px) 100vw, 50vw"
								/>
							) : (
								<div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondary/80" />
							)}

							{/* Content Overlay */}
							<div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

							{/* Text Content - Left Aligned */}
							<div className="absolute inset-0 p-6 md:p-8 flex flex-col items-start justify-center text-left">
								{rightBanner.badge && (
									<span className="text-sm md:text-base tracking-[0.3em] uppercase text-primary mb-4">
										{rightBanner.badge}
									</span>
								)}
								{rightBanner.subtitle && (
									<span className="text-3xl md:text-4xl lg:text-5xl font-heading text-white leading-tight mb-2">
										{rightBanner.subtitle}
									</span>
								)}
								{rightBanner.title && (
									<h3 className="text-base md:text-lg text-white/80 leading-relaxed mb-6">
										{rightBanner.title}
									</h3>
								)}
								{rightBanner.ctaText && rightBanner.ctaHref && (
									<Link
										href={rightBanner.ctaHref}
										className="inline-block px-8 py-3 bg-primary text-secondary font-semibold text-sm uppercase tracking-wider rounded-full hover:bg-primary/90 transition-colors"
									>
										{rightBanner.ctaText}
									</Link>
								)}
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</section>
	);
}
