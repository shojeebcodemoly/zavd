"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
	Building2,
	Phone,
	Mail,
	MapPin,
	Globe,
	Search,
	Plus,
	Trash2,
	Loader2,
	Eye,
	EyeOff,
	Image,
	LayoutGrid,
	GripVertical,
	Clock,
	Heart,
} from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MediaPicker } from "@/components/storage/media-picker";
import { SeoPreview } from "@/components/admin/seo/SeoPreview";
import { TagInput } from "@/components/admin/TagInput";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Validation schema matching the API
const officeSchema = z.object({
	name: z.string().min(1, "Office name is required"),
	street: z.string().min(1, "Street is required"),
	postalCode: z.string().min(1, "Postal code is required"),
	city: z.string().min(1, "City is required"),
	country: z.string().optional(),
	isHeadquarters: z.boolean().optional(),
	isVisible: z.boolean().optional(),
	mapEmbedUrl: z.string().optional(),
});

const footerLinkSchema = z.object({
	label: z.string(),
	href: z.string(),
	isExternal: z.boolean().optional(),
});

const footerBannerSchema = z.object({
	enabled: z.boolean(),
	backgroundImage: z.string().optional(),
	badge: z.string().optional(),
	title: z.string().optional(),
	ctaText: z.string().optional(),
	ctaHref: z.string().optional(),
});

const settingsFormSchema = z.object({
	// Company
	companyName: z.string().min(1, "Company name is required"),
	orgNumber: z.string().min(1, "Organization number is required"),
	vatNumber: z.string().optional(),

	// Contact
	phone: z.string().min(1, "Phone is required"),
	email: z.string().email("Invalid email"),
	noreplyEmail: z.string().email("Invalid email").optional().or(z.literal("")),
	contactBackground: z.string().optional(),

	// Offices
	offices: z.array(officeSchema),

	// Social
	socialMedia: z.object({
		facebook: z.string().optional(),
		instagram: z.string().optional(),
		linkedin: z.string().optional(),
		twitter: z.string().optional(),
		youtube: z.string().optional(),
	}),

	// SEO
	seo: z.object({
		siteName: z.string().min(1, "Site name is required"),
		siteTagline: z.string().max(150).optional(),
		siteDescription: z.string().optional(),
		ogImage: z.string().optional(),
		keywords: z.array(z.string()).optional(),
		twitterHandle: z.string().optional(),
	}),

	// Branding
	branding: z.object({
		logoUrl: z.string().optional(),
		faviconUrl: z.string().optional(),
		dashboardLogoUrl: z.string().optional(),
	}),

	// Footer
	footer: z.object({
		banner: footerBannerSchema.optional(),
		quickLinksTitle: z.string().optional(),
		contactTitle: z.string().optional(),
		newsletterTitle: z.string().optional(),
		quickLinks: z.array(footerLinkSchema),
		newsletterDescription: z.string().optional(),
		newsletterPlaceholder: z.string().optional(),
		newsletterButtonText: z.string().optional(),
		bottomLinks: z.array(footerLinkSchema),
	}),

	// Coming Soon
	comingSoon: z.object({
		enabled: z.boolean().optional(),
		heading: z.string().optional(),
		description: z.string().optional(),
		newsletterTitle: z.string().optional(),
		newsletterDescription: z.string().optional(),
		emailPlaceholder: z.string().optional(),
		buttonText: z.string().optional(),
		designedBy: z.string().optional(),
	}),

	// SMTP / Email
	smtp: z.object({
		enabled: z.boolean().optional(),
		host: z.string().max(200).optional(),
		port: z.number().int().min(1).max(65535).optional(),
		username: z.string().max(200).optional(),
		password: z.string().max(500).optional(),
		encryption: z.enum(["none", "ssl", "tls"]).optional(),
		fromName: z.string().max(100).optional(),
		fromEmail: z.string().email().optional().or(z.literal("")),
		adminNotificationEmail: z.string().email().optional().or(z.literal("")),
	}).optional(),

	// Donation widget
	donationWidget: z.object({
		enabled: z.boolean().optional(),
		title: z.string().optional(),
		amountsStr: z.string().optional(), // comma-separated on the form side
		currency: z.string().optional(),
		buttonText: z.string().optional(),
		donationLink: z.string().optional(),
	}).optional(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(settingsFormSchema),
		defaultValues: {
			companyName: "",
			orgNumber: "",
			vatNumber: "",
			phone: "",
			email: "",
			noreplyEmail: "",
			contactBackground: "",
			offices: [],
			socialMedia: {
				facebook: "",
				instagram: "",
				linkedin: "",
				twitter: "",
				youtube: "",
			},
			seo: {
				siteName: "",
				siteTagline: "",
				siteDescription: "",
				ogImage: "",
				keywords: [],
				twitterHandle: "",
			},
			branding: {
				logoUrl: "",
				faviconUrl: "",
				dashboardLogoUrl: "",
			},
			footer: {
				banner: {
					enabled: true,
					backgroundImage: "",
					badge: "COMMUNITY ORGANIZATION",
					title: "We make the creative solutions for modern brands.",
					ctaText: "About Us",
					ctaHref: "/about",
				},
				quickLinksTitle: "Links",
				contactTitle: "Office",
				newsletterTitle: "Stay Updated",
				quickLinks: [],
				newsletterDescription: "",
				newsletterPlaceholder: "Your email address",
				newsletterButtonText: "Subscribe",
				bottomLinks: [],
			},
			comingSoon: {
				enabled: false,
				heading: "Kommer snart",
				description: "Något nytt är på väg… Vi förbereder lanseringen av något spännande. Vi finjusterar detaljerna och ses snart!",
				newsletterTitle: "Nyhetsbrev",
				newsletterDescription: "Prenumerera för att hålla dig uppdaterad om ny webbdesign och senaste uppdateringar. Låt oss göra det!",
				emailPlaceholder: "E-postadress",
				buttonText: "Skicka",
				designedBy: "ZAVD - Zentralverband Assyrischer Vereinigungen in Deutschland",
			},
			smtp: {
				enabled: false,
				host: "",
				port: 587,
				username: "",
				password: "",
				encryption: "tls",
				fromName: "",
				fromEmail: "",
				adminNotificationEmail: "",
			},
			donationWidget: {
				enabled: false,
				title: "Make a Donation",
				amountsStr: "5,10,25,50,100,200,300",
				currency: "€",
				buttonText: "Donate Now",
				donationLink: "",
			},
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "offices",
	});

	const {
		fields: quickLinkFields,
		append: appendQuickLink,
		remove: removeQuickLink,
	} = useFieldArray({
		control: form.control,
		name: "footer.quickLinks",
	});

	const {
		fields: bottomLinkFields,
		append: appendBottomLink,
		remove: removeBottomLink,
	} = useFieldArray({
		control: form.control,
		name: "footer.bottomLinks",
	});

	// Fetch settings on mount
	useEffect(() => {
		const fetchSettings = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/site-settings");
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Failed to fetch settings");
				}

				const settings = data.data;

				// Reset form with fetched data
				form.reset({
					companyName: settings.companyName || "",
					orgNumber: settings.orgNumber || "",
					vatNumber: settings.vatNumber || "",
					phone: settings.phone || "",
					email: settings.email || "",
					noreplyEmail: settings.noreplyEmail || "",
					contactBackground: settings.contactBackground || "",
					offices: settings.offices || [],
					socialMedia: {
						facebook: settings.socialMedia?.facebook || "",
						instagram: settings.socialMedia?.instagram || "",
						linkedin: settings.socialMedia?.linkedin || "",
						twitter: settings.socialMedia?.twitter || "",
						youtube: settings.socialMedia?.youtube || "",
					},
					seo: {
						siteName: settings.seo?.siteName || "",
						siteTagline: settings.seo?.siteTagline || "",
						siteDescription: settings.seo?.siteDescription || "",
						ogImage: settings.seo?.ogImage || "",
						keywords: settings.seo?.keywords || [],
						twitterHandle: settings.seo?.twitterHandle || "",
					},
					branding: {
						logoUrl: settings.branding?.logoUrl || "",
						faviconUrl: settings.branding?.faviconUrl || "",
						dashboardLogoUrl: settings.branding?.dashboardLogoUrl || "",
					},
					footer: {
						banner: {
							enabled: settings.footer?.banner?.enabled ?? true,
							backgroundImage: settings.footer?.banner?.backgroundImage || "",
							badge: settings.footer?.banner?.badge || "COMMUNITY ORGANIZATION",
							title: settings.footer?.banner?.title || "We make the creative solutions for modern brands.",
							ctaText: settings.footer?.banner?.ctaText || "About Us",
							ctaHref: settings.footer?.banner?.ctaHref || "/about",
						},
						quickLinksTitle: settings.footer?.quickLinksTitle || "Links",
						contactTitle: settings.footer?.contactTitle || "Office",
						newsletterTitle: settings.footer?.newsletterTitle || "Stay Updated",
						quickLinks: (settings.footer?.quickLinks || []).map((link: { label: string; href: string; isExternal?: boolean }) => ({
							...link,
							isExternal: link.isExternal ?? false,
						})),
						newsletterDescription: settings.footer?.newsletterDescription || "",
						newsletterPlaceholder: settings.footer?.newsletterPlaceholder || "Your email address",
						newsletterButtonText: settings.footer?.newsletterButtonText || "Subscribe",
						bottomLinks: (settings.footer?.bottomLinks || []).map((link: { label: string; href: string; isExternal?: boolean }) => ({
							...link,
							isExternal: link.isExternal ?? false,
						})),
					},
					comingSoon: {
						enabled: settings.comingSoon?.enabled ?? false,
						heading: settings.comingSoon?.heading || "Kommer snart",
						description: settings.comingSoon?.description || "Något nytt är på väg… Vi förbereder lanseringen av något spännande. Vi finjusterar detaljerna och ses snart!",
						newsletterTitle: settings.comingSoon?.newsletterTitle || "Nyhetsbrev",
						newsletterDescription: settings.comingSoon?.newsletterDescription || "Prenumerera för att hålla dig uppdaterad om ny webbdesign och senaste uppdateringar. Låt oss göra det!",
						emailPlaceholder: settings.comingSoon?.emailPlaceholder || "E-postadress",
						buttonText: settings.comingSoon?.buttonText || "Skicka",
						designedBy: settings.comingSoon?.designedBy || "ZAVD - Zentralverband Assyrischer Vereinigungen in Deutschland",
					},
					smtp: {
						enabled: settings.smtp?.enabled ?? false,
						host: settings.smtp?.host || "",
						port: settings.smtp?.port || 587,
						username: settings.smtp?.username || "",
						password: settings.smtp?.password || "",
						encryption: settings.smtp?.encryption || "tls",
						fromName: settings.smtp?.fromName || "",
						fromEmail: settings.smtp?.fromEmail || "",
						adminNotificationEmail: settings.smtp?.adminNotificationEmail || "",
					},
					donationWidget: {
						enabled: settings.donationWidget?.enabled ?? false,
						title: settings.donationWidget?.title || "Make a Donation",
						amountsStr: (settings.donationWidget?.amounts || [5, 10, 25, 50, 100, 200, 300]).join(","),
						currency: settings.donationWidget?.currency || "€",
						buttonText: settings.donationWidget?.buttonText || "Donate Now",
						donationLink: settings.donationWidget?.donationLink || "",
					},
				});
			} catch (error) {
				console.error("Error fetching settings:", error);
				toast.error("Failed to load settings");
			} finally {
				setLoading(false);
			}
		};

		fetchSettings();
	}, [form]);

	const onSubmit = async (values: SettingsFormValues) => {
		try {
			setSaving(true);
			console.log("Submitting settings:", values);

			// Filter out empty links; parse amountsStr → amounts for donation widget
			const { donationWidget, ...restValues } = values;
			const cleanedValues = {
				...restValues,
				footer: {
					...values.footer,
					quickLinks: values.footer.quickLinks?.filter(
						link => link.label && link.href
					) || [],
					bottomLinks: values.footer.bottomLinks?.filter(
						link => link.label && link.href
					) || [],
				},
				donationWidget: donationWidget ? {
					enabled: donationWidget.enabled ?? false,
					title: donationWidget.title,
					amounts: (donationWidget.amountsStr || "")
						.split(",")
						.map((s) => parseFloat(s.trim()))
						.filter((n) => !isNaN(n)),
					currency: donationWidget.currency,
					buttonText: donationWidget.buttonText,
					donationLink: donationWidget.donationLink,
				} : undefined,
			};

			console.log("Cleaned values:", cleanedValues);

			const response = await fetch("/api/site-settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(cleanedValues),
			});

			const data = await response.json();
			console.log("Response:", response.status, data);

			if (!response.ok) {
				throw new Error(data.message || "Failed to save settings");
			}

			toast.success("Settings saved successfully");

			// Reload the page after 1 second to reflect changes
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} catch (error) {
			console.error("Error saving settings:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save settings"
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
					<p className="mt-4 text-muted-foreground">Loading settings...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-medium tracking-tight">Site Settings</h1>
				<p className="text-muted-foreground">
					Manage your website settings, contact information, and SEO defaults.
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(
						onSubmit,
						(errors) => {
							console.error("Form validation errors:", errors);

							// Get all error messages
							const errorMessages: string[] = [];

							// Check for company errors
							if (errors.companyName) errorMessages.push("Company name is required");
							if (errors.orgNumber) errorMessages.push("Organization number is required");
							if (errors.email) errorMessages.push("Valid email is required");
							if (errors.phone) errorMessages.push("Phone number is required");

							// Check for office errors
							if (errors.offices) {
								errorMessages.push("Please check office information");
							}

							// Show first error or generic message
							const firstError = errorMessages[0] || "Please fix all validation errors before saving";
							toast.error(firstError);
						}
					)}
					className="space-y-6"
				>
					<Tabs defaultValue="company" className="space-y-6">
						<TabsList className="grid w-full grid-cols-9">
							<TabsTrigger value="company" className="flex items-center gap-2">
								<Building2 className="h-4 w-4" />
								<span className="hidden sm:inline">Company</span>
							</TabsTrigger>
							<TabsTrigger value="offices" className="flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								<span className="hidden sm:inline">Offices</span>
							</TabsTrigger>
							<TabsTrigger value="social" className="flex items-center gap-2">
								<Globe className="h-4 w-4" />
								<span className="hidden sm:inline">Social</span>
							</TabsTrigger>
							<TabsTrigger value="seo" className="flex items-center gap-2">
								<Search className="h-4 w-4" />
								<span className="hidden sm:inline">SEO</span>
							</TabsTrigger>
							<TabsTrigger value="branding" className="flex items-center gap-2">
								<Image className="h-4 w-4" />
								<span className="hidden sm:inline">Branding</span>
							</TabsTrigger>
							<TabsTrigger value="footer" className="flex items-center gap-2">
								<LayoutGrid className="h-4 w-4" />
								<span className="hidden sm:inline">Footer</span>
							</TabsTrigger>
							<TabsTrigger value="coming-soon" className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								<span className="hidden sm:inline">Coming Soon</span>
							</TabsTrigger>
							<TabsTrigger value="email-smtp" className="flex items-center gap-2">
								<Mail className="h-4 w-4" />
								<span className="hidden sm:inline">Email / SMTP</span>
							</TabsTrigger>
							<TabsTrigger value="donation" className="flex items-center gap-2">
								<Heart className="h-4 w-4" />
								<span className="hidden sm:inline">Donation</span>
							</TabsTrigger>
						</TabsList>

						{/* Company Tab */}
						<TabsContent value="company" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Company Information</CardTitle>
									<CardDescription>
										Basic information about your company.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="companyName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Company Name</FormLabel>
													<FormControl>
														<Input placeholder="Zavd Medical AB" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="orgNumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Organization Number</FormLabel>
													<FormControl>
														<Input placeholder="556871-8075" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="vatNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>VAT Number (Optional)</FormLabel>
												<FormControl>
													<Input placeholder="SE556871807501" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Phone className="h-5 w-5" />
										Contact Information
									</CardTitle>
									<CardDescription>
										Primary contact details used across the website.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone Number</FormLabel>
												<FormControl>
													<Input placeholder="010-205 15 01" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														<Mail className="h-4 w-4 inline mr-1" />
														Contact Email
													</FormLabel>
													<FormControl>
														<Input placeholder="info@zavd.se" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="noreplyEmail"
											render={({ field }) => (
												<FormItem>
													<FormLabel>No-Reply Email (Optional)</FormLabel>
													<FormControl>
														<Input placeholder="noreply@zavd.se" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="contactBackground"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Contact Card Background Image</FormLabel>
												<FormDescription>
													Background image for the &quot;Do you have questions?&quot; card on project pages.
												</FormDescription>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || ""}
														onChange={(url) => field.onChange(url ?? "")}
														placeholder="Select background image..."
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Offices Tab */}
						<TabsContent value="offices" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span className="flex items-center gap-2">
											<MapPin className="h-5 w-5" />
											Office Locations
										</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												append({
													name: "",
													street: "",
													postalCode: "",
													city: "",
													country: "Sverige",
													isHeadquarters: false,
													isVisible: true,
													mapEmbedUrl: "",
												})
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Office
										</Button>
									</CardTitle>
									<CardDescription>
										Add and manage your office locations.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{fields.length === 0 ? (
										<div className="text-center py-8 text-muted-foreground">
											No offices added yet. Click &quot;Add Office&quot; to add
											your first location.
										</div>
									) : (
										fields.map((field, index) => (
											<Card
												key={field.id}
												className={`border-dashed ${
													!form.watch(`offices.${index}.isVisible`)
														? "opacity-60"
														: ""
												}`}
											>
												<CardHeader className="pb-3">
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-3">
															<CardTitle className="text-base">
																Office {index + 1}
															</CardTitle>
															<FormField
																control={form.control}
																name={`offices.${index}.isVisible`}
																render={({ field }) => (
																	<FormItem className="flex items-center gap-2 space-y-0">
																		<FormControl>
																			<Button
																				type="button"
																				variant={
																					field.value ? "primary" : "outline"
																				}
																				size="sm"
																				onClick={() =>
																					field.onChange(!field.value)
																				}
																				className="h-7 px-2 text-xs"
																			>
																				{field.value ? (
																					<>
																						<Eye className="h-3 w-3 mr-1" />
																						Visible
																					</>
																				) : (
																					<>
																						<EyeOff className="h-3 w-3 mr-1" />
																						Hidden
																					</>
																				)}
																			</Button>
																		</FormControl>
																	</FormItem>
																)}
															/>
														</div>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={() => remove(index)}
															className="text-destructive hover:text-destructive"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</CardHeader>
												<CardContent className="space-y-4">
													<div className="grid gap-4 sm:grid-cols-2">
														<FormField
															control={form.control}
															name={`offices.${index}.name`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Office Name</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="Stockholm"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`offices.${index}.isHeadquarters`}
															render={({ field }) => (
																<FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
																	<FormControl>
																		<Checkbox
																			checked={field.value}
																			onCheckedChange={field.onChange}
																		/>
																	</FormControl>
																	<FormLabel className="font-normal">
																		Headquarters
																	</FormLabel>
																</FormItem>
															)}
														/>
													</div>

													<FormField
														control={form.control}
														name={`offices.${index}.street`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Street Address</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Turebergsvägen 5"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<div className="grid gap-4 sm:grid-cols-3">
														<FormField
															control={form.control}
															name={`offices.${index}.postalCode`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Postal Code</FormLabel>
																	<FormControl>
																		<Input placeholder="191 47" {...field} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`offices.${index}.city`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>City</FormLabel>
																	<FormControl>
																		<Input placeholder="Sollentuna" {...field} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
														<FormField
															control={form.control}
															name={`offices.${index}.country`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Country</FormLabel>
																	<FormControl>
																		<Input placeholder="Sverige" {...field} />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>

													<FormField
														control={form.control}
														name={`offices.${index}.mapEmbedUrl`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Google Maps Embed URL (Optional)
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="https://www.google.com/maps/embed?pb=..."
																		{...field}
																	/>
																</FormControl>
																<FormDescription>
																	Paste the embed URL from Google Maps to show a
																	map for this location.
																</FormDescription>
																<FormMessage />
															</FormItem>
														)}
													/>
												</CardContent>
											</Card>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

						{/* Social Tab */}
						<TabsContent value="social" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Globe className="h-5 w-5" />
										Social Media Links
									</CardTitle>
									<CardDescription>
										Connect your social media profiles.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="socialMedia.facebook"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Facebook</FormLabel>
												<FormControl>
													<Input
														placeholder="https://facebook.com/zavdmedical"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="socialMedia.instagram"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Instagram</FormLabel>
												<FormControl>
													<Input
														placeholder="https://instagram.com/zavdmedical"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="socialMedia.linkedin"
										render={({ field }) => (
											<FormItem>
												<FormLabel>LinkedIn</FormLabel>
												<FormControl>
													<Input
														placeholder="https://linkedin.com/company/zavd-medical"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="socialMedia.twitter"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Twitter / X</FormLabel>
												<FormControl>
													<Input
														placeholder="https://twitter.com/zavdmedical"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="socialMedia.youtube"
										render={({ field }) => (
											<FormItem>
												<FormLabel>YouTube</FormLabel>
												<FormControl>
													<Input
														placeholder="https://youtube.com/@zavdmedical"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* SEO Tab */}
						<TabsContent value="seo" className="space-y-6">
							<div className="grid gap-6 lg:grid-cols-2">
								{/* SEO Settings Card */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Search className="h-5 w-5" />
											SEO Defaults
										</CardTitle>
										<CardDescription>
											Default SEO settings used when page-specific settings are
											not provided.
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<FormField
											control={form.control}
											name="seo.siteName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Site Name</FormLabel>
													<FormControl>
														<Input placeholder="ZAVD" {...field} />
													</FormControl>
													<FormDescription>
														Used in page titles and meta tags.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="seo.siteTagline"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Site Tagline</FormLabel>
													<FormControl>
														<Input placeholder="Ost från Boxholm" {...field} />
													</FormControl>
													<FormDescription>
														Subtitle shown after site name in the browser tab title.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="seo.siteDescription"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Site Description</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Sveriges ledande leverantör av MDR-certifierad klinikutrustning..."
															rows={3}
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Default meta description for pages without their
														own.
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
													<FormLabel>Default OG Image</FormLabel>
													<FormControl>
														<MediaPicker
															type="image"
															value={field.value || null}
															onChange={(url) => field.onChange(url || "")}
															placeholder="Select OG image (1200x630px recommended)"
															galleryTitle="Select OG Image"
														/>
													</FormControl>
													<FormDescription>
														Default social sharing image. Recommended size:
														1200x630px (1.91:1 aspect ratio).
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="seo.twitterHandle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Twitter Handle</FormLabel>
													<FormControl>
														<Input placeholder="@zavdmedical" {...field} />
													</FormControl>
													<FormDescription>
														Used for Twitter card attribution.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="seo.keywords"
											render={({ field }) => (
												<FormItem>
													<FormLabel>SEO Keywords</FormLabel>
													<FormControl>
														<TagInput
															value={field.value || []}
															onChange={field.onChange}
															placeholder="Add keyword and press Enter..."
															maxTags={15}
														/>
													</FormControl>
													<FormDescription>
														Default meta keywords for the site. Press Enter or comma to add.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>

								{/* SEO Preview Card */}
								<Card>
									<CardHeader>
										<CardTitle>Preview</CardTitle>
										<CardDescription>
											See how your site will appear in search results and social
											media.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<SeoPreview
											data={{
												title:
													form.watch("seo.siteName") ||
													"Zavd Medical",
												description:
													form.watch("seo.siteDescription") ||
													"Add a site description",
												slug: "",
												ogImage: form.watch("seo.ogImage") || null,
												siteName:
													form.watch("seo.siteName") || "Zavd Medical",
												siteUrl: "www.zavd.se",
											}}
										/>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						{/* Branding Tab */}
						<TabsContent value="branding" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Image className="h-5 w-5" />
										Logo & Favicon
									</CardTitle>
									<CardDescription>
										Upload your brand assets. These will be used across the website.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<FormField
										control={form.control}
										name="branding.logoUrl"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Logo</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || null}
														onChange={(url) => field.onChange(url || "")}
														placeholder="Select logo image (SVG recommended)"
														galleryTitle="Select Logo"
													/>
												</FormControl>
												<FormDescription>
													Recommended: SVG format for best quality at all sizes.
													Used in navigation and footer.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="branding.faviconUrl"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Favicon</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || null}
														onChange={(url) => field.onChange(url || "")}
														placeholder="Select favicon (ICO or PNG, 32x32px)"
														galleryTitle="Select Favicon"
													/>
												</FormControl>
												<FormDescription>
													Recommended: 32x32px ICO or PNG file. This is the
													small icon shown in browser tabs.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="branding.dashboardLogoUrl"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Dashboard Logo</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || null}
														onChange={(url) => field.onChange(url || "")}
														placeholder="Select dashboard logo (SVG or PNG)"
														galleryTitle="Select Dashboard Logo"
													/>
												</FormControl>
												<FormDescription>
													Logo displayed in the admin dashboard sidebar and header.
													If not set, the main logo will be used.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Footer Tab */}
						<TabsContent value="footer" className="space-y-6">
							{/* Footer Banner Card */}
							<Card>
								<CardHeader>
									<CardTitle>Footer Banner (Pre-Footer CTA)</CardTitle>
									<CardDescription>
										A full-width banner section above the footer with background image and fade effect.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="footer.banner.enabled"
										render={({ field }) => (
											<FormItem className="flex flex-row items-start space-x-3 space-y-0">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>Enable Footer Banner</FormLabel>
													<FormDescription>
														Show the banner section with background image above the footer.
													</FormDescription>
												</div>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="footer.banner.backgroundImage"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Background Image</FormLabel>
												<FormControl>
													<MediaPicker
														type="image"
														value={field.value || null}
														onChange={(url) => field.onChange(url || "")}
														placeholder="Select banner background image"
														galleryTitle="Select Banner Image"
														showPreview
													/>
												</FormControl>
												<FormDescription>
													A large image (at least 1920px wide) that fades into the footer.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="footer.banner.badge"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Badge Text</FormLabel>
													<FormControl>
														<Input placeholder="COMMUNITY ORGANIZATION" {...field} />
													</FormControl>
													<FormDescription>
														Small label shown above the title.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="footer.banner.title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input placeholder="We make the creative solutions..." {...field} />
													</FormControl>
													<FormDescription>
														Main heading displayed on the banner.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="footer.banner.ctaText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Button Text</FormLabel>
													<FormControl>
														<Input placeholder="About Us" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="footer.banner.ctaHref"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Button Link</FormLabel>
													<FormControl>
														<Input placeholder="/about" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Section Headers Card */}
							<Card>
								<CardHeader>
									<CardTitle>Section Headers</CardTitle>
									<CardDescription>
										Customize the section titles shown in the footer.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-3">
										<FormField
											control={form.control}
											name="footer.quickLinksTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Quick Links Title</FormLabel>
													<FormControl>
														<Input placeholder="Snabblänkar" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="footer.contactTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Contact Title</FormLabel>
													<FormControl>
														<Input placeholder="Kontakta oss" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="footer.newsletterTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Newsletter Title</FormLabel>
													<FormControl>
														<Input placeholder="Håll dig uppdaterad" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Quick Links Card */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Quick Links</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendQuickLink({ label: "", href: "", isExternal: false })
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Link
										</Button>
									</CardTitle>
									<CardDescription>
										Links displayed in the footer quick links section.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{quickLinkFields.length === 0 ? (
										<div className="text-center py-6 text-muted-foreground">
											No quick links added yet. Click &quot;Add Link&quot; to add one.
										</div>
									) : (
										quickLinkFields.map((field, index) => (
											<div
												key={field.id}
												className="flex items-start gap-3 p-3 border rounded-lg"
											>
												<GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
												<div className="flex-1 grid gap-3 sm:grid-cols-2">
													<FormField
														control={form.control}
														name={`footer.quickLinks.${index}.label`}
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-xs">Label</FormLabel>
																<FormControl>
																	<Input placeholder="Link label" {...field} />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`footer.quickLinks.${index}.href`}
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-xs">URL</FormLabel>
																<FormControl>
																	<Input placeholder="/page-url" {...field} />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
												<FormField
													control={form.control}
													name={`footer.quickLinks.${index}.isExternal`}
													render={({ field }) => (
														<FormItem className="flex items-center gap-2 space-y-0 mt-6">
															<FormControl>
																<Checkbox
																	checked={field.value}
																	onCheckedChange={field.onChange}
																/>
															</FormControl>
															<FormLabel className="text-xs font-normal">
																External
															</FormLabel>
														</FormItem>
													)}
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeQuickLink(index)}
													className="text-destructive hover:text-destructive mt-5"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))
									)}
								</CardContent>
							</Card>

							{/* Newsletter Settings Card */}
							<Card>
								<CardHeader>
									<CardTitle>Newsletter Section</CardTitle>
									<CardDescription>
										Customize the newsletter signup section in the footer.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="footer.newsletterDescription"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Prenumerera på vårt nyhetsbrev..."
														rows={2}
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Text shown above the email input field.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="grid gap-4 sm:grid-cols-2">
										<FormField
											control={form.control}
											name="footer.newsletterPlaceholder"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Input Placeholder</FormLabel>
													<FormControl>
														<Input placeholder="Din e-postadress" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="footer.newsletterButtonText"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Button Text</FormLabel>
													<FormControl>
														<Input placeholder="Prenumerera" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Bottom Links Card */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										<span>Bottom Links</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												appendBottomLink({ label: "", href: "", isExternal: false })
											}
										>
											<Plus className="h-4 w-4 mr-1" />
											Add Link
										</Button>
									</CardTitle>
									<CardDescription>
										Links displayed at the very bottom of the footer (privacy policy, terms, etc.).
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{bottomLinkFields.length === 0 ? (
										<div className="text-center py-6 text-muted-foreground">
											No bottom links added yet. Click &quot;Add Link&quot; to add one.
										</div>
									) : (
										bottomLinkFields.map((field, index) => (
											<div
												key={field.id}
												className="flex items-start gap-3 p-3 border rounded-lg"
											>
												<GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
												<div className="flex-1 grid gap-3 sm:grid-cols-2">
													<FormField
														control={form.control}
														name={`footer.bottomLinks.${index}.label`}
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-xs">Label</FormLabel>
																<FormControl>
																	<Input placeholder="Link label" {...field} />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`footer.bottomLinks.${index}.href`}
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-xs">URL</FormLabel>
																<FormControl>
																	<Input placeholder="/page-url" {...field} />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
												<FormField
													control={form.control}
													name={`footer.bottomLinks.${index}.isExternal`}
													render={({ field }) => (
														<FormItem className="flex items-center gap-2 space-y-0 mt-6">
															<FormControl>
																<Checkbox
																	checked={field.value}
																	onCheckedChange={field.onChange}
																/>
															</FormControl>
															<FormLabel className="text-xs font-normal">
																External
															</FormLabel>
														</FormItem>
													)}
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeBottomLink(index)}
													className="text-destructive hover:text-destructive mt-5"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										))
									)}
								</CardContent>
							</Card>
						</TabsContent>

					{/* Coming Soon Tab */}
					<TabsContent value="coming-soon" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Clock className="h-5 w-5" />
									Coming Soon Page
								</CardTitle>
								<CardDescription>
									Manage the content displayed on the /coming-soon page.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Enable / Disable Toggle */}
								<FormField
									control={form.control}
									name="comingSoon.enabled"
									render={({ field }) => (
										<FormItem className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
											<div className="space-y-0.5">
												<FormLabel className="text-base font-semibold">
													Enable Coming Soon Mode
												</FormLabel>
												<FormDescription>
													When enabled, all public pages redirect to the coming soon page. Logged-in admins are not affected.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value ?? false}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>

																<FormField
									control={form.control}
									name="comingSoon.heading"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Heading</FormLabel>
											<FormControl>
												<Input placeholder="Kommer snart" {...field} />
											</FormControl>
											<FormDescription>The main heading shown on the coming soon page.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="comingSoon.description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Något nytt är på väg…"
													rows={3}
													{...field}
												/>
											</FormControl>
											<FormDescription>The body text below the heading.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Newsletter Section</CardTitle>
								<CardDescription>
									Email subscription form displayed below the coming soon message.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="comingSoon.newsletterTitle"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Newsletter Title</FormLabel>
											<FormControl>
												<Input placeholder="Nyhetsbrev" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="comingSoon.newsletterDescription"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Newsletter Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Prenumerera för att hålla dig uppdaterad…"
													rows={2}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid gap-4 sm:grid-cols-2">
									<FormField
										control={form.control}
										name="comingSoon.emailPlaceholder"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email Placeholder</FormLabel>
												<FormControl>
													<Input placeholder="E-postadress" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="comingSoon.buttonText"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Button Text</FormLabel>
												<FormControl>
													<Input placeholder="Skicka" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Footer Text</CardTitle>
								<CardDescription>
									Small credit text shown at the bottom of the coming soon page.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<FormField
									control={form.control}
									name="comingSoon.designedBy"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Designed By Text</FormLabel>
											<FormControl>
												<Input placeholder="ZAVD - Zentralverband Assyrischer Vereinigungen in Deutschland" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Email / SMTP Tab */}
					<TabsContent value="email-smtp" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Email Notifications</CardTitle>
								<CardDescription>
									Enable or disable admin email notifications for form submissions.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<FormField
									control={form.control}
									name="smtp.enabled"
									render={({ field }) => (
										<FormItem className="flex items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">Enable Email Notifications</FormLabel>
												<FormDescription>
													Send an email to the admin when a new form submission is received.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value ?? false}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>SMTP Server</CardTitle>
								<CardDescription>
									Outgoing mail server configuration.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 sm:grid-cols-2">
									<FormField
										control={form.control}
										name="smtp.host"
										render={({ field }) => (
											<FormItem>
												<FormLabel>SMTP Host</FormLabel>
												<FormControl>
													<Input placeholder="smtp.example.com" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="smtp.port"
										render={({ field }) => (
											<FormItem>
												<FormLabel>SMTP Port</FormLabel>
												<FormControl>
													<Input
														type="number"
														placeholder="587"
														{...field}
														onChange={(e) => field.onChange(e.target.valueAsNumber)}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="smtp.encryption"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Encryption</FormLabel>
											<Select onValueChange={field.onChange} value={field.value ?? "tls"}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select encryption" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="none">None</SelectItem>
													<SelectItem value="tls">TLS (STARTTLS)</SelectItem>
													<SelectItem value="ssl">SSL</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid gap-4 sm:grid-cols-2">
									<FormField
										control={form.control}
										name="smtp.username"
										render={({ field }) => (
											<FormItem>
												<FormLabel>SMTP Username</FormLabel>
												<FormControl>
													<Input placeholder="user@example.com" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="smtp.password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>SMTP Password</FormLabel>
												<FormControl>
													<Input type="password" placeholder="••••••••" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Sender &amp; Recipient</CardTitle>
								<CardDescription>
									Who notifications are sent from and where they are delivered.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 sm:grid-cols-2">
									<FormField
										control={form.control}
										name="smtp.fromName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>From Name</FormLabel>
												<FormControl>
													<Input placeholder="ZAVD" {...field} />
												</FormControl>
												<FormDescription>Display name for outgoing emails.</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="smtp.fromEmail"
										render={({ field }) => (
											<FormItem>
												<FormLabel>From Email</FormLabel>
												<FormControl>
													<Input type="email" placeholder="noreply@example.com" {...field} />
												</FormControl>
												<FormDescription>Sender email address.</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="smtp.adminNotificationEmail"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Admin Notification Email</FormLabel>
											<FormControl>
												<Input type="email" placeholder="admin@example.com" {...field} />
											</FormControl>
											<FormDescription>
												All form submission notifications will be sent to this address.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Donation Widget Tab */}
					<TabsContent value="donation" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Donation Widget</CardTitle>
								<CardDescription>
									Configure the donation card shown in the sidebar of project pages.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<FormField
									control={form.control}
									name="donationWidget.enabled"
									render={({ field }) => (
										<FormItem className="flex items-center justify-between rounded-lg border p-4">
											<div>
												<FormLabel>Enable Donation Widget</FormLabel>
												<FormDescription>
													Show the donation card in project page sidebars.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value ?? false}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<div className="grid gap-4 sm:grid-cols-2">
									<FormField
										control={form.control}
										name="donationWidget.title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Widget Title</FormLabel>
												<FormControl>
													<Input placeholder="Make a Donation" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="donationWidget.currency"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Currency Symbol</FormLabel>
												<FormControl>
													<Input placeholder="€" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="donationWidget.amountsStr"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Preset Amounts</FormLabel>
											<FormControl>
												<Input placeholder="5,10,25,50,100,200,300" {...field} />
											</FormControl>
											<FormDescription>
												Comma-separated numbers (e.g. 5,10,25,50,100).
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid gap-4 sm:grid-cols-2">
									<FormField
										control={form.control}
										name="donationWidget.buttonText"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Button Text</FormLabel>
												<FormControl>
													<Input placeholder="Donate Now" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="donationWidget.donationLink"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Donation Link (URL)</FormLabel>
												<FormControl>
													<Input placeholder="https://paypal.me/yourorg" {...field} />
												</FormControl>
												<FormDescription>
													External URL where donors are redirected.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>
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
								"Save Settings"
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
