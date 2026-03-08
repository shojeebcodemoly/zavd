"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { PreviewEditor } from "@/components/common/TextEditor";
import type { AccordionSection, HeroSettings } from "@/types";
import { cn } from "@/lib/utils/cn";

interface ProductAccordionProps {
	title: string;
	shortDescription?: string;
	sections: AccordionSection[];
	heroSettings?: HeroSettings | null;
}

/**
 * Product Accordion Component
 * Tillamook-inspired design with dark theme box and collapsible sections
 * Multiple accordions can be open at the same time
 */
export function ProductAccordion({
	title,
	shortDescription,
	sections,
	heroSettings,
}: ProductAccordionProps) {
	// Initialize with first section open, or sections marked as isOpen
	const getInitialOpenSections = () => {
		const openSections = new Set<number>();
		sections.forEach((section, index) => {
			if (section.isOpen) {
				openSections.add(index);
			}
		});
		// If no sections are marked as open, open the first one
		if (openSections.size === 0 && sections.length > 0) {
			openSections.add(0);
		}
		return openSections;
	};

	const [openSections, setOpenSections] = useState<Set<number>>(
		getInitialOpenSections
	);

	const themeColor = heroSettings?.themeColor || "#1e3a5f";

	const toggleSection = (index: number) => {
		setOpenSections((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(index)) {
				newSet.delete(index);
			} else {
				newSet.add(index);
			}
			return newSet;
		});
	};

	const isOpen = (index: number) => openSections.has(index);

	return (
		<section
			className="w-full py-8 md:py-12"
			style={{ backgroundColor: "#FFF8E7" }}
		>
			<div className="_container max-w-4xl">
				{/* Dark themed info box with arrow pointer */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="relative"
				>
					{/* Arrow pointer at top */}
					<div
						className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0"
						style={{
							borderLeft: "16px solid transparent",
							borderRight: "16px solid transparent",
							borderBottom: `16px solid ${themeColor}`,
						}}
					/>

					{/* Info box */}
					<div
						className="rounded-3xl px-6 py-8 md:px-12 md:py-10 text-white text-center"
						style={{ backgroundColor: themeColor }}
					>
						<p className="text-xs md:text-sm font-bold uppercase tracking-widest mb-2 text-white/70">
							{title}
						</p>
						{shortDescription && (
							<h2 className="text-2xl md:text-3xl font-light">
								{shortDescription}
							</h2>
						)}
					</div>
				</motion.div>

				{/* Accordion sections */}
				{sections && sections.length > 0 && (
					<div className="mt-4 space-y-2">
						{sections.map((section, index) => (
							<motion.div
								key={section._id || index}
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className={cn(
									"border-b border-gray-200 bg-white rounded-lg overflow-hidden",
									isOpen(index) && "shadow-md"
								)}
							>
								{/* Accordion header */}
								<button
									type="button"
									onClick={() => toggleSection(index)}
									className="w-full flex items-center justify-center gap-3 py-4 px-6 text-center hover:bg-gray-50 transition-colors"
									aria-expanded={isOpen(index)}
								>
									<span className="text-sm md:text-base font-bold uppercase tracking-wider text-primary">
										{section.title}
									</span>
									<motion.div
										animate={{ rotate: isOpen(index) ? 180 : 0 }}
										transition={{ duration: 0.3 }}
									>
										<ChevronDown
											className={cn(
												"w-5 h-5 transition-colors",
												isOpen(index) ? "text-primary" : "text-gray-400"
											)}
										/>
									</motion.div>
								</button>

								{/* Accordion content */}
								<AnimatePresence initial={false}>
									{isOpen(index) && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3, ease: "easeInOut" }}
											className="overflow-hidden"
										>
											<div className="px-6 pb-6 text-center">
												{section.content.startsWith("<") ? (
													<PreviewEditor
														content={section.content}
														className="prose prose-sm md:prose-base max-w-none text-gray-700"
													/>
												) : (
													<p className="text-lg md:text-xl text-gray-800">
														{section.content}
													</p>
												)}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
