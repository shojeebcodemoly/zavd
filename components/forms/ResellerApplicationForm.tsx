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
	Briefcase,
	FileText,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { isValidPhoneNumber } from "libphonenumber-js";

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
	companyName: z
		.string()
		.min(2, "Företagsnamnet måste vara minst 2 tecken")
		.max(200, "Företagsnamnet får inte överstiga 200 tecken"),
	corporationNumber: z.string().optional(),
	businessDescription: z
		.string()
		.min(10, "Beskriv din verksamhet (minst 10 tecken)")
		.max(1000, "Beskrivningen får inte överstiga 1000 tecken"),
	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.optional(),
	gdprConsent: z.literal(true, {
		message: "Du måste godkänna integritetspolicyn",
	}),
	marketingConsent: z.boolean().optional(),
});

type FormData = z.infer<typeof clientFormSchema>;

interface ResellerApplicationFormProps {
	successMessage?: string;
	successDescription?: string;
}

export function ResellerApplicationForm({
	successMessage = "Tack för din ansökan!",
	successDescription = "Vi har mottagit din återförsäljaransökan och granskar den noggrant. Vi återkommer till dig inom några arbetsdagar.",
}: ResellerApplicationFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [selectedCountry, setSelectedCountry] =
		useState<Country>(defaultCountry);

	// Local state for UI elements
	const [gdprChecked, setGdprChecked] = useState(false);
	const [marketingChecked, setMarketingChecked] = useState(false);

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
			companyName: "",
			corporationNumber: "",
			businessDescription: "",
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
					type: "reseller_application",
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
				toast.success(
					"Tack för din ansökan! Vi granskar den och återkommer inom kort."
				);
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
	}

	if (isSuccess) {
		return (
			<div className="text-center p-2 sm:p-12 rounded-2xl bg-card border border-border shadow-lg">
				<div className="w-10 h-10 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
					<CheckCircle2 className="h-10 w-10 text-green-600" />
				</div>
				<h2 className="text-2xl md:text-3xl font-medium text-secondary mb-4">
					Tack för din ansökan!
				</h2>
				<p className="text-lg text-muted-foreground mb-6">
					Vi har mottagit din återförsäljaransökan och granskar den noggrant.
					Vi återkommer till dig inom några arbetsdagar.
				</p>
				<Button
					variant="outline"
					onClick={() => setIsSuccess(false)}
					className="mt-4"
				>
					Skicka ny ansökan
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
					Kontaktuppgifter
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Full Name */}
					<div className="space-y-2">
						<Label htmlFor="fullName" className="text-sm font-semibold">
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
						<Label htmlFor="email" className="text-sm font-semibold">
							E-postadress <span className="text-red-500">*</span>
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
							Telefonnummer <span className="text-red-500">*</span>
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

					{/* Country (from dropdown - display only) */}
					<div className="space-y-2">
						<Label className="text-sm font-semibold">
							Land
						</Label>
						<div className="relative">
							<Input
								value={selectedCountry.name}
								readOnly
								className="h-12 bg-muted cursor-not-allowed"
								disabled
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Business Info Section */}
			<div className="space-y-6">
				<h3 className="text-lg font-semibold text-secondary flex items-center gap-2 pb-2 border-b border-border">
					<Briefcase className="h-5 w-5 text-primary" />
					Företagsinformation
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Company Name */}
					<div className="space-y-2">
						<Label htmlFor="companyName" className="text-sm font-semibold">
							Företagsnamn <span className="text-red-500">*</span>
						</Label>
						<div className="relative">
							<Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
							<Input
								id="companyName"
								{...register("companyName")}
								placeholder="Ditt företags namn"
								className={cn(
									"pl-11 h-12",
									errors.companyName && "border-red-500"
								)}
								disabled={isSubmitting}
							/>
						</div>
						{errors.companyName && (
							<p className="text-sm text-red-500">
								{errors.companyName.message}
							</p>
						)}
					</div>

					{/* Corporation Number (Optional) */}
					<div className="space-y-2">
						<Label
							htmlFor="corporationNumber"
							className="text-sm font-semibold"
						>
							Organisationsnummer{" "}
							<span className="text-muted-foreground font-normal">
								(valfritt)
							</span>
						</Label>
						<div className="relative">
							<FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
							<Input
								id="corporationNumber"
								{...register("corporationNumber")}
								placeholder="XXXXXX-XXXX"
								className="pl-11 h-12"
								disabled={isSubmitting}
							/>
						</div>
					</div>
				</div>

				{/* Business Description */}
				<div className="space-y-2">
					<Label htmlFor="businessDescription" className="text-sm font-semibold">
						Beskriv din verksamhet <span className="text-red-500">*</span>
					</Label>
					<Textarea
						id="businessDescription"
						{...register("businessDescription")}
						placeholder="Berätta om din verksamhet, hur länge du har drivit företaget, vilka kunder du har idag, och varför du är intresserad av att bli återförsäljare..."
						className={cn(
							"min-h-[120px] resize-none",
							errors.businessDescription && "border-red-500"
						)}
						disabled={isSubmitting}
					/>
					{errors.businessDescription && (
						<p className="text-sm text-red-500">
							{errors.businessDescription.message}
						</p>
					)}
				</div>

				{/* Additional Message (Optional) */}
				<div className="space-y-2">
					<Label htmlFor="message" className="text-sm font-semibold">
						Ytterligare information{" "}
						<span className="text-muted-foreground font-normal">
							(valfritt)
						</span>
					</Label>
					<Textarea
						id="message"
						{...register("message")}
						placeholder="Har du frågor eller vill dela med dig av något mer?"
						className={cn(
							"min-h-[100px] resize-none",
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
						Jag godkänner{" "}
						<Link
							href="/integritetspolicy"
							className="text-primary hover:underline font-medium"
							target="_blank"
							onClick={(e) => e.stopPropagation()}
						>
							integritetspolicyn
						</Link>{" "}
						och samtycker till att mina uppgifter behandlas enligt GDPR.{" "}
						<span className="text-red-500">*</span>
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
							Jag vill ta emot nyhetsbrev och erbjudanden
						</span>
						<span className="block text-muted-foreground mt-1">
							Du kan när som helst avregistrera dig från vårt nyhetsbrev.
						</span>
					</span>
				</label>
			</div>

			{/* Submit Button */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
				<p className="text-sm text-muted-foreground">
					<span className="text-red-500">*</span> Obligatoriska fält
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
							Skicka ansökan
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
