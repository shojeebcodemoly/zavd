"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
	Eye,
	HelpCircle,
	BarChart3,
	Mail,
	Search,
	MessageSquare,
	Sidebar,
	ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";
import { useConfirmModal } from "@/components/ui/confirm-modal";

// ============================================================================
// LOCAL ZOD SCHEMAS
// ============================================================================
const faqSectionVisibilitySchema = z.object({
	hero: z.boolean(),
	faqContent: z.boolean(),
	sidebar: z.boolean(),
	newsletter: z.boolean(),
});

const faqHeroStatSchema = z.object({
	value: z.string().max(50).optional(),
	labelDe: z.string().max(100).optional(),
	labelEn: z.string().max(100).optional(),
});

const faqHeroSectionSchema = z.object({
	badgeDe: z.string().max(100).optional(),
	badgeEn: z.string().max(100).optional(),
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	titleHighlightDe: z.string().max(200).optional(),
	titleHighlightEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(1000).optional(),
	subtitleEn: z.string().max(1000).optional(),
	stats: z.array(faqHeroStatSchema).optional(),
});

const faqItemSchema = z.object({
	questionDe: z.string().max(500).optional(),
	questionEn: z.string().max(500).optional(),
	answerDe: z.string().max(5000).optional(),
	answerEn: z.string().max(5000).optional(),
	category: z.string().max(100).optional(),
	order: z.number().optional(),
});

const faqCategorySchema = z.object({
	id: z.string().max(50).optional(),
	nameDe: z.string().max(100).optional(),
	nameEn: z.string().max(100).optional(),
	icon: z.string().max(50).optional(),
	order: z.number().optional(),
});

const faqContentSectionSchema = z.object({
	searchPlaceholderDe: z.string().max(200).optional(),
	searchPlaceholderEn: z.string().max(200).optional(),
	noResultsTextDe: z.string().max(500).optional(),
	noResultsTextEn: z.string().max(500).optional(),
	helpTextDe: z.string().max(500).optional(),
	helpTextEn: z.string().max(500).optional(),
	helpButtonTextDe: z.string().max(100).optional(),
	helpButtonTextEn: z.string().max(100).optional(),
	helpButtonHref: z.string().max(500).optional(),
	categories: z.array(faqCategorySchema).optional(),
	items: z.array(faqItemSchema).optional(),
});

const faqQuickLinkSchema = z.object({
	labelDe: z.string().max(100).optional(),
	labelEn: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
});

const faqOfficeSchema = z.object({
	name: z.string().max(100).optional(),
	address: z.string().max(500).optional(),
});

const faqSidebarSectionSchema = z.object({
	contactTitleDe: z.string().max(200).optional(),
	contactTitleEn: z.string().max(200).optional(),
	contactDescriptionDe: z.string().max(1000).optional(),
	contactDescriptionEn: z.string().max(1000).optional(),
	phone: z.string().max(50).optional(),
	email: z.string().max(200).optional(),
	officeHours: z.string().max(100).optional(),
	contactButtonTextDe: z.string().max(100).optional(),
	contactButtonTextEn: z.string().max(100).optional(),
	contactButtonHref: z.string().max(500).optional(),
	quickLinksTitleDe: z.string().max(200).optional(),
	quickLinksTitleEn: z.string().max(200).optional(),
	quickLinks: z.array(faqQuickLinkSchema).optional(),
	officesTitleDe: z.string().max(200).optional(),
	officesTitleEn: z.string().max(200).optional(),
	offices: z.array(faqOfficeSchema).optional(),
});

const faqNewsletterSectionSchema = z.object({
	titleDe: z.string().max(200).optional(),
	titleEn: z.string().max(200).optional(),
	subtitleDe: z.string().max(500).optional(),
	subtitleEn: z.string().max(500).optional(),
	inputPlaceholderDe: z.string().max(200).optional(),
	inputPlaceholderEn: z.string().max(200).optional(),
	buttonTextDe: z.string().max(100).optional(),
	buttonTextEn: z.string().max(100).optional(),
	loadingTextDe: z.string().max(100).optional(),
	loadingTextEn: z.string().max(100).optional(),
	successTextDe: z.string().max(200).optional(),
	successTextEn: z.string().max(200).optional(),
	privacyNoteDe: z.string().max(500).optional(),
	privacyNoteEn: z.string().max(500).optional(),
});

const faqPageSeoSchema = z.object({
	title: z.string().max(100).optional(),
	description: z.string().max(300).optional(),
	keywords: z.array(z.string().max(50)).optional(),
	ogImage: z.string().max(500).optional(),
});

const formSchema = z.object({
	sectionVisibility: faqSectionVisibilitySchema,
	hero: faqHeroSectionSchema,
	faqContent: faqContentSectionSchema,
	sidebar: faqSidebarSectionSchema,
	newsletter: faqNewsletterSectionSchema,
	seo: faqPageSeoSchema,
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
	sectionVisibility: {
		hero: true,
		faqContent: true,
		sidebar: true,
		newsletter: true,
	},
	hero: {
		badgeDe: "",
		badgeEn: "",
		titleDe: "",
		titleEn: "",
		titleHighlightDe: "",
		titleHighlightEn: "",
		subtitleDe: "",
		subtitleEn: "",
		stats: [],
	},
	faqContent: {
		searchPlaceholderDe: "",
		searchPlaceholderEn: "",
		noResultsTextDe: "",
		noResultsTextEn: "",
		helpTextDe: "",
		helpTextEn: "",
		helpButtonTextDe: "",
		helpButtonTextEn: "",
		helpButtonHref: "",
		categories: [],
		items: [],
	},
	sidebar: {
		contactTitleDe: "",
		contactTitleEn: "",
		contactDescriptionDe: "",
		contactDescriptionEn: "",
		phone: "",
		email: "",
		officeHours: "",
		contactButtonTextDe: "",
		contactButtonTextEn: "",
		contactButtonHref: "",
		quickLinksTitleDe: "",
		quickLinksTitleEn: "",
		quickLinks: [],
		officesTitleDe: "",
		officesTitleEn: "",
		offices: [],
	},
	newsletter: {
		titleDe: "",
		titleEn: "",
		subtitleDe: "",
		subtitleEn: "",
		inputPlaceholderDe: "",
		inputPlaceholderEn: "",
		buttonTextDe: "",
		buttonTextEn: "",
		loadingTextDe: "",
		loadingTextEn: "",
		successTextDe: "",
		successTextEn: "",
		privacyNoteDe: "",
		privacyNoteEn: "",
	},
	seo: {
		title: "",
		description: "",
		keywords: [],
		ogImage: "",
	},
};

export default function FAQAdminPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	// Field arrays
	const heroStats = useFieldArray({
		control: form.control,
		name: "hero.stats",
	});

	const faqCategories = useFieldArray({
		control: form.control,
		name: "faqContent.categories",
	});

	const faqItems = useFieldArray({
		control: form.control,
		name: "faqContent.items",
	});

	const quickLinks = useFieldArray({
		control: form.control,
		name: "sidebar.quickLinks",
	});

	const offices = useFieldArray({
		control: form.control,
		name: "sidebar.offices",
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const seoKeywords = useFieldArray({
		control: form.control,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		name: "seo.keywords" as any,
	});

	// Fetch data on mount
	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/faq-page");
				if (res.ok) {
					const data = await res.json();
					// Merge with defaults to ensure all fields exist
					form.reset({
						sectionVisibility: {
							...defaultValues.sectionVisibility,
							...data.sectionVisibility,
						},
						hero: {
							...defaultValues.hero,
							...data.hero,
						},
						faqContent: {
							...defaultValues.faqContent,
							...data.faqContent,
						},
						sidebar: {
							...defaultValues.sidebar,
							...data.sidebar,
						},
						newsletter: {
							...defaultValues.newsletter,
							...data.newsletter,
						},
						seo: {
							...defaultValues.seo,
							...data.seo,
						},
					});
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Failed to fetch data");
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, [form]);

	// Helper to format validation errors
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
			const res = await fetch("/api/faq-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const responseData = await res.json();

			if (res.ok) {
				toast.success("FAQ page saved successfully");
			} else {
				const errorMessage = responseData.error || responseData.message || "Failed to save changes";
				const details = responseData.details ? `: ${formatValidationErrors(responseData.details)}` : "";
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
					<h1 className="text-3xl font-medium tracking-tight">FAQ Page</h1>
					<p className="text-muted-foreground">
						Manage the content of the FAQ page.
					</p>
				</div>
				<a
					href="/faq"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<form id="faq-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Tabs defaultValue="visibility" className="space-y-6">
					<TabsList className="flex-wrap h-auto justify-start">
						<TabsTrigger value="visibility" className="gap-2">
							<Eye className="h-4 w-4" />
							Visibility
						</TabsTrigger>
						<TabsTrigger value="hero" className="gap-2">
							<HelpCircle className="h-4 w-4" />
							Hero
						</TabsTrigger>
						<TabsTrigger value="faq-items" className="gap-2">
							<MessageSquare className="h-4 w-4" />
							FAQ Items
						</TabsTrigger>
						<TabsTrigger value="sidebar" className="gap-2">
							<Sidebar className="h-4 w-4" />
							Sidebar
						</TabsTrigger>
						<TabsTrigger value="newsletter" className="gap-2">
							<Mail className="h-4 w-4" />
							Newsletter
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
								<CardDescription>
									Choose which sections to display on the page
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Hero Section</Label>
										<p className="text-sm text-muted-foreground">
											Show the hero section with title and statistics
										</p>
									</div>
									<Switch
										checked={form.watch("sectionVisibility.hero")}
										onCheckedChange={(v) =>
											form.setValue("sectionVisibility.hero", v)
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>FAQ Content</Label>
										<p className="text-sm text-muted-foreground">
											Show FAQ questions and answers
										</p>
									</div>
									<Switch
										checked={form.watch("sectionVisibility.faqContent")}
										onCheckedChange={(v) =>
											form.setValue("sectionVisibility.faqContent", v)
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Sidebar</Label>
										<p className="text-sm text-muted-foreground">
											Show sidebar with contact info and quick links
										</p>
									</div>
									<Switch
										checked={form.watch("sectionVisibility.sidebar")}
										onCheckedChange={(v) =>
											form.setValue("sectionVisibility.sidebar", v)
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Newsletter</Label>
										<p className="text-sm text-muted-foreground">
											Show the newsletter section
										</p>
									</div>
									<Switch
										checked={form.watch("sectionVisibility.newsletter")}
										onCheckedChange={(v) =>
											form.setValue("sectionVisibility.newsletter", v)
										}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Hero Tab */}
					<TabsContent value="hero">
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Hero Section</CardTitle>
									<CardDescription>
										Main title and introduction text
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="hero.badgeDe">Badge (De)</Label>
											<Input
												id="hero.badgeDe"
												{...form.register("hero.badgeDe")}
												value={form.watch("hero.badgeDe") || ""}
												placeholder="Vanliga frågor och svar"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="hero.badgeEn">Badge (En)</Label>
											<Input
												id="hero.badgeEn"
												{...form.register("hero.badgeEn")}
												value={form.watch("hero.badgeEn") || ""}
												placeholder="Frequently Asked Questions"
											/>
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="hero.titleDe">Title (De)</Label>
											<Input
												id="hero.titleDe"
												{...form.register("hero.titleDe")}
												value={form.watch("hero.titleDe") || ""}
												placeholder="Har du frågor om våra"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="hero.titleEn">Title (En)</Label>
											<Input
												id="hero.titleEn"
												{...form.register("hero.titleEn")}
												value={form.watch("hero.titleEn") || ""}
												placeholder="Do you have questions about our"
											/>
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="hero.titleHighlightDe">
												Highlighted Text (De)
											</Label>
											<Input
												id="hero.titleHighlightDe"
												{...form.register("hero.titleHighlightDe")}
												value={form.watch("hero.titleHighlightDe") || ""}
												placeholder="produkter och tjänster?"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="hero.titleHighlightEn">
												Highlighted Text (En)
											</Label>
											<Input
												id="hero.titleHighlightEn"
												{...form.register("hero.titleHighlightEn")}
												value={form.watch("hero.titleHighlightEn") || ""}
												placeholder="products and services?"
											/>
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="hero.subtitleDe">Subtitle (De)</Label>
											<Textarea
												id="hero.subtitleDe"
												{...form.register("hero.subtitleDe")}
												value={form.watch("hero.subtitleDe") || ""}
												placeholder="Här hittar du svar på de vanligaste frågorna..."
												rows={3}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="hero.subtitleEn">Subtitle (En)</Label>
											<Textarea
												id="hero.subtitleEn"
												{...form.register("hero.subtitleEn")}
												value={form.watch("hero.subtitleEn") || ""}
												placeholder="Here you will find answers to the most common questions..."
												rows={3}
											/>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<BarChart3 className="h-5 w-5" />
										Statistics
									</CardTitle>
									<CardDescription>
										Statistics cards displayed in the hero section
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{heroStats.fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-4 p-4 border rounded-lg"
										>
											<div className="flex-1 space-y-4">
												<div className="space-y-2">
													<Label>Value</Label>
													<Input
														{...form.register(
															`hero.stats.${index}.value`
														)}
														value={form.watch(`hero.stats.${index}.value`) || ""}
														placeholder="15+"
													/>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Label (De)</Label>
														<Input
															{...form.register(
																`hero.stats.${index}.labelDe`
															)}
															value={form.watch(`hero.stats.${index}.labelDe`) || ""}
															placeholder="Jahre in der Branche"
														/>
													</div>
													<div className="space-y-2">
														<Label>Label (En)</Label>
														<Input
															{...form.register(
																`hero.stats.${index}.labelEn`
															)}
															value={form.watch(`hero.stats.${index}.labelEn`) || ""}
															placeholder="Years in the industry"
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
														title: "Remove Statistic",
														description: "Are you sure you want to remove this statistic?",
														confirmText: "Remove",
													});
													if (confirmed) heroStats.remove(index);
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
											heroStats.append({ value: "", labelDe: "", labelEn: "" })
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Statistic
									</Button>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* FAQ Items Tab */}
					<TabsContent value="faq-items">
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Search and Help Text</CardTitle>
									<CardDescription>
										Text for search and when no results are found
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="faqContent.searchPlaceholderDe">
												Search Placeholder (De)
											</Label>
											<Input
												id="faqContent.searchPlaceholderDe"
												{...form.register("faqContent.searchPlaceholderDe")}
												value={form.watch("faqContent.searchPlaceholderDe") || ""}
												placeholder="Fragen suchen..."
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="faqContent.searchPlaceholderEn">
												Search Placeholder (En)
											</Label>
											<Input
												id="faqContent.searchPlaceholderEn"
												{...form.register("faqContent.searchPlaceholderEn")}
												value={form.watch("faqContent.searchPlaceholderEn") || ""}
												placeholder="Search questions..."
											/>
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="faqContent.noResultsTextDe">
												No Results Text (De)
											</Label>
											<Input
												id="faqContent.noResultsTextDe"
												{...form.register("faqContent.noResultsTextDe")}
												value={form.watch("faqContent.noResultsTextDe") || ""}
												placeholder="Keine Fragen gefunden..."
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="faqContent.noResultsTextEn">
												No Results Text (En)
											</Label>
											<Input
												id="faqContent.noResultsTextEn"
												{...form.register("faqContent.noResultsTextEn")}
												value={form.watch("faqContent.noResultsTextEn") || ""}
												placeholder="No questions found..."
											/>
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="faqContent.helpTextDe">
												Help Text (De)
											</Label>
											<Input
												id="faqContent.helpTextDe"
												{...form.register("faqContent.helpTextDe")}
												value={form.watch("faqContent.helpTextDe") || ""}
												placeholder="Keine Antwort gefunden?"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="faqContent.helpTextEn">
												Help Text (En)
											</Label>
											<Input
												id="faqContent.helpTextEn"
												{...form.register("faqContent.helpTextEn")}
												value={form.watch("faqContent.helpTextEn") || ""}
												placeholder="Didn't find an answer?"
											/>
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="faqContent.helpButtonTextDe">
												Button Text (De)
											</Label>
											<Input
												id="faqContent.helpButtonTextDe"
												{...form.register("faqContent.helpButtonTextDe")}
												value={form.watch("faqContent.helpButtonTextDe") || ""}
												placeholder="Kontaktieren Sie uns"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="faqContent.helpButtonTextEn">
												Button Text (En)
											</Label>
											<Input
												id="faqContent.helpButtonTextEn"
												{...form.register("faqContent.helpButtonTextEn")}
												value={form.watch("faqContent.helpButtonTextEn") || ""}
												placeholder="Contact us"
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="faqContent.helpButtonHref">
											Button Link
										</Label>
										<Input
											id="faqContent.helpButtonHref"
											{...form.register("faqContent.helpButtonHref")}
											value={form.watch("faqContent.helpButtonHref") || ""}
											placeholder="/kontakt"
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Categories</CardTitle>
									<CardDescription>
										Categories to organize FAQ questions
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{faqCategories.fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-4 p-4 border rounded-lg"
										>
											<div className="flex-1 space-y-4">
												<div className="grid gap-4 md:grid-cols-3">
													<div className="space-y-2">
														<Label>ID</Label>
														<Input
															{...form.register(
																`faqContent.categories.${index}.id`
															)}
															value={form.watch(`faqContent.categories.${index}.id`) || ""}
															placeholder="about"
														/>
													</div>
													<div className="space-y-2">
														<Label>Icon</Label>
														<Input
															{...form.register(
																`faqContent.categories.${index}.icon`
															)}
															value={form.watch(`faqContent.categories.${index}.icon`) || ""}
															placeholder="Building2"
														/>
													</div>
													<div className="space-y-2">
														<Label>Order</Label>
														<Input
															type="number"
															{...form.register(
																`faqContent.categories.${index}.order`,
																{ valueAsNumber: true }
															)}
															placeholder="1"
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Name (De)</Label>
														<Input
															{...form.register(
																`faqContent.categories.${index}.nameDe`
															)}
															value={form.watch(`faqContent.categories.${index}.nameDe`) || ""}
															placeholder="Über uns"
														/>
													</div>
													<div className="space-y-2">
														<Label>Name (En)</Label>
														<Input
															{...form.register(
																`faqContent.categories.${index}.nameEn`
															)}
															value={form.watch(`faqContent.categories.${index}.nameEn`) || ""}
															placeholder="About us"
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
														title: "Remove Category",
														description: "Are you sure you want to remove this category?",
														confirmText: "Remove",
													});
													if (confirmed) faqCategories.remove(index);
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
											faqCategories.append({
												id: "",
												nameDe: "",
												nameEn: "",
												icon: "",
												order: faqCategories.fields.length + 1,
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Category
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>FAQ Questions</CardTitle>
									<CardDescription>
										Questions and answers displayed on the page
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{faqItems.fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-4 p-4 border rounded-lg"
										>
											<div className="flex-1 space-y-4">
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Question (De)</Label>
														<Input
															{...form.register(
																`faqContent.items.${index}.questionDe`
															)}
															value={form.watch(`faqContent.items.${index}.questionDe`) || ""}
															placeholder="Was ist Zavd Medical?"
														/>
													</div>
													<div className="space-y-2">
														<Label>Question (En)</Label>
														<Input
															{...form.register(
																`faqContent.items.${index}.questionEn`
															)}
															value={form.watch(`faqContent.items.${index}.questionEn`) || ""}
															placeholder="What is Zavd Medical?"
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Answer (De)</Label>
														<Textarea
															{...form.register(
																`faqContent.items.${index}.answerDe`
															)}
															value={form.watch(`faqContent.items.${index}.answerDe`) || ""}
															placeholder="Zavd Medical bietet..."
															rows={3}
														/>
													</div>
													<div className="space-y-2">
														<Label>Answer (En)</Label>
														<Textarea
															{...form.register(
																`faqContent.items.${index}.answerEn`
															)}
															value={form.watch(`faqContent.items.${index}.answerEn`) || ""}
															placeholder="Zavd Medical offers..."
															rows={3}
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Category</Label>
														<Input
															{...form.register(
																`faqContent.items.${index}.category`
															)}
															value={form.watch(`faqContent.items.${index}.category`) || ""}
															placeholder="about"
														/>
													</div>
													<div className="space-y-2">
														<Label>Order</Label>
														<Input
															type="number"
															{...form.register(
																`faqContent.items.${index}.order`,
																{ valueAsNumber: true }
															)}
															placeholder="1"
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
														title: "Remove Question",
														description: "Are you sure you want to remove this question?",
														confirmText: "Remove",
													});
													if (confirmed) faqItems.remove(index);
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
												questionDe: "",
												questionEn: "",
												answerDe: "",
												answerEn: "",
												category: "",
												order: faqItems.fields.length + 1,
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Question
									</Button>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Sidebar Tab */}
					<TabsContent value="sidebar">
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Contact Information</CardTitle>
									<CardDescription>
										Contact details in the sidebar
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="sidebar.contactTitleDe">Title (De)</Label>
											<Input
												id="sidebar.contactTitleDe"
												{...form.register("sidebar.contactTitleDe")}
												value={form.watch("sidebar.contactTitleDe") || ""}
												placeholder="Brauchen Sie Hilfe?"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="sidebar.contactTitleEn">Title (En)</Label>
											<Input
												id="sidebar.contactTitleEn"
												{...form.register("sidebar.contactTitleEn")}
												value={form.watch("sidebar.contactTitleEn") || ""}
												placeholder="Need help?"
											/>
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="sidebar.contactDescriptionDe">
												Description (De)
											</Label>
											<Textarea
												id="sidebar.contactDescriptionDe"
												{...form.register("sidebar.contactDescriptionDe")}
												value={form.watch("sidebar.contactDescriptionDe") || ""}
												placeholder="Unser Team ist hier, um Ihnen zu helfen..."
												rows={3}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="sidebar.contactDescriptionEn">
												Description (En)
											</Label>
											<Textarea
												id="sidebar.contactDescriptionEn"
												{...form.register("sidebar.contactDescriptionEn")}
												value={form.watch("sidebar.contactDescriptionEn") || ""}
												placeholder="Our team is here to help you..."
												rows={3}
											/>
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-3">
										<div className="space-y-2">
											<Label htmlFor="sidebar.phone">Phone</Label>
											<Input
												id="sidebar.phone"
												{...form.register("sidebar.phone")}
												value={form.watch("sidebar.phone") || ""}
												placeholder="010-205 15 01"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="sidebar.email">Email</Label>
											<Input
												id="sidebar.email"
												{...form.register("sidebar.email")}
												value={form.watch("sidebar.email") || ""}
												placeholder="info@zavd.se"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="sidebar.officeHours">
												Office Hours
											</Label>
											<Input
												id="sidebar.officeHours"
												{...form.register("sidebar.officeHours")}
												value={form.watch("sidebar.officeHours") || ""}
												placeholder="Mån-Fre 9-17"
											/>
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="sidebar.contactButtonTextDe">
												Button Text (De)
											</Label>
											<Input
												id="sidebar.contactButtonTextDe"
												{...form.register("sidebar.contactButtonTextDe")}
												value={form.watch("sidebar.contactButtonTextDe") || ""}
												placeholder="Kontaktieren Sie uns"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="sidebar.contactButtonTextEn">
												Button Text (En)
											</Label>
											<Input
												id="sidebar.contactButtonTextEn"
												{...form.register("sidebar.contactButtonTextEn")}
												value={form.watch("sidebar.contactButtonTextEn") || ""}
												placeholder="Contact us"
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="sidebar.contactButtonHref">
											Button Link
										</Label>
										<Input
											id="sidebar.contactButtonHref"
											{...form.register("sidebar.contactButtonHref")}
											value={form.watch("sidebar.contactButtonHref") || ""}
											placeholder="/kontakt"
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Quick Links</CardTitle>
									<CardDescription>
										Links displayed in the sidebar
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="sidebar.quickLinksTitleDe">Title (De)</Label>
											<Input
												id="sidebar.quickLinksTitleDe"
												{...form.register("sidebar.quickLinksTitleDe")}
												value={form.watch("sidebar.quickLinksTitleDe") || ""}
												placeholder="Schnelllinks"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="sidebar.quickLinksTitleEn">Title (En)</Label>
											<Input
												id="sidebar.quickLinksTitleEn"
												{...form.register("sidebar.quickLinksTitleEn")}
												value={form.watch("sidebar.quickLinksTitleEn") || ""}
												placeholder="Quick Links"
											/>
										</div>
									</div>
									{quickLinks.fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-4 p-4 border rounded-lg"
										>
											<div className="flex-1 space-y-4">
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Label (De)</Label>
														<Input
															{...form.register(
																`sidebar.quickLinks.${index}.labelDe`
															)}
															value={form.watch(`sidebar.quickLinks.${index}.labelDe`) || ""}
															placeholder="Unsere Produkte"
														/>
													</div>
													<div className="space-y-2">
														<Label>Label (En)</Label>
														<Input
															{...form.register(
																`sidebar.quickLinks.${index}.labelEn`
															)}
															value={form.watch(`sidebar.quickLinks.${index}.labelEn`) || ""}
															placeholder="Our Products"
														/>
													</div>
												</div>
												<div className="space-y-2">
													<Label>Link</Label>
													<Input
														{...form.register(
															`sidebar.quickLinks.${index}.href`
														)}
														value={form.watch(`sidebar.quickLinks.${index}.href`) || ""}
														placeholder="/produkter"
													/>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={async () => {
													const confirmed = await confirm({
														title: "Remove Quick Link",
														description: "Are you sure you want to remove this quick link?",
														confirmText: "Remove",
													});
													if (confirmed) quickLinks.remove(index);
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
											quickLinks.append({ labelDe: "", labelEn: "", href: "" })
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Quick Link
									</Button>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Offices</CardTitle>
									<CardDescription>
										Office addresses displayed in the sidebar
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="sidebar.officesTitleDe">Title (De)</Label>
											<Input
												id="sidebar.officesTitleDe"
												{...form.register("sidebar.officesTitleDe")}
												value={form.watch("sidebar.officesTitleDe") || ""}
												placeholder="Unsere Büros"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="sidebar.officesTitleEn">Title (En)</Label>
											<Input
												id="sidebar.officesTitleEn"
												{...form.register("sidebar.officesTitleEn")}
												value={form.watch("sidebar.officesTitleEn") || ""}
												placeholder="Our Offices"
											/>
										</div>
									</div>
									{offices.fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-4 p-4 border rounded-lg"
										>
											<div className="flex-1 grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Name</Label>
													<Input
														{...form.register(
															`sidebar.offices.${index}.name`
														)}
														value={form.watch(`sidebar.offices.${index}.name`) || ""}
														placeholder="Stockholm"
													/>
												</div>
												<div className="space-y-2">
													<Label>Address</Label>
													<Textarea
														{...form.register(
															`sidebar.offices.${index}.address`
														)}
														value={form.watch(`sidebar.offices.${index}.address`) || ""}
														placeholder="Turebergsvägen 5, 191 47 Sollentuna"
														rows={2}
													/>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={async () => {
													const confirmed = await confirm({
														title: "Remove Office",
														description: "Are you sure you want to remove this office?",
														confirmText: "Remove",
													});
													if (confirmed) offices.remove(index);
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
											offices.append({ name: "", address: "" })
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Office
									</Button>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Newsletter Tab */}
					<TabsContent value="newsletter">
						<Card>
							<CardHeader>
								<CardTitle>Newsletter Section</CardTitle>
								<CardDescription>
									Text for the newsletter form
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="newsletter.titleDe">Title (De)</Label>
										<Input
											id="newsletter.titleDe"
											{...form.register("newsletter.titleDe")}
											value={form.watch("newsletter.titleDe") || ""}
											placeholder="Bleiben Sie auf dem Laufenden"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="newsletter.titleEn">Title (En)</Label>
										<Input
											id="newsletter.titleEn"
											{...form.register("newsletter.titleEn")}
											value={form.watch("newsletter.titleEn") || ""}
											placeholder="Stay up to date"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="newsletter.subtitleDe">Subtitle (De)</Label>
										<Textarea
											id="newsletter.subtitleDe"
											{...form.register("newsletter.subtitleDe")}
											value={form.watch("newsletter.subtitleDe") || ""}
											placeholder="Abonnieren Sie unseren Newsletter..."
											rows={3}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="newsletter.subtitleEn">Subtitle (En)</Label>
										<Textarea
											id="newsletter.subtitleEn"
											{...form.register("newsletter.subtitleEn")}
											value={form.watch("newsletter.subtitleEn") || ""}
											placeholder="Subscribe to our newsletter..."
											rows={3}
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="newsletter.inputPlaceholderDe">
											Input Placeholder (De)
										</Label>
										<Input
											id="newsletter.inputPlaceholderDe"
											{...form.register("newsletter.inputPlaceholderDe")}
											value={form.watch("newsletter.inputPlaceholderDe") || ""}
											placeholder="Ihre E-Mail-Adresse"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="newsletter.inputPlaceholderEn">
											Input Placeholder (En)
										</Label>
										<Input
											id="newsletter.inputPlaceholderEn"
											{...form.register("newsletter.inputPlaceholderEn")}
											value={form.watch("newsletter.inputPlaceholderEn") || ""}
											placeholder="Your email address"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="newsletter.buttonTextDe">
											Button Text (De)
										</Label>
										<Input
											id="newsletter.buttonTextDe"
											{...form.register("newsletter.buttonTextDe")}
											value={form.watch("newsletter.buttonTextDe") || ""}
											placeholder="Abonnieren"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="newsletter.buttonTextEn">
											Button Text (En)
										</Label>
										<Input
											id="newsletter.buttonTextEn"
											{...form.register("newsletter.buttonTextEn")}
											value={form.watch("newsletter.buttonTextEn") || ""}
											placeholder="Subscribe"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="newsletter.loadingTextDe">
											Loading Text (De)
										</Label>
										<Input
											id="newsletter.loadingTextDe"
											{...form.register("newsletter.loadingTextDe")}
											value={form.watch("newsletter.loadingTextDe") || ""}
											placeholder="Wird gesendet..."
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="newsletter.loadingTextEn">
											Loading Text (En)
										</Label>
										<Input
											id="newsletter.loadingTextEn"
											{...form.register("newsletter.loadingTextEn")}
											value={form.watch("newsletter.loadingTextEn") || ""}
											placeholder="Sending..."
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="newsletter.successTextDe">
											Success Text (De)
										</Label>
										<Input
											id="newsletter.successTextDe"
											{...form.register("newsletter.successTextDe")}
											value={form.watch("newsletter.successTextDe") || ""}
											placeholder="Danke! Sie sind jetzt abonniert."
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="newsletter.successTextEn">
											Success Text (En)
										</Label>
										<Input
											id="newsletter.successTextEn"
											{...form.register("newsletter.successTextEn")}
											value={form.watch("newsletter.successTextEn") || ""}
											placeholder="Thank you! You are now subscribed."
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="newsletter.privacyNoteDe">
											Privacy Note (De)
										</Label>
										<Textarea
											id="newsletter.privacyNoteDe"
											{...form.register("newsletter.privacyNoteDe")}
											value={form.watch("newsletter.privacyNoteDe") || ""}
											placeholder="Wir respektieren Ihre Privatsphäre..."
											rows={2}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="newsletter.privacyNoteEn">
											Privacy Note (En)
										</Label>
										<Textarea
											id="newsletter.privacyNoteEn"
											{...form.register("newsletter.privacyNoteEn")}
											value={form.watch("newsletter.privacyNoteEn") || ""}
											placeholder="We respect your privacy..."
											rows={2}
										/>
									</div>
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
										Search engine optimization for the FAQ page.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="seo.title">Page Title</Label>
										<Input
											id="seo.title"
											{...form.register("seo.title")}
											value={form.watch("seo.title") || ""}
											placeholder="FAQ - Vanliga frågor och svar"
										/>
										<p className="text-sm text-muted-foreground">
											Displayed in browser tab and search results.
										</p>
									</div>
									<div className="space-y-2">
										<Label htmlFor="seo.description">Meta Description</Label>
										<Textarea
											id="seo.description"
											{...form.register("seo.description")}
											value={form.watch("seo.description") || ""}
											placeholder="Har du frågor om Zavd Medical..."
											rows={3}
										/>
										<p className="text-sm text-muted-foreground">
											Short description shown in search results.
										</p>
									</div>
									<div className="space-y-2">
										<Label>OG Image</Label>
										<MediaPicker
											type="image"
											value={form.watch("seo.ogImage") || null}
											onChange={(url) => form.setValue("seo.ogImage", url || "")}
											placeholder="Select OG image (1200x630px recommended)"
											galleryTitle="Select OG Image"
										/>
										<p className="text-sm text-muted-foreground">
											Image shown when sharing on social media.
										</p>
									</div>
									<div className="space-y-2">
										<Label>Keywords</Label>
										<div className="space-y-2">
											{seoKeywords.fields.map((field, index) => (
												<div
													key={field.id}
													className="flex items-center gap-2"
												>
													<Input
														{...form.register(
															`seo.keywords.${index}` as const
														)}
														value={form.watch(`seo.keywords.${index}`) || ""}
														placeholder="Keyword"
													/>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={async () => {
															const confirmed = await confirm({
																title: "Remove Keyword",
																description: "Are you sure you want to remove this keyword?",
																confirmText: "Remove",
															});
															if (confirmed) seoKeywords.remove(index);
														}}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											))}
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													seoKeywords.append("" as never)
												}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Keyword
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Preview</CardTitle>
									<CardDescription>
										See how the FAQ page appears in search results and social media.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<SeoPreview
										data={{
											title: form.watch("seo.title") || "FAQ - Zavd Medical",
											description: form.watch("seo.description") || "Add a description",
											slug: "faq",
											ogImage: form.watch("seo.ogImage") || null,
											siteName: "Zavd Medical",
											siteUrl: "www.zavd.se",
										}}
									/>
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
