"use client";

import * as React from "react";
import Link from "next/link";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import {
	MoreHorizontal,
	Eye,
	Trash2,
	Archive,
	Mail,
	CheckCircle,
	Download,
	MessageSquare,
	Phone,
	Building,
	Calendar,
	Clock,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	StatsGridSkeleton,
	InquiryListSkeleton,
} from "@/components/ui/skeletons";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type {
	FormSubmissionType,
	FormSubmissionStatus,
	HelpType,
	TrainingInterestType,
} from "@/models/form-submission.model";

interface Submission {
	_id: string;
	type: FormSubmissionType;
	status: FormSubmissionStatus;
	fullName: string;
	email: string;
	phone: string;
	countryCode: string;
	countryName: string;
	productName: string | null;
	productSlug: string | null;
	helpType: HelpType | null;
	trainingInterestType: TrainingInterestType | null;
	subject: string | null;
	preferredDate: string | null;
	preferredTime: string | null;
	createdAt: string;
}

interface SubmissionStats {
	total: number;
	new: number;
	read: number;
	archived: number;
	byType: Record<string, number>;
}

interface InquiriesListProps {
	initialSubmissions: Submission[];
	initialStats: SubmissionStats | null;
	initialPage: number;
	initialTotalPages: number;
	initialTotal: number;
	initialSearch: string;
	initialStatus: string;
	initialType: string;
}

const statusColors: Record<FormSubmissionStatus, string> = {
	new: "bg-blue-100 text-blue-800",
	read: "bg-green-100 text-green-800",
	archived: "bg-slate-100 text-slate-600",
};

const helpTypeLabels: Record<HelpType, string> = {
	clinic_buy: "Clinic/Salon",
	start_business: "Start own business",
	just_interested: "Interested",
	buy_contact: "Want to buy",
};

const trainingInterestTypeLabels: Record<TrainingInterestType, string> = {
	machine_purchase: "Buy machine",
	already_customer: "Already customer",
	certification_info: "Certification",
	general_info: "General info",
};

export function InquiriesList({
	initialSubmissions,
	initialStats,
	initialPage,
	initialTotalPages,
	initialTotal,
	initialSearch,
	initialStatus,
	initialType,
}: InquiriesListProps) {
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
	const [type, setType] = useQueryState("type", parseAsString.withDefault(""));

	// Local state
	const [submissions, setSubmissions] =
		React.useState<Submission[]>(initialSubmissions);
	const [stats, setStats] = React.useState<SubmissionStats | null>(
		initialStats
	);
	const [totalPages, setTotalPages] = React.useState(initialTotalPages);
	const [total, setTotal] = React.useState(initialTotal);
	const [isLoading, setIsLoading] = React.useState(false);
	const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

	// Track if this is the initial mount
	const isInitialMount = React.useRef(true);

	// Confirmation modal
	const { confirm, ConfirmModal } = useConfirmModal({
		variant: "destructive",
	});

	// Fetch submissions
	const fetchSubmissions = React.useCallback(
		async (
			pageNum: number,
			searchTerm: string,
			statusFilter: string,
			typeFilter: string
		) => {
			setIsLoading(true);
			try {
				const params = new URLSearchParams({
					page: pageNum.toString(),
					limit: "20",
				});
				if (searchTerm) params.append("search", searchTerm);
				if (statusFilter) params.append("status", statusFilter);
				if (typeFilter) params.append("type", typeFilter);

				const response = await fetch(`/api/form-submissions?${params}`);
				const data = await response.json();

				if (data.success) {
					setSubmissions(
						data.data.map(
							(s: Submission & { _id: { toString(): string } }) => ({
								...s,
								_id: s._id.toString(),
							})
						)
					);
					setTotalPages(data.meta?.totalPages || 1);
					setTotal(data.meta?.total || 0);
				}
			} catch (error) {
				console.error("Failed to fetch submissions:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	// Fetch stats
	const fetchStats = React.useCallback(async () => {
		try {
			const response = await fetch("/api/form-submissions/stats");
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

		fetchSubmissions(page || 1, search || "", status || "", type || "");
	}, [page, search, status, type, fetchSubmissions]);

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

	// Handle type filter
	const handleTypeChange = React.useCallback(
		async (value: string) => {
			await setType(value || null);
			await setPage(1);
		},
		[setPage, setType]
	);

	// Handle page change
	const handlePageChange = React.useCallback(
		async (newPage: number) => {
			await setPage(newPage === 1 ? null : newPage);
		},
		[setPage]
	);

	// Handle status update
	const handleStatusUpdate = async (
		id: string,
		newStatus: FormSubmissionStatus
	) => {
		try {
			const response = await fetch(`/api/form-submissions/${id}/status`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
			});

			if (response.ok) {
				toast.success(`Status updated to ${newStatus}`);
				fetchSubmissions(page || 1, search || "", status || "", type || "");
				fetchStats();
			} else {
				const data = await response.json();
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
			title: "Delete Submission",
			description:
				"Are you sure you want to delete this submission? This action cannot be undone.",
			confirmText: "Delete",
		});

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/form-submissions/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				toast.success("Submission deleted");
				fetchSubmissions(page || 1, search || "", status || "", type || "");
				fetchStats();
			} else {
				const data = await response.json();
				toast.error(data.message || "Failed to delete");
			}
		} catch (error) {
			console.error("Failed to delete:", error);
			toast.error("Failed to delete submission");
		}
	};

	// Handle bulk actions
	const handleBulkStatusUpdate = async (newStatus: FormSubmissionStatus) => {
		if (selectedIds.length === 0) {
			toast.error("No submissions selected");
			return;
		}

		try {
			const response = await fetch(`/api/form-submissions/bulk-status`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ids: selectedIds, status: newStatus }),
			});

			if (response.ok) {
				toast.success(`${selectedIds.length} submissions updated`);
				setSelectedIds([]);
				fetchSubmissions(page || 1, search || "", status || "", type || "");
				fetchStats();
			} else {
				const data = await response.json();
				toast.error(data.message || "Failed to update");
			}
		} catch (error) {
			console.error("Failed to bulk update:", error);
			toast.error("Failed to update submissions");
		}
	};

	// Handle export
	const handleExport = async () => {
		try {
			const params = new URLSearchParams();
			if (selectedIds.length > 0) {
				params.append("ids", selectedIds.join(","));
			}
			if (status) params.append("status", status);
			if (type) params.append("type", type);
			params.append("format", "csv");

			const response = await fetch(
				`/api/form-submissions/export?${params}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						ids: selectedIds.length > 0 ? selectedIds : undefined,
						status: status || undefined,
						type: type || undefined,
						format: "csv",
					}),
				}
			);

			if (response.ok) {
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `submissions-${
					new Date().toISOString().split("T")[0]
				}.csv`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				a.remove();
				toast.success("Export downloaded");
			} else {
				toast.error("Failed to export");
			}
		} catch (error) {
			console.error("Failed to export:", error);
			toast.error("Failed to export submissions");
		}
	};

	// Toggle selection
	const toggleSelection = (id: string) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		);
	};

	// Toggle all
	const toggleAll = () => {
		if (selectedIds.length === submissions.length) {
			setSelectedIds([]);
		} else {
			setSelectedIds(submissions.map((s) => s._id));
		}
	};

	return (
		<>
			<ConfirmModal />
			<div className="space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-medium">Inquiries</h1>
						<p className="text-slate-600">
							Manage form submissions and inquiries
						</p>
					</div>
					<Button onClick={handleExport} variant="outline">
						<Download className="h-4 w-4 mr-2" />
						Export CSV
					</Button>
				</div>

				{/* Stats Cards */}
				{stats ? (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold">{stats.total}</div>
								<p className="text-sm text-slate-600">Total</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-blue-600">
									{stats.new}
								</div>
								<p className="text-sm text-slate-600">New</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-green-600">
									{stats.read}
								</div>
								<p className="text-sm text-slate-600">Read</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-2xl font-bold text-slate-600">
									{stats.archived}
								</div>
								<p className="text-sm text-slate-600">Archived</p>
							</CardContent>
						</Card>
					</div>
				) : (
					<StatsGridSkeleton count={4} />
				)}

				{/* Filters */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex gap-4 flex-wrap">
							<SearchInput
								defaultValue={search || ""}
								onSearch={handleSearch}
								placeholder="Search by name, email, phone..."
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
									<SelectItem value="new">New</SelectItem>
									<SelectItem value="read">Read</SelectItem>
									<SelectItem value="archived">Archived</SelectItem>
								</SelectContent>
							</Select>
							<Select
								value={type || "all"}
								onValueChange={(value) => handleTypeChange(value === "all" ? "" : value)}
							>
								<SelectTrigger className="w-[180px] h-11">
									<SelectValue placeholder="All Types" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Types</SelectItem>
									<SelectItem value="product_inquiry">Product Inquiry</SelectItem>
									<SelectItem value="contact">Contact</SelectItem>
									<SelectItem value="demo_request">Demo Request</SelectItem>
									<SelectItem value="quote_request">Quote Request</SelectItem>
									<SelectItem value="callback_request">Callback Request</SelectItem>
									<SelectItem value="tour_request">Tour Request</SelectItem>
									<SelectItem value="reseller_application">Reseller Application</SelectItem>
									<SelectItem value="subscriber">Subscriber</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Bulk Actions */}
				{selectedIds.length > 0 && (
					<Card className="bg-blue-50 border-blue-200">
						<CardContent className="py-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-blue-800">
									{selectedIds.length} selected
								</span>
								<div className="flex gap-2">
									<Button
										size="sm"
										variant="outline"
										onClick={() => handleBulkStatusUpdate("read")}
									>
										<CheckCircle className="h-4 w-4 mr-1" />
										Mark Read
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => handleBulkStatusUpdate("archived")}
									>
										<Archive className="h-4 w-4 mr-1" />
										Archive
									</Button>
									<Button
										size="sm"
										variant="outline"
										onClick={() => setSelectedIds([])}
									>
										Clear
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Submissions List */}
				<Card>
					<CardHeader>
						<CardTitle>All Submissions</CardTitle>
						<CardDescription>{total} submissions found</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<InquiryListSkeleton count={5} />
						) : submissions.length === 0 ? (
							<div className="text-center py-8 text-slate-500">
								No submissions found
							</div>
						) : (
							<div className="space-y-4">
								{/* Header row */}
								<div className="flex items-center gap-4 px-4 py-2 text-sm font-medium text-slate-500 border-b">
									<Checkbox
										checked={
											selectedIds.length === submissions.length &&
											submissions.length > 0
										}
										onCheckedChange={toggleAll}
									/>
									<span className="flex-1">Contact</span>
									<span className="w-32 hidden md:block">Type</span>
									<span className="w-24 hidden lg:block">Status</span>
									<span className="w-32 hidden lg:block">Date</span>
									<span className="w-10" />
								</div>

								{submissions.map((submission) => (
									<div
										key={submission._id}
										className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 ${
											submission.status === "new"
												? "border-blue-200 bg-blue-50/30"
												: ""
										}`}
									>
										{/* Checkbox */}
										<Checkbox
											checked={selectedIds.includes(submission._id)}
											onCheckedChange={() =>
												toggleSelection(submission._id)
											}
										/>

										{/* Contact Info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<Link
													href={`/dashboard/inquiries/${submission._id}`}
													className="font-medium truncate hover:text-primary hover:underline"
												>
													{submission.fullName}
												</Link>
												{submission.status === "new" && (
													<span className="w-2 h-2 bg-blue-500 rounded-full" />
												)}
											</div>
											<div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
												<span className="flex items-center gap-1 truncate">
													<Mail className="h-3 w-3" />
													{submission.email}
												</span>
												<span className="flex items-center gap-1">
													<Phone className="h-3 w-3" />
													{submission.countryCode}{" "}
													{submission.phone}
												</span>
											</div>
											{submission.productName && submission.type !== "reseller_application" && (
												<div className="flex items-center gap-1 text-sm text-primary mt-1">
													<Building className="h-3 w-3" />
													{submission.productName}
													{submission.helpType && (
														<Badge
															variant="outline"
															className="ml-2 text-xs"
														>
															{
																helpTypeLabels[
																	submission.helpType
																]
															}
														</Badge>
													)}
												</div>
											)}
											{submission.type === "reseller_application" &&
												submission.productName && (
													<div className="flex items-center gap-1 text-sm text-purple-600 mt-1">
														<Building className="h-3 w-3" />
														<span className="font-medium">{submission.productName}</span>
														<Badge
															variant="outline"
															className="ml-2 text-xs bg-purple-50 text-purple-700 border-purple-200"
														>
															Reseller
														</Badge>
													</div>
												)}
											{submission.type === "training_inquiry" &&
												submission.trainingInterestType && (
													<div className="flex items-center gap-1 text-sm text-primary mt-1">
														<Badge
															variant="outline"
															className="text-xs"
														>
															{
																trainingInterestTypeLabels[
																	submission
																		.trainingInterestType
																]
															}
														</Badge>
													</div>
												)}
											{submission.type === "contact" &&
												submission.subject && (
													<div className="text-sm text-slate-600 mt-1 truncate max-w-xs">
														{submission.subject}
													</div>
												)}
											{submission.type === "callback_request" && (
												<div className="flex items-center gap-2 text-sm text-primary mt-1">
													<Calendar className="h-3 w-3" />
													{submission.preferredDate
														? new Date(submission.preferredDate).toLocaleDateString("sv-SE")
														: "No date"}
													<Clock className="h-3 w-3 ml-1" />
													{submission.preferredTime || "No time"}
												</div>
											)}
										</div>

										{/* Type Badge */}
										<div className="w-32 hidden md:block">
											<Badge
												variant="secondary"
												className={`text-xs ${
													submission.type === "reseller_application"
														? "bg-purple-100 text-purple-800 border-purple-200"
														: ""
												}`}
											>
												<MessageSquare className="h-3 w-3 mr-1" />
												{submission.type === "reseller_application"
													? "Reseller"
													: submission.type.replace("_", " ")}
											</Badge>
										</div>

										{/* Status Badge */}
										<div className="w-24 hidden lg:block">
											<Badge
												className={statusColors[submission.status]}
											>
												{submission.status}
											</Badge>
										</div>

										{/* Date */}
										<div className="text-sm text-slate-500 w-32 hidden lg:block">
											{new Date(
												submission.createdAt
											).toLocaleDateString("sv-SE")}
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
														href={`/dashboard/inquiries/${submission._id}`}
														className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
													>
														<Eye className="h-4 w-4" />
														View Details
													</Link>
													{submission.status !== "read" && (
														<button
															onClick={() =>
																handleStatusUpdate(
																	submission._id,
																	"read"
																)
															}
															className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
														>
															<CheckCircle className="h-4 w-4" />
															Mark as Read
														</button>
													)}
													{submission.status !== "archived" && (
														<button
															onClick={() =>
																handleStatusUpdate(
																	submission._id,
																	"archived"
																)
															}
															className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 w-full"
														>
															<Archive className="h-4 w-4" />
															Archive
														</button>
													)}
													<button
														onClick={() =>
															handleDelete(submission._id)
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
