"use client";

import { AdminSidebar } from "./AdminSidebar";

interface DashboardShellProps {
	children: React.ReactNode;
}

/**
 * Client-side dashboard shell with sidebar
 * Wraps dashboard content with navigation
 */
export function DashboardShell({ children }: DashboardShellProps) {
	return (
		<div className="flex min-h-screen bg-slate-50">
			{/* Sidebar */}
			<AdminSidebar />

			{/* Main Content */}
			<main className="flex-1 min-w-0 overflow-auto">
				{/* Extra top padding on mobile to account for menu button */}
				<div className="p-4 pt-16 lg:pt-6 lg:p-6">{children}</div>
			</main>
		</div>
	);
}
