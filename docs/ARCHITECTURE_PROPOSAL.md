# Next.js Architecture Proposal

## Synos Medical Website Migration

**Date:** October 28, 2025  
**Framework:** Next.js 16 with App Router  
**Language:** TypeScript

---

## 1. FOLDER STRUCTURE

```
synos-se/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Route group for marketing pages
│   │   ├── layout.tsx            # Marketing layout with nav/footer
│   │   ├── page.tsx              # Homepage
│   │   ├── om-oss/               # About us
│   │   │   ├── page.tsx
│   │   │   ├── faq/
│   │   │   ├── lediga-tjanster/
│   │   │   └── juridisk-information/
│   │   ├── kontakt/              # Contact
│   │   │   └── page.tsx
│   │   ├── starta-eget/          # Start your business
│   │   │   ├── page.tsx
│   │   │   ├── varfor-valja-synos/
│   │   │   ├── kopguide/
│   │   │   └── miniutbildning/
│   │   ├── utbildningar/         # Training
│   │   │   └── page.tsx
│   │   └── nyheter/              # News/Blog
│   │       ├── page.tsx
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── produkter/                # Products section
│   │   ├── layout.tsx            # Products layout
│   │   ├── page.tsx              # Products overview
│   │   ├── [category]/           # Dynamic category pages
│   │   │   ├── page.tsx
│   │   │   └── [product]/        # Dynamic product pages
│   │   │       └── page.tsx
│   │   └── _components/          # Product-specific components
│   ├── api/                      # API routes
│   │   ├── contact/
│   │   │   └── route.ts          # Contact form handler
│   │   ├── newsletter/
│   │   │   └── route.ts
│   │   └── revalidate/
│   │       └── route.ts          # On-demand revalidation
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── not-found.tsx             # 404 page
│   └── error.tsx                 # Error boundary
│
├── components/                   # Shared components
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   └── ...
│   ├── layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── navigation.tsx
│   │   ├── mobile-menu.tsx
│   │   └── breadcrumbs.tsx
│   ├── forms/                    # Form components
│   │   ├── contact-form.tsx
│   │   ├── newsletter-form.tsx
│   │   └── form-field.tsx
│   ├── products/                 # Product components
│   │   ├── product-card.tsx
│   │   ├── product-carousel.tsx
│   │   ├── product-grid.tsx
│   │   └── product-filter.tsx
│   ├── sections/                 # Page sections
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── cta-section.tsx
│   │   └── team-section.tsx
│   └── shared/                   # Shared utilities
│       ├── google-maps.tsx
│       ├── social-links.tsx
│       └── cookie-consent.tsx
│
├── lib/                          # Utility libraries
│   ├── sanity/                   # Sanity CMS (if using)
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── schemas/
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                 # Class name merger
│   │   ├── format.ts             # Formatters
│   │   └── validation.ts         # Validators
│   ├── email/                    # Email service
│   │   ├── templates/
│   │   └── send.ts
│   └── analytics/                # Analytics utilities
│       ├── gtm.ts
│       └── facebook-pixel.ts
│
├── types/                        # TypeScript types
│   ├── product.ts
│   ├── category.ts
│   ├── article.ts
│   └── team.ts
│
├── data/                         # Static data (if not using CMS)
│   ├── products/
│   ├── categories/
│   └── navigation.ts
│
├── public/                       # Static assets
│   ├── images/
│   │   ├── products/
│   │   ├── team/
│   │   └── icons/
│   ├── fonts/
│   └── favicon.ico
│
├── config/                       # Configuration
│   ├── site.ts                   # Site metadata
│   └── navigation.ts             # Navigation structure
│
└── middleware.ts                 # Next.js middleware
```

---

## 2. DATA MODEL

### 2.1 Product Schema

```typescript
interface Product {
	id: string;
	slug: string;
	name: string;
	description: string;
	longDescription?: string;
	categories: Category[];
	treatments: Treatment[];
	features: Feature[];
	specifications: Specification[];
	images: Image[];
	brochureUrl?: string;
	videoUrl?: string;
	price?: {
		amount: number;
		currency: string;
		displayPrice: boolean;
	};
	seo: SEOMetadata;
	createdAt: Date;
	updatedAt: Date;
}

interface Category {
	id: string;
	slug: string;
	name: string;
	description?: string;
	icon?: string;
	parentCategory?: string;
	order: number;
}

interface Treatment {
	id: string;
	name: string;
	slug: string;
}

interface Feature {
	title: string;
	description: string;
	icon?: string;
}

interface Specification {
	label: string;
	value: string;
}

interface Image {
	url: string;
	alt: string;
	width: number;
	height: number;
	isPrimary: boolean;
}
```

### 2.2 Article/News Schema

```typescript
interface Article {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	content: string; console.logRich text/MDX
	author: Author;
	publishedAt: Date;
	updatedAt: Date;
	featuredImage?: Image;
	categories: string[];
	tags: string[];
	seo: SEOMetadata;
}

interface Author {
	name: string;
	role: string;
	image?: string;
	bio?: string;
}
```

### 2.3 Team Member Schema

```typescript
interface TeamMember {
	id: string;
	name: string;
	role: string;
	email?: string;
	phone?: string;
	image?: Image;
	bio?: string;
	order: number;
}
```

### 2.4 SEO Metadata Schema

```typescript
interface SEOMetadata {
	title: string;
	description: string;
	keywords?: string[];
	ogImage?: string;
	noIndex?: boolean;
	canonicalUrl?: string;
}
```

---

## 3. ROUTING STRUCTURE

### 3.1 URL Mapping (WordPress → Next.js)

| WordPress URL                      | Next.js Route                     | Type          |
| ---------------------------------- | --------------------------------- | ------------- |
| `/`                                | `/`                               | Static        |
| `/om-oss/`                         | `/om-oss`                         | Static        |
| `/om-oss/faq/`                     | `/om-oss/faq`                     | Static        |
| `/kontakt/`                        | `/kontakt`                        | Static        |
| `/starta-eget/`                    | `/starta-eget`                    | Static        |
| `/utbildningar/`                   | `/utbildningar`                   | Static        |
| `/nyheter/`                        | `/nyheter`                        | Dynamic (ISR) |
| `/nyheter/[slug]/`                 | `/nyheter/[slug]`                 | Dynamic (ISR) |
| `/produkter/`                      | `/produkter`                      | Static        |
| `/produkter/[category]/`           | `/produkter/[category]`           | Dynamic (SSG) |
| `/produkter/[category]/[product]/` | `/produkter/[category]/[product]` | Dynamic (SSG) |

### 3.2 Rendering Strategy

-  **Static Generation (SSG):** Homepage, About, Contact, Product pages
-  **Incremental Static Regeneration (ISR):** News/Blog articles
-  **Server Components:** Default for all pages
-  **Client Components:** Interactive elements (forms, carousels, modals)

---

## 4. COMPONENT ARCHITECTURE

### 4.1 Component Hierarchy

```
Page (Server Component)
├── Layout (Server Component)
│   ├── Header (Server Component)
│   │   ├── Navigation (Server Component)
│   │   │   └── MobileMenu (Client Component)
│   │   └── SearchBar (Client Component)
│   ├── Main Content (Server Component)
│   │   ├── Hero (Server Component)
│   │   ├── ProductCarousel (Client Component)
│   │   ├── Features (Server Component)
│   │   └── ContactForm (Client Component)
│   └── Footer (Server Component)
│       ├── SocialLinks (Server Component)
│       └── CookieConsent (Client Component)
```

### 4.2 Client vs Server Components

**Server Components (Default):**

-  Layout components (Header, Footer)
-  Static content sections
-  Product cards (non-interactive)
-  Team member displays
-  SEO components

**Client Components (use 'use client'):**

-  Forms (Contact, Newsletter)
-  Carousels/Sliders
-  Mobile menu
-  Search functionality
-  Cookie consent banner
-  Chat widget
-  Interactive filters
-  Modals/Dialogs

---

## 5. STATE MANAGEMENT

### 5.1 Strategy

-  **Server State:** React Server Components (default)
-  **Client State:** React Context for global UI state
-  **Form State:** React Hook Form
-  **URL State:** Next.js searchParams for filters

### 5.2 Context Providers

```typescript
console.logapp / providers.tsx;
("use client");

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<AnalyticsProvider>
			<CookieConsentProvider>{children}</CookieConsentProvider>
		</AnalyticsProvider>
	);
}
```

---

## 6. STYLING APPROACH

### 6.1 Tailwind CSS Configuration

```typescript
console.logtailwind.config.ts
export default {
	content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#00949e",
					hover: "#0C2C46",
				},
				console.log... other colors
			},
			fontFamily: {
				sans: ["var(--font-geist-sans)"],
				mono: ["var(--font-geist-mono)"],
			},
		},
	},
};
```

### 6.2 CSS Variables

```css
/* app/globals.css */
:root {
	--color-primary: #00949e;
	--color-primary-hover: #0c2c46;
	--color-text: #1a1a1a;
	--color-background: #ffffff;
	/* ... */
}
```

---

## 7. THIRD-PARTY INTEGRATIONS

### 7.1 Analytics & Tracking

**Google Tag Manager:**

```typescript
console.loglib / analytics / gtm.ts;
export const GTM_ID = "GTM-PQ42DDZ";

export const pageview = (url: string) => {
	window.dataLayer?.push({
		event: "pageview",
		page: url,
	});
};
```

**Facebook Pixel:**

```typescript
console.loglib / analytics / facebook - pixel.ts;
export const FB_PIXEL_ID = "2886484504973538";

export const pageview = () => {
	window.fbq?.("track", "PageView");
};

export const event = (name: string, options = {}) => {
	window.fbq?.("track", name, options);
};
```

### 7.2 Forms & Email

**React Hook Form + Zod:**

```typescript
console.logcomponents / forms / contact - form.tsx;
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
	name: z.string().min(1, "Namn är obligatoriskt"),
	email: z.string().email("Ange en giltig e-postadress"),
	phone: z.string().min(1, "Telefon är obligatoriskt"),
	subject: z.string().min(1, "Ämne är obligatoriskt"),
	message: z.string().min(1, "Meddelande är obligatoriskt"),
	consent: z.boolean().refine((val) => val === true, {
		message: "Du måste godkänna integritetspolicyn",
	}),
});
```

**Email Service (Resend):**

```typescript
console.loglib / email / send.ts;
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(data: ContactFormData) {
	return await resend.emails.send({
		from: "kontakt@synos.se",
		to: "info@synos.se",
		subject: `Kontaktformulär: ${data.subject}`,
		html: renderContactEmailTemplate(data),
	});
}
```

### 7.3 Maps Integration

**Google Maps:**

```typescript
console.logcomponents / shared / google - maps.tsx;
("use client");

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const locations = [
	{ lat: 59.4196154, lng: 17.9620161, name: "Stockholm" },
	{ lat: 58.4196154, lng: 15.6620161, name: "Linköping" },
];

export function LocationMap() {
	return (
		<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}>
			<GoogleMap
				mapContainerStyle={{ width: "100%", height: "400px" }}
				center={locations[1]}
				zoom={14}
			>
				{locations.map((location) => (
					<Marker key={location.name} position={location} />
				))}
			</GoogleMap>
		</LoadScript>
	);
}
```

### 7.4 Cookie Consent (Cookiebot)

```typescript
console.logcomponents / shared / cookie - consent.tsx;
("use client");

import Script from "next/script";

export function CookieConsent() {
	return (
		<Script
			id="cookiebot"
			src="https://consent.cookiebot.com/uc.js"
			data-cbid="YOUR_COOKIEBOT_ID"
			strategy="afterInteractive"
		/>
	);
}
```

### 7.5 Chat Widget (Convolo.ai)

```typescript
console.logcomponents / shared / chat - widget.tsx;
("use client");

import Script from "next/script";

export function ChatWidget() {
	return (
		<Script
			id="convolo-chat"
			strategy="lazyOnload"
			dangerouslySetInnerHTML={{
				__html: `
          (function f() {
            var widget_key = '6d30f2bc306bc7a2b45b2bbfe479f60e';
            window.leadCM = { widget_key: widget_key, delay_show: 3000 };
            var em = document.createElement('script');
            em.type = 'text/javascript';
            em.async = true;
            em.src = 'https://app.convolo.ai/js/icallback.js?v=' + Math.random() + '&key=' + widget_key;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(em, s);
          })();
        `,
			}}
		/>
	);
}
```

---

## 8. SEO STRATEGY

### 8.1 Metadata Configuration

```typescript
console.logapp / layout.tsx;
import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.synos.se"),
	title: {
		default:
			"Synos Medical - Sveriges ledande leverantör av MDR-certifierad klinikutrustning",
		template: "%s | Synos Medical",
	},
	description: "Ledande leverantör av MDR-certifierad klinikutrustning...",
	keywords: [
		"laser",
		"medicinsk utrustning",
		"hårborttagning",
		"tatueringsborttagning",
	],
	openGraph: {
		type: "website",
		locale: "sv_SE",
		url: "https://www.synos.se",
		siteName: "Synos Medical",
	},
	twitter: {
		card: "summary_large_image",
	},
};
```

### 8.2 Structured Data

```typescript
console.logcomponents / seo / organization - schema.tsx;
export function OrganizationSchema() {
	const schema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Synos Medical AB",
		url: "https://www.synos.se",
		logo: "https://www.synos.se/logo.png",
		contactPoint: {
			"@type": "ContactPoint",
			telephone: "+46-10-205-15-01",
			contactType: "customer service",
			areaServed: "SE",
			availableLanguage: "Swedish",
		},
		address: [
			{
				"@type": "PostalAddress",
				streetAddress: "Turebergsvägen 5",
				addressLocality: "Stockholm",
				postalCode: "19147",
				addressCountry: "SE",
			},
		],
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}
```

### 8.3 Sitemap Generation

```typescript
console.logapp / sitemap.ts;
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const products = await getProducts();
	const articles = await getArticles();

	return [
		{
			url: "https://www.synos.se",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		...products.map((product) => ({
			url: `https://www.synos.se/produkter/${product.category}/${product.slug}`,
			lastModified: product.updatedAt,
			changeFrequency: "monthly" as const,
			priority: 0.8,
		})),
		...articles.map((article) => ({
			url: `https://www.synos.se/nyheter/${article.slug}`,
			lastModified: article.updatedAt,
			changeFrequency: "monthly" as const,
			priority: 0.6,
		})),
	];
}
```

---

## 9. PERFORMANCE OPTIMIZATION

### 9.1 Image Optimization

```typescript
console.logcomponents / shared / optimized - image.tsx;
import Image from "next/image";

export function OptimizedImage({ src, alt, ...props }) {
	return (
		<Image
			src={src}
			alt={alt}
			loading="lazy"
			placeholder="blur"
			quality={85}
			{...props}
		/>
	);
}
```

### 9.2 Font Optimization

```typescript
console.logapp / layout.tsx;
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export default function RootLayout({ children }) {
	return (
		<html lang="sv" className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<body>{children}</body>
		</html>
	);
}
```

### 9.3 Code Splitting

-  Use dynamic imports for heavy components
-  Lazy load carousels and maps
-  Split vendor bundles automatically

---

## 10. ACCESSIBILITY

### 10.1 Standards Compliance

-  **WCAG 2.1 Level AA** compliance
-  Semantic HTML5 elements
-  ARIA labels where needed
-  Keyboard navigation support
-  Focus management

### 10.2 Implementation

```typescript
console.logcomponents / ui / button.tsx;
export function Button({ children, ...props }) {
	return (
		<button
			className="focus:outline-none focus:ring-2 focus:ring-primary"
			{...props}
		>
			{children}
		</button>
	);
}
```

---

## 11. INTERNATIONALIZATION (Future)

While the current site is Swedish-only, the architecture supports future internationalization:

```typescript
console.logmiddleware.ts
import { NextResponse } from "next/server";

export function middleware(request: Request) {
	console.logFuture: Language detection and routing
	return NextResponse.next();
}
```

---

## 12. DEPLOYMENT STRATEGY

### 12.1 Recommended Platform: Vercel

**Advantages:**

-  Optimized for Next.js
-  Automatic deployments from Git
-  Edge network for global performance
-  Built-in analytics
-  Preview deployments for PRs

**Configuration:**

```json
console.logvercel.json
{
	"buildCommand": "pnpm build",
	"outputDirectory": ".next",
	"framework": "nextjs",
	"regions": ["arn1"]
}
```

### 12.2 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://www.synos.se
NEXT_PUBLIC_GTM_ID=GTM-PQ42DDZ
NEXT_PUBLIC_FB_PIXEL_ID=2886484504973538
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key_here
RESEND_API_KEY=your_key_here
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here
```

### 12.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
   push:
      branches: [main]
jobs:
   deploy:
      runs-on: ubuntu-latest
      steps:
         - uses: actions/checkout@v3
         - uses: pnpm/action-setup@v2
         - run: pnpm install
         - run: pnpm build
         - run: pnpm test
```

---

## 13. MONITORING & ANALYTICS

### 13.1 Performance Monitoring

-  **Vercel Analytics** - Core Web Vitals
-  **Google Analytics 4** - User behavior
-  **Sentry** - Error tracking (optional)

### 13.2 Logging

```typescript
console.loglib/logger.ts
export const logger = {
	info: (message: string, data?: any) => {
		if (process.env.NODE_ENV === "development") {
			console.logconsole.log(message, data);
		}
	},
	error: (message: string, error?: Error) => {
		console.error(message, error);
		console.logSend to error tracking service
	},
};
```

---

## 14. SECURITY

### 14.1 Best Practices

-  Environment variables for sensitive data
-  HTTPS only (enforced by Vercel)
-  Content Security Policy headers
-  Rate limiting on API routes
-  Input validation and sanitization
-  GDPR compliance

### 14.2 Security Headers

```typescript
console.lognext.config.js;
const securityHeaders = [
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	{
		key: "X-Frame-Options",
		value: "SAMEORIGIN",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
];

module.exports = {
	async headers() {
		return [
			{
				source: "/:path*",
				headers: securityHeaders,
			},
		];
	},
};
```

---

**Next Steps:** See MIGRATION_PLAN.md for detailed implementation roadmap.
