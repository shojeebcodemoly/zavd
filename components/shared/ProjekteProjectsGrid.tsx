"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectItem {
	image?: string;
	title?: string;
	description?: string;
	category?: string;
	href?: string;
}

interface ProjekteProjectsGridProps {
	badge?: string;
	heading?: string;
	description?: string;
	categories: string[];
	items: ProjectItem[];
}

export function ProjekteProjectsGrid({
	badge,
	heading,
	description,
	categories,
	items,
}: ProjekteProjectsGridProps) {
	const [active, setActive] = useState("All");

	const filtered =
		active === "All"
			? items
			: items.filter((item) => item.category === active);

	const allCategories = ["All", ...categories];

	return (
		<section className="py-16 md:py-24 bg-slate-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

				{/* Section header */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">
					<div>
						{badge && (
							<p className="text-sm font-semibold text-primary mb-3 tracking-wide">
								{badge}
							</p>
						)}
						{heading && (
							<h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
								{heading}
							</h2>
						)}
					</div>
					{description && (
						<p className="text-slate-500 leading-relaxed text-sm md:text-base lg:pt-8">
							{description}
						</p>
					)}
				</div>

				{/* Category filters */}
				{categories.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-10">
						{allCategories.map((cat) => (
							<button
								key={cat}
								onClick={() => setActive(cat)}
								className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
									active === cat
										? "bg-primary text-white border-primary"
										: "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
								}`}
							>
								{cat}
							</button>
						))}
					</div>
				)}

				{/* Projects grid — 2 columns */}
				{filtered.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
						{filtered.map((item, i) => (
							<div
								key={i}
								className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
							>
								{/* Image */}
								<div className="relative h-72 w-full overflow-hidden">
									{item.image ? (
										<Image
											src={item.image}
											alt={item.title || ""}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-500"
											unoptimized
										/>
									) : (
										<div className="absolute inset-0 bg-slate-200" />
									)}
								</div>

								{/* Content */}
								<div className="p-7">
									{item.title && (
										<h3 className="font-bold text-slate-900 text-xl mb-3 leading-snug">
											{item.title}
										</h3>
									)}
									{item.description && (
										<p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
											{item.description}
										</p>
									)}

									{/* View More */}
									{item.href ? (
										<Link
											href={item.href}
											className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
										>
											View More
											<ArrowRight className="w-4 h-4" />
										</Link>
									) : (
										<span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
											View More
											<ArrowRight className="w-4 h-4" />
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-16 text-slate-400 text-sm">
						No projects found in this category.
					</div>
				)}
			</div>
		</section>
	);
}
