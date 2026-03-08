import { NextRequest, NextResponse } from "next/server";
import { getLegalPage, updateLegalPage } from "@/lib/services/legal-page.service";
import { updateLegalPageSchema } from "@/lib/validations/legal-page.validation";
import { revalidateLegalPage } from "@/lib/revalidation/actions";

/**
 * GET /api/legal-page
 * Fetch legal page content
 */
export async function GET() {
	try {
		const legalPage = await getLegalPage();
		return NextResponse.json(legalPage);
	} catch (error) {
		console.error("Error fetching legal page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch legal page" },
			{ status: 500 }
		);
	}
}

/**
 * PUT /api/legal-page
 * Update legal page content
 */
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate input
		const validationResult = updateLegalPageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await updateLegalPage(validationResult.data);

		// Revalidate ISR cache
		await revalidateLegalPage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating legal page:", error);
		return NextResponse.json(
			{ error: "Failed to update legal page" },
			{ status: 500 }
		);
	}
}
