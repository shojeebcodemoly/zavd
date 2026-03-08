import { NextRequest, NextResponse } from "next/server";
import { getQualityPage, updateQualityPage } from "@/lib/services/quality-page.service";
import { updateQualityPageSchema } from "@/lib/validations/quality-page.validation";
import { revalidateQualityPage } from "@/lib/revalidation/actions";
import type { UpdateQualityPageInput } from "@/lib/repositories/quality-page.repository";

/**
 * GET /api/quality-page
 * Fetch quality page content
 */
export async function GET() {
	try {
		const qualityPage = await getQualityPage();
		return NextResponse.json(qualityPage);
	} catch (error) {
		console.error("Error fetching quality page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch quality page" },
			{ status: 500 }
		);
	}
}

/**
 * PUT /api/quality-page
 * Update quality page content
 */
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate input
		const validationResult = updateQualityPageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await updateQualityPage(validationResult.data as UpdateQualityPageInput);

		// Revalidate ISR cache
		await revalidateQualityPage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating quality page:", error);
		return NextResponse.json(
			{ error: "Failed to update quality page" },
			{ status: 500 }
		);
	}
}
