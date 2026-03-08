import { NextRequest, NextResponse } from "next/server";
import { trainingPageService } from "@/lib/services/training-page.service";
import { updateTrainingPageSchema } from "@/lib/validations/training-page.validation";
import { revalidateTrainingPage } from "@/lib/revalidation/actions";
import type { TrainingPageData } from "@/lib/repositories/training-page.repository";

export async function GET() {
	try {
		const data = await trainingPageService.getTrainingPage();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching training page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch training page data" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const result = updateTrainingPageSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				{ error: "Invalid request data", details: result.error.issues },
				{ status: 400 }
			);
		}

		const updated = await trainingPageService.updateTrainingPage(result.data as Partial<TrainingPageData>);

		// Revalidate ISR cache
		await revalidateTrainingPage();

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating training page:", error);
		return NextResponse.json(
			{ error: "Failed to update training page data" },
			{ status: 500 }
		);
	}
}
