import { z } from "zod";
import { PASSWORD_CONFIG } from "@/lib/utils/constants";

/**
 * Authentication validation schemas using Zod
 */

/**
 * Email validation schema
 * Reusable across all auth schemas
 */
export const emailSchema = z
	.string()
	.min(1, "Email is required")
	.email("Invalid email format")
	.toLowerCase()
	.trim();

/**
 * Password validation schema
 * Requirements:
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordSchema = z
	.string()
	.min(PASSWORD_CONFIG.MIN_LENGTH, `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters`)
	.max(PASSWORD_CONFIG.MAX_LENGTH, `Password must not exceed ${PASSWORD_CONFIG.MAX_LENGTH} characters`)
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[0-9]/, "Password must contain at least one number")
	.regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)");

/**
 * Name validation schema
 */
export const nameSchema = z
	.string()
	.min(2, "Name must be at least 2 characters")
	.max(100, "Name must not exceed 100 characters")
	.trim();

/**
 * Register validation schema
 * Used for user registration
 */
export const registerSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	name: nameSchema,
});

/**
 * Login validation schema
 * Used for user login
 */
export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
});

/**
 * Change password validation schema
 * Used when user wants to change their password
 */
export const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required"),
	newPassword: passwordSchema,
	confirmPassword: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
});

/**
 * Type exports for TypeScript
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
