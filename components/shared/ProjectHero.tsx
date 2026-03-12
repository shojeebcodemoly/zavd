"use client";

import { ImageComponent } from "@/components/common/image-component";
import Link from "next/link";

interface ProjectHeroProps {
	data: {
		backgroundImage?: string;
		title: string;
		breadcrumb?: string;
	};
	defaultTitle?: string;
	defaultBreadcrumb?: string;
	parentHref?: string;
	parentLabel?: string;
}

export function ProjectHero({
	data,
	defaultTitle = "Project",
	defaultBreadcrumb,
	parentHref = "/projekte",
	parentLabel = "Projekte",
}: ProjectHeroProps) {
	const breadcrumbText = data.breadcrumb || defaultBreadcrumb || defaultTitle;

	return (
		<section className="relative w-full h-80 md:h-[440px] lg:h-[560px] flex items-center justify-center overflow-hidden">
			{/* Background image or fallback */}
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

			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black/55" />

			{/* Content */}
			<div className="relative z-10 text-center text-white px-4">
				<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
					{data.title || defaultTitle}
				</h1>
				{/* Breadcrumb */}
				<nav className="flex items-center justify-center gap-2 text-sm text-white/70">
					<Link href="/" className="hover:text-white transition-colors">
						Home
					</Link>
					<span className="text-white/40">/</span>
					<Link href={parentHref} className="hover:text-white transition-colors">
						{parentLabel}
					</Link>
					<span className="text-white/40">/</span>
					<span className="text-white/90">{breadcrumbText}</span>
				</nav>
			</div>
		</section>
	);
}
