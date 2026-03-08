import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { userService } from "@/lib/services/user.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	unauthorizedResponse,
	badRequestResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { API_MESSAGES } from "@/lib/utils/constants";
import { updateProfileSchema } from "@/lib/validations/user.validation";

/**
 * PUT /api/user/profile
 * Update user profile
 */
export async function PUT(request: NextRequest) {
	try {
		// Get session from Better Auth
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		// Check if user is authenticated
		if (!session || !session.user) {
			logger.warn("Unauthenticated access attempt to /api/user/profile");
			return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
		}

		// Parse request body
		const body = await request.json();
		// // console.log("📦 Request body:", body);

		// Validate input
		const validation = updateProfileSchema.safeParse(body);
		if (!validation.success) {
			// // console.log("❌ Validation failed:", validation.error);
			return badRequestResponse("Validation failed", validation.error);
		}

		// // console.log("✅ Validation passed");

		// Update profile
		const updatedProfile = await userService.updateUserProfile(
			session.user.id,
			validation.data
		);

		// // console.log("✅ Profile updated:", updatedProfile._id);

		logger.info("Profile updated successfully", {
			userId: session.user.id,
			profileId: updatedProfile._id,
		});

		return successResponse(
			{
				profile: {
					_id: updatedProfile._id,
					userId: updatedProfile._id,
					bio: updatedProfile.bio,
					avatarUrl: updatedProfile.avatarUrl,
					phoneNumber: updatedProfile.phoneNumber,
					address: updatedProfile.address,
					createdAt: updatedProfile.createdAt,
					updatedAt: updatedProfile.updatedAt,
				},
			},
			"Profile updated successfully"
		);
	} catch (error) {
		// // console.log("❌ Error updating profile:", error);
		logger.error("Error in PUT /api/user/profile", error);
		return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
	}
}
