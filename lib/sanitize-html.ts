/**
 * Sanitize HTML content by removing unwanted attributes
 *
 * This utility removes data-start, data-end, and other WordPress-specific attributes
 * from HTML content to ensure clean rendering.
 */

export function sanitizeHtmlContent(html: string): string {
	if (!html) return "";

	// Remove data-start and data-end attributes
	let cleaned = html.replace(/\s*data-start="[^"]*"/g, "");
	cleaned = cleaned.replace(/\s*data-end="[^"]*"/g, "");

	// Remove data-sentry attributes
	cleaned = cleaned.replace(/\s*data-sentry-[^=]*="[^"]*"/g, "");

	// Remove WordPress-specific classes that might cause issues
	cleaned = cleaned.replace(/\s*class="alignnone[^"]*"/g, "");
	cleaned = cleaned.replace(/\s*class="size-full[^"]*"/g, "");
	cleaned = cleaned.replace(/\s*wp-image-\d+/g, "");

	// Clean up any double spaces that might have been created
	cleaned = cleaned.replace(/\s{2,}/g, " ");

	// Clean up empty class attributes
	cleaned = cleaned.replace(/\s*class=""\s*/g, " ");

	return cleaned.trim();
}
