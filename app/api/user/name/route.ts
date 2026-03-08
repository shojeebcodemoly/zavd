import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { userService } from "@/lib/services/user.service";
import { logger } from "@/lib/utils/logger";
import { z } from "zod";

/**
 * Update User Name Endpoint
 * PUT /api/user/name
 *
 * Updates the authenticated user's display name
 */

const updateNameSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must not exceed 100 characters")
		.trim(),
});

export async function PUT(request: NextRequest) {
	try {
		// 1. Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update name");
			return NextResponse.json(
				{ success: false, message: "Unauthorized access" },
				{ status: 401 }
			);
		}

		const userId = session.user.id;

		// 2. Parse and validate request body
		const body = await request.json();
		const validationResult = updateNameSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Name update validation failed", {
				userId,
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

		const { name } = validationResult.data;

		// 3. Update user name
		logger.info("Updating user name", { userId, name });
		const updatedUser = await userService.updateUserInfo(userId, { name });

		// 4. Return success response
		return NextResponse.json({
			success: true,
			message: "Name updated successfully",
			data: {
				user: {
					_id: updatedUser._id,
					name: updatedUser.name,
					email: updatedUser.email,
				},
			},
		});
	} catch (error: any) {
		logger.error("Error updating user name", error);

		return NextResponse.json(
			{
				success: false,
				message: error.message || "Failed to update name",
			},
			{ status: error.statusCode || 500 }
		);
	}
}
