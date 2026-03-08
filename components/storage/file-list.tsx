"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
	FileIcon,
	Trash2,
	ExternalLink,
	RefreshCw,
	Loader2,
	Copy,
	FileText,
	Calendar,
	AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";
import type { FileMetadata, StorageFolder } from "@/lib/storage/client";
import { STORAGE_API_ROUTES, formatFileSize } from "@/lib/storage/client";
import { ImageComponent } from "../common/image-component";
import { FileListSkeleton } from "../ui/skeletons";

interface FileListProps {
	/** Storage folder to display */
	folder: StorageFolder;
	/** Title for the list */
	title?: string;
	/** Description for the list */
	description?: string;
	/** Callback when a file is deleted */
	onDelete?: (filename: string) => void;
	/** Callback when a file is selected */
	onSelect?: (file: FileMetadata) => void;
	/** Additional class name */
	className?: string;
	/** Items per page */
	pageSize?: number;
	/** Enable file selection mode */
	selectable?: boolean;
}

interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasMore: boolean;
}

/**
 * Format date for display
 */
function formatDate(date: Date | string): string {
	const d = new Date(date);
	return d.toLocaleDateString("sv-SE", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

/**
 * Get MIME type display name
 */
function getMimeTypeDisplay(mimeType: string): string {
	const mimeMap: Record<string, string> = {
		"image/jpeg": "JPEG Image",
		"image/jpg": "JPEG Image",
		"image/png": "PNG Image",
		"image/webp": "WebP Image",
		"image/gif": "GIF Image",
		"image/svg+xml": "SVG Image",
		"application/pdf": "PDF Document",
		"application/msword": "Word Document",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
			"Word Document",
	};
	return mimeMap[mimeType] || mimeType;
}

/**
 * Get document icon based on MIME type
 */
function getDocumentIcon(mimeType: string) {
	if (mimeType === "application/pdf") {
		return <FileText className="h-12 w-12 text-red-500" />;
	}
	if (
		mimeType === "application/msword" ||
		mimeType ===
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	) {
		return <FileText className="h-12 w-12 text-blue-500" />;
	}
	return <FileIcon className="h-12 w-12 text-muted-foreground" />;
}

/**
 * Get document icon class based on MIME type
 */
function getDocumentIconClass(mimeType: string): string {
	if (mimeType === "application/pdf") {
		return "text-red-500";
	}
	if (
		mimeType === "application/msword" ||
		mimeType ===
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	) {
		return "text-blue-500";
	}
	return "text-muted-foreground";
}

export function FileList({
	folder,
	title,
	description,
	onDelete,
	onSelect,
	className,
	pageSize = 12,
	selectable = false,
}: FileListProps) {
	const [files, setFiles] = useState<FileMetadata[]>([]);
	const [meta, setMeta] = useState<PaginationMeta>({
		page: 1,
		limit: pageSize,
		total: 0,
		totalPages: 0,
		hasMore: false,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [deletingFile, setDeletingFile] = useState<string | null>(null);
	const [fileToDelete, setFileToDelete] = useState<FileMetadata | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const fetchFiles = useCallback(
		async (page: number = 1, append: boolean = false) => {
			if (append) {
				setIsLoadingMore(true);
			} else {
				setIsLoading(true);
			}

			try {
				const params = new URLSearchParams({
					folder,
					page: page.toString(),
					limit: pageSize.toString(),
				});

				const response = await fetch(
					`${STORAGE_API_ROUTES.LIST}?${params.toString()}`
				);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Failed to fetch files");
				}

				const newFiles = data.data || [];
				const responseMeta = data.meta || {
					page: 1,
					limit: pageSize,
					total: 0,
					totalPages: 0,
				};

				if (append) {
					// Append new files to existing ones
					setFiles((prev) => [...prev, ...newFiles]);
				} else {
					// Replace files (initial load or refresh)
					setFiles(newFiles);
				}

				setMeta({
					...responseMeta,
					hasMore: responseMeta.page < responseMeta.totalPages,
				});
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to load files"
				);
			} finally {
				setIsLoading(false);
				setIsLoadingMore(false);
			}
		},
		[folder, pageSize]
	);

	useEffect(() => {
		fetchFiles(1);
	}, [fetchFiles]);

	const openDeleteModal = useCallback((file: FileMetadata) => {
		setFileToDelete(file);
		setIsDeleteModalOpen(true);
	}, []);

	const closeDeleteModal = useCallback(() => {
		setIsDeleteModalOpen(false);
		setFileToDelete(null);
	}, []);

	const handleConfirmDelete = useCallback(async () => {
		if (!fileToDelete) return;

		const filename = fileToDelete.filename;
		setDeletingFile(filename);

		try {
			const response = await fetch(STORAGE_API_ROUTES.DELETE, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ filename, folder }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to delete file");
			}

			toast.success("File deleted successfully");
			onDelete?.(filename);
			closeDeleteModal();

			// Refresh the list
			fetchFiles(meta.page);
		} catch (error) {
			console.error("Delete error:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to delete file"
			);
		} finally {
			setDeletingFile(null);
		}
	}, [
		fileToDelete,
		folder,
		meta.page,
		fetchFiles,
		onDelete,
		closeDeleteModal,
	]);

	const handleCopyUrl = useCallback((url: string) => {
		const fullUrl = window.location.origin + url;
		navigator.clipboard.writeText(fullUrl);
		toast.success("URL copied to clipboard");
	}, []);

	const handleLoadMore = useCallback(() => {
		if (meta.hasMore && !isLoadingMore) {
			fetchFiles(meta.page + 1, true);
		}
	}, [meta.hasMore, meta.page, isLoadingMore, fetchFiles]);

	const isImage = (mimeType: string) => mimeType.startsWith("image/");

	return (
		<>
			<Card className={cn("w-full", className)}>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<div>
						<CardTitle>{title || `${folder} Files`}</CardTitle>
						{description && (
							<CardDescription className="mt-1">
								{description}
							</CardDescription>
						)}
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => fetchFiles(meta.page)}
						disabled={isLoading}
					>
						<RefreshCw
							className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
						/>
						Refresh
					</Button>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<FileListSkeleton count={pageSize} />
					) : files.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
							<FileIcon className="h-12 w-12 mb-4" />
							<p>No files found</p>
						</div>
					) : (
						<>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{files.map((file) => (
									<div
										key={file.filename}
										className={cn(
											"relative rounded-lg border border-border bg-muted/30 overflow-hidden transition-colors",
											selectable &&
												"cursor-pointer hover:border-primary",
											deletingFile === file.filename && "opacity-50"
										)}
										onClick={() => selectable && onSelect?.(file)}
									>
										{/* Preview */}
										<div className="aspect-square w-full overflow-hidden bg-muted relative">
											{isImage(file.mimeType) ? (
												<ImageComponent
													src={file.url}
													alt={file.filename}
													className="h-full w-full object-cover"
													height={"200"}
													width={"200"}
												/>
											) : (
												<div className="flex h-full w-full items-center justify-center bg-slate-100">
													{getDocumentIcon(file.mimeType)}
												</div>
											)}

											{/* Action buttons - always visible in top right */}
											<div className="absolute top-2 right-2 flex flex-col gap-1">
												<Button
													variant="secondary"
													size="icon"
													className="h-7 w-7 bg-white/90 hover:bg-white shadow-sm"
													onClick={(e) => {
														e.stopPropagation();
														handleCopyUrl(file.url);
													}}
													title="Copy URL"
												>
													<Copy className="h-3.5 w-3.5 text-black" />
												</Button>
												<Button
													variant="secondary"
													size="icon"
													className="h-7 w-7 bg-white/90 hover:bg-white shadow-sm"
													asChild
												>
													<a
														href={file.url}
														target="_blank"
														rel="noopener noreferrer"
														onClick={(e) => e.stopPropagation()}
														title="Open in new tab"
													>
														<ExternalLink className="h-3.5 w-3.5 text-black" />
													</a>
												</Button>
												<Button
													variant="secondary"
													size="icon"
													className="h-7 w-7 bg-white/90 hover:bg-destructive hover:text-destructive-foreground shadow-sm text-red-500"
													onClick={(e) => {
														e.stopPropagation();
														openDeleteModal(file);
													}}
													disabled={deletingFile === file.filename}
													title="Delete file"
												>
													{deletingFile === file.filename ? (
														<Loader2 className="h-3.5 w-3.5 animate-spin" />
													) : (
														<Trash2 className="h-3.5 w-3.5" />
													)}
												</Button>
											</div>
										</div>

										{/* Info */}
										<div className="p-3 space-y-1.5">
											<p
												className="text-sm font-medium truncate"
												title={file.filename}
											>
												{file.filename}
											</p>
											<div className="flex items-center justify-between text-xs text-muted-foreground">
												<span>{formatFileSize(file.size)}</span>
												<span className="flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													{formatDate(file.createdAt)}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>

							{/* Load More */}
							{meta.hasMore && (
								<div className="flex flex-col items-center gap-2 mt-6 pt-4 border-t">
									<Button
										variant="outline"
										onClick={handleLoadMore}
										disabled={isLoadingMore}
										className="min-w-[140px]"
									>
										{isLoadingMore ? (
											<>
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												Loading...
											</>
										) : (
											"Load More"
										)}
									</Button>
									<span className="text-xs text-muted-foreground">
										Showing {files.length} of {meta.total} files
									</span>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Delete Confirmation Modal */}
			<Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-destructive">
							<AlertTriangle className="h-5 w-5" />
							Delete File
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this file? This action
							cannot be undone.
						</DialogDescription>
					</DialogHeader>

					{fileToDelete && (
						<div className="space-y-4">
							{/* File Preview */}
							<div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border">
								{/* Thumbnail */}
								<div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-white border">
									{isImage(fileToDelete.mimeType) ? (
										<ImageComponent
											src={fileToDelete.url}
											alt={fileToDelete.filename}
											className="w-full h-full object-cover"
											width="80"
											height="80"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-slate-100">
											<FileText
												className={cn(
													"h-8 w-8",
													getDocumentIconClass(
														fileToDelete.mimeType
													)
												)}
											/>
										</div>
									)}
								</div>

								{/* File Info */}
								<div className="flex-1 min-w-0 space-y-2">
									<p
										className="font-medium text-sm break-all"
										title={fileToDelete.filename}
									>
										{fileToDelete.filename}
									</p>
									<div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
										<div>
											<span className="block text-[10px] uppercase tracking-wide">
												Size
											</span>
											<span className="font-medium text-foreground">
												{formatFileSize(fileToDelete.size)}
											</span>
										</div>
										<div>
											<span className="block text-[10px] uppercase tracking-wide">
												Type
											</span>
											<span className="font-medium text-foreground">
												{getMimeTypeDisplay(fileToDelete.mimeType)}
											</span>
										</div>
										<div>
											<span className="block text-[10px] uppercase tracking-wide">
												Folder
											</span>
											<span className="font-medium text-foreground capitalize">
												{fileToDelete.folder}
											</span>
										</div>
										{fileToDelete.createdAt && (
											<div>
												<span className="block text-[10px] uppercase tracking-wide">
													Uploaded
												</span>
												<span className="font-medium text-foreground">
													{formatDate(fileToDelete.createdAt)}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Warning */}
							<div className="flex items-start gap-2 p-3 bg-red-50 text-red-800 rounded-md text-sm">
								<AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
								<p>
									This file will be permanently deleted from the
									server. Any references to this file will become
									broken.
								</p>
							</div>
						</div>
					)}

					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="outline"
							onClick={closeDeleteModal}
							disabled={deletingFile !== null}
						>
							Cancel
						</Button>
						<Button
							variant="primary"
							className="bg-red-600 hover:bg-red-700 text-white"
							onClick={handleConfirmDelete}
							disabled={deletingFile !== null}
						>
							{deletingFile !== null ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Deleting...
								</>
							) : (
								<>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete File
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
