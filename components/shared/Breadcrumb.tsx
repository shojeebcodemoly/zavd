"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
	const t = useTranslations("common");

	return (
		<nav aria-label="Breadcrumb" className="mb-6">
			<ol className="flex flex-wrap items-center gap-2 text-sm">
				<li>
					<Link
						href="/"
						className="text-secondary/70 transition-colors hover:text-primary/70"
					>
						{t("home")}
					</Link>
				</li>
				{items.map((item, index) => (
					<li key={index} className="flex items-center gap-2">
						<ChevronRight className="h-4 w-4 text-primary" />
						{item.href && index < items.length - 1 ? (
							<Link
								href={item.href}
								className="text-muted-foreground transition-colors hover:text-primary"
							>
								{item.label}
							</Link>
						) : (
							<span className="font-medium text-secondary">
								{item.label}
							</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}
