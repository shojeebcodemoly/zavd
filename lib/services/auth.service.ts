import { userRepository } from "@/lib/repositories/user.repository";
import { profileRepository } from "@/lib/repositories/profile.repository";
import { logger } from "@/lib/utils/logger";
import {
	ConflictError,
	UnauthorizedError,
	DatabaseError,
} from "@/lib/utils/api-error";
import { API_MESSAGES } from "@/lib/utils/constants";
import type { RegisterInput } from "@/lib/validations/auth.validation";
import { getAuth } from "@/lib/db/auth";
import type { IUser } from "@/models/user.model";
import crypto from "crypto";
import { getMongoClient } from "../db/mongo";
import { ObjectId } from "mongodb";

/**
 * Authentication Service
 * Handles business logic for authentication operations
 */
class AuthService {
	/**
	 * Handle post-registration operations
	 * Better Auth already created the user, we just need to create the profile
	 */
	async handlePostRegistration(
		userId: string,
		email: string,
		name: string
	): Promise<{ userId: string; profileId: string }> {
		try {
			logger.info("Creating profile for newly registered user", {
				userId,
				email,
			});

			// Create default profile for the user
			const profile = await profileRepository.createForUser(userId, {
				bio: "",
				avatarUrl: undefined,
				phoneNumber: undefined,
				address: {},
			});

			logger.info("Profile created for user", {
				userId,
				profileId: profile._id,
			});

			return {
				userId: userId,
				profileId: profile._id.toString(),
			};
		} catch (error) {
			logger.error("Error in handlePostRegistration", error);

			// Re-throw known errors
			if (error instanceof ConflictError) {
				throw error;
			}

			throw new DatabaseError("Failed to complete registration");
		}
	}

	/**
	 * Handle post-login operations
	 * Update last login timestamp
	 */
	async handlePostLogin(email: string): Promise<void> {
		try {
			// Find user by email
			const user = await userRepository.findByEmail(email);

			if (!user) {
				logger.warn("Login attempted for non-existent user", { email });
				throw new UnauthorizedError(API_MESSAGES.INVALID_CREDENTIALS);
			}

			// Update last login timestamp
			await userRepository.updateLastLogin(user._id.toString());

			logger.auth("User logged in", user._id.toString(), { email });
		} catch (error) {
			logger.error("Error in handlePostLogin", error);

			// Re-throw known errors
			if (error instanceof UnauthorizedError) {
				throw error;
			}

			// Don't throw database errors on login - just log them
			// The user is already authenticated by Better Auth
			logger.error("Failed to update last login timestamp", error);
		}
	}

	/**
	 * Handle post-logout operations
	 * Clean up any session-related data if needed
	 */
	async handlePostLogout(userId: string): Promise<void> {
		try {
			logger.auth("User logged out", userId);

			// Add any cleanup logic here if needed
			// For now, Better Auth handles session destruction
		} catch (error) {
			logger.error("Error in handlePostLogout", error);
			// Don't throw - logout should succeed even if cleanup fails
		}
	}

	/**
	 * Validate user exists and return user data
	 * Used for session validation
	 */
	async validateUser(email: string): Promise<{
		userId: string;
		email: string;
		name: string;
		emailVerified: boolean;
	} | null> {
		try {
			const user = await userRepository.findByEmail(email);

			if (!user) {
				return null;
			}

			return {
				userId: user._id.toString(),
				email: user.email,
				name: user.name,
				emailVerified: user.emailVerified,
			};
		} catch (error) {
			logger.error("Error validating user", error);
			return null;
		}
	}

	/**
	 * Check if email is already registered
	 */
	async emailExists(email: string): Promise<boolean> {
		try {
			return await userRepository.emailExists(email.toLowerCase());
		} catch (error) {
			logger.error("Error checking email existence", error);
			return false;
		}
	}

	/**
	 * Create profile for Better Auth user
	 * Called after registration or when profile is missing
	 */
	async syncUserFromBetterAuth(
		userId: string,
		email: string,
		name: string
	): Promise<void> {
		try {
			logger.info("Syncing user profile", { userId, email });

			// Check if profile exists, create if it doesn't
			const profileExists = await profileRepository.existsForUser(userId);
			if (!profileExists) {
				await profileRepository.createForUser(userId);
				logger.info("Created profile during sync", { userId });
			} else {
				logger.info("Profile already exists", { userId });
			}
		} catch (error) {
			logger.error("Error syncing user from Better Auth", error);
			throw new DatabaseError("Failed to sync user data");
		}
	}

	/**
	 * Create new user by admin/authenticated user
	 * Only logged-in users can create new users
	 *
	 * IMPORTANT: We hash the password manually and create both user and account records
	 * to avoid Better Auth's signUpEmail which would create a session for the new user
	 * and log out the admin who is creating them.
	 *
	 * The records must match Better Auth's MongoDB adapter format:
	 * - User: uses _id as ObjectId (adapter maps to/from 'id' field)
	 * - Account: userId is ObjectId referencing user._id
	 */
	async createUserByAdmin(data: {
		name: string;
		email: string;
		password: string;
		createdBy: string;
	}): Promise<IUser> {
		try {
			const mongoClient = await getMongoClient();
			const db = mongoClient.db(process.env.MONGODB_DB || "synos-db");

			// Generate ObjectId for the user (Better Auth's MongoDB adapter uses ObjectId for _id)
			const userObjectId = new ObjectId();
			const accountObjectId = new ObjectId();

			// Hash the password using scrypt (EXACTLY as Better Auth does)
			const salt = crypto.randomBytes(16).toString("hex");
			const normalizedPassword = data.password.normalize("NFKC");

			const hashedPassword = await new Promise<string>((resolve, reject) => {
				crypto.scrypt(
					normalizedPassword,
					salt,
					64,
					{
						N: 16384,
						r: 16,
						p: 1,
						maxmem: 128 * 16384 * 16 * 2,
					},
					(err: Error | null, derivedKey: Buffer) => {
						if (err) reject(err);
						resolve(`${salt}:${derivedKey.toString("hex")}`);
					}
				);
			});

			// Create user document
			const userDoc = {
				_id: userObjectId,
				email: data.email.toLowerCase(),
				name: data.name,
				emailVerified: false,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const userCollection = db.collection("user");
			await userCollection.insertOne(userDoc);

			// Create account document
			const accountDoc = {
				_id: accountObjectId,
				userId: userObjectId,
				accountId: userObjectId,
				providerId: "credential",
				password: hashedPassword,
				accessToken: null,
				refreshToken: null,
				accessTokenExpiresAt: null,
				refreshTokenExpiresAt: null,
				scope: null,
				idToken: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const accountCollection = db.collection("account");
			await accountCollection.insertOne(accountDoc);

			// Fetch the created user using our repository
			const newUser = await userRepository.findByEmail(
				data.email.toLowerCase()
			);
			if (!newUser) {
				throw new DatabaseError("User created but could not be retrieved");
			}

			// Create profile for the new user
			await this.handlePostRegistration(
				newUser._id.toString(),
				data.email,
				data.name
			);

			logger.info("User created by admin", {
				userId: newUser._id.toString(),
				email: data.email,
			});

			return newUser;
		} catch (error) {
			logger.error("Error creating user by admin", error);

			if (error instanceof DatabaseError) {
				throw error;
			}

			throw new DatabaseError("Failed to create user");
		}
	}
}

// Export singleton instance
export const authService = new AuthService();
