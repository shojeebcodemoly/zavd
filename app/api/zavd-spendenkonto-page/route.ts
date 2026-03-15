import { NextRequest, NextResponse } from "next/server";
import { getZavdSpendenkontoPage, updateZavdSpendenkontoPage } from "@/lib/services/zavd-spendenkonto-page.service";
import { updateZavdSpendenkontoPageSchema } from "@/lib/validations/zavd-spendenkonto-page.validation";
import { revalidateZavdSpendenkontoPage } from "@/lib/revalidation/actions";
import type { UpdateZavdSpendenkontoPageInput } from "@/lib/repositories/zavd-spendenkonto-page.repository";
import { getAuth } from "@/lib/db/auth";

export async function GET() {
	try {
		const page = await getZavdSpendenkontoPage();
		return NextResponse.json(page);
	} catch (error) {
		console.error("Error fetching zavd-spendenkonto page:", error);
		return NextResponse.json({ error: "Failed to fetch zavd-spendenkonto page" }, { status: 500 });
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
		const validationResult = updateZavdSpendenkontoPageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json({ error: "Validation failed", details: validationResult.error.flatten() }, { status: 400 });
		}
		const updatedPage = await updateZavdSpendenkontoPage(validationResult.data as UpdateZavdSpendenkontoPageInput);
		await revalidateZavdSpendenkontoPage();
		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating zavd-spendenkonto page:", error);
		return NextResponse.json({ error: "Failed to update zavd-spendenkonto page" }, { status: 500 });
	}
}
