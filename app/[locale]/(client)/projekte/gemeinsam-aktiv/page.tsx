import { getGemeinsamAktivPage } from "@/lib/services/gemeinsam-aktiv-page.service";
import { getSiteSettings } from "@/lib/services/site-settings.service";
import { blogPostService } from "@/lib/services/blog-post.service";
import { ProjectHero } from "@/components/shared/ProjectHero";
import { ProjectGallery } from "@/components/shared/ProjectGallery";
import { ProjectContentSection } from "@/components/shared/ProjectContentSection";
import { ProjectPartnersCarousel } from "@/components/shared/ProjectPartnersCarousel";

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function GemeinsamAktivPage({ params }: Props) {
	const { locale } = await params;

	const [page, siteSettings, latestPosts] = await Promise.all([
		getGemeinsamAktivPage(),
		getSiteSettings(),
		blogPostService.getPublishedPosts({ page: 1, limit: 3 }),
	]);

	const isEn = locale === "en";
	const heroTitle = isEn
		? (page.hero.titleEn || "Active Together")
		: (page.hero.titleDe || "Gemeinsam Aktiv");

	const pressItems = (latestPosts.data ?? []).map((p) => ({
		title: p.title,
		slug: p.slug,
		publishedAt: p.publishedAt ?? p.createdAt,
	}));

	return (
		<div className="flex flex-col min-h-screen">
			<ProjectHero
				data={{ ...page.hero, title: heroTitle }}
				defaultTitle={isEn ? "Active Together" : "Gemeinsam Aktiv"}
				defaultBreadcrumb="Gemeinsam Aktiv"
			/>
			<ProjectGallery
				title={isEn ? (page.gallery?.titleEn || page.gallery?.titleDe) : (page.gallery?.titleDe || page.gallery?.titleEn)}
				subtitle={isEn ? (page.gallery?.subtitleEn || page.gallery?.subtitleDe) : (page.gallery?.subtitleDe || page.gallery?.subtitleEn)}
				images={page.gallery?.images ?? []}
			/>
			<ProjectContentSection
				title={isEn ? (page.content?.titleEn || page.content?.titleDe) : (page.content?.titleDe || page.content?.titleEn)}
				body={isEn ? (page.content?.bodyEn || page.content?.bodyDe) : (page.content?.bodyDe || page.content?.bodyEn)}
				image={page.content?.image}
				blocks={(page.content?.blocks ?? []).map((b) => ({
					heading: isEn ? (b.headingEn || b.headingDe) : (b.headingDe || b.headingEn),
					body: isEn ? (b.bodyEn || b.bodyDe) : (b.bodyDe || b.bodyEn),
				}))}
				pressItems={pressItems}
				phone={siteSettings.phone}
				email={siteSettings.email}
				contactBackground={siteSettings.contactBackground}
				donationWidget={siteSettings.donationWidget}
				socialMedia={siteSettings.socialMedia}
			/>
			<ProjectPartnersCarousel
				heading={isEn ? (page.partners?.headingEn || page.partners?.headingDe) : (page.partners?.headingDe || page.partners?.headingEn)}
				logos={page.partners?.logos ?? []}
			/>
		</div>
	);
}
