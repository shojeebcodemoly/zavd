"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";

// Local Zod schema for the form
const formSchema = z.object({
	sectionVisibility: z
		.object({
			hero: z.boolean(),
			introduction: z.boolean(),
			dataCollection: z.boolean(),
			purposeOfProcessing: z.boolean(),
			legalBasis: z.boolean(),
			dataRetention: z.boolean(),
			dataSharing: z.boolean(),
			yourRights: z.boolean(),
			security: z.boolean(),
			cookies: z.boolean(),
			contact: z.boolean(),
			policyChanges: z.boolean(),
			cta: z.boolean(),
		})
		.optional(),
	hero: z
		.object({
			titleDe: z.string().max(200).optional(),
			titleEn: z.string().max(200).optional(),
			subtitleDe: z.string().max(500).optional(),
			subtitleEn: z.string().max(500).optional(),
			lastUpdated: z.string().max(100).optional(),
		})
		.optional(),
	introduction: z
		.object({
			sectionNumber: z.string().max(20).optional(),
			titleDe: z.string().max(200).optional(),
			titleEn: z.string().max(200).optional(),
			introDe: z.string().max(2000).optional(),
			introEn: z.string().max(2000).optional(),
			items: z
				.array(
					z.object({
						titleDe: z.string().max(200).optional(),
						titleEn: z.string().max(200).optional(),
						descriptionDe: z.string().max(2000).optional(),
						descriptionEn: z.string().max(2000).optional(),
					})
				)
				.optional(),
			outroDe: z.string().max(2000).optional(),
			outroEn: z.string().max(2000).optional(),
			highlighted: z.boolean().optional(),
		})
		.optional(),
	dataCollection: z
		.object({
			sectionNumber: z.string().max(20).optional(),
			titleDe: z.string().max(200).optional(),
			titleEn: z.string().max(200).optional(),
			introDe: z.string().max(2000).optional(),
			introEn: z.string().max(2000).optional(),
			items: z
				.array(
					z.object({
						titleDe: z.string().max(200).optional(),
						titleEn: z.string().max(200).optional(),
						descriptionDe: z.string().max(2000).optional(),
						descriptionEn: z.string().max(2000).optional(),
					})
				)
				.optional(),
			outroDe: z.string().max(2000).optional(),
			outroEn: z.string().max(2000).optional(),
			highlighted: z.boolean().optional(),
		})
		.optional(),
	purposeOfProcessing: z
		.object({
			sectionNumber: z.string().max(20).optional(),
			titleDe: z.string().max(200).optional(),
			titleEn: z.string().max(200).optional(),
			introDe: z.string().max(2000).optional(),
			introEn: z.string().max(2000).optional(),
			items: z
				.array(
					z.object({
						titleDe: z.string().max(200).optional(),
						titleEn: z.string().max(200).optional(),
						descriptionDe: z.string().max(2000).optional(),
						descriptionEn: z.string().max(2000).optional(),
					})
				)
				.optional(),
			outroDe: z.string().max(2000).optional(),
			outroEn: z.string().max(2000).optional(),
			highlighted: z.boolean().optional(),
		})
		.optional(),
	legalBasis: z
		.object({
			sectionNumber: z.string().max(20).optional(),
			titleDe: z.string().max(200).optional(),
			titleEn: z.string().max(200).optional(),
			introDe: z.string().max(2000).optional(),
			introEn: z.string().max(2000).optional(),
			items: z
				.array(
					z.object({
						titleDe: z.string().max(200).optional(),
						titleEn: z.string().max(200).optional(),
						descriptionDe: z.string().max(2000).optional(),
						descriptionEn: z.string().max(2000).optional(),
					})
				)
				.optional(),
			outroDe: z.string().max(2000).optional(),
			outroEn: z.string().max(2000).optional(),
			highlighted: z.boolean().optional(),
		})
		.optional(),
	dataRetention: z
		.object({
			sectionNumber: z.string().max(20).optional(),
			titleDe: z.string().max(200).optional(),
			titleEn: z.string().max(200).optional(),
			introDe: z.string().max(2000).optional(),
			introEn: z.string().max(2000).optional(),
			items: z
				.array(
					z.object({
						titleDe: z.string().max(200).optional(),
						titleEn: z.string().max(200).optional(),
						descriptionDe: z.string().max(2000).optional(),
						descriptionEn: z.string().max(2000).optional(),
					})
				)
				.optional(),
			outroDe: z.string().max(2000).optional(),
			outroEn: z.string().max(2000).optional(),
			highlighted: z.boolean().optional(),
		})
		.optional(),
	dataSharing: z
		.object({
			sectionNumber: z.string().max(20).optional(),
			titleDe: z.string().max(200).optional(),
			titleEn: z.string().max(200).optional(),
			introDe: z.string().max(2000).optional(),
			introEn: z.string().max(2000).optional(),
			items: z
				.array(
					z.object({
						titleDe: z.string().max(200).optional(),
						titleEn: z.string().max(200).optional(),
						descriptionDe: z.string().max(2000).optional(),
						descriptionEn: z.string().max(2000).optional(),
					})
				)
				.optional(),
			outroDe: z.string().max(2000).optional(),
			outroEn: z.string().max(2000).optional(),
			highlighted: z.boolean().optional(),
		})
		.optional(),
	yourRights: z
		.object({
			sectionNumber: z.string().max(20).optional(),
			titleDe: z.string().max(200).optional(),
			titleEn: z.string().max(200).optional(),
			introDe: z.string().max(2000).optional(),
			introEn: z.string().max(2000).optional(),
			items: z
				.array(
					z.object({
						titleDe: z.string().max(200).optional(),
						titleEn: z.string().max(200).optional(),
						descriptionDe: z.string().max(2000).optional(),
						descriptionEn: z.string().max(2000).optional(),
					})
				)
				.optional(),
			outroDe: z.string().max(2000).optional(),
			outroEn: z.string().max(2000).optional(),
			highlighted: z.boolean().optional(),
		})
		.optional(),
	security: z
		.object({
			sectionNumber: z.string().max(20).optional(),
			titleDe: z.string().max(200).optional(),
			titleEn: z.string().max(200).optional(),
			introDe: z.string().max(2000).optional(),
			introEn: z.string().max(2000).optional(),
			items: z
				.array(
					z.object({
						titleDe: z.string().max(200).optional(),
						titleEn: z.string().max(200).optional(),
						descriptionDe: z.string().max(2000).optional(),
						descriptionEn: z.string().max(2000).optional(),
					})
				)
				.optional(),
			outroDe: z.string().max(2000).optional(),
			outroEn: z.string().max(2000).optional(),
			highlighted: z.boolean().optional(),
		})
		.optional(),
	cookies: z
		.object({
			sectionNumber: z.string().max(20).optional(),
			titleDe: z.string().max(200).optional(),
			titleEn: z.string().max(200).optional(),
			introDe: z.string().max(2000).optional(),
			introEn: z.string().max(2000).optional(),
			items: z
				.array(
					z.object({
						titleDe: z.string().max(200).optional(),
						titleEn: z.string().max(200).optional(),
						descriptionDe: z.string().max(2000).optional(),
						descriptionEn: z.string().max(2000).optional(),
					})
				)
				.optional(),
			outroDe: z.string().max(2000).optional(),
			outroEn: z.string().max(2000).optional(),
			highlighted: z.boolean().optional(),
		})
		.optional(),
	contact: z
		.object({
			sectionNumber: z.string().max(20).optional(),
			titleDe: z.string().max(200).optional(),
			titleEn: z.string().max(200).optional(),
			introDe: z.string().max(1000).optional(),
			introEn: z.string().max(1000).optional(),
			companyName: z.string().max(200).optional(),
			organizationNumber: z.string().max(50).optional(),
			email: z.string().email().max(200).optional().or(z.literal("")),
			phone: z.string().max(50).optional(),
			addresses: z.array(z.string().max(500)).optional(),
			highlighted: z.boolean().optional(),
		})
		.optional(),
	policyChanges: z
		.object({
			sectionNumber: z.string().max(20).optional(),
			titleDe: z.string().max(200).optional(),
			titleEn: z.string().max(200).optional(),
			introDe: z.string().max(2000).optional(),
			introEn: z.string().max(2000).optional(),
			items: z
				.array(
					z.object({
						titleDe: z.string().max(200).optional(),
						titleEn: z.string().max(200).optional(),
						descriptionDe: z.string().max(2000).optional(),
						descriptionEn: z.string().max(2000).optional(),
					})
				)
				.optional(),
			outroDe: z.string().max(2000).optional(),
			outroEn: z.string().max(2000).optional(),
			highlighted: z.boolean().optional(),
		})
		.optional(),
	ctaSection: z
		.object({
			textDe: z.string().max(500).optional(),
			textEn: z.string().max(500).optional(),
			primaryCta: z
				.object({
					textDe: z.string().max(100).optional(),
					textEn: z.string().max(100).optional(),
					href: z.string().max(500).optional(),
				})
				.optional(),
			secondaryCta: z
				.object({
					textDe: z.string().max(100).optional(),
					textEn: z.string().max(100).optional(),
					href: z.string().max(500).optional(),
				})
				.optional(),
		})
		.optional(),
	seo: z
		.object({
			title: z.string().max(100).optional(),
			description: z.string().max(300).optional(),
			ogImage: z.string().max(500).optional(),
		})
		.optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Content section labels for the tabs
const CONTENT_SECTIONS = [
	{
		key: "introduction",
		label: "1. Introduction",
		visibilityKey: "introduction",
	},
	{
		key: "dataCollection",
		label: "2. Data Collection",
		visibilityKey: "dataCollection",
	},
	{
		key: "purposeOfProcessing",
		label: "3. Purpose",
		visibilityKey: "purposeOfProcessing",
	},
	{ key: "legalBasis", label: "4. Legal Basis", visibilityKey: "legalBasis" },
	{
		key: "dataRetention",
		label: "5. Retention",
		visibilityKey: "dataRetention",
	},
	{ key: "dataSharing", label: "6. Sharing", visibilityKey: "dataSharing" },
	{ key: "yourRights", label: "7. Your Rights", visibilityKey: "yourRights" },
	{ key: "security", label: "8. Security", visibilityKey: "security" },
	{ key: "cookies", label: "9. Cookies", visibilityKey: "cookies" },
	{
		key: "policyChanges",
		label: "10. Changes",
		visibilityKey: "policyChanges",
	},
] as const;

export default function PrivacyPageAdmin() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({
		variant: "destructive",
	});

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				introduction: true,
				dataCollection: true,
				purposeOfProcessing: true,
				legalBasis: true,
				dataRetention: true,
				dataSharing: true,
				yourRights: true,
				security: true,
				cookies: true,
				contact: true,
				policyChanges: true,
				cta: true,
			},
			hero: {},
			introduction: { items: [] },
			dataCollection: { items: [] },
			purposeOfProcessing: { items: [] },
			legalBasis: { items: [] },
			dataRetention: { items: [] },
			dataSharing: { items: [] },
			yourRights: { items: [] },
			security: { items: [] },
			cookies: { items: [] },
			contact: { addresses: [] },
			policyChanges: { items: [] },
			ctaSection: {},
			seo: {},
		},
	});

	// Field arrays for dynamic items in each section
	const introductionItems = useFieldArray({
		control: form.control,
		name: "introduction.items",
	});

	const dataCollectionItems = useFieldArray({
		control: form.control,
		name: "dataCollection.items",
	});

	const purposeItems = useFieldArray({
		control: form.control,
		name: "purposeOfProcessing.items",
	});

	const legalBasisItems = useFieldArray({
		control: form.control,
		name: "legalBasis.items",
	});

	const dataRetentionItems = useFieldArray({
		control: form.control,
		name: "dataRetention.items",
	});

	const dataSharingItems = useFieldArray({
		control: form.control,
		name: "dataSharing.items",
	});

	const yourRightsItems = useFieldArray({
		control: form.control,
		name: "yourRights.items",
	});

	const securityItems = useFieldArray({
		control: form.control,
		name: "security.items",
	});

	const cookiesItems = useFieldArray({
		control: form.control,
		name: "cookies.items",
	});

	const policyChangesItems = useFieldArray({
		control: form.control,
		name: "policyChanges.items",
	});

	const contactAddresses = useFieldArray({
		control: form.control,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		name: "contact.addresses" as any,
	});

	// Map section keys to their field arrays
	const fieldArrayMap: Record<string, ReturnType<typeof useFieldArray>> = {
		introduction: introductionItems,
		dataCollection: dataCollectionItems,
		purposeOfProcessing: purposeItems,
		legalBasis: legalBasisItems,
		dataRetention: dataRetentionItems,
		dataSharing: dataSharingItems,
		yourRights: yourRightsItems,
		security: securityItems,
		cookies: cookiesItems,
		policyChanges: policyChangesItems,
	};

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/privacy-page");
				if (response.ok) {
					const data = await response.json();
					// Transform data to match form structure
					form.reset({
						sectionVisibility: data.sectionVisibility || {
							hero: true,
							introduction: true,
							dataCollection: true,
							purposeOfProcessing: true,
							legalBasis: true,
							dataRetention: true,
							dataSharing: true,
							yourRights: true,
							security: true,
							cookies: true,
							contact: true,
							policyChanges: true,
							cta: true,
						},
						hero: data.hero || {},
						introduction: data.introduction || { items: [] },
						dataCollection: data.dataCollection || { items: [] },
						purposeOfProcessing: data.purposeOfProcessing || {
							items: [],
						},
						legalBasis: data.legalBasis || { items: [] },
						dataRetention: data.dataRetention || { items: [] },
						dataSharing: data.dataSharing || { items: [] },
						yourRights: data.yourRights || { items: [] },
						security: data.security || { items: [] },
						cookies: data.cookies || { items: [] },
						contact: data.contact || { addresses: [] },
						policyChanges: data.policyChanges || { items: [] },
						ctaSection: data.ctaSection || {},
						seo: data.seo || {},
					});
				}
			} catch (error) {
				console.error("Error fetching privacy page data:", error);
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
			for (const [field, messages] of Object.entries(
				flattenedError.fieldErrors
			)) {
				if (messages?.length) {
					errors.push(`${field}: ${messages.join(", ")}`);
				}
			}
		}
		return errors.length > 0 ? errors.join("; ") : "";
	}

	async function onSubmit(values: FormValues) {
		setIsSaving(true);
		try {
			const response = await fetch("/api/privacy-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				const errorMessage =
					data.error || data.message || "Failed to save changes";
				const details = data.details
					? `: ${formatValidationErrors(data.details)}`
					: "";
				throw new Error(`${errorMessage}${details}`);
			}

			toast.success("Privacy Policy saved successfully");
		} catch (error) {
			console.error("Error saving privacy page:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save changes"
			);
		} finally {
			setIsSaving(false);
		}
	}

	if (isLoading) {
		return <CMSPageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-medium tracking-tight">
						Privacy Policy Page
					</h1>
					<p className="text-muted-foreground">
						Manage the content of the Privacy Policy page.
					</p>
				</div>
				<a
					href="/integritetspolicy"
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
					id="privacy-form"
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8"
				>
					<Tabs defaultValue="visibility" className="w-full">
						<TabsList className="flex flex-wrap h-auto gap-1 justify-start">
							<TabsTrigger value="visibility">Visibility</TabsTrigger>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="sections">Sections</TabsTrigger>
							<TabsTrigger value="contact">Contact</TabsTrigger>
							<TabsTrigger value="cta">CTA</TabsTrigger>
							<TabsTrigger value="seo">SEO</TabsTrigger>
						</TabsList>

						{/* Visibility Tab */}
						<TabsContent value="visibility" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Section Visibility</CardTitle>
								</CardHeader>
								<CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									<FormField
										control={form.control}
										name="sectionVisibility.hero"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Hero Section
												</FormLabel>
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
										name="sectionVisibility.introduction"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Introduction
												</FormLabel>
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
										name="sectionVisibility.dataCollection"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Data Collection
												</FormLabel>
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
										name="sectionVisibility.purposeOfProcessing"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Purpose
												</FormLabel>
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
										name="sectionVisibility.legalBasis"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Legal Basis
												</FormLabel>
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
										name="sectionVisibility.dataRetention"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Data Retention
												</FormLabel>
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
										name="sectionVisibility.dataSharing"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Data Sharing
												</FormLabel>
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
										name="sectionVisibility.yourRights"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Your Rights
												</FormLabel>
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
										name="sectionVisibility.security"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Security
												</FormLabel>
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
										name="sectionVisibility.cookies"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Cookies
												</FormLabel>
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
										name="sectionVisibility.contact"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Contact
												</FormLabel>
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
										name="sectionVisibility.policyChanges"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													Policy Changes
												</FormLabel>
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
											<FormItem className="flex items-center justify-between rounded-lg border p-3">
												<FormLabel className="cursor-pointer">
													CTA Section
												</FormLabel>
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
									<div className="grid gap-4 md:grid-cols-2">
										<FormField
											control={form.control}
											name="hero.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
													<FormControl>
														<Input
															placeholder="Datenschutzrichtlinie"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="hero.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
													<FormControl>
														<Input
															placeholder="Privacy Policy"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<FormField
											control={form.control}
											name="hero.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (DE)</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Informationen zum Umgang mit Ihren personenbezogenen Daten"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="hero.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (EN)</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Information about how we handle your personal data"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name="hero.lastUpdated"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Last Updated</FormLabel>
												<FormControl>
													<Input
														placeholder="December 2024"
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormDescription>
													E.g. &quot;December 2024&quot; or
													&quot;2024-12-01&quot;
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Sections Tab */}
						<TabsContent value="sections" className="space-y-4">
							<Tabs defaultValue="introduction" className="w-full">
								<TabsList className="flex flex-wrap h-auto gap-1 mb-4 justify-start">
									{CONTENT_SECTIONS.map((section) => (
										<TabsTrigger
											key={section.key}
											value={section.key}
										>
											{section.label}
										</TabsTrigger>
									))}
								</TabsList>

								{CONTENT_SECTIONS.map((section) => {
									const fieldArray = fieldArrayMap[section.key];
									return (
										<TabsContent
											key={section.key}
											value={section.key}
											className="space-y-4"
										>
											<Card>
												<CardHeader>
													<CardTitle>{section.label}</CardTitle>
												</CardHeader>
												<CardContent className="space-y-4">
													<FormField
														control={form.control}
														name={
															`${section.key}.sectionNumber` as `introduction.sectionNumber`
														}
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Section Number
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="1."
																		{...field}
																		value={
																			field.value || ""
																		}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<div className="grid gap-4 md:grid-cols-2">
														<FormField
															control={form.control}
															name={
																`${section.key}.titleDe` as `introduction.titleDe`
															}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title (DE)</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Sektionstitel (DE)"
																			{...field}
																			value={
																				field.value || ""
																			}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={
																`${section.key}.titleEn` as `introduction.titleEn`
															}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title (EN)</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Section title (EN)"
																			{...field}
																			value={
																				field.value || ""
																			}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<div className="grid gap-4 md:grid-cols-2">
														<FormField
															control={form.control}
															name={
																`${section.key}.introDe` as `introduction.introDe`
															}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Introduction Text (DE)
																	</FormLabel>
																	<FormControl>
																		<Textarea
																			placeholder="Einleitungstext der Sektion..."
																			rows={3}
																			{...field}
																			value={field.value || ""}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={
																`${section.key}.introEn` as `introduction.introEn`
															}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Introduction Text (EN)
																	</FormLabel>
																	<FormControl>
																		<Textarea
																			placeholder="Introductory text for the section..."
																			rows={3}
																			{...field}
																			value={field.value || ""}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>

													{/* Dynamic items */}
													<div className="space-y-4">
														<div className="flex items-center justify-between">
															<FormLabel>
																Points / Sub-points
															</FormLabel>
															<Button
																type="button"
																variant="outline"
																size="sm"
																onClick={() =>
																	fieldArray.append({
																		titleDe: "",
																		titleEn: "",
																		descriptionDe: "",
																		descriptionEn: "",
																	})
																}
															>
																<Plus className="mr-2 h-4 w-4" />
																Add Point
															</Button>
														</div>
														{fieldArray.fields.map(
															(field, index) => (
																<div
																	key={field.id}
																	className="flex gap-4 rounded-lg border p-4"
																>
																	<div className="flex-1 space-y-4">
																		<div className="grid gap-4 md:grid-cols-2">
																			<FormField
																				control={form.control}
																				name={
																					`${section.key}.items.${index}.titleDe` as `introduction.items.${number}.titleDe`
																				}
																				render={({
																					field,
																				}) => (
																					<FormItem>
																						<FormLabel>
																							Title (DE)
																						</FormLabel>
																						<FormControl>
																							<Input
																								placeholder="Punkttitel (DE)"
																								{...field}
																								value={
																									field.value ||
																									""
																								}
																							/>
																						</FormControl>
																						<FormMessage />
																					</FormItem>
																				)}
																			/>
																			<FormField
																				control={form.control}
																				name={
																					`${section.key}.items.${index}.titleEn` as `introduction.items.${number}.titleEn`
																				}
																				render={({
																					field,
																				}) => (
																					<FormItem>
																						<FormLabel>
																							Title (EN)
																						</FormLabel>
																						<FormControl>
																							<Input
																								placeholder="Point title (EN)"
																								{...field}
																								value={
																									field.value ||
																									""
																								}
																							/>
																						</FormControl>
																						<FormMessage />
																					</FormItem>
																				)}
																			/>
																		</div>
																		<div className="grid gap-4 md:grid-cols-2">
																			<FormField
																				control={form.control}
																				name={
																					`${section.key}.items.${index}.descriptionDe` as `introduction.items.${number}.descriptionDe`
																				}
																				render={({
																					field,
																				}) => (
																					<FormItem>
																						<FormLabel>
																							Description (DE)
																						</FormLabel>
																						<FormControl>
																							<Textarea
																								placeholder="Beschreibung des Punktes..."
																								rows={2}
																								{...field}
																								value={
																									field.value ||
																									""
																								}
																							/>
																						</FormControl>
																						<FormMessage />
																					</FormItem>
																				)}
																			/>
																			<FormField
																				control={form.control}
																				name={
																					`${section.key}.items.${index}.descriptionEn` as `introduction.items.${number}.descriptionEn`
																				}
																				render={({
																					field,
																				}) => (
																					<FormItem>
																						<FormLabel>
																							Description (EN)
																						</FormLabel>
																						<FormControl>
																							<Textarea
																								placeholder="Description of the point..."
																								rows={2}
																								{...field}
																								value={
																									field.value ||
																									""
																								}
																							/>
																						</FormControl>
																						<FormMessage />
																					</FormItem>
																				)}
																			/>
																		</div>
																	</div>
																	<Button
																		type="button"
																		variant="ghost"
																		size="icon"
																		className="shrink-0 text-destructive hover:text-destructive"
																		onClick={async () => {
																			const confirmed =
																				await confirm({
																					title: "Remove Point",
																					description:
																						"Are you sure you want to remove this point?",
																					confirmText:
																						"Remove",
																				});
																			if (confirmed)
																				fieldArray.remove(
																					index
																				);
																		}}
																	>
																		<Trash2 className="h-4 w-4" />
																	</Button>
																</div>
															)
														)}
													</div>

													<div className="grid gap-4 md:grid-cols-2">
														<FormField
															control={form.control}
															name={
																`${section.key}.outroDe` as `introduction.outroDe`
															}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Closing Text (DE)
																	</FormLabel>
																	<FormControl>
																		<Textarea
																			placeholder="Abschlusstext der Sektion..."
																			rows={2}
																			{...field}
																			value={field.value || ""}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={
																`${section.key}.outroEn` as `introduction.outroEn`
															}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Closing Text (EN)
																	</FormLabel>
																	<FormControl>
																		<Textarea
																			placeholder="Closing text for the section..."
																			rows={2}
																			{...field}
																			value={field.value || ""}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<FormField
														control={form.control}
														name={
															`${section.key}.highlighted` as `introduction.highlighted`
														}
														render={({ field }) => (
															<FormItem className="flex items-center gap-2">
																<FormControl>
																	<Switch
																		checked={
																			field.value || false
																		}
																		onCheckedChange={
																			field.onChange
																		}
																	/>
																</FormControl>
																<FormLabel className="mt-0! cursor-pointer">
																	Highlighted Section
																	(background color)
																</FormLabel>
															</FormItem>
														)}
													/>
												</CardContent>
											</Card>
										</TabsContent>
									);
								})}
							</Tabs>
						</TabsContent>

						{/* Contact Tab */}
						<TabsContent value="contact" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Contact Section</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="contact.sectionNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Number</FormLabel>
												<FormControl>
													<Input
														placeholder="10."
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid gap-4 md:grid-cols-2">
										<FormField
											control={form.control}
											name="contact.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (DE)</FormLabel>
													<FormControl>
														<Input
															placeholder="Kontaktieren Sie uns"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="contact.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (EN)</FormLabel>
													<FormControl>
														<Input
															placeholder="Contact Us"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-4 md:grid-cols-2">
										<FormField
											control={form.control}
											name="contact.introDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Introduction Text (DE)</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Wenn Sie Fragen zu dieser Datenschutzrichtlinie haben..."
															rows={2}
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="contact.introEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Introduction Text (EN)</FormLabel>
													<FormControl>
														<Textarea
															placeholder="If you have questions about this privacy policy..."
															rows={2}
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="contact.companyName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Company Name</FormLabel>
													<FormControl>
														<Input
															placeholder="Zavd Medical AB"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="contact.organizationNumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Organization Number
													</FormLabel>
													<FormControl>
														<Input
															placeholder="556871-8075"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="contact.email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															type="email"
															placeholder="info@zavdmedical.se"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="contact.phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone</FormLabel>
													<FormControl>
														<Input
															placeholder="010-205 15 01"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Addresses */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<FormLabel>Addresses</FormLabel>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													contactAddresses.append("" as never)
												}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Address
											</Button>
										</div>
										{contactAddresses.fields.map((field, index) => (
											<div key={field.id} className="flex gap-4">
												<FormField
													control={form.control}
													name={`contact.addresses.${index}`}
													render={({ field }) => (
														<FormItem className="flex-1">
															<FormControl>
																<Input
																	placeholder="Gatuadress, Postnummer Stad"
																	{...field}
																	value={field.value || ""}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="shrink-0 text-destructive hover:text-destructive"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove Address",
															description:
																"Are you sure you want to remove this address?",
															confirmText: "Remove",
														});
														if (confirmed)
															contactAddresses.remove(index);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>

									<FormField
										control={form.control}
										name="contact.highlighted"
										render={({ field }) => (
											<FormItem className="flex items-center gap-2">
												<FormControl>
													<Switch
														checked={field.value || false}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<FormLabel className="!mt-0 cursor-pointer">
													Highlighted Section (background color)
												</FormLabel>
											</FormItem>
										)}
									/>
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
									<div className="grid gap-4 md:grid-cols-2">
										<FormField
											control={form.control}
											name="ctaSection.textDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Text (DE)</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Haben Sie Fragen zum Umgang mit Ihren personenbezogenen Daten?"
															rows={2}
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="ctaSection.textEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Text (EN)</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Do you have questions about how we handle your personal data?"
															rows={2}
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-4">
											<h4 className="font-medium">Primary Button</h4>
											<div className="grid gap-4 md:grid-cols-2">
												<FormField
													control={form.control}
													name="ctaSection.primaryCta.textDe"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Text (DE)</FormLabel>
															<FormControl>
																<Input
																	placeholder="Kontaktieren Sie uns"
																	{...field}
																	value={field.value || ""}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="ctaSection.primaryCta.textEn"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Text (EN)</FormLabel>
															<FormControl>
																<Input
																	placeholder="Contact Us"
																	{...field}
																	value={field.value || ""}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											<FormField
												control={form.control}
												name="ctaSection.primaryCta.href"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Link</FormLabel>
														<FormControl>
															<Input
																placeholder="/kontakt"
																{...field}
																value={field.value || ""}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className="space-y-4">
											<h4 className="font-medium">
												Secondary Button
											</h4>
											<div className="grid gap-4 md:grid-cols-2">
												<FormField
													control={form.control}
													name="ctaSection.secondaryCta.textDe"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Text (DE)</FormLabel>
															<FormControl>
																<Input
																	placeholder="info@zavdmedical.se"
																	{...field}
																	value={field.value || ""}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="ctaSection.secondaryCta.textEn"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Text (EN)</FormLabel>
															<FormControl>
																<Input
																	placeholder="info@zavdmedical.se"
																	{...field}
																	value={field.value || ""}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
											<FormField
												control={form.control}
												name="ctaSection.secondaryCta.href"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Link</FormLabel>
														<FormControl>
															<Input
																placeholder="mailto:info@zavdmedical.se"
																{...field}
																value={field.value || ""}
															/>
														</FormControl>
														<FormMessage />
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
															placeholder="Integritetspolicy - Zavd Medical"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormDescription>
														Recommended length: 50-60 characters
													</FormDescription>
													<FormMessage />
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
															placeholder="Läs om hur Zavd Medical AB behandlar dina personuppgifter enligt GDPR."
															rows={3}
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormDescription>
														Recommended length: 150-160 characters
													</FormDescription>
													<FormMessage />
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
														Image displayed when the page is
														shared on social media
													</FormDescription>
													<FormMessage />
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
												title: form.watch("seo.title") || "Integritetspolicy - Zavd Medical",
												description: form.watch("seo.description") || "Add a description",
												ogImage: form.watch("seo.ogImage") || null,
												slug: "integritetspolicy",
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
			</Form>
			<ConfirmModal />
		</div>
	);
}
