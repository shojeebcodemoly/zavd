import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-11 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-base text-secondary",
					"placeholder:text-slate-400",
					// "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
					"disabled:cursor-not-allowed disabled:opacity-50",
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

Input.displayName = "Input";

export { Input };
