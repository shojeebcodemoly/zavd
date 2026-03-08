"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, AlertTriangle, Save, Send } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TagInput } from "./TagInput";
import { BlogTreeSelect } from "./BlogTreeSelect";
import { MediaPicker } from "@/components/storage";
import { SeoPreview, SeoAnalysis, CharacterCount } from "./seo";
import {
	createBlogPostSchema,
	updateBlogPostSchema,
	type CreateBlogPostInput,
	type UpdateBlogPostInput,
} from "@/lib/validations/blog-post.validation";
import { generateSlug } from "@/lib/utils/product-helpers";
import type { IBlogPost } from "@/models/blog-post.model";
import type { IBlogCategoryTreeNode } from "@/models/blog-category.model";
import TextEditor from "../common/TextEditor";

/**
 * Form data type that works for both create and update
 */
export type BlogPostFormData = CreateBlogPostInput | UpdateBlogPostInput;

/**
 * Server error structure from API responses (Zod issue format)
 */
export interface ServerFieldError {
	path?: (string | number)[];
	message: string;
	code?: string;
}

/**
 * Publish validation error type
 */
export interface PublishValidationError {
	field: string;
	message: string;
	type: "error" | "warning";
}

/**
 * Result type for save/publish operations
 */
export interface BlogPostFormResult {
	success: boolean;
	data?: IBlogPost;
	warnings?: PublishValidationError[];
	errors?: ServerFieldError[];
	message?: string;
}

/**
 * Helper to extract category ID from various formats
 */
type CategoryInput =
	| string
	| { _id?: unknown; id?: string; value?: string }
	| unknown;

function normalizeCategoryId(category: CategoryInput): string {
	if (typeof category === "string") return category;
	if (category && typeof category === "object") {
		const cat = category as { _id?: unknown; id?: string; value?: string };
		if (cat._id) return String(cat._id);
		if (cat.id) return cat.id;
		if (cat.value) return cat.value;
	}
	return String(category);
}

function normalizeCategories(
	categories: CategoryInput[] | undefined
): string[] {
	if (!categories || !Array.isArray(categories)) return [];
	return categories.map(normalizeCategoryId);
}

interface BlogPostFormProps {
	post?: IBlogPost | null;
	categoryTree: IBlogCategoryTreeNode[];
	tagSuggestions?: string[];
	onSaveDraft: (data: BlogPostFormData) => Promise<BlogPostFormResult>;
	onPublish?: (data: BlogPostFormData) => Promise<BlogPostFormResult>;
	onCancel?: () => void;
	isLoading?: boolean;
	className?: string;
}

/**
 * BlogPostForm Component
 * Comprehensive form for creating and editing blog posts
 */
export function BlogPostForm({
	post,
	categoryTree,
	tagSuggestions = [],
	onSaveDraft,
	onPublish,
	onCancel,
	isLoading = false,
	className,
}: BlogPostFormProps) {
	const isEditing = !!post;
	const [validationResults, setValidationResults] = React.useState<{
		errors: PublishValidationError[];
		warnings: PublishValidationError[];
	} | null>(null);
	const [serverErrors, setServerErrors] = React.useState<
		Record<string, string>
	>({});
	const [generalError, setGeneralError] = React.useState<string | null>(null);
	const [isSaving, setIsSaving] = React.useState(false);
	const [isPublishing, setIsPublishing] = React.useState(false);

	// Helper to convert server errors to field-level errors
	const processServerErrors = (
		errors?: ServerFieldError[]
	): PublishValidationError[] => {
		if (!errors || errors.length === 0) return [];

		const fieldErrors: Record<string, string> = {};
		const publishErrors: PublishValidationError[] = [];

		errors.forEach((err) => {
			const fieldPath = err.path?.map(String).join(".") || "general";
			fieldErrors[fieldPath] = err.message;
			publishErrors.push({
				field: fieldPath,
				message: err.message,
				type: "error",
			});
		});
		setServerErrors(fieldErrors);
		return publishErrors;
	};

	// Clear server error when field is modified
	const clearServerError = (fieldName: string) => {
		if (serverErrors[fieldName]) {
			setServerErrors((prev) => {
				const updated = { ...prev };
				delete updated[fieldName];
				return updated;
			});
		}
	};

	// Get combined error for a field (form validation + server)
	const getFieldError = (fieldName: string): string | undefined => {
		// Check form validation errors first
		const formError = fieldName
			.split(".")
			.reduce((obj: Record<string, unknown> | undefined, key) => {
				return obj?.[key] as Record<string, unknown> | undefined;
			}, errors as Record<string, unknown>);

		if (
			formError &&
			typeof formError === "object" &&
			"message" in formError
		) {
			return formError.message as string;
		}

		// Then check server errors
		return serverErrors[fieldName];
	};

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(
			isEditing ? updateBlogPostSchema : createBlogPostSchema
		) as never,
		defaultValues: {
			title: post?.title || "",
			slug: post?.slug || "",
			excerpt: post?.excerpt || "",
			content: post?.content || "",
			featuredImage: post?.featuredImage
				? { url: post.featuredImage.url, alt: post.featuredImage.alt }
				: null,
			headerImage: post?.headerImage
				? {
						url: post.headerImage.url,
						alt: post.headerImage.alt,
						showTitleOverlay: post.headerImage.showTitleOverlay,
				  }
				: null,
			categories: normalizeCategories(
				post?.categories as CategoryInput[]
			),
			tags: post?.tags || [],
			seo: {
				title: post?.seo?.title || "",
				description: post?.seo?.description || "",
				keywords: post?.seo?.keywords || [],
				ogImage: post?.seo?.ogImage || "",
				canonicalUrl: post?.seo?.canonicalUrl || "",
				noindex: post?.seo?.noindex || false,
			},
			publishType: post?.publishType || "draft",
		},
	});

	const title = watch("title");
	const slug = watch("slug");

	// Auto-generate slug from title
	const handleTitleBlur = () => {
		if (!slug && title) {
			setValue("slug", generateSlug(title), { shouldDirty: true });
		}
	};

	// Handle save draft
	const handleSaveDraft = async (data: BlogPostFormData) => {
		setIsSaving(true);
		setServerErrors({});
		setGeneralError(null);
		setValidationResults(null);
		try {
			const result = await onSaveDraft(data);
			if (!result.success) {
				const publishErrors = processServerErrors(result.errors);
				if (publishErrors.length > 0) {
					setValidationResults({ errors: publishErrors, warnings: [] });
				}
				if (result.message) {
					setGeneralError(result.message);
				}
			}
		} finally {
			setIsSaving(false);
		}
	};

	// Handle publish
	const handlePublish = async (data: BlogPostFormData) => {
		if (!onPublish) return;
		setIsPublishing(true);
		setServerErrors({});
		setGeneralError(null);
		setValidationResults(null);
		try {
			const result = await onPublish(data);
			if (result.success) {
				setValidationResults({
					errors: [],
					warnings: result.warnings || [],
				});
			} else {
				const publishErrors = processServerErrors(result.errors);
				if (publishErrors.length > 0) {
					setValidationResults({ errors: publishErrors, warnings: [] });
				}
				if (result.message) {
					setGeneralError(result.message);
				}
			}
		} finally {
			setIsPublishing(false);
		}
	};

	return (
		<div className={cn("space-y-6", className)}>
			{/* General Error Banner */}
			{generalError && (
				<Card className="border-red-300 bg-red-50">
					<CardContent className="pt-4">
						<div className="flex items-center gap-2 text-red-600">
							<AlertCircle className="h-5 w-5" />
							<span className="font-medium">{generalError}</span>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Validation Results Banner */}
			{validationResults &&
				(validationResults.errors.length > 0 ||
					validationResults.warnings.length > 0) && (
					<Card
						className={
							validationResults.errors.length > 0
								? "border-red-300"
								: "border-yellow-300"
						}
					>
						<CardContent className="pt-4">
							{validationResults.errors.length > 0 && (
								<div className="mb-4">
									<div className="flex items-center gap-2 text-red-600 mb-2">
										<AlertCircle className="h-5 w-5" />
										<span className="font-medium">
											Errors ({validationResults.errors.length})
										</span>
									</div>
									<ul className="list-disc list-inside space-y-1 text-sm text-red-600">
										{validationResults.errors.map((error, i) => (
											<li key={i}>
												<strong>{error.field}:</strong>{" "}
												{error.message}
											</li>
										))}
									</ul>
								</div>
							)}
							{validationResults.warnings.length > 0 && (
								<div>
									<div className="flex items-center gap-2 text-yellow-600 mb-2">
										<AlertTriangle className="h-5 w-5" />
										<span className="font-medium">
											Warnings ({validationResults.warnings.length})
										</span>
									</div>
									<ul className="list-disc list-inside space-y-1 text-sm text-yellow-600">
										{validationResults.warnings.map((warning, i) => (
											<li key={i}>
												<strong>{warning.field}:</strong>{" "}
												{warning.message}
											</li>
										))}
									</ul>
								</div>
							)}
						</CardContent>
					</Card>
				)}

			<form onSubmit={handleSubmit(handleSaveDraft)}>
				<Tabs defaultValue="content" className="space-y-6">
					<TabsList className="grid grid-cols-4 w-full">
						<TabsTrigger value="content">Content</TabsTrigger>
						<TabsTrigger value="media">Media</TabsTrigger>
						<TabsTrigger value="meta">Categories & Tags</TabsTrigger>
						<TabsTrigger value="seo">SEO</TabsTrigger>
					</TabsList>

					{/* Content Tab */}
					<TabsContent value="content">
						<Card>
							<CardHeader>
								<CardTitle>Blog Post Content</CardTitle>
								<CardDescription>
									Write your blog post content here
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Title */}
								<div className="space-y-2">
									<Label htmlFor="title">
										Title <span className="text-red-500">*</span>
									</Label>
									<Input
										id="title"
										{...register("title")}
										onBlur={handleTitleBlur}
										placeholder="Enter blog post title"
										disabled={isLoading}
										className={errors.title ? "border-red-500" : ""}
									/>
									{errors.title && (
										<p className="text-sm text-red-500">
											{errors.title.message}
										</p>
									)}
								</div>

								{/* Slug */}
								<div className="space-y-2">
									<Label htmlFor="slug">Slug</Label>
									<Input
										id="slug"
										{...register("slug")}
										placeholder="blog-post-slug"
										disabled={isLoading}
										className={errors.slug ? "border-red-500" : ""}
									/>
									<p className="text-xs text-slate-500">
										URL-friendly identifier. Auto-generated from title.
									</p>
									{errors.slug && (
										<p className="text-sm text-red-500">
											{errors.slug.message}
										</p>
									)}
								</div>

								{/* Excerpt */}
								<div className="space-y-2">
									<Label htmlFor="excerpt">Excerpt</Label>
									<Textarea
										id="excerpt"
										{...register("excerpt")}
										placeholder="Brief summary of the blog post (max 500 characters)"
										disabled={isLoading}
										rows={3}
										maxLength={500}
									/>
									<CharacterCount
										value={watch("excerpt") || ""}
										min={50}
										max={500}
										optimal={{ min: 100, max: 200 }}
										label="Excerpt length"
									/>
								</div>

								{/* Content */}
								<div className="space-y-2">
									<Label>Content</Label>
									<TextEditor
										height="500px"
										defaultValue={watch("content") || ""}
										onChange={(val) =>
											setValue("content", val, {
												shouldDirty: true,
											})
										}
										placeholder="Write your blog post content here..."
										variant="advanceFull"
									/>
								</div>

								{/* Publish Status */}
								<div className="space-y-2">
									<Label htmlFor="publishType">Publish Status</Label>
									<Select
										value={watch("publishType") || "draft"}
										onValueChange={(value) => setValue("publishType", value as "draft" | "publish" | "private", { shouldDirty: true })}
										disabled={isLoading}
									>
										<SelectTrigger className="w-full h-11">
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="draft">Draft</SelectItem>
											<SelectItem value="publish">Published</SelectItem>
											<SelectItem value="private">Private</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Media Tab */}
					<TabsContent value="media">
						<Card>
							<CardHeader>
								<CardTitle>Media</CardTitle>
								<CardDescription>
									Featured image and header image for your blog post
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Featured Image */}
								<div className="space-y-3">
									<Label>Featured Image</Label>
									<p className="text-sm text-muted-foreground">
										Main image shown in blog listings and social
										media previews.
									</p>
									<MediaPicker
										type="image"
										value={watch("featuredImage")?.url || null}
										onChange={(url) =>
											setValue(
												"featuredImage",
												url
													? {
															url,
															alt:
																watch("featuredImage")
																	?.alt || "",
													  }
													: null,
												{ shouldDirty: true }
											)
										}
										placeholder="Select featured image"
										disabled={isLoading}
										galleryTitle="Select Featured Image"
									/>
									{watch("featuredImage")?.url && (
										<Input
											placeholder="Alt text for featured image"
											value={watch("featuredImage")?.alt || ""}
											onChange={(e) =>
												setValue(
													"featuredImage",
													{
														url:
															watch("featuredImage")
																?.url || "",
														alt: e.target.value,
													},
													{ shouldDirty: true }
												)
											}
											disabled={isLoading}
										/>
									)}
								</div>

								{/* Header Image */}
								<div className="space-y-3">
									<Label>Header Image</Label>
									<p className="text-sm text-muted-foreground">
										Full-width banner image displayed at the top of
										the blog post.
									</p>
									<MediaPicker
										type="image"
										value={watch("headerImage")?.url || null}
										onChange={(url) =>
											setValue(
												"headerImage",
												url
													? {
															url,
															alt:
																watch("headerImage")
																	?.alt || "",
															showTitleOverlay:
																watch("headerImage")
																	?.showTitleOverlay ||
																false,
													  }
													: null,
												{ shouldDirty: true }
											)
										}
										placeholder="Select header image"
										disabled={isLoading}
										galleryTitle="Select Header Image"
									/>
									{watch("headerImage")?.url && (
										<>
											<Input
												placeholder="Alt text for header image"
												value={watch("headerImage")?.alt || ""}
												onChange={(e) =>
													setValue(
														"headerImage",
														{
															url:
																watch("headerImage")
																	?.url || "",
															alt: e.target.value,
															showTitleOverlay:
																watch("headerImage")
																	?.showTitleOverlay ||
																false,
														},
														{ shouldDirty: true }
													)
												}
												disabled={isLoading}
											/>
											<div className="flex items-center gap-3">
												<input
													type="checkbox"
													id="showTitleOverlay"
													checked={
														watch("headerImage")
															?.showTitleOverlay || false
													}
													onChange={(e) =>
														setValue(
															"headerImage",
															{
																url:
																	watch("headerImage")
																		?.url || "",
																alt:
																	watch("headerImage")
																		?.alt || "",
																showTitleOverlay:
																	e.target.checked,
															},
															{ shouldDirty: true }
														)
													}
													disabled={isLoading}
													className="h-4 w-4"
												/>
												<Label
													htmlFor="showTitleOverlay"
													className="cursor-pointer"
												>
													Show title overlay on image
												</Label>
											</div>
										</>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Categories & Tags Tab */}
					<TabsContent value="meta">
						<Card>
							<CardHeader>
								<CardTitle>Categories & Tags</CardTitle>
								<CardDescription>
									Organize your blog post with categories and tags
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Categories */}
								<div className="space-y-2">
									<Label>Categories</Label>
									<BlogTreeSelect
										value={watch("categories") || []}
										onChange={(cats) => {
											setValue("categories", cats, {
												shouldDirty: true,
											});
										}}
										tree={categoryTree}
										placeholder="Select categories"
										disabled={isLoading}
									/>
								</div>

								{/* Tags */}
								<div className="space-y-2">
									<Label>Tags</Label>
									<TagInput
										value={watch("tags") || []}
										onChange={(tags) =>
											setValue("tags", tags, {
												shouldDirty: true,
											})
										}
										suggestions={tagSuggestions}
										placeholder="Add tags..."
										disabled={isLoading}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* SEO Tab */}
					<TabsContent value="seo">
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
							{/* Left Column - SEO Settings */}
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>SEO Settings</CardTitle>
										<CardDescription>
											Search engine optimization
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										{/* SEO Title */}
										<div className="space-y-2">
											<Label htmlFor="seo.title">SEO Title</Label>
											<Input
												id="seo.title"
												{...register("seo.title")}
												placeholder="SEO title (recommended 50-60 characters)"
												disabled={isLoading}
												maxLength={70}
												onChange={(e) => {
													register("seo.title").onChange(e);
													clearServerError("seo.title");
												}}
											/>
											<CharacterCount
												value={watch("seo.title") || ""}
												min={30}
												max={70}
												optimal={{ min: 50, max: 60 }}
												label="Title length"
											/>
											{getFieldError("seo.title") && (
												<p className="text-sm text-red-500">
													{getFieldError("seo.title")}
												</p>
											)}
										</div>

										{/* SEO Description */}
										<div className="space-y-2">
											<Label htmlFor="seo.description">
												Meta Description
											</Label>
											<Textarea
												id="seo.description"
												{...register("seo.description")}
												placeholder="SEO description (recommended 120-160 characters)"
												disabled={isLoading}
												rows={3}
												maxLength={200}
												onChange={(e) => {
													register("seo.description").onChange(e);
													clearServerError("seo.description");
												}}
											/>
											<CharacterCount
												value={watch("seo.description") || ""}
												min={80}
												max={200}
												optimal={{ min: 120, max: 160 }}
												label="Description length"
											/>
											{getFieldError("seo.description") && (
												<p className="text-sm text-red-500">
													{getFieldError("seo.description")}
												</p>
											)}
										</div>

										{/* SEO Keywords */}
										<div className="space-y-2">
											<Label>SEO Keywords</Label>
											<TagInput
												value={watch("seo.keywords") || []}
												onChange={(keywords) =>
													setValue("seo.keywords", keywords, {
														shouldDirty: true,
													})
												}
												placeholder="Add SEO keywords..."
												disabled={isLoading}
												maxTags={10}
											/>
										</div>

										{/* OG Image */}
										<div className="space-y-2">
											<Label>Open Graph Image</Label>
											<p className="text-sm text-muted-foreground">
												Image shown when sharing on social media
												(recommended 1200x630px)
											</p>
											<MediaPicker
												type="image"
												value={watch("seo.ogImage") || null}
												onChange={(url) =>
													setValue("seo.ogImage", url || "", {
														shouldDirty: true,
													})
												}
												placeholder="Select OG image"
												disabled={isLoading}
												galleryTitle="Select Open Graph Image"
											/>
										</div>

										{/* Canonical URL */}
										<div className="space-y-2">
											<Label htmlFor="seo.canonicalUrl">
												Canonical URL
											</Label>
											<Input
												id="seo.canonicalUrl"
												type="url"
												{...register("seo.canonicalUrl")}
												placeholder="https://example.com/blog/post"
												disabled={isLoading}
											/>
											<p className="text-xs text-slate-500">
												Leave empty to use the default blog post URL
											</p>
										</div>

										{/* Noindex */}
										<div className="flex items-center gap-3">
											<input
												type="checkbox"
												id="seo.noindex"
												{...register("seo.noindex")}
												disabled={isLoading}
												className="h-4 w-4"
											/>
											<Label
												htmlFor="seo.noindex"
												className="cursor-pointer"
											>
												No Index
											</Label>
											<p className="text-xs text-slate-500">
												Prevent search engines from indexing this post
											</p>
										</div>
									</CardContent>
								</Card>

								{/* SEO Analysis */}
								<SeoAnalysis
									data={{
										title: watch("seo.title") || "",
										description: watch("seo.description") || "",
										slug: watch("slug") || "",
										productTitle: watch("title") || "",
										hasOgImage: !!watch("seo.ogImage"),
									}}
								/>
							</div>

							{/* Right Column - Previews */}
							<div className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Preview</CardTitle>
										<CardDescription>
											See how your blog post will appear in search
											results and social media
										</CardDescription>
									</CardHeader>
									<CardContent>
										<SeoPreview
											data={{
												title: watch("seo.title") || "",
												description: watch("seo.description") || "",
												slug: watch("slug") || "",
												ogImage:
													watch("seo.ogImage") ||
													watch("featuredImage")?.url ||
													null,
												siteUrl: "synos.se",
												siteName: "Synos",
												productTitle: watch("title") || "",
											}}
										/>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>
				</Tabs>

				{/* Form Actions */}
				<div className="flex justify-between items-center pt-6 border-t mt-6">
					<div>
						{onCancel && (
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
								disabled={isLoading}
							>
								Cancel
							</Button>
						)}
					</div>

					<div className="flex gap-3">
						<Button
							type="submit"
							variant="outline"
							disabled={isLoading || isSaving}
						>
							{isSaving && (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							)}
							<Save className="h-4 w-4 mr-2" />
							Save Draft
						</Button>

						{onPublish && (
							<Button
								type="button"
								onClick={handleSubmit(handlePublish)}
								disabled={isLoading || isPublishing}
							>
								{isPublishing && (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								)}
								<Send className="h-4 w-4 mr-2" />
								Publish
							</Button>
						)}
					</div>
				</div>
			</form>
		</div>
	);
}
