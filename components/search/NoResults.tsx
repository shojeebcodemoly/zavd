"use client";

import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoResultsProps {
	query: string;
	popularSearches?: string[];
	onClear?: () => void;
}

export function NoResults({ query, popularSearches, onClear }: NoResultsProps) {
	const defaultPopularSearches = [
		"MOTUS PRO",
		"Soprano",
		"Hårborttagning",
		"Laserbehandling",
	];

	const searches = popularSearches || defaultPopularSearches;

	return (
		<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
			{/* Icon */}
			<div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
				<Search className="h-10 w-10 text-slate-400" />
			</div>

			{/* Message */}
			<h2 className="text-xl font-semibold text-secondary mb-2">
				Inga resultat hittades
			</h2>
			<p className="text-slate-500 max-w-md mb-6">
				Vi kunde inte hitta något som matchar &quot;{query}&quot;. Försök med andra
				söktermer eller utforska våra kategorier.
			</p>

			{/* Clear search button */}
			{onClear && (
				<Button
					variant="outline"
					onClick={onClear}
					className="mb-8"
				>
					Rensa sökning
				</Button>
			)}

			{/* Popular searches */}
			<div className="w-full max-w-md">
				<p className="text-sm font-medium text-slate-600 mb-3">
					Populära sökningar:
				</p>
				<div className="flex flex-wrap justify-center gap-2">
					{searches.map((term) => (
						<Link
							key={term}
							href={`/?s=${encodeURIComponent(term)}`}
							className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-full hover:border-primary hover:text-primary transition-colors"
						>
							{term}
						</Link>
					))}
				</div>
			</div>

			{/* Browse categories link */}
			<div className="mt-8 pt-8 border-t border-slate-200 w-full max-w-md">
				<Link
					href="/kategori"
					className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
				>
					Utforska alla kategorier
					<ArrowRight className="h-4 w-4" />
				</Link>
			</div>
		</div>
	);
}
