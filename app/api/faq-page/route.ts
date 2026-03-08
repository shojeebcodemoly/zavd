import { NextRequest, NextResponse } from "next/server";
import { faqPageService } from "@/lib/services/faq-page.service";
import { updateFAQPageSchema } from "@/lib/validations/faq-page.validation";
import { revalidateFaqPage } from "@/lib/revalidation/actions";

export async function GET() {
	try {
		const data = await faqPageService.getFAQPage();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching FAQ page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch FAQ page data" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate request body
		const result = updateFAQPageSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				{ error: "Invalid request data", details: result.error.issues },
				{ status: 400 }
			);
		}

		const updated = await faqPageService.updateFAQPage(result.data);

		// Revalidate ISR cache
		await revalidateFaqPage();

		return NextResponse.json(updated);
	} catch (error) {
		console.error("Error updating FAQ page:", error);
		return NextResponse.json(
			{ error: "Failed to update FAQ page data" },
			{ status: 500 }
		);
	}
}
