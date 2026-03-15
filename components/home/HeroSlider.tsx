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

	const slides = (data.slides || []).filter((slide) => slide.isActive !== false);
	const autoPlayInterval = data.autoPlayInterval || 5000;
	const showArrows = data.showArrows !== false;

	useSetNavbarVariant("dark-hero");

	useEffect(() => {
		if (!isAutoPlaying || slides.length <= 1) return;
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, autoPlayInterval);
		return () => clearInterval(interval);
	}, [isAutoPlaying, slides.length, autoPlayInterval]);

	const goToSlide = useCallback((index: number) => {
		setCurrentSlide(index);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	}, []);

	const goToPrevSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	}, [slides.length]);

	const goToNextSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
		setIsAutoPlaying(false);
		setTimeout(() => setIsAutoPlaying(true), 10000);
	}, [slides.length]);

	if (slides.length === 0) return null;

	const activeSlide = slides[currentSlide];

	return (
		<section className="relative w-full h-[90vh] overflow-hidden bg-black">
			{/* Background Image */}
			<AnimatePresence mode="wait">
				<motion.div
					key={currentSlide}
					initial={{ opacity: 0, scale: 1.05 }}
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
					{/* Dark gradient - strong left, fades right */}
					<div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
				</motion.div>
			</AnimatePresence>

			{/* Content - left aligned */}
			<div className="relative z-10 h-full flex items-center pt-20 lg:pt-24">
				<div className="w-full pl-[5%] sm:pl-[8%] lg:pl-[16%] xl:pl-[18%] pr-6 sm:pr-10">
					<div className="max-w-xl">
						<AnimatePresence mode="wait">
							<motion.div
								key={`content-${currentSlide}`}
								initial={{ opacity: 0, x: -30 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 30 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="flex flex-col gap-6"
							>
								{/* Badge */}
								{activeSlide.badge && (
									<motion.span
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5, delay: 0.3 }}
										className="text-xs md:text-sm tracking-[0.3em] uppercase text-amber-400 font-medium"
									>
										{activeSlide.badge}
									</motion.span>
								)}

								{/* Title */}
								{activeSlide.title && (
									<motion.h1
										initial={{ opacity: 0, y: 30 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: 0.4 }}
										className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight"
									>
										{activeSlide.title}
									</motion.h1>
								)}

								{/* Subtitle */}
								{activeSlide.subtitle && (
									<motion.p
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5, delay: 0.5 }}
										className="text-base md:text-lg text-white/75 max-w-lg leading-relaxed font-medium"
									>
										{activeSlide.subtitle}
									</motion.p>
								)}

								{/* Single Contact Button */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.6 }}
									className="pt-2"
								>
									<Link
										href="/kontakt"
										className="inline-flex items-center justify-center px-8 py-3 bg-transparent border border-white text-white text-sm font-bold tracking-widest uppercase hover:bg-white/10 transition-all duration-300"
									>
										Contact
									</Link>
								</motion.div>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>

				{/* Scroll Down - right side vertical */}
				<div className="absolute bottom-10 right-8 hidden lg:flex flex-col items-center gap-3">
					<span
						className="text-white/50 text-[10px] tracking-[0.25em] uppercase"
						style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
					>
						Scroll Down
					</span>
					<div className="w-px h-12 bg-white/30" />
				</div>
			</div>

			{/* Navigation Arrows */}
			{showArrows && slides.length > 1 && (
				<>
					<button
						onClick={goToPrevSlide}
						className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300"
						aria-label="Previous slide"
					>
						<ChevronLeft className="w-6 h-6" />
					</button>
					<button
						onClick={goToNextSlide}
						className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300"
						aria-label="Next slide"
					>
						<ChevronRight className="w-6 h-6" />
					</button>
				</>
			)}

			{/* Slide Indicators */}
			{slides.length > 1 && (
				<div className="absolute bottom-6 left-6 md:left-12 lg:left-16 z-20 flex items-center gap-3">
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`h-[3px] transition-all duration-300 ${
								index === currentSlide
									? "w-8 bg-white"
									: "w-4 bg-white/40 hover:bg-white/70"
							}`}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			)}
		</section>
	);
}
