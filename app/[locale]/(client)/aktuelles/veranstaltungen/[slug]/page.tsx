import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight, ArrowLeft } from "lucide-react";
import { getArticleBySlug, getRecentArticles, getAllCategories } from "@/lib/data/blog";
import { getSiteSettings } from "@/lib/services/site-settings.service";

interface Props {
	params: Promise<{ locale: string; slug: string }>;
}

export default async function VeranstaltungenDetailPage({ params }: Props) {
	const { slug } = await params;

	const [article, recentArticles, categories, siteSettings] = await Promise.all([
		getArticleBySlug(slug),
		getRecentArticles(5),
		getAllCategories(),
		getSiteSettings(),
	]);

	if (!article) notFound();

	const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
		year: "numeric", month: "long", day: "numeric",
	});

	const category = article.categories?.[0];

	return (
		<div className="flex flex-col min-h-screen bg-white">

			{/* Hero */}
			<section className="relative w-full h-64 md:h-80 flex items-end justify-center overflow-hidden">
				{article.featuredImage?.url ? (
					<Image src={article.featuredImage.url} alt={article.featuredImage.alt || article.title} fill className="object-cover" unoptimized priority />
				) : (
					<div className="absolute inset-0 bg-secondary" />
				)}
				<div className="absolute inset-0 bg-black/60" />
				<div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-white">
					<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-3">{article.title}</h1>
					<div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
						<span className="flex items-center gap-1.5"><User className="w-4 h-4" />{article.author.name}</span>
						<span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{publishedDate}</span>
						{category && <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-sm">{category}</span>}
					</div>
				</div>
			</section>

			{/* Main Content */}
			<section className="py-12 bg-slate-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

						{/* Article */}
						<div className="lg:col-span-2">
							<div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
								<h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-5">{article.title}</h2>
								<div className="prose prose-slate max-w-none text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
								{article.tags && article.tags.length > 0 && (
									<div className="mt-8 pt-6 border-t border-slate-100">
										<div className="flex flex-wrap items-center gap-2">
											<span className="text-sm text-slate-500 font-medium">Tags:</span>
											{article.tags.map((tag) => (
												<span key={tag} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{tag}</span>
											))}
										</div>
									</div>
								)}
								<div className="mt-8 pt-6 border-t border-slate-100">
									<Link href="/aktuelles/veranstaltungen" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
										<ArrowLeft className="w-4 h-4" />
										Back to Events
									</Link>
								</div>
							</div>
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							<div className="bg-white rounded-xl shadow-sm p-5">
								<h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Latest Events</h3>
								<div className="space-y-3">
									{recentArticles.filter((a) => a.id !== article.id).slice(0, 4).map((a) => (
										<Link key={a.id} href={`/aktuelles/veranstaltungen/${a.slug}`} className="block group">
											<p className="text-sm font-medium text-slate-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug">{a.title}</p>
											<p className="text-xs text-slate-400 mt-1">
												{new Date(a.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
											</p>
										</Link>
									))}
								</div>
							</div>

							{(siteSettings?.phone || siteSettings?.email) && (
								<div className="rounded-xl overflow-hidden shadow-sm" style={{ background: siteSettings?.contactBackground ? `url(${siteSettings.contactBackground}) center/cover no-repeat` : "linear-gradient(135deg, #1e293b 0%, #334155 100%)" }}>
									<div className="bg-black/50 p-5">
										<h3 className="text-white font-bold text-sm mb-4">Do you have any questions?</h3>
										<p className="text-white/70 text-xs mb-4">Please contact us at</p>
										{siteSettings?.phone && (
											<a href={`tel:${siteSettings.phone}`} className="flex items-center gap-2 text-white text-sm mb-2 hover:text-primary transition-colors">
												<span className="text-primary">📞</span>{siteSettings.phone}
											</a>
										)}
										{siteSettings?.email && (
											<a href={`mailto:${siteSettings.email}`} className="flex items-center gap-2 text-white text-sm hover:text-primary transition-colors">
												<span className="text-primary">✉</span>{siteSettings.email}
											</a>
										)}
										<Link href="/kontakt" className="mt-4 block text-center bg-primary text-white text-xs font-semibold px-4 py-2 rounded hover:bg-primary/90 transition-colors">
											Contact Us
										</Link>
									</div>
								</div>
							)}

							{categories.length > 0 && (
								<div className="bg-white rounded-xl shadow-sm p-5">
									<h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Categories</h3>
									<ul className="space-y-2">
										{categories.map((cat) => (
											<li key={cat}>
												<Link href={`/aktuelles/veranstaltungen?category=${encodeURIComponent(cat)}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors">
													<ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />{cat}
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Bottom: Latest Events */}
			{recentArticles.length > 0 && (
				<section className="py-12 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-xl font-bold text-slate-900 mb-8">Latest Events</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{recentArticles.filter((a) => a.id !== article.id).slice(0, 3).map((a) => (
								<div key={a.id} className="group">
									<div className="relative h-36 w-full rounded-lg overflow-hidden mb-3">
										{a.featuredImage?.url ? (
											<Image src={a.featuredImage.url} alt={a.featuredImage.alt || a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
										) : (
											<div className="absolute inset-0 bg-slate-200" />
										)}
									</div>
									<h4 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">{a.title}</h4>
									<p className="text-xs text-slate-400 mb-2">{new Date(a.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
									{a.excerpt && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{a.excerpt}</p>}
									<Link href={`/aktuelles/veranstaltungen/${a.slug}`} className="inline-flex items-center gap-1 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-primary/90 transition-colors">
										Read more <ArrowRight className="w-3 h-3" />
									</Link>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

		</div>
	);
}
