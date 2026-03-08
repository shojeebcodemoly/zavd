"use client";

import { motion } from "framer-motion";
import { HelpCircle, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { IFAQHeroSection } from "@/models/faq-page.model";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";

interface FAQHeroClientProps {
	data: IFAQHeroSection;
}

export function FAQHeroClient({ data }: FAQHeroClientProps) {
	// Set navbar to dark-hero variant for transparent navbar on dark background
	useSetNavbarVariant("dark-hero");

	const validStats = (data.stats || []).filter((s) => s.value);

	return (
		<section className="relative w-full overflow-hidden bg-secondary text-white padding-top pb-20">
			{/* Animated Geometric Background */}
			<div className="absolute inset-0 opacity-10">
				<svg
					className="absolute w-full h-full"
					viewBox="0 0 1440 560"
					fill="none"
					preserveAspectRatio="xMidYMid slice"
				>
					<motion.path
						d="M-100 300 Q 200 100, 400 300 T 800 300 T 1200 300 T 1600 300"
						stroke="currentColor"
						strokeWidth="1"
						fill="none"
						className="text-primary"
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: 1, opacity: 0.6 }}
						transition={{ duration: 2, ease: "easeInOut" }}
					/>
					<motion.path
						d="M-100 400 Q 300 200, 500 400 T 900 400 T 1300 400 T 1700 400"
						stroke="currentColor"
						strokeWidth="1"
						fill="none"
						className="text-white"
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: 1, opacity: 0.4 }}
						transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
					/>
					<motion.path
						d="M-100 200 Q 150 50, 350 200 T 750 200 T 1150 200 T 1550 200"
						stroke="currentColor"
						strokeWidth="1"
						fill="none"
						className="text-primary"
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: 1, opacity: 0.3 }}
						transition={{ duration: 3, ease: "easeInOut", delay: 0.6 }}
					/>
				</svg>
			</div>

			<div className="_container relative z-10">
				{/* Breadcrumb */}
				<motion.nav
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="mb-8 flex items-center gap-2 text-sm"
					aria-label="Breadcrumb"
				>
					<Link
						href="/"
						className="flex items-center gap-1 text-white/70 hover:text-primary transition-colors"
					>
						<Home className="h-4 w-4" />
						<span>Hem</span>
					</Link>
					<ChevronRight className="h-4 w-4 text-white/50" />
					<span className="text-white font-medium">FAQ</span>
				</motion.nav>

				{/* Hero Content */}
				<div className="max-w-4xl mx-auto text-center">
					{/* Badge */}
					{data.badge && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
						>
							<HelpCircle className="h-5 w-5 text-primary" />
							<span className="text-sm font-semibold text-white">
								{data.badge}
							</span>
						</motion.div>
					)}

					{/* Title */}
					{(data.title || data.titleHighlight) && (
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
						>
							{data.title}{" "}
							{data.titleHighlight && (
								<span className="text-primary">{data.titleHighlight}</span>
							)}
						</motion.h1>
					)}

					{/* Description */}
					{data.subtitle && (
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
						>
							{data.subtitle}
						</motion.p>
					)}

					{/* Stats */}
					{validStats.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
						>
							{validStats.map((stat, index) => (
								<div
									key={index}
									className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${
										validStats.length === 3 && index === 2
											? "col-span-2 sm:col-span-1"
											: ""
									}`}
								>
									<div className="text-3xl font-bold text-primary mb-1">
										{stat.value}
									</div>
									{stat.label && (
										<div className="text-sm text-white/70">{stat.label}</div>
									)}
								</div>
							))}
						</motion.div>
					)}
				</div>
			</div>
		</section>
	);
}
