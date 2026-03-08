import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSiteConfig } from "@/config/site";
import { getAllArticles } from "@/lib/data/blog";
import { BlogCard } from "../../_components/blog-card";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import type { Article, Author } from "@/types/article";

/**
 * Blog Author Archive Page
 *
 * URL: /blog/author/[slug]/
 * Shows all blog posts by a specific author
 * Uses ISR for optimal performance.
 */

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Allow new authors to be generated on-demand
export const dynamicParams = true;

/**
 * Generate static params for all authors at build time
 */
export async function generateStaticParams() {
	try {
		const articles = await getAllArticles();
		// Get unique author slugs
		const authorSlugs = new Set<string>();
		articles.forEach((article) => {
			if (article.author?.name) {
				const slug = article.author.name
					.toLowerCase()
					.replace(/\s+/g, "-")
					.replace(/[åä]/g, "a")
					.replace(/ö/g, "o")
					.replace(/@/g, "")
					.replace(/\./g, "-")
					.replace(/[^a-z0-9-]/g, "")
					.replace(/-+/g, "-");
				authorSlugs.add(slug);
			}
		});
		return Array.from(authorSlugs).map((slug) => ({ slug }));
	} catch (error) {
		console.error("Error generating static params for authors:", error);
		return [];
	}
}

interface AuthorPageProps {
	params: Promise<{
		slug: string;
	}>;
}

function createAuthorSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[åä]/g, "a")
		.replace(/ö/g, "o")
		.replace(/@/g, "")
		.replace(/\./g, "-")
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-");
}

async function getArticlesByAuthor(
	authorSlug: string
): Promise<{ articles: Article[]; author: Author | null }> {
	const allArticles = await getAllArticles();
	const articles = allArticles.filter((article) => {
		if (!article.author?.name) return false;
		const slug = createAuthorSlug(article.author.name);
		return slug === authorSlug;
	});

	const author = articles.length > 0 ? articles[0].author : null;
	return { articles, author };
}

export async function generateMetadata({
	params,
}: AuthorPageProps): Promise<Metadata> {
	const { slug } = await params;
	const [{ articles, author }, siteConfig] = await Promise.all([
		getArticlesByAuthor(slug),
		getSiteConfig(),
	]);

	if (!author || articles.length === 0) {
		return {
			title: `Author not found | ${siteConfig.name}`,
			robots: { index: false, follow: false },
		};
	}

	return {
		title: `${author.name} | Author | ${siteConfig.name}`,
		description: `Read articles by ${author.name}. ${author.bio || ""}`,
		openGraph: {
			title: `${author.name} | Author | ${siteConfig.name}`,
			description: `Read articles by ${author.name}.`,
			url: `${siteConfig.url}/blog/author/${slug}`,
			siteName: siteConfig.name,
			locale: "sv_SE",
			type: "profile",
		},
		alternates: {
			canonical: `${siteConfig.url}/blog/author/${slug}`,
		},
	};
}

export default async function BlogAuthorPage({ params }: AuthorPageProps) {
	const { slug } = await params;
	const { articles, author } = await getArticlesByAuthor(slug);

	if (!author || articles.length === 0) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
			<div className="_container mx-auto px-4 py-8 padding-top">
				<Breadcrumb
					items={[
						{ label: "Blog", href: "/blog" },
						{ label: author.name },
					]}
				/>

				{/* Author Header */}
				<div className="mb-12 flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
					{/* Author Avatar */}
					<div className="mb-6 md:mb-0 md:mr-8">
						{author.image ? (
							<Image
								src={author.image}
								alt={author.name}
								width={120}
								height={120}
								className="rounded-full"
							/>
						) : (
							<div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-4xl font-semibold text-primary">
								{author.name.charAt(0)}
							</div>
						)}
					</div>

					{/* Author Info */}
					<div>
						<p className="mb-2 text-sm font-medium uppercase tracking-wider text-primary">
							Author
						</p>
						<h1 className="mb-2 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
							{author.name}
						</h1>
						<p className="mb-4 text-lg text-muted-foreground">
							{author.role}
						</p>
						{author.bio && (
							<p className="max-w-2xl text-muted-foreground">
								{author.bio}
							</p>
						)}
						<p className="mt-4 text-sm text-muted-foreground">
							{articles.length} published article
							{articles.length !== 1 ? "s" : ""}
						</p>
					</div>
				</div>

				{/* Articles Grid */}
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{articles.map((article) => (
						<BlogCard key={article.id} article={article} basePath="/blog" />
					))}
				</div>

				{/* Back Link */}
				<div className="mt-12 text-center">
					<Link href="/blog" className="text-primary hover:underline">
						← Back to blog
					</Link>
				</div>
			</div>
		</div>
	);
}
