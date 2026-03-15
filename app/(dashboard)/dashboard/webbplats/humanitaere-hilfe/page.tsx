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
	AlignLeft,
	List,
	CreditCard,
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

const leftSchema = z.object({
	sectionTitleDe: z.string().max(300).optional(),
	sectionTitleEn: z.string().max(300).optional(),
	donationArrivesTitleDe: z.string().max(200).optional(),
	donationArrivesTitleEn: z.string().max(200).optional(),
	transparencyTitleDe: z.string().max(200).optional(),
	transparencyTitleEn: z.string().max(200).optional(),
	transparencyTextDe: z.string().optional(),
	transparencyTextEn: z.string().optional(),
	certificateTitleDe: z.string().max(200).optional(),
	certificateTitleEn: z.string().max(200).optional(),
	certificateText1De: z.string().optional(),
	certificateText1En: z.string().optional(),
	certificateText2De: z.string().optional(),
	certificateText2En: z.string().optional(),
	certificateLinkDe: z.string().max(200).optional(),
	certificateLinkEn: z.string().max(200).optional(),
	certificateText3De: z.string().max(200).optional(),
	certificateText3En: z.string().max(200).optional(),
	certificateText4De: z.string().optional(),
	certificateText4En: z.string().optional(),
});

const specialtyItemSchema = z.object({
	textDe: z.string().optional(),
	textEn: z.string().optional(),
});

const middleSchema = z.object({
	whyTitleDe: z.string().max(200).optional(),
	whyTitleEn: z.string().max(200).optional(),
	whyTextDe: z.string().optional(),
	whyTextEn: z.string().optional(),
	specialtyTitleDe: z.string().max(200).optional(),
	specialtyTitleEn: z.string().max(200).optional(),
	specialtyItems: z.array(specialtyItemSchema),
});

const rightSchema = z.object({
	transferTitleDe: z.string().max(200).optional(),
	transferTitleEn: z.string().max(200).optional(),
	recipientLabelDe: z.string().max(100).optional(),
	recipientLabelEn: z.string().max(100).optional(),
	bankLabelDe: z.string().max(100).optional(),
	bankLabelEn: z.string().max(100).optional(),
	bankName: z.string().max(200).optional(),
	purposeLabelDe: z.string().max(100).optional(),
	purposeLabelEn: z.string().max(100).optional(),
	purposeValueDe: z.string().max(200).optional(),
	purposeValueEn: z.string().max(200).optional(),
	iban: z.string().max(50).optional(),
	bic: z.string().max(20).optional(),
	paypalTitleDe: z.string().max(200).optional(),
	paypalTitleEn: z.string().max(200).optional(),
	paypalTextDe: z.string().optional(),
	paypalTextEn: z.string().optional(),
	paypalButtonDe: z.string().max(100).optional(),
	paypalButtonEn: z.string().max(100).optional(),
});

const formSchema = z.object({
	hero: heroSchema,
	left: leftSchema,
	middle: middleSchema,
	right: rightSchema,
});

type FormData = z.infer<typeof formSchema>;

const defaultValues: FormData = {
	hero: {
		taglineDe: "Humanitäre Hilfe",
		taglineEn: "Humanitarian Aid",
		titleDe: "Humanitäre Hilfe",
		titleEn: "Humanitarian Aid",
		subtitleDe: "Humanitäres Konto für die im Krieg und Katastrophen in Not geratene Assyrier in ihren Heimatländern.",
		subtitleEn: "Humanitarian account for Assyrians in need due to war and disasters in their home countries.",
		image: "/images/donate/Spenden-Syrien.jpg",
	},
	left: {
		sectionTitleDe: "Spendenkonto - Humanitäre Hilfe",
		sectionTitleEn: "Donation Account - Humanitarian Aid",
		donationArrivesTitleDe: "Ihre Spende kommt an!",
		donationArrivesTitleEn: "Your donation arrives!",
		transparencyTitleDe: "Spendentransparenz",
		transparencyTitleEn: "Donation Transparency",
		transparencyTextDe: "ZAVD e.V. ist als eingetragene gemeinnützige Organisation von Körperschaft- und Gewerbesteuer befreit. Ihre Spende ist steuerlich absetzbar. Steuernummer: 103/111/70053",
		transparencyTextEn: "ZAVD e.V. is a registered non-profit organization exempt from corporate and trade tax. Your donation is tax-deductible. Tax number: 103/111/70053",
		certificateTitleDe: "Spendenbescheinigung",
		certificateTitleEn: "Donation Certificate",
		certificateText1De: "Ihre Spende ist steuerlich abzugsfähig. Für Beträge unter 200 € genügt eine Kopie Ihres Kontoauszuges mit dem Ausdruck des Spendenauftrags.",
		certificateText1En: "Your donation is tax-deductible. For amounts under €200, a copy of your bank statement with the donation order printout is sufficient.",
		certificateText2De: "Um Spenden von mehr als 200 € steuerlich absetzen zu können, stellen wir Ihnen für das Finanzamt eine Spendenbescheinigung (Steuerbescheinigung) aus.",
		certificateText2En: "To deduct donations of more than €200 for tax purposes, we will issue you a donation certificate (tax receipt) for the tax office.",
		certificateLinkDe: "Sie auf Wunsch",
		certificateLinkEn: "Upon request",
		certificateText3De: "per E-Mail oder Post.",
		certificateText3En: "by email or post.",
		certificateText4De: "20 % des Jahreseinkommens darf als Sonderausgabe für eine Spende geltend gemacht werden.",
		certificateText4En: "20% of annual income may be claimed as a special deduction for a donation.",
	},
	middle: {
		whyTitleDe: "Warum uns spenden?",
		whyTitleEn: "Why donate to us?",
		whyTextDe: "Der Zentralverband der Assyrischen Vereinigungen in Deutschland e.V. (ZAVD) leistet soziale und humanitäre Hilfeleistung für Flüchtlinge und Notleidende Assyrier aus den Herkunftsländern (Syrien, Irak, Türkei, Libanon und Iran). Bitte eine Spende unterstützen sie uns bei Notfallsituationen in den Kriegsgebieten.",
		whyTextEn: "The Central Association of Assyrian Organizations in Germany e.V. (ZAVD) provides social and humanitarian assistance for refugees and suffering Assyrians from their home countries (Syria, Iraq, Turkey, Lebanon and Iran). Please support us with a donation in emergency situations in war zones.",
		specialtyTitleDe: "Unsere Besonderheit:",
		specialtyTitleEn: "Our specialty:",
		specialtyItems: [],
	},
	right: {
		transferTitleDe: "Überweisung",
		transferTitleEn: "Bank Transfer",
		recipientLabelDe: "Empfänger",
		recipientLabelEn: "Recipient",
		bankLabelDe: "Bank",
		bankLabelEn: "Bank",
		bankName: "Sparkasse Gütersloh",
		purposeLabelDe: "Verwendungszweck",
		purposeLabelEn: "Purpose",
		purposeValueDe: "Spende Assyrien",
		purposeValueEn: "Donation Assyria",
		iban: "DE49 4785 0065 0000 8361 66",
		bic: "WELADED1GTL",
		paypalTitleDe: "PayPal",
		paypalTitleEn: "PayPal",
		paypalTextDe: "Mit PayPal besteht die Möglichkeit einer schnellen, unkomplizierten und sicheren Spende über PayPal, Kreditkarte oder EC-Karte. Klicken Sie einfach auf den unteren Button und befolgen Sie die nächsten Schritte.",
		paypalTextEn: "With PayPal, you can make a quick, easy and secure donation via PayPal, credit card or debit card. Simply click the button below and follow the next steps.",
		paypalButtonDe: "Jetzt Spenden!",
		paypalButtonEn: "Donate Now!",
	},
};

export default function HumanitaereHilfeAdminPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { confirm, ConfirmModal } = useConfirmModal({ variant: "destructive" });

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const specialtyItemsArray = useFieldArray({ control: form.control, name: "middle.specialtyItems" });

	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("/api/humanitaere-hilfe-page");
				if (res.ok) {
					const data = await res.json();
					form.reset({
						hero: { ...defaultValues.hero, ...data.hero },
						left: { ...defaultValues.left, ...data.left },
						middle: {
							...defaultValues.middle,
							...data.middle,
							specialtyItems: data.middle?.specialtyItems || [],
						},
						right: { ...defaultValues.right, ...data.right },
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
			const res = await fetch("/api/humanitaere-hilfe-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			const responseData = await res.json();
			if (res.ok) {
				toast.success("Humanitäre Hilfe page saved successfully");
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
					<h1 className="text-3xl font-medium tracking-tight">Humanitäre Hilfe</h1>
					<p className="text-muted-foreground">
						Manage the Humanitäre Hilfe page content in German and English.
					</p>
				</div>
				<a
					href="/spenden/humanitaere-hilfe"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<form id="humanitaere-hilfe-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Tabs defaultValue="hero" className="space-y-6">
					<TabsList className="flex-wrap h-auto justify-start">
						<TabsTrigger value="hero" className="gap-2">
							<ImageIcon className="h-4 w-4" />
							Hero
						</TabsTrigger>
						<TabsTrigger value="left" className="gap-2">
							<AlignLeft className="h-4 w-4" />
							Left Column
						</TabsTrigger>
						<TabsTrigger value="middle" className="gap-2">
							<List className="h-4 w-4" />
							Middle Column
						</TabsTrigger>
						<TabsTrigger value="right" className="gap-2">
							<CreditCard className="h-4 w-4" />
							Right Column
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
										<Input {...form.register("hero.taglineDe")} value={form.watch("hero.taglineDe") || ""} placeholder="Humanitäre Hilfe" />
									</div>
									<div className="space-y-2">
										<Label>Tagline (EN)</Label>
										<Input {...form.register("hero.taglineEn")} value={form.watch("hero.taglineEn") || ""} placeholder="Humanitarian Aid" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Title (DE)</Label>
										<Input {...form.register("hero.titleDe")} value={form.watch("hero.titleDe") || ""} placeholder="Humanitäre Hilfe" />
									</div>
									<div className="space-y-2">
										<Label>Title (EN)</Label>
										<Input {...form.register("hero.titleEn")} value={form.watch("hero.titleEn") || ""} placeholder="Humanitarian Aid" />
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

					{/* ── LEFT COLUMN TAB ── */}
					<TabsContent value="left">
						<Card>
							<CardHeader>
								<CardTitle>Left Column</CardTitle>
								<CardDescription>Donation transparency, certificate information and section title.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Section Title (DE)</Label>
										<Input {...form.register("left.sectionTitleDe")} value={form.watch("left.sectionTitleDe") || ""} placeholder="Spendenkonto - Humanitäre Hilfe" />
									</div>
									<div className="space-y-2">
										<Label>Section Title (EN)</Label>
										<Input {...form.register("left.sectionTitleEn")} value={form.watch("left.sectionTitleEn") || ""} placeholder="Donation Account - Humanitarian Aid" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Donation Arrives Title (DE)</Label>
										<Input {...form.register("left.donationArrivesTitleDe")} value={form.watch("left.donationArrivesTitleDe") || ""} placeholder="Ihre Spende kommt an!" />
									</div>
									<div className="space-y-2">
										<Label>Donation Arrives Title (EN)</Label>
										<Input {...form.register("left.donationArrivesTitleEn")} value={form.watch("left.donationArrivesTitleEn") || ""} placeholder="Your donation arrives!" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Transparency Title (DE)</Label>
										<Input {...form.register("left.transparencyTitleDe")} value={form.watch("left.transparencyTitleDe") || ""} placeholder="Spendentransparenz" />
									</div>
									<div className="space-y-2">
										<Label>Transparency Title (EN)</Label>
										<Input {...form.register("left.transparencyTitleEn")} value={form.watch("left.transparencyTitleEn") || ""} placeholder="Donation Transparency" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Transparency Text (DE)</Label>
										<Textarea {...form.register("left.transparencyTextDe")} value={form.watch("left.transparencyTextDe") || ""} rows={3} />
									</div>
									<div className="space-y-2">
										<Label>Transparency Text (EN)</Label>
										<Textarea {...form.register("left.transparencyTextEn")} value={form.watch("left.transparencyTextEn") || ""} rows={3} />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Certificate Title (DE)</Label>
										<Input {...form.register("left.certificateTitleDe")} value={form.watch("left.certificateTitleDe") || ""} placeholder="Spendenbescheinigung" />
									</div>
									<div className="space-y-2">
										<Label>Certificate Title (EN)</Label>
										<Input {...form.register("left.certificateTitleEn")} value={form.watch("left.certificateTitleEn") || ""} placeholder="Donation Certificate" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Certificate Text 1 (DE)</Label>
										<Textarea {...form.register("left.certificateText1De")} value={form.watch("left.certificateText1De") || ""} rows={3} />
									</div>
									<div className="space-y-2">
										<Label>Certificate Text 1 (EN)</Label>
										<Textarea {...form.register("left.certificateText1En")} value={form.watch("left.certificateText1En") || ""} rows={3} />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Certificate Text 2 (DE)</Label>
										<Textarea {...form.register("left.certificateText2De")} value={form.watch("left.certificateText2De") || ""} rows={3} />
									</div>
									<div className="space-y-2">
										<Label>Certificate Text 2 (EN)</Label>
										<Textarea {...form.register("left.certificateText2En")} value={form.watch("left.certificateText2En") || ""} rows={3} />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Certificate Link (DE)</Label>
										<Input {...form.register("left.certificateLinkDe")} value={form.watch("left.certificateLinkDe") || ""} placeholder="Sie auf Wunsch" />
									</div>
									<div className="space-y-2">
										<Label>Certificate Link (EN)</Label>
										<Input {...form.register("left.certificateLinkEn")} value={form.watch("left.certificateLinkEn") || ""} placeholder="Upon request" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Certificate Text 3 (DE)</Label>
										<Input {...form.register("left.certificateText3De")} value={form.watch("left.certificateText3De") || ""} placeholder="per E-Mail oder Post." />
									</div>
									<div className="space-y-2">
										<Label>Certificate Text 3 (EN)</Label>
										<Input {...form.register("left.certificateText3En")} value={form.watch("left.certificateText3En") || ""} placeholder="by email or post." />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Certificate Text 4 (DE)</Label>
										<Textarea {...form.register("left.certificateText4De")} value={form.watch("left.certificateText4De") || ""} rows={2} />
									</div>
									<div className="space-y-2">
										<Label>Certificate Text 4 (EN)</Label>
										<Textarea {...form.register("left.certificateText4En")} value={form.watch("left.certificateText4En") || ""} rows={2} />
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ── MIDDLE COLUMN TAB ── */}
					<TabsContent value="middle">
						<Card>
							<CardHeader>
								<CardTitle>Middle Column</CardTitle>
								<CardDescription>Why donate section and specialty items list.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Why Title (DE)</Label>
										<Input {...form.register("middle.whyTitleDe")} value={form.watch("middle.whyTitleDe") || ""} placeholder="Warum uns spenden?" />
									</div>
									<div className="space-y-2">
										<Label>Why Title (EN)</Label>
										<Input {...form.register("middle.whyTitleEn")} value={form.watch("middle.whyTitleEn") || ""} placeholder="Why donate to us?" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Why Text (DE)</Label>
										<Textarea {...form.register("middle.whyTextDe")} value={form.watch("middle.whyTextDe") || ""} rows={5} />
									</div>
									<div className="space-y-2">
										<Label>Why Text (EN)</Label>
										<Textarea {...form.register("middle.whyTextEn")} value={form.watch("middle.whyTextEn") || ""} rows={5} />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Specialty Title (DE)</Label>
										<Input {...form.register("middle.specialtyTitleDe")} value={form.watch("middle.specialtyTitleDe") || ""} placeholder="Unsere Besonderheit:" />
									</div>
									<div className="space-y-2">
										<Label>Specialty Title (EN)</Label>
										<Input {...form.register("middle.specialtyTitleEn")} value={form.watch("middle.specialtyTitleEn") || ""} placeholder="Our specialty:" />
									</div>
								</div>

								<div className="space-y-4">
									<Label className="text-base font-semibold">Specialty Items</Label>
									{specialtyItemsArray.fields.map((field, index) => (
										<div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
											<div className="flex items-center text-muted-foreground pt-2">
												<GripVertical className="h-5 w-5" />
											</div>
											<div className="flex-1 space-y-4">
												<div className="grid gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label>Text (DE)</Label>
														<Textarea {...form.register(`middle.specialtyItems.${index}.textDe`)} value={form.watch(`middle.specialtyItems.${index}.textDe`) || ""} rows={2} />
													</div>
													<div className="space-y-2">
														<Label>Text (EN)</Label>
														<Textarea {...form.register(`middle.specialtyItems.${index}.textEn`)} value={form.watch(`middle.specialtyItems.${index}.textEn`) || ""} rows={2} />
													</div>
												</div>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={async () => {
													const ok = await confirm({ title: "Remove Item", description: "Remove this specialty item?", confirmText: "Remove" });
													if (ok) specialtyItemsArray.remove(index);
												}}
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										</div>
									))}
									<Button
										type="button"
										variant="outline"
										onClick={() => specialtyItemsArray.append({ textDe: "", textEn: "" })}
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Specialty Item
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* ── RIGHT COLUMN TAB ── */}
					<TabsContent value="right">
						<Card>
							<CardHeader>
								<CardTitle>Right Column</CardTitle>
								<CardDescription>Bank transfer details and PayPal donation information.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Transfer Title (DE)</Label>
										<Input {...form.register("right.transferTitleDe")} value={form.watch("right.transferTitleDe") || ""} placeholder="Überweisung" />
									</div>
									<div className="space-y-2">
										<Label>Transfer Title (EN)</Label>
										<Input {...form.register("right.transferTitleEn")} value={form.watch("right.transferTitleEn") || ""} placeholder="Bank Transfer" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Recipient Label (DE)</Label>
										<Input {...form.register("right.recipientLabelDe")} value={form.watch("right.recipientLabelDe") || ""} placeholder="Empfänger" />
									</div>
									<div className="space-y-2">
										<Label>Recipient Label (EN)</Label>
										<Input {...form.register("right.recipientLabelEn")} value={form.watch("right.recipientLabelEn") || ""} placeholder="Recipient" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Bank Label (DE)</Label>
										<Input {...form.register("right.bankLabelDe")} value={form.watch("right.bankLabelDe") || ""} placeholder="Bank" />
									</div>
									<div className="space-y-2">
										<Label>Bank Label (EN)</Label>
										<Input {...form.register("right.bankLabelEn")} value={form.watch("right.bankLabelEn") || ""} placeholder="Bank" />
									</div>
								</div>
								<div className="space-y-2">
									<Label>Bank Name</Label>
									<Input {...form.register("right.bankName")} value={form.watch("right.bankName") || ""} placeholder="Sparkasse Gütersloh" />
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Purpose Label (DE)</Label>
										<Input {...form.register("right.purposeLabelDe")} value={form.watch("right.purposeLabelDe") || ""} placeholder="Verwendungszweck" />
									</div>
									<div className="space-y-2">
										<Label>Purpose Label (EN)</Label>
										<Input {...form.register("right.purposeLabelEn")} value={form.watch("right.purposeLabelEn") || ""} placeholder="Purpose" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Purpose Value (DE)</Label>
										<Input {...form.register("right.purposeValueDe")} value={form.watch("right.purposeValueDe") || ""} placeholder="Spende Assyrien" />
									</div>
									<div className="space-y-2">
										<Label>Purpose Value (EN)</Label>
										<Input {...form.register("right.purposeValueEn")} value={form.watch("right.purposeValueEn") || ""} placeholder="Donation Assyria" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>IBAN</Label>
										<Input {...form.register("right.iban")} value={form.watch("right.iban") || ""} placeholder="DE49 4785 0065 0000 8361 66" />
									</div>
									<div className="space-y-2">
										<Label>BIC</Label>
										<Input {...form.register("right.bic")} value={form.watch("right.bic") || ""} placeholder="WELADED1GTL" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>PayPal Title (DE)</Label>
										<Input {...form.register("right.paypalTitleDe")} value={form.watch("right.paypalTitleDe") || ""} placeholder="PayPal" />
									</div>
									<div className="space-y-2">
										<Label>PayPal Title (EN)</Label>
										<Input {...form.register("right.paypalTitleEn")} value={form.watch("right.paypalTitleEn") || ""} placeholder="PayPal" />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>PayPal Text (DE)</Label>
										<Textarea {...form.register("right.paypalTextDe")} value={form.watch("right.paypalTextDe") || ""} rows={4} />
									</div>
									<div className="space-y-2">
										<Label>PayPal Text (EN)</Label>
										<Textarea {...form.register("right.paypalTextEn")} value={form.watch("right.paypalTextEn") || ""} rows={4} />
									</div>
								</div>
								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>PayPal Button (DE)</Label>
										<Input {...form.register("right.paypalButtonDe")} value={form.watch("right.paypalButtonDe") || ""} placeholder="Jetzt Spenden!" />
									</div>
									<div className="space-y-2">
										<Label>PayPal Button (EN)</Label>
										<Input {...form.register("right.paypalButtonEn")} value={form.watch("right.paypalButtonEn") || ""} placeholder="Donate Now!" />
									</div>
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
