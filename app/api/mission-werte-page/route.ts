import { NextRequest, NextResponse } from "next/server";
import { getMissionWertePage, updateMissionWertePage } from "@/lib/services/mission-werte-page.service";
import { updateMissionWertePageSchema } from "@/lib/validations/mission-werte-page.validation";
import { revalidateMissionWertePage } from "@/lib/revalidation/actions";
import type { UpdateMissionWertePageInput } from "@/lib/repositories/mission-werte-page.repository";
import { getAuth } from "@/lib/db/auth";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const page = await getMissionWertePage();
		return NextResponse.json(page);
	} catch (error) {
		console.error("Error fetching mission-werte page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch mission-werte page" },
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

		const validationResult = updateMissionWertePageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await updateMissionWertePage(
			validationResult.data as UpdateMissionWertePageInput
		);

		await revalidateMissionWertePage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating mission-werte page:", error);
		return NextResponse.json(
			{ error: "Failed to update mission-werte page" },
			{ status: 500 }
		);
	}
}
