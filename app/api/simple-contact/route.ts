import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { connectMongoose } from "@/lib/db/db-connect";
import { getFormSubmissionModel } from "@/models/form-submission.model";
import {

export const dynamic = "force-dynamic";
	createdResponse,
	badRequestResponse,
	internalServerErrorResponse,
} from "@/lib/utils/api-response";

const simpleContactSchema = z.object({
	fullName: z.string().min(2, "Name is required").max(100).trim(),
	email: z.string().email("Invalid email").max(255).trim(),
	phone: z.string().max(50).optional().or(z.literal("")),
	message: z.string().min(5, "Message is required").max(2000).trim(),
	newsletter: z.boolean().optional(),
	pageUrl: z.string().optional(),
});

/**
 * POST /api/simple-contact
 * Simple contact form submission for the Kontakt page
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const result = simpleContactSchema.safeParse(body);
		if (!result.success) {
			return badRequestResponse("Validation failed", result.error.issues);
		}

		const data = result.data;

		const headersList = await headers();
		const ipAddress =
			headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
			headersList.get("x-real-ip") ||
			"unknown";

		await connectMongoose();
		const FormSubmission = await getFormSubmissionModel();

		const submission = await FormSubmission.create({
			type: "contact",
			fullName: data.fullName,
			email: data.email,
			phone: data.phone || "",
			countryCode: "",
			countryName: "",
			message: data.message,
			gdprConsent: true,
			marketingConsent: data.newsletter || false,
			status: "new",
			metadata: {
				ipAddress,
				userAgent: headersList.get("user-agent") || "unknown",
				pageUrl: data.pageUrl || headersList.get("referer") || "unknown",
				submittedAt: new Date(),
			},
		});

		return createdResponse(
			{ id: submission._id },
			"Message sent successfully"
		);
	} catch (error) {
		console.error("Simple contact form error:", error);
		return internalServerErrorResponse("Failed to send message");
	}
}
