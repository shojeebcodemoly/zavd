"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { GlassCard } from "@/components/common/glass-card";
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations";

/**
 * Hero Section - Homepage hero with glassmorphism design
 *
 * Features:
 * - Large display heading with gradient text
 * - Animated glass cards cluster
 * - Primary and secondary CTAs
 * - Responsive layout
 */
export function Hero() {
	return (
		<section className="relative min-h-[90vh] flex items-center overflow-hidden py-20 md:py-32">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-bg to-primary/10 opacity-50" />

			{/* Decorative blur circles */}
			<div className="absolute top-20 left-10 w-72 h-72 bg-secondary/30 rounded-full blur-3xl opacity-20" />
			<div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-20" />

			<Container maxWidth="xl" className="relative z-10">
				<motion.div
					variants={staggerContainer}
					initial="initial"
					animate="animate"
					className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center"
				>
					{/* Left column - Text content */}
					<div className="text-center lg:text-left">
						<motion.div
							variants={fadeUp}
							transition={defaultTransition}
							className="mb-6"
						>
							<span className="inline-block px-4 py-2 rounded-full bg-secondary/10 border border-primary/20 text-secondary text-sm font-medium mb-6">
								MDR-certifierad utrustning
							</span>
						</motion.div>

						<motion.h1
							variants={fadeUp}
							transition={defaultTransition}
							className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
						>
							Sveriges ledande leverantör av{" "}
							<span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
								medicinsk klinikutrustning
							</span>
						</motion.h1>

						<motion.p
							variants={fadeUp}
							transition={defaultTransition}
							className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0"
						>
							Vi erbjuder högkvalitativ medicinsk utrustning för laser,
							hårborttagning, tatueringsborttagning och hudföryngring.
						</motion.p>

						<motion.div
							variants={fadeUp}
							transition={defaultTransition}
							className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
						>
							<Button
								size="lg"
								asChild
								className="bg-secondary hover:bg-secondary-600 text-white shadow-lg shadow-primary/50"
							>
								<Link href="/produkter">Se våra produkter</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								asChild
								className="border-2 border-slate-300 text-slate-100 hover:bg-slate-100 hover:text-bg"
							>
								<Link href="#contact">Kontakta oss</Link>
							</Button>
						</motion.div>
					</div>

					{/* Right column - Glass cards cluster */}
					<motion.div
						variants={fadeUp}
						transition={defaultTransition}
						className="relative hidden lg:block"
					>
						<div className="relative w-full h-[500px]">
							{/* Main card */}
							<GlassCard
								className="absolute top-0 right-0 w-80 h-64 p-6"
								hoverable
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2, ...defaultTransition }}
							>
								<div className="flex flex-col h-full justify-between">
									<div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
										<svg
											className="w-6 h-6 text-secondary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2">
											Certifierad kvalitet
										</h3>
										<p className="text-slate-400 text-sm">
											All utrustning är MDR-certifierad
										</p>
									</div>
								</div>
							</GlassCard>

							{/* Secondary card */}
							<GlassCard
								className="absolute bottom-20 left-0 w-72 h-56 p-6"
								hoverable
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.4, ...defaultTransition }}
							>
								<div className="flex flex-col h-full justify-between">
									<div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
										<svg
											className="w-6 h-6 text-primary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
											/>
										</svg>
									</div>
									<div>
										<h3 className="text-xl font-semibold mb-2">
											Komplett utbildning
										</h3>
										<p className="text-slate-400 text-sm">
											Professionell support och träning
										</p>
									</div>
								</div>
							</GlassCard>
						</div>
					</motion.div>
				</motion.div>
			</Container>
		</section>
	);
}
