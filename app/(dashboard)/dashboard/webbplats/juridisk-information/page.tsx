"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, ExternalLink } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";

// Icon options
const ICON_OPTIONS = [
	{ value: "Shield", label: "Shield" },
	{ value: "FileText", label: "Document" },
	{ value: "Scale", label: "Scale" },
	{ value: "Cookie", label: "Cookie" },
];

// Section Visibility schema
const sectionVisibilitySchema = z.object({
	hero: z.boolean(),
	legalCards: z.boolean(),
	companyInfo: z.boolean(),
	terms: z.boolean(),
	gdprRights: z.boolean(),
	cta: z.boolean(),
});

// Legal card schema
const legalCardSchema = z.object({
	icon: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	href: z.string().optional(),
	highlights: z.array(z.string()).optional(),
});

// Office address schema
const officeAddressSchema = z.object({
	name: z.string().optional(),
	address: z.string().optional(),
});

// Term schema
const termSchema = z.object({
	title: z.string().optional(),
	content: z.string().optional(),
});

// GDPR right schema
const gdprRightSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
});

// CTA schema
const ctaSchema = z.object({
	text: z.string().optional(),
	href: z.string().optional(),
});

// Form schema
const legalPageFormSchema = z.object({
	sectionVisibility: sectionVisibilitySchema,

	hero: z
		.object({
			badge: z.string().optional(),
			title: z.string().optional(),
			subtitle: z.string().optional(),
		})
		.optional(),

	legalCards: z.array(legalCardSchema).optional(),

	companyInfo: z
		.object({
			companyName: z.string().optional(),
			organizationNumber: z.string().optional(),
			vatNumber: z.string().optional(),
			registeredSeat: z.string().optional(),
			offices: z.array(officeAddressSchema).optional(),
			email: z.string().optional(),
			phone: z.string().optional(),
		})
		.optional(),

	termsSection: z
		.object({
			title: z.string().optional(),
			terms: z.array(termSchema).optional(),
		})
		.optional(),

	gdprSection: z
		.object({
			title: z.string().optional(),
			rights: z.array(gdprRightSchema).optional(),
			primaryCta: ctaSchema.optional(),
			secondaryCta: ctaSchema.optional(),
		})
		.optional(),

	ctaSection: z
		.object({
			text: z.string().optional(),
			primaryCta: ctaSchema.optional(),
			secondaryCta: ctaSchema.optional(),
		})
		.optional(),

	seo: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
			ogImage: z.string().optional(),
		})
		.optional(),
});

type LegalPageFormValues = z.infer<typeof legalPageFormSchema>;

export default function LegalPageAdmin() {
	const [loading, setLoading] = useState(true);
	const { confirm, ConfirmModal } = useConfirmModal({
		variant: "destructive",
	});
	const [saving, setSaving] = useState(false);

	const form = useForm<LegalPageFormValues>({
		resolver: zodResolver(legalPageFormSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				legalCards: true,
				companyInfo: true,
				terms: true,
				gdprRights: true,
				cta: true,
			},
			hero: {},
			legalCards: [],
			companyInfo: { offices: [] },
			termsSection: { terms: [] },
			gdprSection: { rights: [] },
			ctaSection: {},
			seo: {},
		},
	});

	const {
		fields: legalCardFields,
		append: appendLegalCard,
		remove: removeLegalCard,
	} = useFieldArray({
		control: form.control,
		name: "legalCards",
	});

	const {
		fields: officeFields,
		append: appendOffice,
		remove: removeOffice,
	} = useFieldArray({
		control: form.control,
		name: "companyInfo.offices",
	});

	const {
		fields: termFields,
		append: appendTerm,
		remove: removeTerm,
	} = useFieldArray({
		control: form.control,
		name: "termsSection.terms",
	});

	const {
		fields: gdprRightFields,
		append: appendGdprRight,
		remove: removeGdprRight,
	} = useFieldArray({
		control: form.control,
		name: "gdprSection.rights",
	});

	// Fetch data
	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/legal-page");
				if (!response.ok) throw new Error("Failed to fetch");
				const data = await response.json();

				form.reset({
					sectionVisibility: data.sectionVisibility || {
						hero: true,
						legalCards: true,
						companyInfo: true,
						terms: true,
						gdprRights: true,
						cta: true,
					},
					hero: data.hero || {},
					legalCards: data.legalCards || [],
					companyInfo: {
						...data.companyInfo,
						offices: data.companyInfo?.offices || [],
					},
					termsSection: {
						...data.termsSection,
						terms: data.termsSection?.terms || [],
					},
					gdprSection: {
						...data.gdprSection,
						rights: data.gdprSection?.rights || [],
					},
					ctaSection: data.ctaSection || {},
					seo: data.seo || {},
				});
			} catch (error) {
				console.error("Error fetching legal page:", error);
				toast.error("Failed to fetch data");
			} finally {
				setLoading(false);
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

	// Submit handler
	async function onSubmit(values: LegalPageFormValues) {
		setSaving(true);
		try {
			const response = await fetch("/api/legal-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				const errorMessage = data.error || data.message || "Failed to save changes";
				const details = data.details ? `: ${formatValidationErrors(data.details)}` : "";
				throw new Error(`${errorMessage}${details}`);
			}

			toast.success("Legal page saved successfully");
		} catch (error) {
			console.error("Error saving legal page:", error);
			toast.error(error instanceof Error ? error.message : "Failed to save changes");
		} finally {
			setSaving(false);
		}
	}

	if (loading) {
		return <CMSPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-medium tracking-tight">Legal Information Page</h1>
					<p className="text-muted-foreground">
						Manage legal information, terms and GDPR.
					</p>
				</div>
				<a
					href="/om-oss/juridisk-information"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<Form {...form}>
				<form
					id="legal-form"
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<Tabs defaultValue="visibility" className="w-full">
						<TabsList className="flex flex-wrap h-auto gap-1 justify-start">
							<TabsTrigger value="visibility">Visibility</TabsTrigger>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="cards">Cards</TabsTrigger>
							<TabsTrigger value="company">Company</TabsTrigger>
							<TabsTrigger value="terms">Terms</TabsTrigger>
							<TabsTrigger value="gdpr">GDPR</TabsTrigger>
							<TabsTrigger value="cta">CTA</TabsTrigger>
							<TabsTrigger value="seo">SEO</TabsTrigger>
						</TabsList>

						{/* Visibility Tab */}
						<TabsContent value="visibility" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Section Visibility</CardTitle>
									<CardDescription>
										Choose which sections to display on the page
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="sectionVisibility.hero"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>Hero Section</FormLabel>
													<FormDescription>
														Badge, title and subtitle
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sectionVisibility.legalCards"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>Legal Cards</FormLabel>
													<FormDescription>
														Cards with legal sections
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sectionVisibility.companyInfo"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>
														Company Information
													</FormLabel>
													<FormDescription>
														Organization number, addresses, etc.
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sectionVisibility.terms"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>General Terms</FormLabel>
													<FormDescription>
														Terms sections
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sectionVisibility.gdprRights"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>GDPR Rights</FormLabel>
													<FormDescription>
														Summary of GDPR rights
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sectionVisibility.cta"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>CTA Section</FormLabel>
													<FormDescription>
														Call-to-action at the end of the page
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Hero Tab */}
						<TabsContent value="hero" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Hero Section</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="hero.badge"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Badge</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="t.ex. Juridisk Information"
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="hero.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Title</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="t.ex. Juridisk Information"
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="hero.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="Beskriv sidan..."
														rows={3}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Legal Cards Tab */}
						<TabsContent value="cards" className="space-y-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<div>
										<CardTitle>Legal Cards</CardTitle>
										<CardDescription>
											Cards that link to different legal sections
										</CardDescription>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendLegalCard({
												icon: "Shield",
												title: "",
												description: "",
												href: "",
												highlights: [],
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Card
									</Button>
								</CardHeader>
								<CardContent className="space-y-6">
									{legalCardFields.length === 0 && (
										<p className="text-center text-muted-foreground py-8">
											No cards added. Click &quot;Add Card&quot; to
											begin.
										</p>
									)}
									{legalCardFields.map((field, index) => (
										<div
											key={field.id}
											className="rounded-lg border p-4 space-y-4"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													
													<span className="font-medium">
														Card {index + 1}
													</span>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove Card",
															description:
																"Are you sure you want to remove this legal card?",
															confirmText: "Remove",
														});
														if (confirmed) removeLegalCard(index);
													}}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
											<div className="grid gap-4 sm:grid-cols-2">
												<FormField
													control={form.control}
													name={`legalCards.${index}.icon`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Icon</FormLabel>
															<Select
																onValueChange={field.onChange}
																value={field.value || ""}
															>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue placeholder="Select icon" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	{ICON_OPTIONS.map((icon) => (
																		<SelectItem
																			key={icon.value}
																			value={icon.value}
																		>
																			{icon.label}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`legalCards.${index}.title`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Title</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value || ""}
																	placeholder="t.ex. Integritetspolicy"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`legalCards.${index}.href`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Link</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value || ""}
																	placeholder="t.ex. /integritetspolicy"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`legalCards.${index}.description`}
													render={({ field }) => (
														<FormItem className="sm:col-span-2">
															<FormLabel>Description</FormLabel>
															<FormControl>
																<Textarea
																	{...field}
																	value={field.value || ""}
																	placeholder="Kort beskrivning..."
																	rows={2}
																/>
															</FormControl>
														</FormItem>
													)}
												/>
											</div>
										</div>
									))}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Company Info Tab */}
						<TabsContent value="company" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Company Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="companyInfo.companyName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Company Name</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="t.ex. Synos Medical AB"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="companyInfo.organizationNumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Organization Number
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="t.ex. 556871-8075"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="companyInfo.vatNumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel>VAT Number</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="t.ex. SE556871807501"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="companyInfo.registeredSeat"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Registered Seat</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="t.ex. Sollentuna"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="companyInfo.email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															type="email"
															placeholder="info@synosmedical.se"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="companyInfo.phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="t.ex. 010-205 15 01"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>

									<div className="border-t pt-4">
										<div className="flex items-center justify-between mb-4">
											<h4 className="text-sm font-semibold">
												Office Addresses
											</h4>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													appendOffice({ name: "", address: "" })
												}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Office
											</Button>
										</div>
										{officeFields.length === 0 && (
											<p className="text-center text-muted-foreground py-4">
												No addresses added.
											</p>
										)}
										<div className="space-y-4">
											{officeFields.map((field, index) => (
												<div
													key={field.id}
													className="flex items-start gap-4 rounded-lg border p-4"
												>
													
													<div className="grid flex-1 gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`companyInfo.offices.${index}.name`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Name</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="t.ex. Stockholm (Huvudkontor)"
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`companyInfo.offices.${index}.address`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Address
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			value={field.value || ""}
																			placeholder="t.ex. Turebergsvägen 5, 191 47 Sollentuna"
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
													</div>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={async () => {
															const confirmed = await confirm({
																title: "Remove Office",
																description:
																	"Are you sure you want to remove this office address?",
																confirmText: "Remove",
															});
															if (confirmed) removeOffice(index);
														}}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											))}
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Terms Tab */}
						<TabsContent value="terms" className="space-y-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<div>
										<CardTitle>General Terms</CardTitle>
										<CardDescription>
											Terms and conditions
										</CardDescription>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendTerm({ title: "", content: "" })
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Term
									</Button>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="termsSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Title</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="t.ex. Allmänna Villkor"
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									{termFields.length === 0 && (
										<p className="text-center text-muted-foreground py-8">
											No terms added. Click &quot;Add Term&quot; to
											begin.
										</p>
									)}
									{termFields.map((field, index) => (
										<div
											key={field.id}
											className="rounded-lg border p-4 space-y-4"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													
													<span className="font-medium">
														Term {index + 1}
													</span>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove Term",
															description:
																"Are you sure you want to remove this term?",
															confirmText: "Remove",
														});
														if (confirmed) removeTerm(index);
													}}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
											<FormField
												control={form.control}
												name={`termsSection.terms.${index}.title`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Title</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="t.ex. 1. Leveransvillkor"
															/>
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`termsSection.terms.${index}.content`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Content</FormLabel>
														<FormControl>
															<Textarea
																{...field}
																value={field.value || ""}
																placeholder="Villkorstext..."
																rows={4}
															/>
														</FormControl>
													</FormItem>
												)}
											/>
										</div>
									))}
								</CardContent>
							</Card>
						</TabsContent>

						{/* GDPR Tab */}
						<TabsContent value="gdpr" className="space-y-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<div>
										<CardTitle>GDPR Rights</CardTitle>
										<CardDescription>
											Summary of rights under GDPR
										</CardDescription>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendGdprRight({ title: "", description: "" })
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Right
									</Button>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="gdprSection.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Title</FormLabel>
												<FormControl>
													<Input
														{...field}
														value={field.value || ""}
														placeholder="t.ex. Dina rättigheter enligt GDPR"
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									{gdprRightFields.length === 0 && (
										<p className="text-center text-muted-foreground py-8">
											No rights added. Click &quot;Add Right&quot; to
											begin.
										</p>
									)}
									<div className="space-y-4">
										{gdprRightFields.map((field, index) => (
											<div
												key={field.id}
												className="flex items-start gap-4 rounded-lg border p-4"
											>
												
												<div className="grid flex-1 gap-4 sm:grid-cols-2">
													<FormField
														control={form.control}
														name={`gdprSection.rights.${index}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Title</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="t.ex. Rätt till information"
																	/>
																</FormControl>
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`gdprSection.rights.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Description
																</FormLabel>
																<FormControl>
																	<Input
																		{...field}
																		value={field.value || ""}
																		placeholder="Kort beskrivning..."
																	/>
																</FormControl>
															</FormItem>
														)}
													/>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove GDPR Right",
															description:
																"Are you sure you want to remove this GDPR right?",
															confirmText: "Remove",
														});
														if (confirmed) removeGdprRight(index);
													}}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>
										))}
									</div>

									<div className="border-t pt-4">
										<h4 className="text-sm font-semibold mb-4">
											Buttons
										</h4>
										<div className="grid gap-4 sm:grid-cols-2">
											<div className="space-y-4 rounded-lg border p-4">
												<h5 className="text-sm font-medium">
													Primary Button
												</h5>
												<FormField
													control={form.control}
													name="gdprSection.primaryCta.text"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Text</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value || ""}
																	placeholder="t.ex. Läs fullständig integritetspolicy"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="gdprSection.primaryCta.href"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Link</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value || ""}
																	placeholder="/integritetspolicy"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
											</div>
											<div className="space-y-4 rounded-lg border p-4">
												<h5 className="text-sm font-medium">
													Secondary Button
												</h5>
												<FormField
													control={form.control}
													name="gdprSection.secondaryCta.text"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Text</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value || ""}
																	placeholder="t.ex. Kontakta oss"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="gdprSection.secondaryCta.href"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Link</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value || ""}
																	placeholder="/kontakt"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* CTA Tab */}
						<TabsContent value="cta" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Call-to-Action</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="ctaSection.text"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Text</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														value={field.value || ""}
														placeholder="t.ex. Har du frågor om våra juridiska villkor?"
														rows={2}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-4 rounded-lg border p-4">
											<h5 className="text-sm font-medium">
												Primary Button
											</h5>
											<FormField
												control={form.control}
												name="ctaSection.primaryCta.text"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Text</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="t.ex. Kontakta oss"
															/>
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="ctaSection.primaryCta.href"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Link</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="/kontakt"
															/>
														</FormControl>
													</FormItem>
												)}
											/>
										</div>
										<div className="space-y-4 rounded-lg border p-4">
											<h5 className="text-sm font-medium">
												Secondary Button
											</h5>
											<FormField
												control={form.control}
												name="ctaSection.secondaryCta.text"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Text</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="t.ex. info@synosmedical.se"
															/>
														</FormControl>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="ctaSection.secondaryCta.href"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Link</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="mailto:info@synosmedical.se"
															/>
														</FormControl>
													</FormItem>
												)}
											/>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* SEO Tab */}
						<TabsContent value="seo" className="space-y-4">
							<div className="grid gap-6 lg:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>SEO Settings</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="seo.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Meta Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="t.ex. Juridisk Information | Synos Medical"
														/>
													</FormControl>
													<FormDescription>
														Recommended length: 50-60 characters
													</FormDescription>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="seo.description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Meta Description</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Beskrivning för sökmotorer..."
															rows={3}
														/>
													</FormControl>
													<FormDescription>
														Recommended length: 150-160 characters
													</FormDescription>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="seo.ogImage"
											render={({ field }) => (
												<FormItem>
													<FormLabel>OG Image</FormLabel>
													<FormControl>
														<MediaPicker
															type="image"
															value={field.value || null}
															onChange={(url) =>
																field.onChange(url || "")
															}
															placeholder="Select OG image (1200x630px recommended)"
															galleryTitle="Select OG Image"
														/>
													</FormControl>
													<FormDescription>
														Image displayed when shared on social
														media
													</FormDescription>
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>
								<Card>
									<CardHeader>
										<CardTitle>Preview</CardTitle>
									</CardHeader>
									<CardContent>
										<SeoPreview
											data={{
												title: form.watch("seo.title") || "Juridisk Information - Synos Medical",
												description: form.watch("seo.description") || "Add a description",
												ogImage: form.watch("seo.ogImage") || null,
												slug: "om-oss/juridisk-information",
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
						<Button type="submit" disabled={saving} size="lg">
							{saving ? (
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
			</Form>
			<ConfirmModal />
		</div>
	);
}
