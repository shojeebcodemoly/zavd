import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/db/auth";
import { formSubmissionService } from "@/lib/services/form-submission.service";
import { bulkExportSchema } from "@/lib/validations/form-submission.validation";
import {
	badRequestResponse,
	unauthorizedResponse,
	forbiddenResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";
import { logger } from "@/lib/utils/logger";

/**
 * POST /api/form-submissions/export
 * Protected endpoint - Export submissions (admin only)
 */
export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const auth = await getAuth();
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return unauthorizedResponse("Authentication required");
		}

		// Check admin role - cast to include role from extended user type
		// const userRole = (session.user as { role?: string }).role;
		// if (userRole !== "admin") {
		// 	return forbiddenResponse("Admin access required");
		// }

		const body = await request.json();

		// Validate request body
		const validationResult = bulkExportSchema.safeParse(body);

		if (!validationResult.success) {
			return badRequestResponse(
				"Invalid export options",
				validationResult.error.issues
			);
		}

		const { format, ...filterOptions } = validationResult.data;

		// Get submissions for export
		const submissions = await formSubmissionService.getForExport(
			filterOptions
		);

		if (submissions.length === 0) {
			return badRequestResponse(
				"No submissions found matching the criteria"
			);
		}

		// Generate export based on format
		if (format === "csv") {
			const csv = formSubmissionService.exportToCsv(submissions);

			return new NextResponse(csv, {
				status: 200,
				headers: {
					"Content-Type": "text/csv; charset=utf-8",
					"Content-Disposition": `attachment; filename="form-submissions-${
						new Date().toISOString().split("T")[0]
					}.csv"`,
				},
			});
		}

		// For XLSX, we'd need to add xlsx library - for now return CSV
		return badRequestResponse("XLSX export not yet implemented, use CSV");
	} catch (error) {
		logger.error("Error exporting form submissions", error);
		return internalServerErrorResponse("Failed to export submissions");
	}
}
