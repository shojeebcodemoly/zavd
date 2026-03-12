"use client";

import { motion } from "framer-motion";
import { ImageComponent } from "../common/image-component";
import type { ISponsorsSection } from "@/models/home-page.model";

interface SponsorsSectionProps {
	data?: ISponsorsSection;
}

const DEFAULTS = {
	heading: "Unsere Förderer",
	description: "Gefördert durch",
};

export function SponsorsSection({ data }: SponsorsSectionProps) {
	const heading = data?.heading || DEFAULTS.heading;
	const description = data?.description || DEFAULTS.description;
	const backgroundImage = data?.backgroundImage || null;
	const sponsors = data?.sponsors || [];

	return (
		<section className="w-full border-y border-[#e8dfc8] py-10 lg:py-14 relative">
			{/* Background — overflow-hidden scoped here only, so logos are never clipped */}
			<div className="absolute inset-0 overflow-hidden">
				{backgroundImage ? (
					<>
						<ImageComponent
							src={backgroundImage}
							alt="Sponsors section background"
							fill
							className="object-cover object-center"
							showLoader={false}
						/>
						<div className="absolute inset-0 bg-black/35" />
					</>
				) : (
					<div className="absolute inset-0 bg-[#f5f0e8]" />
				)}
			</div>

			<div className="_container relative z-10">
				<div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
					{/* Left: Heading + label */}
					<div className="text-center lg:text-left w-full lg:w-[45%] lg:flex-shrink-0">
						<motion.p
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.55, ease: "easeOut" }}
							className={`text-sm tracking-wide font-normal leading-relaxed mb-3 ${backgroundImage ? "text-white/75" : "text-foreground/60"}`}
						>
							{description}
						</motion.p>
						<motion.h2
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
							className={`text-2xl lg:text-3xl font-bold font-heading capitalize ${backgroundImage ? "text-white" : "text-secondary"}`}
						>
							{heading}
						</motion.h2>
					</div>

					{/* Divider */}
					<div className={`hidden lg:block w-px h-16 flex-shrink-0 ${backgroundImage ? "bg-white/30" : "bg-foreground/20"}`} />

					{/* Sponsor logos */}
					{sponsors.length > 0 ? (
						<div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 lg:gap-12 flex-1">
							{sponsors.map((sponsor, index) => (
								<motion.a
									key={index}
									href={sponsor.href || "#"}
									target={sponsor.href ? "_blank" : undefined}
									rel="noopener noreferrer"
									initial={{ opacity: 0, y: 10 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.4, delay: index * 0.1 }}
									className="group flex flex-col items-center gap-2"
									title={sponsor.name}
								>
									{sponsor.image && (
										<div className="h-24 w-36 flex items-center justify-center">
											<ImageComponent
												src={sponsor.image}
												alt={sponsor.name || "Sponsor logo"}
												width={144}
												height={96}
												className="max-w-full max-h-full object-contain"
												showLoader={false}
											/>
										</div>
									)}
									{sponsor.name && !sponsor.image && (
										<span className={`text-sm font-semibold transition-colors ${backgroundImage ? "text-white/70 group-hover:text-white" : "text-foreground/60 group-hover:text-foreground"}`}>
											{sponsor.name}
										</span>
									)}
								</motion.a>
							))}
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
}
