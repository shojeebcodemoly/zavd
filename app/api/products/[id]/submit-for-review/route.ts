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
 * POST /api/products/[id]/submit-for-review
 * Submit a product for review (set to pending status)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to submit product for review");
			return unauthorizedResponse(
				"You must be logged in to submit products for review"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid product ID format");
		}

		// Submit product for review
		const product = await productService.submitForReview(
			id,
			session.user.id
		);

		logger.info("Product submitted for review", {
			productId: id,
			submittedBy: session.user.id,
		});

		return successResponse(product, "Product submitted for review successfully");
	} catch (error: unknown) {
		logger.error("Error submitting product for review", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse(error.message);
		}

		const message =
			error instanceof Error ? error.message : "Failed to submit product for review";
		return internalServerErrorResponse(message);
	}
}
