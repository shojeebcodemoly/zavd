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
	label: z.string().max(100).optional(),
});

const faqHeroSectionSchema = z.object({
	badge: z.string().max(100).optional(),
	title: z.string().max(200).optional(),
	titleHighlight: z.string().max(200).optional(),
	subtitle: z.string().max(1000).optional(),
	stats: z.array(faqHeroStatSchema).optional(),
});

const faqItemSchema = z.object({
	question: z.string().max(500).optional(),
	answer: z.string().max(5000).optional(),
	category: z.string().max(100).optional(),
	order: z.number().optional(),
});

const faqCategorySchema = z.object({
	id: z.string().max(50).optional(),
	name: z.string().max(100).optional(),
	icon: z.string().max(50).optional(),
	order: z.number().optional(),
});

const faqContentSectionSchema = z.object({
	searchPlaceholder: z.string().max(200).optional(),
	noResultsText: z.string().max(500).optional(),
	helpText: z.string().max(500).optional(),
	helpButtonText: z.string().max(100).optional(),
	helpButtonHref: z.string().max(500).optional(),
	categories: z.array(faqCategorySchema).optional(),
	items: z.array(faqItemSchema).optional(),
});

const faqQuickLinkSchema = z.object({
	label: z.string().max(100).optional(),
	href: z.string().max(500).optional(),
});

const faqOfficeSchema = z.object({
	name: z.string().max(100).optional(),
	address: z.string().max(500).optional(),
});

const faqSidebarSectionSchema = z.object({
	contactTitle: z.string().max(200).optional(),
	contactDescription: z.string().max(1000).optional(),
	phone: z.string().max(50).optional(),
	email: z.string().max(200).optional(),
	officeHours: z.string().max(100).optional(),
	contactButtonText: z.string().max(100).optional(),
	contactButtonHref: z.string().max(500).optional(),
	quickLinksTitle: z.string().max(200).optional(),
	quickLinks: z.array(faqQuickLinkSchema).optional(),
	officesTitle: z.string().max(200).optional(),
	offices: z.array(faqOfficeSchema).optional(),
});

const faqNewsletterSectionSchema = z.object({
	title: z.string().max(200).optional(),
	subtitle: z.string().max(500).optional(),
	inputPlaceholder: z.string().max(200).optional(),
	buttonText: z.string().max(100).optional(),
	loadingText: z.string().max(100).optional(),
	successText: z.string().max(200).optional(),
	privacyNote: z.string().max(500).optional(),
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
		badge: "",
		title: "",
		titleHighlight: "",
		subtitle: "",
		stats: [],
	},
	faqContent: {
		searchPlaceholder: "",
		noResultsText: "",
		helpText: "",
		helpButtonText: "",
		helpButtonHref: "",
		categories: [],
		items: [],
	},
	sidebar: {
		contactTitle: "",
		contactDescription: "",
		phone: "",
		email: "",
		officeHours: "",
		contactButtonText: "",
		contactButtonHref: "",
		quickLinksTitle: "",
		quickLinks: [],
		officesTitle: "",
		offices: [],
	},
	newsletter: {
		title: "",
		subtitle: "",
		inputPlaceholder: "",
		buttonText: "",
		loadingText: "",
		successText: "",
		privacyNote: "",
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
									<div className="space-y-2">
										<Label htmlFor="hero.badge">Badge</Label>
										<Input
											id="hero.badge"
											{...form.register("hero.badge")}
											value={form.watch("hero.badge") || ""}
											placeholder="Vanliga frågor och svar"
										/>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="hero.title">Title</Label>
											<Input
												id="hero.title"
												{...form.register("hero.title")}
												value={form.watch("hero.title") || ""}
												placeholder="Har du frågor om våra"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="hero.titleHighlight">
												Highlighted Text
											</Label>
											<Input
												id="hero.titleHighlight"
												{...form.register("hero.titleHighlight")}
												value={form.watch("hero.titleHighlight") || ""}
												placeholder="produkter och tjänster?"
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="hero.subtitle">Subtitle</Label>
										<Textarea
											id="hero.subtitle"
											{...form.register("hero.subtitle")}
											value={form.watch("hero.subtitle") || ""}
											placeholder="Här hittar du svar på de vanligaste frågorna..."
											rows={3}
										/>
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
											<div className="flex-1 grid gap-4 md:grid-cols-2">
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
												<div className="space-y-2">
													<Label>Label</Label>
													<Input
														{...form.register(
															`hero.stats.${index}.label`
														)}
														value={form.watch(`hero.stats.${index}.label`) || ""}
														placeholder="År i branschen"
													/>
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
											heroStats.append({ value: "", label: "" })
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
									<div className="space-y-2">
										<Label htmlFor="faqContent.searchPlaceholder">
											Search Placeholder
										</Label>
										<Input
											id="faqContent.searchPlaceholder"
											{...form.register("faqContent.searchPlaceholder")}
											value={form.watch("faqContent.searchPlaceholder") || ""}
											placeholder="Sök efter frågor..."
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="faqContent.noResultsText">
											No Results Text
										</Label>
										<Input
											id="faqContent.noResultsText"
											{...form.register("faqContent.noResultsText")}
											value={form.watch("faqContent.noResultsText") || ""}
											placeholder="Inga frågor hittades..."
										/>
									</div>
									<div className="grid gap-4 md:grid-cols-3">
										<div className="space-y-2">
											<Label htmlFor="faqContent.helpText">
												Help Text
											</Label>
											<Input
												id="faqContent.helpText"
												{...form.register("faqContent.helpText")}
												value={form.watch("faqContent.helpText") || ""}
												placeholder="Hittade du inte svar?"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="faqContent.helpButtonText">
												Button Text
											</Label>
											<Input
												id="faqContent.helpButtonText"
												{...form.register("faqContent.helpButtonText")}
												value={form.watch("faqContent.helpButtonText") || ""}
												placeholder="Kontakta oss"
											/>
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
											<div className="flex-1 grid gap-4 md:grid-cols-4">
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
													<Label>Name</Label>
													<Input
														{...form.register(
															`faqContent.categories.${index}.name`
														)}
														value={form.watch(`faqContent.categories.${index}.name`) || ""}
														placeholder="Om oss"
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
												name: "",
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
														<Label>Question</Label>
														<Input
															{...form.register(
																`faqContent.items.${index}.question`
															)}
															value={form.watch(`faqContent.items.${index}.question`) || ""}
															placeholder="Vad är Synos Medical?"
														/>
													</div>
													<div className="space-y-2 md:flex md:gap-4">
														<div className="flex-1 space-y-2">
															<Label>Category</Label>
															<Input
																{...form.register(
																	`faqContent.items.${index}.category`
																)}
																value={form.watch(`faqContent.items.${index}.category`) || ""}
																placeholder="about"
															/>
														</div>
														<div className="w-20 space-y-2">
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
												<div className="space-y-2">
													<Label>Answer</Label>
													<Textarea
														{...form.register(
															`faqContent.items.${index}.answer`
														)}
														value={form.watch(`faqContent.items.${index}.answer`) || ""}
														placeholder="Synos Medical erbjuder..."
														rows={3}
													/>
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
												question: "",
												answer: "",
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
									<div className="space-y-2">
										<Label htmlFor="sidebar.contactTitle">Title</Label>
										<Input
											id="sidebar.contactTitle"
											{...form.register("sidebar.contactTitle")}
											value={form.watch("sidebar.contactTitle") || ""}
											placeholder="Behöver du hjälp?"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="sidebar.contactDescription">
											Description
										</Label>
										<Textarea
											id="sidebar.contactDescription"
											{...form.register("sidebar.contactDescription")}
											value={form.watch("sidebar.contactDescription") || ""}
											placeholder="Vårt team finns här för att hjälpa dig..."
											rows={3}
										/>
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
												placeholder="info@synos.se"
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
											<Label htmlFor="sidebar.contactButtonText">
												Button Text
											</Label>
											<Input
												id="sidebar.contactButtonText"
												{...form.register("sidebar.contactButtonText")}
												value={form.watch("sidebar.contactButtonText") || ""}
												placeholder="Kontakta oss"
											/>
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
									<div className="space-y-2">
										<Label htmlFor="sidebar.quickLinksTitle">Title</Label>
										<Input
											id="sidebar.quickLinksTitle"
											{...form.register("sidebar.quickLinksTitle")}
											value={form.watch("sidebar.quickLinksTitle") || ""}
											placeholder="Snabblänkar"
										/>
									</div>
									{quickLinks.fields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-4 p-4 border rounded-lg"
										>
											<div className="flex-1 grid gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label>Label</Label>
													<Input
														{...form.register(
															`sidebar.quickLinks.${index}.label`
														)}
														value={form.watch(`sidebar.quickLinks.${index}.label`) || ""}
														placeholder="Våra produkter"
													/>
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
											quickLinks.append({ label: "", href: "" })
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
									<div className="space-y-2">
										<Label htmlFor="sidebar.officesTitle">Title</Label>
										<Input
											id="sidebar.officesTitle"
											{...form.register("sidebar.officesTitle")}
											value={form.watch("sidebar.officesTitle") || ""}
											placeholder="Våra kontor"
										/>
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
								<div className="space-y-2">
									<Label htmlFor="newsletter.title">Title</Label>
									<Input
										id="newsletter.title"
										{...form.register("newsletter.title")}
										value={form.watch("newsletter.title") || ""}
										placeholder="Håll dig uppdaterad"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="newsletter.subtitle">Subtitle</Label>
									<Textarea
										id="newsletter.subtitle"
										{...form.register("newsletter.subtitle")}
										value={form.watch("newsletter.subtitle") || ""}
										placeholder="Prenumerera på vårt nyhetsbrev..."
										rows={3}
									/>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="newsletter.inputPlaceholder">
											Input Placeholder
										</Label>
										<Input
											id="newsletter.inputPlaceholder"
											{...form.register("newsletter.inputPlaceholder")}
											value={form.watch("newsletter.inputPlaceholder") || ""}
											placeholder="Din e-postadress"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="newsletter.buttonText">
											Button Text
										</Label>
										<Input
											id="newsletter.buttonText"
											{...form.register("newsletter.buttonText")}
											value={form.watch("newsletter.buttonText") || ""}
											placeholder="Prenumerera"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="newsletter.loadingText">
											Loading Text
										</Label>
										<Input
											id="newsletter.loadingText"
											{...form.register("newsletter.loadingText")}
											value={form.watch("newsletter.loadingText") || ""}
											placeholder="Skickar..."
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="newsletter.successText">
											Success Text
										</Label>
										<Input
											id="newsletter.successText"
											{...form.register("newsletter.successText")}
											value={form.watch("newsletter.successText") || ""}
											placeholder="Tack! Du är nu prenumerant."
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="newsletter.privacyNote">
										Privacy Note
									</Label>
									<Textarea
										id="newsletter.privacyNote"
										{...form.register("newsletter.privacyNote")}
										value={form.watch("newsletter.privacyNote") || ""}
										placeholder="Vi respekterar din integritet..."
										rows={2}
									/>
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
											placeholder="Har du frågor om Synos Medical..."
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
											title: form.watch("seo.title") || "FAQ - Synos Medical",
											description: form.watch("seo.description") || "Add a description",
											slug: "faq",
											ogImage: form.watch("seo.ogImage") || null,
											siteName: "Synos Medical",
											siteUrl: "www.synos.se",
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
