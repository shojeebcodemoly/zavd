import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

/**
 * Stats Card Skeleton
 * Use for dashboard stat cards (total, published, draft, etc.)
 */
export function StatsCardSkeleton({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"rounded-xl border bg-card text-card-foreground shadow-sm",
				className
			)}
		>
			<div className="pt-6 px-6 pb-6">
				<Skeleton className="h-8 w-16 mb-2" />
				<Skeleton className="h-4 w-24" />
			</div>
		</div>
	);
}

/**
 * Stats Cards Grid Skeleton
 * Use for grid of 4 stat cards
 */
export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			{Array.from({ length: count }).map((_, i) => (
				<StatsCardSkeleton key={i} />
			))}
		</div>
	);
}

/**
 * Product Row Skeleton
 * Use for product list items with thumbnail, title, badges
 */
export function ProductRowSkeleton() {
	return (
		<div className="flex items-center gap-4 p-4 border rounded-lg">
			{/* Thumbnail */}
			<Skeleton className="w-16 h-16 rounded shrink-0" />

			{/* Info */}
			<div className="flex-1 min-w-0 space-y-2">
				<Skeleton className="h-5 w-48" />
				<Skeleton className="h-4 w-32" />
				<div className="flex gap-2">
					<Skeleton className="h-5 w-16 rounded-full" />
				</div>
			</div>

			{/* Categories */}
			<div className="hidden md:flex gap-1">
				<Skeleton className="h-5 w-20 rounded-full" />
				<Skeleton className="h-5 w-16 rounded-full" />
			</div>

			{/* Date */}
			<Skeleton className="h-4 w-24 hidden lg:block" />

			{/* Action button */}
			<Skeleton className="h-8 w-8 rounded" />
		</div>
	);
}

/**
 * Product List Skeleton
 * Use for product listing with multiple rows
 */
export function ProductListSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="space-y-4">
			{Array.from({ length: count }).map((_, i) => (
				<ProductRowSkeleton key={i} />
			))}
		</div>
	);
}

/**
 * Inquiry Row Skeleton
 * Use for submission/inquiry list items
 */
export function InquiryRowSkeleton() {
	return (
		<div className="flex items-center gap-4 p-4 border rounded-lg">
			{/* Checkbox */}
			<Skeleton className="w-4 h-4 rounded" />

			{/* Contact Info */}
			<div className="flex-1 min-w-0 space-y-2">
				<Skeleton className="h-5 w-40" />
				<div className="flex gap-3">
					<Skeleton className="h-4 w-36" />
					<Skeleton className="h-4 w-28" />
				</div>
			</div>

			{/* Type Badge */}
			<Skeleton className="h-6 w-28 rounded-full hidden md:block" />

			{/* Status Badge */}
			<Skeleton className="h-5 w-16 rounded-full hidden lg:block" />

			{/* Date */}
			<Skeleton className="h-4 w-24 hidden lg:block" />

			{/* Action button */}
			<Skeleton className="h-8 w-8 rounded" />
		</div>
	);
}

/**
 * Inquiry List Skeleton
 * Use for inquiry listing with header row
 */
export function InquiryListSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="space-y-4">
			{/* Header row */}
			<div className="flex items-center gap-4 px-4 py-2 border-b">
				<Skeleton className="w-4 h-4 rounded" />
				<Skeleton className="h-4 w-24 flex-1" />
				<Skeleton className="h-4 w-16 hidden md:block" />
				<Skeleton className="h-4 w-16 hidden lg:block" />
				<Skeleton className="h-4 w-20 hidden lg:block" />
				<Skeleton className="w-10 h-4" />
			</div>
			{Array.from({ length: count }).map((_, i) => (
				<InquiryRowSkeleton key={i} />
			))}
		</div>
	);
}

/**
 * Category Tree Node Skeleton
 */
export function CategoryNodeSkeleton({ level = 0 }: { level?: number }) {
	return (
		<div
			className="flex items-center gap-2 py-2 px-3"
			style={{ marginLeft: `${level * 24}px` }}
		>
			<Skeleton className="w-6 h-6 rounded" />
			<Skeleton className="w-5 h-5 rounded" />
			<Skeleton className="h-5 flex-1 max-w-[200px]" />
			<Skeleton className="h-4 w-24 hidden md:block" />
		</div>
	);
}

/**
 * Category Tree Skeleton
 * Use for hierarchical category list
 */
export function CategoryTreeSkeleton() {
	return (
		<div className="space-y-1">
			<CategoryNodeSkeleton level={0} />
			<CategoryNodeSkeleton level={1} />
			<CategoryNodeSkeleton level={1} />
			<CategoryNodeSkeleton level={2} />
			<CategoryNodeSkeleton level={0} />
			<CategoryNodeSkeleton level={1} />
			<CategoryNodeSkeleton level={0} />
		</div>
	);
}

/**
 * Dashboard Welcome Skeleton
 */
export function DashboardWelcomeSkeleton() {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6">
			<Skeleton className="h-9 w-72 mb-2" />
			<Skeleton className="h-5 w-96" />
		</div>
	);
}

/**
 * Dashboard Stats Card Skeleton (larger variant)
 */
export function DashboardStatCardSkeleton() {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6">
			<Skeleton className="h-4 w-20 mb-2" />
			<Skeleton className="h-7 w-40" />
			<Skeleton className="h-4 w-24 mt-1" />
		</div>
	);
}

/**
 * Dashboard Profile Section Skeleton
 */
export function DashboardProfileSkeleton() {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6">
			<div className="flex items-center justify-between mb-4">
				<Skeleton className="h-7 w-48" />
				<Skeleton className="h-9 w-28 rounded-md" />
			</div>
			<div className="space-y-4">
				<div>
					<Skeleton className="h-4 w-12 mb-1" />
					<Skeleton className="h-5 w-40" />
				</div>
				<div>
					<Skeleton className="h-4 w-12 mb-1" />
					<Skeleton className="h-5 w-52" />
				</div>
			</div>
		</div>
	);
}

/**
 * Dashboard Quick Actions Skeleton
 */
export function DashboardQuickActionsSkeleton() {
	return (
		<div className="bg-white rounded-lg shadow-sm border p-6">
			<Skeleton className="h-7 w-36 mb-4" />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="p-4 border rounded-lg">
					<Skeleton className="h-5 w-32 mb-1" />
					<Skeleton className="h-4 w-48" />
				</div>
				<div className="p-4 border rounded-lg">
					<Skeleton className="h-5 w-28 mb-1" />
					<Skeleton className="h-4 w-36" />
				</div>
			</div>
		</div>
	);
}

/**
 * Full Dashboard Page Skeleton
 */
export function DashboardPageSkeleton() {
	return (
		<div className="space-y-8">
			<DashboardWelcomeSkeleton />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<DashboardStatCardSkeleton />
				<DashboardStatCardSkeleton />
				<DashboardStatCardSkeleton />
			</div>
			<DashboardProfileSkeleton />
			<DashboardQuickActionsSkeleton />
		</div>
	);
}

/**
 * Search/Filter Bar Skeleton
 */
export function FilterBarSkeleton() {
	return (
		<div className="rounded-xl border bg-card shadow-sm">
			<div className="pt-6 px-6 pb-6">
				<div className="flex gap-4">
					<Skeleton className="h-11 flex-1" />
					<Skeleton className="h-11 w-36" />
				</div>
			</div>
		</div>
	);
}

/**
 * Table Header Skeleton
 */
export function TableHeaderSkeleton() {
	return (
		<div className="flex items-center justify-between mb-4">
			<div>
				<Skeleton className="h-6 w-32 mb-1" />
				<Skeleton className="h-4 w-24" />
			</div>
			<Skeleton className="h-9 w-24 rounded-md" />
		</div>
	);
}

/**
 * Page Header Skeleton
 */
export function PageHeaderSkeleton() {
	return (
		<div className="flex justify-between items-center">
			<div>
				<Skeleton className="h-9 w-40 mb-2" />
				<Skeleton className="h-5 w-56" />
			</div>
			<Skeleton className="h-10 w-32 rounded-md" />
		</div>
	);
}

/**
 * Card with Header and Content Skeleton
 */
export function CardSkeleton({
	headerHeight = 6,
	contentLines = 3,
}: {
	headerHeight?: number;
	contentLines?: number;
}) {
	return (
		<div className="rounded-xl border bg-card shadow-sm">
			<div className="p-6 border-b">
				<Skeleton className={`h-${headerHeight} w-40 mb-1`} />
				<Skeleton className="h-4 w-32" />
			</div>
			<div className="p-6 space-y-3">
				{Array.from({ length: contentLines }).map((_, i) => (
					<Skeleton key={i} className="h-4 w-full" style={{ width: `${100 - i * 15}%` }} />
				))}
			</div>
		</div>
	);
}

/**
 * Form Field Skeleton
 */
export function FormFieldSkeleton() {
	return (
		<div className="space-y-2">
			<Skeleton className="h-4 w-20" />
			<Skeleton className="h-10 w-full rounded-md" />
		</div>
	);
}

/**
 * Form Skeleton
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
	return (
		<div className="space-y-6">
			{Array.from({ length: fields }).map((_, i) => (
				<FormFieldSkeleton key={i} />
			))}
			<Skeleton className="h-10 w-28 rounded-md" />
		</div>
	);
}

/**
 * Image Gallery Skeleton
 */
export function ImageGallerySkeleton({ count = 4 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
			{Array.from({ length: count }).map((_, i) => (
				<Skeleton key={i} className="aspect-square rounded-lg" />
			))}
		</div>
	);
}

/**
 * Product Card Skeleton (for public product grid)
 */
export function ProductCardSkeleton() {
	return (
		<div className="rounded-lg border bg-card overflow-hidden">
			<Skeleton className="aspect-[4/3] w-full" />
			<div className="p-4 space-y-2">
				<Skeleton className="h-5 w-3/4" />
				<Skeleton className="h-4 w-1/2" />
				<div className="flex gap-2 mt-3">
					<Skeleton className="h-5 w-16 rounded-full" />
					<Skeleton className="h-5 w-20 rounded-full" />
				</div>
			</div>
		</div>
	);
}

/**
 * Product Grid Skeleton (for public product listing)
 */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: count }).map((_, i) => (
				<ProductCardSkeleton key={i} />
			))}
		</div>
	);
}

/**
 * Pagination Skeleton
 */
export function PaginationSkeleton() {
	return (
		<div className="flex justify-center gap-2 pt-4">
			<Skeleton className="h-9 w-24 rounded-md" />
			<Skeleton className="h-9 w-28" />
			<Skeleton className="h-9 w-20 rounded-md" />
		</div>
	);
}

/**
 * File Card Skeleton (for storage/media grid)
 */
export function FileCardSkeleton() {
	return (
		<div className="rounded-lg border bg-muted/30 overflow-hidden">
			<Skeleton className="aspect-square w-full" />
			<div className="p-3 space-y-1.5">
				<Skeleton className="h-4 w-3/4" />
				<div className="flex justify-between">
					<Skeleton className="h-3 w-12" />
					<Skeleton className="h-3 w-20" />
				</div>
			</div>
		</div>
	);
}

/**
 * File List Grid Skeleton (for storage manager)
 */
export function FileListSkeleton({ count = 8 }: { count?: number }) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{Array.from({ length: count }).map((_, i) => (
				<FileCardSkeleton key={i} />
			))}
		</div>
	);
}

/**
 * Storage Page Skeleton
 */
export function StoragePageSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<Skeleton className="h-8 w-32 mb-1" />
				<Skeleton className="h-4 w-72" />
			</div>

			{/* Tabs and content */}
			<div className="space-y-6">
				{/* Tab buttons */}
				<div className="flex gap-2">
					<Skeleton className="h-9 w-24 rounded-md" />
					<Skeleton className="h-9 w-28 rounded-md" />
				</div>

				{/* Upload area */}
				<div className="rounded-xl border bg-card shadow-sm p-6">
					<div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
						<Skeleton className="h-12 w-12 rounded-full mb-4" />
						<Skeleton className="h-5 w-48 mb-2" />
						<Skeleton className="h-4 w-36" />
					</div>
				</div>

				{/* File list card */}
				<div className="rounded-xl border bg-card shadow-sm">
					<div className="p-6 border-b flex justify-between items-center">
						<div>
							<Skeleton className="h-6 w-36 mb-1" />
							<Skeleton className="h-4 w-48" />
						</div>
						<Skeleton className="h-9 w-24 rounded-md" />
					</div>
					<div className="p-6">
						<FileListSkeleton count={8} />
					</div>
				</div>
			</div>

			{/* Info card */}
			<div className="bg-white rounded-lg shadow-sm border p-6">
				<Skeleton className="h-6 w-40 mb-4" />
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<Skeleton className="h-5 w-16 mb-2" />
						<Skeleton className="h-4 w-40 mb-1" />
						<Skeleton className="h-4 w-32" />
					</div>
					<div>
						<Skeleton className="h-5 w-24 mb-2" />
						<Skeleton className="h-4 w-36 mb-1" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * User Table Row Skeleton
 */
export function UserRowSkeleton() {
	return (
		<tr>
			<td className="px-6 py-4 whitespace-nowrap">
				<Skeleton className="h-5 w-32" />
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<Skeleton className="h-4 w-44" />
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<Skeleton className="h-5 w-16 rounded-full" />
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<Skeleton className="h-4 w-28" />
			</td>
			<td className="px-6 py-4 whitespace-nowrap">
				<Skeleton className="h-4 w-28" />
			</td>
		</tr>
	);
}

/**
 * Users Table Skeleton
 */
export function UsersTableSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left">
							<Skeleton className="h-3 w-12" />
						</th>
						<th className="px-6 py-3 text-left">
							<Skeleton className="h-3 w-12" />
						</th>
						<th className="px-6 py-3 text-left">
							<Skeleton className="h-3 w-14" />
						</th>
						<th className="px-6 py-3 text-left">
							<Skeleton className="h-3 w-16" />
						</th>
						<th className="px-6 py-3 text-left">
							<Skeleton className="h-3 w-20" />
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{Array.from({ length: count }).map((_, i) => (
						<UserRowSkeleton key={i} />
					))}
				</tbody>
			</table>
		</div>
	);
}

/**
 * Users Page Skeleton
 */
export function UsersPageSkeleton() {
	return (
		<div className="space-y-6">
			<div className="bg-white rounded-lg shadow-sm border">
				{/* Header */}
				<div className="border-b px-6 py-4 flex items-center justify-between">
					<div>
						<Skeleton className="h-8 w-44 mb-1" />
						<Skeleton className="h-4 w-52" />
					</div>
					<Skeleton className="h-10 w-32 rounded-md" />
				</div>

				{/* Users Table */}
				<div className="px-6 py-6">
					<Skeleton className="h-6 w-32 mb-4" />
					<UsersTableSkeleton count={5} />
				</div>
			</div>
		</div>
	);
}

// ============================================================================
// CLIENT-SIDE PAGE SKELETONS
// ============================================================================

/**
 * Product Detail Hero Skeleton
 * For the hero section of product detail pages
 */
export function ProductDetailHeroSkeleton() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-primary/10 pt-24 md:pt-28 pb-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Breadcrumb */}
				<div className="flex items-center gap-2 mb-6">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-32" />
				</div>

				{/* Back button */}
				<Skeleton className="h-9 w-44 rounded-md mb-6" />

				{/* Treatment badges */}
				<div className="flex gap-2 mb-4">
					<Skeleton className="h-6 w-24 rounded-full" />
					<Skeleton className="h-6 w-28 rounded-full" />
				</div>

				{/* Title */}
				<Skeleton className="h-12 w-3/4 max-w-2xl mb-6" />

				{/* Short description */}
				<Skeleton className="h-6 w-full max-w-3xl mb-2" />
				<Skeleton className="h-6 w-2/3 max-w-2xl mb-8" />

				{/* Certifications row */}
				<div className="flex flex-wrap items-center gap-4 mb-8">
					<Skeleton className="h-8 w-32 rounded-full" />
					<Skeleton className="h-8 w-28 rounded-full" />
					<Skeleton className="h-8 w-8 rounded-full ml-auto" />
				</div>

				{/* Main image gallery */}
				<Skeleton className="w-full aspect-video md:aspect-[21/9] rounded-2xl" />
			</div>
		</section>
	);
}

/**
 * Product Specifications Skeleton
 */
export function ProductSpecificationsSkeleton() {
	return (
		<div className="mb-12">
			<Skeleton className="h-8 w-64 mb-6" />
			<div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
				<div className="divide-y divide-slate-100">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="flex justify-between items-center py-4 px-6">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-5 w-40" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/**
 * Product Sidebar Skeleton
 */
export function ProductDetailSidebarSkeleton() {
	return (
		<div className="space-y-4">
			{/* Benefits card */}
			<div className="rounded-2xl bg-white border p-6">
				<Skeleton className="h-6 w-24 mb-4" />
				<div className="space-y-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex items-start gap-3">
							<Skeleton className="h-5 w-5 rounded-full shrink-0" />
							<Skeleton className="h-5 flex-1" />
						</div>
					))}
				</div>
			</div>

			{/* Video/Brochure card */}
			<div className="rounded-2xl bg-white border p-6">
				<Skeleton className="h-6 w-28 mb-4" />
				<Skeleton className="h-10 w-full rounded-md mb-3" />
				<Skeleton className="h-10 w-full rounded-md" />
			</div>
		</div>
	);
}

/**
 * Product FAQ Skeleton
 */
export function ProductFAQSkeleton() {
	return (
		<section className="py-12 md:py-16 bg-slate-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<Skeleton className="h-8 w-48 mb-8" />
				<div className="space-y-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="rounded-lg bg-white border p-4">
							<div className="flex justify-between items-center">
								<Skeleton className="h-5 w-3/4" />
								<Skeleton className="h-5 w-5 rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/**
 * Product Inquiry Form Skeleton
 */
export function ProductInquiryFormSkeleton() {
	return (
		<section className="py-12 md:py-16 bg-gradient-to-b from-white to-slate-50">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-8">
					<Skeleton className="h-8 w-64 mx-auto mb-4" />
					<Skeleton className="h-5 w-96 mx-auto" />
				</div>
				<div className="rounded-2xl bg-white border shadow-lg p-6 md:p-8">
					<div className="grid gap-6 md:grid-cols-2">
						<FormFieldSkeleton />
						<FormFieldSkeleton />
						<FormFieldSkeleton />
						<FormFieldSkeleton />
					</div>
					<div className="mt-6">
						<Skeleton className="h-32 w-full rounded-md mb-6" />
						<Skeleton className="h-11 w-full rounded-md" />
					</div>
				</div>
			</div>
		</section>
	);
}

/**
 * Full Product Detail Page Skeleton
 */
export function ProductDetailPageSkeleton() {
	return (
		<div className="min-h-screen">
			<ProductDetailHeroSkeleton />

			{/* Main content section */}
			<section className="py-12 md:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 lg:grid-cols-[1fr_340px]">
						{/* Main content */}
						<div>
							{/* Description */}
							<div className="mb-12">
								<Skeleton className="h-8 w-48 mb-6" />
								<div className="space-y-4">
									<Skeleton className="h-5 w-full" />
									<Skeleton className="h-5 w-full" />
									<Skeleton className="h-5 w-3/4" />
									<Skeleton className="h-5 w-full" />
									<Skeleton className="h-5 w-5/6" />
								</div>
							</div>

							{/* Specifications */}
							<ProductSpecificationsSkeleton />
						</div>

						{/* Sidebar */}
						<aside>
							<div className="sticky top-24">
								<ProductDetailSidebarSkeleton />
							</div>
						</aside>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<ProductFAQSkeleton />

			{/* Inquiry Form */}
			<ProductInquiryFormSkeleton />
		</div>
	);
}

/**
 * Products Listing Sidebar Skeleton
 */
export function ProductSidebarSkeleton() {
	return (
		<div className="space-y-6">
			{/* Search */}
			<div className="rounded-2xl bg-white border p-4">
				<Skeleton className="h-10 w-full rounded-md" />
			</div>

			{/* Categories */}
			<div className="rounded-2xl bg-white border p-4">
				<Skeleton className="h-5 w-24 mb-4" />
				<div className="space-y-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3">
							<Skeleton className="h-4 w-4 rounded" />
							<Skeleton className="h-4 flex-1" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/**
 * Products Listing Page Skeleton
 */
export function ProductsListingPageSkeleton() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-100 to-primary/10">
			<div className="max-w-7xl mx-auto px-4 py-8 pt-24 md:pt-28">
				{/* Breadcrumb */}
				<div className="flex items-center gap-2 mb-6">
					<Skeleton className="h-4 w-20" />
				</div>

				{/* Header */}
				<div className="mb-8">
					<Skeleton className="h-12 w-64 mb-3" />
					<Skeleton className="h-6 w-full max-w-3xl mb-1" />
					<Skeleton className="h-6 w-2/3 max-w-2xl" />
				</div>

				{/* Main layout */}
				<div className="flex flex-col gap-8 lg:flex-row">
					{/* Sidebar */}
					<div className="w-full lg:w-80 lg:shrink-0 hidden sm:block">
						<ProductSidebarSkeleton />
					</div>

					{/* Main content */}
					<div className="flex-1">
						{/* Toolbar */}
						<div className="mb-6">
							<Skeleton className="h-5 w-32" />
						</div>

						{/* Products grid */}
						<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<ProductCardSkeleton key={i} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Blog Card Skeleton (for listings)
 */
export function BlogCardSkeleton() {
	return (
		<div className="rounded-2xl bg-white border overflow-hidden">
			<Skeleton className="aspect-[16/10] w-full" />
			<div className="p-5">
				{/* Category & date */}
				<div className="flex items-center gap-3 mb-3">
					<Skeleton className="h-5 w-20 rounded-full" />
					<Skeleton className="h-4 w-24" />
				</div>
				{/* Title */}
				<Skeleton className="h-6 w-full mb-2" />
				<Skeleton className="h-6 w-3/4 mb-3" />
				{/* Excerpt */}
				<Skeleton className="h-4 w-full mb-1" />
				<Skeleton className="h-4 w-5/6 mb-4" />
				{/* Author */}
				<div className="flex items-center gap-3">
					<Skeleton className="h-8 w-8 rounded-full" />
					<Skeleton className="h-4 w-24" />
				</div>
			</div>
		</div>
	);
}

/**
 * Blog Listing Hero Skeleton
 */
export function BlogHeroSkeleton() {
	return (
		<section className="relative bg-gradient-to-b from-slate-50 to-white pt-24 md:pt-28 pb-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<Skeleton className="h-5 w-20 rounded-full mx-auto mb-4" />
				<Skeleton className="h-12 w-64 mx-auto mb-4" />
				<Skeleton className="h-6 w-full max-w-2xl mx-auto mb-2" />
				<Skeleton className="h-6 w-3/4 max-w-xl mx-auto mb-8" />
				{/* Search */}
				<Skeleton className="h-12 w-full max-w-md mx-auto rounded-full" />
			</div>
		</section>
	);
}

/**
 * Blog Listing Page Skeleton
 */
export function BlogListingPageSkeleton() {
	return (
		<div className="min-h-screen">
			<BlogHeroSkeleton />

			<section className="py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 lg:grid-cols-[1fr_300px]">
						{/* Main content */}
						<div>
							{/* Category tabs */}
							<div className="flex gap-2 mb-8 flex-wrap">
								{Array.from({ length: 5 }).map((_, i) => (
									<Skeleton key={i} className="h-9 w-24 rounded-full" />
								))}
							</div>

							{/* Blog grid */}
							<div className="grid gap-6 md:grid-cols-2">
								{Array.from({ length: 4 }).map((_, i) => (
									<BlogCardSkeleton key={i} />
								))}
							</div>
						</div>

						{/* Sidebar */}
						<aside className="hidden lg:block">
							<div className="sticky top-24 space-y-6">
								<div className="rounded-2xl bg-white border p-5">
									<Skeleton className="h-5 w-32 mb-4" />
									<div className="space-y-3">
										{Array.from({ length: 4 }).map((_, i) => (
											<div key={i} className="flex gap-3">
												<Skeleton className="h-16 w-16 rounded-lg shrink-0" />
												<div className="flex-1">
													<Skeleton className="h-4 w-full mb-1" />
													<Skeleton className="h-3 w-20" />
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</section>
		</div>
	);
}

/**
 * Blog Detail Hero Skeleton
 */
export function BlogDetailHeroSkeleton() {
	return (
		<section className="relative bg-gradient-to-b from-slate-50 to-white pt-24 md:pt-28 pb-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Back button */}
				<Skeleton className="h-9 w-36 rounded-md mb-6" />

				{/* Category & date */}
				<div className="flex items-center gap-4 mb-4">
					<Skeleton className="h-6 w-24 rounded-full" />
					<Skeleton className="h-4 w-32" />
				</div>

				{/* Title */}
				<Skeleton className="h-10 w-full mb-2" />
				<Skeleton className="h-10 w-3/4 mb-6" />

				{/* Excerpt */}
				<Skeleton className="h-6 w-full mb-1" />
				<Skeleton className="h-6 w-5/6 mb-8" />

				{/* Author */}
				<div className="flex items-center gap-4 mb-8">
					<Skeleton className="h-12 w-12 rounded-full" />
					<div>
						<Skeleton className="h-5 w-32 mb-1" />
						<Skeleton className="h-4 w-24" />
					</div>
				</div>

				{/* Featured image */}
				<Skeleton className="w-full aspect-video rounded-2xl" />
			</div>
		</section>
	);
}

/**
 * Blog Detail Page Skeleton
 */
export function BlogDetailPageSkeleton() {
	return (
		<div className="min-h-screen">
			<BlogDetailHeroSkeleton />

			{/* Content */}
			<section className="py-16">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<Skeleton
								key={i}
								className="h-5 w-full"
								style={{ width: `${100 - (i % 3) * 10}%` }}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Author section */}
			<section className="py-16 bg-slate-50">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-start gap-6">
						<Skeleton className="h-20 w-20 rounded-full shrink-0" />
						<div className="flex-1">
							<Skeleton className="h-6 w-40 mb-2" />
							<Skeleton className="h-4 w-24 mb-3" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
						</div>
					</div>
				</div>
			</section>

			{/* Related posts */}
			<section className="py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<Skeleton className="h-8 w-48 mb-8" />
					<div className="grid gap-6 md:grid-cols-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<BlogCardSkeleton key={i} />
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

// ============================================================================
// KLINIKUTRUSTNING PAGE SKELETONS
// ============================================================================

/**
 * Klinikutrustning Product Card Skeleton
 * Modern card with shimmer effect matching ProductCardDB component
 */
export function KlinikutrustningCardSkeleton() {
	return (
		<div className="group h-full overflow-hidden rounded-lg border border-primary/10 bg-card">
			{/* Image placeholder with gradient overlay */}
			<div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-slate-100">
				<Skeleton className="absolute inset-0 rounded-none" />
				{/* Decorative shimmer overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
			</div>

			{/* Content */}
			<div className="p-3 space-y-2">
				{/* Title */}
				<Skeleton className="h-5 w-4/5" />

				{/* Description */}
				<div className="space-y-1">
					<Skeleton className="h-3 w-full" />
					<Skeleton className="h-3 w-3/4" />
				</div>

				{/* Treatment badges */}
				<div className="flex flex-wrap gap-1 pt-1">
					<Skeleton className="h-5 w-16 rounded-full" />
					<Skeleton className="h-5 w-20 rounded-full" />
					<Skeleton className="h-5 w-14 rounded-full" />
				</div>

				{/* Button */}
				<Skeleton className="h-8 w-full rounded-md mt-2" />
			</div>
		</div>
	);
}

/**
 * Klinikutrustning Sidebar Skeleton
 * Matches KlinikutrustningaSidebar component
 */
export function KlinikutrustningaSidebarSkeleton() {
	return (
		<aside className="space-y-6">
			{/* Categories Filter Card */}
			<div className="rounded-lg border border-primary/50 bg-card/80 backdrop-blur-sm overflow-hidden">
				<div className="px-3 py-3">
					<Skeleton className="h-6 w-44 mb-3" />
					<Skeleton className="h-9 w-full rounded-lg" />
				</div>
				<div className="h-px bg-primary/50 my-2" />
				<div className="px-3 pb-3 space-y-2">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-8 w-full rounded-lg" />
					))}
				</div>
			</div>

			{/* Help Card */}
			<div className="rounded-lg border border-primary/50 bg-gradient-to-br from-primary/20 to-slate-100 p-4">
				<Skeleton className="h-5 w-32 mb-3" />
				<Skeleton className="h-4 w-full mb-1" />
				<Skeleton className="h-4 w-4/5 mb-4" />
				<Skeleton className="h-10 w-28 rounded-lg" />
			</div>

			{/* Features Card */}
			<div className="rounded-lg border border-primary/50 bg-card/80 backdrop-blur-sm p-4">
				<Skeleton className="h-5 w-36 mb-4" />
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-start gap-3">
							<Skeleton className="h-8 w-8 rounded-full shrink-0" />
							<div className="flex-1 space-y-1">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-3 w-full" />
							</div>
						</div>
					))}
				</div>
			</div>
		</aside>
	);
}

/**
 * Klinikutrustning Page Skeleton
 * Full page skeleton for /klinikutrustning/ route
 */
export function KlinikutrustningPageSkeleton() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-100 to-primary/10">
			<div className="max-w-7xl mx-auto px-4 py-8 pt-24 md:pt-28">
				{/* Breadcrumb */}
				<div className="flex items-center gap-2 mb-6">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-28" />
				</div>

				{/* Page Header */}
				<div className="mb-8">
					<Skeleton className="h-12 w-72 mb-3 md:h-14" />
					<Skeleton className="h-6 w-full max-w-3xl mb-1" />
					<Skeleton className="h-6 w-2/3 max-w-2xl" />
				</div>

				{/* Main Layout */}
				<div className="flex flex-col gap-8 lg:flex-row">
					{/* Sidebar - Hidden on mobile */}
					<div className="w-full lg:w-80 lg:shrink-0 hidden sm:block">
						<div className="lg:sticky lg:top-28">
							<KlinikutrustningaSidebarSkeleton />
						</div>
					</div>

					{/* Mobile Filter Button */}
					<div className="flex justify-end sm:hidden">
						<Skeleton className="h-9 w-10 rounded-md" />
					</div>

					{/* Main Content */}
					<div className="flex-1">
						{/* Toolbar */}
						<div className="mb-6">
							<Skeleton className="h-5 w-32" />
						</div>

						{/* Products Grid */}
						<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<KlinikutrustningCardSkeleton key={i} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Klinikutrustning Category Page Skeleton
 * For /klinikutrustning/[category]/ route
 */
export function KlinikutrustningCategoryPageSkeleton() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-100 to-primary/10">
			<div className="max-w-7xl mx-auto px-4 py-8 pt-24 md:pt-28">
				{/* Breadcrumb */}
				<div className="flex items-center gap-2 mb-6">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-24" />
				</div>

				{/* Page Header */}
				<div className="mb-8">
					<Skeleton className="h-12 w-56 mb-3 md:h-14" />
					<Skeleton className="h-6 w-full max-w-2xl" />
				</div>

				{/* Main Layout */}
				<div className="flex flex-col gap-8 lg:flex-row">
					{/* Sidebar - Hidden on mobile */}
					<div className="w-full lg:w-80 lg:shrink-0 hidden sm:block">
						<div className="lg:sticky lg:top-28">
							<KlinikutrustningaSidebarSkeleton />
						</div>
					</div>

					{/* Mobile Filter Button */}
					<div className="flex justify-end sm:hidden">
						<Skeleton className="h-9 w-10 rounded-md" />
					</div>

					{/* Main Content */}
					<div className="flex-1">
						{/* Toolbar */}
						<div className="mb-6">
							<Skeleton className="h-5 w-44" />
						</div>

						{/* Products Grid */}
						<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<KlinikutrustningCardSkeleton key={i} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Klinikutrustning Product Detail Page Skeleton
 * For /klinikutrustning/[category]/[slug]/ route
 */
export function KlinikutrustningDetailPageSkeleton() {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-primary/10 pt-24 md:pt-28 pb-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Breadcrumb */}
					<div className="flex items-center gap-2 mb-6">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-32" />
					</div>

					{/* Back button */}
					<Skeleton className="h-9 w-44 rounded-md mb-6" />

					{/* Treatment badges */}
					<div className="flex gap-2 mb-4">
						<Skeleton className="h-6 w-28 rounded-full" />
						<Skeleton className="h-6 w-32 rounded-full" />
					</div>

					{/* Title */}
					<Skeleton className="h-12 w-3/4 max-w-2xl mb-6" />

					{/* Short description */}
					<Skeleton className="h-6 w-full max-w-3xl mb-2" />
					<Skeleton className="h-6 w-2/3 max-w-2xl mb-8" />

					{/* Certifications */}
					<div className="flex flex-wrap items-center gap-4 mb-8">
						<Skeleton className="h-8 w-32 rounded-full" />
						<Skeleton className="h-8 w-28 rounded-full" />
					</div>

					{/* Main image */}
					<Skeleton className="w-full aspect-video md:aspect-[21/9] rounded-2xl" />
				</div>
			</section>

			{/* Content Section */}
			<section className="py-12 md:py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 lg:grid-cols-[1fr_340px]">
						{/* Main Content */}
						<div>
							{/* Description */}
							<div className="mb-12">
								<Skeleton className="h-8 w-48 mb-6" />
								<div className="space-y-4">
									<Skeleton className="h-5 w-full" />
									<Skeleton className="h-5 w-full" />
									<Skeleton className="h-5 w-3/4" />
									<Skeleton className="h-5 w-full" />
									<Skeleton className="h-5 w-5/6" />
								</div>
							</div>

							{/* Specifications */}
							<ProductSpecificationsSkeleton />
						</div>

						{/* Sidebar */}
						<aside>
							<div className="sticky top-24">
								<ProductDetailSidebarSkeleton />
							</div>
						</aside>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<ProductFAQSkeleton />

			{/* Inquiry Form */}
			<ProductInquiryFormSkeleton />
		</div>
	);
}

// ============================================================================
// FAQ PAGE SKELETON
// ============================================================================

/**
 * FAQ Hero Skeleton
 */
export function FAQHeroSkeleton() {
	return (
		<section className="relative bg-gradient-to-b from-slate-50 to-white pt-24 md:pt-32 pb-16">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<Skeleton className="h-6 w-20 rounded-full mx-auto mb-4" />
				<Skeleton className="h-12 w-80 mx-auto mb-4" />
				<Skeleton className="h-6 w-full max-w-2xl mx-auto mb-2" />
				<Skeleton className="h-6 w-3/4 max-w-xl mx-auto" />
			</div>
		</section>
	);
}

/**
 * FAQ Accordion Skeleton
 */
export function FAQAccordionSkeleton() {
	return (
		<div className="space-y-4">
			{/* Search bar */}
			<Skeleton className="h-12 w-full rounded-lg mb-6" />

			{/* FAQ Items */}
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="rounded-lg border bg-white p-4">
					<div className="flex justify-between items-center">
						<Skeleton className="h-5 w-3/4" />
						<Skeleton className="h-5 w-5 rounded" />
					</div>
				</div>
			))}
		</div>
	);
}

/**
 * FAQ Sidebar Skeleton
 */
export function FAQSidebarSkeleton() {
	return (
		<div className="space-y-6">
			{/* Contact Card */}
			<div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-white p-6">
				<Skeleton className="h-12 w-12 rounded-full mb-4" />
				<Skeleton className="h-6 w-36 mb-2" />
				<Skeleton className="h-4 w-full mb-1" />
				<Skeleton className="h-4 w-4/5 mb-4" />
				<Skeleton className="h-10 w-full rounded-lg" />
			</div>

			{/* Quick Links Card */}
			<div className="rounded-2xl border bg-white p-6">
				<Skeleton className="h-5 w-28 mb-4" />
				<div className="space-y-3">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3">
							<Skeleton className="h-5 w-5 rounded" />
							<Skeleton className="h-4 w-32" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/**
 * FAQ Page Skeleton
 */
export function FAQPageSkeleton() {
	return (
		<div className="min-h-screen bg-slate-100">
			<FAQHeroSkeleton />

			<section className="py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
						{/* FAQ Accordion */}
						<div className="lg:col-span-2 order-2 lg:order-1">
							<FAQAccordionSkeleton />
						</div>

						{/* Sidebar */}
						<div className="lg:col-span-1 order-1 lg:order-2">
							<div className="lg:sticky lg:top-24">
								<FAQSidebarSkeleton />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Newsletter Section */}
			<section className="py-16 bg-secondary">
				<div className="max-w-2xl mx-auto px-4 text-center">
					<Skeleton className="h-8 w-48 mx-auto mb-4 bg-white/20" />
					<Skeleton className="h-5 w-full max-w-md mx-auto mb-6 bg-white/20" />
					<div className="flex gap-3 max-w-md mx-auto">
						<Skeleton className="h-12 flex-1 rounded-lg bg-white/20" />
						<Skeleton className="h-12 w-28 rounded-lg bg-white/20" />
					</div>
				</div>
			</section>
		</div>
	);
}

// ============================================================================
// CONTACT PAGE SKELETON
// ============================================================================

/**
 * Contact Hero Skeleton
 */
export function ContactHeroSkeleton() {
	return (
		<section className="relative bg-gradient-to-b from-primary/30 to-primary/10 pt-24 md:pt-32 pb-20">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<Skeleton className="h-6 w-28 rounded-full mx-auto mb-6" />
				<Skeleton className="h-14 w-72 mx-auto mb-4 md:h-16" />
				<Skeleton className="h-6 w-full max-w-2xl mx-auto mb-2" />
				<Skeleton className="h-6 w-3/4 max-w-xl mx-auto mb-8" />
				<div className="flex flex-wrap justify-center gap-4">
					<Skeleton className="h-12 w-40 rounded-lg" />
					<Skeleton className="h-12 w-44 rounded-lg" />
				</div>
			</div>
		</section>
	);
}

/**
 * Contact Cards Skeleton
 */
export function ContactCardsSkeleton() {
	return (
		<section className="py-16 -mt-12">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid gap-6 md:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="rounded-2xl bg-white border shadow-lg p-6 text-center">
							<Skeleton className="h-14 w-14 rounded-full mx-auto mb-4" />
							<Skeleton className="h-6 w-28 mx-auto mb-2" />
							<Skeleton className="h-5 w-36 mx-auto mb-4" />
							<Skeleton className="h-10 w-32 rounded-lg mx-auto" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/**
 * Contact Form Section Skeleton
 */
export function ContactFormSectionSkeleton() {
	return (
		<div className="rounded-2xl bg-white border shadow-lg p-8">
			<Skeleton className="h-8 w-48 mb-2" />
			<Skeleton className="h-5 w-72 mb-8" />
			<div className="grid gap-6 md:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="space-y-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-11 w-full rounded-md" />
					</div>
				))}
			</div>
			<div className="mt-6 space-y-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-32 w-full rounded-md" />
			</div>
			<Skeleton className="h-12 w-full rounded-md mt-6" />
		</div>
	);
}

/**
 * Office Locations Skeleton
 */
export function OfficeLocationsSkeleton() {
	return (
		<div>
			<div className="text-center mb-12">
				<Skeleton className="h-8 w-40 mx-auto mb-4" />
				<Skeleton className="h-5 w-64 mx-auto" />
			</div>
			<div className="grid gap-8 md:grid-cols-2">
				{Array.from({ length: 2 }).map((_, i) => (
					<div key={i} className="rounded-2xl bg-white border p-6">
						<Skeleton className="h-6 w-32 mb-2" />
						<Skeleton className="h-5 w-48 mb-1" />
						<Skeleton className="h-5 w-40 mb-4" />
						<Skeleton className="h-48 w-full rounded-lg" />
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * Contact Page Skeleton
 */
export function ContactPageSkeleton() {
	return (
		<div className="bg-primary/50 w-full min-h-screen">
			<ContactHeroSkeleton />
			<ContactCardsSkeleton />

			{/* Form Section */}
			<section className="py-16 bg-white">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					<ContactFormSectionSkeleton />
				</div>
			</section>

			{/* Office Locations */}
			<section className="py-16 bg-slate-50">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<OfficeLocationsSkeleton />
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-16 bg-white">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-8">
						<Skeleton className="h-8 w-44 mx-auto mb-4" />
						<Skeleton className="h-5 w-56 mx-auto" />
					</div>
					<div className="space-y-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="rounded-lg border bg-white p-4">
								<div className="flex justify-between items-center">
									<Skeleton className="h-5 w-3/4" />
									<Skeleton className="h-5 w-5 rounded" />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}

// ============================================================================
// ABOUT PAGE SKELETON
// ============================================================================

/**
 * About Page Skeleton
 */
export function AboutPageSkeleton() {
	return (
		<div className="max-w-7xl mx-auto px-4 py-8 pt-24 md:pt-28">
			{/* Hero Section */}
			<div className="mb-16 text-center">
				<Skeleton className="h-12 w-72 mx-auto mb-4 md:h-14" />
				<Skeleton className="h-6 w-full max-w-xl mx-auto" />
			</div>

			{/* Content Sections */}
			<div className="space-y-12">
				{/* Section 1 */}
				<section>
					<Skeleton className="h-9 w-56 mb-4" />
					<div className="space-y-4">
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-3/4" />
					</div>
				</section>

				{/* Section 2 - Highlighted */}
				<section className="rounded-lg bg-muted/50 p-8">
					<Skeleton className="h-9 w-48 mb-4" />
					<div className="space-y-4">
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-5/6" />
					</div>
				</section>

				{/* Section 3 */}
				<section>
					<Skeleton className="h-9 w-52 mb-4" />
					<div className="space-y-4">
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-4/5" />
					</div>
				</section>

				{/* CTA Section */}
				<section className="rounded-lg bg-secondary/5 p-8 text-center">
					<Skeleton className="h-9 w-40 mx-auto mb-4" />
					<Skeleton className="h-5 w-full max-w-2xl mx-auto mb-6" />
					<div className="flex flex-wrap justify-center gap-4">
						<Skeleton className="h-12 w-36 rounded-lg" />
						<Skeleton className="h-12 w-36 rounded-lg" />
					</div>
				</section>
			</div>

			{/* Feature Cards */}
			<div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="rounded-lg border border-primary/20 p-6">
						<Skeleton className="h-12 w-12 rounded-lg mb-4" />
						<Skeleton className="h-5 w-36 mb-2" />
						<Skeleton className="h-4 w-full mb-1" />
						<Skeleton className="h-4 w-4/5 mb-4" />
						<Skeleton className="h-8 w-20 rounded-md" />
					</div>
				))}
			</div>

			{/* Company Info */}
			<div className="mt-16 rounded-lg bg-muted/30 p-8 text-center">
				<Skeleton className="h-6 w-40 mx-auto mb-4" />
				<Skeleton className="h-5 w-48 mx-auto mb-4" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-64 mx-auto" />
					<Skeleton className="h-4 w-56 mx-auto" />
				</div>
			</div>
		</div>
	);
}

// ============================================================================
// STARTA EGET PAGE SKELETON
// ============================================================================

/**
 * Starta Eget Page Skeleton
 */
export function StartaEgetPageSkeleton() {
	return (
		<div className="max-w-7xl mx-auto px-4 py-12 pt-24 md:pt-28">
			{/* Hero Section */}
			<div className="mb-16 text-center">
				<Skeleton className="h-12 w-full max-w-xl mx-auto mb-3 md:h-14" />
				<Skeleton className="h-12 w-72 mx-auto mb-6" />
				<Skeleton className="h-6 w-full max-w-3xl mx-auto mb-2" />
				<Skeleton className="h-6 w-4/5 max-w-2xl mx-auto mb-4" />
				<Skeleton className="h-6 w-64 mx-auto" />
			</div>

			{/* Main Content */}
			<section className="mb-20">
				{/* Highlighted section */}
				<div className="mb-12 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-8 md:p-12">
					<Skeleton className="h-9 w-64 mb-4" />
					<Skeleton className="h-6 w-48 mb-4" />
					<div className="space-y-4">
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-3/4" />
					</div>
				</div>

				{/* Benefits Cards */}
				<div className="mb-12 grid gap-8 md:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="rounded-lg border border-primary/20 p-8">
							<Skeleton className="h-16 w-16 rounded-lg mb-4" />
							<Skeleton className="h-6 w-40 mb-3" />
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-4 w-3/4" />
						</div>
					))}
				</div>
			</section>

			{/* Info Section */}
			<section className="mb-20">
				<div className="rounded-lg border border-primary/20 bg-card p-8 md:p-12">
					<Skeleton className="h-9 w-80 mb-6" />
					<Skeleton className="h-5 w-full max-w-2xl mb-6" />
					<div className="space-y-6">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={i} className="flex gap-4">
								<Skeleton className="h-10 w-10 rounded-lg shrink-0" />
								<div className="flex-1">
									<Skeleton className="h-5 w-44 mb-2" />
									<Skeleton className="h-4 w-full" />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Form Section */}
			<section className="mb-20">
				<div className="max-w-3xl mx-auto">
					<div className="text-center mb-8">
						<Skeleton className="h-8 w-56 mx-auto mb-4" />
						<Skeleton className="h-5 w-72 mx-auto" />
					</div>
					<div className="rounded-2xl border bg-white shadow-lg p-8">
						<div className="grid gap-6 md:grid-cols-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-11 w-full rounded-md" />
								</div>
							))}
						</div>
						<div className="mt-6 space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-24 w-full rounded-md" />
						</div>
						<Skeleton className="h-12 w-full rounded-md mt-6" />
					</div>
				</div>
			</section>

			{/* Resources Grid */}
			<section>
				<div className="mb-8 text-center">
					<Skeleton className="h-9 w-48 mx-auto mb-3" />
					<Skeleton className="h-5 w-64 mx-auto" />
				</div>
				<div className="grid gap-8 md:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="rounded-lg border border-primary/20 p-8">
							<Skeleton className="h-16 w-16 rounded-lg mb-4" />
							<Skeleton className="h-6 w-48 mb-3" />
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-4 w-3/4 mb-6" />
							<Skeleton className="h-10 w-full rounded-md" />
						</div>
					))}
				</div>
			</section>
		</div>
	);
}

// ============================================================================
// UTBILDNINGAR PAGE SKELETON
// ============================================================================

/**
 * Utbildningar Page Skeleton
 */
export function UtbildningarPageSkeleton() {
	return (
		<div className="max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-16">
			{/* Hero Section */}
			<div className="mb-16 text-center">
				<Skeleton className="h-12 w-full max-w-2xl mx-auto mb-3 md:h-14" />
				<Skeleton className="h-12 w-48 mx-auto mb-6" />
				<Skeleton className="h-6 w-full max-w-3xl mx-auto mb-2" />
				<Skeleton className="h-6 w-4/5 max-w-2xl mx-auto" />
			</div>

			{/* Main Content */}
			<section className="mb-20">
				{/* Highlighted Section */}
				<div className="mb-12 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-8 md:p-12">
					<Skeleton className="h-9 w-56 mb-6" />
					<div className="space-y-4">
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-full" />
						<Skeleton className="h-5 w-3/4" />
					</div>
				</div>

				{/* Benefits Cards */}
				<div className="mb-12 grid gap-8 md:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="rounded-lg border border-primary/20 p-8">
							<Skeleton className="h-16 w-16 rounded-lg mb-4" />
							<Skeleton className="h-6 w-48 mb-3" />
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-4 w-3/4" />
						</div>
					))}
				</div>
			</section>

			{/* Training Process */}
			<section className="mb-20">
				<div className="mb-12 text-center">
					<Skeleton className="h-9 w-52 mx-auto mb-4" />
					<Skeleton className="h-5 w-full max-w-xl mx-auto" />
				</div>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i}>
							<Skeleton className="h-12 w-12 rounded-full mb-4" />
							<Skeleton className="h-5 w-36 mb-2" />
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-4 w-4/5" />
						</div>
					))}
				</div>
			</section>

			{/* Support Section */}
			<section className="mb-20">
				<div className="rounded-lg border border-primary/20 bg-card p-8 md:p-12">
					<div className="grid gap-8 md:grid-cols-2">
						<div>
							<Skeleton className="h-8 w-64 mb-4" />
							<Skeleton className="h-5 w-full mb-2" />
							<Skeleton className="h-5 w-full mb-2" />
							<Skeleton className="h-5 w-3/4 mb-6" />
							<div className="flex flex-wrap gap-4">
								<Skeleton className="h-10 w-32 rounded-md" />
								<Skeleton className="h-10 w-36 rounded-md" />
							</div>
						</div>
						<div className="flex items-center justify-center">
							<Skeleton className="h-48 w-48 rounded-lg" />
						</div>
					</div>
				</div>
			</section>

			{/* Form Section */}
			<section className="mb-20">
				<div className="max-w-5xl mx-auto">
					<div className="mb-12 text-center">
						<Skeleton className="h-6 w-40 rounded-full mx-auto mb-4" />
						<Skeleton className="h-10 w-72 mx-auto mb-4" />
						<Skeleton className="h-5 w-full max-w-xl mx-auto" />
					</div>
					<div className="rounded-2xl border bg-white shadow-lg p-8">
						<div className="grid gap-6 md:grid-cols-2">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-11 w-full rounded-md" />
								</div>
							))}
						</div>
						<div className="mt-6 space-y-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-24 w-full rounded-md" />
						</div>
						<Skeleton className="h-12 w-full rounded-md mt-6" />
					</div>
				</div>
			</section>

			{/* Resources Grid */}
			<section>
				<div className="mb-8 text-center">
					<Skeleton className="h-9 w-52 mx-auto mb-3" />
					<Skeleton className="h-5 w-56 mx-auto" />
				</div>
				<div className="grid gap-8 md:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="rounded-lg border border-primary/20 p-8">
							<Skeleton className="h-16 w-16 rounded-lg mb-4" />
							<Skeleton className="h-6 w-40 mb-3" />
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-4 w-3/4 mb-6" />
							<Skeleton className="h-10 w-full rounded-md" />
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
