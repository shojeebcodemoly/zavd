"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { StorePageData } from "@/lib/repositories/store-page.repository";
import { StoreHero } from "./store-hero";
import { StoreInfo } from "./store-info";
import { StoreOpeningHours } from "./store-opening-hours";
import { StoreMap } from "./store-map";
import { StoreGallery } from "./store-gallery";

interface StorePageClientProps {
	data: StorePageData;
}

export function StorePageClient({ data }: StorePageClientProps) {
	const { sectionVisibility } = data;

	return (
		<main>
			{/* Hero Section */}
			{sectionVisibility.hero && <StoreHero data={data.hero} />}

			{/* Info Section */}
			{sectionVisibility.info && <StoreInfo data={data.info} />}

			{/* Opening Hours and Map - Side by side on larger screens */}
			{(sectionVisibility.openingHours || sectionVisibility.map) && (
				<section className="section-padding bg-muted">
					<div className="_container">
						<motion.div
							initial="initial"
							whileInView="animate"
							viewport={{ once: true, margin: "-100px" }}
							variants={staggerContainer}
							className="grid gap-8 lg:grid-cols-2"
						>
							{sectionVisibility.openingHours && (
								<motion.div variants={fadeUp}>
									<StoreOpeningHours data={data.openingHours} />
								</motion.div>
							)}
							{sectionVisibility.map && (
								<motion.div variants={fadeUp}>
									<StoreMap data={data.map} />
								</motion.div>
							)}
						</motion.div>
					</div>
				</section>
			)}

			{/* Gallery Section */}
			{sectionVisibility.gallery && data.gallery.images && data.gallery.images.length > 0 && (
				<StoreGallery data={data.gallery} />
			)}
		</main>
	);
}
