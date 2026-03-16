import { NextRequest, NextResponse } from "next/server";
import { getAngeboteBeratungPage, updateAngeboteBeratungPage } from "@/lib/services/angebote-beratung-page.service";
import { updateAngeboteBeratungPageSchema } from "@/lib/validations/angebote-beratung-page.validation";
import { revalidateAngeboteBeratungPage } from "@/lib/revalidation/actions";
import type { UpdateAngeboteBeratungPageInput } from "@/lib/repositories/angebote-beratung-page.repository";

export async function GET() {
	try {
		const page = await getAngeboteBeratungPage();
		return NextResponse.json(page);
	} catch (error) {
		console.error("Error fetching angebote-beratung page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch angebote-beratung page" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		const validationResult = updateAngeboteBeratungPageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await updateAngeboteBeratungPage(
			validationResult.data as UpdateAngeboteBeratungPageInput
		);

		await revalidateAngeboteBeratungPage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating angebote-beratung page:", error);
		return NextResponse.json(
			{ error: "Failed to update angebote-beratung page" },
			{ status: 500 }
		);
	}
}
