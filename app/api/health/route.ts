import { NextRequest } from "next/server";
import { connectMongoose } from "@/lib/db/db-connect";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import mongoose from "mongoose";

/**
 * GET /api/health
 * Health check endpoint
 * Checks database connectivity and service status
 */
export async function GET(request: NextRequest) {
	try {
		// Check database connection
		await connectMongoose();

		const dbStatus = mongoose.connection.readyState;
		const isConnected = dbStatus === 1; // 1 = connected

		const healthData = {
			status: isConnected ? "healthy" : "unhealthy",
			timestamp: new Date().toISOString(),
			database: {
				connected: isConnected,
				readyState: dbStatus,
				name: process.env.MONGODB_DB || "synos-db",
			},
			environment: process.env.NODE_ENV || "development",
		};

		if (isConnected) {
			logger.info("Health check passed");
			return successResponse(healthData, "Service is healthy");
		} else {
			logger.error("Health check failed - database not connected");
			return internalServerErrorResponse(
				"Service unhealthy - database not connected"
			);
		}
	} catch (error) {
		logger.error("Health check error", error);
		return internalServerErrorResponse("Health check failed");
	}
}
