import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { productService } from "@/lib/services/product.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/products/stats
 * Get product statistics (requires authentication)
 */
export async function GET(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to product stats");
			return unauthorizedResponse(
				"You must be logged in to view product stats"
			);
		}

		const stats = await productService.getProductStats();

		return successResponse(stats, "Product stats retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching product stats", error);
		const message =
			error instanceof Error
				? error.message
				: "Failed to fetch product stats";
		return internalServerErrorResponse(message);
	}
}
