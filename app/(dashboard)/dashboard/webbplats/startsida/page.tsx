"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
	Loader2,
	Plus,
	Trash2,
	ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { MediaPicker } from "@/components/storage/media-picker";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";
import { Switch } from "@/components/ui/switch";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import dynamic from "next/dynamic";

// Dynamically import TextEditor to avoid SSR issues
const TextEditor = dynamic(() => import("@/components/common/TextEditor"), {
	ssr: false,
	loading: () => (
		<div className="h-[300px] border rounded-md flex items-center justify-center text-muted-foreground">
			Loading editor...
		</div>
	),
});


// CTA Button schema - all optional since buttons may not be set
const ctaButtonSchema = z.object({
	text: z.string().optional(),
	href: z.string().optional(),
	variant: z.enum(["primary", "outline", "secondary"]).optional(),
});

// Trust Indicator schema - optional fields
const trustIndicatorSchema = z.object({
	icon: z.string().optional(),
	text: z.string().optional(),
});


// Hero Slide schema for slider mode
const heroSlideSchema = z.object({
	badge: z.string().optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	backgroundImage: z.string().optional(),
	ctaText: z.string().optional(),
	ctaHref: z.string().optional(),
	isActive: z.boolean().optional(),
});

// Hero Floating Card schema
const heroFloatingCardSchema = z.object({
	image: z.string().optional(),
	label: z.string().optional(),
});

// Hero Certification Card schema
const heroCertificationCardSchema = z.object({
	title: z.string().optional(),
	subtitle: z.string().optional(),
	progressLabel: z.string().optional(),
	progressValue: z.string().optional(),
	progressPercentage: z.number().min(0).max(100).optional(),
});

// Product Showcase Item schema - optional fields
const productShowcaseItemSchema = z.object({
	name: z.string().optional(),
	category: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	image: z.string().optional(),
	href: z.string().optional(),
});

// Product Showcase Section schema
const productShowcaseSectionSchema = z.object({
	title: z.string().optional(),
	subtitle: z.string().optional(),
	ctaText: z.string().optional(),
	ctaHref: z.string().optional(),
	products: z.array(productShowcaseItemSchema).optional(),
});

// Gallery Image schema - optional fields
const galleryImageSchema = z.object({
	src: z.string().optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
});

// Image Gallery Section schema
const imageGallerySectionSchema = z.object({
	badge: z.string().optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	images: z.array(galleryImageSchema).optional(),
	ctaTitle: z.string().optional(),
	ctaSubtitle: z.string().optional(),
	ctaButtonText: z.string().optional(),
});

// About Certification Badge schema
const aboutCertificationBadgeSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
});

// Testimonial Item schema - optional fields
const testimonialItemSchema = z.object({
	quote: z.string().optional(),
	author: z.string().optional(),
	role: z.string().optional(),
	company: z.string().optional(),
});

// Testimonials Section schema
const testimonialsSectionSchema = z.object({
	title: z.string().optional(),
	subtitle: z.string().optional(),
	testimonials: z.array(testimonialItemSchema).optional(),
});

// Partner Logo schema
const partnerLogoSchema = z.object({
	image: z.string().optional(),
	name: z.string().optional(),
	href: z.string().optional(),
});

// Intro Section schema
const introSectionSchema = z.object({
	badge: z.string().optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	description: z.string().optional(),
	ctaText: z.string().optional(),
	ctaHref: z.string().optional(),
	image: z.string().optional(),
	partnerLogos: z.array(partnerLogoSchema).optional(),
});

// Promo Banner Item schema
const promoBannerItemSchema = z.object({
	badge: z.string().optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	description: z.string().optional(),
	image: z.string().optional(),
	ctaText: z.string().optional(),
	ctaHref: z.string().optional(),
});

// Promo Banner Section schema
const promoBannerSectionSchema = z.object({
	leftBanner: promoBannerItemSchema.optional(),
	rightBanner: promoBannerItemSchema.optional(),
});

// Feature Banner Item schema
const featureBannerItemSchema = z.object({
	icon: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
});

// Feature Banner Section schema
const featureBannerSectionSchema = z.object({
	image: z.string().optional(),
	title: z.string().optional(),
	titleHighlight: z.string().optional(),
	features: z.array(featureBannerItemSchema).optional(),
});

// Section Visibility schema
const sectionVisibilitySchema = z.object({
	hero: z.boolean().optional(),
	introSection: z.boolean().optional(),
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

// Form schema - all section fields optional to allow saving empty content
const homePageFormSchema = z.object({
	// Section Visibility
	sectionVisibility: sectionVisibilitySchema,

	// Hero Section - all fields optional
	hero: z
		.object({
			// Slider mode fields
			isSlider: z.boolean().optional(),
			slides: z.array(heroSlideSchema).optional(),
			autoPlayInterval: z.number().optional(),
			showArrows: z.boolean().optional(),
			// Legacy single hero fields
			badge: z.string().optional(),
			title: z.string().optional(),
			titleHighlight: z.string().optional(),
			subtitle: z.string().optional(),
			primaryCta: ctaButtonSchema.optional(),
			secondaryCta: ctaButtonSchema.optional(),
			backgroundImage: z.string().optional(),
			mainImage: z.string().optional(),
			trustIndicators: z.array(trustIndicatorSchema).optional(),
			floatingCard: heroFloatingCardSchema.optional(),
			certificationCard: heroCertificationCardSchema.optional(),
		})
		.optional(),

	// Intro Section
	introSection: introSectionSchema.optional(),

	// Promo Banner Section
	promoBanner: promoBannerSectionSchema.optional(),

	// Feature Banner Section
	featureBanner: featureBannerSectionSchema.optional(),

	// Product Showcase
	productShowcase: productShowcaseSectionSchema.optional(),

	// Image Gallery
	imageGallery: imageGallerySectionSchema.optional(),

	// About Section - all fields optional
	aboutSection: z
		.object({
			badge: z.string().optional(),
			title: z.string().optional(),
			titleHighlight: z.string().optional(),
			content: z.string().optional(),
			image: z.string().optional(),
			benefits: z.array(z.string()).optional(),
			primaryCta: ctaButtonSchema.optional(),
			secondaryCta: ctaButtonSchema.optional(),
			certificationBadge: aboutCertificationBadgeSchema.optional(),
		})
		.optional(),

	// Testimonials Section
	testimonialsSection: testimonialsSectionSchema.optional(),

	// CTA Section - all fields optional
	ctaSection: z
		.object({
			title: z.string().optional(),
			subtitle: z.string().optional(),
			phoneTitle: z.string().optional(),
			phoneSubtitle: z.string().optional(),
			emailTitle: z.string().optional(),
			emailSubtitle: z.string().optional(),
			formTitle: z.string().optional(),
			formSubtitle: z.string().optional(),
			formCtaText: z.string().optional(),
			formCtaHref: z.string().optional(),
		})
		.optional(),

	// Rich Content (HTML from text editor)
	richContent: z.string().optional(),

	// SEO
	seo: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
			ogImage: z.string().optional(),
		})
		.optional(),
});

type HomePageFormValues = z.infer<typeof homePageFormSchema>;

export default function StartsidaPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<HomePageFormValues>({
		resolver: zodResolver(homePageFormSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				introSection: true,
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
			hero: {
				// Slider mode fields
				isSlider: true,
				slides: [],
				autoPlayInterval: 5000,
				showArrows: true,
				// Legacy single hero fields
				badge: "",
				title: "",
				titleHighlight: "",
				subtitle: "",
				primaryCta: { text: "", href: "", variant: "primary" },
				secondaryCta: { text: "", href: "", variant: "outline" },
				backgroundImage: "",
				mainImage: "",
				trustIndicators: [],
				floatingCard: { image: "", label: "" },
				certificationCard: {
					title: "",
					subtitle: "",
					progressLabel: "",
					progressValue: "",
					progressPercentage: 0,
				},
			},
			introSection: {
				badge: "",
				title: "",
				subtitle: "",
				description: "",
				ctaText: "",
				ctaHref: "",
				image: "",
				partnerLogos: [],
			},
			promoBanner: {
				leftBanner: {
					badge: "",
					title: "",
					subtitle: "",
					description: "",
					image: "",
					ctaText: "",
					ctaHref: "",
				},
				rightBanner: {
					badge: "",
					title: "",
					subtitle: "",
					description: "",
					image: "",
					ctaText: "",
					ctaHref: "",
				},
			},
			featureBanner: {
				image: "",
				title: "",
				titleHighlight: "",
				features: [],
			},
			productShowcase: {
				title: "",
				subtitle: "",
				ctaText: "",
				ctaHref: "",
				products: [],
			},
			imageGallery: {
				badge: "",
				title: "",
				subtitle: "",
				images: [],
				ctaTitle: "",
				ctaSubtitle: "",
				ctaButtonText: "",
			},
			aboutSection: {
				badge: "",
				title: "",
				titleHighlight: "",
				content: "",
				image: "",
				benefits: [],
				primaryCta: { text: "", href: "", variant: "secondary" },
				secondaryCta: { text: "", href: "", variant: "outline" },
				certificationBadge: { title: "", description: "" },
			},
			testimonialsSection: {
				title: "",
				subtitle: "",
				testimonials: [],
			},
			ctaSection: {
				title: "",
				subtitle: "",
				phoneTitle: "",
				phoneSubtitle: "",
				emailTitle: "",
				emailSubtitle: "",
				formTitle: "",
				formSubtitle: "",
				formCtaText: "",
				formCtaHref: "",
			},
			richContent: "",
			seo: {
				title: "",
				description: "",
				ogImage: "",
			},
		},
	});

	// Field arrays for dynamic lists
	const {
		fields: slideFields,
		append: appendSlide,
		remove: removeSlide,
	} = useFieldArray({ control: form.control, name: "hero.slides" });

	const {
		fields: trustIndicatorFields,
		append: appendTrustIndicator,
		remove: removeTrustIndicator,
	} = useFieldArray({ control: form.control, name: "hero.trustIndicators" });

	const {
		fields: productFields,
		append: appendProduct,
		remove: removeProduct,
	} = useFieldArray({
		control: form.control,
		name: "productShowcase.products",
	});

	const {
		fields: galleryImageFields,
		append: appendGalleryImage,
		remove: removeGalleryImage,
	} = useFieldArray({ control: form.control, name: "imageGallery.images" });

	const {
		fields: testimonialFields,
		append: appendTestimonial,
		remove: removeTestimonial,
	} = useFieldArray({
		control: form.control,
		name: "testimonialsSection.testimonials",
	});

	const {
		fields: partnerLogoFields,
		append: appendPartnerLogo,
		remove: removePartnerLogo,
	} = useFieldArray({
		control: form.control,
		name: "introSection.partnerLogos",
	});

	// Benefits are simple strings, so we manage them manually
	const benefits = form.watch("aboutSection.benefits") || [];
	const addBenefit = () => {
		form.setValue("aboutSection.benefits", [...benefits, ""]);
	};
	const removeBenefit = (index: number) => {
		const newBenefits = benefits.filter((_, i) => i !== index);
		form.setValue("aboutSection.benefits", newBenefits);
	};
	const updateBenefit = (index: number, value: string) => {
		const newBenefits = [...benefits];
		newBenefits[index] = value;
		form.setValue("aboutSection.benefits", newBenefits);
	};

	// Fetch home page content on mount
	useEffect(() => {
		const fetchContent = async () => {
			try {
				setLoading(true);
				// Add timestamp to bypass browser cache
				const response = await fetch(`/api/home-page?t=${Date.now()}`, {
					cache: "no-store",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Failed to fetch content");
				}

				const content = data.data;

				// Reset form with fetched data
				// Ensure section visibility has proper defaults for each field
				const defaultVisibility = {
					hero: true,
					introSection: true,
					promoBanner: true,
					featureBanner: true,
					features: true,
					productShowcase: true,
					imageGallery: true,
					about: true,
					testimonials: true,
					cta: true,
					richContent: false,
				};
				const sectionVisibility = {
					hero: content.sectionVisibility?.hero ?? defaultVisibility.hero,
					introSection: content.sectionVisibility?.introSection ?? true,
					promoBanner:
						content.sectionVisibility?.promoBanner ??
						defaultVisibility.promoBanner,
					featureBanner:
						content.sectionVisibility?.featureBanner ??
						defaultVisibility.featureBanner,
					features:
						content.sectionVisibility?.features ??
						defaultVisibility.features,
					productShowcase:
						content.sectionVisibility?.productShowcase ??
						defaultVisibility.productShowcase,
					imageGallery:
						content.sectionVisibility?.imageGallery ??
						defaultVisibility.imageGallery,
					about:
						content.sectionVisibility?.about ?? defaultVisibility.about,
					testimonials:
						content.sectionVisibility?.testimonials ??
						defaultVisibility.testimonials,
					cta: content.sectionVisibility?.cta ?? defaultVisibility.cta,
					richContent:
						content.sectionVisibility?.richContent ??
						defaultVisibility.richContent,
				};

				form.reset({
					sectionVisibility,
					hero: {
						// Slider mode fields
						isSlider: content.hero?.isSlider !== false,
						slides: content.hero?.slides || [],
						autoPlayInterval: content.hero?.autoPlayInterval || 5000,
						showArrows: content.hero?.showArrows !== false,
						// Legacy single hero fields
						badge: content.hero?.badge || "",
						title: content.hero?.title || "",
						titleHighlight: content.hero?.titleHighlight || "",
						subtitle: content.hero?.subtitle || "",
						primaryCta: content.hero?.primaryCta || {
							text: "",
							href: "",
							variant: "primary",
						},
						secondaryCta: content.hero?.secondaryCta || {
							text: "",
							href: "",
							variant: "outline",
						},
						backgroundImage: content.hero?.backgroundImage || "",
						mainImage: content.hero?.mainImage || "",
						trustIndicators: content.hero?.trustIndicators || [],
						floatingCard: content.hero?.floatingCard || {
							image: "",
							label: "",
						},
						certificationCard: content.hero?.certificationCard || {
							title: "",
							subtitle: "",
							progressLabel: "",
							progressValue: "",
							progressPercentage: 0,
						},
					},
					introSection: {
						badge: content.introSection?.badge || "",
						title: content.introSection?.title || "",
						subtitle: content.introSection?.subtitle || "",
						description: content.introSection?.description || "",
						ctaText: content.introSection?.ctaText || "",
						ctaHref: content.introSection?.ctaHref || "",
						image: content.introSection?.image || "",
						partnerLogos: content.introSection?.partnerLogos || [],
					},
					promoBanner: {
						leftBanner: {
							badge: content.promoBanner?.leftBanner?.badge || "",
							title: content.promoBanner?.leftBanner?.title || "",
							subtitle: content.promoBanner?.leftBanner?.subtitle || "",
							description: content.promoBanner?.leftBanner?.description || "",
							image: content.promoBanner?.leftBanner?.image || "",
							ctaText: content.promoBanner?.leftBanner?.ctaText || "",
							ctaHref: content.promoBanner?.leftBanner?.ctaHref || "",
						},
						rightBanner: {
							badge: content.promoBanner?.rightBanner?.badge || "",
							title: content.promoBanner?.rightBanner?.title || "",
							subtitle: content.promoBanner?.rightBanner?.subtitle || "",
							description: content.promoBanner?.rightBanner?.description || "",
							image: content.promoBanner?.rightBanner?.image || "",
							ctaText: content.promoBanner?.rightBanner?.ctaText || "",
							ctaHref: content.promoBanner?.rightBanner?.ctaHref || "",
						},
					},
					featureBanner: {
						image: content.featureBanner?.image || "",
						title: content.featureBanner?.title || "",
						titleHighlight: content.featureBanner?.titleHighlight || "",
						features: content.featureBanner?.features || [],
					},
					productShowcase: {
						title: content.productShowcase?.title || "",
						subtitle: content.productShowcase?.subtitle || "",
						ctaText: content.productShowcase?.ctaText || "",
						ctaHref: content.productShowcase?.ctaHref || "",
						products: content.productShowcase?.products || [],
					},
					imageGallery: {
						badge: content.imageGallery?.badge || "",
						title: content.imageGallery?.title || "",
						subtitle: content.imageGallery?.subtitle || "",
						images: content.imageGallery?.images || [],
						ctaTitle: content.imageGallery?.ctaTitle || "",
						ctaSubtitle: content.imageGallery?.ctaSubtitle || "",
						ctaButtonText: content.imageGallery?.ctaButtonText || "",
					},
					aboutSection: {
						badge: content.aboutSection?.badge || "",
						title: content.aboutSection?.title || "",
						titleHighlight: content.aboutSection?.titleHighlight || "",
						content: content.aboutSection?.content || "",
						image: content.aboutSection?.image || "",
						benefits: content.aboutSection?.benefits || [],
						primaryCta: content.aboutSection?.primaryCta || {
							text: "",
							href: "",
							variant: "secondary",
						},
						secondaryCta: content.aboutSection?.secondaryCta || {
							text: "",
							href: "",
							variant: "outline",
						},
						certificationBadge: content.aboutSection
							?.certificationBadge || {
							title: "",
							description: "",
						},
					},
					testimonialsSection: {
						title: content.testimonialsSection?.title ?? "",
						subtitle: content.testimonialsSection?.subtitle ?? "",
						testimonials: Array.isArray(
							content.testimonialsSection?.testimonials
						)
							? content.testimonialsSection.testimonials
							: [],
					},
					ctaSection: {
						title: content.ctaSection?.title || "",
						subtitle: content.ctaSection?.subtitle || "",
						phoneTitle: content.ctaSection?.phoneTitle || "",
						phoneSubtitle: content.ctaSection?.phoneSubtitle || "",
						emailTitle: content.ctaSection?.emailTitle || "",
						emailSubtitle: content.ctaSection?.emailSubtitle || "",
						formTitle: content.ctaSection?.formTitle || "",
						formSubtitle: content.ctaSection?.formSubtitle || "",
						formCtaText: content.ctaSection?.formCtaText || "",
						formCtaHref: content.ctaSection?.formCtaHref || "",
					},
					richContent: content.richContent || "",
					seo: {
						title: content.seo?.title || "",
						description: content.seo?.description || "",
						ogImage: content.seo?.ogImage || "",
					},
				});
			} catch (error) {
				console.error("Error fetching content:", error);
				toast.error("Failed to load content");
			} finally {
				setLoading(false);
			}
		};

		fetchContent();
	}, [form]);

	const onSubmit = async (values: HomePageFormValues) => {
		try {
			setSaving(true);

			const response = await fetch("/api/home-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to save content");
			}

			toast.success("Home page content saved successfully");
		} catch (error) {
			console.error("Error saving content:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save content"
			);
		} finally {
			setSaving(false);
		}
	};

	// Friendly field name mapping
	const fieldNameMap: Record<string, string> = {
		hero: "Hero Section",
		productShowcase: "Product Showcase",
		imageGallery: "Image Gallery",
		aboutSection: "About Section",
		testimonialsSection: "Testimonials",
		ctaSection: "CTA Section",
		seo: "SEO",
		sectionVisibility: "Section Visibility",
		title: "Title",
		subtitle: "Subtitle",
		content: "Content",
		badge: "Badge",
		quote: "Quote",
		author: "Author",
		role: "Role",
		company: "Company",
		testimonials: "Testimonials list",
		text: "Button text",
		href: "Link URL",
	};

	const getFriendlyFieldName = (path: string): string => {
		const parts = path.split(".");
		const friendlyParts = parts.map((part) => {
			// Handle array indices like "testimonials.0.quote"
			if (/^\d+$/.test(part)) {
				return `#${parseInt(part) + 1}`;
			}
			return fieldNameMap[part] || part;
		});
		return friendlyParts.join(" > ");
	};

	// Handle form validation errors
	const onFormError = (errors: typeof form.formState.errors) => {
		console.error("Form validation errors:", errors);

		// Collect all error messages
		const errorMessages: { path: string; message: string }[] = [];

		const collectErrors = (obj: Record<string, unknown>, prefix = "") => {
			for (const key in obj) {
				const value = obj[key] as Record<string, unknown>;
				if (value?.message && typeof value.message === "string") {
					errorMessages.push({
						path: `${prefix}${key}`,
						message: value.message,
					});
				} else if (typeof value === "object" && value !== null) {
					collectErrors(
						value as Record<string, unknown>,
						`${prefix}${key}.`
					);
				}
			}
		};

		collectErrors(errors as Record<string, unknown>);

		if (errorMessages.length > 0) {
			// Show first few errors
			const displayErrors = errorMessages.slice(0, 3);
			const remaining = errorMessages.length - 3;

			toast.error(
				<div className="space-y-1">
					<p className="font-semibold">Please fix the following errors:</p>
					{displayErrors.map((err, i) => (
						<p key={i} className="text-sm">
							<span className="font-medium">
								{getFriendlyFieldName(err.path)}:
							</span>{" "}
							{err.message}
						</p>
					))}
					{remaining > 0 && (
						<p className="text-xs opacity-70">
							...and {remaining} more error{remaining > 1 ? "s" : ""}
						</p>
					)}
				</div>,
				{ duration: 5000 }
			);
		} else {
			toast.error("Please fix the validation errors before saving");
		}
	};

	if (loading) {
		return <CMSPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-medium tracking-tight">Home Page</h1>
					<p className="text-muted-foreground">
						Manage the content on the home page.
					</p>
				</div>
				<a
					href="/"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, onFormError)}
					className="space-y-6"
				>
					<Tabs defaultValue="settings" className="space-y-6">
						<TabsList className="flex flex-wrap h-auto gap-1 p-1 justify-start">
							<TabsTrigger value="settings">Settings</TabsTrigger>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="intro-section">Intro</TabsTrigger>
							<TabsTrigger value="promo-banner">Banner</TabsTrigger>
							<TabsTrigger value="feature-banner">Feature Banner</TabsTrigger>
							<TabsTrigger value="products">Products</TabsTrigger>
							<TabsTrigger value="gallery">Gallery</TabsTrigger>
							<TabsTrigger value="about">About</TabsTrigger>
							<TabsTrigger value="testimonials">Testimonials</TabsTrigger>
							<TabsTrigger value="cta">CTA</TabsTrigger>
							{/* <TabsTrigger value="rich-content">Rich Content</TabsTrigger> */}
							<TabsTrigger value="seo">SEO</TabsTrigger>
						</TabsList>

						{/* Settings Tab - Section Visibility */}
						<TabsContent value="settings" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Section Visibility</CardTitle>
									<CardDescription>
										Control which sections are displayed on the home
										page. Toggle off to hide a section.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="sectionVisibility.hero"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Hero Section
														</FormLabel>
														<FormDescription>
															Main banner at the top of the page.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.introSection"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Intro Section
														</FormLabel>
														<FormDescription>
															Two-column intro below hero.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.promoBanner"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Promo Banner
														</FormLabel>
														<FormDescription>
															1:2 promotional banners section.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.featureBanner"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Feature Banner
														</FormLabel>
														<FormDescription>
															Image with highlighted title and feature cards.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.productShowcase"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Product Showcase
														</FormLabel>
														<FormDescription>
															Featured products grid.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.imageGallery"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Image Gallery
														</FormLabel>
														<FormDescription>
															Facilities image gallery.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.about"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															About Section
														</FormLabel>
														<FormDescription>
															Why choose us section.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.testimonials"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Testimonials
														</FormLabel>
														<FormDescription>
															Customer testimonials carousel.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sectionVisibility.cta"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															CTA Section
														</FormLabel>
														<FormDescription>
															Bottom call-to-action section.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										{/* Rich Content visibility toggle — hidden
										<FormField
											control={form.control}
											name="sectionVisibility.richContent"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Rich Content
														</FormLabel>
														<FormDescription>
															Flexible HTML content from text editor.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										*/}
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Hero Tab */}
						<TabsContent value="hero" className="space-y-6">
							{/* Slider Settings */}
							<Card>
								<CardHeader>
									<CardTitle>Slider Settings</CardTitle>
									<CardDescription>
										Configure the hero slider auto-play behavior.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-6">
										<FormField
											control={form.control}
											name="hero.autoPlayInterval"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Auto-Play Interval (ms)</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															value={field.value || 5000}
															onChange={(e) => field.onChange(Number(e.target.value))}
															placeholder="5000"
														/>
													</FormControl>
													<FormDescription>
														Time between slide transitions in milliseconds (e.g., 5000 = 5 seconds).
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="hero.showArrows"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">Show Navigation Arrows</FormLabel>
														<FormDescription>
															Display left/right arrow buttons on the slider for manual navigation.
														</FormDescription>
													</div>
													<FormControl>
														<Switch
															checked={field.value !== false}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Slider Slides Management */}
							<Card>
									<CardHeader>
										<div className="flex items-center justify-between">
											<div>
												<CardTitle>Slider Slides</CardTitle>
												<CardDescription>
													Manage the slides displayed in the hero slider.
												</CardDescription>
											</div>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													appendSlide({
														badge: "",
														title: "",
														subtitle: "",
														backgroundImage: "",
														ctaText: "READ MORE",
														ctaHref: "/",
														isActive: true,
													})
												}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Slide
											</Button>
										</div>
									</CardHeader>
									<CardContent className="space-y-6">
										{slideFields.length === 0 ? (
											<div className="text-center py-8 text-muted-foreground">
												No slides added yet. Click &quot;Add Slide&quot; to create your first slide.
											</div>
										) : (
											slideFields.map((slide, index) => (
												<div
													key={slide.id}
													className="border rounded-lg p-4 space-y-4"
												>
													<div className="flex items-center justify-between">
														<h4 className="font-medium">
															Slide {index + 1}
														</h4>
														<div className="flex items-center gap-2">
															<FormField
																control={form.control}
																name={`hero.slides.${index}.isActive`}
																render={({ field }) => (
																	<FormItem className="flex items-center gap-2">
																		<FormLabel className="text-sm text-muted-foreground">
																			Active
																		</FormLabel>
																		<FormControl>
																			<Switch
																				checked={field.value}
																				onCheckedChange={field.onChange}
																			/>
																		</FormControl>
																	</FormItem>
																)}
															/>
															<Button
																type="button"
																variant="ghost"
																size="icon"
																onClick={async () => {
																	const confirmed = await confirm({
																		title: "Delete Slide",
																		description: `Are you sure you want to delete Slide ${index + 1}?`,
																		confirmText: "Delete",
																	});
																	if (confirmed) {
																		removeSlide(index);
																	}
																}}
															>
																<Trash2 className="h-4 w-4 text-destructive" />
															</Button>
														</div>
													</div>

													{/* Background Image */}
													<FormField
														control={form.control}
														name={`hero.slides.${index}.backgroundImage`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Background Image</FormLabel>
																<FormControl>
																	<MediaPicker
																		type="image"
																		value={field.value || ""}
																		onChange={(url) => field.onChange(url || "")}
																		showPreview
																	/>
																</FormControl>
																<FormDescription>
																	Full-screen background image for this slide.
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name={`hero.slides.${index}.badge`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Badge Text</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="BORN OF NATURE"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name={`hero.slides.${index}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="TRADITIONS OF QUALITY IN EVERY BITE"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name={`hero.slides.${index}.subtitle`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Subtitle</FormLabel>
																<FormControl>
																	<Textarea
																		{...field}
																		value={field.value || ""}
																		placeholder="Description text for this slide..."
																		rows={2}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`hero.slides.${index}.ctaText`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Button Text</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="READ MORE"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`hero.slides.${index}.ctaHref`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Button Link</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="/about"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</div>
											))
										)}
									</CardContent>
								</Card>
						</TabsContent>


						{/* Intro Section Tab */}
						<TabsContent value="intro-section" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Intro Section</CardTitle>
									<CardDescription>
										Two-column section below the hero. Left: text content. Right: image/logo.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="introSection.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Label</FormLabel>
												<FormControl>
													<Input {...field} value={field.value || ""} placeholder="e.g. Integration" />
												</FormControl>
												<FormDescription>Small label shown above the title with a colored accent line.</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="introSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input {...field} value={field.value || ""} placeholder="Integration" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="introSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Input {...field} value={field.value || ""} placeholder="Short bold subtitle..." />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="introSection.description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea {...field} value={field.value || ""} placeholder="Paragraph text..." rows={4} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="introSection.ctaText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>CTA Button Text</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="Read more..." />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="introSection.ctaHref"
											render={({ field }) => (
												<FormItem>
													<FormLabel>CTA Link URL</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="/about" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name="introSection.image"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Right Side Image / Logo</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || ""}
														onChange={(url) => field.onChange(url || "")}
														showPreview
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Partner Logos Card */}
							<Card>
								<CardHeader>
									<CardTitle>Partner Logos</CardTitle>
									<CardDescription>
										Logos shown at the bottom of the intro section. Leave image empty to show name as text.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{partnerLogoFields.map((logoField, index) => (
										<div key={logoField.id} className="border rounded-lg p-4 space-y-3 relative">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium text-muted-foreground">Partner {index + 1}</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removePartnerLogo(index)}
													className="text-destructive hover:text-destructive"
												>
													Remove
												</Button>
											</div>
											<div className="grid grid-cols-2 gap-3">
												<FormField
													control={form.control}
													name="`introSection.partnerLogos.${index}.name`"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Name</FormLabel>
															<FormControl>
																<Input {...field} value={field.value || ""} placeholder="Partner name" />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="`introSection.partnerLogos.${index}.href`"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Link URL (optional)</FormLabel>
															<FormControl>
																<Input {...field} value={field.value || ""} placeholder="https://..." />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											<FormField
												control={form.control}
												name="`introSection.partnerLogos.${index}.image`"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Logo Image</FormLabel>
														<FormControl>
															<MediaPicker
																type="image"
																value={field.value || ""}
																onChange={(url) => field.onChange(url || "")}
																showPreview
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => appendPartnerLogo({ image: "", name: "", href: "" })}
									>
										+ Add Partner
									</Button>
								</CardContent>
							</Card>
						</TabsContent>
						{/* Promo Banner Tab */}
						<TabsContent value="promo-banner" className="space-y-6">
							{/* Left Banner */}
							<Card>
								<CardHeader>
									<CardTitle>Left Banner</CardTitle>
									<CardDescription>
										Image banner with text overlay. This takes up half the width on desktop.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="promoBanner.leftBanner.image"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Background Image</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || ""}
														onChange={(url) => field.onChange(url || "")}
														showPreview
													/>
												</FormControl>
												<FormDescription>
													Full background image for the left banner.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="promoBanner.leftBanner.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="NEW ARRIVAL"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="promoBanner.leftBanner.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Fresh Artisan Zavd"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="promoBanner.leftBanner.description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="Handcrafted with care from locally sourced milk..."
														rows={2}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Right Banner */}
							<Card>
								<CardHeader>
									<CardTitle>Right Banner</CardTitle>
									<CardDescription>
										Feature/award style banner with CTA button. This takes up half the width on desktop.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="promoBanner.rightBanner.image"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Background Image</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || ""}
														onChange={(url) => field.onChange(url || "")}
														showPreview
													/>
												</FormControl>
												<FormDescription>
													Full background image for the right banner.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="promoBanner.rightBanner.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Award Winning"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="promoBanner.rightBanner.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="2024"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="promoBanner.rightBanner.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Best Dairy Farm"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="promoBanner.rightBanner.ctaText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Button Text</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="LEARN MORE"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="promoBanner.rightBanner.ctaHref"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Button Link</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="/about"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Feature Banner Tab */}
						<TabsContent value="feature-banner" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Feature Banner Settings</CardTitle>
									<CardDescription>
										Configure the feature banner section with image, title (with highlight), and feature cards.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="featureBanner.image"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Banner Image</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || ""}
														onChange={(url) => field.onChange(url || "")}
														showPreview
													/>
												</FormControl>
												<FormDescription>
													Main image displayed at the top of the section.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="featureBanner.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="Our farm uses eco-friendly technologies and practices to minimize the environmental impact."
														rows={2}
													/>
												</FormControl>
												<FormDescription>
													Main title text. Include the highlight text within this title.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="featureBanner.titleHighlight"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title Highlight</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="eco-friendly"
													/>
												</FormControl>
												<FormDescription>
													The text within the title that should be highlighted in a different color.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Feature Banner Features */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Feature Cards</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => {
												const current = form.getValues("featureBanner.features") || [];
												form.setValue("featureBanner.features", [
													...current,
													{ icon: "Leaf", title: "", description: "" },
												]);
											}}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Feature
										</Button>
									</CardTitle>
									<CardDescription>
										Feature cards displayed below the title. Recommended: 4 features.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{(form.watch("featureBanner.features") || []).length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No features added. Click &quot;Add Feature&quot; to add one.
										</div>
									) : (
										(form.watch("featureBanner.features") || []).map((_, index) => (
											<Card key={index} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">
															Feature {index + 1}
														</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={() => {
																const current = form.getValues("featureBanner.features") || [];
																form.setValue(
																	"featureBanner.features",
																	current.filter((_, i) => i !== index)
																);
															}}
															className="text-destructive hover:text-destructive"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</CardHeader>
												<CardContent className="space-y-4">
													<FormField
														control={form.control}
														name={`featureBanner.features.${index}.icon`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Icon Name</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="Leaf, MilkOff, Package, Box, Sun, Snowflake, ShieldCheck, Droplet, Tag"
																	/>
																</FormControl>
																<FormDescription>
																	Available icons: Leaf, MilkOff, Package, Box, Sun, Snowflake, ShieldCheck, Droplet, Tag
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`featureBanner.features.${index}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="100% Organic Product"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`featureBanner.features.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Description</FormLabel>
																<FormControl>
																	<Textarea
																		{...field}
																		value={field.value || ""}
																		placeholder="Guaranteed quality from our farm to your table"
																		rows={2}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</CardContent>
											</Card>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Products Tab */}
						<TabsContent value="products" className="space-y-6">
							{/* Section Settings */}
							<Card>
								<CardHeader>
									<CardTitle>Section Settings</CardTitle>
									<CardDescription>
										Title and CTA for the product showcase section.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="productShowcase.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Premium Medical Equipment"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="productShowcase.ctaText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>CTA Button Text</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="View Full Catalog"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name="productShowcase.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="Explore our catalog of certified, high-performance medical devices..."
														rows={2}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="productShowcase.ctaHref"
										render={({ field }) => (
											<FormItem>
												<FormLabel>CTA Button Link</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="/produkter"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Products List */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Featured Products</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendProduct({
													name: "",
													category: "",
													description: "",
													status: "In Stock",
													image: "",
													href: "",
												})
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Product
										</Button>
									</CardTitle>
									<CardDescription>
										Products displayed in the showcase section.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{productFields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No products added. Click &quot;Add
											Product&quot; to add one.
										</div>
									) : (
										productFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">
															Product {index + 1}
														</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={async () => {
																const confirmed = await confirm({
																	title: "Remove Product",
																	description: "Are you sure you want to remove this product?",
																	confirmText: "Remove",
																});
																if (confirmed) removeProduct(index);
															}}
															className="text-destructive hover:text-destructive"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</CardHeader>
												<CardContent className="space-y-4">
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`productShowcase.products.${index}.name`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Name</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Advanced MRI Scanner X1"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`productShowcase.products.${index}.category`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Category
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Imaging"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<FormField
														control={form.control}
														name={`productShowcase.products.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Description
																</FormLabel>
																<FormControl>
																	<Textarea
																		{...field}
																		value={field.value || ""}
																		placeholder="Professional grade equipment..."
																		rows={2}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`productShowcase.products.${index}.status`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Status</FormLabel>
																	<Select
																		onValueChange={
																			field.onChange
																		}
																		value={field.value}
																	>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder="Select status" />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value="In Stock">
																				In Stock
																			</SelectItem>
																			<SelectItem value="Low Stock">
																				Low Stock
																			</SelectItem>
																			<SelectItem value="Pre-order">
																				Pre-order
																			</SelectItem>
																			<SelectItem value="Out of Stock">
																				Out of Stock
																			</SelectItem>
																		</SelectContent>
																	</Select>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`productShowcase.products.${index}.href`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Link (optional)
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="/produkter/product-slug"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<FormField
														control={form.control}
														name={`productShowcase.products.${index}.image`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Image</FormLabel>
																<FormControl>
																	<MediaPicker
																		type="image"
																		value={
																			field.value || null
																		}
																		onChange={(url) =>
																			field.onChange(
																				url || ""
																			)
																		}
																		placeholder="Select product image"
																		galleryTitle="Select Product Image"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</CardContent>
											</Card>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Gallery Tab */}
						<TabsContent value="gallery" className="space-y-6">
							{/* Section Settings */}
							<Card>
								<CardHeader>
									<CardTitle>Section Settings</CardTitle>
									<CardDescription>
										Title and CTA for the image gallery section.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="imageGallery.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Our Facilities"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="imageGallery.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Excellence in Action"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="imageGallery.subtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="See how our equipment transforms..."
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="border rounded-lg p-4 space-y-4">
										<h4 className="font-medium">Bottom CTA Card</h4>
										<div className="grid gap-4 sm:grid-cols-2">
											<FormField
												control={form.control}
												name="imageGallery.ctaTitle"
												render={({ field }) => (
													<FormItem>
														<FormLabel>CTA Title</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Want to see more?"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="imageGallery.ctaButtonText"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Button Text</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Book Tour"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<FormField
											control={form.control}
											name="imageGallery.ctaSubtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>CTA Subtitle</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Book a virtual tour of our facilities..."
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Gallery Images */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Gallery Images</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendGalleryImage({
													src: "",
													title: "",
													subtitle: "",
												})
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Image
										</Button>
									</CardTitle>
									<CardDescription>
										Images displayed in the gallery grid. First image
										is larger.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{galleryImageFields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No images added. Click &quot;Add Image&quot; to
											add one.
										</div>
									) : (
										galleryImageFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">
															{index === 0
																? "Featured Image"
																: `Image ${index + 1}`}
														</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={async () => {
																const confirmed = await confirm({
																	title: "Remove Gallery Image",
																	description: "Are you sure you want to remove this image?",
																	confirmText: "Remove",
																});
																if (confirmed) removeGalleryImage(index);
															}}
															className="text-destructive hover:text-destructive"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</CardHeader>
												<CardContent className="space-y-4">
													<FormField
														control={form.control}
														name={`imageGallery.images.${index}.src`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Image</FormLabel>
																<FormControl>
																	<MediaPicker
																		type="image"
																		value={
																			field.value || null
																		}
																		onChange={(url) =>
																			field.onChange(
																				url || ""
																			)
																		}
																		placeholder="Select gallery image"
																		galleryTitle="Select Gallery Image"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`imageGallery.images.${index}.title`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Modern Operating Theaters"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`imageGallery.images.${index}.subtitle`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Subtitle
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Equipped with precision robotics"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</CardContent>
											</Card>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* About Section Tab */}
						<TabsContent value="about" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>About Section</CardTitle>
									<CardDescription>
										Section describing the company and its benefits.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="aboutSection.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Why choose Zavd"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="aboutSection.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Empowering healthcare with"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="aboutSection.titleHighlight"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (highlight)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="precision technology"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="aboutSection.content"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Content</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="At Zavd Medical we bridge..."
														rows={4}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="aboutSection.image"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Image</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || null}
														onChange={(url) =>
															field.onChange(url || "")
														}
														placeholder="Select image for the about section"
														galleryTitle="Select About Image"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Benefits */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h4 className="font-medium">Benefits</h4>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={addBenefit}
											>
												<Plus className="h-4 w-4 mr-1" />
												Add
											</Button>
										</div>
										{benefits.map((benefit, index) => (
											<div
												key={index}
												className="flex gap-2 items-center"
											>
												<Input
													className="flex-1"
													placeholder="MDR certified equipment"
													value={benefit}
													onChange={(e) =>
														updateBenefit(index, e.target.value)
													}
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove Benefit",
															description: "Are you sure you want to remove this benefit?",
															confirmText: "Remove",
														});
														if (confirmed) removeBenefit(index);
													}}
													className="text-destructive hover:text-destructive"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>

									{/* About Section CTAs */}
									<div className="border rounded-lg p-4 space-y-4">
										<h4 className="font-medium">Primary Button</h4>
										<div className="grid gap-4 sm:grid-cols-3">
											<FormField
												control={form.control}
												name="aboutSection.primaryCta.text"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Text</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Learn more about us"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="aboutSection.primaryCta.href"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Link</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="/about"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="aboutSection.primaryCta.variant"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Style</FormLabel>
														<Select
															onValueChange={field.onChange}
															value={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select style" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="primary">
																	Primary
																</SelectItem>
																<SelectItem value="secondary">
																	Secondary
																</SelectItem>
																<SelectItem value="outline">
																	Outline
																</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									{/* Secondary Button */}
									<div className="border rounded-lg p-4 space-y-4">
										<h4 className="font-medium">Secondary Button</h4>
										<div className="grid gap-4 sm:grid-cols-3">
											<FormField
												control={form.control}
												name="aboutSection.secondaryCta.text"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Text</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Contact us"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="aboutSection.secondaryCta.href"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Link</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="/kontakt"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="aboutSection.secondaryCta.variant"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Style</FormLabel>
														<Select
															onValueChange={field.onChange}
															value={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select style" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="primary">
																	Primary
																</SelectItem>
																<SelectItem value="secondary">
																	Secondary
																</SelectItem>
																<SelectItem value="outline">
																	Outline
																</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									{/* Certification Badge */}
									<div className="border rounded-lg p-4 space-y-4">
										<h4 className="font-medium">
											Certification Badge (on image)
										</h4>
										<FormField
											control={form.control}
											name="aboutSection.certificationBadge.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="ISO 13485 Certified"
														/>
													</FormControl>
													<FormDescription>
														Title displayed on the certification
														badge overlay.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="aboutSection.certificationBadge.description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Description</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Setting the gold standard in medical technology distribution."
															rows={2}
														/>
													</FormControl>
													<FormDescription>
														Short text displayed below the badge
														title.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Testimonials Tab */}
						<TabsContent value="testimonials" className="space-y-6">
							{/* Section Settings */}
							<Card>
								<CardHeader>
									<CardTitle>Section Settings</CardTitle>
									<CardDescription>
										Optional heading shown above the partner logos grid.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="testimonialsSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Title</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Our Partners"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="testimonialsSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Subtitle</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="Organizations we work with..."
														rows={2}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Partner Logos List */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Partner Logos</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendTestimonial({
													quote: "",
													author: "",
													role: "",
													company: "",
												})
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Partner
										</Button>
									</CardTitle>
									<CardDescription>
										Partner / organization logos displayed in a grid row on the landing page.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{testimonialFields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No partners added yet. Click &quot;Add Partner&quot; to add one.
										</div>
									) : (
										testimonialFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">
															Partner {index + 1}
														</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={async () => {
																const confirmed = await confirm({
																	title: "Remove Partner",
																	description: "Are you sure you want to remove this partner?",
																	confirmText: "Remove",
																});
																if (confirmed) removeTestimonial(index);
															}}
															className="text-destructive hover:text-destructive"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</CardHeader>
												<CardContent className="space-y-4">
													{/* Logo Image */}
													<FormField
														control={form.control}
														name={`testimonialsSection.testimonials.${index}.image`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Logo Image</FormLabel>
																<FormControl>
																	<MediaPicker
																		type="image"
																		value={field.value || ""}
																		onChange={(url) => field.onChange(url || "")}
																		showPreview
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													{/* Organization Name */}
													<FormField
														control={form.control}
														name={`testimonialsSection.testimonials.${index}.author`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Organization Name</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="Deutsches Rotes Kreuz"
																	/>
																</FormControl>
																<FormDescription>Shown below the logo image (optional).</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
												</CardContent>
											</Card>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>
						{/* CTA Section Tab */}
						<TabsContent value="cta" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>CTA Section</CardTitle>
									<CardDescription>
										Call-to-action section at the bottom of the home
										page.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="ctaSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Ready to upgrade your business?"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="ctaSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="Contact us today..."
														rows={2}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="ctaSection.phoneTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Call us directly"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.phoneSubtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Subtitle</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="We are available..."
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="ctaSection.emailTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Email"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.emailSubtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Subtitle</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Send us a message"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="border rounded-lg p-4 space-y-4">
										<h4 className="font-medium">Contact Form Card</h4>
										<FormField
											control={form.control}
											name="ctaSection.formTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Have questions?"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.formSubtitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Fill out our contact form..."
															rows={2}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.formCtaText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Button Text</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Send Message"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.formCtaHref"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Button Link</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="/contact-us"
														/>
													</FormControl>
													<FormDescription>
														The URL the button will link to (e.g., /contact-us)
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Rich Content Tab — hidden
						<TabsContent value="rich-content" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Rich Content Editor</CardTitle>
									<CardDescription>
										Use the text editor to create flexible HTML content. This content will be rendered as-is on the page.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<FormField
										control={form.control}
										name="richContent"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Content</FormLabel>
												<FormControl>
													<TextEditor
														defaultValue={field.value || ""}
														onChange={field.onChange}
														variant="advanceFull"
														height="500px"
														placeholder="Enter your content here..."
													/>
												</FormControl>
												<FormDescription>
													Use the toolbar to format text, add images, tables, links, and more.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>
						*/}

						{/* SEO Tab */}
						<TabsContent value="seo" className="space-y-6">
							<div className="grid gap-6 lg:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>SEO Settings</CardTitle>
										<CardDescription>
											Search engine optimization for the home page.
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="seo.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Page Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Zavd Medical - Medical Equipment"
														/>
													</FormControl>
													<FormDescription>
														Displayed in browser tab and search
														results.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="seo.description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Meta Description</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Sweden's leading supplier..."
															rows={3}
														/>
													</FormControl>
													<FormDescription>
														Short description shown in search
														results.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="seo.ogImage"
											render={({ field }) => (
												<FormItem>
													<FormLabel>OG Image</FormLabel>
													<FormControl>
														<MediaPicker
															type="image"
															value={field.value || null}
															onChange={(url) =>
																field.onChange(url || "")
															}
															placeholder="Select OG image (1200x630px recommended)"
															galleryTitle="Select OG Image"
														/>
													</FormControl>
													<FormDescription>
														Image shown when sharing on social
														media.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Preview</CardTitle>
										<CardDescription>
											See how the home page appears in search results
											and social media.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<SeoPreview
											data={{
												title:
													form.watch("seo.title") ||
													"Zavd Medical - Medical Equipment",
												description:
													form.watch("seo.description") ||
													"Add a description",
												slug: "",
												ogImage: form.watch("seo.ogImage") || null,
												siteName: "Zavd Medical",
												siteUrl: "www.zavd.se",
											}}
										/>
									</CardContent>
								</Card>
							</div>
						</TabsContent>
					</Tabs>

					{/* Save Button */}
					<div className="flex justify-end">
						<Button type="submit" disabled={saving} size="lg">
							{saving ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Saving...
								</>
							) : (
								"Save Changes"
							)}
						</Button>
					</div>
				</form>
			</Form>
			<ConfirmModal />
		</div>
	);
}
