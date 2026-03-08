"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Plus,
	Trash2,
	Loader2,
	Eye,
	Award,
	FileText,
	Search,
	ExternalLink,
	GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
	() => import("@/components/admin/rich-text-editor").then((mod) => mod.RichTextEditor),
	{ ssr: false }
);

// ============================================================================
// LOCAL ZOD SCHEMAS
// ============================================================================
const sectionVisibilitySchema = z.object({
	hero: z.boolean(),
	certificates: z.boolean(),
	description: z.boolean(),
});

const heroSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	titleHighlight: z.string().max(200).optional(),
	subtitle: z.string().max(1000).optional(),
	backgroundImage: z.string().max(500).optional(),
});

const certificateSchema = z.object({
	title: z.string().max(200).optional(),
	image: z.string().max(500).optional(),
	description: z.string().max(1000).optional(),
	order: z.number().optional(),
});

const descriptionSectionSchema = z.object({
	title: z.string().max(200).optional(),
	content: z.string().optional(),
});

const seoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(300).optional(),
	keywords: z.array(z.string().max(50)).optional(),
	ogImage: z.string().max(500).optional(),
});

const formSchema = z.object({
	sectionVisibility: sectionVisibilitySchema,
	hero: heroSectionSchema,
	certificates: z.array(certificateSchema),
	description: descriptionSectionSchema,
	seo: seoSchema,
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
	sectionVisibility: {
		hero: true,
		certificates: true,
		description: true,
	},
	hero: {
		badge: "QUALITY ASSURANCE",
		title: "Our",
		titleHighlight: "Certifications",
		subtitle: "We are committed to maintaining the highest standards of quality and safety.",
		backgroundImage: "",
	},
	certificates: [],
	description: {
		title: "Our Commitment to Quality",
		content: "",
	},
	seo: {
		title: "Quality & Certifications",
		description: "",
		keywords: [],
		ogImage: "",
	},
};

export default function QualityAdminPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	// Field arrays
	const certificates = useFieldArray({
		control: form.control,
		name: "certificates",
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const seoKeywords = useFieldArray({
		control: form.control,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		name: "seo.keywords" as any,
	});

	// Fetch data on mount
	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/quality-page");
				if (res.ok) {
					const data = await res.json();
					// Merge with defaults to ensure all fields exist
					form.reset({
						sectionVisibility: {
							...defaultValues.sectionVisibility,
							...data.sectionVisibility,
						},
						hero: {
							...defaultValues.hero,
							...data.hero,
						},
						certificates: data.certificates || [],
						description: {
							...defaultValues.description,
							...data.description,
						},
						seo: {
							...defaultValues.seo,
							...data.seo,
						},
					});
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Failed to fetch data");
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, [form]);

	// Helper to format validation errors
	function formatValidationErrors(details: unknown): string {
		if (!details || typeof details !== "object") return "";
		const flattenedError = details as {
			fieldErrors?: Record<string, string[]>;
			formErrors?: string[];
		};
		const errors: string[] = [];
		if (flattenedError.formErrors?.length) {
			errors.push(...flattenedError.formErrors);
		}
		if (flattenedError.fieldErrors) {
			for (const [field, messages] of Object.entries(flattenedError.fieldErrors)) {
				if (messages?.length) {
					errors.push(`${field}: ${messages.join(", ")}`);
				}
			}
		}
		return errors.length > 0 ? errors.join("; ") : "";
	}

	const onSubmit = async (data: FormData) => {
		setIsSaving(true);
		try {
			const res = await fetch("/api/quality-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const responseData = await res.json();

			if (res.ok) {
				toast.success("Quality page saved successfully");
			} else {
				const errorMessage = responseData.error || responseData.message || "Failed to save changes";
				const details = responseData.details ? `: ${formatValidationErrors(responseData.details)}` : "";
				throw new Error(`${errorMessage}${details}`);
			}
		} catch (error) {
			console.error("Error saving:", error);
			toast.error(error instanceof Error ? error.message : "Failed to save changes");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return <CMSPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-medium tracking-tight">Quality Page</h1>
					<p className="text-muted-foreground">
						Manage the quality and certifications page content.
					</p>
				</div>
				<a
					href="/quality"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<form id="quality-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Tabs defaultValue="visibility" className="space-y-6">
					<TabsList className="flex-wrap h-auto justify-start">
						<TabsTrigger value="visibility" className="gap-2">
							<Eye className="h-4 w-4" />
							Visibility
						</TabsTrigger>
						<TabsTrigger value="hero" className="gap-2">
							<Award className="h-4 w-4" />
							Hero
						</TabsTrigger>
						<TabsTrigger value="certificates" className="gap-2">
							<Award className="h-4 w-4" />
							Certificates
						</TabsTrigger>
						<TabsTrigger value="description" className="gap-2">
							<FileText className="h-4 w-4" />
							Description
						</TabsTrigger>
						<TabsTrigger value="seo" className="gap-2">
							<Search className="h-4 w-4" />
							SEO
						</TabsTrigger>
					</TabsList>

					{/* Visibility Tab */}
					<TabsContent value="visibility">
						<Card>
							<CardHeader>
								<CardTitle>Section Visibility</CardTitle>
								<CardDescription>
									Choose which sections to display on the page
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Hero Section</Label>
										<p className="text-sm text-muted-foreground">
											Show the hero section with title and background
										</p>
									</div>
									<Switch
										checked={form.watch("sectionVisibility.hero")}
										onCheckedChange={(v) =>
											form.setValue("sectionVisibility.hero", v)
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Certificates Section</Label>
										<p className="text-sm text-muted-foreground">
											Show the certificates gallery
										</p>
									</div>
									<Switch
										checked={form.watch("sectionVisibility.certificates")}
										onCheckedChange={(v) =>
											form.setValue("sectionVisibility.certificates", v)
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Description Section</Label>
										<p className="text-sm text-muted-foreground">
											Show the description/content section
										</p>
									</div>
									<Switch
										checked={form.watch("sectionVisibility.description")}
										onCheckedChange={(v) =>
											form.setValue("sectionVisibility.description", v)
										}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Hero Tab */}
					<TabsContent value="hero">
						<Card>
							<CardHeader>
								<CardTitle>Hero Section</CardTitle>
								<CardDescription>
									Main title and introduction for the quality page
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="hero.badge">Badge</Label>
									<Input
										id="hero.badge"
										{...form.register("hero.badge")}
										value={form.watch("hero.badge") || ""}
										placeholder="QUALITY ASSURANCE"
									/>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="hero.title">Title</Label>
										<Input
											id="hero.title"
											{...form.register("hero.title")}
											value={form.watch("hero.title") || ""}
											placeholder="Our"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="hero.titleHighlight">
											Highlighted Text
										</Label>
										<Input
											id="hero.titleHighlight"
											{...form.register("hero.titleHighlight")}
											value={form.watch("hero.titleHighlight") || ""}
											placeholder="Certifications"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="hero.subtitle">Subtitle</Label>
									<Textarea
										id="hero.subtitle"
										{...form.register("hero.subtitle")}
										value={form.watch("hero.subtitle") || ""}
										placeholder="We are committed to maintaining the highest standards..."
										rows={3}
									/>
								</div>
								<div className="space-y-2">
									<Label>Background Image</Label>
									<MediaPicker
										type="image"
										value={form.watch("hero.backgroundImage") || null}
										onChange={(url) => form.setValue("hero.backgroundImage", url || "")}
										placeholder="Select background image"
										galleryTitle="Select Hero Background"
									/>
									<p className="text-sm text-muted-foreground">
										Optional background image for the hero section
									</p>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Certificates Tab */}
					<TabsContent value="certificates">
						<Card>
							<CardHeader>
								<CardTitle>Certificates</CardTitle>
								<CardDescription>
									Add and manage certificates to display on the page
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{certificates.fields.map((field, index) => (
									<div
										key={field.id}
										className="flex items-start gap-4 p-4 border rounded-lg"
									>
										<div className="flex items-center text-muted-foreground">
											<GripVertical className="h-5 w-5" />
										</div>
										<div className="flex-1 space-y-4">
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Title</Label>
													<Input
														{...form.register(
															`certificates.${index}.title`
														)}
														value={form.watch(`certificates.${index}.title`) || ""}
														placeholder="ISO 9001"
													/>
												</div>
												<div className="space-y-2">
													<Label>Order</Label>
													<Input
														type="number"
														{...form.register(
															`certificates.${index}.order`,
															{ valueAsNumber: true }
														)}
														placeholder="1"
													/>
												</div>
											</div>
											<div className="space-y-2">
												<Label>Certificate Image</Label>
												<MediaPicker
													type="image"
													value={form.watch(`certificates.${index}.image`) || null}
													onChange={(url) => form.setValue(`certificates.${index}.image`, url || "")}
													placeholder="Select certificate image"
													galleryTitle="Select Certificate Image"
												/>
											</div>
											<div className="space-y-2">
												<Label>Description</Label>
												<Textarea
													{...form.register(
														`certificates.${index}.description`
													)}
													value={form.watch(`certificates.${index}.description`) || ""}
													placeholder="Quality management system certification..."
													rows={2}
												/>
											</div>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={async () => {
												const confirmed = await confirm({
													title: "Remove Certificate",
													description: "Are you sure you want to remove this certificate?",
													confirmText: "Remove",
												});
												if (confirmed) certificates.remove(index);
											}}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										certificates.append({
											title: "",
											image: "",
											description: "",
											order: certificates.fields.length + 1,
										})
									}
								>
									<Plus className="mr-2 h-4 w-4" />
									Add Certificate
								</Button>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Description Tab */}
					<TabsContent value="description">
						<Card>
							<CardHeader>
								<CardTitle>Description Section</CardTitle>
								<CardDescription>
									Additional content about your quality commitment
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="description.title">Section Title</Label>
									<Input
										id="description.title"
										{...form.register("description.title")}
										value={form.watch("description.title") || ""}
										placeholder="Our Commitment to Quality"
									/>
								</div>
								<div className="space-y-2">
									<Label>Content</Label>
									<RichTextEditor
										value={form.watch("description.content") || ""}
										onChange={(content) => form.setValue("description.content", content)}
										placeholder="Write about your quality standards and commitment..."
									/>
								</div>
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
										Search engine optimization for the quality page.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="seo.title">Page Title</Label>
										<Input
											id="seo.title"
											{...form.register("seo.title")}
											value={form.watch("seo.title") || ""}
											placeholder="Quality & Certifications"
										/>
										<p className="text-sm text-muted-foreground">
											Displayed in browser tab and search results.
										</p>
									</div>
									<div className="space-y-2">
										<Label htmlFor="seo.description">Meta Description</Label>
										<Textarea
											id="seo.description"
											{...form.register("seo.description")}
											value={form.watch("seo.description") || ""}
											placeholder="Learn about our quality standards and certifications..."
											rows={3}
										/>
										<p className="text-sm text-muted-foreground">
											Short description shown in search results.
										</p>
									</div>
									<div className="space-y-2">
										<Label>OG Image</Label>
										<MediaPicker
											type="image"
											value={form.watch("seo.ogImage") || null}
											onChange={(url) => form.setValue("seo.ogImage", url || "")}
											placeholder="Select OG image (1200x630px recommended)"
											galleryTitle="Select OG Image"
										/>
										<p className="text-sm text-muted-foreground">
											Image shown when sharing on social media.
										</p>
									</div>
									<div className="space-y-2">
										<Label>Keywords</Label>
										<div className="space-y-2">
											{seoKeywords.fields.map((field, index) => (
												<div
													key={field.id}
													className="flex items-center gap-2"
												>
													<Input
														{...form.register(
															`seo.keywords.${index}` as const
														)}
														value={form.watch(`seo.keywords.${index}`) || ""}
														placeholder="Keyword"
													/>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={async () => {
															const confirmed = await confirm({
																title: "Remove Keyword",
																description: "Are you sure you want to remove this keyword?",
																confirmText: "Remove",
															});
															if (confirmed) seoKeywords.remove(index);
														}}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											))}
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													seoKeywords.append("" as never)
												}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Keyword
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Preview</CardTitle>
									<CardDescription>
										See how the quality page appears in search results and social media.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<SeoPreview
										data={{
											title: form.watch("seo.title") || "Quality & Certifications",
											description: form.watch("seo.description") || "Add a description",
											slug: "quality",
											ogImage: form.watch("seo.ogImage") || null,
											siteName: "Milatte Farm",
											siteUrl: "www.milatte.com",
										}}
									/>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>

				{/* Save Button */}
				<div className="flex justify-end">
					<Button type="submit" disabled={isSaving} size="lg">
						{isSaving ? (
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
			<ConfirmModal />
		</div>
	);
}
