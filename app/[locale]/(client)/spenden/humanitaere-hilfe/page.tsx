import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { NavbarSetter } from "../_components/NavbarSetter";
import { HeroBanner } from "../_components/HeroBanner";

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function HumanitaereHilfePage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("humanitaereHilfe");
	const tSpenden = await getTranslations("spenden");
	const isEn = locale === "en";

	let dbData: Record<string, unknown> | null = null;
	try {
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
		const res = await fetch(`${baseUrl}/api/humanitaere-hilfe-page`, { next: { tags: ["humanitaere-hilfe-page"] } });
		if (res.ok) dbData = await res.json();
	} catch {}

	const hero = (dbData?.hero as Record<string, string>) || {};
	const left = (dbData?.left as Record<string, string>) || {};
	const middle = (dbData?.middle as Record<string, unknown>) || {};
	const right = (dbData?.right as Record<string, string>) || {};

	const heroTag = (isEn ? hero.taglineEn : hero.taglineDe) || t("heroBanner.tag");
	const heroTitle = (isEn ? hero.titleEn : hero.titleDe) || t("heroBanner.title");
	const heroSubtitle = (isEn ? hero.subtitleEn : hero.subtitleDe) || t("heroBanner.subtitle");
	const heroImage = hero.image || "/images/donate/Spenden-Syrien.jpg";

	const sectionTitle = (isEn ? left.sectionTitleEn : left.sectionTitleDe) || t("sectionTitle");
	const donationArrivesTitle = (isEn ? left.donationArrivesTitleEn : left.donationArrivesTitleDe) || t("left.donationArrivesTitle");
	const transparencyTitle = (isEn ? left.transparencyTitleEn : left.transparencyTitleDe) || t("left.transparencyTitle");
	const transparencyText = (isEn ? left.transparencyTextEn : left.transparencyTextDe) || t("left.transparencyText");
	const certificateTitle = (isEn ? left.certificateTitleEn : left.certificateTitleDe) || t("left.certificateTitle");
	const certificateText1 = (isEn ? left.certificateText1En : left.certificateText1De) || t("left.certificateText1");
	const certificateText2 = (isEn ? left.certificateText2En : left.certificateText2De) || t("left.certificateText2");
	const certificateLink = (isEn ? left.certificateLinkEn : left.certificateLinkDe) || t("left.certificateLink");
	const certificateText3 = (isEn ? left.certificateText3En : left.certificateText3De) || t("left.certificateText3");
	const certificateText4 = (isEn ? left.certificateText4En : left.certificateText4De) || t("left.certificateText4");

	const whyTitle = (isEn ? (middle.whyTitleEn as string) : (middle.whyTitleDe as string)) || t("middle.whyTitle");
	const whyText = (isEn ? (middle.whyTextEn as string) : (middle.whyTextDe as string)) || t("middle.whyText");
	const specialtyTitle = (isEn ? (middle.specialtyTitleEn as string) : (middle.specialtyTitleDe as string)) || t("middle.specialtyTitle");
	const specialtyItems = (middle.specialtyItems as Array<Record<string, string>>) || [];

	const transferTitle = (isEn ? right.transferTitleEn : right.transferTitleDe) || t("right.transferTitle");
	const recipientLabel = (isEn ? right.recipientLabelEn : right.recipientLabelDe) || t("right.recipient");
	const bankLabel = (isEn ? right.bankLabelEn : right.bankLabelDe) || t("right.bank");
	const bankName = right.bankName || t("right.bankName");
	const purposeLabel = (isEn ? right.purposeLabelEn : right.purposeLabelDe) || t("right.purpose");
	const purposeValue = (isEn ? right.purposeValueEn : right.purposeValueDe) || t("right.purposeValue");
	const iban = right.iban || "DE49 4785 0065 0000 8361 66";
	const bic = right.bic || "WELADED1GTL";
	const paypalTitle = (isEn ? right.paypalTitleEn : right.paypalTitleDe) || t("right.paypalTitle");
	const paypalText = (isEn ? right.paypalTextEn : right.paypalTextDe) || t("right.paypalText");
	const paypalButton = (isEn ? right.paypalButtonEn : right.paypalButtonDe) || t("right.paypalButton");

	return (
		<div className="min-h-screen bg-white">
			<NavbarSetter />

			{/* ── Banner / Hero ── */}
			<HeroBanner
				image={heroImage}
				tag={heroTag}
				title={heroTitle}
				subtitle={heroSubtitle}
				breadcrumbs={[
					{ label: "ZAVD", href: "/" },
					{ label: tSpenden("heroBanner.title"), href: "/spenden" },
					{ label: heroTitle },
				]}
			/>

			{/* ── Main Content ── */}
			<section className="py-16 bg-gray-50">
				<div className="_container">
					{/* Section Title */}
					<div className="mb-12">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
							{sectionTitle}
						</h2>
						<div className="w-16 h-1 bg-primary rounded-full" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

						{/* ── Left Column ── */}
						<div className="space-y-5">
							{/* Image Card */}
							<div className="rounded-xl overflow-hidden shadow-sm">
								<div className="relative h-48">
									<Image
										src="/images/donate/Spenden-Syrien.jpg"
										alt={donationArrivesTitle}
										fill
										className="object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
									<p className="absolute bottom-3 left-4 right-4 text-white font-semibold text-sm">
										{donationArrivesTitle}
									</p>
								</div>
							</div>

							{/* Transparency Card */}
							<div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
								<div className="flex items-center gap-2 mb-3">
									<div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
										<svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<h3 className="text-gray-900 font-semibold text-sm">{transparencyTitle}</h3>
								</div>
								<p className="text-gray-500 text-xs leading-relaxed">{transparencyText}</p>
							</div>

							{/* Certificate Card */}
							<div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
								<div className="flex items-center gap-2 mb-3">
									<div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
										<svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
										</svg>
									</div>
									<h3 className="text-gray-900 font-semibold text-sm">{certificateTitle}</h3>
								</div>
								<p className="text-gray-500 text-xs leading-relaxed">{certificateText1}</p>
								<p className="text-gray-500 text-xs leading-relaxed mt-2">
									{certificateText2}{" "}
									<span className="text-primary font-semibold">{certificateLink}</span>{" "}
									{certificateText3}
								</p>
								<p className="text-gray-500 text-xs leading-relaxed mt-2">{certificateText4}</p>
							</div>
						</div>

						{/* ── Middle Column ── */}
						<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
							<h3 className="text-gray-900 font-bold text-base mb-3">{whyTitle}</h3>
							<p className="text-gray-500 text-sm leading-relaxed mb-5">{whyText}</p>

							<p className="text-gray-800 font-semibold text-sm mb-4">{specialtyTitle}</p>
							<ul className="space-y-3">
								{(specialtyItems.length > 0
									? specialtyItems.map((item) => isEn ? item.textEn : item.textDe)
									: [
										t("middle.specialty1"),
										t("middle.specialty2"),
										t("middle.specialty3"),
										t("middle.specialty4"),
									]
								).map((item, i) => (
									<li key={i} className="flex gap-3 text-sm text-gray-600">
										<span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
											<svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
												<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
											</svg>
										</span>
										<span className="leading-relaxed">{item}</span>
									</li>
								))}
							</ul>
						</div>

						{/* ── Right Column ── */}
						<div className="space-y-5">
							{/* Bank Transfer Card */}
							<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
								<div className="px-5 pt-4 pb-2 border-b border-gray-100">
									<h3 className="text-gray-900 font-bold text-sm">{transferTitle}</h3>
								</div>
								<div className="p-5 space-y-3">
									{[
										{ label: recipientLabel, value: "ZAVD e.V.", mono: false },
										{ label: "IBAN", value: iban, mono: true },
										{ label: "BIC", value: bic, mono: true },
										{ label: bankLabel, value: bankName, mono: false },
										{ label: purposeLabel, value: purposeValue, mono: false },
									].map(({ label, value, mono }) => (
										<div key={label} className="grid grid-cols-[130px_1fr] gap-2 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
											<span className="text-gray-500 text-xs font-medium pt-0.5">{label}</span>
											<span className={`text-gray-900 text-xs font-semibold ${mono ? "font-mono tracking-wide" : ""}`}>
												{value}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* PayPal Card */}
							<div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
								<h3 className="text-gray-900 font-semibold text-sm mb-2">{paypalTitle}</h3>
								<p className="text-gray-500 text-xs leading-relaxed mb-4">{paypalText}</p>
								<a
									href="https://www.paypal.com/donate"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-2 w-full bg-[#003087] hover:bg-[#002570] text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 text-sm shadow-md hover:shadow-lg"
								>
									<svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0">
										<path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.26-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.477z" />
									</svg>
									{paypalButton}
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
