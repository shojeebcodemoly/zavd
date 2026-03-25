import sanitize from "sanitize-html";

/**
 * Validate a MongoDB ObjectId string (without importing mongoose)
 */
export function isValidObjectId(id: string): boolean {
	return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/[^\w\-]+/g, "") // Remove non-word chars (except hyphens)
		.replace(/\-\-+/g, "-") // Replace multiple hyphens with single
		.replace(/^-+/, "") // Trim hyphens from start
		.replace(/-+$/, ""); // Trim hyphens from end
}

/**
 * Generate a unique slug by appending a suffix if needed
 */
export async function generateUniqueSlug(
	baseSlug: string,
	slugExists: (slug: string) => Promise<boolean>
): Promise<string> {
	let slug = baseSlug;
	let counter = 1;

	while (await slugExists(slug)) {
		slug = `${baseSlug}-${counter}`;
		counter++;
	}

	return slug;
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(html: string): string {
	return sanitize(html, {
		allowedTags: sanitize.defaults.allowedTags.concat([
			"img",
			"h1",
			"h2",
			"h3",
			"iframe",
			"figure",
			"figcaption",
			"video",
			"source",
			"picture",
		]),
		allowedAttributes: {
			...sanitize.defaults.allowedAttributes,
			img: ["src", "alt", "title", "width", "height", "loading", "class"],
			iframe: [
				"src",
				"width",
				"height",
				"frameborder",
				"allowfullscreen",
				"allow",
			],
			video: ["src", "controls", "width", "height", "poster"],
			source: ["src", "type"],
			"*": ["class", "id", "style"],
		},
		allowedSchemes: ["http", "https", "mailto"],
	});
}

/**
 * Check if a string is a valid slug format
 */
export function isValidSlug(slug: string): boolean {
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Normalize a slug by converting special characters
 */
export function normalizeSlug(slug: string): string {
	return slug
		.toLowerCase()
		.replace(/₂/g, "2")
		.replace(/₃/g, "3")
		.replace(/₄/g, "4")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}
