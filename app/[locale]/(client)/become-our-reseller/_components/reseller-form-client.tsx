"use client";

import dynamic from "next/dynamic";

const ResellerApplicationFormDynamic = dynamic(
	() =>
		import("@/components/forms/ResellerApplicationForm").then((m) => ({
			default: m.ResellerApplicationForm,
		})),
	{ ssr: false }
);

interface ResellerFormClientProps {
	successMessage?: string;
	successDescription?: string;
}

export function ResellerFormClient({
	successMessage,
	successDescription,
}: ResellerFormClientProps) {
	return (
		<ResellerApplicationFormDynamic
			successMessage={successMessage}
			successDescription={successDescription}
		/>
	);
}
