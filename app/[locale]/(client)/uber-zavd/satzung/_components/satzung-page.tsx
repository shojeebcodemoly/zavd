"use client";

import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { KontaktInfoSection } from "@/app/[locale]/(client)/kontakt/_components/kontakt-info-section";
import { useState, useMemo, useEffect } from "react";
import {
	MapPin,
	Target,
	Heart,
	Users,
	CreditCard,
	GitBranch,
	Users2,
	Key,
	Star,
	Briefcase,
	Eye,
	FileCheck,
	CheckSquare,
	XCircle,
	ChevronDown,
	Search,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SatzungItem {
	id: number;
	titleDe: string;
	titleEn: string;
	contentDe: string | string[];
	contentEn: string | string[];
	icon: React.ElementType;
}

interface Testimonial {
	nameDe?: string;
	nameEn?: string;
	roleDe?: string;
	roleEn?: string;
	quoteDe?: string;
	quoteEn?: string;
	image?: string;
}

interface HeroData {
	taglineDe?: string;
	taglineEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	image?: string;
}

interface SearchSectionData {
	tagDe?: string;
	tagEn?: string;
	headingDe?: string;
	headingEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	placeholderDe?: string;
	placeholderEn?: string;
}

interface FaqItemData {
	titleDe?: string;
	titleEn?: string;
	contentDe?: string[];
	contentEn?: string[];
}

interface FaqSectionData {
	tagDe?: string;
	tagEn?: string;
	headingDe?: string;
	headingEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	items?: FaqItemData[];
}

// ─── Icon list for CMS FAQ items ─────────────────────────────────────────────

const faqIconList = [MapPin, Target, Heart, Users, CreditCard, GitBranch, Users2, Key, Star, Briefcase, Eye, FileCheck, CheckSquare, XCircle];

// ─── Satzung Sections Data (fallback) ────────────────────────────────────────

const satzungItems: SatzungItem[] = [
	{
		id: 1,
		titleDe: "Name und Sitz",
		titleEn: "Name and Registered Office",
		icon: MapPin,
		contentDe:
			`Der Verband f\u00FChrt den Namen \u201EZentralverband der Assyrischen Vereinigungen in Deutschland e.V.\u201C (ZAVD). Der Sitz des Verbands ist in G\u00FCtersloh. Der Verband ist im Vereinsregister eingetragen.`,
		contentEn:
			"The association bears the name 'Central Association of Assyrian Associations in Germany e.V.' (ZAVD). The registered office of the association is in G\u00FCtersloh. The association is entered in the register of associations.",
	},
	{
		id: 2,
		titleDe: "Verbandszweck und -ziele",
		titleEn: "Association Purpose and Objectives",
		icon: Target,
		contentDe: [
			"Der Verband ist eine Dachorganisation seiner in Deutschland, \u00D6sterreich und der Schweiz bestehenden assyrischen Vereinigungen.",
			"1. Zweck des Verbandes ist es, den Assyrern, die in Assyrien (auch als Mesopotamien bekannt; umfasst Teile der heutigen Staaten Irak, Iran, Syrien und der T\u00FCrkei) als ethnische und christlich-religi\u00F6se Minderheit diskriminiert und verfolgt werden, zu helfen.",
			"2. Der Verband initiiert und unterst\u00FCtzt Entwicklungshilfema\u00DFnahmen f\u00FCr die bedrohten Assyrer in Assyrien.",
			"3. Der Verband bekennt sich zur freiheitlich-demokratischen Grundordnung und den europ\u00E4ischen Grundwerten der Europ\u00E4ischen Union. Er setzt sich gegen Rassismus ein, f\u00F6rdert die Toleranz auf allen Gebieten der Kultur und die V\u00F6lkerverst\u00E4ndigung. Er unterst\u00FCtzt die Integration der in Deutschland, \u00D6sterreich und der Schweiz lebenden Assyrer in die hiesige Gesellschaft.",
			"4. Der Satzungszweck wird verwirklicht insbesondere durch: Zusammenarbeit mit Menschenrechtsorganisationen, politischen Parteien, Regierungen auf kommunaler, Landes- und Bundesebene und anderen Organisationen; Schaffung von sozialen und kulturellen Zentren zur Betreuung von Assyrern; Pflege und F\u00F6rderung der assyrischen Kultur und Sprache; F\u00F6rderung der Bildung; F\u00F6rderung der Gleichstellung der Geschlechter; Gr\u00FCndung einer Deutsch-Assyrischen Gesellschaft sowie anderer Europ\u00E4isch-Assyrischen Freundschaftsgesellschaften; Nutzung von verschiedenen Medien der \u00D6ffentlichkeitsarbeit.",
			"5. Der Verband koordiniert die Arbeit seiner Mitglieder.",
			"6. Der Verband erkennt den Assyrischen Jugendverband Mitteleuropa (AJM) e.V. als seinen Jugendverband an.",
			"7. Der Verband erkennt die Assyrian Confederation of Europe (ACE) als seine europaweite Dachorganisation an.",
		],
		contentEn: [
			"The association is an umbrella organization of its Assyrian associations in Germany, Austria, and Switzerland.",
			"1. The purpose of the association is to help Assyrians who are discriminated against and persecuted as an ethnic and Christian-religious minority in Assyria (also known as Mesopotamia; encompasses parts of present-day Iraq, Iran, Syria, and Turkey).",
			"2. The association initiates and supports development aid measures for the threatened Assyrians in Assyria.",
			"3. The association commits to the free democratic basic order and the European values of the European Union. It opposes racism, promotes tolerance in all areas of culture and international understanding. It supports the integration of Assyrians living in Germany, Austria, and Switzerland into local society.",
			"4. The statutory purpose is realized in particular by: cooperation with human rights organizations, political parties, governments at local, state, and federal level; creation of social and cultural centers for Assyrians; cultivation and promotion of Assyrian culture and language; promotion of education; promotion of gender equality; founding of a German-Assyrian Society and other European-Assyrian Friendship Societies; use of various public relations media.",
			"5. The association coordinates the work of its members.",
			"6. The association recognizes the Assyrian Youth Association Central Europe (AJM) e.V. as its youth association.",
			"7. The association recognizes the Assyrian Confederation of Europe (ACE) as its Europe-wide umbrella organization.",
		],
	},
	{
		id: 3,
		titleDe: "Gemeinn\u00FCtzigkeit",
		titleEn: "Non-Profit Status",
		icon: Heart,
		contentDe:
			`Der Verband verfolgt ausschlie\u00DFlich und unmittelbar gemeinn\u00FCtzige Zwecke im Sinne des Abschnitts \u201ESteuerbeg\u00FCnstigte Zwecke\u201C der Abgabenordnung. Der Verband ist selbstlos t\u00E4tig; er verfolgt nicht in erster Linie eigenwirtschaftliche Zwecke. Mittel des Verbands d\u00FCrfen nur f\u00FCr die satzungsm\u00E4\u00DFigen Zwecke verwendet werden. Die Mitglieder erhalten keine Zuwendungen aus Mitteln des Verbands.`,
		contentEn:
			"The association exclusively and directly pursues non-profit purposes within the meaning of the section 'Tax-privileged purposes' of the Tax Code. The association acts selflessly; it does not primarily pursue its own economic interests. The association's funds may only be used for statutory purposes. Members do not receive any benefits from the association's funds.",
	},
	{
		id: 4,
		titleDe: "Mitgliedschaft",
		titleEn: "Membership",
		icon: Users,
		contentDe:
			"Mitglied des Verbandes kann jeder assyrische Verein in Deutschland, \u00D6sterreich und der Schweiz werden, der die Ziele des Verbandes anerkennt und dessen Satzung nicht im Widerspruch zur Satzung des Verbandes steht. \u00DCber die Aufnahme entscheidet der Vorstand. Die Mitgliedschaft endet durch Austritt, Ausschluss oder Aufl\u00F6sung des Mitgliedsvereins. Ein Ausschluss kann erfolgen, wenn ein Mitglied den Zielen des Verbandes zuwider handelt.",
		contentEn:
			"Any Assyrian association in Germany, Austria, and Switzerland that recognizes the goals of the association and whose statutes are not contrary to those of the association may become a member. The board decides on admission. Membership ends by withdrawal, exclusion, or dissolution of the member association. Exclusion may occur if a member acts contrary to the association's goals.",
	},
	{
		id: 5,
		titleDe: "Mitgliedsbeitr\u00E4ge und Mittel",
		titleEn: "Membership Fees and Resources",
		icon: CreditCard,
		contentDe:
			"Die Mitgliedsvereine zahlen einen Jahresbeitrag. Die H\u00F6he des Jahresbeitrags wird von der Delegiertenversammlung festgesetzt. Die Mittel des Verbandes d\u00FCrfen nur f\u00FCr die in der Satzung genannten Zwecke verwendet werden. Es darf keine Person durch Ausgaben, die dem Zweck des Verbandes fremd sind, oder durch unverh\u00E4ltnism\u00E4\u00DFig hohe Verg\u00FCtungen beg\u00FCnstigt werden.",
		contentEn:
			"Member associations pay an annual fee. The amount of the annual fee is determined by the delegates' assembly. The association's funds may only be used for the purposes stated in the statutes. No person may be favored through expenditures that are foreign to the association's purpose or through disproportionately high remuneration.",
	},
	{
		id: 6,
		titleDe: "Organe",
		titleEn: "Governing Bodies",
		icon: GitBranch,
		contentDe:
			"Die Organe des Verbandes sind: 1. Die Delegiertenversammlung, 2. Der Vorstand, 3. Der gesch\u00E4ftsf\u00FChrende Vorstand, 4. Der Aufsichtsrat. Die Organe f\u00FChren ihre T\u00E4tigkeiten ehrenamtlich durch, sofern die Delegiertenversammlung keine andere Regelung trifft.",
		contentEn:
			"The governing bodies of the association are: 1. The Delegates' Assembly, 2. The Board, 3. The Managing Board, 4. The Supervisory Board. The governing bodies carry out their activities on a voluntary basis, unless the Delegates' Assembly makes other arrangements.",
	},
	{
		id: 7,
		titleDe: "Delegiertenversammlung",
		titleEn: "Delegates' Assembly",
		icon: Users2,
		contentDe:
			"Die Delegiertenversammlung ist das h\u00F6chste Organ des Verbandes. Sie tritt mindestens einmal j\u00E4hrlich zusammen. Die Einladung erfolgt mindestens vier Wochen vorher schriftlich durch den gesch\u00E4ftsf\u00FChrenden Vorstand unter Bekanntgabe der Tagesordnung. Die Delegiertenversammlung ist zust\u00E4ndig f\u00FCr: Entgegennahme des Jahresberichts, Entlastung des Vorstands, Wahl des Vorstands, Festsetzung der Mitgliedsbeitr\u00E4ge, Satzungs\u00E4nderungen und Aufl\u00F6sung des Verbandes.",
		contentEn:
			"The Delegates' Assembly is the highest governing body of the association. It meets at least once a year. Invitations are sent at least four weeks in advance in writing by the managing board along with the agenda. The Delegates' Assembly is responsible for: receiving the annual report, discharging the board, electing the board, setting membership fees, amending the statutes, and dissolving the association.",
	},
	{
		id: 8,
		titleDe: "Delegiertenschl\u00FCssel",
		titleEn: "Delegate Allocation",
		icon: Key,
		contentDe:
			"Jeder Mitgliedsverein entsendet Delegierte zur Delegiertenversammlung. Der Schl\u00FCssel f\u00FCr die Anzahl der Delegierten wird von der Delegiertenversammlung festgelegt und richtet sich nach der Mitgliederzahl der jeweiligen Mitgliedsvereine. Jeder Mitgliedsverein hat mindestens eine Stimme.",
		contentEn:
			"Each member association sends delegates to the Delegates' Assembly. The key for the number of delegates is determined by the Delegates' Assembly and is based on the number of members of each member association. Each member association has at least one vote.",
	},
	{
		id: 9,
		titleDe: "Vorstand",
		titleEn: "Board of Directors",
		icon: Star,
		contentDe:
			"Der Vorstand besteht aus dem gesch\u00E4ftsf\u00FChrenden Vorstand und weiteren Mitgliedern. Er wird von der Delegiertenversammlung f\u00FCr eine Amtszeit von vier Jahren gew\u00E4hlt. Der Vorstand f\u00FChrt die Beschl\u00FCsse der Delegiertenversammlung aus und verwaltet das Verm\u00F6gen des Verbandes. Er tritt nach Bedarf, mindestens jedoch zweimal j\u00E4hrlich, zusammen.",
		contentEn:
			"The Board of Directors consists of the managing board and additional members. It is elected by the Delegates' Assembly for a term of four years. The board implements the decisions of the Delegates' Assembly and manages the association's assets. It meets as needed, but at least twice a year.",
	},
	{
		id: 10,
		titleDe: "Gesch\u00E4ftsf\u00FChrender Vorstand",
		titleEn: "Managing Board",
		icon: Briefcase,
		contentDe:
			"Der gesch\u00E4ftsf\u00FChrende Vorstand besteht aus dem 1. Vorsitzenden, dem 2. Vorsitzenden, dem Schatzmeister und dem Schriftf\u00FChrer. Er ist der gesetzliche Vertreter des Verbandes im Sinne des \u00A7 26 BGB. Je zwei Mitglieder des gesch\u00E4ftsf\u00FChrenden Vorstands vertreten den Verband gemeinsam. Der gesch\u00E4ftsf\u00FChrende Vorstand ist f\u00FCr alle Angelegenheiten des Verbandes zust\u00E4ndig, die nicht durch die Satzung einem anderen Organ des Verbandes \u00FCbertragen sind.",
		contentEn:
			"The managing board consists of the 1st chairperson, the 2nd chairperson, the treasurer, and the secretary. It is the legal representative of the association within the meaning of \u00A7 26 BGB. Any two members of the managing board jointly represent the association. The managing board is responsible for all matters of the association not assigned to another governing body by the statutes.",
	},
	{
		id: 11,
		titleDe: "Aufsichtsrat",
		titleEn: "Supervisory Board",
		icon: Eye,
		contentDe:
			"Der Aufsichtsrat besteht aus drei Mitgliedern, die von der Delegiertenversammlung f\u00FCr eine Amtszeit von vier Jahren gew\u00E4hlt werden. Der Aufsichtsrat \u00FCberwacht die T\u00E4tigkeit des Vorstands. Er hat das Recht, die B\u00FCcher und Unterlagen des Verbandes einzusehen. Der Aufsichtsrat erstattet der Delegiertenversammlung Bericht.",
		contentEn:
			"The Supervisory Board consists of three members elected by the Delegates' Assembly for a term of four years. The Supervisory Board monitors the activities of the board. It has the right to inspect the association's books and records. The Supervisory Board reports to the Delegates' Assembly.",
	},
	{
		id: 12,
		titleDe: "Beschl\u00FCsse",
		titleEn: "Resolutions",
		icon: FileCheck,
		contentDe:
			"Beschl\u00FCsse der Delegiertenversammlung werden mit einfacher Mehrheit der anwesenden stimmberechtigten Delegierten gefasst, sofern die Satzung nichts anderes bestimmt. Bei Stimmengleichheit gilt ein Antrag als abgelehnt. Satzungs\u00E4nderungen bed\u00FCrfen einer Zweidrittelmehrheit. Die Aufl\u00F6sung des Verbandes bedarf einer Dreiviertelmehrheit.",
		contentEn:
			"Resolutions of the Delegates' Assembly are passed by a simple majority of the voting delegates present, unless the statutes provide otherwise. In the event of a tie, a motion is deemed rejected. Amendments to the statutes require a two-thirds majority. The dissolution of the association requires a three-quarters majority.",
	},
	{
		id: 13,
		titleDe: "Wahlen",
		titleEn: "Elections",
		icon: CheckSquare,
		contentDe:
			"Wahlen werden grunds\u00E4tzlich geheim durchgef\u00FChrt. Auf Antrag kann offen gew\u00E4hlt werden, wenn kein Mitglied widerspricht. Gew\u00E4hlt ist, wer die meisten Stimmen auf sich vereinigt. Bei Stimmengleichheit findet eine Stichwahl statt. Ist auch diese unentschieden, entscheidet das Los.",
		contentEn:
			"Elections are generally conducted by secret ballot. At the request of members, open voting may be used if no member objects. Elected is whoever receives the most votes. In the event of a tie, a runoff election takes place. If this is also tied, the decision is made by lot.",
	},
	{
		id: 14,
		titleDe: "Aufl\u00F6sung",
		titleEn: "Dissolution",
		icon: XCircle,
		contentDe:
			"Die Aufl\u00F6sung des Verbandes kann nur von einer zu diesem Zweck einberufenen au\u00DFerordentlichen Delegiertenversammlung mit einer Dreiviertelmehrheit beschlossen werden. Bei Aufl\u00F6sung des Verbandes oder bei Wegfall steuerbeg\u00FCnstigter Zwecke f\u00E4llt das Verm\u00F6gen des Verbandes an eine juristische Person des \u00F6ffentlichen Rechts oder eine andere steuerbeg\u00FCnstigte K\u00F6rperschaft zwecks Verwendung f\u00FCr die F\u00F6rderung der assyrischen Kultur und Sprache.",
		contentEn:
			"The dissolution of the association can only be decided by an extraordinary Delegates' Assembly convened for this purpose with a three-quarters majority. Upon dissolution of the association or if tax-privileged purposes cease, the association's assets shall pass to a legal entity under public law or another tax-privileged body for the promotion of Assyrian culture and language.",
	},
];

// ─── Testimonial Data (fallback) ──────────────────────────────────────────────

const testimonials: Testimonial[] = [
	{
		nameDe: "Dr. George Aziz",
		nameEn: "Dr. George Aziz",
		roleDe: "Mitgliedsverein, Hannover",
		roleEn: "Member Association, Hanover",
		quoteDe:
			"Die ZAVD-Satzung bildet das Fundament unserer gemeinsamen Arbeit. Sie verbindet alle assyrischen Gemeinden in Deutschland unter einem Dach und st\u00E4rkt unsere kollektive Stimme.",
		quoteEn:
			"The ZAVD statutes form the foundation of our joint work. They unite all Assyrian communities in Germany under one roof and strengthen our collective voice.",
		image: "/images/about/office1pg.jpg",
	},
	{
		nameDe: "Miriam Shabo",
		nameEn: "Miriam Shabo",
		roleDe: "Delegierte, Stuttgart",
		roleEn: "Delegate, Stuttgart",
		quoteDe:
			"Die Satzung gew\u00E4hrleistet, dass jede Gemeinschaft geh\u00F6rt wird. Durch klare Regelungen zur Delegiertenversammlung k\u00F6nnen wir gemeinsam Entscheidungen treffen, die alle betreffen.",
		quoteEn:
			"The statutes ensure that every community is heard. Through clear rules for the delegates' assembly, we can jointly make decisions that affect everyone.",
		image: "/images/about/office2.jpg",
	},
	{
		nameDe: "Sami Khoshaba",
		nameEn: "Sami Khoshaba",
		roleDe: "Vorstandsmitglied, Berlin",
		roleEn: "Board Member, Berlin",
		quoteDe:
			"Als Vorstandsmitglied sch\u00E4tze ich die Transparenz, die unsere Satzung schafft. Sie definiert klar die Verantwortlichkeiten und sorgt f\u00FCr eine gerechte und demokratische F\u00FChrung.",
		quoteEn:
			"As a board member, I appreciate the transparency that our statutes create. They clearly define responsibilities and ensure fair and democratic governance.",
		image: "/images/about/office3.jpg",
	},
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTag({ label }: { label: string }) {
	return (
		<div className="inline-flex items-center gap-2 mb-4">
			<span className="w-6 h-px bg-primary" />
			<span className="text-primary text-xs font-semibold uppercase tracking-[0.15em]">
				{label}
			</span>
			<span className="w-6 h-px bg-primary" />
		</div>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SatzungPage() {
	useSetNavbarVariant("transparent");
	const locale = useLocale();
	const isEn = locale === "en";
	const [searchQuery, setSearchQuery] = useState("");
	const [activeId, setActiveId] = useState<number | null>(null);
	const [activeTestimonial, setActiveTestimonial] = useState(0);
	const [direction, setDirection] = useState(1);
	const [sitePhone, setSitePhone] = useState("");
	const [siteEmail, setSiteEmail] = useState("");
	const [hero, setHero] = useState<HeroData>({});
	const [searchSectionData, setSearchSectionData] = useState<SearchSectionData>({});
	const [faqSectionData, setFaqSectionData] = useState<FaqSectionData>({});
	const [faqLoaded, setFaqLoaded] = useState(false);
	const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>([]);
	const [pageHasBeenSaved, setPageHasBeenSaved] = useState(false);

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
		fetch("/api/satzung-page")
			.then((res) => (res.ok ? res.json() : null))
			.then((json) => {
				if (json) {
					if (json.hero) setHero(json.hero);
					if (json.searchSection) setSearchSectionData(json.searchSection);
					// Always update faqSection from API, even if items is empty
					setFaqSectionData(json.faqSection || {});
					setFaqLoaded(true);
				if (json.updatedAt && json.createdAt) {
					setPageHasBeenSaved(new Date(json.updatedAt).getTime() > new Date(json.createdAt).getTime());
				}
					if (json.testimonials?.items?.length) {
						setTestimonialsData(json.testimonials.items);
					}
				}
			})
			.catch(() => {});
	}, []);

	// Active FAQ items: use CMS data once loaded, otherwise show hardcoded fallback
	const activeFaqItems = useMemo(() => {
		if (faqLoaded) {
			// User has explicitly saved at least once → trust DB items (even if empty)
			if (pageHasBeenSaved) {
				return (faqSectionData.items || []).map((item, i) => ({
					id: i + 1,
					titleDe: item.titleDe || "",
					titleEn: item.titleEn || "",
					contentDe: item.contentDe || [],
					contentEn: item.contentEn || [],
					icon: faqIconList[i % faqIconList.length],
				}));
			}
			// Never explicitly saved → use hardcoded defaults (or DB items if non-empty)
			if (faqSectionData.items && faqSectionData.items.length > 0) {
				return faqSectionData.items.map((item, i) => ({
					id: i + 1,
					titleDe: item.titleDe || "",
					titleEn: item.titleEn || "",
					contentDe: item.contentDe || [],
					contentEn: item.contentEn || [],
					icon: faqIconList[i % faqIconList.length],
				}));
			}
			return satzungItems;
		}
		// Still loading → show hardcoded defaults
		return satzungItems;
	}, [faqSectionData.items, faqLoaded, pageHasBeenSaved]);

	// Merge API data with fallback testimonials
	const activeTestimonials = testimonialsData.length > 0 ? testimonialsData : testimonials;

	const goTo = (index: number, dir: number) => {
		setDirection(dir);
		setActiveTestimonial(index);
	};

	const filtered = useMemo(() => {
		if (!searchQuery.trim()) return activeFaqItems;
		const q = searchQuery.toLowerCase();
		return activeFaqItems.filter((item) => {
			const title = isEn ? item.titleEn : item.titleDe;
			const content = isEn ? item.contentEn : item.contentDe;
			const contentStr = Array.isArray(content) ? content.join(" ") : (content as string);
			return title.toLowerCase().includes(q) || contentStr.toLowerCase().includes(q);
		});
	}, [searchQuery, isEn, activeFaqItems]);

	const toggle = (id: number) => setActiveId((prev) => (prev === id ? null : id));

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
					<Image
						src={hero.image || "/images/about/aboutbanner.jpg"}
						alt={isEn ? (hero.titleEn || "Statutes") : (hero.titleDe || "Satzung")}
						fill
						className="object-cover"
						priority
					/>
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
							{isEn ? (hero.taglineEn || "Legal Framework") : (hero.taglineDe || "Rechtliches Rahmenwerk")}
							<span className="w-5 h-px bg-primary" />
						</motion.span>
						<h1 className="text-5xl md:text-6xl font-extrabold text-white leading-none mb-5 tracking-tight">
							{isEn ? (hero.titleEn || "Statutes") : (hero.titleDe || "Satzung")}
						</h1>
						<p className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
							{isEn
								? (hero.subtitleEn || "The legal foundation that governs the ZAVD and guides our community's mission and values.")
								: (hero.subtitleDe || "Das rechtliche Fundament, das den ZAVD regelt und die Mission und Werte unserer Gemeinschaft leitet.")}
						</p>
					</motion.div>
				</div>
			</section>

			{/* ─── 2. Search Section ─── */}
			<section className="py-16 bg-gray-50 border-b border-gray-100">
				<div className="_container">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
						{/* Left: intro text */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="max-w-lg"
						>
							<SectionTag label={isEn ? (searchSectionData.tagEn || "Constitution") : (searchSectionData.tagDe || "Verfassung")} />
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-snug">
								{isEn ? (searchSectionData.headingEn || "Explore All 14 Sections") : (searchSectionData.headingDe || "Alle 14 Abschnitte erkunden")}
							</h2>
							<p className="text-gray-500 text-sm md:text-base leading-relaxed">
								{isEn
									? (searchSectionData.descriptionEn || "Browse through the complete statutes of the ZAVD. Use the search to quickly find the section you need.")
									: (searchSectionData.descriptionDe || "Durchsuchen Sie die vollst\u00E4ndige Satzung des ZAVD. Nutzen Sie die Suche, um den gew\u00FCnschten Abschnitt schnell zu finden.")}
							</p>
						</motion.div>

						{/* Right: search input */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="w-full md:w-80 flex-shrink-0"
						>
							<div className="relative">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder={isEn ? (searchSectionData.placeholderEn || "Search sections\u2026") : (searchSectionData.placeholderDe || "Abschnitte suchen\u2026")}
									className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm"
								/>
							</div>
							{searchQuery && (
								<p className="text-xs text-gray-400 mt-2 ml-1">
									{filtered.length}{" "}
									{isEn ? "result(s) found" : "Ergebnis(se) gefunden"}
								</p>
							)}
						</motion.div>
					</div>
				</div>
			</section>

			{/* ─── 3. Modern FAQ / Accordion ─── */}
			<section className="py-24 bg-white">
				<div className="_container">
					{/* Section heading */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-14"
					>
						<SectionTag label={isEn ? (faqSectionData.tagEn || "Statutes") : (faqSectionData.tagDe || "Satzung")} />
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
							{isEn ? (faqSectionData.headingEn || "Frequently Asked Questions") : (faqSectionData.headingDe || "H\u00E4ufig gestellte Fragen")}
						</h2>
						<p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
							{isEn
								? (faqSectionData.descriptionEn || "Find answers to common questions about the ZAVD statutes and its governing structure.")
								: (faqSectionData.descriptionDe || "Hier finden Sie Antworten auf h\u00E4ufige Fragen zur ZAVD-Satzung und ihrer Organisationsstruktur.")}
						</p>
					</motion.div>

					{filtered.length === 0 ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-center py-20 text-gray-300"
						>
							<Search className="w-10 h-10 mx-auto mb-3" />
							<p className="text-sm text-gray-400">
								{isEn
									? "No sections match your search."
									: "Keine Abschnitte entsprechen Ihrer Suche."}
							</p>
						</motion.div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
							{filtered.map((item, i) => {
								const Icon = item.icon;
								const title = isEn ? item.titleEn : item.titleDe;
								const content = isEn ? item.contentEn : item.contentDe;
								const isOpen = activeId === item.id;

								return (
									<motion.div
										key={item.id}
										initial={{ opacity: 0, y: 18 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.4, delay: i * 0.035 }}
										className={`rounded-2xl overflow-hidden transition-all duration-300 ${
											isOpen
												? "shadow-lg ring-1 ring-primary/20 bg-white"
												: "bg-gray-50 hover:bg-white hover:shadow-md"
										}`}
									>
										<button
											onClick={() => toggle(item.id)}
											className="w-full flex items-center gap-4 px-6 py-5 text-left group"
										>
											{/* Icon circle */}
											<div
												className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
													isOpen
														? "bg-primary text-white shadow-md shadow-primary/30"
														: "bg-white text-gray-400 shadow-sm group-hover:text-primary group-hover:shadow-primary/20"
												}`}
											>
												<Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
											</div>

											{/* Title block */}
											<div className="flex-1 min-w-0">
												<span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
													\u00A7 {item.id}
												</span>
												<p
													className={`text-sm font-semibold leading-snug mt-0.5 transition-colors duration-200 ${
														isOpen ? "text-primary" : "text-gray-800 group-hover:text-gray-900"
													}`}
												>
													{title}
												</p>
											</div>

											{/* Chevron in circle */}
											<div
												className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
													isOpen
														? "bg-primary/10 text-primary rotate-180"
														: "bg-white text-gray-300 group-hover:text-gray-400 shadow-sm"
												}`}
											>
												<ChevronDown className="w-3.5 h-3.5" />
											</div>
										</button>

										<AnimatePresence initial={false}>
											{isOpen && (
												<motion.div
													key="panel"
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													transition={{ duration: 0.3, ease: "easeInOut" }}
													className="overflow-hidden"
												>
													<div className="px-6 pb-6 pt-0">
														<div className="w-full h-px bg-gray-100 mb-4" />
														{Array.isArray(content) ? (
															<ul className="space-y-2.5 pl-1">
																{content.map((line, j) => (
																	<li
																		key={j}
																		className="text-gray-500 text-sm leading-relaxed flex gap-2"
																	>
																		<span className="text-primary/40 mt-1 flex-shrink-0">&bull;</span>
																		<span>{line}</span>
																	</li>
																))}
															</ul>
														) : (
															<p className="text-gray-500 text-sm leading-relaxed">
																{content}
															</p>
														)}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								);
							})}
						</div>
					)}
				</div>
			</section>

			{/* ─── 4. Modern Testimonial Section ─── */}
			<section className="py-24 bg-gray-50 overflow-hidden">
				<div className="_container">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<SectionTag label={isEn ? "Voices" : "Stimmen"} />
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
							{isEn ? "What Our Community Says" : "Was unsere Gemeinschaft sagt"}
						</h2>
					</motion.div>

					{/* Carousel */}
					<div className="max-w-2xl mx-auto text-center">
						{/* Avatar + name */}
						<AnimatePresence mode="wait" custom={direction}>
							<motion.div
								key={activeTestimonial}
								custom={direction}
								variants={{
									enter: (d: number) => ({ opacity: 0, x: d * 60 }),
									center: { opacity: 1, x: 0 },
									exit: (d: number) => ({ opacity: 0, x: d * -60 }),
								}}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{ duration: 0.35, ease: "easeInOut" }}
								className="flex flex-col items-center"
							>
								{/* Avatar */}
								<div className="relative w-20 h-20 rounded-full overflow-hidden mb-5 ring-4 ring-gray-100">
									<Image
										src={activeTestimonials[activeTestimonial].image ?? ""}
										alt={isEn ? (activeTestimonials[activeTestimonial].nameEn ?? "") : (activeTestimonials[activeTestimonial].nameDe ?? "")}
										fill
										className="object-cover"
									/>
								</div>

								{/* Name & role */}
								<p className="font-bold text-gray-900 text-base tracking-wide">
									\u2014 {isEn ? activeTestimonials[activeTestimonial].nameEn : activeTestimonials[activeTestimonial].nameDe} \u2014
								</p>
								<p className="text-gray-400 text-sm mt-1 mb-8">
									{isEn ? activeTestimonials[activeTestimonial].roleEn : activeTestimonials[activeTestimonial].roleDe}
								</p>

								{/* Quote */}
								<p className="text-gray-700 text-lg md:text-xl font-medium leading-relaxed">
									&ldquo;{isEn ? activeTestimonials[activeTestimonial].quoteEn : activeTestimonials[activeTestimonial].quoteDe}&rdquo;
								</p>
							</motion.div>
						</AnimatePresence>

						{/* Controls: arrows + dots */}
						<div className="flex flex-col items-center gap-3 mt-10">
							{/* Arrow buttons */}
							<div className="flex items-center gap-3">
								<button
									onClick={() => {
										const prev = activeTestimonial === 0 ? activeTestimonials.length - 1 : activeTestimonial - 1;
										goTo(prev, -1);
									}}
									className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all duration-200"
									aria-label="Previous"
								>
									<ChevronDown className="w-4 h-4 rotate-90" />
								</button>
								<button
									onClick={() => {
										const next = activeTestimonial === activeTestimonials.length - 1 ? 0 : activeTestimonial + 1;
										goTo(next, 1);
									}}
									className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all duration-200"
									aria-label="Next"
								>
									<ChevronDown className="w-4 h-4 -rotate-90" />
								</button>
							</div>

							{/* Dot indicators */}
							<div className="flex items-center gap-2">
								{activeTestimonials.map((_, i) => (
									<button
										key={i}
										onClick={() => goTo(i, i > activeTestimonial ? 1 : -1)}
										aria-label={`Testimonial ${i + 1}`}
										className={`h-2 rounded-full transition-all duration-300 ${
											i === activeTestimonial
												? "bg-primary w-6"
												: "bg-gray-300 w-2 hover:bg-gray-400"
										}`}
									/>
								))}
							</div>
						</div>
					</div>

					</div>
			</section>

			{/* ─── 5. Contact Section ─── */}
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
