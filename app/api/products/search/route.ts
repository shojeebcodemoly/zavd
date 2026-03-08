import { NextRequest } from "next/server";
import { productService } from "@/lib/services/product.service";
import { logger } from "@/lib/utils/logger";
import {
	badRequestResponse,
	internalServerErrorResponse,
	paginatedResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/products/search
 * Search products (public endpoint for published products)
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q");
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");

		if (!query || query.trim().length < 2) {
			return badRequestResponse("Search query must be at least 2 characters");
		}

		const result = await productService.searchProducts(query, {
			page,
			limit,
			publishedOnly: true,
		});

		return paginatedResponse(
			result.data,
			result.page,
			result.limit,
			result.total,
			"Search results"
		);
	} catch (error: unknown) {
		logger.error("Error searching products", error);
		const message = error instanceof Error ? error.message : "Failed to search products";
		return internalServerErrorResponse(message);
	}
}
