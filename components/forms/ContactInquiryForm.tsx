"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Send,
	Mail,
	Phone,
	Building2,
	User,
	Loader2,
	CheckCircle2,
	MessageSquare,
	FileText,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	CountryCodeSelect,
	defaultCountry,
	type Country,
} from "@/components/ui/country-code-select";
import { cn } from "@/lib/utils/cn";
import { z } from "zod";

// Create form schema with translations
const createContactFormSchema = (t: (key: string) => string) =>
	z.object({
		fullName: z
			.string()
			.min(2, t("validation.nameMin"))
			.max(100, t("validation.nameMax")),
		email: z.string().email(t("validation.emailInvalid")),
		countryCode: z.string().min(2, t("validation.countryCodeRequired")),
		countryName: z.string().min(2, t("validation.countryRequired")),
		phone: z
			.string()
			.min(6, t("validation.phoneMin"))
			.max(20, t("validation.phoneMax")),
		subject: z
			.string()
			.min(3, t("validation.subjectMin"))
			.max(200, t("validation.subjectMax")),
		corporationNumber: z.string().optional(),
		message: z
			.string()
			.min(10, t("validation.messageMin"))
			.max(2000, t("validation.messageMax")),
		gdprConsent: z.literal(true, {
			message: t("validation.gdprRequired"),
		}),
		marketingConsent: z.boolean().optional(),
	});

type FormData = z.infer<ReturnType<typeof createContactFormSchema>>;

export function ContactInquiryForm() {
	const t = useTranslations("contactForm");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [selectedCountry, setSelectedCountry] =
		useState<Country>(defaultCountry);

	// Local state for UI elements
	const [gdprChecked, setGdprChecked] = useState(false);
	const [marketingChecked, setMarketingChecked] = useState(false);

	// Create schema with translated messages
	const clientFormSchema = createContactFormSchema(t);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		setError,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(clientFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			countryCode: defaultCountry.dialCode,
			countryName: defaultCountry.name,
			phone: "",
			subject: "",
			corporationNumber: "",
			message: "",
			gdprConsent: undefined as unknown as true,
			marketingConsent: false,
		},
	});

	const handleCountryChange = (country: Country) => {
		setSelectedCountry(country);
		setValue("countryCode", country.dialCode);
		setValue("countryName", country.name);
	};

	const handleGdprChange = (checked: boolean) => {
		setGdprChecked(checked);
		setValue("gdprConsent", checked as unknown as true);
	};

	const handleMarketingChange = (checked: boolean) => {
		setMarketingChecked(checked);
		setValue("marketingConsent", checked);
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
					type: "contact",
					...data,
					pageUrl: window.location.href,
				}),
			});

			const result = await response.json();

			if (result.success) {
				setIsSuccess(true);
				reset();
				setGdprChecked(false);
				setMarketingChecked(false);
				setSelectedCountry(defaultCountry);
				toast.success(t("success.message"));
				setTimeout(() => setIsSuccess(false), 5000);
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

	if (isSuccess) {
		return (
			<div className="text-center p-2 sm:p-12 rounded-2xl bg-card border border-border shadow-lg">
				<div className="w-10 h-10 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
					<CheckCircle2 className="h-10 w-10 text-green-600" />
				</div>
				<h2 className="text-2xl md:text-3xl font-medium text-secondary mb-4">
					{t("success.title")}
				</h2>
				<p className="text-lg text-muted-foreground mb-6">
					{t("success.message")}
				</p>
				<Button
					variant="outline"
					onClick={() => setIsSuccess(false)}
					className="mt-4"
				>
					{t("success.sendNew")}
				</Button>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="p-4 sm:p-6 md:p-8 rounded-2xl bg-card border border-border shadow-xl space-y-6"
		>
			{/* Contact Info Section */}
			<div className="space-y-6">
				<h3 className="text-lg font-semibold text-secondary flex items-center gap-2 pb-2 border-b border-border">
					<User className="h-5 w-5 text-primary" />
					{t("contactInfo")}
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Full Name */}
					<div className="space-y-2">
						<Label htmlFor="fullName" className="text-sm font-semibold">
							{t("form.name")} <span className="text-red-500">{t("form.required")}</span>
						</Label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
							<Input
								id="fullName"
								{...register("fullName")}
								placeholder={t("form.namePlaceholder")}
								className={cn(
									"pl-11 h-12",
									errors.fullName && "border-red-500"
								)}
								disabled={isSubmitting}
							/>
						</div>
						{errors.fullName && (
							<p className="text-sm text-red-500">
								{errors.fullName.message}
							</p>
						)}
					</div>

					{/* Email */}
					<div className="space-y-2">
						<Label htmlFor="email" className="text-sm font-semibold">
							{t("form.email")} <span className="text-red-500">{t("form.required")}</span>
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
							<Input
								id="email"
								type="email"
								{...register("email")}
								placeholder={t("form.emailPlaceholder")}
								className={cn(
									"pl-11 h-12",
									errors.email && "border-red-500"
								)}
								disabled={isSubmitting}
							/>
						</div>
						{errors.email && (
							<p className="text-sm text-red-500">
								{errors.email.message}
							</p>
						)}
					</div>

					{/* Phone with Country Code */}
					<div className="space-y-2">
						<Label className="text-sm font-semibold">
							{t("form.phone")} <span className="text-red-500">{t("form.required")}</span>
						</Label>
						<div className="flex gap-2">
							<div className="w-[110px] shrink-0">
								<CountryCodeSelect
									value={selectedCountry}
									onChange={handleCountryChange}
									disabled={isSubmitting}
								/>
							</div>
							<div className="relative flex-1 min-w-0">
								<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
								<Input
									id="phone"
									type="tel"
									{...register("phone")}
									placeholder={t("form.phonePlaceholder")}
									className={cn(
										"pl-11 h-12",
										errors.phone && "border-red-500"
									)}
									disabled={isSubmitting}
								/>
							</div>
						</div>
						{errors.phone && (
							<p className="text-sm text-red-500">
								{errors.phone.message}
							</p>
						)}
					</div>

					{/* Corporation Number (Optional) */}
					<div className="space-y-2">
						<Label
							htmlFor="corporationNumber"
							className="text-sm font-semibold"
						>
							{t("form.company")}{" "}
							<span className="text-muted-foreground font-normal">
								{t("form.optional")}
							</span>
						</Label>
						<div className="relative">
							<Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
							<Input
								id="corporationNumber"
								{...register("corporationNumber")}
								placeholder={t("form.companyPlaceholder")}
								className="pl-11 h-12"
								disabled={isSubmitting}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Message Section */}
			<div className="space-y-6">
				<h3 className="text-lg font-semibold text-secondary flex items-center gap-2 pb-2 border-b border-border">
					<MessageSquare className="h-5 w-5 text-primary" />
					{t("yourMessage")}
				</h3>

				{/* Subject */}
				<div className="space-y-2">
					<Label htmlFor="subject" className="text-sm font-semibold">
						{t("form.subject")} <span className="text-red-500">{t("form.required")}</span>
					</Label>
					<div className="relative">
						<FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
						<Input
							id="subject"
							{...register("subject")}
							placeholder={t("form.subjectPlaceholder")}
							className={cn(
								"pl-11 h-12",
								errors.subject && "border-red-500"
							)}
							disabled={isSubmitting}
						/>
					</div>
					{errors.subject && (
						<p className="text-sm text-red-500">
							{errors.subject.message}
						</p>
					)}
				</div>

				{/* Message */}
				<div className="space-y-2">
					<Label htmlFor="message" className="text-sm font-semibold">
						{t("form.message")} <span className="text-red-500">{t("form.required")}</span>
					</Label>
					<Textarea
						id="message"
						{...register("message")}
						placeholder={t("form.messagePlaceholder")}
						className={cn(
							"min-h-[150px] resize-none",
							errors.message && "border-red-500"
						)}
						disabled={isSubmitting}
					/>
					{errors.message && (
						<p className="text-sm text-red-500">
							{errors.message.message}
						</p>
					)}
				</div>
			</div>

			{/* Consent Section */}
			<div className="space-y-4">
				{/* GDPR Consent */}
				<label
					htmlFor="gdprConsent"
					className={cn(
						"flex items-start gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer",
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
						className="mt-1 shrink-0"
					/>
					<span className="text-xs sm:text-sm leading-normal">
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
					<p className="text-sm text-red-500">
						{errors.gdprConsent.message}
					</p>
				)}

				{/* Marketing Consent */}
				<label
					htmlFor="marketingConsent"
					className={cn(
						"flex items-start gap-3 p-3 sm:p-4 rounded-lg border cursor-pointer",
						marketingChecked
							? "border-primary bg-primary/5"
							: "border-border"
					)}
				>
					<Checkbox
						id="marketingConsent"
						checked={marketingChecked}
						onCheckedChange={(checked) =>
							handleMarketingChange(checked === true)
						}
						disabled={isSubmitting}
						className="mt-1 shrink-0"
					/>
					<span className="text-xs sm:text-sm leading-normal">
						<span className="font-medium">
							{t("form.marketingConsent")}
						</span>
						<span className="block text-muted-foreground mt-1">
							{t("form.marketingDescription")}
						</span>
					</span>
				</label>
			</div>

			{/* Submit Button */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
				<p className="text-sm text-muted-foreground">
					<span className="text-red-500">{t("form.required")}</span> {t("form.requiredFields")}
				</p>
				<Button
					type="submit"
					disabled={isSubmitting}
					size="lg"
					className="w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							{t("form.sending")}
						</>
					) : (
						<>
							<Send className="mr-2 h-5 w-5" />
							{t("form.submit")}
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
