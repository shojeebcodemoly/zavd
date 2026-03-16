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
	Globe,
	BookOpen,
	Link as LinkIcon,
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

const readMoreLinkSchema = z.object({
	labelDe: z.string().max(200).optional(),
	labelEn: z.string().max(200).optional(),
	href: z.string().optional(),
});

const integrationSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
	image: z.string().optional(),
	badgeTitleDe: z.string().max(100).optional(),
	badgeTitleEn: z.string().max(100).optional(),
	badgeSubtitleDe: z.string().max(200).optional(),
	badgeSubtitleEn: z.string().max(200).optional(),
	ctaLabelDe: z.string().max(100).optional(),
	ctaLabelEn: z.string().max(100).optional(),
	ctaHref: z.string().optional(),
	readMoreLinks: z.array(readMoreLinkSchema),
});

const coreDemandSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
});

const irakSyrienSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	paragraphDe: z.string().optional(),
	paragraphEn: z.string().optional(),
	image: z.string().optional(),
	coreDemands: z.array(coreDemandSchema),
	dokumentationTitleDe: z.string().max(300).optional(),
	dokumentationTitleEn: z.string().max(300).optional(),
	dokumentationDescDe: z.string().optional(),
	dokumentationDescEn: z.string().optional(),
	dokumentationLinkLabelDe: z.string().max(300).optional(),
	dokumentationLinkLabelEn: z.string().max(300).optional(),
	dokumentationLinkHref: z.string().optional(),
});

const formSchema = z.object({
	hero: heroSchema,
	integration: integrationSchema,
	irakSyrien: irakSyrienSchema,
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
	hero: {
		taglineDe: "Unsere Themen",
		taglineEn: "Our Topics",
		titleDe: "Themen",
		titleEn: "Topics",
		subtitleDe: "Integration von Geflüchteten und die Situation der Assyrer in Irak und Syrien — unsere zwei zentralen Themenfelder.",
		subtitleEn: "Integration of refugees and the situation of Assyrians in Iraq and Syria — our two key areas of advocacy.",
		image: "/images/about/aboutbanner.jpg",
	},
	integration: {
		headingDe: "Integration",
		headingEn: "Integration",
		paragraph1De: "",
		paragraph1En: "",
		paragraph2De: "",
		paragraph2En: "",
		image: "/images/about/office1pg.jpg",
		badgeTitleDe: "Seit 2009",
		badgeTitleEn: "Since 2009",
		badgeSubtitleDe: "Aktive Integrationsarbeit",
		badgeSubtitleEn: "Active integration work",
		ctaLabelDe: "Unsere Angebote",
		ctaLabelEn: "Our Services",
		ctaHref: "/angebote-beratung",
		readMoreLinks: [],
	},
	irakSyrien: {
		headingDe: "Irak & Syrien",
		headingEn: "Iraq & Syria",
		paragraphDe: "",
		paragraphEn: "",
		image: "/images/donate/Spenden-Syrien.jpg",
		coreDemands: [],
		dokumentationTitleDe: "Augenzeugenberichte & Dokumentationen",
		dokumentationTitleEn: "Eyewitness Reports & Documentation",
		dokumentationDescDe: "",
		dokumentationDescEn: "",
		dokumentationLinkLabelDe: "ZAVD – Dokumentation – Ereignisse Irak 2014",
		dokumentationLinkLabelEn: "ZAVD – Documentation – Events Iraq 2014",
		dokumentationLinkHref: "#",
	},
};

export default function ThemenAdminPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const readMoreLinksArray = useFieldArray({ control: form.control, name: "integration.readMoreLinks" });
	const coreDemandsArray = useFieldArray({ control: form.control, name: "irakSyrien.coreDemands" });

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/themen-page");
				if (res.ok) {
					const data = await res.json();
					form.reset({
						hero: { ...defaultValues.hero, ...data.hero },
						integration: {
							...defaultValues.integration,
							...data.integration,
							readMoreLinks: data.integration?.readMoreLinks || [],
						},
						irakSyrien: {
							...defaultValues.irakSyrien,
							...data.irakSyrien,
							coreDemands: data.irakSyrien?.coreDemands || [],
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
			const res = await fetch("/api/themen-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const responseData = await res.json();
			if (res.ok) {
				toast.success("Themen page saved successfully");
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
					<h1 className="text-3xl font-medium tracking-tight">Themen</h1>
					<p className="text-muted-foreground">
						Manage the Themen (Topics) page content in German and English.
					</p>
				</div>
				<a
					href="/themen"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<form id="themen-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Tabs defaultValue="hero" className="space-y-6">
					<TabsList className="flex-wrap h-auto justify-start">
						<TabsTrigger value="hero" className="gap-2">
							<ImageIcon className="h-4 w-4" />
							Hero
						</TabsTrigger>
						<TabsTrigger value="integration" className="gap-2">
							<Globe className="h-4 w-4" />
							Integration
						</TabsTrigger>
						<TabsTrigger value="irak-syrien" className="gap-2">
							<BookOpen className="h-4 w-4" />
							Irak &amp; Syrien
						</TabsTrigger>
					</TabsList>

					{/* ── HERO TAB ── */}
					<TabsContent value="hero">
						<Card>
							<CardHeader>
								<CardTitle>Hero Section</CardTitle>
								<CardDescription>Banner image and title displayed at the top of the Themen page.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Tagline (DE)</Label>
										<Input {...form.register("hero.taglineDe")} value={form.watch("hero.taglineDe") || ""} placeholder="Unsere Themen" />
									</div>
									<div className="space-y-2">
										<Label>Tagline (EN)</Label>
										<Input {...form.register("hero.taglineEn")} value={form.watch("hero.taglineEn") || ""} placeholder="Our Topics" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Title (DE)</Label>
										<Input {...form.register("hero.titleDe")} value={form.watch("hero.titleDe") || ""} placeholder="Themen" />
									</div>
									<div className="space-y-2">
										<Label>Title (EN)</Label>
										<Input {...form.register("hero.titleEn")} value={form.watch("hero.titleEn") || ""} placeholder="Topics" />
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

					{/* ── INTEGRATION TAB ── */}
					<TabsContent value="integration">
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Integration — Main Content</CardTitle>
									<CardDescription>Text, image, floating badge and CTA for the Integration section.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Heading (DE)</Label>
											<Input {...form.register("integration.headingDe")} value={form.watch("integration.headingDe") || ""} placeholder="Integration" />
										</div>
										<div className="space-y-2">
											<Label>Heading (EN)</Label>
											<Input {...form.register("integration.headingEn")} value={form.watch("integration.headingEn") || ""} placeholder="Integration" />
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Paragraph 1 (DE)</Label>
											<Textarea {...form.register("integration.paragraph1De")} value={form.watch("integration.paragraph1De") || ""} rows={5} />
										</div>
										<div className="space-y-2">
											<Label>Paragraph 1 (EN)</Label>
											<Textarea {...form.register("integration.paragraph1En")} value={form.watch("integration.paragraph1En") || ""} rows={5} />
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Paragraph 2 (DE)</Label>
											<Textarea {...form.register("integration.paragraph2De")} value={form.watch("integration.paragraph2De") || ""} rows={5} />
										</div>
										<div className="space-y-2">
											<Label>Paragraph 2 (EN)</Label>
											<Textarea {...form.register("integration.paragraph2En")} value={form.watch("integration.paragraph2En") || ""} rows={5} />
										</div>
									</div>
									<div className="space-y-2">
										<Label>Section Image</Label>
										<MediaPicker
											type="image"
											value={form.watch("integration.image") || null}
											onChange={(url) => form.setValue("integration.image", url || "")}
											placeholder="Select integration section image"
											galleryTitle="Select Integration Image"
										/>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Floating Badge Title (DE)</Label>
											<Input {...form.register("integration.badgeTitleDe")} value={form.watch("integration.badgeTitleDe") || ""} placeholder="Seit 2009" />
										</div>
										<div className="space-y-2">
											<Label>Floating Badge Title (EN)</Label>
											<Input {...form.register("integration.badgeTitleEn")} value={form.watch("integration.badgeTitleEn") || ""} placeholder="Since 2009" />
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Floating Badge Subtitle (DE)</Label>
											<Input {...form.register("integration.badgeSubtitleDe")} value={form.watch("integration.badgeSubtitleDe") || ""} placeholder="Aktive Integrationsarbeit" />
										</div>
										<div className="space-y-2">
											<Label>Floating Badge Subtitle (EN)</Label>
											<Input {...form.register("integration.badgeSubtitleEn")} value={form.watch("integration.badgeSubtitleEn") || ""} placeholder="Active integration work" />
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-3">
										<div className="space-y-2">
											<Label>CTA Button Label (DE)</Label>
											<Input {...form.register("integration.ctaLabelDe")} value={form.watch("integration.ctaLabelDe") || ""} placeholder="Unsere Angebote" />
										</div>
										<div className="space-y-2">
											<Label>CTA Button Label (EN)</Label>
											<Input {...form.register("integration.ctaLabelEn")} value={form.watch("integration.ctaLabelEn") || ""} placeholder="Our Services" />
										</div>
										<div className="space-y-2">
											<Label>CTA Button Link</Label>
											<Input {...form.register("integration.ctaHref")} value={form.watch("integration.ctaHref") || ""} placeholder="/angebote-beratung" />
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Read More Links */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<LinkIcon className="h-4 w-4" />
										Read More Links
									</CardTitle>
									<CardDescription>Bullet links shown under the text (e.g. "unserem Integrationsprojekt").</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{readMoreLinksArray.fields.map((field, index) => (
										<div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
											<div className="flex items-center text-muted-foreground pt-2">
												<GripVertical className="h-5 w-5" />
											</div>
											<div className="flex-1 space-y-4">
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Label (DE)</Label>
														<Input {...form.register(`integration.readMoreLinks.${index}.labelDe`)} value={form.watch(`integration.readMoreLinks.${index}.labelDe`) || ""} placeholder="unserem Integrationsprojekt" />
													</div>
													<div className="space-y-2">
														<Label>Label (EN)</Label>
														<Input {...form.register(`integration.readMoreLinks.${index}.labelEn`)} value={form.watch(`integration.readMoreLinks.${index}.labelEn`) || ""} placeholder="our integration project" />
													</div>
												</div>
												<div className="space-y-2">
													<Label>Link URL</Label>
													<Input {...form.register(`integration.readMoreLinks.${index}.href`)} value={form.watch(`integration.readMoreLinks.${index}.href`) || ""} placeholder="/projekte/gemeinsam-aktiv" />
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={async () => {
													const ok = await confirm({ title: "Remove Link", description: "Remove this read more link?", confirmText: "Remove" });
													if (ok) readMoreLinksArray.remove(index);
												}}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={() => readMoreLinksArray.append({ labelDe: "", labelEn: "", href: "" })}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Link
									</Button>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* ── IRAK & SYRIEN TAB ── */}
					<TabsContent value="irak-syrien">
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Irak &amp; Syrien — Main Content</CardTitle>
									<CardDescription>Heading, main paragraph and section image.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Heading (DE)</Label>
											<Input {...form.register("irakSyrien.headingDe")} value={form.watch("irakSyrien.headingDe") || ""} placeholder="Irak & Syrien" />
										</div>
										<div className="space-y-2">
											<Label>Heading (EN)</Label>
											<Input {...form.register("irakSyrien.headingEn")} value={form.watch("irakSyrien.headingEn") || ""} placeholder="Iraq & Syria" />
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Main Paragraph (DE)</Label>
											<Textarea {...form.register("irakSyrien.paragraphDe")} value={form.watch("irakSyrien.paragraphDe") || ""} rows={7} />
										</div>
										<div className="space-y-2">
											<Label>Main Paragraph (EN)</Label>
											<Textarea {...form.register("irakSyrien.paragraphEn")} value={form.watch("irakSyrien.paragraphEn") || ""} rows={7} />
										</div>
									</div>
									<div className="space-y-2">
										<Label>Section Image</Label>
										<MediaPicker
											type="image"
											value={form.watch("irakSyrien.image") || null}
											onChange={(url) => form.setValue("irakSyrien.image", url || "")}
											placeholder="Select Irak & Syrien section image"
											galleryTitle="Select Section Image"
										/>
									</div>
								</CardContent>
							</Card>

							{/* Core Demands */}
							<Card>
								<CardHeader>
									<CardTitle>Core Demands / Kernforderungen</CardTitle>
									<CardDescription>The numbered demand cards (01, 02, 03). Add or edit each card.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{coreDemandsArray.fields.map((field, index) => (
										<div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
											<div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center mt-1">
												<span className="text-primary text-sm font-bold">{String(index + 1).padStart(2, "0")}</span>
											</div>
											<div className="flex-1 space-y-4">
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Title (DE)</Label>
														<Input {...form.register(`irakSyrien.coreDemands.${index}.titleDe`)} value={form.watch(`irakSyrien.coreDemands.${index}.titleDe`) || ""} placeholder="Hilfe zur Selbstverteidigung" />
													</div>
													<div className="space-y-2">
														<Label>Title (EN)</Label>
														<Input {...form.register(`irakSyrien.coreDemands.${index}.titleEn`)} value={form.watch(`irakSyrien.coreDemands.${index}.titleEn`) || ""} placeholder="Aid for Self-Defense" />
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Description (DE)</Label>
														<Textarea {...form.register(`irakSyrien.coreDemands.${index}.descriptionDe`)} value={form.watch(`irakSyrien.coreDemands.${index}.descriptionDe`) || ""} rows={3} />
													</div>
													<div className="space-y-2">
														<Label>Description (EN)</Label>
														<Textarea {...form.register(`irakSyrien.coreDemands.${index}.descriptionEn`)} value={form.watch(`irakSyrien.coreDemands.${index}.descriptionEn`) || ""} rows={3} />
													</div>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={async () => {
													const ok = await confirm({ title: "Remove Demand", description: "Remove this core demand card?", confirmText: "Remove" });
													if (ok) coreDemandsArray.remove(index);
												}}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={() => coreDemandsArray.append({ titleDe: "", titleEn: "", descriptionDe: "", descriptionEn: "" })}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Core Demand
									</Button>
								</CardContent>
							</Card>

							{/* Dokumentation Card */}
							<Card>
								<CardHeader>
									<CardTitle>Dokumentation Card</CardTitle>
									<CardDescription>The download card shown below the section image.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Card Title (DE)</Label>
											<Input {...form.register("irakSyrien.dokumentationTitleDe")} value={form.watch("irakSyrien.dokumentationTitleDe") || ""} placeholder="Augenzeugenberichte & Dokumentationen" />
										</div>
										<div className="space-y-2">
											<Label>Card Title (EN)</Label>
											<Input {...form.register("irakSyrien.dokumentationTitleEn")} value={form.watch("irakSyrien.dokumentationTitleEn") || ""} placeholder="Eyewitness Reports & Documentation" />
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Description (DE)</Label>
											<Textarea {...form.register("irakSyrien.dokumentationDescDe")} value={form.watch("irakSyrien.dokumentationDescDe") || ""} rows={4} />
										</div>
										<div className="space-y-2">
											<Label>Description (EN)</Label>
											<Textarea {...form.register("irakSyrien.dokumentationDescEn")} value={form.watch("irakSyrien.dokumentationDescEn") || ""} rows={4} />
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Download Link Label (DE)</Label>
											<Input {...form.register("irakSyrien.dokumentationLinkLabelDe")} value={form.watch("irakSyrien.dokumentationLinkLabelDe") || ""} placeholder="ZAVD – Dokumentation – Ereignisse Irak 2014" />
										</div>
										<div className="space-y-2">
											<Label>Download Link Label (EN)</Label>
											<Input {...form.register("irakSyrien.dokumentationLinkLabelEn")} value={form.watch("irakSyrien.dokumentationLinkLabelEn") || ""} placeholder="ZAVD – Documentation – Events Iraq 2014" />
										</div>
									</div>
									<div className="space-y-2">
										<Label>Download Link URL</Label>
										<Input {...form.register("irakSyrien.dokumentationLinkHref")} value={form.watch("irakSyrien.dokumentationLinkHref") || ""} placeholder="https://..." />
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
			<ConfirmModal />
		</div>
	);
}
