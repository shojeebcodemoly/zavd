"use client";

import { ImageComponent } from "@/components/common/image-component";
import type { IKontaktHero } from "@/models/kontakt-page.model";
import Link from "next/link";

interface AnimatedHeroProps {
	data: IKontaktHero;
	isEn?: boolean;
}

export function AnimatedHero({ data, isEn = false }: AnimatedHeroProps) {
	const title = isEn ? (data.titleEn || data.titleDe) : (data.titleDe || data.titleEn);
	const subtitle = isEn ? (data.subtitleEn || data.subtitleDe) : (data.subtitleDe || data.subtitleEn);

	return (
		<section className="relative w-full h-64 md:h-80 lg:h-96 flex items-center justify-center overflow-hidden">
			{/* Background image or fallback */}
			{data.backgroundImage ? (
				<ImageComponent
					src={data.backgroundImage}
					alt={title}
					fill
					className="object-cover"
					priority
				/>
			) : (
				<div className="absolute inset-0 bg-secondary" />
			)}

			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black/55" />

			{/* Content */}
			<div className="relative z-10 text-center text-white px-4">
				<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
					{title || "Contact Us"}
				</h1>
				{/* Breadcrumb */}
				<nav className="flex items-center justify-center gap-2 text-sm text-white/70">
					<Link href="/" className="hover:text-white transition-colors">
						Home
					</Link>
					<span className="text-white/40">/</span>
					<span className="text-white/90">
						{data.breadcrumb || "Contact Us"}
					</span>
				</nav>
			</div>
		</section>
	);
}
