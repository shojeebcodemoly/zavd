import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils/cn";

export interface LoadingButtonProps extends ButtonProps {
	/** Whether the button is in loading state */
	loading?: boolean;
	/** Text to show when loading (defaults to children) */
	loadingText?: string;
	/** Position of the spinner (default: left) */
	spinnerPosition?: "left" | "right";
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
	(
		{
			loading = false,
			loadingText,
			spinnerPosition = "left",
			children,
			disabled,
			className,
			...props
		},
		ref
	) => {
		const isDisabled = disabled || loading;

		const spinner = (
			<Loader2
				className={cn(
					"h-4 w-4 animate-spin",
					spinnerPosition === "right" && "order-last"
				)}
			/>
		);

		return (
			<Button
				ref={ref}
				disabled={isDisabled}
				className={cn(loading && "cursor-wait", className)}
				{...props}
			>
				{loading && spinner}
				{loading && loadingText ? loadingText : children}
			</Button>
		);
	}
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
