"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { GlassCard } from "@/components/common/glass-card";
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations";

const testimonials = [
	{
		name: "Anna Svensson",
		role: "Klinikägare, Stockholm",
		content:
			"Synos Medical har varit en fantastisk partner. Deras utrustning är av högsta kvalitet och supporten är exceptionell. Kan varmt rekommendera!",
		rating: 5,
	},
	{
		name: "Erik Johansson",
		role: "Hudterapeut, Göteborg",
		content:
			"Utbildningen vi fick var mycket omfattande och professionell. Vi kände oss trygga från dag ett med vår nya utrustning.",
		rating: 5,
	},
	{
		name: "Maria Andersson",
		role: "Skönhetssalong, Malmö",
		content:
			"Flexibla betalningsalternativ gjorde det möjligt för oss att investera i toppmodern utrustning. Våra kunder är mycket nöjda!",
		rating: 5,
	},
];

/**
 * Testimonials Section - Customer testimonials with glass cards
 */
export function Testimonials() {
	return (
		<section className="py-20 md:py-32 relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-3xl opacity-30" />

			<Container maxWidth="xl" className="relative z-10">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true, margin: "-100px" }}
					variants={staggerContainer}
				>
					{/* Section header */}
					<motion.div
						variants={fadeUp}
						transition={defaultTransition}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4">
							Vad våra{" "}
							<span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
								kunder säger
							</span>
						</h2>
						<p className="text-lg text-slate-400 max-w-2xl mx-auto">
							Läs vad våra nöjda kunder har att säga om sina erfarenheter
						</p>
					</motion.div>

					{/* Testimonials grid */}
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{testimonials.map((testimonial, index) => (
							<motion.div
								key={testimonial.name}
								variants={fadeUp}
								transition={{
									...defaultTransition,
									delay: index * 0.1,
								}}
							>
								<GlassCard
									hoverable
									padding="lg"
									className="h-full flex flex-col"
								>
									{/* Stars */}
									<div className="flex gap-1 mb-4">
										{[...Array(testimonial.rating)].map((_, i) => (
											<svg
												key={i}
												className="w-5 h-5 text-primary"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
										))}
									</div>

									{/* Content */}
									<p className="text-slate-300 mb-6 flex-grow leading-relaxed">
										"{testimonial.content}"
									</p>

									{/* Author */}
									<div className="border-t border-glass-border pt-4">
										<p className="font-semibold text-slate-100">
											{testimonial.name}
										</p>
										<p className="text-sm text-slate-400">
											{testimonial.role}
										</p>
									</div>
								</GlassCard>
							</motion.div>
						))}
					</div>

					{/* Trust indicators */}
					<motion.div
						variants={fadeUp}
						transition={defaultTransition}
						className="mt-16 text-center"
					>
						<div className="flex flex-wrap justify-center gap-8 items-center">
							<div className="text-center">
								<div className="text-4xl font-medium text-secondary mb-2">
									500+
								</div>
								<div className="text-slate-400">Nöjda kunder</div>
							</div>
							<div className="h-12 w-px bg-glass-border hidden md:block" />
							<div className="text-center">
								<div className="text-4xl font-bold text-primary mb-2">
									15+
								</div>
								<div className="text-slate-400">År i branschen</div>
							</div>
							<div className="h-12 w-px bg-glass-border hidden md:block" />
							<div className="text-center">
								<div className="text-4xl font-medium text-secondary mb-2">
									100%
								</div>
								<div className="text-slate-400">MDR-certifierat</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</Container>
		</section>
	);
}
