"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { IStoreInfoSection } from "@/models/store-page.model";
import { ImageComponent } from "@/components/common/image-component";

interface StoreInfoProps {
	data: IStoreInfoSection;
}

export function StoreInfo({ data }: StoreInfoProps) {
	return (
		<section className="section-padding bg-white">
			<div className="_container">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, margin: "-100px" }}
					variants={staggerContainer}
					className="grid gap-12 lg:grid-cols-2 items-center"
				>
					{/* Image */}
					{data.image && (
						<motion.div variants={fadeUp} className="relative">
							<div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
								<ImageComponent
									src={data.image}
									alt={data.title || "Our store"}
									fill
									className="object-cover"
								/>
							</div>
							{/* Decorative element */}
							<div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
							<div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary/10 rounded-xl -z-10" />
						</motion.div>
					)}

					{/* Content */}
					<motion.div variants={fadeUp} className="space-y-6">
						{/* Badge */}
						<div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
							<Sparkles className="h-4 w-4 text-primary" />
							<span className="text-sm font-semibold text-primary">
								About Our Store
							</span>
						</div>

						{/* Title */}
						{data.title && (
							<h2 className="text-3xl font-medium text-secondary md:text-4xl">
								{data.title}
							</h2>
						)}

						{/* Description */}
						{data.description && (
							<p className="text-lg text-muted-foreground leading-relaxed">
								{data.description}
							</p>
						)}

						{/* Features */}
						{data.features && data.features.length > 0 && (
							<ul className="space-y-3 pt-4">
								{data.features.map((feature, index) => (
									<li key={index} className="flex items-start gap-3">
										<div className="mt-1 flex-shrink-0 rounded-full bg-primary/10 p-1">
											<Check className="h-4 w-4 text-primary" />
										</div>
										<span className="text-foreground">{feature}</span>
									</li>
								))}
							</ul>
						)}
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
