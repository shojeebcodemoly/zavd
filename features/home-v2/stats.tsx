"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

const stats = [
	{
		value: "20+",
		label: "Years in Business",
		description: "Proven experience",
	},
	{
		value: "500+",
		label: "Happy Clinics",
		description: "Across the Nordics",
	},
	{
		value: "100%",
		label: "MDR-Certified",
		description: "Guaranteed quality",
	},
	{
		value: "24/7",
		label: "Support",
		description: "Always available",
	},
];

export function Stats() {
	return (
		<section className="relative py-20 lg:py-28 section-glass-medium overflow-hidden bg-muted-foreground/30!">
			{/* Background decorative shapes */}
			<div className="absolute inset-0 -z-10 pointer-events-none">
				<div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl animate-pulse-slow" />
				<div
					className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl animate-pulse-slow"
					style={{ animationDelay: "2s" }}
				/>
			</div>

			<div className="section-container">
				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
				>
					{stats.map((stat, index) => (
						<motion.div
							key={index}
							variants={staggerItem}
							className="group text-center glass-card rounded-2xl p-8 transition-all duration-300 card-hover-glow bg-white/60"
						>
							<div className="mb-3 text-5xl font-bold text-primary lg:text-6xl group-hover:text-secondary group-hover:scale-125 transition-all duration-300">
								{stat.value}
							</div>
							<div className="mb-2 text-xl font-medium text-secondary-dark group-hover:text-primary transition-colors duration-300">
								{stat.label}
							</div>
							<div className="text-sm text-secondary-dark/70">
								{stat.description}
							</div>

							{/* Accent line */}
							<div className="mt-6 mx-auto w-16 h-1 bg-primary rounded-full group-hover:w-24 transition-all duration-300" />
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
