"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, ExternalLink } from "lucide-react";

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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MediaPicker } from "@/components/storage/media-picker";
import { CMSPageSkeleton } from "@/components/admin/CMSPageSkeleton";

const formSchema = z.object({
	hero: z.object({
		backgroundImage: z.string().optional(),
		titleDe: z.string().optional(),
		titleEn: z.string().optional(),
		breadcrumb: z.string().optional(),
	}),
});

type FormValues = z.infer<typeof formSchema>;

export default function EhrenamtEngagementDashboardPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			hero: {
				backgroundImage: "",
				titleDe: "Ehrenamt & Engagement",
				titleEn: "Volunteering",
				breadcrumb: "Ehrenamt & Engagement",
			},
		},
	});

	useEffect(() => {
		const fetchContent = async () => {
			try {
				setLoading(true);
				const response = await fetch("/api/ehrenamt-engagement-page");
				const data = await response.json();
				if (!response.ok) throw new Error(data.message || "Failed to fetch content");
				const content = data.data;
				form.reset({
					hero: {
						backgroundImage: content.hero?.backgroundImage || "",
						titleDe: content.hero?.titleDe || "Ehrenamt & Engagement",
						titleEn: content.hero?.titleEn || "Volunteering",
						breadcrumb: content.hero?.breadcrumb || "Ehrenamt & Engagement",
					},
				});
			} catch (error) {
				console.error("Error fetching content:", error);
				toast.error("Failed to load content");
			} finally {
				setLoading(false);
			}
		};
		fetchContent();
	}, [form]);

	const onSubmit = async (values: FormValues) => {
		try {
			setSaving(true);
			const response = await fetch("/api/ehrenamt-engagement-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.message || "Failed to save content");
			toast.success("Ehrenamt & Engagement page saved successfully");
		} catch (error) {
			console.error("Error saving content:", error);
			toast.error(error instanceof Error ? error.message : "Failed to save content");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <CMSPageSkeleton />;

	return (
		<div className="space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-3xl font-medium tracking-tight">Ehrenamt & Engagement</h1>
					<p className="text-muted-foreground">Manage the Volunteering page content.</p>
				</div>
				<a
					href="/projekte/ehrenamt-engagement"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<ExternalLink className="h-4 w-4" />
					<span>View page</span>
				</a>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Hero Section</CardTitle>
							<CardDescription>
								The banner at the top of the Ehrenamt & Engagement page.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<FormField
								control={form.control}
								name="hero.backgroundImage"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Background Image</FormLabel>
										<FormControl>
											<MediaPicker
												type="image"
												value={field.value || null}
												onChange={(url) => field.onChange(url || "")}
												placeholder="Select background image"
												galleryTitle="Select Hero Background"
											/>
										</FormControl>
										<FormDescription>
											Full-width background image for the hero banner.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid gap-4 sm:grid-cols-2">
								<FormField
									control={form.control}
									name="hero.titleDe"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Title (German)</FormLabel>
											<FormControl>
												<Input
													{...field}
													value={field.value || ""}
													placeholder="Ehrenamt & Engagement"
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
											<FormLabel>Title (English)</FormLabel>
											<FormControl>
												<Input
													{...field}
													value={field.value || ""}
													placeholder="Volunteering"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="hero.breadcrumb"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Breadcrumb Text</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder="Ehrenamt & Engagement"
											/>
										</FormControl>
										<FormDescription>
											Text shown after &quot;Home / Projekte /&quot;
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

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
		</div>
	);
}
