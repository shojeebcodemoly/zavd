import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { productService } from "@/lib/services/product.service";
import { logger } from "@/lib/utils/logger";
import { isValidObjectId } from "@/lib/utils/product-helpers";
import { revalidateProduct } from "@/lib/revalidation/actions";
import {
	createdResponse,
	badRequestResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * POST /api/products/[id]/duplicate
 * Duplicate a product
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to duplicate product");
			return unauthorizedResponse(
				"You must be logged in to duplicate products"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid product ID format");
		}

		// Duplicate product
		const product = await productService.duplicateProduct(
			id,
			session.user.id
		);

		// Revalidate ISR cache - use primaryCategory first, then first category
		const primaryCat = product.primaryCategory as unknown as { slug?: string } | null;
		const categoriesArray = product.categories as unknown as Array<{ slug?: string }>;
		const categorySlug = primaryCat?.slug || categoriesArray?.[0]?.slug;
		await revalidateProduct(product.slug, categorySlug);

		logger.info("Product duplicated", {
			originalProductId: id,
			newProductId: product._id,
			duplicatedBy: session.user.id,
		});

		return createdResponse(product, "Product duplicated successfully");
	} catch (error: unknown) {
		logger.error("Error duplicating product", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse(error.message);
		}

		const message =
			error instanceof Error ? error.message : "Failed to duplicate product";
		return internalServerErrorResponse(message);
	}
}
