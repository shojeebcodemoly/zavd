import { blogCategoryRepository } from "@/lib/repositories/blog-category.repository";
import { blogPostRepository } from "@/lib/repositories/blog-post.repository";
import { logger } from "@/lib/utils/logger";
import {
	NotFoundError,
	DatabaseError,
	BadRequestError,
	ConflictError,
} from "@/lib/utils/api-error";
import { generateSlug, generateUniqueSlug } from "@/lib/utils/product-helpers";
import { validateNoBlogCategoryParentCycle } from "@/lib/utils/blog-category-tree";
import type {
	IBlogCategory,
	IBlogCategoryTreeNode,
} from "@/models/blog-category.model";
import type {
	CreateBlogCategoryInput,
	UpdateBlogCategoryInput,
} from "@/lib/validations/blog-category.validation";

/**
 * Blog Category Service
 * Handles business logic for blog category operations
 */
class BlogCategoryService {
	/**
	 * Create a new blog category
	 */
	async createCategory(data: CreateBlogCategoryInput): Promise<IBlogCategory> {
		try {
			// Generate slug if not provided
			let slug = data.slug;
			if (!slug) {
				const baseSlug = generateSlug(data.name);
				slug = await generateUniqueSlug(baseSlug, async (s) =>
					blogCategoryRepository.slugExists(s)
				);
			} else {
				// Check if provided slug already exists
				if (await blogCategoryRepository.slugExists(slug)) {
					throw new ConflictError(`Slug "${slug}" already exists`);
				}
			}

			// Validate parent exists if provided
			if (data.parent) {
				const parentCategory = await blogCategoryRepository.findById(
					data.parent
				);
				if (!parentCategory) {
					throw new BadRequestError("Parent category not found");
				}
			}

			const category = await blogCategoryRepository.create({
				...data,
				slug,
				parent: data.parent || null,
			});

			logger.info("Blog category created", {
				categoryId: category._id,
				name: category.name,
			});

			return category;
		} catch (error) {
			logger.error("Error creating blog category", error);

			if (
				error instanceof ConflictError ||
				error instanceof BadRequestError
			) {
				throw error;
			}

			throw new DatabaseError("Failed to create blog category");
		}
	}

	/**
	 * Get blog category by ID
	 */
	async getCategoryById(id: string): Promise<IBlogCategory> {
		const category = await blogCategoryRepository.findById(id);

		if (!category) {
			throw new NotFoundError("Blog category not found");
		}

		return category;
	}

	/**
	 * Get blog category by slug
	 */
	async getCategoryBySlug(slug: string): Promise<IBlogCategory> {
		const category = await blogCategoryRepository.findBySlug(slug);

		if (!category) {
			throw new NotFoundError("Blog category not found");
		}

		return category;
	}

	/**
	 * Update a blog category
	 */
	async updateCategory(
		id: string,
		data: UpdateBlogCategoryInput
	): Promise<IBlogCategory> {
		try {
			const category = await blogCategoryRepository.findById(id);

			if (!category) {
				throw new NotFoundError("Blog category not found");
			}

			// If slug is being changed, check uniqueness
			if (data.slug && data.slug !== category.slug) {
				if (await blogCategoryRepository.slugExists(data.slug, id)) {
					throw new ConflictError(`Slug "${data.slug}" already exists`);
				}
			}

			// If parent is being changed, validate no cycle would be created
			if (
				data.parent !== undefined &&
				data.parent !== category.parent?.toString()
			) {
				await validateNoBlogCategoryParentCycle(id, data.parent, async (catId) =>
					blogCategoryRepository.findById(catId)
				);

				// Validate new parent exists
				if (data.parent) {
					const parentCategory = await blogCategoryRepository.findById(
						data.parent
					);
					if (!parentCategory) {
						throw new BadRequestError("Parent category not found");
					}
				}
			}

			const updatedCategory = await blogCategoryRepository.updateById(id, {
				$set: {
					...data,
					parent:
						data.parent === undefined
							? category.parent
							: data.parent || null,
				},
			});

			if (!updatedCategory) {
				throw new DatabaseError("Failed to update blog category");
			}

			logger.info("Blog category updated", {
				categoryId: id,
				updates: Object.keys(data),
			});

			return updatedCategory;
		} catch (error) {
			logger.error("Error updating blog category", error);

			if (
				error instanceof NotFoundError ||
				error instanceof ConflictError ||
				error instanceof BadRequestError
			) {
				throw error;
			}

			if (error instanceof Error && error.message.includes("circular")) {
				throw new BadRequestError(error.message);
			}

			throw new DatabaseError("Failed to update blog category");
		}
	}

	/**
	 * Delete a blog category
	 */
	async deleteCategory(
		id: string,
		options: { reparentChildren?: boolean } = {}
	): Promise<void> {
		try {
			const category = await blogCategoryRepository.findById(id);

			if (!category) {
				throw new NotFoundError("Blog category not found");
			}

			const hasChildren = await blogCategoryRepository.hasChildren(id);

			if (hasChildren) {
				if (options.reparentChildren) {
					await blogCategoryRepository.reparentChildren(
						id,
						category.parent?.toString() || null
					);
					logger.info("Children reparented", {
						categoryId: id,
						newParent: category.parent || "root",
					});
				} else {
					throw new BadRequestError(
						"Cannot delete category with children. Delete children first or use reparent option."
					);
				}
			}

			// Remove this category from any blog posts
			const postsUpdated =
				await blogPostRepository.removeCategoryFromPosts(id);
			if (postsUpdated > 0) {
				logger.info("Blog category removed from posts", {
					categoryId: id,
					postsUpdated,
				});
			}

			await blogCategoryRepository.deleteById(id);

			logger.info("Blog category deleted", { categoryId: id });
		} catch (error) {
			logger.error("Error deleting blog category", error);

			if (
				error instanceof NotFoundError ||
				error instanceof BadRequestError
			) {
				throw error;
			}

			throw new DatabaseError("Failed to delete blog category");
		}
	}

	/**
	 * Get category tree
	 */
	async getCategoryTree(
		activeOnly: boolean = false
	): Promise<IBlogCategoryTreeNode[]> {
		return blogCategoryRepository.getTree(activeOnly);
	}

	/**
	 * Get categories with filtering and pagination
	 */
	async getCategories(options: {
		page?: number;
		limit?: number;
		parent?: string | null;
		isActive?: boolean;
		search?: string;
		tree?: boolean;
	}): Promise<
		| {
				data: IBlogCategory[];
				total: number;
				page: number;
				limit: number;
				totalPages: number;
		  }
		| IBlogCategoryTreeNode[]
	> {
		if (options.tree) {
			return blogCategoryRepository.getTree(options.isActive);
		}

		return blogCategoryRepository.findWithFilters({
			page: options.page,
			limit: options.limit,
			parent: options.parent,
			isActive: options.isActive,
			search: options.search,
		});
	}

	/**
	 * Get children of a category
	 */
	async getCategoryChildren(parentId: string): Promise<IBlogCategory[]> {
		return blogCategoryRepository.findChildren(parentId);
	}

	/**
	 * Update category order
	 */
	async updateCategoryOrder(
		categoryId: string,
		newOrder: number
	): Promise<IBlogCategory> {
		const category = await blogCategoryRepository.updateOrder(
			categoryId,
			newOrder
		);

		if (!category) {
			throw new NotFoundError("Blog category not found");
		}

		return category;
	}

	/**
	 * Bulk update category orders
	 */
	async bulkUpdateOrder(
		updates: { id: string; order: number }[]
	): Promise<void> {
		await blogCategoryRepository.bulkUpdateOrder(updates);
		logger.info("Blog category orders updated", { count: updates.length });
	}

	/**
	 * Toggle category active status
	 */
	async toggleCategoryActive(id: string): Promise<IBlogCategory> {
		const category = await blogCategoryRepository.findById(id);

		if (!category) {
			throw new NotFoundError("Blog category not found");
		}

		const updatedCategory = await blogCategoryRepository.updateById(id, {
			$set: { isActive: !category.isActive },
		});

		if (!updatedCategory) {
			throw new DatabaseError("Failed to toggle blog category status");
		}

		logger.info("Blog category active status toggled", {
			categoryId: id,
			isActive: updatedCategory.isActive,
		});

		return updatedCategory;
	}

	/**
	 * Search categories by name
	 */
	async searchCategories(
		query: string,
		limit: number = 10
	): Promise<IBlogCategory[]> {
		return blogCategoryRepository.searchByName(query, limit);
	}

	/**
	 * Get active categories for public display
	 */
	async getActiveCategories(): Promise<IBlogCategory[]> {
		return blogCategoryRepository.findActiveCategories();
	}
}

// Export singleton instance
export const blogCategoryService = new BlogCategoryService();
