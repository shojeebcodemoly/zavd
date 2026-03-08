"use client";

import { JSX, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import type { IFAQNewsletterSection } from "@/models/faq-page.model";

interface FAQNewsletterClientProps {
	data: IFAQNewsletterSection;
}

export function FAQNewsletterClient({ data }: FAQNewsletterClientProps) {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setStatus("error");
			setMessage("Vänligen ange en giltig e-postadress");
			return;
		}

		setStatus("loading");

		// Simulate API call (replace with actual implementation)
		setTimeout(() => {
			setStatus("success");
			setMessage(
				data.successText || "Tack! Du är nu prenumerant på vårt nyhetsbrev."
			);
			setEmail("");
		}, 1500);
	};

	return (
		<section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
			{/* Triangulated Particles Animation */}
			<div className="absolute inset-0 opacity-30">
				<svg
					className="absolute top-0 left-0 w-full h-full"
					viewBox="0 0 1440 800"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="xMidYMid slice"
				>
					{/* Generate random particles with triangulated connections */}
					{(() => {
						// Generate particle positions
						const particles = [...Array(25)].map(() => ({
							x: Math.random() * 1440,
							y: Math.random() * 800,
							size: 2 + Math.random() * 2,
						}));

						// Create triangulation lines between nearby particles
						const lines: JSX.Element[] = [];
						particles.forEach((p1, i) => {
							particles.slice(i + 1).forEach((p2, j) => {
								const distance = Math.sqrt(
									Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
								);
								// Only connect particles within 200px distance
								if (distance < 200) {
									lines.push(
										<motion.line
											key={`line-${i}-${j}`}
											x1={p1.x}
											y1={p1.y}
											x2={p2.x}
											y2={p2.y}
											stroke="white"
											strokeWidth="0.5"
											initial={{ opacity: 0 }}
											animate={{
												opacity: [0.1, 0.3, 0.1],
											}}
											transition={{
												duration: 4 + Math.random() * 3,
												repeat: Infinity,
												delay: Math.random() * 2,
											}}
										/>
									);
								}
							});
						});

						return (
							<>
								{/* Render connection lines */}
								{lines}

								{/* Render particles */}
								{particles.map((particle, i) => (
									<motion.g key={`particle-${i}`}>
										{/* Particle glow */}
										<motion.circle
											cx={particle.x}
											cy={particle.y}
											r={particle.size * 3}
											fill="white"
											initial={{ opacity: 0.05 }}
											animate={{
												opacity: [0.05, 0.15, 0.05],
												scale: [1, 1.3, 1],
											}}
											transition={{
												duration: 3 + Math.random() * 2,
												repeat: Infinity,
												delay: Math.random() * 2,
											}}
										/>
										{/* Particle core */}
										<motion.circle
											cx={particle.x}
											cy={particle.y}
											r={particle.size}
											fill="white"
											initial={{ opacity: 0.4 }}
											animate={{
												opacity: [0.4, 0.9, 0.4],
												x: [0, (Math.random() - 0.5) * 30],
												y: [0, (Math.random() - 0.5) * 30],
											}}
											transition={{
												duration: 8 + Math.random() * 4,
												repeat: Infinity,
												repeatType: "reverse",
												delay: Math.random() * 2,
											}}
										/>
									</motion.g>
								))}

								{/* Add some triangular mesh patterns */}
								{[...Array(8)].map((_, i) => {
									const x = Math.random() * 1440;
									const y = Math.random() * 800;
									const size = 40 + Math.random() * 60;
									return (
										<motion.path
											key={`triangle-${i}`}
											d={`M${x} ${y} L${x + size} ${y + size * 0.5} L${x} ${y + size} Z`}
											stroke="white"
											strokeWidth="0.3"
											fill="white"
											fillOpacity="0.02"
											initial={{ opacity: 0, rotate: 0 }}
											animate={{
												opacity: [0, 0.4, 0],
												rotate: 360,
												scale: [1, 1.2, 1],
											}}
											transition={{
												duration: 15 + Math.random() * 10,
												repeat: Infinity,
												delay: Math.random() * 3,
											}}
											style={{ transformOrigin: `${x + size / 2}px ${y + size / 2}px` }}
										/>
									);
								})}
							</>
						);
					})()}
				</svg>
			</div>

			<div className="_container relative z-10">
				<div className="max-w-4xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-8"
					>
						{/* Icon */}
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-6">
							<Mail className="h-8 w-8 text-primary" />
						</div>

						{/* Title */}
						{data.title && (
							<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
								{data.title}
							</h2>
						)}

						{/* Description */}
						{data.subtitle && (
							<p className="text-lg text-white/80 max-w-2xl mx-auto">
								{data.subtitle}
							</p>
						)}
					</motion.div>

					{/* Newsletter Form */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<form onSubmit={handleSubmit} className="max-w-xl mx-auto">
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="flex-1 relative">
									<input
										type="email"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											setStatus("idle");
										}}
										placeholder={
											data.inputPlaceholder || "Din e-postadress"
										}
										disabled={
											status === "loading" || status === "success"
										}
										className="w-full px-6 py-4 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
									/>
								</div>
								<button
									type="submit"
									disabled={
										status === "loading" || status === "success"
									}
									className="px-8 py-4 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 whitespace-nowrap"
								>
									{status === "loading" ? (
										<>
											<div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											<span>{data.loadingText || "Skickar..."}</span>
										</>
									) : status === "success" ? (
										<>
											<CheckCircle2 className="h-5 w-5" />
											<span>Prenumererar!</span>
										</>
									) : (
										<>
											<span>{data.buttonText || "Prenumerera"}</span>
											<Send className="h-5 w-5" />
										</>
									)}
								</button>
							</div>

							{/* Status Messages */}
							{(status === "success" || status === "error") && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className={`mt-4 flex items-center gap-2 justify-center text-sm ${
										status === "success"
											? "text-primary"
											: "text-red-400"
									}`}
								>
									{status === "success" ? (
										<CheckCircle2 className="h-5 w-5" />
									) : (
										<AlertCircle className="h-5 w-5" />
									)}
									<span>{message}</span>
								</motion.div>
							)}
						</form>

						{/* Privacy Note */}
						{data.privacyNote && (
							<motion.p
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.4 }}
								className="text-center text-sm text-white/60 mt-6"
							>
								{data.privacyNote}
							</motion.p>
						)}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
