"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ChevronLeft,
	ChevronRight,
	X,
	ZoomIn,
	Pause,
	Play,
} from "lucide-react";
import Image from "next/image";

interface ProductImageGalleryProps {
	images: string[];
	productName: string;
	youtubeUrl?: string;
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/embed/, youtube.com/v/
 */
function extractYouTubeVideoId(url: string): string | null {
	if (!url || typeof url !== "string") return null;

	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&]+)/,
		/(?:youtu\.be\/)([^?&]+)/,
		/(?:youtube\.com\/embed\/)([^?&]+)/,
		/(?:youtube\.com\/v\/)([^?&]+)/,
		/(?:youtube\.com\/shorts\/)([^?&]+)/,
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}

	return null;
}

/**
 * Get YouTube thumbnail URL from video ID
 */
function getYouTubeThumbnail(videoId: string): string {
	return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * ProductImageGallery Component
 *
 * Modern image gallery with:
 * - Auto-sliding every 5 seconds
 * - Thumbnail navigation
 * - Lightbox modal
 * - Keyboard navigation
 * - Smooth animations
 * - Pause on hover
 */
export function ProductImageGallery({
	images,
	productName,
	youtubeUrl,
}: ProductImageGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

	// Extract YouTube video ID if valid URL provided
	const youtubeVideoId = useMemo(
		() => (youtubeUrl ? extractYouTubeVideoId(youtubeUrl) : null),
		[youtubeUrl]
	);

	// Build gallery items: YouTube video first (if exists), then images
	const galleryItems = useMemo(() => {
		const items: Array<{ type: "video" | "image"; src: string }> = [];

		if (youtubeVideoId) {
			items.push({
				type: "video",
				src: getYouTubeThumbnail(youtubeVideoId),
			});
		}

		images.forEach((img) => {
			items.push({ type: "image", src: img });
		});

		return items;
	}, [images, youtubeVideoId]);

	const totalItems = galleryItems.length;
	const currentItem = galleryItems[selectedIndex];
	const isCurrentItemVideo = currentItem?.type === "video";

	const handlePrevious = useCallback(() => {
		setIsVideoPlaying(false);
		setSelectedIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
	}, [totalItems]);

	const handleNext = useCallback(() => {
		setIsVideoPlaying(false);
		setSelectedIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
	}, [totalItems]);

	// Auto-slide functionality
	useEffect(() => {
		if (
			isPaused ||
			isHovered ||
			isLightboxOpen ||
			isVideoPlaying ||
			totalItems <= 1
		) {
			if (autoPlayRef.current) {
				clearInterval(autoPlayRef.current);
				autoPlayRef.current = null;
			}
			return;
		}

		autoPlayRef.current = setInterval(() => {
			handleNext();
		}, 5000);

		return () => {
			if (autoPlayRef.current) {
				clearInterval(autoPlayRef.current);
			}
		};
	}, [isPaused, isHovered, isLightboxOpen, isVideoPlaying, totalItems, handleNext]);

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isLightboxOpen) {
				if (e.key === "Escape") {
					setIsLightboxOpen(false);
					setIsVideoPlaying(false);
				}
				if (e.key === "ArrowLeft") handlePrevious();
				if (e.key === "ArrowRight") handleNext();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isLightboxOpen, handlePrevious, handleNext]);

	// Handle index change to stop video
	const handleIndexChange = useCallback(
		(index: number) => {
			setIsVideoPlaying(false);
			setSelectedIndex(index);
		},
		[]
	);

	return (
		<div className="w-full max-w-4xl mx-auto">
			{/* Main Image Container */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-lg group"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{/* Main Image / Video */}
				<div className="relative aspect-4/3 md:aspect-16/10 w-full bg-linear-to-br from-slate-50 to-slate-100">
					<AnimatePresence mode="wait">
						<motion.div
							key={`${selectedIndex}-${isVideoPlaying}`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							className="absolute inset-0 flex items-center justify-center"
						>
							{isCurrentItemVideo && youtubeVideoId ? (
								isVideoPlaying ? (
									// YouTube Embedded Player
									<iframe
										src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
										title={`${productName} - Video`}
										className="absolute inset-0 w-full h-full"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								) : (
									// Video Thumbnail with Play Button
									<div
										className="absolute inset-0 cursor-pointer group/video"
										onClick={() => setIsVideoPlaying(true)}
									>
										<Image
											src={currentItem.src}
											alt={`${productName} - Video thumbnail`}
											fill
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
											className="object-cover"
											priority
										/>
										{/* Play Button Overlay */}
										<div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/30 transition-colors duration-300">
											<div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-primary/90 group-hover/video:bg-primary group-hover/video:scale-110 transition-all duration-300 shadow-2xl">
												<svg
													className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white ml-1"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M8 5v14l11-7z" />
												</svg>
											</div>
										</div>
										{/* Video Label */}
										<div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs sm:text-sm font-medium">
											<svg
												className="w-3.5 h-3.5 sm:w-4 sm:h-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
											</svg>
											Video
										</div>
									</div>
								)
							) : (
								// Regular Image
								<div className="absolute inset-0 p-4 md:p-8">
									<Image
										src={currentItem?.src || images[0]}
										alt={`${productName} - ${selectedIndex + 1}`}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
										className="object-contain"
										priority={selectedIndex === 0}
									/>
								</div>
							)}
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Controls Overlay - Visible on Hover (hide when video is playing) */}
				{!isVideoPlaying && (
					<div className="absolute inset-0 pointer-events-none">
						{/* Top Right Controls */}
						<div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							{/* Pause/Play Button */}
							{totalItems > 1 && (
								<button
									onClick={() => setIsPaused(!isPaused)}
									className="p-2 sm:p-2.5 rounded-full bg-white/95 shadow-lg text-slate-700 hover:bg-white hover:scale-105 transition-all duration-200 cursor-pointer"
									aria-label={
										isPaused ? "Play slideshow" : "Pause slideshow"
									}
								>
									{isPaused ? (
										<Play className="h-4 w-4 sm:h-5 sm:w-5" />
									) : (
										<Pause className="h-4 w-4 sm:h-5 sm:w-5" />
									)}
								</button>
							)}

							{/* Zoom Button - only show for images, not videos */}
							{!isCurrentItemVideo && (
								<button
									onClick={() => setIsLightboxOpen(true)}
									className="p-2 sm:p-2.5 rounded-full bg-white/95 shadow-lg text-slate-700 hover:bg-white hover:scale-105 transition-all duration-200 cursor-pointer"
									aria-label="Zoom image"
								>
									<ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
								</button>
							)}
						</div>

						{/* Navigation Arrows */}
						{totalItems > 1 && (
							<>
								<button
									onClick={handlePrevious}
									className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/95 shadow-lg text-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105 cursor-pointer pointer-events-auto"
									aria-label="Previous"
								>
									<ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
								</button>
								<button
									onClick={handleNext}
									className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/95 shadow-lg text-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105 cursor-pointer pointer-events-auto"
									aria-label="Next"
								>
									<ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
								</button>
							</>
						)}

						{/* Progress Dots */}
						{totalItems > 1 && (
							<div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-auto">
								{galleryItems.map((_, index) => (
									<button
										key={index}
										onClick={() => handleIndexChange(index)}
										className={`rounded-full transition-all duration-300 cursor-pointer ${
											index === selectedIndex
												? "w-6 sm:w-8 h-2 bg-primary shadow-md"
												: "w-2 h-2 bg-slate-300 hover:bg-slate-400"
										}`}
										aria-label={`Go to ${galleryItems[index].type === "video" ? "video" : `image ${index + 1}`}`}
									/>
								))}
							</div>
						)}
					</div>
				)}
			</motion.div>

			{/* Thumbnails - Horizontal Row */}
			{totalItems > 1 && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mt-4 flex justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 px-2"
				>
					{galleryItems.map((item, index) => (
						<button
							key={index}
							onClick={() => handleIndexChange(index)}
							className={`
								relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0 overflow-hidden rounded-lg sm:rounded-xl
								transition-all duration-300 cursor-pointer border-2
								${
									index === selectedIndex
										? "border-primary ring-2 ring-primary/20 shadow-md scale-105"
										: "border-slate-200 hover:border-primary/50 opacity-70 hover:opacity-100"
								}
							`}
							aria-label={item.type === "video" ? "View video" : `View image ${index + 1}`}
						>
							<Image
								src={item.src}
								alt={item.type === "video" ? `${productName} video thumbnail` : `${productName} thumbnail ${index + 1}`}
								fill
								sizes="80px"
								className="object-cover"
							/>
							{/* Video play icon overlay for video thumbnail */}
							{item.type === "video" && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/30">
									<div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/90 flex items-center justify-center">
										<svg
											className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white ml-0.5"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M8 5v14l11-7z" />
										</svg>
									</div>
								</div>
							)}
						</button>
					))}
				</motion.div>
			)}

			{/* Lightbox Modal - Only for images, not videos */}
			<AnimatePresence>
				{isLightboxOpen && !isCurrentItemVideo && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
						onClick={() => setIsLightboxOpen(false)}
					>
						{/* Close Button */}
						<button
							onClick={() => setIsLightboxOpen(false)}
							className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-20"
							aria-label="Close lightbox"
						>
							<X className="h-6 w-6" />
						</button>

						{/* Lightbox Image */}
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center"
							onClick={(e) => e.stopPropagation()}
						>
							<Image
								src={currentItem?.src || images[0]}
								alt={`${productName} - ${selectedIndex + 1}`}
								fill
								sizes="100vw"
								className="object-contain"
								priority
							/>
						</motion.div>

						{/* Navigation in Lightbox */}
						{totalItems > 1 && (
							<>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handlePrevious();
									}}
									className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-20"
									aria-label="Previous"
								>
									<ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleNext();
									}}
									className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-20"
									aria-label="Next"
								>
									<ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
								</button>
							</>
						)}

						{/* Counter in Lightbox */}
						{totalItems > 1 && (
							<div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium text-white z-20">
								{selectedIndex + 1} / {totalItems}
							</div>
						)}

						{/* Lightbox Thumbnails */}
						{totalItems > 1 && (
							<div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20">
								{galleryItems.map((item, index) => (
									<button
										key={index}
										onClick={(e) => {
											e.stopPropagation();
											handleIndexChange(index);
										}}
										className={`
											relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer
											${
												index === selectedIndex
													? "border-white scale-110"
													: "border-white/30 opacity-60 hover:opacity-100"
											}
										`}
									>
										<Image
											src={item.src}
											alt={item.type === "video" ? "Video thumbnail" : `Thumbnail ${index + 1}`}
											fill
											sizes="56px"
											className="object-cover"
										/>
										{/* Video play icon overlay */}
										{item.type === "video" && (
											<div className="absolute inset-0 flex items-center justify-center bg-black/30">
												<div className="w-5 h-5 rounded-full bg-primary/90 flex items-center justify-center">
													<svg
														className="w-2.5 h-2.5 text-white ml-0.5"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<path d="M8 5v14l11-7z" />
													</svg>
												</div>
											</div>
										)}
									</button>
								))}
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
