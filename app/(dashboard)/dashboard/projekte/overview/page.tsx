"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, ExternalLink, Plus, Trash2, X } from "lucide-react";

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

const formSchema = z.object({
	hero: z.object({
		backgroundImage: z.string().optional(),
		titleDe: z.string().optional(),
		titleEn: z.string().optional(),
		subtitle: z.string().optional(),
	}),
	intro: z.object({
		badge: z.string().optional(),
		headingBold: z.string().optional(),
		headingLight: z.string().optional(),
		description: z.string().optional(),
		ctaText: z.string().optional(),
		ctaHref: z.string().optional(),
		images: z.array(z.object({ url: z.string(), alt: z.string().optional() })),
	}),
	projects: z.object({
		badge: z.string().optional(),
		heading: z.string().optional(),
		description: z.string().optional(),
		categories: z.array(z.string()),
		items: z.array(
			z.object({
				image: z.string().optional(),
				title: z.string().optional(),
				description: z.string().optional(),
				category: z.string().optional(),
				href: z.string().optional(),
			})
		),
	}),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProjekteOverviewDashboardPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [newCategory, setNewCategory] = useState("");

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			hero: { backgroundImage: "", titleDe: "Projekte", titleEn: "Projects", subtitle: "" },
			intro: {
				badge: "", headingBold: "Our Work.", headingLight: "Your Vision Realized.",
				description: "", ctaText: "Our Projects", ctaHref: "/projekte", images: [],
			},
			projects: {
				badge: "", heading: "Discover Our Completed Projects",
				description: "", categories: [], items: [],
			},
		},
	});

	const { fields: introImages, append: appendIntroImage, remove: removeIntroImage } = useFieldArray({
		control: form.control, name: "intro.images",
	});

	const { fields: projectItems, append: appendProject, remove: removeProject } = useFieldArray({
		control: form.control, name: "projects.items",
	});

	const categories = form.watch("projects.categories");

	useEffect(() => {
		const fetchPage = async () => {
			try {
				const res = await fetch("/api/projekte-page");
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || "Failed to fetch");
				const page = data.data;

				form.reset({
					hero: {
						backgroundImage: page.hero?.backgroundImage || "",
						titleDe: page.hero?.titleDe || "Projekte",
						titleEn: page.hero?.titleEn || "Projects",
						subtitle: page.hero?.subtitle || "",
					},
					intro: {
						badge: page.intro?.badge || "",
						headingBold: page.intro?.headingBold || "Our Work.",
						headingLight: page.intro?.headingLight || "Your Vision Realized.",
						description: page.intro?.description || "",
						ctaText: page.intro?.ctaText || "Our Projects",
						ctaHref: page.intro?.ctaHref || "/projekte",
						images: page.intro?.images || [],
					},
					projects: {
						badge: page.projects?.badge || "",
						heading: page.projects?.heading || "Discover Our Completed Projects",
						description: page.projects?.description || "",
						categories: page.projects?.categories || [],
						items: page.projects?.items || [],
					},
				});
			} catch (error) {
				console.error(error);
				toast.error("Failed to load page data");
			} finally {
				setLoading(false);
			}
		};
		fetchPage();
	}, [form]);

	const addCategory = () => {
		const val = newCategory.trim();
		if (!val) return;
		const current = form.getValues("projects.categories");
		if (!current.includes(val)) {
			form.setValue("projects.categories", [...current, val]);
		}
		setNewCategory("");
	};

	const removeCategory = (index: number) => {
		const current = form.getValues("projects.categories");
		form.setValue("projects.categories", current.filter((_, i) => i !== index));
	};

	const onSubmit = async (values: FormValues) => {
		try {
			setSaving(true);
			const res = await fetch("/api/projekte-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to save");
			toast.success("Projekte page saved successfully");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to save");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <CMSPageSkeleton />;

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">Projekte Overview</h1>
					<p className="text-slate-500 mt-1">Edit the main Projekte listing page.</p>
				</div>
				<a
					href="/projekte"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors"
				>
					<ExternalLink className="w-4 h-4" />
					View page
				</a>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<Tabs defaultValue="hero">
						<TabsList>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="intro">Intro Section</TabsTrigger>
							<TabsTrigger value="projects">Projects Grid</TabsTrigger>
						</TabsList>

						{/* ── Hero ── */}
						<TabsContent value="hero" className="mt-4">
							<Card>
								<CardHeader>
									<CardTitle>Hero Section</CardTitle>
									<CardDescription>Background image and title at the top of the Projekte page.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-5">
									<FormField control={form.control} name="hero.backgroundImage"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Background Image</FormLabel>
												<FormControl>
													<MediaPicker type="image" value={field.value || ""} onChange={(url) => field.onChange(url ?? "")} placeholder="Select background image..." />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField control={form.control} name="hero.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (German)</FormLabel>
													<FormControl><Input placeholder="Projekte" {...field} /></FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField control={form.control} name="hero.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (English)</FormLabel>
													<FormControl><Input placeholder="Projects" {...field} /></FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField control={form.control} name="hero.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl><Input placeholder="Short tagline..." {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* ── Intro ── */}
						<TabsContent value="intro" className="mt-4 space-y-5">
							<Card>
								<CardHeader>
									<CardTitle>Text Content</CardTitle>
									<CardDescription>Left-side text of the intro section.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField control={form.control} name="intro.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge / Label</FormLabel>
												<FormControl><Input placeholder="e.g. Home / Project" {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField control={form.control} name="intro.headingBold"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Heading (Bold)</FormLabel>
													<FormControl><Input placeholder="Our Work." {...field} /></FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField control={form.control} name="intro.headingLight"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Heading (Light)</FormLabel>
													<FormControl><Input placeholder="Your Vision Realized." {...field} /></FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField control={form.control} name="intro.description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl><Input placeholder="Short paragraph text..." {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField control={form.control} name="intro.ctaText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Button Text</FormLabel>
													<FormControl><Input placeholder="Our Service" {...field} /></FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField control={form.control} name="intro.ctaHref"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Button Link</FormLabel>
													<FormControl><Input placeholder="/kontakt" {...field} /></FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Images</CardTitle>
									<CardDescription>1st = large top, 2nd &amp; 3rd = small bottom row. Max 3.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{introImages.map((field, index) => (
										<div key={field.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium text-slate-700">
													{index === 0 ? "Image 1 (Large)" : `Image ${index + 1} (Small)`}
												</span>
												<Button type="button" variant="ghost" size="sm" onClick={() => removeIntroImage(index)} className="text-destructive hover:text-destructive">
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
											<FormField control={form.control} name={`intro.images.${index}.url`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Image</FormLabel>
														<FormControl>
															<MediaPicker type="image" value={field.value || ""} onChange={(url) => field.onChange(url ?? "")} placeholder="Select image..." />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField control={form.control} name={`intro.images.${index}.alt`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Alt Text</FormLabel>
														<FormControl><Input placeholder="Image description..." {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									))}
									{introImages.length < 3 && (
										<Button type="button" variant="outline" size="sm" onClick={() => appendIntroImage({ url: "", alt: "" })}>
											<Plus className="w-4 h-4 mr-2" />Add Image
										</Button>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* ── Projects Grid ── */}
						<TabsContent value="projects" className="mt-4 space-y-5">
							{/* Section header fields */}
							<Card>
								<CardHeader>
									<CardTitle>Section Header</CardTitle>
									<CardDescription>Badge, heading and description at the top of the grid section.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField control={form.control} name="projects.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge</FormLabel>
												<FormControl><Input placeholder="Top of Projects" {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField control={form.control} name="projects.heading"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Heading</FormLabel>
												<FormControl><Input placeholder="Discover Our Completed Projects" {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField control={form.control} name="projects.description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl><Input placeholder="Right-side description text..." {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							{/* Categories */}
							<Card>
								<CardHeader>
									<CardTitle>Filter Categories</CardTitle>
									<CardDescription>Categories shown as filter buttons (e.g. Building, Commercial, Energy).</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex gap-2">
										<Input
											value={newCategory}
											onChange={(e) => setNewCategory(e.target.value)}
											placeholder="Add category..."
											onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }}
										/>
										<Button type="button" variant="outline" onClick={addCategory}>
											<Plus className="w-4 h-4" />
										</Button>
									</div>
									{categories.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{categories.map((cat, i) => (
												<span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700">
													{cat}
													<button type="button" onClick={() => removeCategory(i)} className="text-slate-400 hover:text-slate-700">
														<X className="w-3 h-3" />
													</button>
												</span>
											))}
										</div>
									)}
								</CardContent>
							</Card>

							{/* Project items */}
							<Card>
								<CardHeader>
									<CardTitle>Project Cards</CardTitle>
									<CardDescription>Each card displayed in the 3-column grid.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{projectItems.map((field, index) => (
										<div key={field.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
											<div className="flex items-center justify-between">
												<span className="text-sm font-semibold text-slate-700">Project {index + 1}</span>
												<Button type="button" variant="ghost" size="sm" onClick={() => removeProject(index)} className="text-destructive hover:text-destructive">
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
											<FormField control={form.control} name={`projects.items.${index}.image`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Image</FormLabel>
														<FormControl>
															<MediaPicker type="image" value={field.value || ""} onChange={(url) => field.onChange(url ?? "")} placeholder="Select project image..." />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												<FormField control={form.control} name={`projects.items.${index}.title`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Title</FormLabel>
															<FormControl><Input placeholder="Project title..." {...field} /></FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField control={form.control} name={`projects.items.${index}.category`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Category</FormLabel>
															<FormControl><Input placeholder="e.g. Building" {...field} /></FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											<FormField control={form.control} name={`projects.items.${index}.description`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Description</FormLabel>
														<FormControl><Input placeholder="Short description..." {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField control={form.control} name={`projects.items.${index}.href`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Link (optional)</FormLabel>
														<FormControl><Input placeholder="/projekte/project-name" {...field} /></FormControl>
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
										onClick={() => appendProject({ image: "", title: "", description: "", category: "", href: "" })}
									>
										<Plus className="w-4 h-4 mr-2" />Add Project
									</Button>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>

					<div className="flex justify-end">
						<Button type="submit" disabled={saving}>
							{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Save Changes
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
