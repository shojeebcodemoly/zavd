import { categoryRepository } from "@/lib/repositories/category.repository";
import { productRepository } from "@/lib/repositories/product.repository";
import { logger } from "@/lib/utils/logger";
import {
	NotFoundError,
	DatabaseError,
	BadRequestError,
	ConflictError,
} from "@/lib/utils/api-error";
import { generateSlug, generateUniqueSlug } from "@/lib/utils/product-helpers";
import {
	validateNoParentCycle,
	getCategoryBreadcrumb,
} from "@/lib/utils/category-tree";
import type { ICategory, ICategoryTreeNode } from "@/models/category.model";
import type {
	CreateCategoryInput,
	UpdateCategoryInput,
} from "@/lib/validations/category.validation";

/**
 * Category Service
 * Handles business logic for category operations
 */
class CategoryService {
	/**
	 * Create a new category
	 */
	async createCategory(data: CreateCategoryInput): Promise<ICategory> {
		try {
			// Generate slug if not provided
			let slug = data.slug;
			if (!slug) {
				const baseSlug = generateSlug(data.name);
				slug = await generateUniqueSlug(baseSlug, async (s) =>
					categoryRepository.slugExists(s)
				);
			} else {
				// Check if provided slug already exists
				if (await categoryRepository.slugExists(slug)) {
					throw new ConflictError(`Slug "${slug}" already exists`);
				}
			}

			// Validate parent exists if provided
			if (data.parent) {
				const parentCategory = await categoryRepository.findById(
					data.parent
				);
				if (!parentCategory) {
					throw new BadRequestError("Parent category not found");
				}
			}

			const category = await categoryRepository.create({
				...data,
				slug,
				parent: data.parent || null,
			});

			logger.info("Category created", {
				categoryId: category._id,
				name: category.name,
			});

			return category;
		} catch (error) {
			logger.error("Error creating category", error);

			if (
				error instanceof ConflictError ||
				error instanceof BadRequestError
			) {
				throw error;
			}

			throw new DatabaseError("Failed to create category");
		}
	}

	/**
	 * Get category by ID
	 */
	async getCategoryById(id: string): Promise<ICategory> {
		const category = await categoryRepository.findById(id);

		if (!category) {
			throw new NotFoundError("Category not found");
		}

		return category;
	}

	/**
	 * Get category by slug
	 */
	async getCategoryBySlug(slug: string): Promise<ICategory> {
		const category = await categoryRepository.findBySlug(slug);

		if (!category) {
			throw new NotFoundError("Category not found");
		}

		return category;
	}

	/**
	 * Update a category
	 */
	async updateCategory(
		id: string,
		data: UpdateCategoryInput
	): Promise<ICategory> {
		try {
			const category = await categoryRepository.findById(id);

			if (!category) {
				throw new NotFoundError("Category not found");
			}

			// If slug is being changed, check uniqueness
			if (data.slug && data.slug !== category.slug) {
				if (await categoryRepository.slugExists(data.slug, id)) {
					throw new ConflictError(`Slug "${data.slug}" already exists`);
				}
			}

			// If parent is being changed, validate no cycle would be created
			if (
				data.parent !== undefined &&
				data.parent !== category.parent?.toString()
			) {
				await validateNoParentCycle(id, data.parent, async (catId) =>
					categoryRepository.findById(catId)
				);

				// Validate new parent exists
				if (data.parent) {
					const parentCategory = await categoryRepository.findById(
						data.parent
					);
					if (!parentCategory) {
						throw new BadRequestError("Parent category not found");
					}
				}
			}

			const updatedCategory = await categoryRepository.updateById(id, {
				$set: {
					...data,
					parent:
						data.parent === undefined
							? category.parent
							: data.parent || null,
				},
			});

			if (!updatedCategory) {
				throw new DatabaseError("Failed to update category");
			}

			logger.info("Category updated", {
				categoryId: id,
				updates: Object.keys(data),
			});

			return updatedCategory;
		} catch (error) {
			logger.error("Error updating category", error);

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

			throw new DatabaseError("Failed to update category");
		}
	}

	/**
	 * Delete a category
	 * Options: reparent children or prevent if has children
	 */
	async deleteCategory(
		id: string,
		options: { reparentChildren?: boolean } = {}
	): Promise<void> {
		try {
			const category = await categoryRepository.findById(id);

			if (!category) {
				throw new NotFoundError("Category not found");
			}

			const hasChildren = await categoryRepository.hasChildren(id);

			if (hasChildren) {
				if (options.reparentChildren) {
					// Move children to the deleted category's parent
					await categoryRepository.reparentChildren(
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

			// Remove this category from any products
			const productsUpdated =
				await productRepository.removeCategoryFromProducts(id);
			if (productsUpdated > 0) {
				logger.info("Category removed from products", {
					categoryId: id,
					productsUpdated,
				});
			}

			await categoryRepository.deleteById(id);

			logger.info("Category deleted", { categoryId: id });
		} catch (error) {
			logger.error("Error deleting category", error);

			if (
				error instanceof NotFoundError ||
				error instanceof BadRequestError
			) {
				throw error;
			}

			throw new DatabaseError("Failed to delete category");
		}
	}

	/**
	 * Get category tree
	 */
	async getCategoryTree(
		activeOnly: boolean = false
	): Promise<ICategoryTreeNode[]> {
		return categoryRepository.getTree(activeOnly);
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
				data: ICategory[];
				total: number;
				page: number;
				limit: number;
				totalPages: number;
		  }
		| ICategoryTreeNode[]
	> {
		// Return tree structure if requested
		if (options.tree) {
			return categoryRepository.getTree(options.isActive);
		}

		return categoryRepository.findWithFilters({
			page: options.page,
			limit: options.limit,
			parent: options.parent,
			isActive: options.isActive,
			search: options.search,
		});
	}

	/**
	 * Get breadcrumb for a category
	 */
	async getCategoryBreadcrumb(
		categoryId: string
	): Promise<{ id: string; name: string; slug: string }[]> {
		return getCategoryBreadcrumb(categoryId, async (id) =>
			categoryRepository.findById(id)
		);
	}

	/**
	 * Get children of a category
	 */
	async getCategoryChildren(parentId: string): Promise<ICategory[]> {
		return categoryRepository.findChildren(parentId);
	}

	/**
	 * Update category order (for drag-and-drop)
	 */
	async updateCategoryOrder(
		categoryId: string,
		newOrder: number
	): Promise<ICategory> {
		const category = await categoryRepository.updateOrder(
			categoryId,
			newOrder
		);

		if (!category) {
			throw new NotFoundError("Category not found");
		}

		return category;
	}

	/**
	 * Bulk update category orders
	 */
	async bulkUpdateOrder(
		updates: { id: string; order: number }[]
	): Promise<void> {
		await categoryRepository.bulkUpdateOrder(updates);
		logger.info("Category orders updated", { count: updates.length });
	}

	/**
	 * Toggle category active status
	 */
	async toggleCategoryActive(id: string): Promise<ICategory> {
		const category = await categoryRepository.findById(id);

		if (!category) {
			throw new NotFoundError("Category not found");
		}

		const updatedCategory = await categoryRepository.updateById(id, {
			$set: { isActive: !category.isActive },
		});

		if (!updatedCategory) {
			throw new DatabaseError("Failed to toggle category status");
		}

		logger.info("Category active status toggled", {
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
	): Promise<ICategory[]> {
		return categoryRepository.searchByName(query, limit);
	}

	/**
	 * Get active categories for public display
	 */
	async getActiveCategories(): Promise<ICategory[]> {
		return categoryRepository.findActiveCategories();
	}
}

// Export singleton instance
export const categoryService = new CategoryService();
