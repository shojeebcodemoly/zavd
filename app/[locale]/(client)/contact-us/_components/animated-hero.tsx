"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IKontaktHero } from "@/models/kontakt-page.model";

const fadeUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.5 },
};

const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

interface AnimatedHeroProps {
	data: IKontaktHero;
	phone: string;
	email: string;
}

export function AnimatedHero({ data, phone, email }: AnimatedHeroProps) {
	return (
		<section className="relative overflow-hidden bg-linear-to-b from-slate-200 to-primary/20 padding-top pb-24">
			{/* Background Pattern */}
			{/* <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" /> */}
			<div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/3 translate-x-1/3 rounded-full bg-secondary/20 blur-3xl" />
			<div className="absolute bottom-0 left-0 h-[400px] w-[400px] translate-y-1/3 -translate-x-1/3 rounded-full bg-white/5 blur-3xl" />

			<div className="_container relative z-10">
				<motion.div
					initial="initial"
					animate="animate"
					variants={staggerContainer}
					className="mx-auto max-w-4xl text-center"
				>
					{/* Badge */}
					{data.badge && (
						<motion.div
							variants={fadeUp}
							className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
						>
							<MessageCircle className="h-4 w-4 text-primary" />
							<span className="text-sm font-medium text-black">
								{data.badge}
							</span>
						</motion.div>
					)}

					{/* Heading */}
					<motion.h1
						variants={fadeUp}
						className="mb-6 text-4xl font-medium tracking-tight text-primary md:text-5xl lg:text-6xl"
					>
						{data.title}
					</motion.h1>

					{/* Description */}
					<motion.p
						variants={fadeUp}
						className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-black md:text-xl"
					>
						{data.subtitle}
					</motion.p>

					{/* Quick Contact Buttons */}
					<motion.div
						variants={fadeUp}
						className="flex flex-wrap items-center justify-center gap-4"
					>
						<Button
							size="lg"
							className="h-12 gap-2 rounded-full bg-primary px-8 text-white shadow-lg shadow-secondary/30 hover:bg-primary"
							asChild
						>
							<a href={`tel:${phone.replace(/\s/g, "")}`}>
								<Phone className="h-5 w-5" />
								{phone}
							</a>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="h-12 gap-2 rounded-full border-white/30 bg-primary/10 px-8 text-white backdrop-blur-sm hover:bg-primary/20"
							asChild
						>
							<a href={`mailto:${email}`}>
								<Mail className="h-5 w-5" />
								{email}
							</a>
						</Button>
					</motion.div>

					{/* Quick Info */}
					<motion.div
						variants={fadeUp}
						className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-white/80"
					>
						{data.responseTime && (
							<div className="flex items-center gap-2">
								<MessageCircle className="h-4 w-4 text-secondary" />
								<span>{data.responseTime}</span>
							</div>
						)}
						{data.officeLocationsText && (
							<div className="flex items-center gap-2">
								<span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
								<span>{data.officeLocationsText}</span>
							</div>
						)}
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
