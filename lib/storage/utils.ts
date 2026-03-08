/**
 * Storage Utilities
 * Helper functions for file storage operations
 */

import { randomUUID } from "crypto";
import path from "path";
import {
	STORAGE_CONFIG,
	MIME_TO_EXTENSION,
	EXTENSION_TO_MIME,
	MAGIC_BYTES,
	ALLOWED_MIME_TYPES,
	FILE_SIZE_LIMITS,
} from "./constants";
import type {
	StorageFolder,
	StorageErrorCode,
	StorageErrorDetails,
} from "./types";

/**
 * Custom storage error class
 */
export class StorageError extends Error {
	public code: StorageErrorCode;
	public details?: StorageErrorDetails;
	public statusCode: number;

	constructor(
		message: string,
		code: StorageErrorCode,
		statusCode: number = 400,
		details?: Omit<StorageErrorDetails, "code">
	) {
		super(message);
		this.name = "StorageError";
		this.code = code;
		this.statusCode = statusCode;
		this.details = details ? { ...details, code } : { code };
		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
	return randomUUID();
}

/**
 * Slugify a string for use in filenames
 * Converts to lowercase, replaces spaces/special chars with hyphens
 * @param text - Text to slugify
 * @returns URL-safe slug
 */
export function slugify(text: string): string {
	return (
		text
			.toString()
			.toLowerCase()
			.trim()
			// Replace spaces with hyphens
			.replace(/\s+/g, "-")
			// Remove accents/diacritics
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			// Remove non-alphanumeric characters except hyphens
			.replace(/[^a-z0-9-]/g, "")
			// Replace multiple hyphens with single hyphen
			.replace(/-+/g, "-")
			// Remove leading/trailing hyphens
			.replace(/^-+|-+$/g, "")
	);
}

/**
 * Generate a slugified filename from original name
 * @param originalName - Original filename
 * @param mimeType - File MIME type
 * @returns Slugified filename with appropriate extension
 */
export function generateFilename(
	originalName: string,
	mimeType: string
): string {
	// Get base name without extension
	const ext = path.extname(originalName);
	const baseName = path.basename(originalName, ext);

	// Slugify the base name
	const slugifiedName = slugify(baseName) || "file";

	// Get the correct extension from MIME type
	const extension = getExtensionFromMime(mimeType) || ext.toLowerCase() || "";

	return `${slugifiedName}${extension}`;
}

/**
 * Generate a unique filename, checking for duplicates
 * If file exists, appends -1, -2, etc.
 * @param originalName - Original filename
 * @param mimeType - File MIME type
 * @param folder - Storage folder to check
 * @param checkExists - Function to check if file exists
 * @returns Unique slugified filename
 */
export async function generateUniqueFilename(
	originalName: string,
	mimeType: string,
	folder: StorageFolder,
	checkExists: (filename: string, folder: StorageFolder) => Promise<boolean>
): Promise<string> {
	const baseFilename = generateFilename(originalName, mimeType);
	const ext = path.extname(baseFilename);
	const baseName = path.basename(baseFilename, ext);

	// Check if base filename is available
	if (!(await checkExists(baseFilename, folder))) {
		return baseFilename;
	}

	// Find next available number
	let counter = 1;
	let uniqueFilename: string;

	do {
		uniqueFilename = `${baseName}-${counter}${ext}`;
		counter++;

		// Safety limit to prevent infinite loops
		if (counter > 1000) {
			// Fallback to UUID if too many duplicates
			return `${baseName}-${generateUUID().slice(0, 8)}${ext}`;
		}
	} while (await checkExists(uniqueFilename, folder));

	return uniqueFilename;
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMime(mimeType: string): string | null {
	return MIME_TO_EXTENSION[mimeType] || null;
}

/**
 * Get file extension from filename
 */
export function getExtensionFromFilename(filename: string): string {
	const ext = path.extname(filename).toLowerCase();
	return ext || "";
}

/**
 * Get MIME type from file extension
 */
export function getMimeFromExtension(extension: string): string | null {
	const normalizedExt = extension.startsWith(".")
		? extension
		: `.${extension}`;
	return EXTENSION_TO_MIME[normalizedExt.toLowerCase()] || null;
}

/**
 * Get the absolute storage base path
 */
export function getStorageBasePath(): string {
	return path.resolve(process.cwd(), STORAGE_CONFIG.BASE_PATH);
}

/**
 * Get the absolute path for a storage folder
 */
export function getFolderPath(folder: StorageFolder): string {
	return path.join(getStorageBasePath(), folder);
}

/**
 * Get the absolute path for a user's avatar folder
 */
export function getUserAvatarFolderPath(userId: string): string {
	return path.join(getStorageBasePath(), "avatars", userId);
}

/**
 * Get the public URL for a user's avatar
 * Uses API route for dynamic serving (files uploaded after build)
 */
export function getUserAvatarUrl(userId: string, filename: string): string {
	return `/api/storage/files/avatars/${userId}/${filename}`;
}

/**
 * Get the absolute path for a file
 */
export function getFilePath(folder: StorageFolder, filename: string): string {
	const folderPath = getFolderPath(folder);
	const filePath = path.join(folderPath, filename);

	// Security: Prevent path traversal
	if (!filePath.startsWith(folderPath)) {
		throw new StorageError("Invalid file path", "PATH_TRAVERSAL", 400, {
			field: "filename",
			value: filename,
		});
	}

	return filePath;
}

/**
 * Get the public URL for a file
 * Uses API route for dynamic serving (files uploaded after build)
 */
export function getFileUrl(folder: StorageFolder, filename: string): string {
	return `/api/storage/files/${folder}/${filename}`;
}

/**
 * Validate MIME type against whitelist
 */
export function isAllowedMimeType(mimeType: string): boolean {
	return ALLOWED_MIME_TYPES.includes(
		mimeType as (typeof ALLOWED_MIME_TYPES)[number]
	);
}

/**
 * Get the file size limit for a MIME type
 */
export function getFileSizeLimit(mimeType: string): number {
	if (mimeType.startsWith("image/")) {
		return FILE_SIZE_LIMITS.IMAGE;
	}
	if (mimeType.startsWith("application/")) {
		return FILE_SIZE_LIMITS.DOCUMENT;
	}
	return FILE_SIZE_LIMITS.DEFAULT;
}

/**
 * Validate file size against limit
 */
export function isValidFileSize(size: number, mimeType: string): boolean {
	const limit = getFileSizeLimit(mimeType);
	return size <= limit;
}

/**
 * Verify file magic bytes match declared MIME type
 * This prevents MIME type spoofing attacks
 */
export function verifyMagicBytes(buffer: Buffer, mimeType: string): boolean {
	const expectedBytes = MAGIC_BYTES[mimeType];

	// If we don't have magic bytes for this type, skip verification
	if (!expectedBytes) {
		return true;
	}

	// Check if buffer is large enough
	if (buffer.length < expectedBytes.length) {
		return false;
	}

	// Compare magic bytes
	for (let i = 0; i < expectedBytes.length; i++) {
		if (buffer[i] !== expectedBytes[i]) {
			return false;
		}
	}

	// Special case for WebP: After RIFF, check for WEBP signature at offset 8
	if (mimeType === "image/webp" && buffer.length >= 12) {
		const webpSignature = [0x57, 0x45, 0x42, 0x50]; // WEBP
		for (let i = 0; i < webpSignature.length; i++) {
			if (buffer[8 + i] !== webpSignature[i]) {
				return false;
			}
		}
	}

	return true;
}

/**
 * Detect MIME type from magic bytes
 */
export function detectMimeFromBytes(buffer: Buffer): string | null {
	for (const [mimeType, bytes] of Object.entries(MAGIC_BYTES)) {
		if (buffer.length < bytes.length) continue;

		let matches = true;
		for (let i = 0; i < bytes.length; i++) {
			if (buffer[i] !== bytes[i]) {
				matches = false;
				break;
			}
		}

		if (matches) {
			// Special handling for WebP
			if (mimeType === "image/webp" && buffer.length >= 12) {
				const webpSignature = [0x57, 0x45, 0x42, 0x50];
				let isWebp = true;
				for (let i = 0; i < webpSignature.length; i++) {
					if (buffer[8 + i] !== webpSignature[i]) {
						isWebp = false;
						break;
					}
				}
				if (!isWebp) continue;
			}
			return mimeType;
		}
	}

	return null;
}

/**
 * Infer folder from MIME type
 */
export function inferFolder(mimeType: string): StorageFolder {
	if (mimeType.startsWith("image/")) {
		return "images";
	}
	return "documents";
}

/**
 * Sanitize original filename for logging/storage
 * Removes path components and dangerous characters
 */
export function sanitizeFilename(filename: string): string {
	// Get just the filename without path
	const basename = path.basename(filename);

	// Remove or replace dangerous characters
	return basename
		.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
		.replace(/\.{2,}/g, ".")
		.trim();
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 B";

	const units = ["B", "KB", "MB", "GB"];
	const k = 1024;
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}

/**
 * Check if a string is a valid UUID
 */
export function isValidUUID(str: string): boolean {
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return uuidRegex.test(str);
}

/**
 * Extract UUID from filename
 */
export function extractUUIDFromFilename(filename: string): string | null {
	const match = filename.match(
		/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
	);
	return match ? match[1] : null;
}
