import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { kontaktPageRepository } from "@/lib/repositories/kontakt-page.repository";
import { updateKontaktPageSchema } from "@/lib/validations/kontakt-page.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { revalidatePath, revalidateTag } from "next/cache";
import { KONTAKT_PAGE_CACHE_TAG } from "@/lib/services/kontakt-page.service";

/**
 * GET /api/kontakt-page
 * Get kontakt page content (public endpoint for reading)
 */
export async function GET() {
	try {
		const kontaktPage = await kontaktPageRepository.get();

		return successResponse(kontaktPage, "Kontakt page content retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching kontakt page content", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch kontakt page content";
		return internalServerErrorResponse(message);
	}
}

/**
 * PUT /api/kontakt-page
 * Update kontakt page content (requires authentication)
 */
export async function PUT(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update kontakt page");
			return unauthorizedResponse(
				"You must be logged in to update kontakt page content"
			);
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = updateKontaktPageSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Kontakt page update validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Update kontakt page
		const kontaktPage = await kontaktPageRepository.update(validationResult.data);

		logger.info("Kontakt page content updated", {
			updatedBy: session.user.id,
		});

		// Revalidate cache tag for all kontakt page queries
		revalidateTag(KONTAKT_PAGE_CACHE_TAG, "default");

		// Revalidate kontakt page
		revalidatePath("/kontakt", "page");

		return successResponse(kontaktPage, "Kontakt page content updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating kontakt page content", error);
		const message =
			error instanceof Error ? error.message : "Failed to update kontakt page content";
		return internalServerErrorResponse(message);
	}
}

/**
 * PATCH /api/kontakt-page
 * Partial update kontakt page content (requires authentication)
 */
export async function PATCH(request: NextRequest) {
	// PATCH uses the same logic as PUT for partial updates
	return PUT(request);
}
