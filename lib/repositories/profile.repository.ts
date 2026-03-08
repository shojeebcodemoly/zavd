import { BaseRepository } from "./base.repository";
import { IProfile, getProfileModelSync } from "@/models/profile.model";
import { logger } from "@/lib/utils/logger";
import mongoose from "mongoose";

/**
 * Profile Repository
 * Handles profile-specific data access operations
 */
export class ProfileRepository extends BaseRepository<IProfile> {
	constructor() {
		super(getProfileModelSync());
	}

	/**
	 * Find profile by user ID
	 */
	async findByUserId(
		userId: string | mongoose.Types.ObjectId
	): Promise<IProfile | null> {
		try {
			const objectId =
				typeof userId === "string"
					? new mongoose.Types.ObjectId(userId)
					: userId;
			return await this.findOne({ userId: objectId });
		} catch (error) {
			logger.error("Error finding profile by user ID", error);
			throw error;
		}
	}

	/**
	 * Create profile for user
	 */
	async createForUser(
		userId: string | mongoose.Types.ObjectId,
		data?: Partial<IProfile>
	): Promise<IProfile> {
		try {
			const objectId =
				typeof userId === "string"
					? new mongoose.Types.ObjectId(userId)
					: userId;

			const profileData: Partial<IProfile> = {
				userId: objectId,
				...data,
			};

			return await this.create(profileData);
		} catch (error) {
			logger.error("Error creating profile for user", error);
			throw error;
		}
	}

	/**
	 * Update profile by user ID
	 */
	async updateByUserId(
		userId: string | mongoose.Types.ObjectId,
		update: Partial<IProfile>
	): Promise<IProfile | null> {
		try {
			const objectId =
				typeof userId === "string"
					? new mongoose.Types.ObjectId(userId)
					: userId;

			return await this.updateOne({ userId: objectId }, { $set: update });
		} catch (error) {
			logger.error("Error updating profile by user ID", error);
			throw error;
		}
	}

	/**
	 * Update avatar URL
	 */
	async updateAvatar(
		userId: string | mongoose.Types.ObjectId,
		avatarUrl: string
	): Promise<IProfile | null> {
		try {
			return await this.updateByUserId(userId, { avatarUrl });
		} catch (error) {
			logger.error("Error updating avatar", error);
			throw error;
		}
	}

	/**
	 * Update address
	 */
	async updateAddress(
		userId: string | mongoose.Types.ObjectId,
		address: IProfile["address"]
	): Promise<IProfile | null> {
		try {
			return await this.updateByUserId(userId, { address });
		} catch (error) {
			logger.error("Error updating address", error);
			throw error;
		}
	}

	/**
	 * Delete profile by user ID
	 */
	async deleteByUserId(
		userId: string | mongoose.Types.ObjectId
	): Promise<IProfile | null> {
		try {
			const objectId =
				typeof userId === "string"
					? new mongoose.Types.ObjectId(userId)
					: userId;
			return await this.deleteOne({ userId: objectId });
		} catch (error) {
			logger.error("Error deleting profile by user ID", error);
			throw error;
		}
	}

	/**
	 * Check if profile exists for user
	 */
	async existsForUser(
		userId: string | mongoose.Types.ObjectId
	): Promise<boolean> {
		try {
			const objectId =
				typeof userId === "string"
					? new mongoose.Types.ObjectId(userId)
					: userId;
			return await this.exists({ userId: objectId });
		} catch (error) {
			logger.error("Error checking profile existence", error);
			throw error;
		}
	}

	/**
	 * Find or create profile for user
	 */
	async findOrCreateForUser(
		userId: string | mongoose.Types.ObjectId,
		defaultData?: Partial<IProfile>
	): Promise<IProfile> {
		try {
			// // console.log("👤 [ProfileRepository] findOrCreateForUser called");
			// // console.log("👤 [ProfileRepository] userId:", userId);
			// // console.log("👤 [ProfileRepository] userId type:", typeof userId);

			// Try to find existing profile
			// // console.log("👤 [ProfileRepository] Searching for existing profile...");
			let profile = await this.findByUserId(userId);

			// // console.log("👤 [ProfileRepository] Search result:", {
			// 	found: !!profile,
			// 	profileId: profile?._id?.toString()
			// });

			// Create if doesn't exist
			if (!profile) {
				// // console.log(
				// 	"👤 [ProfileRepository] Profile not found, creating new one..."
				// );
				profile = await this.createForUser(userId, defaultData);
				// // console.log("👤 [ProfileRepository] Profile created:", {
				// 	profileId: profile._id.toString(),
				// 	userId: profile.userId.toString(),
				// });
				logger.info("Created new profile for user", { userId });
			} else {
				// console.log("👤 [ProfileRepository] Profile already exists");
			}

			return profile;
		} catch (error) {
			// // console.log(
			// 	"❌ [ProfileRepository] Error in findOrCreateForUser:",
			// 	error
			// );
			logger.error("Error in findOrCreateForUser", error);
			throw error;
		}
	}
}

// Export singleton instance
export const profileRepository = new ProfileRepository();
