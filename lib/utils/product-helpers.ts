/**
 * Product & Category Helper Utilities
 * Slug generation, URL validation, and other helpers
 */

/**
 * Normalize special unicode characters to ASCII equivalents
 * Handles subscript/superscript numbers, special symbols, etc.
 */
function normalizeSpecialChars(text: string): string {
	const charMap: Record<string, string> = {
		// Subscript numbers
		"\u2080": "0", "\u2081": "1", "\u2082": "2", "\u2083": "3", "\u2084": "4",
		"\u2085": "5", "\u2086": "6", "\u2087": "7", "\u2088": "8", "\u2089": "9",
		// Superscript numbers
		"\u2070": "0", "\u00B9": "1", "\u00B2": "2", "\u00B3": "3", "\u2074": "4",
		"\u2075": "5", "\u2076": "6", "\u2077": "7", "\u2078": "8", "\u2079": "9",
		// Common special characters
		"\u2122": "", "\u00AE": "", "\u00A9": "", // ™ ® ©
		"\u2013": "-", "\u2014": "-", // En-dash, em-dash
		"\u2018": "", "\u2019": "", "\u201C": "", "\u201D": "", // Curly quotes
	};

	return text.replace(
		/[\u2080-\u2089\u2070\u00B9\u00B2\u00B3\u2074-\u2079\u2122\u00AE\u00A9\u2013\u2014\u2018\u2019\u201C\u201D]/g,
		(char) => charMap[char] ?? ""
	);
}

/**
 * Generate a URL-safe slug from text
 * - Normalizes unicode characters (including subscript/superscript)
 * - Converts to lowercase
 * - Replaces non-alphanumeric with hyphens
 * - Removes leading/trailing hyphens
 * - Limits to 120 characters
 */
export function generateSlug(text: string): string {
	if (!text || typeof text !== "string") {
		return "";
	}

	return normalizeSpecialChars(text)
		.normalize("NFKD") // Normalize unicode
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
		.replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
		.replace(/-+/g, "-") // Replace multiple hyphens with single
		.slice(0, 120);
}

/**
 * Validate if a string is a valid slug format
 * Normalizes special characters before validation
 */
export function isValidSlug(slug: string): boolean {
	if (!slug || typeof slug !== "string") {
		return false;
	}
	// Normalize special characters before validation
	const normalizedSlug = normalizeSpecialChars(slug).toLowerCase();
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug);
}

/**
 * Normalize a slug - converts special characters to ASCII equivalents
 */
export function normalizeSlug(slug: string): string {
	if (!slug || typeof slug !== "string") {
		return "";
	}
	return normalizeSpecialChars(slug)
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-+/g, "-");
}

/**
 * Validate if a string is a valid URL (http/https)
 */
export function isValidUrl(url: string): boolean {
	if (!url || typeof url !== "string") {
		return false;
	}
	try {
		const parsed = new URL(url);
		return ["http:", "https:"].includes(parsed.protocol);
	} catch {
		return false;
	}
}

/**
 * Validate YouTube URL format
 */
export function isValidYoutubeUrl(url: string): boolean {
	if (!url || typeof url !== "string") {
		return false;
	}
	const youtubeRegex =
		/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)[a-zA-Z0-9_-]+/;
	return youtubeRegex.test(url);
}

/**
 * Extract YouTube video ID from URL
 */
export function extractYoutubeId(url: string): string | null {
	if (!url) return null;

	const regexPatterns = [
		/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
	];

	for (const pattern of regexPatterns) {
		const match = url.match(pattern);
		if (match && match[1]) {
			return match[1];
		}
	}

	return null;
}

/**
 * Generate YouTube embed URL from video ID
 */
export function getYoutubeEmbedUrl(videoId: string): string {
	return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Sanitize HTML content (basic - use a proper library like sanitize-html in production)
 * This is a placeholder - in production, use DOMPurify or sanitize-html
 */
export function sanitizeHtml(html: string): string {
	if (!html || typeof html !== "string") {
		return "";
	}

	// Basic script tag removal - use a proper library in production
	return html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/javascript:/gi, "")
		.replace(/on\w+\s*=/gi, "");
}

/**
 * Generate unique slug by appending number if slug exists
 */
export async function generateUniqueSlug(
	baseSlug: string,
	checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
	let slug = baseSlug;
	let counter = 1;

	while (await checkExists(slug)) {
		slug = `${baseSlug}-${counter}`;
		counter++;

		// Safety limit
		if (counter > 100) {
			slug = `${baseSlug}-${Date.now()}`;
			break;
		}
	}

	return slug;
}

/**
 * Parse sort string into MongoDB sort object
 */
export function parseSortString(sortString: string): Record<string, 1 | -1> {
	const sortMap: Record<string, Record<string, 1 | -1>> = {
		createdAt: { createdAt: 1 },
		"-createdAt": { createdAt: -1 },
		title: { title: 1 },
		"-title": { title: -1 },
		publishedAt: { publishedAt: 1 },
		"-publishedAt": { publishedAt: -1 },
		name: { name: 1 },
		"-name": { name: -1 },
		order: { order: 1 },
		"-order": { order: -1 },
	};

	return sortMap[sortString] || { createdAt: -1 };
}

/**
 * Build category path string from array of category names
 */
export function buildCategoryPath(names: string[]): string {
	return names.join(" / ");
}

/**
 * Calculate reading time for HTML content
 */
export function calculateReadingTime(html: string): number {
	if (!html) return 0;

	// Strip HTML tags
	const text = html.replace(/<[^>]*>/g, "");
	// Count words
	const words = text.trim().split(/\s+/).length;
	// Average reading speed: 200 words per minute
	return Math.ceil(words / 200);
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
	if (!text || text.length <= maxLength) return text;
	return text.slice(0, maxLength).trim() + "...";
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
	if (!html) return "";
	return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
	const d = new Date(date);
	return d.toLocaleDateString("sv-SE", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

/**
 * Check if ObjectId string is valid
 */
export function isValidObjectId(id: string): boolean {
	return /^[0-9a-fA-F]{24}$/.test(id);
}
