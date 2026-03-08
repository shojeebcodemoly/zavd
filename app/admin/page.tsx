import { redirect } from "next/navigation";

/**
 * Redirect /admin to /dashboard
 * This ensures backward compatibility with old admin URLs
 */
export default function AdminPage() {
	redirect("/dashboard");
}
