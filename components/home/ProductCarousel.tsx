"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Plain object type for serialized product data
interface ProductData {
	_id?: string;
	name: string;
	slug: string;
	categorySlug: string;
	images?: string[];
	rating?: number;
	reviewCount?: number;
}

interface ProductCarouselProps {
	badge?: string;
	title?: string;
	products: ProductData[];
}

export function ProductCarousel({
	badge = "BUY ONLINE",
	title = "Popular Products",
	products,
}: ProductCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	// Always show 3 products per view (on desktop)
	const visibleCount = 3;
	const maxIndex = Math.max(0, products.length - visibleCount);

	const goToPrev = useCallback(() => {
		setCurrentIndex((prev) => Math.max(0, prev - 1));
	}, []);

	const goToNext = useCallback(() => {
		setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
	}, [maxIndex]);

	if (!products || products.length === 0) return null;

	const visibleProducts = products.slice(currentIndex, currentIndex + visibleCount);

	// Render star rating with golden stars
	const renderStars = (rating: number = 5) => {
		return (
			<div className="flex items-center justify-center gap-1 mb-3">
				{[1, 2, 3, 4, 5].map((star) => (
					<Star
						key={star}
						className={`h-4 w-4 ${
							star <= rating
								? "fill-amber-400 text-amber-400"
								: "fill-gray-600 text-gray-600"
						}`}
					/>
				))}
			</div>
		);
	};

	return (
		<section className="section-padding bg-white">
			<div className="_container">
				{/* Section Header */}
				<motion.div
					className="text-center mb-12"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					{badge && (
						<span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-4">
							{badge}
						</span>
					)}
					{title && (
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-medium text-secondary">
							{title}
						</h2>
					)}
				</motion.div>

				{/* Carousel Container */}
				<div className="relative flex items-center">
					{/* Navigation Arrow - Left */}
					<button
						onClick={goToPrev}
						disabled={currentIndex === 0}
						className={`absolute left-0 -translate-x-4 md:-translate-x-16 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full border border-secondary/20 bg-white flex items-center justify-center transition-all ${
							currentIndex === 0
								? "opacity-30 cursor-not-allowed"
								: "hover:border-primary hover:text-primary text-secondary/60"
						}`}
						aria-label="Previous products"
					>
						<ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
					</button>

					{/* Products Grid */}
					<div className="overflow-hidden flex-1 px-2">
						<motion.div
							className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
							initial={false}
						>
							<AnimatePresence mode="popLayout">
								{visibleProducts.map((product, index) => (
									<motion.div
										key={product._id || product.slug}
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -50 }}
										transition={{ duration: 0.3, delay: index * 0.05 }}
									>
										<Link
											href={`/products/category/${product.categorySlug}/${product.slug}`}
											className="group block text-center"
										>
											{/* Product Card with Light Background */}
											<div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted/30 border border-secondary/10">
												{product.images?.[0] ? (
													<Image
														src={product.images[0]}
														alt={product.name}
														fill
														className="object-contain p-6 md:p-8 transition-transform duration-500 group-hover:scale-110"
														sizes="(max-width: 768px) 100vw, 33vw"
													/>
												) : (
													<div className="absolute inset-0 bg-muted/30 flex items-center justify-center">
														<span className="text-secondary/30 text-5xl font-heading">
															{product.name.charAt(0)}
														</span>
													</div>
												)}
											</div>

											{/* Star Rating */}
											{renderStars(product.rating || 5)}

											{/* Product Name */}
											<h3 className="text-lg md:text-xl font-heading font-medium text-secondary group-hover:text-primary transition-colors">
												{product.name}
											</h3>
										</Link>
									</motion.div>
								))}
							</AnimatePresence>
						</motion.div>
					</div>

					{/* Navigation Arrow - Right */}
					<button
						onClick={goToNext}
						disabled={currentIndex >= maxIndex}
						className={`absolute right-0 translate-x-4 md:translate-x-16 z-10 w-12 h-12 md:w-14 md:h-14 rounded-full border border-secondary/20 bg-white flex items-center justify-center transition-all ${
							currentIndex >= maxIndex
								? "opacity-30 cursor-not-allowed"
								: "hover:border-primary hover:text-primary text-secondary/60"
						}`}
						aria-label="Next products"
					>
						<ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
					</button>
				</div>
			</div>
		</section>
	);
}
