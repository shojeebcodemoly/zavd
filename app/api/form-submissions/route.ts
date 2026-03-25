import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/db/auth";
import { formSubmissionService } from "@/lib/services/form-submission.service";
import { sendSubmissionNotification } from "@/lib/services/email-notification.service";
import { formSubmissionListQuerySchema } from "@/lib/validations/form-submission.validation";
import {
	createdResponse,
	badRequestResponse,
	unauthorizedResponse,
	validationErrorResponse,
	internalServerErrorResponse,
	paginatedResponse,
} from "@/lib/utils/api-response";
import { HTTP_STATUS } from "@/lib/utils/constants";
import { logger } from "@/lib/utils/logger";
import {
	TooManyRequestsError,
	ValidationError,
	NotFoundError,
	DatabaseError,
	BadRequestError,
} from "@/lib/utils/api-error";

export const dynamic = "force-dynamic";

/**
 * POST /api/form-submissions
 * Public endpoint - Create a new form submission (rate limited)
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Determine submission type
		const type = body.type || "product_inquiry";

		// Get metadata from request
		const headersList = await headers();
		const metadata = {
			ipAddress:
				headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
				headersList.get("x-real-ip") ||
				"unknown",
			userAgent: headersList.get("user-agent") || "unknown",
			referrer: headersList.get("referer") || undefined,
			pageUrl: body.pageUrl || headersList.get("referer") || "unknown",
			locale: headersList.get("accept-language")?.split(",")[0] || undefined,
		};

		let submission;

		if (type === "product_inquiry") {
			submission = await formSubmissionService.createProductInquiry(
				body,
				metadata
			);
		} else if (type === "training_inquiry") {
			submission = await formSubmissionService.createTrainingInquiry(
				body,
				metadata
			);
		} else if (type === "contact") {
			submission = await formSubmissionService.createContactInquiry(
				body,
				metadata
			);
		} else if (type === "callback_request") {
			submission = await formSubmissionService.createCallbackRequest(
				body,
				metadata
			);
		} else if (type === "tour_request") {
			submission = await formSubmissionService.createTourRequest(
				body,
				metadata
			);
		} else if (type === "quote_request") {
			submission = await formSubmissionService.createQuoteRequest(
				body,
				metadata
			);
		} else if (type === "reseller_application") {
			submission = await formSubmissionService.createResellerApplication(
				body,
				metadata
			);
		} else if (type === "subscriber") {
			submission = await formSubmissionService.createSubscriber(
				body,
				metadata
			);
		} else {
			return badRequestResponse("Unsupported form type");
		}

		logger.info(`Form submission created: ${submission._id}`);

		// Fire-and-forget admin notification — never blocks the response
		sendSubmissionNotification(submission).catch(() => {});

		return createdResponse(
			{
				id: submission._id.toString(),
				message: "Tack för din förfrågan! Vi återkommer inom 24 timmar.",
			},
			"Submission created successfully"
		);
	} catch (error) {
		logger.error("Error creating form submission", error);

		if (error instanceof TooManyRequestsError) {
			return NextResponse.json(
				{
					success: false,
					message: error.message,
				},
				{ status: HTTP_STATUS.TOO_MANY_REQUESTS }
			);
		}

		if (error instanceof ValidationError) {
			return validationErrorResponse(error.message, error.errors);
		}

		if (error instanceof BadRequestError) {
			return badRequestResponse(error.message);
		}

		if (error instanceof DatabaseError) {
			return internalServerErrorResponse(error.message);
		}

		return internalServerErrorResponse("Failed to create submission");
	}
}

/**
 * GET /api/form-submissions
 * Protected endpoint - List submissions (logged in users only)
 */
export async function GET(request: NextRequest) {
	try {
		// Check authentication
		const auth = await getAuth();
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return unauthorizedResponse("Authentication required");
		}

		// Parse query parameters
		const { searchParams } = new URL(request.url);
		const queryParams = {
			page: searchParams.get("page") || "1",
			limit: searchParams.get("limit") || "20",
			type: searchParams.get("type") || undefined,
			status: searchParams.get("status") || undefined,
			search: searchParams.get("search") || undefined,
			dateFrom: searchParams.get("dateFrom") || undefined,
			dateTo: searchParams.get("dateTo") || undefined,
			productId: searchParams.get("productId") || undefined,
			sort: searchParams.get("sort") || "-createdAt",
		};

		// Validate query
		const validationResult =
			formSubmissionListQuerySchema.safeParse(queryParams);

		if (!validationResult.success) {
			return badRequestResponse(
				"Invalid query parameters",
				validationResult.error.issues
			);
		}

		const result = await formSubmissionService.getSubmissions(
			validationResult.data
		);

		return paginatedResponse(
			result.data,
			result.page,
			result.limit,
			result.total,
			"Submissions retrieved successfully"
		);
	} catch (error) {
		logger.error("Error listing form submissions", error);
		return internalServerErrorResponse("Failed to list submissions");
	}
}
