"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
	ProductForm,
	type ProductFormData,
	type ProductFormResult,
	normalizeCategories,
} from "@/components/admin/ProductForm";
import type { ICategoryTreeNode } from "@/models/category.model";

/**
 * New Product Page
 */
export default function NewProductPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const [categoryTree, setCategoryTree] = React.useState<ICategoryTreeNode[]>(
		[]
	);
	const [treatmentSuggestions, setTreatmentSuggestions] = React.useState<
		string[]
	>([]);
	const [certificationSuggestions, setCertificationSuggestions] =
		React.useState<string[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);

	// Redirect if not authenticated
	React.useEffect(() => {
		if (!isPending && !session) {
			router.push("/login?callbackUrl=/dashboard/products/new");
		}
	}, [session, isPending, router]);

	// Format validation errors for user-friendly display
	const formatValidationErrors = (
		errors: unknown
	): { summary: string; details: string[] } => {
		if (!errors) return { summary: "", details: [] };

		if (Array.isArray(errors)) {
			// Formatted validation errors: { field, message, path }
			const details = errors.map(
				(err: {
					field?: string;
					message?: string;
					path?: (string | number)[];
				}) => {
					// Use field (formatted label) if available, otherwise join path array
					const field =
						err.field ||
						(Array.isArray(err.path) ? err.path.join(".") : "Field");
					return `• ${field}: ${err.message || "Invalid value"}`;
				}
			);
			return {
				summary:
					errors.length === 1
						? `Valideringsfel: ${errors[0]?.field || "Okänt fält"}`
						: `${errors.length} valideringsfel hittades`,
				details,
			};
		}

		if (typeof errors === "object") {
			const details = Object.entries(errors).map(
				([field, msg]) => `• ${field}: ${msg}`
			);
			return {
				summary: `${details.length} valideringsfel hittades`,
				details,
			};
		}

		return { summary: String(errors), details: [] };
	};

	// Fetch category tree and tags
	React.useEffect(() => {
		const fetchData = async () => {
			try {
				const [treeRes, tagsRes] = await Promise.all([
					fetch("/api/categories/tree"),
					fetch("/api/products/tags"),
				]);

				const treeData = await treeRes.json();
				const tagsData = await tagsRes.json();

				if (treeData.success) {
					setCategoryTree(treeData.data);
				}
				if (tagsData.success) {
					setTreatmentSuggestions(tagsData.data.treatments || []);
					setCertificationSuggestions(tagsData.data.certifications || []);
				}
			} catch (error) {
				console.error("Failed to fetch data:", error);
			}
		};

		if (session) {
			fetchData();
		}
	}, [session]);

	// Handle save draft
	const handleSaveDraft = async (
		data: ProductFormData
	): Promise<ProductFormResult> => {
		setIsLoading(true);
		try {
			const payload = {
				...data,
				categories: normalizeCategories(data.categories),
			};

			const response = await fetch("/api/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const result = await response.json();

			if (result.success) {
				toast.success("Product created successfully");
				router.push(`/dashboard/products/${result.data._id}`);
				return { success: true, data: result.data };
			} else {
				const { summary, details } = result.errors
					? formatValidationErrors(result.errors)
					: { summary: "", details: [] };
				const errorMessage =
					summary || result.message || "Failed to create product";

				if (details.length > 0) {
					toast.error(errorMessage, {
						description: details.join("\n"),
						duration: 8000,
					});
				} else {
					toast.error(errorMessage);
				}
				return {
					success: false,
					errors: result.errors,
					message: result.message,
				};
			}
		} catch (error) {
			console.error("Failed to create product:", error);
			toast.error("Failed to create product", {
				description:
					error instanceof Error ? error.message : "Network error occurred",
			});
			return { success: false, message: "Failed to create product" };
		} finally {
			setIsLoading(false);
		}
	};

	// Handle publish (atomic create-and-publish)
	// If validation fails, NO product is created - user stays on form with errors
	const handlePublish = async (
		data: ProductFormData
	): Promise<ProductFormResult> => {
		setIsLoading(true);
		try {
			// Use atomic create-and-publish with shouldPublish flag
			// Server validates for publishing BEFORE creating the product
			const payload = {
				...data,
				categories: normalizeCategories(data.categories),
				shouldPublish: true, // Tells API to validate and publish atomically
			};

			const response = await fetch("/api/products", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const result = await response.json();

			if (result.success) {
				// Product created AND published successfully
				toast.success("Product published successfully");
				const productId = result.data?.product?._id || result.data?._id;
				router.push(`/dashboard/products/${productId}`);
				return {
					success: true,
					data: result.data?.product || result.data,
					warnings: result.data?.warnings,
				};
			} else {
				// Validation failed - product was NOT created
				// Show errors on the form (no redirect)
				const { summary, details } = result.errors
					? formatValidationErrors(result.errors)
					: { summary: "", details: [] };
				const errorMessage =
					summary || result.message || "Failed to publish product";

				if (details.length > 0) {
					toast.error(errorMessage, {
						description: details.join("\n"),
						duration: 8000,
					});
				} else {
					toast.error(errorMessage);
				}

				// Return errors to form - NO redirect, user can fix and retry
				return {
					success: false,
					errors: result.errors,
					message: result.message,
				};
			}
		} catch (error) {
			console.error("Failed to publish product:", error);
			toast.error("Failed to publish product", {
				description:
					error instanceof Error ? error.message : "Network error occurred",
			});
			return { success: false, message: "Failed to publish product" };
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
					<Link href="/dashboard/products">
						<Button variant="ghost" size="icon">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-medium">Create Product</h1>
						<p className="text-slate-600">
							Add a new product to your catalog
						</p>
					</div>
				</div>

				{/* Form */}
				<ProductForm
					categoryTree={categoryTree}
					treatmentSuggestions={treatmentSuggestions}
					certificationSuggestions={certificationSuggestions}
					onSaveDraft={handleSaveDraft}
					onPublish={handlePublish}
					onCancel={() => router.push("/dashboard/products")}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}
