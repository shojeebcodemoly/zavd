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
	Video,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

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

// Client-side form schema
const tourFormSchema = z.object({
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken"),
	email: z.string().email("Ange en giltig e-postadress"),
	countryCode: z.string().min(2, "Landskod krävs"),
	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(20, "Telefonnummer får inte överstiga 20 siffror"),
	message: z
		.string()
		.max(1000, "Meddelandet får inte överstiga 1000 tecken")
		.optional(),
	gdprConsent: z.literal(true, {
		message: "Du måste godkänna integritetspolicyn",
	}),
});

type FormData = z.infer<typeof tourFormSchema>;

interface TourRequestModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TourRequestModal({
	open,
	onOpenChange,
}: TourRequestModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [selectedCountry, setSelectedCountry] =
		useState<Country>(defaultCountry);
	const [gdprChecked, setGdprChecked] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		setError,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(tourFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			countryCode: defaultCountry.dialCode,
			phone: "",
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
				message: "Ogiltigt telefonnummer för valt land",
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
					type: "tour_request",
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
							"Något gick fel. Försök igen."
					);
				} else {
					toast.error(result.message || "Något gick fel. Försök igen.");
				}
			}
		} catch (error) {
			console.error("Form submission error:", error);
			toast.error("Något gick fel. Försök igen senare.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={cn(
					"max-w-[340px] sm:max-w-md p-0 overflow-hidden border-0 max-h-[90vh]",
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
							className="absolute top-3 right-3 p-1.5 rounded-full text-foreground/50 hover:text-foreground/70 hover:bg-muted transition-all duration-200"
							aria-label="Stäng"
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
							<h2 className="mt-5 text-xl font-medium text-secondary">
								Tack för din förfrågan!
							</h2>
							<p className="mt-2 text-sm text-foreground/60 leading-relaxed">
								Vi kontaktar dig inom kort för att boka in din virtuella
								rundtur.
							</p>

							{/* Close Button */}
							<Button
								onClick={handleClose}
								className="mt-6 w-full h-10 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
							>
								Stäng
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
								aria-label="Stäng"
							>
								<X className="w-4 h-4" />
							</button>

							{/* Icon */}
							<div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
								<Video className="w-6 h-6 text-primary" />
							</div>

							<DialogTitle className="text-lg font-semibold">
								Boka virtuell rundtur
							</DialogTitle>

							<p className="mt-1 text-white/80 text-xs">
								Fyll i formuläret så kontaktar vi dig.
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
										Namn <span className="text-red-500">*</span>
									</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
										<Input
											id="fullName"
											{...register("fullName")}
											placeholder="Ditt fullständiga namn"
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
										E-postadress{" "}
										<span className="text-red-500">*</span>
									</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
										<Input
											id="email"
											type="email"
											{...register("email")}
											placeholder="din@email.se"
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
										Telefonnummer{" "}
										<span className="text-red-500">*</span>
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
												placeholder="701234567"
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

								{/* Message (Optional) */}
								<div className="space-y-1">
									<Label
										htmlFor="message"
										className="text-xs font-semibold"
									>
										Meddelande{" "}
										<span className="text-muted-foreground font-normal">
											(valfritt)
										</span>
									</Label>
									<Textarea
										id="message"
										{...register("message")}
										placeholder="Berätta gärna vad du är särskilt intresserad av..."
										className={cn(
											"min-h-[60px] resize-none text-sm",
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
											Jag godkänner Glada Bonden Mejeri AB:s{" "}
											<Link
												href="/integritetspolicy"
												className="text-primary hover:underline font-medium"
												target="_blank"
												onClick={(e) => e.stopPropagation()}
											>
												integritetspolicy
											</Link>{" "}
											och samtycker till att mina uppgifter behandlas
											enligt GDPR.{" "}
											<span className="text-red-500">*</span>
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
											Skickar...
										</>
									) : (
										<>
											<Send className="mr-2 h-4 w-4" />
											Boka rundtur
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
