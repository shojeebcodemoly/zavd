"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface HeroBannerProps {
	image: string;
	tag: string;
	title: string;
	subtitle: string;
	breadcrumbs: BreadcrumbItem[];
}

export function HeroBanner({ image, tag, title, subtitle, breadcrumbs }: HeroBannerProps) {
	return (
		<section className="relative h-[500px] md:h-[580px] overflow-hidden">
			{/* Ken Burns image animation */}
			<motion.div
				className="absolute inset-0"
				initial={{ scale: 1, x: 0 }}
				animate={{ scale: 1.12, x: -30 }}
				transition={{ duration: 10, ease: "easeOut" }}
			>
				<Image
					src={image}
					alt={title}
					fill
					className="object-cover"
					priority
				/>
			</motion.div>

			{/* Left-heavy gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

			{/* Content — bottom left */}
			<div className="absolute inset-0 flex items-end pb-16 md:pb-20">
				<div className="_container">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className="max-w-2xl"
					>
						{/* Tag */}
						<motion.span
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-5"
						>
							<span className="w-5 h-px bg-primary" />
							{tag}
						</motion.span>

						{/* Title */}
						<h1 className="text-5xl md:text-7xl font-extrabold text-white leading-none mb-5 tracking-tight">
							{title}
						</h1>

						{/* Subtitle with left border */}
						<p className="text-white/70 text-sm md:text-base max-w-xl leading-relaxed border-l-2 border-primary/60 pl-4 mb-5">
							{subtitle}
						</p>

						{/* Breadcrumb */}
						<nav className="flex items-center gap-2 text-xs text-white/50">
							{breadcrumbs.map((crumb, i) => (
								<span key={i} className="flex items-center gap-2">
									{i > 0 && <span className="text-white/30">/</span>}
									{crumb.href ? (
										<Link href={crumb.href} className="hover:text-white transition-colors">
											{crumb.label}
										</Link>
									) : (
										<span className="text-white/80">{crumb.label}</span>
									)}
								</span>
							))}
						</nav>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
