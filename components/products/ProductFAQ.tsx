"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { PreviewEditor } from "@/components/common/TextEditor";

interface ProductFAQProps {
	faqs: Array<{
		question: string;
		answer: string;
		visible: boolean;
		_id: string;
	}>;
}

/**
 * ProductFAQ Component
 *
 * Accordion-style FAQ section with:
 * - Smooth expand/collapse animations
 * - Glassmorphism card design
 * - One item open at a time
 * - Keyboard accessible
 */
export function ProductFAQ({ faqs }: ProductFAQProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	if (!faqs || faqs.length === 0) return null;

	return (
		<section className="py-16 md:py-24">
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
						<HelpCircle className="h-4 w-4" />
						<span className="text-sm font-semibold">Vanliga frågor</span>
					</div>
					<h2 className="text-3xl md:text-4xl font-medium text-secondary mb-4">
						Frågor & Svar
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Här hittar du svar på de vanligaste frågorna om produkten
					</p>
				</motion.div>

				{/* FAQ Accordion */}
				<div className="max-w-3xl mx-auto space-y-4">
					{faqs
						.filter((faq) => faq.visible)
						.map((faq, index) => (
							<motion.div
								key={faq._id}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
							>
								<div
									className={`
									rounded-2xl border transition-all duration-300
									${
										openIndex === index
											? "border-primary bg-card/80 backdrop-blur-sm shadow-lg"
											: "border-primary bg-card/50 backdrop-blur-sm hover:border-primary/50"
									}
								`}
								>
									{/* Question Button */}
									<button
										onClick={() => toggleFAQ(index)}
										className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left"
										aria-expanded={openIndex === index}
										aria-controls={`faq-answer-${faq._id}`}
									>
										<span className="font-semibold text-foreground text-lg flex-1 cursor-pointer">
											{faq.question}
										</span>
										<motion.div
											animate={{
												rotate: openIndex === index ? 180 : 0,
											}}
											transition={{ duration: 0.3 }}
											className="shrink-0 mt-1"
										>
											<ChevronDown
												className={`h-5 w-5 transition-colors ${
													openIndex === index
														? "text-primary"
														: "text-muted-foreground"
												}`}
											/>
										</motion.div>
									</button>

									{/* Answer */}
									<AnimatePresence>
										{openIndex === index && (
											<motion.div
												id={`faq-answer-${faq._id}`}
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.3 }}
												className="overflow-hidden"
											>
												<div className="px-6 pb-5 pt-0">
													<div className="prose prose-sm max-w-none text-muted-foreground border-t border-slate-300 pt-4">
														<PreviewEditor>{faq.answer}</PreviewEditor>
													</div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</motion.div>
						))}
				</div>

				{/* Contact CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="mt-12 text-center"
				>
					<p className="text-muted-foreground mb-4">
						Hittade du inte svar på din fråga?
					</p>
					<a
						href="/contact-us"
						className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
					>
						Kontakta oss
					</a>
				</motion.div>
			</div>
		</section>
	);
}
