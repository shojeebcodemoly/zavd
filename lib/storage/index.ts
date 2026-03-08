/**
 * Storage Module - Server-side exports
 * This module contains Node.js dependencies and should only be imported in server components/API routes
 *
 * For client components, use: import { ... } from "@/lib/storage/client"
 */

import "server-only";

// Service (server-only, uses fs)
export { storageService, StorageService } from "./service";

// Types (safe for both)
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

// Constants (safe for both)
export {
	STORAGE_CONFIG,
	FILE_SIZE_LIMITS,
	ALLOWED_IMAGE_TYPES,
	ALLOWED_DOCUMENT_TYPES,
	ALLOWED_MIME_TYPES,
	MIME_TO_EXTENSION,
	STORAGE_MESSAGES,
	STORAGE_API_ROUTES,
} from "./constants";

// Validation (safe for both)
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

// Utilities (server-only, uses path and crypto)
export {
	StorageError,
	generateUUID,
	slugify,
	generateFilename,
	generateUniqueFilename,
	getExtensionFromMime,
	getExtensionFromFilename,
	getMimeFromExtension,
	getStorageBasePath,
	getFolderPath,
	getFilePath,
	getFileUrl,
	isAllowedMimeType,
	getFileSizeLimit,
	isValidFileSize,
	verifyMagicBytes,
	detectMimeFromBytes,
	inferFolder,
	sanitizeFilename,
	formatFileSize,
	isValidUUID,
	extractUUIDFromFilename,
} from "./utils";
