"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CMSPageSkeleton() {
	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="space-y-2">
				<Skeleton className="h-9 w-48" />
				<Skeleton className="h-5 w-72" />
			</div>

			{/* Tabs */}
			<div className="space-y-6">
				<div className="flex flex-wrap gap-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-10 w-24" />
					))}
				</div>

				{/* Card Content */}
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-40" />
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Form Fields Grid */}
						<div className="grid gap-4 sm:grid-cols-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-10 w-full" />
								</div>
							))}
						</div>

						{/* Textarea Field */}
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-24 w-full" />
						</div>

						{/* Toggle Fields */}
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<div
									key={i}
									className="flex items-center justify-between rounded-lg border p-3"
								>
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-6 w-10 rounded-full" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Save Button */}
				<div className="flex justify-end">
					<Skeleton className="h-10 w-32" />
				</div>
			</div>
		</div>
	);
}
