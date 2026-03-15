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
	Quote,
	Search,
	HelpCircle,
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

const searchSectionSchema = z.object({
	tagDe: z.string().max(100).optional(),
	tagEn: z.string().max(100).optional(),
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	descriptionDe: z.string().max(1000).optional(),
	descriptionEn: z.string().max(1000).optional(),
	placeholderDe: z.string().max(200).optional(),
	placeholderEn: z.string().max(200).optional(),
});

const faqItemSchema = z.object({
	titleDe: z.string().max(300).optional(),
	titleEn: z.string().max(300).optional(),
	contentDe: z.string().optional(),
	contentEn: z.string().optional(),
});

const faqSectionSchema = z.object({
	tagDe: z.string().max(100).optional(),
	tagEn: z.string().max(100).optional(),
	headingDe: z.string().max(300).optional(),
	headingEn: z.string().max(300).optional(),
	descriptionDe: z.string().max(1000).optional(),
	descriptionEn: z.string().max(1000).optional(),
	items: z.array(faqItemSchema).optional(),
});

const testimonialSchema = z.object({
	nameDe: z.string().max(200).optional(),
	nameEn: z.string().max(200).optional(),
	roleDe: z.string().max(200).optional(),
	roleEn: z.string().max(200).optional(),
	quoteDe: z.string().max(1000).optional(),
	quoteEn: z.string().max(1000).optional(),
	image: z.string().optional(),
});

const testimonialsSectionSchema = z.object({
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	items: z.array(testimonialSchema).optional(),
});

const formSchema = z.object({
	hero: heroSchema,
	searchSection: searchSectionSchema,
	faqSection: faqSectionSchema,
	testimonials: testimonialsSectionSchema,
});

type FormData = z.infer<typeof formSchema>;

// Default 14 Satzung items to pre-populate the FAQ tab on first load
const defaultFaqItems = [
	{ titleDe: "Name und Sitz", titleEn: "Name and Registered Office", contentDe: "Der Verband f\u00FChrt den Namen \u201EZentralverband der Assyrischen Vereinigungen in Deutschland e.V.\u201C (ZAVD). Der Sitz des Verbands ist in G\u00FCtersloh. Der Verband ist im Vereinsregister eingetragen.", contentEn: "The association bears the name 'Central Association of Assyrian Associations in Germany e.V.' (ZAVD). The registered office of the association is in G\u00FCtersloh. The association is entered in the register of associations." },
	{ titleDe: "Verbandszweck und -ziele", titleEn: "Association Purpose and Objectives", contentDe: "Der Verband ist eine Dachorganisation seiner in Deutschland, \u00D6sterreich und der Schweiz bestehenden assyrischen Vereinigungen.\n1. Zweck des Verbandes ist es, den Assyrern zu helfen.\n2. Der Verband initiiert und unterst\u00FCtzt Entwicklungshilfema\u00DFnahmen.\n3. Der Verband bekennt sich zur freiheitlich-demokratischen Grundordnung.\n4. Der Satzungszweck wird verwirklicht durch Zusammenarbeit mit Menschenrechtsorganisationen.\n5. Der Verband koordiniert die Arbeit seiner Mitglieder.\n6. Der Verband erkennt den Assyrischen Jugendverband Mitteleuropa (AJM) e.V. als seinen Jugendverband an.\n7. Der Verband erkennt die Assyrian Confederation of Europe (ACE) als seine europaweite Dachorganisation an.", contentEn: "The association is an umbrella organization of its Assyrian associations in Germany, Austria, and Switzerland.\n1. The purpose is to help Assyrians who are discriminated against as an ethnic and Christian-religious minority.\n2. The association initiates and supports development aid measures.\n3. The association commits to the free democratic basic order and European values.\n4. The statutory purpose is realized by cooperation with human rights organizations.\n5. The association coordinates the work of its members.\n6. The association recognizes the Assyrian Youth Association Central Europe (AJM) e.V. as its youth association.\n7. The association recognizes the Assyrian Confederation of Europe (ACE) as its Europe-wide umbrella organization." },
	{ titleDe: "Gemeinn\u00FCtzigkeit", titleEn: "Non-Profit Status", contentDe: "Der Verband verfolgt ausschlie\u00DFlich und unmittelbar gemeinn\u00FCtzige Zwecke im Sinne des Abschnitts \u201ESteuerbeg\u00FCnstigte Zwecke\u201C der Abgabenordnung. Der Verband ist selbstlos t\u00E4tig; er verfolgt nicht in erster Linie eigenwirtschaftliche Zwecke. Mittel des Verbands d\u00FCrfen nur f\u00FCr die satzungsm\u00E4\u00DFigen Zwecke verwendet werden.", contentEn: "The association exclusively and directly pursues non-profit purposes within the meaning of the section 'Tax-privileged purposes' of the Tax Code. The association acts selflessly. The association's funds may only be used for statutory purposes." },
	{ titleDe: "Mitgliedschaft", titleEn: "Membership", contentDe: "Mitglied des Verbandes kann jeder assyrische Verein in Deutschland, \u00D6sterreich und der Schweiz werden, der die Ziele des Verbandes anerkennt. \u00DCber die Aufnahme entscheidet der Vorstand. Die Mitgliedschaft endet durch Austritt, Ausschluss oder Aufl\u00F6sung des Mitgliedsvereins.", contentEn: "Any Assyrian association in Germany, Austria, and Switzerland that recognizes the goals of the association may become a member. The board decides on admission. Membership ends by withdrawal, exclusion, or dissolution of the member association." },
	{ titleDe: "Mitgliedsbeitr\u00E4ge und Mittel", titleEn: "Membership Fees and Resources", contentDe: "Die Mitgliedsvereine zahlen einen Jahresbeitrag. Die H\u00F6he des Jahresbeitrags wird von der Delegiertenversammlung festgesetzt. Die Mittel des Verbandes d\u00FCrfen nur f\u00FCr die in der Satzung genannten Zwecke verwendet werden.", contentEn: "Member associations pay an annual fee determined by the delegates' assembly. The association's funds may only be used for the purposes stated in the statutes." },
	{ titleDe: "Organe", titleEn: "Governing Bodies", contentDe: "Die Organe des Verbandes sind: 1. Die Delegiertenversammlung, 2. Der Vorstand, 3. Der gesch\u00E4ftsf\u00FChrende Vorstand, 4. Der Aufsichtsrat. Die Organe f\u00FChren ihre T\u00E4tigkeiten ehrenamtlich durch.", contentEn: "The governing bodies are: 1. The Delegates' Assembly, 2. The Board, 3. The Managing Board, 4. The Supervisory Board. They carry out their activities on a voluntary basis." },
	{ titleDe: "Delegiertenversammlung", titleEn: "Delegates' Assembly", contentDe: "Die Delegiertenversammlung ist das h\u00F6chste Organ des Verbandes. Sie tritt mindestens einmal j\u00E4hrlich zusammen. Die Einladung erfolgt mindestens vier Wochen vorher schriftlich. Sie ist zust\u00E4ndig f\u00FCr: Jahresbericht, Entlastung des Vorstands, Wahl des Vorstands, Mitgliedsbeitr\u00E4ge, Satzungs\u00E4nderungen und Aufl\u00F6sung.", contentEn: "The Delegates' Assembly is the highest governing body. It meets at least once a year with four weeks' written notice. It is responsible for: annual report, discharging the board, electing the board, membership fees, statute amendments, and dissolution." },
	{ titleDe: "Delegiertenschl\u00FCssel", titleEn: "Delegate Allocation", contentDe: "Jeder Mitgliedsverein entsendet Delegierte zur Delegiertenversammlung. Der Schl\u00FCssel richtet sich nach der Mitgliederzahl. Jeder Mitgliedsverein hat mindestens eine Stimme.", contentEn: "Each member association sends delegates based on membership size. Each member association has at least one vote." },
	{ titleDe: "Vorstand", titleEn: "Board of Directors", contentDe: "Der Vorstand besteht aus dem gesch\u00E4ftsf\u00FChrenden Vorstand und weiteren Mitgliedern. Er wird f\u00FCr eine Amtszeit von vier Jahren gew\u00E4hlt. Er tritt mindestens zweimal j\u00E4hrlich zusammen.", contentEn: "The Board of Directors consists of the managing board and additional members, elected for a four-year term. It meets at least twice a year." },
	{ titleDe: "Gesch\u00E4ftsf\u00FChrender Vorstand", titleEn: "Managing Board", contentDe: "Der gesch\u00E4ftsf\u00FChrende Vorstand besteht aus dem 1. Vorsitzenden, dem 2. Vorsitzenden, dem Schatzmeister und dem Schriftf\u00FChrer. Er ist der gesetzliche Vertreter des Verbandes im Sinne des \u00A7 26 BGB.", contentEn: "The managing board consists of the 1st chairperson, 2nd chairperson, treasurer, and secretary. It is the legal representative of the association within the meaning of \u00A7 26 BGB." },
	{ titleDe: "Aufsichtsrat", titleEn: "Supervisory Board", contentDe: "Der Aufsichtsrat besteht aus drei Mitgliedern, die f\u00FCr vier Jahre gew\u00E4hlt werden. Er \u00FCberwacht die T\u00E4tigkeit des Vorstands und erstattet der Delegiertenversammlung Bericht.", contentEn: "The Supervisory Board consists of three members elected for four years. It monitors the board's activities and reports to the Delegates' Assembly." },
	{ titleDe: "Beschl\u00FCsse", titleEn: "Resolutions", contentDe: "Beschl\u00FCsse werden mit einfacher Mehrheit gefasst. Satzungs\u00E4nderungen bed\u00FCrfen einer Zweidrittelmehrheit. Die Aufl\u00F6sung des Verbandes bedarf einer Dreiviertelmehrheit.", contentEn: "Resolutions are passed by simple majority. Statute amendments require a two-thirds majority. Dissolution of the association requires a three-quarters majority." },
	{ titleDe: "Wahlen", titleEn: "Elections", contentDe: "Wahlen werden grunds\u00E4tzlich geheim durchgef\u00FChrt. Auf Antrag kann offen gew\u00E4hlt werden. Bei Stimmengleichheit findet eine Stichwahl statt. Ist auch diese unentschieden, entscheidet das Los.", contentEn: "Elections are generally conducted by secret ballot. Open voting may be used if no member objects. In the event of a tie, a runoff takes place; if also tied, the decision is made by lot." },
	{ titleDe: "Aufl\u00F6sung", titleEn: "Dissolution", contentDe: "Die Aufl\u00F6sung kann nur von einer au\u00DFerordentlichen Delegiertenversammlung mit einer Dreiviertelmehrheit beschlossen werden. Das Verm\u00F6gen f\u00E4llt an eine steuerbeg\u00FCnstigte K\u00F6rperschaft zur F\u00F6rderung der assyrischen Kultur und Sprache.", contentEn: "Dissolution can only be decided by an extraordinary Delegates' Assembly with a three-quarters majority. The assets shall pass to a tax-privileged body for the promotion of Assyrian culture and language." },
];

const defaultValues: FormData = {
	hero: {
		taglineDe: "Rechtliches Rahmenwerk",
		taglineEn: "Legal Framework",
		titleDe: "Satzung",
		titleEn: "Statutes",
		subtitleDe: "Das rechtliche Fundament, das den ZAVD regelt und die Mission und Werte unserer Gemeinschaft leitet.",
		subtitleEn: "The legal foundation that governs the ZAVD and guides our community's mission and values.",
		image: "/images/about/aboutbanner.jpg",
	},
	searchSection: {
		tagDe: "Verfassung",
		tagEn: "Constitution",
		headingDe: "Alle 14 Abschnitte erkunden",
		headingEn: "Explore All 14 Sections",
		descriptionDe: "Durchsuchen Sie die vollständige Satzung des ZAVD. Nutzen Sie die Suche, um den gewünschten Abschnitt schnell zu finden.",
		descriptionEn: "Browse through the complete statutes of the ZAVD. Use the search to quickly find the section you need.",
		placeholderDe: "Abschnitte suchen…",
		placeholderEn: "Search sections…",
	},
	faqSection: {
		tagDe: "Satzung",
		tagEn: "Statutes",
		headingDe: "Häufig gestellte Fragen",
		headingEn: "Frequently Asked Questions(FAQ)",
		descriptionDe: "Hier finden Sie Antworten auf häufige Fragen zur ZAVD-Satzung und ihrer Organisationsstruktur.",
		descriptionEn: "Find answers to common questions about the ZAVD statutes and its governing structure.",
		items: defaultFaqItems,
	},
	testimonials: {
		headingDe: "Was unsere Gemeinschaft sagt",
		headingEn: "What Our Community Says",
		items: [],
	},
};

function arrayToText(arr?: string[]): string {
	if (!arr || arr.length === 0) return "";
	return arr.join("\n");
}

function textToArray(text?: string): string[] {
	if (!text || !text.trim()) return [];
	return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

export default function SatzungAdminPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const faqItems = useFieldArray({
		control: form.control,
		name: "faqSection.items",
	});

	const testimonialItems = useFieldArray({
		control: form.control,
		name: "testimonials.items",
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/satzung-page");
				if (res.ok) {
					const data = await res.json();
					// updatedAt > createdAt means user explicitly saved at least once, so trust DB (even empty)
					const hasBeenExplicitlySaved =
						data.updatedAt && data.createdAt &&
						new Date(data.updatedAt).getTime() > new Date(data.createdAt).getTime();
					const faqItemsFromApi = hasBeenExplicitlySaved
						? (data.faqSection?.items ?? [])
						: (data.faqSection?.items?.length ? data.faqSection.items : defaultFaqItems);
					form.reset({
						hero: { ...defaultValues.hero, ...data.hero },
						searchSection: { ...defaultValues.searchSection, ...data.searchSection },
						faqSection: {
							...defaultValues.faqSection,
							...data.faqSection,
							items: faqItemsFromApi.map((item: { titleDe?: string; titleEn?: string; contentDe?: string[] | string; contentEn?: string[] | string }) => ({
								titleDe: item.titleDe || "",
								titleEn: item.titleEn || "",
								contentDe: Array.isArray(item.contentDe) ? arrayToText(item.contentDe) : (item.contentDe || ""),
								contentEn: Array.isArray(item.contentEn) ? arrayToText(item.contentEn) : (item.contentEn || ""),
							})),
						},
						testimonials: {
							...defaultValues.testimonials,
							...data.testimonials,
							items: data.testimonials?.items || [],
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
			const payload = {
				...data,
				faqSection: {
					...data.faqSection,
					items: (data.faqSection.items || []).map((item) => ({
						titleDe: item.titleDe,
						titleEn: item.titleEn,
						contentDe: textToArray(item.contentDe),
						contentEn: textToArray(item.contentEn),
					})),
				},
			};

			const res = await fetch("/api/satzung-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const responseData = await res.json();
			if (res.ok) {
				toast.success("Satzung page saved successfully");
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
					<h1 className="text-3xl font-medium tracking-tight">Satzung (Statutes)</h1>
					<p className="text-muted-foreground">
						Manage the Statutes page content in German and English.
					</p>
				</div>
				<a
					href="/uber-zavd/satzung"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<form id="satzung-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Tabs defaultValue="hero" className="space-y-6">
					<TabsList className="flex-wrap h-auto justify-start">
						<TabsTrigger value="hero" className="gap-2">
							<ImageIcon className="h-4 w-4" />
							Hero
						</TabsTrigger>
						<TabsTrigger value="search" className="gap-2">
							<Search className="h-4 w-4" />
							Search Section
						</TabsTrigger>
						<TabsTrigger value="faq" className="gap-2">
							<HelpCircle className="h-4 w-4" />
							FAQ
						</TabsTrigger>
						<TabsTrigger value="testimonials" className="gap-2">
							<Quote className="h-4 w-4" />
							Testimonials
						</TabsTrigger>
					</TabsList>

					{/* ── HERO TAB ── */}
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
										<Label>Tagline (DE)</Label>
										<Input
											{...form.register("hero.taglineDe")}
											value={form.watch("hero.taglineDe") || ""}
											placeholder="Rechtliches Rahmenwerk"
										/>
									</div>
									<div className="space-y-2">
										<Label>Tagline (EN)</Label>
										<Input
											{...form.register("hero.taglineEn")}
											value={form.watch("hero.taglineEn") || ""}
											placeholder="Legal Framework"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Title (DE)</Label>
										<Input
											{...form.register("hero.titleDe")}
											value={form.watch("hero.titleDe") || ""}
											placeholder="Satzung"
										/>
									</div>
									<div className="space-y-2">
										<Label>Title (EN)</Label>
										<Input
											{...form.register("hero.titleEn")}
											value={form.watch("hero.titleEn") || ""}
											placeholder="Statutes"
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

					{/* ── SEARCH SECTION TAB ── */}
					<TabsContent value="search">
						<Card>
							<CardHeader>
								<CardTitle>Search Section</CardTitle>
								<CardDescription>
									The intro text and search bar displayed above the FAQ accordion.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Tag Label (DE)</Label>
										<Input
											{...form.register("searchSection.tagDe")}
											value={form.watch("searchSection.tagDe") || ""}
											placeholder="Verfassung"
										/>
									</div>
									<div className="space-y-2">
										<Label>Tag Label (EN)</Label>
										<Input
											{...form.register("searchSection.tagEn")}
											value={form.watch("searchSection.tagEn") || ""}
											placeholder="Constitution"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input
											{...form.register("searchSection.headingDe")}
											value={form.watch("searchSection.headingDe") || ""}
											placeholder="Alle 14 Abschnitte erkunden"
										/>
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input
											{...form.register("searchSection.headingEn")}
											value={form.watch("searchSection.headingEn") || ""}
											placeholder="Explore All 14 Sections"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Description (DE)</Label>
										<Textarea
											{...form.register("searchSection.descriptionDe")}
											value={form.watch("searchSection.descriptionDe") || ""}
											rows={3}
										/>
									</div>
									<div className="space-y-2">
										<Label>Description (EN)</Label>
										<Textarea
											{...form.register("searchSection.descriptionEn")}
											value={form.watch("searchSection.descriptionEn") || ""}
											rows={3}
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Search Placeholder (DE)</Label>
										<Input
											{...form.register("searchSection.placeholderDe")}
											value={form.watch("searchSection.placeholderDe") || ""}
											placeholder="Abschnitte suchen…"
										/>
									</div>
									<div className="space-y-2">
										<Label>Search Placeholder (EN)</Label>
										<Input
											{...form.register("searchSection.placeholderEn")}
											value={form.watch("searchSection.placeholderEn") || ""}
											placeholder="Search sections…"
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ── FAQ TAB ── */}
					<TabsContent value="faq">
						<Card>
							<CardHeader>
								<CardTitle>FAQ Section</CardTitle>
								<CardDescription>
									Section heading and the accordion items (Satzung paragraphs). Each content line = one bullet point.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Tag Label (DE)</Label>
										<Input
											{...form.register("faqSection.tagDe")}
											value={form.watch("faqSection.tagDe") || ""}
											placeholder="Satzung"
										/>
									</div>
									<div className="space-y-2">
										<Label>Tag Label (EN)</Label>
										<Input
											{...form.register("faqSection.tagEn")}
											value={form.watch("faqSection.tagEn") || ""}
											placeholder="Statutes"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Section Heading (DE)</Label>
										<Input
											{...form.register("faqSection.headingDe")}
											value={form.watch("faqSection.headingDe") || ""}
											placeholder="Häufig gestellte Fragen"
										/>
									</div>
									<div className="space-y-2">
										<Label>Section Heading (EN)</Label>
										<Input
											{...form.register("faqSection.headingEn")}
											value={form.watch("faqSection.headingEn") || ""}
											placeholder="Frequently Asked Questions"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Section Description (DE)</Label>
										<Textarea
											{...form.register("faqSection.descriptionDe")}
											value={form.watch("faqSection.descriptionDe") || ""}
											rows={2}
										/>
									</div>
									<div className="space-y-2">
										<Label>Section Description (EN)</Label>
										<Textarea
											{...form.register("faqSection.descriptionEn")}
											value={form.watch("faqSection.descriptionEn") || ""}
											rows={2}
										/>
									</div>
								</div>

								{/* FAQ Items */}
								<div className="space-y-4">
									<div>
										<p className="text-sm font-medium">FAQ Items (Satzung Paragraphs)</p>
										<p className="text-xs text-muted-foreground mt-0.5">
											Each line in the content field becomes a separate bullet point.
										</p>
									</div>
									{faqItems.fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-3 p-4 border rounded-lg"
										>
											<div className="flex items-center text-muted-foreground pt-2">
												<GripVertical className="h-5 w-5" />
											</div>
											<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-2">
												<span className="text-xs font-bold text-primary">§{index + 1}</span>
											</div>
											<div className="flex-1 space-y-4">
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Title (DE)</Label>
														<Input
															{...form.register(`faqSection.items.${index}.titleDe`)}
															value={form.watch(`faqSection.items.${index}.titleDe`) || ""}
															placeholder="Name und Sitz"
														/>
													</div>
													<div className="space-y-2">
														<Label>Title (EN)</Label>
														<Input
															{...form.register(`faqSection.items.${index}.titleEn`)}
															value={form.watch(`faqSection.items.${index}.titleEn`) || ""}
															placeholder="Name and Registered Office"
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Content (DE) — one bullet per line</Label>
														<Textarea
															{...form.register(`faqSection.items.${index}.contentDe`)}
															value={form.watch(`faqSection.items.${index}.contentDe`) || ""}
															rows={5}
														/>
													</div>
													<div className="space-y-2">
														<Label>Content (EN) — one bullet per line</Label>
														<Textarea
															{...form.register(`faqSection.items.${index}.contentEn`)}
															value={form.watch(`faqSection.items.${index}.contentEn`) || ""}
															rows={5}
														/>
													</div>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => {
														if (window.confirm("Remove this FAQ item?")) {
															faqItems.remove(index);
														}
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
											faqItems.append({
												titleDe: "",
												titleEn: "",
												contentDe: "",
												contentEn: "",
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add FAQ Item
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ── TESTIMONIALS TAB ── */}
					<TabsContent value="testimonials">
						<Card>
							<CardHeader>
								<CardTitle>Testimonials Section</CardTitle>
								<CardDescription>
									Community member quotes displayed in the carousel below the FAQ accordion.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Section Heading (DE)</Label>
										<Input
											{...form.register("testimonials.headingDe")}
											value={form.watch("testimonials.headingDe") || ""}
											placeholder="Was unsere Gemeinschaft sagt"
										/>
									</div>
									<div className="space-y-2">
										<Label>Section Heading (EN)</Label>
										<Input
											{...form.register("testimonials.headingEn")}
											value={form.watch("testimonials.headingEn") || ""}
											placeholder="What Our Community Says"
										/>
									</div>
								</div>

								<div className="space-y-4">
									<p className="text-sm font-medium">Testimonials</p>
									{testimonialItems.fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-4 p-4 border rounded-lg"
										>
											<div className="flex items-center text-muted-foreground pt-2">
												<GripVertical className="h-5 w-5" />
											</div>
											<div className="flex-1 space-y-4">
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Name (DE)</Label>
														<Input
															{...form.register(`testimonials.items.${index}.nameDe`)}
															value={form.watch(`testimonials.items.${index}.nameDe`) || ""}
															placeholder="Dr. George Aziz"
														/>
													</div>
													<div className="space-y-2">
														<Label>Name (EN)</Label>
														<Input
															{...form.register(`testimonials.items.${index}.nameEn`)}
															value={form.watch(`testimonials.items.${index}.nameEn`) || ""}
															placeholder="Dr. George Aziz"
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Role (DE)</Label>
														<Input
															{...form.register(`testimonials.items.${index}.roleDe`)}
															value={form.watch(`testimonials.items.${index}.roleDe`) || ""}
															placeholder="Mitgliedsverein, Hannover"
														/>
													</div>
													<div className="space-y-2">
														<Label>Role (EN)</Label>
														<Input
															{...form.register(`testimonials.items.${index}.roleEn`)}
															value={form.watch(`testimonials.items.${index}.roleEn`) || ""}
															placeholder="Member Association, Hanover"
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Quote (DE)</Label>
														<Textarea
															{...form.register(`testimonials.items.${index}.quoteDe`)}
															value={form.watch(`testimonials.items.${index}.quoteDe`) || ""}
															rows={4}
															placeholder="Die ZAVD-Satzung bildet das Fundament..."
														/>
													</div>
													<div className="space-y-2">
														<Label>Quote (EN)</Label>
														<Textarea
															{...form.register(`testimonials.items.${index}.quoteEn`)}
															value={form.watch(`testimonials.items.${index}.quoteEn`) || ""}
															rows={4}
															placeholder="The ZAVD statutes form the foundation..."
														/>
													</div>
												</div>
												<div className="space-y-2">
													<Label>Photo</Label>
													<MediaPicker
														type="image"
														value={form.watch(`testimonials.items.${index}.image`) || null}
														onChange={(url) =>
															form.setValue(`testimonials.items.${index}.image`, url || "")
														}
														placeholder="Select testimonial photo"
														galleryTitle="Select Testimonial Photo"
													/>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={async () => {
													const confirmed = await confirm({
														title: "Remove Testimonial",
														description: "Are you sure you want to remove this testimonial?",
														confirmText: "Remove",
													});
													if (confirmed) testimonialItems.remove(index);
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
											testimonialItems.append({
												nameDe: "",
												nameEn: "",
												roleDe: "",
												roleEn: "",
												quoteDe: "",
												quoteEn: "",
												image: "",
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Testimonial
									</Button>
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
