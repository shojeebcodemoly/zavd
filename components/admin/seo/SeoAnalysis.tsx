"use client";

import * as React from "react";
import {
	CheckCircle2,
	XCircle,
	AlertCircle,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * SEO Analysis Data
 */
export interface SeoAnalysisData {
	title: string;
	description: string;
	slug: string;
	focusKeyphrase?: string;
	productTitle?: string;
	hasOgImage?: boolean;
}

/**
 * SEO Check Result
 */
interface SeoCheck {
	id: string;
	label: string;
	status: "good" | "improvement" | "problem";
	message: string;
}

/**
 * Progress bar with color gradient based on value
 */
function ProgressBar({
	value,
	min,
	max,
	optimal,
}: {
	value: number;
	min: number;
	max: number;
	optimal: { min: number; max: number };
}) {
	const percentage = Math.min(100, (value / max) * 100);

	let colorClass = "bg-green-500";
	if (value < optimal.min) {
		colorClass = value < min ? "bg-red-500" : "bg-orange-500";
	} else if (value > optimal.max) {
		colorClass = value > max ? "bg-red-500" : "bg-orange-500";
	}

	return (
		<div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
			<div
				className={cn(
					"h-full rounded-full transition-all duration-300",
					colorClass
				)}
				style={{ width: `${percentage}%` }}
			/>
		</div>
	);
}

/**
 * Individual SEO check item
 */
function SeoCheckItem({ check }: { check: SeoCheck }) {
	const Icon =
		check.status === "good"
			? CheckCircle2
			: check.status === "improvement"
			? AlertCircle
			: XCircle;

	const iconColor =
		check.status === "good"
			? "text-green-500"
			: check.status === "improvement"
			? "text-orange-500"
			: "text-red-500";

	return (
		<div className="flex items-start gap-3 py-2">
			<Icon className={cn("w-5 h-5 shrink-0 mt-0.5", iconColor)} />
			<div className="min-w-0">
				<p className="text-sm font-medium text-slate-700">{check.label}</p>
				<p className="text-xs text-slate-500 mt-0.5">{check.message}</p>
			</div>
		</div>
	);
}

/**
 * Analyze SEO data and return checks
 */
function analyzeSeo(data: SeoAnalysisData): {
	score: number;
	checks: SeoCheck[];
} {
	const checks: SeoCheck[] = [];

	// Title checks
	const titleLength = data.title?.length || 0;
	const titleDisplay = data.title || data.productTitle || "";

	if (titleLength === 0) {
		checks.push({
			id: "title-missing",
			label: "SEO title",
			status: "problem",
			message: "No SEO title set. Add a title between 50-60 characters.",
		});
	} else if (titleLength < 30) {
		checks.push({
			id: "title-short",
			label: "SEO title",
			status: "improvement",
			message: `Title is too short (${titleLength} characters). Aim for 50-60 characters.`,
		});
	} else if (titleLength > 60) {
		checks.push({
			id: "title-long",
			label: "SEO title",
			status: "improvement",
			message: `Title is too long (${titleLength} characters). It may be truncated in search results.`,
		});
	} else {
		checks.push({
			id: "title-good",
			label: "SEO title",
			status: "good",
			message: `Good title length (${titleLength} characters).`,
		});
	}

	// Description checks
	const descLength = data.description?.length || 0;

	if (descLength === 0) {
		checks.push({
			id: "desc-missing",
			label: "Meta description",
			status: "problem",
			message:
				"No meta description set. Add a description between 120-160 characters.",
		});
	} else if (descLength < 120) {
		checks.push({
			id: "desc-short",
			label: "Meta description",
			status: "improvement",
			message: `Description is too short (${descLength} characters). Aim for 120-160 characters.`,
		});
	} else if (descLength > 160) {
		checks.push({
			id: "desc-long",
			label: "Meta description",
			status: "improvement",
			message: `Description is too long (${descLength} characters). It may be truncated.`,
		});
	} else {
		checks.push({
			id: "desc-good",
			label: "Meta description",
			status: "good",
			message: `Good description length (${descLength} characters).`,
		});
	}

	// Slug checks
	if (!data.slug || data.slug.trim() === "") {
		checks.push({
			id: "slug-missing",
			label: "URL slug",
			status: "problem",
			message: "No URL slug set. Add a descriptive, keyword-rich slug.",
		});
	} else if (data.slug.length > 75) {
		checks.push({
			id: "slug-long",
			label: "URL slug",
			status: "improvement",
			message:
				"Slug is quite long. Consider shortening it for better readability.",
		});
	} else {
		checks.push({
			id: "slug-good",
			label: "URL slug",
			status: "good",
			message: `Good slug: /${data.slug}`,
		});
	}

	// OG Image check
	if (!data.hasOgImage) {
		checks.push({
			id: "og-missing",
			label: "Social image",
			status: "improvement",
			message:
				"No Open Graph image set. Add an image for better social sharing.",
		});
	} else {
		checks.push({
			id: "og-good",
			label: "Social image",
			status: "good",
			message: "Open Graph image is set for social sharing.",
		});
	}

	// Focus keyphrase check (optional)
	if (data.focusKeyphrase && data.focusKeyphrase.trim()) {
		const keyphrase = data.focusKeyphrase.toLowerCase();
		const titleLower = titleDisplay.toLowerCase();
		const descLower = (data.description || "").toLowerCase();

		if (titleLower.includes(keyphrase)) {
			checks.push({
				id: "keyphrase-title",
				label: "Keyphrase in title",
				status: "good",
				message: "Focus keyphrase appears in the SEO title.",
			});
		} else {
			checks.push({
				id: "keyphrase-title-missing",
				label: "Keyphrase in title",
				status: "improvement",
				message: "Focus keyphrase doesn't appear in the SEO title.",
			});
		}

		if (descLower.includes(keyphrase)) {
			checks.push({
				id: "keyphrase-desc",
				label: "Keyphrase in description",
				status: "good",
				message: "Focus keyphrase appears in the meta description.",
			});
		} else {
			checks.push({
				id: "keyphrase-desc-missing",
				label: "Keyphrase in description",
				status: "improvement",
				message: "Focus keyphrase doesn't appear in the meta description.",
			});
		}
	}

	// Calculate score
	const goodCount = checks.filter((c) => c.status === "good").length;
	const totalChecks = checks.length;
	const score = Math.round((goodCount / totalChecks) * 100);

	return { score, checks };
}

interface SeoAnalysisProps {
	data: SeoAnalysisData;
	className?: string;
}

/**
 * SEO Analysis Component
 * Shows SEO score and detailed checks
 */
export function SeoAnalysis({ data, className }: SeoAnalysisProps) {
	const [isExpanded, setIsExpanded] = React.useState(true);
	const { score, checks } = analyzeSeo(data);

	const goodChecks = checks.filter((c) => c.status === "good");
	const improvementChecks = checks.filter((c) => c.status === "improvement");
	const problemChecks = checks.filter((c) => c.status === "problem");

	// Score color
	let scoreColor = "text-green-600 bg-green-50 border-green-200";
	if (score < 50) {
		scoreColor = "text-red-600 bg-red-50 border-red-200";
	} else if (score < 80) {
		scoreColor = "text-orange-600 bg-orange-50 border-orange-200";
	}

	return (
		<div
			className={cn(
				"rounded-lg border border-slate-200 bg-white",
				className
			)}
		>
			{/* Header with score */}
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
			>
				<div className="flex items-center gap-4">
					<div
						className={cn(
							"w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold text-lg",
							scoreColor
						)}
					>
						{score}
					</div>
					<div className="text-left">
						<h4 className="text-sm font-medium text-slate-900">
							SEO Analysis
						</h4>
						<p className="text-xs text-slate-500">
							{goodChecks.length} good • {improvementChecks.length}{" "}
							improvements • {problemChecks.length} problems
						</p>
					</div>
				</div>
				{isExpanded ? (
					<ChevronUp className="w-5 h-5 text-slate-400" />
				) : (
					<ChevronDown className="w-5 h-5 text-slate-400" />
				)}
			</button>

			{/* Expandable content */}
			{isExpanded && (
				<div className="border-t border-slate-200 p-4 space-y-4">
					{/* Problems */}
					{problemChecks.length > 0 && (
						<div>
							<h5 className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">
								Problems ({problemChecks.length})
							</h5>
							<div className="divide-y divide-slate-100">
								{problemChecks.map((check) => (
									<SeoCheckItem key={check.id} check={check} />
								))}
							</div>
						</div>
					)}

					{/* Improvements */}
					{improvementChecks.length > 0 && (
						<div>
							<h5 className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-2">
								Improvements ({improvementChecks.length})
							</h5>
							<div className="divide-y divide-slate-100">
								{improvementChecks.map((check) => (
									<SeoCheckItem key={check.id} check={check} />
								))}
							</div>
						</div>
					)}

					{/* Good */}
					{goodChecks.length > 0 && (
						<div>
							<h5 className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
								Good ({goodChecks.length})
							</h5>
							<div className="divide-y divide-slate-100">
								{goodChecks.map((check) => (
									<SeoCheckItem key={check.id} check={check} />
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

/**
 * Character count indicator with progress bar
 */
interface CharacterCountProps {
	value: string;
	min: number;
	max: number;
	optimal: { min: number; max: number };
	label: string;
}

export function CharacterCount({
	value,
	min,
	max,
	optimal,
	label,
}: CharacterCountProps) {
	const length = value?.length || 0;

	let statusColor = "text-green-600";
	let statusText = "Good";

	if (length === 0) {
		statusColor = "text-slate-400";
		statusText = "Empty";
	} else if (length < optimal.min) {
		statusColor = length < min ? "text-red-600" : "text-orange-600";
		statusText = "Too short";
	} else if (length > optimal.max) {
		statusColor = length > max ? "text-red-600" : "text-orange-600";
		statusText = "Too long";
	}

	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between text-xs">
				<span className="text-slate-500">{label}</span>
				<span className={cn("font-medium", statusColor)}>
					{length}/{max} • {statusText}
				</span>
			</div>
			<ProgressBar value={length} min={min} max={max} optimal={optimal} />
		</div>
	);
}
