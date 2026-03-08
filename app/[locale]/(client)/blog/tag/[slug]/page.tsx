import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import { getArticlesByTag, getAllTags } from "@/lib/data/blog";
import { BlogCard } from "../../_components/blog-card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

/**
 * Blog Tag Archive Page
 *
 * URL: /blog/tag/[slug]/
 * Shows all blog posts with a specific tag
 * Uses ISR for optimal performance.
 */

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Allow new tags to be generated on-demand
export const dynamicParams = true;

/**
 * Generate static params for all tags at build time
 */
export async function generateStaticParams() {
	try {
		const tags = await getAllTags();
		// Convert tag names to slugs
		return tags.map((tag) => ({
			slug: tag
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, ""),
		}));
	} catch (error) {
		console.error("Error generating static params for blog tags:", error);
		return [];
	}
}

interface TagPageProps {
	params: Promise<{
		slug: string;
	}>;
}

function formatTagName(slug: string): string {
	// Convert slug back to readable format
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export async function generateMetadata({
	params,
}: TagPageProps): Promise<Metadata> {
	const { slug } = await params;
	const tagName = formatTagName(slug);
	const [articles, siteConfig] = await Promise.all([
		getArticlesByTag(slug),
		getSiteConfig(),
	]);

	if (articles.length === 0) {
		return {
			title: `Tag not found | ${siteConfig.name}`,
			robots: { index: false, follow: false },
		};
	}

	return {
		title: `${tagName} | Blog | ${siteConfig.name}`,
		description: `Articles tagged with "${tagName}". Tips, guides, and news.`,
		openGraph: {
			title: `${tagName} | Blog | ${siteConfig.name}`,
			description: `Articles tagged with "${tagName}".`,
			url: `${siteConfig.url}/blog/tag/${slug}`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "website",
		},
		alternates: {
			canonical: `${siteConfig.url}/blog/tag/${slug}`,
		},
	};
}

export default async function BlogTagPage({ params }: TagPageProps) {
	const { slug } = await params;
	const tagName = formatTagName(slug);
	const articles = await getArticlesByTag(slug);

	if (articles.length === 0) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
			<div className="_container mx-auto px-4 py-8 padding-top">
				<Breadcrumb
					items={[
						{ label: "Blog", href: "/blog" },
						{ label: tagName },
					]}
				/>

				{/* Page Header */}
				<div className="mb-12">
					<p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
						Tag
					</p>
					<h1 className="mb-4 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
						{tagName}
					</h1>
					<p className="text-lg text-muted-foreground">
						{articles.length} article{articles.length !== 1 ? "s" : ""} with
						this tag
					</p>
				</div>

				{/* Articles Grid */}
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{articles.map((article) => (
						<BlogCard key={article.id} article={article} basePath="/blog" />
					))}
				</div>

				{/* Back Link */}
				<div className="mt-12 text-center">
					<Link
						href="/blog"
						className="text-primary hover:underline"
					>
						← Back to blog
					</Link>
				</div>
			</div>
		</div>
	);
}
