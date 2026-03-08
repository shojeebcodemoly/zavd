import { BaseRepository } from "./base.repository";
import {
	getProductModelSync,
	type IProduct,
	type PublishType,
	type Visibility,
} from "@/models/product.model";
// Import models to ensure they're registered before populate operations
import { getCategoryModelSync } from "@/models/category.model";
import { getUserModelSync } from "@/models/user.model";
import { logger } from "@/lib/utils/logger";
import { DatabaseError } from "@/lib/utils/api-error";
import { parseSortString } from "@/lib/utils/product-helpers";

// Register models for population - required for serverless cold starts
getCategoryModelSync();
getUserModelSync();

/**
 * Product Repository
 * Extends BaseRepository with product-specific operations
 */
class ProductRepository extends BaseRepository<IProduct> {
	constructor() {
		super(getProductModelSync());
	}

	/**
	 * Ensure related models are registered before populate operations
	 */
	private ensureRelatedModels(): void {
		// Ensure Category model is registered for populate operations
		getCategoryModelSync();
	}

	/**
	 * Find product by slug
	 */
	async findBySlug(slug: string): Promise<IProduct | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const product = await this.model.findOne({ slug }).exec();

			logger.db("findBySlug", this.modelName, Date.now() - startTime);
			return product;
		} catch (error) {
			logger.error("Error finding product by slug", error);
			throw new DatabaseError("Failed to find product");
		}
	}

	/**
	 * Find product by slug with populated categories (admin - no visibility filter)
	 */
	async findBySlugWithCategories(slug: string): Promise<IProduct | null> {
		try {
			await this.ensureConnection();
			this.ensureRelatedModels();
			const startTime = Date.now();

			const product = await this.model
				.findOne({ slug })
				.populate("categories", "name slug")
				.populate("primaryCategory", "name slug")
				.populate("lastEditedBy", "name email")
				.exec();

			logger.db(
				"findBySlugWithCategories",
				this.modelName,
				Date.now() - startTime
			);
			return product;
		} catch (error) {
			logger.error("Error finding product by slug with categories", error);
			throw new DatabaseError("Failed to find product");
		}
	}

	/**
	 * Find published & public product by slug (for client/public access)
	 * Only returns products that are published AND visible to public
	 */
	async findPublicBySlug(slug: string): Promise<IProduct | null> {
		try {
			await this.ensureConnection();
			this.ensureRelatedModels();
			const startTime = Date.now();

			const product = await this.model
				.findOne({
					slug,
					publishType: "publish",
					visibility: "public",
				})
				.populate("categories", "name slug")
				.populate("primaryCategory", "name slug")
				.exec();

			logger.db("findPublicBySlug", this.modelName, Date.now() - startTime);
			return product;
		} catch (error) {
			logger.error("Error finding public product by slug", error);
			throw new DatabaseError("Failed to find product");
		}
	}

	/**
	 * Find product by ID with populated references
	 */
	async findByIdWithPopulated(id: string): Promise<IProduct | null> {
		try {
			await this.ensureConnection();
			this.ensureRelatedModels();
			const startTime = Date.now();

			const product = await this.model
				.findById(id)
				.populate("categories", "name slug")
				.populate("primaryCategory", "name slug")
				.populate("lastEditedBy", "name email")
				.exec();

			logger.db(
				"findByIdWithPopulated",
				this.modelName,
				Date.now() - startTime
			);
			return product;
		} catch (error) {
			logger.error("Error finding product by ID with populated", error);
			throw new DatabaseError("Failed to find product");
		}
	}

	/**
	 * Check if slug exists (optionally excluding a specific product)
	 */
	async slugExists(slug: string, excludeId?: string): Promise<boolean> {
		try {
			await this.ensureConnection();
			const filter: Record<string, unknown> = { slug };
			if (excludeId) {
				filter._id = { $ne: excludeId };
			}
			return await this.exists(filter);
		} catch (error) {
			logger.error("Error checking slug existence", error);
			throw new DatabaseError("Failed to check slug");
		}
	}

	/**
	 * Find products with advanced filtering
	 */
	async findWithFilters(options: {
		page?: number;
		limit?: number;
		search?: string;
		category?: string;
		publishType?: PublishType;
		visibility?: Visibility;
		sort?: string;
		treatments?: string[];
		certifications?: string[];
	}): Promise<{
		data: IProduct[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		try {
			await this.ensureConnection();
			this.ensureRelatedModels();
			const startTime = Date.now();

			const {
				page = 1,
				limit = 10,
				search,
				category,
				publishType,
				visibility,
				sort = "-createdAt",
				treatments,
				certifications,
			} = options;

			const filter: Record<string, unknown> = {};

			// Text search - use regex for partial matching (more flexible than $text)
			if (search && search.trim()) {
				const searchTerm = search.trim();
				// Use case-insensitive regex search on multiple fields
				filter.$or = [
					{ title: { $regex: searchTerm, $options: "i" } },
					{ description: { $regex: searchTerm, $options: "i" } },
					{ shortDescription: { $regex: searchTerm, $options: "i" } },
					{ slug: { $regex: searchTerm, $options: "i" } },
				];
			}

			// Category filter
			if (category) {
				filter.categories = category;
			}

			// Publish type filter
			if (publishType) {
				filter.publishType = publishType;
			}

			// Visibility filter
			if (visibility) {
				filter.visibility = visibility;
			}

			// Treatments filter (any match)
			if (treatments && treatments.length > 0) {
				filter.treatments = { $in: treatments };
			}

			// Certifications filter (any match)
			if (certifications && certifications.length > 0) {
				filter.certifications = { $in: certifications };
			}

			const skip = (page - 1) * limit;
			const sortObj = parseSortString(sort);

			const [data, total] = await Promise.all([
				this.model
					.find(filter)
					.populate("categories", "name slug")
					.populate("primaryCategory", "name slug")
					.sort(sortObj)
					.skip(skip)
					.limit(limit)
					.exec(),
				this.model.countDocuments(filter).exec(),
			]);

			const totalPages = Math.ceil(total / limit);

			logger.db("findWithFilters", this.modelName, Date.now() - startTime);

			return {
				data,
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			logger.error("Error finding products with filters", error);
			throw new DatabaseError("Failed to find products");
		}
	}

	/**
	 * Get published products for frontend
	 */
	async findPublished(options: {
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
		return this.findWithFilters({
			...options,
			publishType: "publish",
			visibility: "public",
		});
	}

	/**
	 * Find products by category
	 */
	async findByCategory(
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
		const { page = 1, limit = 10, publishedOnly = true } = options || {};

		const filter: Record<string, unknown> = {
			categories: categoryId,
		};

		if (publishedOnly) {
			filter.publishType = "publish";
			filter.visibility = "public";
		}

		return this.findPaginated(filter, page, limit, { createdAt: -1 });
	}

	/**
	 * Update publish type
	 */
	async updatePublishType(
		id: string,
		publishType: PublishType,
		userId?: string
	): Promise<IProduct | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const updateData: Record<string, unknown> = {
				publishType,
				lastEditedBy: userId,
			};

			// Set publishedAt when publishing
			if (publishType === "publish") {
				updateData.publishedAt = new Date();
			}

			const product = await this.model
				.findByIdAndUpdate(
					id,
					{ $set: updateData },
					{ new: true, runValidators: true }
				)
				.exec();

			logger.db("updatePublishType", this.modelName, Date.now() - startTime);
			return product;
		} catch (error) {
			logger.error("Error updating publish type", error);
			throw new DatabaseError("Failed to update publish type");
		}
	}

	/**
	 * Get all unique treatments (tags)
	 */
	async getAllTreatments(): Promise<string[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const treatments = await this.model.distinct("treatments").exec();

			logger.db("getAllTreatments", this.modelName, Date.now() - startTime);
			return treatments.filter((t) => t && t.trim());
		} catch (error) {
			logger.error("Error getting treatments", error);
			throw new DatabaseError("Failed to get treatments");
		}
	}

	/**
	 * Get all unique certifications
	 */
	async getAllCertifications(): Promise<string[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const certifications = await this.model
				.distinct("certifications")
				.exec();

			logger.db(
				"getAllCertifications",
				this.modelName,
				Date.now() - startTime
			);
			return certifications.filter((c) => c && c.trim());
		} catch (error) {
			logger.error("Error getting certifications", error);
			throw new DatabaseError("Failed to get certifications");
		}
	}

	/**
	 * Full-text search products
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
		try {
			await this.ensureConnection();
			this.ensureRelatedModels();
			const startTime = Date.now();

			const { page = 1, limit = 10, publishedOnly = false } = options || {};

			const filter: Record<string, unknown> = {
				$text: { $search: query },
			};

			if (publishedOnly) {
				filter.publishType = "publish";
				filter.visibility = "public";
			}

			const skip = (page - 1) * limit;

			const [data, total] = await Promise.all([
				this.model
					.find(filter, { score: { $meta: "textScore" } })
					.populate("categories", "name slug")
					.populate("primaryCategory", "name slug")
					.sort({ score: { $meta: "textScore" } })
					.skip(skip)
					.limit(limit)
					.exec(),
				this.model.countDocuments(filter).exec(),
			]);

			const totalPages = Math.ceil(total / limit);

			logger.db("searchProducts", this.modelName, Date.now() - startTime);

			return {
				data,
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			logger.error("Error searching products", error);
			throw new DatabaseError("Failed to search products");
		}
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
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const [total, published, draft, privateCount] = await Promise.all([
				this.model.countDocuments().exec(),
				this.model.countDocuments({ publishType: "publish" }).exec(),
				this.model.countDocuments({ publishType: "draft" }).exec(),
				this.model.countDocuments({ publishType: "private" }).exec(),
			]);

			logger.db("getProductStats", this.modelName, Date.now() - startTime);

			return {
				total,
				published,
				draft,
				private: privateCount,
			};
		} catch (error) {
			logger.error("Error getting product stats", error);
			throw new DatabaseError("Failed to get product statistics");
		}
	}

	/**
	 * Get recently updated products
	 */
	async getRecentlyUpdated(limit: number = 5): Promise<IProduct[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const products = await this.model
				.find()
				.sort({ updatedAt: -1 })
				.limit(limit)
				.populate("lastEditedBy", "name email")
				.exec();

			logger.db(
				"getRecentlyUpdated",
				this.modelName,
				Date.now() - startTime
			);
			return products;
		} catch (error) {
			logger.error("Error getting recently updated products", error);
			throw new DatabaseError("Failed to get recent products");
		}
	}

	/**
	 * Find products without any categories (uncategorized products)
	 */
	async findUncategorized(options?: {
		page?: number;
		limit?: number;
		publishedOnly?: boolean;
	}): Promise<{
		data: IProduct[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const { page = 1, limit = 100, publishedOnly = true } = options || {};

		const filter: Record<string, unknown> = {
			$or: [
				{ categories: { $exists: false } },
				{ categories: { $size: 0 } },
				{ categories: null },
			],
		};

		if (publishedOnly) {
			filter.publishType = "publish";
			filter.visibility = "public";
		}

		return this.findPaginated(filter, page, limit, { createdAt: -1 });
	}

	/**
	 * Remove category from all products (used when deleting a category)
	 */
	async removeCategoryFromProducts(categoryId: string): Promise<number> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const result = await this.model
				.updateMany(
					{ categories: categoryId },
					{ $pull: { categories: categoryId } }
				)
				.exec();

			logger.db(
				"removeCategoryFromProducts",
				this.modelName,
				Date.now() - startTime
			);
			return result.modifiedCount;
		} catch (error) {
			logger.error("Error removing category from products", error);
			throw new DatabaseError("Failed to remove category from products");
		}
	}
}

// Export singleton instance
export const productRepository = new ProductRepository();
