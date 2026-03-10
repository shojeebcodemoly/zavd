"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageComponent } from "../common/image-component";
import type { IImageGallerySection } from "@/models/home-page.model";

interface ImageGalleryProps {
	data: IImageGallerySection;
}

const ITEMS_PER_PAGE = 4;

export function ImageGallery({ data }: ImageGalleryProps) {
	const images = data?.images ?? [];
	const totalPages = Math.max(1, Math.ceil(images.length / ITEMS_PER_PAGE));
	const [page, setPage] = useState(0);
	const [direction, setDirection] = useState(1);

	const hasBadge = data?.badge?.trim();
	const hasTitle = data?.title?.trim();

	const goTo = (next: number, dir: number) => {
		setDirection(dir);
		setPage(next);
	};

	const prev = () => {
		if (page > 0) goTo(page - 1, -1);
	};

	const next = () => {
		if (page < totalPages - 1) goTo(page + 1, 1);
	};

	const visibleImages = images.slice(
		page * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
	);

	const variants = {
		enter: (dir: number) => ({
			opacity: 0,
			x: dir * 60,
		}),
		center: {
			opacity: 1,
			x: 0,
		},
		exit: (dir: number) => ({
			opacity: 0,
			x: dir * -60,
		}),
	};

	if (!images.length && !hasTitle && !hasBadge) return null;

	return (
		<section className="section-padding bg-white overflow-hidden">
			<div className="_container">
				{/* Header row */}
				<div className="flex items-start justify-between mb-10 md:mb-14">
					{/* Left: badge + title */}
					<div className="max-w-xl">
						{hasBadge && (
							<div className="flex items-center gap-3 mb-3">
								<span className="w-8 h-[2px] bg-amber-500 block" />
								<span className="text-amber-600 text-sm font-medium tracking-wide">
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

					{/* Right: nav arrows */}
					{totalPages > 1 && (
						<div className="flex items-center gap-3 mt-2 shrink-0">
							<button
								onClick={prev}
								disabled={page === 0}
								aria-label="Previous"
								className="w-11 h-11 rounded-full border border-amber-400 flex items-center justify-center text-amber-600 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
							<button
								onClick={next}
								disabled={page === totalPages - 1}
								aria-label="Next"
								className="w-11 h-11 rounded-full border border-amber-400 flex items-center justify-center text-amber-600 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</div>
					)}
				</div>

				{/* Cards */}
				<div className="relative overflow-hidden">
					<AnimatePresence mode="wait" custom={direction}>
						<motion.div
							key={page}
							custom={direction}
							variants={variants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{ duration: 0.35, ease: "easeInOut" }}
							className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6"
						>
							{visibleImages.map((image, i) => (
								<div key={i} className="flex flex-col items-center text-center group">
									{/* Rounded square image */}
									<div className="w-full aspect-[3/4] rounded-3xl overflow-hidden relative bg-gray-100 mb-4">
										<ImageComponent
											src={image.src ?? ""}
											alt={image.title ?? ""}
											fill
											className="object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									</div>

									{/* Name */}
									{image.title && (
										<p className="font-semibold text-gray-900 text-base md:text-lg">
											{image.title}
										</p>
									)}

									{/* Subtitle / role */}
									{image.subtitle && (
										<p className="text-gray-500 text-sm mt-0.5">
											{image.subtitle}
										</p>
									)}
								</div>
							))}
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Dot pagination */}
				{totalPages > 1 && (
					<div className="flex items-center justify-center gap-2 mt-8">
						{Array.from({ length: totalPages }).map((_, i) => (
							<button
								key={i}
								onClick={() => goTo(i, i > page ? 1 : -1)}
								aria-label={`Page ${i + 1}`}
								className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
									i === page
										? "bg-amber-500 border-amber-500 scale-110"
										: "bg-transparent border-amber-300 hover:border-amber-500"
								}`}
							/>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
