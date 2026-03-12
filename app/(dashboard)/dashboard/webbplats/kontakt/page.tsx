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
	question: z.string().min(1, "Question is required"),
	answer: z.string().min(1, "Answer is required"),
});

// Form schema
const kontaktPageFormSchema = z.object({
	// Hero Section
	hero: z.object({
		backgroundImage: z.string().optional(),
		breadcrumb: z.string().optional(),
		title: z.string().min(1, "Title is required"),
		subtitle: z.string().min(1, "Subtitle is required"),
	}),

	// Contact Info (left column)
	contactInfo: z.object({
		badge: z.string().optional(),
		heading: z.string().optional(),
		addressLabel: z.string().optional(),
		address: z.string().optional(),
		emailLabel: z.string().optional(),
		phoneLabel: z.string().optional(),
	}),

	// Form Section
	formSection: z.object({
		heading: z.string().optional(),
		title: z.string().min(1, "Title is required"),
		subtitle: z.string().min(1, "Subtitle is required"),
	}),

	// Map Section
	mapSection: z.object({
		embedUrl: z.string().optional(),
	}),

	// Connect Section
	connectSection: z.object({
		badge: z.string().optional(),
		backgroundImage: z.string().optional(),
		heading: z.string().optional(),
		description: z.string().optional(),
	}),

	// FAQ Section
	faqSection: z.object({
		badge: z.string().optional(),
		title: z.string().min(1, "Title is required"),
		subtitle: z.string().min(1, "Subtitle is required"),
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
				title: "Contact Us",
				subtitle: "Get in touch with us. We are here to help you.",
			},
			contactInfo: {
				badge: "Contact",
				heading: "Get in Touch",
				addressLabel: "Our Address",
				address: "",
				emailLabel: "Email Address",
				phoneLabel: "Phone Number",
			},
			formSection: {
				heading: "Have Any Question?",
				title: "",
				subtitle: "",
			},
			mapSection: {
				embedUrl: "",
			},
			connectSection: {
				badge: "Connect With Us",
				backgroundImage: "",
				heading: "GET IN TOUCH",
				description: "",
			},
			faqSection: { badge: "", title: "", subtitle: "", faqs: [] },
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
						title: content.hero?.title || "Contact Us",
						subtitle: content.hero?.subtitle || "",
					},
					contactInfo: {
						badge: content.contactInfo?.badge || "Contact",
						heading: content.contactInfo?.heading || "Get in Touch",
						addressLabel: content.contactInfo?.addressLabel || "Our Address",
						address: content.contactInfo?.address || "",
						emailLabel: content.contactInfo?.emailLabel || "Email Address",
						phoneLabel: content.contactInfo?.phoneLabel || "Phone Number",
					},
					formSection: {
						heading: content.formSection?.heading || "Have Any Question?",
						title: content.formSection?.title || "",
						subtitle: content.formSection?.subtitle || "",
					},
					mapSection: {
						embedUrl: content.mapSection?.embedUrl || "",
					},
					connectSection: {
						badge: content.connectSection?.badge || "Connect With Us",
						backgroundImage: content.connectSection?.backgroundImage || "",
						heading: content.connectSection?.heading || "GET IN TOUCH",
						description: content.connectSection?.description || "",
					},
					faqSection: {
						badge: content.faqSection?.badge || "",
						title: content.faqSection?.title || "",
						subtitle: content.faqSection?.subtitle || "",
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
							<TabsTrigger value="form">Form</TabsTrigger>
							<TabsTrigger value="map">Map</TabsTrigger>
							<TabsTrigger value="connect">Connect</TabsTrigger>
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
											name="hero.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
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
									</div>

									<FormField
										control={form.control}
										name="hero.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
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
											name="contactInfo.badge"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Text</FormLabel>
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

										<FormField
											control={form.control}
											name="contactInfo.heading"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Heading</FormLabel>
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
											name="contactInfo.addressLabel"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Address Label</FormLabel>
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

										<FormField
											control={form.control}
											name="contactInfo.emailLabel"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Label</FormLabel>
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
											name="contactInfo.phoneLabel"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Label</FormLabel>
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
									<FormField
										control={form.control}
										name="formSection.heading"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Heading</FormLabel>
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

									<FormField
										control={form.control}
										name="formSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
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

									<FormField
										control={form.control}
										name="formSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
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
									<FormField
										control={form.control}
										name="connectSection.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="Connect With Us"
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

									<FormField
										control={form.control}
										name="connectSection.heading"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Heading</FormLabel>
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

									<FormField
										control={form.control}
										name="connectSection.description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
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
									<FormField
										control={form.control}
										name="faqSection.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge Text</FormLabel>
												<FormControl>
													<Input {...field} value={field.value || ""} placeholder="FAQ" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="faqSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input {...field} value={field.value || ""} placeholder="Have Questions?" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="faqSection.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
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
											onClick={() => appendFaq({ question: "", answer: "" })}
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
													<FormField
														control={form.control}
														name={`faqSection.faqs.${index}.question`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Question</FormLabel>
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
													<FormField
														control={form.control}
														name={`faqSection.faqs.${index}.answer`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Answer</FormLabel>
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
