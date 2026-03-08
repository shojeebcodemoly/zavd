"use client";

import * as React from "react";
import {
	ChevronRight,
	ChevronDown,
	Check,
	FolderOpen,
	Folder,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { IBlogCategoryTreeNode } from "@/models/blog-category.model";

interface BlogTreeSelectProps {
	value: string[];
	onChange: (value: string[]) => void;
	tree: IBlogCategoryTreeNode[];
	placeholder?: string;
	multiple?: boolean;
	disabled?: boolean;
	excludeId?: string;
	className?: string;
}

interface TreeNodeProps {
	node: IBlogCategoryTreeNode;
	selectedIds: string[];
	onSelect: (id: string) => void;
	multiple: boolean;
	excludeId?: string;
	level?: number;
}

/**
 * TreeNode Component - Recursive tree node renderer
 */
function TreeNode({
	node,
	selectedIds,
	onSelect,
	multiple,
	excludeId,
	level = 0,
}: TreeNodeProps) {
	const [expanded, setExpanded] = React.useState(false);
	const hasChildren = node.children && node.children.length > 0;
	const isSelected = selectedIds.includes(node._id);
	const isDisabled = node._id === excludeId || !node.isActive;

	return (
		<div>
			<div
				className={cn(
					"flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer",
					"hover:bg-slate-100",
					isSelected && "bg-primary/10",
					isDisabled && "opacity-50 cursor-not-allowed"
				)}
				style={{ paddingLeft: `${level * 16 + 8}px` }}
			>
				{/* Expand/collapse button */}
				{hasChildren ? (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setExpanded(!expanded);
						}}
						className="p-0.5 hover:bg-slate-200 rounded"
					>
						{expanded ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronRight className="h-4 w-4" />
						)}
					</button>
				) : (
					<span className="w-5" />
				)}

				{/* Folder icon */}
				{expanded && hasChildren ? (
					<FolderOpen className="h-4 w-4 text-primary" />
				) : (
					<Folder className="h-4 w-4 text-slate-400" />
				)}

				{/* Node content */}
				<button
					type="button"
					onClick={() => !isDisabled && onSelect(node._id)}
					disabled={isDisabled}
					className="flex-1 text-left text-sm truncate"
				>
					{node.name}
				</button>

				{/* Selection indicator */}
				{isSelected && <Check className="h-4 w-4 text-primary" />}
			</div>

			{/* Children */}
			{expanded && hasChildren && (
				<div>
					{node.children.map((child) => (
						<TreeNode
							key={child._id}
							node={child}
							selectedIds={selectedIds}
							onSelect={onSelect}
							multiple={multiple}
							excludeId={excludeId}
							level={level + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}

/**
 * BlogTreeSelect Component
 * A hierarchical select component for blog category trees
 */
export function BlogTreeSelect({
	value = [],
	onChange,
	tree,
	placeholder = "Select categories...",
	multiple = true,
	disabled = false,
	excludeId,
	className,
}: BlogTreeSelectProps) {
	const [open, setOpen] = React.useState(false);

	// Get selected category names for display
	const selectedNames = React.useMemo(() => {
		const names: string[] = [];
		const findNames = (nodes: IBlogCategoryTreeNode[]) => {
			for (const node of nodes) {
				if (value.includes(node._id)) {
					names.push(node.name);
				}
				if (node.children.length > 0) {
					findNames(node.children);
				}
			}
		};
		findNames(tree);
		return names;
	}, [tree, value]);

	const handleSelect = (id: string) => {
		if (multiple) {
			if (value.includes(id)) {
				onChange(value.filter((v) => v !== id));
			} else {
				onChange([...value, id]);
			}
		} else {
			onChange([id]);
			setOpen(false);
		}
	};

	const clearSelection = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChange([]);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					disabled={disabled}
					className={cn(
						"w-full justify-between font-normal h-auto min-h-11 py-2",
						!value.length && "text-slate-500",
						className
					)}
				>
					<div className="flex flex-wrap gap-1 flex-1 text-left">
						{selectedNames.length > 0 ? (
							selectedNames.map((name) => (
								<span
									key={name}
									className="bg-slate-100 px-2 py-0.5 rounded text-sm"
								>
									{name}
								</span>
							))
						) : (
							<span>{placeholder}</span>
						)}
					</div>
					{value.length > 0 && (
						<span
							role="button"
							tabIndex={0}
							onClick={clearSelection}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									clearSelection(e as unknown as React.MouseEvent);
								}
							}}
							className="ml-2 p-1 hover:bg-slate-200 rounded cursor-pointer"
						>
							<span className="sr-only">Clear</span>×
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-2" align="start">
				{tree.length === 0 ? (
					<p className="text-sm text-slate-500 text-center py-4">
						No categories available
					</p>
				) : (
					<div className="max-h-[300px] overflow-auto">
						{tree.map((node) => (
							<TreeNode
								key={node._id}
								node={node}
								selectedIds={value}
								onSelect={handleSelect}
								multiple={multiple}
								excludeId={excludeId}
							/>
						))}
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
