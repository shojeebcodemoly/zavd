import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

/**
 * Next.js 16 Proxy (Middleware)
 * Handles:
 * 1. Internationalization (locale detection and routing)
 * 2. Route protection (authentication)
 * 3. Coming Soon mode redirect
 *
 * Better Auth stores session cookies automatically.
 * Cookie name: "better-auth.session_token" (Better Auth default)
 */

/**
 * Define which routes should be protected or processed
 */
export const config = {
	matcher: [
		// Match all paths except static files and Next.js internals
		"/((?!_next|_vercel|.*\\..*).*)",
	],
};

// Routes that should skip locale handling
const localeExcludedPaths = [
	"/api",
	"/dashboard",
	"/admin",
	"/login",
	"/sign-in",
	"/register",
	"/storage",
	"/icon",
	"/apple-icon",
];

// Routes that require authentication
const protectedPaths = [
	"/dashboard",
	"/profile",
	"/settings",
	"/admin",
];

// =============================================
// COMING SOON MODE - module-level cache
// =============================================
let _csEnabled: boolean = false;
let _csLastChecked: number = 0;
const CS_CACHE_TTL_MS = 30_000; // Re-check every 30 seconds

async function isComingSoonEnabled(baseUrl: string): Promise<boolean> {
	const now = Date.now();
	if (now - _csLastChecked < CS_CACHE_TTL_MS) {
		return _csEnabled;
	}
	try {
		const res = await fetch(`${baseUrl}/api/coming-soon-status`, {
			cache: "no-store",
		});
		const data = await res.json();
		_csEnabled = data.enabled === true;
	} catch {
		// On error keep previous value
	}
	_csLastChecked = now;
	return _csEnabled;
}

/**
 * Check if path starts with any of the given prefixes
 */
function pathStartsWith(pathname: string, prefixes: string[]): boolean {
	return prefixes.some(prefix => pathname.startsWith(prefix));
}

/**
 * Get locale from pathname
 */
function getLocaleFromPath(pathname: string): Locale | null {
	const segments = pathname.split("/");
	const firstSegment = segments[1];
	if (locales.includes(firstSegment as Locale)) {
		return firstSegment as Locale;
	}
	return null;
}

/**
 * Proxy function - runs before routes are rendered
 * Handles i18n routing and authentication
 */
export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	// Log the request (helpful for debugging)
	logger.debug("Proxy checking route", { pathname });

	// =============================================
	// 1. COMING SOON MODE REDIRECT
	// =============================================
	const isComingSoonPage =
		pathname === "/coming-soon" ||
		locales.some((l) => pathname === `/${l}/coming-soon`);
	const isExcluded = pathStartsWith(pathname, localeExcludedPaths) || isComingSoonPage;
	if (!isExcluded) {
		// Check auth - authenticated admins bypass coming soon
		const sessionToken =
			request.cookies.get("zavd.session_token")?.value ||
			request.cookies.get("__Secure-zavd.session_token")?.value;
		if (!sessionToken) {
			const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
			const comingSoon = await isComingSoonEnabled(baseUrl);
			if (comingSoon) {
				logger.debug("Coming soon mode active — redirecting", { pathname });
				const localeFromPath = getLocaleFromPath(pathname);
				const localeFromCookie = request.cookies.get("NEXT_LOCALE")?.value as Locale | undefined;
				const locale = localeFromPath || (locales.includes(localeFromCookie as Locale) ? localeFromCookie as Locale : defaultLocale);
				const redirectPath = locale === defaultLocale ? "/coming-soon" : `/${locale}/coming-soon`;
				return NextResponse.redirect(new URL(redirectPath, request.url));
			}
		}
	}

	// =============================================
	// 2. HANDLE LOCALE-EXCLUDED PATHS (no i18n)
	// =============================================
	if (pathStartsWith(pathname, localeExcludedPaths)) {
		// For protected paths, check authentication
		if (pathStartsWith(pathname, protectedPaths)) {
			const sessionToken =
				request.cookies.get("zavd.session_token")?.value ||
				request.cookies.get("__Secure-zavd.session_token")?.value;
			const isAuthenticated = !!sessionToken;

			// Handle API routes - return 401 JSON instead of redirect
			if (pathname.startsWith("/api/")) {
				if (!isAuthenticated) {
					logger.warn("Unauthorized API access attempt", { pathname });
					return NextResponse.json(
						{
							success: false,
							message: "Unauthorized - Authentication required",
							error: "UNAUTHORIZED",
						},
						{ status: 401 }
					);
				}
				return NextResponse.next();
			}

			// Handle page routes - redirect to login if not authenticated
			if (!isAuthenticated) {
				logger.info("Redirecting unauthenticated user to login", { pathname });
				const loginUrl = new URL("/login", request.url);
				loginUrl.searchParams.set("callbackUrl", pathname);
				return NextResponse.redirect(loginUrl);
			}
		}

		// Allow access to non-i18n routes
		return NextResponse.next();
	}

	// =============================================
	// 3. HANDLE I18N ROUTES
	// =============================================
	const pathnameLocale = getLocaleFromPath(pathname);

	// If pathname has a locale prefix
	if (pathnameLocale) {
		// If it's the default locale, redirect to remove the prefix
		// e.g., /en/about -> /about
		if (pathnameLocale === defaultLocale) {
			const newPathname = pathname.replace(`/${defaultLocale}`, "") || "/";
			const newUrl = new URL(newPathname, request.url);
			newUrl.search = request.nextUrl.search;
			return NextResponse.redirect(newUrl);
		}

		// Non-default locale with prefix - allow through
		// Set locale cookie for consistency
		const response = NextResponse.next();
		response.cookies.set("NEXT_LOCALE", pathnameLocale, { path: "/" });
		return response;
	}

	// No locale in pathname - this is for default locale (en)
	// Don't auto-redirect based on cookie - let users manually switch languages
	// The cookie is only used for persistence after manual language switch

	// Default locale - rewrite internally to include locale for routing
	// This makes /about internally route to /en/about so [locale] segment works
	const rewriteUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
	rewriteUrl.search = request.nextUrl.search;
	const response = NextResponse.rewrite(rewriteUrl);
	response.cookies.set("NEXT_LOCALE", defaultLocale, { path: "/" });
	return response;
}
