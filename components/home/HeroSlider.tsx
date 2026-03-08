"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageComponent } from "../common/image-component";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import type { IHeroSection } from "@/models/home-page.model";

interface HeroSliderProps {
	data: IHeroSection;
}

export function HeroSlider({ data }: HeroSliderProps) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	// Filter active slides
	const slides = (data.slides || []).filter((slide) => slide.isActive !== false);
	const autoPlayInterval = data.autoPlayInterval || 5000;
	const showArrows = data.showArrows !== false; // Default to true

	// Set navbar variant for dark hero
	useSetNavbarVariant("dark-hero");

	// Auto-play functionality
	useEffect(() => {
		if (!isAutoPlaying || slides.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, autoPlayInterval);

		return () => clearInterval(interval);
	}, [isAutoPlaying, slides.length, autoPlayInterval]);

	// Go to specific slide
	const goToSlide = useCallback((index: number) => {
		setCurrentSlide(index);
		setIsAutoPlaying(false);
		// Resume auto-play after 10 seconds of inactivity
		setTimeout(() => setIsAutoPlaying(true), 10000);
	}, []);

	// Go to previous slide
	const goToPrevSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	}, [slides.length]);

	// Go to next slide
	const goToNextSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	}, [slides.length]);

	// If no slides, don't render
	if (slides.length === 0) return null;

	const activeSlide = slides[currentSlide];

	return (
		<section className="relative w-full h-screen overflow-hidden bg-black">
			{/* Background Slides */}
			<AnimatePresence mode="wait">
				<motion.div
					key={currentSlide}
					initial={{ opacity: 0, scale: 1.1 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1, ease: "easeInOut" }}
					className="absolute inset-0"
				>
					{activeSlide.backgroundImage && (
						<ImageComponent
							src={activeSlide.backgroundImage}
							alt={activeSlide.title || "Hero background"}
							height={0}
							width={0}
							sizes="100vw"
							wrapperClasses="w-full h-full"
							className="object-cover w-full h-full"
							priority
						/>
					)}
					{/* Dark overlay for better text readability */}
					<div className="absolute inset-0 bg-black/40" />
				</motion.div>
			</AnimatePresence>

			{/* Content */}
			<div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
				<AnimatePresence mode="wait">
					<motion.div
						key={`content-${currentSlide}`}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -30 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="max-w-4xl mx-auto"
					>
						{/* Badge */}
						{activeSlide.badge && (
							<motion.span
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.4 }}
								className="inline-block text-sm md:text-base tracking-[0.3em] uppercase text-primary mb-6"
							>
								{activeSlide.badge}
							</motion.span>
						)}

						{/* Title */}
						{activeSlide.title && (
							<motion.h1
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.5 }}
								className="font-heading text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
							>
								{activeSlide.title}
							</motion.h1>
						)}

						{/* Subtitle */}
						{activeSlide.subtitle && (
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.6 }}
								className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed"
							>
								{activeSlide.subtitle}
							</motion.p>
						)}

						{/* CTA Button */}
						{activeSlide.ctaText && activeSlide.ctaHref && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.7 }}
							>
								<Link
									href={activeSlide.ctaHref}
									className="inline-block px-8 py-3 border-2 border-primary bg-primary/10 text-white hover:bg-primary hover:text-white transition-all duration-300 tracking-widest text-sm uppercase rounded-full"
								>
									{activeSlide.ctaText}
								</Link>
							</motion.div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Navigation Arrows */}
			{showArrows && slides.length > 1 && (
				<>
					{/* Previous Arrow */}
					<button
						onClick={goToPrevSlide}
						className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 group"
						aria-label="Previous slide"
					>
						<ChevronLeft className="w-6 h-6 md:w-7 md:h-7 group-hover:-translate-x-0.5 transition-transform" />
					</button>

					{/* Next Arrow */}
					<button
						onClick={goToNextSlide}
						className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 group"
						aria-label="Next slide"
					>
						<ChevronRight className="w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-0.5 transition-transform" />
					</button>
				</>
			)}

			{/* Slide Indicators / Pagination */}
			{slides.length > 1 && (
				<div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`w-3 h-3 rounded-full transition-all duration-300 ${
								index === currentSlide
									? "bg-primary scale-110"
									: "bg-white/50 hover:bg-white/70"
							}`}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			)}

			{/* Bottom decorative wave/curve */}
			<div className="absolute bottom-0 left-0 right-0 z-10">
				<svg
					viewBox="0 0 1440 120"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full"
					preserveAspectRatio="none"
				>
					<path
						d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
						fill="#FDF9EF"
					/>
				</svg>
			</div>
		</section>
	);
}
