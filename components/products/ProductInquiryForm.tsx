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
	Package,
	HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { isValidPhoneNumber } from "libphonenumber-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	CountryCodeSelect,
	defaultCountry,
	type Country,
} from "@/components/ui/country-code-select";
import {
	helpTypeLabels,
	helpTypes,
} from "@/lib/validations/form-submission.validation";
import { cn } from "@/lib/utils/cn";
import { z } from "zod";

interface ProductInquiryFormProps {
	productName: string;
	productId: string;
	productSlug: string;
}

// Form schema with phone validation
const clientFormSchema = z.object({
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken"),
	email: z.string().email("Ange en giltig e-postadress"),
	countryCode: z.string().min(2, "Landskod krävs"),
	countryName: z.string().min(2, "Land krävs"),
	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(20, "Telefonnummer får inte överstiga 20 siffror"),
	helpType: z.enum(helpTypes, {
		message: "Välj hur vi kan hjälpa dig",
	}),
	corporationNumber: z.string().optional(),
	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.optional(),
	gdprConsent: z.literal(true, {
		message: "Du måste godkänna integritetspolicyn",
	}),
	productId: z.string(),
	productName: z.string(),
	productSlug: z.string(),
});

type FormData = z.infer<typeof clientFormSchema>;

export function ProductInquiryForm({
	productName,
	productId,
	productSlug,
}: ProductInquiryFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [selectedCountry, setSelectedCountry] =
		useState<Country>(defaultCountry);

	// Local state for UI elements that need to update visually
	const [gdprChecked, setGdprChecked] = useState(false);
	const [selectedHelpType, setSelectedHelpType] = useState<string | undefined>(
		undefined
	);

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
			helpType: undefined,
			corporationNumber: "",
			message: "",
			gdprConsent: undefined as unknown as true,
			productId,
			productName,
			productSlug,
		},
	});

	const handleCountryChange = (country: Country) => {
		setSelectedCountry(country);
		setValue("countryCode", country.dialCode);
		setValue("countryName", country.name);
	};

	const handleHelpTypeChange = (value: string) => {
		setSelectedHelpType(value);
		setValue("helpType", value as (typeof helpTypes)[number]);
	};

	const handleGdprChange = (checked: boolean) => {
		setGdprChecked(checked);
		setValue("gdprConsent", checked as unknown as true);
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
					type: "product_inquiry",
					...data,
					pageUrl: window.location.href,
				}),
			});

			const result = await response.json();

			if (result.success) {
				setIsSuccess(true);
				reset();
				setGdprChecked(false);
				setSelectedHelpType(undefined);
				setSelectedCountry(defaultCountry);
				toast.success(
					"Tack för din förfrågan! Vi återkommer inom 24 timmar."
				);
				setTimeout(() => setIsSuccess(false), 10000);
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

	if (isSuccess) {
		return (
			<section className="py-16 md:py-24">
				<div className="_container">
					<div className="max-w-2xl mx-auto text-center p-8 sm:p-12 rounded-2xl bg-card border border-border shadow-lg">
						<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
							<CheckCircle2 className="h-10 w-10 text-green-600" />
						</div>
						<h2 className="text-2xl md:text-3xl font-medium text-secondary mb-4">
							Tack för din förfrågan!
						</h2>
						<p className="text-lg text-muted-foreground mb-6">
							Vi har mottagit din förfrågan gällande {productName} och
							återkommer till dig inom 24 timmar.
						</p>
						<Button
							variant="outline"
							onClick={() => setIsSuccess(false)}
							className="mt-4"
						>
							Skicka ny förfrågan
						</Button>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 md:py-24">
			<div className="_container">
				<div className="max-w-5xl mx-auto">
					{/* Section Header */}
					<div className="text-center mb-12">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
							<Mail className="h-4 w-4" />
							<span className="text-sm font-semibold">
								Produktförfrågan
							</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-medium text-secondary mb-4">
							Intresserad av {productName}?
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Fyll i formuläret så kontaktar vi dig för mer information,
							demo eller offert
						</p>
					</div>

					{/* Form */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="p-4 sm:p-6 md:p-10 rounded-2xl bg-card border border-border shadow-xl"
					>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Left Column - Contact Info */}
							<div className="space-y-6">
								<h3 className="text-lg font-semibold text-secondary flex items-center gap-2 pb-2 border-b border-border">
									<User className="h-5 w-5 text-primary" />
									Kontaktuppgifter
								</h3>

								{/* Full Name */}
								<div className="space-y-2">
									<Label
										htmlFor="fullName"
										className="text-sm font-semibold"
									>
										Namn <span className="text-red-500">*</span>
									</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
										<Input
											id="fullName"
											{...register("fullName")}
											placeholder="Ditt fullständiga namn"
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
									<Label
										htmlFor="email"
										className="text-sm font-semibold"
									>
										E-postadress{" "}
										<span className="text-red-500">*</span>
									</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
										<Input
											id="email"
											type="email"
											{...register("email")}
											placeholder="din@email.se"
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
										Telefonnummer{" "}
										<span className="text-red-500">*</span>
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
												placeholder="701234567"
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
										Org. nummer{" "}
										<span className="text-muted-foreground font-normal">
											(valfritt)
										</span>
									</Label>
									<div className="relative">
										<Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
										<Input
											id="corporationNumber"
											{...register("corporationNumber")}
											placeholder="Ange organisationsnummer"
											className="pl-11 h-12"
											disabled={isSubmitting}
										/>
									</div>
								</div>
							</div>

							{/* Right Column - Product Info & Help Type */}
							<div className="space-y-6">
								<h3 className="text-lg font-semibold text-secondary flex items-center gap-2 pb-2 border-b border-border">
									<Package className="h-5 w-5 text-primary" />
									Din förfrågan
								</h3>

								{/* Product (Read-only) */}
								<div className="space-y-2">
									<Label className="text-sm font-semibold">
										Jag är intresserad av{" "}
										<span className="text-red-500">*</span>
									</Label>
									<div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
										<p className="font-medium text-secondary">
											{productName}
										</p>
									</div>
								</div>

								{/* Help Type Radio Group */}
								<div className="space-y-3">
									<Label className="text-sm font-semibold flex items-center gap-2">
										<HelpCircle className="h-4 w-4 text-primary" />
										Hur kan vi hjälpa dig?{" "}
										<span className="text-red-500">*</span>
									</Label>
									<RadioGroup
										value={selectedHelpType}
										onValueChange={handleHelpTypeChange}
										className="space-y-2"
									>
										{helpTypes.map((type) => (
											<div
												key={type}
												className={cn(
													"flex items-center space-x-3 p-3 rounded-lg border cursor-pointer",
													selectedHelpType === type
														? "border-primary bg-primary/5"
														: "border-border hover:border-primary/50"
												)}
												onClick={() => handleHelpTypeChange(type)}
											>
												<RadioGroupItem
													value={type}
													id={type}
													disabled={isSubmitting}
												/>
												<Label
													htmlFor={type}
													className="flex-1 cursor-pointer text-sm font-normal"
												>
													{helpTypeLabels[type]}
												</Label>
											</div>
										))}
									</RadioGroup>
									{errors.helpType && (
										<p className="text-sm text-red-500">
											{errors.helpType.message}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Message - Full Width */}
						<div className="mt-8 space-y-2">
							<Label htmlFor="message" className="text-sm font-semibold">
								Meddelande{" "}
								<span className="text-muted-foreground font-normal">
									(valfritt)
								</span>
							</Label>
							<Textarea
								id="message"
								{...register("message")}
								placeholder="Berätta mer om dina behov, frågor eller önskemål..."
								className={cn(
									"min-h-[120px] resize-none",
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

						{/* GDPR Consent */}
						<div className="mt-6 space-y-2">
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
									enligt GDPR. <span className="text-red-500">*</span>
								</span>
							</label>
							{errors.gdprConsent && (
								<p className="text-sm text-red-500">
									{errors.gdprConsent.message}
								</p>
							)}
						</div>

						{/* Submit Button */}
						<div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
							<p className="text-sm text-muted-foreground">
								<span className="text-red-500">*</span> Obligatoriska
								fält
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
										Skickar...
									</>
								) : (
									<>
										<Send className="mr-2 h-5 w-5" />
										Skicka förfrågan
									</>
								)}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}
