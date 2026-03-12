import { ImageComponent } from "@/components/common/image-component";
import Link from "next/link";
import type { IKontaktHero } from "@/models/kontakt-page.model";

interface KontaktHeroProps {
	data: IKontaktHero;
}

export function KontaktHero({ data }: KontaktHeroProps) {
	return (
		<section className="relative w-full h-80 md:h-[420px] lg:h-[500px] flex items-center overflow-hidden">
			{/* Background */}
			{data.backgroundImage ? (
				<ImageComponent
					src={data.backgroundImage}
					alt={data.title}
					fill
					className="object-cover"
					priority
				/>
			) : (
				<div className="absolute inset-0 bg-secondary" />
			)}

			{/* Overlay */}
			<div className="absolute inset-0 bg-black/55" />

			{/* Text — left aligned */}
			<div className="relative z-10 w-full _container">
				<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-3">
					{data.title || "Contact Us"}
				</h1>
				<nav className="flex items-center gap-2 text-sm text-white/70">
					<Link href="/" className="hover:text-white transition-colors">
						Home
					</Link>
					<span className="text-white/40">›</span>
					<span className="text-white/90">
						{data.breadcrumb || "Contact Us"}
					</span>
				</nav>
			</div>
		</section>
	);
}
