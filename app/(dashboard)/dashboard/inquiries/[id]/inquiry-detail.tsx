"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Mail,
	Phone,
	MapPin,
	Building,
	Calendar,
	Globe,
	FileText,
	Shield,
	Archive,
	Trash2,
	CheckCircle,
	ExternalLink,
	Copy,
	Clock,
	User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { FormSubmissionType, FormSubmissionStatus, HelpType, TrainingInterestType } from "@/models/form-submission.model";

interface SubmissionDetail {
	_id: string;
	type: FormSubmissionType;
	status: FormSubmissionStatus;
	fullName: string;
	email: string;
	phone: string;
	countryCode: string;
	countryName: string;
	corporationNumber: string | null;
	message: string | null;
	gdprConsent: boolean;
	gdprConsentTimestamp: string;
	gdprConsentVersion: string;
	marketingConsent: boolean;
	productId: string | null;
	productName: string | null;
	productSlug: string | null;
	helpType: HelpType | null;
	trainingInterestType: TrainingInterestType | null;
	subject: string | null;
	preferredDate: string | null;
	preferredTime: string | null;
	metadata: {
		ipAddress: string;
		userAgent: string;
		referrer: string | null;
		pageUrl: string;
		locale: string | null;
		submittedAt: string;
	};
	readAt: string | null;
	readBy: string | null;
	createdAt: string;
	updatedAt: string;
}

interface InquiryDetailProps {
	submission: SubmissionDetail;
}

const statusColors: Record<FormSubmissionStatus, string> = {
	new: "bg-blue-100 text-blue-800",
	read: "bg-green-100 text-green-800",
	archived: "bg-slate-100 text-slate-600",
};

const helpTypeLabels: Record<HelpType, string> = {
	clinic_buy: "I run a clinic/salon and want to buy this product",
	start_business: "I want to start my own business and learn more about the product",
	just_interested: "I am just interested and want to know more",
	buy_contact: "I want to buy this product and get in touch with you",
};

const trainingInterestTypeLabels: Record<TrainingInterestType, string> = {
	machine_purchase: "I plan to buy a machine and want to learn more about the training",
	already_customer: "I am already a customer and want to book training",
	certification_info: "I want to learn more about certification as a Synos therapist",
	general_info: "I want general information about your training programs",
};

export function InquiryDetail({ submission }: InquiryDetailProps) {
	const router = useRouter();
	const [currentStatus, setCurrentStatus] = React.useState(submission.status);
	const [isUpdating, setIsUpdating] = React.useState(false);

	const { confirm, ConfirmModal } = useConfirmModal({
		variant: "destructive",
	});

	const handleStatusUpdate = async (newStatus: FormSubmissionStatus) => {
		setIsUpdating(true);
		try {
			const response = await fetch(`/api/form-submissions/${submission._id}/status`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: newStatus }),
			});

			if (response.ok) {
				setCurrentStatus(newStatus);
				toast.success(`Status updated to ${newStatus}`);
			} else {
				const data = await response.json();
				toast.error(data.message || "Failed to update status");
			}
		} catch (error) {
			console.error("Failed to update status:", error);
			toast.error("Failed to update status");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleDelete = async () => {
		const confirmed = await confirm({
			title: "Delete Submission",
			description:
				"Are you sure you want to delete this submission? This action cannot be undone.",
			confirmText: "Delete",
		});

		if (!confirmed) return;

		try {
			const response = await fetch(`/api/form-submissions/${submission._id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				toast.success("Submission deleted");
				router.push("/dashboard/inquiries");
			} else {
				const data = await response.json();
				toast.error(data.message || "Failed to delete");
			}
		} catch (error) {
			console.error("Failed to delete:", error);
			toast.error("Failed to delete submission");
		}
	};

	const copyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`${label} copied to clipboard`);
	};

	return (
		<>
			<ConfirmModal />
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/dashboard/inquiries">
							<Button variant="outline" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-medium">{submission.fullName}</h1>
								<Badge className={statusColors[currentStatus]}>
									{currentStatus}
								</Badge>
							</div>
							<p className="text-slate-600">
								Submitted {new Date(submission.createdAt).toLocaleDateString("sv-SE", {
									year: "numeric",
									month: "long",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						{currentStatus !== "read" && (
							<Button
								variant="outline"
								onClick={() => handleStatusUpdate("read")}
								disabled={isUpdating}
							>
								<CheckCircle className="h-4 w-4 mr-2" />
								Mark Read
							</Button>
						)}
						{currentStatus !== "archived" && (
							<Button
								variant="outline"
								onClick={() => handleStatusUpdate("archived")}
								disabled={isUpdating}
							>
								<Archive className="h-4 w-4 mr-2" />
								Archive
							</Button>
						)}
						<Button variant="destructive" onClick={handleDelete}>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Contact Information */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<User className="h-5 w-5" />
									Contact Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-sm text-slate-500">Full Name</label>
										<div className="flex items-center gap-2">
											<p className="font-medium">{submission.fullName}</p>
											<button
												onClick={() => copyToClipboard(submission.fullName, "Name")}
												className="p-1 hover:bg-slate-100 rounded"
											>
												<Copy className="h-3 w-3 text-slate-400" />
											</button>
										</div>
									</div>
									<div className="space-y-1">
										<label className="text-sm text-slate-500">Email</label>
										<div className="flex items-center gap-2">
											<Mail className="h-4 w-4 text-slate-400" />
											<a
												href={`mailto:${submission.email}`}
												className="font-medium text-primary hover:underline"
											>
												{submission.email}
											</a>
											<button
												onClick={() => copyToClipboard(submission.email, "Email")}
												className="p-1 hover:bg-slate-100 rounded"
											>
												<Copy className="h-3 w-3 text-slate-400" />
											</button>
										</div>
									</div>
									<div className="space-y-1">
										<label className="text-sm text-slate-500">Phone</label>
										<div className="flex items-center gap-2">
											<Phone className="h-4 w-4 text-slate-400" />
											<a
												href={`tel:${submission.countryCode}${submission.phone}`}
												className="font-medium text-primary hover:underline"
											>
												{submission.countryCode} {submission.phone}
											</a>
											<button
												onClick={() =>
													copyToClipboard(
														`${submission.countryCode}${submission.phone}`,
														"Phone"
													)
												}
												className="p-1 hover:bg-slate-100 rounded"
											>
												<Copy className="h-3 w-3 text-slate-400" />
											</button>
										</div>
									</div>
									<div className="space-y-1">
										<label className="text-sm text-slate-500">Country</label>
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-slate-400" />
											<p className="font-medium">{submission.countryName}</p>
										</div>
									</div>
									{submission.corporationNumber && (
										<div className="space-y-1">
											<label className="text-sm text-slate-500">Corporation Number</label>
											<div className="flex items-center gap-2">
												<Building className="h-4 w-4 text-slate-400" />
												<p className="font-medium">{submission.corporationNumber}</p>
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Product Interest (if applicable) */}
						{submission.productName && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<FileText className="h-5 w-5" />
										Product Interest
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-1">
										<label className="text-sm text-slate-500">Product</label>
										<div className="flex items-center gap-2">
											<p className="font-medium">{submission.productName}</p>
											{submission.productSlug && (
												<Link
													href={`/products/category/uncategorized/${submission.productSlug}`}
													target="_blank"
													className="text-primary hover:underline flex items-center gap-1 text-sm"
												>
													<ExternalLink className="h-3 w-3" />
													View
												</Link>
											)}
										</div>
									</div>
									{submission.helpType && (
										<div className="space-y-1">
											<label className="text-sm text-slate-500">How can we help?</label>
											<div className="bg-slate-50 p-3 rounded-lg">
												<p className="text-sm">
													{helpTypeLabels[submission.helpType]}
												</p>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						)}

						{/* Training Interest (if applicable) */}
						{submission.type === "training_inquiry" && submission.trainingInterestType && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<FileText className="h-5 w-5" />
										Training Interest
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-1">
										<label className="text-sm text-slate-500">What are you interested in?</label>
										<div className="bg-slate-50 p-3 rounded-lg">
											<p className="text-sm">
												{trainingInterestTypeLabels[submission.trainingInterestType]}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Contact Subject (if applicable) */}
						{submission.type === "contact" && submission.subject && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<FileText className="h-5 w-5" />
										Contact Subject
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="bg-slate-50 p-3 rounded-lg">
										<p className="font-medium">{submission.subject}</p>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Callback Request Details (if applicable) */}
						{submission.type === "callback_request" && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Phone className="h-5 w-5" />
										Callback Request Details
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-1">
											<label className="text-sm text-slate-500">Preferred Date</label>
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-slate-400" />
												<p className="font-medium">
													{submission.preferredDate
														? new Date(submission.preferredDate).toLocaleDateString("sv-SE", {
																weekday: "long",
																year: "numeric",
																month: "long",
																day: "numeric",
														  })
														: "Not specified"}
												</p>
											</div>
										</div>
										<div className="space-y-1">
											<label className="text-sm text-slate-500">Preferred Time</label>
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-slate-400" />
												<p className="font-medium">{submission.preferredTime || "Not specified"}</p>
											</div>
										</div>
									</div>
									<div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
										<p className="text-sm text-primary font-medium flex items-center gap-2">
											<Phone className="h-4 w-4" />
											Call this number: {submission.countryCode} {submission.phone}
										</p>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Message */}
						{submission.message && (
							<Card>
								<CardHeader>
									<CardTitle>Message</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">
										{submission.message}
									</div>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Consent Information */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<Shield className="h-4 w-4" />
									Consent
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-slate-600">GDPR Consent</span>
									<Badge variant={submission.gdprConsent ? "default" : "outline"}>
										{submission.gdprConsent ? "Yes" : "No"}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm text-slate-600">Marketing</span>
									<Badge variant={submission.marketingConsent ? "default" : "secondary"}>
										{submission.marketingConsent ? "Yes" : "No"}
									</Badge>
								</div>
								<div className="text-xs text-slate-500 pt-2 border-t">
									Consent given: {new Date(submission.gdprConsentTimestamp).toLocaleDateString("sv-SE")}
									<br />
									Policy version: {submission.gdprConsentVersion}
								</div>
							</CardContent>
						</Card>

						{/* Metadata */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<Globe className="h-4 w-4" />
									Metadata
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								<div>
									<label className="text-slate-500">Submitted At</label>
									<div className="flex items-center gap-1 font-medium">
										<Calendar className="h-3 w-3" />
										{new Date(submission.metadata.submittedAt).toLocaleString("sv-SE")}
									</div>
								</div>
								<div>
									<label className="text-slate-500">IP Address</label>
									<p className="font-mono text-xs">{submission.metadata.ipAddress}</p>
								</div>
								<div>
									<label className="text-slate-500">Page URL</label>
									<p className="text-xs truncate">{submission.metadata.pageUrl}</p>
								</div>
								{submission.metadata.referrer && (
									<div>
										<label className="text-slate-500">Referrer</label>
										<p className="text-xs truncate">{submission.metadata.referrer}</p>
									</div>
								)}
								<div>
									<label className="text-slate-500">User Agent</label>
									<p className="text-xs text-slate-600 line-clamp-2">
										{submission.metadata.userAgent}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Timeline */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<Clock className="h-4 w-4" />
									Timeline
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								<div className="flex items-start gap-3">
									<div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
									<div>
										<p className="font-medium">Created</p>
										<p className="text-slate-500">
											{new Date(submission.createdAt).toLocaleString("sv-SE")}
										</p>
									</div>
								</div>
								{submission.readAt && (
									<div className="flex items-start gap-3">
										<div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
										<div>
											<p className="font-medium">Read</p>
											<p className="text-slate-500">
												{new Date(submission.readAt).toLocaleString("sv-SE")}
											</p>
										</div>
									</div>
								)}
								{submission.updatedAt !== submission.createdAt && (
									<div className="flex items-start gap-3">
										<div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5" />
										<div>
											<p className="font-medium">Last Updated</p>
											<p className="text-slate-500">
												{new Date(submission.updatedAt).toLocaleString("sv-SE")}
											</p>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
