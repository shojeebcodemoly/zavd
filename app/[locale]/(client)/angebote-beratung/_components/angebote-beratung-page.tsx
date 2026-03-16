"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
	Shield,
	FileText,
	HeartHandshake,
	Link2,
	ArrowRight,
	ExternalLink,
	Download,
	ChevronRight,
} from "lucide-react";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";

// ─── Section Tag ──────────────────────────────────────────────────────────────

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

// ─── Anchor Nav ───────────────────────────────────────────────────────────────

const sections = [
	{
		id: "flucht-asyl",
		labelDe: "Flucht & Asyl",
		labelEn: "Refugee & Asylum",
		Icon: Shield,
	},
	{
		id: "namensaenderung",
		labelDe: "Namensänderung",
		labelEn: "Name Change",
		Icon: FileText,
	},
	{
		id: "beratung",
		labelDe: "Beratung & Unterstützung",
		labelEn: "Counseling & Support",
		Icon: HeartHandshake,
	},
	{
		id: "wichtige-links",
		labelDe: "Wichtige Links",
		labelEn: "Useful Links",
		Icon: Link2,
	},
];

function AnchorNav({ activeId, isEn }: { activeId: string; isEn: boolean }) {
	const scrollTo = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
			const offset = 100;
			const top = el.getBoundingClientRect().top + window.scrollY - offset;
			window.scrollTo({ top, behavior: "smooth" });
		}
	};

	return (
		<div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
			<div className="_container">
				<div className="flex items-center overflow-x-auto gap-0 scrollbar-hide">
					{sections.map(({ id, labelDe, labelEn, Icon }) => {
						const isActive = activeId === id;
						return (
							<button
								key={id}
								onClick={() => scrollTo(id)}
								className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
									isActive
										? "border-primary text-primary"
										: "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200"
								}`}
							>
								<Icon className="w-4 h-4 shrink-0" />
								{isEn ? labelEn : labelDe}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

// ─── PDF Resource Card ────────────────────────────────────────────────────────

function PdfCard({
	title,
	description,
	downloadLabel,
	href,
}: {
	title: string;
	description: string;
	downloadLabel: string;
	href?: string;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className="flex gap-4 p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
		>
			<div className="w-12 h-14 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center shrink-0">
				<FileText className="w-6 h-6 text-primary" />
			</div>
			<div className="flex-1 min-w-0">
				<h4 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">{title}</h4>
				<p className="text-gray-500 text-xs leading-relaxed mb-3">{description}</p>
				{href && (
					<a
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold hover:gap-2.5 transition-all"
					>
						<Download className="w-3.5 h-3.5" />
						{downloadLabel}
					</a>
				)}
			</div>
		</motion.div>
	);
}

// ─── Link Card ────────────────────────────────────────────────────────────────

function LinkCard({
	name,
	description,
	href,
}: {
	name: string;
	description: string;
	href?: string;
}) {
	return (
		<motion.a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.4 }}
			className="flex items-start gap-4 p-4 bg-white border-l-4 border-l-primary border border-gray-100 rounded-r-xl shadow-sm hover:shadow-md hover:bg-red-50/30 transition-all group"
		>
			<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
				<ExternalLink className="w-4 h-4 text-primary" />
			</div>
			<div className="flex-1 min-w-0">
				<p className="font-semibold text-gray-900 text-sm">{name}</p>
				<p className="text-gray-500 text-xs leading-relaxed mt-0.5">{description}</p>
			</div>
			<ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
		</motion.a>
	);
}

// ─── Counseling Service Card ──────────────────────────────────────────────────

function ServiceCard({
	Icon,
	title,
	description,
}: {
	Icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group"
		>
			<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
				<Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
			</div>
			<h4 className="font-bold text-gray-900 text-base mb-2">{title}</h4>
			<p className="text-gray-500 text-sm leading-relaxed">{description}</p>
		</motion.div>
	);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageData {
	hero?: { titleDe?: string; titleEn?: string; subtitleDe?: string; subtitleEn?: string; image?: string };
	fluchtAsyl?: {
		headingDe?: string; headingEn?: string;
		paragraph1De?: string; paragraph1En?: string;
		paragraph2De?: string; paragraph2En?: string;
		infoBoxDe?: string; infoBoxEn?: string;
		pdfResources?: { titleDe?: string; titleEn?: string; descriptionDe?: string; descriptionEn?: string; downloadLabelDe?: string; downloadLabelEn?: string; href?: string }[];
	};
	namensaenderung?: {
		headingDe?: string; headingEn?: string;
		paragraph1De?: string; paragraph1En?: string;
		paragraph2De?: string; paragraph2En?: string;
		paragraph3De?: string; paragraph3En?: string;
		blockquoteDe?: string; blockquoteEn?: string;
		pdfLabelDe?: string; pdfLabelEn?: string; pdfHref?: string;
	};
	beratung?: {
		headingDe?: string; headingEn?: string;
		subtitleDe?: string; subtitleEn?: string;
		ctaLabelDe?: string; ctaLabelEn?: string;
		services?: { titleDe?: string; titleEn?: string; descriptionDe?: string; descriptionEn?: string }[];
	};
	wichtigeLinks?: {
		headingDe?: string; headingEn?: string;
		subtitleDe?: string; subtitleEn?: string;
		links?: { name?: string; descriptionDe?: string; descriptionEn?: string; href?: string }[];
	};
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AngeboteBeratungPage() {
	useSetNavbarVariant("transparent");
	const locale = useLocale();
	const isEn = locale === "en";

	const [activeSection, setActiveSection] = useState("flucht-asyl");
	const [data, setData] = useState<PageData>({});
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		fetch("/api/angebote-beratung-page")
			.then((r) => r.json())
			.then((d) => setData(d))
			.catch(() => {/* use static fallbacks */});
	}, []);

	useEffect(() => {
		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				});
			},
			{ rootMargin: "-30% 0px -60% 0px" }
		);

		sections.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (el) observerRef.current?.observe(el);
		});

		return () => observerRef.current?.disconnect();
	}, []);

	// ── Derive values from API data with static fallbacks ─────────────────

	const hero = {
		title: (isEn ? data.hero?.titleEn : data.hero?.titleDe) || (isEn ? "Services &\nCounseling" : "Angebote &\nBeratung"),
		subtitle: (isEn ? data.hero?.subtitleEn : data.hero?.subtitleDe) || (isEn
			? "We support refugees, families, and individuals with professional counseling, legal guidance, and community resources."
			: "Wir unterst\u00FCtzen Fl\u00FCchtlinge, Familien und Einzelpersonen mit professioneller Beratung, rechtlicher Begleitung und gemeinschaftlichen Ressourcen."),
		image: data.hero?.image || "/images/about/aboutbanner.jpg",
	};

	const flucht = {
		heading: (isEn ? data.fluchtAsyl?.headingEn : data.fluchtAsyl?.headingDe) || (isEn ? "Refugee & Asylum Support" : "Betreuung von Fl\u00FCchtlingen"),
		paragraph1: (isEn ? data.fluchtAsyl?.paragraph1En : data.fluchtAsyl?.paragraph1De) || (isEn
			? "In Germany, there are many refugees from Syria and Iraq, many with an Assyrian or Aramaic background. Within the ZAVD working group ZAVD supports refugees with finding housing, language acquisition, health care, and integrating refugees into society."
			: "In Deutschland gibt es viele Fl\u00FCchtlinge aus Syrien und Irak, darunter viele mit assyrischem oder aram\u00E4ischem Hintergrund. Im Rahmen der Arbeitsgruppe ZAVD unterst\u00FCtzen wir Fl\u00FCchtlinge bei der Unterkunftssuche, dem Spracherwerb, der gesundheitlichen Versorgung und der gesellschaftlichen Eingliederung."),
		paragraph2: (isEn ? data.fluchtAsyl?.paragraph2En : data.fluchtAsyl?.paragraph2De) || (isEn
			? "The ZAVD member associations are often the first point of contact for asylum seekers with a similar cultural background. They offer direct personal support and help with everyday challenges."
			: "Die ZAVD-Mitgliedsvereine sind h\u00E4ufig die erste Anlaufstelle f\u00FCr Asylsuchende mit \u00E4hnlichem kulturellen Hintergrund. Sie bieten direkte pers\u00F6nliche Unterst\u00FCtzung und helfen bei allt\u00E4glichen Herausforderungen."),
		infoBox: (isEn ? data.fluchtAsyl?.infoBoxEn : data.fluchtAsyl?.infoBoxDe) || (isEn
			? "For experts in this field: Helpful links to thematic information on refugees"
			: "F\u00FCr Fachleute auf diesem Gebiet: Hilfreiche Links zu fachlichen Informationen zum Thema Fl\u00FCchtlinge"),
	};

	const staticPdfResources = isEn
		? [
				{ title: "Basics of Asylum Procedure \u2013 A Working Aid for Advisors", description: "A comprehensive overview of the legal foundations of the asylum procedure.", downloadLabel: "PDF: Basics of the Asylum Procedure", href: "#" },
				{ title: "Health Guide for Asylum Seekers in Germany", description: "The guide provides asylum seekers with important basic information on health care in Germany.", downloadLabel: "PDF: Health Guide (German / Arabic / English)", href: "#" },
				{ title: "The German Asylum Procedure \u2013 Explained in Detail", description: "Detailed information on the asylum procedure.", downloadLabel: "PDF: Das deutsche Asylverfahren", href: "#" },
		  ]
		: [
				{ title: "Grundlagen des Asylverfahrens \u2013 Eine Arbeitshilfe f\u00FCr Beraterinnen und Berater", description: "Ein umfassendes \u00DCberblickswerk zu den rechtlichen Grundlagen des Asylverfahrens.", downloadLabel: "PDF: Grundlagen des Asylverfahrens", href: "#" },
				{ title: "Ratgeber Gesundheit f\u00FCr Asylsuchende in Deutschland", description: "Der Ratgeber vermittelt Asylsuchenden wichtige Grundlagenkenntnisse zur Gesundheitsversorgung.", downloadLabel: "PDF: Ratgeber (Deutsch / Arabisch / Englisch)", href: "#" },
				{ title: "Das deutsche Asylverfahren \u2013 ausf\u00FChrlich erkl\u00E4rt", description: "Ausf\u00FChrliche Informationen zum Asylverfahren.", downloadLabel: "PDF: Das deutsche Asylverfahren", href: "#" },
		  ];

	const apiPdfResources = data.fluchtAsyl?.pdfResources?.length
		? data.fluchtAsyl.pdfResources.map((r) => ({
				title: (isEn ? r.titleEn : r.titleDe) || r.titleDe || r.titleEn || "",
				description: (isEn ? r.descriptionEn : r.descriptionDe) || "",
				downloadLabel: (isEn ? r.downloadLabelEn : r.downloadLabelDe) || "",
				href: r.href || "#",
		  }))
		: null;
	const pdfResources = apiPdfResources || staticPdfResources;

	const namen = {
		heading: (isEn ? data.namensaenderung?.headingEn : data.namensaenderung?.headingDe) || (isEn ? "Name Change Assistance" : "Namens\u00E4nderung"),
		paragraph1: (isEn ? data.namensaenderung?.paragraph1En : data.namensaenderung?.paragraph1De) || (isEn
			? "In February 2014, the Federal Cabinet added an administrative provision to the Name Change Act, significantly facilitating name changes for Assyrians."
			: "Im Februar 2014 hat das Bundeskabinett eine Verwaltungsvorschrift zum Namens\u00E4nderungsrecht erg\u00E4nzt, wodurch Namens\u00E4nderungen von Assyrern erheblich erleichtert wurden."),
		paragraph2: (isEn ? data.namensaenderung?.paragraph2En : data.namensaenderung?.paragraph2De) || (isEn
			? "Previously, a reason existed when the surname was, for example, openly offensive. According to the cabinet decision, such a reason will in future also exist when a forced name is an 'expression of persecution and oppression'."
			: "Bislang liegt ein solcher vor, wenn der Nachname zum Beispiel offenkundig absto\u00DFend wirkt. Laut Kabinettsbeschluss liegt ein solcher Grund k\u00FCnftig aber auch dann vor, wenn ein aufgezwungener Name \u201EAusdruck von Verfolgung und Unterdr\u00FCckung\u201C ist."),
		paragraph3: (isEn ? data.namensaenderung?.paragraph3En : data.namensaenderung?.paragraph3De) || (isEn
			? "When applying to change a family name, one can now refer to the newly added paragraph 44a in the General Administrative Regulation on the Law on the Change of Family Names and First Names (Nam\u00C4ndVwV):"
			: "Bei einem Antrag zur \u00C4nderung des Familiennamens kann man sich bei der zust\u00E4ndigen Beh\u00F6rde nun auf den neu eingef\u00FCgten Absatz 44a in der Allgemeinen Verwaltungsvorschrift zum Gesetz \u00FCber die \u00C4nderung von Familiennamen und Vornamen (Nam\u00C4ndVwV) berufen:"),
		blockquote: (isEn ? data.namensaenderung?.blockquoteEn : data.namensaenderung?.blockquoteDe) || (isEn
			? '"If a forcibly introduced family name is an expression of persecution and suppression, the original family name can be restored for those affected and their descendants through a name change."'
			: '\u201EIst ein zwangsweise eingef\u00FChrter Familienname Ausdruck von Verfolgung und Unterdr\u00FCckung, so kann der urspr\u00FCngliche Familienname f\u00FCr die Betroffenen sowie f\u00FCr seine Abk\u00F6mmlinge durch eine Namens\u00E4nderung wiederhergestellt werden.\u201C'),
		pdfLabel: (isEn ? data.namensaenderung?.pdfLabelEn : data.namensaenderung?.pdfLabelDe) || (isEn ? "Announcement in the Bundesanzeiger (PDF)" : "Bekanntmachung im Bundesanzeiger (PDF)"),
		pdfHref: data.namensaenderung?.pdfHref || "#",
	};

	const beratungSection = {
		heading: (isEn ? data.beratung?.headingEn : data.beratung?.headingDe) || (isEn ? "Counseling & Support" : "Beratung & Unterst\u00FCtzung"),
		subtitle: (isEn ? data.beratung?.subtitleEn : data.beratung?.subtitleDe) || (isEn
			? "We offer a wide range of counseling services for individuals and families \u2013 confidential, professional, and free of charge."
			: "Wir bieten ein breites Spektrum an Beratungsleistungen f\u00FCr Einzelpersonen und Familien \u2013 vertraulich, professionell und kostenlos."),
		ctaLabel: (isEn ? data.beratung?.ctaLabelEn : data.beratung?.ctaLabelDe) || (isEn ? "Contact Us" : "Kontakt aufnehmen"),
	};

	const iconCycle = [Shield, FileText, HeartHandshake, Link2, ArrowRight, ExternalLink];
	const staticServices = isEn
		? [
				{ title: "Social Counseling", description: "We offer comprehensive social counseling for individuals and families \u2013 from housing and financial aid to navigating authorities." },
				{ title: "Legal Advice", description: "Our advisors provide guidance on residency law, asylum procedures, and official correspondence." },
				{ title: "Psychological Support", description: "Confidential support for people dealing with stress, trauma, or difficult life situations." },
				{ title: "Integration Support", description: "We help with language courses, job applications, school enrollment, and life in Germany." },
				{ title: "Family Counseling", description: "Support for families with children, parenting questions, and intercultural challenges." },
				{ title: "Networking & Referrals", description: "We connect you with specialized organizations and agencies for in-depth support." },
		  ]
		: [
				{ title: "Sozialberatung", description: "Wir bieten umfassende Sozialberatung f\u00FCr Einzelpersonen und Familien \u2013 von Wohnungsfragen \u00FCber finanzielle Hilfe bis zur Beh\u00F6rdenkommunikation." },
				{ title: "Rechtsberatung", description: "Unsere Berater unterst\u00FCtzen bei aufenthaltsrechtlichen Fragen, Asylverfahren und offizieller Korrespondenz." },
				{ title: "Psychologische Unterst\u00FCtzung", description: "Vertrauliche Begleitung f\u00FCr Menschen, die mit Stress, Trauma oder schwierigen Lebenssituationen umgehen." },
				{ title: "Integrationshilfe", description: "Wir helfen bei Sprachkursen, Bewerbungen, Schulanmeldungen und dem Leben in Deutschland." },
				{ title: "Familienberatung", description: "Unterst\u00FCtzung f\u00FCr Familien mit Kindern, Erziehungsfragen und interkulturellen Herausforderungen." },
				{ title: "Vernetzung & Weitervermittlung", description: "Wir verbinden Sie mit spezialisierten Organisationen und Stellen f\u00FCr vertiefte Unterst\u00FCtzung." },
		  ];

	const apiServices = data.beratung?.services?.length
		? data.beratung.services.map((s, i) => ({
				icon: iconCycle[i % iconCycle.length],
				title: (isEn ? s.titleEn : s.titleDe) || s.titleDe || s.titleEn || "",
				description: (isEn ? s.descriptionEn : s.descriptionDe) || "",
		  }))
		: null;
	const counselingServices = (apiServices || staticServices).map((s, i) => ({
		...s,
		icon: iconCycle[i % iconCycle.length],
	}));

	const linksSection = {
		heading: (isEn ? data.wichtigeLinks?.headingEn : data.wichtigeLinks?.headingDe) || (isEn ? "Useful Links" : "Wichtige Links"),
		subtitle: (isEn ? data.wichtigeLinks?.subtitleEn : data.wichtigeLinks?.subtitleDe) || (isEn ? "Here you will find a selection of interesting links." : "Hier finden Sie eine Auswahl interessanter Links."),
	};

	const staticLinks = [
		{ name: "bethnahrin.de", description: isEn ? "Comprehensive German-language website on Assyrian life / Website of the Assyrian Mesopotamian Association Augsburg e.V." : "Umfassende deutschsprachige Webseite rund um assyrisches Leben / Webseite des Assyrischen Mesopotamien Verein Augsburg e.V.", href: "https://www.bethnahrin.de" },
		{ name: "qolo.de", description: isEn ? "Website of the Assyrian Youth Association in Germany (AJM)" : "Webseite des assyrischen Jugendverbandes in Deutschland (AJM)", href: "https://www.qolo.de" },
		{ name: "assyriskariksforbundet.se", description: isEn ? "Website of the Assyrian umbrella association in Sweden" : "Webseite des assyrischen Dachverbanden in Schweden", href: "https://www.assyriskariksforbundet.se" },
		{ name: "Assyria TV", description: isEn ? "The Assyrian web television" : "Der assyrische Webfernsehsender", href: "#" },
		{ name: "MARA Foundation", description: isEn ? "Foundation dedicated to preserving Assyrian culture, history and language / Extensive online archive" : "Stiftung die sich f\u00FCr den Erhalt der assyrischen Kultur, Geschichte und Sprache einsetzt / Umfangreiches Online-Archiv", href: "#" },
		{ name: "Assyriska FF", description: isEn ? "The Assyrian football club in the 3rd league in Sweden" : "Der assyrische Fu\u00DFballclub in der 3. Liga in Schweden", href: "#" },
		{ name: "Exodus", description: isEn ? "Documentary (1988) by Aziz Said" : "Dokumentation (1988) von Aziz Said", href: "#" },
		{ name: "K\u00F6nig Gilgamesch", description: isEn ? "Assyrian Theater Group Nison" : "Assyrische Theater Gruppe Nison", href: "#" },
		{ name: "Tamus&Ishtar", description: isEn ? "An Assyrian mythological comedy" : "Eine Assyrische mythologische Kom\u00F6die", href: "#" },
		{ name: "Shamiram", description: isEn ? "Assyrian music and dance group" : "Assyrische Musik und Tanzgruppe", href: "#" },
		{ name: "ZAVD KANAL (mit allen Videos)", description: isEn ? "The YouTube ZAVD channel" : "Der Youtube ZAVD Kanal", href: "#" },
	];

	const apiLinks = data.wichtigeLinks?.links?.length
		? data.wichtigeLinks.links.map((l) => ({
				name: l.name || "",
				description: (isEn ? l.descriptionEn : l.descriptionDe) || "",
				href: l.href || "#",
		  }))
		: null;
	const usefulLinks = apiLinks || staticLinks;

	return (
		<div className="min-h-screen bg-white">

			{/* ─── Hero ─────────────────────────────────────────────────────── */}
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
								{isEn ? "Our Services" : "Unsere Angebote"}
							</motion.span>
							<h1 className="text-5xl md:text-7xl font-extrabold text-white leading-none mb-5 tracking-tight">
								{isEn ? "Services &\nCounseling" : "Angebote &\nBeratung"}
							</h1>
							<p className="text-white/70 text-sm md:text-base max-w-xl leading-relaxed border-l-2 border-primary/60 pl-4">
								{hero.subtitle}
							</p>
						</motion.div>
					</div>
				</div>
			</section>

			{/* ─── Anchor Navigation ────────────────────────────────────────── */}
			<AnchorNav activeId={activeSection} isEn={isEn} />

			{/* ─── Section 1: Flucht & Asyl ─────────────────────────────────── */}
			<section id="flucht-asyl" className="py-20 md:py-28 bg-white">
				<div className="_container">
					<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

						{/* Left: Text */}
						<motion.div
							initial={{ opacity: 0, x: -24 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
						>
							<SectionTag label={isEn ? "Refugee & Asylum" : "Flucht & Asyl"} />
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
								{flucht.heading}
							</h2>

							<div className="space-y-4 text-gray-500 text-base leading-relaxed">
								<p>
									{flucht.paragraph1}
								</p>
								<p>
									{flucht.paragraph2}
								</p>
							</div>

							<div className="mt-8 p-5 bg-primary/5 border-l-4 border-primary rounded-r-xl">
								<p className="text-sm text-gray-600 leading-relaxed font-medium">
									{flucht.infoBox}
								</p>
							</div>
						</motion.div>

						{/* Right: PDF Cards */}
						<motion.div
							initial={{ opacity: 0, x: 24 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.15 }}
							className="space-y-4"
						>
							<h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
								{isEn ? "Resources & Downloads" : "Ressourcen & Downloads"}
							</h3>
							{pdfResources.map((resource, i) => (
								<PdfCard key={i} {...resource} />
							))}
						</motion.div>
					</div>
				</div>
			</section>

			{/* ─── Section 2: Namensänderung ────────────────────────────────── */}
			<section id="namensaenderung" className="py-20 md:py-28 bg-gray-50">
				<div className="_container">
					<div className="max-w-3xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
						>
							<SectionTag label={isEn ? "Name Change" : "Namensänderung"} />
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8">
								{namen.heading}
							</h2>

							<div className="space-y-5 text-gray-500 text-base leading-relaxed">
								<p>
									{namen.paragraph1}
								</p>
								<p>
									{namen.paragraph2}
								</p>
								<p>
									{namen.paragraph3}
								</p>
							</div>

							{/* Blockquote */}
							<motion.blockquote
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="my-8 bg-gray-900 text-white rounded-2xl p-7 relative overflow-hidden"
							>
								<div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-2xl" />
								<div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
								<p className="text-white/90 text-base md:text-lg leading-relaxed italic relative z-10">
									{namen.blockquote}
								</p>
							</motion.blockquote>

							<a
								href={namen.pdfHref}
								className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
							>
								<Download className="w-4 h-4" />
								{namen.pdfLabel}
							</a>
						</motion.div>
					</div>
				</div>
			</section>

			{/* ─── Section 3: Beratung & Unterstützung ─────────────────────── */}
			<section id="beratung" className="py-20 md:py-28 bg-gray-950">
				<div className="_container">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="mb-14"
					>
						<SectionTag label={isEn ? "Support" : "Unterstützung"} />
						<h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
							{beratungSection.heading}
						</h2>
						<p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
							{beratungSection.subtitle}
						</p>
					</motion.div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{counselingServices.map((service, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: i * 0.07 }}
								className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition-all group"
							>
								<div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
									<service.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
								</div>
								<h4 className="font-bold text-white text-base mb-2">{service.title}</h4>
								<p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
							</motion.div>
						))}
					</div>

					{/* CTA */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="mt-14 text-center"
					>
						<p className="text-gray-400 text-sm mb-5">
							{isEn
								? "Need help? Get in touch with us directly."
								: "Brauchen Sie Hilfe? Nehmen Sie direkt Kontakt mit uns auf."}
						</p>
						<a
							href={`/${locale}/kontakt`}
							className="inline-flex items-center gap-3 bg-primary text-white font-semibold px-8 py-4 rounded-full hover:bg-primary/90 transition-all text-sm tracking-wide group shadow-lg shadow-primary/30"
						>
							{beratungSection.ctaLabel}
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</a>
					</motion.div>
				</div>
			</section>

			{/* ─── Section 4: Wichtige Links ────────────────────────────────── */}
			<section id="wichtige-links" className="py-20 md:py-28 bg-white">
				<div className="_container">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="mb-14"
					>
						<SectionTag label={isEn ? "Resources" : "Ressourcen"} />
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
							{linksSection.heading}
						</h2>
						<p className="text-gray-500 text-base md:text-lg max-w-2xl">
							{linksSection.subtitle}
						</p>
					</motion.div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{usefulLinks.map((link, i) => (
							<LinkCard key={i} {...link} />
						))}
					</div>
				</div>
			</section>

		</div>
	);
}
