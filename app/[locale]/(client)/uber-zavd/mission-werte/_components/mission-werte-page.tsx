"use client";

import { useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { useEffect, useRef, useState } from "react";
import { KontaktInfoSection } from "@/app/[locale]/(client)/kontakt/_components/kontakt-info-section";
import { CheckCircle2, Heart, Globe } from "lucide-react";

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
	image?: string;
}

interface MissionWerteValue {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	image?: string;
}

interface StatItem {
	value?: number;
	suffix?: string;
	labelDe?: string;
	labelEn?: string;
}

interface StatsSection {
	headingDe?: string;
	headingEn?: string;
	items?: StatItem[];
}

interface GoalItem {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

interface GoalsSection {
	headingDe?: string;
	headingEn?: string;
	items?: GoalItem[];
}

interface ApproachStep {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

interface ApproachSection {
	headingDe?: string;
	headingEn?: string;
	steps?: ApproachStep[];
}

interface MissionWertePageData {
	hero: MissionWerteHero;
	intro: MissionWerteIntro;
	values: MissionWerteValue[];
	stats?: StatsSection;
	goals?: GoalsSection;
	approach?: ApproachSection;
}

// ─── Animated Counter ───────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
	const [count, setCount] = useState(0);
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true });

	useEffect(() => {
		if (!inView) return;
		let start = 0;
		const duration = 1800;
		const steps = 60;
		const increment = target / steps;
		const interval = duration / steps;
		const timer = setInterval(() => {
			start += increment;
			if (start >= target) {
				setCount(target);
				clearInterval(timer);
			} else {
				setCount(Math.floor(start));
			}
		}, interval);
		return () => clearInterval(timer);
	}, [inView, target]);

	return (
		<span ref={ref}>
			{count}
			{suffix}
		</span>
	);
}

// ─── Section Heading Helper ─────────────────────────────────────────────────

function SectionHeading({ label, heading }: { label?: string; heading: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className="text-center mb-14"
		>
			{label && (
				<div className="flex items-center justify-center gap-3 mb-4">
					<span className="w-8 h-px bg-primary block" />
					<span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">{label}</span>
					<span className="w-8 h-px bg-primary block" />
				</div>
			)}
			<h2 className="text-3xl md:text-4xl font-bold text-gray-900">{heading}</h2>
		</motion.div>
	);
}

// ─── Main Component ─────────────────────────────────────────────────────────

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
			.then((json) => {
				if (json) setPageData(json);
			})
			.catch(() => {});
	}, []);

	const hero = pageData?.hero ?? {};
	const intro = pageData?.intro ?? {};
	const values = pageData?.values ?? [];
	const stats = pageData?.stats ?? {};
	const goals = pageData?.goals ?? {};
	const approach = pageData?.approach ?? {};

	const heroTagline = isEn ? hero.taglineEn || "Our Core Values" : hero.taglineDe || "Unsere Grundwerte";
	const heroTitle = isEn ? hero.titleEn || "Mission & Values" : hero.titleDe || "Mission & Werte";
	const heroSubtitle = isEn ? hero.subtitleEn || "" : hero.subtitleDe || "";
	const heroImage = hero.image || "/images/about/aboutbanner.jpg";

	const introTagline = isEn ? intro.taglineEn || "Our Mission" : intro.taglineDe || "Unsere Mission";
	const introHeading = "We Working For";
	const introParagraph = isEn
		? intro.paragraphEn || "We are a non-profit organization dedicated to supporting refugees and helping them integrate into society. Our work is driven by a commitment to human dignity, solidarity, and inclusion. Together we build bridges between cultures and create a future full of opportunity."
		: intro.paragraphDe || "Wir sind eine gemeinnützige Organisation, die Geflüchtete unterstützt und ihnen hilft, sich in die Gesellschaft zu integrieren. Unsere Arbeit wird von einem Engagement für Menschenwürde, Solidarität und Inklusion geleitet. Gemeinsam bauen wir Brücken zwischen Kulturen und schaffen eine Zukunft voller Möglichkeiten.";
	const introImage = intro.image || "/images/about/office1pg.jpg";

	// ── Stats fallback ──
	const statsHeading = isEn ? stats.headingEn || "Facts & Figures" : stats.headingDe || "Zahlen & Fakten";
	const statsItems = (stats.items && stats.items.length > 0) ? stats.items : [
		{ value: 1200, suffix: "+", labelDe: "Geflüchtete unterstützt", labelEn: "Refugees supported" },
		{ value: 15,   suffix: "+", labelDe: "Jahre Erfahrung",         labelEn: "Years of experience" },
		{ value: 30,   suffix: "+", labelDe: "Partnerorganisationen",   labelEn: "Partner organizations" },
		{ value: 98,   suffix: "%", labelDe: "Zufriedenheitsrate",      labelEn: "Satisfaction rate" },
	];

	// ── Goals fallback ──
	const goalsHeading = isEn ? goals.headingEn || "Our Goals" : goals.headingDe || "Unsere Ziele";
	const goalItems = (goals.items && goals.items.length > 0) ? goals.items : [
		{
			titleDe: "Integration fördern",
			titleEn: "Promote Integration",
			descriptionDe: "Wir unterstützen Geflüchtete bei der gesellschaftlichen und kulturellen Integration in Deutschland.",
			descriptionEn: "We support refugees in their social and cultural integration into German society.",
		},
		{
			titleDe: "Rechtliche Beratung",
			titleEn: "Legal Counseling",
			descriptionDe: "Kostenlose Rechtsberatung zu Asylverfahren, Aufenthaltsrecht und sozialen Leistungen.",
			descriptionEn: "Free legal advice on asylum procedures, residence law, and social benefits.",
		},
		{
			titleDe: "Sprachförderung",
			titleEn: "Language Support",
			descriptionDe: "Deutschkurse und Sprachförderung für Erwachsene und Kinder.",
			descriptionEn: "German language courses and language support for adults and children.",
		},
		{
			titleDe: "Bildung & Beruf",
			titleEn: "Education & Employment",
			descriptionDe: "Unterstützung beim Zugang zu Bildung, Ausbildung und dem Arbeitsmarkt.",
			descriptionEn: "Support in accessing education, training, and the labor market.",
		},
	];

	// ── Approach fallback ──
	const approachHeading = isEn ? approach.headingEn || "Our Approach" : approach.headingDe || "Unser Ansatz";
	const approachSteps = (approach.steps && approach.steps.length > 0) ? approach.steps : [
		{
			titleDe: "Erstkontakt & Bedarfsanalyse",
			titleEn: "First Contact & Needs Assessment",
			descriptionDe: "In einem ersten Gespräch analysieren wir die individuelle Situation und den spezifischen Bedarf jeder Person.",
			descriptionEn: "In an initial meeting, we analyze the individual situation and specific needs of each person.",
		},
		{
			titleDe: "Individuelle Begleitung",
			titleEn: "Individual Support",
			descriptionDe: "Jede Person erhält einen persönlichen Ansprechpartner, der sie auf ihrem Weg begleitet.",
			descriptionEn: "Each person receives a personal contact person who accompanies them on their journey.",
		},
		{
			titleDe: "Vernetzung & Integration",
			titleEn: "Networking & Integration",
			descriptionDe: "Wir verbinden Geflüchtete mit lokalen Netzwerken, Vereinen und Gemeinschaften.",
			descriptionEn: "We connect refugees with local networks, clubs, and communities.",
		},
		{
			titleDe: "Nachhaltige Selbstständigkeit",
			titleEn: "Sustainable Independence",
			descriptionDe: "Unser Ziel ist es, dass Geflüchtete ein selbstbestimmtes und unabhängiges Leben führen können.",
			descriptionEn: "Our goal is for refugees to be able to lead a self-determined and independent life.",
		},
	];

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
			<section className="py-24 bg-white overflow-hidden">
				<div className="_container">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

						{/* Image side */}
						<motion.div
							initial={{ opacity: 0, x: -60 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, ease: "easeOut" }}
							className="relative"
						>
							{/* Decorative bg block */}
							<motion.div
								initial={{ opacity: 0, scale: 0.85 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="absolute -top-5 -left-5 w-[85%] h-[85%] bg-primary/8 rounded-2xl"
							/>
							{/* Main image */}
							<div className="group relative h-[480px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer">
								<Image src={introImage} alt={introHeading} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
								<div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
								<div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							</div>
							{/* Floating badge — bottom right */}
							<motion.div
								initial={{ opacity: 0, y: 24, scale: 0.9 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.6 }}
								className="absolute -bottom-6 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 flex items-center gap-3 min-w-[170px]"
							>
								<div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
									<Heart className="w-5 h-5 text-primary" />
								</div>
								<div>
									<p className="text-xl font-extrabold text-gray-900 leading-none">1200+</p>
									<p className="text-xs text-gray-500 mt-0.5">{isEn ? "Lives changed" : "Leben verändert"}</p>
								</div>
							</motion.div>
							{/* Floating badge — top right */}
							<motion.div
								initial={{ opacity: 0, y: -20, scale: 0.9 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.5 }}
								className="absolute -top-4 right-6 bg-primary rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2"
							>
								<Globe className="w-4 h-4 text-white" />
								<span className="text-white text-xs font-semibold">{isEn ? "Since 2009" : "Seit 2009"}</span>
							</motion.div>
						</motion.div>

						{/* Text side */}
						<div className="space-y-7 lg:pl-4">
							{/* Heading */}
							<motion.h2
								initial={{ opacity: 0, y: 24 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.1 }}
								className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.15]"
							>
								{introHeading}
							</motion.h2>
							{/* Accent bar */}
							<motion.div
								initial={{ scaleX: 0 }}
								whileInView={{ scaleX: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="w-14 h-1 bg-primary rounded-full origin-left"
							/>
							{/* Paragraph */}
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="text-gray-500 text-base md:text-lg leading-relaxed"
							>
								{introParagraph}
							</motion.p>
						</div>
					</div>
				</div>
			</section>

			{/* ─── 3. Zahlen & Fakten (Impact Stats) ─── */}
			{statsItems.length > 0 && (
				<section className="py-20 bg-primary">
					<div className="_container">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-center mb-14"
						>
							<div className="flex items-center justify-center gap-3 mb-4">
								<span className="w-8 h-px bg-white/60 block" />
								<span className="text-white/80 text-xs font-semibold uppercase tracking-[0.2em]">
									{isEn ? "Impact" : "Wirkung"}
								</span>
								<span className="w-8 h-px bg-white/60 block" />
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-white">{statsHeading}</h2>
						</motion.div>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
							{statsItems.map((stat, i) => {
								const label = isEn ? stat.labelEn : stat.labelDe;
								return (
									<motion.div
										key={i}
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: i * 0.1 }}
										className="text-center"
									>
										<div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
											<AnimatedCounter
												target={stat.value ?? 0}
												suffix={stat.suffix ?? "+"}
											/>
										</div>
										{label && (
											<p className="text-white/75 text-sm font-medium uppercase tracking-wider">
												{label}
											</p>
										)}
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>
			)}

			{/* ─── 4. Values Grid ─── */}
			{values.length > 0 && (
				<section className="py-20 bg-gray-50">
					<div className="_container">
						<SectionHeading
							label={isEn ? "Our Values" : "Unsere Werte"}
							heading={isEn ? "What We Stand For" : "Wofür wir stehen"}
						/>

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
												<Image src={value.image} alt={title || ""} fill className="object-cover" />
											</div>
										)}
										<div className="p-6">
											{!value.image && (
												<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
													<span className="text-primary font-bold text-sm">{i + 1}</span>
												</div>
											)}
											{title && <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>}
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

			{/* ─── 5. Ziele (Goals) ─── */}
			{goalItems.length > 0 && (
				<section className="py-20 bg-white">
					<div className="_container">
						<SectionHeading
							label={isEn ? "Goals" : "Ziele"}
							heading={goalsHeading}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
							{goalItems.map((goal, i) => {
								const title = isEn ? goal.titleEn : goal.titleDe;
								const description = isEn ? goal.descriptionEn : goal.descriptionDe;

								return (
									<motion.div
										key={i}
										initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
										whileInView={{ opacity: 1, x: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: i * 0.08 }}
										className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
									>
										<div className="flex-shrink-0 mt-0.5">
											<CheckCircle2 className="w-6 h-6 text-primary" />
										</div>
										<div>
											{title && (
												<h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
											)}
											{description && (
												<p className="text-gray-500 text-sm leading-relaxed">{description}</p>
											)}
										</div>
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>
			)}

			{/* ─── 6. Unsere Ansatz (Approach) ─── */}
			{approachSteps.length > 0 && (
				<section className="py-20 bg-gray-50">
					<div className="_container">
						<SectionHeading
							label={isEn ? "How We Work" : "Wie wir arbeiten"}
							heading={approachHeading}
						/>

						<div className="relative max-w-3xl mx-auto">
							{/* vertical line */}
							<div className="absolute left-6 top-0 bottom-0 w-px bg-primary/20 hidden md:block" />

							<div className="space-y-8">
								{approachSteps.map((step, i) => {
									const title = isEn ? step.titleEn : step.titleDe;
									const description = isEn ? step.descriptionEn : step.descriptionDe;

									return (
										<motion.div
											key={i}
											initial={{ opacity: 0, y: 24 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true }}
											transition={{ duration: 0.5, delay: i * 0.1 }}
											className="flex gap-6"
										>
											<div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-md z-10">
												{i + 1}
											</div>
											<div className="flex-1 pb-2">
												{title && (
													<h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
												)}
												{description && (
													<p className="text-gray-500 text-sm leading-relaxed">{description}</p>
												)}
											</div>
										</motion.div>
									);
								})}
							</div>
						</div>
					</div>
				</section>
			)}

			{/* ─── 7. Contact Section ─── */}
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
