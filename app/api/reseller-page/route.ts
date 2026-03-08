import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/db/auth";
import {
	getResellerPage,
	updateResellerPage,
} from "@/lib/services/reseller-page.service";
import { updateResellerPageSchema } from "@/lib/validations/reseller-page.validation";
import type { UpdateResellerPageInput } from "@/lib/repositories/reseller-page.repository";
import { logger } from "@/lib/utils/logger";

/**
 * GET /api/reseller-page
 * Public endpoint - Get reseller page content
 */
export async function GET() {
	try {
		const data = await getResellerPage();
		return NextResponse.json(data);
	} catch (error) {
		logger.error("Error fetching reseller page", error);
		return NextResponse.json(
			{ error: "Failed to fetch reseller page" },
			{ status: 500 }
		);
	}
}

/**
 * PUT /api/reseller-page
 * Protected endpoint - Update reseller page content (admin only)
 */
export async function PUT(request: NextRequest) {
	try {
		// Check authentication
		const auth = await getAuth();
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 }
			);
		}

		const body = await request.json();

		// Validate input
		const validationResult = updateResellerPageSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{ error: "Validation failed", issues: validationResult.error.issues },
				{ status: 400 }
			);
		}

		const data = await updateResellerPage(validationResult.data as UpdateResellerPageInput);

		logger.info("Reseller page updated successfully");

		return NextResponse.json(data);
	} catch (error) {
		logger.error("Error updating reseller page", error);
		return NextResponse.json(
			{ error: "Failed to update reseller page" },
			{ status: 500 }
		);
	}
}
