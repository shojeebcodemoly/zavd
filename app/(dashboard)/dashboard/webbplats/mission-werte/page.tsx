"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
	ExternalLink,
	GripVertical,
	Image as ImageIcon,
	AlignLeft,
	Star,
} from "lucide-react";
import { toast } from "sonner";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";
import { useConfirmModal } from "@/components/ui/confirm-modal";

// ============================================================================
// LOCAL ZOD SCHEMAS
// ============================================================================
const heroSchema = z.object({
	taglineDe: z.string().max(200).optional(),
	taglineEn: z.string().max(200).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

const introSchema = z.object({
	taglineDe: z.string().max(200).optional(),
	taglineEn: z.string().max(200).optional(),
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	paragraphDe: z.string().optional(),
	paragraphEn: z.string().optional(),
});

const valueSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	image: z.string().optional(),
});

const formSchema = z.object({
	hero: heroSchema,
	intro: introSchema,
	values: z.array(valueSchema),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
	hero: {
		taglineDe: "Unsere Grundwerte",
		taglineEn: "Our Core Values",
		titleDe: "Mission & Werte",
		titleEn: "Mission & Values",
		subtitleDe: "Was uns antreibt und wie wir handeln.",
		subtitleEn: "What drives us and how we act.",
		image: "/images/about/aboutbanner.jpg",
	},
	intro: {
		taglineDe: "",
		taglineEn: "",
		headingDe: "Unsere Mission",
		headingEn: "Our Mission",
		paragraphDe: "",
		paragraphEn: "",
	},
	values: [],
};

export default function MissionWerteAdminPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const valuesArray = useFieldArray({ control: form.control, name: "values" });

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/mission-werte-page");
				if (res.ok) {
					const data = await res.json();
					form.reset({
						hero: { ...defaultValues.hero, ...data.hero },
						intro: { ...defaultValues.intro, ...data.intro },
						values: data.values || [],
					});
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Failed to fetch page data");
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, [form]);

	function formatValidationErrors(details: unknown): string {
		if (!details || typeof details !== "object") return "";
		const flattenedError = details as {
			fieldErrors?: Record<string, string[]>;
			formErrors?: string[];
		};
		const errors: string[] = [];
		if (flattenedError.formErrors?.length) errors.push(...flattenedError.formErrors);
		if (flattenedError.fieldErrors) {
			for (const [field, messages] of Object.entries(flattenedError.fieldErrors)) {
				if (messages?.length) errors.push(`${field}: ${messages.join(", ")}`);
			}
		}
		return errors.length > 0 ? errors.join("; ") : "";
	}

	const onSubmit = async (data: FormData) => {
		setIsSaving(true);
		try {
			const res = await fetch("/api/mission-werte-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const responseData = await res.json();
			if (res.ok) {
				toast.success("Mission & Values page saved successfully");
			} else {
				const errorMessage = responseData.error || "Failed to save changes";
				const details = responseData.details
					? `: ${formatValidationErrors(responseData.details)}`
					: "";
				throw new Error(`${errorMessage}${details}`);
			}
		} catch (error) {
			console.error("Error saving:", error);
			toast.error(error instanceof Error ? error.message : "Failed to save changes");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) return <CMSPageSkeleton />;

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-medium tracking-tight">Mission &amp; Values</h1>
					<p className="text-muted-foreground">
						Manage the Mission &amp; Values page content in German and English.
					</p>
				</div>
				<a
					href="/uber-zavd/mission-werte"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<form id="mission-werte-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Tabs defaultValue="hero" className="space-y-6">
					<TabsList className="flex-wrap h-auto justify-start">
						<TabsTrigger value="hero" className="gap-2">
							<ImageIcon className="h-4 w-4" />
							Hero
						</TabsTrigger>
						<TabsTrigger value="intro" className="gap-2">
							<AlignLeft className="h-4 w-4" />
							Intro
						</TabsTrigger>
						<TabsTrigger value="values" className="gap-2">
							<Star className="h-4 w-4" />
							Values
						</TabsTrigger>
					</TabsList>

					{/* ── HERO TAB ── */}
					<TabsContent value="hero">
						<Card>
							<CardHeader>
								<CardTitle>Hero Section</CardTitle>
								<CardDescription>Banner image and title displayed at the top of the page.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Tagline (DE)</Label>
										<Input {...form.register("hero.taglineDe")} value={form.watch("hero.taglineDe") || ""} placeholder="Unsere Grundwerte" />
									</div>
									<div className="space-y-2">
										<Label>Tagline (EN)</Label>
										<Input {...form.register("hero.taglineEn")} value={form.watch("hero.taglineEn") || ""} placeholder="Our Core Values" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Title (DE)</Label>
										<Input {...form.register("hero.titleDe")} value={form.watch("hero.titleDe") || ""} placeholder="Mission & Werte" />
									</div>
									<div className="space-y-2">
										<Label>Title (EN)</Label>
										<Input {...form.register("hero.titleEn")} value={form.watch("hero.titleEn") || ""} placeholder="Mission & Values" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Subtitle (DE)</Label>
										<Textarea {...form.register("hero.subtitleDe")} value={form.watch("hero.subtitleDe") || ""} rows={3} />
									</div>
									<div className="space-y-2">
										<Label>Subtitle (EN)</Label>
										<Textarea {...form.register("hero.subtitleEn")} value={form.watch("hero.subtitleEn") || ""} rows={3} />
									</div>
								</div>
								<div className="space-y-2">
									<Label>Banner Image</Label>
									<MediaPicker
										type="image"
										value={form.watch("hero.image") || null}
										onChange={(url) => form.setValue("hero.image", url || "")}
										placeholder="Select hero banner image"
										galleryTitle="Select Hero Banner"
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ── INTRO TAB ── */}
					<TabsContent value="intro">
						<Card>
							<CardHeader>
								<CardTitle>Intro Section</CardTitle>
								<CardDescription>Mission statement heading and introductory text.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Tagline (DE)</Label>
										<Input {...form.register("intro.taglineDe")} value={form.watch("intro.taglineDe") || ""} placeholder="optional" />
									</div>
									<div className="space-y-2">
										<Label>Tagline (EN)</Label>
										<Input {...form.register("intro.taglineEn")} value={form.watch("intro.taglineEn") || ""} placeholder="optional" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input {...form.register("intro.headingDe")} value={form.watch("intro.headingDe") || ""} placeholder="Unsere Mission" />
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input {...form.register("intro.headingEn")} value={form.watch("intro.headingEn") || ""} placeholder="Our Mission" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Paragraph (DE)</Label>
										<Textarea {...form.register("intro.paragraphDe")} value={form.watch("intro.paragraphDe") || ""} rows={6} />
									</div>
									<div className="space-y-2">
										<Label>Paragraph (EN)</Label>
										<Textarea {...form.register("intro.paragraphEn")} value={form.watch("intro.paragraphEn") || ""} rows={6} />
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ── VALUES TAB ── */}
					<TabsContent value="values">
						<Card>
							<CardHeader>
								<CardTitle>Values</CardTitle>
								<CardDescription>
									Each value card has a title, description, and optional image. Displayed in a grid on the page.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{valuesArray.fields.map((field, index) => (
									<div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
										<div className="flex items-center text-muted-foreground pt-2">
											<GripVertical className="h-5 w-5" />
										</div>
										<div className="flex-1 space-y-4">
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Title (DE)</Label>
													<Input {...form.register(`values.${index}.titleDe`)} value={form.watch(`values.${index}.titleDe`) || ""} placeholder="Gemeinschaft" />
												</div>
												<div className="space-y-2">
													<Label>Title (EN)</Label>
													<Input {...form.register(`values.${index}.titleEn`)} value={form.watch(`values.${index}.titleEn`) || ""} placeholder="Community" />
												</div>
											</div>
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Description (DE)</Label>
													<Textarea {...form.register(`values.${index}.descriptionDe`)} value={form.watch(`values.${index}.descriptionDe`) || ""} rows={4} />
												</div>
												<div className="space-y-2">
													<Label>Description (EN)</Label>
													<Textarea {...form.register(`values.${index}.descriptionEn`)} value={form.watch(`values.${index}.descriptionEn`) || ""} rows={4} />
												</div>
											</div>
											<div className="space-y-2">
												<Label>Image (optional)</Label>
												<MediaPicker
													type="image"
													value={form.watch(`values.${index}.image`) || null}
													onChange={(url) => form.setValue(`values.${index}.image`, url || "")}
													placeholder="Select value image"
													galleryTitle="Select Value Image"
												/>
											</div>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={async () => {
												const confirmed = await confirm({ title: "Remove Value", description: "Remove this value item?", confirmText: "Remove" });
												if (confirmed) valuesArray.remove(index);
											}}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									onClick={() => valuesArray.append({ titleDe: "", titleEn: "", descriptionDe: "", descriptionEn: "", image: "" })}
								>
									<Plus className="mr-2 h-4 w-4" />
									Add Value
								</Button>
							</CardContent>
						</Card>
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
