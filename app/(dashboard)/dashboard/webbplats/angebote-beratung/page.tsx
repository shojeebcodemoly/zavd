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
	Image as ImageIcon,
	Shield,
	FileText,
	HeartHandshake,
	Link2,
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

const pdfItemSchema = z.object({
	titleDe: z.string().max(300).optional(),
	titleEn: z.string().max(300).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	downloadLabelDe: z.string().max(200).optional(),
	downloadLabelEn: z.string().max(200).optional(),
	href: z.string().optional(),
});

const fluchtAsylSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
	infoBoxDe: z.string().optional(),
	infoBoxEn: z.string().optional(),
	pdfResources: z.array(pdfItemSchema).optional(),
});

const namensaenderungSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
	paragraph3De: z.string().optional(),
	paragraph3En: z.string().optional(),
	blockquoteDe: z.string().optional(),
	blockquoteEn: z.string().optional(),
	pdfLabelDe: z.string().max(200).optional(),
	pdfLabelEn: z.string().max(200).optional(),
	pdfHref: z.string().optional(),
});

const serviceItemSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
});

const beratungSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	subtitleDe: z.string().optional(),
	subtitleEn: z.string().optional(),
	ctaLabelDe: z.string().max(100).optional(),
	ctaLabelEn: z.string().max(100).optional(),
	services: z.array(serviceItemSchema).optional(),
});

const linkItemSchema = z.object({
	name: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	href: z.string().optional(),
});

const wichtigeLinksSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	subtitleDe: z.string().optional(),
	subtitleEn: z.string().optional(),
	links: z.array(linkItemSchema).optional(),
});

const formSchema = z.object({
	hero: heroSchema,
	fluchtAsyl: fluchtAsylSchema,
	namensaenderung: namensaenderungSchema,
	beratung: beratungSchema,
	wichtigeLinks: wichtigeLinksSchema,
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
	hero: {
		titleDe: "Angebote &\nBeratung",
		titleEn: "Services &\nCounseling",
		subtitleDe: "Wir unterstützen Flüchtlinge, Familien und Einzelpersonen mit professioneller Beratung.",
		subtitleEn: "We support refugees, families, and individuals with professional counseling.",
		image: "/images/about/aboutbanner.jpg",
	},
	fluchtAsyl: {
		headingDe: "Betreuung von Flüchtlingen",
		headingEn: "Refugee & Asylum Support",
		paragraph1De: "",
		paragraph1En: "",
		paragraph2De: "",
		paragraph2En: "",
		infoBoxDe: "",
		infoBoxEn: "",
		pdfResources: [],
	},
	namensaenderung: {
		headingDe: "Namensänderung",
		headingEn: "Name Change Assistance",
		paragraph1De: "",
		paragraph1En: "",
		paragraph2De: "",
		paragraph2En: "",
		paragraph3De: "",
		paragraph3En: "",
		blockquoteDe: "",
		blockquoteEn: "",
		pdfLabelDe: "Bekanntmachung im Bundesanzeiger (PDF)",
		pdfLabelEn: "Announcement in the Bundesanzeiger (PDF)",
		pdfHref: "",
	},
	beratung: {
		headingDe: "Beratung & Unterstützung",
		headingEn: "Counseling & Support",
		subtitleDe: "",
		subtitleEn: "",
		ctaLabelDe: "Kontakt aufnehmen",
		ctaLabelEn: "Contact Us",
		services: [],
	},
	wichtigeLinks: {
		headingDe: "Wichtige Links",
		headingEn: "Useful Links",
		subtitleDe: "Hier finden Sie eine Auswahl interessanter Links.",
		subtitleEn: "Here you will find a selection of interesting links.",
		links: [],
	},
};

export default function AngeboteBeratungAdminPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const pdfItems = useFieldArray({
		control: form.control,
		name: "fluchtAsyl.pdfResources",
	});

	const serviceItems = useFieldArray({
		control: form.control,
		name: "beratung.services",
	});

	const linkItems = useFieldArray({
		control: form.control,
		name: "wichtigeLinks.links",
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/angebote-beratung-page");
				if (res.ok) {
					const data = await res.json();
					form.reset({
						hero: { ...defaultValues.hero, ...data.hero },
						fluchtAsyl: {
							...defaultValues.fluchtAsyl,
							...data.fluchtAsyl,
							pdfResources: data.fluchtAsyl?.pdfResources || [],
						},
						namensaenderung: { ...defaultValues.namensaenderung, ...data.namensaenderung },
						beratung: {
							...defaultValues.beratung,
							...data.beratung,
							services: data.beratung?.services || [],
						},
						wichtigeLinks: {
							...defaultValues.wichtigeLinks,
							...data.wichtigeLinks,
							links: data.wichtigeLinks?.links || [],
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
			const res = await fetch("/api/angebote-beratung-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const responseData = await res.json();

			if (res.ok) {
				toast.success("Angebote & Beratung page saved successfully");
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
			<ConfirmModal />
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-medium tracking-tight">Angebote & Beratung</h1>
					<p className="text-muted-foreground">
						Manage the Services & Counseling page content in German and English.
					</p>
				</div>
				<a
					href="/angebote-beratung"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<form id="angebote-beratung-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Tabs defaultValue="hero" className="space-y-6">
					<TabsList className="flex-wrap h-auto justify-start">
						<TabsTrigger value="hero" className="gap-2">
							<ImageIcon className="h-4 w-4" />
							Hero
						</TabsTrigger>
						<TabsTrigger value="flucht-asyl" className="gap-2">
							<Shield className="h-4 w-4" />
							Asylum & Refuge
						</TabsTrigger>
						<TabsTrigger value="namensaenderung" className="gap-2">
							<FileText className="h-4 w-4" />
							Name Change
						</TabsTrigger>
						<TabsTrigger value="beratung" className="gap-2">
							<HeartHandshake className="h-4 w-4" />
							Counseling
						</TabsTrigger>
						<TabsTrigger value="links" className="gap-2">
							<Link2 className="h-4 w-4" />
							Important Links
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
											placeholder="Angebote & Beratung"
										/>
									</div>
									<div className="space-y-2">
										<Label>Title (EN)</Label>
										<Input
											{...form.register("hero.titleEn")}
											value={form.watch("hero.titleEn") || ""}
											placeholder="Services & Counseling"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Subtitle (DE)</Label>
										<Textarea
											{...form.register("hero.subtitleDe")}
											value={form.watch("hero.subtitleDe") || ""}
											rows={3}
										/>
									</div>
									<div className="space-y-2">
										<Label>Subtitle (EN)</Label>
										<Textarea
											{...form.register("hero.subtitleEn")}
											value={form.watch("hero.subtitleEn") || ""}
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
					{/* FLUCHT & ASYL TAB */}
					{/* ============================================================ */}
					<TabsContent value="flucht-asyl" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Flucht & Asyl – Text Content</CardTitle>
								<CardDescription>
									Heading, paragraphs, and info box for the refugee section.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input
											{...form.register("fluchtAsyl.headingDe")}
											value={form.watch("fluchtAsyl.headingDe") || ""}
											placeholder="Betreuung von Flüchtlingen"
										/>
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input
											{...form.register("fluchtAsyl.headingEn")}
											value={form.watch("fluchtAsyl.headingEn") || ""}
											placeholder="Refugee & Asylum Support"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Paragraph 1 (DE)</Label>
										<Textarea
											{...form.register("fluchtAsyl.paragraph1De")}
											value={form.watch("fluchtAsyl.paragraph1De") || ""}
											rows={4}
										/>
									</div>
									<div className="space-y-2">
										<Label>Paragraph 1 (EN)</Label>
										<Textarea
											{...form.register("fluchtAsyl.paragraph1En")}
											value={form.watch("fluchtAsyl.paragraph1En") || ""}
											rows={4}
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Paragraph 2 (DE)</Label>
										<Textarea
											{...form.register("fluchtAsyl.paragraph2De")}
											value={form.watch("fluchtAsyl.paragraph2De") || ""}
											rows={4}
										/>
									</div>
									<div className="space-y-2">
										<Label>Paragraph 2 (EN)</Label>
										<Textarea
											{...form.register("fluchtAsyl.paragraph2En")}
											value={form.watch("fluchtAsyl.paragraph2En") || ""}
											rows={4}
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Info Box (DE)</Label>
										<Textarea
											{...form.register("fluchtAsyl.infoBoxDe")}
											value={form.watch("fluchtAsyl.infoBoxDe") || ""}
											rows={3}
										/>
									</div>
									<div className="space-y-2">
										<Label>Info Box (EN)</Label>
										<Textarea
											{...form.register("fluchtAsyl.infoBoxEn")}
											value={form.watch("fluchtAsyl.infoBoxEn") || ""}
											rows={3}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* PDF Resources */}
						<Card>
							<CardHeader>
								<CardTitle>PDF Resources</CardTitle>
								<CardDescription>
									Downloadable documents shown as cards on the right side.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{pdfItems.fields.map((field, index) => (
									<div key={field.id} className="border rounded-lg p-4 space-y-4 relative">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute top-2 right-2 text-destructive hover:text-destructive"
											onClick={() =>
												confirm({
													title: "Remove PDF Resource",
													description: "Are you sure you want to remove this PDF resource?",
													onConfirm: () => pdfItems.remove(index),
												})
											}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
										<p className="text-sm font-medium text-muted-foreground">PDF #{index + 1}</p>
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label>Title (DE)</Label>
												<Input
													{...form.register(`fluchtAsyl.pdfResources.${index}.titleDe`)}
													value={form.watch(`fluchtAsyl.pdfResources.${index}.titleDe`) || ""}
												/>
											</div>
											<div className="space-y-2">
												<Label>Title (EN)</Label>
												<Input
													{...form.register(`fluchtAsyl.pdfResources.${index}.titleEn`)}
													value={form.watch(`fluchtAsyl.pdfResources.${index}.titleEn`) || ""}
												/>
											</div>
										</div>
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label>Description (DE)</Label>
												<Textarea
													{...form.register(`fluchtAsyl.pdfResources.${index}.descriptionDe`)}
													value={form.watch(`fluchtAsyl.pdfResources.${index}.descriptionDe`) || ""}
													rows={3}
												/>
											</div>
											<div className="space-y-2">
												<Label>Description (EN)</Label>
												<Textarea
													{...form.register(`fluchtAsyl.pdfResources.${index}.descriptionEn`)}
													value={form.watch(`fluchtAsyl.pdfResources.${index}.descriptionEn`) || ""}
													rows={3}
												/>
											</div>
										</div>
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label>Download Label (DE)</Label>
												<Input
													{...form.register(`fluchtAsyl.pdfResources.${index}.downloadLabelDe`)}
													value={form.watch(`fluchtAsyl.pdfResources.${index}.downloadLabelDe`) || ""}
												/>
											</div>
											<div className="space-y-2">
												<Label>Download Label (EN)</Label>
												<Input
													{...form.register(`fluchtAsyl.pdfResources.${index}.downloadLabelEn`)}
													value={form.watch(`fluchtAsyl.pdfResources.${index}.downloadLabelEn`) || ""}
												/>
											</div>
										</div>
										<div className="space-y-2">
											<Label>PDF URL / href</Label>
											<Input
												{...form.register(`fluchtAsyl.pdfResources.${index}.href`)}
												value={form.watch(`fluchtAsyl.pdfResources.${index}.href`) || ""}
												placeholder="https://..."
											/>
										</div>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={() =>
										pdfItems.append({
											titleDe: "",
											titleEn: "",
											descriptionDe: "",
											descriptionEn: "",
											downloadLabelDe: "",
											downloadLabelEn: "",
											href: "",
										})
									}
								>
									<Plus className="h-4 w-4" />
									Add PDF Resource
								</Button>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ============================================================ */}
					{/* NAMENSÄNDERUNG TAB */}
					{/* ============================================================ */}
					<TabsContent value="namensaenderung" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Namensänderung</CardTitle>
								<CardDescription>
									Name change assistance section content.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input
											{...form.register("namensaenderung.headingDe")}
											value={form.watch("namensaenderung.headingDe") || ""}
											placeholder="Namensänderung"
										/>
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input
											{...form.register("namensaenderung.headingEn")}
											value={form.watch("namensaenderung.headingEn") || ""}
											placeholder="Name Change Assistance"
										/>
									</div>
								</div>
								{["paragraph1", "paragraph2", "paragraph3"].map((para) => (
									<div key={para} className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>{para.replace("paragraph", "Paragraph ")} (DE)</Label>
											<Textarea
												{...form.register(`namensaenderung.${para}De` as keyof FormData["namensaenderung"] & string)}
												value={(form.watch(`namensaenderung.${para}De` as never) as string) || ""}
												rows={4}
											/>
										</div>
										<div className="space-y-2">
											<Label>{para.replace("paragraph", "Paragraph ")} (EN)</Label>
											<Textarea
												{...form.register(`namensaenderung.${para}En` as keyof FormData["namensaenderung"] & string)}
												value={(form.watch(`namensaenderung.${para}En` as never) as string) || ""}
												rows={4}
											/>
										</div>
									</div>
								))}
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Blockquote (DE)</Label>
										<Textarea
											{...form.register("namensaenderung.blockquoteDe")}
											value={form.watch("namensaenderung.blockquoteDe") || ""}
											rows={4}
											placeholder="Zitat / blockquote text..."
										/>
									</div>
									<div className="space-y-2">
										<Label>Blockquote (EN)</Label>
										<Textarea
											{...form.register("namensaenderung.blockquoteEn")}
											value={form.watch("namensaenderung.blockquoteEn") || ""}
											rows={4}
											placeholder="Quote / blockquote text..."
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>PDF Button Label (DE)</Label>
										<Input
											{...form.register("namensaenderung.pdfLabelDe")}
											value={form.watch("namensaenderung.pdfLabelDe") || ""}
											placeholder="Bekanntmachung im Bundesanzeiger (PDF)"
										/>
									</div>
									<div className="space-y-2">
										<Label>PDF Button Label (EN)</Label>
										<Input
											{...form.register("namensaenderung.pdfLabelEn")}
											value={form.watch("namensaenderung.pdfLabelEn") || ""}
											placeholder="Announcement in the Bundesanzeiger (PDF)"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label>PDF URL</Label>
									<Input
										{...form.register("namensaenderung.pdfHref")}
										value={form.watch("namensaenderung.pdfHref") || ""}
										placeholder="https://..."
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ============================================================ */}
					{/* BERATUNG TAB */}
					{/* ============================================================ */}
					<TabsContent value="beratung" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Beratung & Unterstützung – Header</CardTitle>
								<CardDescription>
									Section heading, subtitle, and CTA button label.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input
											{...form.register("beratung.headingDe")}
											value={form.watch("beratung.headingDe") || ""}
											placeholder="Beratung & Unterstützung"
										/>
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input
											{...form.register("beratung.headingEn")}
											value={form.watch("beratung.headingEn") || ""}
											placeholder="Counseling & Support"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Subtitle (DE)</Label>
										<Textarea
											{...form.register("beratung.subtitleDe")}
											value={form.watch("beratung.subtitleDe") || ""}
											rows={3}
										/>
									</div>
									<div className="space-y-2">
										<Label>Subtitle (EN)</Label>
										<Textarea
											{...form.register("beratung.subtitleEn")}
											value={form.watch("beratung.subtitleEn") || ""}
											rows={3}
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>CTA Button (DE)</Label>
										<Input
											{...form.register("beratung.ctaLabelDe")}
											value={form.watch("beratung.ctaLabelDe") || ""}
											placeholder="Kontakt aufnehmen"
										/>
									</div>
									<div className="space-y-2">
										<Label>CTA Button (EN)</Label>
										<Input
											{...form.register("beratung.ctaLabelEn")}
											value={form.watch("beratung.ctaLabelEn") || ""}
											placeholder="Contact Us"
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Service Cards */}
						<Card>
							<CardHeader>
								<CardTitle>Service Cards</CardTitle>
								<CardDescription>
									Individual service cards shown in the grid.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{serviceItems.fields.map((field, index) => (
									<div key={field.id} className="border rounded-lg p-4 space-y-4 relative">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute top-2 right-2 text-destructive hover:text-destructive"
											onClick={() =>
												confirm({
													title: "Remove Service",
													description: "Are you sure you want to remove this service card?",
													onConfirm: () => serviceItems.remove(index),
												})
											}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
										<p className="text-sm font-medium text-muted-foreground">Service #{index + 1}</p>
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label>Title (DE)</Label>
												<Input
													{...form.register(`beratung.services.${index}.titleDe`)}
													value={form.watch(`beratung.services.${index}.titleDe`) || ""}
												/>
											</div>
											<div className="space-y-2">
												<Label>Title (EN)</Label>
												<Input
													{...form.register(`beratung.services.${index}.titleEn`)}
													value={form.watch(`beratung.services.${index}.titleEn`) || ""}
												/>
											</div>
										</div>
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label>Description (DE)</Label>
												<Textarea
													{...form.register(`beratung.services.${index}.descriptionDe`)}
													value={form.watch(`beratung.services.${index}.descriptionDe`) || ""}
													rows={3}
												/>
											</div>
											<div className="space-y-2">
												<Label>Description (EN)</Label>
												<Textarea
													{...form.register(`beratung.services.${index}.descriptionEn`)}
													value={form.watch(`beratung.services.${index}.descriptionEn`) || ""}
													rows={3}
												/>
											</div>
										</div>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={() =>
										serviceItems.append({
											titleDe: "",
											titleEn: "",
											descriptionDe: "",
											descriptionEn: "",
										})
									}
								>
									<Plus className="h-4 w-4" />
									Add Service Card
								</Button>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ============================================================ */}
					{/* WICHTIGE LINKS TAB */}
					{/* ============================================================ */}
					<TabsContent value="links" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Wichtige Links – Header</CardTitle>
								<CardDescription>
									Section heading and subtitle for the links section.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input
											{...form.register("wichtigeLinks.headingDe")}
											value={form.watch("wichtigeLinks.headingDe") || ""}
											placeholder="Wichtige Links"
										/>
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input
											{...form.register("wichtigeLinks.headingEn")}
											value={form.watch("wichtigeLinks.headingEn") || ""}
											placeholder="Useful Links"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Subtitle (DE)</Label>
										<Textarea
											{...form.register("wichtigeLinks.subtitleDe")}
											value={form.watch("wichtigeLinks.subtitleDe") || ""}
											rows={2}
										/>
									</div>
									<div className="space-y-2">
										<Label>Subtitle (EN)</Label>
										<Textarea
											{...form.register("wichtigeLinks.subtitleEn")}
											value={form.watch("wichtigeLinks.subtitleEn") || ""}
											rows={2}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Link Items */}
						<Card>
							<CardHeader>
								<CardTitle>Links</CardTitle>
								<CardDescription>
									Individual link cards displayed in the grid.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{linkItems.fields.map((field, index) => (
									<div key={field.id} className="border rounded-lg p-4 space-y-4 relative">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute top-2 right-2 text-destructive hover:text-destructive"
											onClick={() =>
												confirm({
													title: "Remove Link",
													description: "Are you sure you want to remove this link?",
													onConfirm: () => linkItems.remove(index),
												})
											}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
										<p className="text-sm font-medium text-muted-foreground">Link #{index + 1}</p>
										<div className="space-y-2">
											<Label>Name</Label>
											<Input
												{...form.register(`wichtigeLinks.links.${index}.name`)}
												value={form.watch(`wichtigeLinks.links.${index}.name`) || ""}
												placeholder="bethnahrin.de"
											/>
										</div>
										<div className="grid gap-4 md:grid-cols-2">
											<div className="space-y-2">
												<Label>Description (DE)</Label>
												<Textarea
													{...form.register(`wichtigeLinks.links.${index}.descriptionDe`)}
													value={form.watch(`wichtigeLinks.links.${index}.descriptionDe`) || ""}
													rows={2}
												/>
											</div>
											<div className="space-y-2">
												<Label>Description (EN)</Label>
												<Textarea
													{...form.register(`wichtigeLinks.links.${index}.descriptionEn`)}
													value={form.watch(`wichtigeLinks.links.${index}.descriptionEn`) || ""}
													rows={2}
												/>
											</div>
										</div>
										<div className="space-y-2">
											<Label>URL</Label>
											<Input
												{...form.register(`wichtigeLinks.links.${index}.href`)}
												value={form.watch(`wichtigeLinks.links.${index}.href`) || ""}
												placeholder="https://..."
											/>
										</div>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={() =>
										linkItems.append({
											name: "",
											descriptionDe: "",
											descriptionEn: "",
											href: "",
										})
									}
								>
									<Plus className="h-4 w-4" />
									Add Link
								</Button>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Save Button */}
				<div className="flex justify-end pt-4 border-t">
					<Button type="submit" disabled={isSaving} className="gap-2 min-w-[140px]">
						{isSaving ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
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
