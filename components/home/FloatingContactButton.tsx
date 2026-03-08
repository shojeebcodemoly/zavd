"use client";

import { useState, useEffect } from "react";
import { Video } from "lucide-react";
import { TourRequestModal } from "./TourRequestModal";

/**
 * FloatingContactButton Component
 *
 * A floating action button that opens the tour request modal.
 * Always visible on the homepage, positioned at the bottom right.
 */
export function FloatingContactButton() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	// Show button after component mounts to avoid hydration issues
	useEffect(() => {
		setIsVisible(true);
	}, []);

	if (!isVisible) return null;
	return (
		<>
			{/* Floating Button */}
			<button
				onClick={() => setIsModalOpen(true)}
				className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-full shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
				aria-label="Boka virtuell rundtur"
			>
				<Video className="h-5 w-5" />
				<span className="hidden sm:inline">Boka rundtur</span>
			</button>

			{/* Tour Request Modal */}
			<TourRequestModal open={isModalOpen} onOpenChange={setIsModalOpen} />
		</>
	);
}
