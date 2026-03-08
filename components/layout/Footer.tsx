"use client";

import Link from "next/link";
import Image from "next/image";
import {
	Facebook,
	Linkedin,
	Instagram,
	Mail,
	MapPin,
	Phone,
	Twitter,
	Youtube,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Logo from "../common/logo";
import type { SiteConfigType } from "@/config/site";
import type { IFooterSettings, IFooterLink, IFooterBanner } from "@/models/site-settings.model";

// Default footer banner settings
const DEFAULT_BANNER: IFooterBanner = {
	enabled: true,
	badge: "DAIRY FARM",
	title: "We make the creative solutions for modern brands.",
	ctaText: "About Us",
	ctaHref: "/about",
};

// Default footer settings
const DEFAULT_FOOTER_SETTINGS: IFooterSettings = {
	banner: DEFAULT_BANNER,
	quickLinksTitle: "Links",
	contactTitle: "Office",
	newsletterTitle: "Stay Updated",
	quickLinks: [
		{ label: "About Us", href: "/about" },
		{ label: "Products", href: "/store" },
		{ label: "Farm Tours", href: "/tours" },
		{ label: "Articles", href: "/articles" },
		{ label: "Contact", href: "/contact" },
	],
	newsletterDescription:
		"Subscribe to get updates on new products and farm news.",
	newsletterPlaceholder: "Your email address",
	newsletterButtonText: "Subscribe",
	bottomLinks: [
		{ label: "Privacy Policy", href: "/integritetspolicy" },
		{ label: "Legal Information", href: "/juridisk-information" },
		{ label: "Sitemap", href: "/sitemap.xml" },
	],
};

interface FooterProps {
	config: SiteConfigType;
	footerSettings?: IFooterSettings;
	logoUrl?: string;
	companyName?: string;
}

export function Footer({
	config,
	footerSettings,
	logoUrl,
	companyName,
}: FooterProps) {
	const t = useTranslations("footer");
	const currentYear = new Date().getFullYear();
	const primaryAddress = config.company.addresses[0];

	// Merge provided settings with defaults
	const banner = {
		enabled: footerSettings?.banner?.enabled ?? DEFAULT_BANNER.enabled,
		backgroundImage: footerSettings?.banner?.backgroundImage || DEFAULT_BANNER.backgroundImage,
		badge: footerSettings?.banner?.badge || DEFAULT_BANNER.badge,
		title: footerSettings?.banner?.title || DEFAULT_BANNER.title,
		ctaText: footerSettings?.banner?.ctaText || DEFAULT_BANNER.ctaText,
		ctaHref: footerSettings?.banner?.ctaHref || DEFAULT_BANNER.ctaHref,
	};

	const settings = {
		quickLinksTitle:
			footerSettings?.quickLinksTitle || DEFAULT_FOOTER_SETTINGS.quickLinksTitle,
		contactTitle:
			footerSettings?.contactTitle || DEFAULT_FOOTER_SETTINGS.contactTitle,
		newsletterTitle:
			footerSettings?.newsletterTitle || DEFAULT_FOOTER_SETTINGS.newsletterTitle,
		quickLinks:
			footerSettings?.quickLinks?.length
				? footerSettings.quickLinks
				: DEFAULT_FOOTER_SETTINGS.quickLinks,
		newsletterDescription:
			footerSettings?.newsletterDescription ||
			DEFAULT_FOOTER_SETTINGS.newsletterDescription,
		newsletterPlaceholder:
			footerSettings?.newsletterPlaceholder ||
			DEFAULT_FOOTER_SETTINGS.newsletterPlaceholder,
		newsletterButtonText:
			footerSettings?.newsletterButtonText ||
			DEFAULT_FOOTER_SETTINGS.newsletterButtonText,
		bottomLinks:
			footerSettings?.bottomLinks?.length
				? footerSettings.bottomLinks
				: DEFAULT_FOOTER_SETTINGS.bottomLinks,
	};

	// Social media icons mapping
	const socialIcons = [
		{ Icon: Facebook, href: config.links.facebook, label: "Facebook" },
		{ Icon: Instagram, href: config.links.instagram, label: "Instagram" },
		{ Icon: Linkedin, href: config.links.linkedin, label: "LinkedIn" },
		{ Icon: Twitter, href: config.links.twitter, label: "Twitter" },
		{ Icon: Youtube, href: config.links.youtube, label: "YouTube" },
	].filter(item => item.href);

	const renderLink = (link: IFooterLink) => {
		if (link.isExternal) {
			return (
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-primary transition-colors"
				>
					{link.label}
				</a>
			);
		}
		return (
			<Link href={link.href} className="hover:text-primary transition-colors">
				{link.label}
			</Link>
		);
	};

	return (
		<>
			{/* Pre-Footer Banner Section with Image Fade */}
			{banner.enabled && (
				<section className="relative h-[400px] md:h-[500px] overflow-hidden">
					{/* Background Image */}
					{banner.backgroundImage ? (
						<Image
							src={banner.backgroundImage}
							alt="Footer banner"
							fill
							className="object-cover"
							priority={false}
						/>
					) : (
						<div className="absolute inset-0 bg-gradient-to-b from-[#FDF9EF] to-[#E8A641]/30" />
					)}

					{/* Gradient Overlay - Fade to footer color */}
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-secondary" />
					<div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-transparent" style={{ top: '40%' }} />

					{/* Content */}
					<div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
						{/* Badge */}
						{banner.badge && (
							<span className="inline-block px-4 py-1.5 bg-white/90 text-secondary text-xs font-medium tracking-[0.2em] uppercase rounded-full mb-6">
								{banner.badge}
							</span>
						)}

						{/* Title */}
						{banner.title && (
							<h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-medium text-white max-w-3xl mb-8 leading-tight drop-shadow-lg">
								{banner.title}
							</h2>
						)}

						{/* CTA Button */}
						{banner.ctaText && banner.ctaHref && (
							<Link href={banner.ctaHref}>
								<Button
									variant="outline"
									className="bg-white/90 hover:bg-white text-secondary border-white/50 hover:border-white px-8 py-6 text-sm font-semibold tracking-wide"
								>
									{banner.ctaText}
								</Button>
							</Link>
						)}
					</div>
				</section>
			)}

			{/* Main Footer */}
			<footer className="bg-secondary text-primary-foreground pt-16 pb-24 md:pb-8">
				<div className="_container">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
						{/* Brand Column */}
						<div className="space-y-4">
							<div className="flex items-center gap-2 mb-4">
								<Logo logoUrl={logoUrl} companyName={companyName} />
							</div>
							<p className="text-primary-foreground/70 text-sm leading-relaxed">
								{config.description}
							</p>
						</div>

						{/* Office/Contact Info */}
						<div>
							<h4 className="font-bold text-lg mb-6">{settings.contactTitle}</h4>
							<ul className="space-y-4 text-sm text-primary-foreground/70">
								{primaryAddress && (
									<li className="flex items-start gap-3">
										<MapPin className="h-5 w-5 text-primary shrink-0" />
										<span>
											{primaryAddress.street}
											<br />
											{primaryAddress.postalCode} {primaryAddress.city}
										</span>
									</li>
								)}
								<li className="flex items-center gap-3">
									<Mail className="h-5 w-5 text-primary shrink-0" />
									<a
										href={`mailto:${config.company.email}`}
										className="hover:text-primary transition-colors"
									>
										{config.company.email}
									</a>
								</li>
								<li className="flex items-center gap-3">
									<Phone className="h-5 w-5 text-primary shrink-0" />
									<a
										href={`tel:${config.company.phone.replace(/\s/g, "")}`}
										className="hover:text-primary transition-colors"
									>
										{config.company.phone}
									</a>
								</li>
							</ul>
						</div>

						{/* Quick Links */}
						<div>
							<h4 className="font-bold text-lg mb-6">{settings.quickLinksTitle}</h4>
							<ul className="space-y-3 text-sm text-primary-foreground/70">
								{settings.quickLinks.map((item, index) => (
									<li key={`${item.href}-${index}`}>{renderLink(item)}</li>
								))}
							</ul>
						</div>

						{/* Social Media */}
						<div>
							<h4 className="font-bold text-lg mb-6">{t("followUs")}</h4>
							<div className="flex gap-3 flex-wrap">
								{socialIcons.map(({ Icon, href, label }) => (
									<a
										key={label}
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={label}
										className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
									>
										<Icon className="h-5 w-5" />
									</a>
								))}
							</div>
						</div>
					</div>

					<div className="h-px w-full bg-white/10 my-8" />

					<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
						<p>
							&copy; {currentYear} {config.company.name}. {t("copyright")}
						</p>
						<div className="flex gap-6">
							{settings.bottomLinks.map((link, index) => (
								<Link
									key={`${link.href}-${index}`}
									href={link.href}
									className="hover:text-white"
									{...(link.isExternal && {
										target: "_blank",
										rel: "noopener noreferrer",
									})}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
