import { getGutReinkommenPage } from "@/lib/services/gut-reinkommen-page.service";
import { getSiteSettings } from "@/lib/services/site-settings.service";
import { blogPostService } from "@/lib/services/blog-post.service";
import { ProjectHero } from "@/components/shared/ProjectHero";
import { ProjectContentSection } from "@/components/shared/ProjectContentSection";
import { ProjectGallery } from "@/components/shared/ProjectGallery";
import { ProjectPartnersCarousel } from "@/components/shared/ProjectPartnersCarousel";

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function GutReinkommenPage({ params }: Props) {
	const { locale } = await params;

	const [page, siteSettings, latestPosts] = await Promise.all([
		getGutReinkommenPage(),
		getSiteSettings(),
		blogPostService.getPublishedPosts({ page: 1, limit: 3 }),
	]);

	const isEn = locale === "en";
	const heroTitle = isEn
		? (page.hero.titleEn || "Successful Integration")
		: (page.hero.titleDe || "Gut Reinkommen");

	const pressItems = (latestPosts.data ?? []).map((p) => ({
		title: p.title,
		slug: p.slug,
		publishedAt: p.publishedAt ?? p.createdAt,
	}));

	return (
		<div className="flex flex-col min-h-screen">
			<ProjectHero
				data={{ ...page.hero, title: heroTitle }}
				defaultTitle={isEn ? "Successful Integration" : "Gut Reinkommen"}
				defaultBreadcrumb="Gut Reinkommen"
			/>
			<ProjectGallery
				title={page.gallery?.title}
				subtitle={page.gallery?.subtitle}
				images={page.gallery?.images ?? []}
			/>
			<ProjectContentSection
				title={page.content?.title}
				body={page.content?.body}
				image={page.content?.image}
				blocks={page.content?.blocks ?? []}
				pressItems={pressItems}
				phone={siteSettings.phone}
				email={siteSettings.email}
				contactBackground={siteSettings.contactBackground}
				donationWidget={siteSettings.donationWidget}
				socialMedia={siteSettings.socialMedia}
			/>
			<ProjectPartnersCarousel
				heading={page.partners?.heading}
				logos={page.partners?.logos ?? []}
			/>
		</div>
	);
}
