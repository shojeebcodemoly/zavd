import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { projektePageRepository } from "@/lib/repositories/projekte-page.repository";
import { updateProjektePageSchema } from "@/lib/validations/projekte-page.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { revalidatePath, revalidateTag } from "next/cache";
import { PROJEKTE_PAGE_CACHE_TAG } from "@/lib/services/projekte-page.service";

export async function GET() {
	try {
		const page = await projektePageRepository.get();
		return successResponse(page, "Projekte page retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching projekte page", error);
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
		const validationResult = updateProjektePageSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse("Validation failed", validationResult.error.issues);
		}

		const page = await projektePageRepository.update(validationResult.data);

		revalidateTag(PROJEKTE_PAGE_CACHE_TAG);
		revalidatePath("/projekte", "page");
		revalidatePath("/de/projekte", "page");
		revalidatePath("/en/projekte", "page");

		return successResponse(page, "Projekte page updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating projekte page", error);
		const message =
			error instanceof Error ? error.message : "Failed to update page";
		return internalServerErrorResponse(message);
	}
}

export async function PATCH(request: NextRequest) {
	return PUT(request);
}
