"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone, Mail, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { FaqSection, FaqItem } from "@/components/common/FaqSection";

// ─── Static fallback content ─────────────────────────────────────────────────

const staticOfficeImages = [
	"/images/about/office1pg.jpg",
	"/images/about/office2.jpg",
	"/images/about/office3.jpg",
	"/images/about/office4.jpg",
];

const staticFaqItems: FaqItem[] = [
	{
		id: 1,
		titleDe: "Was ist ZAVD?",
		titleEn: "What is ZAVD?",
		contentDe:
			"ZAVD – Zentralverband Arabischer und Deutsch-Arabischer Vereine in Deutschland e.V. ist ein gemeinnütziger Dachverband, der arabische und deutsch-arabische Vereine in ganz Deutschland vereint.",
		contentEn:
			"ZAVD is a non-profit umbrella organization uniting Arab and German-Arab associations throughout Germany, promoting integration and cultural exchange.",
	},
	{
		id: 2,
		titleDe: "Wann wurde ZAVD gegründet?",
		titleEn: "When was ZAVD founded?",
		contentDe:
			"ZAVD wurde gegründet, um die Interessen arabischer und deutsch-arabischer Vereine in Deutschland zu bündeln und gemeinsam gegenüber Politik und Öffentlichkeit zu vertreten.",
		contentEn:
			"ZAVD was established to represent the collective interests of Arab and German-Arab associations in Germany before policymakers and the public.",
	},
	{
		id: 3,
		titleDe: "Welche Ziele verfolgt ZAVD?",
		titleEn: "What are ZAVD's goals?",
		contentDe: [
			"Förderung der Integration arabischer Menschen in Deutschland",
			"Kultureller Austausch zwischen arabischen und deutschen Gemeinschaften",
			"Vertretung der Interessen arabischer Vereine gegenüber der Politik",
			"Unterstützung sozialer und humanitärer Projekte",
		],
		contentEn: [
			"Promoting the integration of Arab people in Germany",
			"Cultural exchange between Arab and German communities",
			"Representing the interests of Arab associations before policymakers",
			"Supporting social and humanitarian projects",
		],
	},
	{
		id: 4,
		titleDe: "Wie kann ich Mitglied werden?",
		titleEn: "How can I become a member?",
		contentDe:
			"Vereine und Organisationen können eine Mitgliedschaft beim ZAVD beantragen. Nehmen Sie einfach Kontakt zu uns auf – wir begleiten Sie durch den Aufnahmeprozess.",
		contentEn:
			"Associations and organizations can apply for membership with ZAVD. Simply contact us and we will guide you through the application process.",
	},
	{
		id: 5,
		titleDe: "Wo befindet sich die Bundesgeschäftsstelle?",
		titleEn: "Where is the federal office located?",
		contentDe:
			"Die Bundesgeschäftsstelle des ZAVD befindet sich seit 2014 in Gütersloh. Das Büro verfügt über einen Seminarraum für bis zu 70 Personen sowie eine kulturelle Ausstellung im Foyer.",
		contentEn:
			"The federal office of ZAVD has been located in Gütersloh since 2014. The office features a seminar room for up to 70 people and a cultural exhibition in the foyer.",
	},
	{
		id: 6,
		titleDe: "Welche Veranstaltungen organisiert ZAVD?",
		titleEn: "What events does ZAVD organize?",
		contentDe: [
			"Kulturelle Veranstaltungen und Festivals",
			"Bildungsprojekte und Seminare",
			"Integrationsprogramme",
			"Politische Dialogveranstaltungen",
		],
		contentEn: [
			"Cultural events and festivals",
			"Educational projects and seminars",
			"Integration programs",
			"Political dialogue events",
		],
	},
];

const staticGalleryImages = [
	"/images/about/office1pg.jpg",
	"/images/about/office2.jpg",
	"/images/about/office3.jpg",
	"/images/about/office4.jpg",
];

const fallback = {
	de: {
		heroTag: "Wer wir sind",
		structureTag: "Unsere Stärken",
		officeTag: "Chronik",
		galleryTag: "Einblicke",
		ctaTag: "Mitmachen",
		phone: "+49 (0) ...",
		email: "info@zavd.de",
	},
	en: {
		heroTag: "Who we are",
		structureTag: "Our Strengths",
		officeTag: "Chronicle",
		galleryTag: "Impressions",
		ctaTag: "Get Involved",
		phone: "+49 (0) ...",
		email: "info@zavd.de",
	},
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimelineItem {
	year?: string;
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	image?: string;
}

interface GalleryItem {
	image?: string;
	captionDe?: string;
	captionEn?: string;
}

interface PageData {
	hero?: {
		titleDe?: string;
		titleEn?: string;
		subtitleDe?: string;
		subtitleEn?: string;
		image?: string;
	};
	intro?: {
		headingDe?: string;
		headingEn?: string;
		paragraph1De?: string;
		paragraph1En?: string;
		paragraph2De?: string;
		paragraph2En?: string;
	};
	address?: {
		headingDe?: string;
		headingEn?: string;
		name?: string;
		line1?: string;
		line2?: string;
		line3?: string;
		phone?: string;
		email?: string;
	};
	structure?: {
		headingDe?: string;
		headingEn?: string;
		paragraph1De?: string;
		paragraph1En?: string;
		paragraph2De?: string;
		paragraph2En?: string;
		paragraph3De?: string;
		paragraph3En?: string;
	};
	team?: {
		headingDe?: string;
		headingEn?: string;
		subtextDe?: string;
		subtextEn?: string;
		paragraph1De?: string;
		paragraph1En?: string;
		paragraph2De?: string;
		paragraph2En?: string;
		image?: string;
	};
	office?: {
		headingDe?: string;
		headingEn?: string;
		items?: TimelineItem[];
	};
	gallery?: {
		headingDe?: string;
		headingEn?: string;
		items?: GalleryItem[];
	};
	cta?: {
		headingDe?: string;
		headingEn?: string;
		textDe?: string;
		textEn?: string;
		buttonDe?: string;
		buttonEn?: string;
	};
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function SectionTag({ label }: { label: string }) {
	return (
		<div className="inline-flex items-center gap-2 mb-4">
			<span className="w-6 h-px bg-primary" />
			<span className="text-primary text-xs font-semibold uppercase tracking-[0.15em]">
				{label}
			</span>
		</div>
	);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UberZavdPage() {
	useSetNavbarVariant("transparent");
	const locale = useLocale();
	const isEn = locale === "en";
	const fb = isEn ? fallback.en : fallback.de;

	const [data, setData] = useState<PageData>({});
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	useEffect(() => {
		fetch("/api/uber-zavd-page")
			.then((r) => r.json())
			.then((d) => setData(d))
			.catch(() => {/* use static fallbacks */});
	}, []);

	// ── derived values ──────────────────────────────────────────────────────

	const hero = {
		title: (isEn ? data.hero?.titleEn : data.hero?.titleDe) || (isEn ? "About ZAVD" : "Über ZAVD"),
		subtitle:
			(isEn ? data.hero?.subtitleEn : data.hero?.subtitleDe) ||
			(isEn
				? "Central Association of Arab and German-Arab Associations in Germany"
				: "Zentralverband Arabischer und Deutsch-Arabischer Vereine in Deutschland e.V."),
		image: data.hero?.image || "/images/about/aboutbanner.jpg",
	};

	const intro = {
		heading: (isEn ? data.intro?.headingEn : data.intro?.headingDe) || (isEn ? "About Us" : "Über uns"),
		paragraph1:
			(isEn ? data.intro?.paragraph1En : data.intro?.paragraph1De) ||
			(isEn
				? "ZAVD is a non-profit umbrella organization uniting Arab and German-Arab associations throughout Germany. We are committed to integration, cultural exchange, and promoting social cohesion."
				: "ZAVD – Zentralverband Arabischer und Deutsch-Arabischer Vereine in Deutschland e.V. ist ein gemeinnütziger Dachverband, der arabische und deutsch-arabische Vereine in ganz Deutschland vereint."),
		paragraph2:
			(isEn ? data.intro?.paragraph2En : data.intro?.paragraph2De) ||
			(isEn
				? "As a registered association, we represent the interests of our member organizations to policymakers and the public. Our goal is to build bridges between Arab and German cultures."
				: "Als eingetragener Verein vertreten wir die Interessen unserer Mitgliedsvereine gegenüber Politik und Öffentlichkeit. Unser Ziel ist es, Brücken zwischen arabischen und deutschen Kulturen zu bauen."),
	};

	const address = {
		heading: (isEn ? data.address?.headingEn : data.address?.headingDe) || (isEn ? "Address" : "Anschrift"),
		name: data.address?.name || "ZAVD e.V.",
		line1: data.address?.line1 || "",
		line2: data.address?.line2 || "",
		line3: data.address?.line3 || "",
		phone: data.address?.phone || fb.phone,
		email: data.address?.email || fb.email,
	};

	const structure = {
		heading:
			(isEn ? data.structure?.headingEn : data.structure?.headingDe) ||
			(isEn ? "What is special about our association?" : "Was macht unseren Verband besonders?"),
		paragraphs: [
			(isEn ? data.structure?.paragraph1En : data.structure?.paragraph1De) ||
				(isEn
					? "ZAVD stands out for its broad network of member associations active in various German cities."
					: "ZAVD zeichnet sich durch sein breites Netzwerk aus Mitgliedsvereinen aus."),
			(isEn ? data.structure?.paragraph2En : data.structure?.paragraph2De) ||
				(isEn
					? "Our work encompasses cultural events, educational projects, social initiatives, and political advocacy."
					: "Unsere Arbeit umfasst kulturelle Veranstaltungen, Bildungsprojekte und soziale Initiativen."),
			(isEn ? data.structure?.paragraph3En : data.structure?.paragraph3De) ||
				(isEn
					? "The association works closely with German and international partners to realize sustainable projects."
					: "Der Verband arbeitet eng mit deutschen und internationalen Partnern zusammen."),
		],
	};

	const team = {
		heading: (isEn ? data.team?.headingEn : data.team?.headingDe) || (isEn ? "Our Team" : "Unser Team"),
		subtext:
			(isEn ? data.team?.subtextEn : data.team?.subtextDe) ||
			(isEn ? "Together we are strong – our members and volunteers" : "Gemeinsam stark – unsere Mitglieder und Ehrenamtlichen"),
		paragraph1:
			(isEn ? data.team?.paragraph1En : data.team?.paragraph1De) ||
			(isEn
				? "ZAVD brings together people of diverse backgrounds who share a common vision: an open, inclusive, and supportive society."
				: "ZAVD bringt Menschen unterschiedlicher Herkunft zusammen, die eine gemeinsame Vision teilen."),
		paragraph2:
			(isEn ? data.team?.paragraph2En : data.team?.paragraph2De) ||
			(isEn
				? "Our team consists of dedicated board members, active association representatives, and numerous volunteers who work together to realize the goals of the association."
				: "Unser Team besteht aus engagierten Vorstandsmitgliedern, aktiven Vereinsvertretern und zahlreichen Freiwilligen."),
		image: data.team?.image || "/images/about/zavd-team.jpg",
	};

	const officeHeading =
		(isEn ? data.office?.headingEn : data.office?.headingDe) ||
		(isEn ? "Our Offices & Activities" : "Unsere Büros & Aktivitäten");

	const officeItems: TimelineItem[] =
		data.office?.items && data.office.items.length > 0
			? data.office.items
			: [
					{
						year: "2014",
						titleDe: "Unsere Bürogeschichte",
						titleEn: "Our office history",
						descriptionDe:
							"Seit 2014 befindet sich die Bundesgeschäftsstelle des Zentralverbands in Gütersloh.",
						descriptionEn:
							"Since 2014, the federal office of ZAVD has been located in the center of Gütersloh.",
						image: staticOfficeImages[0],
					},
					{
						year: "2016",
						titleDe: "Seminarraum & Ausstellungen",
						titleEn: "ZAVD Seminar Room",
						descriptionDe:
							"Das Büro verfügt über einen voll ausgestatteten Seminarraum für bis zu 70 Personen.",
						descriptionEn:
							"The office has a fully equipped seminar room that can accommodate up to 70 people.",
						image: staticOfficeImages[1],
					},
					{
						year: "2018",
						titleDe: "Kulturelle Ausstellung",
						titleEn: "Cultural Exhibition",
						descriptionDe:
							"Im Foyer können Besucher einen Einblick in die assyrische Kultur gewinnen.",
						descriptionEn:
							"In the foyer, visitors can gain insight into Assyrian culture.",
						image: staticOfficeImages[2],
					},
					{
						year: "2020",
						titleDe: "Archiv & Dokumentation",
						titleEn: "Archive & Documentation",
						descriptionDe:
							"Das Archiv beherbergt Kulturgüter der Diaspora und steht für Forschungszwecke offen.",
						descriptionEn:
							"The archive houses cultural treasures of the diaspora and is available for research.",
						image: staticOfficeImages[3],
					},
			  ];

	const galleryHeading =
		(isEn ? data.gallery?.headingEn : data.gallery?.headingDe) ||
		(isEn ? "From Our Daily Life" : "Aus unserem Alltag");

	const galleryItems: GalleryItem[] =
		data.gallery?.items && data.gallery.items.length > 0
			? data.gallery.items
			: staticGalleryImages.map((src, i) => ({
					image: src,
					captionDe: ["Unser Büro – Zentrale Anlaufstelle", "Kulturelle Ausstellung im Foyer", "Publikationen und Archivmaterial", "ZAVD – Verbindung der Kulturen"][i],
					captionEn: ["Our office – central point of contact", "Cultural exhibition in the foyer", "Publications and archive material", "ZAVD – connecting cultures"][i],
			  }));

	const cta = {
		heading: (isEn ? data.cta?.headingEn : data.cta?.headingDe) || (isEn ? "Become a Member" : "Werden Sie Mitglied"),
		text:
			(isEn ? data.cta?.textEn : data.cta?.textDe) ||
			(isEn
				? "Join our network and help shape the future of the German-Arab community."
				: "Schließen Sie sich unserem Netzwerk an und gestalten Sie die Zukunft der deutsch-arabischen Gemeinschaft mit."),
		button: (isEn ? data.cta?.buttonEn : data.cta?.buttonDe) || (isEn ? "Get in touch" : "Kontakt aufnehmen"),
	};

	return (
		<div className="min-h-screen bg-white">

			{/* ─── Hero ─── */}
			<section className="relative h-[500px] md:h-[580px] overflow-hidden">
				<motion.div
					className="absolute inset-0"
					initial={{ scale: 1, x: 0 }}
					animate={{ scale: 1.12, x: -30 }}
					transition={{ duration: 10, ease: "easeOut" }}
				>
					<Image
						src={hero.image}
						alt={hero.title}
						fill
						className="object-cover"
						priority
					/>
				</motion.div>
				<div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

				<div className="absolute inset-0 flex items-end pb-16 md:pb-20">
					<div className="_container">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7 }}
							className="max-w-2xl"
						>
							<motion.span
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5 }}
								className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-5"
							>
								<span className="w-5 h-px bg-primary" />
								{fb.heroTag}
							</motion.span>
							<h1 className="text-5xl md:text-7xl font-extrabold text-white leading-none mb-5 tracking-tight">
								{hero.title}
							</h1>
							<p className="text-white/70 text-sm md:text-base max-w-xl leading-relaxed border-l-2 border-primary/60 pl-4">
								{hero.subtitle}
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* ─── Intro + Address ─── */}
			<section className="py-20 md:py-28 bg-white">
				<div className="_container">
					<div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">

						<motion.div
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="lg:col-span-3 space-y-6"
						>
							<SectionTag label={fb.heroTag} />
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
								{intro.heading}
							</h2>
							<p className="text-gray-500 leading-relaxed text-base md:text-lg">
								{intro.paragraph1}
							</p>
							<p className="text-gray-500 leading-relaxed text-base md:text-lg">
								{intro.paragraph2}
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.15 }}
							className="lg:col-span-2"
						>
							<div className="border-l-4 border-primary bg-gray-50 rounded-r-2xl p-7 space-y-5">
								<h3 className="text-xs font-bold text-primary uppercase tracking-widest">
									{address.heading}
								</h3>
								<div className="space-y-4">
									<div className="flex items-start gap-3.5">
										<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
											<MapPin className="w-4 h-4 text-primary" />
										</div>
										<div className="text-gray-700 text-sm leading-relaxed">
											<p className="font-semibold text-gray-900">{address.name}</p>
											{address.line1 && <p>{address.line1}</p>}
											{address.line2 && <p>{address.line2}</p>}
											{address.line3 && <p>{address.line3}</p>}
										</div>
									</div>
									<div className="flex items-center gap-3.5">
										<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
											<Phone className="w-4 h-4 text-primary" />
										</div>
										<span className="text-gray-600 text-sm">{address.phone}</span>
									</div>
									<div className="flex items-center gap-3.5">
										<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
											<Mail className="w-4 h-4 text-primary" />
										</div>
										<span className="text-gray-600 text-sm">{address.email}</span>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* ─── Structure / What is Special ─── */}
			<section className="py-20 md:py-28 bg-gray-950 text-white">
				<div className="_container">
					<div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-start">
						<motion.div
							initial={{ opacity: 0, x: -24 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="lg:sticky lg:top-32"
						>
							<SectionTag label={fb.structureTag} />
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
								{structure.heading}
							</h2>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 24 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="space-y-8"
						>
							{structure.paragraphs.map((para, i) => (
								<div key={i} className="flex gap-5">
									<span className="text-primary font-bold text-lg mt-0.5 shrink-0">
										0{i + 1}
									</span>
									<p className="text-gray-300 leading-relaxed text-base md:text-lg">
										{para}
									</p>
								</div>
							))}
						</motion.div>
					</div>
				</div>
			</section>

			{/* ─── Team Photo ─── */}
			<section className="py-20 md:py-28 bg-white">
				<div className="_container">
					<div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -24 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="order-2 lg:order-1"
						>
							<SectionTag label={fb.heroTag} />
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
								{team.heading}
							</h2>
							<p className="text-gray-500 text-base md:text-lg leading-relaxed mb-4">
								{team.subtext}
							</p>
							<p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">
								{team.paragraph1}
							</p>
							<p className="text-gray-500 text-sm md:text-base leading-relaxed">
								{team.paragraph2}
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.97 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7 }}
							className="order-1 lg:order-2 relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl"
						>
							<Image
								src={team.image}
								alt={team.heading}
								fill
								className="object-cover"
							/>
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-5">
								<p className="text-white font-semibold text-sm">ZAVD e.V.</p>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* ─── Office Timeline ─── */}
			<section className="py-20 md:py-28 bg-gray-50">
				<div className="_container">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-20"
					>
						<SectionTag label={fb.officeTag} />
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
							{officeHeading}
						</h2>
					</motion.div>

					<div className="relative">
						<div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden md:block">
							<div className="w-px h-full bg-gray-200" />
						</div>

						{officeItems.map((item, index) => {
							const isEvenItem = index % 2 === 0;
							const title = (isEn ? item.titleEn : item.titleDe) || item.titleDe || item.titleEn || "";
							const description = (isEn ? item.descriptionEn : item.descriptionDe) || item.descriptionDe || item.descriptionEn || "";
							const imgSrc = item.image || staticOfficeImages[index % staticOfficeImages.length];

							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 40 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.65, delay: index * 0.08 }}
									className="relative flex flex-col md:flex-row items-center gap-0 mb-24 last:mb-0"
								>
									{/* LEFT */}
									<div className="w-full md:w-[calc(50%-40px)] md:pr-12 pb-8 md:pb-0">
										{isEvenItem ? (
											<div className="relative aspect-[4/3] overflow-hidden shadow-xl rounded-xl group">
												<Image
													src={imgSrc}
													alt={title}
													fill
													className="object-cover group-hover:scale-105 transition-transform duration-700"
												/>
											</div>
										) : (
											<div className="md:text-right">
												<span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-widest">
													{item.year}
												</span>
												<h3 className="text-xl font-bold text-gray-900 mb-3">
													{title}
												</h3>
												<p className="text-gray-500 text-sm leading-relaxed">
													{description}
												</p>
											</div>
										)}
									</div>

									{/* Center dot */}
									<div
										className="hidden md:flex items-center justify-center shrink-0 z-10"
										style={{ width: "80px" }}
									>
										<div className="w-5 h-5 rounded-full bg-primary ring-4 ring-white ring-offset-2 ring-offset-gray-50 shadow" />
									</div>

									{/* RIGHT */}
									<div className="w-full md:w-[calc(50%-40px)] md:pl-12">
										{isEvenItem ? (
											<div>
												<span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-widest">
													{item.year}
												</span>
												<h3 className="text-xl font-bold text-gray-900 mb-3">
													{title}
												</h3>
												<p className="text-gray-500 text-sm leading-relaxed">
													{description}
												</p>
											</div>
										) : (
											<div className="relative aspect-[4/3] overflow-hidden shadow-xl rounded-xl group">
												<Image
													src={imgSrc}
													alt={title}
													fill
													className="object-cover group-hover:scale-105 transition-transform duration-700"
												/>
											</div>
										)}
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ─── CTA ─── */}
			<section className="relative py-24 md:py-32 bg-gray-950 overflow-hidden">
				<div
					className="absolute inset-0 opacity-[0.04]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 50%),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
						backgroundSize: "48px 48px",
					}}
				/>
				<div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

				<div className="_container relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.7 }}
						className="max-w-2xl"
					>
						<SectionTag label={fb.ctaTag} />
						<h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
							{cta.heading}
						</h2>
						<p className="text-gray-400 text-base md:text-lg leading-relaxed mb-10">
							{cta.text}
						</p>
						<a
							href={`/${locale}/kontakt`}
							className="inline-flex items-center gap-3 bg-primary text-white font-semibold px-8 py-4 rounded-full hover:bg-primary/90 transition-all duration-200 text-sm tracking-wide group shadow-lg shadow-primary/30"
						>
							{cta.button}
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</a>
					</motion.div>
				</div>
			</section>

			{/* ─── FAQ ─── */}
			<FaqSection
				items={staticFaqItems}
				tag={isEn ? "FAQ" : "Häufige Fragen"}
				heading={isEn ? "Frequently Asked Questions" : "Häufig gestellte Fragen"}
				description={
					isEn
						? "Everything you need to know about ZAVD and our work."
						: "Alles, was Sie über ZAVD und unsere Arbeit wissen müssen."
				}
				isEn={isEn}
			/>

			{/* ─── Gallery ─── */}
			<section className="py-20 md:py-28 bg-white">
				<div className="_container">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-12"
					>
						<SectionTag label={fb.galleryTag} />
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
							{galleryHeading}
						</h2>
					</motion.div>

					{/* Masonry 2×2 */}
					<div className="grid grid-cols-2 gap-4 md:gap-5">
						{/* Col 1: tall → short */}
						<div className="flex flex-col gap-4 md:gap-5">
							{[0, 2].map((gi) => {
								const gItem = galleryItems[gi];
								if (!gItem) return null;
								const caption = (isEn ? gItem.captionEn : gItem.captionDe) || gItem.captionDe || gItem.captionEn || "";
								const imgSrc = gItem.image || staticGalleryImages[gi];
								return (
									<motion.div
										key={gi}
										initial={{ opacity: 0, y: 24 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: gi === 0 ? 0 : 0.2 }}
										className="group cursor-pointer"
										onClick={() => setLightboxIndex(gi)}
									>
										<div className={`relative overflow-hidden rounded-xl shadow-md ${gi === 0 ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
											<Image src={imgSrc} alt={caption} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
											<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
										</div>
										<p className="mt-2.5 text-xs md:text-sm text-gray-500 font-medium px-1">{caption}</p>
									</motion.div>
								);
							})}
						</div>

						{/* Col 2: short → tall (offset top) */}
						<div className="flex flex-col gap-4 md:gap-5 mt-10">
							{[1, 3].map((gi) => {
								const gItem = galleryItems[gi];
								if (!gItem) return null;
								const caption = (isEn ? gItem.captionEn : gItem.captionDe) || gItem.captionDe || gItem.captionEn || "";
								const imgSrc = gItem.image || staticGalleryImages[gi];
								return (
									<motion.div
										key={gi}
										initial={{ opacity: 0, y: 24 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: gi === 1 ? 0.1 : 0.3 }}
										className="group cursor-pointer"
										onClick={() => setLightboxIndex(gi)}
									>
										<div className={`relative overflow-hidden rounded-xl shadow-md ${gi === 1 ? "aspect-[4/3]" : "aspect-[3/4]"}`}>
											<Image src={imgSrc} alt={caption} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
											<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
										</div>
										<p className="mt-2.5 text-xs md:text-sm text-gray-500 font-medium px-1">{caption}</p>
									</motion.div>
								);
							})}
						</div>
					</div>
				</div>
			</section>

			{/* ─── Lightbox ─── */}
			{lightboxIndex !== null && (
				<div
					className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
					onClick={() => setLightboxIndex(null)}
				>
					<button
						onClick={() => setLightboxIndex(null)}
						className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-10"
					>
						<X className="w-8 h-8" />
					</button>

					{lightboxIndex > 0 && (
						<button
							onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
							className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
						>
							<ChevronLeft className="w-6 h-6" />
						</button>
					)}

					{lightboxIndex < galleryItems.length - 1 && (
						<button
							onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
							className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
						>
							<ChevronRight className="w-6 h-6" />
						</button>
					)}

					{(() => {
						const gItem = galleryItems[lightboxIndex];
						const caption = (isEn ? gItem?.captionEn : gItem?.captionDe) || gItem?.captionDe || gItem?.captionEn || "";
						const imgSrc = gItem?.image || staticGalleryImages[lightboxIndex] || "";
						return (
							<motion.div
								key={lightboxIndex}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.2 }}
								className="relative max-w-4xl w-full"
								onClick={(e) => e.stopPropagation()}
							>
								<Image
									src={imgSrc}
									alt={caption}
									width={1200}
									height={900}
									className="w-full max-h-[80vh] object-contain rounded-lg"
								/>
								<p className="text-center text-white/70 text-sm mt-3">{caption}</p>
								<p className="text-center text-white/40 text-xs mt-1">
									{lightboxIndex + 1} / {galleryItems.length}
								</p>
							</motion.div>
						);
					})()}
				</div>
			)}
		</div>
	);
}
