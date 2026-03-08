import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
	/**
	 * Visual variant of the glass card
	 */
	variant?: "default" | "bordered" | "elevated";
	/**
	 * Enable hover effect
	 */
	hoverable?: boolean;
	/**
	 * Additional padding
	 */
	padding?: "none" | "sm" | "md" | "lg";
	/**
	 * Children elements
	 */
	children?: React.ReactNode;
}

/**
 * GlassCard - Reusable glassmorphism card component
 *
 * Features:
 * - Frosted glass effect with backdrop blur
 * - Multiple variants for different use cases
 * - Optional hover animations
 * - Fully accessible and keyboard navigable
 *
 * @example
 * ```tsx
 * <GlassCard hoverable padding="lg">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </GlassCard>
 * ```
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
	(
		{
			className,
			variant = "default",
			hoverable = false,
			padding = "md",
			children,
			...props
		},
		ref
	) => {
		return (
			<motion.div
				ref={ref}
				className={cn(
					// Base glass styles
					"glass rounded-2xl",
					// Variants
					{
						"border border-glass-border": variant === "default",
						"border-2 border-primary/30": variant === "bordered",
						"shadow-glass": variant === "elevated",
					},
					// Padding
					{
						"p-0": padding === "none",
						"p-4": padding === "sm",
						"p-6": padding === "md",
						"p-8": padding === "lg",
					},
					// Hover effect
					{
						"glass-hover cursor-pointer": hoverable,
					},
					className
				)}
				{...props}
			>
				{children}
			</motion.div>
		);
	}
);

GlassCard.displayName = "GlassCard";
