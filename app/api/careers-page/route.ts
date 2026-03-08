import { NextRequest, NextResponse } from "next/server";
import { careersPageService } from "@/lib/services/careers-page.service";
import { updateCareersPageSchema } from "@/lib/validations/careers-page.validation";
import { revalidateCareersPage } from "@/lib/revalidation/actions";
import type { CareersPageData } from "@/lib/repositories/careers-page.repository";

export async function GET() {
	try {
		const data = await careersPageService.getCareersPage();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching careers page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch careers page data" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const result = updateCareersPageSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				{ error: "Invalid request data", details: result.error.issues },
				{ status: 400 }
			);
		}

		const updated = await careersPageService.updateCareersPage(result.data as Partial<CareersPageData>);

		// Revalidate ISR cache
		await revalidateCareersPage();

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating careers page:", error);
		return NextResponse.json(
			{ error: "Failed to update careers page data" },
			{ status: 500 }
		);
	}
}
