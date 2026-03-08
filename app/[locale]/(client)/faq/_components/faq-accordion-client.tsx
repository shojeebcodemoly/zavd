"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import type { IFAQItem } from "@/models/faq-page.model";

interface FAQAccordionClientProps {
	items: IFAQItem[];
	searchPlaceholder?: string;
	noResultsText?: string;
	helpText?: string;
	helpButtonText?: string;
	helpButtonHref?: string;
}

export function FAQAccordionClient({
	items,
	searchPlaceholder,
	noResultsText,
	helpText,
	helpButtonText,
	helpButtonHref,
}: FAQAccordionClientProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(0);
	const [searchQuery, setSearchQuery] = useState("");

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	// Filter FAQs based on search query
	const filteredFAQs = items.filter(
		(faq) =>
			(faq.question?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
			(faq.answer?.toLowerCase() || "").includes(searchQuery.toLowerCase())
	);

	return (
		<div className="w-full">
			{/* Search Bar */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="mb-8"
			>
				<div className="relative">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary/40" />
					<input
						type="text"
						placeholder={searchPlaceholder || "Sök efter frågor..."}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-12 pr-4 py-4 rounded-md border border-secondary/20 bg-white/80 backdrop-blur-sm text-secondary placeholder:text-secondary/40 focus:outline-none focus:border-primary/50 transition-all duration-300"
					/>
				</div>
			</motion.div>

			{/* FAQ Items */}
			<div className="space-y-4">
				{filteredFAQs.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12 text-secondary/60"
					>
						<p className="text-lg">
							{noResultsText ||
								"Inga frågor hittades. Försök med en annan sökning."}
						</p>
					</motion.div>
				) : (
					filteredFAQs.map((faq, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.05 }}
						>
							<div
								className={`
									rounded-md border transition-all duration-300 overflow-hidden
									${
										openIndex === index
											? "border-[#DBA480] bg-[#DBA480] shadow-sm"
											: "border-secondary/20 bg-white/80 backdrop-blur-sm hover:border-primary/20"
									}
								`}
							>
								{/* Question Button */}
								<button
									onClick={() => toggleFAQ(index)}
									className="w-full px-4 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-3 text-left group cursor-pointer"
									aria-expanded={openIndex === index}
									aria-controls={`faq-answer-${index}`}
								>
									<span className={`font-semibold text-base sm:text-lg flex-1 leading-snug wrap-break-word ${
										openIndex === index ? "text-white" : "text-secondary"
									}`}>
										{faq.question}
									</span>
									<motion.div
										animate={{
											rotate: openIndex === index ? 180 : 0,
										}}
										transition={{ duration: 0.3, ease: "easeInOut" }}
										className="shrink-0 mt-1"
									>
										<ChevronDown
											className={`h-6 w-6 transition-colors duration-300 ${
												openIndex === index
													? "text-white"
													: "text-secondary/40 group-hover:text-primary"
											}`}
										/>
									</motion.div>
								</button>

								{/* Answer */}
								<AnimatePresence>
									{openIndex === index && (
										<motion.div
											id={`faq-answer-${index}`}
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{
												duration: 0.3,
												ease: "easeInOut",
											}}
											className="overflow-hidden"
										>
											<div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
												<div className="border-t border-white/20 pt-3 sm:pt-4">
													<p className="text-white/90 leading-relaxed">
														{faq.answer}
													</p>
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					))
				)}
			</div>

			{/* Help Text */}
			{filteredFAQs.length > 0 && (helpText || helpButtonText) && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="mt-12 text-center"
				>
					{helpText && (
						<p className="text-secondary/60 mb-4">{helpText}</p>
					)}
					{helpButtonText && helpButtonHref && (
						<a
							href={helpButtonHref}
							className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-primary text-white font-semibold hover:bg-secondary transition-all duration-300 shadow-sm hover:shadow-md"
						>
							{helpButtonText}
						</a>
					)}
				</motion.div>
			)}
		</div>
	);
}
