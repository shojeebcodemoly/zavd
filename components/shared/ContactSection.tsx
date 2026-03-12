"use client";

import { MapPin, Mail, Phone } from "lucide-react";
import { ContactInquiryForm } from "@/components/forms/ContactInquiryForm";
import type { IKontaktContactInfo, IKontaktFormSection } from "@/models/kontakt-page.model";

interface ContactSectionProps {
	contactInfo: IKontaktContactInfo;
	formSection: IKontaktFormSection;
	phone: string;
	email: string;
}

export function ContactSection({
	contactInfo,
	formSection,
	phone,
	email,
}: ContactSectionProps) {
	const resolvedPhone = contactInfo.phone || phone;
	const resolvedEmail = contactInfo.email || email;
	return (
		<section className="w-full py-16 lg:py-24 bg-gray-50">
			<div className="_container">
				<div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
					{/* Left column — Contact Info */}
					<div className="bg-primary rounded-2xl p-8 lg:p-10 text-white h-full">
						{/* Badge */}
						{contactInfo.badge && (
							<div className="flex items-center gap-3 mb-5">
								<span className="w-8 h-px bg-white/50 block" />
								<span className="text-sm font-medium text-white/80 tracking-wide uppercase">
									{contactInfo.badge}
								</span>
							</div>
						)}

						{/* Heading */}
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-10 leading-tight">
							{contactInfo.heading || "Get in Touch"}
						</h2>

						{/* Info items */}
						<div className="space-y-7">
							{/* Address */}
							{contactInfo.address && (
								<div className="flex items-start gap-5">
									<div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
										<MapPin className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="font-semibold text-white text-base mb-1">
											{contactInfo.addressLabel || "Our Address"}
										</p>
										<p className="text-white/70 text-sm leading-relaxed">
											{contactInfo.address}
										</p>
									</div>
								</div>
							)}

							{/* Email */}
							{resolvedEmail && (
								<div className="flex items-start gap-5">
									<div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
										<Mail className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="font-semibold text-white text-base mb-1">
											{contactInfo.emailLabel || "Email Address"}
										</p>
										<a
											href={`mailto:${resolvedEmail}`}
											className="text-white/70 text-sm hover:text-white transition-colors"
										>
											{resolvedEmail}
										</a>
									</div>
								</div>
							)}

							{/* Phone */}
							{resolvedPhone && (
								<div className="flex items-start gap-5">
									<div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
										<Phone className="w-5 h-5 text-white" />
									</div>
									<div>
										<p className="font-semibold text-white text-base mb-1">
											{contactInfo.phoneLabel || "Phone Number"}
										</p>
										<a
											href={`tel:${resolvedPhone.replace(/\s/g, "")}`}
											className="text-white/70 text-sm hover:text-white transition-colors"
										>
											{resolvedPhone}
										</a>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Right column — Form */}
					<div>
						{/* Form heading */}
						{formSection.heading && (
							<h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8 leading-tight">
								{formSection.heading}
							</h2>
						)}
						<ContactInquiryForm />
					</div>
				</div>
			</div>
		</section>
	);
}
