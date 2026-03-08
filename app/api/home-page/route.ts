import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { homePageRepository } from "@/lib/repositories/home-page.repository";
import { updateHomePageSchema } from "@/lib/validations/home-page.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { revalidatePath, revalidateTag } from "next/cache";
import { HOME_PAGE_CACHE_TAG } from "@/lib/services/home-page.service";
import { locales } from "@/i18n/config";

/**
 * GET /api/home-page
 * Get home page content (public endpoint for reading)
 */
export async function GET() {
	try {
		const homePage = await homePageRepository.get();

		// Debug: Log fetched hero data
		logger.info("GET - Fetched hero data", {
			heroSlides: homePage.hero?.slides?.map((s: { title?: string }) => s.title),
		});

		return successResponse(homePage, "Home page content retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching home page content", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch home page content";
		return internalServerErrorResponse(message);
	}
}

/**
 * PUT /api/home-page
 * Update home page content (requires authentication)
 */
export async function PUT(request: NextRequest) {
	try {
		// Validate session
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			logger.warn("Unauthorized access attempt to update home page");
			return unauthorizedResponse(
				"You must be logged in to update home page content"
			);
		}

		// Parse and validate request body
		const body = await request.json();

		// Debug: Log incoming hero data
		logger.info("Incoming hero data from form", {
			heroSlides: body.hero?.slides?.map((s: { title?: string }) => s.title),
		});

		const validationResult = updateHomePageSchema.safeParse(body);

		if (!validationResult.success) {
			logger.warn("Home page update validation failed", {
				errors: validationResult.error.issues,
			});
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		// Debug: Log validated data
		logger.info("Validated hero data", {
			heroSlides: validationResult.data.hero?.slides?.map((s: { title?: string }) => s.title),
		});

		// Update home page
		const homePage = await homePageRepository.update(validationResult.data);

		// Debug: Log saved data
		logger.info("Saved hero data", {
			heroSlides: homePage.hero?.slides?.map((s: { title?: string }) => s.title),
		});

		logger.info("Home page content updated", {
			updatedBy: session.user.id,
		});

		// Revalidate cache tag for all home page queries (Next.js 16 requires "max" as second arg)
		revalidateTag(HOME_PAGE_CACHE_TAG, "max");

		// Revalidate home page for all locales
		revalidatePath("/", "layout");
		// Also revalidate each locale path explicitly
		for (const locale of locales) {
			revalidatePath(`/${locale}`, "page");
		}

		logger.info("Cache revalidated for home page", {
			tag: HOME_PAGE_CACHE_TAG,
			paths: ["/", ...locales.map((l) => `/${l}`)],
		});

		return successResponse(homePage, "Home page content updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating home page content", error);
		const message =
			error instanceof Error ? error.message : "Failed to update home page content";
		return internalServerErrorResponse(message);
	}
}

/**
 * PATCH /api/home-page
 * Partial update home page content (requires authentication)
 */
export async function PATCH(request: NextRequest) {
	// PATCH uses the same logic as PUT for partial updates
	return PUT(request);
}
