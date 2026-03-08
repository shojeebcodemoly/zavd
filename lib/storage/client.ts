/**
 * Storage Module - Client-safe exports
 * These exports can be safely used in client components (no Node.js dependencies)
 */

// Types
export type {
	StorageFolder,
	StorageFile,
	FileMetadata,
	UploadRequest,
	DeleteRequest,
	ListOptions,
	ListResult,
	StorageResult,
	StorageErrorCode,
	StorageErrorDetails,
} from "./types";

// Constants
export {
	STORAGE_CONFIG,
	FILE_SIZE_LIMITS,
	ALLOWED_IMAGE_TYPES,
	ALLOWED_DOCUMENT_TYPES,
	ALLOWED_MIME_TYPES,
	MIME_TO_EXTENSION,
	EXTENSION_TO_MIME,
	STORAGE_MESSAGES,
	STORAGE_API_ROUTES,
} from "./constants";

// Validation
export {
	storageFolderSchema,
	filenameSchema,
	deleteRequestSchema,
	listRequestSchema,
	uploadRequestSchema,
	validateFileForUpload,
	inferFolderFromMime,
} from "./validation";

export type {
	StorageFolderInput,
	UploadRequestInput,
	DeleteRequestInput,
	ListRequestInput,
} from "./validation";

/**
 * Format file size for display (client-safe)
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 B";

	const units = ["B", "KB", "MB", "GB"];
	const k = 1024;
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}
