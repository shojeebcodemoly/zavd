"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarSearchProps {
	useLightText?: boolean;
}

export function NavbarSearch({ useLightText = false }: NavbarSearchProps) {
	const router = useRouter();
	const [isExpanded, setIsExpanded] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Focus input when expanded
	useEffect(() => {
		if (isExpanded && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isExpanded]);

	// Handle click outside to collapse
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				if (!inputValue) {
					setIsExpanded(false);
				}
			}
		};

		if (isExpanded) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isExpanded, inputValue]);

	// Handle search submit
	const handleSubmit = (e?: React.FormEvent) => {
		e?.preventDefault();
		const trimmed = inputValue.trim();
		if (trimmed.length >= 2) {
			router.push(`/?s=${encodeURIComponent(trimmed)}`);
			setIsExpanded(false);
			setInputValue("");
		}
	};

	// Handle key events
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			setIsExpanded(false);
			setInputValue("");
		} else if (e.key === "Enter") {
			handleSubmit();
		}
	};

	// Handle expand click
	const handleExpandClick = () => {
		if (!isExpanded) {
			setIsExpanded(true);
		}
	};

	// Handle clear
	const handleClear = () => {
		setInputValue("");
		inputRef.current?.focus();
	};

	return (
		<div ref={containerRef} className="relative flex items-center">
			<form onSubmit={handleSubmit} className="flex items-center">
				<div
					className={cn(
						"flex items-center transition-all duration-300 ease-in-out overflow-hidden rounded-full",
						isExpanded
							? "w-48 sm:w-64 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-sm"
							: "w-10"
					)}
				>
					{/* Search Icon / Button */}
					<button
						type={isExpanded ? "submit" : "button"}
						onClick={handleExpandClick}
						className={cn(
							"flex items-center justify-center shrink-0 transition-colors",
							isExpanded
								? "w-10 h-10 text-slate-500 hover:text-primary"
								: cn(
										"w-10 h-10 rounded-full hover:bg-secondary/10",
										useLightText
											? "text-white/90 hover:text-white"
											: "text-secondary hover:text-primary"
									)
						)}
						aria-label={isExpanded ? "Sök" : "Öppna sök"}
					>
						<Search className="h-5 w-5" />
					</button>

					{/* Input Field */}
					{isExpanded && (
						<>
							<input
								ref={inputRef}
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Sök..."
								className="flex-1 h-10 bg-transparent text-sm text-secondary placeholder:text-slate-400 focus:outline-none"
							/>

							{/* Clear Button */}
							{inputValue && (
								<button
									type="button"
									onClick={handleClear}
									className="flex items-center justify-center w-8 h-10 text-slate-400 hover:text-slate-600 transition-colors"
									aria-label="Rensa"
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</>
					)}
				</div>
			</form>
		</div>
	);
}
