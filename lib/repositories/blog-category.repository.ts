import { Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import {
	getBlogCategoryModelSync,
	type IBlogCategory,
	type IBlogCategoryTreeNode,
} from "@/models/blog-category.model";
import { buildBlogCategoryTree } from "@/lib/utils/blog-category-tree";
import { logger } from "@/lib/utils/logger";
import { DatabaseError } from "@/lib/utils/api-error";

/**
 * Blog Category Repository
 * Extends BaseRepository with blog category-specific operations
 */
class BlogCategoryRepository extends BaseRepository<IBlogCategory> {
	constructor() {
		super(getBlogCategoryModelSync());
	}

	/**
	 * Find blog category by slug
	 */
	async findBySlug(slug: string): Promise<IBlogCategory | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const category = await this.model.findOne({ slug }).exec();

			logger.db("findBySlug", this.modelName, Date.now() - startTime);
			return category;
		} catch (error) {
			logger.error("Error finding blog category by slug", error);
			throw new DatabaseError("Failed to find blog category");
		}
	}

	/**
	 * Check if slug exists (optionally excluding a specific category)
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
	 * Get all root categories (parent = null)
	 */
	async findRootCategories(): Promise<IBlogCategory[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const categories = await this.model
				.find({ parent: null })
				.sort({ order: 1, name: 1 })
				.exec();

			logger.db(
				"findRootCategories",
				this.modelName,
				Date.now() - startTime
			);
			return categories;
		} catch (error) {
			logger.error("Error finding root blog categories", error);
			throw new DatabaseError("Failed to find root blog categories");
		}
	}

	/**
	 * Get children of a category
	 */
	async findChildren(parentId: string): Promise<IBlogCategory[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const categories = await this.model
				.find({ parent: parentId })
				.sort({ order: 1, name: 1 })
				.exec();

			logger.db("findChildren", this.modelName, Date.now() - startTime);
			return categories;
		} catch (error) {
			logger.error("Error finding child blog categories", error);
			throw new DatabaseError("Failed to find child blog categories");
		}
	}

	/**
	 * Check if category has children
	 */
	async hasChildren(categoryId: string): Promise<boolean> {
		try {
			await this.ensureConnection();
			return await this.exists({ parent: categoryId });
		} catch (error) {
			logger.error("Error checking for children", error);
			throw new DatabaseError("Failed to check for children");
		}
	}

	/**
	 * Get full category tree
	 */
	async getTree(activeOnly: boolean = false): Promise<IBlogCategoryTreeNode[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const filter: Record<string, unknown> = {};
			if (activeOnly) {
				filter.isActive = true;
			}

			const categories = await this.model
				.find(filter)
				.sort({ order: 1, name: 1 })
				.exec();

			const tree = buildBlogCategoryTree(categories, null, 0, "");

			logger.db("getTree", this.modelName, Date.now() - startTime);
			return tree;
		} catch (error) {
			logger.error("Error building blog category tree", error);
			throw new DatabaseError("Failed to build blog category tree");
		}
	}

	/**
	 * Get categories with pagination and optional filtering
	 */
	async findWithFilters(options: {
		page?: number;
		limit?: number;
		parent?: string | null;
		isActive?: boolean;
		search?: string;
	}): Promise<{
		data: IBlogCategory[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const { page = 1, limit = 50, parent, isActive, search } = options;

			const filter: Record<string, unknown> = {};

			if (parent !== undefined) {
				filter.parent =
					parent === "null" || parent === null ? null : parent;
			}

			if (isActive !== undefined) {
				filter.isActive = isActive;
			}

			if (search) {
				filter.name = { $regex: search, $options: "i" };
			}

			const skip = (page - 1) * limit;

			const [data, total] = await Promise.all([
				this.model
					.find(filter)
					.sort({ order: 1, name: 1 })
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
			logger.error("Error finding blog categories with filters", error);
			throw new DatabaseError("Failed to find blog categories");
		}
	}

	/**
	 * Update category order
	 */
	async updateOrder(
		categoryId: string,
		newOrder: number
	): Promise<IBlogCategory | null> {
		return this.updateById(categoryId, { $set: { order: newOrder } });
	}

	/**
	 * Bulk update category orders
	 */
	async bulkUpdateOrder(
		updates: { id: string; order: number }[]
	): Promise<void> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const bulkOps = updates.map((update) => ({
				updateOne: {
					filter: { _id: new Types.ObjectId(update.id) },
					update: { $set: { order: update.order } },
				},
			}));

			await this.model.bulkWrite(bulkOps);

			logger.db("bulkUpdateOrder", this.modelName, Date.now() - startTime);
		} catch (error) {
			logger.error("Error bulk updating blog category orders", error);
			throw new DatabaseError("Failed to update blog category orders");
		}
	}

	/**
	 * Move children to a new parent
	 */
	async reparentChildren(
		oldParentId: string,
		newParentId: string | null
	): Promise<number> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const result = await this.model
				.updateMany(
					{ parent: oldParentId },
					{ $set: { parent: newParentId } }
				)
				.exec();

			logger.db("reparentChildren", this.modelName, Date.now() - startTime);
			return result.modifiedCount;
		} catch (error) {
			logger.error("Error reparenting children", error);
			throw new DatabaseError("Failed to reparent children");
		}
	}

	/**
	 * Get category by ID for cycle prevention checks
	 */
	async getCategoryForCycleCheck(id: string): Promise<IBlogCategory | null> {
		return this.findById(id);
	}

	/**
	 * Get active categories for frontend display
	 */
	async findActiveCategories(): Promise<IBlogCategory[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const categories = await this.model
				.find({ isActive: true })
				.sort({ order: 1, name: 1 })
				.exec();

			logger.db(
				"findActiveCategories",
				this.modelName,
				Date.now() - startTime
			);
			return categories;
		} catch (error) {
			logger.error("Error finding active blog categories", error);
			throw new DatabaseError("Failed to find active blog categories");
		}
	}

	/**
	 * Search categories by name
	 */
	async searchByName(
		query: string,
		limit: number = 10
	): Promise<IBlogCategory[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const categories = await this.model
				.find({
					name: { $regex: query, $options: "i" },
				})
				.limit(limit)
				.sort({ name: 1 })
				.exec();

			logger.db("searchByName", this.modelName, Date.now() - startTime);
			return categories;
		} catch (error) {
			logger.error("Error searching blog categories", error);
			throw new DatabaseError("Failed to search blog categories");
		}
	}
}

// Export singleton instance
export const blogCategoryRepository = new BlogCategoryRepository();
