"use client";

import { useEffect, useState } from "react";

/**
 * Trustindex Reviews Widget Component
 *
 * Embeds the Trustindex widget for displaying Google reviews.
 * Uses iframe approach for reliable rendering.
 *
 * NOTE: The floating badge at the bottom of the page is loaded separately
 * by the Trustindex script. This component creates an inline widget.
 *
 * @param compact - If true, renders a compact version for article pages
 */

interface TrustindexReviewsProps {
	compact?: boolean;
}

// Trustindex widget ID - this is the same ID from the loader script
const TRUSTINDEX_WIDGET_ID = "fff8ab612227240be176bfbd1e9";

export function TrustindexReviews({ compact = false }: TrustindexReviewsProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);

		// Add global CSS to hide the floating Trustindex badge at bottom
		const styleId = "trustindex-hide-floating";
		if (!document.getElementById(styleId)) {
			const style = document.createElement("style");
			style.id = styleId;
			style.textContent = `
				/* Hide ALL Trustindex floating widgets at the bottom of the page */
				body > div:last-of-type:has([class*="ti-"]),
				body > div[style*="position: fixed"]:has([class*="ti-"]),
				body > div[style*="z-index"]:has(.ti-widget),
				div.ti-floating-holder,
				div[class*="floating"][class*="ti-"],
				#ti-floating-widget,
				.ti-floating-widget {
					display: none !important;
					visibility: hidden !important;
					height: 0 !important;
					width: 0 !important;
					overflow: hidden !important;
					pointer-events: none !important;
				}
			`;
			document.head.appendChild(style);
		}

		// Remove any existing floating widgets that Trustindex might have injected
		const removeFloatingWidgets = () => {
			const floatingWidgets = document.querySelectorAll(
				'body > div[style*="position: fixed"]:has([class*="ti-"]), body > div:has(.ti-floating-holder)'
			);
			floatingWidgets.forEach(widget => {
				if (widget.querySelector('[class*="ti-"]')) {
					(widget as HTMLElement).style.display = 'none';
				}
			});
		};

		// Run immediately and after a delay (for dynamically injected widgets)
		removeFloatingWidgets();
		const timer1 = setTimeout(removeFloatingWidgets, 1000);
		const timer2 = setTimeout(removeFloatingWidgets, 3000);
		const timer3 = setTimeout(removeFloatingWidgets, 5000);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
		};
	}, []);

	// Don't render during SSR
	if (!isMounted) {
		return (
			<section className={compact ? "py-12 bg-muted/20" : "py-16 bg-linear-to-b from-background to-muted/30"}>
				<div className="_container">
					<div className={compact ? "flex items-center gap-3 mb-6" : "text-center mb-10"}>
						<span className={`inline-block ${compact ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 mb-4 text-sm'} font-medium bg-primary/10 text-primary rounded-full`}>
							Kundrecensioner
						</span>
						{compact ? (
							<h3 className="text-xl font-semibold text-secondary">
								Vad våra kunder säger
							</h3>
						) : (
							<>
								<h2 className="text-3xl md:text-4xl font-medium text-secondary mb-3">
									Vad våra kunder säger
								</h2>
								<p className="text-muted-foreground max-w-2xl mx-auto">
									Läs vad våra nöjda kunder har att säga om sina upplevelser med Synos Medical
								</p>
							</>
						)}
					</div>
					<div className={`bg-white ${compact ? 'rounded-xl shadow-sm p-4 md:p-6' : 'rounded-2xl shadow-lg p-6 md:p-8'}`}>
						<div className="flex flex-col justify-center items-center h-32 gap-3">
							<div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
							<span className="text-muted-foreground text-sm">
								Laddar recensioner...
							</span>
						</div>
					</div>
				</div>
			</section>
		);
	}

	// Trustindex widget embed - using direct embed URL
	const iframeWidget = (
		<iframe
			src={`https://cdn.trustindex.io/widget-embed/${TRUSTINDEX_WIDGET_ID}/?layout=slider&style=drop-shadow&language=sv`}
			style={{
				width: '100%',
				height: compact ? '280px' : '380px',
				border: 'none',
				overflow: 'hidden',
			}}
			title="Trustindex Google Reviews"
			loading="lazy"
			allowFullScreen
		/>
	);

	// Compact version for article pages
	if (compact) {
		return (
			<section className="py-12 bg-muted/20">
				<div className="_container">
					<div className="flex items-center gap-3 mb-6">
						<span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
							Kundrecensioner
						</span>
						<h3 className="text-xl font-semibold text-secondary">
							Vad våra kunder säger
						</h3>
					</div>
					<div className="bg-white rounded-xl shadow-sm p-4 md:p-6 overflow-hidden">
						{iframeWidget}
					</div>
				</div>
			</section>
		);
	}

	// Full version for listing pages
	return (
		<section className="py-16 bg-linear-to-b from-background to-muted/30">
			<div className="_container">
				<div className="text-center mb-10">
					<span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full">
						Kundrecensioner
					</span>
					<h2 className="text-3xl md:text-4xl font-medium text-secondary mb-3">
						Vad våra kunder säger
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Läs vad våra nöjda kunder har att säga om sina upplevelser med Synos Medical
					</p>
				</div>

				<div className="relative bg-white rounded-2xl shadow-lg p-6 md:p-8 overflow-hidden">
					{iframeWidget}
				</div>
			</div>
		</section>
	);
}
