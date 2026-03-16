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

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	const siteConfig = await getSiteConfig();

	return {
		title: `Blog | ${siteConfig.name}`,
		description:
			"Read our latest articles about ZAVD community initiatives, Assyrian culture, and news from our organization.",
		keywords: [
			"blog",
			"articles",
			"ZAVD",
			"Assyrian community",
			"NGO",
			"community news",
			"Germany",
		],
		openGraph: {
			title: `Blog | ${siteConfig.name}`,
			description:
				"Read our latest articles about ZAVD community initiatives, Assyrian culture, and news from our organization.",
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
				"Read our latest articles about ZAVD community initiatives, Assyrian culture, and news from our organization.",
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
							"Articles about ZAVD community initiatives, Assyrian culture, and organization news.",
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
