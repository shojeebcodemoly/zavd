"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryForm } from "@/components/admin/CategoryForm";
import type { ICategoryTreeNode } from "@/models/category.model";

/**
 * New Category Page
 */
export default function NewCategoryPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const [categoryTree, setCategoryTree] = React.useState<ICategoryTreeNode[]>(
		[]
	);
	const [isLoading, setIsLoading] = React.useState(false);

	// Redirect if not authenticated
	React.useEffect(() => {
		if (!isPending && !session) {
			router.push("/login?callbackUrl=/dashboard/categories/new");
		}
	}, [session, isPending, router]);

	// Fetch category tree
	React.useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch("/api/categories/tree");
				const data = await response.json();
				if (data.success) {
					setCategoryTree(data.data);
				}
			} catch (error) {
				console.error("Failed to fetch categories:", error);
			}
		};

		if (session) {
			fetchCategories();
		}
	}, [session]);

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
		setIsLoading(true);
		try {
			const response = await fetch("/api/categories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				toast.success("Category created successfully");
				router.push("/dashboard/categories");
			} else {
				// Show specific error message with validation details
				const errorDetails = result.errors
					? formatValidationErrors(result.errors)
					: "";
				const errorMessage = result.message || "Failed to create category";

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
			console.error("Failed to create category:", error);
			toast.error("Failed to create category", {
				description:
					error instanceof Error ? error.message : "Network error occurred",
			});
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
					<Link href="/dashboard/categories">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-medium">Create Category</h1>
						<p className="text-slate-600">
							Add a new category to your catalog
						</p>
					</div>
				</div>

				{/* Form */}
				<Card>
					<CardHeader>
						<CardTitle>Category Details</CardTitle>
					</CardHeader>
					<CardContent>
						<CategoryForm
							categoryTree={categoryTree}
							onSubmit={handleSubmit}
							onCancel={() => router.push("/dashboard/categories")}
							isLoading={isLoading}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
