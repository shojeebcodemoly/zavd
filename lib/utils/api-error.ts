import { HTTP_STATUS } from "./constants";

/**
 * Base API Error class
 */
export class ApiError extends Error {
	public statusCode: number;
	public isOperational: boolean;
	public errors?: any;

	constructor(
		message: string,
		statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
		isOperational: boolean = true,
		errors?: any
	) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.errors = errors;

		// Maintains proper stack trace for where error was thrown
		Error.captureStackTrace(this, this.constructor);
		this.name = this.constructor.name;
	}
}

/**
 * Bad Request Error - 400
 */
export class BadRequestError extends ApiError {
	constructor(message: string = "Bad Request", errors?: any) {
		super(message, HTTP_STATUS.BAD_REQUEST, true, errors);
	}
}

/**
 * Unauthorized Error - 401
 */
export class UnauthorizedError extends ApiError {
	constructor(message: string = "Unauthorized") {
		super(message, HTTP_STATUS.UNAUTHORIZED, true);
	}
}

/**
 * Forbidden Error - 403
 */
export class ForbiddenError extends ApiError {
	constructor(message: string = "Forbidden") {
		super(message, HTTP_STATUS.FORBIDDEN, true);
	}
}

/**
 * Not Found Error - 404
 */
export class NotFoundError extends ApiError {
	constructor(message: string = "Resource not found") {
		super(message, HTTP_STATUS.NOT_FOUND, true);
	}
}

/**
 * Conflict Error - 409
 */
export class ConflictError extends ApiError {
	constructor(message: string = "Resource conflict") {
		super(message, HTTP_STATUS.CONFLICT, true);
	}
}

/**
 * Validation Error - 422
 */
export class ValidationError extends ApiError {
	constructor(message: string = "Validation failed", errors?: any) {
		super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, true, errors);
	}
}

/**
 * Too Many Requests Error - 429
 */
export class TooManyRequestsError extends ApiError {
	constructor(message: string = "Too many requests") {
		super(message, HTTP_STATUS.TOO_MANY_REQUESTS, true);
	}
}

/**
 * Internal Server Error - 500
 */
export class InternalServerError extends ApiError {
	constructor(message: string = "Internal server error") {
		super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, false);
	}
}

/**
 * Database Error - 500
 */
export class DatabaseError extends ApiError {
	constructor(message: string = "Database error") {
		super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, false);
	}
}

/**
 * Check if error is an operational error
 */
export function isOperationalError(error: Error): boolean {
	if (error instanceof ApiError) {
		return error.isOperational;
	}
	return false;
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: Error | ApiError) {
	if (error instanceof ApiError) {
		return {
			success: false,
			message: error.message,
			statusCode: error.statusCode,
			...(error.errors && { errors: error.errors }),
			...(process.env.NODE_ENV === "development" && {
				stack: error.stack,
			}),
		};
	}

	// Unknown error
	return {
		success: false,
		message:
			process.env.NODE_ENV === "development"
				? error.message
				: "Internal server error",
		statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
		...(process.env.NODE_ENV === "development" && {
			stack: error.stack,
		}),
	};
}
