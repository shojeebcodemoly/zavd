"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SearchResultSkeleton() {
	return (
		<div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200">
			{/* Thumbnail skeleton */}
			<Skeleton className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-lg" />

			{/* Content skeleton */}
			<div className="flex-1 min-w-0 flex flex-col justify-between py-1">
				<div>
					<Skeleton className="h-5 w-16 mb-2 rounded-full" />
					<Skeleton className="h-6 w-3/4 mb-2" />
					<Skeleton className="h-4 w-full mb-1" />
					<Skeleton className="h-4 w-2/3" />
				</div>
				<div className="flex gap-2 mt-2">
					<Skeleton className="h-5 w-20 rounded-full" />
					<Skeleton className="h-5 w-16 rounded-full" />
				</div>
			</div>

			{/* Arrow skeleton */}
			<div className="hidden sm:flex items-center">
				<Skeleton className="h-5 w-5 rounded" />
			</div>
		</div>
	);
}

export function CategoryResultSkeleton() {
	return (
		<div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
			{/* Icon skeleton */}
			<Skeleton className="w-12 h-12 shrink-0 rounded-lg" />

			{/* Content skeleton */}
			<div className="flex-1 min-w-0">
				<Skeleton className="h-5 w-16 mb-2 rounded-full" />
				<Skeleton className="h-5 w-32 mb-1" />
				<Skeleton className="h-4 w-48" />
			</div>

			{/* Arrow skeleton */}
			<Skeleton className="h-5 w-5 rounded" />
		</div>
	);
}

export function SearchPageSkeleton() {
	return (
		<div className="space-y-8">
			{/* Header skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-48" />
				<Skeleton className="h-8 w-64" />
			</div>

			{/* Search input skeleton */}
			<Skeleton className="h-14 w-full max-w-2xl rounded-full" />

			{/* Results section skeleton */}
			<div className="space-y-6">
				{/* Section header */}
				<div className="flex items-center gap-2">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-5 w-8 rounded-full" />
				</div>

				{/* Result cards */}
				<div className="space-y-4">
					<SearchResultSkeleton />
					<SearchResultSkeleton />
					<SearchResultSkeleton />
				</div>
			</div>

			{/* Categories section skeleton */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<Skeleton className="h-6 w-24" />
					<Skeleton className="h-5 w-8 rounded-full" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<CategoryResultSkeleton />
					<CategoryResultSkeleton />
				</div>
			</div>
		</div>
	);
}
