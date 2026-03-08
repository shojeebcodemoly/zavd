import { getAuth } from "@/lib/db/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { logger } from "@/lib/utils/logger";

/**
 * Better Auth API Handler
 * Handles all authentication routes: /api/auth/*
 *
 * Routes handled by Better Auth:
 * - POST /api/auth/sign-up
 * - POST /api/auth/sign-in
 * - POST /api/auth/sign-out
 * - GET  /api/auth/get-session
 * - POST /api/auth/verify-email
 * - POST /api/auth/reset-password
 */

let handlerPromise: Promise<ReturnType<typeof toNextJsHandler>> | null = null;

/**
 * Initialize Better Auth handler
 * Uses promise caching to avoid multiple initializations
 */
async function getHandler() {
	if (!handlerPromise) {
		handlerPromise = (async () => {
			try {
				logger.info("Initializing Better Auth handler");
				const auth = await getAuth();
				const handler = toNextJsHandler(auth);
				logger.info("Better Auth handler initialized successfully");
				return handler;
			} catch (error) {
				logger.error("Failed to initialize Better Auth handler", error);
				handlerPromise = null; // Reset on error
				throw error;
			}
		})();
	}
	return handlerPromise;
}

/**
 * Handle GET requests
 */
export async function GET(request: Request) {
	try {
		const handler = await getHandler();
		return handler.GET(request);
	} catch (error) {
		logger.error("Error in auth GET handler", error);
		return new Response(
			JSON.stringify({
				success: false,
				message: "Authentication service error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}

/**
 * Handle POST requests
 */
export async function POST(request: Request) {
	try {
		const handler = await getHandler();
		return handler.POST(request);
	} catch (error) {
		logger.error("Error in auth POST handler", error);
		return new Response(
			JSON.stringify({
				success: false,
				message: "Authentication service error",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
