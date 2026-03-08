"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { ImageComponent } from "@/components/common/image-component";
import type { IImageDescriptionSection } from "@/models/about-page.model";

interface ImageDescriptionSectionProps {
	data: IImageDescriptionSection;
}

export function ImageDescriptionSection({ data }: ImageDescriptionSectionProps) {
	const validItems = (data.items || []).filter(
		(item) => item.image || item.title || item.description
	);

	if (validItems.length === 0) {
		return null;
	}

	return (
		<section
			className="py-16 md:py-24 lg:py-32 overflow-hidden"
			style={{ backgroundColor: data.backgroundColor || "#f5f0e8" }}
		>
			<motion.div
				variants={staggerContainer}
				initial="initial"
				whileInView="animate"
				viewport={{ once: true }}
				className="space-y-16 md:space-y-24 lg:space-y-32"
			>
				{validItems.map((item, index) => {
					// Alternate layout: even index = image left, odd index = image right
					const isImageLeft = index % 2 === 0;
					// Watermark position: opposite of image (right when image is left, left when image is right)
					const watermarkOnRight = isImageLeft;

					return (
						<motion.div
							key={index}
							variants={fadeUp}
							className="relative"
						>
							{/* Watermark Image - Positioned at viewport edge */}
							{item.watermarkImage && (
								<div
									className={`
										absolute top-1/2 -translate-y-1/2 pointer-events-none z-0
										w-[250px] md:w-[350px] lg:w-[450px] xl:w-[500px]
										opacity-100
										${watermarkOnRight
											? "right-0 xl:right-[5%] 2xl:right-[10%]"
											: "left-0 xl:left-[5%] 2xl:left-[10%]"
										}
									`}
								>
									<ImageComponent
										src={item.watermarkImage}
										alt=""
										width={500}
										height={500}
										className="w-full h-auto object-contain opacity-30"
									/>
								</div>
							)}

							{/* Content Container */}
							<div className="_container relative z-10">
								<div
									className={`
										grid gap-8 md:gap-12 lg:gap-16 items-center
										md:grid-cols-2
										${!isImageLeft ? "md:[direction:rtl]" : ""}
									`}
								>
									{/* Image */}
									<div className={`${!isImageLeft ? "md:[direction:ltr]" : ""}`}>
										{item.image && (
											<div className="relative overflow-hidden shadow-lg max-w-lg mx-auto md:mx-0">
												<ImageComponent
													src={item.image}
													alt={item.title || ""}
													width={600}
													height={400}
													className="w-full h-auto object-cover aspect-4/3"
												/>
											</div>
										)}
									</div>

									{/* Text Content */}
									<div className={`${!isImageLeft ? "md:[direction:ltr]" : ""} max-w-xl`}>
										{item.title && (
											<h3 className="text-2xl md:text-3xl lg:text-4xl font-medium text-secondary mb-4 md:mb-6 font-heading italic">
												{item.title}
											</h3>
										)}
										{item.description && (
											<p className="text-muted-foreground leading-relaxed text-sm md:text-base">
												{item.description}
											</p>
										)}
									</div>
								</div>
							</div>
						</motion.div>
					);
				})}
			</motion.div>
		</section>
	);
}
