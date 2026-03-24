import { NextRequest, NextResponse } from "next/server";
import { getSpendenPage, updateSpendenPage } from "@/lib/services/spenden-page.service";
import { updateSpendenPageSchema } from "@/lib/validations/spenden-page.validation";
import { revalidateSpendenPage } from "@/lib/revalidation/actions";
import type { UpdateSpendenPageInput } from "@/lib/repositories/spenden-page.repository";
import { getAuth } from "@/lib/db/auth";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const page = await getSpendenPage();
		return NextResponse.json(page);
	} catch (error) {
		console.error("Error fetching spenden page:", error);
		return NextResponse.json({ error: "Failed to fetch spenden page" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const auth = await getAuth();
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session?.user?.id) {
			return NextResponse.json({ error: "You must be logged in to update this page" }, { status: 401 });
		}
		const body = await request.json();
		const validationResult = updateSpendenPageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json({ error: "Validation failed", details: validationResult.error.flatten() }, { status: 400 });
		}
		const updatedPage = await updateSpendenPage(validationResult.data as UpdateSpendenPageInput);
		await revalidateSpendenPage();
		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating spenden page:", error);
		return NextResponse.json({ error: "Failed to update spenden page" }, { status: 500 });
	}
}
