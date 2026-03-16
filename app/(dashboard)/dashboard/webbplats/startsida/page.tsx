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

// Testimonial Item schema - optional fields
const testimonialItemSchema = z.object({
	title: z.string().optional(),
	subtitle: z.string().optional(),
	description: z.string().optional(),
	image: z.string().optional(),
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
	description: z.string().optional(),
});

// Integration Section schema
const integrationSectionSchema = z.object({
	heading: z.string().optional(),
	quote: z.string().optional(),
	description: z.string().optional(),
	image: z.string().optional(),
	readMoreLink: z.string().optional(),
	partnerLogos: z.array(partnerLogoSchema).optional(),
});

// Sponsors Section schema
const sponsorsSectionSchema = z.object({
	heading: z.string().optional(),
	description: z.string().optional(),
	backgroundImage: z.string().optional(),
	sponsors: z.array(partnerLogoSchema).optional(),
});

// Volunteering Section schema
const volunteeringSectionSchema = z.object({
	heading: z.string().optional(),
	description: z.string().optional(),
	image: z.string().optional(),
	partnerLogos: z.array(partnerLogoSchema).optional(),
});

// Partners Carousel Section schema
const partnersCarouselSectionSchema = z.object({
	heading: z.string().optional(),
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
			integrationSection: {
				heading: "",
				quote: "",
				description: "",
				image: "",
				readMoreLink: "",
				partnerLogos: [],
			},
			sponsorsSection: {
				heading: "",
				description: "",
				backgroundImage: "",
				sponsors: [],
			},
			volunteeringSection: {
				heading: "",
				description: "",
				image: "",
				partnerLogos: [],
			},
			partnersCarouselSection: {
				heading: "",
				logos: [],
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
					integrationSection: {
						heading: content.integrationSection?.heading || "",
						quote: content.integrationSection?.quote || "",
						description: content.integrationSection?.description || "",
						image: content.integrationSection?.image || "",
						readMoreLink: content.integrationSection?.readMoreLink || "",
						partnerLogos: content.integrationSection?.partnerLogos || [],
					},
					sponsorsSection: {
						heading: content.sponsorsSection?.heading || "",
						description: content.sponsorsSection?.description || "",
						backgroundImage: content.sponsorsSection?.backgroundImage || "",
						sponsors: content.sponsorsSection?.sponsors || [],
					},
					volunteeringSection: {
						heading: content.volunteeringSection?.heading || "",
						description: content.volunteeringSection?.description || "",
						image: content.volunteeringSection?.image || "",
						partnerLogos: content.volunteeringSection?.partnerLogos || [],
					},
					partnersCarouselSection: {
						heading: content.partnersCarouselSection?.heading || "",
						logos: content.partnersCarouselSection?.logos || [],
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
						{/* Integration Section Tab */}
						<TabsContent value="integration" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Integration Section</CardTitle>
									<CardDescription>Manage the integration/partnership section content.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField control={form.control} name="integrationSection.heading" render={({ field }) => (
										<FormItem>
											<FormLabel>Heading</FormLabel>
											<FormControl><Input placeholder="Enter heading..." {...field} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<FormField control={form.control} name="integrationSection.quote" render={({ field }) => (
										<FormItem>
											<FormLabel>Quote / Highlighted Text</FormLabel>
											<FormControl><Textarea placeholder="Enter quote..." rows={3} {...field} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<FormField control={form.control} name="integrationSection.description" render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl><Textarea placeholder="Enter description..." rows={5} {...field} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
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
										<Button type="button" variant="outline" size="sm" onClick={() => appendIntegrationLogo({ image: '', name: '', href: '' })}>
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
												<FormField control={form.control} name={`integrationSection.partnerLogos.${index}.description`} render={({ field }) => (
													<FormItem>
														<FormLabel>Description</FormLabel>
														<FormControl><Input placeholder="Short description..." {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
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
									<FormField control={form.control} name="sponsorsSection.heading" render={({ field }) => (
										<FormItem>
											<FormLabel>Heading</FormLabel>
											<FormControl><Input placeholder="Enter heading..." {...field} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<FormField control={form.control} name="sponsorsSection.description" render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl><Textarea placeholder="Enter description..." rows={4} {...field} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
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
										<Button type="button" variant="outline" size="sm" onClick={() => appendSponsor({ image: '', name: '', href: '' })}>
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
									<FormField control={form.control} name="volunteeringSection.heading" render={({ field }) => (
										<FormItem>
											<FormLabel>Heading</FormLabel>
											<FormControl><Input placeholder="Enter heading..." {...field} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
									<FormField control={form.control} name="volunteeringSection.description" render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl><Textarea placeholder="Enter description..." rows={5} {...field} /></FormControl>
											<FormMessage />
										</FormItem>
									)} />
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
										<Button type="button" variant="outline" size="sm" onClick={() => appendVolunteeringLogo({ image: '', name: '', href: '' })}>
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
									<FormField control={form.control} name="partnersCarouselSection.heading" render={({ field }) => (
										<FormItem>
											<FormLabel>Label text (optional)</FormLabel>
											<FormControl><Input placeholder="e.g. Our Partners" {...field} /></FormControl>
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
											<CardDescription>Add partner/organization logos for the carousel.</CardDescription>
										</div>
										<Button type="button" variant="outline" size="sm" onClick={() => appendPartnerCarouselLogo({ image: '', name: '', href: '' })}>
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

						{/* Products Tab */}
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
													title: "",
													subtitle: "",
													description: "",
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
													{/* Title */}
													<FormField
														control={form.control}
														name={`testimonialsSection.testimonials.${index}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="e.g. Bundesministerium für Familie"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													{/* Subtitle */}
													<FormField
														control={form.control}
														name={`testimonialsSection.testimonials.${index}.subtitle`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Subtitle</FormLabel>
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
													{/* Description */}
													<FormField
														control={form.control}
														name={`testimonialsSection.testimonials.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Description</FormLabel>
																<FormControl>
																	<Textarea
																		{...field}
																		value={field.value || ""}
																		placeholder="A short description..."
																		rows={3}
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
