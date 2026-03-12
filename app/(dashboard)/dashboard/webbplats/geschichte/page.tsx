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
	BookOpen,
	BarChart3,
	AlignLeft,
	Clock,
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

const statSchema = z.object({
	value: z.number().optional(),
	suffix: z.string().max(20).optional(),
	labelDe: z.string().max(200).optional(),
	labelEn: z.string().max(200).optional(),
});

const introSchema = z.object({
	taglineDe: z.string().max(200).optional(),
	taglineEn: z.string().max(200).optional(),
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	paragraphDe: z.string().optional(),
	paragraphEn: z.string().optional(),
});

const articleSchema = z.object({
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	paragraph1De: z.string().optional(),
	paragraph1En: z.string().optional(),
	paragraph2De: z.string().optional(),
	paragraph2En: z.string().optional(),
	image: z.string().optional(),
	captionDe: z.string().max(300).optional(),
	captionEn: z.string().max(300).optional(),
	direction: z.enum(["left", "right"]).optional(),
});

const eventSchema = z.object({
	yearDe: z.string().max(20).optional(),
	yearEn: z.string().max(20).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	textDe: z.string().optional(),
	textEn: z.string().optional(),
	image: z.string().optional(),
});

const formSchema = z.object({
	hero: heroSchema,
	stats: z.array(statSchema),
	intro: introSchema,
	articles: z.array(articleSchema),
	events: z.array(eventSchema),
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
	hero: {
		taglineDe: "Unsere Geschichte",
		taglineEn: "Our Story",
		titleDe: "Geschichte",
		titleEn: "History",
		subtitleDe: "Über 60 Jahre Gemeinschaft, Engagement und Kultur in Deutschland.",
		subtitleEn: "Over 60 years of community, commitment and culture in Germany.",
		image: "/images/about/aboutbanner.jpg",
	},
	stats: [
		{ value: 60, suffix: "+", labelDe: "Jahre Geschichte", labelEn: "Years of History" },
		{ value: 20, suffix: "+", labelDe: "Städte in Deutschland", labelEn: "Cities in Germany" },
		{ value: 50, suffix: "+", labelDe: "Mitgliedsvereine", labelEn: "Member Associations" },
		{ value: 1965, suffix: "", labelDe: "Gegründet", labelEn: "Founded" },
	],
	intro: {
		taglineDe: "Unsere Wurzeln",
		taglineEn: "Our Roots",
		headingDe: "Von Gastarbeitern zu einer starken Gemeinschaft",
		headingEn: "From Guest Workers to a Strong Community",
		paragraphDe: "",
		paragraphEn: "",
	},
	articles: [
		{
			headingDe: "Die Anfänge", headingEn: "The Beginnings",
			paragraph1De: "Der Zentralverband besteht seit mehr als 60 Jahren als Gemeinschaftsorganisation. Die ersten assyrischen Gastarbeiter kamen 1965 aus Tur Abdin (Südosttürkei). In den 1960er Jahren lernten sie schnell die deutsche Sprache und bildeten Netzwerke, die wertvolle Unterstützung für andere Assyrer und Flüchtlinge boten.",
			paragraph1En: "The Central Association has been a community organization for more than 60 years. The first Assyrian guest workers arrived from Tur Abdin (southeastern Turkey) in 1965. In the mid-1960s, they quickly learned the German language and formed networks that provided valuable support to fellow Assyrians and refugees in the 1970s.",
			paragraph2De: "Assyrische Migranten bildeten organisierte Gruppen, um Verbindungen in Deutschland herzustellen. Familien kämpften mit Asylangelegenheiten und der Bewahrung ihrer Identität. Diese Vereinigungen führten zur Gründung des ZAVD als starke Vertretung für die assyrische Diaspora.",
			paragraph2En: "Assyrian migrants formed organized groups to create connections in Germany. Families dealt with asylum matters, language barriers, and preserving their identity in a foreign country. These associations eventually led to the founding of ZAVD as a strong representative body for the Assyrian diaspora.",
			image: "/images/about/office1pg.jpg", captionDe: "Frühes Gemeinschaftstreffen, 1965", captionEn: "Early community gathering, 1965", direction: "left" as const,
		},
		{
			headingDe: "Zusammenschluss mit anderen Migrantenverbänden", headingEn: "Merger with Other Migrant Associations",
			paragraph1De: "Die Bundesarbeitsgemeinschaft der Immigrantenverbände (BAGIV) verband seit den frühen 1980er Jahren verschiedene Minderheitengruppen – darunter spanische, kurdische, armenische und portugiesisch-italienische Gruppen.",
			paragraph1En: "The Federal Association of Immigrant Associations in Germany (BAGIV) in the early 1980s connected minority national groups including Spanish, Kurdish, Armenian and Portuguese-Italian communities.",
			paragraph2De: "ZAVD trat 1985 der BAGIV bei, was einen Wendepunkt darstellte. Die Organisation gewann nationale Sichtbarkeit und konnte assyrische Interessen auf Bundesebene vertreten.",
			paragraph2En: "ZAVD joined BAGIV in 1985, marking a turning point. The organization gained national visibility and could advocate for Assyrian interests at the federal level.",
			image: "/images/about/office2.jpg", captionDe: "BAGIV-Koalitionstreffen, 1985", captionEn: "BAGIV coalition meeting, 1985", direction: "right" as const,
		},
		{
			headingDe: "Einsatz für die Rechte von Minderheiten in der Heimat und Flüchtlinge", headingEn: "Advocacy for the Rights of Minorities in Their Homeland and Refugees",
			paragraph1De: "In den 1990er Jahren verschlechterte sich die Lage der Assyrer in ihrer Heimat dramatisch. ZAVD spielte eine Schlüsselrolle bei der Organisation der Solidarität für assyrische Flüchtlinge in Deutschland.",
			paragraph1En: "In the 1990s, the situation for Assyrians in their homeland deteriorated dramatically. ZAVD played a key role in organizing solidarity for Assyrian refugees in Germany.",
			paragraph2De: "ZAVD organisierte Protestdemonstrationen gegen die Diskriminierung von Christen im Irak und in Syrien.",
			paragraph2En: "ZAVD organized protest demonstrations against the discrimination of Christians in Iraq and Syria.",
			image: "/images/about/office3.jpg", captionDe: "Solidaritätsprotest, 1990er", captionEn: "Solidarity protest, 1990s", direction: "left" as const,
		},
		{
			headingDe: "Gründung des AJM", headingEn: "Founding of the AJM",
			paragraph1De: "Im Jahr 2002 wurde der Assyrische Jugendverband Mitteleuropa (AJM) gegründet, um die Interessen junger Menschen zu vertreten.",
			paragraph1En: "In 2002, the Assyrian Youth Association of Central Europe (AJM) was founded to represent the interests of young people.",
			paragraph2De: "Der AJM organisiert heute jährliche Jugendlager, Sportveranstaltungen, Kulturfestivals und Bildungsaustausche in ganz Europa.",
			paragraph2En: "The AJM today organizes annual youth camps, sports events, cultural festivals, and educational exchanges across Europe.",
			image: "/images/about/office4.jpg", captionDe: "AJM-Gründungsversammlung, 2002", captionEn: "AJM founding meeting, 2002", direction: "right" as const,
		},
	],
	events: [
		{ yearDe: "1965", yearEn: "1965", titleDe: "Die ersten Ankünfte", titleEn: "The First Arrivals", textDe: "Die ersten assyrischen Gastarbeiter kommen aus Tur Abdin (Südosttürkei) nach Deutschland.", textEn: "The first Assyrian guest workers arrive in Germany from Tur Abdin (southeastern Turkey).", image: "/images/about/aboutbanner.jpg" },
		{ yearDe: "1973", yearEn: "1973", titleDe: "Erster eingetragener Verein", titleEn: "First Registered Association", textDe: "Gründung des ersten offiziell eingetragenen assyrischen Vereins in Deutschland.", textEn: "The first officially registered Assyrian association in Germany is founded.", image: "/images/about/office1pg.jpg" },
		{ yearDe: "1985", yearEn: "1985", titleDe: "BAGIV-Zusammenschluss", titleEn: "BAGIV Coalition", textDe: "ZAVD schließt sich der Bundesarbeitsgemeinschaft der Immigrantenverbände (BAGIV) an.", textEn: "ZAVD joins the Federal Working Group of Immigrant Associations (BAGIV).", image: "/images/about/office2.jpg" },
		{ yearDe: "1990er", yearEn: "1990s", titleDe: "Einsatz für Minderheitenrechte", titleEn: "Advocacy for Minority Rights", textDe: "Während der Krisen in Tur Abdin und im Irak setzt sich ZAVD aktiv für Flüchtlinge und Minderheiten ein.", textEn: "During the crises in Tur Abdin and Iraq, ZAVD actively advocates for refugees and minorities.", image: "/images/about/office3.jpg" },
		{ yearDe: "2002", yearEn: "2002", titleDe: "Gründung des AJM", titleEn: "Founding of AJM", textDe: "Gründung des Assyrischen Jugendverbandes Mitteleuropa (AJM).", textEn: "The Assyrian Youth Association Central Europe (AJM) is founded.", image: "/images/about/office4.jpg" },
	],
};

export default function GeschichteAdminPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const statsArray = useFieldArray({ control: form.control, name: "stats" });
	const articlesArray = useFieldArray({ control: form.control, name: "articles" });
	const eventsArray = useFieldArray({ control: form.control, name: "events" });

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/geschichte-page");
				if (res.ok) {
					const data = await res.json();
					form.reset({
						hero: { ...defaultValues.hero, ...data.hero },
						stats: data.stats?.length ? data.stats : defaultValues.stats,
						intro: { ...defaultValues.intro, ...data.intro },
						articles: data.articles?.length ? data.articles : defaultValues.articles,
						events: data.events?.length ? data.events : defaultValues.events,
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
			const res = await fetch("/api/geschichte-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const responseData = await res.json();
			if (res.ok) {
				toast.success("Geschichte page saved successfully");
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
					<h1 className="text-3xl font-medium tracking-tight">Geschichte (History)</h1>
					<p className="text-muted-foreground">
						Manage the History page content in German and English.
					</p>
				</div>
				<a
					href="/uber-zavd/geschichte"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<form id="geschichte-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Tabs defaultValue="hero" className="space-y-6">
					<TabsList className="flex-wrap h-auto justify-start">
						<TabsTrigger value="hero" className="gap-2">
							<ImageIcon className="h-4 w-4" />
							Hero
						</TabsTrigger>
						<TabsTrigger value="stats" className="gap-2">
							<BarChart3 className="h-4 w-4" />
							Stats
						</TabsTrigger>
						<TabsTrigger value="intro" className="gap-2">
							<AlignLeft className="h-4 w-4" />
							Intro
						</TabsTrigger>
						<TabsTrigger value="articles" className="gap-2">
							<BookOpen className="h-4 w-4" />
							Articles
						</TabsTrigger>
						<TabsTrigger value="events" className="gap-2">
							<Clock className="h-4 w-4" />
							Timeline Events
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
										<Input {...form.register("hero.taglineDe")} value={form.watch("hero.taglineDe") || ""} placeholder="Unsere Geschichte" />
									</div>
									<div className="space-y-2">
										<Label>Tagline (EN)</Label>
										<Input {...form.register("hero.taglineEn")} value={form.watch("hero.taglineEn") || ""} placeholder="Our Story" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Title (DE)</Label>
										<Input {...form.register("hero.titleDe")} value={form.watch("hero.titleDe") || ""} placeholder="Geschichte" />
									</div>
									<div className="space-y-2">
										<Label>Title (EN)</Label>
										<Input {...form.register("hero.titleEn")} value={form.watch("hero.titleEn") || ""} placeholder="History" />
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

					{/* ── STATS TAB ── */}
					<TabsContent value="stats">
						<Card>
							<CardHeader>
								<CardTitle>Stats Section</CardTitle>
								<CardDescription>Animated counter numbers shown in the primary colour band below the hero.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{statsArray.fields.map((field, index) => (
									<div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
										<div className="flex items-center text-muted-foreground pt-2">
											<GripVertical className="h-5 w-5" />
										</div>
										<div className="flex-1 space-y-4">
											<div className="grid gap-4 md:grid-cols-3">
												<div className="space-y-2">
													<Label>Value</Label>
													<Input
														type="number"
														{...form.register(`stats.${index}.value`, { valueAsNumber: true })}
														value={form.watch(`stats.${index}.value`) ?? ""}
														placeholder="60"
													/>
												</div>
												<div className="space-y-2">
													<Label>Suffix</Label>
													<Input {...form.register(`stats.${index}.suffix`)} value={form.watch(`stats.${index}.suffix`) || ""} placeholder="+" />
												</div>
											</div>
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Label (DE)</Label>
													<Input {...form.register(`stats.${index}.labelDe`)} value={form.watch(`stats.${index}.labelDe`) || ""} placeholder="Jahre Geschichte" />
												</div>
												<div className="space-y-2">
													<Label>Label (EN)</Label>
													<Input {...form.register(`stats.${index}.labelEn`)} value={form.watch(`stats.${index}.labelEn`) || ""} placeholder="Years of History" />
												</div>
											</div>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={async () => {
												const confirmed = await confirm({ title: "Remove Stat", description: "Remove this stat item?", confirmText: "Remove" });
												if (confirmed) statsArray.remove(index);
											}}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								))}
								<Button type="button" variant="outline" onClick={() => statsArray.append({ value: 0, suffix: "", labelDe: "", labelEn: "" })}>
									<Plus className="mr-2 h-4 w-4" />
									Add Stat
								</Button>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ── INTRO TAB ── */}
					<TabsContent value="intro">
						<Card>
							<CardHeader>
								<CardTitle>Intro Section</CardTitle>
								<CardDescription>Short introductory text block below the stats band.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Tagline (DE)</Label>
										<Input {...form.register("intro.taglineDe")} value={form.watch("intro.taglineDe") || ""} placeholder="Unsere Wurzeln" />
									</div>
									<div className="space-y-2">
										<Label>Tagline (EN)</Label>
										<Input {...form.register("intro.taglineEn")} value={form.watch("intro.taglineEn") || ""} placeholder="Our Roots" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input {...form.register("intro.headingDe")} value={form.watch("intro.headingDe") || ""} placeholder="Von Gastarbeitern..." />
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input {...form.register("intro.headingEn")} value={form.watch("intro.headingEn") || ""} placeholder="From Guest Workers..." />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Paragraph (DE)</Label>
										<Textarea {...form.register("intro.paragraphDe")} value={form.watch("intro.paragraphDe") || ""} rows={5} />
									</div>
									<div className="space-y-2">
										<Label>Paragraph (EN)</Label>
										<Textarea {...form.register("intro.paragraphEn")} value={form.watch("intro.paragraphEn") || ""} rows={5} />
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ── ARTICLES TAB ── */}
					<TabsContent value="articles">
						<Card>
							<CardHeader>
								<CardTitle>Article Sections</CardTitle>
								<CardDescription>
									Each article has a heading, two paragraphs, an image, and a caption. Direction controls whether the image sits left or right.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{articlesArray.fields.map((field, index) => (
									<div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
										<div className="flex items-center text-muted-foreground pt-2">
											<GripVertical className="h-5 w-5" />
										</div>
										<div className="flex-1 space-y-4">
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Heading (DE)</Label>
													<Input {...form.register(`articles.${index}.headingDe`)} value={form.watch(`articles.${index}.headingDe`) || ""} />
												</div>
												<div className="space-y-2">
													<Label>Heading (EN)</Label>
													<Input {...form.register(`articles.${index}.headingEn`)} value={form.watch(`articles.${index}.headingEn`) || ""} />
												</div>
											</div>
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Paragraph 1 (DE)</Label>
													<Textarea {...form.register(`articles.${index}.paragraph1De`)} value={form.watch(`articles.${index}.paragraph1De`) || ""} rows={4} />
												</div>
												<div className="space-y-2">
													<Label>Paragraph 1 (EN)</Label>
													<Textarea {...form.register(`articles.${index}.paragraph1En`)} value={form.watch(`articles.${index}.paragraph1En`) || ""} rows={4} />
												</div>
											</div>
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Paragraph 2 (DE)</Label>
													<Textarea {...form.register(`articles.${index}.paragraph2De`)} value={form.watch(`articles.${index}.paragraph2De`) || ""} rows={4} />
												</div>
												<div className="space-y-2">
													<Label>Paragraph 2 (EN)</Label>
													<Textarea {...form.register(`articles.${index}.paragraph2En`)} value={form.watch(`articles.${index}.paragraph2En`) || ""} rows={4} />
												</div>
											</div>
											<div className="space-y-2">
												<Label>Image</Label>
												<MediaPicker
													type="image"
													value={form.watch(`articles.${index}.image`) || null}
													onChange={(url) => form.setValue(`articles.${index}.image`, url || "")}
													placeholder="Select article image"
													galleryTitle="Select Article Image"
												/>
											</div>
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Caption (DE)</Label>
													<Input {...form.register(`articles.${index}.captionDe`)} value={form.watch(`articles.${index}.captionDe`) || ""} />
												</div>
												<div className="space-y-2">
													<Label>Caption (EN)</Label>
													<Input {...form.register(`articles.${index}.captionEn`)} value={form.watch(`articles.${index}.captionEn`) || ""} />
												</div>
											</div>
											<div className="space-y-2">
												<Label>Image Direction</Label>
												<select
													className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
													value={form.watch(`articles.${index}.direction`) || "left"}
													onChange={(e) => form.setValue(`articles.${index}.direction`, e.target.value as "left" | "right")}
												>
													<option value="left">Left (image on left)</option>
													<option value="right">Right (image on right)</option>
												</select>
											</div>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={async () => {
												const confirmed = await confirm({ title: "Remove Article", description: "Remove this article section?", confirmText: "Remove" });
												if (confirmed) articlesArray.remove(index);
											}}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									onClick={() => articlesArray.append({ headingDe: "", headingEn: "", paragraph1De: "", paragraph1En: "", paragraph2De: "", paragraph2En: "", image: "", captionDe: "", captionEn: "", direction: "left" })}
								>
									<Plus className="mr-2 h-4 w-4" />
									Add Article Section
								</Button>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ── TIMELINE EVENTS TAB ── */}
					<TabsContent value="events">
						<Card>
							<CardHeader>
								<CardTitle>Timeline Events (Gallery Grid)</CardTitle>
								<CardDescription>Cards shown in the milestone gallery grid at the bottom of the page.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{eventsArray.fields.map((field, index) => (
									<div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
										<div className="flex items-center text-muted-foreground pt-2">
											<GripVertical className="h-5 w-5" />
										</div>
										<div className="flex-1 space-y-4">
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Year (DE)</Label>
													<Input {...form.register(`events.${index}.yearDe`)} value={form.watch(`events.${index}.yearDe`) || ""} placeholder="1965" />
												</div>
												<div className="space-y-2">
													<Label>Year (EN)</Label>
													<Input {...form.register(`events.${index}.yearEn`)} value={form.watch(`events.${index}.yearEn`) || ""} placeholder="1965" />
												</div>
											</div>
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Title (DE)</Label>
													<Input {...form.register(`events.${index}.titleDe`)} value={form.watch(`events.${index}.titleDe`) || ""} />
												</div>
												<div className="space-y-2">
													<Label>Title (EN)</Label>
													<Input {...form.register(`events.${index}.titleEn`)} value={form.watch(`events.${index}.titleEn`) || ""} />
												</div>
											</div>
											<div className="grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Text (DE)</Label>
													<Textarea {...form.register(`events.${index}.textDe`)} value={form.watch(`events.${index}.textDe`) || ""} rows={3} />
												</div>
												<div className="space-y-2">
													<Label>Text (EN)</Label>
													<Textarea {...form.register(`events.${index}.textEn`)} value={form.watch(`events.${index}.textEn`) || ""} rows={3} />
												</div>
											</div>
											<div className="space-y-2">
												<Label>Image</Label>
												<MediaPicker
													type="image"
													value={form.watch(`events.${index}.image`) || null}
													onChange={(url) => form.setValue(`events.${index}.image`, url || "")}
													placeholder="Select event image"
													galleryTitle="Select Event Image"
												/>
											</div>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={async () => {
												const confirmed = await confirm({ title: "Remove Event", description: "Remove this timeline event?", confirmText: "Remove" });
												if (confirmed) eventsArray.remove(index);
											}}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									onClick={() => eventsArray.append({ yearDe: "", yearEn: "", titleDe: "", titleEn: "", textDe: "", textEn: "", image: "" })}
								>
									<Plus className="mr-2 h-4 w-4" />
									Add Timeline Event
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
