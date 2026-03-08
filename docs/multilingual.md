# Multilingual Implementation Plan

## Overview
This document outlines the multilingual (i18n) implementation for the website supporting English (default) and Swedish.

## Current Status

### Completed
- [x] next-intl package installed and configured
- [x] Locale routing via proxy.ts (EN: `/`, SV: `/sv/`)
- [x] Translation JSON files created (`messages/en.json`, `messages/sv.json`)
- [x] Language switcher component in navbar
- [x] NextIntlClientProvider configured in `app/[locale]/layout.tsx`

### In Progress
- [ ] Update static UI components to use `useTranslations()` hook
  - [ ] Navigation (header menu items)
  - [ ] Footer (links, copyright, etc.)
  - [ ] Buttons and CTAs
  - [ ] Form labels and placeholders
  - [ ] Error messages
  - [ ] Admin dashboard UI (settings, labels, placeholders)

### Future Tasks
- [ ] CMS Content Auto-Translation (Google Translate API)
  - Products (title, description)
  - Blog posts (title, content, excerpt)
  - Categories
  - Pages (about, quality, store, etc.)
  - FAQ items

---

## Architecture

### 1. Static Content (JSON-based) - CURRENT
All fixed UI text uses translation JSON files:

```
messages/
├── en.json    # English translations (default)
└── sv.json    # Swedish translations
```

**Usage in components:**
```tsx
"use client";
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("namespace");
  return <button>{t("buttonLabel")}</button>;
}
```

**For server components:**
```tsx
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("namespace");
  return <h1>{t("title")}</h1>;
}
```

### 2. Dynamic CMS Content (Future - Google Translate API)
Database content will have auto-translation support:

```typescript
// Future schema structure
interface Product {
  title: string;           // Original (admin input)
  title_en?: string;       // English (auto or manual)
  title_sv?: string;       // Swedish (auto or manual)
  description: string;
  description_en?: string;
  description_sv?: string;
  // ... other fields
}
```

**Translation Strategy:**
1. Admin enters content in primary language
2. On save, Google Translate API generates translations
3. Admin can manually override auto-translations
4. Frontend fetches content based on current locale

---

## URL Structure

| Locale  | URL Pattern | Example |
|---------|-------------|---------|
| English (default) | `/path` | `/products`, `/contact-us` |
| Swedish | `/sv/path` | `/sv/products`, `/sv/contact-us` |

**Note:** `/en/` prefix redirects to `/` (clean URLs for default locale)

---

## Translation JSON Structure

```json
{
  "common": {
    "learnMore": "Learn More",
    "readMore": "Read More",
    "contactUs": "Contact Us",
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "search": "Search",
    "filter": "Filter",
    "noResults": "No results found"
  },
  "navigation": {
    "home": "Home",
    "products": "Products",
    "aboutUs": "About Us",
    "quality": "Quality",
    "ourStore": "Our Store",
    "becomeReseller": "Become Our Reseller",
    "contactUs": "Contact Us",
    "blog": "Blog",
    "faq": "FAQ"
  },
  "footer": {
    "copyright": "All rights reserved",
    "quickLinks": "Quick Links",
    "followUs": "Follow Us",
    "newsletter": "Newsletter",
    "subscribeText": "Subscribe to our newsletter"
  },
  "forms": {
    "name": "Name",
    "email": "Email",
    "phone": "Phone",
    "message": "Message",
    "subject": "Subject",
    "submit": "Submit",
    "required": "Required",
    "optional": "Optional",
    "invalidEmail": "Invalid email address"
  },
  "dashboard": {
    "settings": "Settings",
    "save": "Save Changes",
    "general": "General",
    "appearance": "Appearance",
    "seo": "SEO",
    "analytics": "Analytics"
  }
}
```

---

## Google Translate API Integration (Future Task)

### Implementation Plan
1. Create translation service (`lib/services/translation.service.ts`)
2. Add API route for translation (`app/api/translate/route.ts`)
3. Update CMS models with locale fields
4. Add translation trigger on content save
5. Cache translations to reduce API calls
6. Add admin UI to view/edit translations

### Cost Considerations
- Google Translate API: $20 per 1M characters
- Implement caching to minimize costs
- Only translate changed content
- Allow manual override to avoid re-translation
- Consider batch translation for bulk content

### API Integration Example
```typescript
// lib/services/translation.service.ts
import { Translate } from "@google-cloud/translate/build/src/v2";

const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

export async function translateText(text: string, targetLang: string): Promise<string> {
  const [translation] = await translate.translate(text, targetLang);
  return translation;
}

export async function translateContent(content: Record<string, string>, targetLang: string) {
  const translated: Record<string, string> = {};
  for (const [key, value] of Object.entries(content)) {
    translated[key] = await translateText(value, targetLang);
  }
  return translated;
}
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `i18n/config.ts` | Locale configuration |
| `i18n/request.ts` | next-intl server config |
| `proxy.ts` | Locale routing logic |
| `messages/en.json` | English translations |
| `messages/sv.json` | Swedish translations |
| `components/layout/LanguageSwitcher.tsx` | Language switcher UI |
| `app/[locale]/layout.tsx` | Locale provider wrapper |

---

## Adding a New Language

1. Add locale to `i18n/config.ts`:
   ```typescript
   export const locales = ['en', 'sv', 'de'] as const;
   export const localeLabels = { en: 'English', sv: 'Svenska', de: 'Deutsch' };
   export const localeFlags = { en: '🇬🇧', sv: '🇸🇪', de: '🇩🇪' };
   ```

2. Create translation file `messages/de.json` (copy from en.json and translate)

3. That's it! URL routing and language switcher will automatically work.

---

## Component Update Checklist

### Client-Side Components
- [ ] `components/layout/Navbar.tsx` - Menu items
- [ ] `components/layout/Footer.tsx` - Links, copyright
- [ ] `components/layout/MobileNavbar.tsx` - Mobile menu
- [ ] `components/common/cta-*.tsx` - CTA buttons
- [ ] `components/home/*` - Home page sections
- [ ] `components/forms/*` - Form labels, placeholders

### Admin Dashboard Components
- [ ] Dashboard sidebar navigation
- [ ] Settings page labels
- [ ] Form placeholders and labels
- [ ] Table headers
- [ ] Action buttons
- [ ] Toast messages

### Pages (Server Components)
- [ ] Page titles and meta descriptions
- [ ] Static page content
- [ ] Error pages (404, 500)
