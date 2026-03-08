/**
 * Storage Validation Schemas
 * Zod schemas for validating storage operations
 */

import { z } from "zod";
import {
	ALLOWED_MIME_TYPES,
	FILE_SIZE_LIMITS,
	STORAGE_CONFIG,
} from "./constants";

/**
 * Storage folder enum schema
 */
export const storageFolderSchema = z.enum(["images", "documents"], {
	error: "Folder must be 'images' or 'documents'",
});

/**
 * Filename schema (slugified name with extension)
 * Accepts: alphanumeric characters, hyphens, and must have an extension
 * Examples: "my-image.jpg", "document-1.pdf", "file-name-here.png"
 */
export const filenameSchema = z
	.string()
	.min(1, "Filename is required")
	.max(255, "Filename too long")
	.regex(
		/^[a-z0-9][a-z0-9-]*\.[a-z0-9]+$/i,
		"Invalid filename format. Use alphanumeric characters, hyphens, and include file extension"
	)
	.refine(
		(name) => !name.includes("..") && !name.includes("//"),
		"Invalid filename: path traversal not allowed"
	);

/**
 * MIME type schema
 */
export const mimeTypeSchema = z.enum(
	ALLOWED_MIME_TYPES as unknown as [string, ...string[]],
	{
		error: `File type must be one of: ${ALLOWED_MIME_TYPES.join(", ")}`,
	}
);

/**
 * File size schema (with dynamic limit based on type)
 */
export const fileSizeSchema = z
	.number()
	.positive("File size must be positive")
	.max(FILE_SIZE_LIMITS.DOCUMENT, `File size exceeds maximum allowed`);

/**
 * Upload request validation schema
 */
export const uploadRequestSchema = z.object({
	folder: storageFolderSchema.optional(),
});

/**
 * Delete request validation schema
 */
export const deleteRequestSchema = z.object({
	filename: filenameSchema,
	folder: storageFolderSchema,
});

/**
 * List request validation schema
 */
export const listRequestSchema = z.object({
	folder: storageFolderSchema,
	page: z.coerce
		.number()
		.int()
		.positive()
		.default(STORAGE_CONFIG.DEFAULT_PAGE)
		.optional(),
	limit: z.coerce
		.number()
		.int()
		.positive()
		.max(STORAGE_CONFIG.MAX_LIMIT)
		.default(STORAGE_CONFIG.DEFAULT_LIMIT)
		.optional(),
	sort: z.enum(["asc", "desc"]).default("desc").optional(),
});

/**
 * Type exports from schemas
 */
export type StorageFolderInput = z.infer<typeof storageFolderSchema>;
export type UploadRequestInput = z.infer<typeof uploadRequestSchema>;
export type DeleteRequestInput = z.infer<typeof deleteRequestSchema>;
export type ListRequestInput = z.infer<typeof listRequestSchema>;

/**
 * Validate file for upload
 * Returns validation result with detailed errors
 */
export function validateFileForUpload(
	mimeType: string,
	size: number,
	folder?: string
): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	// Validate MIME type
	if (
		!ALLOWED_MIME_TYPES.includes(
			mimeType as (typeof ALLOWED_MIME_TYPES)[number]
		)
	) {
		errors.push(`File type '${mimeType}' is not allowed`);
	}

	// Determine size limit based on MIME type
	const isImage = mimeType.startsWith("image/");
	const maxSize = isImage ? FILE_SIZE_LIMITS.IMAGE : FILE_SIZE_LIMITS.DOCUMENT;

	// Validate size
	if (size > maxSize) {
		const maxMB = Math.round(maxSize / (1024 * 1024));
		errors.push(`File size exceeds ${maxMB}MB limit`);
	}

	// Validate folder if provided
	if (folder && !["images", "documents"].includes(folder)) {
		errors.push(`Invalid folder '${folder}'`);
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Infer folder from MIME type
 */
export function inferFolderFromMime(mimeType: string): "images" | "documents" {
	if (mimeType.startsWith("image/")) {
		return "images";
	}
	return "documents";
}
