import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * CTA Button interface - all fields optional to allow empty content
 */
export interface ICtaButton {
	textDe?: string;
	textEn?: string;
	href?: string;
	variant?: "primary" | "outline" | "secondary";
}

/**
 * Hero Floating Card interface (top right card with image)
 */
export interface IHeroFloatingCard {
	image?: string;
	labelDe?: string;
	labelEn?: string;
}

/**
 * Hero Certification Card interface (bottom left card)
 */
export interface IHeroCertificationCard {
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	progressLabelDe?: string;
	progressLabelEn?: string;
	progressValueDe?: string;
	progressValueEn?: string;
	progressPercentage?: number;
}

/**
 * Hero Slide interface - for slider-based hero
 */
export interface IHeroSlide {
	badgeDe?: string;
	badgeEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	backgroundImage?: string;
	ctaTextDe?: string;
	ctaTextEn?: string;
	ctaHref?: string;
	ctaText2De?: string;
	ctaText2En?: string;
	ctaHref2?: string;
	isActive?: boolean;
}

/**
 * Hero Section interface - all fields optional to allow empty content
 * Supports both single hero and slider mode
 */
export interface IHeroSection {
	/** Enable slider mode (multiple slides) vs single hero */
	isSlider?: boolean;
	/** Slides for slider mode */
	slides?: IHeroSlide[];
	/** Auto-play interval in milliseconds (default: 5000) */
	autoPlayInterval?: number;
	/** Show navigation arrows on slider (default: true) */
	showArrows?: boolean;
	/** Legacy single hero fields (used when isSlider is false) */
	badgeDe?: string;
	badgeEn?: string;
	titleDe?: string;
	titleEn?: string;
	titleHighlightDe?: string;
	titleHighlightEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	primaryCta?: ICtaButton;
	secondaryCta?: ICtaButton;
	backgroundImage?: string;
	mainImage?: string;
	/** Separate mobile image for responsive hero (full-height on mobile) */
	mobileImage?: string;
	trustIndicators?: Array<{
		icon?: string;
		textDe?: string;
		textEn?: string;
	}>;
	floatingCard?: IHeroFloatingCard;
	certificationCard?: IHeroCertificationCard;
}

/**
 * Feature Highlight interface - all fields optional
 */
export interface IFeatureHighlight {
	icon?: string;
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

/**
 * About Section interface - all fields optional
 */
export interface IAboutSection {
	badgeDe?: string;
	badgeEn?: string;
	titleDe?: string;
	titleEn?: string;
	titleHighlightDe?: string;
	titleHighlightEn?: string;
	contentDe?: string;
	contentEn?: string;
	image?: string;
	benefits?: string[];
	primaryCta?: ICtaButton;
	secondaryCta?: ICtaButton;
	certificationBadge?: IAboutCertificationBadge;
}

/**
 * CTA Section interface - all fields optional
 */
export interface ICtaSection {
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	phoneTitleDe?: string;
	phoneTitleEn?: string;
	phoneSubtitleDe?: string;
	phoneSubtitleEn?: string;
	emailTitleDe?: string;
	emailTitleEn?: string;
	emailSubtitleDe?: string;
	emailSubtitleEn?: string;
	formTitleDe?: string;
	formTitleEn?: string;
	formSubtitleDe?: string;
	formSubtitleEn?: string;
	formCtaTextDe?: string;
	formCtaTextEn?: string;
	formCtaHref?: string;
}

/**
 * Gallery Image interface - all fields optional
 */
export interface IGalleryImage {
	src?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
}

/**
 * Image Gallery Section interface - all fields optional
 */
export interface IImageGallerySection {
	badgeDe?: string;
	badgeEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	images?: IGalleryImage[];
	ctaTitleDe?: string;
	ctaTitleEn?: string;
	ctaSubtitleDe?: string;
	ctaSubtitleEn?: string;
	ctaButtonTextDe?: string;
	ctaButtonTextEn?: string;
}

/**
 * About Certification Badge interface
 */
export interface IAboutCertificationBadge {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

/**
 * Testimonial Item interface - all fields optional
 */
export interface ITestimonialItem {
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	image?: string;
}

/**
 * Testimonials Section interface - all fields optional
 */
export interface ITestimonialsSection {
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	testimonials?: ITestimonialItem[];
}

/**
 * Promo Banner Item interface - single banner in the 1:2 layout
 */
export interface IPromoBannerItem {
	badgeDe?: string;
	badgeEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	image?: string;
	ctaTextDe?: string;
	ctaTextEn?: string;
	ctaHref?: string;
}

/**
 * Promo Banner Section interface - 1:2 layout with two banners
 */
export interface IPromoBannerSection {
	leftBanner?: IPromoBannerItem;
	rightBanner?: IPromoBannerItem;
}

/**
 * Feature Banner Feature Item interface
 */
export interface IFeatureBannerItem {
	icon?: string;
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

/**
 * Feature Banner Section interface - image with title and feature cards
 */
export interface IFeatureBannerSection {
	image?: string;
	titleDe?: string;
	titleEn?: string;
	titleHighlightDe?: string;
	titleHighlightEn?: string;
	features?: IFeatureBannerItem[];
}

/**
 * Partner Logo item interface
 */
export interface IPartnerLogo {
	image?: string;
	name?: string;
	href?: string;
	descriptionDe?: string;
	descriptionEn?: string;
}

/**
 * Intro Section interface - two-column text + image section after hero
 */
export interface IIntroSection {
	badgeDe?: string;
	badgeEn?: string;
	titleDe?: string;
	titleEn?: string;
	subtitleDe?: string;
	subtitleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	ctaTextDe?: string;
	ctaTextEn?: string;
	ctaHref?: string;
	image?: string;
	partnerLogos?: IPartnerLogo[];
}

/**
 * Section Visibility Settings interface
 */
export interface IPartnersCarouselSection {
	headingDe?: string;
	headingEn?: string;
	logos?: IPartnerLogo[];
}

export interface ISectionVisibility {
	hero?: boolean;
	introSection?: boolean;
	integrationSection?: boolean;
	sponsorsSection?: boolean;
	volunteeringSection?: boolean;
	partnersCarousel?: boolean;
	promoBanner?: boolean;
	featureBanner?: boolean;
	features?: boolean;
	imageGallery?: boolean;
	about?: boolean;
	testimonials?: boolean;
	cta?: boolean;
	richContent?: boolean;
}

/**
 * Integration Section interface
 */
export interface IIntegrationSection {
	headingDe?: string;
	headingEn?: string;
	quoteDe?: string;
	quoteEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	image?: string;
	readMoreLink?: string;
	partnerLogos?: IPartnerLogo[];
}

/**
 * Sponsors Section interface
 */
export interface ISponsorsSection {
	headingDe?: string;
	headingEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	backgroundImage?: string;
	sponsors?: IPartnerLogo[];
}

/**
 * Volunteering Section interface
 */
export interface IVolunteeringSection {
	headingDe?: string;
	headingEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	image?: string;
	partnerLogos?: IPartnerLogo[];
}

/**
 * SEO Settings interface
 */
export interface IHomePageSeo {
	titleDe?: string;
	titleEn?: string;
	descriptionDe?: string;
	descriptionEn?: string;
	ogImage?: string;
}

/**
 * HomePage interface extending Mongoose Document
 * Singleton model for home page content
 */
export interface IHomePage extends Document {
	_id: mongoose.Types.ObjectId;

	// Section Visibility Settings
	sectionVisibility: ISectionVisibility;

	// Hero Section
	hero: IHeroSection;

	// Intro Section (after hero - two column text + image)
	introSection: IIntroSection;

	// Promo Banner Section (1:2 layout with two banners)
	promoBanner: IPromoBannerSection;

	// Feature Banner Section (image with title and feature cards)
	featureBanner: IFeatureBannerSection;

	// Feature Highlights (4 cards)
	features: IFeatureHighlight[];

	// Image Gallery Section
	imageGallery: IImageGallerySection;

	// About Section
	aboutSection: IAboutSection;

	// Testimonials Section
	testimonialsSection: ITestimonialsSection;

	// CTA Section
	ctaSection: ICtaSection;

	// ZAVD Sections
	integrationSection: IIntegrationSection;
	sponsorsSection: ISponsorsSection;
	volunteeringSection: IVolunteeringSection;
	partnersCarouselSection: IPartnersCarouselSection;

	// Rich Content (HTML from text editor)
	richContent?: string;

	// SEO
	seo: IHomePageSeo;

	// Timestamps
	updatedAt: Date;
	createdAt: Date;
}

/**
 * CTA Button sub-schema - no required fields to allow empty content
 */
const CtaButtonSchema = new Schema<ICtaButton>(
	{
		textDe: { type: String, trim: true },
		textEn: { type: String, trim: true },
		href: { type: String, trim: true },
		variant: {
			type: String,
			enum: ["primary", "outline", "secondary"],
			default: "primary",
		},
	},
	{ _id: false }
);

/**
 * Hero Floating Card sub-schema
 */
const HeroFloatingCardSchema = new Schema<IHeroFloatingCard>(
	{
		image: { type: String, trim: true },
		labelDe: { type: String, trim: true },
		labelEn: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Hero Certification Card sub-schema
 */
const HeroCertificationCardSchema = new Schema<IHeroCertificationCard>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		progressLabelDe: { type: String, trim: true },
		progressLabelEn: { type: String, trim: true },
		progressValueDe: { type: String, trim: true },
		progressValueEn: { type: String, trim: true },
		progressPercentage: { type: Number, min: 0, max: 100 },
	},
	{ _id: false }
);

/**
 * Hero Slide sub-schema - for slider mode
 */
const HeroSlideSchema = new Schema<IHeroSlide>(
	{
		badgeDe: { type: String, trim: true },
		badgeEn: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		backgroundImage: { type: String, trim: true },
		ctaTextDe: { type: String, trim: true },
		ctaTextEn: { type: String, trim: true },
		ctaHref: { type: String, trim: true },
		ctaText2De: { type: String, trim: true },
		ctaText2En: { type: String, trim: true },
		ctaHref2: { type: String, trim: true },
		isActive: { type: Boolean, default: true },
	},
	{ _id: false }
);

/**
 * Hero Section sub-schema - no required fields to allow empty content
 * Supports both single hero and slider mode
 */
const HeroSectionSchema = new Schema<IHeroSection>(
	{
		// Slider mode settings
		isSlider: { type: Boolean, default: true },
		slides: { type: [HeroSlideSchema], default: [] },
		autoPlayInterval: { type: Number, default: 5000 },
		showArrows: { type: Boolean, default: true },
		// Legacy single hero fields
		badgeDe: { type: String, trim: true },
		badgeEn: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		titleHighlightDe: { type: String, trim: true },
		titleHighlightEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		primaryCta: { type: CtaButtonSchema },
		secondaryCta: { type: CtaButtonSchema },
		backgroundImage: { type: String, trim: true },
		mainImage: { type: String, trim: true },
		mobileImage: { type: String, trim: true },
		trustIndicators: [
			{
				icon: { type: String, trim: true },
				textDe: { type: String, trim: true },
				textEn: { type: String, trim: true },
			},
		],
		floatingCard: { type: HeroFloatingCardSchema },
		certificationCard: { type: HeroCertificationCardSchema },
	},
	{ _id: false }
);

/**
 * Feature Highlight sub-schema - no required fields
 */
const FeatureHighlightSchema = new Schema<IFeatureHighlight>(
	{
		icon: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Gallery Image sub-schema - no required fields
 */
const GalleryImageSchema = new Schema<IGalleryImage>(
	{
		src: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Image Gallery Section sub-schema - no required fields
 */
const ImageGallerySectionSchema = new Schema<IImageGallerySection>(
	{
		badgeDe: { type: String, trim: true },
		badgeEn: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		images: { type: [GalleryImageSchema], default: [] },
		ctaTitleDe: { type: String, trim: true },
		ctaTitleEn: { type: String, trim: true },
		ctaSubtitleDe: { type: String, trim: true },
		ctaSubtitleEn: { type: String, trim: true },
		ctaButtonTextDe: { type: String, trim: true },
		ctaButtonTextEn: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * About Certification Badge sub-schema
 */
const AboutCertificationBadgeSchema = new Schema<IAboutCertificationBadge>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * About Section sub-schema - no required fields
 */
const AboutSectionSchema = new Schema<IAboutSection>(
	{
		badgeDe: { type: String, trim: true },
		badgeEn: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		titleHighlightDe: { type: String, trim: true },
		titleHighlightEn: { type: String, trim: true },
		contentDe: { type: String, trim: true },
		contentEn: { type: String, trim: true },
		image: { type: String, trim: true },
		benefits: [{ type: String, trim: true }],
		primaryCta: { type: CtaButtonSchema },
		secondaryCta: { type: CtaButtonSchema },
		certificationBadge: { type: AboutCertificationBadgeSchema },
	},
	{ _id: false }
);

/**
 * CTA Section sub-schema - no required fields
 */
const CtaSectionSchema = new Schema<ICtaSection>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		phoneTitleDe: { type: String, trim: true },
		phoneTitleEn: { type: String, trim: true },
		phoneSubtitleDe: { type: String, trim: true },
		phoneSubtitleEn: { type: String, trim: true },
		emailTitleDe: { type: String, trim: true },
		emailTitleEn: { type: String, trim: true },
		emailSubtitleDe: { type: String, trim: true },
		emailSubtitleEn: { type: String, trim: true },
		formTitleDe: { type: String, trim: true },
		formTitleEn: { type: String, trim: true },
		formSubtitleDe: { type: String, trim: true },
		formSubtitleEn: { type: String, trim: true },
		formCtaTextDe: { type: String, trim: true },
		formCtaTextEn: { type: String, trim: true },
		formCtaHref: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * HomePage SEO sub-schema
 */
const HomePageSeoSchema = new Schema<IHomePageSeo>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Testimonial Item sub-schema - no required fields
 */
const TestimonialItemSchema = new Schema<ITestimonialItem>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
		image: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Testimonials Section sub-schema - no required fields
 */
const TestimonialsSectionSchema = new Schema<ITestimonialsSection>(
	{
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		testimonials: { type: [TestimonialItemSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Promo Banner Item sub-schema
 */
const PromoBannerItemSchema = new Schema<IPromoBannerItem>(
	{
		badgeDe: { type: String, trim: true },
		badgeEn: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
		image: { type: String, trim: true },
		ctaTextDe: { type: String, trim: true },
		ctaTextEn: { type: String, trim: true },
		ctaHref: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Promo Banner Section sub-schema
 */
const PromoBannerSectionSchema = new Schema<IPromoBannerSection>(
	{
		leftBanner: { type: PromoBannerItemSchema, default: {} },
		rightBanner: { type: PromoBannerItemSchema, default: {} },
	},
	{ _id: false }
);

/**
 * Feature Banner Item sub-schema
 */
const FeatureBannerItemSchema = new Schema<IFeatureBannerItem>(
	{
		icon: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Feature Banner Section sub-schema
 */
const FeatureBannerSectionSchema = new Schema<IFeatureBannerSection>(
	{
		image: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		titleHighlightDe: { type: String, trim: true },
		titleHighlightEn: { type: String, trim: true },
		features: { type: [FeatureBannerItemSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Partner Logo sub-schema
 */
const PartnerLogoSchema = new Schema<IPartnerLogo>(
	{
		image: { type: String, trim: true },
		name: { type: String, trim: true },
		href: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Intro Section sub-schema
 */
const IntroSectionSchema = new Schema<IIntroSection>(
	{
		badgeDe: { type: String, trim: true },
		badgeEn: { type: String, trim: true },
		titleDe: { type: String, trim: true },
		titleEn: { type: String, trim: true },
		subtitleDe: { type: String, trim: true },
		subtitleEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
		ctaTextDe: { type: String, trim: true },
		ctaTextEn: { type: String, trim: true },
		ctaHref: { type: String, trim: true },
		image: { type: String, trim: true },
		partnerLogos: { type: [PartnerLogoSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Integration Section sub-schema
 */
const IntegrationSectionSchema = new Schema<IIntegrationSection>(
	{
		headingDe: { type: String, trim: true },
		headingEn: { type: String, trim: true },
		quoteDe: { type: String, trim: true },
		quoteEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
		image: { type: String, trim: true },
		readMoreLink: { type: String, trim: true },
		partnerLogos: { type: [PartnerLogoSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Sponsors Section sub-schema
 */
const SponsorsSectionSchema = new Schema<ISponsorsSection>(
	{
		headingDe: { type: String, trim: true },
		headingEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
		backgroundImage: { type: String, trim: true },
		sponsors: { type: [PartnerLogoSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Volunteering Section sub-schema
 */
const VolunteeringSectionSchema = new Schema<IVolunteeringSection>(
	{
		headingDe: { type: String, trim: true },
		headingEn: { type: String, trim: true },
		descriptionDe: { type: String, trim: true },
		descriptionEn: { type: String, trim: true },
		image: { type: String, trim: true },
		partnerLogos: { type: [PartnerLogoSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Partners Carousel Section sub-schema
 */
const PartnersCarouselSectionSchema = new Schema<IPartnersCarouselSection>(
	{
		headingDe: { type: String, trim: true },
		headingEn: { type: String, trim: true },
		logos: { type: [PartnerLogoSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Section Visibility sub-schema
 */
const SectionVisibilitySchema = new Schema<ISectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		introSection: { type: Boolean, default: true },
		integrationSection: { type: Boolean, default: true },
		sponsorsSection: { type: Boolean, default: true },
		volunteeringSection: { type: Boolean, default: true },
		partnersCarousel: { type: Boolean, default: true },
		promoBanner: { type: Boolean, default: true },
		featureBanner: { type: Boolean, default: true },
		features: { type: Boolean, default: true },
		imageGallery: { type: Boolean, default: true },
		about: { type: Boolean, default: true },
		testimonials: { type: Boolean, default: true },
		cta: { type: Boolean, default: true },
		richContent: { type: Boolean, default: false },
	},
	{ _id: false }
);

/**
 * HomePage Schema
 * Singleton model - only one document should exist
 * NO DEFAULT DATA - sections show only if content is explicitly added via CMS
 */
const HomePageSchema = new Schema<IHomePage>(
	{
		sectionVisibility: {
			type: SectionVisibilitySchema,
			default: {
				hero: true,
				introSection: true,
				promoBanner: true,
				featureBanner: true,
				features: true,
				imageGallery: true,
				about: true,
				testimonials: true,
				cta: true,
				richContent: false,
			},
		},
		hero: {
			type: HeroSectionSchema,
			default: {},
		},
		introSection: {
			type: IntroSectionSchema,
			default: {},
		},
		promoBanner: {
			type: PromoBannerSectionSchema,
			default: {},
		},
		featureBanner: {
			type: FeatureBannerSectionSchema,
			default: {},
		},
		features: {
			type: [FeatureHighlightSchema],
			default: [],
		},
		imageGallery: {
			type: ImageGallerySectionSchema,
			default: {},
		},
		aboutSection: {
			type: AboutSectionSchema,
			default: {},
		},
		testimonialsSection: {
			type: TestimonialsSectionSchema,
			default: {},
		},
		ctaSection: {
			type: CtaSectionSchema,
			default: {},
		},
		integrationSection: {
			type: IntegrationSectionSchema,
			default: {},
		},
		sponsorsSection: {
			type: SponsorsSectionSchema,
			default: {},
		},
		volunteeringSection: {
			type: VolunteeringSectionSchema,
			default: {},
		},
		partnersCarouselSection: {
			type: PartnersCarouselSectionSchema,
			default: {},
		},
		richContent: {
			type: String,
			default: "",
		},
		seo: {
			type: HomePageSeoSchema,
			default: {},
		},
	},
	{
		timestamps: true,
		collection: "home_page",
	}
);

// Ensure virtuals are included in JSON
HomePageSchema.set("toJSON", {
	virtuals: true,
	transform: function (_doc, ret) {
		ret = Object.assign({}, ret);
		delete (ret as unknown as Record<string, unknown>).__v;
		return ret;
	},
});

HomePageSchema.set("toObject", { virtuals: true });

/**
 * Get HomePage Model
 * Uses function to prevent model overwrite during hot reload
 */
export const getHomePageModel = async (): Promise<Model<IHomePage>> => {
	await connectMongoose();

	// In development, delete cached model on hot reload so schema changes are picked up
	if (process.env.NODE_ENV !== "production" && mongoose.models.HomePage) {
		mongoose.deleteModel("HomePage");
	}

	return (
		(mongoose.models.HomePage as Model<IHomePage>) ||
		mongoose.model<IHomePage>("HomePage", HomePageSchema)
	);
};

/**
 * Export synchronous model getter for use in repositories
 * Note: Ensure connectMongoose is called before using this
 */
export function getHomePageModelSync(): Model<IHomePage> {
	// In development, delete cached model on hot reload so schema changes are picked up
	if (process.env.NODE_ENV !== "production" && mongoose.models.HomePage) {
		mongoose.deleteModel("HomePage");
	}

	return (
		(mongoose.models.HomePage as Model<IHomePage>) ||
		mongoose.model<IHomePage>("HomePage", HomePageSchema)
	);
}
