import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { GTM_ID } from "@/lib/analytics/gtm";
import { FB_PIXEL_ID } from "@/lib/analytics/facebook-pixel";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { getSiteSettings } from "@/lib/services/site-settings.service";

// Montserrat - ZAVD Heading Font (H1, H2, Hero titles) — Weight 600/700
const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-heading",
	display: "swap",
	weight: ["600", "700"],
});

// Inter - ZAVD Body Font (navigation, buttons, body text) — Weight 400
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
	weight: ["400", "500"],
});

// Default keywords as fallback
const DEFAULT_KEYWORDS = [
	"ZAVD",
	"Assyrian association Germany",
	"refugee support",
	"integration Germany",
	"asylum counseling",
	"volunteering",
	"Zentralverband Assyrischer Vereinigungen",
];

/**
 * Generate dynamic metadata from database site settings
 */
export async function generateMetadata(): Promise<Metadata> {
	const settings = await getSiteSettings();

	const siteUrl =
		process.env.SITE_URL ||
		process.env.BETTER_AUTH_URL ||
		"http://localhost:3000";

	const siteName = settings.seo?.siteName || "ZAVD";
	const siteTagline = settings.seo?.siteTagline || "Zentralverband Assyrischer Vereinigungen in Deutschland";
	const siteDescription =
		settings.seo?.siteDescription ||
		"Zentralverband der Assyrischen Vereinigungen in Deutschland und europäischen Sektionen.";
	const ogImage = settings.seo?.ogImage || "/og-image.jpg";
	const keywords =
		settings.seo?.keywords && settings.seo.keywords.length > 0
			? settings.seo.keywords
			: DEFAULT_KEYWORDS;
	const companyName = settings.companyName || "ZAVD";

	return {
		metadataBase: new URL(siteUrl),
		title: {
			default: `${siteName} - ${siteTagline}`,
			template: `%s | ${siteName}`,
		},
		description: siteDescription,
		keywords,
		authors: [{ name: companyName }],
		creator: companyName,
		openGraph: {
			type: "website",
			locale: "sv_SE",
			url: siteUrl,
			title: siteName,
			description: siteDescription,
			siteName: siteName,
			images: ogImage
				? [
						{
							url: ogImage,
							width: 1200,
							height: 630,
							alt: siteName,
						},
				  ]
				: [],
		},
		twitter: {
			card: "summary_large_image",
			title: siteName,
			description: siteDescription,
			images: ogImage ? [ogImage] : [],
			creator: settings.seo?.twitterHandle,
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="de" className="overflow-x-hidden" suppressHydrationWarning>
			<head>
				{/* Google Tag Manager - only loads when GTM_ID is configured */}
				{GTM_ID && (
					<Script
						id="gtm-script"
						strategy="afterInteractive"
						dangerouslySetInnerHTML={{
							__html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
						}}
					/>
				)}
				{/* Facebook Pixel - only loads when FB_PIXEL_ID is configured */}
				{FB_PIXEL_ID && (
					<>
						<Script
							id="fb-pixel"
							strategy="afterInteractive"
							dangerouslySetInnerHTML={{
								__html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
							}}
						/>
						<noscript>
							<img
								height="1"
								width="1"
								style={{ display: "none" }}
								src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
								alt=""
							/>
						</noscript>
					</>
				)}
			</head>
			<body
				className={`${inter.variable} ${montserrat.variable} antialiased bg-background font-sans overflow-x-hidden`}
			>
				{/* Google Tag Manager (noscript) */}
				{GTM_ID && (
					<noscript>
						<iframe
							src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
							height="0"
							width="0"
							style={{ display: "none", visibility: "hidden" }}
						/>
					</noscript>
				)}

				<NuqsAdapter>{children}</NuqsAdapter>
				<ToasterProvider />
			</body>
		</html>
	);
}
