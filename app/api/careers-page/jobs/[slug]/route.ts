import { NextRequest, NextResponse } from "next/server";
import { careersPageService } from "@/lib/services/careers-page.service";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;

		if (!slug) {
			return NextResponse.json(
				{ error: "Job slug is required" },
				{ status: 400 }
			);
		}

		const job = await careersPageService.getJobBySlug(slug);

		if (!job) {
			return NextResponse.json(
				{ error: "Job not found" },
				{ status: 404 }
			);
		}

		// Also get page data for contact sidebar info
		const pageData = await careersPageService.getPublicCareersPage();

		return NextResponse.json({
			job,
			contactSidebar: pageData.contactSidebar,
			expertCta: pageData.expertCta,
		});
	} catch (error) {
		console.error("Error fetching job:", error);
		return NextResponse.json(
			{ error: "Failed to fetch job data" },
			{ status: 500 }
		);
	}
}
