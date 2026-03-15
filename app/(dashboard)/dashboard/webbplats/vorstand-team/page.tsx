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
	Shield,
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

const memberSchema = z.object({
	nameDe: z.string().max(200).optional(),
	nameEn: z.string().max(200).optional(),
	roleDe: z.string().max(200).optional(),
	roleEn: z.string().max(200).optional(),
	phone: z.string().max(100).optional(),
	email: z.string().max(200).optional(),
	image: z.string().optional(),
	facebook: z.string().max(500).optional(),
	twitter: z.string().max(500).optional(),
	linkedin: z.string().max(500).optional(),
	instagram: z.string().max(500).optional(),
});

const vorstandSectionSchema = z.object({
	sectionLabelDe: z.string().max(200).optional(),
	sectionLabelEn: z.string().max(200).optional(),
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	members: z.array(memberSchema).optional(),
});

const teamMemberSchema = z.object({
	nameDe: z.string().max(200).optional(),
	nameEn: z.string().max(200).optional(),
	roleDe: z.string().max(200).optional(),
	roleEn: z.string().max(200).optional(),
	bioDe: z.string().optional(),
	bioEn: z.string().optional(),
	phone: z.string().max(100).optional(),
	email: z.string().max(200).optional(),
	image: z.string().optional(),
});

const teamSectionSchema = z.object({
	sectionLabelDe: z.string().max(200).optional(),
	sectionLabelEn: z.string().max(200).optional(),
	headingDe: z.string().max(200).optional(),
	headingEn: z.string().max(200).optional(),
	descriptionDe: z.string().optional(),
	descriptionEn: z.string().optional(),
	members: z.array(teamMemberSchema).optional(),
});

const formSchema = z.object({
	hero: heroSchema,
	vorstand: vorstandSectionSchema,
	team: teamSectionSchema,
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
	hero: {
		taglineDe: "Unsere Leute",
		taglineEn: "Our People",
		titleDe: "Vorstand & Team",
		titleEn: "Board & Team",
		subtitleDe: "Die Menschen, die ZAVD gestalten und leiten – engagiert, erfahren und leidenschaftlich.",
		subtitleEn: "The people who shape and guide ZAVD – committed, experienced, and passionate.",
		image: "/images/about/aboutbanner.jpg",
	},
	vorstand: {
		sectionLabelDe: "Vorstand",
		sectionLabelEn: "Executive Board",
		headingDe: "Unsere Führung",
		headingEn: "Our Leadership",
		members: [],
	},
	team: {
		sectionLabelDe: "Unser Team",
		sectionLabelEn: "Team",
		headingDe: "Leitende Köpfe",
		headingEn: "Leading Heads",
		descriptionDe: "",
		descriptionEn: "",
		members: [],
	},
};

export default function VorstandTeamAdminPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const vorstandMembers = useFieldArray({
		control: form.control,
		name: "vorstand.members",
	});

	const teamMembers = useFieldArray({
		control: form.control,
		name: "team.members",
	});

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/vorstand-team-page");
				if (res.ok) {
					const data = await res.json();
					form.reset({
						hero: { ...defaultValues.hero, ...data.hero },
						vorstand: {
							...defaultValues.vorstand,
							...data.vorstand,
							members: data.vorstand?.members || [],
						},
						team: {
							...defaultValues.team,
							...data.team,
							members: data.team?.members || [],
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
			const res = await fetch("/api/vorstand-team-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const responseData = await res.json();

			if (res.ok) {
				toast.success("Vorstand & Team page saved successfully");
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
					<h1 className="text-3xl font-medium tracking-tight">Vorstand &amp; Team</h1>
					<p className="text-muted-foreground">
						Manage the Board &amp; Team page content in German and English.
					</p>
				</div>
				<a
					href="/uber-zavd/vorstand-team"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<form id="vorstand-team-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Tabs defaultValue="hero" className="space-y-6">
					<TabsList className="flex-wrap h-auto justify-start">
						<TabsTrigger value="hero" className="gap-2">
							<ImageIcon className="h-4 w-4" />
							Hero
						</TabsTrigger>
						<TabsTrigger value="vorstand" className="gap-2">
							<Shield className="h-4 w-4" />
							Executive Board
						</TabsTrigger>
						<TabsTrigger value="team" className="gap-2">
							<Users className="h-4 w-4" />
							Team
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
										<Label>Tagline (DE)</Label>
										<Input
											{...form.register("hero.taglineDe")}
											value={form.watch("hero.taglineDe") || ""}
											placeholder="Unsere Leute"
										/>
									</div>
									<div className="space-y-2">
										<Label>Tagline (EN)</Label>
										<Input
											{...form.register("hero.taglineEn")}
											value={form.watch("hero.taglineEn") || ""}
											placeholder="Our People"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Title (DE)</Label>
										<Input
											{...form.register("hero.titleDe")}
											value={form.watch("hero.titleDe") || ""}
											placeholder="Vorstand & Team"
										/>
									</div>
									<div className="space-y-2">
										<Label>Title (EN)</Label>
										<Input
											{...form.register("hero.titleEn")}
											value={form.watch("hero.titleEn") || ""}
											placeholder="Board & Team"
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
					{/* VORSTAND (BOARD) TAB */}
					{/* ============================================================ */}
					<TabsContent value="vorstand">
						<Card>
							<CardHeader>
								<CardTitle>Executive Board Section</CardTitle>
								<CardDescription>
									Section heading and board member cards. Each member has a name, role, photo, phone, and email.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Section Label (DE)</Label>
										<Input
											{...form.register("vorstand.sectionLabelDe")}
											value={form.watch("vorstand.sectionLabelDe") || ""}
											placeholder="Vorstand"
										/>
									</div>
									<div className="space-y-2">
										<Label>Section Label (EN)</Label>
										<Input
											{...form.register("vorstand.sectionLabelEn")}
											value={form.watch("vorstand.sectionLabelEn") || ""}
											placeholder="Executive Board"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input
											{...form.register("vorstand.headingDe")}
											value={form.watch("vorstand.headingDe") || ""}
											placeholder="Unsere Führung"
										/>
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input
											{...form.register("vorstand.headingEn")}
											value={form.watch("vorstand.headingEn") || ""}
											placeholder="Our Leadership"
										/>
									</div>
								</div>

								<div className="space-y-4">
									<p className="text-sm font-medium">Board Members</p>
									{vorstandMembers.fields.map((field, index) => (
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
															{...form.register(`vorstand.members.${index}.nameDe`)}
															value={form.watch(`vorstand.members.${index}.nameDe`) || ""}
															placeholder="Dr. Ahmad Al-Hassan"
														/>
													</div>
													<div className="space-y-2">
														<Label>Name (EN)</Label>
														<Input
															{...form.register(`vorstand.members.${index}.nameEn`)}
															value={form.watch(`vorstand.members.${index}.nameEn`) || ""}
															placeholder="Dr. Ahmad Al-Hassan"
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Role (DE)</Label>
														<Input
															{...form.register(`vorstand.members.${index}.roleDe`)}
															value={form.watch(`vorstand.members.${index}.roleDe`) || ""}
															placeholder="1. Vorsitzender"
														/>
													</div>
													<div className="space-y-2">
														<Label>Role (EN)</Label>
														<Input
															{...form.register(`vorstand.members.${index}.roleEn`)}
															value={form.watch(`vorstand.members.${index}.roleEn`) || ""}
															placeholder="1st Chairman"
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Phone</Label>
														<Input
															{...form.register(`vorstand.members.${index}.phone`)}
															value={form.watch(`vorstand.members.${index}.phone`) || ""}
															placeholder="+49 30 123456"
														/>
													</div>
													<div className="space-y-2">
														<Label>Email</Label>
														<Input
															{...form.register(`vorstand.members.${index}.email`)}
															value={form.watch(`vorstand.members.${index}.email`) || ""}
															placeholder="member@zavd.de"
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Facebook URL</Label>
														<Input
															{...form.register(`vorstand.members.${index}.facebook`)}
															value={form.watch(`vorstand.members.${index}.facebook`) || ""}
															placeholder="https://facebook.com/..."
														/>
													</div>
													<div className="space-y-2">
														<Label>X (Twitter) URL</Label>
														<Input
															{...form.register(`vorstand.members.${index}.twitter`)}
															value={form.watch(`vorstand.members.${index}.twitter`) || ""}
															placeholder="https://x.com/..."
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>LinkedIn URL</Label>
														<Input
															{...form.register(`vorstand.members.${index}.linkedin`)}
															value={form.watch(`vorstand.members.${index}.linkedin`) || ""}
															placeholder="https://linkedin.com/in/..."
														/>
													</div>
													<div className="space-y-2">
														<Label>Instagram URL</Label>
														<Input
															{...form.register(`vorstand.members.${index}.instagram`)}
															value={form.watch(`vorstand.members.${index}.instagram`) || ""}
															placeholder="https://instagram.com/..."
														/>
													</div>
												</div>
												<div className="space-y-2">
													<Label>Photo</Label>
													<MediaPicker
														type="image"
														value={form.watch(`vorstand.members.${index}.image`) || null}
														onChange={(url) =>
															form.setValue(`vorstand.members.${index}.image`, url || "")
														}
														placeholder="Select member photo"
														galleryTitle="Select Member Photo"
													/>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={async () => {
													const confirmed = await confirm({
														title: "Remove Board Member",
														description: "Are you sure you want to remove this member?",
														confirmText: "Remove",
													});
													if (confirmed) vorstandMembers.remove(index);
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
											vorstandMembers.append({
												nameDe: "",
												nameEn: "",
												roleDe: "",
												roleEn: "",
												phone: "",
												email: "",
												image: "",
												facebook: "",
												twitter: "",
												linkedin: "",
												instagram: "",
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Board Member
									</Button>
								</div>
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
									Section heading, description, and team member cards. Each member has a name, role, bio, photo, phone, and email.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Section Label (DE)</Label>
										<Input
											{...form.register("team.sectionLabelDe")}
											value={form.watch("team.sectionLabelDe") || ""}
											placeholder="Unser Team"
										/>
									</div>
									<div className="space-y-2">
										<Label>Section Label (EN)</Label>
										<Input
											{...form.register("team.sectionLabelEn")}
											value={form.watch("team.sectionLabelEn") || ""}
											placeholder="Team"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Heading (DE)</Label>
										<Input
											{...form.register("team.headingDe")}
											value={form.watch("team.headingDe") || ""}
											placeholder="Leitende Köpfe"
										/>
									</div>
									<div className="space-y-2">
										<Label>Heading (EN)</Label>
										<Input
											{...form.register("team.headingEn")}
											value={form.watch("team.headingEn") || ""}
											placeholder="Leading Heads"
										/>
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Description (DE)</Label>
										<Textarea
											{...form.register("team.descriptionDe")}
											value={form.watch("team.descriptionDe") || ""}
											rows={4}
										/>
									</div>
									<div className="space-y-2">
										<Label>Description (EN)</Label>
										<Textarea
											{...form.register("team.descriptionEn")}
											value={form.watch("team.descriptionEn") || ""}
											rows={4}
										/>
									</div>
								</div>

								<div className="space-y-4">
									<p className="text-sm font-medium">Team Members</p>
									{teamMembers.fields.map((field, index) => (
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
															{...form.register(`team.members.${index}.nameDe`)}
															value={form.watch(`team.members.${index}.nameDe`) || ""}
															placeholder="Omar Khalil"
														/>
													</div>
													<div className="space-y-2">
														<Label>Name (EN)</Label>
														<Input
															{...form.register(`team.members.${index}.nameEn`)}
															value={form.watch(`team.members.${index}.nameEn`) || ""}
															placeholder="Omar Khalil"
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Role (DE)</Label>
														<Input
															{...form.register(`team.members.${index}.roleDe`)}
															value={form.watch(`team.members.${index}.roleDe`) || ""}
															placeholder="Projektleiter Integration"
														/>
													</div>
													<div className="space-y-2">
														<Label>Role (EN)</Label>
														<Input
															{...form.register(`team.members.${index}.roleEn`)}
															value={form.watch(`team.members.${index}.roleEn`) || ""}
															placeholder="Integration Project Lead"
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Bio (DE)</Label>
														<Textarea
															{...form.register(`team.members.${index}.bioDe`)}
															value={form.watch(`team.members.${index}.bioDe`) || ""}
															rows={3}
														/>
													</div>
													<div className="space-y-2">
														<Label>Bio (EN)</Label>
														<Textarea
															{...form.register(`team.members.${index}.bioEn`)}
															value={form.watch(`team.members.${index}.bioEn`) || ""}
															rows={3}
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Phone</Label>
														<Input
															{...form.register(`team.members.${index}.phone`)}
															value={form.watch(`team.members.${index}.phone`) || ""}
															placeholder="+49 30 123456"
														/>
													</div>
													<div className="space-y-2">
														<Label>Email</Label>
														<Input
															{...form.register(`team.members.${index}.email`)}
															value={form.watch(`team.members.${index}.email`) || ""}
															placeholder="member@zavd.de"
														/>
													</div>
												</div>
																								<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Facebook URL</Label>
														<Input
															{...form.register(`team.members.${index}.facebook`)}
															value={form.watch(`team.members.${index}.facebook`) || ""}
															placeholder="https://facebook.com/..."
														/>
													</div>
													<div className="space-y-2">
														<Label>X (Twitter) URL</Label>
														<Input
															{...form.register(`team.members.${index}.twitter`)}
															value={form.watch(`team.members.${index}.twitter`) || ""}
															placeholder="https://x.com/..."
														/>
													</div>
												</div>
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>LinkedIn URL</Label>
														<Input
															{...form.register(`team.members.${index}.linkedin`)}
															value={form.watch(`team.members.${index}.linkedin`) || ""}
															placeholder="https://linkedin.com/in/..."
														/>
													</div>
													<div className="space-y-2">
														<Label>Instagram URL</Label>
														<Input
															{...form.register(`team.members.${index}.instagram`)}
															value={form.watch(`team.members.${index}.instagram`) || ""}
															placeholder="https://instagram.com/..."
														/>
													</div>
												</div>
												<div className="space-y-2">
													<Label>Photo</Label>
													<MediaPicker
														type="image"
														value={form.watch(`team.members.${index}.image`) || null}
														onChange={(url) =>
															form.setValue(`team.members.${index}.image`, url || "")
														}
														placeholder="Select member photo"
														galleryTitle="Select Member Photo"
													/>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={async () => {
													const confirmed = await confirm({
														title: "Remove Team Member",
														description: "Are you sure you want to remove this member?",
														confirmText: "Remove",
													});
													if (confirmed) teamMembers.remove(index);
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
											teamMembers.append({
												nameDe: "",
												nameEn: "",
												roleDe: "",
												roleEn: "",
												bioDe: "",
												bioEn: "",
												phone: "",
												email: "",
												image: "",
												facebook: "",
												twitter: "",
												linkedin: "",
												instagram: "",
											})
										}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Team Member
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
