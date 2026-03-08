"use client";

import { Toaster } from "@/components/ui/sonner";

/**
 * ToasterProvider - Client-side only toaster wrapper
 * Ensures Toaster is only rendered on client to avoid SSG issues
 */
export function ToasterProvider() {
	return <Toaster richColors={true} expand />;
}
