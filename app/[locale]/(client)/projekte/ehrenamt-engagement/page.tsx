import { getEhrenamtEngagementPage } from "@/lib/services/ehrenamt-engagement-page.service";
import { getSiteSettings } from "@/lib/services/site-settings.service";
import { blogPostService } from "@/lib/services/blog-post.service";
import { ProjectHero } from "@/components/shared/ProjectHero";
import { ProjectGallery } from "@/components/shared/ProjectGallery";
import { ProjectContentSection } from "@/components/shared/ProjectContentSection";
import { ProjectPartnersCarousel } from "@/components/shared/ProjectPartnersCarousel";

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function EhrenamtEngagementPage({ params }: Props) {
	const { locale } = await params;

	const [page, siteSettings, latestPosts] = await Promise.all([
		getEhrenamtEngagementPage(),
		getSiteSettings(),
		blogPostService.getPublishedPosts({ page: 1, limit: 3 }),
	]);

	const isEn = locale === "en";
	const heroTitle = isEn
		? (page.hero.titleEn || "Volunteering")
		: (page.hero.titleDe || "Ehrenamt & Engagement");

	const pressItems = (latestPosts.data ?? []).map((p) => ({
		title: p.title,
		slug: p.slug,
		publishedAt: p.publishedAt ?? p.createdAt,
	}));

	const galleryTitle = isEn
		? (page.gallery?.titleEn || page.gallery?.titleDe)
		: (page.gallery?.titleDe || page.gallery?.titleEn);
	const gallerySubtitle = isEn
		? (page.gallery?.subtitleEn || page.gallery?.subtitleDe)
		: (page.gallery?.subtitleDe || page.gallery?.subtitleEn);
	const contentTitle = isEn
		? (page.content?.titleEn || page.content?.titleDe)
		: (page.content?.titleDe || page.content?.titleEn);
	const contentBody = isEn
		? (page.content?.bodyEn || page.content?.bodyDe)
		: (page.content?.bodyDe || page.content?.bodyEn);
	const partnersHeading = isEn
		? (page.partners?.headingEn || page.partners?.headingDe)
		: (page.partners?.headingDe || page.partners?.headingEn);
	const contentBlocks = (page.content?.blocks ?? []).map((b) => ({
		heading: isEn ? (b.headingEn || b.headingDe) : (b.headingDe || b.headingEn),
		body: isEn ? (b.bodyEn || b.bodyDe) : (b.bodyDe || b.bodyEn),
	}));

	return (
		<div className="flex flex-col min-h-screen">
			<ProjectHero
				data={{ ...page.hero, title: heroTitle }}
				defaultTitle={isEn ? "Volunteering" : "Ehrenamt & Engagement"}
				defaultBreadcrumb="Ehrenamt & Engagement"
			/>
			<ProjectGallery
				title={galleryTitle}
				subtitle={gallerySubtitle}
				images={page.gallery?.images ?? []}
			/>
			<ProjectContentSection
				title={contentTitle}
				body={contentBody}
				image={page.content?.image}
				blocks={contentBlocks}
				pressItems={pressItems}
				phone={siteSettings.phone}
				email={siteSettings.email}
				contactBackground={siteSettings.contactBackground}
				donationWidget={siteSettings.donationWidget}
				socialMedia={siteSettings.socialMedia}
			/>
			<ProjectPartnersCarousel
				heading={partnersHeading}
				logos={page.partners?.logos ?? []}
			/>
		</div>
	);
}
