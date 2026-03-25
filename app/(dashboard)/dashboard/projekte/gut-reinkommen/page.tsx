"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, ExternalLink, Plus, Trash2 } from "lucide-react";

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
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { useConfirmModal } from "@/components/ui/confirm-modal";

const formSchema = z.object({
	hero: z.object({
		backgroundImage: z.string().optional(),
		titleDe: z.string().optional(),
		titleEn: z.string().optional(),
		breadcrumb: z.string().optional(),
	}),
	content: z.object({
		titleDe: z.string().optional(),
		titleEn: z.string().optional(),
		bodyDe: z.string().optional(),
		bodyEn: z.string().optional(),
		image: z.string().optional(),
		blocks: z.array(z.object({
			headingDe: z.string().optional(),
			headingEn: z.string().optional(),
			bodyDe: z.string().optional(),
			bodyEn: z.string().optional(),
		})),
	}),
	gallery: z.object({
		titleDe: z.string().optional(),
		titleEn: z.string().optional(),
		subtitleDe: z.string().optional(),
		subtitleEn: z.string().optional(),
		images: z.array(
			z.object({
				url: z.string().min(1, "Image is required"),
				alt: z.string().optional(),
				caption: z.string().optional(),
			})
		),
	}),
	partners: z.object({
		headingDe: z.string().optional(),
		headingEn: z.string().optional(),
		logos: z.array(
			z.object({
				image: z.string().optional(),
				name: z.string().optional(),
				href: z.string().optional(),
			})
		),
	}),
});

type FormValues = z.infer<typeof formSchema>;

export default function GutReinkommenDashboardPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			hero: {
				backgroundImage: "",
				titleDe: "Gut Reinkommen",
				titleEn: "Successful Integration",
				breadcrumb: "Gut Reinkommen",
			},
			content: { titleDe: "", titleEn: "", bodyDe: "", bodyEn: "", image: "", blocks: [] },
			gallery: { titleDe: "", titleEn: "", subtitleDe: "", subtitleEn: "", images: [] },
			partners: { headingDe: "", headingEn: "", logos: [] },
		},
	});

	const { fields: blockFields, append: appendBlock, remove: removeBlock } =
		useFieldArray({ control: form.control, name: "content.blocks" });

	const { fields: imageFields, append: appendImage, remove: removeImage } =
		useFieldArray({ control: form.control, name: "gallery.images" });

	const { fields: logoFields, append: appendLogo, remove: removeLogo } =
		useFieldArray({ control: form.control, name: "partners.logos" });

	useEffect(() => {
		const fetchContent = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/gut-reinkommen-page");
				const data = await response.json();
				if (!response.ok) throw new Error(data.message || "Failed to fetch content");
				const content = data.data;
				form.reset({
					hero: {
						backgroundImage: content.hero?.backgroundImage || "",
						titleDe: content.hero?.titleDe || "Gut Reinkommen",
						titleEn: content.hero?.titleEn || "Successful Integration",
						breadcrumb: content.hero?.breadcrumb || "Gut Reinkommen",
					},
					content: {
						titleDe: content.content?.titleDe || "",
						titleEn: content.content?.titleEn || "",
						bodyDe: content.content?.bodyDe || "",
						bodyEn: content.content?.bodyEn || "",
						image: content.content?.image || "",
						blocks: content.content?.blocks || [],
					},
					gallery: {
						titleDe: content.gallery?.titleDe || "",
						titleEn: content.gallery?.titleEn || "",
						subtitleDe: content.gallery?.subtitleDe || "",
						subtitleEn: content.gallery?.subtitleEn || "",
						images: content.gallery?.images || [],
					},
					partners: {
						headingDe: content.partners?.headingDe || "",
						headingEn: content.partners?.headingEn || "",
						logos: content.partners?.logos || [],
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

	const onSubmit = async (values: FormValues) => {
		try {
			setSaving(true);
			const response = await fetch("/api/gut-reinkommen-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.message || "Failed to save content");
			toast.success("Gut Reinkommen page saved successfully");
		} catch (error) {
			console.error("Error saving content:", error);
			toast.error(error instanceof Error ? error.message : "Failed to save content");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <CMSPageSkeleton />;

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-medium tracking-tight">Gut Reinkommen</h1>
					<p className="text-muted-foreground">Manage the Successful Integration page content.</p>
				</div>
				<a
					href="/projekte/gut-reinkommen"
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
						<TabsList>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="content">Content</TabsTrigger>
							<TabsTrigger value="gallery">Gallery</TabsTrigger>
							<TabsTrigger value="partners">Partners</TabsTrigger>
						</TabsList>

						{/* ── Hero Tab ── */}
						<TabsContent value="hero" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Hero Section</CardTitle>
									<CardDescription>The banner at the top of the Gut Reinkommen page.</CardDescription>
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
												<FormDescription>Full-width background image for the hero banner.</FormDescription>
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
													<FormLabel>Title (German)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="Gut Reinkommen" />
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
													<FormLabel>Title (English)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="Successful Integration" />
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
													<Input {...field} value={field.value || ""} placeholder="Gut Reinkommen" />
												</FormControl>
												<FormDescription>Text shown after &quot;Home / Projekte /&quot;</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* ── Content Tab ── */}
						<TabsContent value="content" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Content Section</CardTitle>
									<CardDescription>
										Main content displayed on the left side, with latest press and contact on the right.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="content.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="Einleitung" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="content.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="Introduction" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="content.bodyDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Body (DE)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="<p>Inhalt hier eingeben...</p>"
															rows={14}
															className="font-mono text-sm"
														/>
													</FormControl>
													<FormDescription>
														Supports HTML tags: &lt;p&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="content.bodyEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Body (EN)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="<p>Write your content here...</p>"
															rows={14}
															className="font-mono text-sm"
														/>
													</FormControl>
													<FormDescription>
														Supports HTML tags: &lt;p&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name="content.image"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Content Image (optional)</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || null}
														onChange={(url) => field.onChange(url || "")}
														placeholder="Select content image"
														galleryTitle="Select Content Image"
													/>
												</FormControl>
												<FormDescription>
													Displayed on the right side of the content text.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Content Blocks */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Content Blocks</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => appendBlock({ headingDe: "", headingEn: "", bodyDe: "", bodyEn: "" })}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Block
										</Button>
									</CardTitle>
									<CardDescription>
										Additional Q&amp;A or info sections displayed below the intro content.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{blockFields.length === 0 ? (
										<div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
											No blocks yet. Click &quot;Add Block&quot; to get started.
										</div>
									) : (
										blockFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">Block {index + 1}</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={async () => {
																const confirmed = await confirm({
																	title: "Remove Block",
																	description: "Are you sure you want to remove this block?",
																	confirmText: "Remove",
																});
																if (confirmed) removeBlock(index);
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
															name={`content.blocks.${index}.headingDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Heading (DE)</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="Block-Überschrift..." />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`content.blocks.${index}.headingEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Heading (EN)</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="Block heading..." />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`content.blocks.${index}.bodyDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Body (DE)</FormLabel>
																	<FormControl>
																		<Textarea {...field} value={field.value || ""} placeholder="Absatzinhalt eingeben..." rows={5} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`content.blocks.${index}.bodyEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Body (EN)</FormLabel>
																	<FormControl>
																		<Textarea {...field} value={field.value || ""} placeholder="Write paragraph content..." rows={5} />
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

						{/* ── Gallery Tab ── */}
						<TabsContent value="gallery" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Gallery Section</CardTitle>
									<CardDescription>Image carousel displayed on the page.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="gallery.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="Unsere Galerie" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="gallery.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="Our Gallery" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="gallery.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (DE)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="Ein Einblick in unsere Arbeit..." />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="gallery.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (EN)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="A glimpse into our work..." />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Images</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => appendImage({ url: "", alt: "", caption: "" })}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Image
										</Button>
									</CardTitle>
									<CardDescription>
										Images appear in a 3-column carousel. Recommended aspect ratio: 4:3.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{imageFields.length === 0 ? (
										<div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
											No images yet. Click &quot;Add Image&quot; to get started.
										</div>
									) : (
										imageFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">Image {index + 1}</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={async () => {
																const confirmed = await confirm({
																	title: "Remove Image",
																	description: "Are you sure you want to remove this image?",
																	confirmText: "Remove",
																});
																if (confirmed) removeImage(index);
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
														name={`gallery.images.${index}.url`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Image</FormLabel>
																<FormControl>
																	<MediaPicker
																		type="image"
																		value={field.value || null}
																		onChange={(url) => field.onChange(url || "")}
																		placeholder="Select image"
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
															name={`gallery.images.${index}.alt`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Alt Text</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="Image description" />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`gallery.images.${index}.caption`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Caption (hover)</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="Short caption..." />
																	</FormControl>
																	<FormDescription>Shown on hover over the image.</FormDescription>
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

						{/* ── Partners Tab ── */}
						<TabsContent value="partners" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Partners Section</CardTitle>
									<CardDescription>
										Partner/sponsor logos that scroll automatically right to left.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="partners.headingDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Heading (DE)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="Unsere Partner" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="partners.headingEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Heading (EN)</FormLabel>
													<FormControl>
														<Input {...field} value={field.value || ""} placeholder="Our Partners" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Logos</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => appendLogo({ image: "", name: "", href: "" })}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Logo
										</Button>
									</CardTitle>
									<CardDescription>Logos scroll from right to left automatically.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{logoFields.length === 0 ? (
										<div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
											No logos yet. Click &quot;Add Logo&quot; to get started.
										</div>
									) : (
										logoFields.map((field, index) => (
											<Card key={field.id} className="border-dashed">
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<CardTitle className="text-base">Logo {index + 1}</CardTitle>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={async () => {
																const confirmed = await confirm({
																	title: "Remove Logo",
																	description: "Are you sure you want to remove this logo?",
																	confirmText: "Remove",
																});
																if (confirmed) removeLogo(index);
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
														name={`partners.logos.${index}.image`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Logo Image</FormLabel>
																<FormControl>
																	<MediaPicker
																		type="image"
																		value={field.value || null}
																		onChange={(url) => field.onChange(url || "")}
																		placeholder="Select logo"
																		galleryTitle="Select Partner Logo"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`partners.logos.${index}.name`}
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
															name={`partners.logos.${index}.href`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Link (optional)</FormLabel>
																	<FormControl>
																		<Input {...field} value={field.value || ""} placeholder="https://..." />
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
					</Tabs>

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
