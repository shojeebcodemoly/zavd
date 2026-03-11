"use client";

import { useState, useEffect, useRef } from "react";

export function StickyHeader({ children }: { children: React.ReactNode }) {
	const [hidden, setHidden] = useState(false);
	const lastScrollY = useRef(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentY = window.scrollY;
			if (currentY > lastScrollY.current && currentY > 50) {
				setHidden(true);
			} else {
				setHidden(false);
			}
			lastScrollY.current = currentY;
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div
			className={`fixed top-0 left-0 z-50 w-full transition-transform duration-300 ${
				hidden ? "-translate-y-9" : "translate-y-0"
			}`}
		>
			{children}
		</div>
	);
}
