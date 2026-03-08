/**
 * Framer Motion Animation Presets
 * Light Premium Design System - Bullish Inspired
 * All animations respect prefers-reduced-motion
 */

import type { Transition, Variants } from "framer-motion";

// ============================================
// TRANSITIONS
// ============================================

export const defaultTransition: Transition = {
	duration: 0.3,
	ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

export const fastTransition: Transition = {
	duration: 0.2,
	ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

export const slowTransition: Transition = {
	duration: 0.5,
	ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

export const springTransition: Transition = {
	type: "spring",
	stiffness: 300,
	damping: 25,
};

export const staggerTransition: Transition = {
	...defaultTransition,
	staggerChildren: 0.08,
	delayChildren: 0.1,
};

// ============================================
// VARIANTS
// ============================================

/**
 * Fade in animation - simple opacity transition
 */
export const fadeIn: Variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1, transition: defaultTransition },
	exit: { opacity: 0, transition: fastTransition },
};

/**
 * Fade up animation - element fades in while moving up
 */
export const fadeUp: Variants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0, transition: defaultTransition },
	exit: { opacity: 0, y: 20, transition: fastTransition },
};

/**
 * Fade down animation - element fades in while moving down
 */
export const fadeDown: Variants = {
	initial: { opacity: 0, y: -20 },
	animate: { opacity: 1, y: 0, transition: defaultTransition },
	exit: { opacity: 0, y: -20, transition: fastTransition },
};

/**
 * Scale in animation - element scales up from center
 */
export const scaleIn: Variants = {
	initial: { opacity: 0, scale: 0.95 },
	animate: { opacity: 1, scale: 1, transition: defaultTransition },
	exit: { opacity: 0, scale: 0.95, transition: fastTransition },
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
	initial: { opacity: 0, x: -30 },
	animate: { opacity: 1, x: 0, transition: defaultTransition },
	exit: { opacity: 0, x: -30, transition: fastTransition },
};

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
	initial: { opacity: 0, x: 30 },
	animate: { opacity: 1, x: 0, transition: defaultTransition },
	exit: { opacity: 0, x: 30, transition: fastTransition },
};

/**
 * Stagger container for animating children sequentially
 */
export const staggerContainer: Variants = {
	initial: {},
	animate: {
		transition: staggerTransition,
	},
};

/**
 * Stagger item - use with staggerContainer
 */
export const staggerItem: Variants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
};

// ============================================
// HOVER ANIMATIONS (Subtle for Premium Feel)
// ============================================

/**
 * Hover lift effect for cards - subtle upward movement
 */
export const hoverLift = {
	whileHover: { y: -2, transition: fastTransition },
	whileTap: { scale: 0.98 },
};

/**
 * Hover scale effect - subtle scale increase
 */
export const hoverScale = {
	whileHover: { scale: 1.02, transition: fastTransition },
	whileTap: { scale: 0.98 },
};

/**
 * Hover shadow effect - increases shadow on hover
 */
export const hoverShadow = {
	whileHover: {
		boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)",
		transition: fastTransition,
	},
};

/**
 * Floating animation for decorative elements
 */
export const floating: Variants = {
	initial: { y: 0 },
	animate: {
		y: [-10, 10, -10],
		transition: {
			duration: 6,
			repeat: Infinity,
			ease: "easeInOut",
		},
	},
};

/**
 * Pulse animation for attention-grabbing elements
 */
export const pulse: Variants = {
	initial: { scale: 1 },
	animate: {
		scale: [1, 1.05, 1],
		transition: {
			duration: 2,
			repeat: Infinity,
			ease: "easeInOut",
		},
	},
};

/**
 * Page transition variants
 */
export const pageTransition: Variants = {
	initial: { opacity: 0, y: 20 },
	animate: {
		opacity: 1,
		y: 0,
		transition: defaultTransition,
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: defaultTransition,
	},
};
