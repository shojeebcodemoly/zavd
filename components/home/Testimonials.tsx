"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { ImageComponent } from "../common/image-component";
import type { ITestimonialsSection } from "@/models/home-page.model";

interface TestimonialsProps {
	data: ITestimonialsSection;
	isEn?: boolean;
}

export function Testimonials({ data, isEn }: TestimonialsProps) {
	const items = (data?.testimonials ?? []).filter((t) => {
		const desc = (isEn ? t.descriptionEn : t.descriptionDe) || t.descriptionDe || t.descriptionEn;
		const title = (isEn ? t.titleEn : t.titleDe) || t.titleDe || t.titleEn;
		return desc || title;
	});
	const [active, setActive] = useState(0);

	if (items.length === 0) return null;

	const prev = () => setActive((i) => (i - 1 + items.length) % items.length);
	const next = () => setActive((i) => (i + 1) % items.length);
	const current = items[active];

	const sectionTitle = (isEn ? data?.titleEn : data?.titleDe) || data?.titleDe || data?.titleEn;
	const currentTitle = (isEn ? current.titleEn : current.titleDe) || current.titleDe || current.titleEn;
	const currentSubtitle = (isEn ? current.subtitleEn : current.subtitleDe) || current.subtitleDe || current.subtitleEn;
	const currentDescription = (isEn ? current.descriptionEn : current.descriptionDe) || current.descriptionDe || current.descriptionEn;

	return (
		<section className="w-full bg-white pt-16 pb-2 lg:pt-24 lg:pb-4 overflow-hidden">
			<div className="_container">

				{/* Section label */}
				{(sectionTitle || ((isEn ? data?.subtitleEn : data?.subtitleDe) || data?.subtitleDe || data?.subtitleEn)) && (
					<div className="flex items-center justify-center gap-3 mb-14">
						<span className="w-8 h-px bg-primary block" />
						<span className="text-primary text-xs font-bold tracking-[0.25em] uppercase">
							{sectionTitle || "Testimonials"}
						</span>
						<span className="w-8 h-px bg-primary block" />
					</div>
				)}

				<div className="max-w-4xl mx-auto">
					<div className="relative bg-slate-50 rounded-3xl px-8 py-12 md:px-16 md:py-14 shadow-sm border border-border/30">

						{/* Large quote icon */}
						<div className="absolute top-8 left-8 md:top-10 md:left-12 text-primary/10">
							<Quote className="w-16 h-16 fill-current" />
						</div>

						<div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">

							{/* Left: Avatar + info */}
							<div className="flex flex-col items-center gap-3 flex-shrink-0">
								<AnimatePresence mode="wait">
									<motion.div
										key={active + "-img"}
										initial={{ opacity: 0, scale: 0.85 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.85 }}
										transition={{ duration: 0.35 }}
									>
										{current.image ? (
											<div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md ring-4 ring-white">
												<ImageComponent
													src={current.image}
													alt={currentTitle || "Testimonial"}
													fill
													className="object-cover"
												/>
											</div>
										) : (
											<div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-4 ring-white shadow-md flex items-center justify-center">
												<span className="text-3xl font-bold text-primary/40">
													{currentTitle?.charAt(0) || "?"}
												</span>
											</div>
										)}
									</motion.div>
								</AnimatePresence>

								<AnimatePresence mode="wait">
									<motion.div
										key={active + "-name"}
										initial={{ opacity: 0, y: 6 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -6 }}
										transition={{ duration: 0.3 }}
										className="text-center"
									>
										{currentTitle && (
											<p className="text-sm font-bold text-secondary leading-tight">
												{currentTitle}
											</p>
										)}
										{currentSubtitle && (
											<p className="text-xs text-foreground/45 mt-1 leading-tight">
												{currentSubtitle}
											</p>
										)}
									</motion.div>
								</AnimatePresence>

								{/* Stars */}
								<div className="flex gap-0.5">
									{[...Array(5)].map((_, i) => (
										<span key={i} className="text-amber-400 text-sm">&#9733;</span>
									))}
								</div>
							</div>

							{/* Right: Quote */}
							<div className="flex-1 flex flex-col justify-between min-h-[120px]">
								<AnimatePresence mode="wait">
									<motion.p
										key={active + "-quote"}
										initial={{ opacity: 0, y: 14 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -14 }}
										transition={{ duration: 0.4, delay: 0.05 }}
										className="text-base md:text-lg lg:text-xl text-foreground/75 leading-relaxed font-medium italic"
									>
										&ldquo;{currentDescription}&rdquo;
									</motion.p>
								</AnimatePresence>

								{/* Navigation */}
								{items.length > 1 && (
									<div className="flex items-center gap-4 mt-8">
										<button onClick={prev} aria-label="Previous"
											className="w-10 h-10 rounded-full bg-white border border-border hover:border-primary hover:text-primary text-foreground/40 flex items-center justify-center shadow-sm transition-all duration-200">
											<ChevronLeft className="w-4 h-4" />
										</button>
										<button onClick={next} aria-label="Next"
											className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-sm hover:bg-primary/90 transition-all duration-200">
											<ChevronRight className="w-4 h-4" />
										</button>

										{/* Dots */}
										<div className="flex gap-1.5 ml-2">
											{items.map((_, i) => (
												<button
													key={i}
													onClick={() => setActive(i)}
													className={`h-1.5 rounded-full transition-all duration-300 ${
														i === active ? "bg-primary w-5" : "bg-foreground/20 w-1.5"
													}`}
												/>
											))}
										</div>

										{/* Counter */}
										<span className="text-xs text-foreground/30 ml-auto font-medium tabular-nums">
											{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

			</div>
		</section>
	);
}
