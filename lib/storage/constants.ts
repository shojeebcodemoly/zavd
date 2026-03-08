/**
 * Storage System Constants
 * Configuration values for the file storage system
 */

import type { MimeExtensionMap, StorageFolder } from "./types";

/**
 * Storage configuration
 */
export const STORAGE_CONFIG = {
	/** Base path relative to project root (inside public for static serving) */
	BASE_PATH: "public/storage",

	/** Available storage folders */
	FOLDERS: {
		IMAGES: "images" as StorageFolder,
		DOCUMENTS: "documents" as StorageFolder,
		AVATARS: "avatars" as StorageFolder,
	},

	/** Folders visible in storage manager (excludes avatars) */
	PUBLIC_FOLDERS: ["images", "documents"] as StorageFolder[],

	/** Default pagination */
	DEFAULT_PAGE: 1,
	DEFAULT_LIMIT: 20,
	MAX_LIMIT: 100,
} as const;

/**
 * File size limits (in bytes)
 */
export const FILE_SIZE_LIMITS = {
	/** Maximum image size: 5MB */
	IMAGE: 15 * 1024 * 1024,

	/** Maximum document size: 20MB */
	DOCUMENT: 100 * 1024 * 1024,

	/** Default maximum: 10MB */
	DEFAULT: 100 * 1024 * 1024,
} as const;

/**
 * Allowed MIME types for images
 */
export const ALLOWED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"image/svg+xml",
] as const;

/**
 * Allowed MIME types for documents
 */
export const ALLOWED_DOCUMENT_TYPES = [
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

/**
 * All allowed MIME types
 */
export const ALLOWED_MIME_TYPES = [
	...ALLOWED_IMAGE_TYPES,
	...ALLOWED_DOCUMENT_TYPES,
] as const;

/**
 * MIME type to file extension mapping
 */
export const MIME_TO_EXTENSION: MimeExtensionMap = {
	// Images
	"image/jpeg": ".jpg",
	"image/png": ".png",
	"image/webp": ".webp",
	"image/gif": ".gif",
	"image/svg+xml": ".svg",

	// Documents
	"application/pdf": ".pdf",
	"application/msword": ".doc",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
		".docx",
};

/**
 * File extension to MIME type mapping
 */
export const EXTENSION_TO_MIME: Record<string, string> = {
	// Images
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".webp": "image/webp",
	".gif": "image/gif",
	".svg": "image/svg+xml",

	// Documents
	".pdf": "application/pdf",
	".doc": "application/msword",
	".docx":
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/**
 * Magic bytes signatures for MIME type verification
 * These are the first bytes of each file format
 */
export const MAGIC_BYTES: Record<string, number[]> = {
	// JPEG: FF D8 FF
	"image/jpeg": [0xff, 0xd8, 0xff],

	// PNG: 89 50 4E 47 0D 0A 1A 0A
	"image/png": [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],

	// GIF: 47 49 46 38 (GIF8)
	"image/gif": [0x47, 0x49, 0x46, 0x38],

	// WebP: 52 49 46 46 (RIFF) - WebP files start with RIFF
	"image/webp": [0x52, 0x49, 0x46, 0x46],

	// PDF: 25 50 44 46 (%PDF)
	"application/pdf": [0x25, 0x50, 0x44, 0x46],

	// DOC: D0 CF 11 E0 (OLE Compound Document)
	"application/msword": [0xd0, 0xcf, 0x11, 0xe0],

	// DOCX: 50 4B 03 04 (ZIP/PK)
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
		0x50, 0x4b, 0x03, 0x04,
	],
};

/**
 * Storage error messages
 */
export const STORAGE_MESSAGES = {
	// Success messages
	UPLOAD_SUCCESS: "File uploaded successfully",
	DELETE_SUCCESS: "File deleted successfully",
	LIST_SUCCESS: "Files retrieved successfully",

	// Error messages
	FILE_REQUIRED: "File is required",
	INVALID_MIME_TYPE: "File type is not allowed",
	MIME_MISMATCH:
		"File content does not match declared type (possible spoofing attempt)",
	FILE_TOO_LARGE: "File size exceeds the maximum allowed limit",
	INVALID_FOLDER: "Invalid storage folder",
	FILE_NOT_FOUND: "File not found",
	STORAGE_ERROR: "Storage operation failed",
	PATH_TRAVERSAL: "Invalid file path",
	UNAUTHORIZED: "Authentication required for this operation",
} as const;

/**
 * API route configuration
 */
export const STORAGE_API_ROUTES = {
	UPLOAD: "/api/storage/upload",
	DELETE: "/api/storage/delete",
	LIST: "/api/storage/list",
} as const;
