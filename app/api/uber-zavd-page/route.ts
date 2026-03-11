import { NextRequest, NextResponse } from "next/server";
import { getUberZavdPage, updateUberZavdPage } from "@/lib/services/uber-zavd-page.service";
import { updateUberZavdPageSchema } from "@/lib/validations/uber-zavd-page.validation";
import { revalidateUberZavdPage } from "@/lib/revalidation/actions";
import type { UpdateUberZavdPageInput } from "@/lib/repositories/uber-zavd-page.repository";

export async function GET() {
	try {
		const page = await getUberZavdPage();
		return NextResponse.json(page);
	} catch (error) {
		console.error("Error fetching uber-zavd page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch uber-zavd page" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		const validationResult = updateUberZavdPageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await updateUberZavdPage(
			validationResult.data as UpdateUberZavdPageInput
		);

		await revalidateUberZavdPage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating uber-zavd page:", error);
		return NextResponse.json(
			{ error: "Failed to update uber-zavd page" },
			{ status: 500 }
		);
	}
}
