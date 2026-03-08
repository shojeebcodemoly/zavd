"use client";

import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/input";

/**
 * Custom hook for debouncing a value
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

interface SearchInputProps {
	/** Default/initial value (uncontrolled mode) */
	defaultValue?: string;
	/** Callback when debounced search value changes - triggers the actual search */
	onSearch: (value: string) => void;
	/** Placeholder text */
	placeholder?: string;
	/** Debounce delay in milliseconds (default: 400) */
	debounceMs?: number;
	/** Show loading indicator */
	isLoading?: boolean;
	/** Additional class names */
	className?: string;
	/** Minimum characters before triggering search (default: 0) */
	minChars?: number;
	/** Auto focus on mount */
	autoFocus?: boolean;
	/** Disable the input */
	disabled?: boolean;
}

/**
 * SearchInput Component
 * A reusable search input with debounce functionality
 *
 * This is an uncontrolled component - it manages its own state internally.
 * The onSearch callback is called with the debounced value after typing stops.
 */
export function SearchInput({
	defaultValue = "",
	onSearch,
	placeholder = "Search...",
	debounceMs = 400,
	isLoading = false,
	className,
	minChars = 0,
	autoFocus = false,
	disabled = false,
}: SearchInputProps) {
	const [value, setValue] = React.useState(defaultValue);
	const inputRef = React.useRef<HTMLInputElement>(null);

	// Debounce the search value
	const debouncedValue = useDebounce(value, debounceMs);

	// Track if this is the first render
	const isFirstRender = React.useRef(true);

	// Call onSearch when debounced value changes
	React.useEffect(() => {
		// Skip the first render to avoid unnecessary initial search
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		// Only trigger search if value meets minimum character requirement
		if (debouncedValue.length >= minChars || debouncedValue.length === 0) {
			onSearch(debouncedValue);
		}
	}, [debouncedValue, onSearch, minChars]);

	// Handle input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	// Handle clear
	const handleClear = () => {
		setValue("");
		// Immediately trigger search with empty value (don't wait for debounce)
		onSearch("");
		inputRef.current?.focus();
	};

	// Handle key down
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Escape") {
			handleClear();
		}
	};

	return (
		<div className={cn("relative", className)}>
			{/* Search Icon */}
			<div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
				{isLoading ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<Search className="h-4 w-4" />
				)}
			</div>

			{/* Input */}
			<Input
				ref={inputRef}
				type="text"
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				disabled={disabled}
				autoFocus={autoFocus}
				className={cn(
					"pl-10 pr-10 outline-none ring-0",
					disabled && "opacity-50 cursor-not-allowed"
				)}
			/>

			{/* Clear Button */}
			{value && !disabled && (
				<button
					type="button"
					onClick={handleClear}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
					aria-label="Clear search"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}

/**
 * Export the useDebounce hook for use elsewhere
 */
export { useDebounce };
