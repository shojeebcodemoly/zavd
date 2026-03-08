import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { authService } from "@/lib/services/auth.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

/**
 * POST /api/auth/sync-user
 * Create profile for Better Auth user
 * Called after registration to create user profile
 */
export async function POST(request: NextRequest) {
	try {
		// Get session to verify authentication
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session || !session.user) {
			logger.warn("Sync user called without valid session");
			return internalServerErrorResponse("No active session");
		}

		const user = session.user;

		logger.info("Creating profile for user", {
			userId: user.id,
			email: user.email,
		});

		// Create profile for the user
		await authService.syncUserFromBetterAuth(user.id, user.email, user.name);

		return successResponse(
			{ success: true },
			"User profile created successfully"
		);
	} catch (error) {
		logger.error("Error in POST /api/auth/sync-user", error);
		return internalServerErrorResponse("Failed to create profile");
	}
}
