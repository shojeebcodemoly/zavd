import { NextRequest, NextResponse } from "next/server";
import { getGeschichtePage, updateGeschichtePage } from "@/lib/services/geschichte-page.service";
import { updateGeschichtePageSchema } from "@/lib/validations/geschichte-page.validation";
import { revalidateGeschichtePage } from "@/lib/revalidation/actions";
import type { UpdateGeschichtePageInput } from "@/lib/repositories/geschichte-page.repository";
import { getAuth } from "@/lib/db/auth";

export async function GET() {
	try {
		const page = await getGeschichtePage();
		return NextResponse.json(page);
	} catch (error) {
		console.error("Error fetching geschichte page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch geschichte page" },
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

		const validationResult = updateGeschichtePageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await updateGeschichtePage(
			validationResult.data as UpdateGeschichtePageInput
		);

		await revalidateGeschichtePage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating geschichte page:", error);
		return NextResponse.json(
			{ error: "Failed to update geschichte page" },
			{ status: 500 }
		);
	}
}
