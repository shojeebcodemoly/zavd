"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type NavbarVariant = "default" | "dark-hero";

interface NavbarVariantContextType {
	variant: NavbarVariant;
	setVariant: (variant: NavbarVariant) => void;
}

const NavbarVariantContext = createContext<NavbarVariantContextType | undefined>(undefined);

export function NavbarVariantProvider({ children }: { children: ReactNode }) {
	const [variant, setVariant] = useState<NavbarVariant>("default");

	return (
		<NavbarVariantContext.Provider value={{ variant, setVariant }}>
			{children}
		</NavbarVariantContext.Provider>
	);
}

export function useNavbarVariant() {
	const context = useContext(NavbarVariantContext);
	// Return default values if used outside provider (e.g., in auth pages)
	if (context === undefined) {
		return {
			variant: "default" as const,
			setVariant: () => {},
		};
	}
	return context;
}

/**
 * Hook to set navbar variant on mount and reset on unmount
 * Use this in page components that need a specific navbar variant
 */
export function useSetNavbarVariant(newVariant: NavbarVariant) {
	const { setVariant } = useNavbarVariant();

	useEffect(() => {
		setVariant(newVariant);
		// Reset to default when component unmounts
		return () => {
			setVariant("default");
		};
	}, [newVariant, setVariant]);
}
