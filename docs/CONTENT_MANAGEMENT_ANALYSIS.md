# Content Management Analysis

> **Purpose**: Document which pages have static vs dynamic content for CMS migration planning
> **Date**: 2025-12-17
> **Goal**: Enable admin dashboard management of all page content

---

## Summary

| Content Type | Page Count | Percentage |
|--------------|------------|------------|
| Fully Static (Hardcoded) | 12 | 55% |
| Fully Dynamic (Database) | 8 | 36% |
| Mixed (Static + Dynamic) | 2 | 9% |

---

## Pages by Content Type

### Fully Static Pages (Hardcoded Content)

These pages have ALL content hardcoded in the component files. No database queries.

| # | Page | Route | Content Elements |
|---|------|-------|------------------|
| 1 | Home | `/` | Hero, features, testimonials, about section, CTA |
| 2 | Om Oss | `/om-oss` | Company description, values, mission, contact info |
| 3 | Juridisk Information | `/om-oss/juridisk-information` | Legal terms, privacy info, GDPR, company details |
| 4 | Team | `/om-oss/team` | Team members (6 dummy profiles), stats, values |
| 5 | Lediga Tjänster | `/om-oss/lediga-tjanster` | Job info, benefits, values, CTA |
| 6 | Kontakt | `/kontakt` | Contact info, office locations, FAQ section |
| 7 | FAQ | `/faq` | All 6 FAQ questions/answers (from faq-data.ts) |
| 8 | Starta Eget | `/starta-eget` | Benefits, services, resources |
| 9 | Varför Välja Synos | `/starta-eget/varfor-valja-synos` | Features, benefits, reasons |
| 10 | Köpguide | `/starta-eget/kopguide` | Guide steps, checklist items |
| 11 | Miniutbildning | `/starta-eget/miniutbildning` | Training info, benefits, learning outcomes |
| 12 | Utbildningar | `/utbildningar` | Training programs, process steps, benefits |

### Fully Dynamic Pages (Database Content)

These pages load ALL content from the database via repositories.

| # | Page | Route | Database Models | Revalidation |
|---|------|-------|-----------------|--------------|
| 1 | Nyheter Listing | `/nyheter` | IBlogPost, IUser | On-demand |
| 2 | Nyheter Detail | `/nyheter/[slug]` | IBlogPost, IUser, BlogComment | 1 min |
| 3 | Blogg Listing | `/blogg` | IBlogPost, IBlogCategory, IUser | On-demand |
| 4 | Blogg Detail | `/blogg/[slug]` | IBlogPost, IUser, BlogComment | 1 min |
| 5 | Kategori Listing | `/kategori` | IProduct, ICategory | 1 hour |
| 6 | Kategori Category | `/kategori/[category]` | IProduct, ICategory | 1 hour |
| 7 | Kategori Product | `/kategori/[category]/[slug]` | IProduct, ICategory | 1 min |
| 8 | Produkt Detail | `/produkter/produkt/[slug]` | IProduct | 1 min |

### Mixed Content Pages

These pages have some static and some dynamic content.

| # | Page | Route | Static Content | Dynamic Content |
|---|------|-------|----------------|-----------------|
| 1 | Utrustning | `/utrustning` | Hero, headings, CTA | Products, categories |
| 2 | Produkter | `/produkter` | Layout, hero | Featured products (hardcoded array) |

---

## Detailed Static Content Inventory

### 1. Home Page (`/`)

**File**: `app/(client)/page.tsx`

```
Static Content:
├── Hero Section
│   ├── Title: "Avancerad teknologi för estetisk medicin"
│   ├── Subtitle: "Vi levererar världsledande..."
│   └── CTA buttons
├── Search Section
│   └── Search placeholder text
├── Feature Highlights (3 cards)
│   ├── Card 1: Expertis (title, description)
│   ├── Card 2: Innovation (title, description)
│   └── Card 3: Support (title, description)
├── Product Showcase
│   └── Static product images and descriptions
├── Image Gallery
│   └── Gallery images (hardcoded paths)
├── Process Steps (4 steps)
│   ├── Step 1: Konsultation
│   ├── Step 2: Val av utrustning
│   ├── Step 3: Installation
│   └── Step 4: Utbildning
├── Testimonials (3 testimonials)
│   ├── Customer name, company, quote
│   └── Rating stars
├── About Section
│   └── Company overview text
└── CTA Section
    └── Call-to-action text and buttons
```

### 2. Om Oss (`/om-oss`)

**File**: `app/(client)/om-oss/page.tsx`

```
Static Content:
├── Hero Section
│   ├── Title: "Om Synos Medical"
│   └── Description text
├── Company Description
│   ├── "Professionell leverantör..."
│   ├── "Med kunden i fokus..."
│   └── "Utbildning och service..."
├── Values Section
│   ├── Value 1: Kvalitet
│   ├── Value 2: Service
│   ├── Value 3: Innovation
│   └── Value 4: Partnerskap
├── Contact Information
│   ├── Phone: 010-205 15 01
│   ├── Email: info@synosmedical.se
│   └── Addresses (Stockholm, Linköping)
└── CTA Section
```

### 3. Team Page (`/om-oss/team`)

**File**: `app/(client)/om-oss/team/page.tsx`

```
Static Content (DUMMY DATA):
├── Team Members Array (6 members)
│   ├── Anna Lindqvist - VD & Grundare
│   ├── Erik Johansson - Försäljningschef
│   ├── Maria Bergström - Utbildningsansvarig
│   ├── Johan Andersson - Teknisk Chef
│   ├── Sara Nilsson - Marknadsansvarig
│   └── Peter Svensson - Ekonomichef
├── Stats Section
│   ├── "10+ År i branschen"
│   ├── "15+ Teammedlemmar"
│   ├── "200+ Nöjda kunder"
│   └── "100% Engagemang"
├── Values Section
│   ├── Expertis
│   ├── Partnerskap
│   ├── Innovation
│   └── Service
└── CTA Section
```

### 4. FAQ Page (`/faq`)

**File**: `app/(client)/faq/page.tsx`
**Data File**: `data/faq/faq-data.ts`

```
Static Content:
├── FAQ Items (6 questions)
│   ├── Q1: Vilka typer av laser erbjuder ni?
│   ├── Q2: Hur lång är leveranstiden?
│   ├── Q3: Erbjuder ni utbildning?
│   ├── Q4: Vad ingår i serviceavtalet?
│   ├── Q5: Hur fungerar finansiering?
│   └── Q6: Kan jag boka en demo?
├── Categories
│   ├── Produkter
│   ├── Leverans
│   ├── Utbildning
│   └── Service
└── Newsletter Section
```

### 5. Kontakt (`/kontakt`)

**File**: `app/(client)/kontakt/page.tsx`

```
Static Content:
├── Hero Section
│   ├── Title: "Kontakta Oss"
│   └── Description
├── Contact Methods (3 cards)
│   ├── Telefon: 010-205 15 01
│   ├── Email: info@synosmedical.se
│   └── Besök oss
├── Office Locations
│   ├── Stockholm: Turebergsvägen 5, 191 47 Sollentuna
│   └── Linköping: Datalinjen 5, 582 78 Linköping
├── Contact Form Labels
│   ├── Namn
│   ├── Email
│   ├── Telefon
│   ├── Ämne
│   └── Meddelande
└── FAQ Section (embedded)
```

### 6. Starta Eget (`/starta-eget`)

**File**: `app/(client)/starta-eget/page.tsx`

```
Static Content:
├── Hero Section
│   ├── Title: "Starta Din Egen Klinik"
│   └── Description
├── Benefits Section (3 cards)
│   ├── Komplett utrustning
│   ├── Utbildning & support
│   └── Finansieringslösningar
├── Services Section
│   ├── Service item descriptions
│   └── Feature lists
├── Resources Grid (3 cards)
│   ├── Varför välja Synos?
│   ├── Köpguide
│   └── Miniutbildning
└── Contact Form Section
```

### 7. Utbildningar (`/utbildningar`)

**File**: `app/(client)/utbildningar/page.tsx`

```
Static Content:
├── Hero Section
│   ├── Title: "Utbildningar"
│   └── Description
├── Training Benefits (3 cards)
│   ├── Certifierade utbildare
│   ├── Praktisk träning
│   └── Flexibla scheman
├── Training Process (4 steps)
│   ├── Step 1: Kontakt
│   ├── Step 2: Planering
│   ├── Step 3: Utbildning
│   └── Step 4: Certifiering
├── Support Section
│   └── Ongoing support description
└── Related Resources (links)

MISSING: Button to synos.academy (per PDF requirements)
```

### 8. Köpguide (`/starta-eget/kopguide`)

**File**: `app/(client)/starta-eget/kopguide/page.tsx`

```
Static Content:
├── Hero Section
├── Guide Steps (4 steps)
│   ├── Step 1: Analysera dina behov
│   ├── Step 2: Budget och finansiering
│   ├── Step 3: Jämför alternativ
│   └── Step 4: Fatta beslut
├── Checklist (8 items)
│   ├── Definiera målgrupp
│   ├── Lokalkrav
│   ├── Investeringsbudget
│   ├── Utbildningsbehov
│   ├── Serviceavtal
│   ├── Garantivillkor
│   ├── Leveranstider
│   └── Referenskliniker
└── Contact Form Section
```

### 9. Miniutbildning (`/starta-eget/miniutbildning`)

**File**: `app/(client)/starta-eget/miniutbildning/page.tsx`

```
Static Content:
├── Hero Section
├── Benefits (3 cards)
│   ├── Kostnadsfritt
│   ├── Flexibelt
│   └── Praktiskt
├── Learning Outcomes (6 items)
│   ├── Grundläggande laserkunskap
│   ├── Säkerhetsrutiner
│   ├── Behandlingstekniker
│   ├── Kundhantering
│   ├── Marknadsföring
│   └── Affärsplanering
├── How It Works Section
└── Contact Form Section
```

---

## CMS Migration Priority

### Priority 1: High Impact, Easy Migration

| Page | Current State | CMS Model Needed |
|------|---------------|------------------|
| FAQ | Static array in data file | `FAQ` model (question, answer, category, order) |
| Team | Hardcoded dummy data | `TeamMember` model (name, role, bio, image, department) |

### Priority 2: Medium Impact

| Page | Current State | CMS Model Needed |
|------|---------------|------------------|
| Home | Multiple static sections | `PageContent` or section-based models |
| Om Oss | Hardcoded company info | `CompanyInfo` + `Value` models |
| Testimonials | Hardcoded in Home | `Testimonial` model |

### Priority 3: Lower Priority (Stable Content)

| Page | Current State | Notes |
|------|---------------|-------|
| Juridisk Information | Legal text | Rarely changes, can stay static |
| Kontakt | Contact info | Uses siteConfig, minimal changes |
| Starta Eget pages | Marketing content | Can remain static initially |

---

## Proposed CMS Models

### 1. FAQ Model

```typescript
interface IFAQ {
  _id: ObjectId;
  question: string;
  answer: string;           // Rich text/markdown
  category: string;         // "Produkter", "Leverans", etc.
  order: number;            // Display order
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. TeamMember Model

```typescript
interface ITeamMember {
  _id: ObjectId;
  name: string;
  role: string;
  department: string;       // "Ledning", "Försäljning", etc.
  bio: string;              // Rich text
  image: string;            // Image URL
  email?: string;
  linkedin?: string;
  phone?: string;
  order: number;            // Display order
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Testimonial Model

```typescript
interface ITestimonial {
  _id: ObjectId;
  customerName: string;
  companyName: string;
  role?: string;
  quote: string;            // Rich text
  rating: number;           // 1-5
  image?: string;           // Customer photo
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. PageContent Model (Generic)

```typescript
interface IPageContent {
  _id: ObjectId;
  pageSlug: string;         // "home", "om-oss", "kontakt"
  sectionKey: string;       // "hero", "features", "cta"
  title?: string;
  subtitle?: string;
  content?: string;         // Rich text/markdown
  items?: Array<{           // For lists/cards
    title: string;
    description: string;
    icon?: string;
    link?: string;
  }>;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
  updatedAt: Date;
}
```

### 5. CompanyInfo Model

```typescript
interface ICompanyInfo {
  _id: ObjectId;
  companyName: string;
  orgNumber: string;
  vatNumber: string;
  description: string;      // Rich text
  mission?: string;
  vision?: string;
  phone: string;
  email: string;
  offices: Array<{
    name: string;           // "Stockholm", "Linköping"
    address: string;
    city: string;
    postalCode: string;
    isHeadquarters: boolean;
  }>;
  socialMedia: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  updatedAt: Date;
}
```

---

## Implementation Roadmap

### Phase 1: Quick Wins (1-2 days)

1. Create FAQ model and admin CRUD
2. Create TeamMember model and admin CRUD
3. Update /faq page to fetch from database
4. Update /om-oss/team page to fetch from database

### Phase 2: Testimonials & Reviews (1 day)

1. Create Testimonial model
2. Add admin management for testimonials
3. Update Home page testimonials section

### Phase 3: Page Content Management (3-5 days)

1. Design flexible PageContent model
2. Create admin interface for page sections
3. Migrate Home page sections
4. Migrate Om Oss page content
5. Add rich text editor (TipTap/Slate)

### Phase 4: Company Settings (1 day)

1. Create CompanyInfo model
2. Admin settings page
3. Update siteConfig to read from database
4. Update Kontakt page

---

## Current Admin Dashboard

**Existing Models with Admin UI:**

- Products (`IProduct`) - Full CRUD
- Categories (`ICategory`) - Full CRUD
- Blog Posts (`IBlogPost`) - Full CRUD
- Blog Categories (`IBlogCategory`) - Full CRUD
- Users (`IUser`) - Full CRUD
- Form Submissions - Read-only

**Missing Admin UI:**

- FAQ
- Team Members
- Testimonials
- Page Content
- Company Info

---

## Files to Modify Per Phase

### Phase 1 Files

```
Create:
├── models/faq.model.ts
├── models/team-member.model.ts
├── lib/repositories/faq.repository.ts
├── lib/repositories/team-member.repository.ts
├── app/api/faqs/route.ts
├── app/api/faqs/[id]/route.ts
├── app/api/team-members/route.ts
├── app/api/team-members/[id]/route.ts
├── app/(dashboard)/dashboard/faqs/page.tsx
├── app/(dashboard)/dashboard/team/page.tsx
├── components/admin/FAQForm.tsx
└── components/admin/TeamMemberForm.tsx

Modify:
├── app/(client)/faq/page.tsx (fetch from DB)
├── app/(client)/om-oss/team/page.tsx (fetch from DB)
└── components/admin/AdminSidebar.tsx (add menu items)
```

---

## Notes

1. **Revalidation Strategy**: When CMS content is updated, use on-demand revalidation (`revalidatePath`) to refresh pages immediately.

2. **Rich Text Editor**: Consider TipTap or Slate.js for admin content editing with formatting support.

3. **Image Management**: Existing image upload infrastructure can be reused for team photos and testimonials.

4. **Localization Ready**: Design models with potential i18n support (lang field) for future Swedish/English content.
