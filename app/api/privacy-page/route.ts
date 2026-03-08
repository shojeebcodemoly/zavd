import { NextRequest, NextResponse } from "next/server";
import { privacyPageService } from "@/lib/services/privacy-page.service";
import { updatePrivacyPageSchema } from "@/lib/validations/privacy-page.validation";
import { revalidatePrivacyPage } from "@/lib/revalidation/actions";

export async function GET() {
	try {
		const data = await privacyPageService.getPrivacyPage();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching privacy page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch privacy page data" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const result = updatePrivacyPageSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				{ error: "Invalid request data", details: result.error.issues },
				{ status: 400 }
			);
		}

		const updated = await privacyPageService.updatePrivacyPage(result.data);

		// Revalidate ISR cache
		await revalidatePrivacyPage();

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating privacy page:", error);
		return NextResponse.json(
			{ error: "Failed to update privacy page data" },
			{ status: 500 }
		);
	}
}
