"use client";

import { MapPin, Phone, Mail, Navigation } from "lucide-react";
import type { IStoreMapSection } from "@/models/store-page.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StoreMapProps {
	data: IStoreMapSection;
}

export function StoreMap({ data }: StoreMapProps) {
	const fullAddress = [data.address, data.postalCode, data.city, data.country]
		.filter(Boolean)
		.join(", ");

	return (
		<Card className="h-full border-border bg-background shadow-sm overflow-hidden">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="rounded-full bg-primary/10 p-3">
						<MapPin className="h-6 w-6 text-primary" />
					</div>
					<div>
						{data.title && (
							<CardTitle className="text-2xl font-medium text-secondary">
								{data.title}
							</CardTitle>
						)}
						{data.subtitle && (
							<p className="text-sm text-muted-foreground mt-1">
								{data.subtitle}
							</p>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Contact Info */}
				<div className="space-y-3">
					{/* Address */}
					{fullAddress && (
						<div className="flex items-start gap-3">
							<MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
							<div>
								<p className="font-medium text-foreground">{data.address}</p>
								<p className="text-sm text-muted-foreground">
									{data.postalCode} {data.city}
								</p>
								{data.country && (
									<p className="text-sm text-muted-foreground">{data.country}</p>
								)}
							</div>
						</div>
					)}

					{/* Phone */}
					{data.phone && (
						<a
							href={`tel:${data.phone.replace(/\s/g, "")}`}
							className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
						>
							<Phone className="h-5 w-5 text-muted-foreground" />
							<span>{data.phone}</span>
						</a>
					)}

					{/* Email */}
					{data.email && (
						<a
							href={`mailto:${data.email}`}
							className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
						>
							<Mail className="h-5 w-5 text-muted-foreground" />
							<span>{data.email}</span>
						</a>
					)}
				</div>

				{/* Directions */}
				{data.directions && (
					<div className="flex items-start gap-3 rounded-lg bg-muted p-4">
						<Navigation className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
						<p className="text-sm text-muted-foreground">{data.directions}</p>
					</div>
				)}

				{/* Map Embed */}
				{data.mapEmbedUrl && (
					<div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border border-border">
						<iframe
							src={data.mapEmbedUrl}
							width="100%"
							height="100%"
							style={{ border: 0 }}
							allowFullScreen
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							title="Store location map"
						/>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
