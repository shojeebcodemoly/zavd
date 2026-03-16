import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { siteSettingsRepository } from "@/lib/repositories/site-settings.repository";
import { updateSiteSettingsSchema } from "@/lib/validations/site-settings.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { revalidatePath, revalidateTag } from "next/cache";
import { SITE_SETTINGS_CACHE_TAG } from "@/lib/services/site-settings.service";

/**
 * GET /api/site-settings
 * Get site settings (public endpoint for reading)
 */
export async function GET() {
	try {
		const settings = await siteSettingsRepository.get();

		return successResponse(settings, "Site settings retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching site settings", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch site settings";
		return internalServerErrorResponse(message);
	}
}

/**
 * PUT /api/site-settings
 * Update site settings (requires authentication)
 */
export async function PUT(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update site settings");
			return unauthorizedResponse(
				"You must be logged in to update site settings"
			);
		}

		// Parse and validate request body
		const body = await request.json();
		const validationResult = updateSiteSettingsSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Site settings update validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Update settings
		const settings = await siteSettingsRepository.update(validationResult.data);

		logger.info("Site settings updated", {
			updatedBy: session.user.id,
		});

		// Revalidate cache tag for all site settings queries
		revalidateTag(SITE_SETTINGS_CACHE_TAG, {});

		// Revalidate the root layout - this affects navbar/footer on all pages
		revalidatePath("/", "layout");

		// Revalidate all project pages (sidebar uses contactBackground + donationWidget from siteSettings)
		revalidatePath("/projekte", "layout");
		revalidatePath("/de/projekte", "layout");
		revalidatePath("/en/projekte", "layout");

		// Revalidate favicon/icon routes (they have their own ISR cache)
		revalidatePath("/icon");
		revalidatePath("/apple-icon");

		// Revalidate key public pages that display site settings
		const pathsToRevalidate = [
			"/",
			"/coming-soon",
			"/produkter",
			"/nyheter",
			"/blogg",
			"/om-oss",
			"/kontakt",
			"/utbildningar",
			"/starta-eget",
			"/faq",
			"/integritetspolicy",
			"/villkor",
			"/projekte",
			"/de/projekte",
			"/en/projekte",
		];

		for (const path of pathsToRevalidate) {
			revalidatePath(path);
		}

		logger.info("Site settings cache revalidated", {
			paths: pathsToRevalidate.length,
		});

		return successResponse(settings, "Site settings updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating site settings", error);
		const message =
			error instanceof Error ? error.message : "Failed to update site settings";
		return internalServerErrorResponse(message);
	}
}

/**
 * PATCH /api/site-settings
 * Partial update site settings (requires authentication)
 */
export async function PATCH(request: NextRequest) {
	// PATCH uses the same logic as PUT for partial updates
	return PUT(request);
}
