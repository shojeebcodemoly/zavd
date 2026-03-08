"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * FAQ Sidebar Component
 *
 * Sidebar with:
 * - Contact information
 * - Quick links
 * - CTA buttons
 * - Sticky positioning on desktop
 * - Responsive design
 */
export function FAQSidebar() {
	return (
		<aside className="space-y-6">
			{/* Contact Card */}
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}
				className="rounded-2xl border-2 border-tertiary bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300"
			>
				<h3 className="text-xl font-medium text-secondary mb-4">
					Behöver du hjälp?
				</h3>
				<p className="text-secondary/70 mb-6 leading-relaxed">
					Vårt team finns här för att hjälpa dig. Kontakta oss via telefon,
					e-post eller besök vårt kontor.
				</p>

				<div className="space-y-4">
					{/* Phone */}
					<a
						href="tel:010-205 15 01"
						className="flex items-start gap-3 p-3 rounded-xl hover:bg-tertiary transition-colors duration-300 group"
					>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
							<Phone className="h-5 w-5" />
						</div>
						<div>
							<div className="text-sm text-secondary/60 mb-0.5">
								Telefon
							</div>
							<div className="font-semibold text-secondary">
								010-205 15 01
							</div>
						</div>
					</a>

					{/* Email */}
					<a
						href="mailto:info@synos.se"
						className="flex items-start gap-3 p-3 rounded-xl hover:bg-tertiary transition-colors duration-300 group"
					>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
							<Mail className="h-5 w-5" />
						</div>
						<div>
							<div className="text-sm text-secondary/60 mb-0.5">
								E-post
							</div>
							<div className="font-semibold text-secondary">
								info@synos.se
							</div>
						</div>
					</a>

					{/* Office Hours */}
					<div className="flex items-start gap-3 p-3 rounded-xl bg-tertiary/50">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
							<Clock className="h-5 w-5" />
						</div>
						<div>
							<div className="text-sm text-secondary/60 mb-0.5">
								Öppettider
							</div>
							<div className="font-semibold text-secondary">
								Mån-Fre 9-17
							</div>
						</div>
					</div>
				</div>

				{/* CTA Button */}
				<Link
					href="/kontakt"
					className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full bg-primary text-white font-semibold hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
				>
					<span>Kontakta oss</span>
					<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
				</Link>
			</motion.div>

			{/* Quick Links Card */}
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="rounded-2xl border-2 border-tertiary bg-linear-to-br from-tertiary/40 to-tertiary/20 p-6 shadow-lg"
			>
				<h3 className="text-xl font-medium text-secondary mb-4">
					Snabblänkar
				</h3>
				<ul className="space-y-3">
					<li>
						<Link
							href="/produkter"
							className="flex items-center gap-2 text-secondary/80 hover:text-primary transition-colors duration-300 group"
						>
							<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
							<span>Våra produkter</span>
						</Link>
					</li>
					<li>
						<Link
							href="/om-oss"
							className="flex items-center gap-2 text-secondary/80 hover:text-primary transition-colors duration-300 group"
						>
							<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
							<span>Om oss</span>
						</Link>
					</li>
					<li>
						<Link
							href="/kontakt"
							className="flex items-center gap-2 text-secondary/80 hover:text-primary transition-colors duration-300 group"
						>
							<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
							<span>Kontakta oss</span>
						</Link>
					</li>
				</ul>
			</motion.div>

			{/* Office Location Card */}
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="rounded-2xl border-2 border-tertiary bg-white/80 backdrop-blur-sm p-6 shadow-lg"
			>
				<div className="flex items-center gap-2 mb-4">
					<MapPin className="h-5 w-5 text-primary" />
					<h3 className="text-xl font-medium text-secondary">Våra kontor</h3>
				</div>
				<div className="space-y-4 text-sm">
					<div>
						<div className="font-semibold text-secondary mb-1">
							Stockholm
						</div>
						<div className="text-secondary/70">
							Turebergsvägen 5<br />
							191 47 Sollentuna
						</div>
					</div>
					<div>
						<div className="font-semibold text-secondary mb-1">
							Linköping
						</div>
						<div className="text-secondary/70">
							Datalinjen 5<br />
							582 78 Linköping
						</div>
					</div>
				</div>
			</motion.div>
		</aside>
	);
}
