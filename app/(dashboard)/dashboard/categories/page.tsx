"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Plus,
	ChevronRight,
	ChevronDown,
	Folder,
	FolderOpen,
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
	EyeOff,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";
import {
	StatsCardSkeleton,
	CategoryTreeSkeleton,
} from "@/components/ui/skeletons";
import type { ICategoryTreeNode } from "@/models/category.model";

interface TreeNodeProps {
	node: ICategoryTreeNode;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onToggleActive: (id: string) => void;
	level?: number;
}

/**
 * TreeNode Component - Renders a single category in the tree
 */
function TreeNode({
	node,
	onEdit,
	onDelete,
	onToggleActive,
	level = 0,
}: TreeNodeProps) {
	const [expanded, setExpanded] = React.useState(level < 2);
	const hasChildren = node.children && node.children.length > 0;

	return (
		<div>
			<div
				className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-slate-50 group"
				style={{ marginLeft: `${level * 24}px` }}
			>
				{/* Expand/collapse */}
				{hasChildren ? (
					<button
						onClick={() => setExpanded(!expanded)}
						className="p-1 hover:bg-slate-200 rounded"
					>
						{expanded ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</button>
				) : (
					<span className="w-6" />
				)}

				{/* Icon */}
				{expanded && hasChildren ? (
					<FolderOpen className="h-5 w-5 text-primary" />
				) : (
					<Folder className="h-5 w-5 text-slate-400" />
				)}

				{/* Name */}
				<span className="flex-1 font-medium">{node.name}</span>

				{/* Order badge */}
				<Badge variant="outline" className="text-xs font-mono">
					{node.order}
				</Badge>

				{/* Status badge */}
				{!node.isActive && (
					<Badge variant="secondary" className="text-xs">
						Inactive
					</Badge>
				)}

				{/* Slug */}
				<span className="text-sm text-slate-500 hidden md:block">
					/{node.slug}
				</span>

				{/* Actions */}
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent align="end" className="w-40">
						<div className="space-y-1">
							<button
								onClick={() => onEdit(node._id)}
								className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
							>
								<Edit className="h-4 w-4" />
								Edit
							</button>
							<button
								onClick={() => onToggleActive(node._id)}
								className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
							>
								{node.isActive ? (
									<>
										<EyeOff className="h-4 w-4" />
										Deactivate
									</>
								) : (
									<>
										<Eye className="h-4 w-4" />
										Activate
									</>
								)}
							</button>
							<button
								onClick={() => onDelete(node._id)}
								className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-red-50 text-red-600 w-full"
							>
								<Trash2 className="h-4 w-4" />
								Delete
							</button>
						</div>
					</PopoverContent>
				</Popover>
			</div>

			{/* Children */}
			{expanded && hasChildren && (
				<div>
					{node.children.map((child) => (
						<TreeNode
							key={child._id}
							node={child}
							onEdit={onEdit}
							onDelete={onDelete}
							onToggleActive={onToggleActive}
							level={level + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}

/**
 * Categories Dashboard Page
 */
export default function CategoriesPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const [categoryTree, setCategoryTree] = React.useState<ICategoryTreeNode[]>(
		[]
	);
	const [isLoading, setIsLoading] = React.useState(true);

	// Confirmation modal
	const { confirm, ConfirmModal } = useConfirmModal({
		variant: "destructive",
	});

	// Redirect if not authenticated
	React.useEffect(() => {
		if (!isPending && !session) {
			router.push("/login?callbackUrl=/dashboard/categories");
		}
	}, [session, isPending, router]);

	// Fetch category tree
	const fetchCategories = React.useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/categories/tree");
			const data = await response.json();

			if (data.success) {
				setCategoryTree(data.data);
			}
		} catch (error) {
			console.error("Failed to fetch categories:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	React.useEffect(() => {
		if (session) {
			fetchCategories();
		}
	}, [session, fetchCategories]);

	// Count total categories
	const countCategories = (nodes: ICategoryTreeNode[]): number => {
		let count = nodes.length;
		for (const node of nodes) {
			count += countCategories(node.children);
		}
		return count;
	};

	// Handle edit
	const handleEdit = (id: string) => {
		router.push(`/dashboard/categories/${id}`);
	};

	// Handle delete
	const handleDelete = async (id: string) => {
		const confirmed = await confirm({
			title: "Delete Category",
			description:
				"Are you sure you want to delete this category? This action cannot be undone.",
			confirmText: "Delete",
		});

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/categories/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				toast.success("Category deleted successfully");
				fetchCategories();
			} else {
				const data = await response.json();
				toast.error(data.message || "Failed to delete category");
			}
		} catch (error) {
			console.error("Failed to delete category:", error);
			toast.error("Failed to delete category");
		}
	};

	// Handle toggle active
	const handleToggleActive = async (id: string) => {
		try {
			// Get current category to determine current status
			const node = findNodeById(categoryTree, id);
			if (!node) return;

			const newStatus = !node.isActive;
			const response = await fetch(`/api/categories/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isActive: newStatus }),
			});

			if (response.ok) {
				toast.success(
					newStatus
						? "Category activated successfully"
						: "Category deactivated successfully"
				);
				fetchCategories();
			} else {
				const data = await response.json();
				toast.error(data.message || "Failed to update category status");
			}
		} catch (error) {
			console.error("Failed to toggle category:", error);
			toast.error("Failed to update category status");
		}
	};

	// Find node by ID in tree
	const findNodeById = (
		nodes: ICategoryTreeNode[],
		id: string
	): ICategoryTreeNode | null => {
		for (const node of nodes) {
			if (node._id === id) return node;
			const found = findNodeById(node.children, id);
			if (found) return found;
		}
		return null;
	};

	if (isPending) {
		return (
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<div>
						<div className="h-9 w-40 bg-accent animate-pulse rounded-md mb-2" />
						<div className="h-5 w-56 bg-accent animate-pulse rounded-md" />
					</div>
					<div className="h-10 w-36 bg-accent animate-pulse rounded-md" />
				</div>
				<StatsCardSkeleton />
				<div className="rounded-xl border bg-card shadow-sm">
					<div className="p-6 border-b">
						<div className="h-6 w-32 bg-accent animate-pulse rounded-md mb-1" />
						<div className="h-4 w-64 bg-accent animate-pulse rounded-md" />
					</div>
					<div className="p-6">
						<CategoryTreeSkeleton />
					</div>
				</div>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	return (
		<>
			<ConfirmModal />
			<div className="space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-medium">Categories</h1>
						<p className="text-slate-600">
							Manage your product categories
						</p>
					</div>
					<Link href="/dashboard/categories/new">
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Add Category
						</Button>
					</Link>
				</div>

				{/* Stats */}
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">
							{countCategories(categoryTree)}
						</div>
						<p className="text-sm text-slate-600">Total Categories</p>
					</CardContent>
				</Card>

				{/* Category Tree */}
				<Card>
					<CardHeader>
						<CardTitle>Category Tree</CardTitle>
						<CardDescription>
							Organize your categories in a hierarchical structure
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<CategoryTreeSkeleton />
						) : categoryTree.length === 0 ? (
							<div className="text-center py-8 text-slate-500">
								<p>No categories yet</p>
								<Link href="/dashboard/categories/new">
									<Button variant="outline" className="mt-4">
										Create your first category
									</Button>
								</Link>
							</div>
						) : (
							<div className="space-y-1">
								{categoryTree.map((node) => (
									<TreeNode
										key={node._id}
										node={node}
										onEdit={handleEdit}
										onDelete={handleDelete}
										onToggleActive={handleToggleActive}
									/>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
