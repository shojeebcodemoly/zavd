import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	getArticleBySlug,
	getRelatedArticles,
	getAllArticles,
} from "@/lib/data/blog";
import { blogPostService } from "@/lib/services/blog-post.service";
import { getSiteConfig } from "@/config/site";
import { BlogDetailHero } from "../_components/blog-detail-hero";
import { BlogContent } from "../_components/blog-content";
import { BlogAuthor } from "../_components/blog-author";
import { RelatedPosts } from "../_components/related-posts";
import { BlogComments } from "../_components/blog-comments";

/**
 * Blog Detail Page
 *
 * Dynamic route for individual blog posts.
 * Uses ISR for optimal performance with fresh content.
 */

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Allow new posts to be generated on-demand
export const dynamicParams = true;

/**
 * Generate static params for all published blog posts at build time
 */
export async function generateStaticParams() {
	try {
		const result = await blogPostService.getPublishedPosts({
			limit: 1000,
			sort: "-publishedAt",
		});
		return result.data.map((post) => ({ slug: post.slug }));
	} catch (error) {
		console.error("Error generating static params for blog posts:", error);
		return [];
	}
}

interface BlogDetailPageProps {
	params: Promise<{
		slug: string;
	}>;
}

// Generate metadata for SEO
export async function generateMetadata({
	params,
}: BlogDetailPageProps): Promise<Metadata> {
	const { slug } = await params;
	const [article, siteConfig] = await Promise.all([
		getArticleBySlug(slug),
		getSiteConfig(),
	]);

	if (!article) {
		return {
			title: `Article not found | ${siteConfig.name}`,
		};
	}

	const ogImage = article.seo?.ogImage || article.featuredImage?.url;

	return {
		title: article.seo?.title || `${article.title} | ${siteConfig.name}`,
		description: article.seo?.description || article.excerpt,
		keywords: article.seo?.keywords || article.tags,
		openGraph: {
			title: article.seo?.title || article.title,
			description: article.seo?.description || article.excerpt,
			url: `${siteConfig.url}/blog/${article.slug}`,
			siteName: siteConfig.name,
			images: ogImage
				? [
						{
							url: ogImage.startsWith("http")
								? ogImage
								: `${siteConfig.url}${ogImage}`,
							width: 1200,
							height: 630,
							alt: article.title,
						},
				  ]
				: [],
			locale: "sv_SE",
			type: "article",
			publishedTime: article.publishedAt,
			modifiedTime: article.updatedAt,
			authors: [article.author.name],
			tags: article.tags,
		},
		twitter: {
			card: "summary_large_image",
			title: article.seo?.title || article.title,
			description: article.seo?.description || article.excerpt,
			images: ogImage
				? [
						ogImage.startsWith("http")
							? ogImage
							: `${siteConfig.url}${ogImage}`,
				  ]
				: [],
		},
		alternates: {
			canonical: `${siteConfig.url}/blog/${article.slug}`,
		},
	};
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
	const { slug } = await params;
	const [article, siteConfig] = await Promise.all([
		getArticleBySlug(slug),
		getSiteConfig(),
	]);

	if (!article) {
		notFound();
	}

	// Get related articles (same category, excluding current)
	const relatedArticles = await getRelatedArticles(article.id, 4);
	// Fallback to all articles if no related found
	const displayRelated =
		relatedArticles.length > 0 ? relatedArticles : await getAllArticles();

	return (
		<>
			{/* Structured Data - Article */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "BlogPosting",
						headline: article.title,
						description: article.excerpt,
						image: article.featuredImage?.url
							? `${siteConfig.url}${article.featuredImage.url}`
							: undefined,
						datePublished: article.publishedAt,
						dateModified: article.updatedAt,
						author: {
							"@type": "Person",
							name: article.author.name,
							jobTitle: article.author.role,
						},
						publisher: {
							"@type": "Organization",
							name: siteConfig.name,
							url: siteConfig.url,
							logo: {
								"@type": "ImageObject",
								url: `${siteConfig.url}/logo.png`,
							},
						},
						mainEntityOfPage: {
							"@type": "WebPage",
							"@id": `${siteConfig.url}/blog/${article.slug}`,
						},
						keywords: article.tags?.join(", "),
					}),
				}}
			/>

			<BlogDetailHero article={article} />

			<section className="py-16 _container">
				<BlogContent article={article} />
			</section>

			<section className="py-16">
				<div className="_container">
					<BlogAuthor author={article.author} />
				</div>
			</section>

			<BlogComments postId={article.id} />

			<RelatedPosts
				articles={displayRelated}
				currentArticleId={article.id}
				basePath="/blog"
				locale="en"
			/>
		</>
	);
}
