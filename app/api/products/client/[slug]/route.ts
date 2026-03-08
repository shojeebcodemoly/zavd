import { NextRequest } from "next/server";
import { productService } from "@/lib/services/product.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	notFoundResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

interface RouteParams {
	params: Promise<{ slug: string }>;
}

/**
 * GET /api/products/client/[slug]
 * Get a single public product by slug
 * Only returns products that are:
 * - publishType: "publish"
 * - visibility: "public"
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { slug } = await params;

		// Use public method - only returns published & public products
		const product = await productService.getPublicProductBySlug(slug);

		return successResponse(product, "Product retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching public product", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse("Product not found");
		}

		const message =
			error instanceof Error ? error.message : "Failed to fetch product";
		return internalServerErrorResponse(message);
	}
}
