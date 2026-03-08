"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Quote } from "lucide-react";
import type { ITestimonialsSection } from "@/models/home-page.model";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

interface TestimonialsProps {
	data: ITestimonialsSection;
}

export function Testimonials({ data }: TestimonialsProps) {
	// Filter out testimonials without required data
	const validTestimonials = (data?.testimonials ?? []).filter(
		(t) => t.quote && t.author
	);

	// Don't render if no valid testimonials
	if (validTestimonials.length === 0) {
		return null;
	}

	return (
		<section className="section-padding bg-secondary text-white overflow-hidden">
			<div className="_container">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
					{/* Header */}
					<div className="lg:col-span-1">
						{data?.title && (
							<h2 className="text-3xl md:text-4xl font-medium mb-6 font-heading">
								{data.title}
							</h2>
						)}
						{data?.subtitle && (
							<p className="text-white/80 text-lg mb-8">
								{data.subtitle}
							</p>
						)}
						<div className="flex gap-2">
							<div className="h-2 w-12 bg-primary rounded-full" />
							<div className="h-2 w-2 bg-primary/50 rounded-full" />
							<div className="h-2 w-2 bg-primary/50 rounded-full" />
						</div>
					</div>

					{/* Carousel */}
					<div className="lg:col-span-2">
						<Swiper
							modules={[Pagination, Autoplay]}
							spaceBetween={30}
							slidesPerView={1}
							breakpoints={{
								768: {
									slidesPerView: 2,
								},
							}}
							autoplay={{
								delay: 5000,
								disableOnInteraction: false,
							}}
							pagination={{
								clickable: true,
								bulletActiveClass: "bg-primary opacity-100",
								bulletClass:
									"inline-block h-2 w-2 rounded-full bg-white/30 mx-1 cursor-pointer transition-all",
							}}
							className="pb-12"
						>
							{validTestimonials.map((item, index) => (
								<SwiperSlide key={index}>
									<div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl h-full min-h-[280px] flex flex-col">
										<Quote className="h-8 w-8 text-primary mb-6 opacity-80" />
										<p className="text-lg leading-relaxed mb-6 grow">
											{`"${item.quote}"`}
										</p>
										<div className="flex items-center gap-4 mt-auto">
											<div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
												{(item.author || "?").charAt(0)}
											</div>
											<div>
												<div className="font-bold">{item.author}</div>
												{(item.role || item.company) && (
													<div className="text-sm text-white/70">
														{[item.role, item.company]
															.filter(Boolean)
															.join(", ")}
													</div>
												)}
											</div>
										</div>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			</div>
		</section>
	);
}
