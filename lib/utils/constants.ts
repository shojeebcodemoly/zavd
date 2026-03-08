/**
 * Application-wide constants
 */

// HTTP Status Codes
export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	UNPROCESSABLE_ENTITY: 422,
	TOO_MANY_REQUESTS: 429,
	INTERNAL_SERVER_ERROR: 500,
	SERVICE_UNAVAILABLE: 503,
} as const;

// API Response Messages
export const API_MESSAGES = {
	// Success messages
	SUCCESS: "Operation successful",
	CREATED: "Resource created successfully",
	UPDATED: "Resource updated successfully",
	DELETED: "Resource deleted successfully",

	// Auth messages
	LOGIN_SUCCESS: "Login successful",
	LOGOUT_SUCCESS: "Logout successful",
	REGISTER_SUCCESS: "Registration successful",
	UNAUTHORIZED: "Unauthorized access",
	INVALID_CREDENTIALS: "Invalid email or password",
	EMAIL_ALREADY_EXISTS: "Email already exists",
	USER_NOT_FOUND: "User not found",
	SESSION_EXPIRED: "Session expired",

	// Error messages
	INTERNAL_ERROR: "Internal server error",
	INVALID_REQUEST: "Invalid request",
	VALIDATION_ERROR: "Validation error",
	NOT_FOUND: "Resource not found",
	DATABASE_ERROR: "Database error",

	// Profile messages
	PROFILE_UPDATED: "Profile updated successfully",
	PROFILE_NOT_FOUND: "Profile not found",
	AVATAR_UPLOADED: "Avatar uploaded successfully",
} as const;

// Session Configuration
export const SESSION_CONFIG = {
	EXPIRES_IN: 60 * 60 * 24 * 7, // 7 days in seconds
	UPDATE_AGE: 60 * 60 * 24, // 24 hours
	COOKIE_MAX_AGE: 60 * 5, // 5 minutes
} as const;

// Password Configuration
export const PASSWORD_CONFIG = {
	MIN_LENGTH: 8,
	MAX_LENGTH: 128,
	REQUIRE_UPPERCASE: true,
	REQUIRE_LOWERCASE: true,
	REQUIRE_NUMBERS: true,
	REQUIRE_SPECIAL_CHARS: true,
} as const;

// Pagination
export const PAGINATION = {
	DEFAULT_PAGE: 1,
	DEFAULT_LIMIT: 10,
	MAX_LIMIT: 100,
} as const;

// File Upload
export const FILE_UPLOAD = {
	MAX_SIZE: 5 * 1024 * 1024, // 5MB
	ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
	ALLOWED_DOCUMENT_TYPES: ["application/pdf", "application/msword"],
} as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
	EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	PHONE: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
	PASSWORD:
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
	URL: /^https?:\/\/.+/,
	SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// Date Formats
export const DATE_FORMATS = {
	ISO: "yyyy-MM-dd",
	DISPLAY: "MMM dd, yyyy",
	FULL: "MMMM dd, yyyy HH:mm",
} as const;

// API Routes
export const API_ROUTES = {
	AUTH: {
		BASE: "/api/auth",
		LOGIN: "/api/auth/sign-in",
		REGISTER: "/api/auth/sign-up",
		LOGOUT: "/api/auth/sign-out",
		SESSION: "/api/auth/get-session",
	},
	USER: {
		ME: "/api/user/me",
		PROFILE: "/api/user/profile",
		AVATAR: "/api/user/profile/avatar",
	},
	PRODUCTS: {
		BASE: "/api/products",
		STATS: "/api/products/stats",
		SEARCH: "/api/products/search",
		TAGS: "/api/products/tags",
	},
	CATEGORIES: {
		BASE: "/api/categories",
		TREE: "/api/categories/tree",
	},
	STORAGE: {
		UPLOAD: "/api/storage/upload",
		DELETE: "/api/storage/delete",
		LIST: "/api/storage/list",
	},
	HEALTH: "/api/health",
} as const;

// App Routes (Frontend)
export const APP_ROUTES = {
	HOME: "/",
	LOGIN: "/login",
	REGISTER: "/register",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",
	DASHBOARD: "/dashboard",
	PROFILE: "/dashboard/profile",
	PRODUCTS: "/dashboard/products",
	PRODUCTS_NEW: "/dashboard/products/new",
	CATEGORIES: "/dashboard/categories",
	CATEGORIES_NEW: "/dashboard/categories/new",
	ADMIN: "/admin",
	ADMIN_USERS: "/admin/users",
} as const;
