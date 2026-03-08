import { userRepository } from "@/lib/repositories/user.repository";
import { profileRepository } from "@/lib/repositories/profile.repository";
import { logger } from "@/lib/utils/logger";
import {
	NotFoundError,
	DatabaseError,
	BadRequestError,
} from "@/lib/utils/api-error";
import { API_MESSAGES } from "@/lib/utils/constants";
import type { IUser } from "@/models/user.model";
import type { IProfile, IAddress } from "@/models/profile.model";
import type { UpdateProfileInput } from "@/lib/validations/user.validation";

/**
 * User Service
 * Handles business logic for user and profile operations
 */
class UserService {
	/**
	 * Get user by _id with their profile
	 * This is the primary method called from API routes after session validation
	 *
	 * @param userId - The user._id from Better Auth session (session.user.id)
	 */
	async getUserWithProfile({ userId }: { userId: string }): Promise<{
		user: IUser;
		profile: IProfile;
	}> {
		try {
			// console.log("📦 [UserService] getUserWithProfile called");
			// console.log("📦 [UserService] userId:", userId);
			// console.log("📦 [UserService] userId type:", typeof userId);

			logger.info("getUserWithProfile called with userId:", userId);

			// Get user with populated profile using _id
			// console.log("📦 [UserService] Calling userRepository.findByIdWithProfile...");
			const user = await userRepository.findByIdWithProfile(userId);

			// console.log("📦 [UserService] Repository result:", {
			// 	found: !!user,
			// 	userId: user?._id?.toString(),
			// 	email: user?.email
			// });

			logger.info(
				"User from getUserWithProfile:",
				user ? "Found" : "Not found"
			);

			if (!user) {
				// console.log("❌ [UserService] User not found, throwing NotFoundError");
				throw new NotFoundError(API_MESSAGES.USER_NOT_FOUND);
			}

			// Get or create profile (in case population failed or profile doesn't exist)
			// console.log("📦 [UserService] Getting/creating profile for user:", user._id.toString());
			const profile = await profileRepository.findOrCreateForUser(user._id);
			// console.log("📦 [UserService] Profile result:", {
			// 	found: !!profile,
			// 	profileId: profile?._id?.toString()
			// });

			return {
				user,
				profile,
			};
		} catch (error) {
			logger.error("Error getting user with profile", error);

			if (error instanceof NotFoundError) {
				throw error;
			}

			throw new DatabaseError("Failed to get user profile");
		}
	}

	/**
	 * Get user by email
	 */
	async getUserByEmail(email: string): Promise<IUser | null> {
		try {
			return await userRepository.findByEmail(email);
		} catch (error) {
			logger.error("Error getting user by email", error);
			throw new DatabaseError("Failed to get user");
		}
	}

	/**
	 * Get user profile only
	 */
	async getUserProfile(userId: string): Promise<IProfile> {
		try {
			// Get or create profile
			const profile = await profileRepository.findOrCreateForUser(userId);

			return profile;
		} catch (error) {
			logger.error("Error getting user profile", error);
			throw new DatabaseError(API_MESSAGES.PROFILE_NOT_FOUND);
		}
	}

	/**
	 * Update user profile
	 */
	async updateUserProfile(
		userId: string,
		data: UpdateProfileInput
	): Promise<IProfile> {
		try {
			// Ensure profile exists
			const profileExists = await profileRepository.existsForUser(userId);

			if (!profileExists) {
				// Create profile if it doesn't exist
				await profileRepository.createForUser(userId);
				logger.info("Created profile during update", { userId });
			}

			// Update profile
			const updatedProfile = await profileRepository.updateByUserId(
				userId,
				data
			);

			if (!updatedProfile) {
				throw new DatabaseError("Failed to update profile");
			}

			logger.info("Profile updated", {
				userId,
				profileId: updatedProfile._id,
			});

			return updatedProfile;
		} catch (error) {
			logger.error("Error updating user profile", error);

			if (error instanceof DatabaseError) {
				throw error;
			}

			throw new DatabaseError(API_MESSAGES.PROFILE_NOT_FOUND);
		}
	}

	/**
	 * Update user avatar
	 */
	async updateUserAvatar(
		userId: string,
		avatarUrl: string
	): Promise<IProfile> {
		try {
			// Validate URL format
			if (!avatarUrl || avatarUrl.trim() === "") {
				throw new BadRequestError("Avatar URL is required");
			}

			// Update avatar
			const updatedProfile = await profileRepository.updateAvatar(
				userId,
				avatarUrl
			);

			if (!updatedProfile) {
				throw new DatabaseError("Failed to update avatar");
			}

			logger.info("Avatar updated", { userId, avatarUrl });

			return updatedProfile;
		} catch (error) {
			logger.error("Error updating avatar", error);

			if (
				error instanceof BadRequestError ||
				error instanceof DatabaseError
			) {
				throw error;
			}

			throw new DatabaseError("Failed to update avatar");
		}
	}

	/**
	 * Update user address
	 */
	async updateUserAddress(
		userId: string,
		address: IAddress
	): Promise<IProfile> {
		try {
			const updatedProfile = await profileRepository.updateAddress(
				userId,
				address
			);

			if (!updatedProfile) {
				throw new DatabaseError("Failed to update address");
			}

			logger.info("Address updated", { userId });

			return updatedProfile;
		} catch (error) {
			logger.error("Error updating address", error);
			throw new DatabaseError("Failed to update address");
		}
	}

	/**
	 * Update user basic info (name, email)
	 */
	async updateUserInfo(
		userId: string,
		data: { name?: string; email?: string }
	): Promise<IUser> {
		try {
			// Check if email is being changed and if it already exists
			if (data.email) {
				const existingUser = await userRepository.findByEmail(data.email);
				if (existingUser && existingUser._id.toString() !== userId) {
					throw new BadRequestError(API_MESSAGES.EMAIL_ALREADY_EXISTS);
				}
			}

			// Update user
			const updatedUser = await userRepository.updateById(userId, {
				$set: data,
			});

			if (!updatedUser) {
				throw new NotFoundError(API_MESSAGES.USER_NOT_FOUND);
			}

			logger.info("User info updated", { userId });

			return updatedUser;
		} catch (error) {
			logger.error("Error updating user info", error);

			if (
				error instanceof BadRequestError ||
				error instanceof NotFoundError
			) {
				throw error;
			}

			throw new DatabaseError("Failed to update user info");
		}
	}

	/**
	 * Update user profile image
	 * Supports both URL and base64-encoded images
	 */
	async updateUserImage(userId: string, image: string | null): Promise<IUser> {
		console.log("[User Service] updateUserImage called:", {
			userId,
			image,
			imageLength: image?.length,
		});

		try {
			// Update user image
			console.log("[User Service] Calling userRepository.updateById...");
			const updatedUser = await userRepository.updateById(userId, {
				$set: { image },
			});

			console.log("[User Service] updateById result:", {
				success: !!updatedUser,
				userId: updatedUser?._id,
				newImage: updatedUser?.image,
			});

			if (!updatedUser) {
				console.log("[User Service] User not found after update");
				throw new NotFoundError(API_MESSAGES.USER_NOT_FOUND);
			}

			logger.info("User image updated", {
				userId,
				newImageUrl: image,
				isBase64: image ? image.startsWith("data:image") : false,
				removed: image === null,
			});

			return updatedUser;
		} catch (error) {
			console.error("[User Service] Error updating user image:", error);
			logger.error("Error updating user image", error);

			if (error instanceof NotFoundError) {
				throw error;
			}

			throw new DatabaseError("Failed to update user image");
		}
	}

	/**
	 * Search users
	 */
	async searchUsers(searchTerm: string, page?: number, limit?: number) {
		try {
			return await userRepository.searchUsers(searchTerm, page, limit);
		} catch (error) {
			logger.error("Error searching users", error);
			throw new DatabaseError("Failed to search users");
		}
	}

	/**
	 * Get user statistics
	 */
	async getUserStats() {
		try {
			return await userRepository.getUserStats();
		} catch (error) {
			logger.error("Error getting user statistics", error);
			throw new DatabaseError("Failed to get user statistics");
		}
	}

	/**
	 * Delete user and their profile
	 * Used for account deletion
	 */
	async deleteUser(userId: string): Promise<void> {
		try {
			// Delete profile first
			await profileRepository.deleteByUserId(userId);
			logger.info("Profile deleted", { userId });

			// Delete user
			const deletedUser = await userRepository.deleteById(userId);

			if (!deletedUser) {
				throw new NotFoundError(API_MESSAGES.USER_NOT_FOUND);
			}

			logger.info("User deleted", { userId });
		} catch (error) {
			logger.error("Error deleting user", error);

			if (error instanceof NotFoundError) {
				throw error;
			}

			throw new DatabaseError("Failed to delete user");
		}
	}
}

// Export singleton instance
export const userService = new UserService();
