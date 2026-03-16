import Link from "next/link";
import Image from "next/image";
import { User, Calendar, ArrowRight, Info } from "lucide-react";
import { getNachrichtenPage } from "@/lib/services/nachrichten-page.service";
import { getVeranstaltungenPage } from "@/lib/services/veranstaltungen-page.service";
import { getArticlesByPostType, getAllArticles } from "@/lib/data/blog";
import { ImageComponent } from "@/components/common/image-component";

interface Props {
	params: Promise<{ locale: string }>;
}

function getCountryFlag(country: string): string {
	const flags: Record<string, string> = {
		germany: "🇩🇪", deutschland: "🇩🇪", de: "🇩🇪",
		usa: "🇺🇸", "united states": "🇺🇸", us: "🇺🇸",
		uk: "🇬🇧", "united kingdom": "🇬🇧", gb: "🇬🇧",
		france: "🇫🇷", frankreich: "🇫🇷", fr: "🇫🇷",
		dubai: "🇦🇪", uae: "🇦🇪",
		turkey: "🇹🇷", türkei: "🇹🇷", tr: "🇹🇷",
		syria: "🇸🇾", syrien: "🇸🇾",
		iraq: "🇮🇶", irak: "🇮🇶",
		austria: "🇦🇹", österreich: "🇦🇹", at: "🇦🇹",
		switzerland: "🇨🇭", schweiz: "🇨🇭", ch: "🇨🇭",
	};
	return flags[country.toLowerCase()] || "🌍";
}

export default async function AktuellesPage({ params }: Props) {
	const { locale } = await params;
	const isEn = locale === "en";

	const [nachrichtenPage, veranstaltungenPage, newsArticles, eventArticles, allArticles] =
		await Promise.all([
			getNachrichtenPage(),
			getVeranstaltungenPage(),
			getArticlesByPostType("news"),
			getArticlesByPostType("event"),
			getAllArticles(),
		]);

	// Fallback: if no posts have postType set, show all in news
	const displayNews = newsArticles.length > 0 ? newsArticles : allArticles;
	const displayEvents = eventArticles;

	const hero = nachrichtenPage.hero;
	const press = nachrichtenPage.pressSection;
	const eventsBanner = veranstaltungenPage.pressSection;

	const heroTitle = isEn ? hero.titleEn || "News & Events" : hero.titleDe || "News & Events";

	return (
		<div className="flex flex-col min-h-screen">

			{/* Hero */}
			<section className="relative w-full h-80 md:h-[440px] lg:h-[560px] flex items-center justify-center overflow-hidden">
				{hero.backgroundImage ? (
					<ImageComponent
						src={hero.backgroundImage}
						alt={heroTitle}
						fill
						className="object-cover"
						priority
					/>
				) : (
					<div className="absolute inset-0 bg-secondary" />
				)}
				<div className="absolute inset-0 bg-black/55" />
				<div className="relative z-10 text-center text-white px-4">
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
						{heroTitle}
					</h1>
					{hero.subtitle && (
						<p className="text-white/80 text-base md:text-lg max-w-xl mx-auto mb-4">
							{hero.subtitle}
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

			{/* Press Banner */}
			<section className="relative bg-[#0f1e2e] py-14 overflow-hidden">
				{press?.backgroundImage ? (
					<ImageComponent src={press.backgroundImage} alt="press background" fill className="object-cover opacity-30" />
				) : (
					<div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle, #4a7fa5 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
				)}
				<div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
					<h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
						{press?.heading || "Latest press releases"}
					</h2>
					{(press?.subtext || press?.email) && (
						<p className="text-slate-400 text-sm md:text-base">
							{press?.subtext || "Simply contact us at"}{" "}
							{press?.email && (
								<a href={`mailto:${press.email}`} className="text-primary hover:underline font-medium">{press.email}</a>
							)}
						</p>
					)}
				</div>
			</section>

			{/* News Section */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
						{isEn ? "News" : "Nachrichten"}
					</h2>
					{displayNews.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{displayNews.map((article) => {
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
													{category && <span className="absolute bottom-2 left-2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-sm z-10">{category}</span>}
												</div>
											)}
										</div>
										<div className="p-5">
											<h3 className="font-bold text-slate-900 text-base mb-3 leading-snug line-clamp-2">{article.title}</h3>
											<div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
												<span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />by <span className="font-semibold text-slate-700 uppercase ml-1">{article.author.name}</span></span>
												<span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{date}</span>
											</div>
											{article.excerpt && <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>}
											<Link href={`/aktuelles/nachrichten/${article.slug}`} className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded hover:bg-primary/90 transition-colors">
												Read more <ArrowRight className="w-3.5 h-3.5" />
											</Link>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="text-center py-16 text-slate-400 text-sm">No news articles found.</div>
					)}
				</div>
			</section>

			{/* Events Banner */}
			<section className="relative bg-[#0f1e2e] py-14 overflow-hidden">
				{eventsBanner?.backgroundImage ? (
					<ImageComponent src={eventsBanner.backgroundImage} alt="events background" fill className="object-cover opacity-30" />
				) : (
					<div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle, #4a7fa5 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
				)}
				<div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
					<h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
						{eventsBanner?.heading || "Upcoming Events"}
					</h2>
					{(eventsBanner?.subtext || eventsBanner?.email) && (
						<p className="text-slate-400 text-sm md:text-base">
							{eventsBanner?.subtext || "Simply contact us at"}{" "}
							{eventsBanner?.email && (
								<a href={`mailto:${eventsBanner.email}`} className="text-primary hover:underline font-medium">{eventsBanner.email}</a>
							)}
						</p>
					)}
				</div>
			</section>

			{/* Events Section — new card design */}
			<section className="py-16 bg-slate-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
						{isEn ? "Events" : "Veranstaltungen"}
					</h2>
					{displayEvents.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{displayEvents.map((article) => {
								const eventDate = article.eventDate
									? new Date(article.eventDate)
									: new Date(article.publishedAt);
								const day = eventDate.toLocaleDateString("en-US", { weekday: "short" });
								const dateNum = eventDate.getDate();
								const month = eventDate.toLocaleDateString("en-US", { month: "short" });
								const flag = article.eventCountry ? getCountryFlag(article.eventCountry) : null;
								const city = article.eventCity || "";
								const venue = article.eventVenue || article.title;

								return (
									<div key={article.id} className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group h-[380px] flex flex-col">
										{/* Background image */}
										{article.featuredImage?.url ? (
											<Image src={article.featuredImage.url} alt={article.featuredImage.alt || article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
										) : (
											<div className="absolute inset-0 bg-slate-700" />
										)}
										{/* Dark gradient overlay */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

										{/* Top row */}
										<div className="relative z-10 flex items-start justify-between p-4">
											{/* Date box */}
											<div className="bg-white rounded-lg px-3 py-2 text-center min-w-[52px]">
												<p className="text-xs font-semibold text-slate-500 leading-none">{day}</p>
												<p className="text-2xl font-bold text-slate-900 leading-tight">{dateNum}</p>
												<p className="text-xs font-semibold text-slate-500 leading-none">{month}</p>
											</div>
											{/* Info icon */}
											<button className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 text-white hover:bg-white/30 transition-colors">
												<Info className="w-4 h-4" />
											</button>
										</div>

										{/* Bottom content */}
										<div className="relative z-10 mt-auto p-4">
											{(flag || city) && (
												<p className="text-xs font-semibold text-white/80 uppercase tracking-widest mb-1">
													{flag && <span className="mr-1">{flag}</span>}{city}
												</p>
											)}
											<h3 className="text-xl font-bold text-white leading-tight mb-4 line-clamp-2">{venue}</h3>
											<Link
												href={`/aktuelles/veranstaltungen/${article.slug}`}
												className="block w-full text-center bg-white/90 hover:bg-white text-slate-900 text-sm font-semibold py-2.5 rounded-lg transition-colors"
											>
												See Details
											</Link>
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="text-center py-16 text-slate-400 text-sm">No events found.</div>
					)}
				</div>
			</section>

		</div>
	);
}
