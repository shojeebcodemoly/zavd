import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { gutReinkommenPageRepository } from "@/lib/repositories/gut-reinkommen-page.repository";
import { updateGutReinkommenPageSchema } from "@/lib/validations/gut-reinkommen-page.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { revalidatePath, revalidateTag } from "next/cache";
import { GUT_REINKOMMEN_PAGE_CACHE_TAG } from "@/lib/services/gut-reinkommen-page.service";

export async function GET() {
	try {
		const page = await gutReinkommenPageRepository.get();
		return successResponse(page, "Gut Reinkommen page retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching gut-reinkommen page", error);
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
		const validationResult = updateGutReinkommenPageSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse("Validation failed", validationResult.error.issues);
		}

		const page = await gutReinkommenPageRepository.update(validationResult.data);

		revalidateTag(GUT_REINKOMMEN_PAGE_CACHE_TAG);
		revalidatePath("/projekte/gut-reinkommen", "page");

		return successResponse(page, "Gut Reinkommen page updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating gut-reinkommen page", error);
		const message =
			error instanceof Error ? error.message : "Failed to update page";
		return internalServerErrorResponse(message);
	}
}

export async function PATCH(request: NextRequest) {
	return PUT(request);
}
