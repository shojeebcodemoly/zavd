"use client";

import Link from "next/link";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageComponent } from "@/components/common/image-component";
import type { BlogPostSearchResult } from "@/lib/services/search.service";

interface ArticleResultCardProps {
	article: BlogPostSearchResult;
}

export function ArticleResultCard({ article }: ArticleResultCardProps) {
	return (
		<Link
			href={`/blogg/${article.slug}`}
			className="group flex gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all duration-200"
		>
			{/* Thumbnail */}
			<div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-slate-100 rounded-lg overflow-hidden">
				{article.featuredImage?.url ? (
					<ImageComponent
						src={article.featuredImage.url}
						alt={article.featuredImage.alt || article.title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						width={128}
						height={128}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<FileText className="h-8 w-8 text-slate-300" />
					</div>
				)}
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0 flex flex-col justify-between py-1">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<Badge variant="outline" className="text-xs font-normal text-blue-600 border-blue-300">
							Artikel
						</Badge>
						{article.publishedAt && (
							<span className="flex items-center gap-1 text-xs text-slate-400">
								<Calendar className="h-3 w-3" />
								{new Date(article.publishedAt).toLocaleDateString("de-DE")}
							</span>
						)}
					</div>
					<h3 className="font-semibold text-secondary group-hover:text-primary transition-colors line-clamp-2 mb-1">
						{article.title}
					</h3>
					{article.excerpt && (
						<p className="text-sm text-slate-500 line-clamp-2">
							{article.excerpt}
						</p>
					)}
				</div>

				{/* Categories */}
				<div className="flex items-center gap-2 mt-2">
					{article.categories?.slice(0, 2).map((cat) => (
						<Badge key={cat._id} variant="secondary" className="text-xs">
							{cat.name}
						</Badge>
					))}
				</div>
			</div>

			{/* Arrow */}
			<div className="hidden sm:flex items-center">
				<ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
			</div>
		</Link>
	);
}
