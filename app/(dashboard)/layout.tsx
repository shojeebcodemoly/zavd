import { NuqsAdapter } from "nuqs/adapters/next/app";
import { DashboardShell } from "@/components/admin";

/**
 * Dashboard Layout - Server Component
 *
 * Authentication is handled by proxy.ts middleware.
 * This layout simply wraps children with the dashboard shell.
 */
export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Proxy middleware handles auth redirect before this runs
	// No need for client-side auth checks
	return (
		<NuqsAdapter>
			<DashboardShell>{children}</DashboardShell>
		</NuqsAdapter>
	);
}
