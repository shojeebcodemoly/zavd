"use client";

import { ProductType } from "@/types";
import { ProductHeroNew } from "@/components/products/ProductHeroNew";
import { ProductVariantsSelector } from "@/components/products/ProductVariantsSelector";
import { ProductAccordion } from "@/components/products/ProductAccordion";
import { RelatedProductsCarousel } from "@/components/products/RelatedProductsCarousel";
import { ProductInquiryForm } from "@/components/products/ProductInquiryForm";
import { ProductLongDescription } from "@/components/products/ProductLongDescription";
import { ProductDetailSidebar } from "@/components/products/ProductDetailSidebar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ProductContentProps {
	product: ProductType;
	relatedProducts?: ProductType[];
	/** Base path for navigation (e.g., "/products" or "/products/category/soft-cheese") */
	basePath?: string;
	/** Label for the back button breadcrumb */
	baseLabel?: string;
}

/**
 * Client component for interactive product page elements
 * Receives all data as props from server component
 * New Tillamook-inspired layout with:
 * - Hero section (content left, image right)
 * - Product variants selector
 * - Accordion sections (replaces FAQ)
 * - Related products carousel
 */
export function ProductContent({
	product,
	relatedProducts = [],
	basePath = "/products",
	baseLabel = "Products",
}: ProductContentProps) {
	// Check if we have the new layout data
	const hasNewLayout = product.heroSettings ||
		(product.productVariants && product.productVariants.length > 0) ||
		(product.accordionSections && product.accordionSections.length > 0);

	return (
		<div className="min-h-screen">
			{/* New Hero Section */}
			<ProductHeroNew
				title={product.title}
				shortDescription={product.shortDescription}
				heroSettings={product.heroSettings}
				overviewImage={product.overviewImage}
				productImages={product.productImages}
				productId={product._id || product.id}
				initialLikeCount={product.likeCount || 0}
			/>

			{/* Product Variants Selector */}
			{product.productVariants && product.productVariants.length > 0 && (
				<ProductVariantsSelector
					variants={product.productVariants}
					currentSlug={product.slug}
					categorySlug={product.primaryCategory?.slug || product.categories?.[0]?.slug || "uncategorized"}
				/>
			)}

			{/* Accordion Section (replaces FAQ) */}
			{product.accordionSections && product.accordionSections.length > 0 && (
				<ProductAccordion
					title={product.title}
					shortDescription={product.shortDescription}
					sections={product.accordionSections}
					heroSettings={product.heroSettings}
				/>
			)}

			{/* Additional Content Section (if has extended description or specs) */}
			{(product.productDescription ||
				(product.techSpecifications && product.techSpecifications.length > 0)) && (
				<section className="py-12 md:py-16 bg-background">
					<div className="_container">
						<div className="grid gap-8 lg:grid-cols-[1fr_340px]">
							{/* Main Content */}
							<article className="min-w-0">
								{/* Long Description Section */}
								{product.productDescription && (
									<ProductLongDescription
										description={product.productDescription}
									/>
								)}

								{/* Specifications Section */}
								{product?.techSpecifications &&
									product?.techSpecifications?.length > 0 && (
										<motion.section
											initial={{ opacity: 0, y: 30 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true, margin: "-100px" }}
											transition={{ duration: 0.6 }}
											className="mb-12"
											id="specifications"
										>
											<h2 className="text-2xl md:text-3xl font-medium text-secondary mb-6">
												Technical Specifications
											</h2>
											<div className="rounded-2xl bg-background border border-border/80 shadow-sm overflow-hidden">
												<div className="divide-y divide-border">
													{product?.techSpecifications?.map(
														(spec, index) => (
															<div
																key={index}
																className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 px-6 hover:bg-muted/80 transition-colors duration-200 gap-1 sm:gap-4"
															>
																<span className="font-medium text-foreground">
																	{spec.title}
																</span>
																<span className="text-muted-foreground sm:text-right">
																	{spec.description}
																</span>
															</div>
														)
													)}
												</div>
											</div>
										</motion.section>
									)}
							</article>

							{/* Sidebar */}
							<aside className="space-y-6">
								<div className="lg:sticky lg:top-24 space-y-4">
									<ProductDetailSidebar
										brochureUrl={product.documentation}
										videoUrl={product.youtubeUrl}
										certifications={product.certifications}
									/>
								</div>
							</aside>
						</div>
					</div>
				</section>
			)}

			{/* Treatment Badges */}
			{product?.treatments && product.treatments.length > 0 && (
				<div className="_container py-8">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className="flex flex-wrap gap-2 justify-center"
					>
						{product.treatments.map((treatment) => (
							<Badge
								key={treatment}
								variant="secondary"
								className="bg-primary/10 text-primary hover:bg-primary/20"
							>
								{treatment}
							</Badge>
						))}
					</motion.div>
				</div>
			)}

			{/* Related Products Carousel */}
			{relatedProducts && relatedProducts.length > 0 && (
				<RelatedProductsCarousel
					products={relatedProducts}
					title="You May Also Like"
					currentProductId={product._id || product.id}
				/>
			)}

			{/* Product Inquiry Form */}
			<ProductInquiryForm
				productName={product.title}
				productId={product.id}
				productSlug={product.slug}
			/>
		</div>
	);
}
