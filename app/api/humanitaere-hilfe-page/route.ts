import { NextRequest, NextResponse } from "next/server";
import { getHumanitaereHilfePage, updateHumanitaereHilfePage } from "@/lib/services/humanitaere-hilfe-page.service";
import { updateHumanitaereHilfePageSchema } from "@/lib/validations/humanitaere-hilfe-page.validation";
import { revalidateHumanitaereHilfePage } from "@/lib/revalidation/actions";
import type { UpdateHumanitaereHilfePageInput } from "@/lib/repositories/humanitaere-hilfe-page.repository";
import { getAuth } from "@/lib/db/auth";

export async function GET() {
	try {
		const page = await getHumanitaereHilfePage();
		return NextResponse.json(page);
	} catch (error) {
		console.error("Error fetching humanitaere-hilfe page:", error);
		return NextResponse.json({ error: "Failed to fetch humanitaere-hilfe page" }, { status: 500 });
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
		const validationResult = updateHumanitaereHilfePageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json({ error: "Validation failed", details: validationResult.error.flatten() }, { status: 400 });
		}
		const updatedPage = await updateHumanitaereHilfePage(validationResult.data as UpdateHumanitaereHilfePageInput);
		await revalidateHumanitaereHilfePage();
		return NextResponse.json(updatedPage);
	} catch (error) {
		console.error("Error updating humanitaere-hilfe page:", error);
		return NextResponse.json({ error: "Failed to update humanitaere-hilfe page" }, { status: 500 });
	}
}
