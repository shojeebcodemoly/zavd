import { getPatenschaftsprojektPage } from "@/lib/services/patenschaftsprojekt-page.service";
import { getSiteSettings } from "@/lib/services/site-settings.service";
import { blogPostService } from "@/lib/services/blog-post.service";
import { ProjectHero } from "@/components/shared/ProjectHero";
import { ProjectContentSection } from "@/components/shared/ProjectContentSection";
import { ProjectGallery } from "@/components/shared/ProjectGallery";
import { ProjectPartnersCarousel } from "@/components/shared/ProjectPartnersCarousel";

export default async function PatenschaftsprojektPage() {
	const [page, siteSettings, latestPosts] = await Promise.all([
		getPatenschaftsprojektPage(),
		getSiteSettings(),
		blogPostService.getPublishedPosts({ page: 1, limit: 3 }),
	]);

	const pressItems = (latestPosts.data ?? []).map((p) => ({
		title: p.title,
		slug: p.slug,
		publishedAt: p.publishedAt ?? p.createdAt,
	}));

	return (
		<div className="flex flex-col min-h-screen">
			<ProjectHero
				data={page.hero}
				defaultTitle="Patenschaftsprojekt"
				defaultBreadcrumb="Patenschaftsprojekt"
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
