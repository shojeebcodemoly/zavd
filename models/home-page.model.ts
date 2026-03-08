import mongoose, { Schema, Model, Document } from "mongoose";
import { connectMongoose } from "@/lib/db/db-connect";

/**
 * CTA Button interface - all fields optional to allow empty content
 */
export interface ICtaButton {
	text?: string;
	href?: string;
	variant?: "primary" | "outline" | "secondary";
}

/**
 * Hero Floating Card interface (top right card with image)
 */
export interface IHeroFloatingCard {
	image?: string;
	label?: string;
}

/**
 * Hero Certification Card interface (bottom left card)
 */
export interface IHeroCertificationCard {
	title?: string;
	subtitle?: string;
	progressLabel?: string;
	progressValue?: string;
	progressPercentage?: number;
}

/**
 * Hero Slide interface - for slider-based hero
 */
export interface IHeroSlide {
	badge?: string;
	title?: string;
	subtitle?: string;
	backgroundImage?: string;
	ctaText?: string;
	ctaHref?: string;
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
	badge?: string;
	title?: string;
	titleHighlight?: string;
	subtitle?: string;
	primaryCta?: ICtaButton;
	secondaryCta?: ICtaButton;
	backgroundImage?: string;
	mainImage?: string;
	/** Separate mobile image for responsive hero (full-height on mobile) */
	mobileImage?: string;
	trustIndicators?: Array<{
		icon?: string;
		text?: string;
	}>;
	floatingCard?: IHeroFloatingCard;
	certificationCard?: IHeroCertificationCard;
}

/**
 * Feature Highlight interface - all fields optional
 */
export interface IFeatureHighlight {
	icon?: string;
	title?: string;
	description?: string;
}

/**
 * About Section interface - all fields optional
 */
export interface IAboutSection {
	badge?: string;
	title?: string;
	titleHighlight?: string;
	content?: string;
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
	title?: string;
	subtitle?: string;
	phoneTitle?: string;
	phoneSubtitle?: string;
	emailTitle?: string;
	emailSubtitle?: string;
	formTitle?: string;
	formSubtitle?: string;
	formCtaText?: string;
	formCtaHref?: string;
}

/**
 * Product Showcase Item interface - all fields optional
 */
export interface IProductShowcaseItem {
	name?: string;
	category?: string;
	description?: string;
	status?: string;
	image?: string;
	href?: string;
}

/**
 * Product Showcase Section interface
 */
export interface IProductShowcaseSection {
	title?: string;
	subtitle?: string;
	ctaText?: string;
	ctaHref?: string;
	products?: IProductShowcaseItem[];
}

/**
 * Gallery Image interface - all fields optional
 */
export interface IGalleryImage {
	src?: string;
	title?: string;
	subtitle?: string;
}

/**
 * Image Gallery Section interface - all fields optional
 */
export interface IImageGallerySection {
	badge?: string;
	title?: string;
	subtitle?: string;
	images?: IGalleryImage[];
	ctaTitle?: string;
	ctaSubtitle?: string;
	ctaButtonText?: string;
}

/**
 * About Certification Badge interface
 */
export interface IAboutCertificationBadge {
	title?: string;
	description?: string;
}

/**
 * Testimonial Item interface - all fields optional
 */
export interface ITestimonialItem {
	quote?: string;
	author?: string;
	role?: string;
	company?: string;
}

/**
 * Testimonials Section interface - all fields optional
 */
export interface ITestimonialsSection {
	title?: string;
	subtitle?: string;
	testimonials?: ITestimonialItem[];
}

/**
 * Category Showcase Section interface - displays product categories on home page
 */
export interface ICategoryShowcaseSection {
	badge?: string;
	title?: string;
	maxCategories?: number; // How many categories to display (default: 3)
}

/**
 * Product Carousel Section interface - displays featured products on home page
 */
export interface IProductCarouselSection {
	badge?: string;
	title?: string;
	maxProducts?: number; // How many products to display (default: 6)
}

/**
 * Promo Banner Item interface - single banner in the 1:2 layout
 */
export interface IPromoBannerItem {
	badge?: string;
	title?: string;
	subtitle?: string;
	description?: string;
	image?: string;
	ctaText?: string;
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
	title?: string;
	description?: string;
}

/**
 * Feature Banner Section interface - image with title and feature cards
 */
export interface IFeatureBannerSection {
	image?: string;
	title?: string;
	titleHighlight?: string;
	features?: IFeatureBannerItem[];
}

/**
 * Section Visibility Settings interface
 */
export interface ISectionVisibility {
	hero: boolean;
	categoryShowcase: boolean;
	productCarousel: boolean;
	promoBanner: boolean;
	featureBanner: boolean;
	features: boolean;
	productShowcase: boolean;
	imageGallery: boolean;
	about: boolean;
	testimonials: boolean;
	cta: boolean;
	richContent: boolean;
}

/**
 * SEO Settings interface
 */
export interface IHomePageSeo {
	title?: string;
	description?: string;
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

	// Category Showcase Section (after hero)
	categoryShowcase: ICategoryShowcaseSection;

	// Product Carousel Section (after categories)
	productCarousel: IProductCarouselSection;

	// Promo Banner Section (1:2 layout with two banners)
	promoBanner: IPromoBannerSection;

	// Feature Banner Section (image with title and feature cards)
	featureBanner: IFeatureBannerSection;

	// Feature Highlights (4 cards)
	features: IFeatureHighlight[];

	// Product Showcase Section
	productShowcase: IProductShowcaseSection;

	// Image Gallery Section
	imageGallery: IImageGallerySection;

	// About Section
	aboutSection: IAboutSection;

	// Testimonials Section
	testimonialsSection: ITestimonialsSection;

	// CTA Section
	ctaSection: ICtaSection;

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
		text: { type: String, trim: true },
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
		label: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Hero Certification Card sub-schema
 */
const HeroCertificationCardSchema = new Schema<IHeroCertificationCard>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		progressLabel: { type: String, trim: true },
		progressValue: { type: String, trim: true },
		progressPercentage: { type: Number, min: 0, max: 100 },
	},
	{ _id: false }
);

/**
 * Hero Slide sub-schema - for slider mode
 */
const HeroSlideSchema = new Schema<IHeroSlide>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		backgroundImage: { type: String, trim: true },
		ctaText: { type: String, trim: true },
		ctaHref: { type: String, trim: true },
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
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		titleHighlight: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		primaryCta: { type: CtaButtonSchema },
		secondaryCta: { type: CtaButtonSchema },
		backgroundImage: { type: String, trim: true },
		mainImage: { type: String, trim: true },
		mobileImage: { type: String, trim: true },
		trustIndicators: [
			{
				icon: { type: String, trim: true },
				text: { type: String, trim: true },
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
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Product Showcase Item sub-schema - no required fields
 */
const ProductShowcaseItemSchema = new Schema<IProductShowcaseItem>(
	{
		name: { type: String, trim: true },
		category: { type: String, trim: true },
		description: { type: String, trim: true },
		status: { type: String, trim: true },
		image: { type: String, trim: true },
		href: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Product Showcase Section sub-schema - no required fields
 */
const ProductShowcaseSectionSchema = new Schema<IProductShowcaseSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		ctaText: { type: String, trim: true },
		ctaHref: { type: String, trim: true },
		products: { type: [ProductShowcaseItemSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Gallery Image sub-schema - no required fields
 */
const GalleryImageSchema = new Schema<IGalleryImage>(
	{
		src: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Image Gallery Section sub-schema - no required fields
 */
const ImageGallerySectionSchema = new Schema<IImageGallerySection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		images: { type: [GalleryImageSchema], default: [] },
		ctaTitle: { type: String, trim: true },
		ctaSubtitle: { type: String, trim: true },
		ctaButtonText: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * About Certification Badge sub-schema
 */
const AboutCertificationBadgeSchema = new Schema<IAboutCertificationBadge>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * About Section sub-schema - no required fields
 */
const AboutSectionSchema = new Schema<IAboutSection>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		titleHighlight: { type: String, trim: true },
		content: { type: String, trim: true },
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
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		phoneTitle: { type: String, trim: true },
		phoneSubtitle: { type: String, trim: true },
		emailTitle: { type: String, trim: true },
		emailSubtitle: { type: String, trim: true },
		formTitle: { type: String, trim: true },
		formSubtitle: { type: String, trim: true },
		formCtaText: { type: String, trim: true },
		formCtaHref: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * HomePage SEO sub-schema
 */
const HomePageSeoSchema = new Schema<IHomePageSeo>(
	{
		title: { type: String, trim: true },
		description: { type: String, trim: true },
		ogImage: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Testimonial Item sub-schema - no required fields
 */
const TestimonialItemSchema = new Schema<ITestimonialItem>(
	{
		quote: { type: String, trim: true },
		author: { type: String, trim: true },
		role: { type: String, trim: true },
		company: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Testimonials Section sub-schema - no required fields
 */
const TestimonialsSectionSchema = new Schema<ITestimonialsSection>(
	{
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		testimonials: { type: [TestimonialItemSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Category Showcase Section sub-schema
 */
const CategoryShowcaseSectionSchema = new Schema<ICategoryShowcaseSection>(
	{
		badge: { type: String, trim: true, default: "POPULAR CATEGORIES" },
		title: { type: String, trim: true, default: "Explore Our Categories" },
		maxCategories: { type: Number, default: 3, min: 1, max: 12 },
	},
	{ _id: false }
);

/**
 * Product Carousel Section sub-schema
 */
const ProductCarouselSectionSchema = new Schema<IProductCarouselSection>(
	{
		badge: { type: String, trim: true, default: "BUY ONLINE" },
		title: { type: String, trim: true, default: "Popular Products" },
		maxProducts: { type: Number, default: 6, min: 3, max: 12 },
	},
	{ _id: false }
);

/**
 * Promo Banner Item sub-schema
 */
const PromoBannerItemSchema = new Schema<IPromoBannerItem>(
	{
		badge: { type: String, trim: true },
		title: { type: String, trim: true },
		subtitle: { type: String, trim: true },
		description: { type: String, trim: true },
		image: { type: String, trim: true },
		ctaText: { type: String, trim: true },
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
		title: { type: String, trim: true },
		description: { type: String, trim: true },
	},
	{ _id: false }
);

/**
 * Feature Banner Section sub-schema
 */
const FeatureBannerSectionSchema = new Schema<IFeatureBannerSection>(
	{
		image: { type: String, trim: true },
		title: { type: String, trim: true },
		titleHighlight: { type: String, trim: true },
		features: { type: [FeatureBannerItemSchema], default: [] },
	},
	{ _id: false }
);

/**
 * Section Visibility sub-schema
 */
const SectionVisibilitySchema = new Schema<ISectionVisibility>(
	{
		hero: { type: Boolean, default: true },
		categoryShowcase: { type: Boolean, default: true },
		productCarousel: { type: Boolean, default: true },
		promoBanner: { type: Boolean, default: true },
		featureBanner: { type: Boolean, default: true },
		features: { type: Boolean, default: true },
		productShowcase: { type: Boolean, default: true },
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
				categoryShowcase: true,
				productCarousel: true,
				promoBanner: true,
				featureBanner: true,
				features: true,
				productShowcase: true,
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
		categoryShowcase: {
			type: CategoryShowcaseSectionSchema,
			default: {
				badge: "POPULAR CATEGORIES",
				title: "Explore Our Categories",
				maxCategories: 3,
			},
		},
		productCarousel: {
			type: ProductCarouselSectionSchema,
			default: {
				badge: "BUY ONLINE",
				title: "Popular Products",
				maxProducts: 6,
			},
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
		productShowcase: {
			type: ProductShowcaseSectionSchema,
			default: {},
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
	return (
		(mongoose.models.HomePage as Model<IHomePage>) ||
		mongoose.model<IHomePage>("HomePage", HomePageSchema)
	);
}
