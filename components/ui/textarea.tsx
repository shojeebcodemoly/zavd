import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					"flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-base text-secondary",
					"placeholder:text-slate-400",
					// "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
					"disabled:cursor-not-allowed disabled:opacity-50",
					"resize-y",
					"transition-all duration-200",
					"focus-visible:ring-1 outline-0",
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);

Textarea.displayName = "Textarea";

export { Textarea };
