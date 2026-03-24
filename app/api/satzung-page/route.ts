import { NextRequest, NextResponse } from "next/server";
import { getSatzungPage, updateSatzungPage } from "@/lib/services/satzung-page.service";
import { updateSatzungPageSchema } from "@/lib/validations/satzung-page.validation";
import { revalidateSatzungPage } from "@/lib/revalidation/actions";
import type { UpdateSatzungPageInput } from "@/lib/repositories/satzung-page.repository";
import { getAuth } from "@/lib/db/auth";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const page = await getSatzungPage();
		return NextResponse.json(page);
	} catch (error) {
		console.error("Error fetching satzung page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch satzung page" },
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

		const validationResult = updateSatzungPageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await updateSatzungPage(
			validationResult.data as UpdateSatzungPageInput
		);

		await revalidateSatzungPage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating satzung page:", error);
		return NextResponse.json(
			{ error: "Failed to update satzung page" },
			{ status: 500 }
		);
	}
}
