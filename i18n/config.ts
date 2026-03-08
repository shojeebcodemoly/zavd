/**
 * i18n Configuration
 *
 * Defines supported locales and default locale for the application.
 * English is the default locale (no prefix required).
 * Swedish requires /sv/ prefix.
 */

export const locales = ['en', 'sv'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Labels for the language switcher
export const localeLabels: Record<Locale, string> = {
	en: 'English',
	sv: 'Svenska',
};

// Short labels for compact display
export const localeShortLabels: Record<Locale, string> = {
	en: 'EN',
	sv: 'SV',
};

// Flag emojis (optional, for visual display)
export const localeFlags: Record<Locale, string> = {
	en: '🇬🇧',
	sv: '🇸🇪',
};
