"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
	Loader2,
	ExternalLink,
	Image as ImageIcon,
	CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";

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

const cardSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().max(500).optional(),
	descriptionEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

const cardsSchema = z.object({
	sectionTitleDe: z.string().max(200).optional(),
	sectionTitleEn: z.string().max(200).optional(),
	humanitaer: cardSchema.optional(),
	zavd: cardSchema.optional(),
});

const formSchema = z.object({
	hero: heroSchema,
	cards: cardsSchema,
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
	hero: {
		taglineDe: "Helfen Sie uns",
		taglineEn: "Help Us",
		titleDe: "Spenden",
		titleEn: "Donate",
		subtitleDe: "Unterstützen Sie die assyrischen Gemeinschaften in Deutschland und in den Krisengebieten des Nahen Ostens.",
		subtitleEn: "Support the Assyrian communities in Germany and in the crisis regions of the Middle East.",
		image: "/images/donate/Spenden-Syrien.jpg",
	},
	cards: {
		sectionTitleDe: "Spenden",
		sectionTitleEn: "Donate",
		humanitaer: {
			titleDe: "Humanitäres Konto",
			titleEn: "Humanitarian Account",
			descriptionDe: "Humanitäres Konto für die im Krieg und Katastrophen in Not geratene Assyrier in ihren Heimatländern",
			descriptionEn: "Humanitarian account for Assyrians in need due to war and disasters in their home countries",
			image: "/images/donate/Spenden-Syrien.jpg",
		},
		zavd: {
			titleDe: "ZAVD Spendenkonto",
			titleEn: "ZAVD Donation Account",
			descriptionDe: "Unterstützen Sie die Arbeit des ZAVD für Flüchtlinge und Migranten in Deutschland und Europa",
			descriptionEn: "Support the work of ZAVD for refugees and migrants in Germany and Europe",
			image: "/images/donate/Association1.jpg",
		},
	},
};

export default function SpendenAdminPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/spenden-page");
				if (res.ok) {
					const data = await res.json();
					form.reset({
						hero: { ...defaultValues.hero, ...data.hero },
						cards: {
							...defaultValues.cards,
							...data.cards,
							humanitaer: { ...defaultValues.cards.humanitaer, ...data.cards?.humanitaer },
							zavd: { ...defaultValues.cards.zavd, ...data.cards?.zavd },
						},
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
			const res = await fetch("/api/spenden-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const responseData = await res.json();
			if (res.ok) {
				toast.success("Spenden page saved successfully");
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
					<h1 className="text-3xl font-medium tracking-tight">Spenden</h1>
					<p className="text-muted-foreground">
						Manage the Spenden page content in German and English.
					</p>
				</div>
				<a
					href="/spenden"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<form id="spenden-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Tabs defaultValue="hero" className="space-y-6">
					<TabsList className="flex-wrap h-auto justify-start">
						<TabsTrigger value="hero" className="gap-2">
							<ImageIcon className="h-4 w-4" />
							Hero
						</TabsTrigger>
						<TabsTrigger value="cards" className="gap-2">
							<CreditCard className="h-4 w-4" />
							Cards
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
										<Input {...form.register("hero.taglineDe")} value={form.watch("hero.taglineDe") || ""} placeholder="Helfen Sie uns" />
									</div>
									<div className="space-y-2">
										<Label>Tagline (EN)</Label>
										<Input {...form.register("hero.taglineEn")} value={form.watch("hero.taglineEn") || ""} placeholder="Help Us" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Title (DE)</Label>
										<Input {...form.register("hero.titleDe")} value={form.watch("hero.titleDe") || ""} placeholder="Spenden" />
									</div>
									<div className="space-y-2">
										<Label>Title (EN)</Label>
										<Input {...form.register("hero.titleEn")} value={form.watch("hero.titleEn") || ""} placeholder="Donate" />
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

					{/* ── CARDS TAB ── */}
					<TabsContent value="cards">
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Section Title</CardTitle>
									<CardDescription>The heading displayed above the donation cards.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Section Title (DE)</Label>
											<Input {...form.register("cards.sectionTitleDe")} value={form.watch("cards.sectionTitleDe") || ""} placeholder="Spenden" />
										</div>
										<div className="space-y-2">
											<Label>Section Title (EN)</Label>
											<Input {...form.register("cards.sectionTitleEn")} value={form.watch("cards.sectionTitleEn") || ""} placeholder="Donate" />
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Card 1 — Humanitäres Konto</CardTitle>
									<CardDescription>The card linking to the humanitarian aid donation page.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Title (DE)</Label>
											<Input {...form.register("cards.humanitaer.titleDe")} value={form.watch("cards.humanitaer.titleDe") || ""} placeholder="Humanitäres Konto" />
										</div>
										<div className="space-y-2">
											<Label>Title (EN)</Label>
											<Input {...form.register("cards.humanitaer.titleEn")} value={form.watch("cards.humanitaer.titleEn") || ""} placeholder="Humanitarian Account" />
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Description (DE)</Label>
											<Textarea {...form.register("cards.humanitaer.descriptionDe")} value={form.watch("cards.humanitaer.descriptionDe") || ""} rows={3} />
										</div>
										<div className="space-y-2">
											<Label>Description (EN)</Label>
											<Textarea {...form.register("cards.humanitaer.descriptionEn")} value={form.watch("cards.humanitaer.descriptionEn") || ""} rows={3} />
										</div>
									</div>
									<div className="space-y-2">
										<Label>Card Image</Label>
										<MediaPicker
											type="image"
											value={form.watch("cards.humanitaer.image") || null}
											onChange={(url) => form.setValue("cards.humanitaer.image", url || "")}
											placeholder="Select card image"
											galleryTitle="Select Card Image"
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Card 2 — ZAVD Spendenkonto</CardTitle>
									<CardDescription>The card linking to the ZAVD donation account page.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Title (DE)</Label>
											<Input {...form.register("cards.zavd.titleDe")} value={form.watch("cards.zavd.titleDe") || ""} placeholder="ZAVD Spendenkonto" />
										</div>
										<div className="space-y-2">
											<Label>Title (EN)</Label>
											<Input {...form.register("cards.zavd.titleEn")} value={form.watch("cards.zavd.titleEn") || ""} placeholder="ZAVD Donation Account" />
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Description (DE)</Label>
											<Textarea {...form.register("cards.zavd.descriptionDe")} value={form.watch("cards.zavd.descriptionDe") || ""} rows={3} />
										</div>
										<div className="space-y-2">
											<Label>Description (EN)</Label>
											<Textarea {...form.register("cards.zavd.descriptionEn")} value={form.watch("cards.zavd.descriptionEn") || ""} rows={3} />
										</div>
									</div>
									<div className="space-y-2">
										<Label>Card Image</Label>
										<MediaPicker
											type="image"
											value={form.watch("cards.zavd.image") || null}
											onChange={(url) => form.setValue("cards.zavd.image", url || "")}
											placeholder="Select card image"
											galleryTitle="Select Card Image"
										/>
									</div>
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
		</div>
	);
}
