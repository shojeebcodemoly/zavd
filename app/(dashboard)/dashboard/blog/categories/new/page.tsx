"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogCategoryForm } from "@/components/admin/BlogCategoryForm";
import type { IBlogCategoryTreeNode } from "@/models/blog-category.model";

/**
 * New Blog Category Page
 */
export default function NewBlogCategoryPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const [categoryTree, setCategoryTree] = React.useState<
		IBlogCategoryTreeNode[]
	>([]);
	const [isLoading, setIsLoading] = React.useState(false);

	// Redirect if not authenticated
	React.useEffect(() => {
		if (!isPending && !session) {
			router.push("/login?callbackUrl=/dashboard/blog/categories/new");
		}
	}, [session, isPending, router]);

	// Fetch category tree
	React.useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/blog-categories/tree");
				const data = await response.json();
				if (data.success) {
					setCategoryTree(data.data);
				}
			} catch (error) {
				console.error("Failed to fetch blog categories:", error);
			}
		};

		if (session) {
			fetchCategories();
		}
	}, [session]);

	// Handle submit
	const handleSubmit = async (data: Record<string, unknown>) => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/blog-categories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				toast.success("Blog category created successfully");
				router.push("/dashboard/blog/categories");
			} else {
				toast.error(result.message || "Failed to create blog category");
			}
		} catch (error) {
			console.error("Failed to create blog category:", error);
			toast.error("Failed to create blog category");
		} finally {
			setIsLoading(false);
		}
	};

	if (isPending) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p>Loading...</p>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	return (
		<div className="_container py-8">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center gap-4">
					<Link href="/dashboard/blog/categories">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-medium">Create Blog Category</h1>
						<p className="text-slate-600">
							Add a new category for your blog posts
						</p>
					</div>
				</div>

				{/* Form */}
				<Card>
					<CardHeader>
						<CardTitle>Category Details</CardTitle>
					</CardHeader>
					<CardContent>
						<BlogCategoryForm
							categoryTree={categoryTree}
							onSubmit={handleSubmit}
							onCancel={() => router.push("/dashboard/blog/categories")}
							isLoading={isLoading}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
