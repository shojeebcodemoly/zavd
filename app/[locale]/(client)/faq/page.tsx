import type { Metadata } from "next";
import { faqPageService } from "@/lib/services/faq-page.service";
import { FAQPageClient } from "./faq-page-client";

export async function generateMetadata(): Promise<Metadata> {
	const data = await faqPageService.getFAQPage();

	return {
		title: data.seo?.title || "FAQ - Frequently Asked Questions",
		description:
			data.seo?.description ||
			"Have questions about our artisan cheese products, farm tours, or services? Find answers to the most common questions here. Contact us if you don't find what you're looking for.",
		keywords: data.seo?.keywords || [
			"FAQ",
			"frequently asked questions",
			"cheese questions",
			"dairy farm",
			"artisan cheese",
			"farm tours",
			"support",
		],
		openGraph: {
			title: data.seo?.title || "FAQ - Frequently Asked Questions | Milatte Farm",
			description:
				data.seo?.description ||
				"Answers to the most common questions about our cheese products, farm tours, and services.",
			type: "website",
			locale: "en_US",
			...(data.seo?.ogImage && { images: [data.seo.ogImage] }),
		},
		twitter: {
			card: "summary_large_image",
			title: data.seo?.title || "FAQ - Frequently Asked Questions | Milatte Farm",
			description:
				data.seo?.description ||
				"Answers to the most common questions about our cheese products, farm tours, and services.",
		},
	};
}

export default async function FAQPage() {
	const data = await faqPageService.getFAQPage();

	// Serialize MongoDB object to plain object for client component
	const serializedData = JSON.parse(JSON.stringify(data));

	return <FAQPageClient data={serializedData} />;
}
