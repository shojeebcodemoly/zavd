/**
 * Storage System Types
 * Type definitions for the file storage system
 */

/**
 * Available storage folders
 * Note: "avatars" is for user profile images and is NOT listed in the storage manager
 */
export type StorageFolder = "images" | "documents" | "avatars";

/**
 * File information returned after upload
 */
export interface StorageFile {
	/** Unique identifier (UUID) */
	id: string;
	/** Stored filename (UUID + extension) */
	filename: string;
	/** Original filename from upload */
	originalName: string;
	/** File MIME type */
	mimeType: string;
	/** File size in bytes */
	size: number;
	/** Storage folder */
	folder: StorageFolder;
	/** Public URL path */
	url: string;
	/** Upload timestamp */
	createdAt: Date;
}

/**
 * File metadata from filesystem
 */
export interface FileMetadata {
	/** Stored filename */
	filename: string;
	/** File MIME type (inferred from extension) */
	mimeType: string;
	/** File size in bytes */
	size: number;
	/** Storage folder */
	folder: StorageFolder;
	/** Public URL path */
	url: string;
	/** File modification time */
	modifiedAt: Date;
	/** File creation time */
	createdAt: Date;
}

/**
 * Upload request data
 */
export interface UploadRequest {
	/** File buffer */
	buffer: Buffer;
	/** Original filename */
	originalName: string;
	/** File MIME type */
	mimeType: string;
	/** File size in bytes */
	size: number;
	/** Target folder (optional, auto-detected from MIME) */
	folder?: StorageFolder;
}

/**
 * Delete request data
 */
export interface DeleteRequest {
	/** Filename to delete */
	filename: string;
	/** Storage folder */
	folder: StorageFolder;
}

/**
 * List request options
 */
export interface ListOptions {
	/** Storage folder to list */
	folder: StorageFolder;
	/** Page number (1-indexed) */
	page?: number;
	/** Items per page */
	limit?: number;
	/** Sort order */
	sort?: "asc" | "desc";
}

/**
 * Paginated list result
 */
export interface ListResult {
	/** Array of file metadata */
	files: FileMetadata[];
	/** Current page */
	page: number;
	/** Items per page */
	limit: number;
	/** Total file count */
	total: number;
	/** Total pages */
	totalPages: number;
}

/**
 * Storage operation result
 */
export interface StorageResult<T = void> {
	success: boolean;
	data?: T;
	error?: string;
}

/**
 * Storage error details
 */
export interface StorageErrorDetails {
	code: StorageErrorCode;
	field?: string;
	value?: string | number;
	allowed?: string[] | number;
}

/**
 * Storage error codes
 */
export type StorageErrorCode =
	| "FILE_REQUIRED"
	| "INVALID_MIME_TYPE"
	| "MIME_MISMATCH"
	| "FILE_TOO_LARGE"
	| "INVALID_FOLDER"
	| "FILE_NOT_FOUND"
	| "STORAGE_ERROR"
	| "PATH_TRAVERSAL";

/**
 * MIME type to extension mapping
 */
export interface MimeExtensionMap {
	[mimeType: string]: string;
}

/**
 * Magic bytes signature
 */
export interface MagicBytes {
	mimeType: string;
	bytes: number[];
	offset?: number;
}
