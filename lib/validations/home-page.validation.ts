import { z } from "zod";

/**
 * CTA Button schema - all fields optional to allow saving empty content
 */
export const ctaButtonSchema = z.object({
	textDe: z.string().max(100).optional(),
	textEn: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
	variant: z.enum(["primary", "outline", "secondary"]).optional(),
});

/**
 * Trust Indicator schema - required fields only when adding an indicator
 */
export const trustIndicatorSchema = z.object({
	icon: z.string().max(50).optional(),
	textDe: z.string().max(100).optional(),
	textEn: z.string().max(100).optional(),
});

/**
 * Hero Slide schema - for slider-based hero
 */
export const heroSlideSchema = z.object({
	badgeDe: z.string().max(200).optional(),
	badgeEn: z.string().max(200).optional(),
	titleDe: z.string().max(500).optional(),
	titleEn: z.string().max(500).optional(),
	subtitleDe: z.string().max(1000).optional(),
	subtitleEn: z.string().max(1000).optional(),
	backgroundImage: z.string().optional(),
	ctaTextDe: z.string().max(100).optional(),
	ctaTextEn: z.string().max(100).optional(),
	ctaHref: z.string().max(500).optional(),
	ctaText2De: z.string().max(100).optional(),
	ctaText2En: z.string().max(100).optional(),
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
	badgeDe: z.string().max(200).optional(),
	badgeEn: z.string().max(200).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	titleHighlightDe: z.string().max(200).optional(),
	titleHighlightEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(1000).optional(),
	subtitleEn: z.string().max(1000).optional(),
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
	titleDe: z.string().max(100).optional(),
	titleEn: z.string().max(100).optional(),
	descriptionDe: z.string().max(500).optional(),
	descriptionEn: z.string().max(500).optional(),
});

/**
 * About Section schema - all fields optional
 */
export const aboutSectionSchema = z.object({
	badgeDe: z.string().max(100).optional(),
	badgeEn: z.string().max(100).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	titleHighlightDe: z.string().max(200).optional(),
	titleHighlightEn: z.string().max(200).optional(),
	contentDe: z.string().max(2000).optional(),
	contentEn: z.string().max(2000).optional(),
	image: z.string().optional(),
	benefits: z.array(z.string().max(200)).optional(),
	primaryCta: ctaButtonSchema.optional(),
	secondaryCta: ctaButtonSchema.optional(),
});

/**
 * CTA Section schema - all fields optional
 */
export const ctaSectionSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	phoneTitleDe: z.string().max(100).optional(),
	phoneTitleEn: z.string().max(100).optional(),
	phoneSubtitleDe: z.string().max(200).optional(),
	phoneSubtitleEn: z.string().max(200).optional(),
	emailTitleDe: z.string().max(100).optional(),
	emailTitleEn: z.string().max(100).optional(),
	emailSubtitleDe: z.string().max(200).optional(),
	emailSubtitleEn: z.string().max(200).optional(),
	formTitleDe: z.string().max(100).optional(),
	formTitleEn: z.string().max(100).optional(),
	formSubtitleDe: z.string().max(300).optional(),
	formSubtitleEn: z.string().max(300).optional(),
	formCtaTextDe: z.string().max(100).optional(),
	formCtaTextEn: z.string().max(100).optional(),
	formCtaHref: z.string().max(500).optional(),
});

/**
 * SEO Settings schema
 */
export const homePageSeoSchema = z.object({
	titleDe: z.string().max(100).optional(),
	titleEn: z.string().max(100).optional(),
	descriptionDe: z.string().max(500).optional(),
	descriptionEn: z.string().max(500).optional(),
	ogImage: z.string().optional(),
});

/**
 * Hero Floating Card schema
 */
export const heroFloatingCardSchema = z.object({
	image: z.string().optional(),
	labelDe: z.string().max(100).optional(),
	labelEn: z.string().max(100).optional(),
});

/**
 * Hero Certification Card schema
 */
export const heroCertificationCardSchema = z.object({
	titleDe: z.string().max(100).optional(),
	titleEn: z.string().max(100).optional(),
	subtitleDe: z.string().max(200).optional(),
	subtitleEn: z.string().max(200).optional(),
	progressLabelDe: z.string().max(100).optional(),
	progressLabelEn: z.string().max(100).optional(),
	progressValueDe: z.string().max(50).optional(),
	progressValueEn: z.string().max(50).optional(),
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
 * Gallery Image schema - fields optional to allow partial data
 */
export const galleryImageSchema = z.object({
	src: z.string().optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(300).optional(),
	subtitleEn: z.string().max(300).optional(),
});

/**
 * Image Gallery Section schema
 */
export const imageGallerySectionSchema = z.object({
	badgeDe: z.string().max(100).optional(),
	badgeEn: z.string().max(100).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	images: z.array(galleryImageSchema).optional(),
	ctaTitleDe: z.string().max(200).optional(),
	ctaTitleEn: z.string().max(200).optional(),
	ctaSubtitleDe: z.string().max(300).optional(),
	ctaSubtitleEn: z.string().max(300).optional(),
	ctaButtonTextDe: z.string().max(100).optional(),
	ctaButtonTextEn: z.string().max(100).optional(),
});

/**
 * About Certification Badge schema
 */
export const aboutCertificationBadgeSchema = z.object({
	titleDe: z.string().max(100).optional(),
	titleEn: z.string().max(100).optional(),
	descriptionDe: z.string().max(500).optional(),
	descriptionEn: z.string().max(500).optional(),
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
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(200).optional(),
	subtitleEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(1000).optional(),
	descriptionEn: z.string().max(1000).optional(),
	image: z.string().optional(),
});

/**
 * Testimonials Section schema
 */
export const testimonialsSectionSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	testimonials: z.array(testimonialItemSchema).optional(),
});

/**
 * Promo Banner Item schema
 */
export const promoBannerItemSchema = z.object({
	badgeDe: z.string().max(100).optional(),
	badgeEn: z.string().max(100).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(200).optional(),
	subtitleEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(500).optional(),
	descriptionEn: z.string().max(500).optional(),
	image: z.string().optional(),
	ctaTextDe: z.string().max(100).optional(),
	ctaTextEn: z.string().max(100).optional(),
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
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(500).optional(),
	descriptionEn: z.string().max(500).optional(),
});

/**
 * Feature Banner Section schema
 */
export const featureBannerSectionSchema = z.object({
	image: z.string().optional(),
	titleDe: z.string().max(500).optional(),
	titleEn: z.string().max(500).optional(),
	titleHighlightDe: z.string().max(100).optional(),
	titleHighlightEn: z.string().max(100).optional(),
	features: z.array(featureBannerItemSchema).optional(),
});

/**
 * Partner Logo schema
 */
export const partnerLogoSchema = z.object({
	image: z.string().optional(),
	name: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
	descriptionDe: z.string().max(500).optional(),
	descriptionEn: z.string().max(500).optional(),
});

/**
 * Intro Section schema
 */
export const introSectionSchema = z.object({
	badgeDe: z.string().max(100).optional(),
	badgeEn: z.string().max(100).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	descriptionDe: z.string().max(2000).optional(),
	descriptionEn: z.string().max(2000).optional(),
	ctaTextDe: z.string().max(100).optional(),
	ctaTextEn: z.string().max(100).optional(),
	ctaHref: z.string().max(500).optional(),
	image: z.string().optional(),
	partnerLogos: z.array(partnerLogoSchema).optional(),
});

/**
 * Integration Section schema
 */
export const integrationSectionSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	quoteDe: z.string().max(500).optional(),
	quoteEn: z.string().max(500).optional(),
	descriptionDe: z.string().max(2000).optional(),
	descriptionEn: z.string().max(2000).optional(),
	image: z.string().optional(),
	readMoreLink: z.string().max(500).optional(),
	partnerLogos: z.array(partnerLogoSchema).optional(),
});

/**
 * Sponsors Section schema
 */
export const sponsorsSectionSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(1000).optional(),
	descriptionEn: z.string().max(1000).optional(),
	backgroundImage: z.string().optional(),
	sponsors: z.array(partnerLogoSchema).optional(),
});

/**
 * Volunteering Section schema
 */
export const volunteeringSectionSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(2000).optional(),
	descriptionEn: z.string().max(2000).optional(),
	image: z.string().optional(),
	partnerLogos: z.array(partnerLogoSchema).optional(),
});

/**
 * Partners Carousel Section schema
 */
export const partnersCarouselSectionSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	logos: z.array(partnerLogoSchema).optional(),
});

export const sectionVisibilitySchema = z.object({
	hero: z.boolean().optional(),
	introSection: z.boolean().optional(),
	integrationSection: z.boolean().optional(),
	sponsorsSection: z.boolean().optional(),
	volunteeringSection: z.boolean().optional(),
	partnersCarousel: z.boolean().optional(),
	promoBanner: z.boolean().optional(),
	featureBanner: z.boolean().optional(),
	features: z.boolean().optional(),
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
	promoBanner: promoBannerSectionSchema.partial().optional(),
	featureBanner: featureBannerSectionSchema.partial().optional(),
	features: z.array(featureHighlightSchema).optional(),
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
