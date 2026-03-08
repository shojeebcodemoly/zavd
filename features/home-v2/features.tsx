"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

const features = [
	{
		icon: (
			<svg
				className="h-8 w-8"
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
		title: "MDR-Certified Equipment",
		description:
			"All our equipment is certified according to the latest MDR requirements for medical devices, guaranteeing the highest safety and quality standards.",
	},
	{
		icon: (
			<svg
				className="h-8 w-8"
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
		title: "Latest Technology",
		description:
			"We offer the market's most advanced laser and light technology for effective and safe treatments with documented results.",
	},
	{
		icon: (
			<svg
				className="h-8 w-8"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		),
		title: "Complete Support",
		description:
			"Swedish technical support, training, and service. We're always available to ensure your business operates optimally.",
	},
	{
		icon: (
			<svg
				className="h-8 w-8"
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
		title: "Training & Education",
		description:
			"Comprehensive training programs for your staff. We ensure you get maximum value from your investment from day one.",
	},
	{
		icon: (
			<svg
				className="h-8 w-8"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/>
			</svg>
		),
		title: "Flexible Solutions",
		description:
			"Customized financing solutions and service agreements tailored to your business needs and budget.",
	},
	{
		icon: (
			<svg
				className="h-8 w-8"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
		),
		title: "20+ Years Experience",
		description:
			"With over two decades in the industry, we've helped hundreds of clinics grow and develop with the right equipment.",
	},
];

export function Features() {
	return (
		<section className="relative py-20 lg:py-32 section-glass-light bg-primary/20! overflow-hidden">
			{/* Background decorations - solid colored shapes */}
			<div className="absolute inset-0 -z-10 pointer-events-none">
				<div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse-slow" />
				<div
					className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary rounded-full blur-3xl animate-pulse-slow"
					style={{ animationDelay: "1.5s" }}
				/>
			</div>

			<div className="section-container">
				{/* Section header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="mx-auto max-w-3xl text-center mb-16"
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-primary text-sm font-medium mb-6"
					>
						<span className="text-primary">●</span>
						Why Choose Us
					</motion.div>
					<h2 className="text-3xl font-medium tracking-tight text-secondary-dark sm:text-4xl lg:text-5xl mb-6">
						Why Choose Synos Medical?
					</h2>
					<p className="text-lg text-secondary-light/80 leading-relaxed">
						We are your reliable partner for medical equipment of the
						highest quality
					</p>
				</motion.div>

				{/* Features grid */}
				<motion.div
					variants={staggerContainer}
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
				>
					{features.map((feature, index) => (
						<motion.div
							key={index}
							variants={staggerItem}
							className="group relative glass-card-light rounded-2xl p-8 transition-all duration-300 card-hover-glow"
						>
							{/* Icon with solid background */}
							<div className="mb-6 inline-flex rounded-xl bg-primary/15 p-4 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 icon-hover-bounce">
								{feature.icon}
							</div>

							<h3 className="mb-4 text-xl font-medium text-secondary-dark group-hover:text-primary transition-colors duration-300">
								{feature.title}
							</h3>

							<p className="text-secondary-light leading-relaxed">
								{feature.description}
							</p>

							{/* Hover accent line */}
							{/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
