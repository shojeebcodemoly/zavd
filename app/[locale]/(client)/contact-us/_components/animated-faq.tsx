"use client";

import { motion } from "framer-motion";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import type { IKontaktFaqSection } from "@/models/kontakt-page.model";

interface AnimatedFAQProps {
	data: IKontaktFaqSection;
}

export function AnimatedFAQ({ data }: AnimatedFAQProps) {
	// Don't render if no FAQs
	if (!data.faqs || data.faqs.length === 0) {
		return null;
	}

	return (
		<section className="section-padding bg-muted">
			<div className="_container">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="mx-auto max-w-4xl text-center"
				>
					{data.badge && (
						<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5">
							<MessageCircle className="h-4 w-4 text-secondary" />
							<span className="text-sm font-semibold text-secondary">
								{data.badge}
							</span>
						</div>
					)}
					<h2 className="mb-4 text-3xl font-medium text-secondary md:text-4xl">
						{data.title}
					</h2>
					<p className="mb-12 text-lg text-foreground/70">{data.subtitle}</p>
				</motion.div>

				<div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
					{data.faqs.map((faq, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: index * 0.1 }}
							className="group rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-secondary/30"
						>
							<div className="mb-3 flex items-start gap-3">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-all duration-300 group-hover:bg-secondary group-hover:text-white">
									<CheckCircle2 className="h-5 w-5" />
								</div>
								<h3 className="font-medium text-secondary">{faq.question}</h3>
							</div>
							<p className="pl-11 text-sm text-foreground/70">{faq.answer}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
