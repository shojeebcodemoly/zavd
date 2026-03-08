"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import {
	Plus,
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
	Copy,
	Send,
	FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";
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
import { ImageComponent } from "@/components/common/image-component";
import {
	StatsGridSkeleton,
	ProductListSkeleton,
} from "@/components/ui/skeletons";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface Product {
	_id: string;
	title: string;
	slug: string;
	publishType: "publish" | "draft" | "pending" | "private";
	visibility: "public" | "hidden";
	productImages: string[];
	categories: { _id: string; name: string; slug: string }[];
	primaryCategory?: { _id: string; name: string; slug: string } | null;
	updatedAt: string;
	createdAt: string;
}

interface ProductStats {
	total: number;
	published: number;
	draft: number;
	private: number;
}

interface ProductsListProps {
	initialProducts: Product[];
	initialStats: ProductStats | null;
	initialPage: number;
	initialTotalPages: number;
	initialSearch: string;
	initialStatus: string;
}

export function ProductsList({
	initialProducts,
	initialStats,
	initialPage,
	initialTotalPages,
	initialSearch,
	initialStatus,
}: ProductsListProps) {
	const router = useRouter();

	// URL state with nuqs - use 1 as default for page, empty for others
	const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
	const [search, setSearch] = useQueryState(
		"search",
		parseAsString.withDefault("")
	);
	const [status, setStatus] = useQueryState(
		"status",
		parseAsString.withDefault("")
	);

	// Local state for data
	const [products, setProducts] = React.useState<Product[]>(initialProducts);
	const [stats, setStats] = React.useState<ProductStats | null>(initialStats);
	const [totalPages, setTotalPages] = React.useState(initialTotalPages);
	const [isLoading, setIsLoading] = React.useState(false);

	// Track if this is the initial mount
	const isInitialMount = React.useRef(true);

	// Confirmation modal
	const { confirm, ConfirmModal } = useConfirmModal({
		variant: "destructive",
	});

	// Fetch products
	const fetchProducts = React.useCallback(
		async (pageNum: number, searchTerm: string, statusFilter: string) => {
			setIsLoading(true);
			try {
				const params = new URLSearchParams({
					page: pageNum.toString(),
					limit: "10",
				});
				if (searchTerm) params.append("search", searchTerm);
				if (statusFilter && statusFilter !== "all") {
					params.append("publishType", statusFilter);
				}

				const response = await fetch(`/api/products?${params}`);
				const data = await response.json();

				if (data.success) {
					setProducts(data.data);
					setTotalPages(data.meta?.totalPages || 1);
				}
			} catch (error) {
				console.error("Failed to fetch products:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	// Fetch stats
	const fetchStats = React.useCallback(async () => {
		try {
			const response = await fetch("/api/products/stats");
			const data = await response.json();
			if (data.success) {
				setStats(data.data);
			}
		} catch (error) {
			console.error("Failed to fetch stats:", error);
		}
	}, []);

	// Re-fetch when URL params change (skip initial mount since we have server data)
	React.useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}

		// Normalize values for comparison
		const currentPage = page || 1;
		const currentSearch = search || "";
		const currentStatus = status || "";

		fetchProducts(currentPage, currentSearch, currentStatus);
	}, [page, search, status, fetchProducts]);

	// Handle search - reset to page 1
	const handleSearch = React.useCallback(
		async (value: string) => {
			// Set both at once to avoid double fetch
			await setSearch(value || null);
			await setPage(1);
		},
		[setPage, setSearch]
	);

	// Handle status filter change - reset to page 1
	const handleStatusChange = React.useCallback(
		async (value: string) => {
			// Set both at once to avoid double fetch
			await setStatus(value === "all" || !value ? null : value);
			await setPage(1);
		},
		[setPage, setStatus]
	);

	// Handle page change
	const handlePageChange = React.useCallback(
		async (newPage: number) => {
			await setPage(newPage === 1 ? null : newPage);
		},
		[setPage]
	);

	// Handle delete
	const handleDelete = async (id: string) => {
		const confirmed = await confirm({
			title: "Delete Product",
			description:
				"Are you sure you want to delete this product? This action cannot be undone.",
			confirmText: "Delete",
		});

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/products/${id}`, {
				method: "DELETE",
			});
			if (response.ok) {
				toast.success("Product deleted successfully");
				fetchProducts(page || 1, search || "", status || "");
				fetchStats();
			} else {
				const data = await response.json();
				toast.error(data.message || "Failed to delete product");
			}
		} catch (error) {
			console.error("Failed to delete product:", error);
			toast.error("Failed to delete product");
		}
	};

	// Handle duplicate
	const handleDuplicate = async (id: string) => {
		try {
			const response = await fetch(`/api/products/${id}/duplicate`, {
				method: "POST",
			});
			const data = await response.json();
			if (data.success) {
				router.push(`/dashboard/products/${data.data._id}`);
			}
		} catch (error) {
			console.error("Failed to duplicate product:", error);
		}
	};

	// Handle publish
	const handlePublish = async (id: string) => {
		try {
			const response = await fetch(`/api/products/${id}/publish`, {
				method: "POST",
			});
			const data = await response.json();
			if (data.success) {
				toast.success("Product published successfully");
				fetchProducts(page || 1, search || "", status || "");
				fetchStats();
			} else {
				toast.error(data.message || "Failed to publish");
			}
		} catch (error) {
			console.error("Failed to publish product:", error);
			toast.error("Failed to publish product");
		}
	};

	return (
		<>
			<ConfirmModal />
			<div className="space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-medium">Products</h1>
						<p className="text-slate-600">Manage your product catalog</p>
					</div>
					<Link href="/dashboard/products/new">
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Add Product
						</Button>
					</Link>
				</div>

				{/* Stats Cards */}
				{stats ? (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold">{stats.total}</div>
								<p className="text-sm text-slate-600">Total Products</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-green-600">
									{stats.published}
								</div>
								<p className="text-sm text-slate-600">Published</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-yellow-600">
									{stats.draft}
								</div>
								<p className="text-sm text-slate-600">Drafts</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-slate-600">
									{stats.private}
								</div>
								<p className="text-sm text-slate-600">Private</p>
							</CardContent>
						</Card>
					</div>
				) : (
					<StatsGridSkeleton count={4} />
				)}

				{/* Filters */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex gap-4">
							<SearchInput
								defaultValue={search || ""}
								onSearch={handleSearch}
								placeholder="Search products..."
								isLoading={isLoading}
								debounceMs={400}
								className="flex-1"
							/>
							<Select
								value={status || "all"}
								onValueChange={(value) => handleStatusChange(value === "all" ? "" : value)}
							>
								<SelectTrigger className="w-[140px] h-11">
									<SelectValue placeholder="All Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="publish">Published</SelectItem>
									<SelectItem value="draft">Draft</SelectItem>
									<SelectItem value="private">Private</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Products List */}
				<Card>
					<CardHeader>
						<CardTitle>All Products</CardTitle>
						<CardDescription>
							{products.length} products found
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<ProductListSkeleton count={5} />
						) : products.length === 0 ? (
							<div className="text-center py-8 text-slate-500">
								No products found
							</div>
						) : (
							<div className="space-y-4">
								{products.map((product) => (
									<div
										key={product._id}
										className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50"
									>
										{/* Thumbnail */}
										<div className="w-16 h-16 bg-slate-100 rounded overflow-hidden shrink-0">
											{product.productImages?.[0] ? (
												<ImageComponent
													src={product.productImages[0]}
													alt={product.title}
													className="w-full h-full object-cover"
													height={1000}
													width={1000}
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<FileText className="h-6 w-6 text-slate-400" />
												</div>
											)}
										</div>

										{/* Info */}
										<div className="flex-1 min-w-0">
											<h3 className="font-medium truncate">
												{product.title}
											</h3>
											<p className="text-sm text-slate-500 truncate">
												/{product.slug}
											</p>
											<div className="flex gap-2 mt-1">
												<Badge
													variant={
														product.publishType === "publish"
															? "default"
															: "secondary"
													}
												>
													{product.publishType}
												</Badge>
												{product.visibility === "hidden" && (
													<Badge variant="outline">Hidden</Badge>
												)}
											</div>
										</div>

										{/* Categories */}
										<div className="hidden md:flex gap-1 flex-wrap max-w-[200px]">
											{product.categories?.slice(0, 2).map((cat) => (
												<Badge key={cat._id} variant="outline">
													{cat.name}
												</Badge>
											))}
											{product.categories?.length > 2 && (
												<Badge variant="outline">
													+{product.categories.length - 2}
												</Badge>
											)}
										</div>

										{/* Date */}
										<div className="text-sm text-slate-500 hidden lg:block">
											{new Date(
												product.updatedAt
											).toLocaleDateString()}
										</div>

										{/* Actions */}
										<Popover>
											<PopoverTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</PopoverTrigger>
											<PopoverContent align="end" className="w-48">
												<div className="space-y-1">
													<Link
														href={`/dashboard/products/${product._id}`}
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
													>
														<Edit className="h-4 w-4" />
														Edit
													</Link>
													<Link
														href={`/products/category/${product.primaryCategory?.slug || product.categories?.[0]?.slug || "uncategorized"}/${product.slug}`}
														target="_blank"
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
													>
														<Eye className="h-4 w-4" />
														View
													</Link>
													<button
														onClick={() =>
															handleDuplicate(product._id)
														}
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
													>
														<Copy className="h-4 w-4" />
														Duplicate
													</button>
													{product.publishType !== "publish" && (
														<button
															onClick={() =>
																handlePublish(product._id)
															}
															className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
														>
															<Send className="h-4 w-4" />
															Publish
														</button>
													)}
													<button
														onClick={() =>
															handleDelete(product._id)
														}
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-red-50 text-red-600 w-full"
													>
														<Trash2 className="h-4 w-4" />
														Delete
													</button>
												</div>
											</PopoverContent>
										</Popover>
									</div>
								))}

								{/* Pagination */}
								{totalPages > 1 && (
									<div className="flex justify-center gap-2 pt-4">
										<Button
											variant="outline"
											disabled={(page || 1) === 1}
											onClick={() =>
												handlePageChange((page || 1) - 1)
											}
										>
											Previous
										</Button>
										<span className="flex items-center px-4">
											Page {page || 1} of {totalPages}
										</span>
										<Button
											variant="outline"
											disabled={(page || 1) === totalPages}
											onClick={() =>
												handlePageChange((page || 1) + 1)
											}
										>
											Next
										</Button>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
