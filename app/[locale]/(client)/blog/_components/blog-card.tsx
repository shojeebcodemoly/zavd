"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { Article } from "@/types/article";
import { Badge } from "@/components/ui/badge";
import { fadeUp, hoverLift } from "@/lib/animations";
import { ImageComponent } from "@/components/common/image-component";

interface BlogCardProps {
	article: Article;
	index?: number;
	basePath?: string;
	locale?: "sv" | "en";
}

// Translations
const translations = {
	sv: {
		readMore: "Läs mer",
		minRead: "min läsning",
		dateLocale: "sv-SE",
	},
	en: {
		readMore: "Read more",
		minRead: "min read",
		dateLocale: "en-US",
	},
};

/**
 * BlogCard Component
 *
 * Displays a blog article card with image, title, excerpt, metadata, and categories.
 * Features hover animations and responsive design.
 * Supports custom basePath for different routes (e.g., /nyheter, /blogg)
 */
export function BlogCard({ article, index = 0, basePath = "/blogg", locale = "sv" }: BlogCardProps) {
	const t = translations[locale];

	// Format date
	const publishedDate = new Date(article.publishedAt).toLocaleDateString(
		t.dateLocale,
		{
			year: "numeric",
			month: "long",
			day: "numeric",
		}
	);

	// Calculate reading time (rough estimate: 200 words per minute)
	const wordCount = article.content.split(/\s+/).length;
	const readingTime = Math.ceil(wordCount / 200);

	return (
		<motion.article
			variants={fadeUp}
			initial="initial"
			whileInView="animate"
			viewport={{ once: true, margin: "-50px" }}
			transition={{ delay: index * 0.1 }}
			{...hoverLift}
			className="group h-full"
		>
			<Link href={`${basePath}/${article.slug}`} className="block h-full">
				<div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30">
					{/* Featured Image */}
					{article.featuredImage && (
						<div className="relative aspect-video w-full overflow-hidden bg-muted">
							{/* <Image
								src={article.featuredImage.url}
								alt={article.featuredImage.alt}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/> */}
							<ImageComponent
								src={article.featuredImage.url}
								alt={article.featuredImage.alt}
								height={0}
								width={0}
								sizes="100vw"
								wrapperClasses="w-full h-full"
								className="object-cover w-full h-full"
							/>
							{/* Gradient Overlay */}
							<div className="absolute inset-0 bg-linear-to-t from-secondary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
						</div>
					)}

					{/* Content */}
					<div className="flex flex-1 flex-col p-6">
						{/* Categories */}
						<div className="mb-3 flex flex-wrap gap-2">
							{article.categories.slice(0, 2).map((category) => (
								<Badge
									key={category}
									variant="secondary"
									className="bg-primary/10 text-primary hover:bg-primary/20"
								>
									{category}
								</Badge>
							))}
						</div>

						{/* Title */}
						<h3 className="mb-3 text-xl font-medium text-foreground transition-colors group-hover:text-primary line-clamp-2">
							{article.title}
						</h3>

						{/* Excerpt */}
						<p className="mb-4 flex-1 text-muted-foreground line-clamp-3">
							{article.excerpt}
						</p>

						{/* Metadata */}
						<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
							{/* Author */}
							<div className="flex items-center gap-2">
								<User className="h-4 w-4" />
								<span>{article.author.name}</span>
							</div>

							{/* Date */}
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								<time dateTime={article.publishedAt}>
									{publishedDate}
								</time>
							</div>

							{/* Reading Time */}
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								<span>{readingTime} {t.minRead}</span>
							</div>
						</div>

						{/* Read More Link */}
						<div className="mt-4 flex items-center gap-2 text-primary font-semibold">
							<span>{t.readMore}</span>
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</div>
					</div>
				</div>
			</Link>
		</motion.article>
	);
}
