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
} from "@/lib/utils/api-response";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * POST /api/products/[id]/unpublish
 * Unpublish a product (set to draft)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to unpublish product");
			return unauthorizedResponse(
				"You must be logged in to unpublish products"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid product ID format");
		}

		// Unpublish product
		const product = await productService.unpublishProduct(
			id,
			session.user.id
		);

		// Revalidate ISR cache - use primaryCategory first, then first category
		const primaryCat = product.primaryCategory as unknown as { slug?: string } | null;
		const categoriesArray = product.categories as unknown as Array<{ slug?: string }>;
		const categorySlug = primaryCat?.slug || categoriesArray?.[0]?.slug;
		await revalidateProduct(product.slug, categorySlug);

		logger.info("Product unpublished", {
			productId: id,
			unpublishedBy: session.user.id,
		});

		return successResponse(product, "Product unpublished successfully");
	} catch (error: unknown) {
		logger.error("Error unpublishing product", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse(error.message);
		}

		const message =
			error instanceof Error ? error.message : "Failed to unpublish product";
		return internalServerErrorResponse(message);
	}
}
