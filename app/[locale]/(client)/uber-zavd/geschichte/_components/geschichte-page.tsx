"use client";

import { useLocale } from "next-intl";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { useEffect, useRef, useState } from "react";
import { KontaktInfoSection } from "@/app/[locale]/(client)/kontakt/_components/kontakt-info-section";

// ─── Types ─────────────────────────────────────────────────────────────────

interface GeschichteHero {
	taglineDe?: string;
	taglineEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

interface GeschichteStat {
	value?: number;
	suffix?: string;
	labelDe?: string;
	labelEn?: string;
}

interface GeschichteIntro {
	taglineDe?: string;
	taglineEn?: string;
	headingDe?: string;
	headingEn?: string;
	paragraphDe?: string;
	paragraphEn?: string;
}

interface GeschichteArticle {
	headingDe?: string;
	headingEn?: string;
	paragraph1De?: string;
	paragraph1En?: string;
	paragraph2De?: string;
	paragraph2En?: string;
	image?: string;
	captionDe?: string;
	captionEn?: string;
	direction?: string;
}

interface GeschichteEvent {
	yearDe?: string;
	yearEn?: string;
	titleDe?: string;
	titleEn?: string;
	textDe?: string;
	textEn?: string;
	image?: string;
}

interface GeschichtePageData {
	hero: GeschichteHero;
	stats: GeschichteStat[];
	intro: GeschichteIntro;
	articles: GeschichteArticle[];
	events: GeschichteEvent[];
}

// ─── Fallback defaults ─────────────────────────────────────────────────────

const defaultStats: GeschichteStat[] = [
	{ value: 60, suffix: "+", labelDe: "Jahre Geschichte", labelEn: "Years of History" },
	{ value: 20, suffix: "+", labelDe: "Städte in Deutschland", labelEn: "Cities in Germany" },
	{ value: 50, suffix: "+", labelDe: "Mitgliedsvereine", labelEn: "Member Associations" },
	{ value: 1965, suffix: "", labelDe: "Gegründet", labelEn: "Founded" },
];

const defaultArticles: GeschichteArticle[] = [
	{
		headingDe: "Die Anfänge", headingEn: "The Beginnings",
		paragraph1De: "Der Zentralverband besteht seit mehr als 60 Jahren als Gemeinschaftsorganisation. Die ersten assyrischen Gastarbeiter kamen 1965 aus Tur Abdin (Südosttürkei). In den 1960er Jahren lernten sie schnell die deutsche Sprache und bildeten Netzwerke, die wertvolle Unterstützung für andere Assyrer und Flüchtlinge boten.",
		paragraph1En: "The Central Association has been a community organization for more than 60 years. The first Assyrian guest workers arrived from Tur Abdin (southeastern Turkey) in 1965. In the mid-1960s, they quickly learned the German language and formed networks that provided valuable support to fellow Assyrians and refugees in the 1970s.",
		paragraph2De: "Assyrische Migranten bildeten organisierte Gruppen, um Verbindungen in Deutschland herzustellen. Familien kämpften mit Asylangelegenheiten und der Bewahrung ihrer Identität. Diese Vereinigungen führten zur Gründung des ZAVD als starke Vertretung für die assyrische Diaspora.",
		paragraph2En: "Assyrian migrants formed organized groups to create connections in Germany. Families dealt with asylum matters, language barriers, and preserving their identity in a foreign country. These associations eventually led to the founding of ZAVD as a strong representative body for the Assyrian diaspora.",
		image: "/images/about/office1pg.jpg", captionDe: "Frühes Gemeinschaftstreffen, 1965", captionEn: "Early community gathering, 1965", direction: "left",
	},
	{
		headingDe: "Zusammenschluss mit anderen Migrantenverbänden", headingEn: "Merger with Other Migrant Associations",
		paragraph1De: "Die Bundesarbeitsgemeinschaft der Immigrantenverbände (BAGIV) verband seit den frühen 1980er Jahren verschiedene Minderheitengruppen – darunter spanische, kurdische, armenische und portugiesisch-italienische Gruppen. Der Fokus lag auf dem Schutz der Rechte und der politischen Vertretung.",
		paragraph1En: "The Federal Association of Immigrant Associations in Germany (BAGIV) in the early 1980s connected minority national groups including Spanish, Kurdish, Armenian and Portuguese-Italian communities. The focus was on the protection of rights and political representation.",
		paragraph2De: "ZAVD trat 1985 der BAGIV bei, was einen Wendepunkt darstellte. Die Organisation gewann nationale Sichtbarkeit und konnte assyrische Interessen auf Bundesebene vertreten.",
		paragraph2En: "ZAVD joined BAGIV in 1985, marking a turning point. The organization gained national visibility and could advocate for Assyrian interests at the federal level.",
		image: "/images/about/office2.jpg", captionDe: "BAGIV-Koalitionstreffen, 1985", captionEn: "BAGIV coalition meeting, 1985", direction: "right",
	},
	{
		headingDe: "Einsatz für die Rechte von Minderheiten in der Heimat und Flüchtlinge", headingEn: "Advocacy for the Rights of Minorities in Their Homeland and Refugees",
		paragraph1De: "In den 1990er Jahren verschlechterte sich die Lage der Assyrer in ihrer Heimat dramatisch. In Tur Abdin wurden unzählige Menschen verfolgt. ZAVD spielte eine Schlüsselrolle bei der Organisation der Solidarität für assyrische Flüchtlinge in Deutschland.",
		paragraph1En: "In the 1990s, the situation for Assyrians in their homeland deteriorated dramatically. In Tur Abdin, countless people were persecuted and their land seized for military and economic purposes. ZAVD played a key role in organizing solidarity for Assyrian refugees in Germany.",
		paragraph2De: "ZAVD organisierte Protestdemonstrationen gegen die Diskriminierung von Christen im Irak und in Syrien. Gemeinsam mit anderen Organisationen überreichten sie Petitionen an Regierungsbeamte.",
		paragraph2En: "ZAVD organized protest demonstrations against the discrimination of Christians in Iraq and Syria. Together with other organizations, they presented petitions to government officials.",
		image: "/images/about/office3.jpg", captionDe: "Solidaritätsprotest, 1990er", captionEn: "Solidarity protest, 1990s", direction: "left",
	},
	{
		headingDe: "Gründung des AJM", headingEn: "Founding of the AJM",
		paragraph1De: "Im Jahr 2002 wurde der Assyrische Jugendverband Mitteleuropa (AJM) gegründet, um die Interessen junger Menschen zu vertreten. Der Verband wuchs aus dem 1977 gegründeten Jugendausschuss heraus.",
		paragraph1En: "In 2002, the Assyrian Youth Association of Central Europe (AJM) was founded to represent the interests of young people. The association grew from the youth committee established in 1977.",
		paragraph2De: "Der AJM organisiert heute jährliche Jugendlager, Sportveranstaltungen, Kulturfestivals und Bildungsaustausche in ganz Europa als Jugendflügel des ZAVD.",
		paragraph2En: "The AJM today organizes annual youth camps, sports events, cultural festivals, and educational exchanges across Europe as the youth wing of ZAVD.",
		image: "/images/about/office4.jpg", captionDe: "AJM-Gründungsversammlung, 2002", captionEn: "AJM founding meeting, 2002", direction: "right",
	},
];

const defaultEvents: GeschichteEvent[] = [
	{ yearDe: "1965", yearEn: "1965", titleDe: "Die ersten Ankünfte", titleEn: "The First Arrivals", textDe: "Die ersten assyrischen Gastarbeiter kommen aus Tur Abdin (Südosttürkei) nach Deutschland – der Beginn einer langen Geschichte der Gemeinschaft.", textEn: "The first Assyrian guest workers arrive in Germany from Tur Abdin (southeastern Turkey) – the beginning of a long community history.", image: "/images/about/aboutbanner.jpg" },
	{ yearDe: "1973", yearEn: "1973", titleDe: "Erster eingetragener Verein", titleEn: "First Registered Association", textDe: "Gründung des ersten offiziell eingetragenen assyrischen Vereins in Deutschland.", textEn: "The first officially registered Assyrian association in Germany is founded.", image: "/images/about/office1pg.jpg" },
	{ yearDe: "1985", yearEn: "1985", titleDe: "BAGIV-Zusammenschluss", titleEn: "BAGIV Coalition", textDe: "ZAVD schließt sich der Bundesarbeitsgemeinschaft der Immigrantenverbände (BAGIV) an.", textEn: "ZAVD joins the Federal Working Group of Immigrant Associations (BAGIV).", image: "/images/about/office2.jpg" },
	{ yearDe: "1990er", yearEn: "1990s", titleDe: "Einsatz für Minderheitenrechte", titleEn: "Advocacy for Minority Rights", textDe: "Während der Krisen in Tur Abdin und im Irak setzt sich ZAVD aktiv für Flüchtlinge und Minderheiten ein.", textEn: "During the crises in Tur Abdin and Iraq, ZAVD actively advocates for refugees and minorities.", image: "/images/about/office3.jpg" },
	{ yearDe: "2002", yearEn: "2002", titleDe: "Gründung des AJM", titleEn: "Founding of AJM", textDe: "Gründung des Assyrischen Jugendverbandes Mitteleuropa (AJM).", textEn: "The Assyrian Youth Association Central Europe (AJM) is founded.", image: "/images/about/office4.jpg" },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
	const [count, setCount] = useState(0);
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true });

	useEffect(() => {
		if (!inView) return;
		let start = 0;
		const duration = 1800;
		const step = Math.ceil(target / (duration / 16));
		const timer = setInterval(() => {
			start += step;
			if (start >= target) {
				setCount(target);
				clearInterval(timer);
			} else {
				setCount(start);
			}
		}, 16);
		return () => clearInterval(timer);
	}, [inView, target]);

	return (
		<span ref={ref}>
			{count}
			{suffix}
		</span>
	);
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function GeschichtePage() {
	useSetNavbarVariant("transparent");
	const locale = useLocale();
	const isEn = locale === "en";

	const [sitePhone, setSitePhone] = useState("");
	const [siteEmail, setSiteEmail] = useState("");
	const [pageData, setPageData] = useState<GeschichtePageData | null>(null);

	useEffect(() => {
		fetch("/api/site-settings")
			.then((res) => (res.ok ? res.json() : null))
			.then((json) => {
				if (json) {
					setSitePhone(json.data?.phone || "");
					setSiteEmail(json.data?.email || "");
				}
			})
			.catch(() => {});
	}, []);

	useEffect(() => {
		fetch("/api/geschichte-page")
			.then((res) => (res.ok ? res.json() : null))
			.then((json) => { if (json) setPageData(json); })
			.catch(() => {});
	}, []);

	const hero = pageData?.hero ?? {};
	const stats = pageData?.stats?.length ? pageData.stats : defaultStats;
	const intro = pageData?.intro ?? {};
	const articles = pageData?.articles?.length ? pageData.articles : defaultArticles;
	const events = pageData?.events?.length ? pageData.events : defaultEvents;

	const heroTagline = isEn ? (hero.taglineEn || "Our Story") : (hero.taglineDe || "Unsere Geschichte");
	const heroTitle = isEn ? (hero.titleEn || "History") : (hero.titleDe || "Geschichte");
	const heroSubtitle = isEn
		? (hero.subtitleEn || "Over 60 years of community, commitment and culture in Germany.")
		: (hero.subtitleDe || "Über 60 Jahre Gemeinschaft, Engagement und Kultur in Deutschland.");
	const heroImage = hero.image || "/images/about/aboutbanner.jpg";

	const introTagline = isEn ? (intro.taglineEn || "Our Roots") : (intro.taglineDe || "Unsere Wurzeln");
	const introHeading = isEn
		? (intro.headingEn || "From Guest Workers to a Strong Community")
		: (intro.headingDe || "Von Gastarbeitern zu einer starken Gemeinschaft");
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
						<p className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
							{heroSubtitle}
						</p>
					</motion.div>
				</div>
			</section>

			{/* ─── 2. Animated Stats ─── */}
			<section className="py-16 bg-primary">
				<div className="_container">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
						{stats.map((stat, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: i * 0.1 }}
							>
								<div className="text-4xl md:text-5xl font-extrabold mb-2">
									<AnimatedCounter target={stat.value ?? 0} suffix={stat.suffix ?? ""} />
								</div>
								<p className="text-white/70 text-sm font-medium uppercase tracking-wide">
									{isEn ? stat.labelEn : stat.labelDe}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ─── 3. Intro Text ─── */}
			<section className="py-20 bg-white">
				<div className="_container max-w-3xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<div className="flex items-center justify-center gap-3 mb-5">
							<span className="w-8 h-px bg-primary block" />
							<span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
								{introTagline}
							</span>
							<span className="w-8 h-px bg-primary block" />
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
							{introHeading}
						</h2>
						{introParagraph && (
							<p className="text-gray-500 text-base md:text-lg leading-relaxed">{introParagraph}</p>
						)}
					</motion.div>
				</div>
			</section>

			{/* ─── 4. Article Sections ─── */}
			{articles.length > 0 && (
				<section className="py-20 bg-white">
					<div className="_container max-w-4xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="mb-16 pb-8 border-b border-gray-200"
						>
							<div className="flex items-center gap-3 mb-4">
								<span className="w-8 h-px bg-primary block" />
								<span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
									{isEn ? "Our Story in Detail" : "Unsere Geschichte im Detail"}
								</span>
								<span className="w-8 h-px bg-primary block" />
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
								{isEn ? "The History of ZAVD" : "Die Geschichte des ZAVD"}
							</h2>
						</motion.div>

						{articles.map((article, i) => {
							const heading = isEn ? article.headingEn : article.headingDe;
							const p1 = isEn ? article.paragraph1En : article.paragraph1De;
							const p2 = isEn ? article.paragraph2En : article.paragraph2De;
							const caption = isEn ? article.captionEn : article.captionDe;
							const isRight = article.direction === "right";

							return (
								<motion.div
									key={i}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className={i === articles.length - 1 ? "mb-4" : "mb-16"}
								>
									<h3 className="text-2xl font-bold text-gray-900 mb-5 pb-3 border-b-2 border-primary inline-block">
										{heading}
									</h3>
									<div className={`flex flex-col ${isRight ? "md:flex-row-reverse" : "md:flex-row"} gap-8 mt-6`}>
										<div className="flex-1 space-y-4 text-gray-600 text-base leading-relaxed">
											{p1 && <p>{p1}</p>}
											{p2 && <p>{p2}</p>}
										</div>
										{article.image && (
											<div className="md:w-64 flex-shrink-0">
												<div className="relative h-48 md:h-56 rounded-lg overflow-hidden shadow-md">
													<Image src={article.image} alt={heading || ""} fill className="object-cover" />
												</div>
												{caption && (
													<p className="text-xs text-gray-400 mt-2 text-center italic">{caption}</p>
												)}
											</div>
										)}
									</div>
								</motion.div>
							);
						})}
					</div>
				</section>
			)}

			{/* ─── 5. Gallery Grid ─── */}
			{events.length > 0 && (
				<section className="py-24 bg-gray-50">
					<div className="_container">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-center mb-16"
						>
							<div className="flex items-center justify-center gap-3 mb-4">
								<span className="w-8 h-px bg-primary block" />
								<span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
									{isEn ? "Milestones" : "Meilensteine"}
								</span>
								<span className="w-8 h-px bg-primary block" />
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
								{isEn ? "Key Moments in Our History" : "Schlüsselmomente unserer Geschichte"}
							</h2>
						</motion.div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{events.map((event, i) => {
								const year = isEn ? event.yearEn : event.yearDe;
								const title = isEn ? event.titleEn : event.titleDe;
								const text = isEn ? event.textEn : event.textDe;

								return (
									<motion.div
										key={i}
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, margin: "-60px" }}
										transition={{ duration: 0.5, delay: i * 0.08 }}
										className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
									>
										{event.image && (
											<div className="relative h-56 w-full overflow-hidden">
												<Image
													src={event.image}
													alt={title || ""}
													fill
													className="object-cover transition-transform duration-500 group-hover:scale-105"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
												{year && (
													<div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
														{year}
													</div>
												)}
											</div>
										)}
										<div className="p-5">
											{title && <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug">{title}</h3>}
											{text && <p className="text-gray-500 text-sm leading-relaxed">{text}</p>}
										</div>
										<div className="h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>
			)}

			{/* ─── 6. Contact Section ─── */}
			<KontaktInfoSection
				contactInfo={{
					badgeDe: "Kontakt",
					badgeEn: "Contact",
					headingDe: "Kontakt aufnehmen",
					headingEn: "Get in Touch",
					phoneLabelDe: "Telefonnummer",
					phoneLabelEn: "Phone Number",
					emailLabelDe: "E-Mail-Adresse",
					emailLabelEn: "Email Address",
					addressLabelDe: "Unsere Adresse",
					addressLabelEn: "Our Address",
				}}
				formSection={{
					headingDe: "Haben Sie eine Frage?",
					headingEn: "Have Any Question?",
				}}
				phone={sitePhone}
				email={siteEmail}
				isEn={isEn}
			/>

		</div>
	);
}
