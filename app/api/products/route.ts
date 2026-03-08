import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { productService } from "@/lib/services/product.service";
import {
	createProductDraftSchema,
	productListQuerySchema,
} from "@/lib/validations/product.validation";
import { logger } from "@/lib/utils/logger";
import {
	// successResponse,
	createdResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
	paginatedResponse,
	conflictResponse,
	validationErrorResponse,
} from "@/lib/utils/api-response";
import { generateSlug } from "@/lib/utils/product-helpers";
import { revalidateProduct } from "@/lib/revalidation/actions";

/**
 * GET /api/products
 * List products with filtering and pagination
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// Parse query params
		const queryResult = productListQuerySchema.safeParse({
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "10",
			search: searchParams.get("search"),
			category: searchParams.get("category"),
			publishType: searchParams.get("publishType"),
			visibility: searchParams.get("visibility"),
			sort: searchParams.get("sort") || "-createdAt",
		});

		if (!queryResult.success) {
			return badRequestResponse(
				"Invalid query parameters",
				queryResult.error.issues
			);
		}

		const { page, limit, search, category, publishType, visibility, sort } =
			queryResult.data;

		const result = await productService.getProducts({
			page,
			limit,
			search,
			category,
			publishType,
			visibility,
			sort,
		});

		return paginatedResponse(
			result.data,
			result.page,
			result.limit,
			result.total,
			"Products retrieved successfully"
		);
	} catch (error: unknown) {
		logger.error("Error fetching products", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch products";
		return internalServerErrorResponse(message);
	}
}

/**
 * POST /api/products
 * Create a new product (requires authentication)
 * Supports atomic create-and-publish with shouldPublish flag
 */
export async function POST(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to create product");
			return unauthorizedResponse(
				"You must be logged in to create products"
			);
		}

		// Parse and validate request body
		const body = await request.json();
		const { shouldPublish, ...productData } = body;

		const validationResult = createProductDraftSchema.safeParse(productData);

		if (!validationResult.success) {
			logger.warn("Product creation validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// If shouldPublish is true, validate for publishing BEFORE creating
		if (shouldPublish) {
			// Generate slug if not provided (same logic as createProduct)
			const dataWithSlug = {
				...validationResult.data,
				slug: validationResult.data.slug || generateSlug(validationResult.data.title),
			};

			const publishErrors = productService.validateForPublishData(dataWithSlug);
			const errors = publishErrors.filter((e) => e.type === "error");

			if (errors.length > 0) {
				// Return validation errors WITHOUT creating the product
				logger.warn("Product publish validation failed (pre-create)", {
					errors: errors,
				});
				return validationErrorResponse(
					"Product cannot be published due to validation errors",
					errors
				);
			}
		}

		// Create product
		const product = await productService.createProduct(
			validationResult.data,
			session.user.id
		);

		logger.info("Product created", {
			productId: product._id,
			title: product.title,
			createdBy: session.user.id,
		});

		// If shouldPublish, also publish the product
		if (shouldPublish) {
			try {
				const publishResult = await productService.publishProduct(
					product._id.toString(),
					session.user.id
				);

				// Revalidate ISR cache - use primaryCategory first, then first category
				const publishedProduct = publishResult.product;
				const primaryCat = publishedProduct.primaryCategory as unknown as { slug?: string } | null;
				const categoriesArray = publishedProduct.categories as unknown as Array<{ slug?: string }>;
				const categorySlug = primaryCat?.slug || categoriesArray?.[0]?.slug;
				await revalidateProduct(publishedProduct.slug, categorySlug);

				logger.info("Product created and published", {
					productId: product._id,
					title: product.title,
				});

				return createdResponse(
					publishResult,
					"Product created and published successfully"
				);
			} catch (publishError) {
				// If publish fails after create (shouldn't happen due to pre-validation)
				// Return error but product is still created as draft
				logger.error("Product created but publish failed", publishError);
				return validationErrorResponse(
					"Product created but publish failed",
					publishError instanceof Error ? [{ field: "general", message: publishError.message, type: "error" }] : []
				);
			}
		}

		// Revalidate ISR cache for draft products too (so they show in admin lists)
		const primaryCat = product.primaryCategory as unknown as { slug?: string } | null;
		const categoriesArray = product.categories as unknown as Array<{ slug?: string }>;
		const categorySlug = primaryCat?.slug || categoriesArray?.[0]?.slug;
		await revalidateProduct(product.slug, categorySlug);

		return createdResponse(product, "Product created successfully");
	} catch (error: unknown) {
		logger.error("Error creating product", error);

		if (error instanceof Error) {
			if (error.message.includes("already exists")) {
				return conflictResponse(error.message);
			}
			if (error.message.includes("not found")) {
				return badRequestResponse(error.message);
			}
		}

		const message =
			error instanceof Error ? error.message : "Failed to create product";
		return internalServerErrorResponse(message);
	}
}
