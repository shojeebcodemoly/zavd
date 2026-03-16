import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { patenschaftsprojektPageRepository } from "@/lib/repositories/patenschaftsprojekt-page.repository";
import { updatePatenschaftsprojektPageSchema } from "@/lib/validations/patenschaftsprojekt-page.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { revalidatePath, revalidateTag } from "next/cache";
import { PATENSCHAFTSPROJEKT_PAGE_CACHE_TAG } from "@/lib/services/patenschaftsprojekt-page.service";

export async function GET() {
	try {
		const page = await patenschaftsprojektPageRepository.get();
		return successResponse(page, "Patenschaftsprojekt page retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching patenschaftsprojekt page", error);
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
			updatePatenschaftsprojektPageSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse("Validation failed", validationResult.error.issues);
		}

		const page = await patenschaftsprojektPageRepository.update(
			validationResult.data
		);

		revalidateTag(PATENSCHAFTSPROJEKT_PAGE_CACHE_TAG, {});
		revalidatePath("/projekte/patenschaftsprojekt", "page");

		return successResponse(page, "Patenschaftsprojekt page updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating patenschaftsprojekt page", error);
		const message =
			error instanceof Error ? error.message : "Failed to update page";
		return internalServerErrorResponse(message);
	}
}

export async function PATCH(request: NextRequest) {
	return PUT(request);
}
