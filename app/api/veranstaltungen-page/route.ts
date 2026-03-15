import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { veranstaltungenPageRepository } from "@/lib/repositories/veranstaltungen-page.repository";

export async function GET() {
	try {
		const page = await veranstaltungenPageRepository.get();
		return NextResponse.json({ data: page });
	} catch {
		return NextResponse.json({ message: "Failed to fetch veranstaltungen page" }, { status: 500 });
	}
}

export async function PUT(request: Request) {
	try {
		const body = await request.json();
		const page = await veranstaltungenPageRepository.update(body);
		revalidateTag("veranstaltungen-page");
		revalidatePath("/aktuelles/veranstaltungen", "layout");
		revalidatePath("/de/aktuelles/veranstaltungen", "layout");
		revalidatePath("/en/aktuelles/veranstaltungen", "layout");
		return NextResponse.json({ data: page });
	} catch {
		return NextResponse.json({ message: "Failed to update veranstaltungen page" }, { status: 500 });
	}
}
