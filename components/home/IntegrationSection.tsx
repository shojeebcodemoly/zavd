"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { IIntegrationSection } from "@/models/home-page.model";

interface IntegrationSectionProps {
	data?: IIntegrationSection;
}

const DEFAULTS = {
	heading: "Integration",
	quote: "Make a difference together and pave the way to German society together!",
	description:
		"This is a central document for the integration of the Assyrian diaspora into the majority society in Germany. The integration commissioner is the central point of contact for all integration matters of refugees in German society. This makes an extraordinarily ambitious activity. They lay the foundations for effectively integrating 400 to 600 newly-arrived participants annually, which makes the often difficult and many cases overwhelming journey to integration much more attainable and helps the whole community grow stronger together.",
};

const textContainerVariants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.13, delayChildren: 0.1 },
	},
};

const textItemVariants = {
	hidden: { opacity: 0, y: 28 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
	},
};

const imageRevealVariants = {
	hidden: { opacity: 0, scale: 0.92, y: 24 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.25 },
	},
};

export function IntegrationSection({ data }: IntegrationSectionProps) {
	const heading = data?.heading || DEFAULTS.heading;
	const quote = data?.quote || DEFAULTS.quote;
	const description = data?.description || DEFAULTS.description;
	const image = data?.image;
	const partnerLogos = data?.partnerLogos || [];

	return (
		<section className="w-full bg-white pt-8 pb-16 lg:pb-24 overflow-visible relative z-10">
			<div className="_container">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-stretch">
					{/* Left: Text Content + Partner Logos */}
					<div className="flex flex-col gap-6">
						{/* Animated text block */}
						<motion.div
							variants={textContainerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.2 }}
							className="flex flex-col gap-6"
						>
							<motion.h2
								variants={textItemVariants}
								className="text-3xl lg:text-4xl font-bold text-secondary font-heading"
							>
								{heading}
							</motion.h2>

							<motion.p
								variants={textItemVariants}
								className="text-base lg:text-lg font-semibold text-foreground/80 leading-relaxed"
							>
								{quote}
							</motion.p>

							<motion.p
								variants={textItemVariants}
								className="text-sm lg:text-base text-foreground/70 leading-relaxed"
							>
								{description}
							</motion.p>
						</motion.div>

						{/* Partner Logos — outside motion context to prevent compositing clip */}
						{partnerLogos.length > 0 && (
							<div className="pt-2">
								<div className="grid grid-cols-2 gap-x-8 gap-y-8">
									{partnerLogos.map((partner, index) => (
										<a
											key={index}
											href={partner.href || "#"}
											target="_blank"
											rel="noopener noreferrer"
											className="flex flex-col items-center gap-2 group hover:opacity-80 transition-opacity"
										>
											{partner.image && (
												<div className="w-36 h-24 flex items-center justify-center flex-shrink-0">
													<Image
														src={partner.image}
														alt={partner.name || "Partner logo"}
														height={96}
														width={144}
														className="max-w-full max-h-full object-contain"
														unoptimized
													/>
												</div>
											)}
											{partner.name && (
												<span className="text-xs text-foreground/70 text-center leading-normal font-semibold">
													{partner.name}
												</span>
											)}
											{partner.description && (
												<span className="text-xs text-foreground/50 text-center leading-snug">
													{partner.description}
												</span>
											)}
										</a>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Right: Image */}
					<motion.div
						variants={imageRevealVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						className="self-stretch flex mt-[-80px] lg:mt-[-120px]"
					>
						{image ? (
							<motion.div
								animate={{ y: [0, -8, 0] }}
								transition={{
									duration: 5,
									repeat: Infinity,
									ease: "easeInOut",
									repeatType: "loop",
								}}
								whileHover={{ scale: 1.02, y: -12 }}
								className="relative w-full rounded-lg overflow-hidden shadow-lg"
								style={{ transition: "box-shadow 0.3s ease" }}
							>
								<Image
									src={image}
									alt={heading}
									fill
									className="object-cover object-center"
									unoptimized
								/>
							</motion.div>
						) : (
							<div className="relative w-full max-w-sm flex items-center justify-center p-8">
								<div className="w-40 h-40 rounded-full bg-secondary/10 flex items-center justify-center">
									<div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
										<span className="text-4xl font-bold text-primary">Z</span>
									</div>
								</div>
							</div>
						)}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
