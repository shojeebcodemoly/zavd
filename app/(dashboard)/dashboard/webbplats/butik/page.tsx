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
	Store,
	Clock,
	MapPin,
	Images,
	Search,
	ExternalLink,
	Info,
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
	updateStorePageSchema,
	storeSectionVisibilitySchema,
} from "@/lib/validations/store-page.validation";
import type { StorePageData } from "@/lib/repositories/store-page.repository";

// Form schema combining all sections
const formSchema = z.object({
	sectionVisibility: storeSectionVisibilitySchema,
	hero: z.object({
		badge: z.string().optional(),
		title: z.string().optional(),
		subtitle: z.string().optional(),
		backgroundImage: z.string().optional(),
	}),
	info: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		image: z.string().optional(),
		features: z.array(z.string()).optional(),
	}),
	openingHours: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		schedule: z
			.array(
				z.object({
					day: z.string().optional(),
					hours: z.string().optional(),
					isClosed: z.boolean().optional(),
				})
			)
			.optional(),
		specialNote: z.string().optional(),
	}),
	map: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		address: z.string().optional(),
		city: z.string().optional(),
		postalCode: z.string().optional(),
		country: z.string().optional(),
		phone: z.string().optional(),
		email: z.string().optional(),
		mapEmbedUrl: z.string().optional(),
		directions: z.string().optional(),
	}),
	gallery: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		images: z
			.array(
				z.object({
					url: z.string(),
					alt: z.string().optional(),
					caption: z.string().optional(),
				})
			)
			.optional(),
	}),
	seo: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		ogImage: z.string().optional(),
	}),
});

type FormData = z.infer<typeof formSchema>;

const defaultSchedule = [
	{ day: "Monday", hours: "10:00 - 18:00", isClosed: false },
	{ day: "Tuesday", hours: "10:00 - 18:00", isClosed: false },
	{ day: "Wednesday", hours: "10:00 - 18:00", isClosed: false },
	{ day: "Thursday", hours: "10:00 - 18:00", isClosed: false },
	{ day: "Friday", hours: "10:00 - 18:00", isClosed: false },
	{ day: "Saturday", hours: "10:00 - 15:00", isClosed: false },
	{ day: "Sunday", hours: "Closed", isClosed: true },
];

export default function StorePageCMS() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				info: true,
				openingHours: true,
				map: true,
				gallery: true,
			},
			hero: {},
			info: { features: [] },
			openingHours: { schedule: defaultSchedule },
			map: {},
			gallery: { images: [] },
			seo: {},
		},
	});

	// Field arrays
	const {
		fields: featureFields,
		append: appendFeature,
		remove: removeFeature,
	} = useFieldArray({ control: form.control, name: "info.features" as never });

	const {
		fields: scheduleFields,
	} = useFieldArray({ control: form.control, name: "openingHours.schedule" });

	const {
		fields: galleryFields,
		append: appendGalleryImage,
		remove: removeGalleryImage,
	} = useFieldArray({ control: form.control, name: "gallery.images" });

	// Fetch initial data
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/store-page");
				if (!response.ok) throw new Error("Failed to fetch");
				const data: StorePageData = await response.json();

				form.reset({
					sectionVisibility: data.sectionVisibility || {
						hero: true,
						info: true,
						openingHours: true,
						map: true,
						gallery: true,
					},
					hero: {
						badge: data.hero?.badge || "",
						title: data.hero?.title || "",
						subtitle: data.hero?.subtitle || "",
						backgroundImage: data.hero?.backgroundImage || "",
					},
					info: {
						title: data.info?.title || "",
						description: data.info?.description || "",
						image: data.info?.image || "",
						features: data.info?.features || [],
					},
					openingHours: {
						title: data.openingHours?.title || "",
						subtitle: data.openingHours?.subtitle || "",
						schedule: data.openingHours?.schedule || defaultSchedule,
						specialNote: data.openingHours?.specialNote || "",
					},
					map: {
						title: data.map?.title || "",
						subtitle: data.map?.subtitle || "",
						address: data.map?.address || "",
						city: data.map?.city || "",
						postalCode: data.map?.postalCode || "",
						country: data.map?.country || "",
						phone: data.map?.phone || "",
						email: data.map?.email || "",
						mapEmbedUrl: data.map?.mapEmbedUrl || "",
						directions: data.map?.directions || "",
					},
					gallery: {
						title: data.gallery?.title || "",
						subtitle: data.gallery?.subtitle || "",
						images: data.gallery?.images || [],
					},
					seo: data.seo || {},
				});
			} catch (error) {
				console.error("Error fetching store page:", error);
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
			const payload = updateStorePageSchema.parse(data);

			const response = await fetch("/api/store-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to save");
			}

			toast.success("Store page updated successfully!");
		} catch (error) {
			console.error("Error saving store page:", error);
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
					<h1 className="text-3xl font-medium tracking-tight">Store in Boxholm</h1>
					<p className="text-muted-foreground">
						Manage your store page content
					</p>
				</div>
				<div className="flex items-center gap-3">
					<a
						href="/our-store"
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
						<Store className="h-4 w-4" />
						Hero
					</TabsTrigger>
					<TabsTrigger value="info" className="gap-2">
						<Info className="h-4 w-4" />
						Info
					</TabsTrigger>
					<TabsTrigger value="hours" className="gap-2">
						<Clock className="h-4 w-4" />
						Hours
					</TabsTrigger>
					<TabsTrigger value="location" className="gap-2">
						<MapPin className="h-4 w-4" />
						Location
					</TabsTrigger>
					<TabsTrigger value="gallery" className="gap-2">
						<Images className="h-4 w-4" />
						Gallery
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
								{ key: "info", label: "Info Section" },
								{ key: "openingHours", label: "Opening Hours" },
								{ key: "map", label: "Map & Location" },
								{ key: "gallery", label: "Gallery" },
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
										placeholder="e.g., Visit Us"
									/>
								</div>
								<div className="space-y-2">
									<Label>Title</Label>
									<Input
										{...form.register("hero.title")}
										placeholder="e.g., Store in Boxholm"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label>Subtitle</Label>
								<Textarea
									{...form.register("hero.subtitle")}
									placeholder="A brief description of your store..."
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

				{/* Info Tab */}
				<TabsContent value="info">
					<Card>
						<CardHeader>
							<CardTitle>Info Section</CardTitle>
							<CardDescription>Information about your store with features</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Title</Label>
									<Input
										{...form.register("info.title")}
										placeholder="e.g., Welcome to Our Store"
									/>
								</div>
								<div className="space-y-2">
									<Label>Image</Label>
									<MediaPicker
										type="image"
										value={form.watch("info.image") || null}
										onChange={(url) => form.setValue("info.image", url || "")}
										placeholder="Select store image"
										galleryTitle="Select Store Image"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label>Description</Label>
								<Textarea
									{...form.register("info.description")}
									placeholder="Describe your store..."
									rows={4}
								/>
							</div>

							{/* Features */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">Features</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => appendFeature("" as never)}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Feature
									</Button>
								</div>
								{featureFields.length === 0 && (
									<p className="text-center text-muted-foreground py-4">
										No features added yet. Click &quot;Add Feature&quot; to get started.
									</p>
								)}
								{featureFields.map((field, index) => (
									<div key={field.id} className="flex items-center gap-2">
										<Input
											{...form.register(`info.features.${index}` as const)}
											placeholder="e.g., Cheese tasting available"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => removeFeature(index)}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Opening Hours Tab */}
				<TabsContent value="hours">
					<Card>
						<CardHeader>
							<CardTitle>Opening Hours</CardTitle>
							<CardDescription>Set your store&apos;s operating hours</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Section Title</Label>
									<Input
										{...form.register("openingHours.title")}
										placeholder="e.g., Opening Hours"
									/>
								</div>
								<div className="space-y-2">
									<Label>Subtitle</Label>
									<Input
										{...form.register("openingHours.subtitle")}
										placeholder="e.g., We look forward to seeing you!"
									/>
								</div>
							</div>

							{/* Schedule */}
							<div className="space-y-4">
								<Label className="text-base">Weekly Schedule</Label>
								{scheduleFields.map((field, index) => (
									<div
										key={field.id}
										className="grid gap-4 md:grid-cols-[1fr_1fr_auto] items-center rounded-lg border p-4"
									>
										<div className="space-y-2">
											<Label className="text-sm">Day</Label>
											<Input
												{...form.register(`openingHours.schedule.${index}.day`)}
												placeholder="e.g., Monday"
											/>
										</div>
										<div className="space-y-2">
											<Label className="text-sm">Hours</Label>
											<Input
												{...form.register(`openingHours.schedule.${index}.hours`)}
												placeholder="e.g., 10:00 - 18:00"
												disabled={form.watch(`openingHours.schedule.${index}.isClosed`)}
											/>
										</div>
										<div className="flex items-center gap-2 pt-6">
											<Switch
												checked={form.watch(`openingHours.schedule.${index}.isClosed`)}
												onCheckedChange={(checked) => {
													form.setValue(`openingHours.schedule.${index}.isClosed`, checked);
													if (checked) {
														form.setValue(`openingHours.schedule.${index}.hours`, "Closed");
													}
												}}
											/>
											<Label className="text-sm">Closed</Label>
										</div>
									</div>
								))}
							</div>

							<div className="space-y-2">
								<Label>Special Note</Label>
								<Textarea
									{...form.register("openingHours.specialNote")}
									placeholder="e.g., Holiday hours may vary. Please call ahead during holidays."
									rows={2}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Location Tab */}
				<TabsContent value="location">
					<Card>
						<CardHeader>
							<CardTitle>Location & Map</CardTitle>
							<CardDescription>Your store&apos;s address and contact information</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Section Title</Label>
									<Input
										{...form.register("map.title")}
										placeholder="e.g., Find Us"
									/>
								</div>
								<div className="space-y-2">
									<Label>Subtitle</Label>
									<Input
										{...form.register("map.subtitle")}
										placeholder="e.g., We're located in the center of Boxholm"
									/>
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Street Address</Label>
									<Input
										{...form.register("map.address")}
										placeholder="e.g., Storgatan 1"
									/>
								</div>
								<div className="space-y-2">
									<Label>Postal Code</Label>
									<Input
										{...form.register("map.postalCode")}
										placeholder="e.g., 590 10"
									/>
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>City</Label>
									<Input
										{...form.register("map.city")}
										placeholder="e.g., Boxholm"
									/>
								</div>
								<div className="space-y-2">
									<Label>Country</Label>
									<Input
										{...form.register("map.country")}
										placeholder="e.g., Sweden"
									/>
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Phone</Label>
									<Input
										{...form.register("map.phone")}
										placeholder="e.g., +46 123 456 789"
									/>
								</div>
								<div className="space-y-2">
									<Label>Email</Label>
									<Input
										{...form.register("map.email")}
										placeholder="e.g., store@boxholmcheese.se"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Directions / Parking Info</Label>
								<Textarea
									{...form.register("map.directions")}
									placeholder="e.g., Easy parking available in front of the store..."
									rows={2}
								/>
							</div>

							<div className="space-y-2">
								<Label>Google Maps Embed URL</Label>
								<Input
									{...form.register("map.mapEmbedUrl")}
									placeholder="Paste Google Maps embed URL here..."
								/>
								<p className="text-xs text-muted-foreground">
									To get the embed URL: Go to Google Maps → Search your location → Click Share → Embed a map → Copy the src URL from the iframe code
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Gallery Tab */}
				<TabsContent value="gallery">
					<Card>
						<CardHeader>
							<CardTitle>Gallery</CardTitle>
							<CardDescription>Photos of your store</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Section Title</Label>
									<Input
										{...form.register("gallery.title")}
										placeholder="e.g., Our Store"
									/>
								</div>
								<div className="space-y-2">
									<Label>Subtitle</Label>
									<Input
										{...form.register("gallery.subtitle")}
										placeholder="e.g., Take a peek inside"
									/>
								</div>
							</div>

							{/* Gallery Images */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">Images</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendGalleryImage({ url: "", alt: "", caption: "" })
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Image
									</Button>
								</div>

								{galleryFields.length === 0 && (
									<p className="text-center text-muted-foreground py-8">
										No images added yet. Click &quot;Add Image&quot; to get started.
									</p>
								)}

								<div className="grid gap-4 md:grid-cols-2">
									{galleryFields.map((field, index) => (
										<div
											key={field.id}
											className="rounded-lg border p-4 space-y-4"
										>
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">
													Image {index + 1}
												</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeGalleryImage(index)}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
											<div className="space-y-2">
												<Label>Image</Label>
												<MediaPicker
													type="image"
													value={form.watch(`gallery.images.${index}.url`) || null}
													onChange={(url) =>
														form.setValue(`gallery.images.${index}.url`, url || "")
													}
													placeholder="Select image"
													galleryTitle="Select Gallery Image"
												/>
											</div>
											<div className="space-y-2">
												<Label>Alt Text</Label>
												<Input
													{...form.register(`gallery.images.${index}.alt`)}
													placeholder="Describe the image..."
												/>
											</div>
											<div className="space-y-2">
												<Label>Caption (optional)</Label>
												<Input
													{...form.register(`gallery.images.${index}.caption`)}
													placeholder="Image caption..."
												/>
											</div>
										</div>
									))}
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
									Search engine optimization for the store page
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label>Meta Title</Label>
									<Input
										{...form.register("seo.title")}
										placeholder="Store in Boxholm - Company Name"
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
									See how the store page appears in search results
								</CardDescription>
							</CardHeader>
							<CardContent>
								<SeoPreview
									data={{
										title: form.watch("seo.title") || "Store in Boxholm - Company Name",
										description: form.watch("seo.description") || "Add a description",
										slug: "our-store",
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
