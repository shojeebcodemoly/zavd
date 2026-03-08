"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TreeSelect } from "./TreeSelect";
import { MediaPicker } from "@/components/storage";
import {
	createBlogCategorySchema,
	updateBlogCategorySchema,
	type CreateBlogCategoryInput,
	type UpdateBlogCategoryInput,
} from "@/lib/validations/blog-category.validation";
import { generateSlug } from "@/lib/utils/product-helpers";
import type {
	IBlogCategory,
	IBlogCategoryTreeNode,
} from "@/models/blog-category.model";

/**
 * Form data type that works for both create and update
 */
type BlogCategoryFormData = {
	name?: string;
	slug?: string;
	description?: string;
	parent?: string | null;
	image?: string | null;
	order?: number;
	isActive?: boolean;
};

interface BlogCategoryFormProps {
	category?: IBlogCategory | null;
	categoryTree: IBlogCategoryTreeNode[];
	onSubmit: (data: BlogCategoryFormData) => Promise<void>;
	onCancel?: () => void;
	isLoading?: boolean;
	className?: string;
}

/**
 * BlogCategoryForm Component
 * Form for creating and editing blog categories
 */
export function BlogCategoryForm({
	category,
	categoryTree,
	onSubmit,
	onCancel,
	isLoading = false,
	className,
}: BlogCategoryFormProps) {
	const isEditing = !!category;

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isDirty },
	} = useForm<CreateBlogCategoryInput | UpdateBlogCategoryInput>({
		resolver: zodResolver(
			isEditing ? updateBlogCategorySchema : createBlogCategorySchema
		),
		defaultValues: {
			name: category?.name || "",
			slug: category?.slug || "",
			description: category?.description || "",
			parent: category?.parent?.toString() || null,
			image: category?.image || "",
			order: category?.order || 0,
			isActive: category?.isActive ?? true,
		},
	});

	const name = watch("name");
	const slug = watch("slug");
	const parent = watch("parent");
	const isActive = watch("isActive");

	// Auto-generate slug from name
	const handleNameBlur = () => {
		if (!slug && name) {
			setValue("slug", generateSlug(name), { shouldDirty: true });
		}
	};

	// Handle parent selection
	const handleParentChange = (selected: string[]) => {
		setValue("parent", selected[0] || null, { shouldDirty: true });
	};

	const onFormSubmit = async (
		data: CreateBlogCategoryInput | UpdateBlogCategoryInput
	) => {
		await onSubmit(data as BlogCategoryFormData);
	};

	return (
		<form
			onSubmit={handleSubmit(onFormSubmit)}
			className={cn("space-y-6", className)}
		>
			{/* Name */}
			<div className="space-y-2">
				<Label htmlFor="name">
					Category Name <span className="text-red-500">*</span>
				</Label>
				<Input
					id="name"
					{...register("name")}
					onBlur={handleNameBlur}
					placeholder="Enter blog category name"
					disabled={isLoading}
					className={errors.name ? "border-red-500" : ""}
				/>
				{errors.name && (
					<p className="text-sm text-red-500">{errors.name.message}</p>
				)}
			</div>

			{/* Slug */}
			<div className="space-y-2">
				<Label htmlFor="slug">
					Slug <span className="text-red-500">*</span>
				</Label>
				<Input
					id="slug"
					{...register("slug")}
					placeholder="blog-category-slug"
					disabled={isLoading}
					className={errors.slug ? "border-red-500" : ""}
				/>
				<p className="text-xs text-slate-500">
					URL-friendly identifier. Auto-generated from name if left empty.
				</p>
				{errors.slug && (
					<p className="text-sm text-red-500">{errors.slug.message}</p>
				)}
			</div>

			{/* Description */}
			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					{...register("description")}
					placeholder="Enter category description"
					disabled={isLoading}
					rows={3}
				/>
				{errors.description && (
					<p className="text-sm text-red-500">
						{errors.description.message}
					</p>
				)}
			</div>

			{/* Parent Category */}
			<div className="space-y-2">
				<Label>Parent Category</Label>
				<TreeSelect
					value={parent ? [parent] : []}
					onChange={handleParentChange}
					tree={categoryTree as any}
					placeholder="Select parent category (optional)"
					multiple={false}
					disabled={isLoading}
					excludeId={category?._id?.toString()}
				/>
				<p className="text-xs text-slate-500">
					Leave empty for a root-level category
				</p>
			</div>

			{/* Category Image */}
			<div className="space-y-2">
				<Label>Category Image</Label>
				<p className="text-xs text-slate-500">
					Select an image from the media library or upload a new one.
				</p>
				<MediaPicker
					type="image"
					value={watch("image") || null}
					onChange={(url) =>
						setValue("image", url || "", { shouldDirty: true })
					}
					placeholder="Select category image"
					disabled={isLoading}
					galleryTitle="Select Category Image"
				/>
				{errors.image && (
					<p className="text-sm text-red-500">{errors.image.message}</p>
				)}
			</div>

			{/* Order */}
			<div className="space-y-2">
				<Label htmlFor="order">Display Order</Label>
				<Input
					id="order"
					type="number"
					{...register("order", { valueAsNumber: true })}
					placeholder="0"
					disabled={isLoading}
				/>
				<p className="text-xs text-slate-500">
					Lower numbers appear first. Categories with the same order are
					sorted alphabetically.
				</p>
			</div>

			{/* Active Status */}
			<div className="flex items-center gap-3">
				<input
					type="checkbox"
					id="isActive"
					checked={isActive}
					onChange={(e) =>
						setValue("isActive", e.target.checked, { shouldDirty: true })
					}
					disabled={isLoading}
					className="h-4 w-4 rounded border-slate-300"
				/>
				<Label htmlFor="isActive" className="cursor-pointer">
					Active
				</Label>
				<p className="text-xs text-slate-500">
					Inactive categories are hidden from public view
				</p>
			</div>

			{/* Actions */}
			<div className="flex gap-3 pt-4 border-t">
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
				<Button
					type="submit"
					disabled={isLoading || (!isDirty && isEditing)}
				>
					{isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
					{isEditing ? "Update Category" : "Create Category"}
				</Button>
			</div>
		</form>
	);
}
