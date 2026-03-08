import { z } from "zod";

/**
 * User and Profile validation schemas using Zod
 */

/**
 * Phone number validation schema
 * Supports international phone numbers
 */
export const phoneNumberSchema = z.string().optional();

/**
 * URL validation schema
 */
export const urlSchema = z.string().url("Invalid URL format").optional();

/**
 * Address validation schema
 */
export const addressSchema = z
	.object({
		street: z
			.string()
			.max(200, "Street must not exceed 200 characters")
			.optional(),
		city: z
			.string()
			.max(100, "City must not exceed 100 characters")
			.optional(),
		postalCode: z
			.string()
			.max(20, "Postal code must not exceed 20 characters")
			.optional(),
		country: z
			.string()
			.max(100, "Country must not exceed 100 characters")
			.optional(),
	})
	.optional();

/**
 * Update profile validation schema
 * Used when user updates their profile
 */
export const updateProfileSchema = z.object({
	bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
	phoneNumber: phoneNumberSchema,
	address: addressSchema,
});

/**
 * Update avatar validation schema
 * Used when user updates their avatar URL
 */
export const updateAvatarSchema = z.object({
	avatarUrl: z.string().url("Invalid avatar URL"),
});

/**
 * Update user basic info schema
 * Used when user updates name or email
 */
export const updateUserInfoSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must not exceed 100 characters")
		.trim()
		.optional(),
	email: z
		.string()
		.email("Invalid email format")
		.toLowerCase()
		.trim()
		.optional(),
});

/**
 * Update password validation schema
 * Used when user changes their password
 */
export const updatePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z
			.string()
			.min(8, "New password must be at least 8 characters")
			.max(128, "New password must not exceed 128 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number"
			),
		confirmPassword: z.string().min(1, "Password confirmation is required"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

/**
 * Search users validation schema
 */
export const searchUsersSchema = z.object({
	query: z.string().min(1, "Search query is required"),
	page: z.number().min(1).default(1).optional(),
	limit: z.number().min(1).max(100).default(10).optional(),
});

/**
 * Type exports for TypeScript
 */
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;
export type UpdateUserInfoInput = z.infer<typeof updateUserInfoSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type SearchUsersInput = z.infer<typeof searchUsersSchema>;
