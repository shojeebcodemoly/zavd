import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { authService } from "@/lib/services/auth.service";
import { userService } from "@/lib/services/user.service";
import { logger } from "@/lib/utils/logger";
import { z } from "zod";

/**
 * Create New User Endpoint
 * POST /api/admin/users
 *
 * Allows authenticated users to create/register new users
 * Only accessible to logged-in users
 */

const createUserSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must not exceed 100 characters")
		.trim(),
	email: z.string().email("Invalid email format").toLowerCase().trim(),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(128, "Password must not exceed 128 characters")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
});

export async function POST(request: NextRequest) {
	try {
		// 1. Validate session - Only logged-in users can create new users
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to create user");
			return NextResponse.json(
				{
					success: false,
					message: "Unauthorized. You must be logged in to create users.",
				},
				{ status: 401 }
			);
		}

		logger.info("User creation attempt by authenticated user", {
			requestedBy: session.user.id,
		});

		// 2. Parse and validate request body
		const body = await request.json();
		const validationResult = createUserSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("User creation validation failed", {
				errors: validationResult.error,
			});

			return NextResponse.json(
				{
					success: false,
					message: "Validation failed",
					errors: validationResult.error,
				},
				{ status: 400 }
			);
		}

		const { name, email, password } = validationResult.data;

		// 3. Check if email already exists
		const existingUser = await userService.getUserByEmail(email);
		if (existingUser) {
			logger.warn("User creation failed: Email already exists", { email });
			return NextResponse.json(
				{
					success: false,
					message: "Email already exists",
				},
				{ status: 409 }
			);
		}

		// 4. Create the new user using Better Auth
		const newUser = await authService.createUserByAdmin({
			name,
			email,
			password,
			createdBy: session.user.id,
		});

		logger.info("User created successfully", {
			newUserId: newUser._id,
			createdBy: session.user.id,
		});

		// 5. Return success response
		return NextResponse.json({
			success: true,
			message: "User created successfully",
			data: {
				user: {
					_id: newUser._id,
					name: newUser.name,
					email: newUser.email,
					emailVerified: newUser.emailVerified,
					createdAt: newUser.createdAt,
				},
			},
		});
	} catch (error: any) {
		logger.error("Error creating user", error);

		return NextResponse.json(
			{
				success: false,
				message: error.message || "Failed to create user",
			},
			{ status: error.statusCode || 500 }
		);
	}
}

/**
 * Get All Users Endpoint
 * GET /api/admin/users
 *
 * Retrieves list of all users
 * Only accessible to logged-in users
 */
export async function GET(request: NextRequest) {
	try {
		// 1. Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to list users");
			return NextResponse.json(
				{
					success: false,
					message: "Unauthorized. You must be logged in to view users.",
				},
				{ status: 401 }
			);
		}

		// 2. Get query parameters for pagination
		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const search = searchParams.get("search") || "";

		// 3. Fetch users
		const result = await userService.searchUsers(search, page, limit);

		// Handle both array and paginated responses
		const users = Array.isArray(result) ? result : result.data;
		const pagination = Array.isArray(result)
			? {
					total: result.length,
					page: 1,
					limit: result.length,
					totalPages: 1,
			  }
			: {
					total: result.total,
					page: result.page,
					limit: result.limit,
					totalPages: result.totalPages,
			  };

		logger.info("Users list retrieved", {
			requestedBy: session.user.id,
			count: users.length,
		});

		// 4. Return users list with consistent structure
		return NextResponse.json({
			success: true,
			data: {
				users,
				...pagination,
			},
		});
	} catch (error: any) {
		logger.error("Error fetching users", error);

		return NextResponse.json(
			{
				success: false,
				message: error.message || "Failed to fetch users",
			},
			{ status: error.statusCode || 500 }
		);
	}
}
