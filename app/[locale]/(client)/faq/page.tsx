import type { Metadata } from "next";
import { faqPageService } from "@/lib/services/faq-page.service";
import { FAQPageClient } from "./faq-page-client";

export async function generateMetadata(): Promise<Metadata> {
	const data = await faqPageService.getFAQPage();

	return {
		title: data.seo?.title || "FAQ - Frequently Asked Questions",
		description:
			data.seo?.description ||
			"Have questions about ZAVD services, community programs, or support? Find answers to the most common questions here. Contact us if you don't find what you're looking for.",
		keywords: data.seo?.keywords || [
			"FAQ",
			"frequently asked questions",
			"ZAVD questions",
			"community organization",
			"Assyrian community",
			"NGO support",
			"support",
		],
		openGraph: {
			title: data.seo?.title || "FAQ - Frequently Asked Questions | ZAVD",
			description:
				data.seo?.description ||
				"Answers to the most common questions about ZAVD community programs and services.",
			type: "website",
			locale: "en_US",
			...(data.seo?.ogImage && { images: [data.seo.ogImage] }),
		},
		twitter: {
			card: "summary_large_image",
			title: data.seo?.title || "FAQ - Frequently Asked Questions | ZAVD",
			description:
				data.seo?.description ||
				"Answers to the most common questions about ZAVD community programs and services.",
		},
	};
}

export default async function FAQPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const data = await faqPageService.getFAQPage();

	// Serialize MongoDB object to plain object for client component
	const serializedData = JSON.parse(JSON.stringify(data));

	return <FAQPageClient data={serializedData} isEn={locale === "en"} />;
}
