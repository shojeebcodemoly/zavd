/**
 * i18n Configuration
 *
 * Defines supported locales and default locale for the application.
 * English is the default locale (no prefix required).
 * Swedish requires /sv/ prefix.
 */

export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

// Labels for the language switcher
export const localeLabels: Record<Locale, string> = {
	de: 'Deutsch',
	en: 'English',
};

// Short labels for compact display
export const localeShortLabels: Record<Locale, string> = {
	de: 'DE',
	en: 'EN',
};

// Flag emojis (optional, for visual display)
export const localeFlags: Record<Locale, string> = {
	de: '🇩🇪',
	en: '🇬🇧',
};
