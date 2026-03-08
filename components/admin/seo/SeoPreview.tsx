"use client";

import { Monitor, Smartphone, Globe, Facebook, Twitter } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

// Default site URL for SEO preview - used at build time
const DEFAULT_SITE_URL = "https://www.synos.se";

// Extract domain from URL for display
function extractDomain(url: string): string {
	try {
		const parsed = new URL(url);
		return parsed.hostname.replace("www.", "");
	} catch {
		return "synos.se";
	}
}

/**
 * SEO Preview Data
 */
export interface SeoPreviewData {
	title: string;
	description: string;
	slug: string;
	ogImage?: string | null;
	siteUrl?: string;
	siteName?: string;
	productTitle?: string; // Fallback title from product
}

interface SeoPreviewProps {
	data: SeoPreviewData;
	className?: string;
}

/**
 * Google Search Result Preview - Mobile
 */
function GoogleMobilePreview({
	data,
	defaultDomain,
}: {
	data: SeoPreviewData;
	defaultDomain: string;
}) {
	const displayTitle = data.title || data.productTitle || "Product Title";
	const displayDescription =
		data.description ||
		"Add a meta description to improve your search appearance.";
	const displayUrl = `${data.siteUrl || defaultDomain} › produkter › ${
		data.slug || "product-slug"
	}`;

	// Truncate title for mobile (typically ~60 chars visible)
	const truncatedTitle =
		displayTitle.length > 60
			? displayTitle.substring(0, 57) + "..."
			: displayTitle;

	// Truncate description for mobile (typically ~120 chars visible)
	const truncatedDesc =
		displayDescription.length > 120
			? displayDescription.substring(0, 117) + "..."
			: displayDescription;

	return (
		<div className="bg-white rounded-lg border border-slate-200 p-4 max-w-[400px]">
			{/* Mobile Search Result */}
			<div className="space-y-1">
				{/* URL with favicon */}
				<div className="flex items-center gap-2 text-sm">
					<div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
						<Globe className="w-4 h-4 text-slate-500" />
					</div>
					<div className="min-w-0">
						<div className="text-sm text-slate-700 font-medium truncate">
							{data.siteName || "Synos"}
						</div>
						<div className="text-xs text-slate-500 truncate">
							{displayUrl}
						</div>
					</div>
				</div>

				{/* Title */}
				<h3 className="text-lg text-blue-800 hover:underline cursor-pointer leading-tight font-normal">
					{truncatedTitle}
				</h3>

				{/* Description with date */}
				<p className="text-sm text-slate-600 leading-relaxed">
					<span className="text-slate-500">
						{new Date().toLocaleDateString("sv-SE", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</span>
					{" — "}
					{truncatedDesc}
				</p>
			</div>
		</div>
	);
}

/**
 * Google Search Result Preview - Desktop
 */
function GoogleDesktopPreview({
	data,
	defaultDomain,
}: {
	data: SeoPreviewData;
	defaultDomain: string;
}) {
	const displayTitle = data.title || data.productTitle || "Product Title";
	const displayDescription =
		data.description ||
		"Add a meta description to improve your search appearance.";
	const displayUrl = `https://${
		data.siteUrl || defaultDomain
	}/products/category/uncategorized/${data.slug || "product-slug"}`;

	// Desktop shows more characters
	const truncatedTitle =
		displayTitle.length > 70
			? displayTitle.substring(0, 67) + "..."
			: displayTitle;

	const truncatedDesc =
		displayDescription.length > 160
			? displayDescription.substring(0, 157) + "..."
			: displayDescription;

	return (
		<div className="bg-white rounded-lg border border-slate-200 p-4 max-w-[600px]">
			{/* Desktop Search Result */}
			<div className="space-y-1">
				{/* URL with favicon */}
				<div className="flex items-center gap-2">
					<div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
						<Globe className="w-4 h-4 text-slate-500" />
					</div>
					<div className="min-w-0">
						<div className="text-sm text-slate-800">
							{data.siteName || "Synos"}
						</div>
						<div className="text-xs text-slate-600 truncate">
							{displayUrl}
						</div>
					</div>
				</div>

				{/* Title */}
				<h3 className="text-xl text-blue-800 hover:underline cursor-pointer leading-snug font-normal">
					{truncatedTitle}
				</h3>

				{/* Description with date */}
				<p className="text-sm text-slate-600 leading-relaxed">
					<span className="text-slate-500">
						{new Date().toLocaleDateString("sv-SE", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</span>
					{" — "}
					{truncatedDesc}
				</p>
			</div>
		</div>
	);
}

/**
 * Facebook/Open Graph Share Preview
 * Recommended image size: 1200x630px (1.91:1 aspect ratio)
 */
function FacebookPreview({
	data,
	defaultDomain,
}: {
	data: SeoPreviewData;
	defaultDomain: string;
}) {
	const displayTitle = data.title || data.productTitle || "Product Title";
	const displayDescription =
		data.description || "Add a meta description for better social sharing.";
	const displayUrl = data.siteUrl || defaultDomain;

	return (
		<div className="bg-white rounded-lg border border-slate-300 overflow-hidden max-w-[500px] w-full">
			{/* OG Image - 1.91:1 aspect ratio (1200x630px recommended) */}
			<div
				className="relative w-full bg-slate-100"
				style={{ aspectRatio: "1.91 / 1" }}
			>
				{data.ogImage ? (
					<Image
						src={data.ogImage}
						alt="Open Graph preview"
						fill
						className="object-cover"
						sizes="500px"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
						<div className="text-center text-slate-400">
							<Globe className="w-12 h-12 mx-auto mb-2" />
							<p className="text-sm">No OG image set</p>
							<p className="text-xs">Recommended: 1200x630px</p>
						</div>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-3 bg-[#f2f3f5] border-t border-slate-200">
				<div className="text-xs text-slate-500 uppercase tracking-wide">
					{displayUrl}
				</div>
				<h4 className="text-base font-semibold text-slate-900 mt-1 line-clamp-2 leading-tight">
					{displayTitle}
				</h4>
				<p className="text-sm text-slate-600 mt-1 line-clamp-2 leading-snug">
					{displayDescription}
				</p>
			</div>
		</div>
	);
}

/**
 * Twitter Card Preview
 * Recommended image size: 1200x628px (1.91:1 aspect ratio) for summary_large_image
 * Twitter also accepts 2:1 ratio images
 */
function TwitterPreview({
	data,
	defaultDomain,
}: {
	data: SeoPreviewData;
	defaultDomain: string;
}) {
	const displayTitle = data.title || data.productTitle || "Product Title";
	const displayDescription =
		data.description || "Add a meta description for better social sharing.";
	const displayUrl = data.siteUrl || defaultDomain;

	return (
		<div className="bg-white rounded-2xl border border-slate-200 overflow-hidden max-w-[500px] w-full">
			{/* Twitter Card Image - 1.91:1 aspect ratio (1200x628px recommended) */}
			<div
				className="relative w-full bg-slate-100"
				style={{ aspectRatio: "1.91 / 1" }}
			>
				{data.ogImage ? (
					<Image
						src={data.ogImage}
						alt="Twitter card preview"
						fill
						className="object-cover"
						sizes="500px"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
						<div className="text-center text-slate-400">
							<Twitter className="w-12 h-12 mx-auto mb-2" />
							<p className="text-sm">No image set</p>
							<p className="text-xs">Recommended: 1200x628px</p>
						</div>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-3 border-t border-slate-200">
				<h4 className="text-base font-normal text-slate-900 line-clamp-2 leading-tight">
					{displayTitle}
				</h4>
				<p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-snug">
					{displayDescription}
				</p>
				<div className="text-sm text-slate-400 mt-2 flex items-center gap-1">
					<Globe className="w-3 h-3" />
					{displayUrl}
				</div>
			</div>
		</div>
	);
}

/**
 * Main SEO Preview Component
 * Shows Google search and social media previews with device toggles
 */
export function SeoPreview({ data, className }: SeoPreviewProps) {
	const defaultDomain = extractDomain(DEFAULT_SITE_URL);

	return (
		<div className={cn("space-y-6", className)}>
			{/* Search Appearance */}
			<div>
				<h4 className="text-sm font-medium text-slate-700 mb-3">
					Search Appearance
				</h4>
				<p className="text-xs text-slate-500 mb-4">
					Preview how your product will appear in search results
				</p>

				<Tabs defaultValue="mobile" className="w-full">
					<TabsList className="mb-4">
						<TabsTrigger value="mobile" className="gap-2">
							<Smartphone className="w-4 h-4" />
							<span className="hidden sm:inline">Mobile</span>
						</TabsTrigger>
						<TabsTrigger value="desktop" className="gap-2">
							<Monitor className="w-4 h-4" />
							<span className="hidden sm:inline">Desktop</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="mobile" className="mt-0">
						<div className="bg-slate-50 rounded-lg p-4 flex justify-center">
							<GoogleMobilePreview
								data={data}
								defaultDomain={defaultDomain}
							/>
						</div>
					</TabsContent>

					<TabsContent value="desktop" className="mt-0">
						<div className="bg-slate-50 rounded-lg p-4 overflow-x-auto">
							<GoogleDesktopPreview
								data={data}
								defaultDomain={defaultDomain}
							/>
						</div>
					</TabsContent>
				</Tabs>
			</div>

			{/* Social Share Preview */}
			<div>
				<h4 className="text-sm font-medium text-slate-700 mb-3">
					Social Share Preview
				</h4>
				<p className="text-xs text-slate-500 mb-4">
					Preview how your product will appear when shared on social media
				</p>

				<Tabs defaultValue="facebook" className="w-full">
					<TabsList className="mb-4">
						<TabsTrigger value="facebook" className="gap-2">
							<Facebook className="w-4 h-4" />
							<span className="hidden sm:inline">Facebook</span>
						</TabsTrigger>
						<TabsTrigger value="twitter" className="gap-2">
							<Twitter className="w-4 h-4" />
							<span className="hidden sm:inline">Twitter</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="facebook" className="mt-0">
						<div className="bg-slate-50 rounded-lg p-4 flex justify-center">
							<FacebookPreview
								data={data}
								defaultDomain={defaultDomain}
							/>
						</div>
					</TabsContent>

					<TabsContent value="twitter" className="mt-0">
						<div className="bg-slate-50 rounded-lg p-4 flex justify-center">
							<TwitterPreview
								data={data}
								defaultDomain={defaultDomain}
							/>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
