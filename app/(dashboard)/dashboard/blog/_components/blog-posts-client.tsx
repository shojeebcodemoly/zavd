"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Plus,
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
	Send,
	FileText,
	Search,
	X,
	Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ImageComponent } from "@/components/common/image-component";

/**
 * Custom hook for debounced value
 */
function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

	React.useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

interface BlogPost {
	_id: string;
	title: string;
	slug: string;
	excerpt: string;
	publishType: "publish" | "draft" | "private";
	featuredImage?: { url: string; alt: string };
	categories: { _id: string; name: string; slug: string }[];
	author: { _id: string; name: string; email: string; image?: string };
	publishedAt?: string;
	updatedAt: string;
	createdAt: string;
}

interface BlogStats {
	total: number;
	published: number;
	draft: number;
	private: number;
}

interface BlogPostsMeta {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

interface BlogPostsClientProps {
	initialPosts: BlogPost[];
	initialMeta: BlogPostsMeta;
	initialStats: BlogStats;
}

/**
 * Blog Posts Client Component
 * Handles all interactivity for the blog posts list
 */
export function BlogPostsClient({
	initialPosts,
	initialMeta,
	initialStats,
}: BlogPostsClientProps) {
	const router = useRouter();

	const [posts, setPosts] = React.useState<BlogPost[]>(initialPosts);
	const [stats, setStats] = React.useState<BlogStats>(initialStats);
	const [isLoading, setIsLoading] = React.useState(false);
	const [search, setSearch] = React.useState("");
	const [statusFilter, setStatusFilter] = React.useState<string>("all");
	const [page, setPage] = React.useState(initialMeta.page);
	const [totalPages, setTotalPages] = React.useState(initialMeta.totalPages);

	// Debounce search input (300ms delay)
	const debouncedSearch = useDebounce(search, 300);

	// Confirmation modal
	const { confirm, ConfirmModal } = useConfirmModal({
		variant: "destructive",
	});

	// Fetch posts - using refs to avoid stale closures
	const fetchPosts = React.useCallback(
		async (searchTerm: string, status: string, pageNum: number) => {
			setIsLoading(true);
			try {
				const params = new URLSearchParams({
					page: pageNum.toString(),
					limit: "10",
				});
				if (searchTerm.trim()) {
					params.append("search", searchTerm.trim());
				}
				if (status && status !== "all") {
					params.append("publishType", status);
				}

				const response = await fetch(`/api/blog-posts?${params}`);
				const data = await response.json();

				if (data.success) {
					setPosts(data.data);
					setTotalPages(data.meta?.totalPages || 1);
				}
			} catch (error) {
				console.error("Failed to fetch blog posts:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	// Fetch stats
	const fetchStats = React.useCallback(async () => {
		try {
			const response = await fetch("/api/blog-posts/stats");
			const data = await response.json();
			if (data.success) {
				setStats(data.data);
			}
		} catch (error) {
			console.error("Failed to fetch stats:", error);
		}
	}, []);

	// Track previous values to detect what changed
	const prevSearchRef = React.useRef(debouncedSearch);
	const prevFilterRef = React.useRef(statusFilter);
	const prevPageRef = React.useRef(page);
	const isInitialMount = React.useRef(true);

	// Effect for search/filter changes - reset to page 1
	React.useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}

		const searchChanged = prevSearchRef.current !== debouncedSearch;
		const filterChanged = prevFilterRef.current !== statusFilter;

		if (searchChanged || filterChanged) {
			prevSearchRef.current = debouncedSearch;
			prevFilterRef.current = statusFilter;
			prevPageRef.current = 1;
			setPage(1);
			fetchPosts(debouncedSearch, statusFilter, 1);
		}
	}, [debouncedSearch, statusFilter, fetchPosts]);

	// Separate effect for page changes only
	React.useEffect(() => {
		// Skip if it's the initial mount or if page didn't actually change
		if (isInitialMount.current || prevPageRef.current === page) {
			return;
		}

		prevPageRef.current = page;
		fetchPosts(debouncedSearch, statusFilter, page);
	}, [page, debouncedSearch, statusFilter, fetchPosts]);

	// Handle search form submit (immediate search, bypass debounce)
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (search.trim()) {
			setPage(1);
			fetchPosts(search.trim(), statusFilter, 1);
		}
	};

	// Clear search
	const clearSearch = () => {
		setSearch("");
	};

	// Handle delete
	const handleDelete = async (id: string) => {
		const confirmed = await confirm({
			title: "Delete Blog Post",
			description:
				"Are you sure you want to delete this blog post? This action cannot be undone.",
			confirmText: "Delete",
		});

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/blog-posts/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				toast.success("Blog post deleted successfully");
				fetchPosts(debouncedSearch, statusFilter, page);
				fetchStats();
			} else {
				const data = await response.json();
				toast.error(data.message || "Failed to delete blog post");
			}
		} catch (error) {
			console.error("Failed to delete blog post:", error);
			toast.error("Failed to delete blog post");
		}
	};

	// Handle publish/unpublish
	const handlePublishToggle = async (id: string, currentStatus: string) => {
		const newStatus = currentStatus === "publish" ? "draft" : "publish";

		try {
			const response = await fetch(`/api/blog-posts/${id}/publish`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ publishType: newStatus }),
			});

			const data = await response.json();

			if (data.success) {
				toast.success(
					newStatus === "publish"
						? "Blog post published successfully"
						: "Blog post unpublished"
				);
				fetchPosts(debouncedSearch, statusFilter, page);
				fetchStats();
			} else {
				toast.error(data.message || "Failed to update publish status");
			}
		} catch (error) {
			console.error("Failed to update publish status:", error);
			toast.error("Failed to update publish status");
		}
	};

	// Get status badge
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "publish":
				return (
					<Badge className="bg-green-100 text-green-800">Published</Badge>
				);
			case "draft":
				return <Badge variant="secondary">Draft</Badge>;
			case "private":
				return <Badge variant="outline">Private</Badge>;
			default:
				return null;
		}
	};

	return (
		<>
			<ConfirmModal />
			<div className="space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-medium">Blog Posts</h1>
						<p className="text-slate-600">Manage your blog content</p>
					</div>
					<Link href="/dashboard/blog/new">
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Add Post
						</Button>
					</Link>
				</div>

				{/* Stats */}
				{stats && (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold">{stats.total}</div>
								<p className="text-sm text-slate-600">Total Posts</p>
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
								<div className="text-2xl font-bold text-slate-600">
									{stats.draft}
								</div>
								<p className="text-sm text-slate-600">Drafts</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-slate-400">
									{stats.private}
								</div>
								<p className="text-sm text-slate-600">Private</p>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Filters */}
				<Card>
					<CardHeader>
						<CardTitle>Blog Posts</CardTitle>
						<CardDescription>
							View and manage your blog posts
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col md:flex-row gap-4 mb-6">
							{/* Search */}
							<form onSubmit={handleSearch} className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
									<Input
										placeholder="Search posts by title, content..."
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										className="pl-10 pr-10"
									/>
									{/* Loading indicator or clear button */}
									{search && (
										<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
											{isLoading && search === debouncedSearch ? (
												<Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
											) : (
												<button
													type="button"
													onClick={clearSearch}
													className="text-slate-400 hover:text-slate-600"
												>
													<X className="h-4 w-4" />
												</button>
											)}
										</div>
									)}
								</div>
							</form>

							{/* Status filter */}
							<Select
								value={statusFilter}
								onValueChange={(value) => setStatusFilter(value)}
							>
								<SelectTrigger className="w-[140px] h-10">
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

						{/* Posts List */}
						{isLoading ? (
							<div className="space-y-4">
								{[...Array(5)].map((_, i) => (
									<div
										key={i}
										className="h-20 bg-slate-100 animate-pulse rounded-lg"
									/>
								))}
							</div>
						) : posts.length === 0 ? (
							<div className="text-center py-12 text-slate-500">
								<FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
								<p>No blog posts found</p>
								<Link href="/dashboard/blog/new">
									<Button variant="outline" className="mt-4">
										Create your first blog post
									</Button>
								</Link>
							</div>
						) : (
							<div className="space-y-4">
								{posts.map((post) => (
									<div
										key={post._id}
										className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
									>
										{/* Featured Image */}
										<div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
											{post.featuredImage?.url ? (
												<ImageComponent
													src={post.featuredImage.url}
													alt={
														post.featuredImage.alt || post.title
													}
													width={64}
													height={64}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<FileText className="h-6 w-6 text-slate-400" />
												</div>
											)}
										</div>

										{/* Post Info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<h3 className="font-medium truncate">
													{post.title}
												</h3>
												{getStatusBadge(post.publishType)}
											</div>
											<p className="text-sm text-slate-500 truncate">
												/{post.slug}
											</p>
											<div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
												<span>
													By {post.author?.name || "Unknown"}
												</span>
												<span>•</span>
												<span>
													{new Date(
														post.updatedAt
													).toLocaleDateString()}
												</span>
											</div>
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
													<button
														onClick={() =>
															router.push(
																`/dashboard/blog/${post._id}`
															)
														}
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
													>
														<Edit className="h-4 w-4" />
														Edit
													</button>
													<Link
														href={`/nyheter/${post.slug}`}
														target="_blank"
														// onClick={() =>
														// 	window.open(`/nyheter/${post.slug}`, "_blank")
														// }
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
													>
														<Eye className="h-4 w-4" />
														View
													</Link>
													<button
														onClick={() =>
															handlePublishToggle(
																post._id,
																post.publishType
															)
														}
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
													>
														<Send className="h-4 w-4" />
														{post.publishType === "publish"
															? "Unpublish"
															: "Publish"}
													</button>
													<button
														onClick={() => handleDelete(post._id)}
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
							</div>
						)}

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex justify-center gap-2 mt-6">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									disabled={page === 1}
								>
									Previous
								</Button>
								<span className="flex items-center px-4 text-sm text-slate-600">
									Page {page} of {totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setPage((p) => Math.min(totalPages, p + 1))
									}
									disabled={page === totalPages}
								>
									Next
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
