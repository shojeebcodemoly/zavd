import { NextRequest, NextResponse } from "next/server";
import { getStorePage, updateStorePage } from "@/lib/services/store-page.service";
import { updateStorePageSchema } from "@/lib/validations/store-page.validation";
import { revalidateStorePage } from "@/lib/revalidation/actions";
import type { UpdateStorePageInput } from "@/lib/repositories/store-page.repository";

/**
 * GET /api/store-page
 * Fetch store page content
 */
export async function GET() {
	try {
		const storePage = await getStorePage();
		return NextResponse.json(storePage);
	} catch (error) {
		console.error("Error fetching store page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch store page" },
			{ status: 500 }
		);
	}
}

/**
 * PUT /api/store-page
 * Update store page content
 */
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate input
		const validationResult = updateStorePageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await updateStorePage(validationResult.data as UpdateStorePageInput);

		// Revalidate ISR cache
		await revalidateStorePage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating store page:", error);
		return NextResponse.json(
			{ error: "Failed to update store page" },
			{ status: 500 }
		);
	}
}
