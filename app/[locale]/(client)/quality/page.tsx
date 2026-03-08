import type { Metadata } from "next";
import { getQualityPage, getQualityPageSeo } from "@/lib/services/quality-page.service";
import { QualityPageClient } from "./quality-page-client";

export async function generateMetadata(): Promise<Metadata> {
	const seo = await getQualityPageSeo();

	const title = seo?.title || "Quality & Certifications";
	const description =
		seo?.description ||
		"Learn about our quality standards, certifications, and commitment to excellence.";

	return {
		title,
		description,
		keywords: seo?.keywords,
		openGraph: {
			title,
			description,
			...(seo?.ogImage && { images: [{ url: seo.ogImage }] }),
		},
	};
}

export default async function QualityPage() {
	const data = await getQualityPage();

	// Serialize MongoDB object to plain object for client component
	const serializedData = JSON.parse(JSON.stringify(data));

	return <QualityPageClient data={serializedData} />;
}
