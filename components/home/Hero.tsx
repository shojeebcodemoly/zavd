"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageComponent } from "../common/image-component";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { HeroSlider } from "./HeroSlider";
import type { IHeroSection } from "@/models/home-page.model";

// Icon mapping for trust indicators
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	ShieldCheck,
	Star,
};

interface HeroProps {
	data: IHeroSection;
}

export function Hero({ data }: HeroProps) {
	// Check if slider mode is enabled and has slides
	if (data.isSlider && data.slides && data.slides.length > 0) {
		return <HeroSlider data={data} />;
	}

	// Check if optional sections have data
	const hasFloatingCard = data.floatingCard?.image && data.floatingCard?.label;
	const hasCertificationCard =
		data.certificationCard?.title && data.certificationCard?.subtitle;
	const hasMainImage = !!data.mainImage;
	const hasMobileImage = !!data.mobileImage;

	// Check if we have a background image
	const hasBackgroundImage = !!data.backgroundImage;
	const isDarkBackground = hasBackgroundImage; // If background image exists, assume dark theme

	// Set navbar variant based on background
	useSetNavbarVariant(isDarkBackground ? "dark-hero" : "default");

	return (
		<section className={`relative w-full overflow-hidden padding-top pb-16 lg:pb-32 min-h-[100svh] lg:min-h-0 ${
			isDarkBackground ? 'bg-secondary' : 'bg-background'
		}`}>
			{/* Background Image - if provided from CMS */}
			{hasBackgroundImage && (
				<div className="absolute inset-0 z-0">
					<ImageComponent
						src={data.backgroundImage!}
						alt="Hero Background"
						height={0}
						width={0}
						sizes="100vw"
						wrapperClasses="w-full h-full"
						className="object-cover w-full h-full opacity-40"
					/>
					<div className="absolute inset-0 bg-secondary/60" />
				</div>
			)}

			{/* Pattern Overlay - only show if no background image */}
			{!hasBackgroundImage && (
				<div className="z-10 absolute inset-0 bg-[url('/image.png')] opacity-5 bg-no-repeat bg-cover bg-center" />
			)}

			{/* Mobile Hero Image (full-height on mobile) */}
			{hasMobileImage && (
				<div className="lg:hidden absolute inset-0 z-0">
					<ImageComponent
						src={data.mobileImage!}
						alt="Hero Mobile"
						height={0}
						width={0}
						sizes="100vw"
						wrapperClasses="w-full h-full"
						className="object-cover w-full h-full"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
				</div>
			)}

			<div className="relative z-20 _container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
				{/* Left Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="flex flex-col gap-6 lg:gap-8 max-w-2xl"
				>
					{/* Trust Badge */}
					{data.badge && (
						<div className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full bg-green-50 border border-green-200 animate-pulse tracking-widest">
							<span className="flex h-2 w-2 rounded-full bg-primary" />
							<span className="text-[9px] font-semibold text-primary uppercase leading-relaxed">
								{data.badge}
							</span>
						</div>
					)}

					{/* Heading */}
					<h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight ${
						isDarkBackground ? 'text-white' : 'text-secondary'
					}`}>
						{data.title} <br />
						{data.titleHighlight && (
							<span className="text-gradient-primary text-2xl sm:text-3xl lg:text-4xl">
								{data.titleHighlight}
							</span>
						)}
					</h1>

					{/* Description */}
					{data.subtitle && (
						<p className={`text-lg leading-relaxed max-w-xl ${
							isDarkBackground ? 'text-white/80' : 'text-foreground/70'
						}`}>
							{data.subtitle}
						</p>
					)}

					{/* Actions */}
					<div className="flex flex-wrap gap-4 pt-2">
						{data.primaryCta?.text && data.primaryCta?.href && (
							<Button
								asChild
								size="lg"
								className="bg-primary hover:bg-primary-hover text-white rounded-full cursor-pointer px-8 h-12 text-base shadow-lg shadow-primary/20"
							>
								<Link href={data.primaryCta.href}>
									{data.primaryCta.text}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						)}
						{data.secondaryCta?.text && data.secondaryCta?.href && (
							<Button
								asChild
								variant="outline"
								size="lg"
								className={`rounded-full px-8 h-12 text-base ${
									isDarkBackground
										? 'border-white/30 text-white hover:bg-white/10 hover:border-white'
										: 'border-secondary/20 text-secondary hover:bg-secondary/5'
								}`}
							>
								<Link href={data.secondaryCta.href}>
									{data.secondaryCta.text}
								</Link>
							</Button>
						)}
					</div>

					{/* Trust Indicators */}
					{data.trustIndicators && data.trustIndicators.length > 0 && (
						<div className={`flex items-center gap-6 pt-6 text-sm ${
							isDarkBackground ? 'text-white/70' : 'text-foreground/70'
						}`}>
							{data.trustIndicators
								.filter((ind) => ind.icon && ind.text)
								.map((indicator, index) => {
									const IconComponent = indicator.icon
										? iconMap[indicator.icon] || ShieldCheck
										: ShieldCheck;
									return (
										<div key={index} className="flex items-center gap-2">
											<IconComponent className="h-5 w-5 text-success" />
											<span>{indicator.text}</span>
										</div>
									);
								})}
						</div>
					)}
				</motion.div>

				{/* Right Content - Hybrid Image Grid - Only show if we have main image */}
				{hasMainImage && (
					<div className="relative h-[500px] lg:h-[600px] w-full hidden lg:block">
						{/* Main Image */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] z-10"
						>
							<div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white">
								<ImageComponent
									src={data.mainImage!}
									alt="Hero Image"
									height={0}
									width={0}
									sizes="100vw"
									wrapperClasses="w-full h-full"
									className="object-cover w-full h-full"
								/>

								{/* Overlay Gradient */}
								<div className="absolute inset-0 bg-linear-to-t from-secondary/40 to-transparent pointer-events-none" />
							</div>
						</motion.div>

						{/* Floating Detail Card 1 (Top Right) - Only show if data exists */}
						{hasFloatingCard && (
							<motion.div
								initial={{ opacity: 0, y: 20, x: -20 }}
								animate={{ opacity: 1, y: 0, x: 0 }}
								transition={{ duration: 0.8, delay: 0.4 }}
								className="absolute top-[5%] right-[5%] w-45 h-48 z-20 hover:scale-[1.01] duration-300"
							>
								<div className="w-full h-full rounded-xl overflow-hidden shadow-xl border border-white/50 bg-white p-0">
									<div className="w-full h-full rounded-lg overflow-hidden relative">
										<ImageComponent
											src={data.floatingCard!.image!}
											alt={data.floatingCard!.label!}
											height={0}
											width={0}
											sizes="100vw"
											wrapperClasses="w-full h-full"
											className="object-cover w-full h-full"
										/>
										<div className="absolute bottom-0 left-0 right-0 bg-secondary/80 backdrop-blur-sm p-2 text-center rounded-b-xl">
											<span className="text-xs font-medium text-white">
												{data.floatingCard!.label}
											</span>
										</div>
									</div>
								</div>
							</motion.div>
						)}

						{/* Floating Detail Card 2 (Bottom Left) - Only show if data exists */}
						{hasCertificationCard && (
							<motion.div
								initial={{ opacity: 0, y: -20, x: 20 }}
								animate={{ opacity: 1, y: 0, x: 0 }}
								transition={{ duration: 0.8, delay: 0.6 }}
								className="absolute bottom-[15%] left-[5%] w-64 h-auto z-20"
							>
								<div className="glass-card w-full rounded-xl p-4 flex flex-col gap-3 bg-white/90 backdrop-blur-md border-white/40 shadow-xl">
									<div className="flex items-center gap-3">
										<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
											<ShieldCheck className="h-5 w-5 text-primary" />
										</div>
										<div>
											<div className="text-sm font-medium text-secondary">
												{data.certificationCard!.title}
											</div>
											<div className="text-xs text-muted-foreground">
												{data.certificationCard!.subtitle}
											</div>
										</div>
									</div>
									{data.certificationCard?.progressLabel &&
										data.certificationCard?.progressValue && (
											<div className="space-y-2">
												<div className="flex justify-between text-xs mb-1">
													<span className="text-muted-foreground">
														{data.certificationCard.progressLabel}
													</span>
													<span className="font-medium text-secondary">
														{data.certificationCard.progressValue}
													</span>
												</div>
												{data.certificationCard
													?.progressPercentage !== undefined && (
													<div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
														<div
															className="h-full bg-primary rounded-full"
															style={{
																width: `${data.certificationCard.progressPercentage}%`,
															}}
														/>
													</div>
												)}
											</div>
										)}
								</div>
							</motion.div>
						)}
					</div>
				)}
			</div>
		</section>
	);
}
