import { ImageResponse } from "next/og";
import { getBrandingSettings } from "@/lib/services/site-settings.service";

// Apple Touch Icon metadata (180x180 for retina displays)
export const size = {
	width: 180,
	height: 180,
};
export const contentType = "image/png";

// Dynamic route - revalidate on-demand via revalidatePath("/apple-icon")
export const revalidate = 0;

/**
 * Dynamic Apple Touch Icon Generator
 *
 * If a custom favicon URL is set in the database, it will proxy that image.
 * Otherwise, generates a branded fallback icon with the "S" logo.
 */
export default async function AppleIcon() {
	const brandingSettings = await getBrandingSettings();
	const faviconUrl = brandingSettings?.faviconUrl;

	// If custom favicon is set, try to fetch and return it
	if (faviconUrl) {
		try {
			// Handle relative URLs by converting to absolute
			const absoluteUrl = faviconUrl.startsWith("http")
				? faviconUrl
				: `${process.env.SITE_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000"}${faviconUrl}`;

			const response = await fetch(absoluteUrl, {
				cache: "no-store",
			});

			if (response.ok) {
				const contentType = response.headers.get("content-type");
				const buffer = await response.arrayBuffer();

				return new Response(buffer, {
					headers: {
						"Content-Type": contentType || "image/png",
						"Cache-Control": "public, max-age=3600, s-maxage=3600",
					},
				});
			}
		} catch (error) {
			console.error("Failed to fetch custom favicon for apple-icon:", error);
			// Fall through to generate fallback
		}
	}

	// Generate branded fallback icon matching the Synos brand
	// Dark rounded rectangle with teal/cyan "S"
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "linear-gradient(145deg, #1e2a3a 0%, #0f1419 100%)",
					borderRadius: "32px",
				}}
			>
				<span
					style={{
						color: "#4ecdc4",
						fontSize: "120px",
						fontWeight: 700,
						fontFamily:
							"system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
						letterSpacing: "-2px",
					}}
				>
					S
				</span>
			</div>
		),
		{
			...size,
		}
	);
}
