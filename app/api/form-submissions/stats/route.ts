import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/db/auth";
import { formSubmissionService } from "@/lib/services/form-submission.service";
import {
	successResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";

/**
 * GET /api/form-submissions/stats
 * Protected endpoint - Get submission statistics (logged in users only)
 */
export async function GET(_request: NextRequest) {
	try {
		// Check authentication
		const auth = await getAuth();
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return unauthorizedResponse("Authentication required");
		}

		const stats = await formSubmissionService.getStats();

		return successResponse(stats, "Statistics retrieved successfully");
	} catch (error) {
		logger.error("Error getting form submission stats", error);
		return internalServerErrorResponse("Failed to get statistics");
	}
}
