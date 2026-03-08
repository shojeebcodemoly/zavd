import { BaseRepository } from "./base.repository";
import { IUser, getUserModelSync } from "@/models/user.model";
// Import Profile model to ensure it's registered before populate operations
import { getProfileModelSync } from "@/models/profile.model";
import { logger } from "@/lib/utils/logger";

// Register Profile model for population - required for serverless cold starts
getProfileModelSync();

/**
 * User Repository
 * Handles user-specific data access operations
 */
export class UserRepository extends BaseRepository<IUser> {
	constructor() {
		super(getUserModelSync());
	}

	/**
	 * Find user by email
	 */
	async findByEmail(email: string): Promise<IUser | null> {
		try {
			return await this.findOne({ email: email.toLowerCase() });
		} catch (error) {
			logger.error("Error finding user by email", error);
			throw error;
		}
	}

	/**
	 * Find user with their profile by _id
	 */
	async findByIdWithProfile(userId: string): Promise<IUser | null> {
		try {
			// // console.log("🗄️  [UserRepository] findByIdWithProfile called");
			// // console.log("🗄️  [UserRepository] userId:", userId);
			// // console.log("🗄️  [UserRepository] Model name:", this.model.modelName);
			// // console.log("🗄️  [UserRepository] Collection name:", this.model.collection.name);

			await this.ensureConnection();
			// // console.log("🗄️  [UserRepository] DB connection ensured");

			logger.info("Finding user by ID with profile", { userId });

			// // console.log("🗄️  [UserRepository] Executing query: findById with populate...");
			const user = await this.model
				.findById(userId)
				.populate("profile")
				.exec();

			// // console.log("🗄️  [UserRepository] Query executed. Result:", {
			// 	found: !!user,
			// 	userId: user?._id?.toString(),
			// 	email: user?.email,
			// 	name: user?.name,
			// 	hasProfile: user ? !!user.profile : false,
			// 	profileValue: user?.profile
			// });

			logger.info("User query result", {
				found: !!user,
				userId,
				hasProfile: user ? !!user.profile : false,
			});

			return user;
		} catch (error) {
			// // console.log(
			// 	"❌ [UserRepository] Error in findByIdWithProfile:",
			// 	error
			// );
			logger.error("Error finding user with profile", { error, userId });
			throw error;
		}
	}

	/**
	 * Find user by email with profile
	 */
	async findByEmailWithProfile(email: string): Promise<IUser | null> {
		try {
			await this.ensureConnection();

			const user = await this.model
				.findOne({ email: email.toLowerCase() })
				.populate("profile")
				.exec();

			return user;
		} catch (error) {
			logger.error("Error finding user by email with profile", error);
			throw error;
		}
	}

	/**
	 * Check if email exists
	 */
	async emailExists(email: string): Promise<boolean> {
		try {
			return await this.exists({ email: email.toLowerCase() });
		} catch (error) {
			logger.error("Error checking email existence", error);
			throw error;
		}
	}

	/**
	 * Update user's last login timestamp
	 */
	async updateLastLogin(userId: string): Promise<IUser | null> {
		try {
			return await this.updateById(userId, {
				$set: { lastLoginAt: new Date() },
			});
		} catch (error) {
			logger.error("Error updating last login", error);
			throw error;
		}
	}

	/**
	 * Search users by name or email
	 * When searchTerm is empty, returns all users
	 */
	async searchUsers(searchTerm: string, page?: number, limit?: number) {
		try {
			// Only apply filter if search term is provided
			const filter = searchTerm.trim()
				? {
						$or: [
							{ name: { $regex: searchTerm, $options: "i" } },
							{ email: { $regex: searchTerm, $options: "i" } },
						],
				  }
				: {};

			if (page && limit) {
				return await this.findPaginated(filter, page, limit);
			}

			return await this.findAll(filter);
		} catch (error) {
			logger.error("Error searching users", error);
			throw error;
		}
	}

	/**
	 * Get user statistics
	 */
	async getUserStats(): Promise<{
		total: number;
		verifiedEmails: number;
		recentLogins: number;
	}> {
		try {
			await this.ensureConnection();

			const sevenDaysAgo = new Date();
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

			const [total, verifiedEmails, recentLogins] = await Promise.all([
				this.count(),
				this.count({ emailVerified: true }),
				this.count({ lastLoginAt: { $gte: sevenDaysAgo } }),
			]);

			return {
				total,
				verifiedEmails,
				recentLogins,
			};
		} catch (error) {
			logger.error("Error getting user statistics", error);
			throw error;
		}
	}
}

// Export singleton instance
export const userRepository = new UserRepository();
