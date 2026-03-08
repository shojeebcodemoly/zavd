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
import { CategoryForm } from "@/components/admin/CategoryForm";
import type { ICategory, ICategoryTreeNode } from "@/models/category.model";

/**
 * Edit Category Page
 */
export default function EditCategoryPage() {
	const router = useRouter();
	const params = useParams();
	const categoryId = params.id as string;
	const { data: session, isPending } = authClient.useSession();

	const [category, setCategory] = React.useState<ICategory | null>(null);
	const [categoryTree, setCategoryTree] = React.useState<ICategoryTreeNode[]>(
		[]
	);
	const [isLoading, setIsLoading] = React.useState(true);
	const [isSaving, setIsSaving] = React.useState(false);
	const [hasFetched, setHasFetched] = React.useState(false);

	// Redirect if not authenticated
	React.useEffect(() => {
		if (!isPending && !session) {
			router.push(`/login?callbackUrl=/dashboard/categories/${categoryId}`);
		}
	}, [session, isPending, router, categoryId]);

	// Fetch category and tree - only once when authenticated
	React.useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const [categoryRes, treeRes] = await Promise.all([
					fetch(`/api/categories/${categoryId}`),
					fetch("/api/categories/tree"),
				]);

				const categoryData = await categoryRes.json();
				const treeData = await treeRes.json();

				if (categoryData.success) {
					setCategory(categoryData.data);
				} else {
					toast.error("Category not found");
					router.push("/dashboard/categories");
				}

				if (treeData.success) {
					setCategoryTree(treeData.data);
				}
			} catch (error) {
				console.error("Failed to fetch data:", error);
				toast.error("Failed to load category");
				router.push("/dashboard/categories");
			} finally {
				setIsLoading(false);
				setHasFetched(true);
			}
		};

		// Only fetch if we have a session and haven't fetched yet
		if (session && categoryId && !hasFetched) {
			fetchData();
		}
	}, [session, categoryId, router, hasFetched]);

	// Format validation errors for display
	const formatValidationErrors = (errors: unknown): string => {
		if (!errors) return "";
		if (Array.isArray(errors)) {
			// Zod validation errors format
			return errors
				.map((err: { path?: string[]; message?: string }) => {
					const field = err.path?.join(".") || "Field";
					return `${field}: ${err.message || "Invalid value"}`;
				})
				.join("\n");
		}
		if (typeof errors === "object") {
			return Object.entries(errors)
				.map(([field, msg]) => `${field}: ${msg}`)
				.join("\n");
		}
		return String(errors);
	};

	// Handle submit
	const handleSubmit = async (data: Record<string, unknown>) => {
		setIsSaving(true);
		try {
			const response = await fetch(`/api/categories/${categoryId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				setCategory(result.data);
				toast.success("Category updated successfully");
			} else {
				// Show specific error message with validation details
				const errorDetails = result.errors
					? formatValidationErrors(result.errors)
					: "";
				const errorMessage = result.message || "Failed to update category";

				if (errorDetails) {
					toast.error(errorMessage, {
						description: errorDetails,
						duration: 5000,
					});
				} else {
					toast.error(errorMessage);
				}
			}
		} catch (error) {
			console.error("Failed to update category:", error);
			toast.error("Failed to update category", {
				description:
					error instanceof Error ? error.message : "Network error occurred",
			});
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
						<Link href="/dashboard/categories">
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
						<CategoryForm
							key={category._id.toString()}
							category={category}
							categoryTree={categoryTree}
							onSubmit={handleSubmit}
							onCancel={() => router.push("/dashboard/categories")}
							isLoading={isSaving}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
