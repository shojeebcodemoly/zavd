import { z } from "zod";

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
 * Check if a string is a valid URL (local or external)
 */
const isValidUrl = (str: string): boolean => {
	return isLocalPath(str) || isValidExternalUrl(str);
};

/**
 * Optional URL schema
 */
const optionalUrlSchema = z
	.string()
	.optional()
	.refine(
		(url) => {
			if (!url || url.trim() === "") return true;
			return isValidUrl(url);
		},
		{
			message:
				"Must be a valid local path (starting with /) or URL (http/https)",
		}
	);

/**
 * Slug validation
 */
const slugSchema = z
	.string()
	.min(1, "Slug is required")
	.max(250, "Slug cannot exceed 250 characters")
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Slug must be lowercase, alphanumeric with hyphens only"
	);

/**
 * Blog Image Schema
 */
const blogImageSchema = z.object({
	url: z.string().min(1, "Image URL is required"),
	alt: z.string().max(200).optional().default(""),
});

/**
 * Blog Header Image Schema
 */
const blogHeaderImageSchema = z.object({
	url: z.string().min(1, "Header image URL is required"),
	alt: z.string().max(200).optional().default(""),
	showTitleOverlay: z.boolean().optional().default(false),
});

/**
 * Blog SEO Schema
 */
const blogSeoSchema = z.object({
	title: z
		.string()
		.max(70, "SEO title should not exceed 70 characters")
		.optional(),
	description: z
		.string()
		.max(160, "SEO description should not exceed 160 characters")
		.optional(),
	keywords: z.array(z.string().max(50)).optional().default([]),
	ogImage: optionalUrlSchema,
	canonicalUrl: optionalUrlSchema,
	noindex: z.boolean().optional().default(false),
});

/**
 * Create Blog Post Schema (for drafts - minimal validation)
 */
export const createBlogPostSchema = z.object({
	title: z.string().min(1, "Title is required").max(200),
	slug: slugSchema.optional(),
	excerpt: z.string().max(500).optional().default(""),
	content: z.string().optional().default(""),
	featuredImage: blogImageSchema.nullable().optional(),
	headerImage: blogHeaderImageSchema.nullable().optional(),
	categories: z.array(z.string()).optional().default([]),
	tags: z.array(z.string().max(50)).optional().default([]),
	seo: blogSeoSchema.optional(),
	publishType: z.enum(["publish", "draft", "private"]).default("draft"),
});

/**
 * Update Blog Post Schema (all fields optional)
 */
export const updateBlogPostSchema = z.object({
	title: z.string().min(1).max(200).optional(),
	slug: slugSchema.optional(),
	excerpt: z.string().max(500).optional(),
	content: z.string().optional(),
	featuredImage: blogImageSchema.nullable().optional(),
	headerImage: blogHeaderImageSchema.nullable().optional(),
	categories: z.array(z.string()).optional(),
	tags: z.array(z.string().max(50)).optional(),
	seo: blogSeoSchema.optional(),
	publishType: z.enum(["publish", "draft", "private"]).optional(),
	publishedAt: z.coerce.date().optional(),
});

/**
 * Blog Post list query params
 * Note: API routes should pass undefined (not null) for missing params
 */
export const blogPostListQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
	search: z.string().optional(),
	category: z.string().optional(),
	tag: z.string().optional(),
	author: z.string().optional(),
	publishType: z.enum(["publish", "draft", "private"]).optional(),
	sort: z.string().default("-createdAt"),
});

/**
 * Update Publish Type Schema
 */
export const updatePublishTypeSchema = z.object({
	publishType: z.enum(["publish", "draft", "private"]),
});

// Type exports
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogPostListQuery = z.infer<typeof blogPostListQuerySchema>;
export type UpdatePublishTypeInput = z.infer<typeof updatePublishTypeSchema>;
