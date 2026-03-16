"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventImageSliderProps {
	images: string[];
	alt: string;
}

export function EventImageSlider({ images, alt }: EventImageSliderProps) {
	const [activeIndex, setActiveIndex] = React.useState(0);

	if (!images || images.length === 0) return null;

	const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
	const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

	return (
		<div className="mb-6 rounded-xl overflow-hidden">
			{/* Main Image */}
			<div className="relative w-full h-64 md:h-80 bg-slate-200">
				<Image
					src={images[activeIndex]}
					alt={`${alt} ${activeIndex + 1}`}
					fill
					className="object-cover"
					unoptimized
				/>
			</div>

			{/* Thumbnails + Arrows */}
			{images.length > 1 && (
				<div className="relative bg-slate-900 px-10 py-3 flex items-center gap-2 overflow-hidden">
					{/* Prev */}
					<button
						onClick={prev}
						className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-1 transition-colors"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>

					{/* Thumbnails */}
					<div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 justify-center">
						{images.map((url, idx) => (
							<button
								key={idx}
								onClick={() => setActiveIndex(idx)}
								className={`relative flex-shrink-0 w-16 h-11 rounded overflow-hidden border-2 transition-all ${
									idx === activeIndex ? "border-white opacity-100" : "border-transparent opacity-60 hover:opacity-90"
								}`}
							>
								<Image src={url} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" unoptimized />
							</button>
						))}
					</div>

					{/* Next */}
					<button
						onClick={next}
						className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-1 transition-colors"
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
			)}
		</div>
	);
}
