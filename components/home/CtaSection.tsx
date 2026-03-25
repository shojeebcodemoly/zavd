"use client";

import { Phone, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ICtaSection } from "@/models/home-page.model";

interface CtaSectionProps {
	data: ICtaSection;
	phone: string;
	email: string;
	isEn?: boolean;
}

const CtaSection = ({ data, phone, email, isEn }: CtaSectionProps) => {
	const title = (isEn ? data.titleEn : data.titleDe) || data.titleDe || data.titleEn;
	const subtitle = (isEn ? data.subtitleEn : data.subtitleDe) || data.subtitleDe || data.subtitleEn;
	const phoneTitle = (isEn ? data.phoneTitleEn : data.phoneTitleDe) || data.phoneTitleDe || data.phoneTitleEn;
	const emailTitle = (isEn ? data.emailTitleEn : data.emailTitleDe) || data.emailTitleDe || data.emailTitleEn;
	const formTitle = (isEn ? data.formTitleEn : data.formTitleDe) || data.formTitleDe || data.formTitleEn;
	const formSubtitle = (isEn ? data.formSubtitleEn : data.formSubtitleDe) || data.formSubtitleDe || data.formSubtitleEn;
	const formCtaText = (isEn ? data.formCtaTextEn : data.formCtaTextDe) || data.formCtaTextDe || data.formCtaTextEn;

	return (
		<section className="relative overflow-hidden bg-[#0d1b2a] py-20 lg:py-28">
			{/* Background glows */}
			<div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
			<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
			{/* Subtle grid pattern */}
			<div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

			<div className="_container relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

					{/* Left: Text + Contact */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
						className="flex flex-col gap-8"
					>
						{/* Tag */}
						<div className="flex items-center gap-3">
							<span className="w-8 h-px bg-primary block" />
							<span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
								Contact
							</span>
						</div>

						{/* Heading */}
						<div className="flex flex-col gap-3">
							<h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white font-heading leading-[1.1]">
								{title || "Get in Touch With Us"}
							</h2>
							<p className="text-white/50 text-base lg:text-lg leading-relaxed">
								{subtitle || "We're here to help. Reach out to us anytime."}
							</p>
						</div>

						{/* Contact Cards */}
						<div className="flex flex-col gap-3">
							{phone && (
								<a
									href={`tel:${phone}`}
									className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-300"
								>
									<div className="w-12 h-12 rounded-xl bg-primary/20 group-hover:bg-primary flex items-center justify-center shrink-0 transition-all duration-300">
										<Phone className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-0.5">
											{phoneTitle || "Call Us"}
										</p>
										<p className="text-base font-bold text-white truncate">
											{phone}
										</p>
									</div>
									<ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0" />
								</a>
							)}

							{email && (
								<a
									href={`mailto:${email}`}
									className="group flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-300"
								>
									<div className="w-12 h-12 rounded-xl bg-primary/20 group-hover:bg-primary flex items-center justify-center shrink-0 transition-all duration-300">
										<Mail className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-0.5">
											{emailTitle || "Email Us"}
										</p>
										<p className="text-base font-bold text-white truncate">
											{email}
										</p>
									</div>
									<ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0" />
								</a>
							)}
						</div>
					</motion.div>

					{/* Right: CTA Card */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
					>
						<div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-10 overflow-hidden">
							{/* Card inner glow */}
							<div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
							<div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

							<div className="relative z-10 flex flex-col gap-7">
								{/* Card header */}
								<div className="flex flex-col gap-2">
									<span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
										{formTitle || "Ready to Start?"}
									</span>
									<h3 className="text-2xl lg:text-3xl font-bold text-white font-heading leading-snug">
										{title || "Let's Work Together"}
									</h3>
									<p className="text-white/45 text-sm leading-relaxed">
										{formSubtitle || "Fill out the form and we'll get back to you within 24 hours."}
									</p>
								</div>

								{/* CTA Button */}
								<Link
									href={data.formCtaHref || "/kontakt"}
									className="group flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white font-semibold text-base py-4 px-6 rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
								>
									{formCtaText || "Contact Us"}
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
								</Link>

								{/* Stats */}
								<div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/10">
									{[
										{ value: "24h", label: "Response time" },
										{ value: "100%", label: "Free advice" },
										{ value: "DE", label: "Germany wide" },
									].map((stat, i) => (
										<div key={i} className="text-center">
											<p className="text-xl lg:text-2xl font-bold text-white">{stat.value}</p>
											<p className="text-white/35 text-xs mt-0.5">{stat.label}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</motion.div>

				</div>
			</div>
		</section>
	);
};

export default CtaSection;
