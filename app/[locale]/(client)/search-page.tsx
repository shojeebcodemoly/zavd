"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { parseAsString, parseAsInteger, useQueryState } from "nuqs";
import { Search, X, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticleResultCard } from "@/components/search/SearchResultCard";
import { SearchPageSkeleton } from "@/components/search/SearchSkeleton";
import { NoResults } from "@/components/search/NoResults";
import type { SearchResults } from "@/lib/services/search.service";

interface SearchPageClientProps {
	initialResults?: SearchResults | null;
	initialQuery?: string;
}

export function SearchPageClient({
	initialResults,
	initialQuery = "",
}: SearchPageClientProps) {
	const router = useRouter();

	// URL state with nuqs
	const [searchQuery, setSearchQuery] = useQueryState(
		"s",
		parseAsString.withDefault("")
	);
	const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

	// Local state
	const [inputValue, setInputValue] = useState(initialQuery || searchQuery);
	const [results, setResults] = useState<SearchResults | null>(
		initialResults || null
	);
	const [isLoading, setIsLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(!!initialQuery || !!searchQuery);

	// Fetch search results
	const fetchResults = useCallback(async (query: string, pageNum: number) => {
		if (!query || query.trim().length < 2) {
			setResults(null);
			setHasSearched(false);
			return;
		}

		setIsLoading(true);
		setHasSearched(true);

		try {
			const params = new URLSearchParams({
				q: query.trim(),
				page: pageNum.toString(),
				limit: "10",
			});

			const response = await fetch(`/api/search?${params}`);
			const data = await response.json();

			if (data.success) {
				setResults(data.data);
			} else {
				setResults(null);
			}
		} catch (error) {
			console.error("Search error:", error);
			setResults(null);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Sync input value with URL search query when it changes externally
	useEffect(() => {
		if (searchQuery !== inputValue) {
			setInputValue(searchQuery);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchQuery]);

	// Fetch when URL params change (after initial mount)
	useEffect(() => {
		if (initialResults && searchQuery === initialQuery) {
			return;
		}

		if (searchQuery) {
			fetchResults(searchQuery, page);
		} else {
			setResults(null);
			setHasSearched(false);
		}
	}, [searchQuery, page, fetchResults, initialResults, initialQuery]);

	// Handle search submit
	const handleSearch = async (e?: React.FormEvent) => {
		e?.preventDefault();
		const trimmed = inputValue.trim();
		if (trimmed.length >= 2) {
			await setSearchQuery(trimmed);
			await setPage(1);
		}
	};

	// Handle clear
	const handleClear = async () => {
		setInputValue("");
		await setSearchQuery(null);
		await setPage(null);
		setResults(null);
		setHasSearched(false);
	};

	// Calculate totals
	const totalPosts = results?.posts?.total || 0;
	const totalResults = results?.totalResults || 0;

	return (
		<section className="py-12 bg-muted min-h-[60vh]">
			<div className="_container">
				{/* Header */}
				<div className="mb-8">
					{hasSearched && results?.query && (
						<p className="text-sm text-foreground/60 mb-1">
							Ihre Suche nach &quot;{results.query}&quot; ergab {totalResults} Treffer
						</p>
					)}
					<h1 className="text-2xl sm:text-3xl font-medium text-secondary">
						{hasSearched ? "Suchergebnisse" : "Suche"}
					</h1>
				</div>

				{/* Search Input */}
				<form onSubmit={handleSearch} className="mb-8">
					<div className="flex flex-col sm:flex-row gap-4 items-center max-w-2xl">
						<div className="relative flex-1 w-full">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
							<Input
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder="Artikel suchen..."
								className="pl-12 pr-10 h-14 text-base rounded-full border-border focus:border-primary focus:ring-primary bg-background"
							/>
							{inputValue && (
								<button
									type="button"
									onClick={() => setInputValue("")}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground/70"
								>
									<X className="h-5 w-5" />
								</button>
							)}
						</div>
						<Button
							type="submit"
							className="w-full sm:w-auto h-14 px-8 rounded-full bg-primary hover:bg-primary-hover"
							disabled={inputValue.trim().length < 2}
						>
							Suchen
						</Button>
					</div>
				</form>

				{/* Loading State */}
				{isLoading && <SearchPageSkeleton />}

				{/* Results */}
				{!isLoading && hasSearched && results && (
					<div className="space-y-10">
						{/* Articles Section */}
						{totalPosts > 0 && (
							<div>
								<div className="flex items-center gap-3 mb-4">
									<FileText className="h-5 w-5 text-blue-600" />
									<h2 className="text-lg font-semibold text-secondary">
										Artikel & Nachrichten
									</h2>
									<Badge variant="secondary" className="rounded-full">
										{totalPosts}
									</Badge>
								</div>
								<div className="space-y-4">
									{results.posts.data.map((post) => (
										<ArticleResultCard key={post._id} article={post} />
									))}
								</div>
							</div>
						)}

						{/* Pagination */}
						{totalResults > 10 && (
							<div className="flex justify-center gap-4 pt-6">
								<Button
									variant="outline"
									disabled={page <= 1}
									onClick={() => setPage(page > 1 ? page - 1 : 1)}
								>
									Zurück
								</Button>
								<span className="flex items-center px-4 text-sm text-foreground/70">
									Seite {page}
								</span>
								<Button
									variant="outline"
									disabled={totalResults <= page * 10}
									onClick={() => setPage(page + 1)}
								>
									Weiter
								</Button>
							</div>
						)}
					</div>
				)}

				{/* No Results */}
				{!isLoading && hasSearched && results && totalResults === 0 && (
					<NoResults query={results.query} onClear={handleClear} />
				)}

				{/* Initial State (no search yet) */}
				{!isLoading && !hasSearched && (
					<div className="text-center py-12">
						<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
							<Search className="h-8 w-8 text-foreground/50" />
						</div>
						<p className="text-foreground/60">
							Mindestens 2 Zeichen eingeben, um die Suche zu starten
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
