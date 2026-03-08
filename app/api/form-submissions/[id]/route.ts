import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/db/auth";
import { formSubmissionService } from "@/lib/services/form-submission.service";
import {
	successResponse,
	unauthorizedResponse,
	notFoundResponse,
	internalServerErrorResponse,
	noContentResponse,
} from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";
import { NotFoundError } from "@/lib/utils/api-error";

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * GET /api/form-submissions/:id
 * Protected endpoint - Get a single submission (logged in users only)
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
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

		const submission = await formSubmissionService.getSubmissionById(id);

		return successResponse(submission, "Submission retrieved successfully");
	} catch (error) {
		logger.error("Error getting form submission", error);

		if (error instanceof NotFoundError) {
			return notFoundResponse(error.message);
		}

		return internalServerErrorResponse("Failed to get submission");
	}
}

/**
 * DELETE /api/form-submissions/:id
 * Protected endpoint - Delete a submission (logged in users only)
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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

		await formSubmissionService.deleteSubmission(id);

		return noContentResponse();
	} catch (error) {
		logger.error("Error deleting form submission", error);

		if (error instanceof NotFoundError) {
			return notFoundResponse(error.message);
		}

		return internalServerErrorResponse("Failed to delete submission");
	}
}
