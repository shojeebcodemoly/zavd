"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, ExternalLink } from "lucide-react";

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
import { MediaPicker } from "@/components/storage/media-picker";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { useConfirmModal } from "@/components/ui/confirm-modal";

// FAQ Item schema
const faqItemSchema = z.object({
	questionDe: z.string().min(1, "Question (DE) is required"),
	questionEn: z.string().min(1, "Question (EN) is required"),
	answerDe: z.string().min(1, "Answer (DE) is required"),
	answerEn: z.string().min(1, "Answer (EN) is required"),
});

// Form schema
const kontaktPageFormSchema = z.object({
	// Hero Section
	hero: z.object({
		backgroundImage: z.string().optional(),
		breadcrumb: z.string().optional(),
		titleDe: z.string().min(1, "Title (DE) is required"),
		titleEn: z.string().min(1, "Title (EN) is required"),
		subtitleDe: z.string().min(1, "Subtitle (DE) is required"),
		subtitleEn: z.string().min(1, "Subtitle (EN) is required"),
	}),

	// Contact Info (left column)
	contactInfo: z.object({
		badgeDe: z.string().optional(),
		badgeEn: z.string().optional(),
		headingDe: z.string().optional(),
		headingEn: z.string().optional(),
		addressLabelDe: z.string().optional(),
		addressLabelEn: z.string().optional(),
		address: z.string().optional(),
		emailLabelDe: z.string().optional(),
		emailLabelEn: z.string().optional(),
		email: z.string().optional(),
		phoneLabelDe: z.string().optional(),
		phoneLabelEn: z.string().optional(),
		phone: z.string().optional(),
	}),

	// Form Section
	formSection: z.object({
		headingDe: z.string().optional(),
		headingEn: z.string().optional(),
		titleDe: z.string().min(1, "Title (DE) is required"),
		titleEn: z.string().min(1, "Title (EN) is required"),
		subtitleDe: z.string().min(1, "Subtitle (DE) is required"),
		subtitleEn: z.string().min(1, "Subtitle (EN) is required"),
	}),

	// Map Section
	mapSection: z.object({
		embedUrl: z.string().optional(),
	}),

	// Contact Cards
	phoneCard: z.object({
		icon: z.string().min(1),
		titleDe: z.string().min(1, "Title (DE) is required"),
		titleEn: z.string().min(1, "Title (EN) is required"),
		subtitleDe: z.string().optional(),
		subtitleEn: z.string().optional(),
	}),
	emailCard: z.object({
		icon: z.string().min(1),
		titleDe: z.string().min(1, "Title (DE) is required"),
		titleEn: z.string().min(1, "Title (EN) is required"),
		subtitleDe: z.string().optional(),
		subtitleEn: z.string().optional(),
	}),
	socialCard: z.object({
		icon: z.string().min(1),
		titleDe: z.string().min(1, "Title (DE) is required"),
		titleEn: z.string().min(1, "Title (EN) is required"),
		subtitleDe: z.string().optional(),
		subtitleEn: z.string().optional(),
	}),

	// Connect Section
	connectSection: z.object({
		badgeDe: z.string().optional(),
		badgeEn: z.string().optional(),
		backgroundImage: z.string().optional(),
		headingDe: z.string().optional(),
		headingEn: z.string().optional(),
		descriptionDe: z.string().optional(),
		descriptionEn: z.string().optional(),
	}),

	// Office Section
	officeSection: z.object({
		badgeDe: z.string().optional(),
		badgeEn: z.string().optional(),
		titleDe: z.string().min(1, "Title (DE) is required"),
		titleEn: z.string().min(1, "Title (EN) is required"),
		subtitleDe: z.string().min(1, "Subtitle (DE) is required"),
		subtitleEn: z.string().min(1, "Subtitle (EN) is required"),
		openingHoursDe: z.string().optional(),
		openingHoursEn: z.string().optional(),
		closedTextDe: z.string().optional(),
		closedTextEn: z.string().optional(),
	}),

	// FAQ Section
	faqSection: z.object({
		badgeDe: z.string().optional(),
		badgeEn: z.string().optional(),
		titleDe: z.string().min(1, "Title (DE) is required"),
		titleEn: z.string().min(1, "Title (EN) is required"),
		subtitleDe: z.string().min(1, "Subtitle (DE) is required"),
		subtitleEn: z.string().min(1, "Subtitle (EN) is required"),
		faqs: z.array(faqItemSchema),
	}),

	// SEO
	seo: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		ogImage: z.string().optional(),
	}),
});

type KontaktPageFormValues = z.infer<typeof kontaktPageFormSchema>;

export default function KontaktPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<KontaktPageFormValues>({
		resolver: zodResolver(kontaktPageFormSchema),
		defaultValues: {
			hero: {
				backgroundImage: "",
				breadcrumb: "Contact Us",
				titleDe: "Kontaktieren Sie uns",
				titleEn: "Contact Us",
				subtitleDe: "Nehmen Sie Kontakt mit uns auf. Wir sind hier, um Ihnen zu helfen.",
				subtitleEn: "Get in touch with us. We are here to help you.",
			},
			contactInfo: {
				badgeDe: "Kontakt",
				badgeEn: "Contact",
				headingDe: "Kontaktieren Sie uns",
				headingEn: "Get in Touch",
				addressLabelDe: "Unsere Adresse",
				addressLabelEn: "Our Address",
				address: "",
				emailLabelDe: "E-Mail-Adresse",
				emailLabelEn: "Email Address",
				email: "",
				phoneLabelDe: "Telefonnummer",
				phoneLabelEn: "Phone Number",
				phone: "",
			},
			formSection: {
				headingDe: "Haben Sie Fragen?",
				headingEn: "Have Any Question?",
				titleDe: "",
				titleEn: "",
				subtitleDe: "",
				subtitleEn: "",
			},
			mapSection: {
				embedUrl: "",
			},
			phoneCard: {
				icon: "Phone",
				titleDe: "Telefon",
				titleEn: "Phone",
				subtitleDe: "Mo-Fr 09:00-17:00",
				subtitleEn: "Mon-Fri 09:00-17:00",
			},
			emailCard: {
				icon: "Mail",
				titleDe: "E-Mail",
				titleEn: "Email",
				subtitleDe: "Antwort innerhalb von 24 Stunden",
				subtitleEn: "Response within 24 hours",
			},
			socialCard: {
				icon: "MessageCircle",
				titleDe: "Soziale Medien",
				titleEn: "Social Media",
				subtitleDe: "Folgen Sie uns für Updates",
				subtitleEn: "Follow us for updates",
			},
			connectSection: {
				badgeDe: "Verbinden Sie sich mit uns",
				badgeEn: "Connect With Us",
				backgroundImage: "",
				headingDe: "KONTAKTIEREN SIE UNS",
				headingEn: "GET IN TOUCH",
				descriptionDe: "",
				descriptionEn: "",
			},
			officeSection: {
				badgeDe: "Unsere Büros",
				badgeEn: "Our Offices",
				titleDe: "Besuchen Sie uns",
				titleEn: "Visit Us",
				subtitleDe: "",
				subtitleEn: "",
				openingHoursDe: "Mo-Fr 09:00-17:00",
				openingHoursEn: "Mon-Fri 09:00-17:00",
				closedTextDe: "Wochenenden geschlossen",
				closedTextEn: "Weekends closed",
			},
			faqSection: { badgeDe: "", badgeEn: "", titleDe: "", titleEn: "", subtitleDe: "", subtitleEn: "", faqs: [] },
			seo: { title: "", description: "", ogImage: "" },
		},
	});

	// Field array for FAQs
	const {
		fields: faqFields,
		append: appendFaq,
		remove: removeFaq,
	} = useFieldArray({ control: form.control, name: "faqSection.faqs" });

	// Fetch kontakt page content on mount
	useEffect(() => {
		const fetchContent = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/kontakt-page");
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Failed to fetch content");
				}

				const content = data.data;

				form.reset({
					hero: {
						backgroundImage: content.hero?.backgroundImage || "",
						breadcrumb: content.hero?.breadcrumb || "Contact Us",
						titleDe: content.hero?.titleDe || "Kontaktieren Sie uns",
						titleEn: content.hero?.titleEn || "Contact Us",
						subtitleDe: content.hero?.subtitleDe || "",
						subtitleEn: content.hero?.subtitleEn || "",
					},
					contactInfo: {
						badgeDe: content.contactInfo?.badgeDe || "Kontakt",
						badgeEn: content.contactInfo?.badgeEn || "Contact",
						headingDe: content.contactInfo?.headingDe || "Kontaktieren Sie uns",
						headingEn: content.contactInfo?.headingEn || "Get in Touch",
						addressLabelDe: content.contactInfo?.addressLabelDe || "Unsere Adresse",
						addressLabelEn: content.contactInfo?.addressLabelEn || "Our Address",
						address: content.contactInfo?.address || "",
						emailLabelDe: content.contactInfo?.emailLabelDe || "E-Mail-Adresse",
						emailLabelEn: content.contactInfo?.emailLabelEn || "Email Address",
						email: content.contactInfo?.email || "",
						phoneLabelDe: content.contactInfo?.phoneLabelDe || "Telefonnummer",
						phoneLabelEn: content.contactInfo?.phoneLabelEn || "Phone Number",
						phone: content.contactInfo?.phone || "",
					},
					formSection: {
						headingDe: content.formSection?.headingDe || "Haben Sie Fragen?",
						headingEn: content.formSection?.headingEn || "Have Any Question?",
						titleDe: content.formSection?.titleDe || "",
						titleEn: content.formSection?.titleEn || "",
						subtitleDe: content.formSection?.subtitleDe || "",
						subtitleEn: content.formSection?.subtitleEn || "",
					},
					mapSection: {
						embedUrl: content.mapSection?.embedUrl || "",
					},
					phoneCard: {
						icon: content.phoneCard?.icon || "Phone",
						titleDe: content.phoneCard?.titleDe || "Telefon",
						titleEn: content.phoneCard?.titleEn || "Phone",
						subtitleDe: content.phoneCard?.subtitleDe || "",
						subtitleEn: content.phoneCard?.subtitleEn || "",
					},
					emailCard: {
						icon: content.emailCard?.icon || "Mail",
						titleDe: content.emailCard?.titleDe || "E-Mail",
						titleEn: content.emailCard?.titleEn || "Email",
						subtitleDe: content.emailCard?.subtitleDe || "",
						subtitleEn: content.emailCard?.subtitleEn || "",
					},
					socialCard: {
						icon: content.socialCard?.icon || "MessageCircle",
						titleDe: content.socialCard?.titleDe || "Soziale Medien",
						titleEn: content.socialCard?.titleEn || "Social Media",
						subtitleDe: content.socialCard?.subtitleDe || "",
						subtitleEn: content.socialCard?.subtitleEn || "",
					},
					connectSection: {
						badgeDe: content.connectSection?.badgeDe || "Verbinden Sie sich mit uns",
						badgeEn: content.connectSection?.badgeEn || "Connect With Us",
						backgroundImage: content.connectSection?.backgroundImage || "",
						headingDe: content.connectSection?.headingDe || "KONTAKTIEREN SIE UNS",
						headingEn: content.connectSection?.headingEn || "GET IN TOUCH",
						descriptionDe: content.connectSection?.descriptionDe || "",
						descriptionEn: content.connectSection?.descriptionEn || "",
					},
					officeSection: {
						badgeDe: content.officeSection?.badgeDe || "",
						badgeEn: content.officeSection?.badgeEn || "",
						titleDe: content.officeSection?.titleDe || "",
						titleEn: content.officeSection?.titleEn || "",
						subtitleDe: content.officeSection?.subtitleDe || "",
						subtitleEn: content.officeSection?.subtitleEn || "",
						openingHoursDe: content.officeSection?.openingHoursDe || "",
						openingHoursEn: content.officeSection?.openingHoursEn || "",
						closedTextDe: content.officeSection?.closedTextDe || "",
						closedTextEn: content.officeSection?.closedTextEn || "",
					},
					faqSection: {
						badgeDe: content.faqSection?.badgeDe || "",
						badgeEn: content.faqSection?.badgeEn || "",
						titleDe: content.faqSection?.titleDe || "",
						titleEn: content.faqSection?.titleEn || "",
						subtitleDe: content.faqSection?.subtitleDe || "",
						subtitleEn: content.faqSection?.subtitleEn || "",
						faqs: content.faqSection?.faqs || [],
					},
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

	const onSubmit = async (values: KontaktPageFormValues) => {
		try {
			setSaving(true);

			const response = await fetch("/api/kontakt-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to save content");
			}

			toast.success("Contact page content saved successfully");
		} catch (error) {
			console.error("Error saving content:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save content"
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return <CMSPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-medium tracking-tight">Contact Page</h1>
					<p className="text-muted-foreground">
						Manage the content on the contact page.
					</p>
				</div>
				<a
					href="/contact-us"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<Tabs defaultValue="hero" className="space-y-6">
						<TabsList className="flex flex-wrap h-auto gap-1 p-1 justify-start">
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="contact-info">Contact Info</TabsTrigger>
							<TabsTrigger value="cards">Cards</TabsTrigger>
							<TabsTrigger value="form">Form</TabsTrigger>
							<TabsTrigger value="map">Map</TabsTrigger>
							<TabsTrigger value="connect">Connect</TabsTrigger>
							<TabsTrigger value="office">Office</TabsTrigger>
							<TabsTrigger value="faq">FAQ</TabsTrigger>
							<TabsTrigger value="seo">SEO</TabsTrigger>
						</TabsList>

						{/* Hero Tab */}
						<TabsContent value="hero" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Hero Section</CardTitle>
									<CardDescription>
										The banner at the top of the contact page with background image.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="hero.backgroundImage"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Background Image</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || null}
														onChange={(url) => field.onChange(url || "")}
														placeholder="Select background image"
														galleryTitle="Select Hero Background"
													/>
												</FormControl>
												<FormDescription>
													Full-width background image for the hero banner.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="hero.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Kontaktieren Sie uns"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="hero.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Contact Us"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="hero.breadcrumb"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Breadcrumb Text</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Contact Us"
													/>
												</FormControl>
												<FormDescription>
													Text shown after &quot;Home /&quot; in the breadcrumb.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="hero.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (DE)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Nehmen Sie Kontakt mit uns auf..."
															rows={2}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="hero.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (EN)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Get in touch with us..."
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
						</TabsContent>

						{/* Contact Info Tab */}
						<TabsContent value="contact-info" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Contact Information</CardTitle>
									<CardDescription>
										Left column content: heading and contact details displayed with icons.
										Phone and email values come from Site Settings.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="contactInfo.badgeDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Text (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Kontakt"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="contactInfo.badgeEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Text (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Contact"
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
											name="contactInfo.headingDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Heading (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Kontaktieren Sie uns"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="contactInfo.headingEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Heading (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Get in Touch"
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
											name="contactInfo.addressLabelDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Address Label (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Unsere Adresse"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="contactInfo.addressLabelEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Address Label (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Our Address"
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
											name="contactInfo.emailLabelDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Label (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="E-Mail-Adresse"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="contactInfo.emailLabelEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Label (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Email Address"
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
											name="contactInfo.phoneLabelDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Label (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Telefonnummer"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="contactInfo.phoneLabelEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Label (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Phone Number"
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
											name="contactInfo.email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Address</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="info@example.com"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="contactInfo.phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Number</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="+49 000 000 00 00"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="contactInfo.address"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Address</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="Street, City, Country"
														rows={2}
													/>
												</FormControl>
												<FormDescription>
													Physical address shown in the contact info panel.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Contact Cards Tab */}
						<TabsContent value="cards" className="space-y-6">
							{/* Phone Card */}
							<Card>
								<CardHeader>
									<CardTitle>Phone Card</CardTitle>
									<CardDescription>
										Label and subtitle for the phone contact card.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="phoneCard.icon"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Icon Name</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Phone"
													/>
												</FormControl>
												<FormDescription>
													Lucide icon name (e.g. Phone, Mail, MessageCircle).
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="phoneCard.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Telefon"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="phoneCard.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Phone"
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
											name="phoneCard.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Mo-Fr 09:00-17:00"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="phoneCard.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Mon-Fri 09:00-17:00"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Email Card */}
							<Card>
								<CardHeader>
									<CardTitle>Email Card</CardTitle>
									<CardDescription>
										Label and subtitle for the email contact card.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="emailCard.icon"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Icon Name</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Mail"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="emailCard.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
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
											name="emailCard.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
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
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="emailCard.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Antwort innerhalb von 24 Stunden"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="emailCard.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Response within 24 hours"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Social Card */}
							<Card>
								<CardHeader>
									<CardTitle>Social Media Card</CardTitle>
									<CardDescription>
										Label and subtitle for the social media contact card.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="socialCard.icon"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Icon Name</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="MessageCircle"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="socialCard.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Soziale Medien"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="socialCard.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Social Media"
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
											name="socialCard.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Folgen Sie uns für Updates"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="socialCard.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Follow us for updates"
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

						{/* Form Section Tab */}
						<TabsContent value="form" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Form Section</CardTitle>
									<CardDescription>
										Right column heading and subtitle above the contact form.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="formSection.headingDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Heading (DE)</FormLabel>
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
											name="formSection.headingEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Heading (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Have Any Question?"
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
											name="formSection.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Erzählen Sie uns von Ihrem Projekt"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="formSection.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Tell us about your project"
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
											name="formSection.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (DE)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Füllen Sie das Formular aus..."
															rows={2}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="formSection.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (EN)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Fill out the form and we'll get back to you..."
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
						</TabsContent>

						{/* Map Tab */}
						<TabsContent value="map" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Google Map</CardTitle>
									<CardDescription>
										Full-width map displayed at the bottom of the contact page.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="mapSection.embedUrl"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Google Maps Embed URL</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="https://www.google.com/maps/embed?pb=..."
													/>
												</FormControl>
												<FormDescription>
													Go to Google Maps → Share → Embed a map → copy the src URL from the iframe code.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Connect Tab */}
						<TabsContent value="connect" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Connect With Us Section</CardTitle>
									<CardDescription>
										Two-part section: a primary-color banner with a centered badge on top,
										and a dark background section with heading and social media links below.
										Social media URLs are managed in Site Settings.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="connectSection.badgeDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Text (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Verbinden Sie sich mit uns"
														/>
													</FormControl>
													<FormDescription>
														Text shown inside the bordered rectangle on the primary-color banner.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="connectSection.badgeEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Text (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Connect With Us"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="connectSection.backgroundImage"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Background Image</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || null}
														onChange={(url) => field.onChange(url || "")}
														placeholder="Select background image (city/landscape photo)"
														galleryTitle="Select Connect Section Background"
													/>
												</FormControl>
												<FormDescription>
													Dark overlay is applied automatically. Works best with a city or landscape photo.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="connectSection.headingDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Heading (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="KONTAKTIEREN SIE UNS"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="connectSection.headingEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Heading (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="GET IN TOUCH"
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
											name="connectSection.descriptionDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description (DE)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Verbinden Sie sich mit uns in den sozialen Medien..."
															rows={2}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="connectSection.descriptionEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description (EN)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Connect with us on social media..."
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
						</TabsContent>

						{/* Office Tab */}
						<TabsContent value="office" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Office Section</CardTitle>
									<CardDescription>
										Information about office locations, opening hours and availability.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="officeSection.badgeDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Text (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Unsere Büros"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="officeSection.badgeEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Text (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Our Offices"
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
											name="officeSection.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Besuchen Sie uns"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="officeSection.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Visit Us"
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
											name="officeSection.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (DE)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Wir haben Büros in..."
															rows={2}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="officeSection.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (EN)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="We have offices in..."
															rows={2}
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
											name="officeSection.openingHoursDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Opening Hours (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Mo-Fr 09:00-17:00"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="officeSection.openingHoursEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Opening Hours (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Mon-Fri 09:00-17:00"
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
											name="officeSection.closedTextDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Closed Text (DE)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Wochenenden geschlossen"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="officeSection.closedTextEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Closed Text (EN)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Weekends closed"
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

						{/* FAQ Tab */}
						<TabsContent value="faq" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>FAQ Section</CardTitle>
									<CardDescription>
										Frequently asked questions (optional — not shown in current design).
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="faqSection.badgeDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Text (DE)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="FAQ" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="faqSection.badgeEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Text (EN)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="FAQ" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="faqSection.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="Haben Sie Fragen?" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="faqSection.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="Have Questions?" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="faqSection.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (DE)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Hier finden Sie Antworten..."
															rows={2}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="faqSection.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (EN)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Here you'll find answers..."
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

							{/* FAQ Items */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Questions & Answers</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => appendFaq({ questionDe: "", questionEn: "", answerDe: "", answerEn: "" })}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add
										</Button>
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{faqFields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No questions added. Click &quot;Add&quot; to add a question.
										</div>
									) : (
										faqFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">
															Question {index + 1}
														</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={async () => {
																const confirmed = await confirm({
																	title: "Remove Question",
																	description: "Are you sure you want to remove this question?",
																	confirmText: "Remove",
																});
																if (confirmed) removeFaq(index);
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
															name={`faqSection.faqs.${index}.questionDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Question (DE)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Ihre Frage..."
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`faqSection.faqs.${index}.questionEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Question (EN)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="Your question..."
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
															name={`faqSection.faqs.${index}.answerDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Answer (DE)</FormLabel>
																	<FormControl>
																		<Textarea
																			{...field}
																			value={field.value || ""}
																			placeholder="Antwort..."
																			rows={2}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`faqSection.faqs.${index}.answerEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Answer (EN)</FormLabel>
																	<FormControl>
																		<Textarea
																			{...field}
																			value={field.value || ""}
																			placeholder="Answer..."
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
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* SEO Tab */}
						<TabsContent value="seo" className="space-y-6">
							<div className="grid gap-6 lg:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>SEO Settings</CardTitle>
										<CardDescription>
											Search engine optimization for the contact page.
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
															placeholder="Contact Us - ZAVD"
														/>
													</FormControl>
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
															placeholder="Contact ZAVD for questions..."
															rows={3}
														/>
													</FormControl>
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
															onChange={(url) => field.onChange(url || "")}
															placeholder="Select OG image (1200x630px)"
															galleryTitle="Select OG Image"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Preview</CardTitle>
									</CardHeader>
									<CardContent>
										<SeoPreview
											data={{
												title: form.watch("seo.title") || "Contact Us - ZAVD",
												description: form.watch("seo.description") || "Add a description",
												slug: "contact-us",
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
