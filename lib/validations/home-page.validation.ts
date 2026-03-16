import { z } from "zod";

/**
 * CTA Button schema - all fields optional to allow saving empty content
 */
export const ctaButtonSchema = z.object({
	text: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
	variant: z.enum(["primary", "outline", "secondary"]).optional(),
});

/**
 * Trust Indicator schema - required fields only when adding an indicator
 */
export const trustIndicatorSchema = z.object({
	icon: z.string().max(50).optional(),
	text: z.string().max(100).optional(),
});

/**
 * Hero Slide schema - for slider-based hero
 */
export const heroSlideSchema = z.object({
	badge: z.string().max(200).optional(),
	title: z.string().max(500).optional(),
	subtitle: z.string().max(1000).optional(),
	backgroundImage: z.string().optional(),
	ctaText: z.string().max(100).optional(),
	ctaHref: z.string().max(500).optional(),
	ctaText2: z.string().max(100).optional(),
	ctaHref2: z.string().max(500).optional(),
	isActive: z.boolean().optional(),
});

/**
 * Hero Section schema - all fields optional to allow empty content
 * Supports both single hero and slider mode
 */
export const heroSectionSchema = z.object({
	// Slider mode fields
	isSlider: z.boolean().optional(),
	slides: z.array(heroSlideSchema).optional(),
	autoPlayInterval: z.preprocess(
		(val) => (val === 0 || val === null || val === undefined ? undefined : Number(val)),
		z.number().min(1000).max(30000).optional()
	),
	showArrows: z.boolean().optional(),
	// Legacy single hero fields
	badge: z.string().max(200).optional(),
	title: z.string().max(200).optional(),
	titleHighlight: z.string().max(200).optional(),
	subtitle: z.string().max(1000).optional(),
	primaryCta: ctaButtonSchema.optional(),
	secondaryCta: ctaButtonSchema.optional(),
	backgroundImage: z.string().optional(),
	mainImage: z.string().optional(),
	mobileImage: z.string().optional(),
	trustIndicators: z.array(trustIndicatorSchema).optional(),
});

/**
 * Feature Highlight schema - required fields only when adding a feature
 */
export const featureHighlightSchema = z.object({
	icon: z.string().max(50).optional(),
	title: z.string().max(100).optional(),
	description: z.string().max(500).optional(),
});

/**
 * About Section schema - all fields optional
 */
export const aboutSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	titleHighlight: z.string().max(200).optional(),
	content: z.string().max(2000).optional(),
	image: z.string().optional(),
	benefits: z.array(z.string().max(200)).optional(),
	primaryCta: ctaButtonSchema.optional(),
	secondaryCta: ctaButtonSchema.optional(),
});

/**
 * CTA Section schema - all fields optional
 */
export const ctaSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	phoneTitle: z.string().max(100).optional(),
	phoneSubtitle: z.string().max(200).optional(),
	emailTitle: z.string().max(100).optional(),
	emailSubtitle: z.string().max(200).optional(),
	formTitle: z.string().max(100).optional(),
	formSubtitle: z.string().max(300).optional(),
	formCtaText: z.string().max(100).optional(),
	formCtaHref: z.string().max(500).optional(),
});

/**
 * SEO Settings schema
 */
export const homePageSeoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(500).optional(),
	ogImage: z.string().optional(),
});

/**
 * Hero Floating Card schema
 */
export const heroFloatingCardSchema = z.object({
	image: z.string().optional(),
	label: z.string().max(100).optional(),
});

/**
 * Hero Certification Card schema
 */
export const heroCertificationCardSchema = z.object({
	title: z.string().max(100).optional(),
	subtitle: z.string().max(200).optional(),
	progressLabel: z.string().max(100).optional(),
	progressValue: z.string().max(50).optional(),
	progressPercentage: z.number().min(0).max(100).optional(),
});

/**
 * Extended Hero Section schema with floating/certification cards
 */
export const heroSectionExtendedSchema = heroSectionSchema.extend({
	floatingCard: heroFloatingCardSchema.optional(),
	certificationCard: heroCertificationCardSchema.optional(),
});

/**
 * Product Showcase Item schema - fields optional to allow partial data
 */
export const productShowcaseItemSchema = z.object({
	name: z.string().max(200).optional(),
	category: z.string().max(100).optional(),
	description: z.string().max(500).optional(),
	status: z.string().max(50).optional(),
	image: z.string().optional(),
	href: z.string().optional(),
});

/**
 * Product Showcase Section schema
 */
export const productShowcaseSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	ctaText: z.string().max(100).optional(),
	ctaHref: z.string().max(500).optional(),
	products: z.array(productShowcaseItemSchema).optional(),
});

/**
 * Gallery Image schema - fields optional to allow partial data
 */
export const galleryImageSchema = z.object({
	src: z.string().optional(),
	title: z.string().max(200).optional(),
	subtitle: z.string().max(300).optional(),
});

/**
 * Image Gallery Section schema
 */
export const imageGallerySectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	images: z.array(galleryImageSchema).optional(),
	ctaTitle: z.string().max(200).optional(),
	ctaSubtitle: z.string().max(300).optional(),
	ctaButtonText: z.string().max(100).optional(),
});

/**
 * About Certification Badge schema
 */
export const aboutCertificationBadgeSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(500).optional(),
});

/**
 * Extended About Section schema with certification badge
 */
export const aboutSectionExtendedSchema = aboutSectionSchema.extend({
	certificationBadge: aboutCertificationBadgeSchema.optional(),
});

/**
 * Testimonial Item schema - fields optional to allow partial data
 */
export const testimonialItemSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(200).optional(),
	description: z.string().max(1000).optional(),
	image: z.string().optional(),
});

/**
 * Testimonials Section schema
 */
export const testimonialsSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	testimonials: z.array(testimonialItemSchema).optional(),
});

/**
 * Category Showcase Section schema
 */
export const categoryShowcaseSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	maxCategories: z.number().min(1).max(12).optional(),
});

/**
 * Product Carousel Section schema
 */
export const productCarouselSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	maxProducts: z.number().min(3).max(12).optional(),
});

/**
 * Promo Banner Item schema
 */
export const promoBannerItemSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	subtitle: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
	image: z.string().optional(),
	ctaText: z.string().max(100).optional(),
	ctaHref: z.string().max(500).optional(),
});

/**
 * Promo Banner Section schema
 */
export const promoBannerSectionSchema = z.object({
	leftBanner: promoBannerItemSchema.optional(),
	rightBanner: promoBannerItemSchema.optional(),
});

/**
 * Feature Banner Item schema
 */
export const featureBannerItemSchema = z.object({
	icon: z.string().max(50).optional(),
	title: z.string().max(200).optional(),
	description: z.string().max(500).optional(),
});

/**
 * Feature Banner Section schema
 */
export const featureBannerSectionSchema = z.object({
	image: z.string().optional(),
	title: z.string().max(500).optional(),
	titleHighlight: z.string().max(100).optional(),
	features: z.array(featureBannerItemSchema).optional(),
});

/**
 * Partner Logo schema
 */
export const partnerLogoSchema = z.object({
	image: z.string().optional(),
	name: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
	description: z.string().max(500).optional(),
});

/**
 * Intro Section schema
 */
export const introSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	description: z.string().max(2000).optional(),
	ctaText: z.string().max(100).optional(),
	ctaHref: z.string().max(500).optional(),
	image: z.string().optional(),
	partnerLogos: z.array(partnerLogoSchema).optional(),
});

/**
 * Integration Section schema
 */
export const integrationSectionSchema = z.object({
	heading: z.string().max(200).optional(),
	quote: z.string().max(500).optional(),
	description: z.string().max(2000).optional(),
	image: z.string().optional(),
	readMoreLink: z.string().max(500).optional(),
	partnerLogos: z.array(partnerLogoSchema).optional(),
});

/**
 * Sponsors Section schema
 */
export const sponsorsSectionSchema = z.object({
	heading: z.string().max(200).optional(),
	description: z.string().max(1000).optional(),
	backgroundImage: z.string().optional(),
	sponsors: z.array(partnerLogoSchema).optional(),
});

/**
 * Volunteering Section schema
 */
export const volunteeringSectionSchema = z.object({
	heading: z.string().max(200).optional(),
	description: z.string().max(2000).optional(),
	image: z.string().optional(),
	partnerLogos: z.array(partnerLogoSchema).optional(),
});

/**
 * Partners Carousel Section schema
 */
export const partnersCarouselSectionSchema = z.object({
	heading: z.string().max(200).optional(),
	logos: z.array(partnerLogoSchema).optional(),
});

export const sectionVisibilitySchema = z.object({
	hero: z.boolean().optional(),
	introSection: z.boolean().optional(),
	integrationSection: z.boolean().optional(),
	sponsorsSection: z.boolean().optional(),
	volunteeringSection: z.boolean().optional(),
	partnersCarousel: z.boolean().optional(),
	categoryShowcase: z.boolean().optional(),
	productCarousel: z.boolean().optional(),
	promoBanner: z.boolean().optional(),
	featureBanner: z.boolean().optional(),
	features: z.boolean().optional(),
	productShowcase: z.boolean().optional(),
	imageGallery: z.boolean().optional(),
	about: z.boolean().optional(),
	testimonials: z.boolean().optional(),
	cta: z.boolean().optional(),
	richContent: z.boolean().optional(),
});

/**
 * Update Home Page schema
 */
export const updateHomePageSchema = z.object({
	sectionVisibility: sectionVisibilitySchema.optional(),
	hero: heroSectionExtendedSchema.partial().optional(),
	introSection: introSectionSchema.partial().optional(),
	categoryShowcase: categoryShowcaseSectionSchema.partial().optional(),
	productCarousel: productCarouselSectionSchema.partial().optional(),
	promoBanner: promoBannerSectionSchema.partial().optional(),
	featureBanner: featureBannerSectionSchema.partial().optional(),
	features: z.array(featureHighlightSchema).optional(),
	productShowcase: productShowcaseSectionSchema.partial().optional(),
	imageGallery: imageGallerySectionSchema.partial().optional(),
	aboutSection: aboutSectionExtendedSchema.partial().optional(),
	testimonialsSection: testimonialsSectionSchema.partial().optional(),
	ctaSection: ctaSectionSchema.partial().optional(),
	integrationSection: integrationSectionSchema.partial().optional(),
	sponsorsSection: sponsorsSectionSchema.partial().optional(),
	volunteeringSection: volunteeringSectionSchema.partial().optional(),
	partnersCarouselSection: partnersCarouselSectionSchema.partial().optional(),
	seo: homePageSeoSchema.partial().optional(),
	richContent: z.string().optional(),
});

// Type exports
export type CtaButtonInput = z.infer<typeof ctaButtonSchema>;
export type TrustIndicatorInput = z.infer<typeof trustIndicatorSchema>;
export type HeroSectionInput = z.infer<typeof heroSectionSchema>;
export type FeatureHighlightInput = z.infer<typeof featureHighlightSchema>;
export type AboutSectionInput = z.infer<typeof aboutSectionSchema>;
export type CtaSectionInput = z.infer<typeof ctaSectionSchema>;
export type HomePageSeoInput = z.infer<typeof homePageSeoSchema>;
export type UpdateHomePageInput = z.infer<typeof updateHomePageSchema>;
