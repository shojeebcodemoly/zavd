import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/services/user.service";
import { logger } from "@/lib/utils/logger";
import { z } from "zod";
import { getAuth } from "@/lib/db/auth";

/**
 * Update User Image Endpoint
 * PUT /api/user/image
 *
 * Updates the authenticated user's profile image
 * Supports both URLs and base64-encoded images
 */

const updateImageSchema = z.object({
	image: z
		.string()
		.min(1, "Image is required")
		.refine(
			(val) => {
				// Check if it's a valid URL or base64 image
				try {
					new URL(val);
					return true;
				} catch {
					// Check if it's a valid base64 image
					return /^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,/.test(
						val
					);
				}
			},
			{
				message:
					"Image must be a valid URL or base64-encoded image (data:image/...;base64,...)",
			}
		)
		.refine(
			(val) => {
				// If base64, check size (limit to 5MB)
				if (val.startsWith("data:image")) {
					// Rough estimate: base64 is ~1.37x larger than original
					const sizeInBytes = (val.length * 3) / 4;
					const maxSize = 5 * 1024 * 1024; // 5MB
					return sizeInBytes <= maxSize;
				}
				return true;
			},
			{
				message: "Image size must not exceed 5MB",
			}
		),
});

export async function PUT(request: NextRequest) {
	try {
		// 1. Validate session
		const auth = await getAuth();

		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update image");
			return NextResponse.json(
				{ success: false, message: "Unauthorized access" },
				{ status: 401 }
			);
		}

		const userId = session.user.id;

		// 2. Parse and validate request body
		const body = await request.json();
		const validationResult = updateImageSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Image update validation failed", {
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

		const { image } = validationResult.data;

		// 3. Update user image
		logger.info("Updating user image", {
			userId,
			isBase64: image.startsWith("data:image"),
		});

		const updatedUser = await userService.updateUserImage(userId, image);

		// 4. Return success response
		return NextResponse.json({
			success: true,
			message: "Profile image updated successfully",
			data: {
				user: {
					_id: updatedUser._id,
					name: updatedUser.name,
					email: updatedUser.email,
					image: updatedUser.image,
				},
			},
		});
	} catch (error: any) {
		logger.error("Error updating user image", error);

		return NextResponse.json(
			{
				success: false,
				message: error.message || "Failed to update image",
			},
			{ status: error.statusCode || 500 }
		);
	}
}

/**
 * Delete User Image Endpoint
 * DELETE /api/user/image
 *
 * Removes the authenticated user's profile image
 */
export async function DELETE(request: NextRequest) {
	try {
		const auth = await getAuth();
		// 1. Validate session
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to delete image");
			return NextResponse.json(
				{ success: false, message: "Unauthorized access" },
				{ status: 401 }
			);
		}

		const userId = session.user.id;

		// 2. Remove user image (set to null)
		logger.info("Removing user image", { userId });
		const updatedUser = await userService.updateUserImage(userId, null);

		// 3. Return success response
		return NextResponse.json({
			success: true,
			message: "Profile image removed successfully",
			data: {
				user: {
					_id: updatedUser._id,
					name: updatedUser.name,
					email: updatedUser.email,
					image: updatedUser.image,
				},
			},
		});
	} catch (error: any) {
		logger.error("Error removing user image", error);

		return NextResponse.json(
			{
				success: false,
				message: error.message || "Failed to remove image",
			},
			{ status: error.statusCode || 500 }
		);
	}
}
