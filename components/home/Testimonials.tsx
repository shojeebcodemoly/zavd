"use client";

import { motion } from "framer-motion";
import { ImageComponent } from "../common/image-component";
import type { ITestimonialsSection } from "@/models/home-page.model";

interface TestimonialsProps {
	data: ITestimonialsSection;
}

export function Testimonials({ data }: TestimonialsProps) {
	const items = (data?.testimonials ?? []).filter(
		(t) => t.image || t.author || t.company
	);

	if (items.length === 0 && !data?.title && !data?.subtitle) return null;

	return (
		<section className="bg-white py-14 md:py-20">
			<div className="_container">
				{/* Header */}
				{(data?.title || data?.subtitle) && (
					<div className="text-center mb-12">
						{data?.title && (
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
								{data.title}
							</h2>
						)}
						{data?.subtitle && (
							<p className="text-gray-500 text-base max-w-xl mx-auto">
								{data.subtitle}
							</p>
						)}
					</div>
				)}

				{/* Logo Grid */}
				{items.length > 0 && (
					<div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 lg:gap-20">
						{items.map((item, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: i * 0.08 }}
								className="flex flex-col items-center gap-3 group cursor-default"
							>
								{item.image ? (
									<div className="flex items-center justify-center w-40 h-14 overflow-hidden transition-transform duration-300 group-hover:scale-105">
										<ImageComponent
											src={item.image}
											alt={item.author || item.company || "Partner"}
											width={160}
											height={56}
											className="object-contain max-h-14 w-auto"
											showLoader={false}
										/>
									</div>
								) : null}

								{(item.author || item.company) && (
									<p className="text-xs font-semibold text-gray-400 tracking-wide text-center group-hover:text-gray-600 transition-colors duration-200">
										{item.author || item.company}
									</p>
								)}
							</motion.div>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
