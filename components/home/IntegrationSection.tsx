"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ImageComponent } from "../common/image-component";
import type { IIntegrationSection } from "@/models/home-page.model";

interface IntegrationSectionProps {
	data?: IIntegrationSection;
}

const DEFAULTS = {
	heading: "Integration",
	quote: "Make a difference together and pave the way to German society together!",
	description:
		"This is a central document for the integration of the Assyrian diaspora into the majority society in Germany. The integration commissioner is the central point of contact for all integration matters of refugees in German society. This makes an extraordinarily ambitious activity. They lay the foundations for effectively integrating 400 to 600 newly-arrived participants annually, which makes the often difficult and many cases overwhelming journey to integration much more attainable and helps the whole community grow stronger together.",
	readMoreLink: "/themen/integration",
};

// Stagger container for left text items
const textContainerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.13,
			delayChildren: 0.1,
		},
	},
};

// Each text item slides up from bottom
const textItemVariants = {
	hidden: { opacity: 0, y: 28 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
	},
};

// Stagger container for partner logos
const logosContainerVariants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const logoItemVariants = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: "easeOut" },
	},
};

// Image: scale+fade reveal, then continuous float
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
	const readMoreLink = data?.readMoreLink || DEFAULTS.readMoreLink;
	const image = data?.image;
	const partnerLogos = data?.partnerLogos || [];

	return (
		<section className="w-full bg-white pt-8 pb-16 lg:pb-24 overflow-visible relative z-10">
			<div className="_container">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-stretch">
					{/* Left: Text Content — staggered bottom-up */}
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

						{readMoreLink && (
							<motion.div variants={textItemVariants} className="pt-2">
								<Link
									href={readMoreLink}
									className="inline-flex items-center text-primary font-semibold hover:underline text-sm lg:text-base"
								>
									Read more…
								</Link>
							</motion.div>
						)}

						{/* Partner Logos — each logo fades+slides up with stagger */}
						{partnerLogos.length > 0 && (
							<motion.div
								variants={logosContainerVariants}
								className="flex flex-wrap gap-8 items-center pt-4"
							>
								{partnerLogos.map((partner, index) => (
									<motion.a
										key={index}
										variants={logoItemVariants}
										href={partner.href || "#"}
										target="_blank"
										rel="noopener noreferrer"
										whileHover={{ scale: 1.08 }}
										transition={{ type: "spring", stiffness: 300, damping: 20 }}
										className="flex flex-col items-center gap-2 group"
									>
										{partner.image && (
											<div className="w-24 h-16 relative flex items-center justify-center">
												<ImageComponent
													src={partner.image}
													alt={partner.name || "Partner logo"}
													height={64}
													width={96}
													className="max-w-full max-h-full object-contain"
												/>
											</div>
										)}
										{partner.name && (
											<span className="text-xs text-foreground/50 text-center max-w-[100px] leading-tight">
												{partner.name}
											</span>
										)}
									</motion.a>
								))}
							</motion.div>
						)}
					</motion.div>

					{/* Right: Image — scale+fade reveal, subtle float, hover lift */}
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
								<ImageComponent
									src={image}
									alt={heading}
									fill
									className="object-cover object-center"
									showLoader={false}
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
