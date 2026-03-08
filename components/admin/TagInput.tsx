"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface TagInputProps {
	value: string[];
	onChange: (tags: string[]) => void;
	placeholder?: string;
	suggestions?: string[];
	maxTags?: number;
	disabled?: boolean;
	className?: string;
}

/**
 * TagInput Component
 * Allows users to add and remove tags with autocomplete suggestions
 */
export function TagInput({
	value = [],
	onChange,
	placeholder = "Add tag...",
	suggestions = [],
	maxTags,
	disabled = false,
	className,
}: TagInputProps) {
	const [inputValue, setInputValue] = React.useState("");
	const [showSuggestions, setShowSuggestions] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

	// Filter suggestions based on input and exclude already selected tags
	const filteredSuggestions = React.useMemo(() => {
		if (!inputValue.trim()) return [];
		return suggestions
			.filter(
				(s) =>
					s.toLowerCase().includes(inputValue.toLowerCase()) &&
					!value.includes(s)
			)
			.slice(0, 5);
	}, [inputValue, suggestions, value]);

	const addTag = (tag: string) => {
		const trimmedTag = tag.trim();
		if (!trimmedTag) return;
		if (value.includes(trimmedTag)) return;
		if (maxTags && value.length >= maxTags) return;

		onChange([...value, trimmedTag]);
		setInputValue("");
		setShowSuggestions(false);
	};

	const removeTag = (tagToRemove: string) => {
		onChange(value.filter((tag) => tag !== tagToRemove));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag(inputValue);
		} else if (e.key === "Backspace" && !inputValue && value.length > 0) {
			removeTag(value[value.length - 1]);
		} else if (e.key === "Escape") {
			setShowSuggestions(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		setShowSuggestions(true);
	};

	const handleSuggestionClick = (suggestion: string) => {
		addTag(suggestion);
		inputRef.current?.focus();
	};

	return (
		<div className={cn("relative", className)}>
			<div
				className={cn(
					"flex flex-wrap gap-2 p-2 min-h-11 rounded-md border border-slate-200 bg-white",
					// "focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2",
					disabled && "opacity-50 cursor-not-allowed"
				)}
				onClick={() => inputRef.current?.focus()}
			>
				{value.map((tag) => (
					<Badge
						key={tag}
						variant="secondary"
						className="flex items-center gap-1 px-2 py-1"
					>
						{tag}
						{!disabled && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									removeTag(tag);
								}}
								className="ml-1 rounded-full hover:bg-slate-300/50 p-0.5"
							>
								<X className="h-3 w-3" />
								<span className="sr-only">Remove {tag}</span>
							</button>
						)}
					</Badge>
				))}
				<Input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onFocus={() => setShowSuggestions(true)}
					onBlur={() => {
						// Delay hiding to allow click on suggestion
						setTimeout(() => setShowSuggestions(false), 200);
					}}
					placeholder={
						maxTags && value.length >= maxTags
							? `Max ${maxTags} tags`
							: placeholder
					}
					disabled={
						disabled || (maxTags ? value.length >= maxTags : false)
					}
					className="flex-1 min-w-[120px] border-0 p-0 h-auto ring-0! outline-none!"
				/>
			</div>

			{/* Suggestions dropdown */}
			{showSuggestions && filteredSuggestions.length > 0 && (
				<div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg">
					{filteredSuggestions.map((suggestion) => (
						<button
							key={suggestion}
							type="button"
							onClick={() => handleSuggestionClick(suggestion)}
							className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 first:rounded-t-md last:rounded-b-md"
						>
							{suggestion}
						</button>
					))}
				</div>
			)}

			{maxTags && (
				<p className="text-xs text-slate-500 mt-1">
					{value.length}/{maxTags} tags
				</p>
			)}
		</div>
	);
}
