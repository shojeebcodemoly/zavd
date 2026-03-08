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
	History,
	Users,
	Phone,
	Search,
	ExternalLink,
	Mail,
	Linkedin,
	Building2,
	GripVertical,
	Play,
	Images,
	BarChart3,
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
	updateAboutPageSchema,
	aboutSectionVisibilitySchema,
} from "@/lib/validations/about-page.validation";
import type { AboutPageData } from "@/lib/repositories/about-page.repository";

// Form schema combining all sections
const formSchema = z.object({
	sectionVisibility: aboutSectionVisibilitySchema,
	history: z.object({
		badge: z.string().optional(),
		title: z.string().optional(),
		subtitle: z.string().optional(),
		timelineItems: z
			.array(
				z.object({
					year: z.string().optional(),
					title: z.string().optional(),
					description: z.string().optional(),
					image: z.string().optional(),
				})
			)
			.optional(),
	}),
	customers: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		customers: z
			.array(
				z.object({
					name: z.string().optional(),
					logo: z.string().optional(),
					products: z.string().optional(),
					description: z.string().optional(),
					website: z.string().optional(),
				})
			)
			.optional(),
	}),
	team: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		members: z
			.array(
				z.object({
					name: z.string().optional(),
					role: z.string().optional(),
					image: z.string().optional(),
					email: z.string().optional(),
					phone: z.string().optional(),
					linkedin: z.string().optional(),
					department: z.string().optional(),
					bio: z.string().optional(),
				})
			)
			.optional(),
	}),
	video: z.object({
		backgroundImage: z.string().optional(),
		titleHighlighted: z.string().optional(),
		titleNormal: z.string().optional(),
		videoUrl: z.string().optional(),
		buttonLabel: z.string().optional(),
	}),
	gallery: z.object({
		backgroundImage: z.string().optional(),
		backgroundColor: z.string().optional(),
		title: z.string().optional(),
		images: z
			.array(
				z.object({
					src: z.string().optional(),
					alt: z.string().optional(),
				})
			)
			.optional(),
	}),
	contact: z.object({
		title: z.string().optional(),
		subtitle: z.string().optional(),
		showContactForm: z.boolean().optional(),
		showMap: z.boolean().optional(),
		showOffices: z.boolean().optional(),
	}),
	stats: z.object({
		backgroundColor: z.string().optional(),
		items: z
			.array(
				z.object({
					image: z.string().optional(),
					value: z.string().optional(),
					label: z.string().optional(),
					description: z.string().optional(),
				})
			)
			.optional(),
	}),
	imageDescription: z.object({
		backgroundColor: z.string().optional(),
		items: z
			.array(
				z.object({
					image: z.string().optional(),
					title: z.string().optional(),
					description: z.string().optional(),
					watermarkImage: z.string().optional(),
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

export default function AboutPageCMS() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sectionVisibility: {
				history: true,
				customers: true,
				video: true,
				gallery: true,
				team: true,
				contact: true,
				stats: true,
				imageDescription: true,
			},
			history: { timelineItems: [] },
			customers: { customers: [] },
			video: {},
			gallery: { backgroundColor: "#f5f0e8", images: [] },
			team: { members: [] },
			contact: {
				showContactForm: true,
				showMap: true,
				showOffices: true,
			},
			stats: { backgroundColor: "#ffffff", items: [] },
			imageDescription: { backgroundColor: "#f5f0e8", items: [] },
			seo: {},
		},
	});

	// Field arrays
	const {
		fields: timelineFields,
		append: appendTimeline,
		remove: removeTimeline,
	} = useFieldArray({ control: form.control, name: "history.timelineItems" });

	const {
		fields: customerFields,
		append: appendCustomer,
		remove: removeCustomer,
	} = useFieldArray({ control: form.control, name: "customers.customers" });

	const {
		fields: teamFields,
		append: appendTeamMember,
		remove: removeTeamMember,
	} = useFieldArray({ control: form.control, name: "team.members" });

	const {
		fields: galleryFields,
		append: appendGalleryImage,
		remove: removeGalleryImage,
	} = useFieldArray({ control: form.control, name: "gallery.images" });

	const {
		fields: statsFields,
		append: appendStatItem,
		remove: removeStatItem,
	} = useFieldArray({ control: form.control, name: "stats.items" });

	const {
		fields: imageDescriptionFields,
		append: appendImageDescriptionItem,
		remove: removeImageDescriptionItem,
	} = useFieldArray({ control: form.control, name: "imageDescription.items" });

	// Fetch initial data
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/about-page");
				if (!response.ok) throw new Error("Failed to fetch");
				const data: AboutPageData = await response.json();

				form.reset({
					sectionVisibility: data.sectionVisibility || {
						history: true,
						customers: true,
						video: true,
						gallery: true,
						team: true,
						contact: true,
						stats: true,
						imageDescription: true,
					},
					history: {
						badge: data.history?.badge || "",
						title: data.history?.title || "",
						subtitle: data.history?.subtitle || "",
						timelineItems: data.history?.timelineItems || [],
					},
					customers: {
						title: data.customers?.title || "",
						subtitle: data.customers?.subtitle || "",
						customers: data.customers?.customers || [],
					},
					video: {
						backgroundImage: data.video?.backgroundImage || "",
						titleHighlighted: data.video?.titleHighlighted || "",
						titleNormal: data.video?.titleNormal || "",
						videoUrl: data.video?.videoUrl || "",
						buttonLabel: data.video?.buttonLabel || "",
					},
					gallery: {
						backgroundImage: data.gallery?.backgroundImage || "",
						backgroundColor: data.gallery?.backgroundColor || "#f5f0e8",
						title: data.gallery?.title || "",
						images: data.gallery?.images || [],
					},
					team: {
						title: data.team?.title || "",
						subtitle: data.team?.subtitle || "",
						members: data.team?.members || [],
					},
					contact: {
						title: data.contact?.title || "",
						subtitle: data.contact?.subtitle || "",
						showContactForm: data.contact?.showContactForm ?? true,
						showMap: data.contact?.showMap ?? true,
						showOffices: data.contact?.showOffices ?? true,
					},
					stats: {
						backgroundColor: data.stats?.backgroundColor || "#ffffff",
						items: data.stats?.items || [],
					},
					imageDescription: {
						backgroundColor: data.imageDescription?.backgroundColor || "#f5f0e8",
						items: data.imageDescription?.items || [],
					},
					seo: data.seo || {},
				});
			} catch (error) {
				console.error("Error fetching about page:", error);
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
			const payload = updateAboutPageSchema.parse(data);

			const response = await fetch("/api/about-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to save");
			}

			toast.success("About page updated successfully!");
		} catch (error) {
			console.error("Error saving about page:", error);
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
					<h1 className="text-3xl font-medium tracking-tight">About Us</h1>
					<p className="text-muted-foreground">
						Manage your About Us page content
					</p>
				</div>
				<div className="flex items-center gap-3">
					<a
						href="/about-us"
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
					<TabsTrigger value="history" className="gap-2">
						<History className="h-4 w-4" />
						History
					</TabsTrigger>
					<TabsTrigger value="customers" className="gap-2">
						<Building2 className="h-4 w-4" />
						Our Customers
					</TabsTrigger>
					<TabsTrigger value="video" className="gap-2">
						<Play className="h-4 w-4" />
						Video
					</TabsTrigger>
					<TabsTrigger value="gallery" className="gap-2">
						<Images className="h-4 w-4" />
						Gallery
					</TabsTrigger>
					<TabsTrigger value="team" className="gap-2">
						<Users className="h-4 w-4" />
						Our Team
					</TabsTrigger>
					<TabsTrigger value="stats" className="gap-2">
						<BarChart3 className="h-4 w-4" />
						Stats
					</TabsTrigger>
					<TabsTrigger value="imageDescription" className="gap-2">
						<Images className="h-4 w-4" />
						Image & Description
					</TabsTrigger>
					<TabsTrigger value="contact" className="gap-2">
						<Phone className="h-4 w-4" />
						Contact
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
						<CardContent className="grid gap-4 sm:grid-cols-2">
							{[
								{ key: "history", label: "History Section" },
								{ key: "customers", label: "Our Customers" },
								{ key: "video", label: "Video Section" },
								{ key: "gallery", label: "Image Gallery" },
								{ key: "team", label: "Our Team" },
								{ key: "stats", label: "Stats Section" },
								{ key: "imageDescription", label: "Image & Description" },
								{ key: "contact", label: "Contact Section" },
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

				{/* History Tab */}
				<TabsContent value="history">
					<Card>
						<CardHeader>
							<CardTitle>History Section</CardTitle>
							<CardDescription>Timeline showing your company history (like a winery history page)</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-3">
								<div className="space-y-2">
									<Label>Badge Text</Label>
									<Input
										{...form.register("history.badge")}
										placeholder="e.g., Since 1989"
									/>
								</div>
								<div className="space-y-2">
									<Label>Title</Label>
									<Input
										{...form.register("history.title")}
										placeholder="e.g., Our Little Story"
									/>
								</div>
								<div className="space-y-2">
									<Label>Subtitle</Label>
									<Input
										{...form.register("history.subtitle")}
										placeholder="e.g., Cheese making practice across generations"
									/>
								</div>
							</div>

							{/* Timeline Items */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">Timeline Items</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendTimeline({ year: "", title: "", description: "", image: "" })
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Timeline Item
									</Button>
								</div>

								{timelineFields.length === 0 && (
									<p className="text-center text-muted-foreground py-8">
										No timeline items added yet. Click &quot;Add Timeline Item&quot; to get started.
									</p>
								)}

								{timelineFields.map((field, index) => (
									<div
										key={field.id}
										className="rounded-lg border p-4 space-y-4"
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<GripVertical className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm font-medium">
													Timeline Item {index + 1}
												</span>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeTimeline(index)}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label>Year</Label>
												<Input
													{...form.register(`history.timelineItems.${index}.year`)}
													placeholder="e.g., 1989"
												/>
											</div>
											<div className="space-y-2">
												<Label>Title</Label>
												<Input
													{...form.register(`history.timelineItems.${index}.title`)}
													placeholder="e.g., The First Steps"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<Label>Description</Label>
											<Textarea
												{...form.register(`history.timelineItems.${index}.description`)}
												placeholder="Describe this milestone..."
												rows={3}
											/>
										</div>
										<div className="space-y-2">
											<Label>Image (optional)</Label>
											<MediaPicker
												type="image"
												value={form.watch(`history.timelineItems.${index}.image`) || null}
												onChange={(url) =>
													form.setValue(`history.timelineItems.${index}.image`, url || "")
												}
												placeholder="Select timeline image"
												galleryTitle="Select Timeline Image"
											/>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Customers Tab */}
				<TabsContent value="customers">
					<Card>
						<CardHeader>
							<CardTitle>Our Customers Section</CardTitle>
							<CardDescription>List of customers and the products they purchase</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Section Title</Label>
									<Input
										{...form.register("customers.title")}
										placeholder="e.g., Our Valued Customers"
									/>
								</div>
								<div className="space-y-2">
									<Label>Section Subtitle</Label>
									<Input
										{...form.register("customers.subtitle")}
										placeholder="e.g., Partners who trust our quality"
									/>
								</div>
							</div>

							{/* Customer Items */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">Customers</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendCustomer({ name: "", logo: "", products: "", description: "", website: "" })
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Customer
									</Button>
								</div>

								{customerFields.length === 0 && (
									<p className="text-center text-muted-foreground py-8">
										No customers added yet. Click &quot;Add Customer&quot; to get started.
									</p>
								)}

								{customerFields.map((field, index) => (
									<div
										key={field.id}
										className="rounded-lg border p-4 space-y-4"
									>
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">
												Customer {index + 1}
											</span>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeCustomer(index)}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label>Customer Name</Label>
												<Input
													{...form.register(`customers.customers.${index}.name`)}
													placeholder="e.g., Restaurant ABC"
												/>
											</div>
											<div className="space-y-2">
												<Label>Products They Purchase</Label>
												<Input
													{...form.register(`customers.customers.${index}.products`)}
													placeholder="e.g., Aged Cheddar, Fresh Mozzarella"
												/>
											</div>
										</div>
										<div className="space-y-2">
											<Label>Description (optional)</Label>
											<Textarea
												{...form.register(`customers.customers.${index}.description`)}
												placeholder="Brief description about the customer..."
												rows={2}
											/>
										</div>
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label>Logo</Label>
												<MediaPicker
													type="image"
													value={form.watch(`customers.customers.${index}.logo`) || null}
													onChange={(url) =>
														form.setValue(`customers.customers.${index}.logo`, url || "")
													}
													placeholder="Select customer logo"
													galleryTitle="Select Logo"
												/>
											</div>
											<div className="space-y-2">
												<Label>Website (optional)</Label>
												<Input
													{...form.register(`customers.customers.${index}.website`)}
													placeholder="https://..."
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Video Tab */}
				<TabsContent value="video">
					<Card>
						<CardHeader>
							<CardTitle>Video Section</CardTitle>
							<CardDescription>Full-width video section with play button overlay</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label>Background Image</Label>
								<MediaPicker
									type="image"
									value={form.watch("video.backgroundImage") || null}
									onChange={(url) => form.setValue("video.backgroundImage", url || "")}
									placeholder="Select background image"
									galleryTitle="Select Background Image"
								/>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Title (Highlighted)</Label>
									<Input
										{...form.register("video.titleHighlighted")}
										placeholder="e.g., Work Every Day"
									/>
									<p className="text-xs text-muted-foreground">
										This text will have a colored background highlight
									</p>
								</div>
								<div className="space-y-2">
									<Label>Title (Normal)</Label>
									<Input
										{...form.register("video.titleNormal")}
										placeholder="e.g., to Produce Delicious and Fresh Milk"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Video URL</Label>
								<Input
									{...form.register("video.videoUrl")}
									placeholder="e.g., https://www.youtube.com/watch?v=..."
								/>
								<p className="text-xs text-muted-foreground">
									Supports YouTube, Vimeo, or direct video URLs
								</p>
							</div>

							<div className="space-y-2">
								<Label>Button Label</Label>
								<Input
									{...form.register("video.buttonLabel")}
									placeholder="e.g., video tour"
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Gallery Tab */}
				<TabsContent value="gallery">
					<Card>
						<CardHeader>
							<CardTitle>Image Gallery Section</CardTitle>
							<CardDescription>Horizontal image slider with lightbox (click to view larger)</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Background Options */}
							<div className="space-y-4">
								<Label className="text-base">Background</Label>
								<p className="text-sm text-muted-foreground">
									Choose either an image or a solid color. If both are set, the image will be used.
								</p>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Background Image</Label>
										<MediaPicker
											type="image"
											value={form.watch("gallery.backgroundImage") || null}
											onChange={(url) => form.setValue("gallery.backgroundImage", url || "")}
											placeholder="Select background image"
											galleryTitle="Select Background Image"
										/>
									</div>
									<div className="space-y-2">
										<Label>Background Color (fallback)</Label>
										<div className="flex items-center gap-3">
											<input
												type="color"
												{...form.register("gallery.backgroundColor")}
												className="h-10 w-20 cursor-pointer rounded border"
											/>
											<Input
												{...form.register("gallery.backgroundColor")}
												placeholder="#f5f0e8"
												className="max-w-[150px]"
											/>
										</div>
										<p className="text-xs text-muted-foreground">
											Used when no image is set
										</p>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Section Title/Description</Label>
								<Textarea
									{...form.register("gallery.title")}
									placeholder="e.g., Our farm is not just a production facility but also an open space for visitors..."
									rows={3}
								/>
							</div>

							{/* Gallery Images */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">Gallery Images</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => appendGalleryImage({ src: "", alt: "" })}
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

								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{galleryFields.map((field, index) => (
										<div
											key={field.id}
											className="rounded-lg border p-4 space-y-3"
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
												<MediaPicker
													type="image"
													value={form.watch(`gallery.images.${index}.src`) || null}
													onChange={(url) =>
														form.setValue(`gallery.images.${index}.src`, url || "")
													}
													placeholder="Select image"
													galleryTitle="Select Gallery Image"
												/>
											</div>
											<div className="space-y-2">
												<Label className="text-xs">Alt Text (optional)</Label>
												<Input
													{...form.register(`gallery.images.${index}.alt`)}
													placeholder="Image description"
													className="text-sm"
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Team Tab */}
				<TabsContent value="team">
					<Card>
						<CardHeader>
							<CardTitle>Our Team Section</CardTitle>
							<CardDescription>Team members displayed in a grid layout</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Section Title</Label>
									<Input
										{...form.register("team.title")}
										placeholder="e.g., Meet Our Team"
									/>
								</div>
								<div className="space-y-2">
									<Label>Section Subtitle</Label>
									<Input
										{...form.register("team.subtitle")}
										placeholder="e.g., The people behind our quality products"
									/>
								</div>
							</div>

							{/* Team Members */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">Team Members</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendTeamMember({
												name: "",
												role: "",
												image: "",
												email: "",
												phone: "",
												linkedin: "",
												department: "",
												bio: "",
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Team Member
									</Button>
								</div>

								{teamFields.length === 0 && (
									<p className="text-center text-muted-foreground py-8">
										No team members added yet. Click &quot;Add Team Member&quot; to get started.
									</p>
								)}

								{teamFields.map((field, index) => (
									<div
										key={field.id}
										className="rounded-lg border p-4 space-y-4"
									>
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">
												Team Member {index + 1}
											</span>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeTeamMember(index)}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>

										<div className="grid gap-4 md:grid-cols-3">
											<div className="space-y-2">
												<Label>Name</Label>
												<Input
													{...form.register(`team.members.${index}.name`)}
													placeholder="Full name"
												/>
											</div>
											<div className="space-y-2">
												<Label>Role</Label>
												<Input
													{...form.register(`team.members.${index}.role`)}
													placeholder="e.g., Head Cheese Maker"
												/>
											</div>
											<div className="space-y-2">
												<Label>Department (optional)</Label>
												<Input
													{...form.register(`team.members.${index}.department`)}
													placeholder="e.g., Production"
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label>Photo</Label>
											<MediaPicker
												type="image"
												value={form.watch(`team.members.${index}.image`) || null}
												onChange={(url) =>
													form.setValue(`team.members.${index}.image`, url || "")
												}
												placeholder="Select team member photo"
												galleryTitle="Select Photo"
											/>
										</div>

										<div className="space-y-2">
											<Label>Bio (optional)</Label>
											<Textarea
												{...form.register(`team.members.${index}.bio`)}
												placeholder="Brief biography..."
												rows={2}
											/>
										</div>

										<div className="grid gap-4 md:grid-cols-3">
											<div className="space-y-2">
												<Label className="flex items-center gap-2">
													<Mail className="h-4 w-4" />
													Email
												</Label>
												<Input
													{...form.register(`team.members.${index}.email`)}
													placeholder="email@example.com"
												/>
											</div>
											<div className="space-y-2">
												<Label className="flex items-center gap-2">
													<Phone className="h-4 w-4" />
													Phone
												</Label>
												<Input
													{...form.register(`team.members.${index}.phone`)}
													placeholder="+46 123 456 789"
												/>
											</div>
											<div className="space-y-2">
												<Label className="flex items-center gap-2">
													<Linkedin className="h-4 w-4" />
													LinkedIn
												</Label>
												<Input
													{...form.register(`team.members.${index}.linkedin`)}
													placeholder="https://linkedin.com/in/..."
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Stats Tab */}
				<TabsContent value="stats">
					<Card>
						<CardHeader>
							<CardTitle>Stats Section</CardTitle>
							<CardDescription>Display key numbers and statistics with images (e.g., number of cows, goats, liters per day)</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Background Color */}
							<div className="space-y-2">
								<Label>Background Color</Label>
								<div className="flex items-center gap-3">
									<input
										type="color"
										{...form.register("stats.backgroundColor")}
										className="h-10 w-20 cursor-pointer rounded border"
									/>
									<Input
										{...form.register("stats.backgroundColor")}
										placeholder="#ffffff"
										className="max-w-[150px]"
									/>
									<span className="text-sm text-muted-foreground">
										Choose or enter a hex color
									</span>
								</div>
							</div>

							{/* Stat Items */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base">Stat Items</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendStatItem({ image: "", value: "", label: "", description: "" })
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Stat
									</Button>
								</div>

								{statsFields.length === 0 && (
									<p className="text-center text-muted-foreground py-8">
										No stats added yet. Click &quot;Add Stat&quot; to get started.
									</p>
								)}

								<div className="grid gap-4 lg:grid-cols-2">
									{statsFields.map((field, index) => (
										<div
											key={field.id}
											className="rounded-lg border p-4 space-y-4"
										>
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">
													Stat {index + 1}
												</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeStatItem(index)}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>

											<div className="space-y-2">
												<Label>Image</Label>
												<MediaPicker
													type="image"
													value={form.watch(`stats.items.${index}.image`) || null}
													onChange={(url) =>
														form.setValue(`stats.items.${index}.image`, url || "")
													}
													placeholder="Select stat image (e.g., cow, goat, milk bottles)"
													galleryTitle="Select Stat Image"
												/>
											</div>

											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Value (Number)</Label>
													<Input
														{...form.register(`stats.items.${index}.value`)}
														placeholder="e.g., 87, 236, 4K+"
													/>
													<p className="text-xs text-muted-foreground">
														The large number to display
													</p>
												</div>
												<div className="space-y-2">
													<Label>Label</Label>
													<Input
														{...form.register(`stats.items.${index}.label`)}
														placeholder="e.g., Cows, Goats, Liters per day"
													/>
													<p className="text-xs text-muted-foreground">
														Text below the number
													</p>
												</div>
											</div>

											<div className="space-y-2">
												<Label>Description (optional)</Label>
												<Textarea
													{...form.register(`stats.items.${index}.description`)}
													placeholder="A brief description about this stat..."
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

				{/* Image Description Tab */}
				<TabsContent value="imageDescription">
					<Card>
						<CardHeader>
							<CardTitle>Image & Description Section</CardTitle>
							<CardDescription>
								Add image-description pairs with watermark backgrounds. Layout alternates automatically.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Background Color */}
							<div className="space-y-2 max-w-xs">
								<Label>Section Background Color</Label>
								<div className="flex gap-2">
									<Input
										{...form.register("imageDescription.backgroundColor")}
										placeholder="#f5f0e8"
									/>
									<input
										type="color"
										value={form.watch("imageDescription.backgroundColor") || "#f5f0e8"}
										onChange={(e) =>
											form.setValue("imageDescription.backgroundColor", e.target.value)
										}
										className="w-10 h-10 rounded border cursor-pointer"
									/>
								</div>
							</div>

							{/* Items */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label className="text-base font-semibold">Items</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendImageDescriptionItem({
												image: "",
												title: "",
												description: "",
												watermarkImage: "",
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Item
									</Button>
								</div>

								{imageDescriptionFields.length === 0 && (
									<p className="text-sm text-muted-foreground text-center py-8 border rounded-lg">
										No items yet. Click &quot;Add Item&quot; to create your first image-description pair.
									</p>
								)}

								<div className="space-y-6">
									{imageDescriptionFields.map((field, index) => (
										<div
											key={field.id}
											className="relative rounded-lg border p-6 space-y-4"
										>
											{/* Header with index and delete */}
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium text-muted-foreground">
													Item {index + 1} {index % 2 === 0 ? "(Image Left)" : "(Image Right)"}
												</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeImageDescriptionItem(index)}
													className="text-destructive hover:text-destructive"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>

											<div className="grid gap-4 md:grid-cols-2">
												{/* Main Image */}
												<div className="space-y-2">
													<Label>Main Image</Label>
													<MediaPicker
														type="image"
														value={form.watch(`imageDescription.items.${index}.image`) || null}
														onChange={(url) =>
															form.setValue(`imageDescription.items.${index}.image`, url || "")
														}
														placeholder="Select image"
														galleryTitle="Select Main Image"
													/>
												</div>

												{/* Watermark Image */}
												<div className="space-y-2">
													<Label>Watermark Image (Background)</Label>
													<MediaPicker
														type="image"
														value={form.watch(`imageDescription.items.${index}.watermarkImage`) || null}
														onChange={(url) =>
															form.setValue(`imageDescription.items.${index}.watermarkImage`, url || "")
														}
														placeholder="Select watermark image"
														galleryTitle="Select Watermark Image"
													/>
												</div>
											</div>

											{/* Title */}
											<div className="space-y-2">
												<Label>Title</Label>
												<Input
													{...form.register(`imageDescription.items.${index}.title`)}
													placeholder="e.g., Natural & Organic Products"
												/>
											</div>

											{/* Description */}
											<div className="space-y-2">
												<Label>Description</Label>
												<Textarea
													{...form.register(`imageDescription.items.${index}.description`)}
													placeholder="Enter description text..."
													rows={4}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Contact Tab */}
				<TabsContent value="contact">
					<Card>
						<CardHeader>
							<CardTitle>Contact Section</CardTitle>
							<CardDescription>Configure the contact section (content is pulled from Contact Us page)</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label>Section Title</Label>
									<Input
										{...form.register("contact.title")}
										placeholder="e.g., Get In Touch"
									/>
								</div>
								<div className="space-y-2">
									<Label>Section Subtitle</Label>
									<Input
										{...form.register("contact.subtitle")}
										placeholder="e.g., We'd love to hear from you"
									/>
								</div>
							</div>

							<div className="space-y-4">
								<Label className="text-base">Display Options</Label>
								<div className="grid gap-4 sm:grid-cols-3">
									<div className="flex items-center justify-between rounded-lg border p-4">
										<span className="font-medium">Show Contact Form</span>
										<Switch
											checked={form.watch("contact.showContactForm")}
											onCheckedChange={(checked) =>
												form.setValue("contact.showContactForm", checked)
											}
										/>
									</div>
									<div className="flex items-center justify-between rounded-lg border p-4">
										<span className="font-medium">Show Map</span>
										<Switch
											checked={form.watch("contact.showMap")}
											onCheckedChange={(checked) =>
												form.setValue("contact.showMap", checked)
											}
										/>
									</div>
									<div className="flex items-center justify-between rounded-lg border p-4">
										<span className="font-medium">Show Office Locations</span>
										<Switch
											checked={form.watch("contact.showOffices")}
											onCheckedChange={(checked) =>
												form.setValue("contact.showOffices", checked)
											}
										/>
									</div>
								</div>
							</div>

							<div className="rounded-lg bg-muted p-4">
								<p className="text-sm text-muted-foreground">
									<strong>Note:</strong> The contact information (phone, email, addresses, etc.) is pulled from your site settings and the Contact Us page.
									<a href="/dashboard/webbplats/kontakt" className="text-primary hover:underline ml-1">
										Edit Contact Page Settings
									</a>
								</p>
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
									Search engine optimization for the about page
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label>Meta Title</Label>
									<Input
										{...form.register("seo.title")}
										placeholder="About Us - Company Name"
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
									See how the about page appears in search results
								</CardDescription>
							</CardHeader>
							<CardContent>
								<SeoPreview
									data={{
										title: form.watch("seo.title") || "About Us - Company Name",
										description: form.watch("seo.description") || "Add a description",
										slug: "about-us",
										ogImage: form.watch("seo.ogImage") || null,
										siteName: "Company Name",
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
