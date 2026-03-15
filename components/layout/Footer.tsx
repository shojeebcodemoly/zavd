"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Linkedin, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Logo from "../common/logo";
import type { SiteConfigType } from "@/config/site";
import type { IFooterSettings } from "@/models/site-settings.model";

function PinterestIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
		>
			<path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
		</svg>
	);
}

interface FooterProps {
	config: SiteConfigType;
	footerSettings?: IFooterSettings;
	logoUrl?: string;
	companyName?: string;
}

export function Footer({ config, footerSettings, logoUrl, companyName }: FooterProps) {
	const t = useTranslations("footer");
	const nav = useTranslations("navigation");
	const currentYear = new Date().getFullYear();
	const primaryAddress = config.company.addresses[0];
	const [email, setEmail] = useState("");
	const [subscribed, setSubscribed] = useState(false);

	// Col 2 — Über ZAVD
	const uberZavdLinks = [
		{ label: nav("uberZavd"), href: "/uber-zavd" },
		{ label: nav("vorstandTeam"), href: "/uber-zavd/vorstand-team" },
		{ label: nav("geschichte"), href: "/uber-zavd/geschichte" },
		{ label: nav("satzung"), href: "/uber-zavd/satzung" },
	];

	// Col 3 — Angebote & Beratung
	const angeboteLinks = [
		{ label: nav("fluchtAsyl"), href: "/angebote-beratung/flucht-asyl" },
		{ label: nav("beratungUnterstuetzung"), href: "/angebote-beratung/beratung-unterstuetzung" },
		{ label: nav("namensaenderung"), href: "/angebote-beratung/namensaenderung" },
		{ label: nav("wichtigeLinks"), href: "/angebote-beratung/wichtige-links" },
	];

	// Col 4 — Projekte
	const projekteLinks = [
		{ label: nav("patenschaftsprojekt"), href: "/projekte/patenschaftsprojekt" },
		{ label: nav("gemeinsamAktiv"), href: "/projekte/gemeinsam-aktiv" },
		{ label: nav("gutReinkommen"), href: "/projekte/gut-reinkommen" },
		{ label: nav("ehrenamtEngagement"), href: "/projekte/ehrenamt-engagement" },
	];

	const bottomLinks = [
		{ label: t("privacyPolicy"), href: "/integritetspolicy" },
		{ label: t("termsOfService"), href: "/juridisk-information" },
	];

	const socialIcons = [
		{ Icon: Facebook, href: config.links.facebook || "#", label: "Facebook" },
		{ Icon: Instagram, href: config.links.instagram || "#", label: "Instagram" },
		{ Icon: Twitter, href: config.links.twitter || "#", label: "Twitter" },
		{ Icon: Youtube, href: config.links.youtube || "#", label: "YouTube" },
		{ Icon: PinterestIcon, href: config.links.pinterest || "#", label: "Pinterest" },
		{ Icon: Linkedin, href: config.links.linkedin || "#", label: "LinkedIn" },
	];

	const linkClass =
		"relative text-white/55 text-sm transition-colors duration-200 hover:text-white " +
		"after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-primary " +
		"after:transition-all after:duration-300 hover:after:w-full";

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (email) {
			setSubscribed(true);
			setEmail("");
		}
	};

	return (
		<footer className="bg-secondary text-white">
			<div className="_container py-14">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

					{/* Col 1: Logo + Contact + Social */}
					<div className="lg:col-span-1">
						<div className="mb-7">
							<Logo logoUrl={logoUrl} companyName={companyName} />
						</div>
						<ul className="space-y-3.5 mb-7">
							{primaryAddress && (
								<>
									<li className="flex items-start gap-2.5">
										<Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
										<a
											href={`tel:${config.company.phone.replace(/\s/g, "")}`}
											className="text-sm text-white/65 hover:text-white transition-colors duration-200"
										>
											{config.company.phone}
										</a>
									</li>
									<li className="flex items-start gap-2.5">
										<MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
										<span className="text-sm text-white/65 leading-snug">
											{primaryAddress.street},{" "}
											{primaryAddress.postalCode} {primaryAddress.city}
										</span>
									</li>
								</>
							)}
							<li className="flex items-center gap-2.5">
								<Mail className="h-4 w-4 text-primary shrink-0" />
								<a
									href={`mailto:${config.company.email}`}
									className="text-sm text-white/65 hover:text-white transition-colors duration-200"
								>
									{config.company.email}
								</a>
							</li>
						</ul>

						{/* Follow Us — flat icons */}
						<div>
							<p className="text-sm font-semibold text-white mb-3">
								{t("followUs")}
							</p>
							<div className="flex gap-4 flex-wrap">
								{socialIcons.map(({ Icon, href, label }) => (
									<a
										key={label}
										href={href}
										target={href === "#" ? undefined : "_blank"}
										rel="noopener noreferrer"
										aria-label={label}
										className="text-primary hover:text-primary/75 transition-colors duration-200"
									>
										<Icon className="h-5 w-5" />
									</a>
								))}
							</div>
						</div>
					</div>

					{/* Col 2: Über ZAVD */}
					<div>
						<h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">
							{t("quickLinks")}
						</h4>
						<div className="w-8 h-0.5 bg-primary mb-6" />
						<ul className="space-y-3.5">
							{uberZavdLinks.map((link, i) => (
								<li key={i}>
									<Link href={link.href} className={linkClass}>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Col 3: Angebote & Beratung */}
					<div>
						<h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">
							{t("usefulLinks")}
						</h4>
						<div className="w-8 h-0.5 bg-primary mb-6" />
						<ul className="space-y-3.5">
							{angeboteLinks.map((link, i) => (
								<li key={i}>
									<Link href={link.href} className={linkClass}>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Col 4: Projekte */}
					<div>
						<h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">
							{t("projekte")}
						</h4>
						<div className="w-8 h-0.5 bg-primary mb-6" />
						<ul className="space-y-3.5">
							{projekteLinks.map((link, i) => (
								<li key={i}>
									<Link href={link.href} className={linkClass}>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Col 5: Newsletter — Blessed Church style */}
					<div>
						<h4 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">
							{t("newsletterTitle")}
						</h4>
						<div className="w-8 h-0.5 bg-primary mb-6" />
						<p className="text-sm text-white/65 mb-5 leading-relaxed">
							{t("newsletterDesc")}
						</p>
						{subscribed ? (
							<p className="text-sm text-primary font-medium">✓ Vielen Dank!</p>
						) : (
							<form onSubmit={handleSubscribe} className="space-y-2">
								<div className="flex">
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder={t("emailPlaceholder")}
										required
										className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-white/10 border border-white/15 rounded-l-md text-white placeholder:text-white/35 focus:outline-none focus:border-primary transition-colors"
									/>
									<button
										type="submit"
										className="px-3 py-2.5 bg-primary hover:bg-primary/85 text-white text-sm font-semibold rounded-r-md transition-colors duration-200 shrink-0"
									>
										{t("subscribeButton")}
									</button>
								</div>
								<p className="text-xs text-white/35">{t("privacyNote")}</p>
							</form>
						)}
					</div>
				</div>
			</div>

			{/* Bottom Bar — Blessed Church style */}
			<div>
				<div className="_container py-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
					<p className="text-xs text-white/45">
						<span className="text-white/45">{config.company.name}</span>
					</p>
					<p className="text-xs text-white/45">
						Copyright &copy; {currentYear}. All rights reserved | Designed by <span className="text-primary">DigiGate</span>
					</p>
				</div>
			</div>
		</footer>
	);
}
