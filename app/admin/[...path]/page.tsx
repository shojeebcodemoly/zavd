import { redirect } from "next/navigation";

interface AdminCatchAllProps {
	params: Promise<{ path: string[] }>;
}

/**
 * Redirect /admin/* to /dashboard/*
 * This ensures backward compatibility with old admin URLs
 */
export default async function AdminCatchAllPage({
	params,
}: AdminCatchAllProps) {
	const { path } = await params;
	const targetPath = path.join("/");
	redirect(`/dashboard/${targetPath}`);
}
