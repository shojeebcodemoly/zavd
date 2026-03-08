import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { productService } from "@/lib/services/product.service";
import { logger } from "@/lib/utils/logger";
import { isValidObjectId } from "@/lib/utils/product-helpers";
import { revalidateProduct } from "@/lib/revalidation/actions";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
	validationErrorResponse,
} from "@/lib/utils/api-response";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * POST /api/products/[id]/publish
 * Publish a product (runs validation)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to publish product");
			return unauthorizedResponse(
				"You must be logged in to publish products"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid product ID format");
		}

		// Publish product
		const result = await productService.publishProduct(id, session.user.id);

		// Revalidate ISR cache - use primaryCategory first, then first category
		const primaryCat = result.product.primaryCategory as unknown as { slug?: string } | null;
		const categoriesArray = result.product.categories as unknown as Array<{ slug?: string }>;
		const categorySlug = primaryCat?.slug || categoriesArray?.[0]?.slug;
		await revalidateProduct(result.product.slug, categorySlug);

		logger.info("Product published", {
			productId: id,
			publishedBy: session.user.id,
			warnings: result.warnings.length,
		});

		return successResponse(
			{
				product: result.product,
				warnings: result.warnings,
			},
			"Product published successfully"
		);
	} catch (error: unknown) {
		logger.error("Error publishing product", error);

		if (error instanceof Error) {
			if (error.message.includes("not found")) {
				return notFoundResponse(error.message);
			}
			if (error.message.includes("cannot be published")) {
				// Get validation errors from the error object
				const validationErrors =
					(error as { errors?: unknown[] }).errors || [];
				return validationErrorResponse(
					"Product cannot be published due to validation errors",
					validationErrors
				);
			}
		}

		const message =
			error instanceof Error ? error.message : "Failed to publish product";
		return internalServerErrorResponse(message);
	}
}
