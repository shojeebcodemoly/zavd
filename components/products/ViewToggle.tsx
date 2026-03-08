"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
	view: "grid" | "list";
	onViewChange: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
	return (
		<div className="flex items-center gap-2 rounded-lg border border-primary/50 bg-slate-100 p-1">
			<Button
				variant={view === "grid" ? "primary" : "ghost"}
				size="sm"
				onClick={() => onViewChange("grid")}
				className={cn(
					"text-foreground hover:bg-primary/5 border border-transparent hover:border-primary/20",
					view === "grid" &&
						"bg-primary text-primary-foreground hover:bg-primary/80"
				)}
				aria-label="Grid view"
			>
				<LayoutGrid className="h-4 w-4" />
			</Button>
			<Button
				variant={view === "list" ? "primary" : "ghost"}
				size="sm"
				onClick={() => onViewChange("list")}
				className={cn(
					"text-foreground hover:bg-primary/5 border border-transparent hover:border-primary/20",
					view === "list" &&
						"bg-primary text-primary-foreground hover:bg-primary/80"
				)}
				aria-label="List view"
			>
				<List className="h-4 w-4" />
			</Button>
		</div>
	);
}
