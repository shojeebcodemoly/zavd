"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useState } from "react";
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations";
import { ImageComponent } from "../common/image-component";
import { TourRequestModal } from "./TourRequestModal";
import type { IImageGallerySection } from "@/models/home-page.model";

interface ImageGalleryProps {
	data: IImageGallerySection;
}

/**
 * ImageGallery Component
 *
 * A modern, responsive image gallery with glassmorphism effects and smooth animations.
 * Features:
 * - Responsive masonry-style grid layout
 * - Glassmorphic overlay on hover
 * - Smooth entrance and hover animations
 * - SEO-optimized with semantic HTML and proper alt attributes
 * - Lazy loading for performance
 * - Keyboard accessible
 * - Empty fields are automatically hidden
 *
 * @returns {JSX.Element} The ImageGallery component
 */
export function ImageGallery({ data }: ImageGalleryProps) {
	const [isTourModalOpen, setIsTourModalOpen] = useState(false);

	// Check if badge has content
	const hasBadge = data?.badge && data.badge.trim().length > 0;
	// Check if title has content
	const hasTitle = data?.title && data.title.trim().length > 0;
	// Check if subtitle has content
	const hasSubtitle = data?.subtitle && data.subtitle.trim().length > 0;
	// Check if CTA section has content
	const hasCtaTitle = data?.ctaTitle && data.ctaTitle.trim().length > 0;
	const hasCtaSubtitle = data?.ctaSubtitle && data.ctaSubtitle.trim().length > 0;
	const hasCtaButtonText = data?.ctaButtonText && data.ctaButtonText.trim().length > 0;
	// Show CTA section only if at least title or button text exists
	const showCtaSection = hasCtaTitle || hasCtaButtonText;
	// Check if header section has any content
	const showHeader = hasBadge || hasTitle || hasSubtitle;

	return (
		<section
			className="section-padding bg-background overflow-hidden relative"
			aria-labelledby="gallery-heading"
		>
			{/* Decorative background elements */}
			<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
			<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

			<div className="_container relative z-10">
				{/* Section Header - Only show if there's content */}
				{showHeader && (
					<motion.div
						initial="initial"
						whileInView="animate"
						viewport={{ once: true, margin: "-100px" }}
						variants={staggerContainer}
						className="text-center mb-12 md:mb-16"
					>
						{hasBadge && (
							<motion.div
								variants={fadeUp}
								transition={defaultTransition}
								className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 w-fit border border-primary/20 mb-6 mx-auto"
							>
								<Eye className="h-4 w-4 text-primary" />
								<span className="text-xs font-extrabold text-primary uppercase tracking-wider">
									{data.badge}
								</span>
							</motion.div>
						)}

						{hasTitle && (
							<motion.h2
								id="gallery-heading"
								variants={fadeUp}
								transition={defaultTransition}
								className="text-4xl md:text-5xl lg:text-6xl font-medium text-secondary mb-4 tracking-tight"
							>
								{data.title}
							</motion.h2>
						)}

						{hasSubtitle && (
							<motion.p
								variants={fadeUp}
								transition={defaultTransition}
								className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium"
							>
								{data.subtitle}
							</motion.p>
						)}
					</motion.div>
				)}

				{/* Gallery Grid */}
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, margin: "-50px" }}
					variants={staggerContainer}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
				>
					{data?.images?.map((image, index) => (
						<motion.figure
							key={index}
							variants={fadeUp}
							transition={{ ...defaultTransition, delay: index * 0.1 }}
							className={`
								relative overflow-hidden rounded-2xl group cursor-pointer
								${index === 0 ? "md:col-span-2 md:row-span-2" : ""}
								${index === 0 ? "h-[400px] md:h-full" : "h-[300px]"}
							`}
						>
							{/* Image */}

							<ImageComponent
								src={image.src}
								alt={`${image.title} - ${image.subtitle}`}
								loading={index === 0 ? "eager" : "lazy"}
								height={0}
								width={0}
								sizes={
									index === 0
										? "(max-width: 768px) 100vw, 50vw"
										: "100vw"
								}
								wrapperClasses="w-full h-full"
								className="object-cover w-full h-full"
							/>

							{/* Gradient Overlay - Always visible for better text contrast */}
							<div
								className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500"
							/>

							{/* Content Overlay - Always visible */}
							<div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
								{/* Content Card */}
								<div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 md:p-5 transition-all duration-300 group-hover:bg-black/60">
									{/* Title */}
									<h3 className="text-lg md:text-xl font-medium text-white mb-1 line-clamp-2 tracking-tight">
										{image.title}
									</h3>

									{/* Subtitle */}
									<p className="text-white/80 text-sm line-clamp-2 font-medium">
										{image.subtitle}
									</p>

									{/* Decorative accent line */}
									<div className="mt-3 h-1 w-12 bg-primary rounded-full" />
								</div>
							</div>

							{/* Accessible caption for screen readers */}
							<figcaption className="sr-only">
								{image.title}: {image.subtitle}
							</figcaption>
						</motion.figure>
					))}
				</motion.div>

				{/* Bottom CTA Section - Only show if there's content */}
				{showCtaSection && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.4 }}
						className="mt-12 md:mt-16 text-center"
					>
						<div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl p-6 md:p-8 shadow-xl">
							{(hasCtaTitle || hasCtaSubtitle) && (
								<div className="flex-1 text-left">
									{hasCtaTitle && (
										<h3 className="text-lg md:text-xl font-medium text-secondary mb-2 tracking-tight">
											{data.ctaTitle}
										</h3>
									)}
									{hasCtaSubtitle && (
										<p className="text-secondary/50 text-sm md:text-base font-medium">
											{data.ctaSubtitle}
										</p>
									)}
								</div>
							)}
							{hasCtaButtonText && (
								<button
									onClick={() => setIsTourModalOpen(true)}
									className="shrink-0 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
									aria-label={data.ctaButtonText}
								>
									{data.ctaButtonText}
								</button>
							)}
						</div>
					</motion.div>
				)}
			</div>

			{/* Tour Request Modal */}
			<TourRequestModal
				open={isTourModalOpen}
				onOpenChange={setIsTourModalOpen}
			/>
		</section>
	);
}
