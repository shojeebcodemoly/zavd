import { BaseRepository } from "./base.repository";
import {
	getBlogPostModelSync,
	type IBlogPost,
	type BlogPublishType,
} from "@/models/blog-post.model";
// Import to ensure models are registered before population
import { getBlogCategoryModelSync } from "@/models/blog-category.model";
import { getUserModelSync } from "@/models/user.model";
import { logger } from "@/lib/utils/logger";
import { DatabaseError } from "@/lib/utils/api-error";

// Register models for population - required for serverless cold starts
getBlogCategoryModelSync();
getUserModelSync();

/**
 * Helper function to parse sort string into MongoDB sort object
 */
function parseSortString(sort: string): Record<string, 1 | -1> {
	const sortObj: Record<string, 1 | -1> = {};
	const parts = sort.split(",");

	for (const part of parts) {
		const trimmed = part.trim();
		if (trimmed.startsWith("-")) {
			sortObj[trimmed.substring(1)] = -1;
		} else {
			sortObj[trimmed] = 1;
		}
	}

	return Object.keys(sortObj).length > 0 ? sortObj : { createdAt: -1 };
}

/**
 * Escape special regex characters in a string
 * This prevents search terms with special chars from breaking the query
 */
function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Blog Post Repository
 * Extends BaseRepository with blog post-specific operations
 */
class BlogPostRepository extends BaseRepository<IBlogPost> {
	constructor() {
		super(getBlogPostModelSync());
	}

	/**
	 * Find blog post by slug
	 */
	async findBySlug(slug: string): Promise<IBlogPost | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const post = await this.model.findOne({ slug }).exec();

			logger.db("findBySlug", this.modelName, Date.now() - startTime);
			return post;
		} catch (error) {
			logger.error("Error finding blog post by slug", error);
			throw new DatabaseError("Failed to find blog post");
		}
	}

	/**
	 * Find blog post by slug with populated references (for admin)
	 */
	async findBySlugWithPopulated(slug: string): Promise<IBlogPost | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const post = await this.model
				.findOne({ slug })
				.populate("categories", "name slug")
				.populate("author", "name email image")
				.exec();

			logger.db(
				"findBySlugWithPopulated",
				this.modelName,
				Date.now() - startTime
			);
			return post;
		} catch (error) {
			logger.error("Error finding blog post by slug with populated", error);
			throw new DatabaseError("Failed to find blog post");
		}
	}

	/**
	 * Find published blog post by slug (for public access)
	 */
	async findPublicBySlug(slug: string): Promise<IBlogPost | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const post = await this.model
				.findOne({
					slug,
					publishType: "publish",
				})
				.populate("categories", "name slug")
				.populate("author", "name email image")
				.exec();

			logger.db("findPublicBySlug", this.modelName, Date.now() - startTime);
			return post;
		} catch (error) {
			logger.error("Error finding public blog post by slug", error);
			throw new DatabaseError("Failed to find blog post");
		}
	}

	/**
	 * Find blog post by ID with populated references
	 */
	async findByIdWithPopulated(id: string): Promise<IBlogPost | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const post = await this.model
				.findById(id)
				.populate("categories", "name slug")
				.populate("author", "name email image")
				.exec();

			logger.db(
				"findByIdWithPopulated",
				this.modelName,
				Date.now() - startTime
			);
			return post;
		} catch (error) {
			logger.error("Error finding blog post by ID with populated", error);
			throw new DatabaseError("Failed to find blog post");
		}
	}

	/**
	 * Check if slug exists (optionally excluding a specific post)
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
	 * Find blog posts with advanced filtering
	 */
	async findWithFilters(options: {
		page?: number;
		limit?: number;
		search?: string;
		category?: string;
		tag?: string;
		author?: string;
		publishType?: BlogPublishType;
		sort?: string;
	}): Promise<{
		data: IBlogPost[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const {
				page = 1,
				limit = 10,
				search,
				category,
				tag,
				author,
				publishType,
				sort = "-createdAt",
			} = options;

			const filter: Record<string, unknown> = {};

			// Text search with escaped regex for safety
			if (search && search.trim()) {
				const searchTerm = escapeRegex(search.trim());
				filter.$or = [
					{ title: { $regex: searchTerm, $options: "i" } },
					{ excerpt: { $regex: searchTerm, $options: "i" } },
					{ content: { $regex: searchTerm, $options: "i" } },
					{ slug: { $regex: searchTerm, $options: "i" } },
					{ tags: { $regex: searchTerm, $options: "i" } },
				];
			}

			// Category filter
			if (category) {
				filter.categories = category;
			}

			// Tag filter
			if (tag) {
				filter.tags = tag;
			}

			// Author filter
			if (author) {
				filter.author = author;
			}

			// Publish type filter
			if (publishType) {
				filter.publishType = publishType;
			}

			const skip = (page - 1) * limit;
			const sortObj = parseSortString(sort);

			const [data, total] = await Promise.all([
				this.model
					.find(filter)
					.populate("categories", "name slug")
					.populate("author", "name email image")
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
			logger.error("Error finding blog posts with filters", error);
			throw new DatabaseError("Failed to find blog posts");
		}
	}

	/**
	 * Get published blog posts for frontend
	 */
	async findPublished(options: {
		page?: number;
		limit?: number;
		category?: string;
		tag?: string;
		sort?: string;
	}): Promise<{
		data: IBlogPost[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		return this.findWithFilters({
			...options,
			publishType: "publish",
		});
	}

	/**
	 * Find blog posts by category slug
	 */
	async findByCategorySlug(
		categorySlug: string,
		options?: {
			page?: number;
			limit?: number;
			publishedOnly?: boolean;
		}
	): Promise<{
		data: IBlogPost[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const { page = 1, limit = 10, publishedOnly = true } = options || {};

			// First find the category by slug
			const BlogCategoryModel = (
				await import("@/models/blog-category.model")
			).getBlogCategoryModelSync();
			const category = await BlogCategoryModel.findOne({
				slug: categorySlug,
			}).exec();

			if (!category) {
				return {
					data: [],
					total: 0,
					page,
					limit,
					totalPages: 0,
				};
			}

			const filter: Record<string, unknown> = {
				categories: category._id,
			};

			if (publishedOnly) {
				filter.publishType = "publish";
			}

			const skip = (page - 1) * limit;

			const [data, total] = await Promise.all([
				this.model
					.find(filter)
					.populate("categories", "name slug")
					.populate("author", "name email image")
					.sort({ publishedAt: -1, createdAt: -1 })
					.skip(skip)
					.limit(limit)
					.exec(),
				this.model.countDocuments(filter).exec(),
			]);

			const totalPages = Math.ceil(total / limit);

			logger.db("findByCategorySlug", this.modelName, Date.now() - startTime);

			return {
				data,
				total,
				page,
				limit,
				totalPages,
			};
		} catch (error) {
			logger.error("Error finding blog posts by category slug", error);
			throw new DatabaseError("Failed to find blog posts by category");
		}
	}

	/**
	 * Find blog posts by tag
	 */
	async findByTag(
		tag: string,
		options?: {
			page?: number;
			limit?: number;
			publishedOnly?: boolean;
		}
	): Promise<{
		data: IBlogPost[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const { page = 1, limit = 10, publishedOnly = true } = options || {};

		const filter: Record<string, unknown> = {
			tags: { $regex: new RegExp(`^${tag}$`, "i") },
		};

		if (publishedOnly) {
			filter.publishType = "publish";
		}

		return this.findPaginated(filter, page, limit, {
			publishedAt: -1,
			createdAt: -1,
		});
	}

	/**
	 * Find blog posts by author ID
	 */
	async findByAuthor(
		authorId: string,
		options?: {
			page?: number;
			limit?: number;
			publishedOnly?: boolean;
		}
	): Promise<{
		data: IBlogPost[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const { page = 1, limit = 10, publishedOnly = true } = options || {};

		const filter: Record<string, unknown> = {
			author: authorId,
		};

		if (publishedOnly) {
			filter.publishType = "publish";
		}

		return this.findPaginated(filter, page, limit, {
			publishedAt: -1,
			createdAt: -1,
		});
	}

	/**
	 * Update publish type
	 */
	async updatePublishType(
		id: string,
		publishType: BlogPublishType
	): Promise<IBlogPost | null> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const updateData: Record<string, unknown> = {
				publishType,
			};

			// Set publishedAt when publishing for the first time
			if (publishType === "publish") {
				const post = await this.model.findById(id).exec();
				if (post && !post.publishedAt) {
					updateData.publishedAt = new Date();
				}
			}

			const result = await this.model
				.findByIdAndUpdate(
					id,
					{ $set: updateData },
					{ new: true, runValidators: true }
				)
				.exec();

			logger.db("updatePublishType", this.modelName, Date.now() - startTime);
			return result;
		} catch (error) {
			logger.error("Error updating publish type", error);
			throw new DatabaseError("Failed to update publish type");
		}
	}

	/**
	 * Get all unique tags
	 */
	async getAllTags(): Promise<string[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const tags = await this.model.distinct("tags").exec();

			logger.db("getAllTags", this.modelName, Date.now() - startTime);
			return tags.filter((t) => t && t.trim());
		} catch (error) {
			logger.error("Error getting tags", error);
			throw new DatabaseError("Failed to get tags");
		}
	}

	/**
	 * Get blog post statistics
	 */
	async getBlogPostStats(): Promise<{
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

			logger.db("getBlogPostStats", this.modelName, Date.now() - startTime);

			return {
				total,
				published,
				draft,
				private: privateCount,
			};
		} catch (error) {
			logger.error("Error getting blog post stats", error);
			throw new DatabaseError("Failed to get blog post statistics");
		}
	}

	/**
	 * Get recently updated blog posts
	 */
	async getRecentlyUpdated(limit: number = 5): Promise<IBlogPost[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const posts = await this.model
				.find()
				.sort({ updatedAt: -1 })
				.limit(limit)
				.populate("author", "name email image")
				.exec();

			logger.db(
				"getRecentlyUpdated",
				this.modelName,
				Date.now() - startTime
			);
			return posts;
		} catch (error) {
			logger.error("Error getting recently updated blog posts", error);
			throw new DatabaseError("Failed to get recent blog posts");
		}
	}

	/**
	 * Remove category from all blog posts (used when deleting a category)
	 */
	async removeCategoryFromPosts(categoryId: string): Promise<number> {
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
				"removeCategoryFromPosts",
				this.modelName,
				Date.now() - startTime
			);
			return result.modifiedCount;
		} catch (error) {
			logger.error("Error removing category from blog posts", error);
			throw new DatabaseError("Failed to remove category from blog posts");
		}
	}

	/**
	 * Get related posts (same category, excluding current)
	 */
	async getRelatedPosts(
		postId: string,
		categoryIds: string[],
		limit: number = 3
	): Promise<IBlogPost[]> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const posts = await this.model
				.find({
					_id: { $ne: postId },
					categories: { $in: categoryIds },
					publishType: "publish",
				})
				.populate("categories", "name slug")
				.populate("author", "name email image")
				.sort({ publishedAt: -1 })
				.limit(limit)
				.exec();

			logger.db("getRelatedPosts", this.modelName, Date.now() - startTime);
			return posts;
		} catch (error) {
			logger.error("Error getting related posts", error);
			throw new DatabaseError("Failed to get related posts");
		}
	}

	/**
	 * Get all published posts for sitemap
	 */
	async getAllPublishedForSitemap(): Promise<
		Pick<IBlogPost, "slug" | "updatedAt">[]
	> {
		try {
			await this.ensureConnection();
			const startTime = Date.now();

			const posts = await this.model
				.find({ publishType: "publish" })
				.select("slug updatedAt")
				.sort({ publishedAt: -1 })
				.exec();

			logger.db(
				"getAllPublishedForSitemap",
				this.modelName,
				Date.now() - startTime
			);
			return posts;
		} catch (error) {
			logger.error("Error getting posts for sitemap", error);
			throw new DatabaseError("Failed to get posts for sitemap");
		}
	}
}

// Export singleton instance
export const blogPostRepository = new BlogPostRepository();
