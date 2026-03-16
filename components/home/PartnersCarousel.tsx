"use client";

import { LogoSlider } from "@/components/common/logo-slider";
import type { IPartnersCarouselSection } from "@/models/home-page.model";

interface PartnersCarouselProps {
	data?: IPartnersCarouselSection;
}

export function PartnersCarousel({ data }: PartnersCarouselProps) {
	return (
		<LogoSlider
			logos={data?.logos || []}
			heading={data?.heading}
		/>
	);
}
