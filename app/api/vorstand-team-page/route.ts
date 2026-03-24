import { NextRequest, NextResponse } from "next/server";
import { getVorstandTeamPage, updateVorstandTeamPage } from "@/lib/services/vorstand-team-page.service";
import { updateVorstandTeamPageSchema } from "@/lib/validations/vorstand-team-page.validation";
import { revalidateVorstandTeamPage } from "@/lib/revalidation/actions";
import type { UpdateVorstandTeamPageInput } from "@/lib/repositories/vorstand-team-page.repository";
import { getAuth } from "@/lib/db/auth";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const page = await getVorstandTeamPage();
		return NextResponse.json(page);
	} catch (error) {
		console.error("Error fetching vorstand-team page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch vorstand-team page" },
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

		const validationResult = updateVorstandTeamPageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await updateVorstandTeamPage(
			validationResult.data as UpdateVorstandTeamPageInput
		);

		await revalidateVorstandTeamPage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating vorstand-team page:", error);
		return NextResponse.json(
			{ error: "Failed to update vorstand-team page" },
			{ status: 500 }
		);
	}
}
