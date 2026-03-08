import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import { getBrandingSettings } from "@/lib/services/site-settings.service";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const revalidate = 0;

/**
 * Dynamic Favicon Generator
 *
 * If a custom favicon URL is set in the database, it will proxy that image.
 * Otherwise, renders the Glada Bonden Mejeri SVG logo on a dark background.
 */
export default async function Icon() {
	const brandingSettings = await getBrandingSettings();
	const faviconUrl = brandingSettings?.faviconUrl;

	// If custom favicon is set, try to fetch and return it
	if (faviconUrl) {
		try {
			const absoluteUrl = faviconUrl.startsWith("http")
				? faviconUrl
				: `${process.env.SITE_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000"}${faviconUrl}`;

			const response = await fetch(absoluteUrl, { cache: "no-store" });

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
			console.error("Failed to fetch custom favicon:", error);
		}
	}

	// Fallback: render SVG logo in black (replace white fill with black)
	const svgPath = path.join(process.cwd(), "public", "storage", "glada-bonden-mejeri-w.svg");
	const svgBlack = fs.readFileSync(svgPath, "utf8").replace(/fill:\s*#fff/g, "fill: #1a1a1a");
	const svgBase64 = `data:image/svg+xml;base64,${Buffer.from(svgBlack).toString("base64")}`;

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src={svgBase64} width={32} height={32} alt="" />
			</div>
		),
		{ ...size }
	);
}
