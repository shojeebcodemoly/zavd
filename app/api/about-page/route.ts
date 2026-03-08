import { NextRequest, NextResponse } from "next/server";
import { getAboutPage, updateAboutPage } from "@/lib/services/about-page.service";
import { updateAboutPageSchema } from "@/lib/validations/about-page.validation";
import { revalidateAboutPage } from "@/lib/revalidation/actions";
import type { UpdateAboutPageInput } from "@/lib/repositories/about-page.repository";

/**
 * GET /api/about-page
 * Fetch about page content
 */
export async function GET() {
	try {
		const aboutPage = await getAboutPage();
		return NextResponse.json(aboutPage);
	} catch (error) {
		console.error("Error fetching about page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch about page" },
			{ status: 500 }
		);
	}
}

/**
 * PUT /api/about-page
 * Update about page content
 */
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate input
		const validationResult = updateAboutPageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await updateAboutPage(validationResult.data as UpdateAboutPageInput);

		// Revalidate ISR cache
		await revalidateAboutPage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating about page:", error);
		return NextResponse.json(
			{ error: "Failed to update about page" },
			{ status: 500 }
		);
	}
}
