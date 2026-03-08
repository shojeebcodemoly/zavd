"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ImageComponent } from "@/components/common/image-component";
import { Button } from "@/components/ui/button";
import type { ProductType } from "@/types";
import { cn } from "@/lib/utils/cn";

interface RelatedProductsCarouselProps {
	products: ProductType[];
	title?: string;
	currentProductId?: string;
}

/**
 * Related Products Carousel
 * Displays related products in a horizontal scrollable carousel
 */
export function RelatedProductsCarousel({
	products,
	title = "You May Also Like",
	currentProductId,
}: RelatedProductsCarouselProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	// Filter out current product from the list
	const filteredProducts = currentProductId
		? products.filter((p) => p._id !== currentProductId && p.id !== currentProductId)
		: products;

	// Check scroll position
	const checkScrollPosition = () => {
		const container = scrollContainerRef.current;
		if (!container) return;

		setCanScrollLeft(container.scrollLeft > 0);
		setCanScrollRight(
			container.scrollLeft < container.scrollWidth - container.clientWidth - 10
		);
	};

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		checkScrollPosition();
		container.addEventListener("scroll", checkScrollPosition);
		window.addEventListener("resize", checkScrollPosition);

		return () => {
			container.removeEventListener("scroll", checkScrollPosition);
			window.removeEventListener("resize", checkScrollPosition);
		};
	}, []);

	const scroll = (direction: "left" | "right") => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const scrollAmount = container.clientWidth * 0.8;
		container.scrollBy({
			left: direction === "left" ? -scrollAmount : scrollAmount,
			behavior: "smooth",
		});
	};

	if (filteredProducts.length === 0) {
		return null;
	}

	return (
		<section className="w-full py-12 md:py-16 bg-slate-50">
			<div className="_container">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="flex items-center justify-between mb-8"
				>
					<h2 className="text-2xl md:text-3xl font-medium text-primary">
						{title}
					</h2>

					{/* Navigation buttons */}
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={() => scroll("left")}
							disabled={!canScrollLeft}
							className={cn(
								"rounded-full",
								!canScrollLeft && "opacity-50 cursor-not-allowed"
							)}
						>
							<ChevronLeft className="w-5 h-5" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={() => scroll("right")}
							disabled={!canScrollRight}
							className={cn(
								"rounded-full",
								!canScrollRight && "opacity-50 cursor-not-allowed"
							)}
						>
							<ChevronRight className="w-5 h-5" />
						</Button>
					</div>
				</motion.div>

				{/* Carousel container */}
				<div className="relative">
					<div
						ref={scrollContainerRef}
						className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						{filteredProducts.map((product, index) => (
							<motion.div
								key={product._id || product.id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className="flex-shrink-0 w-[280px] md:w-[300px] snap-start"
							>
								<Link
									href={`/products/category/${product.primaryCategory?.slug || product.categories?.[0]?.slug || "uncategorized"}/${product.slug}`}
									className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
								>
									{/* Product Image */}
									<div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
										{product.overviewImage || product.productImages?.[0] ? (
											<ImageComponent
												src={
													product.overviewImage ||
													product.productImages[0]
												}
												alt={product.title}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												width={300}
												height={225}
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
												<svg
													className="w-12 h-12 text-slate-300"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
											</div>
										)}
									</div>

									{/* Product Info */}
									<div className="p-4">
										<h3 className="font-medium text-lg text-primary group-hover:text-secondary transition-colors line-clamp-2 mb-2">
											{product.title}
										</h3>
										{product.shortDescription && (
											<p className="text-sm text-muted-foreground line-clamp-2">
												{product.shortDescription}
											</p>
										)}
									</div>
								</Link>
							</motion.div>
						))}
					</div>

					{/* Gradient overlays for scroll indication */}
					{canScrollLeft && (
						<div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none hidden md:block" />
					)}
					{canScrollRight && (
						<div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none hidden md:block" />
					)}
				</div>
			</div>
		</section>
	);
}
