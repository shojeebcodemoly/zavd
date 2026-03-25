"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { IFAQSidebarSection } from "@/models/faq-page.model";

interface FAQSidebarClientProps {
	data: IFAQSidebarSection;
	isEn?: boolean;
}

export function FAQSidebarClient({ data, isEn = false }: FAQSidebarClientProps) {
	const contactTitle = isEn
		? (data.contactTitleEn || data.contactTitleDe)
		: (data.contactTitleDe || data.contactTitleEn);
	const contactDescription = isEn
		? (data.contactDescriptionEn || data.contactDescriptionDe)
		: (data.contactDescriptionDe || data.contactDescriptionEn);
	const contactButtonText = isEn
		? (data.contactButtonTextEn || data.contactButtonTextDe)
		: (data.contactButtonTextDe || data.contactButtonTextEn);
	const quickLinksTitle = isEn
		? (data.quickLinksTitleEn || data.quickLinksTitleDe)
		: (data.quickLinksTitleDe || data.quickLinksTitleEn);
	const officesTitle = isEn
		? (data.officesTitleEn || data.officesTitleDe)
		: (data.officesTitleDe || data.officesTitleEn);

	const validQuickLinks = (data.quickLinks || []).filter((l) =>
		isEn ? (l.labelEn || l.labelDe) : (l.labelDe || l.labelEn)
	);
	const validOffices = (data.offices || []).filter((o) => o.name);

	const hasContactInfo =
		contactTitle ||
		contactDescription ||
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
					{contactTitle && (
						<h3 className="text-xl font-medium text-secondary mb-4">
							{contactTitle}
						</h3>
					)}
					{contactDescription && (
						<p className="text-secondary/70 mb-6 leading-relaxed">
							{contactDescription}
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
										{isEn ? "Phone" : "Telefon"}
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
										E-Mail
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
										{isEn ? "Office Hours" : "Offnungszeiten"}
									</div>
									<div className="font-semibold text-secondary">
										{data.officeHours}
									</div>
								</div>
							</div>
						)}
					</div>

					{/* CTA Button */}
					{contactButtonText && data.contactButtonHref && (
						<Link
							href={data.contactButtonHref}
							className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full bg-primary text-white font-semibold hover:bg-secondary transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
						>
							<span>{contactButtonText}</span>
							<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
						</Link>
					)}
				</motion.div>
			)}

			{/* Quick Links Card */}
			{(quickLinksTitle || validQuickLinks.length > 0) && (
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="rounded-2xl border-2 border-tertiary bg-linear-to-br from-tertiary/40 to-tertiary/20 p-6 shadow-lg"
				>
					{quickLinksTitle && (
						<h3 className="text-xl font-medium text-secondary mb-4">
							{quickLinksTitle}
						</h3>
					)}
					{validQuickLinks.length > 0 && (
						<ul className="space-y-3">
							{validQuickLinks.map((link, index) => {
								const linkLabel = isEn
									? (link.labelEn || link.labelDe)
									: (link.labelDe || link.labelEn);
								return (
									<li key={index}>
										<Link
											href={link.href || "#"}
											className="flex items-center gap-2 text-secondary/80 hover:text-primary transition-colors duration-300 group"
										>
											<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
											<span>{linkLabel}</span>
										</Link>
									</li>
								);
							})}
						</ul>
					)}
				</motion.div>
			)}

			{/* Office Location Card */}
			{(officesTitle || validOffices.length > 0) && (
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="rounded-2xl border-2 border-tertiary bg-white/80 backdrop-blur-sm p-6 shadow-lg"
				>
					<div className="flex items-center gap-2 mb-4">
						<MapPin className="h-5 w-5 text-primary" />
						{officesTitle && (
							<h3 className="text-xl font-medium text-secondary">
								{officesTitle}
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
