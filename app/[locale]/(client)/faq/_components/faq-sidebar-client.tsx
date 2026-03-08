"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { IFAQSidebarSection } from "@/models/faq-page.model";

interface FAQSidebarClientProps {
	data: IFAQSidebarSection;
}

export function FAQSidebarClient({ data }: FAQSidebarClientProps) {
	const validQuickLinks = (data.quickLinks || []).filter((l) => l.label);
	const validOffices = (data.offices || []).filter((o) => o.name);

	const hasContactInfo =
		data.contactTitle ||
		data.contactDescription ||
		data.phone ||
		data.email ||
		data.officeHours;

	return (
		<aside className="space-y-6">
			{/* Contact Card */}
			{hasContactInfo && (
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="rounded-2xl border-2 border-tertiary bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300"
				>
					{data.contactTitle && (
						<h3 className="text-xl font-medium text-secondary mb-4">
							{data.contactTitle}
						</h3>
					)}
					{data.contactDescription && (
						<p className="text-secondary/70 mb-6 leading-relaxed">
							{data.contactDescription}
						</p>
					)}

					<div className="space-y-4">
						{/* Phone */}
						{data.phone && (
							<a
								href={`tel:${data.phone}`}
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
										{data.phone}
									</div>
								</div>
							</a>
						)}

						{/* Email */}
						{data.email && (
							<a
								href={`mailto:${data.email}`}
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
										{data.email}
									</div>
								</div>
							</a>
						)}

						{/* Office Hours */}
						{data.officeHours && (
							<div className="flex items-start gap-3 p-3 rounded-xl bg-tertiary/50">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Clock className="h-5 w-5" />
								</div>
								<div>
									<div className="text-sm text-secondary/60 mb-0.5">
										Öppettider
									</div>
									<div className="font-semibold text-secondary">
										{data.officeHours}
									</div>
								</div>
							</div>
						)}
					</div>

					{/* CTA Button */}
					{data.contactButtonText && data.contactButtonHref && (
						<Link
							href={data.contactButtonHref}
							className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full bg-primary text-white font-semibold hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
						>
							<span>{data.contactButtonText}</span>
							<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
						</Link>
					)}
				</motion.div>
			)}

			{/* Quick Links Card */}
			{(data.quickLinksTitle || validQuickLinks.length > 0) && (
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="rounded-2xl border-2 border-tertiary bg-linear-to-br from-tertiary/40 to-tertiary/20 p-6 shadow-lg"
				>
					{data.quickLinksTitle && (
						<h3 className="text-xl font-medium text-secondary mb-4">
							{data.quickLinksTitle}
						</h3>
					)}
					{validQuickLinks.length > 0 && (
						<ul className="space-y-3">
							{validQuickLinks.map((link, index) => (
								<li key={index}>
									<Link
										href={link.href || "#"}
										className="flex items-center gap-2 text-secondary/80 hover:text-primary transition-colors duration-300 group"
									>
										<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
										<span>{link.label}</span>
									</Link>
								</li>
							))}
						</ul>
					)}
				</motion.div>
			)}

			{/* Office Location Card */}
			{(data.officesTitle || validOffices.length > 0) && (
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="rounded-2xl border-2 border-tertiary bg-white/80 backdrop-blur-sm p-6 shadow-lg"
				>
					<div className="flex items-center gap-2 mb-4">
						<MapPin className="h-5 w-5 text-primary" />
						{data.officesTitle && (
							<h3 className="text-xl font-medium text-secondary">
								{data.officesTitle}
							</h3>
						)}
					</div>
					{validOffices.length > 0 && (
						<div className="space-y-4 text-sm">
							{validOffices.map((office, index) => (
								<div key={index}>
									<div className="font-semibold text-secondary mb-1">
										{office.name}
									</div>
									{office.address && (
										<div
											className="text-secondary/70"
											dangerouslySetInnerHTML={{
												__html: office.address.replace(/\n/g, "<br />"),
											}}
										/>
									)}
								</div>
							))}
						</div>
					)}
				</motion.div>
			)}
		</aside>
	);
}
