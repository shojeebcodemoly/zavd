import { NextRequest, NextResponse } from "next/server";
import { getThemenPage, updateThemenPage } from "@/lib/services/themen-page.service";
import { updateThemenPageSchema } from "@/lib/validations/themen-page.validation";
import { revalidateThemenPage } from "@/lib/revalidation/actions";
import type { UpdateThemenPageInput } from "@/lib/repositories/themen-page.repository";
import { getAuth } from "@/lib/db/auth";

export async function GET() {
	try {
		const page = await getThemenPage();
		return NextResponse.json(page);
	} catch (error) {
		console.error("Error fetching themen page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch themen page" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "You must be logged in to update this page" },
				{ status: 401 }
			);
		}

		const body = await request.json();

		const validationResult = updateThemenPageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await updateThemenPage(
			validationResult.data as UpdateThemenPageInput
		);

		await revalidateThemenPage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating themen page:", error);
		return NextResponse.json(
			{ error: "Failed to update themen page" },
			{ status: 500 }
		);
	}
}
