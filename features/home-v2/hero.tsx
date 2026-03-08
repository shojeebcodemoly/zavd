"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ImageComponent } from "@/components/common/image-component";

export function Hero() {
	return (
		<section className="relative min-h-screen flex items-center overflow-hidden bg-secondary">
			{/* Background image with overlay */}
			<div className="absolute inset-0 -z-10">
				<ImageComponent
					src="/image.png"
					alt="Medical equipment background"
					className="w-full h-full object-cover opacity-10 group-hover:scale-105 transition-transform duration-500"
					height={0}
					width={0}
					sizes="100vw"
					wrapperClasses="w-full h-full"
				/>

				<div className="hero-glass-overlay absolute inset-0" />
			</div>

			{/* Decorative colored shapes */}
			<div className="absolute inset-0 -z-10 pointer-events-none">
				<div className="absolute right-0 top-20 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl animate-pulse-slow" />
				<div
					className="absolute bottom-20 left-0 w-80 h-80 bg-primary opacity-15 rounded-full blur-3xl animate-pulse-slow"
					style={{ animationDelay: "1s" }}
				/>
			</div>

			<div className="section-container py-32 lg:py-40">
				<div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
					{/* Left content */}
					<motion.div
						variants={staggerContainer}
						initial="initial"
						animate="animate"
						className="space-y-8"
					>
						<motion.div
							variants={staggerItem}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-primary text-sm font-medium"
						>
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
							</span>
							MDR-Certified Medical Equipment
						</motion.div>

						<motion.h1
							variants={staggerItem}
							className="text-4xl font-medium tracking-tight text-secondary-dark sm:text-5xl lg:text-6xl xl:text-7xl"
						>
							Professional{" "}
							<span className="text-primary">Medical Equipment</span> for
							Modern Clinics
						</motion.h1>

						<motion.p
							variants={staggerItem}
							className="text-lg text-secondary-dark/80 max-w-2xl leading-relaxed"
						>
							Leading provider of MDR-certified clinic equipment for
							laser treatments, hair removal, tattoo removal, and skin
							rejuvenation. Quality and safety in every detail.
						</motion.p>

						<motion.div
							variants={staggerItem}
							className="flex flex-wrap gap-4"
						>
							<Link
								href="/produkter"
								className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-primary-hover transition-all duration-300 hover:shadow-2xl btn-hover-lift"
							>
								Explore Products
								<ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
							</Link>
							<Link
								href="/kontakt"
								className="inline-flex items-center justify-center rounded-xl bg-secondary px-8 py-4 text-base font-semibold text-white hover:bg-secondary-hover transition-all duration-300 btn-hover-lift"
							>
								Contact Us
							</Link>
						</motion.div>

						{/* Trust indicators */}
						<motion.div
							variants={staggerItem}
							className="flex flex-wrap items-center gap-6 pt-4"
						>
							<div className="flex items-center gap-2 text-secondary-dark/80">
								<CheckCircle2 className="h-5 w-5 text-primary" />
								<span className="text-sm font-medium">
									MDR-Certified
								</span>
							</div>
							<div className="flex items-center gap-2 text-secondary-dark/80">
								<CheckCircle2 className="h-5 w-5 text-primary" />
								<span className="text-sm font-medium">
									Swedish Support
								</span>
							</div>
							<div className="flex items-center gap-2 text-secondary-dark/80">
								<CheckCircle2 className="h-5 w-5 text-primary" />
								<span className="text-sm font-medium">
									20+ Years Experience
								</span>
							</div>
						</motion.div>
					</motion.div>

					{/* Right image with glassmorphism card */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="relative hidden lg:block"
					>
						<div className="relative aspect-square overflow-hidden rounded-3xl glass-card-light shadow-2xl">
							<ImageComponent
								src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?q=80&w=2070&auto=format&fit=crop"
								alt="Medical laser equipment"
								className="w-full h-full object-cover"
								height={1000}
								width={1000}
							/>

							{/* Floating stats card */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.6 }}
								className="absolute bottom-6 left-6 right-6 glass-card-dark p-6 rounded-2xl"
							>
								<div className="grid grid-cols-3 gap-4 text-center">
									<div>
										<div className="text-2xl font-medium text-secondary">
											500+
										</div>
										<div className="text-xs text-white/70 mt-1">
											Happy Clients
										</div>
									</div>
									<div>
										<div className="text-2xl font-medium text-secondary">
											100%
										</div>
										<div className="text-xs text-white/70 mt-1">
											Certified
										</div>
									</div>
									<div>
										<div className="text-2xl font-medium text-secondary">
											24/7
										</div>
										<div className="text-xs text-white/70 mt-1">
											Support
										</div>
									</div>
								</div>
							</motion.div>
						</div>

						{/* Decorative elements */}
						<div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
						<div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
					</motion.div>
				</div>
			</div>
		</section>
	);
}
