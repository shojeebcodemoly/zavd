# Synos.se Page Requirements Analysis

> **Document Purpose**: Analysis of PDF requirements vs current project implementation
> **Date**: 2025-12-15
> **Status**: Gap Analysis & Refactoring Roadmap

---

## Executive Summary

| Category | Total Items | Implemented | Partial | Missing |
|----------|-------------|-------------|---------|---------|
| Pages | 16 | 9 | 3 | 4 |
| Features | 4 | 1 | 1 | 2 |
| Navigation | 3 | 1 | 2 | 0 |

---

## 1. Cookie Consent (Cookiebot)

### Requirement
> The current synos.se website is using Cookiebot plugin, are we going to use the same or we going to use a built-in function?

### Current Status: **NOT IMPLEMENTED**

**What exists:**
- Google Tag Manager script in root layout
- Facebook Pixel tracking script
- No cookie consent banner or management

**Action Required:**
- [ ] **DECISION NEEDED**: Use Cookiebot (third-party) OR build custom cookie consent
- [ ] Implement GDPR-compliant cookie consent banner
- [ ] Integrate consent with GTM and Facebook Pixel
- [ ] Add cookie preference management

**Recommended Approach:**
- Option A: Cookiebot integration (faster, GDPR-compliant out of box)
- Option B: Custom solution using `cookies-next` + consent management

---

## 2. Phone Callback Popup

### Requirement
> This popup is important, it is collecting the phone number and forwarded to a third-party calling function

### Current Status: **NOT IMPLEMENTED**

**What exists:**
- Contact forms with phone collection on various pages
- Phone validation with `libphonenumber-js`
- No popup/modal for callback requests

**Action Required:**
- [ ] Create callback request popup component
- [ ] Implement trigger logic (time-based, scroll-based, or exit-intent)
- [ ] Integrate with third-party calling service
- [ ] Add phone number validation
- [ ] Store callback requests in database

**Design Reference:**
- Shows: "Bli uppringd inom 55 sekunder" (Get called within 55 seconds)
- Phone input with country code
- Consent checkbox for recording

---

## 3. Blog Page (Nyheter)

### Requirement
> Change page name to **Nyheter** and inspire design from: https://wdtbullish.wpengine.com/blog/with-left-sidebar/

### Current Status: **PARTIAL - Needs Refactoring**

**What exists:**
- `/blogg` - Blog listing page with sidebar
- Blog cards, search, filtering
- Category, tag, author filtering routes

**Mismatches:**
| Aspect | Required | Current |
|--------|----------|---------|
| Page Name | "Nyheter" | "Blogg" |
| Navigation Label | "NYHETER" | "Blogg" |
| Design | Left sidebar layout | Has sidebar (verify design) |

**Action Required:**
- [ ] Rename navigation item from "Blogg" to "Nyheter"
- [ ] Update page title/heading to "Nyheter"
- [ ] Review and align design with inspiration (left sidebar)
- [ ] Keep URL as `/blogg` (SEO consideration) OR redirect

---

## 4. Blog Detail Page

### Requirement
> Inspire from: https://wdtbullish.wpengine.com/why-risk-management-is-your-super-power-10/

### Current Status: **EXISTS - Design Review Needed**

**What exists:**
- `/blogg/[slug]` - Blog detail page
- Components: hero, content, author, comments, related posts

**Action Required:**
- [ ] Review current design against inspiration
- [ ] Refactor layout/styling if needed

---

## 5. Lediga Tjänster (Job Vacancies)

### Requirement
> Inspire from: https://wdtbullish.wpengine.com/our-careers/
> Have to add contact form as the old page

### Current Status: **NOT IMPLEMENTED**

**What exists:**
- Navigation link to `/om-oss/lediga-tjanster`
- **Page does NOT exist**

**Action Required:**
- [ ] Create `/app/(client)/om-oss/lediga-tjanster/page.tsx`
- [ ] Design careers/jobs listing page
- [ ] Add contact/application form
- [ ] Consider job listing data model (static or CMS)

---

## 6. Kontakt (Contact)

### Requirement
> Inspire from: https://wdtbullish.wpengine.com/contact-us/

### Current Status: **EXISTS - Design Review Needed**

**What exists:**
- `/kontakt` - Full contact page
- Contact form with phone, email, subject, message
- Office locations (Stockholm, Linköping)
- FAQ section
- GDPR/marketing consent

**Action Required:**
- [ ] Review design against inspiration
- [ ] Refactor if needed

---

## 7. Om Oss (About Us)

### Requirement
> Inspire from: https://wdtbullish.wpengine.com/about-us/

### Current Status: **EXISTS - Design Review Needed**

**What exists:**
- `/om-oss` - About page with company info
- Feature cards, company values

**Action Required:**
- [ ] Review design against inspiration
- [ ] Refactor if needed

---

## 8. Team Page

### Requirement
> Inspire from: https://wpriverthemes.com/gixus/team/

### Current Status: **NOT IMPLEMENTED**

**What exists:**
- Nothing - no team/staff page

**Action Required:**
- [ ] Create team page (could be part of Om Oss or separate)
- [ ] Design team member cards
- [ ] Consider CMS integration for team data
- [ ] Decide URL: `/om-oss/team` or `/team`

---

## 9. FAQ Page

### Requirement
> Inspire from: https://wdtbullish.wpengine.com/faq/

### Current Status: **EXISTS - Design Review Needed**

**What exists:**
- `/faq` - FAQ page with accordion
- Search functionality
- Newsletter section
- Sidebar with contact info
- Schema.org FAQPage structured data

**Action Required:**
- [ ] Review design against inspiration
- [ ] Refactor if needed

---

## 10. Juridisk Information (Legal/Privacy)

### Requirement
> Inspire from: https://wdtbullish.wpengine.com/listings/investor-coaching/

### Current Status: **PARTIAL**

**What exists:**
- `/integritetspolicy` - Privacy policy page
- Navigation link points to `/om-oss/juridisk-information` (different URL!)

**Mismatches:**
| Aspect | Required | Current |
|--------|----------|---------|
| Nav URL | `/om-oss/juridisk-information` | Links there but page may not exist |
| Actual Page | - | `/integritetspolicy` exists |

**Action Required:**
- [ ] Create `/om-oss/juridisk-information/page.tsx` OR
- [ ] Update navigation to point to `/integritetspolicy`
- [ ] Review design against inspiration

---

## 11. Utbildningar (Training)

### Requirement
> Inspire from: https://wdtbullish.wpengine.com/our-careers/acquisition-advisor/
> Adding a button to https://synos.academy/

### Current Status: **EXISTS - Needs Enhancement**

**What exists:**
- `/utbildningar` - Training page
- Training process steps
- Training inquiry form
- Related resources

**Mismatches:**
| Aspect | Required | Current |
|--------|----------|---------|
| External Link | Button to synos.academy | Not present |

**Action Required:**
- [ ] Add prominent button/CTA linking to https://synos.academy/
- [ ] Review design against inspiration
- [ ] Refactor if needed

---

## 12. Starta Eget (Start Your Own)

### Requirement
> Inspire from: https://wdtbullish.wpengine.com/our-careers/revenue-analyst/
> Have to add contact form as the old page

### Current Status: **EXISTS - Verify Form**

**What exists:**
- `/starta-eget` - Startup page
- Benefits grid
- Contact form section
- Resources grid

**Action Required:**
- [ ] Verify contact form matches old page requirements
- [ ] Review design against inspiration

---

## 13. Varför Välja Synos (Why Choose Synos)

### Requirement
> Inspire from: https://wdtbullish.wpengine.com/our-careers/revenue-analyst/
> Have to add contact form as the old page

### Current Status: **NOT IMPLEMENTED**

**What exists:**
- Navigation link to `/starta-eget/varfor-valja-synos`
- **Page does NOT exist**

**Action Required:**
- [ ] Create `/app/(client)/starta-eget/varfor-valja-synos/page.tsx`
- [ ] Add content about why choose Synos
- [ ] Add contact form

---

## 14. Köpguide (Buying Guide)

### Requirement
> Inspire from: https://wdtbullish.wpengine.com/our-careers/revenue-analyst/
> Have to add contact form as the old page

### Current Status: **NOT IMPLEMENTED**

**What exists:**
- Navigation link to `/starta-eget/kopguide`
- **Page does NOT exist**

**Action Required:**
- [ ] Create `/app/(client)/starta-eget/kopguide/page.tsx`
- [ ] Add buying guide content
- [ ] Add contact form

---

## 15. Miniutbildning (Mini Training)

### Requirement
> Inspire from: https://wdtbullish.wpengine.com/our-careers/revenue-analyst/
> Have to add contact form as the old page

### Current Status: **NOT IMPLEMENTED**

**What exists:**
- Navigation link to `/starta-eget/miniutbildning`
- **Page does NOT exist**

**Action Required:**
- [ ] Create `/app/(client)/starta-eget/miniutbildning/page.tsx`
- [ ] Add mini training content
- [ ] Add contact form

---

## 16. Kategori (Product Categories)

### Requirement
> Produkter Kategori - inspire suitable design!

### Current Status: **EXISTS AS /klinikutrustning**

**What exists:**
- `/klinikutrustning` - Category listing (database-driven)
- `/klinikutrustning/[category]` - Products by category
- `/klinikutrustning/[category]/[slug]` - Product detail

**Mismatches:**
| Aspect | Required | Current |
|--------|----------|---------|
| Nav Label | "Kategori" | "Klinikutrustning" |
| URL | Should be `/kategori` | Is `/klinikutrustning` |

**Action Required:**
- [ ] **DECISION**: Rename to `/kategori` or keep `/klinikutrustning`?
- [ ] Update navigation label to "Kategori"
- [ ] Ensure URL structure: `/kategori/[category]/[product-slug]`

---

## 17. Utrustning (Equipment Overview)

### Requirement
> Inspire from: https://almalasers.com/product/ or https://wpriverthemes.com/HTML/synck/portfolio.html
> Overview page displaying all individual equipment/products

### Current Status: **NOT IMPLEMENTED (as separate page)**

**What exists:**
- `/produkter` - Static products page (demo data)
- `/klinikutrustning` - Database-driven categories

**Required:**
- New `/utrustning` page showing ALL products regardless of category

**Action Required:**
- [ ] Create `/app/(client)/utrustning/page.tsx`
- [ ] Design as product portfolio/overview
- [ ] Link products to their category URLs: `/kategori/[category]/[slug]`
- [ ] Add to main navigation

---

## 18. Main Navigation Structure

### Requirement
> Final navigation: **NYHETER | UTRUSTNING | KATEGORI | STARTA EGET | UTBILDNINGAR | OM OSS | KONTAKT**

### Current Status: **DIFFERENT ORDER & NAMING**

**Current Navigation:**
```
Klinikutrustning | Starta Eget | Utbildningar | Om Oss | Blogg | Kontakt
```

**Required Navigation:**
```
NYHETER | UTRUSTNING | KATEGORI | STARTA EGET | UTBILDNINGAR | OM OSS | KONTAKT
```

**Changes Required:**

| Position | Required | Current | Action |
|----------|----------|---------|--------|
| 1 | NYHETER | Klinikutrustning | Rename "Blogg" to "Nyheter", move to position 1 |
| 2 | UTRUSTNING | Starta Eget | Create new item, link to `/utrustning` |
| 3 | KATEGORI | Utbildningar | Rename "Klinikutrustning" to "Kategori" |
| 4 | STARTA EGET | Om Oss | Keep, move to position 4 |
| 5 | UTBILDNINGAR | Blogg | Keep, move to position 5 |
| 6 | OM OSS | Kontakt | Keep, move to position 6 |
| 7 | KONTAKT | - | Keep at position 7 |

**Action Required:**
- [ ] Update `config/navigation.ts` with new order
- [ ] Rename labels as specified
- [ ] Add "Utrustning" menu item

---

## 19. Mobile Bottom Navigation

### Requirement
> App-like Sticky Bottom Navigation: Hem | Utrustning | Utbildning | Kontak

### Current Status: **EXISTS - Correct**

**What exists:**
```typescript
navItems = [
  { label: "Hem", href: "/" },
  { label: "Utrustning", href: "/produkter" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Utbildning", href: "/utbildningar" }
]
```

**Mismatches:**
| Aspect | Required | Current |
|--------|----------|---------|
| Order | Hem, Utrustning, Utbildning, Kontak | Hem, Utrustning, Kontakt, Utbildning |
| Utrustning URL | `/utrustning` (new page) | `/produkter` |

**Action Required:**
- [ ] Reorder: Hem → Utrustning → Utbildning → Kontakt
- [ ] Update Utrustning href to `/utrustning` (after page is created)

---

## 20. URL Structure Confirmation

### Requirement
> Product URLs MUST follow: `/kategori/[category]/[product-slug]`
> Example: `/kategori/hårborttagning/motus-pro/`

### Current Status: **DIFFERENT**

**Current Structure:**
```
/klinikutrustning/[category]/[slug]
```

**Required Structure:**
```
/kategori/[category]/[slug]
```

**Action Required:**
- [ ] **MAJOR REFACTOR**: Rename `/klinikutrustning` to `/kategori`
- [ ] Update all internal links
- [ ] Set up redirects from old URLs
- [ ] Update sitemap

---

## Priority Matrix (Updated)

### P0 - Critical (Blocking)

- ~~Cookie Consent Implementation~~ → **SKIPPED**
- ~~Phone Callback Popup~~ → **SKIPPED**
- Navigation Restructure
- URL Structure Change (`/klinikutrustning` → `/kategori`, keep old routes)

### P1 - High Priority (Missing Pages)

- `/nyheter` - New blog route (keep `/blogg` as separate page)
- `/utrustning` - Equipment overview page
- `/kategori` - New category route (keep `/klinikutrustning`)
- `/starta-eget/varfor-valja-synos` - Why choose Synos
- `/starta-eget/kopguide` - Buying guide
- `/starta-eget/miniutbildning` - Mini training
- `/om-oss/lediga-tjanster` - Job vacancies
- Team page

### P2 - Medium Priority (Design Alignment)

- Blog detail page - design review
- Contact page - design review
- About page - design review
- FAQ page - design review
- Utbildningar - add synos.academy button

### P3 - Low Priority (Polish)

- Juridisk Information URL alignment
- Mobile bottom nav reorder

---

## Summary of Missing Pages

| Page | Route | Status |
|------|-------|--------|
| Utrustning (Equipment) | `/utrustning` | **CREATE** |
| Varför Välja Synos | `/starta-eget/varfor-valja-synos` | **CREATE** |
| Köpguide | `/starta-eget/kopguide` | **CREATE** |
| Miniutbildning | `/starta-eget/miniutbildning` | **CREATE** |
| Lediga Tjänster | `/om-oss/lediga-tjanster` | **CREATE** |
| Team | `/om-oss/team` or `/team` | **CREATE** |
| Juridisk Information | `/om-oss/juridisk-information` | **CREATE or REDIRECT** |

---

## Summary of Refactors Needed

1. **Navigation Config** (`config/navigation.ts`)
   - Reorder items
   - Rename labels
   - Add Utrustning item

2. **URL Restructure**
   - Rename `/klinikutrustning` → `/kategori`
   - Set up redirects

3. **Mobile Bottom Nav** (`components/layout/MobileBottomNav.tsx`)
   - Reorder items
   - Update Utrustning URL

4. **Blog Naming**
   - Rename "Blogg" to "Nyheter" in navigation
   - Update page headings

5. **New Features**
   - Cookie consent banner
   - Phone callback popup

---

## Decisions (Confirmed)

1. **Cookie Consent**: ~~Cookiebot vs custom solution?~~ → **SKIPPED FOR NOW**
2. **Phone Callback**: ~~Which third-party calling service to integrate?~~ → **SKIPPED FOR NOW**
3. **URL Change**: `/klinikutrustning` → `/kategori` → **YES, but keep old routes for backwards compatibility**
4. **Team Page**: Separate page or section in Om Oss? → **TBD**
5. **Blog URL**: → **Create new `/nyheter` route AND keep existing `/blogg` page/UI**
