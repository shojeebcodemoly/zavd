import { NextRequest, NextResponse } from "next/server";
import { getTeamPage, updateTeamPage } from "@/lib/services/team-page.service";
import { updateTeamPageSchema } from "@/lib/validations/team-page.validation";
import { revalidateTeamPage } from "@/lib/revalidation/actions";

/**
 * GET /api/team-page
 * Fetch team page content
 */
export async function GET() {
	try {
		const teamPage = await getTeamPage();
		return NextResponse.json(teamPage);
	} catch (error) {
		console.error("Error fetching team page:", error);
		return NextResponse.json(
			{ error: "Failed to fetch team page" },
			{ status: 500 }
		);
	}
}

/**
 * PUT /api/team-page
 * Update team page content
 */
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate input
		const validationResult = updateTeamPageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Validation failed",
					details: validationResult.error.flatten(),
				},
				{ status: 400 }
			);
		}

		const updatedPage = await updateTeamPage(validationResult.data);

		// Revalidate ISR cache
		await revalidateTeamPage();

		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating team page:", error);
		return NextResponse.json(
			{ error: "Failed to update team page" },
			{ status: 500 }
		);
	}
}
