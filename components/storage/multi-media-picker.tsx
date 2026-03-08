"use client";

import { useState, useCallback } from "react";
import {
	ImageIcon,
	X,
	Plus,
	GripVertical,
	AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { MediaGallery, type MediaType } from "./media-gallery";
import type { FileMetadata } from "@/lib/storage/client";
import { ImageComponent } from "../common/image-component";

interface MultiMediaPickerProps {
	/** Type of media to pick */
	type: MediaType;
	/** Current values (file URLs) */
	value?: string[];
	/** Callback when values change */
	onChange: (urls: string[]) => void;
	/** Placeholder text */
	placeholder?: string;
	/** Additional class name */
	className?: string;
	/** Disable the picker */
	disabled?: boolean;
	/** Gallery dialog title */
	galleryTitle?: string;
	/** Maximum number of images allowed */
	maxImages?: number;
	/** Minimum number of images required */
	minImages?: number;
	/** Error message to display */
	error?: string;
}

export function MultiMediaPicker({
	type,
	value = [],
	onChange,
	placeholder,
	className,
	disabled = false,
	galleryTitle,
	maxImages,
	minImages,
	error,
}: MultiMediaPickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

	const isImage = type === "image";
	const defaultPlaceholder = isImage ? "Add images" : "Add documents";

	// Check if we can add more images
	const canAddMore = !maxImages || value.length < maxImages;

	// Handle multi-select from gallery
	const handleMultiSelect = useCallback(
		(files: FileMetadata[]) => {
			const newUrls = files.map((f) => f.url);
			// Filter out already selected URLs
			const uniqueNewUrls = newUrls.filter((url) => !value.includes(url));

			let updatedUrls = [...value, ...uniqueNewUrls];

			// Respect maxImages limit
			if (maxImages && updatedUrls.length > maxImages) {
				updatedUrls = updatedUrls.slice(0, maxImages);
			}

			onChange(updatedUrls);
		},
		[value, onChange, maxImages]
	);

	// Remove a single image
	const handleRemove = useCallback(
		(index: number, e: React.MouseEvent) => {
			e.stopPropagation();
			const newUrls = value.filter((_, i) => i !== index);
			onChange(newUrls);
		},
		[value, onChange]
	);

	// Drag and drop handlers for reordering
	const handleDragStart = useCallback(
		(e: React.DragEvent, index: number) => {
			if (disabled) return;
			setDraggedIndex(index);
			e.dataTransfer.effectAllowed = "move";
			e.dataTransfer.setData("text/plain", index.toString());
		},
		[disabled]
	);

	const handleDragOver = useCallback(
		(e: React.DragEvent, index: number) => {
			e.preventDefault();
			if (draggedIndex === null || draggedIndex === index) return;
			setDragOverIndex(index);
		},
		[draggedIndex]
	);

	const handleDragLeave = useCallback(() => {
		setDragOverIndex(null);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent, dropIndex: number) => {
			e.preventDefault();
			if (draggedIndex === null || draggedIndex === dropIndex) {
				setDraggedIndex(null);
				setDragOverIndex(null);
				return;
			}

			const newUrls = [...value];
			const [draggedItem] = newUrls.splice(draggedIndex, 1);
			newUrls.splice(dropIndex, 0, draggedItem);

			onChange(newUrls);
			setDraggedIndex(null);
			setDragOverIndex(null);
		},
		[draggedIndex, value, onChange]
	);

	const handleDragEnd = useCallback(() => {
		setDraggedIndex(null);
		setDragOverIndex(null);
	}, []);

	// Move image up/down (keyboard accessible alternative)
	const moveImage = useCallback(
		(fromIndex: number, toIndex: number) => {
			if (toIndex < 0 || toIndex >= value.length) return;
			const newUrls = [...value];
			const [item] = newUrls.splice(fromIndex, 1);
			newUrls.splice(toIndex, 0, item);
			onChange(newUrls);
		},
		[value, onChange]
	);

	return (
		<>
			<div className={cn("w-full space-y-3", className)}>
				{/* Image Grid */}
				{value.length > 0 && (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{value.map((url, index) => (
							<div
								key={`${url}-${index}`}
								draggable={!disabled}
								onDragStart={(e) => handleDragStart(e, index)}
								onDragOver={(e) => handleDragOver(e, index)}
								onDragLeave={handleDragLeave}
								onDrop={(e) => handleDrop(e, index)}
								onDragEnd={handleDragEnd}
								className={cn(
									"group relative aspect-square rounded-lg border-2 overflow-hidden transition-all",
									draggedIndex === index && "opacity-50 scale-95",
									dragOverIndex === index &&
										"border-primary ring-2 ring-primary/20",
									draggedIndex !== null &&
										draggedIndex !== index &&
										"hover:border-primary",
									!disabled && "cursor-grab active:cursor-grabbing",
									disabled && "opacity-60"
								)}
							>
								{/* Image */}
								{isImage ? (
									<ImageComponent
										src={url}
										alt={`Image ${index + 1}`}
										className="h-full w-full object-cover"
										height="200"
										width="200"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center bg-muted">
										<span className="text-xs text-muted-foreground truncate px-2">
											{url.split("/").pop()}
										</span>
									</div>
								)}

								{/* Drag handle indicator */}
								<div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
									<div className="bg-black/50 rounded p-0.5">
										<GripVertical className="h-4 w-4 text-white" />
									</div>
								</div>

								{/* Index badge */}
								<div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
									{index + 1}
								</div>

								{/* Remove button */}
								{!disabled && (
									<Button
										type="button"
										variant="destructive"
										size="icon"
										className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
										onClick={(e) => handleRemove(index, e)}
									>
										<X className="h-3 w-3" />
									</Button>
								)}
							</div>
						))}

						{/* Add More Button (in grid) */}
						{canAddMore && !disabled && (
							<Button
								type="button"
								variant="outline"
								className="aspect-square h-auto flex flex-col gap-1 border-dashed"
								onClick={() => setIsOpen(true)}
							>
								<Plus className="h-6 w-6 text-muted-foreground" />
								<span className="text-xs text-muted-foreground">Add</span>
							</Button>
						)}
					</div>
				)}

				{/* Empty State / Initial Add Button */}
				{value.length === 0 && (
					<Button
						type="button"
						variant="outline"
						className={cn(
							"w-full h-auto py-8 flex flex-col gap-2 border-dashed",
							disabled && "opacity-50 cursor-not-allowed",
							error && "border-destructive"
						)}
						onClick={() => setIsOpen(true)}
						disabled={disabled}
					>
						<ImageIcon className="h-8 w-8 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">
							{placeholder || defaultPlaceholder}
						</span>
						{maxImages && (
							<span className="text-xs text-muted-foreground">
								Max {maxImages} {isImage ? "images" : "files"}
							</span>
						)}
					</Button>
				)}

				{/* Validation Info */}
				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<div className="flex items-center gap-4">
						{minImages && (
							<span
								className={cn(
									value.length < minImages && "text-destructive"
								)}
							>
								Min: {minImages}
							</span>
						)}
						{maxImages && (
							<span
								className={cn(
									value.length >= maxImages && "text-amber-500"
								)}
							>
								Max: {maxImages}
							</span>
						)}
					</div>
					<span>
						{value.length} {isImage ? "image" : "file"}
						{value.length !== 1 ? "s" : ""} selected
					</span>
				</div>

				{/* Error Message */}
				{error && (
					<div className="flex items-center gap-2 text-sm text-destructive">
						<AlertCircle className="h-4 w-4" />
						<span>{error}</span>
					</div>
				)}
			</div>

			<MediaGallery
				open={isOpen}
				onOpenChange={setIsOpen}
				type={type}
				multiSelect
				onMultiSelect={handleMultiSelect}
				selectedUrls={value}
				title={galleryTitle || (isImage ? "Select Images" : "Select Documents")}
			/>
		</>
	);
}
