"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import type { IKontaktOfficeSection } from "@/models/kontakt-page.model";
import type { IOffice } from "@/models/site-settings.model";

interface AnimatedOfficeLocationsProps {
	data: IKontaktOfficeSection;
	addresses: IOffice[];
}

/**
 * Parse various Google Maps input formats and return a valid embed URL.
 * Supports:
 * - Full embed URLs: https://www.google.com/maps/embed?pb=...
 * - Short share links: https://maps.app.goo.gl/... or https://goo.gl/maps/...
 * - Full iframe HTML: <iframe src="https://www.google.com/maps/embed?pb=...">
 * - Coordinates: 59°25'10.6"N 17°57'43.3"E or 59.419611, 17.961750
 * - Place URLs: https://www.google.com/maps/place/...
 */
function parseMapInput(input?: string): string | null {
	if (!input || typeof input !== "string") return null;

	const trimmed = input.trim();
	if (!trimmed) return null;

	// 1. Extract src from iframe HTML
	const iframeSrcMatch = trimmed.match(/<iframe[^>]+src=["']([^"']+)["']/i);
	if (iframeSrcMatch) {
		const src = iframeSrcMatch[1];
		// If it's already an embed URL, use it directly
		if (src.includes("google.com/maps/embed")) {
			return src;
		}
	}

	// 2. Already a valid embed URL
	if (trimmed.includes("google.com/maps/embed")) {
		return trimmed;
	}

	// 3. Google Maps place URL - extract coordinates and create embed
	// Example: https://www.google.com/maps/place/.../@59.419611,17.961750,17z/...
	const placeMatch = trimmed.match(
		/google\.com\/maps\/place\/[^@]*@([-\d.]+),([-\d.]+)/
	);
	if (placeMatch) {
		const lat = parseFloat(placeMatch[1]);
		const lng = parseFloat(placeMatch[2]);
		if (!isNaN(lat) && !isNaN(lng)) {
			return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
		}
	}

	// 4. Short share links (maps.app.goo.gl or goo.gl/maps) - cannot be used directly in iframes
	// These require server-side resolution, so we'll extract address info if stored alongside
	if (
		trimmed.includes("maps.app.goo.gl") ||
		trimmed.includes("goo.gl/maps")
	) {
		// Short links don't work in iframes - return null to use fallback
		return null;
	}

	// 5. DMS Coordinates: 59°25'10.6"N 17°57'43.3"E
	const dmsMatch = trimmed.match(
		/(\d+)[°]\s*(\d+)[′']\s*([\d.]+)[″"]?\s*([NS])\s*(\d+)[°]\s*(\d+)[′']\s*([\d.]+)[″"]?\s*([EW])/i
	);
	if (dmsMatch) {
		const latDeg = parseFloat(dmsMatch[1]);
		const latMin = parseFloat(dmsMatch[2]);
		const latSec = parseFloat(dmsMatch[3]);
		const latDir = dmsMatch[4].toUpperCase();
		const lngDeg = parseFloat(dmsMatch[5]);
		const lngMin = parseFloat(dmsMatch[6]);
		const lngSec = parseFloat(dmsMatch[7]);
		const lngDir = dmsMatch[8].toUpperCase();

		let lat = latDeg + latMin / 60 + latSec / 3600;
		let lng = lngDeg + lngMin / 60 + lngSec / 3600;

		if (latDir === "S") lat = -lat;
		if (lngDir === "W") lng = -lng;

		return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
	}

	// 6. Decimal coordinates: 59.419611, 17.961750 or 59.419611 17.961750
	const decimalMatch = trimmed.match(/^([-\d.]+)[,\s]+([-\d.]+)$/);
	if (decimalMatch) {
		const lat = parseFloat(decimalMatch[1]);
		const lng = parseFloat(decimalMatch[2]);
		if (
			!isNaN(lat) &&
			!isNaN(lng) &&
			lat >= -90 &&
			lat <= 90 &&
			lng >= -180 &&
			lng <= 180
		) {
			return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
		}
	}

	// 7. URL with query parameters containing coordinates
	// Example: https://maps.google.com/maps?q=59.419611,17.961750
	const queryMatch = trimmed.match(/[?&]q=([-\d.]+),([-\d.]+)/);
	if (queryMatch) {
		const lat = parseFloat(queryMatch[1]);
		const lng = parseFloat(queryMatch[2]);
		if (!isNaN(lat) && !isNaN(lng)) {
			return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
		}
	}

	return null;
}

/**
 * Extract coordinates from various map input formats for external Google Maps link
 */
function extractCoordinates(
	input?: string
): { lat: number; lng: number } | null {
	if (!input) return null;

	const trimmed = input.trim();

	// From embed URL pb parameter: !3d=lat !2d=lng
	const pbLatMatch = trimmed.match(/!3d([-\d.]+)/);
	const pbLngMatch = trimmed.match(/!2d([-\d.]+)/);
	if (pbLatMatch && pbLngMatch) {
		return { lat: parseFloat(pbLatMatch[1]), lng: parseFloat(pbLngMatch[1]) };
	}

	// From place URL: @lat,lng
	const placeMatch = trimmed.match(/@([-\d.]+),([-\d.]+)/);
	if (placeMatch) {
		return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };
	}

	// From query parameter: q=lat,lng
	const queryMatch = trimmed.match(/[?&]q=([-\d.]+),([-\d.]+)/);
	if (queryMatch) {
		return { lat: parseFloat(queryMatch[1]), lng: parseFloat(queryMatch[2]) };
	}

	// DMS Coordinates
	const dmsMatch = trimmed.match(
		/(\d+)[°]\s*(\d+)[′']\s*([\d.]+)[″"]?\s*([NS])\s*(\d+)[°]\s*(\d+)[′']\s*([\d.]+)[″"]?\s*([EW])/i
	);
	if (dmsMatch) {
		const latDeg = parseFloat(dmsMatch[1]);
		const latMin = parseFloat(dmsMatch[2]);
		const latSec = parseFloat(dmsMatch[3]);
		const latDir = dmsMatch[4].toUpperCase();
		const lngDeg = parseFloat(dmsMatch[5]);
		const lngMin = parseFloat(dmsMatch[6]);
		const lngSec = parseFloat(dmsMatch[7]);
		const lngDir = dmsMatch[8].toUpperCase();

		let lat = latDeg + latMin / 60 + latSec / 3600;
		let lng = lngDeg + lngMin / 60 + lngSec / 3600;

		if (latDir === "S") lat = -lat;
		if (lngDir === "W") lng = -lng;

		return { lat, lng };
	}

	// Decimal coordinates
	const decimalMatch = trimmed.match(/^([-\d.]+)[,\s]+([-\d.]+)$/);
	if (decimalMatch) {
		const lat = parseFloat(decimalMatch[1]);
		const lng = parseFloat(decimalMatch[2]);
		if (!isNaN(lat) && !isNaN(lng)) {
			return { lat, lng };
		}
	}

	return null;
}

/**
 * Generate address-based embed URL as fallback
 */
function generateAddressBasedEmbedUrl(address: IOffice): string {
	const query = encodeURIComponent(
		`${address.street}, ${address.postalCode} ${address.city}, ${address.country}`
	);
	return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

export function AnimatedOfficeLocations({
	data,
	addresses,
}: AnimatedOfficeLocationsProps) {
	const [activeTab, setActiveTab] = useState(0);

	// Pre-process all addresses to get valid embed URLs
	const processedAddresses = useMemo(() => {
		return addresses.map((address) => {
			const parsedUrl = parseMapInput(address.mapEmbedUrl);
			// If parsing fails but we have address info, generate address-based embed
			const embedUrl =
				parsedUrl || generateAddressBasedEmbedUrl(address);
			return {
				...address,
				processedEmbedUrl: embedUrl,
			};
		});
	}, [addresses]);

	// Guard against empty addresses
	if (!addresses || addresses.length === 0) {
		return null;
	}

	const activeAddress = processedAddresses[activeTab];

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
		>
			<div className="mb-8">
				{data.badge && (
					<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5">
						<MapPin className="h-4 w-4 text-secondary" />
						<span className="text-sm font-semibold text-secondary">
							{data.badge}
						</span>
					</div>
				)}
				<h2 className="mb-4 text-3xl font-medium text-secondary md:text-4xl">
					{data.title}
				</h2>
				<p className="text-lg text-foreground/70">{data.subtitle}</p>
			</div>

			{/* Tabs */}
			{addresses.length > 1 && (
				<div className="mb-6 flex gap-2 rounded-xl bg-muted p-1.5">
					{processedAddresses.map((address, index) => (
						<button
							key={address.name}
							onClick={() => setActiveTab(index)}
							className={`flex-1 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
								activeTab === index
									? "bg-background text-secondary shadow-md"
									: "text-foreground/70 hover:text-secondary"
							}`}
						>
							{address.city}
						</button>
					))}
				</div>
			)}

			{/* Map with Floating Card - Desktop: Side by Side, Mobile: Stacked */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Map Section - Show embed or placeholder */}
				<div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
					<div className="h-[400px] w-full">
						{processedAddresses.map((address, index) => (
							<motion.div
								key={address.name}
								initial={false}
								animate={{
									opacity: activeTab === index ? 1 : 0,
									scale: activeTab === index ? 1 : 0.95,
								}}
								transition={{ duration: 0.3 }}
								className="absolute inset-0"
								style={{
									pointerEvents: activeTab === index ? "auto" : "none",
									zIndex: activeTab === index ? 1 : 0,
								}}
							>
								<iframe
									src={address.processedEmbedUrl}
									width="100%"
									height="100%"
									style={{ border: 0 }}
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
									title={`Map of ${address.name}`}
								/>
							</motion.div>
						))}
					</div>
				</div>

				{/* Info Card */}
				<motion.div
					className="rounded-2xl border border-border bg-background p-8 shadow-lg"
					layout
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={activeTab}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
						>
							<div className="mb-6 flex items-start justify-between">
								<div>
									<h3 className="mb-2 text-2xl font-medium text-secondary">
										{activeAddress.name}
									</h3>
									<div className="flex items-center gap-2 text-sm text-foreground/70">
										<MapPin className="h-4 w-4 text-secondary" />
										<span className="font-medium">{activeAddress.city}</span>
									</div>
								</div>
								<div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10">
									<MapPin className="h-7 w-7 text-secondary" />
								</div>
							</div>

							<div className="space-y-4 border-t border-border pt-6">
								<div className="flex items-start gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
										<MapPin className="h-5 w-5 text-foreground/70" />
									</div>
									<div className="flex-1">
										<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground/60">
											Adress
										</p>
										<p className="font-medium text-secondary">
											{activeAddress.street}
										</p>
										<p className="text-sm text-foreground/70">
											{activeAddress.postalCode} {activeAddress.city}
										</p>
										<p className="text-sm text-foreground/70">
											{activeAddress.country}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
										<Clock className="h-5 w-5 text-foreground/70" />
									</div>
									<div className="flex-1">
										<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground/60">
											Öppettider
										</p>
										{data.openingHours && (
											<p className="font-medium text-secondary">
												{data.openingHours}
											</p>
										)}
										{data.closedText && (
											<p className="text-sm text-foreground/70">{data.closedText}</p>
										)}
									</div>
								</div>
							</div>

							{/* Google Maps link */}
							{(() => {
								const coords = extractCoordinates(activeAddress.mapEmbedUrl);
								const searchQuery = encodeURIComponent(
									`${activeAddress.street}, ${activeAddress.postalCode} ${activeAddress.city}, ${activeAddress.country}`
								);
								const href = coords
									? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
									: `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
								return (
									<a
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary hover:shadow-lg"
									>
										<MapPin className="h-4 w-4" />
										Öppna i Google Maps
									</a>
								);
							})()}
						</motion.div>
					</AnimatePresence>
				</motion.div>
			</div>
		</motion.div>
	);
}
