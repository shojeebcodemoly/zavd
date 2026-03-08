import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import {
	storageService,
	StorageError,
	deleteRequestSchema,
	STORAGE_MESSAGES,
} from "@/lib/storage";

/**
 * DELETE /api/storage/delete
 * Delete a file from storage
 * Requires authentication via Better Auth session
 */
export async function DELETE(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized delete attempt");
			return unauthorizedResponse(STORAGE_MESSAGES.UNAUTHORIZED);
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = deleteRequestSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse(
				"Invalid request",
				validationResult.error.issues
			);
		}

		const { filename, folder } = validationResult.data;

		// Delete the file
		await storageService.delete(filename, folder);

		logger.info("File deleted", {
			filename,
			folder,
			userId: session.user.id,
		});

		return successResponse(undefined, STORAGE_MESSAGES.DELETE_SUCCESS);
	} catch (error) {
		if (error instanceof StorageError) {
			logger.warn("Storage delete error", {
				code: error.code,
				message: error.message,
			});

			if (error.code === "FILE_NOT_FOUND") {
				return notFoundResponse(error.message);
			}

			return badRequestResponse(error.message, error.details);
		}

		logger.error("Unexpected delete error", error);
		return internalServerErrorResponse(
			error instanceof Error ? error.message : "Delete failed"
		);
	}
}
