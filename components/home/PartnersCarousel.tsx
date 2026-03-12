"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { ImageComponent } from "../common/image-component";
import type { IPartnersCarouselSection } from "@/models/home-page.model";

interface PartnersCarouselProps {
	data?: IPartnersCarouselSection;
}

export function PartnersCarousel({ data }: PartnersCarouselProps) {
	const logos = data?.logos || [];

	if (logos.length === 0) return null;

	return (
		<section className="w-full bg-white border-y border-border/40 py-10 lg:py-14">
			<div className="_container">
				{data?.heading && (
					<p className="text-center text-xs tracking-[0.2em] uppercase text-foreground/40 font-medium mb-8">
						{data.heading}
					</p>
				)}
				<Swiper
					modules={[Autoplay]}
					spaceBetween={48}
					slidesPerView={2}
					loop={logos.length > 4}
					autoplay={{
						delay: 0,
						disableOnInteraction: false,
						pauseOnMouseEnter: true,
					}}
					speed={3000}
					breakpoints={{
						480: { slidesPerView: 3, spaceBetween: 48 },
						768: { slidesPerView: 4, spaceBetween: 64 },
						1024: { slidesPerView: 4, spaceBetween: 80 },
						1280: { slidesPerView: 4, spaceBetween: 80 },
					}}
					className="partners-carousel"
				>
					{logos.map((logo, index) => (
						<SwiperSlide key={index}>
							{logo.href ? (
								<a
									href={logo.href}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex items-center justify-center h-16"
									title={logo.name}
								>
									{logo.image ? (
										<div className="relative h-12 w-full flex items-center justify-center opacity-90 group-hover:opacity-100 transition-all duration-300">
											<ImageComponent
												src={logo.image}
												alt={logo.name || "Partner logo"}
												height={48}
												width={140}
												className="max-h-full max-w-full object-contain"
											/>
										</div>
									) : (
										<span className="text-sm font-semibold text-foreground/40 group-hover:text-foreground transition-colors">
											{logo.name}
										</span>
									)}
								</a>
							) : (
								<div className="flex items-center justify-center h-16" title={logo.name}>
									{logo.image ? (
										<div className="relative h-12 w-full flex items-center justify-center opacity-90 transition-all duration-300">
											<ImageComponent
												src={logo.image}
												alt={logo.name || "Partner logo"}
												height={48}
												width={140}
												className="max-h-full max-w-full object-contain"
											/>
										</div>
									) : (
										<span className="text-sm font-semibold text-foreground/40">
											{logo.name}
										</span>
									)}
								</div>
							)}
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
}
