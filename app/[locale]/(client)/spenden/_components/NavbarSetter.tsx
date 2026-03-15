"use client";

import { useSetNavbarVariant } from "@/lib/context/navbar-variant-context";

export function NavbarSetter() {
	useSetNavbarVariant("dark-hero");
	return null;
}
