import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
	size?: "sm" | "md" | "lg" | "icon";
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = "primary",
			size = "md",
			asChild = false,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				suppressHydrationWarning
				className={cn(
					// Base styles
					"inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
					"disabled:pointer-events-none disabled:opacity-50",
					"cursor-pointer",
					// Variants
					{
						"bg-primary text-white hover:bg-primary-hover":
							variant === "primary",
						"bg-secondary text-white hover:bg-secondary/90":
							variant === "secondary",
						"border-2 border-primary text-secondary hover:bg-primary/10 hover:text-primary":
							variant === "outline",
						"hover:bg-muted hover:text-foreground": variant === "ghost",
						"bg-red-600 text-white hover:bg-red-700":
							variant === "destructive",
					},
					// Sizes
					{
						"h-9 px-4 text-sm": size === "sm",
						"h-11 px-6 text-base": size === "md",
						"h-14 px-8 text-lg": size === "lg",
						"h-10 w-10": size === "icon",
					},
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);

Button.displayName = "Button";

export { Button };
