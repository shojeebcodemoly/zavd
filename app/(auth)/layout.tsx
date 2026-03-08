import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSiteConfig } from "@/config/site";
import {
	getBrandingSettings,
	getFooterSettings,
} from "@/lib/services/site-settings.service";

// Force dynamic rendering for auth pages
export const dynamic = "force-dynamic";

/**
 * Auth Layout - Login/Register pages with Navbar and Footer
 * Wrapped with NextIntlClientProvider for translation support
 */
export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [siteConfig, brandingSettings, footerSettings, messages] = await Promise.all([
		getSiteConfig(),
		getBrandingSettings(),
		getFooterSettings(),
		getMessages({ locale: "en" }),
	]);

	const logoUrl = brandingSettings?.logoUrl || undefined;

	return (
		<NextIntlClientProvider locale="en" messages={messages}>
			<div className="flex flex-col min-h-screen">
				<Navbar config={siteConfig} logoUrl={logoUrl} />
				<main className="flex-1 w-full">{children}</main>
				<Footer
					config={siteConfig}
					logoUrl={logoUrl}
					footerSettings={footerSettings}
				/>
			</div>
		</NextIntlClientProvider>
	);
}
