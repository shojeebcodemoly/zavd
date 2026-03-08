import { NextResponse } from "next/server";
import { siteSettingsRepository } from "@/lib/repositories/site-settings.repository";

// Force dynamic so this is never cached at the route level
export const dynamic = "force-dynamic";

/**
 * GET /api/coming-soon-status
 * Lightweight public endpoint — returns only whether coming soon mode is active.
 * Called by the middleware on every public request (with module-level caching).
 */
export async function GET() {
	try {
		const comingSoon = await siteSettingsRepository.getComingSoon();
		return NextResponse.json({ enabled: comingSoon.enabled ?? false });
	} catch {
		// If DB is unreachable, don't block the site
		return NextResponse.json({ enabled: false });
	}
}
