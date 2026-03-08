import { NextResponse } from "next/server";
import { HTTP_STATUS } from "./constants";

/**
 * Formatted validation error for user-friendly display
 * Includes both the original path (for form field mapping) and
 * the formatted field name (for user display)
 */
export interface FormattedValidationError {
	field: string; // User-friendly label (e.g., "Före/efter-bilder #1 → Före-bild")
	message: string; // Error message
	path: (string | number)[]; // Original path array for form field mapping (e.g., ["techSpecifications", 0, "title"])
}

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	meta?: {
		page?: number;
		limit?: number;
		total?: number;
		totalPages?: number;
	};
	errors?: FormattedValidationError[];
}

/**
 * Field name mappings for Swedish/user-friendly display
 */
const FIELD_LABELS: Record<string, string> = {
	title: "Titel",
	slug: "URL-slug",
	description: "Beskrivning",
	shortDescription: "Kort beskrivning",
	productDescription: "Produktbeskrivning",
	benefits: "Fördelar",
	certifications: "Certifieringar",
	treatments: "Behandlingar",
	productImages: "Produktbilder",
	overviewImage: "Översiktsbild",
	techSpecifications: "Tekniska specifikationer",
	documentation: "Dokumentation",
	purchaseInfo: "Köpinformation",
	seo: "SEO",
	categories: "Kategorier",
	qa: "Frågor & Svar",
	question: "Fråga",
	answer: "Svar",
	youtubeUrl: "YouTube URL",
	rubric: "Rubrik",
	publishType: "Publiceringstyp",
	visibility: "Synlighet",
	url: "URL",
};

/**
 * Get user-friendly field label
 */
function getFieldLabel(path: (string | number)[]): string {
	// Build a readable field path
	const parts: string[] = [];

	for (let i = 0; i < path.length; i++) {
		const segment = path[i];

		if (typeof segment === "number") {
			// It's an array index, add to the previous label
			parts[parts.length - 1] += ` #${segment + 1}`;
		} else {
			const label = FIELD_LABELS[segment] || segment;
			parts.push(label);
		}
	}

	return parts.join(" → ");
}

/**
 * Zod issue structure (simplified type to avoid deprecation warnings)
 */
interface ZodValidationIssue {
	path: (string | number)[];
	message: string;
	code?: string;
}

/**
 * Format Zod validation errors into user-friendly format
 */
export function formatZodErrors(issues: ZodValidationIssue[]): FormattedValidationError[] {
	return issues.map((issue) => ({
		field: getFieldLabel(issue.path),
		message: issue.message,
		path: issue.path, // Keep original array for form field mapping
	}));
}

/**
 * Create a summary message from validation errors
 */
export function createValidationSummary(errors: FormattedValidationError[]): string {
	if (errors.length === 0) return "Validation failed";
	if (errors.length === 1) return `Valideringsfel: ${errors[0].field}`;
	return `${errors.length} valideringsfel hittades`;
}

/**
 * Create a success response
 */
export function successResponse<T>(
	data?: T,
	message: string = "Success",
	statusCode: number = HTTP_STATUS.OK,
	meta?: ApiResponse["meta"]
): NextResponse<ApiResponse<T>> {
	const response: ApiResponse<T> = {
		success: true,
		message,
		...(data !== undefined && { data }),
		...(meta && { meta }),
	};

	return NextResponse.json(response, { status: statusCode });
}

/**
 * Create an error response
 */
export function errorResponse(
	message: string = "Error",
	statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
	errors?: any
): NextResponse<ApiResponse> {
	const response: ApiResponse = {
		success: false,
		message,
		...(errors && { errors }),
	};

	return NextResponse.json(response, { status: statusCode });
}

/**
 * Create a created response (201)
 */
export function createdResponse<T>(
	data?: T,
	message: string = "Created successfully"
): NextResponse<ApiResponse<T>> {
	return successResponse(data, message, HTTP_STATUS.CREATED);
}

/**
 * Create a no content response (204)
 */
export function noContentResponse(): NextResponse {
	return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
}

/**
 * Create a bad request response (400)
 * Automatically formats Zod validation errors if provided
 */
export function badRequestResponse(
	message: string = "Bad request",
	errors?: ZodValidationIssue[] | FormattedValidationError[] | unknown
): NextResponse<ApiResponse> {
	let formattedErrors: FormattedValidationError[] | undefined;
	let summaryMessage = message;

	// Check if errors are validation issues
	if (Array.isArray(errors) && errors.length > 0) {
		const firstError = errors[0];
		if (firstError && typeof firstError === "object") {
			// Check if already formatted (has 'field' property with formatted label)
			if ("field" in firstError && typeof firstError.field === "string") {
				// Already formatted errors - use as-is
				formattedErrors = errors as FormattedValidationError[];
				summaryMessage = createValidationSummary(formattedErrors);
			} else if (
				"path" in firstError &&
				Array.isArray(firstError.path) &&
				"message" in firstError
			) {
				// Raw Zod errors - format them
				formattedErrors = formatZodErrors(errors as ZodValidationIssue[]);
				summaryMessage = createValidationSummary(formattedErrors);
			}
		}
	}

	return errorResponse(summaryMessage, HTTP_STATUS.BAD_REQUEST, formattedErrors);
}

/**
 * Create an unauthorized response (401)
 */
export function unauthorizedResponse(
	message: string = "Unauthorized"
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.UNAUTHORIZED);
}

/**
 * Create a forbidden response (403)
 */
export function forbiddenResponse(
	message: string = "Forbidden"
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.FORBIDDEN);
}

/**
 * Create a not found response (404)
 */
export function notFoundResponse(
	message: string = "Resource not found"
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.NOT_FOUND);
}

/**
 * Create a conflict response (409)
 */
export function conflictResponse(
	message: string = "Resource conflict"
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.CONFLICT);
}

/**
 * Create a validation error response (422)
 */
export function validationErrorResponse(
	message: string = "Validation failed",
	errors?: any
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
}

/**
 * Create an internal server error response (500)
 */
export function internalServerErrorResponse(
	message: string = "Internal server error"
): NextResponse<ApiResponse> {
	return errorResponse(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
	data: T[],
	page: number,
	limit: number,
	total: number,
	message: string = "Success"
): NextResponse<ApiResponse<T[]>> {
	const totalPages = Math.ceil(total / limit);

	return successResponse(
		data,
		message,
		HTTP_STATUS.OK,
		{
			page,
			limit,
			total,
			totalPages,
		}
	);
}
