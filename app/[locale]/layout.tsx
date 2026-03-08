import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";

// Generate static params for all supported locales
export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
	children,
	params,
}: LocaleLayoutProps) {
	const { locale } = await params;

	// Validate that the incoming locale is supported
	if (!locales.includes(locale as Locale)) {
		notFound();
	}

	// Enable static rendering by setting the locale for this request
	setRequestLocale(locale);

	// Get messages for the current locale - explicitly pass locale
	const messages = await getMessages({ locale });

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			{children}
		</NextIntlClientProvider>
	);
}
