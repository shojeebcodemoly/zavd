"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { ArrowRight, FileDown } from "lucide-react";
import { LogoSlider, type LogoSliderItem } from "@/components/common/logo-slider";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReadMoreLink {
	labelDe?: string;
	labelEn?: string;
	href?: string;
}

interface CoreDemand {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

interface ThemenPageData {
	hero: {
		taglineDe?: string;
		taglineEn?: string;
		titleDe?: string;
		titleEn?: string;
		subtitleDe?: string;
		subtitleEn?: string;
		image?: string;
	};
	integration: {
		headingDe?: string;
		headingEn?: string;
		paragraph1De?: string;
		paragraph1En?: string;
		paragraph2De?: string;
		paragraph2En?: string;
		image?: string;
		badgeTitleDe?: string;
		badgeTitleEn?: string;
		badgeSubtitleDe?: string;
		badgeSubtitleEn?: string;
		ctaLabelDe?: string;
		ctaLabelEn?: string;
		ctaHref?: string;
		readMoreLinks?: ReadMoreLink[];
	};
	irakSyrien: {
		headingDe?: string;
		headingEn?: string;
		paragraphDe?: string;
		paragraphEn?: string;
		image?: string;
		coreDemands?: CoreDemand[];
		dokumentationTitleDe?: string;
		dokumentationTitleEn?: string;
		dokumentationDescDe?: string;
		dokumentationDescEn?: string;
		dokumentationLinkLabelDe?: string;
		dokumentationLinkLabelEn?: string;
		dokumentationLinkHref?: string;
	};
}

// ─── Fallback data ────────────────────────────────────────────────────────────

const fallbackReadMoreLinks: ReadMoreLink[] = [
	{ labelDe: "unserem Integrationsprojekt", labelEn: "our integration project", href: "/projekte/gemeinsam-aktiv" },
	{ labelDe: "unserer Flüchtlingsbezugsgruppe", labelEn: "our refugee support group", href: "/projekte/get-aktiv" },
	{ labelDe: "unserem Patenschaftsprojekt", labelEn: "our mentorship project", href: "/projekte/patenschaftsprojekt" },
];

const fallbackCoreDemands: CoreDemand[] = [
	{
		titleDe: "Hilfe zur Selbstverteidigung",
		titleEn: "Aid for Self-Defense",
		descriptionDe: "Unterstützung der assyrischen Gemeinschaften beim Aufbau eigener Sicherheitsstrukturen zum Schutz vor terroristischen Angriffen.",
		descriptionEn: "Supporting Assyrian communities in building their own security structures to protect against terrorist attacks.",
	},
	{
		titleDe: "Humanitäre Unterstützung",
		titleEn: "Humanitarian Support",
		descriptionDe: "Bereitstellung von Nahrung, medizinischer Versorgung und Unterkunft für vertriebene Assyrer und andere Minderheiten in der Region.",
		descriptionEn: "Providing food, medical care, and shelter for displaced Assyrians and other minorities in the region.",
	},
	{
		titleDe: "Aufbau einer selbstverwalteten Region",
		titleEn: "Building a Self-Governed Region",
		descriptionDe: "Aufbau einer von den existenzbedrohten Minderheiten der Ninive-Ebene im Irak selbst verwalteten Region.",
		descriptionEn: "Building a self-governed region for the existentially threatened minorities of the Nineveh Plain in Iraq.",
	},
];

// ─── Topic Nav Items ──────────────────────────────────────────────────────────

const topicNavItems = [
	{ id: "integration", labelDe: "Integration", labelEn: "Integration" },
	{ id: "irak-syrien", labelDe: "Irak & Syrien", labelEn: "Iraq & Syria" },
	{ id: "dokumentation", labelDe: "Dokumentation", labelEn: "Documentation" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function ThemenPage({ partnerLogos = [] }: { partnerLogos?: LogoSliderItem[] }) {
	useSetNavbarVariant("transparent");
	const locale = useLocale();
	const isEn = locale === "en";

	const [activeSection, setActiveSection] = useState("integration");
	const [pageData, setPageData] = useState<ThemenPageData | null>(null);

	// Fetch CMS data
	useEffect(() => {
		fetch("/api/themen-page")
			.then((res) => (res.ok ? res.json() : null))
			.then((json) => { if (json) setPageData(json); })
			.catch(() => {});
	}, []);

	// Intersection Observer — highlights active nav item on scroll
	useEffect(() => {
		const observers: IntersectionObserver[] = [];

		topicNavItems.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (!el) return;

			const observer = new IntersectionObserver(
				([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
				{ rootMargin: "-35% 0px -55% 0px", threshold: 0 }
			);
			observer.observe(el);
			observers.push(observer);
		});

		return () => observers.forEach((o) => o.disconnect());
	}, []);

	const scrollTo = (id: string) => {
		const el = document.getElementById(id);
		if (!el) return;
		const offset = 130;
		const top = el.getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({ top, behavior: "smooth" });
	};

	// ── Resolved data (CMS or fallback) ──
	const hero = pageData?.hero ?? {};
	const integration = pageData?.integration ?? {};
	const irakSyrien = pageData?.irakSyrien ?? {};

	const heroTagline  = isEn ? hero.taglineEn  || "Our Topics"   : hero.taglineDe  || "Unsere Themen";
	const heroTitle    = isEn ? hero.titleEn    || "Topics"       : hero.titleDe    || "Themen";
	const heroSubtitle = isEn ? hero.subtitleEn || "Integration of refugees and the situation of Assyrians in Iraq and Syria — our two key areas of advocacy." : hero.subtitleDe || "Integration von Geflüchteten und die Situation der Assyrer in Irak und Syrien — unsere zwei zentralen Themenfelder.";
	const heroImage    = hero.image || "/images/about/aboutbanner.jpg";

	const intHeading    = isEn ? integration.headingEn || "Integration" : integration.headingDe || "Integration";
	const intParagraph1 = isEn ? integration.paragraph1En || "For us as an organization, the integration of refugees and migrants into mainstream society is an important concern. Our refugee support group meets regularly and does outstanding work. Events are organized for refugees to meet volunteers. Through this collaboration, refugees and volunteers should get to know each other, creating mutual trust and easing the integration process." : integration.paragraph1De || "Für uns als Zentralverband ist die Integration von Asylern und geflüchteten Menschen in die Mehrheitsgesellschaft ein wichtiges Anliegen. Unsere Flüchtlingsbezugsgruppe trifft sich regelmäßig und leistet damit einen außerordentlichen Beitrag. Zudem wird Veranstaltungen für Flüchtlinge mit progressiver Gesellschaft für eine effiziente sowie Pflege organisiert. Durch das Zusammenleben sollen die geflüchteten Menschen gestärkt werden und sich mit Ressourcen und Hilfestellungen der Freiwilligen vertraut machen.";
	const intParagraph2 = isEn ? integration.paragraph2En || "The ZAVD strives to promote language skills, knowledge, and projects with the aim of social integration of people with an Assyrian cultural background, especially in the areas of civic education, intercultural exchange, and political freedom." : integration.paragraph2De || "Der Verband strebt daran, Sprachkenntnisse, Kenntnisse, Fähigkeiten und Projekte mit dem Ziel der gesellschaftlichen Integration von Menschen mit assyrischem Kulturhintergrund zu fördern, vor allem in den Bereichen Bildung, interkultureller Austausch sowie Horizonterweiterung und politische Teilhabe.";
	const intImage      = integration.image || "/images/about/office1pg.jpg";
	const intBadgeTitle    = isEn ? integration.badgeTitleEn    || "Since 2009"               : integration.badgeTitleDe    || "Seit 2009";
	const intBadgeSubtitle = isEn ? integration.badgeSubtitleEn || "Active integration work"  : integration.badgeSubtitleDe || "Aktive Integrationsarbeit";
	const intCtaLabel   = isEn ? integration.ctaLabelEn || "Our Services"  : integration.ctaLabelDe || "Unsere Angebote";
	const intCtaHref    = integration.ctaHref || "/angebote-beratung";
	const readMoreLinks = (integration.readMoreLinks && integration.readMoreLinks.length > 0) ? integration.readMoreLinks : fallbackReadMoreLinks;
	const irakHeading    = isEn ? irakSyrien.headingEn  || "Iraq & Syria"  : irakSyrien.headingDe  || "Irak & Syrien";
	const irakParagraph  = isEn ? irakSyrien.paragraphEn || "The ZAVD has been working especially since the appearance of the terrorist organization IS in Syria and Iraq to represent the Assyrians before the German Federal Government and in the European Union. Working groups were founded to deal with the situation in Syria and Iraq, hold consultations with Assyrian representatives on the ground, and carry out lobby and public relations work for the interests of the persecuted Assyrians and other minorities. Since spring 2014, several protest actions have been organized. Furthermore, meetings with various political bodies take place, such as the Foreign Office, the Chancellery, Members of the German Bundestag or the European Parliament, and representatives of the European Commission." : irakSyrien.paragraphDe || "Der ZAVD bemüht sich insbesondere seit dem Auftauchen der Terrororganisation IS in Syrien und im Irak um die Vertretung der Assyrer bei der deutschen Bundesregierung und in der Europäischen Union. Hierzu wurden Arbeitskreise gegründet, die sich mit der Situation in Syrien und im Irak befassen, Absprachen mit den assyrischen Vertretern vor Ort halten, Lobby und Öffentlichkeitsarbeit für die Interessen der verfolgten Assyrer und anderer Minderheiten betreiben. Seit dem Frühling 2014 wurden mehrere Protestaktionen organisiert. Des Weiteren finden Meetings mit verschiedenen politischen Instanzen statt, wie etwa mit dem Auswärtigen Amt, dem Kanzleramt, Abgeordneten des Deutschen Bundestages oder des Europäischen Parlaments sowie Vertreter der Europäischen Kommission.";
	const irakImage      = irakSyrien.image || "/images/donate/Spenden-Syrien.jpg";
	const coreDemands    = (irakSyrien.coreDemands && irakSyrien.coreDemands.length > 0) ? irakSyrien.coreDemands : fallbackCoreDemands;

	const doktTitle    = isEn ? irakSyrien.dokumentationTitleEn    || "Eyewitness Reports & Documentation"                    : irakSyrien.dokumentationTitleDe    || "Augenzeugenberichte & Dokumentationen";
	const doktDesc     = isEn ? irakSyrien.dokumentationDescEn     || "Based on eyewitness reports and human rights organizations, the ZAVD has created documentation on the expulsion of Assyrians and other minorities in northern Iraq in 2014." : irakSyrien.dokumentationDescDe     || "Basierend auf Berichten von Augenzeugen und Menschenrechtsorganisationen hat der ZAVD eine Dokumentation über die Vertreibung der Assyrer und anderer Minderheiten im Jahr 2014 im Nordirak erstellt.";
	const doktLabel    = isEn ? irakSyrien.dokumentationLinkLabelEn || "ZAVD – Documentation – Events Iraq 2014"               : irakSyrien.dokumentationLinkLabelDe || "ZAVD – Dokumentation – Ereignisse Irak 2014";
	const doktHref     = irakSyrien.dokumentationLinkHref || "#";

	return (
		<div className="min-h-screen bg-white">

			{/* ── 1. Hero Banner ─────────────────────────────────────────────── */}
			<section className="relative h-[500px] md:h-[600px] overflow-hidden">
				<motion.div
					className="absolute inset-0"
					initial={{ scale: 1 }}
					animate={{ scale: 1.08 }}
					transition={{ duration: 12, ease: "easeOut" }}
				>
					<Image src={heroImage} alt={heroTitle} fill className="object-cover" priority sizes="100vw" />
				</motion.div>
				<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />

				<div className="absolute inset-0 flex items-center justify-center">
					<motion.div
						initial={{ opacity: 0, y: 36 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center px-4"
					>
						<motion.span
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.15 }}
							className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-[0.22em] mb-5"
						>
							<span className="w-6 h-px bg-primary" />
							{heroTagline}
							<span className="w-6 h-px bg-primary" />
						</motion.span>
						<h1 className="text-6xl md:text-7xl font-extrabold text-white leading-none mb-5 tracking-tight">
							{heroTitle}
						</h1>
						<p className="text-white/65 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
							{heroSubtitle}
						</p>
						<nav className="flex items-center justify-center gap-2 text-xs text-white/45">
							<Link href="/" className="hover:text-white transition-colors">
								{isEn ? "Home" : "Startseite"}
							</Link>
							<span className="text-white/25">/</span>
							<span className="text-white/80">{heroTitle}</span>
						</nav>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2, duration: 0.6 }}
					className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
				>
					<span className="text-white/40 text-xs uppercase tracking-widest">
						{isEn ? "Scroll" : "Scrollen"}
					</span>
					<motion.div
						animate={{ y: [0, 6, 0] }}
						transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
						className="w-px h-8 bg-white/25"
					/>
				</motion.div>
			</section>

			{/* ── 2. Sticky Topic Navigation Bar ─────────────────────────────── */}
			<div className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
				<div className="_container">
					<div className="flex items-center overflow-x-auto scrollbar-hide">
						{topicNavItems.map(({ id, labelDe, labelEn: labelEnText }) => (
							<button
								key={id}
								onClick={() => scrollTo(id)}
								className={`relative flex-shrink-0 px-7 py-4 text-sm font-semibold transition-colors duration-200 ${
									activeSection === id ? "text-primary" : "text-gray-500 hover:text-gray-800"
								}`}
							>
								{isEn ? labelEnText : labelDe}
								{activeSection === id && (
									<motion.div
										layoutId="topicNavIndicator"
										className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
										transition={{ type: "spring", stiffness: 400, damping: 32 }}
									/>
								)}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* ── 3. Integration Section ──────────────────────────────────────── */}
			<section id="integration" className="py-24 bg-white overflow-hidden">
				<div className="_container">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

						{/* Text side */}
						<motion.div
							initial={{ opacity: 0, x: -44 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.75, ease: "easeOut" }}
							className="space-y-6"
						>
							<div className="inline-flex items-center gap-2">
								<span className="w-6 h-px bg-primary" />
								<span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
									{isEn ? "Topic 01" : "Thema 01"}
								</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
								{intHeading}
							</h2>
							<motion.div
								initial={{ scaleX: 0 }}
								whileInView={{ scaleX: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="w-14 h-1 bg-primary rounded-full origin-left"
							/>
							<p className="text-gray-500 text-base leading-relaxed">{intParagraph1}</p>
							{intParagraph2 && (
								<p className="text-gray-500 text-base leading-relaxed">{intParagraph2}</p>
							)}

							{/* Read more list */}
							{readMoreLinks.length > 0 && (
								<div className="pt-1">
									<p className="text-gray-800 font-semibold text-sm mb-3">
										{isEn ? "Read more about:" : "Lesen Sie hier mehr zu:"}
									</p>
									<ul className="space-y-2.5">
										{readMoreLinks.map((link, i) => (
											<li key={i}>
												<Link
													href={link.href || "#"}
													className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline underline-offset-2 transition-colors"
												>
													<span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
													{isEn ? link.labelEn : link.labelDe}
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}

							{/* CTA */}
							<div className="pt-2">
								<Link
									href={intCtaHref}
									className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-sm"
								>
									{intCtaLabel}
									<ArrowRight className="w-4 h-4" />
								</Link>
							</div>
						</motion.div>

						{/* Image side */}
						<motion.div
							initial={{ opacity: 0, x: 44 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.75, ease: "easeOut" }}
							className="relative"
						>
							<div className="absolute -top-5 -right-5 w-[78%] h-[78%] bg-primary/8 rounded-2xl" />
							<div className="group relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
								<Image
									src={intImage}
									alt={intHeading}
									fill
									sizes="(max-width: 1024px) 100vw, 50vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
							</div>
							<motion.div
								initial={{ opacity: 0, y: 20, scale: 0.9 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.5 }}
								className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-5 py-4 border border-gray-100 flex items-center gap-3"
							>
								<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
									<span className="text-primary font-extrabold text-sm">✓</span>
								</div>
								<div>
									<p className="text-sm font-extrabold text-gray-900 leading-none">{intBadgeTitle}</p>
									<p className="text-xs text-gray-400 mt-0.5">{intBadgeSubtitle}</p>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* ── 5. Irak & Syrien Section ────────────────────────────────────── */}
			<section id="irak-syrien" className="py-24 bg-gray-50 overflow-hidden">
				<div className="_container">

					<motion.div
						initial={{ opacity: 0, y: 28 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.65 }}
						className="mb-16"
					>
						<div className="inline-flex items-center gap-2 mb-4">
							<span className="w-6 h-px bg-primary" />
							<span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
								{isEn ? "Topic 02" : "Thema 02"}
							</span>
						</div>
						<h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
							{irakHeading}
						</h2>
						<motion.div
							initial={{ scaleX: 0 }}
							whileInView={{ scaleX: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.15 }}
							className="w-14 h-1 bg-primary rounded-full origin-left mb-6"
						/>
						<p className="text-gray-500 text-base leading-relaxed max-w-3xl">{irakParagraph}</p>
					</motion.div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

						{/* Core Demand Cards */}
						<div className="space-y-4">
							<h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.15em] mb-6">
								{isEn ? "Three Core Demands:" : "Die drei Kernforderungen:"}
							</h3>
							{coreDemands.map((card, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: i * 0.1 }}
									className="flex gap-5 bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300"
								>
									<div className="flex-shrink-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
										{String(i + 1).padStart(2, "0")}
									</div>
									<div>
										<h4 className="text-base font-bold text-gray-900 mb-1.5">
											{isEn ? card.titleEn : card.titleDe}
										</h4>
										<p className="text-gray-500 text-sm leading-relaxed">
											{isEn ? card.descriptionEn : card.descriptionDe}
										</p>
									</div>
								</motion.div>
							))}
						</div>

						{/* Image + Dokumentation card */}
						<div className="space-y-6">
							<motion.div
								initial={{ opacity: 0, x: 30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.7, ease: "easeOut" }}
								className="relative h-[280px] rounded-2xl overflow-hidden shadow-xl"
							>
								<Image src={irakImage} alt={irakHeading} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
								<div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
								<div className="absolute bottom-5 left-5 right-5">
									<p className="text-white font-bold text-lg leading-snug">{irakHeading}</p>
									<p className="text-white/65 text-sm mt-0.5">
										{isEn ? "Representing Assyrian Communities" : "Vertretung der assyrischen Gemeinschaft"}
									</p>
								</div>
							</motion.div>

							{/* Dokumentation card */}
							<motion.div
								id="dokumentation"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
							>
								<div className="inline-flex items-center gap-2 mb-3">
									<span className="w-5 h-px bg-primary" />
									<span className="text-primary text-xs font-semibold uppercase tracking-[0.18em]">
										{isEn ? "Documentation" : "Dokumentationen"}
									</span>
								</div>
								<h4 className="text-base font-bold text-gray-900 mb-2">{doktTitle}</h4>
								<p className="text-gray-500 text-sm leading-relaxed mb-5">{doktDesc}</p>
								<a
									href={doktHref}
									className="inline-flex items-center gap-2 text-primary font-semibold text-sm border border-primary/30 rounded-lg px-4 py-2.5 hover:bg-primary hover:text-white transition-all duration-200 group"
								>
									<FileDown className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
									{doktLabel}
								</a>
							</motion.div>
						</div>
					</div>
				</div>
			</section>

			{partnerLogos.length > 0 && (
				<LogoSlider logos={partnerLogos} />
			)}

			</div>
	);
}
