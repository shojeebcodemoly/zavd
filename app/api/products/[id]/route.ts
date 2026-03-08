import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { productService } from "@/lib/services/product.service";
import { updateProductSchema } from "@/lib/validations/product.validation";
import { logger } from "@/lib/utils/logger";
import { isValidObjectId, generateSlug } from "@/lib/utils/product-helpers";
import { revalidateProduct } from "@/lib/revalidation/actions";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
	noContentResponse,
	conflictResponse,
	validationErrorResponse,
} from "@/lib/utils/api-response";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * GET /api/products/[id]
 * Get a single product by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid product ID format");
		}

		const product = await productService.getProductById(id);

		return successResponse(product, "Product retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching product", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse("Product not found");
		}

		const message =
			error instanceof Error ? error.message : "Failed to fetch product";
		return internalServerErrorResponse(message);
	}
}

/**
 * PUT /api/products/[id]
 * Update a product (requires authentication)
 * Supports atomic save-and-publish with shouldPublish flag
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update product");
			return unauthorizedResponse(
				"You must be logged in to update products"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid product ID format");
		}

		// Parse and validate request body
		const body = await request.json();
		const { shouldPublish, ...productData } = body;

		const validationResult = updateProductSchema.safeParse(productData);

		if (!validationResult.success) {
			logger.warn("Product update validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// If shouldPublish is true, validate for publishing BEFORE saving
		if (shouldPublish) {
			// Get existing product to merge with updates for validation
			const existingProduct = await productService.getProductById(id);

			// Merge existing data with updates for complete validation
			const mergedData = {
				title: validationResult.data.title ?? existingProduct.title,
				slug: validationResult.data.slug ?? existingProduct.slug ?? generateSlug(validationResult.data.title ?? existingProduct.title),
				shortDescription: validationResult.data.shortDescription ?? existingProduct.shortDescription,
				productDescription: validationResult.data.productDescription ?? existingProduct.productDescription,
				productImages: validationResult.data.productImages ?? existingProduct.productImages,
				techSpecifications: validationResult.data.techSpecifications ?? existingProduct.techSpecifications,
				documentation: validationResult.data.documentation ?? existingProduct.documentation,
				qa: validationResult.data.qa ?? existingProduct.qa,
				youtubeUrl: validationResult.data.youtubeUrl ?? existingProduct.youtubeUrl,
				seo: validationResult.data.seo ?? existingProduct.seo,
			};

			const publishErrors = productService.validateForPublishData(mergedData);
			const errors = publishErrors.filter((e) => e.type === "error");

			if (errors.length > 0) {
				// Return validation errors WITHOUT saving the product
				logger.warn("Product publish validation failed (pre-save)", {
					productId: id,
					errors: errors,
				});
				return validationErrorResponse(
					"Product cannot be published due to validation errors",
					errors
				);
			}
		}

		// Update product
		const product = await productService.updateProduct(
			id,
			validationResult.data,
			session.user.id
		);

		logger.info("Product updated", {
			productId: id,
			updatedBy: session.user.id,
			updates: Object.keys(validationResult.data),
		});

		// If shouldPublish, also publish the product
		if (shouldPublish) {
			try {
				const publishResult = await productService.publishProduct(
					id,
					session.user.id
				);

				// Revalidate ISR cache - use primaryCategory first, then first category
				const primaryCat = publishResult.product.primaryCategory as unknown as { slug?: string } | null;
				const categoriesArray = publishResult.product.categories as unknown as Array<{ slug?: string }>;
				const categorySlug = primaryCat?.slug || categoriesArray?.[0]?.slug;
				await revalidateProduct(publishResult.product.slug, categorySlug);

				logger.info("Product updated and published", {
					productId: id,
					title: product.title,
				});

				return successResponse(
					publishResult,
					"Product updated and published successfully"
				);
			} catch (publishError) {
				// If publish fails after save (shouldn't happen due to pre-validation)
				logger.error("Product saved but publish failed", publishError);
				return validationErrorResponse(
					"Product saved but publish failed",
					publishError instanceof Error ? [{ field: "general", message: publishError.message, type: "error" }] : []
				);
			}
		}

		// Revalidate ISR cache - use primaryCategory first, then first category
		const primaryCat = product.primaryCategory as unknown as { slug?: string } | null;
		const categoriesArray = product.categories as unknown as Array<{ slug?: string }>;
		const categorySlug = primaryCat?.slug || categoriesArray?.[0]?.slug;
		await revalidateProduct(product.slug, categorySlug);

		return successResponse(product, "Product updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating product", error);

		if (error instanceof Error) {
			if (error.message.includes("not found")) {
				return notFoundResponse(error.message);
			}
			if (error.message.includes("already exists")) {
				return conflictResponse(error.message);
			}
		}

		const message =
			error instanceof Error ? error.message : "Failed to update product";
		return internalServerErrorResponse(message);
	}
}

/**
 * DELETE /api/products/[id]
 * Delete a product (requires authentication)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;

		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to delete product");
			return unauthorizedResponse(
				"You must be logged in to delete products"
			);
		}

		if (!isValidObjectId(id)) {
			return badRequestResponse("Invalid product ID format");
		}

		// Get product info before deletion for revalidation
		const productToDelete = await productService.getProductById(id);
		const productSlug = productToDelete?.slug;
		// Use primaryCategory first, then first category
		const primaryCat = productToDelete?.primaryCategory as unknown as { slug?: string } | null;
		const categoriesArray = productToDelete?.categories as unknown as Array<{ slug?: string }>;
		const categorySlug = primaryCat?.slug || categoriesArray?.[0]?.slug;

		// Delete product
		await productService.deleteProduct(id);

		// Revalidate ISR cache
		if (productSlug) {
			await revalidateProduct(productSlug, categorySlug);
		}

		logger.info("Product deleted", {
			productId: id,
			deletedBy: session.user.id,
		});

		return noContentResponse();
	} catch (error: unknown) {
		logger.error("Error deleting product", error);

		if (error instanceof Error && error.message.includes("not found")) {
			return notFoundResponse(error.message);
		}

		const message =
			error instanceof Error ? error.message : "Failed to delete product";
		return internalServerErrorResponse(message);
	}
}
