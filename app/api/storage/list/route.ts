import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { logger } from "@/lib/utils/logger";
import {
	paginatedResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import {
	storageService,
	StorageError,
	listRequestSchema,
	STORAGE_MESSAGES,
	STORAGE_CONFIG,
} from "@/lib/storage";

/**
 * GET /api/storage/list
 * List files in a storage folder
 * Requires authentication via Better Auth session
 *
 * Query params:
 * - folder: "images" | "documents" (required)
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - sort: "asc" | "desc" (default: "desc")
 */
export async function GET(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized list attempt");
			return unauthorizedResponse(STORAGE_MESSAGES.UNAUTHORIZED);
		}

		// Parse query parameters
		const { searchParams } = new URL(request.url);

		const queryResult = listRequestSchema.safeParse({
			folder: searchParams.get("folder"),
			page:
				searchParams.get("page") || STORAGE_CONFIG.DEFAULT_PAGE.toString(),
			limit:
				searchParams.get("limit") ||
				STORAGE_CONFIG.DEFAULT_LIMIT.toString(),
			sort: searchParams.get("sort") || "desc",
		});

		if (!queryResult.success) {
			return badRequestResponse(
				"Invalid query parameters",
				queryResult.error.issues
			);
		}

		const { folder, page, limit, sort } = queryResult.data;

		// List files
		const result = await storageService.list(
			folder,
			page || STORAGE_CONFIG.DEFAULT_PAGE,
			limit || STORAGE_CONFIG.DEFAULT_LIMIT,
			sort || "desc"
		);

		return paginatedResponse(
			result.files,
			result.page,
			result.limit,
			result.total,
			STORAGE_MESSAGES.LIST_SUCCESS
		);
	} catch (error) {
		if (error instanceof StorageError) {
			logger.warn("Storage list error", {
				code: error.code,
				message: error.message,
			});
			return badRequestResponse(error.message, error.details);
		}

		logger.error("Unexpected list error", error);
		return internalServerErrorResponse(
			error instanceof Error ? error.message : "List failed"
		);
	}
}
