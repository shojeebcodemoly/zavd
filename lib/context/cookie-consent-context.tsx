"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	ReactNode,
} from "react";

export interface CookiePreferences {
	necessary: boolean; // Always true, cannot be disabled
	settings: boolean;
	statistics: boolean;
	marketing: boolean;
}

export interface CookieConsentData {
	preferences: CookiePreferences;
	consentDate: string;
	consentId: string;
}

interface CookieConsentContextType {
	hasConsented: boolean;
	preferences: CookiePreferences;
	consentData: CookieConsentData | null;
	showBanner: boolean;
	showSettings: boolean;
	acceptAll: () => void;
	acceptSelected: (preferences: Partial<CookiePreferences>) => void;
	withdrawConsent: () => void;
	openSettings: () => void;
	closeSettings: () => void;
}

const COOKIE_CONSENT_KEY = "synos_cookie_consent";

const defaultPreferences: CookiePreferences = {
	necessary: true,
	settings: false,
	statistics: false,
	marketing: false,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(
	undefined
);

function generateConsentId(): string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < 44; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result + "==";
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
	const [hasConsented, setHasConsented] = useState(true); // Default true to prevent flash
	const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
	const [consentData, setConsentData] = useState<CookieConsentData | null>(null);
	const [showBanner, setShowBanner] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	// Load consent from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
		if (stored) {
			try {
				const data: CookieConsentData = JSON.parse(stored);
				setConsentData(data);
				setPreferences(data.preferences);
				setHasConsented(true);
				setShowBanner(false);
			} catch {
				// Invalid data, show banner
				setHasConsented(false);
				setShowBanner(true);
			}
		} else {
			setHasConsented(false);
			setShowBanner(true);
		}
		setIsInitialized(true);
	}, []);

	const saveConsent = useCallback((newPreferences: CookiePreferences) => {
		const data: CookieConsentData = {
			preferences: newPreferences,
			consentDate: new Date().toISOString(),
			consentId: generateConsentId(),
		};
		localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(data));
		setConsentData(data);
		setPreferences(newPreferences);
		setHasConsented(true);
		setShowBanner(false);
		setShowSettings(false);
	}, []);

	const acceptAll = useCallback(() => {
		saveConsent({
			necessary: true,
			settings: true,
			statistics: true,
			marketing: true,
		});
	}, [saveConsent]);

	const acceptSelected = useCallback(
		(selected: Partial<CookiePreferences>) => {
			saveConsent({
				necessary: true, // Always required
				settings: selected.settings ?? false,
				statistics: selected.statistics ?? false,
				marketing: selected.marketing ?? false,
			});
		},
		[saveConsent]
	);

	const withdrawConsent = useCallback(() => {
		localStorage.removeItem(COOKIE_CONSENT_KEY);
		setConsentData(null);
		setPreferences(defaultPreferences);
		setHasConsented(false);
		setShowBanner(true);
		setShowSettings(false);
	}, []);

	const openSettings = useCallback(() => {
		setShowSettings(true);
	}, []);

	const closeSettings = useCallback(() => {
		setShowSettings(false);
	}, []);

	return (
		<CookieConsentContext.Provider
			value={{
				hasConsented,
				preferences,
				consentData,
				showBanner: isInitialized && showBanner, // Only show banner after initialization
				showSettings,
				acceptAll,
				acceptSelected,
				withdrawConsent,
				openSettings,
				closeSettings,
			}}
		>
			{children}
		</CookieConsentContext.Provider>
	);
}

export function useCookieConsent() {
	const context = useContext(CookieConsentContext);
	if (context === undefined) {
		throw new Error("useCookieConsent must be used within a CookieConsentProvider");
	}
	return context;
}
