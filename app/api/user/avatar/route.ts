import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { storageService } from "@/lib/storage/service";
import { userService } from "@/lib/services/user.service";
import { logger } from "@/lib/utils/logger";

/**
 * Upload User Avatar
 * POST /api/user/avatar
 *
 * Uploads a new avatar for the authenticated user.
 * Automatically deletes any previous avatar.
 * Stores the image in public/storage/avatars/{userId}/
 */
export async function POST(request: NextRequest) {
	try {
		// console.log("[Avatar API] POST request received");

		// 1. Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to upload avatar");
			return NextResponse.json(
				{ success: false, message: "Unauthorized access" },
				{ status: 401 }
			);
		}

		const userId = session.user.id;
		// console.log("[Avatar API] User authenticated:", userId);

		// 2. Parse multipart form data
		const formData = await request.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			// console.log("[Avatar API] No file provided in request");
			return NextResponse.json(
				{ success: false, message: "No file provided" },
				{ status: 400 }
			);
		}

		// console.log("[Avatar API] File received:", {
		// 	name: file.name,
		// 	type: file.type,
		// 	size: file.size,
		// });

		// 3. Validate file type
		if (!file.type.startsWith("image/")) {
			return NextResponse.json(
				{ success: false, message: "Only image files are allowed" },
				{ status: 400 }
			);
		}

		// 4. Convert to buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		// console.log("[Avatar API] Buffer created, size:", buffer.length);

		// 5. Upload avatar (this automatically deletes old one)
		// console.log("[Avatar API] Uploading to storage service...");
		const { url } = await storageService.uploadUserAvatar(
			userId,
			buffer,
			file.type,
			file.size
		);
		// console.log("[Avatar API] Storage upload complete, URL:", url);

		// 6. Update user's image field in database with the new URL
		// console.log("[Avatar API] Updating user image in database...");
		const updatedUser = await userService.updateUserImage(userId, url);
		// console.log("[Avatar API] Database update complete:", {
		// 	userId,
		// 	newImageUrl: updatedUser?.image,
		// });

		logger.info("Avatar uploaded and user updated", { userId, url });

		const response = {
			success: true,
			message: "Avatar uploaded successfully",
			data: { url },
		};
		// console.log("[Avatar API] Sending response:", response);

		return NextResponse.json(response);
	} catch (error: any) {
		// console.error("[Avatar API] Error:", error);
		logger.error("Error uploading avatar", error);

		return NextResponse.json(
			{
				success: false,
				message: error.message || "Failed to upload avatar",
			},
			{ status: error.statusCode || 500 }
		);
	}
}

/**
 * Delete User Avatar
 * DELETE /api/user/avatar
 *
 * Removes the authenticated user's avatar from storage and database.
 */
export async function DELETE(request: NextRequest) {
	try {
		// 1. Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to delete avatar");
			return NextResponse.json(
				{ success: false, message: "Unauthorized access" },
				{ status: 401 }
			);
		}

		const userId = session.user.id;

		// 2. Delete avatar from storage
		try {
			await storageService.deleteUserAvatar(userId);
		} catch (error: any) {
			// If no avatar exists, that's okay - we'll still clear the database field
			if (error.code !== "FILE_NOT_FOUND") {
				throw error;
			}
		}

		// 3. Clear user's image field in database
		await userService.updateUserImage(userId, null);

		logger.info("Avatar deleted", { userId });

		return NextResponse.json({
			success: true,
			message: "Avatar deleted successfully",
		});
	} catch (error: any) {
		logger.error("Error deleting avatar", error);

		return NextResponse.json(
			{
				success: false,
				message: error.message || "Failed to delete avatar",
			},
			{ status: error.statusCode || 500 }
		);
	}
}
