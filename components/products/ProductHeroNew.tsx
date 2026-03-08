"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Heart } from "lucide-react";
import { ImageComponent } from "@/components/common/image-component";
import type { HeroSettings } from "@/types";

interface ProductHeroNewProps {
	title: string;
	shortDescription?: string;
	heroSettings?: HeroSettings | null;
	overviewImage?: string;
	productImages?: string[];
	productId?: string;
	initialLikeCount?: number;
}

/**
 * New Product Hero Section
 * Layout: Content on left, Image on right
 * Tillamook-inspired design with configurable theme color
 */
export function ProductHeroNew({
	title,
	shortDescription,
	heroSettings,
	overviewImage,
	productImages,
	productId,
	initialLikeCount = 0,
}: ProductHeroNewProps) {
	const [likeCount, setLikeCount] = useState(initialLikeCount);
	const [hasLiked, setHasLiked] = useState(false);
	const [isLiking, setIsLiking] = useState(false);

	// Check if user has already liked this product (using localStorage)
	useEffect(() => {
		if (productId) {
			const likedProducts = JSON.parse(localStorage.getItem("likedProducts") || "[]");
			setHasLiked(likedProducts.includes(productId));
		}
	}, [productId]);

	const handleLike = async () => {
		if (!productId || isLiking) return;

		setIsLiking(true);
		const likedProducts = JSON.parse(localStorage.getItem("likedProducts") || "[]");

		try {
			if (hasLiked) {
				// Unlike
				const response = await fetch(`/api/products/${productId}/like`, {
					method: "DELETE",
				});
				if (response.ok) {
					const data = await response.json();
					setLikeCount(data.likeCount);
					setHasLiked(false);
					localStorage.setItem(
						"likedProducts",
						JSON.stringify(likedProducts.filter((id: string) => id !== productId))
					);
				}
			} else {
				// Like
				const response = await fetch(`/api/products/${productId}/like`, {
					method: "POST",
				});
				if (response.ok) {
					const data = await response.json();
					setLikeCount(data.likeCount);
					setHasLiked(true);
					localStorage.setItem(
						"likedProducts",
						JSON.stringify([...likedProducts, productId])
					);
				}
			}
		} catch (error) {
			console.error("Error toggling like:", error);
		} finally {
			setIsLiking(false);
		}
	};

	const themeColor = heroSettings?.themeColor || "#6B7280";
	const badge = heroSettings?.badge;
	const ctaText = heroSettings?.ctaText || "FIND IN STORE";
	const ctaUrl = heroSettings?.ctaUrl || "/products";

	// Get the primary image
	const primaryImage = overviewImage || productImages?.[0];

	return (
		<section
			className="relative w-full py-16 md:py-24 overflow-hidden"
			style={{ backgroundColor: themeColor }}
		>
			<div className="_container">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
					{/* Left Content */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="text-white space-y-6"
					>
						{/* Badge */}
						{badge && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 0.1 }}
								className="flex items-center gap-3"
							>
								{/* Laurel wreath icons */}
								<svg
									className="w-8 h-8 text-amber-300"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M12 2C8.5 2 5.5 5 4 9c-1.5-1-3-1.5-3-1.5s1 2 2 3.5C2 12 1.5 13.5 1.5 13.5S3 13 4.5 12c.5 2 1.5 4 3.5 5.5C6 18 5 19.5 5 19.5s2-.5 3.5-1.5c.5 1.5 1.5 3 3.5 4 2-1 2.5-2.5 3.5-4 1.5 1 3.5 1.5 3.5 1.5s-1-1.5-3-2c2-1.5 3-3.5 3.5-5.5 1.5 1 3 1.5 3 1.5s-.5-1.5-1.5-2.5c1-1.5 2-3.5 2-3.5s-1.5.5-3 1.5C18.5 5 15.5 2 12 2z" />
								</svg>
								<span className="text-xs md:text-sm font-bold tracking-wider uppercase">
									{badge}
								</span>
								<svg
									className="w-8 h-8 text-amber-300 transform scale-x-[-1]"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<path d="M12 2C8.5 2 5.5 5 4 9c-1.5-1-3-1.5-3-1.5s1 2 2 3.5C2 12 1.5 13.5 1.5 13.5S3 13 4.5 12c.5 2 1.5 4 3.5 5.5C6 18 5 19.5 5 19.5s2-.5 3.5-1.5c.5 1.5 1.5 3 3.5 4 2-1 2.5-2.5 3.5-4 1.5 1 3.5 1.5 3.5 1.5s-1-1.5-3-2c2-1.5 3-3.5 3.5-5.5 1.5 1 3 1.5 3 1.5s-.5-1.5-1.5-2.5c1-1.5 2-3.5 2-3.5s-1.5.5-3 1.5C18.5 5 15.5 2 12 2z" />
								</svg>
							</motion.div>
						)}

						{/* Title */}
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight"
						>
							{title}
						</motion.h1>

						{/* Short Description */}
						{shortDescription && (
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="text-lg md:text-xl text-white/80 max-w-md tracking-wide leading-relaxed"
							>
								{shortDescription}
							</motion.p>
						)}

						{/* CTA Buttons */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className="flex flex-wrap items-center gap-4 pt-4"
						>
							<Link
								href={ctaUrl}
								className="inline-flex items-center gap-2 px-6 py-3 bg-cream-50 text-gray-800 rounded-full font-bold text-sm hover:bg-white transition-colors"
								style={{ backgroundColor: "#FFF8E7" }}
							>
								<MapPin className="w-4 h-4" />
								{ctaText}
							</Link>
							<button
								type="button"
								onClick={handleLike}
								disabled={isLiking || !productId}
								className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-colors border ${
									hasLiked
										? "bg-red-500/20 text-white border-red-400/40 hover:bg-red-500/30"
										: "bg-white/10 text-white border-white/20 hover:bg-white/20"
								} ${isLiking ? "opacity-50 cursor-wait" : ""} ${!productId ? "opacity-50 cursor-not-allowed" : ""}`}
							>
								<Heart className={`w-4 h-4 ${hasLiked ? "fill-red-400 text-red-400" : ""}`} />
								<span>{likeCount}</span>
							</button>
						</motion.div>
					</motion.div>

					{/* Right Image */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="relative"
					>
						{primaryImage ? (
							<div className="relative aspect-[4/3] w-full">
								<ImageComponent
									src={primaryImage}
									alt={title}
									className="object-contain w-full h-full drop-shadow-2xl"
									priority
									height={600}
									width={800}
									sizes="(max-width: 768px) 100vw, 50vw"
									wrapperClasses="w-full h-full"
									showLoader={true}
								/>
							</div>
						) : (
							<div className="aspect-[4/3] w-full bg-white/10 rounded-2xl flex items-center justify-center">
								<svg
									className="h-24 w-24 text-white/30"
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
					</motion.div>
				</div>
			</div>
		</section>
	);
}
