import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { productService } from "@/lib/services/product.service";
import { logger } from "@/lib/utils/logger";
import { isValidObjectId } from "@/lib/utils/product-helpers";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * GET /api/products/[id]/validate
 * Preview validation results without publishing
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to validate product");
			return unauthorizedResponse(
				"You must be logged in to validate products"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid product ID format");
		}

		// Get validation results
		const validationResults = await productService.previewValidation(id);

		// Separate errors from warnings
		const errors = validationResults.filter((v) => v.type === "error");
		const warnings = validationResults.filter((v) => v.type === "warning");

		return successResponse(
			{
				canPublish: errors.length === 0,
				errors,
				warnings,
				totalIssues: validationResults.length,
			},
			"Validation completed"
		);
	} catch (error: unknown) {
		logger.error("Error validating product", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse(error.message);
		}

		const message =
			error instanceof Error ? error.message : "Failed to validate product";
		return internalServerErrorResponse(message);
	}
}
