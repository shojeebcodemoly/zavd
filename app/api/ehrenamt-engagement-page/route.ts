import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { ehrenamtEngagementPageRepository } from "@/lib/repositories/ehrenamt-engagement-page.repository";
import { updateEhrenamtEngagementPageSchema } from "@/lib/validations/ehrenamt-engagement-page.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { revalidatePath, revalidateTag } from "next/cache";
import { EHRENAMT_ENGAGEMENT_PAGE_CACHE_TAG } from "@/lib/services/ehrenamt-engagement-page.service";

export async function GET() {
	try {
		const page = await ehrenamtEngagementPageRepository.get();
		return successResponse(page, "Ehrenamt & Engagement page retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching ehrenamt-engagement page", error);
		const message =
			error instanceof Error ? error.message : "Failed to fetch page";
		return internalServerErrorResponse(message);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			return unauthorizedResponse("You must be logged in to update this page");
		}

		const body = await request.json();
		const validationResult =
			updateEhrenamtEngagementPageSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse(
				"Validation failed",
				validationResult.error.issues
			);
		}

		const page = await ehrenamtEngagementPageRepository.update(
			validationResult.data
		);

		revalidateTag(EHRENAMT_ENGAGEMENT_PAGE_CACHE_TAG);
		revalidatePath("/projekte/ehrenamt-engagement", "page");

		return successResponse(page, "Ehrenamt & Engagement page updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating ehrenamt-engagement page", error);
		const message =
			error instanceof Error ? error.message : "Failed to update page";
		return internalServerErrorResponse(message);
	}
}

export async function PATCH(request: NextRequest) {
	return PUT(request);
}
