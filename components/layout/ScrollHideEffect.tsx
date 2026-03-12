"use client";

import { useEffect, useRef } from "react";

export function ScrollHideEffect() {
	const lastScrollY = useRef(0);

	useEffect(() => {
		const header = document.getElementById("sticky-header");
		if (!header) return;

		const handleScroll = () => {
			const currentY = window.scrollY;
			if (currentY > lastScrollY.current && currentY > 50) {
				header.style.transform = "translateY(-36px)";
			} else {
				header.style.transform = "translateY(0)";
			}
			lastScrollY.current = currentY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return null;
}
