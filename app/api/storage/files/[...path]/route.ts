/**
 * Dynamic File Serving Route
 * Serves files from the storage directory dynamically
 * This is needed because Next.js doesn't serve files added to public/ after build
 */

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { STORAGE_CONFIG, EXTENSION_TO_MIME } from "@/lib/storage/constants";

// Valid storage folders
const VALID_FOLDERS = ["images", "documents", "avatars"];

// Cache control headers for different file types
const CACHE_CONTROL = {
	images: "public, max-age=31536000, immutable", // 1 year for images
	documents: "public, max-age=86400", // 1 day for documents
	avatars: "public, max-age=0, must-revalidate", // No cache for avatars (use query param for cache busting)
};

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> }
) {
	try {
		const { path: pathSegments } = await params;

		if (!pathSegments || pathSegments.length < 2) {
			return NextResponse.json(
				{ error: "Invalid path" },
				{ status: 400 }
			);
		}

		const folder = pathSegments[0];
		const filePath = pathSegments.slice(1).join("/");

		// Validate folder
		if (!VALID_FOLDERS.includes(folder)) {
			return NextResponse.json(
				{ error: "Invalid folder" },
				{ status: 400 }
			);
		}

		// Prevent path traversal
		if (filePath.includes("..") || filePath.includes("//")) {
			return NextResponse.json(
				{ error: "Invalid path" },
				{ status: 400 }
			);
		}

		// Build absolute file path
		const storagePath = path.resolve(process.cwd(), STORAGE_CONFIG.BASE_PATH);
		const absolutePath = path.join(storagePath, folder, filePath);

		// Verify the resolved path is within storage directory
		if (!absolutePath.startsWith(storagePath)) {
			return NextResponse.json(
				{ error: "Invalid path" },
				{ status: 400 }
			);
		}

		// Check if file exists
		try {
			await fs.access(absolutePath);
		} catch {
			return NextResponse.json(
				{ error: "File not found" },
				{ status: 404 }
			);
		}

		// Get file stats for ETag
		const stats = await fs.stat(absolutePath);
		const etag = `"${stats.mtime.getTime().toString(16)}-${stats.size.toString(16)}"`;

		// Check If-None-Match header for conditional requests
		const ifNoneMatch = request.headers.get("If-None-Match");
		if (ifNoneMatch === etag) {
			return new NextResponse(null, {
				status: 304,
				headers: {
					ETag: etag,
				},
			});
		}

		// Read the file
		const fileBuffer = await fs.readFile(absolutePath);

		// Get MIME type from extension
		const ext = path.extname(absolutePath).toLowerCase();
		const mimeType = EXTENSION_TO_MIME[ext] || "application/octet-stream";

		// Determine cache control based on folder
		const cacheControl =
			CACHE_CONTROL[folder as keyof typeof CACHE_CONTROL] ||
			"public, max-age=3600";

		// Return file with appropriate headers
		return new NextResponse(fileBuffer, {
			status: 200,
			headers: {
				"Content-Type": mimeType,
				"Content-Length": fileBuffer.length.toString(),
				"Cache-Control": cacheControl,
				ETag: etag,
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch (error) {
		console.error("Error serving file:", error);
		return NextResponse.json(
			{ error: "Failed to serve file" },
			{ status: 500 }
		);
	}
}
