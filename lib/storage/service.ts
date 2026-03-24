/**
 * Storage Service — Cloudinary
 * Core file storage operations: upload, delete, list
 */

import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { logger } from "@/lib/utils/logger";
import { STORAGE_MESSAGES } from "./constants";
import type {
	StorageFile,
	FileMetadata,
	StorageFolder,
	ListResult,
	UploadRequest,
} from "./types";
import {
	StorageError,
	generateFilename,
	slugify,
	isAllowedMimeType,
	isValidFileSize,
	verifyMagicBytes,
	inferFolder,
	sanitizeFilename,
	getExtensionFromMime,
} from "./utils";

// ─── Cloudinary Config ────────────────────────────────────────────────────────

cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });

const CLOUD_FOLDER = "zavd";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getResourceType(folder: StorageFolder): "image" | "raw" {
	return folder === "documents" ? "raw" : "image";
}

function buildPublicId(folder: StorageFolder, basename: string): string {
	return `${CLOUD_FOLDER}/${folder}/${basename}`;
}

function formatToMime(format: string, resourceType: string): string {
	if (resourceType === "raw") {
		const map: Record<string, string> = {
			pdf: "application/pdf",
			doc: "application/msword",
			docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		};
		return map[format] || "application/octet-stream";
	}
	const imageMap: Record<string, string> = {
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		png: "image/png",
		webp: "image/webp",
		gif: "image/gif",
		svg: "image/svg+xml",
	};
	return imageMap[format] || `image/${format}`;
}

// ─── Storage Service ──────────────────────────────────────────────────────────

class StorageService {
	private initialized = false;

	async initialize(): Promise<void> {
		if (this.initialized) return;
		// Cloudinary needs no local directory setup
		this.initialized = true;
		logger.info("Cloudinary storage initialized");
	}

	private async ensureInitialized(): Promise<void> {
		if (!this.initialized) await this.initialize();
	}

	async upload(request: UploadRequest): Promise<StorageFile> {
		await this.ensureInitialized();

		const { buffer, originalName, mimeType, size, folder: requestedFolder } = request;

		const safeOriginalName = sanitizeFilename(originalName);

		if (!isAllowedMimeType(mimeType)) {
			throw new StorageError(STORAGE_MESSAGES.INVALID_MIME_TYPE, "INVALID_MIME_TYPE", 400, {
				field: "mimeType",
				value: mimeType,
			});
		}

		if (!isValidFileSize(size, mimeType)) {
			throw new StorageError(STORAGE_MESSAGES.FILE_TOO_LARGE, "FILE_TOO_LARGE", 400, {
				field: "size",
				value: size,
			});
		}

		if (!verifyMagicBytes(buffer, mimeType)) {
			logger.warn("MIME type mismatch detected", { declaredMime: mimeType, originalName: safeOriginalName });
			throw new StorageError(STORAGE_MESSAGES.MIME_MISMATCH, "MIME_MISMATCH", 400, {
				field: "file",
				value: mimeType,
			});
		}

		const folder: StorageFolder = requestedFolder || inferFolder(mimeType);
		const filename = generateFilename(safeOriginalName, mimeType);
		const ext = path.extname(filename);
		const baseName = path.basename(filename, ext);
		const publicId = buildPublicId(folder, baseName);
		const resourceType = getResourceType(folder);

		try {
			const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

			const result = await cloudinary.uploader.upload(dataUri, {
				public_id: publicId,
				resource_type: resourceType,
				overwrite: false,
			});

			logger.info("File uploaded to Cloudinary", { filename, folder, size, mimeType });

			return {
				id: slugify(baseName),
				filename,
				originalName: safeOriginalName,
				mimeType,
				size,
				folder,
				url: result.secure_url,
				createdAt: new Date(),
			};
		} catch (error) {
			logger.error("Failed to upload to Cloudinary", error);
			throw new StorageError(STORAGE_MESSAGES.STORAGE_ERROR, "STORAGE_ERROR", 500);
		}
	}

	async delete(filename: string, folder: StorageFolder): Promise<void> {
		await this.ensureInitialized();

		const ext = path.extname(filename);
		const baseName = path.basename(filename, ext);
		const publicId = buildPublicId(folder, baseName);
		const resourceType = getResourceType(folder);

		try {
			const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

			if (result.result === "not found") {
				throw new StorageError(STORAGE_MESSAGES.FILE_NOT_FOUND, "FILE_NOT_FOUND", 404, {
					field: "filename",
					value: filename,
				});
			}

			logger.info("File deleted from Cloudinary", { filename, folder });
		} catch (error) {
			if (error instanceof StorageError) throw error;
			logger.error("Failed to delete from Cloudinary", error);
			throw new StorageError(STORAGE_MESSAGES.STORAGE_ERROR, "STORAGE_ERROR", 500);
		}
	}

	async list(
		folder: StorageFolder,
		page: number = 1,
		limit: number = 20,
		sort: "asc" | "desc" = "desc"
	): Promise<ListResult> {
		await this.ensureInitialized();

		const resourceType = getResourceType(folder);

		try {
			const result = await cloudinary.api.resources({
				type: "upload",
				prefix: `${CLOUD_FOLDER}/${folder}/`,
				resource_type: resourceType,
				max_results: 500,
			});

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			let resources: any[] = result.resources || [];

			resources.sort((a, b) => {
				const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
				return sort === "asc" ? diff : -diff;
			});

			const total = resources.length;
			const totalPages = Math.ceil(total / limit);
			const paged = resources.slice((page - 1) * limit, page * limit);

			const files: FileMetadata[] = paged.map((r) => {
				const fname = `${r.public_id.split("/").pop()}.${r.format}`;
				return {
					filename: fname,
					mimeType: formatToMime(r.format, r.resource_type),
					size: r.bytes,
					folder,
					url: r.secure_url,
					modifiedAt: new Date(r.created_at),
					createdAt: new Date(r.created_at),
				};
			});

			return { files, page, limit, total, totalPages };
		} catch (error) {
			logger.error("Failed to list Cloudinary resources", error);
			return { files: [], page, limit, total: 0, totalPages: 0 };
		}
	}

	async exists(filename: string, folder: StorageFolder): Promise<boolean> {
		await this.ensureInitialized();

		const ext = path.extname(filename);
		const baseName = path.basename(filename, ext);
		const publicId = buildPublicId(folder, baseName);
		const resourceType = getResourceType(folder);

		try {
			await cloudinary.api.resource(publicId, { resource_type: resourceType });
			return true;
		} catch {
			return false;
		}
	}

	async getMetadata(filename: string, folder: StorageFolder): Promise<FileMetadata> {
		await this.ensureInitialized();

		const ext = path.extname(filename);
		const baseName = path.basename(filename, ext);
		const publicId = buildPublicId(folder, baseName);
		const resourceType = getResourceType(folder);

		try {
			const r = await cloudinary.api.resource(publicId, { resource_type: resourceType });
			return {
				filename,
				mimeType: formatToMime(r.format, r.resource_type),
				size: r.bytes,
				folder,
				url: r.secure_url,
				modifiedAt: new Date(r.created_at),
				createdAt: new Date(r.created_at),
			};
		} catch {
			throw new StorageError(STORAGE_MESSAGES.FILE_NOT_FOUND, "FILE_NOT_FOUND", 404, {
				field: "filename",
				value: filename,
			});
		}
	}

	async getUsage(folder: StorageFolder): Promise<{ count: number; totalSize: number }> {
		const result = await this.list(folder, 1, 10000);
		const totalSize = result.files.reduce((sum, file) => sum + file.size, 0);
		return { count: result.total, totalSize };
	}

	// ─── Avatar Methods ────────────────────────────────────────────────────────

	async uploadUserAvatar(
		userId: string,
		buffer: Buffer,
		mimeType: string,
		size: number
	): Promise<{ url: string; filename: string }> {
		await this.ensureInitialized();

		if (!mimeType.startsWith("image/") || !isAllowedMimeType(mimeType)) {
			throw new StorageError("Only image files are allowed for avatars", "INVALID_MIME_TYPE", 400, {
				field: "mimeType",
				value: mimeType,
			});
		}

		if (!isValidFileSize(size, mimeType)) {
			throw new StorageError(STORAGE_MESSAGES.FILE_TOO_LARGE, "FILE_TOO_LARGE", 400, {
				field: "size",
				value: size,
			});
		}

		if (!verifyMagicBytes(buffer, mimeType)) {
			throw new StorageError(STORAGE_MESSAGES.MIME_MISMATCH, "MIME_MISMATCH", 400, {
				field: "file",
				value: mimeType,
			});
		}

		const ext = getExtensionFromMime(mimeType) || ".jpg";
		const filename = `avatar${ext}`;
		const publicId = `${CLOUD_FOLDER}/avatars/${userId}/avatar`;

		try {
			const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

			const result = await cloudinary.uploader.upload(dataUri, {
				public_id: publicId,
				resource_type: "image",
				overwrite: true,
				invalidate: true,
			});

			logger.info("User avatar uploaded to Cloudinary", { userId, size, mimeType });
			return { url: result.secure_url, filename };
		} catch (error) {
			logger.error("Failed to upload avatar to Cloudinary", error);
			throw new StorageError(STORAGE_MESSAGES.STORAGE_ERROR, "STORAGE_ERROR", 500);
		}
	}

	async deleteUserAvatar(userId: string): Promise<void> {
		await this.ensureInitialized();

		const publicId = `${CLOUD_FOLDER}/avatars/${userId}/avatar`;

		try {
			const result = await cloudinary.uploader.destroy(publicId, {
				resource_type: "image",
				invalidate: true,
			});

			if (result.result === "not found") {
				throw new StorageError("No avatar found for this user", "FILE_NOT_FOUND", 404, {
					field: "userId",
					value: userId,
				});
			}

			logger.info("User avatar deleted from Cloudinary", { userId });
		} catch (error) {
			if (error instanceof StorageError) throw error;
			logger.error("Failed to delete avatar from Cloudinary", error);
			throw new StorageError(STORAGE_MESSAGES.STORAGE_ERROR, "STORAGE_ERROR", 500);
		}
	}

	async getUserAvatarUrl(userId: string): Promise<string | null> {
		await this.ensureInitialized();

		const publicId = `${CLOUD_FOLDER}/avatars/${userId}/avatar`;

		try {
			const result = await cloudinary.api.resource(publicId, { resource_type: "image" });
			return result.secure_url || null;
		} catch {
			return null;
		}
	}
}

// Export singleton instance
export const storageService = new StorageService();

// Export class for testing
export { StorageService };
