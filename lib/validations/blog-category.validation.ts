import { z } from "zod";

/**
 * Slug validation
 */
const slugSchema = z
	.string()
	.min(1, "Slug is required")
	.max(120, "Slug cannot exceed 120 characters")
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Slug must be lowercase, alphanumeric with hyphens only"
	);

/**
 * Check if a string is a valid local path (starts with /)
 */
const isLocalPath = (str: string): boolean => {
	return str.startsWith("/");
};

/**
 * Check if a string is a valid external URL
 */
const isValidExternalUrl = (str: string): boolean => {
	try {
		const parsed = new URL(str);
		return ["http:", "https:"].includes(parsed.protocol);
	} catch {
		return false;
	}
};

/**
 * Optional URL/path validation - accepts local paths, external URLs, or empty
 */
const optionalUrlSchema = z
	.string()
	.nullable()
	.optional()
	.refine(
		(url) => {
			if (!url || url.trim() === "") return true;
			return isLocalPath(url) || isValidExternalUrl(url);
		},
		{
			message:
				"Must be a valid local path (starting with /) or URL (http/https)",
		}
	);

/**
 * Rich HTML description max length (15KB for rich content)
 */
const DESCRIPTION_MAX_LENGTH = 15000;

/**
 * Create Blog Category Schema
 */
export const createBlogCategorySchema = z.object({
	name: z
		.string()
		.min(1, "Category name is required")
		.max(100, "Category name cannot exceed 100 characters"),
	slug: slugSchema.optional(), // Auto-generated if not provided
	description: z
		.string()
		.max(
			DESCRIPTION_MAX_LENGTH,
			`Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters`
		)
		.optional()
		.default(""),
	parent: z.string().nullable().optional().default(null),
	image: optionalUrlSchema,
	order: z.number().int().default(0),
	isActive: z.boolean().default(true),
});

/**
 * Update Blog Category Schema
 */
export const updateBlogCategorySchema = z.object({
	name: z
		.string()
		.min(1, "Category name is required")
		.max(100, "Category name cannot exceed 100 characters")
		.optional(),
	slug: slugSchema.optional(),
	description: z
		.string()
		.max(
			DESCRIPTION_MAX_LENGTH,
			`Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters`
		)
		.optional(),
	parent: z.string().nullable().optional(),
	image: optionalUrlSchema,
	order: z.number().int().optional(),
	isActive: z.boolean().optional(),
});

/**
 * Blog Category list query params
 */
export const blogCategoryListQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(50),
	parent: z.string().nullable().optional(),
	isActive: z
		.string()
		.transform((val) => val === "true")
		.optional(),
	tree: z
		.string()
		.default("false")
		.transform((val) => val === "true"),
	search: z.string().optional(),
});

// Type exports
export type CreateBlogCategoryInput = z.infer<typeof createBlogCategorySchema>;
export type UpdateBlogCategoryInput = z.infer<typeof updateBlogCategorySchema>;
export type BlogCategoryListQuery = z.infer<typeof blogCategoryListQuerySchema>;
