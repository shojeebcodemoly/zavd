"use client";

import * as React from "react";
import {
	Phone,
	X,
	Calendar,
	ChevronLeft,
	ChevronDown,
	Check,
	ChevronRight,
	Cookie,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { DayPicker } from "react-day-picker";
import { de, enUS } from "date-fns/locale";
import { format, startOfDay, isBefore, isWeekend, addMonths } from "date-fns";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	callbackRequestSchema,
	type CallbackRequestInput,
} from "@/lib/validations/form-submission.validation";
import {
	CountryCodeSelect,
	defaultCountry,
	type Country,
} from "@/components/ui/country-code-select";
import { useCookieConsent } from "@/lib/context/cookie-consent-context";

type ModalStep = "datetime" | "phone" | "success";

export function CallbackPopup() {
	const locale = useLocale();
	const isEn = locale === "en";
	const dateLocale = isEn ? enUS : de;

	const t = {
		companyName: "ZAVD",
		tooltipTagline: isEn ? "Talk to us!" : "Sprechen Sie mit uns!",
		tooltipCta: isEn
			? "Click here to get called back"
			: "Klicken Sie hier für einen Rückruf",
		floatingAriaLabel: isEn ? "Request a callback" : "Rückruf anfordern",
		modalTitle: isEn ? "Request a Callback" : "Rückruf anfordern",
		datetimeSubtitle: isEn
			? "Choose your preferred callback time."
			: "Wählen Sie Ihre gewünschte Rückrufzeit.",
		datetimeLabel: isEn ? "Date/Time:" : "Datum/Zeit:",
		datePlaceholder: isEn ? "Select date" : "Datum wählen",
		nextBtn: isEn ? "Next" : "Weiter",
		phoneTitle: isEn ? "Leave your number" : "Hinterlassen Sie Ihre Nummer",
		phoneSubtitle: isEn ? "we'll call you back!" : "wir rufen Sie zurück!",
		phoneInputLabel: isEn ? "Enter your number" : "Ihre Nummer eingeben",
		phoneFree: isEn ? "(the call is free)" : "(der Anruf ist kostenlos)",
		phonePlaceholder: "+49 170 123 4567",
		submitBtn: isEn ? "Call me!" : "Anrufen!",
		gdprText: isEn
			? "I am aware that calls may be recorded for training and quality purposes."
			: "Ich bin damit einverstanden, dass Anrufe zu Schulungs- und Qualitätszwecken aufgezeichnet werden können.",
		backLink: isEn
			? "Choose your preferred callback time."
			: "Wählen Sie Ihre gewünschte Rückrufzeit.",
		successTitle: isEn
			? "Thank you for your request!"
			: "Vielen Dank für Ihre Anfrage!",
		successSubtitle: isEn
			? "We will get back to you as soon as possible."
			: "Wir melden uns so schnell wie möglich bei Ihnen.",
		successTimeLabel: isEn ? "Selected callback time" : "Ausgewählte Rückrufzeit",
		closeBtn: isEn ? "Close" : "Schließen",
		selectDateError: isEn ? "Please select a date" : "Bitte wählen Sie ein Datum",
		backAriaLabel: isEn ? "Back" : "Zurück",
		closeAriaLabel: isEn ? "Close" : "Schließen",
		cookieAriaLabel: isEn ? "Cookie settings" : "Cookie-Einstellungen",
	};

	const [isHovered, setIsHovered] = React.useState(false);
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [step, setStep] = React.useState<ModalStep>("datetime");
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [selectedCountry, setSelectedCountry] =
		React.useState<Country>(defaultCountry);
	const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

	const { hasConsented, openSettings } = useCookieConsent();

	const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
		undefined
	);
	const [selectedHour, setSelectedHour] = React.useState<string>("13");
	const [selectedMinute, setSelectedMinute] = React.useState<string>("00");

	const form = useForm<CallbackRequestInput>({
		resolver: zodResolver(callbackRequestSchema),
		defaultValues: {
			countryCode: defaultCountry.dialCode,
			phone: "",
			preferredDate: "",
			preferredTime: "",
			gdprConsent: true,
		},
	});

	const availableHours = React.useMemo(() => {
		return Array.from({ length: 9 }, (_, i) =>
			String(i + 9).padStart(2, "0")
		);
	}, []);

	const availableMinutes = React.useMemo(() => {
		return ["00", "15", "30", "45"];
	}, []);

	const disabledDays = React.useCallback((date: Date) => {
		const today = startOfDay(new Date());
		return isBefore(date, today) || isWeekend(date);
	}, []);

	const handleDateSelect = () => {
		if (!selectedDate) {
			toast.error(t.selectDateError);
			return;
		}

		const dateStr = format(selectedDate, "yyyy-MM-dd");
		const timeStr = `${selectedHour}:${selectedMinute}`;

		form.setValue("preferredDate", dateStr);
		form.setValue("preferredTime", timeStr);
		setStep("phone");
	};

	const handleCountryChange = (country: Country) => {
		setSelectedCountry(country);
		form.setValue("countryCode", country.dialCode);
	};

	const onSubmit = async (data: CallbackRequestInput) => {
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/form-submissions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					type: "callback_request",
					...data,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Etwas ist schiefgelaufen");
			}

			setStep("success");
			form.reset();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: isEn
					? "Something went wrong. Please try again."
					: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setIsModalOpen(false);
		setTimeout(() => {
			setStep("datetime");
			setSelectedDate(undefined);
			setSelectedHour("13");
			setSelectedMinute("00");
			form.reset({
				countryCode: defaultCountry.dialCode,
				phone: "",
				preferredDate: "",
				preferredTime: "",
				gdprConsent: true,
			});
			setSelectedCountry(defaultCountry);
		}, 200);
	};

	const handleBack = () => {
		if (step === "phone") {
			setStep("datetime");
		}
	};

	return (
		<>
			{/* Mobile: Stacked buttons (Cookie + Callback) - positioned above bottom nav */}
			<div className="fixed bottom-[100px] right-4 z-50 flex flex-col items-center gap-2 md:hidden">
				{hasConsented && (
					<button
						onClick={openSettings}
						className={cn(
							"w-11 h-11 rounded-full bg-slate-800 text-white shadow-lg flex items-center justify-center",
							"transition-all duration-300 ease-out",
							"hover:bg-slate-700 hover:scale-105 hover:shadow-xl",
							"focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2",
							"active:scale-95"
						)}
						aria-label={t.cookieAriaLabel}
					>
						<Cookie className="w-5 h-5" />
					</button>
				)}

				<button
					onClick={() => setIsModalOpen(true)}
					className={cn(
						"w-11 h-11 rounded-full bg-primary text-white shadow-lg flex items-center justify-center",
						"transition-all duration-300 ease-out",
						"hover:bg-primary-hover hover:scale-105 hover:shadow-xl",
						"focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
						"active:scale-95"
					)}
					aria-label={t.floatingAriaLabel}
				>
					<Phone className="w-5 h-5" />
				</button>
			</div>

			{/* Desktop: Original layout with tooltip */}
			<div className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-3">
				<div
					className={cn(
						"bg-white rounded-lg shadow-xl border border-slate-200 p-4 transition-all duration-300 ease-out origin-right",
						isHovered
							? "opacity-100 translate-x-0 scale-100"
							: "opacity-0 translate-x-4 scale-95 pointer-events-none"
					)}
				>
					<p className="font-semibold text-secondary text-sm">
						{t.companyName}
					</p>
					<p className="text-slate-600 text-sm mt-1">{t.tooltipTagline}</p>
					<p className="text-slate-500 text-xs mt-1">{t.tooltipCta}</p>
				</div>

				<button
					onClick={() => setIsModalOpen(true)}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					className={cn(
						"w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center",
						"transition-all duration-300 ease-out",
						"hover:bg-primary-hover hover:scale-110 hover:shadow-xl",
						"focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
						"active:scale-95"
					)}
					aria-label={t.floatingAriaLabel}
				>
					<Phone className="w-6 h-6" />
				</button>
			</div>

			{/* Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent
					className={cn(
						"sm:max-w-md p-0 overflow-hidden border-0",
						step === "success" ? "bg-white" : "bg-secondary/90"
					)}
					hideCloseButton
				>
					{/* Success State */}
					{step === "success" && (
						<div className="relative">
							<div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

							<button
								onClick={handleClose}
								className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
								aria-label={t.closeAriaLabel}
							>
								<X className="w-5 h-5" />
							</button>

							<div className="px-8 pt-12 pb-8 text-center">
								<div className="relative w-24 h-24 mx-auto">
									<div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
									<div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
										<Check
											className="w-10 h-10 text-white"
											strokeWidth={3}
										/>
									</div>
									<div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-300" />
									<div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-teal-300" />
								</div>

								<h2 className="mt-8 text-2xl font-bold text-slate-800">
									{t.successTitle}
								</h2>
								<p className="mt-3 text-slate-500 leading-relaxed">
									{t.successSubtitle}
								</p>

								{form.getValues("preferredDate") && (
									<div className="mt-6 p-4 bg-linear-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/60">
										<p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
											{t.successTimeLabel}
										</p>
										<div className="flex items-center justify-center gap-3">
											<div className="flex items-center gap-2 text-slate-700">
												<Calendar className="w-4 h-4 text-emerald-500" />
												<span className="font-medium">
													{format(
														new Date(
															form.getValues("preferredDate")
														),
														"EEEE d MMMM",
														{ locale: dateLocale }
													)}
												</span>
											</div>
											<span className="text-slate-300">•</span>
											<div className="flex items-center gap-1.5 text-slate-700">
												<span className="font-medium">
													{isEn ? "" : "Uhr "}
													{form.getValues("preferredTime")}
												</span>
											</div>
										</div>
									</div>
								)}

								<Button
									onClick={handleClose}
									className="mt-8 w-full h-12 rounded-xl text-base font-medium bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200/40 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-200/50"
								>
									{t.closeBtn}
								</Button>
							</div>
						</div>
					)}

					{/* Non-Success States */}
					{step !== "success" && (
						<>
							{/* Header */}
							<div className="relative pt-8 pb-6 px-6 text-center text-white">
								<button
									onClick={handleClose}
									className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
									aria-label={t.closeAriaLabel}
								>
									<X className="w-5 h-5" />
								</button>

								{step === "phone" && (
									<button
										onClick={handleBack}
										className="absolute top-4 left-4 p-1 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1 text-sm"
										aria-label={t.backAriaLabel}
									>
										<ChevronLeft className="w-5 h-5" />
									</button>
								)}

								<div className="flex flex-col items-center gap-2">
									<span className="text-xl font-bold text-white tracking-wide">
										{t.companyName}
									</span>
								</div>

								<DialogTitle className="mt-6 text-xl font-light font-sans flex items-center justify-center gap-2">
									{t.modalTitle} <Phone className="w-5 h-5" />
								</DialogTitle>

								{step === "datetime" && (
									<p className="mt-2 text-white/80 text-sm">
										{t.datetimeSubtitle}
									</p>
								)}

								{step === "phone" && (
									<div className="mt-2">
										<p className="text-lg font-medium">
											{t.phoneTitle}
										</p>
										<p className="text-white/80 text-sm">
											{t.phoneSubtitle}
										</p>
									</div>
								)}
							</div>

							{/* Content */}
							<div className="bg-white rounded-t-3xl px-6 py-8">
								{step === "datetime" && (
									<div className="space-y-6">
										<div className="flex items-start gap-2">
											<Calendar className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
											<span className="text-sm text-slate-600">
												{t.datetimeLabel}
											</span>
										</div>

										<div className="flex gap-2">
											<Popover
												open={isCalendarOpen}
												onOpenChange={setIsCalendarOpen}
											>
												<PopoverTrigger asChild>
													<button
														className={cn(
															"flex-1 h-12 px-4 rounded-lg border border-slate-200 bg-white",
															"text-sm text-left flex items-center justify-between",
															"hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
															"transition-all duration-200",
															!selectedDate && "text-slate-400"
														)}
													>
														<span>
															{selectedDate
																? format(
																		selectedDate,
																		"EEEE d MMMM",
																		{ locale: dateLocale }
																  )
																: t.datePlaceholder}
														</span>
														<Calendar className="w-4 h-4 text-slate-400" />
													</button>
												</PopoverTrigger>
												<PopoverContent
													className="w-auto p-0"
													align="start"
												>
													<div className="p-3">
														<DayPicker
															mode="single"
															selected={selectedDate}
															onSelect={(date) => {
																setSelectedDate(date);
																setIsCalendarOpen(false);
															}}
															disabled={disabledDays}
															locale={dateLocale}
															startMonth={new Date()}
															endMonth={addMonths(new Date(), 2)}
															navLayout="around"
															classNames={{
																root: "rdp-root",
																months: "flex flex-col",
																month: "space-y-4",
																month_caption:
																	"flex justify-center pt-1 relative items-center",
																caption_label:
																	"text-sm font-medium",
																nav: "flex items-center justify-between absolute inset-x-0 top-0",
																button_previous: cn(
																	"h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
																	"inline-flex items-center justify-center rounded-md border border-slate-200",
																	"hover:bg-slate-100 transition-colors"
																),
																button_next: cn(
																	"h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
																	"inline-flex items-center justify-center rounded-md border border-slate-200",
																	"hover:bg-slate-100 transition-colors"
																),
																month_grid:
																	"w-full border-collapse space-y-1",
																weekdays: "flex",
																weekday:
																	"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
																week: "flex w-full mt-2",
																day: "h-9 w-9 text-center text-sm p-0 relative",
																day_button: cn(
																	"h-9 w-9 p-0 font-normal",
																	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors",
																	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
																	"hover:bg-accent hover:text-accent-foreground",
																	"aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary"
																),
																selected:
																	"bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
																today: "bg-accent text-accent-foreground",
																outside:
																	"day-outside text-muted-foreground opacity-50",
																disabled:
																	"text-muted-foreground opacity-50",
																hidden: "invisible",
															}}
															components={{
																Chevron: ({ orientation }) =>
																	orientation === "left" ? (
																		<ChevronLeft className="h-4 w-4" />
																	) : (
																		<ChevronRight className="h-4 w-4" />
																	),
															}}
														/>
													</div>
												</PopoverContent>
											</Popover>

											<Select
												value={selectedHour}
												onValueChange={setSelectedHour}
											>
												<SelectTrigger className="w-20 h-12 text-center justify-center">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{availableHours.map((hour) => (
														<SelectItem key={hour} value={hour}>
															{hour}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											<Select
												value={selectedMinute}
												onValueChange={setSelectedMinute}
											>
												<SelectTrigger className="w-20 h-12 text-center justify-center">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{availableMinutes.map((minute) => (
														<SelectItem key={minute} value={minute}>
															{minute}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<Button
											onClick={handleDateSelect}
											className="w-full h-12 rounded-full text-base font-medium"
										>
											{t.nextBtn}
										</Button>
									</div>
								)}

								{step === "phone" && (
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="space-y-6"
									>
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<Phone className="w-4 h-4 text-slate-500" />
												<span className="text-sm text-slate-600">
													{t.phoneInputLabel}{" "}
													<span className="text-slate-400 text-xs">
														{t.phoneFree}
													</span>
												</span>
											</div>

											<div className="flex gap-2">
												<div className="w-28 shrink-0">
													<CountryCodeSelect
														value={selectedCountry}
														onChange={handleCountryChange}
														className="h-12"
													/>
												</div>

												<div className="flex-1">
													<Input
														{...form.register("phone")}
														type="tel"
														placeholder={t.phonePlaceholder}
														className="h-12"
													/>
												</div>

												<Button
													type="submit"
													disabled={isSubmitting}
													className="h-12 px-6 rounded-lg whitespace-nowrap"
												>
													{isSubmitting ? "..." : t.submitBtn}
												</Button>
											</div>

											{form.formState.errors.phone && (
												<p className="text-red-500 text-xs">
													{form.formState.errors.phone.message}
												</p>
											)}
										</div>

										<div className="flex items-start gap-3">
											<Checkbox
												id="gdpr-consent"
												checked={form.watch("gdprConsent")}
												onCheckedChange={(checked) =>
													form.setValue(
														"gdprConsent",
														checked === true
													)
												}
												className="mt-0.5"
											/>
											<Label
												htmlFor="gdpr-consent"
												className="text-xs text-slate-600 leading-relaxed cursor-pointer"
											>
												{t.gdprText}
											</Label>
										</div>

										{form.formState.errors.gdprConsent && (
											<p className="text-red-500 text-xs">
												{form.formState.errors.gdprConsent.message}
											</p>
										)}

										<button
											type="button"
											onClick={handleBack}
											className="w-full text-center text-sm text-slate-500 hover:text-primary transition-colors"
										>
											{t.backLink}
										</button>
									</form>
								)}
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
