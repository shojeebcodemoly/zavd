# Product Page SEO Implementation

## Overview

This document outlines the SEO-friendly implementation for the product detail page at `/produkter/produkt/[slug]`. The implementation follows Next.js 15 best practices with server components, dynamic metadata generation, and comprehensive JSON-LD structured data.

## Architecture

```
app/(client)/produkter/produkt/[slug]/
├── page.tsx              # Server Component - data fetching & metadata
├── product-content.tsx   # Client Component - interactive elements
└── lib/
    └── product-seo.ts    # SEO utilities (JSON-LD generators)
```

## Key Components

### 1. Server Component (page.tsx)

**Responsibilities:**
- Fetch product data server-side (no client fetch)
- Generate dynamic metadata via `generateMetadata`
- Render JSON-LD structured data
- Pass data to client components as props

**Benefits:**
- SEO crawlers receive complete HTML with all metadata
- Faster initial page load (no client-side data fetching)
- Better Core Web Vitals (LCP, FID)

### 2. Dynamic Metadata Generation

Using Next.js `generateMetadata` function:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(slug);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.shortDescription,
    openGraph: { ... },
    twitter: { ... },
    robots: { ... },
    alternates: { canonical: ... }
  };
}
```

### 3. JSON-LD Structured Data

Implement multiple schema types for comprehensive SEO:

#### a) Product Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "...",
  "image": ["url1", "url2"],
  "brand": { "@type": "Brand", "name": "Synos Medical" },
  "category": "Medical Equipment",
  "sku": "product-slug"
}
```

#### b) BreadcrumbList Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://..." },
    { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://..." },
    { "@type": "ListItem", "position": 3, "name": "Product Name" }
  ]
}
```

#### c) FAQPage Schema (if FAQs exist)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text"
      }
    }
  ]
}
```

#### d) Organization Schema (brand reference)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Synos Medical AB",
  "url": "https://synos.se",
  "logo": "https://synos.se/logo.png",
  "contactPoint": { ... }
}
```

## Data Flow

```
1. Request → Next.js Server
2. generateMetadata() → Fetch product → Return metadata
3. Page Component → Fetch product (cached) → Render
4. Client receives: HTML + Metadata + JSON-LD + Hydration data
```

## SEO Checklist

### Meta Tags
- [x] `<title>` - Dynamic from product.seo.title or fallback
- [x] `<meta name="description">` - From product.seo.description
- [x] `<meta name="robots">` - Respect product.seo.noindex
- [x] `<link rel="canonical">` - From product.seo.canonicalUrl or default

### Open Graph
- [x] `og:title` - Product title
- [x] `og:description` - Product description
- [x] `og:image` - Product OG image or overview image
- [x] `og:url` - Canonical URL
- [x] `og:type` - "product" or "website"
- [x] `og:site_name` - "Synos Medical"
- [x] `og:locale` - "sv_SE"

### Twitter Cards
- [x] `twitter:card` - "summary_large_image"
- [x] `twitter:title` - Product title
- [x] `twitter:description` - Product description
- [x] `twitter:image` - Product image

### JSON-LD
- [x] Product schema
- [x] BreadcrumbList schema
- [x] FAQPage schema (conditional)
- [x] Organization reference

## Implementation Notes

### Caching Strategy
- Use Next.js `unstable_cache` or `fetch` with revalidation
- Revalidate every 60 seconds or on-demand via webhook

### Image Optimization
- Use absolute URLs for OG images
- Ensure images are 1200x630 for optimal social sharing
- Fallback chain: seo.ogImage → overviewImage → productImages[0]

### Error Handling
- Return `notFound()` for missing products
- Handle API errors gracefully
- Log errors server-side for monitoring

### Performance
- Server-side rendering eliminates layout shift
- Preload critical images
- Minimize client-side JavaScript

## Files to Create/Modify

1. `app/(client)/produkter/produkt/[slug]/page.tsx` - Complete rewrite
2. `app/(client)/produkter/produkt/[slug]/product-content.tsx` - New client component
3. `lib/seo/product-jsonld.ts` - JSON-LD generators
4. `lib/seo/index.ts` - SEO utilities barrel export

## Testing

1. Use Google Rich Results Test
2. Validate with Schema.org validator
3. Test with Facebook Sharing Debugger
4. Test with Twitter Card Validator
5. Check Core Web Vitals in PageSpeed Insights
