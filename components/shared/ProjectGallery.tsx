"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageComponent } from "@/components/common/image-component";
import type { IGalleryImage } from "@/models/patenschaftsprojekt-page.model";
import type { Swiper as SwiperType } from "swiper";

interface ProjectGalleryProps {
	title?: string;
	subtitle?: string;
	images: IGalleryImage[];
}

const headingVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function ProjectGallery({ title, subtitle, images }: ProjectGalleryProps) {
	const swiperRef = useRef<SwiperType | null>(null);

	if (!images || images.length === 0) return null;

	return (
		<section className="py-16 md:py-24 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Heading */}
				{(title || subtitle) && (
					<motion.div
						className="text-center mb-12"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-80px" }}
						variants={headingVariants}
					>
						{title && (
							<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
								{title}
							</h2>
						)}
						{subtitle && (
							<p className="text-slate-500 text-lg max-w-2xl mx-auto">
								{subtitle}
							</p>
						)}
						<div className="mt-5 mx-auto w-16 h-1 bg-primary rounded-full" />
					</motion.div>
				)}

				{/* Carousel wrapper */}
				<div className="relative">
					{/* Prev button */}
					<button
						onClick={() => swiperRef.current?.slidePrev()}
						className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
						aria-label="Previous"
					>
						<ChevronLeft className="w-5 h-5" />
					</button>

					{/* Next button */}
					<button
						onClick={() => swiperRef.current?.slideNext()}
						className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
						aria-label="Next"
					>
						<ChevronRight className="w-5 h-5" />
					</button>

					<Swiper
						modules={[Navigation, Autoplay]}
						onSwiper={(swiper) => { swiperRef.current = swiper; }}
						spaceBetween={20}
						slidesPerView={1}
						loop={images.length > 3}
						speed={600}
						autoplay={{
							delay: 3000,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						}}
						breakpoints={{
							640: { slidesPerView: 2, spaceBetween: 20 },
							1024: { slidesPerView: 3, spaceBetween: 24 },
						}}
					>
						{images.map((img, index) => (
							<SwiperSlide key={index}>
								<div className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-100 shadow-sm">
									<ImageComponent
										src={img.url}
										alt={img.alt || `Gallery image ${index + 1}`}
										fill
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									{/* Hover overlay */}
									<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
									{/* Caption */}
									{img.caption && (
										<div className="absolute bottom-0 left-0 right-0 px-5 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
											<p className="text-white text-sm font-medium leading-snug">
												{img.caption}
											</p>
										</div>
									)}
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</section>
	);
}
