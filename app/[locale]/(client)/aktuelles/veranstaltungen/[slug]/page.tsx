import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { getArticleBySlug, getArticlesByPostType, getAllCategories } from "@/lib/data/blog";
import { getSiteSettings } from "@/lib/services/site-settings.service";
import { EventImageSlider } from "@/components/client/EventImageSlider";

interface Props {
	params: Promise<{ locale: string; slug: string }>;
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

export default async function VeranstaltungenDetailPage({ params }: Props) {
	const { slug } = await params;

	const [article, recentEvents, categories, siteSettings] = await Promise.all([
		getArticleBySlug(slug),
		getArticlesByPostType("event"),
		getAllCategories(),
		getSiteSettings(),
	]);

	if (!article) notFound();

	const eventDate = article.eventDate
		? new Date(article.eventDate)
		: new Date(article.publishedAt);

	const formattedEventDate = eventDate.toLocaleDateString("en-US", {
		weekday: "long", year: "numeric", month: "long", day: "numeric",
	});

	const flag = article.eventCountry ? getCountryFlag(article.eventCountry) : null;
	const locationFull = [article.eventCity, article.eventCountry].filter(Boolean).join(", ");

	return (
		<div className="flex flex-col min-h-screen bg-white">

			{/* Hero */}
			<section className="relative w-full h-72 md:h-[420px] flex items-center justify-center overflow-hidden">
				{article.featuredImage?.url ? (
					<Image src={article.featuredImage.url} alt={article.featuredImage.alt || article.title} fill className="object-cover" unoptimized priority />
				) : (
					<div className="absolute inset-0 bg-[#0f1e2e]" />
				)}
				<div className="absolute inset-0 bg-black/60" />
				<div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
					<h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
						{article.eventVenue || article.title}
					</h1>
				</div>
			</section>

			{/* Info Bar */}
			<div className="bg-slate-800 text-white py-4">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-wrap items-center justify-center gap-6 text-sm">
						<span className="flex items-center gap-2">
							<Calendar className="w-4 h-4 text-primary" />
							{formattedEventDate}
						</span>
						{article.eventTime && (
							<span className="flex items-center gap-2">
								<Clock className="w-4 h-4 text-primary" />
								from {article.eventTime}
							</span>
						)}
						{locationFull && (
							<span className="flex items-center gap-2">
								<MapPin className="w-4 h-4 text-primary" />
								{flag && <span>{flag}</span>} {locationFull}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<section className="py-12 bg-slate-50">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

						{/* Left: Content */}
						<div className="lg:col-span-2 space-y-6">
							<div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
								{/* Gallery Slider */}
								{article.galleryImages && article.galleryImages.length > 0 && (
									<EventImageSlider
										images={article.galleryImages}
										alt={article.title}
									/>
								)}

								<h2 className="text-xl font-bold text-slate-900 mb-5">About this Event</h2>
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
								<div className="mt-6 pt-6 border-t border-slate-100">
									<Link href="/aktuelles" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
										<ArrowLeft className="w-4 h-4" />
										Back to News & Events
									</Link>
								</div>
							</div>
						</div>

						{/* Right: Sidebar */}
						<div className="space-y-5">

							{/* Contact Card */}
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

							{/* Event at a Glance */}
							<div className="bg-white rounded-xl shadow-sm p-5">
								<h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wide">
									Event at a Glance
								</h3>
								<div className="space-y-3">
									<div className="flex items-start gap-3">
										<Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
										<div>
											<p className="text-xs text-slate-500">Date</p>
											<p className="text-sm font-semibold text-slate-800">{formattedEventDate}</p>
										</div>
									</div>
									{article.eventTime && (
										<div className="flex items-start gap-3">
											<Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
											<div>
												<p className="text-xs text-slate-500">Time</p>
												<p className="text-sm font-semibold text-slate-800">from {article.eventTime}</p>
											</div>
										</div>
									)}
									{locationFull && (
										<div className="flex items-start gap-3">
											<MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
											<div>
												<p className="text-xs text-slate-500">Location</p>
												<p className="text-sm font-semibold text-slate-800">
													{flag && <span className="mr-1">{flag}</span>}{locationFull}
												</p>
											</div>
										</div>
									)}
									{article.eventVenue && (
										<div className="flex items-start gap-3">
											<div className="w-4 h-4 text-primary mt-0.5 shrink-0 flex items-center justify-center text-xs">🏛</div>
											<div>
												<p className="text-xs text-slate-500">Venue</p>
												<p className="text-sm font-semibold text-slate-800">{article.eventVenue}</p>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Social Share */}
							<div className="bg-white rounded-xl shadow-sm p-5">
								<h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
									<Share2 className="w-4 h-4" /> Social Share
								</h3>
								<div className="flex items-center gap-3">
									<a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/aktuelles/veranstaltungen/${article.slug}`)}`} target="_blank" rel="noopener noreferrer"
										className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1877f2] text-white hover:opacity-90 transition-opacity">
										<Facebook className="w-4 h-4" />
									</a>
									<a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer"
										className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1da1f2] text-white hover:opacity-90 transition-opacity">
										<Twitter className="w-4 h-4" />
									</a>
									<a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`/aktuelles/veranstaltungen/${article.slug}`)}`} target="_blank" rel="noopener noreferrer"
										className="flex items-center justify-center w-9 h-9 rounded-full bg-[#0a66c2] text-white hover:opacity-90 transition-opacity">
										<Linkedin className="w-4 h-4" />
									</a>
								</div>
							</div>

	
							{/* Categories */}
							{categories.length > 0 && (
								<div className="bg-white rounded-xl shadow-sm p-5">
									<h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">Categories</h3>
									<ul className="space-y-1.5">
										{categories.map((cat) => (
											<li key={cat}>
												<span className="text-sm text-slate-600">{cat}</span>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Bottom: Other Events */}
			{recentEvents.filter((a) => a.id !== article.id).length > 0 && (
				<section className="py-12 bg-white">
					<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-xl font-bold text-slate-900 mb-8">Other Events</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{recentEvents.filter((a) => a.id !== article.id).slice(0, 3).map((a) => {
								const evDate = a.eventDate ? new Date(a.eventDate) : new Date(a.publishedAt);
								const day = evDate.toLocaleDateString("en-US", { weekday: "short" });
								const dateNum = evDate.getDate();
								const mon = evDate.toLocaleDateString("en-US", { month: "short" });
								const evFlag = a.eventCountry ? getCountryFlag(a.eventCountry) : null;
								return (
									<div key={a.id} className="relative rounded-xl overflow-hidden shadow-sm group h-56">
										{a.featuredImage?.url ? (
											<Image src={a.featuredImage.url} alt={a.featuredImage.alt || a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
										) : (
											<div className="absolute inset-0 bg-slate-700" />
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
										<div className="absolute top-3 left-3 bg-white rounded-lg px-2.5 py-1.5 text-center">
											<p className="text-[10px] font-semibold text-slate-500 leading-none">{day}</p>
											<p className="text-lg font-bold text-slate-900 leading-tight">{dateNum}</p>
											<p className="text-[10px] font-semibold text-slate-500 leading-none">{mon}</p>
										</div>
										<div className="absolute bottom-0 left-0 right-0 p-3">
											{(evFlag || a.eventCity) && (
												<p className="text-[10px] font-semibold text-white/70 uppercase tracking-widest mb-0.5">
													{evFlag && <span className="mr-1">{evFlag}</span>}{a.eventCity}
												</p>
											)}
											<h4 className="text-sm font-bold text-white line-clamp-1 mb-2">{a.eventVenue || a.title}</h4>
											<Link href={`/aktuelles/veranstaltungen/${a.slug}`}
												className="block text-center bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold py-1.5 rounded-lg transition-colors">
												See Details
											</Link>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</section>
			)}

		</div>
	);
}
