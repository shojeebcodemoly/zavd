"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { ContactInquiryForm } from "@/components/forms/ContactInquiryForm";
import type { IKontaktFormSection } from "@/models/kontakt-page.model";

interface AnimatedFormSectionProps {
	data: IKontaktFormSection;
	isEn?: boolean;
}

export function AnimatedFormSection({ data, isEn = false }: AnimatedFormSectionProps) {
	const heading = isEn ? (data.headingEn || data.headingDe) : (data.headingDe || data.headingEn);
	const title = isEn ? (data.titleEn || data.titleDe) : (data.titleDe || data.titleEn);
	const subtitle = isEn ? (data.subtitleEn || data.subtitleDe) : (data.subtitleDe || data.subtitleEn);

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
		>
			<div className="mb-8 text-center">
				{heading && (
					<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5">
						<Send className="h-4 w-4 text-secondary" />
						<span className="text-sm font-semibold text-secondary">
							{heading}
						</span>
					</div>
				)}
				<h2 className="mb-4 text-3xl font-medium text-secondary md:text-4xl">
					{title}
				</h2>
				<p className="text-lg text-foreground/70">{subtitle}</p>
			</div>
			<ContactInquiryForm />
		</motion.div>
	);
}
