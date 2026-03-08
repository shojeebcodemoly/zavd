"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	BlogPostForm,
	type BlogPostFormData,
	type BlogPostFormResult,
} from "@/components/admin/BlogPostForm";
import type { IBlogPost } from "@/models/blog-post.model";
import type { IBlogCategoryTreeNode } from "@/models/blog-category.model";

interface EditBlogPostClientProps {
	postId: string;
	initialPost: IBlogPost;
	categoryTree: IBlogCategoryTreeNode[];
	tagSuggestions: string[];
}

/**
 * Edit Blog Post Client Component
 * Handles form submission, publish toggle, and navigation
 */
export function EditBlogPostClient({
	postId,
	initialPost,
	categoryTree,
	tagSuggestions,
}: EditBlogPostClientProps) {
	const router = useRouter();
	const [post, setPost] = React.useState<IBlogPost>(initialPost);

	// Handle save draft
	const handleSaveDraft = async (
		data: BlogPostFormData
	): Promise<BlogPostFormResult> => {
		try {
			const response = await fetch(`/api/blog-posts/${postId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				setPost(result.data);
				toast.success("Blog post saved successfully");
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
			// First save the data
			const saveResponse = await fetch(`/api/blog-posts/${postId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const saveResult = await saveResponse.json();

			if (!saveResult.success) {
				toast.error(saveResult.message || "Failed to save blog post");
				return {
					success: false,
					message: saveResult.message,
					errors: saveResult.errors,
				};
			}

			// Then publish
			const publishResponse = await fetch(
				`/api/blog-posts/${postId}/publish`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ publishType: "publish" }),
				}
			);

			const publishResult = await publishResponse.json();

			if (publishResult.success) {
				setPost(publishResult.data);
				toast.success("Blog post published successfully");
				return { success: true, data: publishResult.data };
			} else {
				toast.error(publishResult.message || "Failed to publish blog post");
				return {
					success: false,
					message: publishResult.message,
					errors: publishResult.errors,
				};
			}
		} catch (error) {
			console.error("Failed to publish blog post:", error);
			toast.error("Failed to publish blog post");
			return { success: false, message: "Failed to publish blog post" };
		}
	};

	// Get status badge
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "publish":
				return <Badge className="bg-green-100 text-green-800">Published</Badge>;
			case "draft":
				return <Badge variant="secondary">Draft</Badge>;
			case "private":
				return <Badge variant="outline">Private</Badge>;
			default:
				return null;
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link href="/dashboard/blog">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<div className="flex items-center gap-2">
							<h1 className="text-3xl font-medium">{post.title}</h1>
							{getStatusBadge(post.publishType)}
						</div>
						<p className="text-slate-600">/{post.slug}</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{post.publishType === "publish" && (
						<Link
							href={`/nyheter/${post.slug}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button variant="outline" size="sm">
								<Eye className="h-4 w-4 mr-2" />
								View Post
								<ExternalLink className="h-3 w-3 ml-1" />
							</Button>
						</Link>
					)}
				</div>
			</div>

			{/* Form */}
			<BlogPostForm
				post={post}
				categoryTree={categoryTree}
				tagSuggestions={tagSuggestions}
				onSaveDraft={handleSaveDraft}
				onPublish={handlePublish}
				onCancel={() => router.push("/dashboard/blog")}
			/>
		</div>
	);
}
