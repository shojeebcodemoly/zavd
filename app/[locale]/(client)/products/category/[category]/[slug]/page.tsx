import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSiteConfig } from "@/config/site";
import { generateProductPageJsonLd } from "@/lib/seo";
import { ProductContent } from "./product-content";
import { categoryRepository } from "@/lib/repositories/category.repository";
import { productRepository } from "@/lib/repositories/product.repository";
import type { ProductType } from "@/types";

/**
 * Product Detail Page
 *
 * URL: /products/category/[category]/[slug]/
 * Shows detailed product information
 */

interface ProductPageProps {
	params: Promise<{
		category: string;
		slug: string;
	}>;
}

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Allow new products to be generated on-demand
export const dynamicParams = true;

/**
 * Generate static params for all published products at build time
 */
export async function generateStaticParams() {
	try {
		const { data: products } = await productRepository.findPublished({
			limit: 1000,
		});

		return products.map((product) => {
			// Use primaryCategory first, then first category, or 'uncategorized' as fallback
			const primaryCat = product.primaryCategory as unknown as { slug?: string } | null;
			const categories = product.categories as unknown as Array<{
				slug?: string;
			}>;
			const categorySlug = primaryCat?.slug || categories?.[0]?.slug || "uncategorized";

			return {
				category: categorySlug,
				slug: product.slug,
			};
		});
	} catch (error) {
		console.error("Error generating static params for products:", error);
		return [];
	}
}

/**
 * Fetch product data server-side using repository directly
 * This avoids fetch calls during SSG which would fail (server not running)
 */
async function getProduct(slug: string): Promise<ProductType | null> {
	try {
		const product = await productRepository.findPublicBySlug(slug);
		if (!product) {
			return null;
		}
		// Convert Mongoose document to plain object for client component
		return JSON.parse(JSON.stringify(product)) as ProductType;
	} catch (error) {
		console.error(`Error fetching product ${slug}:`, error);
		return null;
	}
}

/**
 * Fallback data for uncategorized products
 */
const UNCATEGORIZED_FALLBACK = {
	slug: "uncategorized",
	name: "Uncategorized",
} as const;

/**
 * Get category by slug
 * Returns a fallback object for "uncategorized" products
 */
async function getCategory(categorySlug: string) {
	// Handle uncategorized products
	if (categorySlug === "uncategorized") {
		return UNCATEGORIZED_FALLBACK;
	}

	try {
		return await categoryRepository.findBySlug(categorySlug);
	} catch {
		return null;
	}
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
	params,
}: ProductPageProps): Promise<Metadata> {
	const { category: categorySlug, slug } = await params;
	const [product, siteConfig] = await Promise.all([
		getProduct(slug),
		getSiteConfig(),
	]);

	if (!product) {
		return {
			title: `Product not found | ${siteConfig.name}`,
			description: "The requested product could not be found.",
			robots: { index: false, follow: false },
		};
	}

	const productUrl = `${siteConfig.url}/products/category/${categorySlug}/${product.slug}`;

	const ogImage =
		product.seo?.ogImage ||
		product.overviewImage ||
		product.productImages?.[0] ||
		siteConfig.ogImage;

	const absoluteOgImage = ogImage?.startsWith("http")
		? ogImage
		: `${siteConfig.url}${ogImage}`;

	const title = product.seo?.title || `${product.title} | ${siteConfig.name}`;
	const description =
		product.seo?.description ||
		product.shortDescription ||
		product.description;

	const canonicalUrl = product.seo?.canonicalUrl || productUrl;

	return {
		title,
		description,
		alternates: {
			canonical: canonicalUrl,
		},
		robots: {
			index: !product.seo?.noindex,
			follow: !product.seo?.noindex,
			googleBot: {
				index: !product.seo?.noindex,
				follow: !product.seo?.noindex,
				"max-image-preview": "large",
				"max-snippet": -1,
				"max-video-preview": -1,
			},
		},
		openGraph: {
			type: "website",
			locale: "en_US",
			url: productUrl,
			siteName: siteConfig.name,
			title: product.seo?.title || product.title,
			description,
			images: [
				{
					url: absoluteOgImage,
					width: 1200,
					height: 630,
					alt: product.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: product.seo?.title || product.title,
			description,
			images: [absoluteOgImage],
		},
	};
}

/**
 * Product Page - Server Component
 */
export default async function ProductPage({ params }: ProductPageProps) {
	const { category: categorySlug, slug } = await params;

	// Get category
	const category = await getCategory(categorySlug);
	if (!category) {
		notFound();
	}

	const product = await getProduct(slug);

	if (!product) {
		notFound();
	}

	// Generate JSON-LD schemas
	const jsonLdSchemas = await generateProductPageJsonLd(product);

	return (
		<>
			{/* JSON-LD Structured Data */}
			{jsonLdSchemas.map((schema, index) => (
				<script
					key={`jsonld-${index}`}
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
				/>
			))}

			{/* Product Content with category navigation */}
			<ProductContent
				product={product}
				basePath={`/products/category/${category.slug}`}
				baseLabel={category.name}
			/>
		</>
	);
}
