"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Plain object type for serialized category data
interface CategoryData {
	_id?: string;
	name: string;
	slug: string;
	description?: string;
	image?: string;
	order?: number;
	isActive?: boolean;
}

interface ProductCategorySectionProps {
	badge?: string;
	title?: string;
	categories: CategoryData[];
}

export function ProductCategorySection({
	badge = "POPULAR CATEGORIES",
	title = "Explore Our Categories",
	categories,
}: ProductCategorySectionProps) {
	if (!categories || categories.length === 0) return null;

	return (
		<section className="section-padding bg-white">
			<div className="_container">
				{/* Section Header */}
				<motion.div
					className="text-center mb-12"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					{badge && (
						<span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-primary mb-4">
							{badge}
						</span>
					)}
					{title && (
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-medium text-secondary">
							{title}
						</h2>
					)}
				</motion.div>

				{/* Category Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{categories.map((category, index) => (
						<motion.div
							key={category._id || index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{
								duration: 0.6,
								delay: index * 0.15,
								ease: [0.25, 0.1, 0.25, 1]
							}}
						>
							<Link
								href={`/products/category/${category.slug}`}
								className="group relative block aspect-[4/5] overflow-hidden rounded-lg"
							>
								{/* Background Image with fade-in */}
								<motion.div
									className="absolute inset-0"
									initial={{ opacity: 0, scale: 1.1 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.8, delay: index * 0.1 }}
								>
									{category.image ? (
										<Image
											src={category.image}
											alt={category.name}
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-110"
											sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
										/>
									) : (
										<div className="absolute inset-0 bg-gradient-to-b from-amber-100 to-amber-300" />
									)}
								</motion.div>

								{/* Dark Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/80" />

								{/* Category Title with underline animation */}
								<div className="absolute bottom-0 left-0 right-0 p-6">
									<div className="inline-block">
										<h3 className="text-xl md:text-2xl font-heading font-medium text-white transition-transform duration-300 group-hover:translate-y-[-4px]">
											{category.name}
										</h3>
										{/* Animated underline - only visible on hover, matches text width */}
										<div className="h-[2px] mt-1 w-0 bg-primary transition-all duration-500 ease-out group-hover:w-full" />
									</div>
								</div>

								{/* Hover Border Effect */}
								<div className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-white/30 rounded-lg" />
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
