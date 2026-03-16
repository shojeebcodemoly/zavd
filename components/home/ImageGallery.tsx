"use client";

import { motion } from "framer-motion";
import { ImageComponent } from "../common/image-component";
import type { IImageGallerySection } from "@/models/home-page.model";

interface ImageGalleryProps {
	data: IImageGallerySection;
}

export function ImageGallery({ data }: ImageGalleryProps) {
	const images = data?.images ?? [];
	const hasBadge = data?.badge?.trim();
	const hasTitle = data?.title?.trim();

	if (!images.length && !hasTitle && !hasBadge) return null;

	return (
		<section className="section-padding bg-white overflow-hidden">
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
							>
								{/* Image */}
								<ImageComponent
									src={image.src ?? ""}
									alt={image.title ?? "Gallery image"}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
								/>

								{/* Dark gradient overlay at bottom */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

								{/* Text at bottom */}
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
	);
}
