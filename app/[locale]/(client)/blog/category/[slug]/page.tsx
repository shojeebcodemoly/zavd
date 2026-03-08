import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteConfig } from "@/config/site";
import { getArticlesByCategory } from "@/lib/data/blog";
import { blogCategoryService } from "@/lib/services/blog-category.service";
import { BlogCard } from "../../_components/blog-card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

/**
 * Blog Category Archive Page
 *
 * URL: /blog/category/[slug]/
 * Shows all blog posts in a specific category
 * Uses ISR for optimal performance.
 */

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Allow new categories to be generated on-demand
export const dynamicParams = true;

/**
 * Generate static params for all active categories at build time
 */
export async function generateStaticParams() {
	try {
		const categories = await blogCategoryService.getActiveCategories();
		return categories.map((cat) => ({ slug: cat.slug }));
	} catch (error) {
		console.error("Error generating static params for blog categories:", error);
		return [];
	}
}

interface CategoryPageProps {
	params: Promise<{
		slug: string;
	}>;
}

async function getCategoryBySlug(slug: string) {
	try {
		return await blogCategoryService.getCategoryBySlug(slug);
	} catch {
		return null;
	}
}

export async function generateMetadata({
	params,
}: CategoryPageProps): Promise<Metadata> {
	const { slug } = await params;
	const [category, siteConfig] = await Promise.all([
		getCategoryBySlug(slug),
		getSiteConfig(),
	]);

	if (!category) {
		return {
			title: `Category not found | ${siteConfig.name}`,
			robots: { index: false, follow: false },
		};
	}

	return {
		title: `${category.name} | Blog | ${siteConfig.name}`,
		description: `Read our articles about ${category.name.toLowerCase()}. Tips, guides, and news.`,
		openGraph: {
			title: `${category.name} | Blog | ${siteConfig.name}`,
			description: `Read our articles about ${category.name.toLowerCase()}.`,
			url: `${siteConfig.url}/blog/category/${slug}`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "website",
		},
		alternates: {
			canonical: `${siteConfig.url}/blog/category/${slug}`,
		},
	};
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
	const { slug } = await params;
	const [category, articles] = await Promise.all([
		getCategoryBySlug(slug),
		getArticlesByCategory(slug),
	]);

	if (!category || articles.length === 0) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
			<div className="_container mx-auto px-4 py-8 padding-top">
				<Breadcrumb
					items={[
						{ label: "Blog", href: "/blog" },
						{ label: category.name },
					]}
				/>

				{/* Page Header */}
				<div className="mb-12">
					<p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
						Category
					</p>
					<h1 className="mb-4 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
						{category.name}
					</h1>
					<p className="text-lg text-muted-foreground">
						{articles.length} article{articles.length !== 1 ? "s" : ""} in
						this category
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
