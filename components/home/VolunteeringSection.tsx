"use client";

import { motion } from "framer-motion";
import { ImageComponent } from "../common/image-component";
import type { IVolunteeringSection } from "@/models/home-page.model";

interface VolunteeringSectionProps {
	data?: IVolunteeringSection;
}

const DEFAULTS = {
	heading: "Volunteering",
	description:
		"Would you like to volunteer? Contact us by email at info@zavd.de and tell us your area of interest. We support our member associations and volunteers in the further training and professionalization of their structures. As part of our empowerment approach, we have launched a training series that specifically addresses the framework conditions of migrant associations.",
	image: "",
};

export function VolunteeringSection({ data }: VolunteeringSectionProps) {
	const heading = data?.heading || DEFAULTS.heading;
	const description = data?.description || DEFAULTS.description;
	const image = data?.image;
	const partnerLogos = data?.partnerLogos || [];

	const descriptionParagraphs = description.split("\n\n").filter(Boolean);

	return (
		<section className="w-full py-12 lg:py-20 bg-white">
			<div className="_container">
			<div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px] gap-8 lg:gap-16 items-center">
				{/* Left: Image */}
				<div className="relative min-h-[300px] lg:min-h-[520px] overflow-hidden rounded-xl">
					{image ? (
						<ImageComponent
							src={image}
							alt={heading}
							fill
							className="object-cover object-center"
							showLoader={false}
						/>
					) : (
						<div className="w-full h-full bg-muted flex items-center justify-center min-h-[300px] lg:min-h-[520px]">
							<span className="text-muted-foreground text-sm">Upload an image</span>
						</div>
					)}
				</div>

				{/* Right: Light content */}
				<div className="flex items-center">
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="flex flex-col gap-5 w-full"
					>
						{/* Label */}
						<div className="flex items-center gap-3">
							<span className="w-8 h-px bg-primary block" />
							<span className="text-primary text-sm font-medium tracking-wide">
								{heading}
							</span>
						</div>

						{/* Heading */}
						<h2 className="text-3xl lg:text-4xl font-bold text-foreground font-heading leading-tight">
							{heading}
						</h2>

						{/* Description */}
						<div className="flex flex-col gap-4">
							{descriptionParagraphs.map((para, i) => (
								<p key={i} className="text-muted-foreground text-sm lg:text-base leading-relaxed">
									{para.split(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})/).map((part, j) =>
										/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/.test(part) ? (
											<a key={j} href={"mailto:" + part} className="text-primary font-semibold hover:underline">{part}</a>
										) : (
											<span key={j}>{part}</span>
										)
									)}
								</p>
							))}
						</div>

						{/* Partner Logos */}
						{partnerLogos.length > 0 && (
							<div className="flex flex-wrap gap-4 lg:gap-6 items-center pt-2">
								{partnerLogos.map((partner, index) => (
									<motion.a
										key={index}
										href={partner.href || "#"}
										target={partner.href ? "_blank" : undefined}
										rel="noopener noreferrer"
										initial={{ opacity: 0, y: 10 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.4, delay: index * 0.1 }}
										className="bg-muted rounded-md p-2 w-20 h-14 flex items-center justify-center hover:scale-105 transition-transform duration-200"
										title={partner.name}
									>
										{partner.image && (
											<ImageComponent
												src={partner.image}
												alt={partner.name || "Partner logo"}
												height={40}
												width={64}
												className="max-w-full max-h-full object-contain"
											/>
										)}
									</motion.a>
								))}
							</div>
						)}
					</motion.div>
				</div>
			</div>
			</div>
		</section>
	);
}
