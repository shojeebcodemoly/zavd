import { getEhrenamtEngagementPage } from "@/lib/services/ehrenamt-engagement-page.service";
import { ProjectHero } from "@/components/shared/ProjectHero";

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function EhrenamtEngagementPage({ params }: Props) {
	const { locale } = await params;

	const page = await getEhrenamtEngagementPage();

	const isEn = locale === "en";
	const heroTitle = isEn
		? (page.hero.titleEn || "Volunteering")
		: (page.hero.titleDe || "Ehrenamt & Engagement");

	return (
		<div className="flex flex-col min-h-screen">
			<ProjectHero
				data={{ ...page.hero, title: heroTitle }}
				defaultTitle={isEn ? "Volunteering" : "Ehrenamt & Engagement"}
				defaultBreadcrumb="Ehrenamt & Engagement"
			/>
		</div>
	);
}
