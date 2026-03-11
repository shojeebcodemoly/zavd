import { StickyHeader } from "@/components/layout/StickyHeader";
import { Navbar } from "@/components/layout/Navbar";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CallbackPopup } from "@/components/callback/CallbackPopup";
import { CookieConsent } from "@/components/cookie/CookieConsent";
import { CookieConsentProvider } from "@/lib/context/cookie-consent-context";
import { NavbarVariantProvider } from "@/lib/context/navbar-variant-context";
import { setRequestLocale } from "next-intl/server";
import {
	getLegacySiteConfig,
	getBrandingSettings,
	getFooterSettings,
	getSocialMedia,
	getSiteSettings,
} from "@/lib/services/site-settings.service";

/**
 * Client Layout - Public pages with Navbar and Footer
 * This wraps all public-facing pages
 * Now fetches dynamic settings from database
 * NextIntlClientProvider is already provided by parent [locale]/layout.tsx
 */
export default async function ClientLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	// Fetch site settings from database in parallel
	const [siteConfig, brandingSettings, footerSettings, socialMedia, siteSettings] = await Promise.all([
		getLegacySiteConfig(),
		getBrandingSettings(),
		getFooterSettings(),
		getSocialMedia(),
		getSiteSettings(),
	]);

	const logoUrl = brandingSettings?.logoUrl;
	const companyName = siteSettings?.companyName || "ZAVD";

	return (
		<CookieConsentProvider>
			<NavbarVariantProvider>
				<div className="flex flex-col min-h-screen">
					<StickyHeader>
						<TopBar
							facebookUrl={socialMedia?.facebook}
							youtubeUrl={socialMedia?.youtube}
						/>
						<Navbar config={siteConfig} logoUrl={logoUrl} companyName={companyName} socialMedia={socialMedia} />
					</StickyHeader>
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
