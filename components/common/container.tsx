import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Maximum width of the container
	 */
	maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
	/**
	 * Whether to center the container
	 */
	center?: boolean;
	/**
	 * Custom padding
	 */
	//  test
	noPadding?: boolean;
}

/**
 * Container - Responsive container component with consistent horizontal padding
 *
 * Provides consistent spacing and max-width constraints across breakpoints.
 *
 * @example
 * ```tsx
 * <Container maxWidth="lg">
 *   <h1>Page Content</h1>
 * </Container>
 * ```
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
	(
		{
			className,
			maxWidth = "xl",
			center = true,
			noPadding = false,
			children,
			...props
		},
		ref
	) => {
		return (
			<div
				ref={ref}
				className={cn(
					"w-full",
					{
						"mx-auto": center,
						"px-4 sm:px-6 lg:px-8": !noPadding,
					},
					// Max widths
					{
						"max-w-screen-sm": maxWidth === "sm",
						"max-w-3xl": maxWidth === "md",
						"max-w-5xl": maxWidth === "lg",
						"max-w-7xl": maxWidth === "xl",
						"max-w-screen-2xl": maxWidth === "2xl",
						"max-w-full": maxWidth === "full",
					},
					className
				)}
				{...props}
			>
				{children}
			</div>
		);
	}
);

Container.displayName = "Container";
