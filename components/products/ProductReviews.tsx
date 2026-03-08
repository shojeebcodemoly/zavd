"use client";

import { motion } from "framer-motion";
import { Star, ThumbsUp, CheckCircle2, Quote } from "lucide-react";
import { Review } from "@/types/product";

interface ProductReviewsProps {
	reviews: Review[];
	productName: string;
}

/**
 * ProductReviews Component
 *
 * Customer reviews section with:
 * - Star ratings
 * - Verified badges
 * - Helpful votes
 * - Glassmorphism cards
 * - Responsive grid layout
 */
export function ProductReviews({ reviews, productName }: ProductReviewsProps) {
	if (!reviews || reviews.length === 0) return null;

	// Calculate average rating
	const averageRating =
		reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

	const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
		const sizeClass = size === "lg" ? "h-6 w-6" : "h-4 w-4";
		return (
			<div className="flex gap-1">
				{[1, 2, 3, 4, 5].map((star) => (
					<Star
						key={star}
						className={`${sizeClass} ${
							star <= rating
								? "fill-yellow-400 text-yellow-400"
								: "fill-gray-200 text-gray-200"
						}`}
					/>
				))}
			</div>
		);
	};

	return (
		<section className="py-16 md:py-24 bg-green-100/50 rounded-lg my-5 border-r-green-200">
			<div className="_container">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
						<Star className="h-4 w-4 fill-current" />
						<span className="text-sm font-semibold">Kundrecensioner</span>
					</div>
					<h2 className="text-3xl md:text-4xl font-medium text-secondary mb-4">
						Vad våra kunder säger
					</h2>

					{/* Average Rating */}
					<div className="flex items-center justify-center gap-4 mt-6">
						<div className="text-center">
							<div className="text-5xl font-medium text-secondary mb-2">
								{averageRating.toFixed(1)}
							</div>
							{renderStars(Math.round(averageRating), "lg")}
							<p className="text-sm text-muted-foreground mt-2">
								Baserat på {reviews.length} recensioner
							</p>
						</div>
					</div>
				</motion.div>

				{/* Reviews Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
					{reviews.map((review, index) => (
						<motion.div
							key={review.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="relative"
						>
							<div className="h-full p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-primary/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
								{/* Quote Icon */}
								<Quote className="h-8 w-8 text-primary/20 mb-4" />

								{/* Rating */}
								<div className="mb-3">{renderStars(review.rating)}</div>

								{/* Title */}
								<h3 className="font-bold text-lg text-foreground mb-2">
									{review.title}
								</h3>

								{/* Content */}
								<p className="text-muted-foreground mb-4 line-clamp-4">
									{review.content}
								</p>

								{/* Author Info */}
								<div className="mt-auto pt-4 border-t border-primary/50">
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<p className="font-semibold text-foreground">
													{review.author}
												</p>
												{review.verified && (
													<CheckCircle2 className="h-4 w-4 text-primary" />
												)}
											</div>
											{review.role && (
												<p className="text-sm text-muted-foreground">
													{review.role}
												</p>
											)}
											{review.location && (
												<p className="text-xs text-muted-foreground">
													{review.location}
												</p>
											)}
										</div>
										<time className="text-xs text-muted-foreground shrink-0">
											{new Date(review.date).toLocaleDateString(
												"sv-SE",
												{
													year: "numeric",
													month: "short",
												}
											)}
										</time>
									</div>

									{/* Helpful */}
									{review.helpful !== undefined &&
										review.helpful > 0 && (
											<div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
												<ThumbsUp className="h-3 w-3" />
												<span>
													{review.helpful} tyckte detta var
													hjälpsamt
												</span>
											</div>
										)}
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
