"use client";

import * as React from "react";
import Link from "next/link";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import {
	MoreHorizontal,
	Eye,
	Trash2,
	CheckCircle,
	XCircle,
	Clock,
	MessageSquare,
	Mail,
	Phone,
	ExternalLink,
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { StatsGridSkeleton } from "@/components/ui/skeletons";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { CommentStatus } from "@/models/blog-comment.model";

interface Comment {
	_id: string;
	postId: string;
	postTitle: string;
	postSlug: string;
	name: string;
	email: string;
	phone: string;
	comment: string;
	status: CommentStatus;
	createdAt: string;
}

interface CommentStats {
	total: number;
	pending: number;
	approved: number;
	rejected: number;
}

interface CommentsListProps {
	initialComments: Comment[];
	initialStats: CommentStats | null;
	initialPage: number;
	initialTotalPages: number;
	initialTotal: number;
	initialSearch: string;
	initialStatus: string;
	initialPostId: string;
}

const statusColors: Record<CommentStatus, string> = {
	pending: "bg-yellow-100 text-yellow-800",
	approved: "bg-green-100 text-green-800",
	rejected: "bg-red-100 text-red-800",
};

const statusIcons: Record<CommentStatus, React.ReactNode> = {
	pending: <Clock className="h-3 w-3" />,
	approved: <CheckCircle className="h-3 w-3" />,
	rejected: <XCircle className="h-3 w-3" />,
};

export function CommentsList({
	initialComments,
	initialStats,
	initialPage,
	initialTotalPages,
	initialTotal,
	initialSearch,
	initialStatus,
	initialPostId,
}: CommentsListProps) {
	// URL state with nuqs
	const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
	const [search, setSearch] = useQueryState(
		"search",
		parseAsString.withDefault("")
	);
	const [status, setStatus] = useQueryState(
		"status",
		parseAsString.withDefault("")
	);
	const [postId, setPostId] = useQueryState(
		"postId",
		parseAsString.withDefault("")
	);

	// Local state
	const [comments, setComments] = React.useState<Comment[]>(initialComments);
	const [stats, setStats] = React.useState<CommentStats | null>(initialStats);
	const [totalPages, setTotalPages] = React.useState(initialTotalPages);
	const [total, setTotal] = React.useState(initialTotal);
	const [isLoading, setIsLoading] = React.useState(false);
	const [selectedComment, setSelectedComment] = React.useState<Comment | null>(
		null
	);

	// Track if this is the initial mount
	const isInitialMount = React.useRef(true);

	// Confirmation modal
	const { confirm, ConfirmModal } = useConfirmModal({
		variant: "destructive",
	});

	// Fetch comments
	const fetchComments = React.useCallback(
		async (
			pageNum: number,
			searchTerm: string,
			statusFilter: string,
			postIdFilter: string
		) => {
			setIsLoading(true);
			try {
				const params = new URLSearchParams({
					page: pageNum.toString(),
					limit: "20",
				});
				if (searchTerm) params.append("search", searchTerm);
				if (statusFilter) params.append("status", statusFilter);
				if (postIdFilter) params.append("postId", postIdFilter);

				const response = await fetch(`/api/comments?${params}`);
				const data = await response.json();

				if (data.success) {
					setComments(data.data);
					setTotalPages(data.meta?.totalPages || 1);
					setTotal(data.meta?.total || 0);
				}
			} catch (error) {
				console.error("Failed to fetch comments:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	// Fetch stats
	const fetchStats = React.useCallback(async () => {
		try {
			const response = await fetch("/api/comments/stats");
			const data = await response.json();
			if (data.success) {
				setStats(data.data);
			}
		} catch (error) {
			console.error("Failed to fetch stats:", error);
		}
	}, []);

	// Re-fetch when URL params change (skip initial mount)
	React.useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}

		fetchComments(
			page || 1,
			search || "",
			status || "",
			postId || ""
		);
	}, [page, search, status, postId, fetchComments]);

	// Handle search
	const handleSearch = React.useCallback(
		async (value: string) => {
			await setSearch(value || null);
			await setPage(1);
		},
		[setPage, setSearch]
	);

	// Handle status filter
	const handleStatusChange = React.useCallback(
		async (value: string) => {
			await setStatus(value || null);
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

	// Handle status update
	const handleStatusUpdate = async (id: string, newStatus: CommentStatus) => {
		try {
			const response = await fetch(`/api/comments/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success(data.message || `Comment ${newStatus}`);
				fetchComments(
					page || 1,
					search || "",
					status || "",
					postId || ""
				);
				fetchStats();
			} else {
				toast.error(data.message || "Failed to update status");
			}
		} catch (error) {
			console.error("Failed to update status:", error);
			toast.error("Failed to update status");
		}
	};

	// Handle delete
	const handleDelete = async (id: string) => {
		const confirmed = await confirm({
			title: "Delete Comment",
			description:
				"Are you sure you want to delete this comment? This action cannot be undone.",
			confirmText: "Delete",
		});

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/comments/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				toast.success("Comment deleted");
				fetchComments(
					page || 1,
					search || "",
					status || "",
					postId || ""
				);
				fetchStats();
			} else {
				const data = await response.json();
				toast.error(data.message || "Failed to delete");
			}
		} catch (error) {
			console.error("Failed to delete:", error);
			toast.error("Failed to delete comment");
		}
	};

	// Clear post filter
	const clearPostFilter = async () => {
		await setPostId(null);
		await setPage(1);
	};

	return (
		<>
			<ConfirmModal />

			{/* Comment Detail Modal */}
			<Dialog
				open={!!selectedComment}
				onOpenChange={() => setSelectedComment(null)}
			>
				<DialogContent className="max-w-2xl">
					{selectedComment && (
						<>
							<DialogHeader>
								<DialogTitle>Comment Details</DialogTitle>
								<DialogDescription>
									Submitted on{" "}
									{new Date(
										selectedComment.createdAt
									).toLocaleDateString("sv-SE", {
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-6">
								{/* Post Info */}
								<div className="p-4 bg-slate-50 rounded-lg">
									<p className="text-sm text-slate-500 mb-1">
										Blog Post
									</p>
									<Link
										href={`/nyheter/${selectedComment.postSlug}`}
										target="_blank"
										className="font-medium text-primary hover:underline flex items-center gap-1"
									>
										{selectedComment.postTitle}
										<ExternalLink className="h-3 w-3" />
									</Link>
								</div>

								{/* Contact Info */}
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									<div className="min-w-0">
										<p className="text-sm text-slate-500 mb-1">
											Name
										</p>
										<p className="font-medium truncate">
											{selectedComment.name}
										</p>
									</div>
									<div className="min-w-0">
										<p className="text-sm text-slate-500 mb-1">
											Email
										</p>
										<a
											href={`mailto:${selectedComment.email}`}
											className="font-medium text-primary hover:underline block truncate"
											title={selectedComment.email}
										>
											{selectedComment.email}
										</a>
									</div>
									<div className="min-w-0">
										<p className="text-sm text-slate-500 mb-1">
											Phone
										</p>
										<a
											href={`tel:${selectedComment.phone}`}
											className="font-medium text-primary hover:underline block"
										>
											{selectedComment.phone}
										</a>
									</div>
								</div>

								{/* Comment Content */}
								<div>
									<p className="text-sm text-slate-500 mb-2">
										Comment
									</p>
									<div className="p-4 bg-slate-50 rounded-lg">
										<p className="whitespace-pre-wrap">
											{selectedComment.comment}
										</p>
									</div>
								</div>

								{/* Status */}
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="text-sm text-slate-500">
											Status:
										</span>
										<Badge
											className={
												statusColors[selectedComment.status]
											}
										>
											{statusIcons[selectedComment.status]}
											<span className="ml-1 capitalize">
												{selectedComment.status}
											</span>
										</Badge>
									</div>

									<div className="flex gap-2">
										{selectedComment.status !== "approved" && (
											<Button
												size="sm"
												variant="outline"
												className="text-green-600 hover:text-green-700 hover:bg-green-50"
												onClick={() => {
													handleStatusUpdate(
														selectedComment._id,
														"approved"
													);
													setSelectedComment(null);
												}}
											>
												<CheckCircle className="h-4 w-4 mr-1" />
												Approve
											</Button>
										)}
										{selectedComment.status !== "rejected" && (
											<Button
												size="sm"
												variant="outline"
												className="text-red-600 hover:text-red-700 hover:bg-red-50"
												onClick={() => {
													handleStatusUpdate(
														selectedComment._id,
														"rejected"
													);
													setSelectedComment(null);
												}}
											>
												<XCircle className="h-4 w-4 mr-1" />
												Reject
											</Button>
										)}
									</div>
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>

			<div className="space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-medium">Comments</h1>
						<p className="text-slate-600">
							Manage blog post comments
						</p>
					</div>
				</div>

				{/* Stats Cards */}
				{stats ? (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Card
							className="cursor-pointer hover:shadow-md transition-shadow"
							onClick={() => handleStatusChange("")}
						>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold">{stats.total}</div>
								<p className="text-sm text-slate-600">Total</p>
							</CardContent>
						</Card>
						<Card
							className="cursor-pointer hover:shadow-md transition-shadow"
							onClick={() => handleStatusChange("pending")}
						>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-yellow-600">
									{stats.pending}
								</div>
								<p className="text-sm text-slate-600">Pending</p>
							</CardContent>
						</Card>
						<Card
							className="cursor-pointer hover:shadow-md transition-shadow"
							onClick={() => handleStatusChange("approved")}
						>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-green-600">
									{stats.approved}
								</div>
								<p className="text-sm text-slate-600">Approved</p>
							</CardContent>
						</Card>
						<Card
							className="cursor-pointer hover:shadow-md transition-shadow"
							onClick={() => handleStatusChange("rejected")}
						>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-red-600">
									{stats.rejected}
								</div>
								<p className="text-sm text-slate-600">Rejected</p>
							</CardContent>
						</Card>
					</div>
				) : (
					<StatsGridSkeleton count={4} />
				)}

				{/* Filters */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex gap-4 flex-wrap items-center">
							<SearchInput
								defaultValue={search || ""}
								onSearch={handleSearch}
								placeholder="Search by name, email, comment..."
								isLoading={isLoading}
								debounceMs={400}
								className="flex-1 min-w-[200px]"
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
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="approved">Approved</SelectItem>
									<SelectItem value="rejected">Rejected</SelectItem>
								</SelectContent>
							</Select>
							{postId && (
								<Button
									variant="outline"
									size="sm"
									onClick={clearPostFilter}
								>
									Clear Post Filter
								</Button>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Comments List */}
				<Card>
					<CardHeader>
						<CardTitle>All Comments</CardTitle>
						<CardDescription>{total} comments found</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="space-y-4">
								{[...Array(5)].map((_, i) => (
									<div
										key={i}
										className="h-24 bg-slate-100 rounded-lg animate-pulse"
									/>
								))}
							</div>
						) : comments.length === 0 ? (
							<div className="text-center py-8 text-slate-500">
								<MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
								<p>No comments found</p>
							</div>
						) : (
							<div className="space-y-4">
								{comments.map((comment) => (
									<div
										key={comment._id}
										className={`p-4 border rounded-lg hover:bg-slate-50 transition-colors ${
											comment.status === "pending"
												? "border-yellow-200 bg-yellow-50/30"
												: ""
										}`}
									>
										<div className="flex items-start gap-4">
											{/* Main Content */}
											<div className="flex-1 min-w-0">
												{/* Header Row */}
												<div className="flex items-center gap-2 flex-wrap mb-2">
													<h3 className="font-semibold">
														{comment.name}
													</h3>
													<Badge
														className={
															statusColors[comment.status]
														}
													>
														{statusIcons[comment.status]}
														<span className="ml-1 capitalize">
															{comment.status}
														</span>
													</Badge>
													<span className="text-sm text-slate-500">
														{new Date(
															comment.createdAt
														).toLocaleDateString("sv-SE")}
													</span>
												</div>

												{/* Contact Info */}
												<div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
													<span className="flex items-center gap-1">
														<Mail className="h-3 w-3" />
														{comment.email}
													</span>
													<span className="flex items-center gap-1">
														<Phone className="h-3 w-3" />
														{comment.phone}
													</span>
												</div>

												{/* Post Reference */}
												<Link
													href={`/nyheter/${comment.postSlug}`}
													target="_blank"
													className="text-sm text-primary hover:underline flex items-center gap-1 mb-2"
												>
													<MessageSquare className="h-3 w-3" />
													{comment.postTitle}
													<ExternalLink className="h-3 w-3" />
												</Link>

												{/* Comment Preview */}
												<p className="text-slate-600 line-clamp-2">
													{comment.comment}
												</p>
											</div>

											{/* Actions */}
											<div className="flex items-center gap-2 shrink-0">
												{/* Quick Actions */}
												{comment.status === "pending" && (
													<>
														<Button
															size="sm"
															variant="ghost"
															className="text-green-600 hover:text-green-700 hover:bg-green-50"
															onClick={() =>
																handleStatusUpdate(
																	comment._id,
																	"approved"
																)
															}
															title="Approve"
														>
															<CheckCircle className="h-4 w-4" />
														</Button>
														<Button
															size="sm"
															variant="ghost"
															className="text-red-600 hover:text-red-700 hover:bg-red-50"
															onClick={() =>
																handleStatusUpdate(
																	comment._id,
																	"rejected"
																)
															}
															title="Reject"
														>
															<XCircle className="h-4 w-4" />
														</Button>
													</>
												)}

												<Popover>
													<PopoverTrigger asChild>
														<Button variant="ghost" size="icon">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</PopoverTrigger>
													<PopoverContent
														align="end"
														className="w-48"
													>
														<div className="space-y-1">
															<button
																onClick={() =>
																	setSelectedComment(comment)
																}
																className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
															>
																<Eye className="h-4 w-4" />
																View Details
															</button>
															{comment.status !== "approved" && (
																<button
																	onClick={() =>
																		handleStatusUpdate(
																			comment._id,
																			"approved"
																		)
																	}
																	className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-green-50 text-green-600 w-full"
																>
																	<CheckCircle className="h-4 w-4" />
																	Approve
																</button>
															)}
															{comment.status !== "rejected" && (
																<button
																	onClick={() =>
																		handleStatusUpdate(
																			comment._id,
																			"rejected"
																		)
																	}
																	className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-red-50 text-red-600 w-full"
																>
																	<XCircle className="h-4 w-4" />
																	Reject
																</button>
															)}
															{comment.status !== "pending" && (
																<button
																	onClick={() =>
																		handleStatusUpdate(
																			comment._id,
																			"pending"
																		)
																	}
																	className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-yellow-50 text-yellow-600 w-full"
																>
																	<Clock className="h-4 w-4" />
																	Set Pending
																</button>
															)}
															<button
																onClick={() =>
																	handleDelete(comment._id)
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
										</div>
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
