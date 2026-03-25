import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

export const dynamic = "force-dynamic";

export interface NavigationData {
	categories: [];
}

/**
 * GET /api/navigation
 * Get navigation data for the navbar
 */
export async function GET() {
	try {
		const navigationData: NavigationData = {
			categories: [],
		};

		const response = successResponse(
			navigationData,
			"Navigation data retrieved successfully"
		);

		response.headers.set(
			"Cache-Control",
			"public, s-maxage=300, stale-while-revalidate=600"
		);

		return response;
	} catch (error: unknown) {
		logger.error("Error fetching navigation data", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch navigation data";
		return internalServerErrorResponse(message);
	}
}
