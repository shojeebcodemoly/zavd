import { z } from "zod";

/**
 * Media/Image Validation Schemas
 * Reusable validation schemas for image and media handling
 */

/**
 * Check if a string is a valid local path (starts with /)
 */
export const isLocalPath = (str: string): boolean => {
	return str.startsWith("/");
};

/**
 * Check if a string is a valid external URL
 */
export const isValidExternalUrl = (str: string): boolean => {
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
export const isValidUrl = (str: string): boolean => {
	if (!str || str.trim() === "") return false;
	return isLocalPath(str) || isValidExternalUrl(str);
};

/**
 * Single image URL schema - required
 */
export const imageUrlSchema = z.string().refine(isValidUrl, {
	message: "Must be a valid image path (local or URL)",
});

/**
 * Single image URL schema - optional
 */
export const optionalImageUrlSchema = z
	.string()
	.nullable()
	.optional()
	.refine(
		(url) => {
			if (!url || url.trim() === "") return true;
			return isValidUrl(url);
		},
		{ message: "Must be a valid image path (local or URL)" }
	);

/**
 * Image array schema options
 */
interface ImageArrayOptions {
	/** Minimum number of images required */
	min?: number;
	/** Maximum number of images allowed */
	max?: number;
	/** Custom error messages */
	messages?: {
		min?: string;
		max?: string;
		invalidUrl?: string;
	};
}

/**
 * Create a validated image array schema with configurable limits
 */
export function createImageArraySchema(options: ImageArrayOptions = {}) {
	const { min, max, messages = {} } = options;

	// Start with base array schema
	let arraySchema = z.array(
		z.string().refine(isValidUrl, {
			message: messages.invalidUrl || "Invalid image URL",
		})
	);

	// Add minimum validation
	if (min !== undefined && min > 0) {
		arraySchema = arraySchema.min(
			min,
			messages.min || `At least ${min} image${min > 1 ? "s" : ""} required`
		);
	}

	// Add maximum validation
	if (max !== undefined) {
		arraySchema = arraySchema.max(
			max,
			messages.max || `Maximum ${max} image${max > 1 ? "s" : ""} allowed`
		);
	}

	return arraySchema.default([]);
}

/**
 * Optional image array schema (can be empty)
 */
export const imageArraySchema = createImageArraySchema();

/**
 * Required image array schema (at least 1 image)
 */
export const requiredImageArraySchema = createImageArraySchema({
	min: 1,
	messages: {
		min: "At least one image is required",
	},
});

/**
 * Product images schema (at least 1, max 10)
 */
export const productImagesSchema = createImageArraySchema({
	min: 1,
	max: 10,
	messages: {
		min: "At least one product image is required",
		max: "Maximum 10 product images allowed",
	},
});

/**
 * Gallery images schema (max 20)
 */
export const galleryImagesSchema = createImageArraySchema({
	max: 20,
	messages: {
		max: "Maximum 20 gallery images allowed",
	},
});

/**
 * Validate an array of image URLs
 * Returns validation result with detailed errors per URL
 */
export function validateImageUrls(
	urls: string[],
	options: ImageArrayOptions = {}
): {
	valid: boolean;
	errors: string[];
	invalidUrls: { index: number; url: string; error: string }[];
} {
	const errors: string[] = [];
	const invalidUrls: { index: number; url: string; error: string }[] = [];

	// Check minimum
	if (options.min !== undefined && urls.length < options.min) {
		errors.push(
			options.messages?.min ||
				`At least ${options.min} image${options.min > 1 ? "s" : ""} required`
		);
	}

	// Check maximum
	if (options.max !== undefined && urls.length > options.max) {
		errors.push(
			options.messages?.max ||
				`Maximum ${options.max} image${options.max > 1 ? "s" : ""} allowed`
		);
	}

	// Validate each URL
	urls.forEach((url, index) => {
		if (!isValidUrl(url)) {
			invalidUrls.push({
				index,
				url,
				error: "Invalid URL format",
			});
		}
	});

	if (invalidUrls.length > 0) {
		errors.push(`${invalidUrls.length} invalid image URL(s)`);
	}

	return {
		valid: errors.length === 0,
		errors,
		invalidUrls,
	};
}

/**
 * Remove duplicate URLs from an array while preserving order
 */
export function deduplicateUrls(urls: string[]): string[] {
	return [...new Set(urls)];
}

/**
 * Reorder URLs by moving an item from one index to another
 */
export function reorderUrls(
	urls: string[],
	fromIndex: number,
	toIndex: number
): string[] {
	if (
		fromIndex < 0 ||
		fromIndex >= urls.length ||
		toIndex < 0 ||
		toIndex >= urls.length
	) {
		return urls;
	}

	const result = [...urls];
	const [item] = result.splice(fromIndex, 1);
	result.splice(toIndex, 0, item);
	return result;
}

// Type exports
export type ImageUrl = z.infer<typeof imageUrlSchema>;
export type OptionalImageUrl = z.infer<typeof optionalImageUrlSchema>;
export type ImageArray = z.infer<typeof imageArraySchema>;
