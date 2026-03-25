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
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";
import { MediaPicker } from "@/components/storage/media-picker";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";
import { useConfirmModal } from "@/components/ui/confirm-modal";

// Section Visibility schema
const sectionVisibilitySchema = z.object({
	hero: z.boolean(),
	stats: z.boolean(),
	teamMembers: z.boolean(),
	values: z.boolean(),
	joinUs: z.boolean(),
	contact: z.boolean(),
});

// Stat schema
const statSchema = z.object({
	value: z.string().optional(),
	labelDe: z.string().optional(),
	labelEn: z.string().optional(),
});

// Team member schema
const teamMemberSchema = z.object({
	name: z.string().optional(),
	roleDe: z.string().optional(),
	roleEn: z.string().optional(),
	departmentDe: z.string().optional(),
	departmentEn: z.string().optional(),
	bioDe: z.string().optional(),
	bioEn: z.string().optional(),
	image: z.string().optional(),
	email: z.string().optional(),
	linkedin: z.string().optional(),
	phone: z.string().optional(),
});

// Value schema
const valueSchema = z.object({
	titleDe: z.string().optional(),
	titleEn: z.string().optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
});

// CTA schema
const ctaSchema = z.object({
	textDe: z.string().optional(),
	textEn: z.string().optional(),
	href: z.string().optional(),
});

// Form schema
const teamPageFormSchema = z.object({
	sectionVisibility: sectionVisibilitySchema,

	hero: z
		.object({
			badgeDe: z.string().optional(),
			badgeEn: z.string().optional(),
			titleDe: z.string().optional(),
			titleEn: z.string().optional(),
			subtitleDe: z.string().optional(),
			subtitleEn: z.string().optional(),
		})
		.optional(),

	stats: z.array(statSchema).optional(),

	teamMembers: z.array(teamMemberSchema).optional(),

	valuesSection: z
		.object({
			titleDe: z.string().optional(),
			titleEn: z.string().optional(),
			subtitleDe: z.string().optional(),
			subtitleEn: z.string().optional(),
			values: z.array(valueSchema).optional(),
		})
		.optional(),

	joinUs: z
		.object({
			titleDe: z.string().optional(),
			titleEn: z.string().optional(),
			descriptionDe: z.string().optional(),
			descriptionEn: z.string().optional(),
			primaryCta: ctaSchema.optional(),
			secondaryCta: ctaSchema.optional(),
		})
		.optional(),

	contact: z
		.object({
			titleDe: z.string().optional(),
			titleEn: z.string().optional(),
			descriptionDe: z.string().optional(),
			descriptionEn: z.string().optional(),
			phone: z.string().optional(),
			email: z.string().optional(),
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

type TeamPageFormValues = z.infer<typeof teamPageFormSchema>;

export default function TeamPageAdmin() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({
		variant: "destructive",
	});

	const form = useForm<TeamPageFormValues>({
		resolver: zodResolver(teamPageFormSchema),
		defaultValues: {
			sectionVisibility: {
				hero: true,
				stats: true,
				teamMembers: true,
				values: true,
				joinUs: true,
				contact: true,
			},
			hero: {},
			stats: [],
			teamMembers: [],
			valuesSection: { values: [] },
			joinUs: {},
			contact: {},
			seo: {},
		},
	});

	const {
		fields: statsFields,
		append: appendStat,
		remove: removeStat,
	} = useFieldArray({
		control: form.control,
		name: "stats",
	});

	const {
		fields: teamMemberFields,
		append: appendTeamMember,
		remove: removeTeamMember,
	} = useFieldArray({
		control: form.control,
		name: "teamMembers",
	});

	const {
		fields: valueFields,
		append: appendValue,
		remove: removeValue,
	} = useFieldArray({
		control: form.control,
		name: "valuesSection.values",
	});

	// Fetch data
	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("/api/team-page");
				if (!response.ok) throw new Error("Failed to fetch");
				const data = await response.json();

				form.reset({
					sectionVisibility: data.sectionVisibility || {
						hero: true,
						stats: true,
						teamMembers: true,
						values: true,
						joinUs: true,
						contact: true,
					},
					hero: data.hero || {},
					stats: data.stats || [],
					teamMembers: data.teamMembers || [],
					valuesSection: {
						...data.valuesSection,
						values: data.valuesSection?.values || [],
					},
					joinUs: data.joinUs || {},
					contact: data.contact || {},
					seo: data.seo || {},
				});
			} catch (error) {
				console.error("Error fetching team page:", error);
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
	async function onSubmit(values: TeamPageFormValues) {
		setSaving(true);
		try {
			const response = await fetch("/api/team-page", {
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

			toast.success("Team page saved successfully");
		} catch (error) {
			console.error("Error saving team page:", error);
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
					<h1 className="text-3xl font-medium tracking-tight">Team Page</h1>
					<p className="text-muted-foreground">
						Manage the content of the team page.
					</p>
				</div>
				<a
					href="/om-oss/team"
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
					id="team-form"
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<Tabs defaultValue="visibility" className="w-full">
						<TabsList className="flex flex-wrap h-auto gap-1 justify-start">
							<TabsTrigger value="visibility">Visibility</TabsTrigger>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="stats">Statistics</TabsTrigger>
							<TabsTrigger value="team">Team</TabsTrigger>
							<TabsTrigger value="values">Values</TabsTrigger>
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
										name="sectionVisibility.stats"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>Statistics</FormLabel>
													<FormDescription>
														Numbers and key figures
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
										name="sectionVisibility.teamMembers"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>Team Members</FormLabel>
													<FormDescription>
														Grid with team members
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
										name="sectionVisibility.values"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>Values</FormLabel>
													<FormDescription>
														Company values
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
										name="sectionVisibility.joinUs"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>Join the Team CTA</FormLabel>
													<FormDescription>
														Recruitment section
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
										name="sectionVisibility.contact"
										render={({ field }) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div>
													<FormLabel>Contact Section</FormLabel>
													<FormDescription>
														Phone and email
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
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="hero.badgeDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge (De)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="z.B. Unser Team"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="hero.badgeEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge (En)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="e.g. Our Team"
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
											name="hero.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (De)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="z.B. Lernen Sie das Team kennen"
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
													<FormLabel>Title (En)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="e.g. Meet the Team"
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
											name="hero.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (De)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Beschreiben Sie das Team..."
															rows={3}
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
													<FormLabel>Subtitle (En)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Describe the team..."
															rows={3}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Stats Tab */}
						<TabsContent value="stats" className="space-y-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<div>
										<CardTitle>Statistics</CardTitle>
										<CardDescription>
											Numbers showing company achievements
										</CardDescription>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendStat({ value: "", labelDe: "", labelEn: "" })
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Stat
									</Button>
								</CardHeader>
								<CardContent className="space-y-4">
									{statsFields.length === 0 && (
										<p className="text-center text-muted-foreground py-8">
											No statistics added. Click &quot;Add Stat&quot;
											to begin.
										</p>
									)}
									{statsFields.map((field, index) => (
										<div
											key={field.id}
											className="flex items-start gap-4 rounded-lg border p-4"
										>
											<div className="grid flex-1 gap-4 sm:grid-cols-3">
												<FormField
													control={form.control}
													name={`stats.${index}.value`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Value</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	placeholder="z.B. 10+"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`stats.${index}.labelDe`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Label (De)</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	placeholder="z.B. Jahre Erfahrung"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`stats.${index}.labelEn`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Label (En)</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	placeholder="e.g. Years of experience"
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
														title: "Remove Statistic",
														description:
															"Are you sure you want to remove this statistic?",
														confirmText: "Remove",
													});
													if (confirmed) removeStat(index);
												}}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>
									))}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Team Members Tab */}
						<TabsContent value="team" className="space-y-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<div>
										<CardTitle>Team Members</CardTitle>
										<CardDescription>
											Add people to the team
										</CardDescription>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() =>
											appendTeamMember({
												name: "",
												roleDe: "",
												roleEn: "",
												departmentDe: "",
												departmentEn: "",
												bioDe: "",
												bioEn: "",
												image: "",
												email: "",
												linkedin: "",
												phone: "",
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Member
									</Button>
								</CardHeader>
								<CardContent className="space-y-6">
									{teamMemberFields.length === 0 && (
										<p className="text-center text-muted-foreground py-8">
											No team members added. Click &quot;Add
											Member&quot; to begin.
										</p>
									)}
									{teamMemberFields.map((field, index) => (
										<div
											key={field.id}
											className="rounded-lg border p-4 space-y-4"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<span className="font-medium">
														Team Member {index + 1}
													</span>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={async () => {
														const confirmed = await confirm({
															title: "Remove Team Member",
															description:
																"Are you sure you want to remove this team member?",
															confirmText: "Remove",
														});
														if (confirmed)
															removeTeamMember(index);
													}}
												>
													<Trash2 className="h-4 w-4 text-destructive" />
												</Button>
											</div>

											<div className="grid gap-4 sm:grid-cols-2">
												<FormField
													control={form.control}
													name={`teamMembers.${index}.name`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Name</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	placeholder="Vorname Nachname"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`teamMembers.${index}.image`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Image</FormLabel>
															<FormControl>
																<MediaPicker
																	type="image"
																	value={field.value || null}
																	onChange={(url) =>
																		field.onChange(url || "")
																	}
																	placeholder="Select team member image"
																	galleryTitle="Select Team Member Image"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`teamMembers.${index}.roleDe`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Role (De)</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	placeholder="z.B. Gesch&auml;ftsf&uuml;hrer"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`teamMembers.${index}.roleEn`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Role (En)</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	placeholder="e.g. CEO & Founder"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`teamMembers.${index}.departmentDe`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Department (De)</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	placeholder="z.B. Leitung"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`teamMembers.${index}.departmentEn`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Department (En)</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	placeholder="e.g. Management"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`teamMembers.${index}.email`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Email</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	type="email"
																	placeholder="name@zavdmedical.se"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`teamMembers.${index}.phone`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Phone</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	placeholder="z.B. 010-205 15 01"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`teamMembers.${index}.linkedin`}
													render={({ field }) => (
														<FormItem className="sm:col-span-2">
															<FormLabel>LinkedIn URL</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	placeholder="https://linkedin.com/in/..."
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`teamMembers.${index}.bioDe`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Biography (De)</FormLabel>
															<FormControl>
																<Textarea
																	{...field}
																	placeholder="Kurze Beschreibung der Person..."
																	rows={3}
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`teamMembers.${index}.bioEn`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Biography (En)</FormLabel>
															<FormControl>
																<Textarea
																	{...field}
																	placeholder="Short description of the person..."
																	rows={3}
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

						{/* Values Tab */}
						<TabsContent value="values" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Values Section</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="valuesSection.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (De)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="z.B. Unsere Werte"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="valuesSection.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (En)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="e.g. Our Values"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="valuesSection.subtitleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (De)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="z.B. Wir werden von gemeinsamen Werten angetrieben..."
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="valuesSection.subtitleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subtitle (En)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="e.g. We are driven by shared values..."
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>

									<div className="border-t pt-4">
										<div className="flex items-center justify-between mb-4">
											<h4 className="text-sm font-semibold">
												Values
											</h4>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													appendValue({
														titleDe: "",
														titleEn: "",
														descriptionDe: "",
														descriptionEn: "",
													})
												}
											>
												<Plus className="mr-2 h-4 w-4" />
												Add Value
											</Button>
										</div>

										{valueFields.length === 0 && (
											<p className="text-center text-muted-foreground py-8">
												No values added. Click &quot;Add Value&quot;
												to begin.
											</p>
										)}

										<div className="space-y-4">
											{valueFields.map((field, index) => (
												<div
													key={field.id}
													className="flex items-start gap-4 rounded-lg border p-4"
												>
													<div className="grid flex-1 gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`valuesSection.values.${index}.titleDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title (De)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			placeholder="z.B. Expertise"
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`valuesSection.values.${index}.titleEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Title (En)</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			placeholder="e.g. Expertise"
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`valuesSection.values.${index}.descriptionDe`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Description (De)
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			placeholder="Kurze Beschreibung..."
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`valuesSection.values.${index}.descriptionEn`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Description (En)
																	</FormLabel>
																	<FormControl>
																		<Input
																			{...field}
																			placeholder="Short description..."
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
																title: "Remove Value",
																description:
																	"Are you sure you want to remove this value?",
																confirmText: "Remove",
															});
															if (confirmed) removeValue(index);
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

						{/* CTA & Contact Tab */}
						<TabsContent value="cta" className="space-y-4">
							{/* Join Us Section */}
							<Card>
								<CardHeader>
									<CardTitle>Join the Team CTA</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="joinUs.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (De)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="z.B. Werden Sie Teil des Teams?"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="joinUs.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (En)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="e.g. Want to join the team?"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="joinUs.descriptionDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description (De)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Beschreiben Sie, warum man bei Ihnen arbeiten sollte..."
															rows={3}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="joinUs.descriptionEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description (En)</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Describe why one should work with you..."
															rows={3}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
									<div className="grid gap-4 sm:grid-cols-2">
										<div className="space-y-4 rounded-lg border p-4">
											<h4 className="text-sm font-semibold">
												Primary Button
											</h4>
											<div className="grid gap-4 sm:grid-cols-2">
												<FormField
													control={form.control}
													name="joinUs.primaryCta.textDe"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Text (De)</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value || ""}
																	placeholder="z.B. Offene Stellen"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="joinUs.primaryCta.textEn"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Text (En)</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value || ""}
																	placeholder="e.g. Open Positions"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
											</div>
											<FormField
												control={form.control}
												name="joinUs.primaryCta.href"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Link</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value || ""}
																placeholder="/om-oss/lediga-tjanster"
															/>
														</FormControl>
													</FormItem>
												)}
											/>
										</div>
										<div className="space-y-4 rounded-lg border p-4">
											<h4 className="text-sm font-semibold">
												Secondary Button
											</h4>
											<div className="grid gap-4 sm:grid-cols-2">
												<FormField
													control={form.control}
													name="joinUs.secondaryCta.textDe"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Text (De)</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value || ""}
																	placeholder="z.B. Kontakt"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="joinUs.secondaryCta.textEn"
													render={({ field }) => (
														<FormItem>
															<FormLabel>Text (En)</FormLabel>
															<FormControl>
																<Input
																	{...field}
																	value={field.value || ""}
																	placeholder="e.g. Contact us"
																/>
															</FormControl>
														</FormItem>
													)}
												/>
											</div>
											<FormField
												control={form.control}
												name="joinUs.secondaryCta.href"
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
								</CardContent>
							</Card>

							{/* Contact Section */}
							<Card>
								<CardHeader>
									<CardTitle>Contact Section</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="contact.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (De)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="z.B. Haben Sie Fragen?"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="contact.titleEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (En)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="e.g. Got questions?"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="contact.descriptionDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description (De)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="z.B. Z&ouml;gern Sie nicht, uns zu kontaktieren..."
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="contact.descriptionEn"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description (En)</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="e.g. Don't hesitate to contact us..."
														/>
													</FormControl>
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
															{...field}
															value={field.value || ""}
															placeholder="z.B. 010-205 15 01"
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="contact.email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															type="email"
															placeholder="info@zavdmedical.se"
														/>
													</FormControl>
												</FormItem>
											)}
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
											Search engine optimization for the team page.
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="seo.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Page Title</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															placeholder="Unser Team - Zavd Medical"
														/>
													</FormControl>
													<FormDescription>
														Displayed in browser tab and search results.
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
															placeholder="A short description of the team page..."
															rows={3}
														/>
													</FormControl>
													<FormDescription>
														Short description shown in search results.
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
														Image shown when sharing on social media.
													</FormDescription>
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Preview</CardTitle>
										<CardDescription>
											See how the team page appears in search results and social media.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<SeoPreview
											data={{
												title: form.watch("seo.title") || "Unser Team - Zavd Medical",
												description: form.watch("seo.description") || "Add a description",
												slug: "om-oss/team",
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
