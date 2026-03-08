import { NextRequest } from "next/server";
import { productService } from "@/lib/services/product.service";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

/**
 * GET /api/products/tags
 * Get all unique treatments and certifications tags
 */
export async function GET(_request: NextRequest) {
	try {
		const [treatments, certifications] = await Promise.all([
			productService.getAllTreatments(),
			productService.getAllCertifications(),
		]);

		return successResponse(
			{
				treatments,
				certifications,
			},
			"Tags retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching tags", error);
		const message = error instanceof Error ? error.message : "Failed to fetch tags";
		return internalServerErrorResponse(message);
	}
}
