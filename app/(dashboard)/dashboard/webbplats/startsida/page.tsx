"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
	textDe: z.string().optional(),
	textEn: z.string().optional(),
	href: z.string().optional(),
	variant: z.enum(["primary", "outline", "secondary"]).optional(),
});

// Trust Indicator schema - optional fields
const trustIndicatorSchema = z.object({
	icon: z.string().optional(),
	textDe: z.string().optional(),
	textEn: z.string().optional(),
});


// Hero Slide schema for slider mode
const heroSlideSchema = z.object({
	badgeDe: z.string().optional(),
	badgeEn: z.string().optional(),
	titleDe: z.string().optional(),
	titleEn: z.string().optional(),
	subtitleDe: z.string().optional(),
	subtitleEn: z.string().optional(),
	backgroundImage: z.string().optional(),
	ctaTextDe: z.string().optional(),
	ctaTextEn: z.string().optional(),
	ctaHref: z.string().optional(),
	isActive: z.boolean().optional(),
});

// Hero Floating Card schema
const heroFloatingCardSchema = z.object({
	image: z.string().optional(),
	labelDe: z.string().optional(),
	labelEn: z.string().optional(),
});

// Hero Certification Card schema
const heroCertificationCardSchema = z.object({
	titleDe: z.string().optional(),
	titleEn: z.string().optional(),
	subtitleDe: z.string().optional(),
	subtitleEn: z.string().optional(),
	progressLabelDe: z.string().optional(),
	progressLabelEn: z.string().optional(),
	progressValueDe: z.string().optional(),
	progressValueEn: z.string().optional(),
	progressPercentage: z.number().min(0).max(100).optional(),
});


// Gallery Image schema - optional fields
const galleryImageSchema = z.object({
	src: z.string().optional(),
	titleDe: z.string().optional(),
	titleEn: z.string().optional(),
	subtitleDe: z.string().optional(),
	subtitleEn: z.string().optional(),
});

// Image Gallery Section schema
const imageGallerySectionSchema = z.object({
	badgeDe: z.string().optional(),
	badgeEn: z.string().optional(),
	titleDe: z.string().optional(),
	titleEn: z.string().optional(),
	subtitleDe: z.string().optional(),
	subtitleEn: z.string().optional(),
	images: z.array(galleryImageSchema).optional(),
	ctaTitleDe: z.string().optional(),
	ctaTitleEn: z.string().optional(),
	ctaSubtitleDe: z.string().optional(),
	ctaSubtitleEn: z.string().optional(),
	ctaButtonTextDe: z.string().optional(),
	ctaButtonTextEn: z.string().optional(),
});

// Testimonial Item schema - optional fields
const testimonialItemSchema = z.object({
	titleDe: z.string().optional(),
	titleEn: z.string().optional(),
	subtitleDe: z.string().optional(),
	subtitleEn: z.string().optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	image: z.string().optional(),
});

// Testimonials Section schema
const testimonialsSectionSchema = z.object({
	titleDe: z.string().optional(),
	titleEn: z.string().optional(),
	subtitleDe: z.string().optional(),
	subtitleEn: z.string().optional(),
	testimonials: z.array(testimonialItemSchema).optional(),
});

// Partner Logo schema
const partnerLogoSchema = z.object({
	image: z.string().optional(),
	name: z.string().optional(),
	href: z.string().optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
});

// Integration Section schema
const integrationSectionSchema = z.object({
	headingDe: z.string().optional(),
	headingEn: z.string().optional(),
	quoteDe: z.string().optional(),
	quoteEn: z.string().optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	image: z.string().optional(),
	readMoreLink: z.string().optional(),
	partnerLogos: z.array(partnerLogoSchema).optional(),
});

// Sponsors Section schema
const sponsorsSectionSchema = z.object({
	headingDe: z.string().optional(),
	headingEn: z.string().optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	backgroundImage: z.string().optional(),
	sponsors: z.array(partnerLogoSchema).optional(),
});

// Volunteering Section schema
const volunteeringSectionSchema = z.object({
	headingDe: z.string().optional(),
	headingEn: z.string().optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	image: z.string().optional(),
	partnerLogos: z.array(partnerLogoSchema).optional(),
});

// Partners Carousel Section schema
const partnersCarouselSectionSchema = z.object({
	headingDe: z.string().optional(),
	headingEn: z.string().optional(),
	logos: z.array(partnerLogoSchema).optional(),
});

// Section Visibility schema
const sectionVisibilitySchema = z.object({
	hero: z.boolean().optional(),
	integrationSection: z.boolean().optional(),
	sponsorsSection: z.boolean().optional(),
	volunteeringSection: z.boolean().optional(),
	partnersCarousel: z.boolean().optional(),
	imageGallery: z.boolean().optional(),
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
			badgeDe: z.string().optional(),
			badgeEn: z.string().optional(),
			titleDe: z.string().optional(),
			titleEn: z.string().optional(),
			titleHighlightDe: z.string().optional(),
			titleHighlightEn: z.string().optional(),
			subtitleDe: z.string().optional(),
			subtitleEn: z.string().optional(),
			primaryCta: ctaButtonSchema.optional(),
			secondaryCta: ctaButtonSchema.optional(),
			backgroundImage: z.string().optional(),
			mainImage: z.string().optional(),
			trustIndicators: z.array(trustIndicatorSchema).optional(),
			floatingCard: heroFloatingCardSchema.optional(),
			certificationCard: heroCertificationCardSchema.optional(),
		})
		.optional(),

	// Integration Section
	integrationSection: integrationSectionSchema.optional(),

	// Sponsors Section
	sponsorsSection: sponsorsSectionSchema.optional(),

	// Volunteering Section
	volunteeringSection: volunteeringSectionSchema.optional(),

	// Partners Carousel Section
	partnersCarouselSection: partnersCarouselSectionSchema.optional(),

	// Image Gallery
	imageGallery: imageGallerySectionSchema.optional(),

	// Testimonials Section
	testimonialsSection: testimonialsSectionSchema.optional(),

	// CTA Section - all fields optional
	ctaSection: z
		.object({
			titleDe: z.string().optional(),
			titleEn: z.string().optional(),
			subtitleDe: z.string().optional(),
			subtitleEn: z.string().optional(),
			phoneTitleDe: z.string().optional(),
			phoneTitleEn: z.string().optional(),
			phoneSubtitleDe: z.string().optional(),
			phoneSubtitleEn: z.string().optional(),
			emailTitleDe: z.string().optional(),
			emailTitleEn: z.string().optional(),
			emailSubtitleDe: z.string().optional(),
			emailSubtitleEn: z.string().optional(),
			formTitleDe: z.string().optional(),
			formTitleEn: z.string().optional(),
			formSubtitleDe: z.string().optional(),
			formSubtitleEn: z.string().optional(),
			formCtaTextDe: z.string().optional(),
			formCtaTextEn: z.string().optional(),
			formCtaHref: z.string().optional(),
		})
		.optional(),

	// Rich Content (HTML from text editor)
	richContent: z.string().optional(),

	// SEO
	seo: z
		.object({
			titleDe: z.string().optional(),
			titleEn: z.string().optional(),
			descriptionDe: z.string().optional(),
			descriptionEn: z.string().optional(),
			ogImage: z.string().optional(),
		})
		.optional(),
});

type HomePageFormValues = z.infer<typeof homePageFormSchema>;

export default function StartsidaPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<HomePageFormValues>({
		resolver: zodResolver(homePageFormSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				integrationSection: true,
				sponsorsSection: true,
				volunteeringSection: true,
				partnersCarousel: true,
				imageGallery: true,
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
				badgeDe: "",
				badgeEn: "",
				titleDe: "",
				titleEn: "",
				titleHighlightDe: "",
				titleHighlightEn: "",
				subtitleDe: "",
				subtitleEn: "",
				primaryCta: { textDe: "", textEn: "", href: "", variant: "primary" },
				secondaryCta: { textDe: "", textEn: "", href: "", variant: "outline" },
				backgroundImage: "",
				mainImage: "",
				trustIndicators: [],
				floatingCard: { image: "", labelDe: "", labelEn: "" },
				certificationCard: {
					titleDe: "",
					titleEn: "",
					subtitleDe: "",
					subtitleEn: "",
					progressLabelDe: "",
					progressLabelEn: "",
					progressValueDe: "",
					progressValueEn: "",
					progressPercentage: 0,
				},
			},
			integrationSection: {
				headingDe: "",
				headingEn: "",
				quoteDe: "",
				quoteEn: "",
				descriptionDe: "",
				descriptionEn: "",
				image: "",
				readMoreLink: "",
				partnerLogos: [],
			},
			sponsorsSection: {
				headingDe: "",
				headingEn: "",
				descriptionDe: "",
				descriptionEn: "",
				backgroundImage: "",
				sponsors: [],
			},
			volunteeringSection: {
				headingDe: "",
				headingEn: "",
				descriptionDe: "",
				descriptionEn: "",
				image: "",
				partnerLogos: [],
			},
			partnersCarouselSection: {
				headingDe: "",
				headingEn: "",
				logos: [],
			},
			imageGallery: {
				badgeDe: "",
				badgeEn: "",
				titleDe: "",
				titleEn: "",
				subtitleDe: "",
				subtitleEn: "",
				images: [],
				ctaTitleDe: "",
				ctaTitleEn: "",
				ctaSubtitleDe: "",
				ctaSubtitleEn: "",
				ctaButtonTextDe: "",
				ctaButtonTextEn: "",
			},
			testimonialsSection: {
				titleDe: "",
				titleEn: "",
				subtitleDe: "",
				subtitleEn: "",
				testimonials: [],
			},
			ctaSection: {
				titleDe: "",
				titleEn: "",
				subtitleDe: "",
				subtitleEn: "",
				phoneTitleDe: "",
				phoneTitleEn: "",
				phoneSubtitleDe: "",
				phoneSubtitleEn: "",
				emailTitleDe: "",
				emailTitleEn: "",
				emailSubtitleDe: "",
				emailSubtitleEn: "",
				formTitleDe: "",
				formTitleEn: "",
				formSubtitleDe: "",
				formSubtitleEn: "",
				formCtaTextDe: "",
				formCtaTextEn: "",
				formCtaHref: "",
			},
			richContent: "",
			seo: {
				titleDe: "",
				titleEn: "",
				descriptionDe: "",
				descriptionEn: "",
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
		fields: integrationLogoFields,
		append: appendIntegrationLogo,
		remove: removeIntegrationLogo,
	} = useFieldArray({
		control: form.control,
		name: "integrationSection.partnerLogos",
	});

	const {
		fields: sponsorFields,
		append: appendSponsor,
		remove: removeSponsor,
	} = useFieldArray({
		control: form.control,
		name: "sponsorsSection.sponsors",
	});

	const {
		fields: volunteeringLogoFields,
		append: appendVolunteeringLogo,
		remove: removeVolunteeringLogo,
	} = useFieldArray({
		control: form.control,
		name: "volunteeringSection.partnerLogos",
	});

	const {
		fields: partnerCarouselLogoFields,
		append: appendPartnerCarouselLogo,
		remove: removePartnerCarouselLogo,
	} = useFieldArray({
		control: form.control,
		name: "partnersCarouselSection.logos",
	});

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
					integrationSection: true,
					sponsorsSection: true,
					volunteeringSection: true,
					partnersCarousel: true,
					imageGallery: true,
					testimonials: true,
					cta: true,
					richContent: false,
				};
				const sectionVisibility = {
					hero: content.sectionVisibility?.hero ?? defaultVisibility.hero,
					integrationSection: content.sectionVisibility?.integrationSection ?? true,
					sponsorsSection: content.sectionVisibility?.sponsorsSection ?? true,
					volunteeringSection: content.sectionVisibility?.volunteeringSection ?? true,
					partnersCarousel: content.sectionVisibility?.partnersCarousel ?? true,
					imageGallery:
						content.sectionVisibility?.imageGallery ??
						defaultVisibility.imageGallery,
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
						badgeDe: content.hero?.badgeDe || "",
						badgeEn: content.hero?.badgeEn || "",
						titleDe: content.hero?.titleDe || "",
						titleEn: content.hero?.titleEn || "",
						titleHighlightDe: content.hero?.titleHighlightDe || "",
						titleHighlightEn: content.hero?.titleHighlightEn || "",
						subtitleDe: content.hero?.subtitleDe || "",
						subtitleEn: content.hero?.subtitleEn || "",
						primaryCta: content.hero?.primaryCta || {
							textDe: "",
							textEn: "",
							href: "",
							variant: "primary",
						},
						secondaryCta: content.hero?.secondaryCta || {
							textDe: "",
							textEn: "",
							href: "",
							variant: "outline",
						},
						backgroundImage: content.hero?.backgroundImage || "",
						mainImage: content.hero?.mainImage || "",
						trustIndicators: content.hero?.trustIndicators || [],
						floatingCard: content.hero?.floatingCard || {
							image: "",
							labelDe: "",
							labelEn: "",
						},
						certificationCard: content.hero?.certificationCard || {
							titleDe: "",
							titleEn: "",
							subtitleDe: "",
							subtitleEn: "",
							progressLabelDe: "",
							progressLabelEn: "",
							progressValueDe: "",
							progressValueEn: "",
							progressPercentage: 0,
						},
					},
					integrationSection: {
						headingDe: content.integrationSection?.headingDe || "",
						headingEn: content.integrationSection?.headingEn || "",
						quoteDe: content.integrationSection?.quoteDe || "",
						quoteEn: content.integrationSection?.quoteEn || "",
						descriptionDe: content.integrationSection?.descriptionDe || "",
						descriptionEn: content.integrationSection?.descriptionEn || "",
						image: content.integrationSection?.image || "",
						readMoreLink: content.integrationSection?.readMoreLink || "",
						partnerLogos: content.integrationSection?.partnerLogos || [],
					},
					sponsorsSection: {
						headingDe: content.sponsorsSection?.headingDe || "",
						headingEn: content.sponsorsSection?.headingEn || "",
						descriptionDe: content.sponsorsSection?.descriptionDe || "",
						descriptionEn: content.sponsorsSection?.descriptionEn || "",
						backgroundImage: content.sponsorsSection?.backgroundImage || "",
						sponsors: content.sponsorsSection?.sponsors || [],
					},
					volunteeringSection: {
						headingDe: content.volunteeringSection?.headingDe || "",
						headingEn: content.volunteeringSection?.headingEn || "",
						descriptionDe: content.volunteeringSection?.descriptionDe || "",
						descriptionEn: content.volunteeringSection?.descriptionEn || "",
						image: content.volunteeringSection?.image || "",
						partnerLogos: content.volunteeringSection?.partnerLogos || [],
					},
					partnersCarouselSection: {
						headingDe: content.partnersCarouselSection?.headingDe || "",
						headingEn: content.partnersCarouselSection?.headingEn || "",
						logos: content.partnersCarouselSection?.logos || [],
					},
					imageGallery: {
						badgeDe: content.imageGallery?.badgeDe || "",
						badgeEn: content.imageGallery?.badgeEn || "",
						titleDe: content.imageGallery?.titleDe || "",
						titleEn: content.imageGallery?.titleEn || "",
						subtitleDe: content.imageGallery?.subtitleDe || "",
						subtitleEn: content.imageGallery?.subtitleEn || "",
						images: content.imageGallery?.images || [],
						ctaTitleDe: content.imageGallery?.ctaTitleDe || "",
						ctaTitleEn: content.imageGallery?.ctaTitleEn || "",
						ctaSubtitleDe: content.imageGallery?.ctaSubtitleDe || "",
						ctaSubtitleEn: content.imageGallery?.ctaSubtitleEn || "",
						ctaButtonTextDe: content.imageGallery?.ctaButtonTextDe || "",
						ctaButtonTextEn: content.imageGallery?.ctaButtonTextEn || "",
					},
					testimonialsSection: {
						titleDe: content.testimonialsSection?.titleDe ?? "",
						titleEn: content.testimonialsSection?.titleEn ?? "",
						subtitleDe: content.testimonialsSection?.subtitleDe ?? "",
						subtitleEn: content.testimonialsSection?.subtitleEn ?? "",
						testimonials: Array.isArray(
							content.testimonialsSection?.testimonials
						)
							? content.testimonialsSection.testimonials
							: [],
					},
					ctaSection: {
						titleDe: content.ctaSection?.titleDe || "",
						titleEn: content.ctaSection?.titleEn || "",
						subtitleDe: content.ctaSection?.subtitleDe || "",
						subtitleEn: content.ctaSection?.subtitleEn || "",
						phoneTitleDe: content.ctaSection?.phoneTitleDe || "",
						phoneTitleEn: content.ctaSection?.phoneTitleEn || "",
						phoneSubtitleDe: content.ctaSection?.phoneSubtitleDe || "",
						phoneSubtitleEn: content.ctaSection?.phoneSubtitleEn || "",
						emailTitleDe: content.ctaSection?.emailTitleDe || "",
						emailTitleEn: content.ctaSection?.emailTitleEn || "",
						emailSubtitleDe: content.ctaSection?.emailSubtitleDe || "",
						emailSubtitleEn: content.ctaSection?.emailSubtitleEn || "",
						formTitleDe: content.ctaSection?.formTitleDe || "",
						formTitleEn: content.ctaSection?.formTitleEn || "",
						formSubtitleDe: content.ctaSection?.formSubtitleDe || "",
						formSubtitleEn: content.ctaSection?.formSubtitleEn || "",
						formCtaTextDe: content.ctaSection?.formCtaTextDe || "",
						formCtaTextEn: content.ctaSection?.formCtaTextEn || "",
						formCtaHref: content.ctaSection?.formCtaHref || "",
					},
					richContent: content.richContent || "",
					seo: {
						titleDe: content.seo?.titleDe || "",
						titleEn: content.seo?.titleEn || "",
						descriptionDe: content.seo?.descriptionDe || "",
						descriptionEn: content.seo?.descriptionEn || "",
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
			router.refresh();
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
		imageGallery: "Image Gallery",
		aboutSection: "About Section",
		testimonialsSection: "Testimonials",
		ctaSection: "CTA Section",
		seo: "SEO",
		sectionVisibility: "Section Visibility",
		titleDe: "Title (DE)",
		titleEn: "Title (EN)",
		subtitleDe: "Subtitle (DE)",
		subtitleEn: "Subtitle (EN)",
		contentDe: "Content (DE)",
		contentEn: "Content (EN)",
		badgeDe: "Badge (DE)",
		badgeEn: "Badge (EN)",
		quoteDe: "Quote (DE)",
		quoteEn: "Quote (EN)",
		testimonials: "Testimonials list",
		textDe: "Button text (DE)",
		textEn: "Button text (EN)",
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
								<TabsTrigger value="integration">Integration</TabsTrigger>
							<TabsTrigger value="sponsors">Sponsors</TabsTrigger>
							<TabsTrigger value="volunteering">Volunteering</TabsTrigger>
							<TabsTrigger value="partners-carousel">Partners</TabsTrigger>
							<TabsTrigger value="gallery">Gallery</TabsTrigger>
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
											name="sectionVisibility.integrationSection"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Integration Section
														</FormLabel>
														<FormDescription>
															ZAVD partnerships and integration info.
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
											name="sectionVisibility.sponsorsSection"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Sponsors Section
														</FormLabel>
														<FormDescription>
															Government sponsors and funding partners.
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
											name="sectionVisibility.volunteeringSection"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel className="text-base">
															Volunteering Section
														</FormLabel>
														<FormDescription>
															Volunteering opportunities and partner logos.
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
								name="sectionVisibility.partnersCarousel"
								render={({ field }) => (
									<FormItem className="flex items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">
												Partners Carousel
											</FormLabel>
											<FormDescription>
												Auto-scrolling partner logos carousel.
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
										{/* Rich Content visibility toggle -- hidden
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
															onChange={(e) => {
																const val = Number(e.target.value);
																field.onChange(val >= 1000 ? val : undefined);
															}}
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
														badgeDe: "",
														badgeEn: "",
														titleDe: "",
														titleEn: "",
														subtitleDe: "",
														subtitleEn: "",
														backgroundImage: "",
														ctaTextDe: "READ MORE",
														ctaTextEn: "READ MORE",
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

													{/* Badge De/En */}
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<FormField
															control={form.control}
															name={`hero.slides.${index}.badgeDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Badge (DE)</FormLabel>
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
															name={`hero.slides.${index}.badgeEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Badge (EN)</FormLabel>
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
													</div>

													{/* Title De/En */}
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<FormField
															control={form.control}
															name={`hero.slides.${index}.titleDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title (DE)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Titel auf Deutsch"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`hero.slides.${index}.titleEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title (EN)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Title in English"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>

													{/* Subtitle De/En */}
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<FormField
															control={form.control}
															name={`hero.slides.${index}.subtitleDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Subtitle (DE)</FormLabel>
																	<FormControl>
																		<Textarea
																			{...field}
																			value={field.value || ""}
																			placeholder="Beschreibung auf Deutsch..."
																			rows={2}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`hero.slides.${index}.subtitleEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Subtitle (EN)</FormLabel>
																	<FormControl>
																		<Textarea
																			{...field}
																			value={field.value || ""}
																			placeholder="Description in English..."
																			rows={2}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>

													{/* CTA Button Text De/En + Link */}
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<FormField
															control={form.control}
															name={`hero.slides.${index}.ctaTextDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Button Text (DE)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="MEHR LESEN"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`hero.slides.${index}.ctaTextEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Button Text (EN)</FormLabel>
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
													</div>
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
											))
										)}
									</CardContent>
								</Card>
						</TabsContent>
						{/* Integration Section Tab */}
						<TabsContent value="integration" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Integration Section</CardTitle>
									<CardDescription>Manage the integration/partnership section content.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Heading De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField control={form.control} name="integrationSection.headingDe" render={({ field }) => (
											<FormItem>
												<FormLabel>Heading (DE)</FormLabel>
												<FormControl><Input placeholder="Überschrift auf Deutsch..." {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
										<FormField control={form.control} name="integrationSection.headingEn" render={({ field }) => (
											<FormItem>
												<FormLabel>Heading (EN)</FormLabel>
												<FormControl><Input placeholder="Heading in English..." {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
									</div>
									{/* Quote De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField control={form.control} name="integrationSection.quoteDe" render={({ field }) => (
											<FormItem>
												<FormLabel>Quote (DE)</FormLabel>
												<FormControl><Textarea placeholder="Zitat auf Deutsch..." rows={3} {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
										<FormField control={form.control} name="integrationSection.quoteEn" render={({ field }) => (
											<FormItem>
												<FormLabel>Quote (EN)</FormLabel>
												<FormControl><Textarea placeholder="Quote in English..." rows={3} {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
									</div>
									{/* Description De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField control={form.control} name="integrationSection.descriptionDe" render={({ field }) => (
											<FormItem>
												<FormLabel>Description (DE)</FormLabel>
												<FormControl><Textarea placeholder="Beschreibung auf Deutsch..." rows={5} {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
										<FormField control={form.control} name="integrationSection.descriptionEn" render={({ field }) => (
											<FormItem>
												<FormLabel>Description (EN)</FormLabel>
												<FormControl><Textarea placeholder="Description in English..." rows={5} {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
									</div>
									<FormField control={form.control} name="integrationSection.readMoreLink" render={({ field }) => (
										<FormItem>
											<FormLabel>Read More Link</FormLabel>
											<FormControl><Input placeholder="/about" {...field} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<FormField control={form.control} name="integrationSection.image" render={({ field }) => (
										<FormItem>
											<FormLabel>Section Image</FormLabel>
											<FormControl><MediaPicker type="image" value={field.value || ""} onChange={(url) => field.onChange(url || "")} showPreview /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle>Partner Logos</CardTitle>
											<CardDescription>Add partner/organization logos.</CardDescription>
										</div>
										<Button type="button" variant="outline" size="sm" onClick={() => appendIntegrationLogo({ image: '', name: '', href: '', descriptionDe: '', descriptionEn: '' })}>
											<Plus className="mr-2 h-4 w-4" />Add Logo
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									{integrationLogoFields.length === 0 ? (
										<div className="text-center py-6 text-muted-foreground">No logos added yet.</div>
									) : (
										integrationLogoFields.map((logo, index) => (
											<div key={logo.id} className="border rounded-lg p-4 space-y-3">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium">Logo {index + 1}</span>
													<Button type="button" variant="ghost" size="icon" onClick={() => removeIntegrationLogo(index)}>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
												<FormField control={form.control} name={`integrationSection.partnerLogos.${index}.image`} render={({ field }) => (
													<FormItem>
														<FormLabel>Logo Image</FormLabel>
														<FormControl><MediaPicker type="image" value={field.value || ""} onChange={(url) => field.onChange(url || "")} showPreview /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
												<FormField control={form.control} name={`integrationSection.partnerLogos.${index}.name`} render={({ field }) => (
													<FormItem>
														<FormLabel>Name</FormLabel>
														<FormControl><Input placeholder="Organization name" {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
												<FormField control={form.control} name={`integrationSection.partnerLogos.${index}.href`} render={({ field }) => (
													<FormItem>
														<FormLabel>Link URL</FormLabel>
														<FormControl><Input placeholder="https://..." {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													<FormField control={form.control} name={`integrationSection.partnerLogos.${index}.descriptionDe`} render={({ field }) => (
														<FormItem>
															<FormLabel>Description (DE)</FormLabel>
															<FormControl><Input placeholder="Kurze Beschreibung..." {...field} /></FormControl>
															<FormMessage />
														</FormItem>
													)} />
													<FormField control={form.control} name={`integrationSection.partnerLogos.${index}.descriptionEn`} render={({ field }) => (
														<FormItem>
															<FormLabel>Description (EN)</FormLabel>
															<FormControl><Input placeholder="Short description..." {...field} /></FormControl>
															<FormMessage />
														</FormItem>
													)} />
												</div>
											</div>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Sponsors Section Tab */}
						<TabsContent value="sponsors" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Sponsors Section</CardTitle>
									<CardDescription>Manage sponsors and funding partners content.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Heading De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField control={form.control} name="sponsorsSection.headingDe" render={({ field }) => (
											<FormItem>
												<FormLabel>Heading (DE)</FormLabel>
												<FormControl><Input placeholder="Überschrift auf Deutsch..." {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
										<FormField control={form.control} name="sponsorsSection.headingEn" render={({ field }) => (
											<FormItem>
												<FormLabel>Heading (EN)</FormLabel>
												<FormControl><Input placeholder="Heading in English..." {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
									</div>
									{/* Description De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField control={form.control} name="sponsorsSection.descriptionDe" render={({ field }) => (
											<FormItem>
												<FormLabel>Description (DE)</FormLabel>
												<FormControl><Textarea placeholder="Beschreibung auf Deutsch..." rows={4} {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
										<FormField control={form.control} name="sponsorsSection.descriptionEn" render={({ field }) => (
											<FormItem>
												<FormLabel>Description (EN)</FormLabel>
												<FormControl><Textarea placeholder="Description in English..." rows={4} {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
									</div>
								<FormField control={form.control} name="sponsorsSection.backgroundImage" render={({ field }) => (
									<FormItem>
										<FormLabel>Background Image</FormLabel>
										<FormControl><MediaPicker type="image" value={field.value || ""} onChange={(url) => field.onChange(url || "")} showPreview /></FormControl>
										<FormMessage />
									</FormItem>
								)} />
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle>Sponsor Logos</CardTitle>
											<CardDescription>Add sponsor/funder logos.</CardDescription>
										</div>
										<Button type="button" variant="outline" size="sm" onClick={() => appendSponsor({ image: '', name: '', href: '', descriptionDe: '', descriptionEn: '' })}>
											<Plus className="mr-2 h-4 w-4" />Add Sponsor
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									{sponsorFields.length === 0 ? (
										<div className="text-center py-6 text-muted-foreground">No logos added yet.</div>
									) : (
										sponsorFields.map((logo, index) => (
											<div key={logo.id} className="border rounded-lg p-4 space-y-3">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium">Logo {index + 1}</span>
													<Button type="button" variant="ghost" size="icon" onClick={() => removeSponsor(index)}>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
												<FormField control={form.control} name={`sponsorsSection.sponsors.${index}.image`} render={({ field }) => (
													<FormItem>
														<FormLabel>Logo Image</FormLabel>
														<FormControl><MediaPicker type="image" value={field.value || ""} onChange={(url) => field.onChange(url || "")} showPreview /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
												<FormField control={form.control} name={`sponsorsSection.sponsors.${index}.name`} render={({ field }) => (
													<FormItem>
														<FormLabel>Name</FormLabel>
														<FormControl><Input placeholder="Organization name" {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
												<FormField control={form.control} name={`sponsorsSection.sponsors.${index}.href`} render={({ field }) => (
													<FormItem>
														<FormLabel>Link URL</FormLabel>
														<FormControl><Input placeholder="https://..." {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
											</div>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Volunteering Section Tab */}
						<TabsContent value="volunteering" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Volunteering Section</CardTitle>
									<CardDescription>Manage the volunteering section content and partner logos.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Heading De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField control={form.control} name="volunteeringSection.headingDe" render={({ field }) => (
											<FormItem>
												<FormLabel>Heading (DE)</FormLabel>
												<FormControl><Input placeholder="Überschrift auf Deutsch..." {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
										<FormField control={form.control} name="volunteeringSection.headingEn" render={({ field }) => (
											<FormItem>
												<FormLabel>Heading (EN)</FormLabel>
												<FormControl><Input placeholder="Heading in English..." {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
									</div>
									{/* Description De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField control={form.control} name="volunteeringSection.descriptionDe" render={({ field }) => (
											<FormItem>
												<FormLabel>Description (DE)</FormLabel>
												<FormControl><Textarea placeholder="Beschreibung auf Deutsch..." rows={5} {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
										<FormField control={form.control} name="volunteeringSection.descriptionEn" render={({ field }) => (
											<FormItem>
												<FormLabel>Description (EN)</FormLabel>
												<FormControl><Textarea placeholder="Description in English..." rows={5} {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
									</div>
									<FormField control={form.control} name="volunteeringSection.image" render={({ field }) => (
										<FormItem>
											<FormLabel>Section Image</FormLabel>
											<FormControl><MediaPicker type="image" value={field.value || ""} onChange={(url) => field.onChange(url || "")} showPreview /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle>Partner Logos</CardTitle>
											<CardDescription>Add volunteering partner logos.</CardDescription>
										</div>
										<Button type="button" variant="outline" size="sm" onClick={() => appendVolunteeringLogo({ image: '', name: '', href: '', descriptionDe: '', descriptionEn: '' })}>
											<Plus className="mr-2 h-4 w-4" />Add Logo
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									{volunteeringLogoFields.length === 0 ? (
										<div className="text-center py-6 text-muted-foreground">No logos added yet.</div>
									) : (
										volunteeringLogoFields.map((logo, index) => (
											<div key={logo.id} className="border rounded-lg p-4 space-y-3">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium">Logo {index + 1}</span>
													<Button type="button" variant="ghost" size="icon" onClick={() => removeVolunteeringLogo(index)}>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
												<FormField control={form.control} name={`volunteeringSection.partnerLogos.${index}.image`} render={({ field }) => (
													<FormItem>
														<FormLabel>Logo Image</FormLabel>
														<FormControl><MediaPicker type="image" value={field.value || ""} onChange={(url) => field.onChange(url || "")} showPreview /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
												<FormField control={form.control} name={`volunteeringSection.partnerLogos.${index}.name`} render={({ field }) => (
													<FormItem>
														<FormLabel>Name</FormLabel>
														<FormControl><Input placeholder="Organization name" {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
												<FormField control={form.control} name={`volunteeringSection.partnerLogos.${index}.href`} render={({ field }) => (
													<FormItem>
														<FormLabel>Link URL</FormLabel>
														<FormControl><Input placeholder="https://..." {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
											</div>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Partners Carousel Tab */}
						<TabsContent value="partners-carousel" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Partners Carousel</CardTitle>
									<CardDescription>Auto-scrolling partner logos shown below the Volunteering section.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField control={form.control} name="partnersCarouselSection.headingDe" render={({ field }) => (
											<FormItem>
												<FormLabel>Label text (DE)</FormLabel>
												<FormControl><Input placeholder="z.B. Unsere Partner" {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
										<FormField control={form.control} name="partnersCarouselSection.headingEn" render={({ field }) => (
											<FormItem>
												<FormLabel>Label text (EN)</FormLabel>
												<FormControl><Input placeholder="e.g. Our Partners" {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)} />
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle>Partner Logos</CardTitle>
											<CardDescription>Add partner/organization logos for the carousel.</CardDescription>
										</div>
										<Button type="button" variant="outline" size="sm" onClick={() => appendPartnerCarouselLogo({ image: '', name: '', href: '', descriptionDe: '', descriptionEn: '' })}>
											<Plus className="h-4 w-4 mr-1" /> Add Logo
										</Button>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									{partnerCarouselLogoFields.length === 0 ? (
										<p className="text-sm text-muted-foreground italic text-center py-4">No logos added yet.</p>
									) : (
										partnerCarouselLogoFields.map((logo, index) => (
											<div key={logo.id} className="border rounded-lg p-4 space-y-4">
												<div className="flex items-center justify-between">
													<span className="text-sm font-medium">Logo {index + 1}</span>
													<Button type="button" variant="ghost" size="icon" onClick={() => removePartnerCarouselLogo(index)}>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
												<FormField control={form.control} name={`partnersCarouselSection.logos.${index}.image`} render={({ field }) => (
													<FormItem>
														<FormLabel>Logo Image</FormLabel>
														<FormControl><MediaPicker type="image" value={field.value || ""} onChange={(url) => field.onChange(url || "")} showPreview /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
												<FormField control={form.control} name={`partnersCarouselSection.logos.${index}.name`} render={({ field }) => (
													<FormItem>
														<FormLabel>Organization Name</FormLabel>
														<FormControl><Input placeholder="Organization name" {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
												<FormField control={form.control} name={`partnersCarouselSection.logos.${index}.href`} render={({ field }) => (
													<FormItem>
														<FormLabel>Link URL</FormLabel>
														<FormControl><Input placeholder="https://..." {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
											</div>
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
									{/* Badge De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="imageGallery.badgeDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Unsere Einrichtungen"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="imageGallery.badgeEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge (EN)</FormLabel>
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
									</div>
									{/* Title De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="imageGallery.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Exzellenz in Aktion"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="imageGallery.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
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
									</div>
									{/* Subtitle De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="imageGallery.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Sehen Sie, wie unsere Ausstattung..."
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="imageGallery.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (EN)</FormLabel>
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
										{/* CTA Title De/En */}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="imageGallery.ctaTitleDe"
												render={({ field }) => (
													<FormItem>
														<FormLabel>CTA Title (DE)</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Mehr sehen?"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="imageGallery.ctaTitleEn"
												render={({ field }) => (
													<FormItem>
														<FormLabel>CTA Title (EN)</FormLabel>
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
										</div>
										{/* CTA Button Text De/En */}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="imageGallery.ctaButtonTextDe"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Button Text (DE)</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Tour buchen"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="imageGallery.ctaButtonTextEn"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Button Text (EN)</FormLabel>
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
										{/* CTA Subtitle De/En */}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="imageGallery.ctaSubtitleDe"
												render={({ field }) => (
													<FormItem>
														<FormLabel>CTA Subtitle (DE)</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Buchen Sie eine virtuelle Tour..."
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="imageGallery.ctaSubtitleEn"
												render={({ field }) => (
													<FormItem>
														<FormLabel>CTA Subtitle (EN)</FormLabel>
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
													titleDe: "",
													titleEn: "",
													subtitleDe: "",
													subtitleEn: "",
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
													{/* Title De/En */}
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<FormField
															control={form.control}
															name={`imageGallery.images.${index}.titleDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title (DE)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Moderne OP-Säle"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`imageGallery.images.${index}.titleEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title (EN)</FormLabel>
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
													</div>
													{/* Subtitle De/En */}
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<FormField
															control={form.control}
															name={`imageGallery.images.${index}.subtitleDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Subtitle (DE)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Ausgestattet mit Präzisionsrobotik"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`imageGallery.images.${index}.subtitleEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Subtitle (EN)</FormLabel>
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

						{/* Testimonials Tab */}
						<TabsContent value="testimonials" className="space-y-6">
							{/* Section Settings */}
							<Card>
								<CardHeader>
									<CardTitle>Section Settings</CardTitle>
									<CardDescription>
										Optional heading and subtitle shown above the testimonials.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Title De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="testimonialsSection.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Section Title (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Unsere Partner"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="testimonialsSection.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Section Title (EN)</FormLabel>
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
									</div>
									{/* Subtitle De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="testimonialsSection.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Section Subtitle (DE)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Organisationen, mit denen wir zusammenarbeiten..."
															rows={2}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="testimonialsSection.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Section Subtitle (EN)</FormLabel>
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
									</div>
								</CardContent>
							</Card>

							{/* Testimonials List */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Testimonials</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendTestimonial({
													titleDe: "",
													titleEn: "",
													subtitleDe: "",
													subtitleEn: "",
													descriptionDe: "",
													descriptionEn: "",
													image: "",
												})
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Testimonial
										</Button>
									</CardTitle>
									<CardDescription>
										Testimonial cards displayed between Volunteering and Partners Carousel sections.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{testimonialFields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No testimonials added yet. Click &quot;Add Testimonial&quot; to add one.
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
																	title: "Remove Testimonial",
																	description: "Are you sure you want to remove this testimonial?",
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
													{/* Title De/En */}
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<FormField
															control={form.control}
															name={`testimonialsSection.testimonials.${index}.titleDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title (DE)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="z.B. Bundesministerium für Familie"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`testimonialsSection.testimonials.${index}.titleEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title (EN)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="e.g. Federal Ministry for Family"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													{/* Subtitle De/En */}
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<FormField
															control={form.control}
															name={`testimonialsSection.testimonials.${index}.subtitleDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Subtitle (DE)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="z.B. Bundesministerium"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`testimonialsSection.testimonials.${index}.subtitleEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Subtitle (EN)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="e.g. Federal Ministry"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													{/* Description De/En */}
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<FormField
															control={form.control}
															name={`testimonialsSection.testimonials.${index}.descriptionDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Description (DE)</FormLabel>
																	<FormControl>
																		<Textarea
																			{...field}
																			value={field.value || ""}
																			placeholder="Kurze Beschreibung auf Deutsch..."
																			rows={3}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`testimonialsSection.testimonials.${index}.descriptionEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Description (EN)</FormLabel>
																	<FormControl>
																		<Textarea
																			{...field}
																			value={field.value || ""}
																			placeholder="A short description in English..."
																			rows={3}
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
									{/* Title De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="ctaSection.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Bereit, Ihr Unternehmen aufzurüsten?"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
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
									</div>

									{/* Subtitle De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="ctaSection.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (DE)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Kontaktieren Sie uns heute..."
															rows={2}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (EN)</FormLabel>
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
									</div>

									{/* Phone Title De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="ctaSection.phoneTitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Title (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Rufen Sie uns direkt an"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.phoneTitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Title (EN)</FormLabel>
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
									</div>

									{/* Phone Subtitle De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="ctaSection.phoneSubtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Subtitle (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Wir sind erreichbar..."
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.phoneSubtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Subtitle (EN)</FormLabel>
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

									{/* Email Title De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="ctaSection.emailTitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Title (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="E-Mail"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.emailTitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Title (EN)</FormLabel>
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
									</div>

									{/* Email Subtitle De/En */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="ctaSection.emailSubtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Subtitle (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Schreiben Sie uns"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.emailSubtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Subtitle (EN)</FormLabel>
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
										{/* Form Title De/En */}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="ctaSection.formTitleDe"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Title (DE)</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Haben Sie Fragen?"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="ctaSection.formTitleEn"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Title (EN)</FormLabel>
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
										</div>
										{/* Form Subtitle De/En */}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="ctaSection.formSubtitleDe"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Subtitle (DE)</FormLabel>
														<FormControl>
															<Textarea
																{...field}
																value={field.value || ""}
																placeholder="Füllen Sie unser Kontaktformular aus..."
																rows={2}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="ctaSection.formSubtitleEn"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Subtitle (EN)</FormLabel>
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
										</div>
										{/* Form CTA Text De/En */}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="ctaSection.formCtaTextDe"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Button Text (DE)</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="Nachricht senden"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="ctaSection.formCtaTextEn"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Button Text (EN)</FormLabel>
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
										</div>
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

						{/* Rich Content Tab -- hidden
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
										{/* Page Title De/En */}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="seo.titleDe"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Page Title (DE)</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="ZAVD - Seitentitel"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="seo.titleEn"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Page Title (EN)</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="ZAVD - Page Title"
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<FormDescription>
											Displayed in browser tab and search results.
										</FormDescription>

										{/* Meta Description De/En */}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="seo.descriptionDe"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Meta Description (DE)</FormLabel>
														<FormControl>
															<Textarea
																{...field}
																value={field.value || ""}
																placeholder="Kurze Beschreibung auf Deutsch..."
																rows={3}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="seo.descriptionEn"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Meta Description (EN)</FormLabel>
														<FormControl>
															<Textarea
																{...field}
																value={field.value || ""}
																placeholder="Short description in English..."
																rows={3}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<FormDescription>
											Short description shown in search results.
										</FormDescription>

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
													form.watch("seo.titleDe") ||
													"ZAVD",
												description:
													form.watch("seo.descriptionDe") ||
													"Add a description",
												slug: "",
												ogImage: form.watch("seo.ogImage") || null,
												siteName: "ZAVD",
												siteUrl: "www.zavd.de",
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
