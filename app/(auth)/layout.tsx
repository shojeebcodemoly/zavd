import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { NavbarVariantProvider } from "@/lib/context/navbar-variant-context";
import { getSiteConfig } from "@/config/site";
import {
	getBrandingSettings,
	getFooterSettings,
	getSocialMedia,
} from "@/lib/services/site-settings.service";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

// Force dynamic rendering for auth pages
export const dynamic = "force-dynamic";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Read locale from cookie (set by middleware or LanguageSwitcher)
	const cookieStore = await cookies();
	const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined;
	const locale: Locale =
		cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;

	const [siteConfig, brandingSettings, footerSettings, socialMedia, messages] = await Promise.all([
		getSiteConfig(),
		getBrandingSettings(),
		getFooterSettings(),
		getSocialMedia(),
		getMessages({ locale }),
	]);

	const logoUrl = brandingSettings?.logoUrl || undefined;

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<NavbarVariantProvider>
				<div className="flex flex-col min-h-screen">
					<TopBar
						facebookUrl={socialMedia?.facebook}
						youtubeUrl={socialMedia?.youtube}
					/>
					<Navbar config={siteConfig} logoUrl={logoUrl} />
					<main className="flex-1 w-full">{children}</main>
					<Footer
						config={siteConfig}
						logoUrl={logoUrl}
						footerSettings={footerSettings}
					/>
				</div>
			</NavbarVariantProvider>
		</NextIntlClientProvider>
	);
}
