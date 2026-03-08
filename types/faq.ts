/**
 * FAQ Type Definitions
 * Synos Medical FAQ Page
 */

import { LucideIcon } from "lucide-react";

/**
 * Individual FAQ Item
 */
export interface FAQItem {
	id: string;
	category: string;
	question: string;
	answer: string;
	order: number;
}

/**
 * FAQ Category
 */
export interface FAQCategory {
	id: string;
	name: string;
	icon?: LucideIcon;
	order: number;
}

/**
 * FAQ Page Props
 */
export interface FAQPageProps {
	searchParams?: {
		category?: string;
		search?: string;
	};
}

