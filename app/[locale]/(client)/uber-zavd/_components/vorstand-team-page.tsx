"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mail } from "lucide-react";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { useEffect, useState } from "react";
import { KontaktInfoSection } from "@/app/[locale]/(client)/kontakt/_components/kontakt-info-section";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VorstandMember {
	nameDe?: string;
	nameEn?: string;
	roleDe?: string;
	roleEn?: string;
	phone?: string;
	email?: string;
	image?: string;
	facebook?: string;
	twitter?: string;
	linkedin?: string;
	instagram?: string;
}

interface TeamMember {
	nameDe?: string;
	nameEn?: string;
	roleDe?: string;
	roleEn?: string;
	bioDe?: string;
	bioEn?: string;
	phone?: string;
	email?: string;
	image?: string;
	facebook?: string;
	twitter?: string;
	linkedin?: string;
	instagram?: string;
}

interface PageData {
	hero: {
		taglineDe?: string;
		taglineEn?: string;
		titleDe?: string;
		titleEn?: string;
		subtitleDe?: string;
		subtitleEn?: string;
		image?: string;
	};
	vorstand: {
		sectionLabelDe?: string;
		sectionLabelEn?: string;
		headingDe?: string;
		headingEn?: string;
		members?: VorstandMember[];
	};
	team: {
		sectionLabelDe?: string;
		sectionLabelEn?: string;
		headingDe?: string;
		headingEn?: string;
		descriptionDe?: string;
		descriptionEn?: string;
		members?: TeamMember[];
	};
}

// ─── Static fallback data ─────────────────────────────────────────────────────

const fallbackData: PageData = {
	hero: {
		taglineDe: "Unsere Leute",
		taglineEn: "Our People",
		titleDe: "Vorstand & Team",
		titleEn: "Board & Team",
		subtitleDe: "Die Menschen, die ZAVD gestalten und leiten – engagiert, erfahren und leidenschaftlich.",
		subtitleEn: "The people who shape and guide ZAVD – committed, experienced, and passionate.",
		image: "/images/about/aboutbanner.jpg",
	},
	vorstand: {
		sectionLabelDe: "Vorstand",
		sectionLabelEn: "Executive Board",
		headingDe: "Unsere Führung",
		headingEn: "Our Leadership",
		members: [
			{
				nameDe: "Dr. Ahmad Al-Hassan",
				nameEn: "Dr. Ahmad Al-Hassan",
				roleDe: "1. Vorsitzender",
				roleEn: "1st Chairman",
				phone: "+49 (0) 524 1 – 123 456",
				email: "a.alhassan@zavd.de",
				image: "/images/about/zavd-team.jpg",
				facebook: "https://facebook.com",
				twitter: "https://x.com",
				linkedin: "https://linkedin.com",
				instagram: "https://instagram.com",
			},
			{
				nameDe: "Khalid Ibrahim",
				nameEn: "Khalid Ibrahim",
				roleDe: "Stellvertretender Vorsitzender",
				roleEn: "Deputy Chairman",
				phone: "+49 (0) 524 1 – 123 456",
				email: "k.ibrahim@zavd.de",
				image: "/images/about/office1pg.jpg",
				facebook: "https://facebook.com",
				twitter: "https://x.com",
				linkedin: "https://linkedin.com",
				instagram: "https://instagram.com",
			},
			{
				nameDe: "Layla Nasser",
				nameEn: "Layla Nasser",
				roleDe: "Schatzmeisterin",
				roleEn: "Treasurer",
				phone: "+49 (0) 524 1 – 123 456",
				email: "l.nasser@zavd.de",
				image: "/images/about/office2.jpg",
				facebook: "https://facebook.com",
				twitter: "https://x.com",
				linkedin: "https://linkedin.com",
				instagram: "https://instagram.com",
			},
		],
	},
	team: {
		sectionLabelDe: "Unser Team",
		sectionLabelEn: "Team",
		headingDe: "Leitende Köpfe",
		headingEn: "Leading Heads",
		descriptionDe: "Hinter jeder großartigen Organisation stehen engagierte Menschen, die durch täglichen Einsatz und Fachkompetenz Visionen Wirklichkeit werden lassen.",
		descriptionEn: "Behind every great organization are the dedicated individuals who bring vision to life through daily commitment and expertise.",
		members: [
			{
				nameDe: "Omar Khalil",
				nameEn: "Omar Khalil",
				roleDe: "Projektleiter Integration",
				roleEn: "Integration Project Lead",
				bioDe: "Seit über 10 Jahren engagiert sich Omar für die Integrationsprojekte des Verbands in Nordrhein-Westfalen.",
				bioEn: "Omar has been dedicated to the association's integration projects in North Rhine-Westphalia for over 10 years.",
				phone: "+49 (0) 524 1 – 123 456",
				email: "o.khalil@zavd.de",
				image: "/images/about/office3.jpg",
				facebook: "https://facebook.com",
				twitter: "https://x.com",
				linkedin: "https://linkedin.com",
				instagram: "https://instagram.com",
			},
			{
				nameDe: "Hana Mahmoud",
				nameEn: "Hana Mahmoud",
				roleDe: "Öffentlichkeitsarbeit",
				roleEn: "Public Relations",
				bioDe: "Hana koordiniert die Kommunikation zwischen den Mitgliedsvereinen und der Öffentlichkeit.",
				bioEn: "Hana coordinates communication between member associations and the public.",
				phone: "+49 (0) 524 1 – 123 456",
				email: "h.mahmoud@zavd.de",
				image: "/images/about/office4.jpg",
				facebook: "https://facebook.com",
				twitter: "https://x.com",
				linkedin: "https://linkedin.com",
				instagram: "https://instagram.com",
			},
			{
				nameDe: "Yusuf Al-Amin",
				nameEn: "Yusuf Al-Amin",
				roleDe: "Kulturbeauftragter",
				roleEn: "Cultural Officer",
				bioDe: "Yusuf organisiert kulturelle Veranstaltungen und fördert den interkulturellen Dialog in Deutschland.",
				bioEn: "Yusuf organizes cultural events and promotes intercultural dialogue throughout Germany.",
				phone: "+49 (0) 524 1 – 123 456",
				email: "y.alamin@zavd.de",
				image: "/images/about/office1pg.jpg",
				facebook: "https://facebook.com",
				twitter: "https://x.com",
				linkedin: "https://linkedin.com",
				instagram: "https://instagram.com",
			},
			{
				nameDe: "Sara Bishara",
				nameEn: "Sara Bishara",
				roleDe: "Jugend & Bildung",
				roleEn: "Youth & Education",
				bioDe: "Sara leitet die Bildungsprogramme für Jugendliche und unterstützt junge Mitglieder im Verband.",
				bioEn: "Sara leads educational programs for young people and supports young members within the association.",
				phone: "+49 (0) 524 1 – 123 456",
				email: "s.bishara@zavd.de",
				image: "/images/about/office2.jpg",
				facebook: "https://facebook.com",
				twitter: "https://x.com",
				linkedin: "https://linkedin.com",
				instagram: "https://instagram.com",
			},
		],
	},
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export function VorstandTeamPage() {
	useSetNavbarVariant("transparent");
	const locale = useLocale();
	const isEn = locale === "en";
	const [data, setData] = useState<PageData>(fallbackData);

	useEffect(() => {
		fetch("/api/vorstand-team-page")
			.then((res) => (res.ok ? res.json() : null))
			.then((json) => {
				if (json) {
					setData({
						hero: { ...fallbackData.hero, ...json.hero },
						vorstand: {
							...fallbackData.vorstand,
							...json.vorstand,
							members:
								json.vorstand?.members?.length
									? json.vorstand.members
									: fallbackData.vorstand.members,
						},
						team: {
							...fallbackData.team,
							...json.team,
							members:
								json.team?.members?.length
									? json.team.members
									: fallbackData.team.members,
						},
					});
				}
			})
			.catch(() => {/* keep fallback */});
	}, []);

	const [sitePhone, setSitePhone] = useState("");
	const [siteEmail, setSiteEmail] = useState("");

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

	const { hero, vorstand, team } = data;

	return (
		<div className="min-h-screen bg-white">

			{/* ─── Hero Banner ─── */}
			<section className="relative h-[420px] md:h-[500px] overflow-hidden">
				<motion.div
					className="absolute inset-0"
					initial={{ scale: 1 }}
					animate={{ scale: 1.08 }}
					transition={{ duration: 10, ease: "easeOut" }}
				>
					<Image
						src={hero.image || "/images/about/aboutbanner.jpg"}
						alt={isEn ? (hero.titleEn || "Board & Team") : (hero.titleDe || "Vorstand & Team")}
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
							{isEn ? (hero.taglineEn || "Our People") : (hero.taglineDe || "Unsere Leute")}
							<span className="w-5 h-px bg-primary" />
						</motion.span>
						<h1 className="text-5xl md:text-6xl font-extrabold text-white leading-none mb-5 tracking-tight">
							{isEn ? (hero.titleEn || "Board & Team") : (hero.titleDe || "Vorstand & Team")}
						</h1>
						<p className="text-white/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
							{isEn ? hero.subtitleEn : hero.subtitleDe}
						</p>
					</motion.div>
				</div>
			</section>

			{/* ─── Board Section (Vorstand) ─── */}
			<section className="py-20 md:py-28 bg-white">
				<div className="_container">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-14"
					>
						<SectionTag label={isEn ? (vorstand.sectionLabelEn || "Executive Board") : (vorstand.sectionLabelDe || "Vorstand")} />
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
							{isEn ? (vorstand.headingEn || "Our Leadership") : (vorstand.headingDe || "Unsere Führung")}
						</h2>
					</motion.div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
						{(vorstand.members || []).map((member, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: i * 0.1 }}
								className="group relative flex flex-col items-center text-center pt-10 pb-8 px-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
							>
								{/* Top accent line */}
								<div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

								{/* Circular photo */}
								<div className="relative w-36 h-36 rounded-full overflow-hidden mb-5 shrink-0 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
									<Image
										src={member.image || "/images/about/zavd-team.jpg"}
										alt={isEn ? (member.nameEn || "") : (member.nameDe || "")}
										fill
										className="object-cover group-hover:scale-110 transition-transform duration-500"
									/>
								</div>

								<h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
									{isEn ? member.nameEn : member.nameDe}
								</h3>
								<p className="text-primary text-[10px] font-semibold uppercase tracking-widest mb-5">
									{isEn ? member.roleEn : member.roleDe}
								</p>

								<div className="w-8 h-px bg-gray-200 mb-4" />

								{member.phone && (
									<a
										href={`tel:${member.phone.replace(/\s/g, "")}`}
										className="text-primary text-xs font-semibold hover:underline mb-4"
									>
										{member.phone}
									</a>
								)}

								<div className="flex items-center gap-2">
									{member.email && (
										<a
											href={`mailto:${member.email}`}
											className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300"
											aria-label="Email"
										>
											<Mail className="w-3.5 h-3.5" />
										</a>
									)}
									{member.facebook && (
										<a
											href={member.facebook}
											target="_blank"
											rel="noopener noreferrer"
											className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white transition-all duration-300"
											aria-label="Facebook"
										>
											<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
											</svg>
										</a>
									)}
									{member.twitter && (
										<a
											href={member.twitter}
											target="_blank"
											rel="noopener noreferrer"
											className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all duration-300"
											aria-label="X (Twitter)"
										>
											<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
											</svg>
										</a>
									)}
									{member.linkedin && (
										<a
											href={member.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#0A66C2] hover:text-white transition-all duration-300"
											aria-label="LinkedIn"
										>
											<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
											</svg>
										</a>
									)}
									{member.instagram && (
										<a
											href={member.instagram}
											target="_blank"
											rel="noopener noreferrer"
											className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#E1306C] hover:text-white transition-all duration-300"
											aria-label="Instagram"
										>
											<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
											</svg>
										</a>
									)}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ─── Team Section (Leading Heads) ─── */}
			<section className="py-20 md:py-28 bg-gray-900">
				<div className="_container">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-14 max-w-2xl mx-auto"
					>
						<SectionTag label={isEn ? (team.sectionLabelEn || "Team") : (team.sectionLabelDe || "Unser Team")} />
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							{isEn ? (team.headingEn || "Leading Heads") : (team.headingDe || "Leitende Köpfe")}
						</h2>
						{(team.descriptionDe || team.descriptionEn) && (
							<p className="text-gray-400 text-base leading-relaxed">
								{isEn ? team.descriptionEn : team.descriptionDe}
							</p>
						)}
					</motion.div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{(team.members || []).map((member, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: i * 0.08 }}
								className="group relative flex flex-col items-center text-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-primary"
							>
								{/* Circular photo */}
								<div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 shrink-0 ring-4 ring-gray-700 group-hover:ring-primary transition-all duration-300">
									<Image
										src={member.image || "/images/about/zavd-team.jpg"}
										alt={isEn ? (member.nameEn || "") : (member.nameDe || "")}
										fill
										className="object-cover group-hover:scale-110 transition-transform duration-500"
									/>
								</div>

								<h3 className="font-bold text-white text-sm uppercase tracking-wide leading-tight mb-1">
									{isEn ? member.nameEn : member.nameDe}
								</h3>
								<p className="text-primary text-[10px] font-semibold uppercase tracking-widest mb-3">
									{isEn ? member.roleEn : member.roleDe}
								</p>

								<div className="w-8 h-px bg-gray-600 mb-4" />

								{member.phone && (
									<a
										href={`tel:${member.phone.replace(/\s/g, '')}`}
										className="text-primary text-xs font-semibold hover:underline mb-4"
									>
										{member.phone}
									</a>
								)}

								{/* Social icons */}
								<div className="flex items-center gap-2">
									{member.email && (
										<a
											href={`mailto:${member.email}`}
											className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300"
											aria-label="Email"
										>
											<Mail className="w-3 h-3" />
										</a>
									)}
									{member.facebook && (
										<a
											href={member.facebook}
											target="_blank"
											rel="noopener noreferrer"
											className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white transition-all duration-300"
											aria-label="Facebook"
										>
											<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
												<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
											</svg>
										</a>
									)}
									{member.twitter && (
										<a
											href={member.twitter}
											target="_blank"
											rel="noopener noreferrer"
											className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
											aria-label="X (Twitter)"
										>
											<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
												<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
											</svg>
										</a>
									)}
									{member.linkedin && (
										<a
											href={member.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-[#0A66C2] hover:text-white transition-all duration-300"
											aria-label="LinkedIn"
										>
											<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
												<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
											</svg>
										</a>
									)}
									{member.instagram && (
										<a
											href={member.instagram}
											target="_blank"
											rel="noopener noreferrer"
											className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-[#E1306C] hover:text-white transition-all duration-300"
											aria-label="Instagram"
										>
											<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
											</svg>
										</a>
									)}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

		{/* ─── Contact Section ─── */}
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
