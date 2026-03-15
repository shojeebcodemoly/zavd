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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
		subtitle: z.string().optional(),
	}),
	pressSection: z.object({
		backgroundImage: z.string().optional(),
		heading: z.string().optional(),
		subtext: z.string().optional(),
		email: z.string().optional(),
	}),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewsDashboardPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			hero: { backgroundImage: "", titleDe: "Nachrichten", titleEn: "News", subtitle: "" },
			pressSection: { backgroundImage: "", heading: "Latest press releases", subtext: "Simply contact us at", email: "info@zavd.de" },
		},
	});

	useEffect(() => {
		const fetchPage = async () => {
			try {
				const res = await fetch("/api/nachrichten-page");
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || "Failed to fetch");
				const page = data.data;
				form.reset({
					hero: {
						backgroundImage: page.hero?.backgroundImage || "",
						titleDe: page.hero?.titleDe || "Nachrichten",
						titleEn: page.hero?.titleEn || "News",
						subtitle: page.hero?.subtitle || "",
					},
					pressSection: {
						backgroundImage: page.pressSection?.backgroundImage || "",
						heading: page.pressSection?.heading || "Latest press releases",
						subtext: page.pressSection?.subtext || "Simply contact us at",
						email: page.pressSection?.email || "info@zavd.de",
					},
				});
			} catch (error) {
				console.error(error);
				toast.error("Failed to load page data");
			} finally {
				setLoading(false);
			}
		};
		fetchPage();
	}, [form]);

	const onSubmit = async (values: FormValues) => {
		try {
			setSaving(true);
			const res = await fetch("/api/nachrichten-page", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to save");
			toast.success("News page saved successfully");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to save");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <CMSPageSkeleton />;

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-slate-900">News Page</h1>
					<p className="text-slate-500 mt-1">Edit the News listing page sections.</p>
				</div>
				<a
					href="/aktuelles/nachrichten"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors"
				>
					<ExternalLink className="w-4 h-4" />
					View page
				</a>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<Tabs defaultValue="hero">
						<TabsList>
							<TabsTrigger value="hero">Hero</TabsTrigger>
							<TabsTrigger value="press">Press Banner</TabsTrigger>
						</TabsList>

						{/* Hero */}
						<TabsContent value="hero" className="mt-4">
							<Card>
								<CardHeader>
									<CardTitle>Hero Section</CardTitle>
									<CardDescription>Background image and title at the top of the News page.</CardDescription>
								</CardHeader>
								<CardContent className="space-y-5">
									<FormField
										control={form.control}
										name="hero.backgroundImage"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Background Image</FormLabel>
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
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="hero.titleDe"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title (German)</FormLabel>
													<FormControl><Input placeholder="Nachrichten" {...field} /></FormControl>
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
													<FormControl><Input placeholder="News" {...field} /></FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name="hero.subtitle"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtitle</FormLabel>
												<FormControl><Input placeholder="Short tagline..." {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Press Banner */}
						<TabsContent value="press" className="mt-4">
							<Card>
								<CardHeader>
									<CardTitle>Press Banner</CardTitle>
									<CardDescription>The dark banner below the hero with "Latest press releases".</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<FormField
										control={form.control}
										name="pressSection.backgroundImage"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Background Image</FormLabel>
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
									<FormField
										control={form.control}
										name="pressSection.heading"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Heading</FormLabel>
												<FormControl><Input placeholder="Latest press releases" {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="pressSection.subtext"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subtext</FormLabel>
												<FormControl><Input placeholder="Simply contact us at" {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="pressSection.email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl><Input placeholder="info@zavd.de" {...field} /></FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>

					<div className="flex justify-end">
						<Button type="submit" disabled={saving}>
							{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Save Changes
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
