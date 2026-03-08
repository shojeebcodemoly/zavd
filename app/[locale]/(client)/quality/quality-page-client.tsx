"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";
import { ImageComponent } from "@/components/common/image-component";
import type { QualityPageData } from "@/lib/repositories/quality-page.repository";

interface QualityPageClientProps {
	data: QualityPageData;
}

export function QualityPageClient({ data }: QualityPageClientProps) {
	// Set navbar variant
	useSetNavbarVariant("default");

	const visibility = data.sectionVisibility || {
		hero: true,
		certificates: true,
		description: true,
	};

	// Sort certificates by order
	const sortedCertificates = [...(data.certificates || [])].sort(
		(a, b) => (a.order || 0) - (b.order || 0)
	);

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			{visibility.hero && (
				<section
					className="relative py-20 md:py-28 lg:py-32 overflow-hidden"
					style={{
						backgroundImage: data.hero?.backgroundImage
							? `url(${data.hero.backgroundImage})`
							: undefined,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				>
					{/* Overlay for background image */}
					{data.hero?.backgroundImage && (
						<div className="absolute inset-0 bg-black/40" />
					)}

					<div className="_container relative z-10">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							animate="animate"
							className="text-center"
						>
							{data.hero?.badge && (
								<motion.p
									variants={fadeUp}
									className={`text-sm uppercase tracking-[0.3em] mb-4 ${
										data.hero?.backgroundImage ? "text-white/80" : "text-primary"
									}`}
								>
									{data.hero.badge}
								</motion.p>
							)}

							<motion.h1
								variants={fadeUp}
								className={`text-4xl md:text-5xl lg:text-6xl font-medium mb-6 ${
									data.hero?.backgroundImage ? "text-white" : "text-secondary"
								}`}
							>
								{data.hero?.title || "Our"}{" "}
								<span className={data.hero?.backgroundImage ? "text-amber-300" : "text-primary"}>
									{data.hero?.titleHighlight || "Certifications"}
								</span>
							</motion.h1>

							{data.hero?.subtitle && (
								<motion.p
									variants={fadeUp}
									className={`text-lg md:text-xl max-w-2xl mx-auto ${
										data.hero?.backgroundImage ? "text-white/90" : "text-muted-foreground"
									}`}
								>
									{data.hero.subtitle}
								</motion.p>
							)}
						</motion.div>
					</div>
				</section>
			)}

			{/* Certificates Section */}
			{visibility.certificates && sortedCertificates.length > 0 && (
				<section className="py-16 md:py-20 lg:py-24 bg-muted">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
						>
							{sortedCertificates.map((cert, index) => (
								<motion.div
									key={cert._id?.toString() || index}
									variants={fadeUp}
									className="bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
								>
									{/* Certificate Image */}
									{cert.image && (
										<div className="relative aspect-[4/3] bg-muted">
											<ImageComponent
												src={cert.image}
												alt={cert.title || "Certificate"}
												className="w-full h-full object-contain p-4"
												width={400}
												height={300}
											/>
										</div>
									)}

									{/* Certificate Info */}
									<div className="p-6">
										{cert.title && (
											<h3 className="text-xl font-medium text-secondary mb-2">
												{cert.title}
											</h3>
										)}
										{cert.description && (
											<p className="text-muted-foreground text-sm">
												{cert.description}
											</p>
										)}
									</div>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>
			)}

			{/* Description Section */}
			{visibility.description && (data.description?.title || data.description?.content) && (
				<section className="py-16 md:py-20 lg:py-24 bg-background">
					<div className="_container">
						<motion.div
							variants={staggerContainer}
							initial="initial"
							whileInView="animate"
							viewport={{ once: true }}
							className="max-w-4xl mx-auto"
						>
							{data.description?.title && (
								<motion.h2
									variants={fadeUp}
									className="text-3xl md:text-4xl font-medium text-secondary text-center mb-8"
								>
									{data.description.title}
								</motion.h2>
							)}

							{data.description?.content && (
								<motion.div
									variants={fadeUp}
									className="prose prose-lg max-w-none prose-headings:text-secondary prose-a:text-primary"
									dangerouslySetInnerHTML={{ __html: data.description.content }}
								/>
							)}
						</motion.div>
					</div>
				</section>
			)}

			{/* Empty State */}
			{!visibility.hero &&
				!visibility.certificates &&
				!visibility.description && (
					<section className="py-20 md:py-28 lg:py-32">
						<div className="_container">
							<div className="text-center">
								<h1 className="text-3xl md:text-4xl font-medium text-secondary mb-4">
									Quality & Certifications
								</h1>
								<p className="text-muted-foreground">
									Content coming soon. Please check back later.
								</p>
							</div>
						</div>
					</section>
				)}
		</div>
	);
}
