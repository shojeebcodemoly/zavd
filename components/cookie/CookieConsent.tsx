"use client";

import * as React from "react";
import { X, Lock, Check, ChevronDown, ChevronUp, Cookie } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
	useCookieConsent,
	type CookiePreferences,
} from "@/lib/context/cookie-consent-context";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

type CookieCategory = {
	id: keyof CookiePreferences;
	label: string;
	description: string;
	required: boolean;
};

const cookieCategories: CookieCategory[] = [
	{
		id: "necessary",
		label: "Nödvändiga",
		description:
			"Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av.",
		required: true,
	},
	{
		id: "settings",
		label: "Inställningar",
		description:
			"Dessa cookies gör det möjligt för webbplatsen att komma ihåg val du gör och ge förbättrade funktioner.",
		required: false,
	},
	{
		id: "statistics",
		label: "Statistik",
		description:
			"Dessa cookies hjälper oss att förstå hur besökare interagerar med webbplatsen genom att samla in anonym information.",
		required: false,
	},
	{
		id: "marketing",
		label: "Marknadsföring",
		description:
			"Dessa cookies används för att visa annonser som är relevanta för dig och mäta effektiviteten av reklamkampanjer.",
		required: false,
	},
];

// Cookie Banner Component
function CookieBanner() {
	const { acceptAll, showBanner } = useCookieConsent();
	const [showCustomize, setShowCustomize] = React.useState(false);
	const [selectedPreferences, setSelectedPreferences] = React.useState<
		Partial<CookiePreferences>
	>({
		necessary: true,
		settings: false,
		statistics: false,
		marketing: false,
	});
	const { acceptSelected } = useCookieConsent();

	const handleToggle = (id: keyof CookiePreferences) => {
		if (id === "necessary") return; // Cannot toggle necessary
		setSelectedPreferences((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const handleAcceptSelected = () => {
		acceptSelected(selectedPreferences);
	};

	if (!showBanner) return null;

	return (
		<div className="fixed inset-x-0 bottom-0 z-60 p-4 md:p-6">
			<div className="mx-auto max-w-4xl">
				<div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
					{/* Header with tabs */}
					<div className="border-b border-slate-200">
						<div className="flex items-center justify-between px-6 py-4">
							<div className="flex items-center gap-4">
								<button
									className={cn(
										"text-sm font-medium pb-2 border-b-2 transition-colors",
										!showCustomize
											? "text-primary border-primary"
											: "text-slate-500 border-transparent hover:text-slate-700"
									)}
									onClick={() => setShowCustomize(false)}
								>
									Samtycke
								</button>
								<button
									className={cn(
										"text-sm font-medium pb-2 border-b-2 transition-colors",
										showCustomize
											? "text-primary border-primary"
											: "text-slate-500 border-transparent hover:text-slate-700"
									)}
									onClick={() => setShowCustomize(true)}
								>
									Anpassa
								</button>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="px-6 py-5">
						{!showCustomize ? (
							<>
								<h3 className="text-sm font-semibold text-slate-800 mb-2">
									Denna webbplats använder cookies
								</h3>
								<p className="text-sm text-slate-600 leading-relaxed">
									Vi använder cookies för att anpassa innehållet och
									annonserna till användarna, tillhandahålla funktioner
									för sociala medier och analysera vår trafik. Vi
									vidarebefordrar även sådana identifierare och annan
									information från din enhet till de sociala medier och
									annons- och analysföretag som vi samarbetar med.
									Dessa kan i sin tur kombinera informationen med annan
									information som du har tillhandahållit eller som de
									har samlat in när du har använt deras tjänster.
								</p>
							</>
						) : (
							<div className="space-y-3">
								{cookieCategories.map((category) => (
									<div
										key={category.id}
										className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
									>
										<button
											onClick={() => handleToggle(category.id)}
											disabled={category.required}
											className={cn(
												"mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
												category.required ||
													selectedPreferences[category.id]
													? "bg-primary border-primary text-white"
													: "border-slate-300 hover:border-slate-400"
											)}
										>
											{(category.required ||
												selectedPreferences[category.id]) && (
												<Check className="w-3 h-3" />
											)}
										</button>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium text-slate-800">
													{category.label}
												</span>
												{category.required && (
													<Lock className="w-3 h-3 text-slate-400" />
												)}
											</div>
											<p className="text-xs text-slate-500 mt-0.5">
												{category.description}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Actions */}
					<div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
						{!showCustomize ? (
							<>
								<Button
									variant="outline"
									className="flex-1 h-11 rounded-full border-slate-300 hover:bg-slate-100"
									onClick={() => setShowCustomize(true)}
								>
									Anpassa
								</Button>
								<Button
									className="flex-1 h-11 rounded-full bg-primary hover:bg-primary-hover"
									onClick={acceptAll}
								>
									Tillåt alla
								</Button>
							</>
						) : (
							<>
								<Button
									variant="outline"
									className="flex-1 h-11 rounded-full border-slate-300 hover:bg-slate-100"
									onClick={() => setShowCustomize(false)}
								>
									Tillbaka
								</Button>
								<Button
									className="flex-1 h-11 rounded-full bg-primary hover:bg-primary-hover"
									onClick={handleAcceptSelected}
								>
									Spara inställningar
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// Cookie Settings Modal (for managing consent after initial choice)
function CookieSettingsModal() {
	const {
		showSettings,
		closeSettings,
		preferences,
		consentData,
		withdrawConsent,
		acceptSelected,
	} = useCookieConsent();
	const [showDetails, setShowDetails] = React.useState(false);

	if (!showSettings) return null;

	const handleWithdraw = () => {
		withdrawConsent();
	};

	const handleChangeConsent = () => {
		// Reset and allow user to choose again
		withdrawConsent();
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 z-[70] bg-black/50"
				onClick={closeSettings}
			/>

			{/* Modal - positioned bottom-right on mobile (near stacked buttons), bottom-left on desktop */}
			<div className="fixed right-4 bottom-[160px] md:left-6 md:right-auto md:bottom-20 z-[70] w-[calc(100vw-2rem)] max-w-[340px] max-h-[60vh] md:max-h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
					<h3 className="text-base font-semibold text-slate-800">
						Cookie-inställningar
					</h3>
					<button
						onClick={closeSettings}
						className="p-1 rounded-full hover:bg-slate-100 transition-colors"
					>
						<X className="w-5 h-5 text-slate-500" />
					</button>
				</div>

				{/* Content */}
				<div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
					<p className="text-sm text-slate-600 mb-4">Dina nuvarande val</p>

					{/* Current preferences */}
					<div className="space-y-2 mb-4">
						{cookieCategories.map((category) => (
							<div key={category.id} className="flex items-center gap-3">
								{category.required ? (
									<Lock className="w-4 h-4 text-slate-400" />
								) : preferences[category.id] ? (
									<Check className="w-4 h-4 text-green-500" />
								) : (
									<X className="w-4 h-4 text-slate-400" />
								)}
								<span className="text-sm text-slate-700">
									{category.label}
								</span>
							</div>
						))}
					</div>

					{/* Show details toggle */}
					<button
						onClick={() => setShowDetails(!showDetails)}
						className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
					>
						Visa detaljer
						{showDetails ? (
							<ChevronUp className="w-4 h-4" />
						) : (
							<ChevronDown className="w-4 h-4" />
						)}
					</button>

					{/* Details */}
					{showDetails && consentData && (
						<div className="mt-4 p-4 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-2">
							<div>
								<span className="font-medium text-slate-700">
									Samtyckesdatum:
								</span>
								<br />
								{format(
									new Date(consentData.consentDate),
									"d MMM yyyy - HH:mm:ss 'GMT'xxx",
									{
										locale: sv,
									}
								)}
							</div>
							<div>
								<span className="font-medium text-slate-700">
									Ditt samtyckes-ID:
								</span>
								<br />
								<span className="break-all">
									{consentData.consentId}
								</span>
							</div>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="px-4 py-3 sm:px-5 sm:py-4 border-t border-slate-200 bg-slate-50/50">
					<div className="flex gap-2 sm:gap-3">
						<Button
							variant="outline"
							size="sm"
							className="flex-1 h-9 sm:h-10 text-xs sm:text-sm font-medium rounded-full border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-all px-3 sm:px-4"
							onClick={handleWithdraw}
						>
							Återkalla
						</Button>
						<Button
							size="sm"
							className="flex-1 h-9 sm:h-10 text-xs sm:text-sm font-medium rounded-full bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all px-3 sm:px-4"
							onClick={handleChangeConsent}
						>
							Ändra samtycke
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

// Floating Cookie Settings Button - Desktop Only
// On mobile, this is rendered inside CallbackPopup for stacked layout
function CookieSettingsButton() {
	const { hasConsented, openSettings } = useCookieConsent();

	// Only show after user has consented, and only on desktop
	if (!hasConsented) return null;

	return (
		<button
			onClick={openSettings}
			className={cn(
				// Hidden on mobile, shown on desktop
				"hidden md:flex",
				// Desktop position
				"fixed bottom-6 left-6 z-50",
				// Desktop styling
				"h-11 px-4",
				"rounded-full",
				"bg-slate-800",
				"text-white",
				"shadow-lg",
				// Layout
				"items-center justify-center gap-2",
				// Transitions
				"transition-all duration-300 ease-out",
				"hover:bg-slate-700 hover:scale-105 hover:shadow-xl",
				"focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2",
				"active:scale-95"
			)}
			aria-label="Cookie-inställningar"
		>
			<Cookie className="w-4 h-4" />
			<span className="text-xs font-medium">Cookies</span>
		</button>
	);
}

// Main CookieConsent Component
export function CookieConsent() {
	return (
		<>
			<CookieBanner />
			<CookieSettingsButton />
			<CookieSettingsModal />
		</>
	);
}
