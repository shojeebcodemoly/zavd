import Image from "next/image";
import Link from "next/link";
import { Link2 } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { NavbarSetter } from "./_components/NavbarSetter";
import { HeroBanner } from "./_components/HeroBanner";

interface Props {
	params: Promise<{ locale: string }>;
}

export default async function SpendenPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("spenden");
	const isEn = locale === "en";

	let dbData: Record<string, unknown> | null = null;
	try {
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
		const res = await fetch(`${baseUrl}/api/spenden-page`, { next: { tags: ["spenden-page"] } });
		if (res.ok) dbData = await res.json();
	} catch {}

	const hero = (dbData?.hero as Record<string, string>) || {};
	const cards = (dbData?.cards as Record<string, unknown>) || {};
	const humanitaer = (cards.humanitaer as Record<string, string>) || {};
	const zavd = (cards.zavd as Record<string, string>) || {};

	const heroTag = (isEn ? hero.taglineEn : hero.taglineDe) || t("heroBanner.tag");
	const heroTitle = (isEn ? hero.titleEn : hero.titleDe) || t("heroBanner.title");
	const heroSubtitle = (isEn ? hero.subtitleEn : hero.subtitleDe) || t("heroBanner.subtitle");
	const heroImage = hero.image || "/images/donate/Spenden-Syrien.jpg";
	const sectionTitle = (isEn ? (cards.sectionTitleEn as string) : (cards.sectionTitleDe as string)) || t("sectionTitle");

	const cardData = [
		{
			href: "/spenden/humanitaere-hilfe",
			image: humanitaer.image || "/images/donate/Spenden-Syrien.jpg",
			title: (isEn ? humanitaer.titleEn : humanitaer.titleDe) || t("cards.humanitaer.title"),
			description: (isEn ? humanitaer.descriptionEn : humanitaer.descriptionDe) || t("cards.humanitaer.description"),
		},
		{
			href: "/spenden/zavd-spendenkonto",
			image: zavd.image || "/images/donate/Association1.jpg",
			title: (isEn ? zavd.titleEn : zavd.titleDe) || t("cards.zavd.title"),
			description: (isEn ? zavd.descriptionEn : zavd.descriptionDe) || t("cards.zavd.description"),
		},
	];

	return (
		<div className="min-h-screen bg-white">
			<NavbarSetter />
			<HeroBanner
				image={heroImage}
				tag={heroTag}
				title={heroTitle}
				subtitle={heroSubtitle}
				breadcrumbs={[
					{ label: "ZAVD", href: "/" },
					{ label: heroTitle },
				]}
			/>
			<div className="bg-[#1a1f2e] py-14">
				<div className="_container">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-10 animate-in slide-in-from-right duration-[2000ms] ease-out fill-mode-both">
						{sectionTitle}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{cardData.map((card) => (
							<Link key={card.href} href={card.href} className="group block">
								<div className="relative overflow-hidden rounded-t-sm" style={{ height: "340px" }}>
									<Image src={card.image} alt={card.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
									<div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500" />
									<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
										<div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 scale-75 group-hover:scale-100 transition-transform duration-500">
											<Link2 className="w-5 h-5 text-primary" />
										</div>
										<p className="text-white text-sm leading-relaxed max-w-xs">{card.description}</p>
									</div>
								</div>
								<div className="bg-white py-4 px-6 text-center shadow-sm">
									<span className="text-gray-900 font-bold text-base tracking-wide">{card.title}</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
