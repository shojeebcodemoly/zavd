import { productRepository } from "@/lib/repositories/product.repository";
import { categoryRepository } from "@/lib/repositories/category.repository";
import { logger } from "@/lib/utils/logger";
import {
	NotFoundError,
	DatabaseError,
	BadRequestError,
	ConflictError,
	ValidationError,
} from "@/lib/utils/api-error";
import {
	generateSlug,
	generateUniqueSlug,
	isValidUrl,
	isValidSlug,
	sanitizeHtml,
} from "@/lib/utils/product-helpers";
import type { IProduct, PublishType, Visibility } from "@/models/product.model";
import type {
	CreateProductDraftInput,
	UpdateProductInput,
} from "@/lib/validations/product.validation";

/**
 * Validation error structure for publish validation
 */
export interface PublishValidationError {
	field: string;
	message: string;
	type: "error" | "warning";
}

/**
 * Product Service
 * Handles business logic for product operations
 */

interface CategoryItem {
	_id: string;
	name: string;
	slug: string;
}
type CategoryInput = string | { _id?: string; id?: string; value?: string };

class ProductService {
	/**
	 * Validate product for publishing
	 * Returns array of validation errors/warnings
	 */
	validateForPublish(product: IProduct): PublishValidationError[] {
		const errors: PublishValidationError[] = [];

		// Required fields (errors)
		if (!product.title?.trim()) {
			errors.push({
				field: "title",
				message: "Title is required for publishing",
				type: "error",
			});
		}

		if (!product.slug?.trim()) {
			errors.push({
				field: "slug",
				message: "Slug is required for publishing",
				type: "error",
			});
		} else if (!isValidSlug(product.slug)) {
			errors.push({
				field: "slug",
				message: "Slug must be lowercase, alphanumeric with hyphens only",
				type: "error",
			});
		}

		if (!product.shortDescription?.trim()) {
			errors.push({
				field: "shortDescription",
				message: "Short Description is required for publishing",
				type: "error",
			});
		}

		if (!product.productDescription?.trim()) {
			errors.push({
				field: "productDescription",
				message: "Description is required for publishing",
				type: "error",
			});
		}

		// At least one product image
		if (!product.productImages || product.productImages.length === 0) {
			errors.push({
				field: "productImages",
				message: "At least one product image is required for publishing",
				type: "error",
			});
		}
		// else {
		// 	// Validate each image URL
		// 	product.productImages.forEach((url, index) => {
		// 		if (!isValidUrl(url)) {
		// 			errors.push({
		// 				field: `productImages[${index}]`,
		// 				message: `Invalid URL format for product image ${index + 1}`,
		// 				type: "error",
		// 			});
		// 		}
		// 	});
		// }

		// Validate overview image if present
		// if (product.overviewImage && !isValidUrl(product.overviewImage)) {
		// 	errors.push({
		// 		field: "overviewImage",
		// 		message: "Invalid URL format for overview image",
		// 		type: "error",
		// 	});
		// }

		// Validate tech specifications
		if (product.techSpecifications) {
			product.techSpecifications.forEach((spec, index) => {
				if (!spec.title?.trim()) {
					errors.push({
						field: `techSpecifications[${index}].title`,
						message: `Tech specification ${index + 1} requires a title`,
						type: "error",
					});
				}
				if (!spec.description?.trim()) {
					errors.push({
						field: `techSpecifications[${index}].description`,
						message: `Tech specification ${
							index + 1
						} requires a description`,
						type: "error",
					});
				}
			});
		}

		// Validate documentation entries
		if (product.documentation) {
			product.documentation.forEach((doc, index) => {
				if (!doc.title?.trim()) {
					errors.push({
						field: `documentation[${index}].title`,
						message: `Documentation ${index + 1} requires a title`,
						type: "error",
					});
				}
				if (!doc.url?.trim()) {
					errors.push({
						field: `documentation[${index}].url`,
						message: `Documentation ${index + 1} requires a URL`,
						type: "error",
					});
				}
				// else if (!isValidUrl(doc.url)) {
				// 	errors.push({
				// 		field: `documentation[${index}].url`,
				// 		message: `Invalid URL format for documentation ${index + 1}`,
				// 		type: "error",
				// 	});
				// }
			});
		}

		// Validate QnA entries
		if (product.qa) {
			product.qa.forEach((qa, index) => {
				if (!qa.question?.trim()) {
					errors.push({
						field: `qa[${index}].question`,
						message: `Q&A ${index + 1} requires a question`,
						type: "error",
					});
				}
				if (!qa.answer?.trim()) {
					errors.push({
						field: `qa[${index}].answer`,
						message: `Q&A ${index + 1} requires an answer`,
						type: "error",
					});
				}
			});
		}

		// Validate YouTube URL if present
		if (product.youtubeUrl && !isValidUrl(product.youtubeUrl)) {
			errors.push({
				field: "youtubeUrl",
				message: "Invalid YouTube URL format",
				type: "error",
			});
		}

		// SEO warnings (not blocking, but recommended)
		if (!product.seo?.title?.trim()) {
			errors.push({
				field: "seo.title",
				message: "SEO title is recommended for better search visibility",
				type: "warning",
			});
		}

		if (!product.seo?.description?.trim()) {
			errors.push({
				field: "seo.description",
				message:
					"SEO description is recommended for better search visibility",
				type: "warning",
			});
		}

		return errors;
	}

	/**
	 * Validate product form data for publishing (before DB save)
	 * Similar to validateForPublish but works on form data, not IProduct
	 * Used to validate BEFORE creating a product when user wants to publish directly
	 */
	validateForPublishData(
		data: Partial<CreateProductDraftInput> & { slug?: string }
	): PublishValidationError[] {
		const errors: PublishValidationError[] = [];

		// Required fields (errors)
		if (!data.title?.trim()) {
			errors.push({
				field: "title",
				message: "Title is required for publishing",
				type: "error",
			});
		}

		if (!data.slug?.trim()) {
			errors.push({
				field: "slug",
				message: "Slug is required for publishing",
				type: "error",
			});
		} else if (!isValidSlug(data.slug)) {
			errors.push({
				field: "slug",
				message: "Slug must be lowercase, alphanumeric with hyphens only",
				type: "error",
			});
		}

		if (!data.shortDescription?.trim()) {
			errors.push({
				field: "shortDescription",
				message: "Short Description is required for publishing",
				type: "error",
			});
		}

		if (!data.productDescription?.trim()) {
			errors.push({
				field: "productDescription",
				message: "Product Description is required for publishing",
				type: "error",
			});
		}

		// At least one product image
		if (!data.productImages || data.productImages.length === 0) {
			errors.push({
				field: "productImages",
				message: "At least one product image is required for publishing",
				type: "error",
			});
		}

		// Validate tech specifications
		if (data.techSpecifications && data.techSpecifications.length > 0) {
			data.techSpecifications.forEach((spec, index) => {
				if (!spec.title?.trim()) {
					errors.push({
						field: `techSpecifications[${index}].title`,
						message: `Tech specification ${index + 1} requires a title`,
						type: "error",
					});
				}
				if (!spec.description?.trim()) {
					errors.push({
						field: `techSpecifications[${index}].description`,
						message: `Tech specification ${index + 1} requires a description`,
						type: "error",
					});
				}
			});
		}

		// Validate documentation entries
		if (data.documentation && data.documentation.length > 0) {
			data.documentation.forEach((doc, index) => {
				if (!doc.title?.trim()) {
					errors.push({
						field: `documentation[${index}].title`,
						message: `Documentation ${index + 1} requires a title`,
						type: "error",
					});
				}
				if (!doc.url?.trim()) {
					errors.push({
						field: `documentation[${index}].url`,
						message: `Documentation ${index + 1} requires a URL`,
						type: "error",
					});
				}
			});
		}

		// Validate QnA entries
		if (data.qa && data.qa.length > 0) {
			data.qa.forEach((qa, index) => {
				if (!qa.question?.trim()) {
					errors.push({
						field: `qa[${index}].question`,
						message: `Q&A ${index + 1} requires a question`,
						type: "error",
					});
				}
				if (!qa.answer?.trim()) {
					errors.push({
						field: `qa[${index}].answer`,
						message: `Q&A ${index + 1} requires an answer`,
						type: "error",
					});
				}
			});
		}

		// Validate YouTube URL if present
		if (data.youtubeUrl && !isValidUrl(data.youtubeUrl)) {
			errors.push({
				field: "youtubeUrl",
				message: "Invalid YouTube URL format",
				type: "error",
			});
		}

		// SEO warnings (not blocking, but recommended)
		if (!data.seo?.title?.trim()) {
			errors.push({
				field: "seo.title",
				message: "SEO title is recommended for better search visibility",
				type: "warning",
			});
		}

		if (!data.seo?.description?.trim()) {
			errors.push({
				field: "seo.description",
				message: "SEO description is recommended for better search visibility",
				type: "warning",
			});
		}

		return errors;
	}

	/**
	 * Create a new product (draft)
	 */
	async createProduct(
		data: CreateProductDraftInput,
		userId: string
	): Promise<IProduct> {
		try {
			// Generate slug if not provided
			let slug = data.slug;
			if (!slug) {
				const baseSlug = generateSlug(data.title);
				slug = await generateUniqueSlug(baseSlug, async (s) =>
					productRepository.slugExists(s)
				);
			} else {
				// Check if provided slug already exists
				if (await productRepository.slugExists(slug)) {
					throw new ConflictError(`Slug "${slug}" already exists`);
				}
			}

			// Validate categories exist
			if (data.categories && data.categories.length > 0) {
				for (const categoryId of data.categories) {
					const category = await categoryRepository.findById(categoryId);
					if (!category) {
						throw new BadRequestError(
							`Category "${categoryId}" not found`
						);
					}
				}
			}

			// Determine primaryCategory: use provided value, or fallback to first category
			let primaryCategory: string | null = null;
			if (data.primaryCategory &&
				data.primaryCategory !== "undefined" &&
				data.primaryCategory !== "null" &&
				data.primaryCategory.trim() !== "") {
				primaryCategory = data.primaryCategory;
			} else if (data.categories && data.categories.length > 0) {
				// Auto-set to first category if no primary specified
				primaryCategory = data.categories[0];
			}

			// Sanitize HTML fields
			const sanitizedData = {
				...data,
				slug,
				description: data.description ? sanitizeHtml(data.description) : "",
				productDescription: data.productDescription
					? sanitizeHtml(data.productDescription)
					: "",
				hiddenDescription: data.hiddenDescription
					? sanitizeHtml(data.hiddenDescription)
					: "",
				purchaseInfo: data.purchaseInfo
					? {
							...data.purchaseInfo,
							description: data.purchaseInfo.description
								? sanitizeHtml(data.purchaseInfo.description)
								: "",
					  }
					: undefined,
				primaryCategory,
				lastEditedBy: userId,
			};

			const product = await productRepository.create(sanitizedData);

			logger.info("Product created", {
				productId: product._id,
				title: product.title,
				publishType: product.publishType,
			});

			return product;
		} catch (error) {
			logger.error("Error creating product", error);

			if (
				error instanceof ConflictError ||
				error instanceof BadRequestError
			) {
				throw error;
			}

			throw new DatabaseError("Failed to create product");
		}
	}

	/**
	 * Get product by ID
	 */
	async getProductById(id: string): Promise<IProduct> {
		const product = await productRepository.findByIdWithPopulated(id);

		if (!product) {
			throw new NotFoundError("Product not found");
		}

		return product;
	}

	/**
	 * Get product by slug (admin - no visibility filter)
	 */
	async getProductBySlug(slug: string): Promise<IProduct> {
		const product = await productRepository.findBySlugWithCategories(slug);

		if (!product) {
			throw new NotFoundError("Product not found");
		}

		return product;
	}

	/**
	 * Get public product by slug (for client/frontend)
	 * Only returns published products with public visibility
	 */
	async getPublicProductBySlug(slug: string): Promise<IProduct> {
		const product = await productRepository.findPublicBySlug(slug);

		if (!product) {
			throw new NotFoundError("Product not found");
		}

		return product;
	}

	/**
	 * Update a product
	 */
	async updateProduct(
		id: string,
		data: UpdateProductInput,
		userId: string
	): Promise<IProduct> {
		try {
			// // console.log("updateProduct => ", id);
			const product = await productRepository.findById(id);
			// // console.log("product => ", product);

			if (!product) {
				throw new NotFoundError("Product not found");
			}

			// If slug is being changed, check uniqueness
			if (data.slug && data.slug !== product.slug) {
				if (await productRepository.slugExists(data.slug, id)) {
					throw new ConflictError(`Slug "${data.slug}" already exists`);
				}
			}

			// // console.log("data.categories => ", data.categories);
			// Validate categories exist if provided
			if (data.categories && data.categories.length > 0) {
				// for (const categoryId of data.categories) {
				// 	// console.log("type => ", typeof categoryId);
				// 	// console.log("categoryId => ", categoryId);
				// 	// console.log("|=> ", JSON.stringify(categoryId));
				// 	console.dir(categoryId);

				// 	const category = await categoryRepository.findById(categoryId);
				// 	if (!category) {
				// 		throw new BadRequestError(
				// 			`Category "${categoryId}" not found`
				// 		);
				// 	}
				// }
				const categories = data.categories as CategoryInput[];
				for (let categoryId of categories) {
					if (typeof categoryId === "object" && categoryId !== null) {
						categoryId =
							categoryId._id ?? categoryId.id ?? categoryId.value ?? "";
					}

					if (!categoryId || typeof categoryId !== "string") {
						throw new BadRequestError("Invalid category id");
					}

					const category = await categoryRepository.findById(categoryId);

					if (!category) {
						throw new BadRequestError(`Category ${categoryId} not found`);
					}
				}
			}

			// Sanitize HTML fields if provided
			const sanitizedData: Record<string, unknown> = { ...data };
			if (data.description !== undefined) {
				sanitizedData.description = sanitizeHtml(data.description);
			}
			if (data.productDescription !== undefined) {
				sanitizedData.productDescription = sanitizeHtml(
					data.productDescription
				);
			}
			if (data.hiddenDescription !== undefined) {
				sanitizedData.hiddenDescription = sanitizeHtml(
					data.hiddenDescription
				);
			}
			if (data.purchaseInfo?.description !== undefined) {
				sanitizedData.purchaseInfo = {
					...data.purchaseInfo,
					description: sanitizeHtml(data.purchaseInfo.description),
				};
			}
			// Handle primaryCategory: use provided value, or fallback to first category if updating categories
			if (data.primaryCategory !== undefined || data.categories !== undefined) {
				let primaryCategory: string | null = null;

				if (data.primaryCategory &&
					data.primaryCategory !== "undefined" &&
					data.primaryCategory !== "null" &&
					data.primaryCategory.trim() !== "") {
					primaryCategory = data.primaryCategory;
				} else if (data.categories && data.categories.length > 0) {
					// Get the first category ID (handle both string and object formats)
					const firstCat = data.categories[0];
					if (typeof firstCat === "string") {
						primaryCategory = firstCat;
					} else if (typeof firstCat === "object" && firstCat !== null) {
						const catObj = firstCat as { _id?: string; id?: string; value?: string };
						primaryCategory = catObj._id ?? catObj.id ?? catObj.value ?? null;
					}
				} else if (!data.primaryCategory && product.categories.length > 0) {
					// Keep existing primary category if no new one provided and categories exist
					primaryCategory = product.primaryCategory?.toString() || null;
				}

				sanitizedData.primaryCategory = primaryCategory;
			}

			sanitizedData.lastEditedBy = userId;

			// Handle heroSettings - ensure it's properly structured for MongoDB update
			// MongoDB $set with nested objects needs explicit handling to avoid undefined values
			if (data.heroSettings !== undefined) {
				sanitizedData.heroSettings = {
					themeColor: data.heroSettings.themeColor ?? product.heroSettings?.themeColor ?? "#6B7280",
					badge: data.heroSettings.badge ?? product.heroSettings?.badge ?? "",
					ctaText: data.heroSettings.ctaText ?? product.heroSettings?.ctaText ?? "",
					ctaUrl: data.heroSettings.ctaUrl ?? product.heroSettings?.ctaUrl ?? "",
				};
			}

			// Handle productVariants and accordionSections similarly
			if (data.productVariants !== undefined) {
				sanitizedData.productVariants = data.productVariants;
			}
			if (data.accordionSections !== undefined) {
				sanitizedData.accordionSections = data.accordionSections;
			}

			const updatedProduct = await productRepository.updateById(id, {
				$set: sanitizedData,
			});

			if (!updatedProduct) {
				throw new DatabaseError("Failed to update product");
			}

			logger.info("Product updated", {
				productId: id,
				updates: Object.keys(data),
			});

			return updatedProduct;
		} catch (error) {
			logger.error("Error updating product", error);

			if (
				error instanceof NotFoundError ||
				error instanceof ConflictError ||
				error instanceof BadRequestError
			) {
				throw error;
			}

			throw new DatabaseError("Failed to update product");
		}
	}

	/**
	 * Delete a product
	 */
	async deleteProduct(id: string): Promise<void> {
		const product = await productRepository.findById(id);

		if (!product) {
			throw new NotFoundError("Product not found");
		}

		await productRepository.deleteById(id);

		logger.info("Product deleted", { productId: id, title: product.title });
	}

	/**
	 * Publish a product
	 * Runs full validation before publishing
	 */
	async publishProduct(
		id: string,
		userId: string
	): Promise<{ product: IProduct; warnings: PublishValidationError[] }> {
		const product = await productRepository.findById(id);

		if (!product) {
			throw new NotFoundError("Product not found");
		}

		// Run validation
		const validationResults = this.validateForPublish(product);

		// Separate errors from warnings
		const errors = validationResults.filter((v) => v.type === "error");
		const warnings = validationResults.filter((v) => v.type === "warning");

		// If there are errors, don't allow publishing
		if (errors.length > 0) {
			throw new ValidationError("Product cannot be published", errors);
		}

		// Update publish status
		const publishedProduct = await productRepository.updatePublishType(
			id,
			"publish",
			userId
		);

		if (!publishedProduct) {
			throw new DatabaseError("Failed to publish product");
		}

		logger.info("Product published", {
			productId: id,
			title: product.title,
			warnings: warnings.length,
		});

		return {
			product: publishedProduct,
			warnings,
		};
	}

	/**
	 * Unpublish a product (set to draft)
	 */
	async unpublishProduct(id: string, userId: string): Promise<IProduct> {
		const product = await productRepository.findById(id);

		if (!product) {
			throw new NotFoundError("Product not found");
		}

		const unpublishedProduct = await productRepository.updatePublishType(
			id,
			"draft",
			userId
		);

		if (!unpublishedProduct) {
			throw new DatabaseError("Failed to unpublish product");
		}

		logger.info("Product unpublished", { productId: id });

		return unpublishedProduct;
	}

	/**
	 * Submit product for review (set to pending)
	 */
	async submitForReview(id: string, userId: string): Promise<IProduct> {
		const product = await productRepository.findById(id);

		if (!product) {
			throw new NotFoundError("Product not found");
		}

		const pendingProduct = await productRepository.updatePublishType(
			id,
			"pending",
			userId
		);

		if (!pendingProduct) {
			throw new DatabaseError("Failed to submit product for review");
		}

		logger.info("Product submitted for review", { productId: id });

		return pendingProduct;
	}

	/**
	 * Set product to private
	 */
	async setProductPrivate(id: string, userId: string): Promise<IProduct> {
		const product = await productRepository.findById(id);

		if (!product) {
			throw new NotFoundError("Product not found");
		}

		const privateProduct = await productRepository.updatePublishType(
			id,
			"private",
			userId
		);

		if (!privateProduct) {
			throw new DatabaseError("Failed to set product as private");
		}

		logger.info("Product set to private", { productId: id });

		return privateProduct;
	}

	/**
	 * Update product visibility
	 */
	async updateVisibility(
		id: string,
		visibility: Visibility,
		userId: string
	): Promise<IProduct> {
		const product = await productRepository.findById(id);

		if (!product) {
			throw new NotFoundError("Product not found");
		}

		const updatedProduct = await productRepository.updateById(id, {
			$set: { visibility, lastEditedBy: userId },
		});

		if (!updatedProduct) {
			throw new DatabaseError("Failed to update visibility");
		}

		logger.info("Product visibility updated", { productId: id, visibility });

		return updatedProduct;
	}

	/**
	 * Get products with filtering
	 */
	async getProducts(options: {
		page?: number;
		limit?: number;
		search?: string;
		category?: string;
		publishType?: PublishType;
		visibility?: Visibility;
		sort?: string;
	}): Promise<{
		data: IProduct[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		return productRepository.findWithFilters(options);
	}

	/**
	 * Get published products for public display
	 */
	async getPublishedProducts(options: {
		page?: number;
		limit?: number;
		category?: string;
		sort?: string;
	}): Promise<{
		data: IProduct[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		return productRepository.findPublished(options);
	}

	/**
	 * Search products
	 */
	async searchProducts(
		query: string,
		options?: {
			page?: number;
			limit?: number;
			publishedOnly?: boolean;
		}
	): Promise<{
		data: IProduct[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		return productRepository.searchProducts(query, options);
	}

	/**
	 * Get products by category
	 */
	async getProductsByCategory(
		categoryId: string,
		options?: {
			page?: number;
			limit?: number;
			publishedOnly?: boolean;
		}
	): Promise<{
		data: IProduct[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		return productRepository.findByCategory(categoryId, options);
	}

	/**
	 * Get all unique treatments
	 */
	async getAllTreatments(): Promise<string[]> {
		return productRepository.getAllTreatments();
	}

	/**
	 * Get all unique certifications
	 */
	async getAllCertifications(): Promise<string[]> {
		return productRepository.getAllCertifications();
	}

	/**
	 * Get product statistics
	 */
	async getProductStats(): Promise<{
		total: number;
		published: number;
		draft: number;
		private: number;
	}> {
		return productRepository.getProductStats();
	}

	/**
	 * Get recently updated products
	 */
	async getRecentlyUpdated(limit: number = 5): Promise<IProduct[]> {
		return productRepository.getRecentlyUpdated(limit);
	}

	/**
	 * Validate product without saving (for preview)
	 */
	async previewValidation(id: string): Promise<PublishValidationError[]> {
		const product = await productRepository.findById(id);

		if (!product) {
			throw new NotFoundError("Product not found");
		}

		return this.validateForPublish(product);
	}

	/**
	 * Duplicate a product
	 */
	async duplicateProduct(id: string, userId: string): Promise<IProduct> {
		const product = await productRepository.findById(id);

		if (!product) {
			throw new NotFoundError("Product not found");
		}

		// Generate new slug
		const baseSlug = `${product.slug}-copy`;
		const newSlug = await generateUniqueSlug(baseSlug, async (s) =>
			productRepository.slugExists(s)
		);

		// Create duplicate
		const duplicateData = {
			title: `${product.title} (Copy)`,
			slug: newSlug,
			description: product.description,
			shortDescription: product.shortDescription,
			productDescription: product.productDescription,
			benefits: [...product.benefits],
			certifications: [...product.certifications],
			treatments: [...product.treatments],
			productImages: [...product.productImages],
			overviewImage: product.overviewImage,
			techSpecifications: product.techSpecifications.map((spec) => ({
				title: spec.title,
				description: spec.description,
			})),
			documentation: product.documentation.map((doc) => ({
				title: doc.title,
				url: doc.url,
			})),
			purchaseInfo: product.purchaseInfo
				? {
						title: product.purchaseInfo.title,
						description: product.purchaseInfo.description,
				  }
				: undefined,
			seo: product.seo
				? {
						title: product.seo.title,
						description: product.seo.description,
						ogImage: product.seo.ogImage,
						canonicalUrl: "", // Don't copy canonical URL
						noindex: product.seo.noindex,
				  }
				: undefined,
			categories: product.categories.map((c) => c.toString()),
			qa: product.qa.map((qa) => ({
				question: qa.question,
				answer: qa.answer,
				visible: qa.visible,
			})),
			youtubeUrl: product.youtubeUrl,
			rubric: product.rubric,
			publishType: "draft" as const,
			visibility: product.visibility,
			lastEditedBy: userId,
		};

		const duplicate = await productRepository.create(duplicateData);

		logger.info("Product duplicated", {
			originalId: id,
			duplicateId: duplicate._id,
		});

		return duplicate;
	}
}

// Export singleton instance
export const productService = new ProductService();
