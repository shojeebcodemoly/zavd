"use client";

import { LogoSlider } from "@/components/common/logo-slider";
import type { IPartnersCarouselSection } from "@/models/home-page.model";

interface PartnersCarouselProps {
	data?: IPartnersCarouselSection;
	isEn?: boolean;
}

export function PartnersCarousel({ data, isEn }: PartnersCarouselProps) {
	const heading = (isEn ? data?.headingEn : data?.headingDe) || data?.headingDe || data?.headingEn;

	return (
		<LogoSlider
			logos={data?.logos || []}
			heading={heading}
		/>
	);
}
