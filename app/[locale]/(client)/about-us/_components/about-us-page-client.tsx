"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { Mail, Linkedin, Phone, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { ImageComponent } from "@/components/common/image-component";
import type { AboutPageData } from "@/lib/repositories/about-page.repository";
import type { KontaktPageData } from "@/lib/repositories/kontakt-page.repository";
import type { SiteSettingsData } from "@/lib/repositories/site-settings.repository";
import type { IOffice } from "@/models/site-settings.model";
import { AnimatedFormSection } from "../../contact-us/_components/animated-form-section";
import { AnimatedOfficeLocations } from "../../contact-us/_components/animated-office-locations";
import { ImageDescriptionSection } from "./image-description-section";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

/**
 * Animated Counter Component
 */
function AnimatedCounter({ value, className, style }: { value: string; className?: string; style?: React.CSSProperties }) {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	// Parse the value to extract number and suffix
	const parseValue = (val: string): { number: number; prefix: string; suffix: string } => {
		// Handle values like "4K+", "87", "236", "1.5M", etc.
		const match = val.match(/^([^\d]*)(\d+(?:\.\d+)?)([^\d]*)$/);
		if (match) {
			return {
				prefix: match[1] || "",
				number: parseFloat(match[2]),
				suffix: match[3] || "",
			};
		}
		// Handle values like "4K+" where K is part of the number
		const kMatch = val.match(/^([^\d]*)(\d+(?:\.\d+)?)\s*([KkMm]?\+?)$/);
		if (kMatch) {
			return {
				prefix: kMatch[1] || "",
				number: parseFloat(kMatch[2]),
				suffix: kMatch[3] || "",
			};
		}
		return { prefix: "", number: 0, suffix: val };
	};

	const { prefix, number, suffix } = parseValue(value);

	const motionValue = useMotionValue(0);
	const springValue = useSpring(motionValue, {
		damping: 50,
		stiffness: 100,
	});

	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		if (isInView) {
			motionValue.set(number);
		}
	}, [isInView, motionValue, number]);

	useEffect(() => {
		const unsubscribe = springValue.on("change", (latest) => {
			// If the number is an integer, display as integer, otherwise with 1 decimal
			if (Number.isInteger(number)) {
				setDisplayValue(Math.floor(latest));
			} else {
				setDisplayValue(Math.round(latest * 10) / 10);
			}
		});
		return unsubscribe;
	}, [springValue, number]);

	return (
		<span ref={ref} className={className} style={style}>
			{prefix}{displayValue}{suffix}
		</span>
	);
}

/**
 * Convert YouTube URL to embed URL
 */
function getYouTubeEmbedUrl(url: string): string | null {
	// Handle different YouTube URL formats
	const regexes = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
		/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
	];

	for (const regex of regexes) {
		const match = url.match(regex);
		if (match && match[1]) {
			return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
		}
	}
	return null;
}

interface AboutUsPageClientProps {
	data: AboutPageData;
	kontaktData: KontaktPageData;
	siteSettings: SiteSettingsData;
	offices: IOffice[];
}

export function AboutUsPageClient({
	data,
	kontaktData,
	siteSettings,
	offices,
}: AboutUsPageClientProps) {
	// Set navbar variant
	useSetNavbarVariant("default");

	// Video modal state
	const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

	// Gallery lightbox state
	const [selectedGalleryImage, setSelectedGalleryImage] = useState<number | null>(null);

	// Gallery Swiper ref
	const gallerySwiperRef = useRef<SwiperType | null>(null);

	const visibility = data.sectionVisibility || {
		history: true,
		customers: true,
		video: true,
		gallery: true,
		team: true,
		contact: true,
		stats: true,
		imageDescription: true,
	};

	// Get gallery data directly from data object
	const galleryData = data.gallery;

	// Check if we have content to display
	const hasHistory =
		data.history?.title ||
		data.history?.subtitle ||
		(data.history?.timelineItems && data.history.timelineItems.length > 0);
	const hasCustomers =
		data.customers?.title ||
		(data.customers?.customers && data.customers.customers.length > 0);
	const hasVideo =
		data.video?.backgroundImage || data.video?.titleHighlighted || data.video?.titleNormal;
	const hasGallery =
		galleryData?.title || (galleryData?.images && galleryData.images.length > 0);
	const hasTeam =
		data.team?.title ||
		(data.team?.members && data.team.members.length > 0);
	const hasContact =
		data.contact?.title || data.contact?.showContactForm || data.contact?.showOffices;
	const hasStats =
		data.stats?.items && data.stats.items.length > 0;
	const hasImageDescription =
		data.imageDescription?.items && data.imageDescription.items.length > 0;

	const validTimelineItems = (data.history?.timelineItems || []).filter(
		(item) => item.year || item.title
	);
	const validCustomers = (data.customers?.customers || []).filter(
		(c) => c.name
	);
	const validTeamMembers = (data.team?.members || []).filter(
		(m) => m.name && m.role
	);
	const validGalleryImages = (galleryData?.images || []).filter(
		(img) => img.src
	);
	const validStatItems = (data.stats?.items || []).filter(
		(item) => item.value && item.label
	);


	return (
		<div className="min-h-screen bg-background">
			{/* History Section - Timeline Design */}
			{visibility.history && hasHistory && (
				<section className="py-20 md:py-28 lg:py-32 bg-background relative overflow-hidden">
					<div className="_container relative z-10">
						{/* Section Header */}
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-center mb-20"
						>
							{data.history?.badge && (
								<motion.p
									variants={fadeUp}
									className="text-primary italic text-2xl md:text-3xl mb-2 font-heading"
								>
									{data.history.badge}
								</motion.p>
							)}
							{data.history?.title && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl lg:text-5xl font-medium text-secondary uppercase tracking-[0.2em] mb-4"
								>
									{data.history.title}
								</motion.h2>
							)}
							{data.history?.subtitle && (
								<motion.p
									variants={fadeUp}
									className="text-muted-foreground max-w-2xl mx-auto"
								>
									{data.history.subtitle}
								</motion.p>
							)}
						</motion.div>

						{/* Timeline */}
						{validTimelineItems.length > 0 && (
							<div className="relative">
								{/* Vertical Dashed Line */}
								<div
									className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden md:block"
									style={{
										width: "1px",
										backgroundImage: "linear-gradient(to bottom, #e5e7eb 50%, transparent 50%)",
										backgroundSize: "1px 8px",
									}}
								/>

								{validTimelineItems.map((item, index) => {
									const isEven = index % 2 === 0;
									// Even (0, 2, 4...): Image LEFT, Text RIGHT - line goes RIGHT
									// Odd (1, 3, 5...): Text LEFT, Image RIGHT - line goes LEFT
									return (
										<motion.div
											key={index}
											initial={{ opacity: 0, y: 50 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true }}
											transition={{ delay: index * 0.15 }}
											className="relative flex flex-col md:flex-row items-center mb-24 last:mb-0"
										>
											{/* Left Side */}
											<div className={`w-full md:w-[calc(50%-40px)] md:pr-8 order-2 md:order-1 ${!isEven ? "md:text-right" : ""}`}>
												{isEven ? (
													// Even rows: Image on left
													item.image ? (
														<div className="relative bg-background p-3 shadow-lg rounded-sm">
															<ImageComponent
																src={item.image}
																alt={item.title || "Timeline image"}
																width={500}
																height={350}
																className="w-full h-auto object-cover"
															/>
														</div>
													) : (
														<div className="relative bg-background p-3 shadow-lg rounded-sm">
															<div className="aspect-[4/3] bg-muted flex items-center justify-center">
																<svg className="w-16 h-16 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
																</svg>
															</div>
														</div>
													)
												) : (
													// Odd rows: Text on left (right-aligned)
													<>
														<p className="text-primary text-4xl md:text-5xl mb-3 font-heading italic">
															{item.year}
														</p>
														<h3 className="text-sm font-medium text-secondary uppercase tracking-[0.15em] mb-4">
															{item.title}
														</h3>
														{item.description && (
															<p className="text-muted-foreground leading-relaxed text-sm">
																{item.description}
															</p>
														)}
													</>
												)}
											</div>

											{/* Center Column - Dot with horizontal line going to text side */}
											<div className="hidden md:flex flex-col items-center justify-center order-2" style={{ width: "80px" }}>
												<div className="relative flex items-center">
													{/* The center dot */}
													<div className="w-3 h-3 rounded-full bg-primary z-10" />
													{/* Horizontal line - goes towards text side */}
													<div className={`absolute w-10 h-0.5 bg-primary ${isEven ? "left-3" : "right-3"}`} />
												</div>
											</div>

											{/* Right Side */}
											<div className={`w-full md:w-[calc(50%-40px)] md:pl-8 order-1 md:order-3 mb-6 md:mb-0`}>
												{isEven ? (
													// Even rows: Text on right (left-aligned)
													<>
														<p className="text-primary text-4xl md:text-5xl mb-3 font-heading italic">
															{item.year}
														</p>
														<h3 className="text-sm font-medium text-secondary uppercase tracking-[0.15em] mb-4">
															{item.title}
														</h3>
														{item.description && (
															<p className="text-muted-foreground leading-relaxed text-sm">
																{item.description}
															</p>
														)}
													</>
												) : (
													// Odd rows: Image on right
													item.image ? (
														<div className="relative bg-background p-3 shadow-lg rounded-sm">
															<ImageComponent
																src={item.image}
																alt={item.title || "Timeline image"}
																width={500}
																height={350}
																className="w-full h-auto object-cover"
															/>
														</div>
													) : (
														<div className="relative bg-background p-3 shadow-lg rounded-sm">
															<div className="aspect-[4/3] bg-muted flex items-center justify-center">
																<svg className="w-16 h-16 text-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
																</svg>
															</div>
														</div>
													)
												)}
											</div>
										</motion.div>
									);
								})}
							</div>
						)}
					</div>
				</section>
			)}

			{/* Video Section */}
			{visibility.video && hasVideo && (
				<section className="relative h-[600px] md:h-[700px] overflow-hidden">
					{/* Background Image */}
					{data.video?.backgroundImage && (
						<div className="absolute inset-0">
							<ImageComponent
								src={data.video.backgroundImage}
								alt="Video background"
								width={1920}
								height={1080}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black/30" />
						</div>
					)}

					{/* Content */}
					<div className="_container relative z-10 h-full flex flex-col items-center justify-center text-center">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="max-w-4xl"
						>
							{/* Title */}
							<h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-secondary mb-8">
								{data.video?.titleHighlighted && (
									<span className="bg-primary/80 px-3 py-1 text-secondary">
										{data.video.titleHighlighted}
									</span>
								)}
								{data.video?.titleNormal && (
									<span className="block mt-2">{data.video.titleNormal}</span>
								)}
							</h2>

							{/* Play Button */}
							{data.video?.videoUrl && (
								<motion.button
									onClick={() => setIsVideoModalOpen(true)}
									className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-background shadow-xl hover:scale-110 transition-transform duration-300 group cursor-pointer"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.95 }}
								>
									<svg
										className="w-8 h-8 text-secondary ml-1"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M8 5v14l11-7z" />
									</svg>
								</motion.button>
							)}

							{/* Button Label */}
							{data.video?.buttonLabel && (
								<p className="mt-6 text-secondary/80 italic font-heading text-lg">
									{data.video.buttonLabel}
								</p>
							)}
						</motion.div>
					</div>
				</section>
			)}

			{/* Our Customers Section */}
			{visibility.customers && hasCustomers && (
				<section className="py-16 md:py-20 lg:py-24 bg-muted">
					<div className="_container">
						{/* Section Header */}
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-center mb-12"
						>
							{data.customers?.title && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-medium text-secondary mb-4"
								>
									{data.customers.title}
								</motion.h2>
							)}
							{data.customers?.subtitle && (
								<motion.p
									variants={fadeUp}
									className="text-muted-foreground max-w-2xl mx-auto"
								>
									{data.customers.subtitle}
								</motion.p>
							)}
						</motion.div>

						{/* Customers Grid */}
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
						>
							{validCustomers.map((customer, index) => (
								<motion.div
									key={index}
									variants={fadeUp}
									className="bg-background rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-border"
								>
									{/* Customer Logo */}
									{customer.logo && (
										<div className="mb-4 h-20 flex items-center justify-center">
											<Image
												src={customer.logo}
												alt={customer.name || "Customer logo"}
												width={160}
												height={80}
												className="max-h-16 w-auto object-contain"
											/>
										</div>
									)}

									{/* Customer Name */}
									<h3 className="text-xl font-medium text-secondary mb-2">
										{customer.name}
									</h3>

									{/* Products They Purchase */}
									{customer.products && (
										<div className="mb-3">
											<p className="text-sm font-medium text-primary mb-1">
												Products they purchase:
											</p>
											<p className="text-muted-foreground text-sm">
												{customer.products}
											</p>
										</div>
									)}

									{/* Description */}
									{customer.description && (
										<p className="text-muted-foreground text-sm mb-4">
											{customer.description}
										</p>
									)}

									{/* Website Link */}
									{customer.website && (
										<a
											href={customer.website}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
										>
											Visit website
											<ExternalLink className="h-3 w-3" />
										</a>
									)}
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>
			)}

			{/* Gallery Section */}
			{visibility.gallery && hasGallery && (
				<section className="relative py-16 md:py-24 lg:py-32 overflow-hidden isolate">
					{/* Background - Image or Color */}
					{galleryData?.backgroundImage ? (
						<div className="absolute inset-0">
							<ImageComponent
								src={galleryData.backgroundImage}
								alt="Gallery background"
								width={1920}
								height={1080}
								className="w-full h-full object-cover"
							/>
						</div>
					) : (
						<div
							className="absolute inset-0"
							style={{ backgroundColor: galleryData?.backgroundColor || "#f5f0e8" }}
						/>
					)}

					<div className="relative z-10">
						{/* Header with title and navigation */}
						<div className="_container mb-10">
							<div className="flex items-start justify-between gap-8">
								{/* Title */}
								{galleryData?.title && (
									<motion.p
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										className="text-xl md:text-2xl lg:text-3xl text-secondary max-w-2xl leading-relaxed font-heading italic"
									>
										{galleryData.title}
									</motion.p>
								)}

								{/* Navigation Arrows */}
								{validGalleryImages.length > 3 && (
									<div className="flex gap-3 shrink-0">
										<button
											onClick={() => gallerySwiperRef.current?.slidePrev()}
											className="w-12 h-12 rounded-full border border-secondary/30 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
											aria-label="Previous images"
										>
											<ChevronLeft className="w-5 h-5" />
										</button>
										<button
											onClick={() => gallerySwiperRef.current?.slideNext()}
											className="w-12 h-12 rounded-full border border-secondary/30 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
											aria-label="Next images"
										>
											<ChevronRight className="w-5 h-5" />
										</button>
									</div>
								)}
							</div>
						</div>

						{/* Image Slider - Swiper with auto-slide */}
						{validGalleryImages.length > 0 && (
							<div className="w-full overflow-visible">
								{/* This wrapper ensures left edge aligns with container, right overflows */}
								<div
									className="overflow-visible"
									style={{
										marginLeft: "max(1rem, calc((100vw - 1280px) / 2 + 1rem))",
										paddingRight: "50vw",
										marginRight: "-50vw",
									}}
								>
									<Swiper
										modules={[Navigation, Autoplay]}
										onSwiper={(swiper) => {
											gallerySwiperRef.current = swiper;
										}}
										spaceBetween={20}
										slidesPerView={1.3}
										breakpoints={{
											640: { slidesPerView: 2.3 },
											768: { slidesPerView: 3.3 },
											1024: { slidesPerView: 4.3 },
										}}
										autoplay={{
											delay: 2000,
											disableOnInteraction: false,
											pauseOnMouseEnter: true,
										}}
										loop={validGalleryImages.length > 4}
										className="!overflow-visible"
										style={{ alignItems: "flex-start" }}
									>
										{validGalleryImages.map((image, index) => {
											// Alternating pattern: 0,2,4 = tall, 1,3,5 = short
											const isTall = index % 2 === 0;
											return (
												<SwiperSlide key={index} className="!h-auto">
													<motion.div
														initial={{ opacity: 0, y: 30 }}
														whileInView={{ opacity: 1, y: 0 }}
														viewport={{ once: true }}
														transition={{ delay: index * 0.1 }}
														className="cursor-pointer group"
														onClick={() => setSelectedGalleryImage(index)}
													>
														<div
															className={`relative overflow-hidden rounded-sm shadow-lg ${
																isTall
																	? "h-[400px] md:h-[480px] lg:h-[520px]"
																	: "h-[320px] md:h-[380px] lg:h-[420px]"
															}`}
														>
															<ImageComponent
																src={image.src!}
																alt={image.alt || `Gallery image ${index + 1}`}
																width={isTall ? 340 : 320}
																height={isTall ? 520 : 420}
																className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
															/>
														</div>
													</motion.div>
												</SwiperSlide>
											);
										})}
									</Swiper>
								</div>
							</div>
						)}
					</div>
				</section>
			)}

			{/* Our Team Section */}
			{visibility.team && hasTeam && (
				<section className="relative z-10 py-16 md:py-20 lg:py-24 bg-background">
					<div className="_container">
						{/* Section Header */}
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="text-center mb-16"
						>
							{data.team?.title && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-medium text-secondary mb-4"
								>
									{data.team.title}
								</motion.h2>
							)}
							{data.team?.subtitle && (
								<motion.p
									variants={fadeUp}
									className="text-muted-foreground max-w-2xl mx-auto"
								>
									{data.team.subtitle}
								</motion.p>
							)}
						</motion.div>

						{/* Team Grid - Circular Design */}
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="flex flex-wrap justify-center gap-12 md:gap-16 lg:gap-20"
						>
							{validTeamMembers.map((member, index) => (
								<motion.div
									key={index}
									variants={fadeUp}
									custom={index}
									className="flex flex-col items-center text-center"
								>
									{/* Circular Image Container */}
									<div className="relative mb-6">
										<div className="w-40 h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 rounded-full overflow-hidden border-4 border-white shadow-lg">
											{member.image ? (
												<ImageComponent
													src={member.image}
													alt={member.name || "Team member"}
													className="w-full h-full object-cover"
													height={208}
													width={208}
													wrapperClasses="w-full h-full"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center bg-muted">
													<span className="text-4xl font-bold text-primary/40">
														{(member.name || "?")
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</span>
												</div>
											)}
										</div>
									</div>

									{/* Info */}
									<div className="text-center">
										<h3 className="text-xl md:text-2xl font-medium text-secondary mb-1">
											{member.name}
										</h3>
										<p className="text-sm md:text-base text-muted-foreground">
											{member.role}
										</p>
									</div>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>
			)}

			{/* Stats Section - Number Counting */}
			{visibility.stats && hasStats && (
				<section
					className="py-20 md:py-28 lg:py-32"
					style={{ backgroundColor: data.stats?.backgroundColor || "#ffffff" }}
				>
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid gap-12 md:gap-16 lg:gap-20 sm:grid-cols-2 lg:grid-cols-3"
						>
							{validStatItems.map((item, index) => (
								<motion.div
									key={index}
									variants={fadeUp}
									className="flex flex-col items-center text-center"
								>
									{/* Image */}
									{item.image && (
										<div className="mb-8 h-[320px] md:h-[380px] lg:h-[420px] flex items-end justify-center">
											<ImageComponent
												src={item.image}
												alt={item.label || "Stat image"}
												width={400}
												height={400}
												className="max-h-full w-auto object-contain"
											/>
										</div>
									)}

									{/* Value - Large Number with Animation */}
									<h3 className="text-6xl md:text-7xl lg:text-8xl font-light text-secondary mb-2 font-heading">
										<AnimatedCounter value={item.value || "0"} />
									</h3>

									{/* Label */}
									<p className="text-lg md:text-xl text-secondary italic mb-4 font-heading">
										{item.label}
									</p>

									{/* Description */}
									{item.description && (
										<p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm">
											{item.description}
										</p>
									)}
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>
			)}

			{/* Image Description Section */}
			{visibility.imageDescription && hasImageDescription && (
				<ImageDescriptionSection data={data.imageDescription} />
			)}

			{/* Contact Section */}
			{visibility.contact && hasContact && (
				<section className="bg-muted">
					{/* Section Header */}
					{(data.contact?.title || data.contact?.subtitle) && (
						<div className="py-12 bg-background">
							<div className="_container">
								<motion.div
									variants={staggerContainer}
									initial="initial"
									whileInView="animate"
									viewport={{ once: true }}
									className="text-center"
								>
									{data.contact?.title && (
										<motion.h2
											variants={fadeUp}
											className="text-3xl md:text-4xl font-medium text-secondary mb-4"
										>
											{data.contact.title}
										</motion.h2>
									)}
									{data.contact?.subtitle && (
										<motion.p
											variants={fadeUp}
											className="text-muted-foreground max-w-2xl mx-auto"
										>
											{data.contact.subtitle}
										</motion.p>
									)}
								</motion.div>
							</div>
						</div>
					)}

					{/* Contact Form */}
					{data.contact?.showContactForm && (
						<div className="py-12 bg-background">
							<div className="_container">
								<div className="mx-auto max-w-3xl">
									<AnimatedFormSection data={kontaktData.formSection} />
								</div>
							</div>
						</div>
					)}

					{/* Office Locations */}
					{data.contact?.showOffices && offices.length > 0 && (
						<div className="py-12">
							<div className="_container overflow-hidden">
								<AnimatedOfficeLocations
									data={kontaktData.officeSection}
									addresses={offices}
								/>
							</div>
						</div>
					)}
				</section>
			)}

			{/* Video Modal */}
			<AnimatePresence>
				{isVideoModalOpen && data.video?.videoUrl && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
						onClick={() => setIsVideoModalOpen(false)}
					>
						{/* Close Button */}
						<button
							onClick={() => setIsVideoModalOpen(false)}
							className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
							aria-label="Close video"
						>
							<X className="w-10 h-10" />
						</button>

						{/* Video Container */}
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="relative w-full max-w-5xl aspect-video"
							onClick={(e) => e.stopPropagation()}
						>
							{getYouTubeEmbedUrl(data.video.videoUrl) ? (
								<iframe
									src={getYouTubeEmbedUrl(data.video.videoUrl)!}
									title="Video"
									className="w-full h-full rounded-lg"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowFullScreen
								/>
							) : (
								<div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
									<p className="text-white">Invalid video URL</p>
								</div>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Gallery Lightbox Modal */}
			<AnimatePresence>
				{selectedGalleryImage !== null && validGalleryImages[selectedGalleryImage] && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
						onClick={() => setSelectedGalleryImage(null)}
					>
						{/* Close Button */}
						<button
							onClick={() => setSelectedGalleryImage(null)}
							className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
							aria-label="Close image"
						>
							<X className="w-10 h-10" />
						</button>

						{/* Previous Button */}
						{selectedGalleryImage > 0 && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									setSelectedGalleryImage(selectedGalleryImage - 1);
								}}
								className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center text-white transition-colors z-10"
								aria-label="Previous image"
							>
								<ChevronLeft className="w-6 h-6" />
							</button>
						)}

						{/* Next Button */}
						{selectedGalleryImage < validGalleryImages.length - 1 && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									setSelectedGalleryImage(selectedGalleryImage + 1);
								}}
								className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center text-white transition-colors z-10"
								aria-label="Next image"
							>
								<ChevronRight className="w-6 h-6" />
							</button>
						)}

						{/* Image Container */}
						<motion.div
							key={selectedGalleryImage}
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="relative max-w-5xl max-h-[85vh]"
							onClick={(e) => e.stopPropagation()}
						>
							<ImageComponent
								src={validGalleryImages[selectedGalleryImage].src!}
								alt={validGalleryImages[selectedGalleryImage].alt || `Gallery image ${selectedGalleryImage + 1}`}
								width={1200}
								height={800}
								className="max-w-full max-h-[85vh] object-contain rounded-lg"
							/>
							{validGalleryImages[selectedGalleryImage].alt && (
								<p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-3 px-4 rounded-b-lg">
									{validGalleryImages[selectedGalleryImage].alt}
								</p>
							)}
						</motion.div>

						{/* Image Counter */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
							{selectedGalleryImage + 1} / {validGalleryImages.length}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
