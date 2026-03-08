"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Share2,
	Facebook,
	Twitter,
	Linkedin,
	Mail,
	Link2,
	Check,
} from "lucide-react";
import Link from "next/link";

interface ProductShareButtonsProps {
	productName: string;
	productUrl: string;
}

/**
 * ProductShareButtons Component
 *
 * Social sharing buttons with:
 * - Multiple platforms (Facebook, Twitter, LinkedIn, Email)
 * - Copy link functionality
 * - Glassmorphism design
 * - Smooth animations
 */
export function ProductShareButtons({
	productName,
	productUrl,
}: ProductShareButtonsProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	const shareUrl =
		typeof window !== "undefined" ? window.location.href : productUrl;
	const shareText = `Kolla in ${productName} från Synos Medical`;

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const shareLinks = [
		{
			name: "Facebook",
			icon: Facebook,
			url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
				shareUrl
			)}`,
			color: "hover:bg-[#1877F2] hover:text-white",
		},
		{
			name: "Twitter",
			icon: Twitter,
			url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
				shareUrl
			)}&text=${encodeURIComponent(shareText)}`,
			color: "hover:bg-[#1DA1F2] hover:text-white",
		},
		{
			name: "LinkedIn",
			icon: Linkedin,
			url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
				shareUrl
			)}`,
			color: "hover:bg-[#0A66C2] hover:text-white",
		},
		{
			name: "Email",
			icon: Mail,
			url: `mailto:?subject=${encodeURIComponent(
				shareText
			)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
			color: "hover:bg-primary hover:text-primary-foreground",
		},
	];

	return (
		<div className="relative">
			{/* Share Button */}
			<motion.button
				onClick={() => setIsOpen(!isOpen)}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-primary/50 text-foreground hover:border-primary/50 transition-all duration-300"
				aria-label="Share product"
			>
				<Share2 className="h-4 w-4" />
				<span className="text-sm font-medium">Dela</span>
			</motion.button>

			{/* Share Options */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-40"
							onClick={() => setIsOpen(false)}
						/>

						{/* Share Menu */}
						<motion.div
							initial={{ opacity: 0, y: -10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -10, scale: 0.95 }}
							transition={{ duration: 0.2 }}
							className="absolute top-full mt-2 right-0 z-50 p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-primary/50 shadow-xl min-w-[280px]"
						>
							<p className="text-sm font-semibold text-foreground mb-3">
								Dela denna produkt
							</p>

							{/* Social Share Buttons */}
							<div className="grid grid-cols-2 gap-2 mb-3">
								{shareLinks.map((link) => (
									<Link
										key={link.name}
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/50 text-sm font-medium transition-all duration-300 ${link.color}`}
										onClick={() => setIsOpen(false)}
									>
										<link.icon className="h-4 w-4" />
										<span>{link.name}</span>
									</Link>
								))}
							</div>

							{/* Copy Link */}
							<button
								onClick={handleCopyLink}
								className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-primary/50 text-sm font-medium hover:bg-primary/10 cursor-pointer transition-all duration-300"
							>
								{copied ? (
									<>
										<Check className="h-4 w-4 text-green-600" />
										<span className="text-green-600">Kopierad!</span>
									</>
								) : (
									<>
										<Link2 className="h-4 w-4" />
										<span>Kopiera länk</span>
									</>
								)}
							</button>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
