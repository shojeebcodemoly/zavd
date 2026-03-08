"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

interface GoogleMapProps {
	lat: number;
	lng: number;
	title: string;
	address: string;
}

export function GoogleMap({ lat, lng, title, address }: GoogleMapProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);

	// Google Maps link for opening in new tab
	const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

	// Use iframe embed without API key (free option)
	const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

	return (
		<div className="relative h-full w-full overflow-hidden bg-slate-100">
			{/* Loading placeholder */}
			{!isLoaded && !hasError && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
					<div className="text-center">
						<div className="mb-3 flex justify-center">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
								<MapPin className="h-8 w-8 animate-pulse text-secondary" />
							</div>
						</div>
						<div className="mb-2 text-lg font-semibold text-secondary">
							Laddar karta...
						</div>
						<div className="text-sm text-slate-600">{address}</div>
					</div>
				</div>
			)}

			{/* Error fallback */}
			{hasError && (
				<div className="flex h-full items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-8 text-center">
					<div className="max-w-sm">
						<div className="mb-4 flex justify-center">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
								<MapPin className="h-8 w-8 text-secondary" />
							</div>
						</div>
						<h3 className="mb-2 text-xl font-medium text-secondary">
							{title}
						</h3>
						<p className="mb-6 text-sm text-slate-600">{address}</p>
						<a
							href={googleMapsLink}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary hover:shadow-lg"
						>
							<MapPin className="h-4 w-4" />
							Visa i Google Maps
						</a>
					</div>
				</div>
			)}

			{/* Embedded map */}
			<iframe
				src={embedUrl}
				width="100%"
				height="100%"
				style={{ border: 0 }}
				allowFullScreen
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
				onLoad={() => {
					setIsLoaded(true);
					setHasError(false);
				}}
				onError={() => {
					setHasError(true);
					setIsLoaded(false);
				}}
				title={`Karta till ${title}`}
				className="h-full w-full"
			/>
		</div>
	);
}
