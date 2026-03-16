import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { nachrichtenPageRepository } from "@/lib/repositories/nachrichten-page.repository";

export async function GET() {
	try {
		const page = await nachrichtenPageRepository.get();
		return NextResponse.json({ data: page });
	} catch (error) {
		return NextResponse.json({ message: "Failed to fetch nachrichten page" }, { status: 500 });
	}
}

export async function PUT(request: Request) {
	try {
		const body = await request.json();
		const page = await nachrichtenPageRepository.update(body);

		revalidateTag("nachrichten-page");
		revalidatePath("/aktuelles/nachrichten");
		revalidatePath("/de/aktuelles/nachrichten");
		revalidatePath("/en/aktuelles/nachrichten");

		return NextResponse.json({ data: page });
	} catch (error) {
		return NextResponse.json({ message: "Failed to update nachrichten page" }, { status: 500 });
	}
}
