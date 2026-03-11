"use client";

import { Construction } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

interface PlaceholderPageProps {
	titleDe: string;
	titleEn: string;
	backHref?: string;
	backLabelDe?: string;
	backLabelEn?: string;
}

export function PlaceholderPage({
	titleDe,
	titleEn,
	backHref = "/",
	backLabelDe = "Zurück zur Startseite",
	backLabelEn = "Back to Home",
}: PlaceholderPageProps) {
	const locale = useLocale();
	const isEn = locale === "en";

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 pt-24">
			<div className="max-w-md w-full text-center space-y-6">
				<div className="flex justify-center">
					<div className="bg-primary/10 rounded-full p-6">
						<Construction className="h-12 w-12 text-primary" />
					</div>
				</div>
				<div className="space-y-2">
					<h1 className="text-3xl font-bold text-gray-900">
						{isEn ? titleEn : titleDe}
					</h1>
					<p className="text-gray-500 text-sm">
						{isEn ? titleDe : titleEn}
					</p>
				</div>
				<div className="bg-white border border-gray-200 rounded-lg p-6 space-y-2">
					<p className="text-gray-700 font-medium">
						{isEn ? "Content Coming Soon" : "Inhalt folgt in Kürze"}
					</p>
					<p className="text-gray-500 text-sm">
						{isEn
							? "This page is currently under construction. Please visit us again soon."
							: "Diese Seite befindet sich derzeit im Aufbau. Bitte besuchen Sie uns bald wieder."}
					</p>
				</div>
				<Link
					href={backHref}
					className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
				>
					← {isEn ? backLabelEn : backLabelDe}
				</Link>
			</div>
		</div>
	);
}
