"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { toast } from "sonner";
import {
	FileIcon,
	ImageIcon,
	Upload,
	ExternalLink,
	RefreshCw,
	Loader2,
	Check,
	Copy,
	FileText,
	X,
	Info,
	Search,
	Calendar,
	Eye,
	Grid3X3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type {
	FileMetadata,
	StorageFolder,
	StorageFile,
} from "@/lib/storage/client";
import {
	STORAGE_API_ROUTES,
	formatFileSize,
	ALLOWED_IMAGE_TYPES,
	ALLOWED_DOCUMENT_TYPES,
	FILE_SIZE_LIMITS,
} from "@/lib/storage/client";
import { ImageComponent } from "../common/image-component";
import Link from "next/link";

export type MediaType = "image" | "document";

interface MediaGalleryProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	type: MediaType;
	onSelect?: (file: FileMetadata) => void;
	onMultiSelect?: (files: FileMetadata[]) => void;
	multiSelect?: boolean;
	selectedUrl?: string | null;
	selectedUrls?: string[];
	title?: string;
	pageSize?: number;
}

interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasMore: boolean;
}

function getFileExtension(filename: string): string {
	const ext = filename.split(".").pop()?.toUpperCase() || "";
	return ext;
}

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

// File Info Popover Component
function FileInfoPopover({
	file,
	isImage,
	onCopyUrl,
}: {
	file: FileMetadata;
	isImage: boolean;
	onCopyUrl: (url: string, e: React.MouseEvent) => void;
}) {
	return (
		<PopoverContent className="w-72 p-0" align="start" side="left">
			<div className="p-4 space-y-3">
				{/* Preview */}
				<div className="aspect-video rounded-md overflow-hidden bg-slate-100 border">
					{isImage ? (
						<ImageComponent
							src={file.url}
							alt={file.filename}
							className="w-full h-full object-contain"
							width="256"
							height="144"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center">
							<FileText
								className={cn(
									"h-12 w-12",
									getDocumentIconClass(file.mimeType)
								)}
							/>
						</div>
					)}
				</div>

				{/* Info */}
				<div className="space-y-2 text-sm">
					<div>
						<p className="text-xs text-muted-foreground uppercase tracking-wide">
							Filename
						</p>
						<p className="font-medium break-all text-xs">
							{file.filename}
						</p>
					</div>

					<div className="grid grid-cols-2 gap-2">
						<div>
							<p className="text-xs text-muted-foreground uppercase tracking-wide">
								Size
							</p>
							<p className="font-medium text-xs">
								{formatFileSize(file.size)}
							</p>
						</div>
						<div>
							<p className="text-xs text-muted-foreground uppercase tracking-wide">
								Type
							</p>
							<p className="font-medium text-xs">
								{getFileExtension(file.filename)}
							</p>
						</div>
					</div>

					<div>
						<p className="text-xs text-muted-foreground uppercase tracking-wide">
							Format
						</p>
						<p className="font-medium text-xs">
							{getMimeTypeDisplay(file.mimeType)}
						</p>
					</div>

					{file.createdAt && (
						<div>
							<p className="text-xs text-muted-foreground uppercase tracking-wide">
								Uploaded
							</p>
							<p className="font-medium text-xs">
								{new Date(file.createdAt).toLocaleDateString("sv-SE", {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</p>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="flex gap-2 pt-2 border-t">
					<Button
						variant="outline"
						size="sm"
						className="flex-1 text-xs"
						onClick={(e) => onCopyUrl(file.url, e)}
					>
						<Copy className="h-3 w-3 mr-1" />
						Copy URL
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="flex-1 text-xs"
						asChild
					>
						<Link
							href={file.url}
							target="_blank"
							rel="noopener noreferrer"
						>
							<ExternalLink className="h-3 w-3 mr-1" />
							Open
						</Link>
					</Button>
				</div>
			</div>
		</PopoverContent>
	);
}

export function MediaGallery({
	open,
	onOpenChange,
	type,
	onSelect,
	onMultiSelect,
	multiSelect = false,
	selectedUrl,
	selectedUrls = [],
	title,
	pageSize = 32,
}: MediaGalleryProps) {
	const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
	const [files, setFiles] = useState<FileMetadata[]>([]);
	const [meta, setMeta] = useState<PaginationMeta>({
		page: 1,
		limit: pageSize,
		total: 0,
		totalPages: 0,
		hasMore: false,
	});
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);
	const [selectedFiles, setSelectedFiles] = useState<FileMetadata[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [previewDrawerOpen, setPreviewDrawerOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Search state
	const [searchQuery, setSearchQuery] = useState("");
	const [dateFilter, setDateFilter] = useState<string>("");

	const folder: StorageFolder = type === "image" ? "images" : "documents";
	const acceptedTypes =
		type === "image"
			? ALLOWED_IMAGE_TYPES.join(",")
			: ALLOWED_DOCUMENT_TYPES.join(",");
	const maxFileSize =
		type === "image" ? FILE_SIZE_LIMITS.IMAGE : FILE_SIZE_LIMITS.DOCUMENT;

	// Filter files based on search and date
	const filteredFiles = useMemo(() => {
		let result = files;

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter((file) =>
				file.filename.toLowerCase().includes(query)
			);
		}

		// Filter by date
		if (dateFilter) {
			const filterDate = new Date(dateFilter);
			filterDate.setHours(0, 0, 0, 0);
			result = result.filter((file) => {
				if (!file.createdAt) return false;
				const fileDate = new Date(file.createdAt);
				fileDate.setHours(0, 0, 0, 0);
				return fileDate.getTime() === filterDate.getTime();
			});
		}

		return result;
	}, [files, searchQuery, dateFilter]);

	// Fetch files - supports both initial load and load more
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
					setFiles((prev) => [...prev, ...newFiles]);
				} else {
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

	// Only fetch files when dialog opens (not on tab change to preserve selections)
	useEffect(() => {
		if (open) {
			fetchFiles(1);
			// Reset selections only when dialog opens
			setSelectedFile(null);
			setSelectedFiles([]);
			setSearchQuery("");
			setDateFilter("");
		}
	}, [open, fetchFiles]);

	// Check if a file is selected (multi-select mode)
	const isFileSelected = useCallback(
		(file: FileMetadata): boolean => {
			return selectedFiles.some((f) => f.url === file.url);
		},
		[selectedFiles]
	);

	// Check if file is already in the parent's selection
	const isAlreadySelected = useCallback(
		(file: FileMetadata): boolean => {
			if (multiSelect) {
				return selectedUrls.includes(file.url);
			}
			return selectedUrl === file.url;
		},
		[multiSelect, selectedUrls, selectedUrl]
	);

	// Handle file click
	const handleFileClick = useCallback(
		(file: FileMetadata) => {
			if (multiSelect) {
				setSelectedFiles((prev) => {
					const isSelected = prev.some((f) => f.url === file.url);
					if (isSelected) {
						return prev.filter((f) => f.url !== file.url);
					} else {
						return [...prev, file];
					}
				});
			} else {
				setSelectedFile(file);
			}
		},
		[multiSelect]
	);

	// Confirm selection
	const handleConfirmSelect = useCallback(() => {
		if (multiSelect) {
			if (selectedFiles.length > 0 && onMultiSelect) {
				onMultiSelect(selectedFiles);
				onOpenChange(false);
			}
		} else {
			if (selectedFile && onSelect) {
				onSelect(selectedFile);
				onOpenChange(false);
			}
		}
	}, [
		multiSelect,
		selectedFiles,
		selectedFile,
		onMultiSelect,
		onSelect,
		onOpenChange,
	]);

	// Clear all selections
	const handleClearSelection = useCallback(() => {
		setSelectedFiles([]);
		setSelectedFile(null);
	}, []);

	// Remove a single file from selection
	const handleRemoveFromSelection = useCallback((file: FileMetadata) => {
		setSelectedFiles((prev) => prev.filter((f) => f.url !== file.url));
	}, []);

	// Copy URL
	const handleCopyUrl = useCallback((url: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const fullUrl = window.location.origin + url;
		navigator.clipboard.writeText(fullUrl);
		toast.success("URL copied");
	}, []);

	// Load more files
	const handleLoadMore = useCallback(() => {
		if (meta.hasMore && !isLoadingMore) {
			fetchFiles(meta.page + 1, true);
		}
	}, [meta.hasMore, meta.page, isLoadingMore, fetchFiles]);

	// Handle refresh - preserve selections
	const handleRefresh = useCallback(() => {
		fetchFiles(1);
	}, [fetchFiles]);

	// Clear search/filters
	const handleClearFilters = useCallback(() => {
		setSearchQuery("");
		setDateFilter("");
	}, []);

	// Upload a single file
	const uploadSingleFile = useCallback(
		async (file: File): Promise<FileMetadata | null> => {
			const isCorrectType =
				type === "image"
					? file.type.startsWith("image/")
					: file.type.startsWith("application/");

			if (!isCorrectType) {
				toast.error(
					type === "image"
						? "Please select an image file"
						: "Please select a document file"
				);
				return null;
			}

			if (file.size > maxFileSize) {
				const maxMB = Math.round(maxFileSize / (1024 * 1024));
				toast.error(`File size exceeds ${maxMB}MB limit`);
				return null;
			}

			const formData = new FormData();
			formData.append("file", file);
			formData.append("folder", folder);

			try {
				const response = await fetch(STORAGE_API_ROUTES.UPLOAD, {
					method: "POST",
					body: formData,
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Upload failed");
				}

				const uploadedFile = data.data as StorageFile;
				return {
					filename: uploadedFile.filename,
					mimeType: uploadedFile.mimeType,
					size: uploadedFile.size,
					folder: uploadedFile.folder,
					url: uploadedFile.url,
					modifiedAt: uploadedFile.createdAt,
					createdAt: uploadedFile.createdAt,
				};
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Upload failed"
				);
				return null;
			}
		},
		[type, maxFileSize, folder]
	);

	// Handle file input change
	const handleFileInputChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const inputFiles = e.target.files;
			if (!inputFiles || inputFiles.length === 0) return;

			setIsUploading(true);

			const filesToUpload = Array.from(inputFiles);
			const uploadedFiles: FileMetadata[] = [];

			for (const file of filesToUpload) {
				const result = await uploadSingleFile(file);
				if (result) {
					uploadedFiles.push(result);
				}
			}

			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}

			setIsUploading(false);

			if (uploadedFiles.length === 0) return;

			toast.success(
				uploadedFiles.length === 1
					? "File uploaded"
					: `${uploadedFiles.length} files uploaded`
			);

			setActiveTab("library");

			// Fetch fresh files
			const params = new URLSearchParams({
				folder,
				page: "1",
				limit: pageSize.toString(),
			});

			try {
				const response = await fetch(
					`${STORAGE_API_ROUTES.LIST}?${params.toString()}`
				);
				const data = await response.json();

				if (response.ok) {
					const newFiles = data.data || [];
					const responseMeta = data.meta || {
						page: 1,
						limit: pageSize,
						total: 0,
						totalPages: 0,
					};

					setFiles(newFiles);
					setMeta({
						...responseMeta,
						hasMore: responseMeta.page < responseMeta.totalPages,
					});
				}
			} catch {
				await fetchFiles(1);
			}

			// Select uploaded files
			if (multiSelect) {
				setSelectedFiles((prev) => [...prev, ...uploadedFiles]);
			} else {
				setSelectedFile(uploadedFiles[0]);
			}
		},
		[uploadSingleFile, multiSelect, folder, pageSize, fetchFiles]
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		async (e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			const droppedFiles = e.dataTransfer.files;
			if (!droppedFiles || droppedFiles.length === 0) return;

			setIsUploading(true);

			const filesToUpload = multiSelect
				? Array.from(droppedFiles)
				: [droppedFiles[0]];
			const uploadedFiles: FileMetadata[] = [];

			for (const file of filesToUpload) {
				const result = await uploadSingleFile(file);
				if (result) {
					uploadedFiles.push(result);
				}
			}

			setIsUploading(false);

			if (uploadedFiles.length === 0) return;

			toast.success(
				uploadedFiles.length === 1
					? "File uploaded"
					: `${uploadedFiles.length} files uploaded`
			);

			setActiveTab("library");

			const params = new URLSearchParams({
				folder,
				page: "1",
				limit: pageSize.toString(),
			});

			try {
				const response = await fetch(
					`${STORAGE_API_ROUTES.LIST}?${params.toString()}`
				);
				const data = await response.json();

				if (response.ok) {
					const newFiles = data.data || [];
					const responseMeta = data.meta || {
						page: 1,
						limit: pageSize,
						total: 0,
						totalPages: 0,
					};

					setFiles(newFiles);
					setMeta({
						...responseMeta,
						hasMore: responseMeta.page < responseMeta.totalPages,
					});
				}
			} catch {
				await fetchFiles(1);
			}

			if (multiSelect) {
				setSelectedFiles((prev) => [...prev, ...uploadedFiles]);
			} else {
				setSelectedFile(uploadedFiles[0]);
			}
		},
		[uploadSingleFile, multiSelect, folder, pageSize, fetchFiles]
	);

	const isImage = type === "image";
	const defaultTitle = multiSelect
		? isImage
			? "Select Images"
			: "Select Documents"
		: isImage
		? "Select Image"
		: "Select Document";
	const dialogTitle = title || defaultTitle;

	const selectionCount = multiSelect
		? selectedFiles.length
		: selectedFile
		? 1
		: 0;

	const hasActiveFilters = searchQuery.trim() || dateFilter;

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							{isImage ? (
								<ImageIcon className="h-5 w-5" />
							) : (
								<FileText className="h-5 w-5" />
							)}
							{dialogTitle}
						</DialogTitle>
						<DialogDescription>
							{multiSelect
								? `Choose ${
										isImage ? "images" : "documents"
								  } from the library or upload new ones. Click to select/deselect.`
								: isImage
								? "Choose an existing image or upload a new one"
								: "Choose an existing document or upload a new one"}
						</DialogDescription>
					</DialogHeader>

					<Tabs
						value={activeTab}
						onValueChange={(v) => setActiveTab(v as "library" | "upload")}
						className="flex-1 flex flex-col min-h-0"
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="library">Media Library</TabsTrigger>
							<TabsTrigger value="upload">Upload New</TabsTrigger>
						</TabsList>

						{/* Library Tab */}
						<TabsContent
							value="library"
							className="flex-1 flex flex-col min-h-0 mt-4"
						>
							{/* Search and Filter Bar */}
							<div className="flex flex-col sm:flex-row gap-3 mb-4">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder={`Search ${
											isImage ? "images" : "documents"
										}...`}
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-9 h-9"
									/>
									{searchQuery && (
										<button
											type="button"
											onClick={() => setSearchQuery("")}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
										>
											<X className="h-4 w-4" />
										</button>
									)}
								</div>

								<div className="flex gap-2">
									<div className="relative">
										<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
										<input
											type="date"
											value={dateFilter}
											onChange={(e) => setDateFilter(e.target.value)}
											className="h-9 w-40 pl-9 pr-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
										/>
									</div>

									{hasActiveFilters && (
										<Button
											variant="ghost"
											size="sm"
											onClick={handleClearFilters}
											className="h-9 px-3 text-xs"
										>
											Clear
										</Button>
									)}

									<Button
										variant="outline"
										size="icon"
										onClick={handleRefresh}
										disabled={isLoading}
										className="h-9 w-9"
									>
										<RefreshCw
											className={cn(
												"h-4 w-4",
												isLoading && "animate-spin"
											)}
										/>
									</Button>
								</div>
							</div>

							{/* Stats Bar */}
							<div className="flex items-center justify-between mb-3">
								<p className="text-sm text-muted-foreground">
									{hasActiveFilters ? (
										<>
											{filteredFiles.length} of {meta.total}{" "}
											{isImage ? "images" : "documents"}
										</>
									) : (
										<>
											{meta.total} {isImage ? "images" : "documents"}{" "}
											in library
										</>
									)}
									{multiSelect && selectedFiles.length > 0 && (
										<span className="ml-2 text-primary font-medium">
											• {selectedFiles.length} selected
										</span>
									)}
								</p>

								{/* Preview Selected Button */}
								{multiSelect && selectedFiles.length > 0 && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => setPreviewDrawerOpen(true)}
										className="h-8 text-xs gap-1.5"
									>
										<Eye className="h-3.5 w-3.5" />
										Preview ({selectedFiles.length})
									</Button>
								)}
							</div>

							{/* File Grid */}
							<div className="flex-1 overflow-auto min-h-[300px]">
								{isLoading ? (
									<div className="flex items-center justify-center h-full">
										<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
									</div>
								) : filteredFiles.length === 0 ? (
									<div className="flex flex-col items-center justify-center h-full text-muted-foreground">
										{hasActiveFilters ? (
											<>
												<Search className="h-12 w-12 mb-4 opacity-50" />
												<p>No files match your search</p>
												<Button
													variant="ghost"
													className="mt-2 text-primary"
													onClick={handleClearFilters}
												>
													Clear filters
												</Button>
											</>
										) : (
											<>
												{isImage ? (
													<ImageIcon className="h-12 w-12 mb-4" />
												) : (
													<FileIcon className="h-12 w-12 mb-4" />
												)}
												<p>No files found</p>
												<Button
													variant="ghost"
													className="mt-2 text-primary underline-offset-4 hover:underline"
													onClick={() => setActiveTab("upload")}
												>
													Upload your first{" "}
													{isImage ? "image" : "document"}
												</Button>
											</>
										)}
									</div>
								) : (
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
										{filteredFiles.map((file) => {
											const isSelected = multiSelect
												? isFileSelected(file)
												: selectedFile?.filename === file.filename;
											const isCurrentlyInParent =
												isAlreadySelected(file);

											return (
												<div
													key={file.filename}
													onClick={() => handleFileClick(file)}
													className={cn(
														"group relative aspect-square rounded-md overflow-hidden cursor-pointer transition-all",
														isSelected
															? "ring-2 ring-primary ring-offset-2"
															: "hover:ring-1 hover:ring-primary/30",
														isCurrentlyInParent &&
															!isSelected &&
															"ring-1 ring-green-500/50",
														!isSelected && "bg-black/5"
													)}
												>
													{/* Preview */}
													<div className="absolute inset-0">
														{isImage ? (
															<ImageComponent
																src={file.url}
																alt={file.filename}
																className={cn(
																	"h-full w-full object-cover transition-opacity",
																	!isSelected && "opacity-90"
																)}
																height={"150"}
																width={"150"}
															/>
														) : (
															<div className="flex h-full w-full items-center justify-center bg-slate-100">
																<FileText
																	className={cn(
																		"h-10 w-10",
																		getDocumentIconClass(
																			file.mimeType
																		)
																	)}
																/>
															</div>
														)}
													</div>

													{/* Selection checkbox indicator */}
													{multiSelect && (
														<div
															className={cn(
																"absolute top-2 left-2 w-5 h-5 rounded flex items-center justify-center transition-all",
																isSelected
																	? "bg-primary border-2 border-primary text-primary-foreground"
																	: "bg-white/90 border-2 border-slate-300"
															)}
														>
															{isSelected && (
																<Check className="h-3 w-3" />
															)}
														</div>
													)}

													{/* Single select indicator */}
													{!multiSelect && isSelected && (
														<div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
															<Check className="h-3 w-3" />
														</div>
													)}

													{/* Current selection badge */}
													{isCurrentlyInParent && !isSelected && (
														<div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
															Added
														</div>
													)}

													{/* Action buttons */}
													{!isCurrentlyInParent && (
														<div className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
															<Button
																variant="secondary"
																size="icon"
																className="h-6 w-6 bg-white/95 hover:bg-white shadow-sm"
																onClick={(e) =>
																	handleCopyUrl(file.url, e)
																}
																title="Copy URL"
															>
																<Copy className="h-3 w-3 text-black" />
															</Button>
															<Button
																variant="secondary"
																size="icon"
																className="h-6 w-6 bg-white/95 hover:bg-white shadow-sm"
																asChild
															>
																<Link
																	href={file.url}
																	target="_blank"
																	rel="noopener noreferrer"
																	onClick={(e) =>
																		e.stopPropagation()
																	}
																	title="Open in new tab"
																>
																	<ExternalLink className="h-3 w-3 text-black" />
																</Link>
															</Button>
															<Popover>
																<PopoverTrigger asChild>
																	<Button
																		variant="secondary"
																		size="icon"
																		className="h-6 w-6 bg-white/95 hover:bg-white shadow-sm"
																		onClick={(e) =>
																			e.stopPropagation()
																		}
																		title="File info"
																	>
																		<Info className="h-3 w-3 text-black" />
																	</Button>
																</PopoverTrigger>
																<FileInfoPopover
																	file={file}
																	isImage={isImage}
																	onCopyUrl={handleCopyUrl}
																/>
															</Popover>
														</div>
													)}

													{/* File info overlay */}
													<div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2 pt-6">
														<div className="text-white">
															<p className="text-xs font-medium truncate">
																{file.filename}
															</p>
															<p className="text-[10px] opacity-80">
																{formatFileSize(file.size)}
															</p>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								)}
							</div>
						</TabsContent>

						{/* Upload Tab */}
						<TabsContent value="upload" className="flex-1 mt-4">
							<input
								ref={fileInputRef}
								type="file"
								accept={acceptedTypes}
								onChange={handleFileInputChange}
								className="hidden"
								disabled={isUploading}
								multiple={multiSelect}
							/>

							<div
								onClick={() => fileInputRef.current?.click()}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								className={cn(
									"flex flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed p-12 transition-colors cursor-pointer min-h-[300px]",
									isDragging
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/50",
									isUploading && "pointer-events-none opacity-50"
								)}
							>
								{isUploading ? (
									<>
										<Loader2 className="h-12 w-12 animate-spin text-primary" />
										<p className="text-sm text-muted-foreground">
											Uploading...
										</p>
									</>
								) : (
									<>
										<div className="rounded-full bg-muted p-4">
											<Upload className="h-8 w-8 text-muted-foreground" />
										</div>
										<div className="text-center">
											<p className="text-lg font-medium">
												Drop{" "}
												{isImage
													? multiSelect
														? "images"
														: "image"
													: multiSelect
													? "documents"
													: "document"}{" "}
												here or click to browse
											</p>
											<p className="text-sm text-muted-foreground mt-2">
												{isImage
													? "Supports JPG, PNG, WebP, GIF (max 5MB)"
													: "Supports PDF, DOC, DOCX (max 20MB)"}
											</p>
											{multiSelect && (
												<p className="text-xs text-muted-foreground mt-1">
													You can select multiple files
												</p>
											)}
										</div>
									</>
								)}
							</div>

							{/* Show selected files count in upload tab */}
							{multiSelect && selectedFiles.length > 0 && (
								<div className="mt-4 p-3 bg-slate-50 rounded-md flex items-center justify-between">
									<div className="flex items-center gap-2 text-sm">
										<Grid3X3 className="h-4 w-4 text-primary" />
										<span className="font-medium">
											{selectedFiles.length} files selected
										</span>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setPreviewDrawerOpen(true)}
										className="text-xs"
									>
										Preview Selection
									</Button>
								</div>
							)}
						</TabsContent>
					</Tabs>

					{/* Footer */}
					<DialogFooter className="border-t pt-3 mt-3">
						<div className="flex items-center justify-between w-full gap-4">
							{/* Left side - Stats, Load More, and selection info */}
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="text-xs">
									{files.length}/{meta.total}
								</span>
								{meta.hasMore &&
									activeTab === "library" &&
									!hasActiveFilters && (
										<Button
											variant="outline"
											size="sm"
											onClick={handleLoadMore}
											disabled={isLoadingMore}
											className="h-7 px-2 text-xs text-primary hover:text-primary border-1"
										>
											{isLoadingMore ? (
												<Loader2 className="h-3 w-3 animate-spin" />
											) : (
												"Load more"
											)}
										</Button>
									)}
								{multiSelect && selectedFiles.length > 0 && (
									<>
										<span className="text-slate-300">|</span>
										<button
											type="button"
											onClick={() => setPreviewDrawerOpen(true)}
											className="text-primary hover:underline font-medium text-xs"
										>
											{selectedFiles.length} selected
										</button>
										<button
											type="button"
											onClick={handleClearSelection}
											className="text-red-500 hover:text-red-600 text-xs"
										>
											Clear
										</button>
									</>
								)}
								{!multiSelect && selectedFile && (
									<>
										<span className="text-slate-300">|</span>
										<span className="text-primary font-medium truncate max-w-[120px] text-xs">
											{selectedFile.filename}
										</span>
									</>
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex gap-2 shrink-0">
								<Button
									variant="outline"
									size="sm"
									onClick={() => onOpenChange(false)}
								>
									Cancel
								</Button>
								<Button
									size="sm"
									onClick={handleConfirmSelect}
									disabled={selectionCount === 0}
								>
									{multiSelect
										? `Select (${selectionCount})`
										: "Select"}
								</Button>
							</div>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Preview Drawer for Selected Images */}
			<Drawer
				open={previewDrawerOpen}
				onOpenChange={setPreviewDrawerOpen}
				direction="bottom"
			>
				<DrawerContent className="max-h-[85vh]">
					<DrawerHeader className="border-b">
						<div className="flex items-center justify-between">
							<div>
								<DrawerTitle className="flex items-center gap-2">
									<Eye className="h-5 w-5" />
									Selected {isImage ? "Images" : "Documents"} (
									{selectedFiles.length})
								</DrawerTitle>
								<DrawerDescription>
									Review your selection before confirming
								</DrawerDescription>
							</div>
							<DrawerClose asChild>
								<Button variant="ghost" size="icon">
									<X className="h-5 w-5" />
								</Button>
							</DrawerClose>
						</div>
					</DrawerHeader>

					<div className="p-4 overflow-auto">
						{selectedFiles.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
								<ImageIcon className="h-12 w-12 mb-4 opacity-50" />
								<p>No files selected</p>
							</div>
						) : (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
								{selectedFiles.map((file) => (
									<div
										key={file.url}
										className="group relative aspect-square rounded-md overflow-hidden border bg-slate-50"
									>
										{isImage ? (
											<ImageComponent
												src={file.url}
												alt={file.filename}
												className="h-full w-full object-cover"
												height="200"
												width="200"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center">
												<FileText
													className={cn(
														"h-12 w-12",
														getDocumentIconClass(file.mimeType)
													)}
												/>
											</div>
										)}

										{/* Remove button */}
										<button
											type="button"
											onClick={() => handleRemoveFromSelection(file)}
											className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
											title="Remove from selection"
										>
											<X className="h-4 w-4" />
										</button>

										{/* File info overlay */}
										<div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2 pt-4">
											<p className="text-white text-xs font-medium truncate">
												{file.filename}
											</p>
											<p className="text-white/70 text-[10px]">
												{formatFileSize(file.size)}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="p-4 border-t bg-slate-50 flex items-center justify-between gap-4">
						<Button
							variant="outline"
							onClick={handleClearSelection}
							className="text-red-600 hover:text-red-700 hover:bg-red-50"
						>
							Clear All
						</Button>
						<div className="flex gap-2">
							<DrawerClose asChild>
								<Button variant="outline">Back to Gallery</Button>
							</DrawerClose>
							<Button
								onClick={() => {
									setPreviewDrawerOpen(false);
									handleConfirmSelect();
								}}
								disabled={selectedFiles.length === 0}
							>
								Confirm Selection ({selectedFiles.length})
							</Button>
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}
