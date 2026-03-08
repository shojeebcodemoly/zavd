"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Link, Heading2 } from "lucide-react";

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	minHeight?: string;
}

/**
 * RichTextEditor Component
 *
 * A basic rich text editor using contentEditable.
 * For production, consider replacing with:
 * - TipTap (https://tiptap.dev/)
 * - SunEditor React (https://github.com/mkhstar/suneditor-react)
 * - Quill (https://quilljs.com/)
 */
export function RichTextEditor({
	value,
	onChange,
	placeholder = "Enter content...",
	disabled = false,
	className,
	minHeight = "200px",
}: RichTextEditorProps) {
	const editorRef = React.useRef<HTMLDivElement>(null);
	const [isFocused, setIsFocused] = React.useState(false);

	// Sync value to editor
	React.useEffect(() => {
		if (editorRef.current && editorRef.current.innerHTML !== value) {
			editorRef.current.innerHTML = value;
		}
	}, [value]);

	const handleInput = () => {
		if (editorRef.current) {
			onChange(editorRef.current.innerHTML);
		}
	};

	const execCommand = (
		command: string,
		value: string | undefined = undefined
	) => {
		document.execCommand(command, false, value);
		editorRef.current?.focus();
		handleInput();
	};

	const formatBlock = (tag: string) => {
		document.execCommand("formatBlock", false, tag);
		editorRef.current?.focus();
		handleInput();
	};

	const insertLink = () => {
		const url = prompt("Enter URL:");
		if (url) {
			execCommand("createLink", url);
		}
	};

	return (
		<div
			className={cn(
				"border border-slate-200 rounded-md overflow-hidden",
				isFocused && "ring-2 ring-secondary ring-offset-2",
				disabled && "opacity-50 cursor-not-allowed",
				className
			)}
		>
			{/* Toolbar */}
			<div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => execCommand("bold")}
					disabled={disabled}
					className="h-8 w-8"
					title="Bold"
				>
					<Bold className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => execCommand("italic")}
					disabled={disabled}
					className="h-8 w-8"
					title="Italic"
				>
					<Italic className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => formatBlock("h2")}
					disabled={disabled}
					className="h-8 w-8"
					title="Heading"
				>
					<Heading2 className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => execCommand("insertUnorderedList")}
					disabled={disabled}
					className="h-8 w-8"
					title="Bullet List"
				>
					<List className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => execCommand("insertOrderedList")}
					disabled={disabled}
					className="h-8 w-8"
					title="Numbered List"
				>
					<ListOrdered className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={insertLink}
					disabled={disabled}
					className="h-8 w-8"
					title="Insert Link"
				>
					<Link className="h-4 w-4" />
				</Button>
			</div>

			{/* Editor */}
			<div
				ref={editorRef}
				contentEditable={!disabled}
				onInput={handleInput}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				className={cn(
					"p-4 outline-none prose prose-sm max-w-none",
					"min-h-[200px]",
					!value && "text-slate-400"
				)}
				style={{ minHeight }}
				data-placeholder={placeholder}
				suppressContentEditableWarning
			/>

			<style jsx>{`
				[contenteditable]:empty:before {
					content: attr(data-placeholder);
					color: #94a3b8;
					pointer-events: none;
				}
			`}</style>
		</div>
	);
}
