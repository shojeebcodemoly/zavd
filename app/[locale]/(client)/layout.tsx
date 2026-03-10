import { Navbar } from "@/components/layout/Navbar";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CallbackPopup } from "@/components/callback/CallbackPopup";
import { CookieConsent } from "@/components/cookie/CookieConsent";
import { CookieConsentProvider } from "@/lib/context/cookie-consent-context";
import { NavbarVariantProvider } from "@/lib/context/navbar-variant-context";
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
}: {
	children: React.ReactNode;
}) {
	// Fetch site settings from database in parallel
	const [siteConfig, brandingSettings, footerSettings, socialMedia, siteSettings] = await Promise.all([
		getLegacySiteConfig(),
		getBrandingSettings(),
		getFooterSettings(),
		getSocialMedia(),
		getSiteSettings(),
	]);

	const logoUrl = brandingSettings?.logoUrl;
	const companyName = siteSettings?.companyName || "Milatte Dairy Farms";

	return (
		<CookieConsentProvider>
			<NavbarVariantProvider>
				<div className="flex flex-col min-h-screen">
					{/* Fixed header: TopBar (top-0) + Navbar (top-10) */}
					<div className="fixed top-0 left-0 z-50 w-full">
						<TopBar
							facebookUrl={socialMedia?.facebook}
							youtubeUrl={socialMedia?.youtube}
						/>
						<Navbar config={siteConfig} logoUrl={logoUrl} companyName={companyName} socialMedia={socialMedia} />
					</div>
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
