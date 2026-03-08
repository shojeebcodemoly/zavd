"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * FAQ Newsletter Component
 *
 * Newsletter subscription section with:
 * - Email input with validation
 * - Success/error states
 * - Animated feedback
 * - Responsive design
 */
export function FAQNewsletter() {
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
			setMessage("Tack! Du är nu prenumerant på vårt nyhetsbrev.");
			setEmail("");
		}, 1500);
	};

	return (
		<section className="py-20 bg-linear-to-br from-secondary/20 to-secondary/40 relative overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4" />
				<div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-tertiary rounded-full blur-3xl translate-y-1/2 translate-x-1/4" />
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
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Håll dig uppdaterad
						</h2>

						{/* Description */}
						<p className="text-lg text-white/80 max-w-2xl mx-auto">
							Prenumerera på vårt nyhetsbrev och få de senaste nyheterna
							om produkter och erbjudanden direkt i din inkorg.
						</p>
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
										placeholder="Din e-postadress"
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
											<span>Skickar...</span>
										</>
									) : status === "success" ? (
										<>
											<CheckCircle2 className="h-5 w-5" />
											<span>Prenumererar!</span>
										</>
									) : (
										<>
											<span>Prenumerera</span>
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
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="text-center text-sm text-white/60 mt-6"
						>
							Vi respekterar din integritet. Du kan avsluta
							prenumerationen när som helst.
						</motion.p>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
