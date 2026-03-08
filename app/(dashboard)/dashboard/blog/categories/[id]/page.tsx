"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogCategoryForm } from "@/components/admin/BlogCategoryForm";
import type {
	IBlogCategory,
	IBlogCategoryTreeNode,
} from "@/models/blog-category.model";

/**
 * Edit Blog Category Page
 */
export default function EditBlogCategoryPage() {
	const router = useRouter();
	const params = useParams();
	const categoryId = params.id as string;
	const { data: session, isPending } = authClient.useSession();

	const [category, setCategory] = React.useState<IBlogCategory | null>(null);
	const [categoryTree, setCategoryTree] = React.useState<
		IBlogCategoryTreeNode[]
	>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [isSaving, setIsSaving] = React.useState(false);

	// Redirect if not authenticated
	React.useEffect(() => {
		if (!isPending && !session) {
			router.push(
				`/login?callbackUrl=/dashboard/blog/categories/${categoryId}`
			);
		}
	}, [session, isPending, router, categoryId]);

	// Fetch category and tree
	React.useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const [categoryRes, treeRes] = await Promise.all([
					fetch(`/api/blog-categories/${categoryId}`),
					fetch("/api/blog-categories/tree"),
				]);

				const categoryData = await categoryRes.json();
				const treeData = await treeRes.json();

				if (categoryData.success) {
					setCategory(categoryData.data);
				} else {
					toast.error("Blog category not found");
					router.push("/dashboard/blog/categories");
				}

				if (treeData.success) {
					setCategoryTree(treeData.data);
				}
			} catch (error) {
				console.error("Failed to fetch data:", error);
				toast.error("Failed to load blog category");
				router.push("/dashboard/blog/categories");
			} finally {
				setIsLoading(false);
			}
		};

		if (session && categoryId) {
			fetchData();
		}
	}, [session, categoryId, router]);

	// Handle submit
	const handleSubmit = async (data: Record<string, unknown>) => {
		setIsSaving(true);
		try {
			const response = await fetch(`/api/blog-categories/${categoryId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				setCategory(result.data);
				toast.success("Blog category updated successfully");
			} else {
				toast.error(result.message || "Failed to update blog category");
			}
		} catch (error) {
			console.error("Failed to update blog category:", error);
			toast.error("Failed to update blog category");
		} finally {
			setIsSaving(false);
		}
	};

	if (isPending || isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	if (!session || !category) {
		return null;
	}

	return (
		<div className="_container py-8">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/dashboard/blog/categories">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-medium">{category.name}</h1>
							<p className="text-slate-600">/{category.slug}</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						{!category.isActive && (
							<Badge variant="secondary">Inactive</Badge>
						)}
					</div>
				</div>

				{/* Form */}
				<Card>
					<CardHeader>
						<CardTitle>Category Details</CardTitle>
					</CardHeader>
					<CardContent>
						<BlogCategoryForm
							category={category}
							categoryTree={categoryTree}
							onSubmit={handleSubmit}
							onCancel={() => router.push("/dashboard/blog/categories")}
							isLoading={isSaving}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
