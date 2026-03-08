import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { userService } from "@/lib/services/user.service";
import { authService } from "@/lib/services/auth.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { API_MESSAGES } from "@/lib/utils/constants";
import { NotFoundError } from "@/lib/utils/api-error";

/**
 * GET /api/user/me
 * Get current authenticated user with profile
 */
export async function GET(request: NextRequest) {
	try {
		// Get session from Better Auth
		const auth = await getAuth();

		const session = await auth.api.getSession({ headers: request.headers });
		// // console.log("Session:", {
		// 	exists: !!session,
		// 	hasUser: !!session?.user,
		// 	userId: session?.user?.id,
		// 	userEmail: session?.user?.email,
		// 	userName: session?.user?.name
		// });

		// Check if user is authenticated
		if (!session || !session.user) {
			// // console.log("❌ No session or user found");
			// logger.warn("Unauthenticated access attempt to /api/user/me");
			return unauthorizedResponse(API_MESSAGES.UNAUTHORIZED);
		}

		// // console.log("✅ Session valid, userId:", session.user.id);
		logger.info("Fetching user data", { userId: session.user.id });

		try {
			// // console.log("🔍 Calling userService.getUserWithProfile with userId:", session.user.id);

			// Get user with profile from our database using Better Auth user._id
			const { user, profile } = await userService.getUserWithProfile({
				userId: session.user.id,
			});

			// // console.log("[API /user/me] User data retrieved:", {
			// 	userId: user._id,
			// 	userEmail: user.email,
			// 	userImage: user.image,
			// 	profileAvatarUrl: profile.avatarUrl,
			// });

			logger.info("User profile retrieved", { userId: user._id });

			// Return user data with profile
			return successResponse(
				{
					user: {
						_id: user._id,
						email: user.email,
						name: user.name,
						emailVerified: user.emailVerified,
						image: user.image,
						lastLoginAt: user.lastLoginAt,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
					},
					profile: {
						_id: profile._id,
						userId: profile.userId,
						bio: profile.bio,
						avatarUrl: profile.avatarUrl,
						phoneNumber: profile.phoneNumber,
						address: profile.address,
						createdAt: profile.createdAt,
						updatedAt: profile.updatedAt,
					},
				},
				"User data retrieved successfully"
			);
		} catch (error) {
			// // console.log("❌ Error fetching user:", error);

			// If user not found, create profile (user should exist in Better Auth's collection)
			if (error instanceof NotFoundError) {
				// // console.log("⚠️  User not found, attempting to create profile");

				logger.warn(
					"User or profile not found, attempting to create profile",
					{
						userId: session.user.id,
					}
				);

				try {
					// Create profile for the user
					await authService.syncUserFromBetterAuth(
						session.user.id,
						session.user.email,
						session.user.name
					);

					// Retry fetching user
					const { user, profile } = await userService.getUserWithProfile({
						userId: session.user.id,
					});

					logger.info("Profile created and user retrieved", {
						userId: user._id,
					});

					return successResponse(
						{
							user: {
								_id: user._id,
								email: user.email,
								name: user.name,
								emailVerified: user.emailVerified,
								image: user.image,
								lastLoginAt: user.lastLoginAt,
								createdAt: user.createdAt,
								updatedAt: user.updatedAt,
							},
							profile: {
								_id: profile._id,
								userId: profile.userId,
								bio: profile.bio,
								avatarUrl: profile.avatarUrl,
								phoneNumber: profile.phoneNumber,
								address: profile.address,
								createdAt: profile.createdAt,
								updatedAt: profile.updatedAt,
							},
						},
						"User data retrieved successfully"
					);
				} catch (syncError) {
					logger.error("Failed to create profile", syncError);
					throw error; // Throw original error
				}
			}

			throw error;
		}
	} catch (error) {
		logger.error("Error in GET /api/user/me", error);
		return internalServerErrorResponse(API_MESSAGES.INTERNAL_ERROR);
	}
}
