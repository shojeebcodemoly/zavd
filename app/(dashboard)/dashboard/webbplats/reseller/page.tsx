"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
	Loader2,
	Save,
	Plus,
	Trash2,
	Eye,
	EyeOff,
	Handshake,
	Search,
	ExternalLink,
	Gift,
	FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	updateResellerPageSchema,
	resellerSectionVisibilitySchema,
} from "@/lib/validations/reseller-page.validation";
import type { ResellerPageData } from "@/lib/repositories/reseller-page.repository";

// Available icons for benefits
const availableIcons = [
	"CheckCircle",
	"TrendingUp",
	"Users",
	"Handshake",
	"Award",
	"Shield",
	"Heart",
	"Star",
	"Zap",
	"Target",
];

// Form schema combining all sections
const formSchema = z.object({
	sectionVisibility: resellerSectionVisibilitySchema,
	hero: z.object({
		badge: z.string().optional(),
		title: z.string().optional(),
		titleHighlight: z.string().optional(),
		subtitle: z.string().optional(),
		backgroundImage: z.string().optional(),
	}),
	benefits: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		benefits: z
			.array(
				z.object({
					icon: z.string().optional(),
					title: z.string().optional(),
					description: z.string().optional(),
				})
			)
			.optional(),
	}),
	formSection: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		successMessage: z.string().optional(),
		successDescription: z.string().optional(),
	}),
	seo: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		ogImage: z.string().optional(),
	}),
});

type FormData = z.infer<typeof formSchema>;

export default function ResellerPageCMS() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				benefits: true,
				form: true,
			},
			hero: {},
			benefits: { benefits: [] },
			formSection: {},
			seo: {},
		},
	});

	// Field arrays
	const {
		fields: benefitFields,
		append: appendBenefit,
		remove: removeBenefit,
	} = useFieldArray({ control: form.control, name: "benefits.benefits" });

	// Fetch initial data
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/reseller-page");
				if (!response.ok) throw new Error("Failed to fetch");
				const data: ResellerPageData = await response.json();

				form.reset({
					sectionVisibility: data.sectionVisibility || {
						hero: true,
						benefits: true,
						form: true,
					},
					hero: {
						badge: data.hero?.badge || "",
						title: data.hero?.title || "",
						titleHighlight: data.hero?.titleHighlight || "",
						subtitle: data.hero?.subtitle || "",
						backgroundImage: data.hero?.backgroundImage || "",
					},
					benefits: {
						title: data.benefits?.title || "",
						subtitle: data.benefits?.subtitle || "",
						benefits: data.benefits?.benefits || [],
					},
					formSection: {
						title: data.formSection?.title || "",
						subtitle: data.formSection?.subtitle || "",
						successMessage: data.formSection?.successMessage || "",
						successDescription: data.formSection?.successDescription || "",
					},
					seo: data.seo || {},
				});
			} catch (error) {
				console.error("Error fetching reseller page:", error);
				toast.error("Failed to load page data");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [form]);

	const onSubmit = async (data: FormData) => {
		setIsSaving(true);
		try {
			const payload = updateResellerPageSchema.parse(data);

			const response = await fetch("/api/reseller-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to save");
			}

			toast.success("Reseller page updated successfully!");
		} catch (error) {
			console.error("Error saving reseller page:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save changes"
			);
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return <CMSPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-medium tracking-tight">Become Our Reseller</h1>
					<p className="text-muted-foreground">
						Manage your reseller application page content
					</p>
				</div>
				<div className="flex items-center gap-3">
					<a
						href="/become-our-reseller"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						<ExternalLink className="h-4 w-4" />
						<span>View page</span>
					</a>
					<Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
						{isSaving ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Save Changes
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="visibility" className="space-y-6">
				<TabsList className="flex flex-wrap h-auto gap-1 justify-start">
					<TabsTrigger value="visibility" className="gap-2">
						<Eye className="h-4 w-4" />
						Visibility
					</TabsTrigger>
					<TabsTrigger value="hero" className="gap-2">
						<Handshake className="h-4 w-4" />
						Hero
					</TabsTrigger>
					<TabsTrigger value="benefits" className="gap-2">
						<Gift className="h-4 w-4" />
						Benefits
					</TabsTrigger>
					<TabsTrigger value="form" className="gap-2">
						<FileText className="h-4 w-4" />
						Form
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
							<CardDescription>Choose which sections to display on the page</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{[
								{ key: "hero", label: "Hero Section" },
								{ key: "benefits", label: "Benefits Section" },
								{ key: "form", label: "Application Form" },
							].map(({ key, label }) => (
								<div
									key={key}
									className="flex items-center justify-between rounded-lg border p-4"
								>
									<div className="flex items-center gap-3">
										{form.watch(
											`sectionVisibility.${key as keyof FormData["sectionVisibility"]}`
										) ? (
											<Eye className="h-4 w-4 text-primary" />
										) : (
											<EyeOff className="h-4 w-4 text-muted-foreground" />
										)}
										<span className="font-medium">{label}</span>
									</div>
									<Switch
										checked={form.watch(
											`sectionVisibility.${key as keyof FormData["sectionVisibility"]}`
										)}
										onCheckedChange={(checked) =>
											form.setValue(
												`sectionVisibility.${key as keyof FormData["sectionVisibility"]}`,
												checked
											)
										}
									/>
								</div>
							))}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Hero Tab */}
				<TabsContent value="hero">
					<Card>
						<CardHeader>
							<CardTitle>Hero Section</CardTitle>
							<CardDescription>The main banner at the top of the page</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Badge Text</Label>
									<Input
										{...form.register("hero.badge")}
										placeholder="e.g., Partnerskap"
									/>
								</div>
								<div className="space-y-2">
									<Label>Title</Label>
									<Input
										{...form.register("hero.title")}
										placeholder="e.g., Bli Vår Återförsäljare"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label>Title Highlight (colored part)</Label>
								<Input
									{...form.register("hero.titleHighlight")}
									placeholder="e.g., Återförsäljare"
								/>
								<p className="text-xs text-muted-foreground">
									This part of the title will be highlighted in color
								</p>
							</div>
							<div className="space-y-2">
								<Label>Subtitle</Label>
								<Textarea
									{...form.register("hero.subtitle")}
									placeholder="A brief description of the partnership opportunity..."
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
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Benefits Tab */}
				<TabsContent value="benefits">
					<Card>
						<CardHeader>
							<CardTitle>Benefits Section</CardTitle>
							<CardDescription>Highlight the advantages of becoming a reseller</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Section Title</Label>
									<Input
										{...form.register("benefits.title")}
										placeholder="e.g., Fördelar Med Att Bli Partner"
									/>
								</div>
								<div className="space-y-2">
									<Label>Section Subtitle</Label>
									<Input
										{...form.register("benefits.subtitle")}
										placeholder="e.g., Som återförsäljare får du..."
									/>
								</div>
							</div>

							{/* Benefits List */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">Benefits</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendBenefit({
												icon: "CheckCircle",
												title: "",
												description: "",
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Benefit
									</Button>
								</div>

								{benefitFields.length === 0 && (
									<p className="text-center text-muted-foreground py-8">
										No benefits added yet. Click &quot;Add Benefit&quot; to get started.
									</p>
								)}

								<div className="grid gap-4 md:grid-cols-2">
									{benefitFields.map((field, index) => (
										<div
											key={field.id}
											className="rounded-lg border p-4 space-y-4"
										>
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">
													Benefit {index + 1}
												</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeBenefit(index)}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
											<div className="space-y-2">
												<Label>Icon</Label>
												<Select
													value={form.watch(`benefits.benefits.${index}.icon`) || availableIcons[0]}
													onValueChange={(value) => form.setValue(`benefits.benefits.${index}.icon`, value, { shouldDirty: true })}
												>
													<SelectTrigger className="w-full h-10">
														<SelectValue placeholder="Select icon" />
													</SelectTrigger>
													<SelectContent>
														{availableIcons.map((icon) => (
															<SelectItem key={icon} value={icon}>
																{icon}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label>Title</Label>
												<Input
													{...form.register(`benefits.benefits.${index}.title`)}
													placeholder="e.g., Premium Produkter"
												/>
											</div>
											<div className="space-y-2">
												<Label>Description</Label>
												<Textarea
													{...form.register(`benefits.benefits.${index}.description`)}
													placeholder="Describe this benefit..."
													rows={2}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Form Section Tab */}
				<TabsContent value="form">
					<Card>
						<CardHeader>
							<CardTitle>Application Form Section</CardTitle>
							<CardDescription>Customize the form section and success messages</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Section Title</Label>
									<Input
										{...form.register("formSection.title")}
										placeholder="e.g., Ansök Nu"
									/>
								</div>
								<div className="space-y-2">
									<Label>Section Subtitle</Label>
									<Input
										{...form.register("formSection.subtitle")}
										placeholder="e.g., Fyll i formuläret nedan..."
									/>
								</div>
							</div>

							<div className="border-t pt-6 mt-6">
								<h4 className="font-medium mb-4">Success Messages</h4>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Success Title</Label>
										<Input
											{...form.register("formSection.successMessage")}
											placeholder="e.g., Tack för din ansökan!"
										/>
									</div>
									<div className="space-y-2">
										<Label>Success Description</Label>
										<Textarea
											{...form.register("formSection.successDescription")}
											placeholder="Message shown after successful submission..."
											rows={2}
										/>
									</div>
								</div>
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
									Search engine optimization for the reseller page
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label>Meta Title</Label>
									<Input
										{...form.register("seo.title")}
										placeholder="Bli Återförsäljare - Company Name"
									/>
								</div>

								<div className="space-y-2">
									<Label>Meta Description</Label>
									<Textarea
										{...form.register("seo.description")}
										placeholder="SEO description for search engines..."
										rows={3}
									/>
								</div>

								<div className="space-y-2">
									<Label>Open Graph Image</Label>
									<MediaPicker
										type="image"
										value={form.watch("seo.ogImage") || null}
										onChange={(url) => form.setValue("seo.ogImage", url || "")}
										placeholder="Select OG image (1200x630px recommended)"
										galleryTitle="Select OG Image"
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Preview</CardTitle>
								<CardDescription>
									See how the reseller page appears in search results
								</CardDescription>
							</CardHeader>
							<CardContent>
								<SeoPreview
									data={{
										title: form.watch("seo.title") || "Bli Återförsäljare - Company Name",
										description: form.watch("seo.description") || "Add a description",
										slug: "become-our-reseller",
										ogImage: form.watch("seo.ogImage") || null,
										siteName: "Boxholm Cheese",
										siteUrl: "www.example.com",
									}}
								/>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>

			{/* Floating Save Button */}
			<div className="flex justify-end sticky bottom-6">
				<Button
					onClick={form.handleSubmit(onSubmit)}
					disabled={isSaving}
					size="lg"
					className="shadow-lg"
				>
					{isSaving ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Saving...
						</>
					) : (
						<>
							<Save className="mr-2 h-4 w-4" />
							Save Changes
						</>
					)}
				</Button>
			</div>
		</div>
	);
}
