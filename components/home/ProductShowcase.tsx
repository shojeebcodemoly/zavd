"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageComponent } from "@/components/common/image-component";
import type { IProductShowcaseSection } from "@/models/home-page.model";

interface ProductShowcaseProps {
	data: IProductShowcaseSection;
}

export function ProductShowcase({ data }: ProductShowcaseProps) {
	const products = data.products?.filter((p) => p.name) ?? [];

	if (products.length === 0) return null;

	return (
		<section className="section-padding bg-muted/20">
			<div className="_container">
				{/* Section Header */}
				<motion.div
					className="text-center mb-12"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					{data.title && (
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-medium text-secondary">
							{data.title}
						</h2>
					)}
					{data.subtitle && (
						<p className="mt-4 text-foreground/70 text-lg max-w-2xl mx-auto">
							{data.subtitle}
						</p>
					)}
				</motion.div>

				{/* Products Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
					{products.map((product, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="group bg-white rounded-2xl overflow-hidden border border-secondary/10 shadow-sm hover:shadow-md transition-shadow duration-300"
						>
							{/* Product Image */}
							<div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
								{product.image ? (
									<ImageComponent
										src={product.image}
										alt={product.name ?? "Product"}
										fill
										className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center">
										<span className="text-secondary/20 text-6xl font-heading">
											{product.name?.charAt(0)}
										</span>
									</div>
								)}
								{/* Status badge */}
								{product.status && (
									<span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
										{product.status}
									</span>
								)}
							</div>

							{/* Product Info */}
							<div className="p-5 space-y-3">
								{product.category && (
									<span className="text-xs font-semibold tracking-widest uppercase text-primary">
										{product.category}
									</span>
								)}
								{product.name && (
									<h3 className="text-lg font-heading font-medium text-secondary group-hover:text-primary transition-colors">
										{product.name}
									</h3>
								)}
								{product.description && (
									<p className="text-sm text-foreground/60 line-clamp-2">
										{product.description}
									</p>
								)}
								{product.href && (
									<Link
										href={product.href}
										className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all duration-200 pt-1"
									>
										Se produkt <ArrowRight className="h-4 w-4" />
									</Link>
								)}
							</div>
						</motion.div>
					))}
				</div>

				{/* CTA Button */}
				{data.ctaText && data.ctaHref && (
					<motion.div
						className="text-center mt-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<Button asChild variant="primary" size="lg" className="rounded-full px-8 h-12">
							<Link href={data.ctaHref}>
								{data.ctaText} <ArrowRight className="h-4 w-4 ml-2" />
							</Link>
						</Button>
					</motion.div>
				)}
			</div>
		</section>
	);
}
