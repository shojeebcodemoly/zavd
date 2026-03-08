"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { IStoreGallerySection } from "@/models/store-page.model";
import { ImageComponent } from "@/components/common/image-component";
import { Button } from "@/components/ui/button";

interface StoreGalleryProps {
	data: IStoreGallerySection;
}

export function StoreGallery({ data }: StoreGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	const openLightbox = (index: number) => setSelectedIndex(index);
	const closeLightbox = () => setSelectedIndex(null);

	const goToPrevious = () => {
		if (selectedIndex === null || !data.images) return;
		setSelectedIndex(
			selectedIndex === 0 ? data.images.length - 1 : selectedIndex - 1
		);
	};

	const goToNext = () => {
		if (selectedIndex === null || !data.images) return;
		setSelectedIndex(
			selectedIndex === data.images.length - 1 ? 0 : selectedIndex + 1
		);
	};

	if (!data.images || data.images.length === 0) {
		return null;
	}

	return (
		<>
			<section className="section-padding bg-white">
				<div className="_container">
					<motion.div
						initial="initial"
						whileInView="animate"
						viewport={{ once: true, margin: "-100px" }}
						variants={staggerContainer}
					>
						{/* Section Header */}
						<motion.div variants={fadeUp} className="text-center mb-12">
							<div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
								<Images className="h-4 w-4 text-primary" />
								<span className="text-sm font-semibold text-primary">
									Gallery
								</span>
							</div>
							{data.title && (
								<h2 className="text-3xl font-medium text-secondary md:text-4xl mb-4">
									{data.title}
								</h2>
							)}
							{data.subtitle && (
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
									{data.subtitle}
								</p>
							)}
						</motion.div>

						{/* Gallery Grid */}
						<motion.div
							variants={fadeUp}
							className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
						>
							{data.images.map((image, index) => (
								<motion.button
									key={index}
									variants={fadeUp}
									onClick={() => openLightbox(index)}
									className="group relative aspect-square overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
								>
									<ImageComponent
										src={image.url}
										alt={image.alt || `Gallery image ${index + 1}`}
										fill
										className="object-cover transition-transform duration-500 group-hover:scale-110"
									/>
									<div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/30 transition-colors duration-300" />
									{image.caption && (
										<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
											<p className="text-white text-sm">{image.caption}</p>
										</div>
									)}
								</motion.button>
							))}
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Lightbox */}
			<AnimatePresence>
				{selectedIndex !== null && data.images && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/95 backdrop-blur-sm"
						onClick={closeLightbox}
					>
						{/* Close Button */}
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
							onClick={closeLightbox}
						>
							<X className="h-6 w-6" />
						</Button>

						{/* Navigation Buttons */}
						<Button
							variant="ghost"
							size="icon"
							className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10"
							onClick={(e) => {
								e.stopPropagation();
								goToPrevious();
							}}
						>
							<ChevronLeft className="h-8 w-8" />
						</Button>

						<Button
							variant="ghost"
							size="icon"
							className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10"
							onClick={(e) => {
								e.stopPropagation();
								goToNext();
							}}
						>
							<ChevronRight className="h-8 w-8" />
						</Button>

						{/* Image */}
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="relative max-w-5xl max-h-[80vh] w-full h-full mx-4"
							onClick={(e) => e.stopPropagation()}
						>
							<ImageComponent
								src={data.images[selectedIndex].url}
								alt={data.images[selectedIndex].alt || `Gallery image ${selectedIndex + 1}`}
								fill
								className="object-contain"
							/>
						</motion.div>

						{/* Caption */}
						{data.images[selectedIndex].caption && (
							<div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center">
								<p className="text-lg">{data.images[selectedIndex].caption}</p>
								<p className="text-sm text-white/60 mt-1">
									{selectedIndex + 1} / {data.images.length}
								</p>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
