"use client";

import { motion } from "framer-motion";

interface ProductLongDescriptionProps {
	description: string;
}

export function ProductLongDescription({
	description,
}: ProductLongDescriptionProps) {
	return (
		<motion.section
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-100px" }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="mb-12"
			id="about"
		>
			<h2 className="text-2xl md:text-3xl font-medium text-secondary mb-6">
				Om Produkten
			</h2>
			<div className="p-4 sm:p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
				<div className="prose prose-slate prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 overflow-wrap-anywhere">
					<div
						className="leading-relaxed wrap-break-word overflow-wrap-anywhere [&>p]:mb-4 [&>p]:wrap-break-word [&>ul]:space-y-2 [&>ul]:list-disc [&>ul]:pl-5 [&>h3]:text-lg [&>h3]:sm:text-xl [&>h3]:font-semibold [&>h3]:font-sans [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:wrap-break-word [&>h4]:text-base [&>h4]:sm:text-lg [&>h4]:font-medium [&>h4]:font-sans [&>h4]:mt-4 [&>h4]:mb-2 [&>h4]:wrap-break-word [&_a]:break-all [&_strong]:wrap-break-word"
						dangerouslySetInnerHTML={{ __html: description }}
					/>
				</div>
			</div>
		</motion.section>
	);
}
