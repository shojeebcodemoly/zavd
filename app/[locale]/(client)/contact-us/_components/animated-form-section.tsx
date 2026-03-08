"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { ContactInquiryForm } from "@/components/forms/ContactInquiryForm";
import type { IKontaktFormSection } from "@/models/kontakt-page.model";

interface AnimatedFormSectionProps {
	data: IKontaktFormSection;
}

export function AnimatedFormSection({ data }: AnimatedFormSectionProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
		>
			<div className="mb-8 text-center">
				{data.badge && (
					<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5">
						<Send className="h-4 w-4 text-secondary" />
						<span className="text-sm font-semibold text-secondary">
							{data.badge}
						</span>
					</div>
				)}
				<h2 className="mb-4 text-3xl font-medium text-secondary md:text-4xl">
					{data.title}
				</h2>
				<p className="text-lg text-foreground/70">{data.subtitle}</p>
			</div>
			<ContactInquiryForm />
		</motion.div>
	);
}
