import { NextRequest } from "next/server";
import { getAuth } from "@/lib/db/auth";
import { gemeinsamAktivPageRepository } from "@/lib/repositories/gemeinsam-aktiv-page.repository";
import { updateGemeinsamAktivPageSchema } from "@/lib/validations/gemeinsam-aktiv-page.validation";
import { logger } from "@/lib/utils/logger";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { revalidatePath, revalidateTag } from "next/cache";
import { GEMEINSAM_AKTIV_PAGE_CACHE_TAG } from "@/lib/services/gemeinsam-aktiv-page.service";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const page = await gemeinsamAktivPageRepository.get();
		return successResponse(page, "Gemeinsam Aktiv page retrieved successfully");
	} catch (error: unknown) {
		logger.error("Error fetching gemeinsam-aktiv page", error);
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
		const validationResult = updateGemeinsamAktivPageSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse("Validation failed", validationResult.error.issues);
		}

		const page = await gemeinsamAktivPageRepository.update(validationResult.data);

		revalidateTag(GEMEINSAM_AKTIV_PAGE_CACHE_TAG, {});
		revalidatePath("/projekte/gemeinsam-aktiv", "page");

		return successResponse(page, "Gemeinsam Aktiv page updated successfully");
	} catch (error: unknown) {
		logger.error("Error updating gemeinsam-aktiv page", error);
		const message =
			error instanceof Error ? error.message : "Failed to update page";
		return internalServerErrorResponse(message);
	}
}

export async function PATCH(request: NextRequest) {
	return PUT(request);
}
