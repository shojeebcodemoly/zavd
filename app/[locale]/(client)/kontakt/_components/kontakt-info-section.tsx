import { Phone, Mail, MapPin } from "lucide-react";
import { KontaktSimpleForm } from "./kontakt-simple-form";
import type { IKontaktContactInfo, IKontaktFormSection } from "@/models/kontakt-page.model";

interface KontaktInfoSectionProps {
	contactInfo: IKontaktContactInfo;
	formSection: IKontaktFormSection;
	phone: string;
	email: string;
	isEn?: boolean;
}

export function KontaktInfoSection({
	contactInfo,
	formSection,
	phone,
	email,
	isEn = false,
}: KontaktInfoSectionProps) {
	const badge = isEn ? (contactInfo.badgeEn || contactInfo.badgeDe) : (contactInfo.badgeDe || contactInfo.badgeEn);
	const heading = isEn ? (contactInfo.headingEn || contactInfo.headingDe) : (contactInfo.headingDe || contactInfo.headingEn);
	const phoneLabel = isEn ? (contactInfo.phoneLabelEn || contactInfo.phoneLabelDe) : (contactInfo.phoneLabelDe || contactInfo.phoneLabelEn);
	const emailLabel = isEn ? (contactInfo.emailLabelEn || contactInfo.emailLabelDe) : (contactInfo.emailLabelDe || contactInfo.emailLabelEn);
	const addressLabel = isEn ? (contactInfo.addressLabelEn || contactInfo.addressLabelDe) : (contactInfo.addressLabelDe || contactInfo.addressLabelEn);
	const formHeading = isEn ? (formSection.headingEn || formSection.headingDe) : (formSection.headingDe || formSection.headingEn);

	return (
		<section className="w-full py-16 lg:py-24 bg-white">
			<div className="_container">
				<div className="grid lg:grid-cols-[42%_58%] gap-12 lg:gap-20 items-start">

					{/* -- Left Column -- */}
					<div className="pr-0 lg:pr-8">
						{/* Badge: line + text */}
						{badge && (
							<div className="flex items-center gap-3 mb-6">
								<span className="w-8 h-[2px] bg-primary block shrink-0" />
								<span className="text-primary text-sm font-semibold tracking-wide">
									{badge}
								</span>
							</div>
						)}

						{/* Heading */}
						<h2 className="text-[2.6rem] md:text-5xl font-bold text-gray-900 mb-10 leading-[1.1]">
							{heading || "Get in Touch"}
						</h2>

						{/* Contact items */}
						<div className="space-y-8">
							{/* Phone */}
							{phone && (
								<ContactItem
									icon={<Phone className="w-5 h-5 text-stone-500" />}
									label={phoneLabel || "Hotline"}
									value={
										<a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
											{phone}
										</a>
									}
								/>
							)}

							{/* Email */}
							{email && (
								<ContactItem
									icon={<Mail className="w-5 h-5 text-stone-500" />}
									label={emailLabel || "Send us an email"}
									value={
										<a href={`mailto:${email}`} className="hover:text-primary transition-colors">
											{email}
										</a>
									}
								/>
							)}

							{/* Address */}
							{contactInfo.address && (
								<ContactItem
									icon={<MapPin className="w-5 h-5 text-stone-500" />}
									label={addressLabel || "Address"}
									value={<span>{contactInfo.address}</span>}
								/>
							)}
						</div>

						{/* Bottom divider */}
						<div className="mt-12 border-t border-gray-200" />
					</div>

					{/* -- Right Column -- */}
					<div>
						<h2 className="text-[2.6rem] md:text-5xl font-bold text-gray-900 mb-8 leading-[1.1]">
							{formHeading || "Have Any Question?"}
						</h2>
						<KontaktSimpleForm />
					</div>

				</div>
			</div>
		</section>
	);
}

function ContactItem({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div className="flex items-start gap-5">
			{/* Circle icon — neutral beige like reference */}
			<div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center shrink-0 mt-0.5">
				{icon}
			</div>
			<div className="flex flex-col">
				<span className="text-xs text-gray-400 font-normal mb-1 tracking-wide">
					{label}
				</span>
				<span className="text-gray-900 font-bold text-base leading-snug">
					{value}
				</span>
			</div>
		</div>
	);
}
