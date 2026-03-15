import { getBrandingSettings, getComingSoonSettings } from "@/lib/services/site-settings.service";
import { getSiteConfig } from "@/config/site";
import { ComingSoonClient } from "./_components/coming-soon-client";

export const dynamic = "force-dynamic";

export default async function ComingSoonPage() {
	const [branding, config, comingSoon] = await Promise.all([
		getBrandingSettings(),
		getSiteConfig(),
		getComingSoonSettings(),
	]);

	return (
		<ComingSoonClient
			logoUrl={(!branding?.logoUrl || branding.logoUrl === "/storage/zavd-logo-beige-glow.svg" || branding.logoUrl === "/storage/logo.svg") ? "/storage/zavd-logo-mobile-2000x485.png" : branding.logoUrl}
			siteName={config.name}
			socialLinks={{
				twitter: config.links.twitter || null,
				facebook: config.links.facebook || null,
				linkedin: config.links.linkedin || null,
			}}
			heading={comingSoon.heading}
			description={comingSoon.description}
			newsletterTitle={comingSoon.newsletterTitle}
			newsletterDescription={comingSoon.newsletterDescription}
			emailPlaceholder={comingSoon.emailPlaceholder}
			buttonText={comingSoon.buttonText}
			designedBy={comingSoon.designedBy}
		/>
	);
}
