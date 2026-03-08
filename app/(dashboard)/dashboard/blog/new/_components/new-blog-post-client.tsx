"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	BlogPostForm,
	type BlogPostFormData,
	type BlogPostFormResult,
} from "@/components/admin/BlogPostForm";
import type { IBlogCategoryTreeNode } from "@/models/blog-category.model";

interface NewBlogPostClientProps {
	categoryTree: IBlogCategoryTreeNode[];
	tagSuggestions: string[];
}

/**
 * New Blog Post Client Component
 * Handles form submission and navigation
 */
export function NewBlogPostClient({
	categoryTree,
	tagSuggestions,
}: NewBlogPostClientProps) {
	const router = useRouter();

	// Handle save draft
	const handleSaveDraft = async (
		data: BlogPostFormData
	): Promise<BlogPostFormResult> => {
		try {
			const response = await fetch("/api/blog-posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				toast.success("Blog post saved as draft");
				router.push(`/dashboard/blog/${result.data._id}`);
				return { success: true, data: result.data };
			} else {
				toast.error(result.message || "Failed to save blog post");
				return {
					success: false,
					message: result.message,
					errors: result.errors,
				};
			}
		} catch (error) {
			console.error("Failed to save blog post:", error);
			toast.error("Failed to save blog post");
			return { success: false, message: "Failed to save blog post" };
		}
	};

	// Handle publish
	const handlePublish = async (
		data: BlogPostFormData
	): Promise<BlogPostFormResult> => {
		try {
			// Create with publish type
			const response = await fetch("/api/blog-posts", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...data, publishType: "publish" }),
			});

			const result = await response.json();

			if (result.success) {
				toast.success("Blog post published successfully");
				router.push(`/dashboard/blog/${result.data._id}`);
				return { success: true, data: result.data };
			} else {
				toast.error(result.message || "Failed to publish blog post");
				return {
					success: false,
					message: result.message,
					errors: result.errors,
				};
			}
		} catch (error) {
			console.error("Failed to publish blog post:", error);
			toast.error("Failed to publish blog post");
			return { success: false, message: "Failed to publish blog post" };
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Link href="/dashboard/blog">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-medium">New Blog Post</h1>
					<p className="text-slate-600">Create a new blog post</p>
				</div>
			</div>

			{/* Form */}
			<BlogPostForm
				categoryTree={categoryTree}
				tagSuggestions={tagSuggestions}
				onSaveDraft={handleSaveDraft}
				onPublish={handlePublish}
				onCancel={() => router.push("/dashboard/blog")}
			/>
		</div>
	);
}
