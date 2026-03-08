"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { GlassCard } from "@/components/common/glass-card";
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations";

const services = [
	{
		title: "MDR-certifierad utrustning",
		description:
			"All vår utrustning är certifierad enligt de senaste MDR-kraven för maximal säkerhet och kvalitet.",
		icon: (
			<svg
				className="w-8 h-8"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
				/>
			</svg>
		),
		color: "primary",
	},
	{
		title: "Komplett utbildning",
		description:
			"Vi erbjuder omfattande utbildning för all vår utrustning med certifierade instruktörer.",
		icon: (
			<svg
				className="w-8 h-8"
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
		),
		color: "accent",
	},
	{
		title: "Teknisk support",
		description:
			"Professionell support och service under hela produktens livstid från våra svenska kontor.",
		icon: (
			<svg
				className="w-8 h-8"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
				/>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		),
		color: "primary",
	},
	{
		title: "Flexibla betalningsalternativ",
		description:
			"Vi erbjuder olika finansieringslösningar anpassade för din verksamhet.",
		icon: (
			<svg
				className="w-8 h-8"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
				/>
			</svg>
		),
		color: "accent",
	},
	{
		title: "Starta eget-paket",
		description:
			"Komplett stöd för dig som vill starta din egen klinik med allt du behöver.",
		icon: (
			<svg
				className="w-8 h-8"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M13 10V3L4 14h7v7l9-11h-7z"
				/>
			</svg>
		),
		color: "primary",
	},
	{
		title: "Svensk support",
		description:
			"Lokal support på svenska från våra kontor i Stockholm och Linköping.",
		icon: (
			<svg
				className="w-8 h-8"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
				/>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		),
		color: "accent",
	},
];

/**
 * Services Section - Display key services with glass cards
 */
export function Services() {
	return (
		<section className="py-20 md:py-32 relative">
			<Container maxWidth="xl">
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
							Varför välja{" "}
							<span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
								Synos Medical?
							</span>
						</h2>
						<p className="text-lg text-slate-400 max-w-2xl mx-auto">
							Vi erbjuder mer än bara utrustning - vi är din partner för
							framgång
						</p>
					</motion.div>

					{/* Services grid */}
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{services.map((service, index) => (
							<motion.div
								key={service.title}
								variants={fadeUp}
								transition={{
									...defaultTransition,
									delay: index * 0.05,
								}}
							>
								<GlassCard hoverable padding="lg" className="h-full">
									<div
										className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
											service.color === "primary"
												? "bg-secondary/20 text-secondary"
												: "bg-primary/20 text-primary"
										}`}
									>
										{service.icon}
									</div>
									<h3 className="text-xl font-semibold mb-3">
										{service.title}
									</h3>
									<p className="text-slate-400 leading-relaxed">
										{service.description}
									</p>
								</GlassCard>
							</motion.div>
						))}
					</div>
				</motion.div>
			</Container>
		</section>
	);
}
