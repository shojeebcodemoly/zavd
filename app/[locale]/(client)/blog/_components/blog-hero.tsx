"use client";

import { motion } from "framer-motion";
import { BookOpen, TrendingUp } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface BlogHeroProps {
	pageTitle?: string;
	locale?: "sv" | "en";
}

// Translations
const translations = {
	sv: {
		badge: "Nyheter & Artiklar",
		badgeNews: "Nyheter",
		titlePrefix: "Senaste nytt om",
		titleHighlight: "klinikutrustning",
		description: "Ta del av det allra senaste inom hårborttagning, hudvård, microneedling och tatueringsborttagning. Expertguider, tekniska genomgångar och branschnyheter.",
		updatedRegularly: "Uppdateras regelbundet",
		expertArticles: "Expertskrivna artiklar",
	},
	en: {
		badge: "News & Articles",
		badgeNews: "News",
		titlePrefix: "Latest news about",
		titleHighlight: "Artisan Cheese",
		description: "Discover the world of traditional cheese making, dairy farming stories, delicious recipes, and the latest news from Milatte Farm.",
		updatedRegularly: "Updated regularly",
		expertArticles: "Expert-written articles",
	},
};

/**
 * BlogHero Component
 *
 * Hero section for the blog listing page with title, description, and decorative elements.
 * Supports custom pageTitle for different routes (e.g., "Nyheter", "Blogg")
 * Supports locale for multilingual content
 */
export function BlogHero({ pageTitle = "Blogg", locale = "sv" }: BlogHeroProps) {
	const t = translations[locale];

	return (
		<section className="relative overflow-hidden bg-linear-to-b from-slate-200 to-primary/20 padding-top pb-24">
			{/* Background Pattern */}
			<div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/3 translate-x-1/3 rounded-full bg-secondary/20 blur-3xl" />
			<div className="absolute bottom-0 left-0 h-[400px] w-[400px] translate-y-1/3 -translate-x-1/3 rounded-full bg-white/5 blur-3xl" />

			<div className="_container relative z-10">
				<motion.div
					initial="initial"
					animate="animate"
					variants={staggerContainer}
					className="mx-auto max-w-4xl text-center"
				>
					{/* Badge */}
					<motion.div
						variants={fadeUp}
						className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
					>
						<BookOpen className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium text-black">
							{pageTitle === "Nyheter" || pageTitle === "News"
								? t.badgeNews
								: t.badge}
						</span>
					</motion.div>

					{/* Title */}
					<motion.h1
						variants={fadeUp}
						className="mb-6 text-4xl font-medium tracking-tight text-primary md:text-5xl lg:text-6xl"
					>
						{t.titlePrefix}{" "}
						<span className="text-secondary">
							{t.titleHighlight}
						</span>
					</motion.h1>

					{/* Description */}
					<motion.p
						variants={fadeUp}
						className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-black md:text-xl"
					>
						{t.description}
					</motion.p>

					{/* Stats */}
					<motion.div
						variants={fadeUp}
						className="flex flex-wrap items-center justify-center gap-8 text-sm text-primary"
					>
						<div className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-primary" />
							<span>
								{t.updatedRegularly}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<BookOpen className="h-5 w-5 text-primary" />
							<span>
								{t.expertArticles}
							</span>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
