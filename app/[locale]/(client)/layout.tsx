import { Navbar } from "@/components/layout/Navbar";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CallbackPopup } from "@/components/callback/CallbackPopup";
import { CookieConsent } from "@/components/cookie/CookieConsent";
import { CookieConsentProvider } from "@/lib/context/cookie-consent-context";
import { NavbarVariantProvider } from "@/lib/context/navbar-variant-context";
import { ScrollHideEffect } from "@/components/layout/ScrollHideEffect";
import { setRequestLocale } from "next-intl/server";
import {
	getLegacySiteConfig,
	getBrandingSettings,
	getFooterSettings,
	getSocialMedia,
	getSiteSettings,
} from "@/lib/services/site-settings.service";

export default async function ClientLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	const [siteConfig, brandingSettings, footerSettings, socialMedia, siteSettings] = await Promise.all([
		getLegacySiteConfig(),
		getBrandingSettings(),
		getFooterSettings(),
		getSocialMedia(),
		getSiteSettings(),
	]);

	const logoUrl = "/storage/zavd-logo-mobile-2000x485.png";
	const companyName = siteSettings?.companyName || "ZAVD";

	return (
		<CookieConsentProvider>
			<NavbarVariantProvider>
				<div className="flex flex-col min-h-screen">
					<div
						id="sticky-header"
						className="fixed top-0 left-0 z-50 w-full transition-transform duration-300"
					>
						<TopBar
							facebookUrl={socialMedia?.facebook}
							youtubeUrl={socialMedia?.youtube}
						/>
						<Navbar config={siteConfig} logoUrl={logoUrl} companyName={companyName} socialMedia={socialMedia} />
					</div>
					<ScrollHideEffect />
					<main className="flex-1 w-full">{children}</main>
					<Footer
						config={siteConfig}
						footerSettings={footerSettings}
						logoUrl={logoUrl}
						companyName={companyName}
					/>
					<MobileBottomNav />
					<CallbackPopup />
					<CookieConsent />
				</div>
			</NavbarVariantProvider>
		</CookieConsentProvider>
	);
}
