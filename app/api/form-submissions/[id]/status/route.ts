import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/db/auth";
import { formSubmissionService } from "@/lib/services/form-submission.service";
import { updateStatusSchema } from "@/lib/validations/form-submission.validation";
import {
	successResponse,
	badRequestResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { NotFoundError, BadRequestError } from "@/lib/utils/api-error";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * PATCH /api/form-submissions/:id/status
 * Protected endpoint - Update submission status (logged in users only)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
	try {
		// Check authentication
		const auth = await getAuth();
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return unauthorizedResponse("Authentication required");
		}

		const { id } = await params;
		const body = await request.json();

		// Validate request body
		const validationResult = updateStatusSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse(
				"Invalid status",
				validationResult.error.issues
			);
		}

		const submission = await formSubmissionService.updateStatus(
			id,
			validationResult.data,
			session.user.id
		);

		return successResponse(submission, "Status updated successfully");
	} catch (error) {
		logger.error("Error updating form submission status", error);

		if (error instanceof NotFoundError) {
			return notFoundResponse(error.message);
		}

		if (error instanceof BadRequestError) {
			return badRequestResponse(error.message);
		}

		return internalServerErrorResponse("Failed to update status");
	}
}
