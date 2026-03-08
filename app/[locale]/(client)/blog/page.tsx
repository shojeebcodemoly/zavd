import { Metadata } from "next";
import {
	getAllArticles,
	getAllCategories,
	getRecentArticles,
} from "@/lib/data/blog";
import { getSiteConfig } from "@/config/site";
import { BlogListingClient } from "./_components/blog-listing-client";

/**
 * Blog Listing Page
 *
 * Displays all blog articles with filtering and search capabilities.
 * Now fetches from database instead of static data.
 */

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
	const siteConfig = await getSiteConfig();

	return {
		title: `Blog | ${siteConfig.name}`,
		description:
			"Read our latest articles about cheese making, dairy farming, and the tradition behind our artisan cheese products.",
		keywords: [
			"blog",
			"articles",
			"cheese",
			"dairy",
			"artisan",
			"cheese making",
			"tradition",
		],
		openGraph: {
			title: `Blog | ${siteConfig.name}`,
			description:
				"Read our latest articles about cheese making, dairy farming, and the tradition behind our artisan cheese products.",
			url: `${siteConfig.url}/blog`,
			siteName: siteConfig.name,
			images: [
				{
					url: `${siteConfig.url}/images/og/blog.jpg`,
					width: 1200,
					height: 630,
					alt: `${siteConfig.name} Blog`,
				},
			],
			locale: "sv_SE",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: `Blog | ${siteConfig.name}`,
			description:
				"Read our latest articles about cheese making, dairy farming, and the tradition behind our artisan cheese products.",
			images: [`${siteConfig.url}/images/og/blog.jpg`],
		},
		alternates: {
			canonical: `${siteConfig.url}/blog`,
		},
	};
}

export default async function BlogPage() {
	const [articles, categories, recentArticles, siteConfig] = await Promise.all(
		[getAllArticles(), getAllCategories(), getRecentArticles(5), getSiteConfig()]
	);

	return (
		<>
			{/* Structured Data - Blog */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Blog",
						name: `${siteConfig.name} Blog`,
						description:
							"Articles about cheese making, dairy farming, and artisan cheese products.",
						url: `${siteConfig.url}/blog`,
						publisher: {
							"@type": "Organization",
							name: siteConfig.name,
							url: siteConfig.url,
							logo: {
								"@type": "ImageObject",
								url: `${siteConfig.url}/logo.png`,
							},
						},
						blogPost: articles.slice(0, 10).map((article) => ({
							"@type": "BlogPosting",
							headline: article.title,
							description: article.excerpt,
							url: `${siteConfig.url}/blog/${article.slug}`,
							datePublished: article.publishedAt,
							dateModified: article.updatedAt,
							author: {
								"@type": "Person",
								name: article.author.name,
							},
							image: article.featuredImage?.url
								? `${siteConfig.url}${article.featuredImage.url}`
								: undefined,
						})),
					}),
				}}
			/>

			<BlogListingClient
				articles={articles}
				categories={categories}
				recentArticles={recentArticles}
				basePath="/blog"
				pageTitle="Blog"
				locale="en"
			/>
		</>
	);
}
