"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { useEffect, useState } from "react";
import { KontaktInfoSection } from "@/app/[locale]/(client)/kontakt/_components/kontakt-info-section";

// ─── Types ─────────────────────────────────────────────────────────────────

interface MissionWerteHero {
	taglineDe?: string;
	taglineEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

interface MissionWerteIntro {
	taglineDe?: string;
	taglineEn?: string;
	headingDe?: string;
	headingEn?: string;
	paragraphDe?: string;
	paragraphEn?: string;
}

interface MissionWerteValue {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	image?: string;
}

interface MissionWertePageData {
	hero: MissionWerteHero;
	intro: MissionWerteIntro;
	values: MissionWerteValue[];
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function MissionWertePage() {
	useSetNavbarVariant("transparent");
	const locale = useLocale();
	const isEn = locale === "en";

	const [sitePhone, setSitePhone] = useState("");
	const [siteEmail, setSiteEmail] = useState("");
	const [pageData, setPageData] = useState<MissionWertePageData | null>(null);

	useEffect(() => {
		fetch("/api/site-settings")
			.then((res) => (res.ok ? res.json() : null))
			.then((json) => {
				if (json) {
					setSitePhone(json.phone || "");
					setSiteEmail(json.email || "");
				}
			})
			.catch(() => {});
	}, []);

	useEffect(() => {
		fetch("/api/mission-werte-page")
			.then((res) => (res.ok ? res.json() : null))
			.then((json) => { if (json) setPageData(json); })
			.catch(() => {});
	}, []);

	const hero = pageData?.hero ?? {};
	const intro = pageData?.intro ?? {};
	const values = pageData?.values ?? [];

	const heroTagline = isEn ? (hero.taglineEn || "Our Core Values") : (hero.taglineDe || "Unsere Grundwerte");
	const heroTitle = isEn ? (hero.titleEn || "Mission & Values") : (hero.titleDe || "Mission & Werte");
	const heroSubtitle = isEn ? (hero.subtitleEn || "") : (hero.subtitleDe || "");
	const heroImage = hero.image || "/images/about/aboutbanner.jpg";

	const introTagline = isEn ? intro.taglineEn : intro.taglineDe;
	const introHeading = isEn ? (intro.headingEn || "Our Mission") : (intro.headingDe || "Unsere Mission");
	const introParagraph = isEn ? intro.paragraphEn : intro.paragraphDe;

	return (
		<div className="min-h-screen bg-white">

			{/* ─── 1. Hero Banner ─── */}
			<section className="relative h-[420px] md:h-[500px] overflow-hidden">
				<motion.div
					className="absolute inset-0"
					initial={{ scale: 1 }}
					animate={{ scale: 1.08 }}
					transition={{ duration: 10, ease: "easeOut" }}
				>
					<Image src={heroImage} alt={heroTitle} fill className="object-cover" priority />
				</motion.div>
				<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
				<div className="absolute inset-0 flex items-center justify-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className="text-center px-4"
					>
						<motion.span
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-5"
						>
							<span className="w-5 h-px bg-primary" />
							{heroTagline}
							<span className="w-5 h-px bg-primary" />
						</motion.span>
						<h1 className="text-5xl md:text-6xl font-extrabold text-white leading-none mb-5 tracking-tight">
							{heroTitle}
						</h1>
						{heroSubtitle && (
							<p className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
								{heroSubtitle}
							</p>
						)}
					</motion.div>
				</div>
			</section>

			{/* ─── 2. Intro / Mission ─── */}
			{(introHeading || introParagraph) && (
				<section className="py-20 bg-white">
					<div className="_container max-w-3xl mx-auto text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
						>
							{introTagline && (
								<div className="flex items-center justify-center gap-3 mb-5">
									<span className="w-8 h-px bg-primary block" />
									<span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
										{introTagline}
									</span>
									<span className="w-8 h-px bg-primary block" />
								</div>
							)}
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
								{introHeading}
							</h2>
							{introParagraph && (
								<p className="text-gray-500 text-base md:text-lg leading-relaxed">{introParagraph}</p>
							)}
						</motion.div>
					</div>
				</section>
			)}

			{/* ─── 3. Values Grid ─── */}
			{values.length > 0 && (
				<section className="py-20 bg-gray-50">
					<div className="_container">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-center mb-14"
						>
							<div className="flex items-center justify-center gap-3 mb-4">
								<span className="w-8 h-px bg-primary block" />
								<span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
									{isEn ? "Our Values" : "Unsere Werte"}
								</span>
								<span className="w-8 h-px bg-primary block" />
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
								{isEn ? "What We Stand For" : "Wofür wir stehen"}
							</h2>
						</motion.div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{values.map((value, i) => {
								const title = isEn ? value.titleEn : value.titleDe;
								const description = isEn ? value.descriptionEn : value.descriptionDe;

								return (
									<motion.div
										key={i}
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, margin: "-40px" }}
										transition={{ duration: 0.5, delay: i * 0.08 }}
										className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
									>
										{value.image && (
											<div className="relative h-48 w-full overflow-hidden">
												<Image
													src={value.image}
													alt={title || ""}
													fill
													className="object-cover"
												/>
											</div>
										)}
										<div className="p-6">
											{!value.image && (
												<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
													<span className="text-primary font-bold text-sm">{i + 1}</span>
												</div>
											)}
											{title && (
												<h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
											)}
											{description && (
												<p className="text-gray-500 text-sm leading-relaxed">{description}</p>
											)}
										</div>
										<div className="h-0.5 bg-primary" />
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>
			)}

			{/* ─── 4. Contact Section ─── */}
			<KontaktInfoSection
				contactInfo={{
					badge: isEn ? "Contact" : "Kontakt",
					heading: isEn ? "Get in Touch" : "Kontakt aufnehmen",
					phoneLabel: isEn ? "Phone Number" : "Telefonnummer",
					emailLabel: isEn ? "Email Address" : "E-Mail-Adresse",
					addressLabel: isEn ? "Our Address" : "Unsere Adresse",
				}}
				formSection={{
					heading: isEn ? "Have Any Question?" : "Haben Sie eine Frage?",
				}}
				phone={sitePhone}
				email={siteEmail}
			/>
		</div>
	);
}
