"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { ImageComponent } from "@/components/common/image-component";
import type { IProjectPartnerLogo } from "@/models/patenschaftsprojekt-page.model";

interface ProjectPartnersCarouselProps {
	heading?: string;
	logos: IProjectPartnerLogo[];
}

export function ProjectPartnersCarousel({
	heading,
	logos,
}: ProjectPartnersCarouselProps) {
	if (!logos || logos.length === 0) return null;

	return (
		<section className="w-full bg-white border-y border-border/40 py-10 lg:py-14">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{heading && (
					<p className="text-center text-sm tracking-wide text-foreground/50 font-medium mb-8">
						{heading}
					</p>
				)}
				<Swiper
					modules={[Autoplay]}
					spaceBetween={40}
					slidesPerView={1}
					loop={logos.length > 3}
					autoplay={{
						delay: 2500,
						disableOnInteraction: false,
						pauseOnMouseEnter: true,
					}}
					speed={600}
					breakpoints={{
						480: { slidesPerView: 2, spaceBetween: 40 },
						1024: { slidesPerView: 3, spaceBetween: 48 },
					}}
				>
					{logos.map((logo, index) => (
						<SwiperSlide key={index}>
							{logo.href ? (
								<a
									href={logo.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center h-36 px-6 opacity-80 hover:opacity-100 transition-opacity duration-300"
									title={logo.name}
								>
									{logo.image && (
										<img
											src={logo.image}
											alt={logo.name || `Partner ${index + 1}`}
											className="max-h-28 max-w-full w-auto h-auto object-contain"
										/>
									)}
								</a>
							) : (
								<div
									className="flex items-center justify-center h-36 px-6 opacity-80 hover:opacity-100 transition-opacity duration-300"
									title={logo.name}
								>
									{logo.image && (
										<img
											src={logo.image}
											alt={logo.name || `Partner ${index + 1}`}
											className="max-h-28 max-w-full w-auto h-auto object-contain"
										/>
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
