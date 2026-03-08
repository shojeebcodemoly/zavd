import { headers } from "next/headers";
import { getAuth } from "@/lib/db/auth";
import { formSubmissionService } from "@/lib/services/form-submission.service";
import { InquiriesList } from "./inquiries-list";
import type {
	FormSubmissionType,
	FormSubmissionStatus,
} from "@/models/form-submission.model";

interface PageProps {
	searchParams: Promise<{
		page?: string;
		search?: string;
		status?: string;
		type?: string;
	}>;
}

/**
 * Inquiries Dashboard Page - Server Component
 * Fetches initial data on the server and passes to client component
 */
export default async function InquiriesPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const page = parseInt(params.page || "1", 10);
	const search = params.search || "";
	const status = (params.status || "") as FormSubmissionStatus | "";
	const type = (params.type || "") as FormSubmissionType | "";

	// Get session from server
	const auth = await getAuth();
	const headersList = await headers();
	const session = await auth.api.getSession({ headers: headersList });

	// Initialize data
	let submissions: Awaited<
		ReturnType<typeof formSubmissionService.getSubmissions>
	>["data"] = [];
	let totalPages = 1;
	let total = 0;
	let stats = null;

	if (session?.user?.id) {
		try {
			const result = await formSubmissionService.getSubmissions({
				page,
				limit: 20,
				search: search || undefined,
				status: status || undefined,
				type: type || undefined,
				sort: "-createdAt",
			});

			submissions = result.data;
			totalPages = result.totalPages;
			total = result.total;

			// Fetch stats
			stats = await formSubmissionService.getStats();
		} catch (error) {
			console.error("Failed to fetch submissions:", error);
		}
	}

	return (
		<InquiriesList
			initialSubmissions={submissions.map((s) => ({
				_id: s._id.toString(),
				type: s.type,
				status: s.status,
				fullName: s.fullName,
				email: s.email,
				phone: s.phone,
				countryCode: s.countryCode,
				countryName: s.countryName,
				productName: s.productName || null,
				productSlug: s.productSlug || null,
				helpType: s.helpType || null,
				trainingInterestType: s.trainingInterestType || null,
				subject: s.subject || null,
				preferredDate: s.preferredDate?.toISOString() || null,
				preferredTime: s.preferredTime || null,
				createdAt: s.createdAt.toISOString(),
			}))}
			initialStats={stats}
			initialPage={page}
			initialTotalPages={totalPages}
			initialTotal={total}
			initialSearch={search}
			initialStatus={status}
			initialType={type}
		/>
	);
}
