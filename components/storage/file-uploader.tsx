"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
	Upload,
	X,
	FileIcon,
	ImageIcon,
	Loader2,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { StorageFile, StorageFolder } from "@/lib/storage/client";
import {
	ALLOWED_IMAGE_TYPES,
	ALLOWED_DOCUMENT_TYPES,
	FILE_SIZE_LIMITS,
	STORAGE_API_ROUTES,
} from "@/lib/storage/client";
import { ImageComponent } from "../common/image-component";
import { Progress } from "../ui/progress";

/** Track individual file upload status */
interface FileUploadStatus {
	id: string;
	file: File;
	status: "pending" | "uploading" | "success" | "error";
	progress: number;
	preview?: string;
	error?: string;
	result?: StorageFile;
}

interface FileUploaderProps {
	/** Target folder (images or documents) */
	folder?: StorageFolder;
	/** Callback when file is uploaded successfully */
	onUpload?: (file: StorageFile) => void;
	/** Callback when all files finish uploading (success or error) */
	onUploadComplete?: (results: { success: StorageFile[]; failed: string[] }) => void;
	/** Callback when upload fails */
	onError?: (error: string) => void;
	/** Whether to allow multiple files */
	multiple?: boolean;
	/** Custom accepted file types */
	accept?: string;
	/** Additional class name */
	className?: string;
	/** Disable the uploader */
	disabled?: boolean;
	/** Maximum number of concurrent uploads (default: 3) */
	maxConcurrent?: number;
}

export function FileUploader({
	folder,
	onUpload,
	onUploadComplete,
	onError,
	multiple = false,
	accept,
	className,
	disabled = false,
	maxConcurrent = 3,
}: FileUploaderProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [uploadQueue, setUploadQueue] = useState<FileUploadStatus[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

	// Determine accepted types based on folder
	const acceptedTypes = accept
		? accept
		: folder === "images"
			? ALLOWED_IMAGE_TYPES.join(",")
			: folder === "documents"
				? ALLOWED_DOCUMENT_TYPES.join(",")
				: [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES].join(",");

	const isUploading = uploadQueue.some(
		(item) => item.status === "uploading" || item.status === "pending"
	);

	/** Generate unique ID for each upload */
	const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

	/** Validate a single file */
	const validateFile = useCallback(
		(file: File): string | null => {
			const isImage = file.type.startsWith("image/") || file.type === "image/svg+xml";
			const isDocument =
				file.type === "application/pdf" ||
				file.type === "application/msword" ||
				file.type ===
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document";

			// Check if file type is allowed based on folder
			if (folder === "images" && !isImage) {
				return `${file.name}: Only image files are allowed`;
			}
			if (folder === "documents" && !isDocument) {
				return `${file.name}: Only document files are allowed`;
			}
			if (!isImage && !isDocument) {
				return `${file.name}: Unsupported file type`;
			}

			// Check file size
			const maxSize = isImage ? FILE_SIZE_LIMITS.IMAGE : FILE_SIZE_LIMITS.DOCUMENT;
			if (file.size > maxSize) {
				const maxMB = Math.round(maxSize / (1024 * 1024));
				return `${file.name}: File size exceeds ${maxMB}MB limit`;
			}

			return null;
		},
		[folder]
	);

	/** Upload a single file */
	const uploadFile = useCallback(
		async (uploadItem: FileUploadStatus): Promise<FileUploadStatus> => {
			const abortController = new AbortController();
			abortControllersRef.current.set(uploadItem.id, abortController);

			const formData = new FormData();
			formData.append("file", uploadItem.file);
			if (folder) {
				formData.append("folder", folder);
			}

			try {
				const response = await fetch(STORAGE_API_ROUTES.UPLOAD, {
					method: "POST",
					body: formData,
					signal: abortController.signal,
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.message || "Upload failed");
				}

				return {
					...uploadItem,
					status: "success",
					progress: 100,
					result: data.data,
				};
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError") {
					return {
						...uploadItem,
						status: "error",
						progress: 0,
						error: "Upload cancelled",
					};
				}
				const errorMsg = error instanceof Error ? error.message : "Upload failed";
				return {
					...uploadItem,
					status: "error",
					progress: 0,
					error: errorMsg,
				};
			} finally {
				abortControllersRef.current.delete(uploadItem.id);
			}
		},
		[folder]
	);

	/** Process upload queue with concurrency limit */
	const processQueue = useCallback(
		async (queue: FileUploadStatus[]) => {
			const results: { success: StorageFile[]; failed: string[] } = {
				success: [],
				failed: [],
			};

			// Process in batches
			for (let i = 0; i < queue.length; i += maxConcurrent) {
				const batch = queue.slice(i, i + maxConcurrent);

				// Mark batch as uploading
				setUploadQueue((prev) =>
					prev.map((item) =>
						batch.find((b) => b.id === item.id)
							? { ...item, status: "uploading" as const, progress: 50 }
							: item
					)
				);

				// Upload batch in parallel
				const batchResults = await Promise.all(batch.map(uploadFile));

				// Update queue with results
				setUploadQueue((prev) =>
					prev.map((item) => {
						const result = batchResults.find((r) => r.id === item.id);
						return result || item;
					})
				);

				// Collect results
				for (const result of batchResults) {
					if (result.status === "success" && result.result) {
						results.success.push(result.result);
						onUpload?.(result.result);
					} else if (result.status === "error") {
						results.failed.push(result.error || "Unknown error");
					}
				}
			}

			// Show summary toast
			if (queue.length > 1) {
				if (results.failed.length === 0) {
					toast.success(`${results.success.length} files uploaded successfully`);
				} else if (results.success.length === 0) {
					toast.error(`All ${results.failed.length} files failed to upload`);
				} else {
					toast.warning(
						`${results.success.length} uploaded, ${results.failed.length} failed`
					);
				}
			} else if (queue.length === 1) {
				if (results.success.length === 1) {
					toast.success("File uploaded successfully");
				} else {
					toast.error(results.failed[0] || "Upload failed");
					onError?.(results.failed[0] || "Upload failed");
				}
			}

			onUploadComplete?.(results);

			// Clear successful uploads after delay
			setTimeout(() => {
				setUploadQueue((prev) => prev.filter((item) => item.status === "error"));
			}, 3000);
		},
		[maxConcurrent, uploadFile, onUpload, onUploadComplete, onError]
	);

	/** Handle files from input or drop */
	const handleFiles = useCallback(
		async (files: FileList) => {
			const fileArray = Array.from(files);
			if (fileArray.length === 0) return;

			// If not multiple, only take first file
			const filesToProcess = multiple ? fileArray : [fileArray[0]];

			// Validate files and create upload items
			const validationErrors: string[] = [];
			const uploadItems: FileUploadStatus[] = [];

			for (const file of filesToProcess) {
				const error = validateFile(file);
				if (error) {
					validationErrors.push(error);
					continue;
				}

				const uploadItem: FileUploadStatus = {
					id: generateId(),
					file,
					status: "pending",
					progress: 0,
				};

				// Generate preview for images
				if (file.type.startsWith("image/")) {
					const reader = new FileReader();
					reader.onload = (e) => {
						setUploadQueue((prev) =>
							prev.map((item) =>
								item.id === uploadItem.id
									? { ...item, preview: e.target?.result as string }
									: item
							)
						);
					};
					reader.readAsDataURL(file);
				}

				uploadItems.push(uploadItem);
			}

			// Show validation errors
			if (validationErrors.length > 0) {
				for (const error of validationErrors) {
					toast.error(error);
					onError?.(error);
				}
			}

			if (uploadItems.length === 0) return;

			// Add to queue
			setUploadQueue((prev) => [...prev, ...uploadItems]);

			// Start processing
			await processQueue(uploadItems);

			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		[multiple, validateFile, processQueue, onError]
	);

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (files) {
				handleFiles(files);
			}
		},
		[handleFiles]
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
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			const files = e.dataTransfer.files;
			if (files) {
				handleFiles(files);
			}
		},
		[handleFiles]
	);

	const handleClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	/** Cancel a specific upload */
	const cancelUpload = useCallback((id: string) => {
		const controller = abortControllersRef.current.get(id);
		if (controller) {
			controller.abort();
		}
		setUploadQueue((prev) => prev.filter((item) => item.id !== id));
	}, []);

	/** Clear all completed/failed uploads */
	const clearQueue = useCallback(() => {
		// Abort any pending uploads
		for (const controller of abortControllersRef.current.values()) {
			controller.abort();
		}
		abortControllersRef.current.clear();
		setUploadQueue([]);
	}, []);

	/** Render file icon based on type */
	const renderFileIcon = (file: File) => {
		if (file.type.startsWith("image/")) {
			return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
		}
		return <FileIcon className="h-4 w-4 text-muted-foreground" />;
	};

	return (
		<div className={cn("w-full space-y-4", className)}>
			<input
				ref={fileInputRef}
				type="file"
				accept={acceptedTypes}
				multiple={multiple}
				onChange={handleFileChange}
				className="hidden"
				disabled={disabled || isUploading}
			/>

			{/* Drop zone */}
			<div
				onClick={handleClick}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={cn(
					"relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer",
					isDragging
						? "border-primary bg-primary/5"
						: "border-border hover:border-primary/50",
					disabled && "opacity-50 cursor-not-allowed",
					isUploading && "pointer-events-none opacity-75"
				)}
			>
				<div className="flex items-center gap-2">
					{folder === "images" ? (
						<ImageIcon className="h-10 w-10 text-muted-foreground" />
					) : folder === "documents" ? (
						<FileIcon className="h-10 w-10 text-muted-foreground" />
					) : (
						<Upload className="h-10 w-10 text-muted-foreground" />
					)}
				</div>
				<div className="text-center">
					<p className="text-sm font-medium">
						{multiple
							? "Drag & drop files or click to upload"
							: "Drag & drop or click to upload"}
					</p>
					<p className="text-xs text-muted-foreground mt-1">
						{folder === "images"
							? "JPG, PNG, WebP, GIF, SVG (max 15MB each)"
							: folder === "documents"
								? "PDF, DOC, DOCX (max 100MB each)"
								: "Images or documents"}
						{multiple && " • Multiple files supported"}
					</p>
				</div>
			</div>

			{/* Upload queue */}
			{uploadQueue.length > 0 && (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium">
							{isUploading
								? `Uploading ${uploadQueue.filter((i) => i.status === "uploading").length} of ${uploadQueue.length}...`
								: `${uploadQueue.length} file(s)`}
						</p>
						{!isUploading && uploadQueue.length > 0 && (
							<button
								onClick={clearQueue}
								className="text-xs text-muted-foreground hover:text-foreground"
							>
								Clear all
							</button>
						)}
					</div>
					<div className="space-y-2 max-h-60 overflow-y-auto">
						{uploadQueue.map((item) => (
							<div
								key={item.id}
								className={cn(
									"flex items-center gap-3 p-3 rounded-lg border bg-card",
									item.status === "error" && "border-destructive/50 bg-destructive/5",
									item.status === "success" && "border-green-500/50 bg-green-500/5"
								)}
							>
								{/* Preview or icon */}
								<div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-muted flex items-center justify-center">
									{item.preview ? (
										<ImageComponent
											src={item.preview}
											alt={item.file.name}
											width="40"
											height="40"
											className="w-full h-full object-cover"
										/>
									) : (
										renderFileIcon(item.file)
									)}
								</div>

								{/* File info */}
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">{item.file.name}</p>
									<p className="text-xs text-muted-foreground">
										{(item.file.size / 1024).toFixed(1)} KB
									</p>
									{item.status === "uploading" && (
										<Progress value={item.progress} className="h-1 mt-1" />
									)}
									{item.status === "error" && item.error && (
										<p className="text-xs text-destructive mt-1">{item.error}</p>
									)}
								</div>

								{/* Status icon or cancel button */}
								<div className="flex-shrink-0">
									{item.status === "uploading" && (
										<Loader2 className="h-5 w-5 animate-spin text-primary" />
									)}
									{item.status === "success" && (
										<CheckCircle2 className="h-5 w-5 text-green-500" />
									)}
									{item.status === "error" && (
										<AlertCircle className="h-5 w-5 text-destructive" />
									)}
									{item.status === "pending" && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												cancelUpload(item.id);
											}}
											className="p-1 hover:bg-muted rounded"
										>
											<X className="h-4 w-4 text-muted-foreground" />
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
