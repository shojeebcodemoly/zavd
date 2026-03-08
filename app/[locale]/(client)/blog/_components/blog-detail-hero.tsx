"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import { Article } from "@/types/article";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/animations";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ImageComponent } from "@/components/common/image-component";

interface BlogDetailHeroProps {
	article: Article;
}

/**
 * BlogDetailHero Component
 *
 * Hero section for individual blog post pages with featured image, title, metadata, and author info.
 */
export function BlogDetailHero({ article }: BlogDetailHeroProps) {
	// Format date
	const publishedDate = new Date(article.publishedAt).toLocaleDateString(
		"sv-SE",
		{
			year: "numeric",
			month: "long",
			day: "numeric",
		}
	);

	// Calculate reading time
	const wordCount = article.content.split(/\s+/).length;
	const readingTime = Math.ceil(wordCount / 200);

	return (
		<section className="relative overflow-hidden bg-linear-to-b from-slate-50 to-primary/20 padding-top pb-8">
			<section className="_container">
				<Breadcrumb
					items={[
						{ label: "Blogg", href: "/blogg" },
						{ label: article.title },
					]}
				/>
			</section>
			<div className="_container">
				<motion.div
					initial="initial"
					animate="animate"
					variants={staggerContainer}
					// className="mx-auto max-w-4xl"
				>
					{/* Back Button */}
					<motion.div variants={fadeUp} className="mb-6">
						<Button asChild variant="ghost" size="sm">
							<Link href="/blogg" className="gap-2">
								<ArrowLeft className="h-4 w-4" />
								Tillbaka till artiklar
							</Link>
						</Button>
					</motion.div>

					{/* Categories */}
					<motion.div
						variants={fadeUp}
						className="mb-4 flex flex-wrap gap-2"
					>
						{article.categories.map((category) => (
							<Badge
								key={category}
								variant="secondary"
								className="bg-primary/10 text-primary hover:bg-primary/20"
							>
								{category}
							</Badge>
						))}
					</motion.div>

					{/* Title */}
					<motion.h1
						variants={fadeUp}
						className="mb-6 text-3xl font-medium tracking-tight text-secondary md:text-4xl lg:text-5xl"
					>
						{article.title}
					</motion.h1>

					{/* Excerpt */}
					<motion.p
						variants={fadeUp}
						className="mb-8 text-lg text-muted-foreground md:text-xl"
					>
						{article.excerpt}
					</motion.p>

					{/* Metadata */}
					<motion.div
						variants={fadeUp}
						className="mb-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
					>
						{/* Author */}
						<div className="flex items-center gap-3">
							{article.author.image && (
								<div className="relative h-10 w-10 overflow-hidden rounded-full">
									<ImageComponent
										src={article.author.image}
										alt={article.author.name}
										height={0}
										width={0}
										sizes="100vw"
										wrapperClasses="w-full h-full"
										className="object-cover w-full h-full"
									/>
								</div>
							)}
							<div>
								<div className="flex items-center gap-2">
									<User className="h-4 w-4" />
									<span className="font-semibold text-foreground">
										{article.author.name}
									</span>
								</div>
								<span className="text-xs">{article.author.role}</span>
							</div>
						</div>

						{/* Date */}
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							<time dateTime={article.publishedAt}>{publishedDate}</time>
						</div>

						{/* Reading Time */}
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4" />
							<span>{readingTime} min läsning</span>
						</div>
					</motion.div>

					{/* Featured Image */}
					{article.featuredImage && (
						<motion.div
							variants={fadeUp}
							className="relative aspect-21/9 w-full overflow-hidden rounded-2xl shadow-xl"
						>
							<ImageComponent
								src={article.featuredImage.url}
								alt={article.featuredImage.alt}
								height={0}
								width={0}
								sizes="100vw"
								wrapperClasses="w-full h-full"
								className="object-cover w-full h-full"
							/>
						</motion.div>
					)}
				</motion.div>
			</div>
		</section>
	);
}
