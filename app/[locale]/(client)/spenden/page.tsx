import Image from "next/image";
import Link from "next/link";
import { Link2 } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { NavbarSetter } from "./_components/NavbarSetter";
import { HeroBanner } from "./_components/HeroBanner";

interface Props {
	params: Promise<{ locale: string }>;
}

const cards = [
	{
		href: "/spenden/humanitaere-hilfe",
		image: "/images/donate/Spenden-Syrien.jpg",
		title: "Humanitäres Konto",
		description:
			"Humanitäres Konto für die im Krieg und Katastrophen in Not geratene Assyrier in ihren Heimatländern",
	},
	{
		href: "/spenden/zavd-spendenkonto",
		image: "/images/donate/Association1.jpg",
		title: "ZAVD Spendenkonto",
		description:
			"Unterstützen Sie die Arbeit des ZAVD für Flüchtlinge und Migranten in Deutschland und Europa",
	},
];

export default async function SpendenPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<div className="min-h-screen bg-white">
			<NavbarSetter />

			{/* ── Banner / Hero ── */}
			<HeroBanner
				image="/images/donate/Spenden-Syrien.jpg"
				tag="Helfen Sie uns"
				title="Spenden"
				subtitle="Unterstützen Sie die assyrischen Gemeinschaften in Deutschland und in den Krisengebieten des Nahen Ostens."
				breadcrumbs={[
					{ label: "ZAVD", href: "/" },
					{ label: "Spenden" },
				]}
			/>

			{/* ── Cards Section ── */}
			<div className="bg-[#1a1f2e] py-14">
				<div className="_container">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-10">Spenden</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{cards.map((card) => (
							<Link key={card.href} href={card.href} className="group block">
								{/* Image container */}
								<div className="relative overflow-hidden rounded-t-sm" style={{ height: "340px" }}>
									<Image
										src={card.image}
										alt={card.title}
										fill
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors duration-300" />

									{/* Description text */}
									<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
										<p className="text-white/85 text-sm leading-relaxed max-w-xs">
											{card.description}
										</p>
									</div>

									{/* Link icon on hover */}
									<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
											<Link2 className="w-5 h-5 text-primary" />
										</div>
									</div>
								</div>

								{/* White title banner */}
								<div className="bg-white py-4 px-6 text-center shadow-sm">
									<span className="text-gray-900 font-bold text-base tracking-wide">
										{card.title}
									</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
