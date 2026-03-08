import { NextRequest } from "next/server";
import { searchService } from "@/lib/services/search.service";
import { logger } from "@/lib/utils/logger";
import {
	badRequestResponse,
	internalServerErrorResponse,
	successResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/search
 * Unified search across products, blog posts, and categories
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q") || searchParams.get("s") || "";
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");

		// Validate query
		if (!query || query.trim().length < 2) {
			return badRequestResponse("Search query must be at least 2 characters");
		}

		// Perform search
		const results = await searchService.search({
			query,
			page,
			limit,
		});

		return successResponse(results, "Search results", 200, {
			page,
			limit,
			total: results.totalResults,
			totalPages: Math.ceil(results.totalResults / limit),
		});
	} catch (error: unknown) {
		logger.error("Search API error", error);
		const message =
			error instanceof Error ? error.message : "Failed to perform search";
		return internalServerErrorResponse(message);
	}
}
