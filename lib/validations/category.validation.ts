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
 * Rich HTML description max length (15KB for rich content with images, tables, etc.)
 */
const DESCRIPTION_MAX_LENGTH = 15000;

/**
 * SEO Schema for categories
 */
const categorySeoSchema = z.object({
	title: z
		.string()
		.max(70, "SEO title cannot exceed 70 characters")
		.optional(),
	description: z
		.string()
		.max(200, "SEO description cannot exceed 200 characters")
		.optional(),
	ogImage: optionalUrlSchema,
	noindex: z.boolean().optional(),
});

/**
 * Create Category Schema
 */
export const createCategorySchema = z.object({
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
	parent: z.string().nullable().optional().default(null), // ObjectId string or null
	image: optionalUrlSchema,
	order: z.coerce
		.number()
		.int()
		.min(0, "Order must be 0 or greater")
		.optional()
		.default(0),
	seo: categorySeoSchema.optional(),
});

/**
 * Update Category Schema
 */
export const updateCategorySchema = z.object({
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
	parent: z.string().nullable().optional(), // ObjectId string or null
	image: optionalUrlSchema,
	order: z.coerce.number().int().min(0, "Order must be 0 or greater").optional(),
	isActive: z.boolean().optional(),
	seo: categorySeoSchema.optional(),
});

/**
 * Category list query params
 */
export const categoryListQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(50),
	parent: z.string().nullable().optional(), // Filter by parent
	isActive: z
		.string()
		.transform((val) => val === "true")
		.optional(),
	tree: z
		.string()
		.default("false")
		.transform((val) => val === "true"), // Return as tree structure
	search: z.string().optional(),
});

// Type exports
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;
