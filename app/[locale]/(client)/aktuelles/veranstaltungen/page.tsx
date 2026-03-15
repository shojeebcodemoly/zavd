import Link from "next/link";
import Image from "next/image";
import { User, Calendar, ArrowRight } from "lucide-react";
import { getVeranstaltungenPage } from "@/lib/services/veranstaltungen-page.service";
import { getArticlesByCategory, getAllArticles } from "@/lib/data/blog";
import { ImageComponent } from "@/components/common/image-component";

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function VeranstaltungenPage({ params }: Props) {
	const { locale } = await params;

	const [page, byEvent, byVeranstaltungen] = await Promise.all([
		getVeranstaltungenPage(),
		getArticlesByCategory("event"),
		getArticlesByCategory("veranstaltungen"),
	]);

	const filtered = byEvent.length > 0 ? byEvent : byVeranstaltungen.length > 0 ? byVeranstaltungen : null;
	const articles = filtered ?? await getAllArticles();

	const isEn = locale === "en";
	const heroTitle = isEn
		? (page.hero.titleEn || "Events")
		: (page.hero.titleDe || "Veranstaltungen");

	const press = page.pressSection;

	return (
		<div className="flex flex-col min-h-screen">

			{/* Hero */}
			<section className="relative w-full h-80 md:h-[440px] lg:h-[560px] flex items-center justify-center overflow-hidden">
				{page.hero.backgroundImage ? (
					<ImageComponent src={page.hero.backgroundImage} alt={heroTitle} fill className="object-cover" priority />
				) : (
					<div className="absolute inset-0 bg-secondary" />
				)}
				<div className="absolute inset-0 bg-black/55" />
				<div className="relative z-10 text-center text-white px-4">
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
						{heroTitle}
					</h1>
					{page.hero.subtitle && (
						<p className="text-white/80 text-base md:text-lg max-w-xl mx-auto mb-4">
							{page.hero.subtitle}
						</p>
					)}
					<nav className="flex items-center justify-center gap-2 text-sm text-white/70">
						<Link href="/" className="hover:text-white transition-colors">Home</Link>
						<span className="text-white/40">/</span>
						<span className="text-white/90">{heroTitle}</span>
					</nav>
				</div>
			</section>

			{/* Gap */}
			<div className="h-8 md:h-12 bg-white" />

			{/* Banner */}
			<section className="relative bg-[#0f1e2e] py-14 overflow-hidden">
				{press?.backgroundImage ? (
					<ImageComponent src={press.backgroundImage} alt="banner background" fill className="object-cover opacity-30" />
				) : (
					<div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle, #4a7fa5 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
				)}
				<div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
					<h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
						{press?.heading || "Upcoming Events"}
					</h2>
					{(press?.subtext || press?.email) && (
						<p className="text-slate-400 text-sm md:text-base">
							{press?.subtext || "Simply contact us at"}{" "}
							{press?.email && (
								<a href={`mailto:${press.email}`} className="text-primary hover:underline font-medium">
									{press.email}
								</a>
							)}
						</p>
					)}
				</div>
			</section>

			{/* Events Grid */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{articles.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{articles.map((article) => {
								const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
									year: "numeric", month: "long", day: "numeric",
								});
								const category = article.categories?.[0];
								return (
									<div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
										<div className="relative h-52 w-full overflow-hidden">
											{article.featuredImage?.url ? (
												<>
													<Image src={article.featuredImage.url} alt={article.featuredImage.alt || article.title} fill className="object-cover hover:scale-105 transition-transform duration-500" unoptimized />
													{category && (
														<span className="absolute bottom-2 left-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-sm z-10">{category}</span>
													)}
												</>
											) : (
												<div className="absolute inset-0 bg-slate-200">
													{category && (
														<span className="absolute bottom-2 left-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-sm z-10">{category}</span>
													)}
												</div>
											)}
										</div>
										<div className="p-5">
											<h3 className="font-bold text-slate-900 text-base mb-3 leading-snug line-clamp-2">{article.title}</h3>
											<div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
												<span className="flex items-center gap-1">
													<User className="w-3.5 h-3.5" />
													by <span className="font-semibold text-slate-700 uppercase ml-1">{article.author.name}</span>
												</span>
												<span className="flex items-center gap-1">
													<Calendar className="w-3.5 h-3.5" />
													{date}
												</span>
											</div>
											{article.excerpt && (
												<p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
											)}
											<Link href={`/aktuelles/veranstaltungen/${article.slug}`} className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded hover:bg-primary/90 transition-colors">
												Read more <ArrowRight className="w-3.5 h-3.5" />
											</Link>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="text-center py-20 text-slate-400 text-sm">No events found.</div>
					)}
				</div>
			</section>

		</div>
	);
}
