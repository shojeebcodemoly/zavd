"use client";

import { useState, useCallback, useEffect } from "react";
import { ImageIcon, FileText, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { MediaGallery, type MediaType } from "./media-gallery";
import type { FileMetadata } from "@/lib/storage/client";
import { ImageComponent } from "../common/image-component";

interface MediaPickerProps {
	/** Type of media to pick */
	type: MediaType;
	/** Current value (file URL) */
	value?: string | null;
	/** Callback when value changes */
	onChange: (url: string | null) => void;
	/** Placeholder text */
	placeholder?: string;
	/** Additional class name */
	className?: string;
	/** Disable the picker */
	disabled?: boolean;
	/** Show preview of selected file */
	showPreview?: boolean;
	/** Gallery dialog title */
	galleryTitle?: string;
}

/**
 * Format bytes to human readable string
 */
function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function MediaPicker({
	type,
	value,
	onChange,
	placeholder,
	className,
	disabled = false,
	showPreview = true,
	galleryTitle,
}: MediaPickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [fileSize, setFileSize] = useState<number | null>(null);
	const [fileName, setFileName] = useState<string>("");

	const isImage = type === "image";
	const defaultPlaceholder = isImage ? "Select image" : "Select document";

	// Extract file name from URL
	useEffect(() => {
		if (value) {
			const name = value.split("/").pop() || "";
			setFileName(name);
		} else {
			setFileName("");
			setFileSize(null);
		}
	}, [value]);

	const handleSelect = useCallback(
		(file: FileMetadata) => {
			onChange(file.url);
			setFileSize(file.size || null);
			setFileName(file.filename || file.url.split("/").pop() || "");
		},
		[onChange]
	);

	const handleClear = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onChange(null);
		},
		[onChange]
	);

	return (
		<>
			<div className={cn("w-full", className)}>
				{showPreview && value ? (
					// Show preview when value exists
					<div className="relative group">
						{isImage ? (
							<div className="flex items-start gap-4 p-3 rounded-lg border border-border bg-muted/30">
								{/* Fixed size image preview */}
								<div className="relative h-20 w-20 shrink-0 rounded-md border border-border overflow-hidden bg-muted">
									<ImageComponent
										src={value}
										alt="Selected"
										className="h-full w-full object-cover"
										height={80}
										width={80}
									/>
								</div>
								{/* File info */}
								<div className="flex-1 min-w-0 py-1">
									<p className="text-sm font-medium truncate" title={fileName}>
										{fileName}
									</p>
									{fileSize && (
										<p className="text-xs text-muted-foreground mt-1">
											{formatFileSize(fileSize)}
										</p>
									)}
									{/* Actions */}
									<div className="flex gap-2 mt-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="h-7 text-xs"
											onClick={() => setIsOpen(true)}
											disabled={disabled}
										>
											<Pencil className="h-3 w-3 mr-1" />
											Change
										</Button>
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="h-7 text-xs hover:text-destructive hover:border-destructive"
											onClick={handleClear}
											disabled={disabled}
										>
											<X className="h-3 w-3 mr-1" />
											Remove
										</Button>
									</div>
								</div>
							</div>
						) : (
							<div className="relative flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
								<FileText className="h-8 w-8 text-muted-foreground shrink-0" />
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">
										{value.split("/").pop()}
									</p>
									<p className="text-xs text-muted-foreground">
										Document selected
									</p>
								</div>
								<div className="flex gap-1">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										onClick={() => setIsOpen(true)}
										disabled={disabled}
									>
										<Pencil className="h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8 hover:text-destructive"
										onClick={handleClear}
										disabled={disabled}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</div>
						)}
					</div>
				) : (
					// Show picker button when no value
					<Button
						type="button"
						variant="outline"
						className={cn(
							"w-full h-auto py-8 flex flex-col gap-2",
							disabled && "opacity-50 cursor-not-allowed"
						)}
						onClick={() => setIsOpen(true)}
						disabled={disabled}
					>
						{isImage ? (
							<ImageIcon className="h-8 w-8 text-muted-foreground" />
						) : (
							<FileText className="h-8 w-8 text-muted-foreground" />
						)}
						<span className="text-sm text-muted-foreground">
							{placeholder || defaultPlaceholder}
						</span>
					</Button>
				)}
			</div>

			<MediaGallery
				open={isOpen}
				onOpenChange={setIsOpen}
				type={type}
				onSelect={handleSelect}
				selectedUrl={value}
				title={galleryTitle}
			/>
		</>
	);
}
