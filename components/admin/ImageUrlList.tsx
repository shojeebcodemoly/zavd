"use client";

import * as React from "react";
import { Plus, Trash2, GripVertical, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageComponent } from "../common/image-component";

interface ImageUrlListProps {
	value: string[];
	onChange: (urls: string[]) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	maxImages?: number;
}

/**
 * ImageUrlList Component
 * Manages a list of image URLs with preview
 */
export function ImageUrlList({
	value = [],
	onChange,
	placeholder = "Enter image URL...",
	disabled = false,
	className,
	maxImages,
}: ImageUrlListProps) {
	const [newUrl, setNewUrl] = React.useState("");
	const [dragIndex, setDragIndex] = React.useState<number | null>(null);

	const addUrl = () => {
		if (!newUrl.trim()) return;
		if (maxImages && value.length >= maxImages) return;
		onChange([...value, newUrl.trim()]);
		setNewUrl("");
	};

	const removeUrl = (index: number) => {
		onChange(value.filter((_, i) => i !== index));
	};

	const updateUrl = (index: number, url: string) => {
		const newUrls = [...value];
		newUrls[index] = url;
		onChange(newUrls);
	};

	const handleDragStart = (index: number) => {
		setDragIndex(index);
	};

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		if (dragIndex === null || dragIndex === index) return;

		const newUrls = [...value];
		const [draggedItem] = newUrls.splice(dragIndex, 1);
		newUrls.splice(index, 0, draggedItem);
		onChange(newUrls);
		setDragIndex(index);
	};

	const handleDragEnd = () => {
		setDragIndex(null);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addUrl();
		}
	};

	return (
		<div className={cn("space-y-3", className)}>
			{/* Existing images */}
			{value.map((url, index) => (
				<div
					key={index}
					draggable={!disabled}
					onDragStart={() => handleDragStart(index)}
					onDragOver={(e) => handleDragOver(e, index)}
					onDragEnd={handleDragEnd}
					className={cn(
						"flex items-start gap-2 p-2 border border-slate-200 rounded-md bg-white",
						dragIndex === index && "opacity-50"
					)}
				>
					{/* Drag handle */}
					<div className="cursor-move p-1 text-slate-400 hover:text-slate-600">
						<GripVertical className="h-5 w-5" />
					</div>

					{/* Image preview */}
					<div className="shrink-0 w-16 h-16 bg-slate-100 rounded overflow-hidden">
						{url ? (
							<ImageComponent
								src={url}
								alt={`Image ${index + 1}`}
								className="w-full h-full object-cover"
								onError={(e) => {
									(e.target as HTMLImageElement).style.display =
										"none";
								}}
								height={1000}
								width={1000}
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<ImageIcon className="h-6 w-6 text-slate-400" />
							</div>
						)}
					</div>

					{/* URL input */}
					<div className="flex-1">
						<Input
							type="url"
							value={url}
							onChange={(e) => updateUrl(index, e.target.value)}
							placeholder="https://example.com/image.jpg"
							disabled={disabled}
							className="text-sm"
						/>
					</div>

					{/* Remove button */}
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => removeUrl(index)}
						disabled={disabled}
						className="text-red-500 hover:text-red-700 hover:bg-red-50"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			))}

			{/* Add new image */}
			{(!maxImages || value.length < maxImages) && (
				<div className="flex gap-2">
					<Input
						type="url"
						value={newUrl}
						onChange={(e) => setNewUrl(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						disabled={disabled}
						className="flex-1"
					/>
					<Button
						type="button"
						variant="outline"
						onClick={addUrl}
						disabled={disabled || !newUrl.trim()}
					>
						<Plus className="h-4 w-4 mr-1" />
						Add
					</Button>
				</div>
			)}

			{maxImages && (
				<p className="text-xs text-slate-500">
					{value.length}/{maxImages} images
				</p>
			)}
		</div>
	);
}
