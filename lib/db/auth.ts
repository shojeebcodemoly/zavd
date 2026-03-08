import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getMongoClient } from "./mongo";

let authInstance: ReturnType<typeof betterAuth> | null = null;
let initPromise: Promise<ReturnType<typeof betterAuth>> | null = null;

/**
 * Initialize Better Auth instance with MongoDB adapter
 * Uses singleton pattern with lazy initialization
 */
export async function getAuth() {
	// Return cached instance if available
	if (authInstance) {
		// // console.log("auth instance : ", authInstance);
		return authInstance;
	}

	// Return pending initialization promise if in progress
	if (initPromise) {
		// // console.log("init promise ", initPromise);
		return initPromise;
	}

	// Initialize auth instance
	initPromise = (async () => {
		try {
			// Get MongoDB client
			const client = await getMongoClient();
			const db = client.db(process.env.MONGODB_DB || "synos-db");

			// Create Better Auth instance
			authInstance = betterAuth({
				appName: "Synos Medical",
				baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
				secret: process.env.BETTER_AUTH_SECRET!,

				// Database adapter
				database: mongodbAdapter(db),

				// Email and password authentication
				emailAndPassword: {
					enabled: true,
					requireEmailVerification: false, // Disabled per requirements
					minPasswordLength: 8,
					maxPasswordLength: 128,
				},

				// Session configuration
				session: {
					expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
					updateAge: 60 * 60 * 24, // Update session every 24 hours
					cookieCache: {
						enabled: true,
						maxAge: 60 * 5, // 5 minutes
					},
				},

				// Cookie configuration
				advanced: {
					cookiePrefix: "synos",
					crossSubDomainCookies: {
						enabled: false,
					},
					useSecureCookies: process.env.NODE_ENV === "production",
				},

				// Trusted origins for CORS
				// Add additional trusted origins via BETTER_AUTH_TRUSTED_ORIGINS env var (comma-separated)
				trustedOrigins: [
					process.env.BETTER_AUTH_URL || "http://localhost:3000",
					process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
						"http://localhost:3000",
					// Parse additional origins from env if provided
					...(process.env.BETTER_AUTH_TRUSTED_ORIGINS
						? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map(
								(o) => o.trim()
						  )
						: []),
				].filter(Boolean),

				// Plugins
				plugins: [
					// Next.js cookie integration
					nextCookies(),
				],
			});
			// // console.log("auth instance ", authInstance);
			return authInstance;
		} catch (error) {
			console.error("Failed to initialize Better Auth:", error);
			initPromise = null; // Reset promise on error
			throw error;
		}
	})();

	// // console.log("init promise ", initPromise);
	return initPromise;
}

/**
 * Export auth instance for use in API routes
 * Note: This is async and must be awaited
 */
export const auth = getAuth();
