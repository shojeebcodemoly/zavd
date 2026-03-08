import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { logger } from "@/lib/utils/logger";
import {
	createdResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import {
	storageService,
	StorageError,
	storageFolderSchema,
	STORAGE_MESSAGES,
	inferFolderFromMime,
} from "@/lib/storage";
import type { StorageFolder, UploadRequest } from "@/lib/storage";

/**
 * POST /api/storage/upload
 * Upload a file to storage
 * Requires authentication via Better Auth session
 */
export async function POST(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized upload attempt");
			return unauthorizedResponse(STORAGE_MESSAGES.UNAUTHORIZED);
		}

		// Parse multipart form data
		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const folderParam = formData.get("folder") as string | null;

		// Validate file presence
		if (!file || !(file instanceof File)) {
			return badRequestResponse(STORAGE_MESSAGES.FILE_REQUIRED);
		}

		// Validate folder parameter if provided
		let folder: StorageFolder | undefined;
		if (folderParam) {
			const folderResult = storageFolderSchema.safeParse(folderParam);
			if (!folderResult.success) {
				return badRequestResponse(
					STORAGE_MESSAGES.INVALID_FOLDER,
					folderResult.error.issues
				);
			}
			folder = folderResult.data;
		}

		// Get file buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Prepare upload request
		const uploadRequest: UploadRequest = {
			buffer,
			originalName: file.name,
			mimeType: file.type,
			size: file.size,
			folder: folder || inferFolderFromMime(file.type),
		};

		// Upload file
		const result = await storageService.upload(uploadRequest);

		logger.info("File uploaded", {
			filename: result.filename,
			userId: session.user.id,
			folder: result.folder,
		});

		return createdResponse(result, STORAGE_MESSAGES.UPLOAD_SUCCESS);
	} catch (error) {
		if (error instanceof StorageError) {
			logger.warn("Storage upload error", {
				code: error.code,
				message: error.message,
			});
			return badRequestResponse(error.message, error.details);
		}

		logger.error("Unexpected upload error", error);
		return internalServerErrorResponse(
			error instanceof Error ? error.message : "Upload failed"
		);
	}
}
