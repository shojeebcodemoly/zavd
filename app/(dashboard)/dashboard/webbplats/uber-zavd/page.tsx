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
	Users,
	MapPin,
	Building2,
	FileText,
	Megaphone,
} from "lucide-react";
import { toast } from "sonner";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";
import { useConfirmModal } from "@/components/ui/confirm-modal";

// ============================================================================
// LOCAL ZOD SCHEMAS
// ============================================================================
const heroSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	image: z.string().optional(),
});

const introSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
});

const addressSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	name: z.string().max(200).optional(),
	line1: z.string().max(200).optional(),
	line2: z.string().max(200).optional(),
	line3: z.string().max(200).optional(),
	phone: z.string().max(100).optional(),
	email: z.string().max(200).optional(),
});

const structureSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
	paragraph3De: z.string().optional(),
	paragraph3En: z.string().optional(),
});

const teamSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	subtextDe: z.string().optional(),
	subtextEn: z.string().optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
	image: z.string().optional(),
});

const timelineItemSchema = z.object({
	year: z.string().max(20).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	image: z.string().optional(),
});

const officeSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	items: z.array(timelineItemSchema).optional(),
});

const galleryItemSchema = z.object({
	image: z.string().optional(),
	captionDe: z.string().max(300).optional(),
	captionEn: z.string().max(300).optional(),
});

const gallerySchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	items: z.array(galleryItemSchema).optional(),
});

const ctaSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	textDe: z.string().optional(),
	textEn: z.string().optional(),
	buttonDe: z.string().max(100).optional(),
	buttonEn: z.string().max(100).optional(),
});

const formSchema = z.object({
	hero: heroSchema,
	intro: introSchema,
	address: addressSchema,
	structure: structureSchema,
	team: teamSchema,
	office: officeSchema,
	gallery: gallerySchema,
	cta: ctaSchema,
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
	hero: {
		titleDe: "Über ZAVD",
		titleEn: "About ZAVD",
		subtitleDe: "Zentralverband Arabischer und Deutsch-Arabischer Vereine in Deutschland e.V.",
		subtitleEn: "Central Association of Arab and German-Arab Associations in Germany",
		image: "/images/about/aboutbanner.jpg",
	},
	intro: {
		headingDe: "Über uns",
		headingEn: "About Us",
		paragraph1De: "",
		paragraph1En: "",
		paragraph2De: "",
		paragraph2En: "",
	},
	address: {
		headingDe: "Anschrift",
		headingEn: "Address",
		name: "ZAVD e.V.",
		line1: "",
		line2: "",
		line3: "",
		phone: "",
		email: "",
	},
	structure: {
		headingDe: "Was macht unseren Verband besonders?",
		headingEn: "What is special about our association?",
		paragraph1De: "",
		paragraph1En: "",
		paragraph2De: "",
		paragraph2En: "",
		paragraph3De: "",
		paragraph3En: "",
	},
	team: {
		headingDe: "Unser Team",
		headingEn: "Our Team",
		subtextDe: "",
		subtextEn: "",
		paragraph1De: "",
		paragraph1En: "",
		paragraph2De: "",
		paragraph2En: "",
		image: "/images/about/zavd-team.jpg",
	},
	office: {
		headingDe: "Unsere Büros & Aktivitäten",
		headingEn: "Our Offices & Activities",
		items: [],
	},
	gallery: {
		headingDe: "Aus unserem Alltag",
		headingEn: "From Our Daily Life",
		items: [],
	},
	cta: {
		headingDe: "Werden Sie Mitglied",
		headingEn: "Become a Member",
		textDe: "",
		textEn: "",
		buttonDe: "Kontakt aufnehmen",
		buttonEn: "Get in touch",
	},
};

export default function UberZavdAdminPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const officeItems = useFieldArray({
		control: form.control,
		name: "office.items",
	});

	const galleryItems = useFieldArray({
		control: form.control,
		name: "gallery.items",
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/uber-zavd-page");
				if (res.ok) {
					const data = await res.json();
					form.reset({
						hero: { ...defaultValues.hero, ...data.hero },
						intro: { ...defaultValues.intro, ...data.intro },
						address: { ...defaultValues.address, ...data.address },
						structure: { ...defaultValues.structure, ...data.structure },
						team: { ...defaultValues.team, ...data.team },
						office: {
							...defaultValues.office,
							...data.office,
							items: data.office?.items || [],
						},
						gallery: {
							...defaultValues.gallery,
							...data.gallery,
							items: data.gallery?.items || [],
						},
						cta: { ...defaultValues.cta, ...data.cta },
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
			const res = await fetch("/api/uber-zavd-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const responseData = await res.json();

			if (res.ok) {
				toast.success("Über ZAVD page saved successfully");
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

	if (isLoading) {
		return <CMSPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-medium tracking-tight">Über ZAVD</h1>
					<p className="text-muted-foreground">
						Manage the About ZAVD page content in German and English.
					</p>
				</div>
				<a
					href="/uber-zavd"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<form id="uber-zavd-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Tabs defaultValue="hero" className="space-y-6">
					<TabsList className="flex-wrap h-auto justify-start">
						<TabsTrigger value="hero" className="gap-2">
							<ImageIcon className="h-4 w-4" />
							Hero
						</TabsTrigger>
						<TabsTrigger value="intro" className="gap-2">
							<FileText className="h-4 w-4" />
							Intro & Address
						</TabsTrigger>
						<TabsTrigger value="structure" className="gap-2">
							<Building2 className="h-4 w-4" />
							Structure
						</TabsTrigger>
						<TabsTrigger value="team" className="gap-2">
							<Users className="h-4 w-4" />
							Team
						</TabsTrigger>
						<TabsTrigger value="office" className="gap-2">
							<MapPin className="h-4 w-4" />
							Office Timeline
						</TabsTrigger>
						<TabsTrigger value="gallery" className="gap-2">
							<ImageIcon className="h-4 w-4" />
							Gallery
						</TabsTrigger>
						<TabsTrigger value="cta" className="gap-2">
							<Megaphone className="h-4 w-4" />
							CTA
						</TabsTrigger>
					</TabsList>

					{/* ============================================================ */}
					{/* HERO TAB */}
					{/* ============================================================ */}
					<TabsContent value="hero">
						<Card>
							<CardHeader>
								<CardTitle>Hero Section</CardTitle>
								<CardDescription>
									Banner image and title displayed at the top of the page.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Title (DE)</Label>
										<Input
											{...form.register("hero.titleDe")}
											value={form.watch("hero.titleDe") || ""}
											placeholder="Über ZAVD"
										/>
									</div>
									<div className="space-y-2">
										<Label>Title (EN)</Label>
										<Input
											{...form.register("hero.titleEn")}
											value={form.watch("hero.titleEn") || ""}
											placeholder="About ZAVD"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Subtitle (DE)</Label>
										<Textarea
											{...form.register("hero.subtitleDe")}
											value={form.watch("hero.subtitleDe") || ""}
											placeholder="Zentralverband Arabischer..."
											rows={3}
										/>
									</div>
									<div className="space-y-2">
										<Label>Subtitle (EN)</Label>
										<Textarea
											{...form.register("hero.subtitleEn")}
											value={form.watch("hero.subtitleEn") || ""}
											placeholder="Central Association of Arab..."
											rows={3}
										/>
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

					{/* ============================================================ */}
					{/* INTRO & ADDRESS TAB */}
					{/* ============================================================ */}
					<TabsContent value="intro" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Intro Section</CardTitle>
								<CardDescription>
									"About Us" heading and introductory paragraphs.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input
											{...form.register("intro.headingDe")}
											value={form.watch("intro.headingDe") || ""}
											placeholder="Über uns"
										/>
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input
											{...form.register("intro.headingEn")}
											value={form.watch("intro.headingEn") || ""}
											placeholder="About Us"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Paragraph 1 (DE)</Label>
										<Textarea
											{...form.register("intro.paragraph1De")}
											value={form.watch("intro.paragraph1De") || ""}
											rows={5}
										/>
									</div>
									<div className="space-y-2">
										<Label>Paragraph 1 (EN)</Label>
										<Textarea
											{...form.register("intro.paragraph1En")}
											value={form.watch("intro.paragraph1En") || ""}
											rows={5}
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Paragraph 2 (DE)</Label>
										<Textarea
											{...form.register("intro.paragraph2De")}
											value={form.watch("intro.paragraph2De") || ""}
											rows={5}
										/>
									</div>
									<div className="space-y-2">
										<Label>Paragraph 2 (EN)</Label>
										<Textarea
											{...form.register("intro.paragraph2En")}
											value={form.watch("intro.paragraph2En") || ""}
											rows={5}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Address Section</CardTitle>
								<CardDescription>
									Organisation address, phone, and email.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Section Heading (DE)</Label>
										<Input
											{...form.register("address.headingDe")}
											value={form.watch("address.headingDe") || ""}
											placeholder="Anschrift"
										/>
									</div>
									<div className="space-y-2">
										<Label>Section Heading (EN)</Label>
										<Input
											{...form.register("address.headingEn")}
											value={form.watch("address.headingEn") || ""}
											placeholder="Address"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label>Organisation Name</Label>
									<Input
										{...form.register("address.name")}
										value={form.watch("address.name") || ""}
										placeholder="ZAVD e.V."
									/>
								</div>
								<div className="space-y-2">
									<Label>Address Line 1</Label>
									<Input
										{...form.register("address.line1")}
										value={form.watch("address.line1") || ""}
										placeholder="Musterstraße 1"
									/>
								</div>
								<div className="space-y-2">
									<Label>Address Line 2</Label>
									<Input
										{...form.register("address.line2")}
										value={form.watch("address.line2") || ""}
										placeholder="12345 Berlin"
									/>
								</div>
								<div className="space-y-2">
									<Label>Address Line 3</Label>
									<Input
										{...form.register("address.line3")}
										value={form.watch("address.line3") || ""}
										placeholder="Deutschland"
									/>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Phone</Label>
										<Input
											{...form.register("address.phone")}
											value={form.watch("address.phone") || ""}
											placeholder="+49 30 123456"
										/>
									</div>
									<div className="space-y-2">
										<Label>Email</Label>
										<Input
											{...form.register("address.email")}
											value={form.watch("address.email") || ""}
											placeholder="info@zavd.de"
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ============================================================ */}
					{/* STRUCTURE TAB */}
					{/* ============================================================ */}
					<TabsContent value="structure">
						<Card>
							<CardHeader>
								<CardTitle>Structure Section</CardTitle>
								<CardDescription>
									"What makes our association special?" — dark background section.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input
											{...form.register("structure.headingDe")}
											value={form.watch("structure.headingDe") || ""}
											placeholder="Was macht unseren Verband besonders?"
										/>
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input
											{...form.register("structure.headingEn")}
											value={form.watch("structure.headingEn") || ""}
											placeholder="What is special about our association?"
										/>
									</div>
								</div>
								{[1, 2, 3].map((n) => (
									<div key={n} className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Paragraph {n} (DE)</Label>
											<Textarea
												{...form.register(`structure.paragraph${n}De` as "structure.paragraph1De")}
												value={form.watch(`structure.paragraph${n}De` as "structure.paragraph1De") || ""}
												rows={4}
											/>
										</div>
										<div className="space-y-2">
											<Label>Paragraph {n} (EN)</Label>
											<Textarea
												{...form.register(`structure.paragraph${n}En` as "structure.paragraph1En")}
												value={form.watch(`structure.paragraph${n}En` as "structure.paragraph1En") || ""}
												rows={4}
											/>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</TabsContent>

					{/* ============================================================ */}
					{/* TEAM TAB */}
					{/* ============================================================ */}
					<TabsContent value="team">
						<Card>
							<CardHeader>
								<CardTitle>Team Section</CardTitle>
								<CardDescription>
									Team heading, description paragraphs, and team photo.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input
											{...form.register("team.headingDe")}
											value={form.watch("team.headingDe") || ""}
											placeholder="Unser Team"
										/>
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input
											{...form.register("team.headingEn")}
											value={form.watch("team.headingEn") || ""}
											placeholder="Our Team"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Subtext (DE)</Label>
										<Textarea
											{...form.register("team.subtextDe")}
											value={form.watch("team.subtextDe") || ""}
											rows={2}
										/>
									</div>
									<div className="space-y-2">
										<Label>Subtext (EN)</Label>
										<Textarea
											{...form.register("team.subtextEn")}
											value={form.watch("team.subtextEn") || ""}
											rows={2}
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Paragraph 1 (DE)</Label>
										<Textarea
											{...form.register("team.paragraph1De")}
											value={form.watch("team.paragraph1De") || ""}
											rows={5}
										/>
									</div>
									<div className="space-y-2">
										<Label>Paragraph 1 (EN)</Label>
										<Textarea
											{...form.register("team.paragraph1En")}
											value={form.watch("team.paragraph1En") || ""}
											rows={5}
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Paragraph 2 (DE)</Label>
										<Textarea
											{...form.register("team.paragraph2De")}
											value={form.watch("team.paragraph2De") || ""}
											rows={5}
										/>
									</div>
									<div className="space-y-2">
										<Label>Paragraph 2 (EN)</Label>
										<Textarea
											{...form.register("team.paragraph2En")}
											value={form.watch("team.paragraph2En") || ""}
											rows={5}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label>Team Photo</Label>
									<MediaPicker
										type="image"
										value={form.watch("team.image") || null}
										onChange={(url) => form.setValue("team.image", url || "")}
										placeholder="Select team photo"
										galleryTitle="Select Team Photo"
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ============================================================ */}
					{/* OFFICE TIMELINE TAB */}
					{/* ============================================================ */}
					<TabsContent value="office">
						<Card>
							<CardHeader>
								<CardTitle>Office Timeline Section</CardTitle>
								<CardDescription>
									Alternating timeline showing offices and activities. Each item has a year, title, description, and image.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Section Heading (DE)</Label>
										<Input
											{...form.register("office.headingDe")}
											value={form.watch("office.headingDe") || ""}
											placeholder="Unsere Büros & Aktivitäten"
										/>
									</div>
									<div className="space-y-2">
										<Label>Section Heading (EN)</Label>
										<Input
											{...form.register("office.headingEn")}
											value={form.watch("office.headingEn") || ""}
											placeholder="Our Offices & Activities"
										/>
									</div>
								</div>

								<div className="space-y-4">
									{officeItems.fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-4 p-4 border rounded-lg"
										>
											<div className="flex items-center text-muted-foreground pt-2">
												<GripVertical className="h-5 w-5" />
											</div>
											<div className="flex-1 space-y-4">
												<div className="space-y-2">
													<Label>Year</Label>
													<Input
														{...form.register(`office.items.${index}.year`)}
														value={form.watch(`office.items.${index}.year`) || ""}
														placeholder="2020"
													/>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Title (DE)</Label>
														<Input
															{...form.register(`office.items.${index}.titleDe`)}
															value={form.watch(`office.items.${index}.titleDe`) || ""}
															placeholder="Berlin Büro"
														/>
													</div>
													<div className="space-y-2">
														<Label>Title (EN)</Label>
														<Input
															{...form.register(`office.items.${index}.titleEn`)}
															value={form.watch(`office.items.${index}.titleEn`) || ""}
															placeholder="Berlin Office"
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Description (DE)</Label>
														<Textarea
															{...form.register(`office.items.${index}.descriptionDe`)}
															value={form.watch(`office.items.${index}.descriptionDe`) || ""}
															rows={3}
														/>
													</div>
													<div className="space-y-2">
														<Label>Description (EN)</Label>
														<Textarea
															{...form.register(`office.items.${index}.descriptionEn`)}
															value={form.watch(`office.items.${index}.descriptionEn`) || ""}
															rows={3}
														/>
													</div>
												</div>
												<div className="space-y-2">
													<Label>Image</Label>
													<MediaPicker
														type="image"
														value={form.watch(`office.items.${index}.image`) || null}
														onChange={(url) =>
															form.setValue(`office.items.${index}.image`, url || "")
														}
														placeholder="Select office image"
														galleryTitle="Select Office Image"
													/>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={async () => {
													const confirmed = await confirm({
														title: "Remove Timeline Item",
														description: "Are you sure you want to remove this item?",
														confirmText: "Remove",
													});
													if (confirmed) officeItems.remove(index);
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
											officeItems.append({
												year: "",
												titleDe: "",
												titleEn: "",
												descriptionDe: "",
												descriptionEn: "",
												image: "",
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Timeline Item
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ============================================================ */}
					{/* GALLERY TAB */}
					{/* ============================================================ */}
					<TabsContent value="gallery">
						<Card>
							<CardHeader>
								<CardTitle>Gallery Section</CardTitle>
								<CardDescription>
									Masonry photo gallery with lightbox. Shown after the CTA section. Add 4 images for the 2×2 grid.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Section Heading (DE)</Label>
										<Input
											{...form.register("gallery.headingDe")}
											value={form.watch("gallery.headingDe") || ""}
											placeholder="Aus unserem Alltag"
										/>
									</div>
									<div className="space-y-2">
										<Label>Section Heading (EN)</Label>
										<Input
											{...form.register("gallery.headingEn")}
											value={form.watch("gallery.headingEn") || ""}
											placeholder="From Our Daily Life"
										/>
									</div>
								</div>

								<div className="space-y-4">
									{galleryItems.fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-4 p-4 border rounded-lg"
										>
											<div className="flex items-center text-muted-foreground pt-2">
												<GripVertical className="h-5 w-5" />
											</div>
											<div className="flex-1 space-y-4">
												<div className="space-y-2">
													<Label>Image</Label>
													<MediaPicker
														type="image"
														value={form.watch(`gallery.items.${index}.image`) || null}
														onChange={(url) =>
															form.setValue(`gallery.items.${index}.image`, url || "")
														}
														placeholder="Select gallery image"
														galleryTitle="Select Gallery Image"
													/>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Caption (DE)</Label>
														<Input
															{...form.register(`gallery.items.${index}.captionDe`)}
															value={form.watch(`gallery.items.${index}.captionDe`) || ""}
															placeholder="Bildunterschrift"
														/>
													</div>
													<div className="space-y-2">
														<Label>Caption (EN)</Label>
														<Input
															{...form.register(`gallery.items.${index}.captionEn`)}
															value={form.watch(`gallery.items.${index}.captionEn`) || ""}
															placeholder="Image caption"
														/>
													</div>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={async () => {
													const confirmed = await confirm({
														title: "Remove Gallery Image",
														description: "Are you sure you want to remove this image?",
														confirmText: "Remove",
													});
													if (confirmed) galleryItems.remove(index);
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
											galleryItems.append({
												image: "",
												captionDe: "",
												captionEn: "",
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Gallery Image
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ============================================================ */}
					{/* CTA TAB */}
					{/* ============================================================ */}
					<TabsContent value="cta">
						<Card>
							<CardHeader>
								<CardTitle>CTA Section</CardTitle>
								<CardDescription>
									"Become a Member" call-to-action section at the bottom of the page.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input
											{...form.register("cta.headingDe")}
											value={form.watch("cta.headingDe") || ""}
											placeholder="Werden Sie Mitglied"
										/>
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input
											{...form.register("cta.headingEn")}
											value={form.watch("cta.headingEn") || ""}
											placeholder="Become a Member"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Text (DE)</Label>
										<Textarea
											{...form.register("cta.textDe")}
											value={form.watch("cta.textDe") || ""}
											rows={4}
										/>
									</div>
									<div className="space-y-2">
										<Label>Text (EN)</Label>
										<Textarea
											{...form.register("cta.textEn")}
											value={form.watch("cta.textEn") || ""}
											rows={4}
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Button Label (DE)</Label>
										<Input
											{...form.register("cta.buttonDe")}
											value={form.watch("cta.buttonDe") || ""}
											placeholder="Kontakt aufnehmen"
										/>
									</div>
									<div className="space-y-2">
										<Label>Button Label (EN)</Label>
										<Input
											{...form.register("cta.buttonEn")}
											value={form.watch("cta.buttonEn") || ""}
											placeholder="Get in touch"
										/>
									</div>
								</div>
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
