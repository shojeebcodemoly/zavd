import { blogPostRepository } from "@/lib/repositories/blog-post.repository";
import { blogCategoryRepository } from "@/lib/repositories/blog-category.repository";
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
	sanitizeHtml,
	isValidSlug,
	normalizeSlug,
} from "@/lib/utils/product-helpers";
import type { IBlogPost, BlogPublishType } from "@/models/blog-post.model";
import type {
	CreateBlogPostInput,
	UpdateBlogPostInput,
} from "@/lib/validations/blog-post.validation";

/**
 * Validation error structure for publish validation
 */
export interface BlogPublishValidationError {
	field: string;
	message: string;
	type: "error" | "warning";
}

/**
 * Blog Post Service
 * Handles business logic for blog post operations
 */
type CategoryInput = string | { _id?: string; id?: string; value?: string };

class BlogPostService {
	/**
	 * Validate blog post for publishing
	 */
	validateForPublish(post: IBlogPost): BlogPublishValidationError[] {
		const errors: BlogPublishValidationError[] = [];

		// Required fields (errors)
		if (!post.title?.trim()) {
			errors.push({
				field: "title",
				message: "Title is required for publishing",
				type: "error",
			});
		}

		if (!post.slug?.trim()) {
			errors.push({
				field: "slug",
				message: "Slug is required for publishing",
				type: "error",
			});
		} else if (!isValidSlug(post.slug)) {
			errors.push({
				field: "slug",
				message: "Slug must be lowercase, alphanumeric with hyphens only",
				type: "error",
			});
		}

		if (!post.content?.trim()) {
			errors.push({
				field: "content",
				message: "Content is required for publishing",
				type: "error",
			});
		}

		// Excerpt recommended but not required
		if (!post.excerpt?.trim()) {
			errors.push({
				field: "excerpt",
				message: "Excerpt is recommended for better SEO and social sharing",
				type: "warning",
			});
		}

		// Featured image recommended but not required
		if (!post.featuredImage?.url) {
			errors.push({
				field: "featuredImage",
				message: "Featured image is recommended for better visibility",
				type: "warning",
			});
		}

		// SEO warnings (not blocking, but recommended)
		if (!post.seo?.title?.trim()) {
			errors.push({
				field: "seo.title",
				message: "SEO title is recommended for better search visibility",
				type: "warning",
			});
		}

		if (!post.seo?.description?.trim()) {
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
	 * Create a new blog post (draft)
	 */
	async createPost(
		data: CreateBlogPostInput,
		authorId: string
	): Promise<IBlogPost> {
		try {
			// Generate slug if not provided, or normalize if provided
			let slug = data.slug;
			if (!slug) {
				const baseSlug = generateSlug(data.title);
				slug = await generateUniqueSlug(baseSlug, async (s) =>
					blogPostRepository.slugExists(s)
				);
			} else {
				// Normalize slug (handles special chars like ₂ → 2)
				slug = normalizeSlug(slug);
				// Check if provided slug already exists
				if (await blogPostRepository.slugExists(slug)) {
					throw new ConflictError(`Slug "${slug}" already exists`);
				}
			}

			// Validate categories exist
			if (data.categories && data.categories.length > 0) {
				const categories = data.categories as CategoryInput[];
				for (let categoryId of categories) {
					if (typeof categoryId === "object" && categoryId !== null) {
						categoryId =
							categoryId._id ?? categoryId.id ?? categoryId.value ?? "";
					}

					if (!categoryId || typeof categoryId !== "string") {
						throw new BadRequestError("Invalid category id");
					}

					const category =
						await blogCategoryRepository.findById(categoryId);
					if (!category) {
						throw new BadRequestError(
							`Blog category "${categoryId}" not found`
						);
					}
				}
			}

			// Sanitize HTML content
			const sanitizedData = {
				...data,
				slug,
				content: data.content ? sanitizeHtml(data.content) : "",
				author: authorId,
			};

			const post = await blogPostRepository.create(sanitizedData);

			logger.info("Blog post created", {
				postId: post._id,
				title: post.title,
				publishType: post.publishType,
			});

			return post;
		} catch (error) {
			logger.error("Error creating blog post", error);

			if (
				error instanceof ConflictError ||
				error instanceof BadRequestError
			) {
				throw error;
			}

			throw new DatabaseError("Failed to create blog post");
		}
	}

	/**
	 * Get blog post by ID
	 */
	async getPostById(id: string): Promise<IBlogPost> {
		const post = await blogPostRepository.findByIdWithPopulated(id);

		if (!post) {
			throw new NotFoundError("Blog post not found");
		}

		return post;
	}

	/**
	 * Get blog post by slug (admin - no publish filter)
	 */
	async getPostBySlug(slug: string): Promise<IBlogPost> {
		const post = await blogPostRepository.findBySlugWithPopulated(slug);

		if (!post) {
			throw new NotFoundError("Blog post not found");
		}

		return post;
	}

	/**
	 * Get public blog post by slug (for frontend)
	 */
	async getPublicPostBySlug(slug: string): Promise<IBlogPost> {
		const post = await blogPostRepository.findPublicBySlug(slug);

		if (!post) {
			throw new NotFoundError("Blog post not found");
		}

		return post;
	}

	/**
	 * Update a blog post
	 */
	async updatePost(id: string, data: UpdateBlogPostInput): Promise<IBlogPost> {
		try {
			const post = await blogPostRepository.findById(id);

			if (!post) {
				throw new NotFoundError("Blog post not found");
			}

			// Normalize and check slug if being changed
			let normalizedSlug = data.slug ? normalizeSlug(data.slug) : undefined;
			if (normalizedSlug && normalizedSlug !== post.slug) {
				if (await blogPostRepository.slugExists(normalizedSlug, id)) {
					throw new ConflictError(`Slug "${normalizedSlug}" already exists`);
				}
				data = { ...data, slug: normalizedSlug };
			}

			// Validate categories exist if provided
			if (data.categories && data.categories.length > 0) {
				const categories = data.categories as CategoryInput[];
				for (let categoryId of categories) {
					if (typeof categoryId === "object" && categoryId !== null) {
						categoryId =
							categoryId._id ?? categoryId.id ?? categoryId.value ?? "";
					}

					if (!categoryId || typeof categoryId !== "string") {
						throw new BadRequestError("Invalid category id");
					}

					const category =
						await blogCategoryRepository.findById(categoryId);
					if (!category) {
						throw new BadRequestError(
							`Blog category "${categoryId}" not found`
						);
					}
				}
			}

			// Sanitize HTML content if provided
			const sanitizedData: Record<string, unknown> = { ...data };
			if (data.content !== undefined) {
				sanitizedData.content = sanitizeHtml(data.content);
			}

			const updatedPost = await blogPostRepository.updateById(id, {
				$set: sanitizedData,
			});

			if (!updatedPost) {
				throw new DatabaseError("Failed to update blog post");
			}

			logger.info("Blog post updated", {
				postId: id,
				updates: Object.keys(data),
			});

			return updatedPost;
		} catch (error) {
			logger.error("Error updating blog post", error);

			if (
				error instanceof NotFoundError ||
				error instanceof ConflictError ||
				error instanceof BadRequestError
			) {
				throw error;
			}

			throw new DatabaseError("Failed to update blog post");
		}
	}

	/**
	 * Delete a blog post
	 */
	async deletePost(id: string): Promise<void> {
		const post = await blogPostRepository.findById(id);

		if (!post) {
			throw new NotFoundError("Blog post not found");
		}

		await blogPostRepository.deleteById(id);

		logger.info("Blog post deleted", { postId: id, title: post.title });
	}

	/**
	 * Publish a blog post
	 */
	async publishPost(
		id: string
	): Promise<{ post: IBlogPost; warnings: BlogPublishValidationError[] }> {
		const post = await blogPostRepository.findById(id);

		if (!post) {
			throw new NotFoundError("Blog post not found");
		}

		// Run validation
		const validationResults = this.validateForPublish(post);

		// Separate errors from warnings
		const errors = validationResults.filter((v) => v.type === "error");
		const warnings = validationResults.filter((v) => v.type === "warning");

		// If there are errors, don't allow publishing
		if (errors.length > 0) {
			const missingFields = errors.map((e) => e.field).join(", ");
			throw new ValidationError(
				`Please fill in the following required fields: ${missingFields}`,
				errors
			);
		}

		// Update publish status
		const publishedPost = await blogPostRepository.updatePublishType(
			id,
			"publish"
		);

		if (!publishedPost) {
			throw new DatabaseError("Failed to publish blog post");
		}

		logger.info("Blog post published", {
			postId: id,
			title: post.title,
			warnings: warnings.length,
		});

		return { post: publishedPost, warnings };
	}

	/**
	 * Unpublish a blog post (set to draft)
	 */
	async unpublishPost(id: string): Promise<IBlogPost> {
		const post = await blogPostRepository.updatePublishType(id, "draft");

		if (!post) {
			throw new NotFoundError("Blog post not found");
		}

		logger.info("Blog post unpublished", { postId: id });

		return post;
	}

	/**
	 * Update publish type
	 */
	async updatePublishType(
		id: string,
		publishType: BlogPublishType
	): Promise<IBlogPost> {
		if (publishType === "publish") {
			const result = await this.publishPost(id);
			return result.post;
		}

		const post = await blogPostRepository.updatePublishType(id, publishType);

		if (!post) {
			throw new NotFoundError("Blog post not found");
		}

		logger.info("Blog post publish type updated", {
			postId: id,
			publishType,
		});

		return post;
	}

	/**
	 * Get posts with filtering and pagination
	 */
	async getPosts(options: {
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
		return blogPostRepository.findWithFilters(options);
	}

	/**
	 * Get published posts for frontend
	 */
	async getPublishedPosts(options: {
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
		return blogPostRepository.findPublished(options);
	}

	/**
	 * Get posts by category slug
	 */
	async getPostsByCategorySlug(
		categorySlug: string,
		options?: { page?: number; limit?: number }
	): Promise<{
		data: IBlogPost[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		return blogPostRepository.findByCategorySlug(categorySlug, {
			...options,
			publishedOnly: true,
		});
	}

	/**
	 * Get posts by tag
	 */
	async getPostsByTag(
		tag: string,
		options?: { page?: number; limit?: number }
	): Promise<{
		data: IBlogPost[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		return blogPostRepository.findByTag(tag, {
			...options,
			publishedOnly: true,
		});
	}

	/**
	 * Get posts by author
	 */
	async getPostsByAuthor(
		authorId: string,
		options?: { page?: number; limit?: number }
	): Promise<{
		data: IBlogPost[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		return blogPostRepository.findByAuthor(authorId, {
			...options,
			publishedOnly: true,
		});
	}

	/**
	 * Get blog post statistics
	 */
	async getPostStats(): Promise<{
		total: number;
		published: number;
		draft: number;
		private: number;
	}> {
		return blogPostRepository.getBlogPostStats();
	}

	/**
	 * Get all unique tags
	 */
	async getAllTags(): Promise<string[]> {
		return blogPostRepository.getAllTags();
	}

	/**
	 * Get related posts
	 */
	async getRelatedPosts(
		postId: string,
		categoryIds: string[],
		limit: number = 3
	): Promise<IBlogPost[]> {
		return blogPostRepository.getRelatedPosts(postId, categoryIds, limit);
	}

	/**
	 * Get recently updated posts
	 */
	async getRecentlyUpdated(limit: number = 5): Promise<IBlogPost[]> {
		return blogPostRepository.getRecentlyUpdated(limit);
	}

	/**
	 * Get all published posts for sitemap
	 */
	async getAllPublishedForSitemap(): Promise<
		Pick<IBlogPost, "slug" | "updatedAt">[]
	> {
		return blogPostRepository.getAllPublishedForSitemap();
	}
}

// Export singleton instance
export const blogPostService = new BlogPostService();
