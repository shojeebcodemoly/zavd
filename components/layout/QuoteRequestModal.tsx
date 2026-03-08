"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	X,
	User,
	Mail,
	Phone,
	Send,
	Loader2,
	CheckCircle2,
	FileText,
	Building2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
	CountryCodeSelect,
	defaultCountry,
	type Country,
} from "@/components/ui/country-code-select";

// Create form schema with translations
const createQuoteFormSchema = (t: (key: string) => string) =>
	z.object({
		fullName: z
			.string()
			.min(2, t("validation.nameMin"))
			.max(100, t("validation.nameMax")),
		email: z.string().email(t("validation.emailInvalid")),
		countryCode: z.string().min(2, t("validation.countryCodeRequired")),
		phone: z
			.string()
			.min(6, t("validation.phoneMin"))
			.max(20, t("validation.phoneMax")),
		companyName: z
			.string()
			.max(200, t("validation.companyNameMax"))
			.optional(),
		message: z
			.string()
			.max(2000, t("validation.messageMax"))
			.optional(),
		gdprConsent: z.literal(true, {
			message: t("validation.gdprRequired"),
		}),
	});

type FormData = z.infer<ReturnType<typeof createQuoteFormSchema>>;

interface QuoteRequestModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function QuoteRequestModal({
	open,
	onOpenChange,
}: QuoteRequestModalProps) {
	const t = useTranslations("quoteModal");
	const tCommon = useTranslations("common");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [selectedCountry, setSelectedCountry] =
		useState<Country>(defaultCountry);
	const [gdprChecked, setGdprChecked] = useState(false);

	// Create schema with translated messages
	const quoteFormSchema = createQuoteFormSchema(t);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		setError,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(quoteFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			countryCode: defaultCountry.dialCode,
			phone: "",
			companyName: "",
			message: "",
			gdprConsent: undefined as unknown as true,
		},
	});

	const handleCountryChange = (country: Country) => {
		setSelectedCountry(country);
		setValue("countryCode", country.dialCode);
	};

	const handleGdprChange = (checked: boolean) => {
		setGdprChecked(checked);
		setValue("gdprConsent", checked as unknown as true);
	};

	const handleClose = () => {
		onOpenChange(false);
		// Reset after animation
		setTimeout(() => {
			setIsSuccess(false);
			reset();
			setGdprChecked(false);
			setSelectedCountry(defaultCountry);
		}, 200);
	};

	const onSubmit = async (data: FormData) => {
		// Frontend phone validation
		const fullPhone = data.countryCode + data.phone.replace(/[\s\-]/g, "");
		if (!isValidPhoneNumber(fullPhone)) {
			setError("phone", {
				type: "manual",
				message: t("validation.phoneInvalid"),
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/form-submissions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					type: "quote_request",
					...data,
					pageUrl: window.location.href,
				}),
			});

			const result = await response.json();

			if (result.success) {
				setIsSuccess(true);
				reset();
				setGdprChecked(false);
				setSelectedCountry(defaultCountry);
			} else {
				if (result.errors && Array.isArray(result.errors)) {
					const fieldErrors = result.errors
						.filter(
							(err: { path?: string[]; message?: string }) =>
								err.path && err.message
						)
						.map(
							(err: { path?: string[]; message?: string }) => err.message
						)
						.join(", ");
					toast.error(
						fieldErrors ||
							result.message ||
							t("errors.generic")
					);
				} else {
					toast.error(result.message || t("errors.generic"));
				}
			}
		} catch (error) {
			console.error("Form submission error:", error);
			toast.error(t("errors.genericLater"));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={cn(
					"max-w-[360px] sm:max-w-lg p-0 overflow-hidden border-0 max-h-[90vh]",
					isSuccess ? "bg-white" : "bg-secondary/95"
				)}
				hideCloseButton
			>
				{/* Success State */}
				{isSuccess && (
					<div className="relative">
						{/* Top gradient accent */}
						<div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

						{/* Close Button */}
						<button
							onClick={handleClose}
							className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
							aria-label={tCommon("close")}
						>
							<X className="w-4 h-4" />
						</button>

						<div className="px-6 pt-10 pb-6 text-center">
							{/* Success Icon */}
							<div className="relative w-16 h-16 mx-auto">
								<div className="absolute inset-0 rounded-full border-3 border-emerald-100" />
								<div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
									<CheckCircle2
										className="w-7 h-7 text-white"
										strokeWidth={2}
									/>
								</div>
							</div>

							{/* Success Message */}
							<h2 className="mt-5 text-xl font-bold text-slate-800">
								{t("success.title")}
							</h2>
							<p className="mt-2 text-sm text-slate-500 leading-relaxed">
								{t("success.message")}
							</p>

							{/* Close Button */}
							<Button
								onClick={handleClose}
								className="mt-6 w-full h-10 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
							>
								{tCommon("close")}
							</Button>
						</div>
					</div>
				)}

				{/* Form State */}
				{!isSuccess && (
					<div className="flex flex-col max-h-[90vh]">
						{/* Header - Fixed */}
						<div className="relative pt-5 pb-4 px-5 text-center text-white shrink-0">
							{/* Close Button */}
							<button
								onClick={handleClose}
								className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
								aria-label={tCommon("close")}
							>
								<X className="w-4 h-4" />
							</button>

							{/* Icon */}
							<div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
								<FileText className="w-6 h-6 text-primary" />
							</div>

							<DialogTitle className="text-lg font-semibold">
								{t("title")}
							</DialogTitle>

							<p className="mt-1 text-white/80 text-xs">
								{t("subtitle")}
							</p>
						</div>

						{/* Form Content - Scrollable */}
						<div className="bg-white rounded-t-2xl px-5 py-5 overflow-y-auto flex-1">
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="space-y-3"
							>
								{/* Full Name */}
								<div className="space-y-1">
									<Label
										htmlFor="fullName"
										className="text-xs font-semibold"
									>
										{t("form.name")} <span className="text-red-500">{t("form.required")}</span>
									</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
										<Input
											id="fullName"
											{...register("fullName")}
											placeholder={t("form.namePlaceholder")}
											className={cn(
												"pl-10 h-10 text-sm",
												errors.fullName && "border-red-500"
											)}
											disabled={isSubmitting}
										/>
									</div>
									{errors.fullName && (
										<p className="text-xs text-red-500">
											{errors.fullName.message}
										</p>
									)}
								</div>

								{/* Email */}
								<div className="space-y-1">
									<Label
										htmlFor="email"
										className="text-xs font-semibold"
									>
										{t("form.email")}{" "}
										<span className="text-red-500">{t("form.required")}</span>
									</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
										<Input
											id="email"
											type="email"
											{...register("email")}
											placeholder={t("form.emailPlaceholder")}
											className={cn(
												"pl-10 h-10 text-sm",
												errors.email && "border-red-500"
											)}
											disabled={isSubmitting}
										/>
									</div>
									{errors.email && (
										<p className="text-xs text-red-500">
											{errors.email.message}
										</p>
									)}
								</div>

								{/* Phone with Country Code */}
								<div className="space-y-1">
									<Label className="text-xs font-semibold">
										{t("form.phone")}{" "}
										<span className="text-red-500">{t("form.required")}</span>
									</Label>
									<div className="flex gap-2">
										<div className="w-[100px] shrink-0">
											<CountryCodeSelect
												value={selectedCountry}
												onChange={handleCountryChange}
												disabled={isSubmitting}
												className="h-10"
											/>
										</div>
										<div className="relative flex-1 min-w-0">
											<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
											<Input
												id="phone"
												type="tel"
												{...register("phone")}
												placeholder={t("form.phonePlaceholder")}
												className={cn(
													"pl-10 h-10 text-sm",
													errors.phone && "border-red-500"
												)}
												disabled={isSubmitting}
											/>
										</div>
									</div>
									{errors.phone && (
										<p className="text-xs text-red-500">
											{errors.phone.message}
										</p>
									)}
								</div>

								{/* Company Name (Optional) */}
								<div className="space-y-1">
									<Label
										htmlFor="companyName"
										className="text-xs font-semibold"
									>
										{t("form.companyName")}{" "}
										<span className="text-muted-foreground font-normal">
											{t("form.optional")}
										</span>
									</Label>
									<div className="relative">
										<Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
										<Input
											id="companyName"
											{...register("companyName")}
											placeholder={t("form.companyNamePlaceholder")}
											className="pl-10 h-10 text-sm"
											disabled={isSubmitting}
										/>
									</div>
								</div>

								{/* Message (Optional) */}
								<div className="space-y-1">
									<Label
										htmlFor="message"
										className="text-xs font-semibold"
									>
										{t("form.message")}{" "}
										<span className="text-muted-foreground font-normal">
											{t("form.optional")}
										</span>
									</Label>
									<Textarea
										id="message"
										{...register("message")}
										placeholder={t("form.messagePlaceholder")}
										className={cn(
											"min-h-[70px] resize-none text-sm",
											errors.message && "border-red-500"
										)}
										disabled={isSubmitting}
									/>
									{errors.message && (
										<p className="text-xs text-red-500">
											{errors.message.message}
										</p>
									)}
								</div>

								{/* GDPR Consent */}
								<div className="space-y-1">
									<label
										htmlFor="gdprConsent"
										className={cn(
											"flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer",
											errors.gdprConsent
												? "border-red-500 bg-red-50"
												: gdprChecked
												? "border-primary bg-primary/5"
												: "border-border"
										)}
									>
										<Checkbox
											id="gdprConsent"
											checked={gdprChecked}
											onCheckedChange={(checked) =>
												handleGdprChange(checked === true)
											}
											disabled={isSubmitting}
											className="mt-0.5 shrink-0"
										/>
										<span className="text-[11px] leading-normal">
											{t("form.gdprConsent").split(t("form.privacyPolicy"))[0]}
											<Link
												href="/integritetspolicy"
												className="text-primary hover:underline font-medium"
												target="_blank"
												onClick={(e) => e.stopPropagation()}
											>
												{t("form.privacyPolicy")}
											</Link>
											{t("form.gdprConsent").split(t("form.privacyPolicy"))[1]}{" "}
											<span className="text-red-500">{t("form.required")}</span>
										</span>
									</label>
									{errors.gdprConsent && (
										<p className="text-xs text-red-500">
											{errors.gdprConsent.message}
										</p>
									)}
								</div>

								{/* Submit Button */}
								<Button
									type="submit"
									disabled={isSubmitting}
									className="w-full h-10 rounded-full text-sm font-semibold mt-2"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											{t("form.sending")}
										</>
									) : (
										<>
											<Send className="mr-2 h-4 w-4" />
											{t("form.submit")}
										</>
									)}
								</Button>
							</form>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
