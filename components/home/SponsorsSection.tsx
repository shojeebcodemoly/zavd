"use client";

import { motion } from "framer-motion";
import { ImageComponent } from "../common/image-component";
import type { ISponsorsSection } from "@/models/home-page.model";

interface SponsorsSectionProps {
	data?: ISponsorsSection;
	isEn?: boolean;
}

const DEFAULTS = {
	heading: "Sponsors",
	description:
		"We offer the opportunity to sponsor the association. Various options are available, such as sponsoring events or the association itself. Simply contact us at info@zavd.de",
};

export function SponsorsSection({ data, isEn }: SponsorsSectionProps) {
	const heading = (isEn ? data?.headingEn : data?.headingDe) || data?.headingDe || data?.headingEn || DEFAULTS.heading;
	const description = (isEn ? data?.descriptionEn : data?.descriptionDe) || data?.descriptionDe || data?.descriptionEn || DEFAULTS.description;
	const backgroundImage = data?.backgroundImage || null;
	const sponsors = data?.sponsors || [];

	return (
		<section className="w-full border-y border-[#e8dfc8] py-10 lg:py-14 relative">
			{/* Background */}
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
				<div className="flex flex-col items-center text-center gap-4">
					{/* Heading */}
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.55, ease: "easeOut" }}
						className={`text-2xl lg:text-3xl font-bold font-heading capitalize ${backgroundImage ? "text-white" : "text-secondary"}`}
					>
						{heading}
					</motion.h2>

					{/* Description */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
						className={`text-sm leading-relaxed max-w-xl ${backgroundImage ? "text-white/75" : "text-foreground/60"}`}
					>
						{description.split(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})/).map((part, i) =>
						/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/.test(part) ? (
							<a key={i} href={"mailto:" + part} className="text-primary font-semibold hover:underline">{part}</a>
						) : (
							<span key={i}>{part}</span>
						)
					)}
					</motion.p>

					{/* Sponsor logos */}
					{sponsors.length > 0 && (
						<div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 mt-4">
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
					)}
				</div>
			</div>
		</section>
	);
}
