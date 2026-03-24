/**
 * File Serving Route
 * Files are now served directly from Cloudinary CDN.
 * This route is kept for backward compatibility but returns 404.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
	return NextResponse.json(
		{ error: "File not found. Files are served directly from Cloudinary CDN." },
		{ status: 404 }
	);
}
