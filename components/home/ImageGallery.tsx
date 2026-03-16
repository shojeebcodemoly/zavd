"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageComponent } from "../common/image-component";
import type { IImageGallerySection } from "@/models/home-page.model";

interface ImageGalleryProps {
	data: IImageGallerySection;
}

export function ImageGallery({ data }: ImageGalleryProps) {
	const images = data?.images ?? [];
	const hasBadge = data?.badge?.trim();
	const hasTitle = data?.title?.trim();
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const close = useCallback(() => setActiveIndex(null), []);
	const prev = useCallback(() => setActiveIndex((i) => (i === null ? 0 : i === 0 ? images.length - 1 : i - 1)), [images.length]);
	const next = useCallback(() => setActiveIndex((i) => (i === null ? 0 : i === images.length - 1 ? 0 : i + 1)), [images.length]);

	useEffect(() => {
		if (activeIndex === null) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
			if (e.key === "ArrowLeft") prev();
			if (e.key === "ArrowRight") next();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [activeIndex, close, prev, next]);

	if (!images.length && !hasTitle && !hasBadge) return null;

	return (
		<>
			<section className="pt-4 pb-16 lg:pt-6 lg:pb-24 bg-white overflow-hidden">
				<div className="_container">
					{/* Header */}
					{(hasBadge || hasTitle) && (
						<div className="mb-8 md:mb-10">
							{hasBadge && (
								<div className="flex items-center gap-3 mb-3">
									<span className="w-8 h-[2px] bg-primary block" />
									<span className="text-primary text-sm font-medium tracking-wide">
										{data.badge}
									</span>
								</div>
							)}
							{hasTitle && (
								<h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight">
									{data.title}
								</h2>
							)}
						</div>
					)}

					{/* Grid */}
					{images.length > 0 && (
						<div className="grid grid-cols-2 md:grid-cols-4 gap-1">
							{images.map((image, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, scale: 0.97 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true, amount: 0.1 }}
									transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
									className="relative aspect-square overflow-hidden group cursor-pointer"
									onClick={() => setActiveIndex(i)}
								>
									<ImageComponent
										src={image.src ?? ""}
										alt={image.title ?? "Gallery image"}
										fill
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
									{/* Hover zoom hint */}
									
									<div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
										{image.title && (
											<p className="text-white text-xs md:text-sm font-bold uppercase tracking-wider leading-tight">
												{image.title}
											</p>
										)}
										{image.subtitle && (
											<p className="text-white/80 text-[10px] md:text-xs uppercase tracking-wider mt-0.5">
												{image.subtitle}
											</p>
										)}
									</div>
								</motion.div>
							))}
						</div>
					)}
				</div>
			</section>

			{/* Lightbox Modal */}
			<AnimatePresence>
				{activeIndex !== null && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center"
						onClick={close}
					>
						{/* Close */}
						<button
							onClick={close}
							className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full p-2 transition-colors"
						>
							<X className="w-6 h-6" />
						</button>

						{/* Prev */}
						{images.length > 1 && (
							<button
								onClick={(e) => { e.stopPropagation(); prev(); }}
								className="absolute left-4 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors"
							>
								<ChevronLeft className="w-6 h-6" />
							</button>
						)}

						{/* Image */}
						<motion.div
							key={activeIndex}
							initial={{ opacity: 0, scale: 0.93 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.93 }}
							transition={{ duration: 0.25 }}
							className="relative max-w-5xl max-h-[85vh] w-full mx-16"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="relative w-full" style={{ paddingBottom: "66.66%" }}>
								<ImageComponent
									src={images[activeIndex].src ?? ""}
									alt={images[activeIndex].title ?? "Gallery image"}
									fill
									className="object-contain"
									showLoader={false}
								/>
							</div>
							{(images[activeIndex].title || images[activeIndex].subtitle) && (
								<div className="text-center mt-3">
									{images[activeIndex].title && (
										<p className="text-white font-semibold text-sm md:text-base uppercase tracking-wider">
											{images[activeIndex].title}
										</p>
									)}
									{images[activeIndex].subtitle && (
										<p className="text-white/60 text-xs md:text-sm mt-1">
											{images[activeIndex].subtitle}
										</p>
									)}
								</div>
							)}
						</motion.div>

						{/* Next */}
						{images.length > 1 && (
							<button
								onClick={(e) => { e.stopPropagation(); next(); }}
								className="absolute right-4 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors"
							>
								<ChevronRight className="w-6 h-6" />
							</button>
						)}

						{/* Counter */}
						{images.length > 1 && (
							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
								{activeIndex + 1} / {images.length}
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
