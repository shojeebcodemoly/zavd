import { getBrandingSettings, getComingSoonSettings } from "@/lib/services/site-settings.service";
import { getSiteConfig } from "@/config/site";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ComingSoonClient } from "./_components/coming-soon-client";

export const dynamic = "force-dynamic";

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function ComingSoonPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("comingSoon");

	const [branding, config, comingSoon] = await Promise.all([
		getBrandingSettings(),
		getSiteConfig(),
		getComingSoonSettings(),
	]);

	return (
		<ComingSoonClient
			logoUrl={
				!branding?.logoUrl ||
				branding.logoUrl === "/storage/zavd-logo-beige-glow.svg" ||
				branding.logoUrl === "/storage/logo.svg"
					? "/storage/zavd-logo-mobile-2000x485.png"
					: branding.logoUrl
			}
			siteName={config.name}
			socialLinks={{
				twitter: config.links.twitter || null,
				facebook: config.links.facebook || null,
				linkedin: config.links.linkedin || null,
			}}
			heading={comingSoon.heading || t("heading")}
			description={comingSoon.description || t("description")}
			newsletterTitle={comingSoon.newsletterTitle || t("newsletterTitle")}
			newsletterDescription={comingSoon.newsletterDescription || t("newsletterDescription")}
			emailPlaceholder={comingSoon.emailPlaceholder || t("emailPlaceholder")}
			buttonText={comingSoon.buttonText || t("buttonText")}
			designedBy={comingSoon.designedBy || t("designedBy")}
			translations={{
				thankYou: t("thankYou"),
				errorMessage: t("errorMessage"),
				loginButton: t("loginButton"),
			}}
		/>
	);
}
