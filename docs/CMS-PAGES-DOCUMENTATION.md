# Synos CMS Pages Documentation

> Comprehensive documentation of all pages, their CMS integration status, and MongoDB models.

---

## Quick Summary

| Status | Count | Description |
|--------|-------|-------------|
| **CMS-Integrated** | 25+ | Pages fetching content from MongoDB |
| **Hardcoded UI** | 2 | Auth pages (login/register) |
| **Dashboard (Admin)** | 20+ | Admin interfaces for content management |

---

## Table of Contents

1. [Client-Facing Pages](#client-facing-pages)
2. [Dashboard/Admin Pages](#dashboardadmin-pages)
3. [CMS Models](#cms-models)
4. [Pages Needing CMS Data](#pages-needing-cms-data)

---

## Client-Facing Pages

### Main Pages

| Route | Page Name | CMS Status | Model | Dashboard Editor |
|-------|-----------|------------|-------|------------------|
| `/` | Home | ✅ CMS | `HomePage` | `/dashboard/webbplats/startsida` |
| `/kontakt` | Contact | ✅ CMS | `KontaktPage` | `/dashboard/webbplats/kontakt` |
| `/om-oss` | About | ✅ CMS | `AboutPage` | `/dashboard/webbplats/om-oss` |
| `/integritetspolicy` | Privacy Policy | ✅ CMS | `PrivacyPage` | `/dashboard/webbplats/integritetspolicy` |
| `/faq` | FAQ | ✅ CMS | `FAQPage` | `/dashboard/webbplats/faq` |
| `/starta-eget` | Start Your Own | ✅ CMS | `StartaEgetPage` | `/dashboard/webbplats/starta-eget` |
| `/utbildningar` | Training | ✅ CMS | `TrainingPage` | `/dashboard/webbplats/utbildningar` |

### Product/Equipment Pages

| Route | Page Name | CMS Status | Model | Dashboard Editor |
|-------|-----------|------------|-------|------------------|
| `/produkter` | All Products | ✅ CMS | `Product`, `Category` | `/dashboard/products` |
| `/produkter/produkt/[slug]` | Product Detail | ✅ CMS | `Product` | `/dashboard/products/[id]` |
| `/utrustning` | Equipment Portfolio | ✅ CMS | `Product`, `Category` | `/dashboard/products` |
| `/utrustning/[category]` | Equipment by Category | ✅ CMS | `Product`, `Category` | - |
| `/utrustning/[category]/[slug]` | Equipment Detail | ✅ CMS | `Product` | - |
| `/kategori` | Categories | ✅ CMS | `Category` | `/dashboard/categories` |
| `/kategori/[category]` | Category Products | ✅ CMS | `Product`, `Category` | - |
| `/kategori/[category]/[slug]` | Product by Category | ✅ CMS | `Product` | - |
| `/klinikutrustning` | Clinic Equipment | ✅ CMS | `Product`, `Category` | - |
| `/klinikutrustning/[category]` | Equipment by Category | ✅ CMS | `Product`, `Category` | - |
| `/klinikutrustning/[category]/[slug]` | Equipment Detail | ✅ CMS | `Product` | - |

### Blog/News Pages

| Route | Page Name | CMS Status | Model | Dashboard Editor |
|-------|-----------|------------|-------|------------------|
| `/blogg` | Blog Listing | ✅ CMS | `BlogPost`, `BlogCategory` | `/dashboard/blog` |
| `/blogg/[slug]` | Blog Post | ✅ CMS | `BlogPost` | `/dashboard/blog/[id]` |
| `/blogg/category/[slug]` | Blog by Category | ✅ CMS | `BlogPost`, `BlogCategory` | - |
| `/blogg/author/[slug]` | Blog by Author | ✅ CMS | `BlogPost`, `User` | - |
| `/blogg/tag/[slug]` | Blog by Tag | ✅ CMS | `BlogPost` | - |
| `/nyheter` | News Listing | ✅ CMS | `BlogPost`, `BlogCategory` | `/dashboard/blog` |
| `/nyheter/[slug]` | News Article | ✅ CMS | `BlogPost` | `/dashboard/blog/[id]` |
| `/nyheter/category/[slug]` | News by Category | ✅ CMS | `BlogPost`, `BlogCategory` | - |
| `/nyheter/author/[slug]` | News by Author | ✅ CMS | `BlogPost`, `User` | - |
| `/nyheter/tag/[slug]` | News by Tag | ✅ CMS | `BlogPost` | - |

### About Company Sub-Pages

| Route | Page Name | CMS Status | Model | Dashboard Editor |
|-------|-----------|------------|-------|------------------|
| `/om-oss/team` | Team | ✅ CMS | `TeamPage` | `/dashboard/webbplats/team` |
| `/om-oss/lediga-tjanster` | Careers | ✅ CMS | `CareersPage` | `/dashboard/webbplats/lediga-tjanster` |
| `/om-oss/juridisk-information` | Legal | ✅ CMS | `LegalPage` | `/dashboard/webbplats/juridisk-information` |

### Startup Guide Sub-Pages

| Route | Page Name | CMS Status | Model | Dashboard Editor |
|-------|-----------|------------|-------|------------------|
| `/starta-eget` | Main Page | ✅ CMS | `StartaEgetPage` | `/dashboard/webbplats/starta-eget` |
| `/starta-eget/kopguide` | Buying Guide | ⚠️ Needs Review | - | - |
| `/starta-eget/miniutbildning` | Mini Training | ⚠️ Needs Review | - | - |
| `/starta-eget/varfor-valja-synos` | Why Choose Synos | ⚠️ Needs Review | - | - |

### Authentication Pages (Not CMS)

| Route | Page Name | CMS Status | Notes |
|-------|-----------|------------|-------|
| `/login` | Login | ❌ Hardcoded | Better Auth integration |
| `/register` | Register | ❌ Hardcoded | Better Auth integration |

---

## Dashboard/Admin Pages

All dashboard pages are admin-only interfaces with forms to manage CMS content.

### Content Management

| Route | Purpose | Model Managed |
|-------|---------|---------------|
| `/dashboard` | Overview | Stats from multiple models |
| `/dashboard/products` | Product listing | `Product` |
| `/dashboard/products/new` | Create product | `Product` |
| `/dashboard/products/[id]` | Edit product | `Product` |
| `/dashboard/categories` | Category listing | `Category` |
| `/dashboard/categories/new` | Create category | `Category` |
| `/dashboard/categories/[id]` | Edit category | `Category` |

### Blog Management

| Route | Purpose | Model Managed |
|-------|---------|---------------|
| `/dashboard/blog` | Blog listing | `BlogPost` |
| `/dashboard/blog/new` | Create post | `BlogPost` |
| `/dashboard/blog/[id]` | Edit post | `BlogPost` |
| `/dashboard/blog/categories` | Blog categories | `BlogCategory` |
| `/dashboard/blog/categories/new` | Create blog category | `BlogCategory` |
| `/dashboard/blog/categories/[id]` | Edit blog category | `BlogCategory` |
| `/dashboard/comments` | Comment moderation | `BlogComment` |

### Website Pages Management

| Route | Purpose | Model Managed |
|-------|---------|---------------|
| `/dashboard/webbplats/startsida` | Home page editor | `HomePage` |
| `/dashboard/webbplats/om-oss` | About page editor | `AboutPage` |
| `/dashboard/webbplats/kontakt` | Contact page editor | `KontaktPage` |
| `/dashboard/webbplats/faq` | FAQ page editor | `FAQPage` |
| `/dashboard/webbplats/integritetspolicy` | Privacy editor | `PrivacyPage` |
| `/dashboard/webbplats/juridisk-information` | Legal editor | `LegalPage` |
| `/dashboard/webbplats/team` | Team page editor | `TeamPage` |
| `/dashboard/webbplats/lediga-tjanster` | Careers editor | `CareersPage` |
| `/dashboard/webbplats/starta-eget` | Startup guide editor | `StartaEgetPage` |
| `/dashboard/webbplats/utbildningar` | Training editor | `TrainingPage` |

### Other Dashboard Pages

| Route | Purpose | Model Managed |
|-------|---------|---------------|
| `/dashboard/inquiries` | Form submissions | `FormSubmission` |
| `/dashboard/inquiries/[id]` | View inquiry | `FormSubmission` |
| `/dashboard/users` | User management | `User` |
| `/dashboard/profile` | User profile | `Profile` |
| `/dashboard/settings` | Site settings | `SiteSettings` |
| `/dashboard/storage` | File management | Storage service |

---

## CMS Models

### Singleton Page Models (One document per collection)

| Model | Collection | Purpose | Has Seed Data |
|-------|------------|---------|---------------|
| `HomePage` | `home_page` | Homepage content | ✅ Yes |
| `AboutPage` | `about_page` | About page content | ❌ No |
| `KontaktPage` | `kontakt_page` | Contact page content | ❌ No |
| `FAQPage` | `faq_page` | FAQ page content | ❌ No |
| `PrivacyPage` | `privacy_page` | Privacy policy | ❌ No |
| `LegalPage` | `legal_page` | Legal information | ❌ No |
| `TeamPage` | `team_page` | Team page content | ❌ No |
| `CareersPage` | `careers_page` | Job listings | ❌ No |
| `StartaEgetPage` | `starta_eget_page` | Startup guide | ❌ No |
| `TrainingPage` | `training_page` | Training content | ❌ No |
| `SiteSettings` | `site_settings` | Global settings | ✅ Has defaults |

### Content Models (Multiple documents)

| Model | Collection | Purpose |
|-------|------------|---------|
| `Product` | `products` | Products/equipment |
| `Category` | `categories` | Product categories |
| `BlogPost` | `blog_posts` | Blog articles |
| `BlogCategory` | `blog_categories` | Blog categories |
| `BlogComment` | `blog_comments` | Post comments |
| `User` | `user` | User accounts |
| `Profile` | `profiles` | User profiles |
| `FormSubmission` | `form_submissions` | Contact inquiries |

---

## Pages Needing CMS Data

The following singleton page models need seed data from the reference website (synos.se):

### Priority 1 - Main Pages

| Page | Model | Reference URL | Status |
|------|-------|---------------|--------|
| Home | `HomePage` | https://www.synos.se/ | ✅ DONE |
| About | `AboutPage` | https://www.synos.se/om-oss/ | ❌ Needs data |
| Contact | `KontaktPage` | https://www.synos.se/kontakt/ | ❌ Needs data |
| FAQ | `FAQPage` | https://www.synos.se/faq/ | ❌ Needs data |

### Priority 2 - Information Pages

| Page | Model | Reference URL | Status |
|------|-------|---------------|--------|
| Privacy | `PrivacyPage` | https://www.synos.se/integritetspolicy/ | ❌ Needs data |
| Legal | `LegalPage` | https://www.synos.se/juridisk-information/ | ❌ Needs data |
| Team | `TeamPage` | https://www.synos.se/om-oss/team/ | ❌ Needs data |

### Priority 3 - Service Pages

| Page | Model | Reference URL | Status |
|------|-------|---------------|--------|
| Training | `TrainingPage` | https://www.synos.se/utbildningar/ | ❌ Needs data |
| Careers | `CareersPage` | https://www.synos.se/lediga-tjanster/ | ❌ Needs data |
| Start Own | `StartaEgetPage` | https://www.synos.se/starta-eget/ | ❌ Needs data |

### Content to Import

| Content Type | Model | Reference URL | Status |
|--------------|-------|---------------|--------|
| Products | `Product` | https://www.synos.se/klinikutrustning/ | ❌ Needs data |
| Categories | `Category` | https://www.synos.se/klinikutrustning/ | ❌ Needs data |
| Blog Posts | `BlogPost` | https://www.synos.se/blogg/ | ❌ Needs data |

---

## Architecture Notes

### Data Flow

```
MongoDB (Collections)
    ↓
Models (Mongoose Schemas)
    ↓
Repositories (Data Access)
    ↓
Services (Business Logic + Caching)
    ↓
Server Components (Next.js Pages)
    ↓
Client UI (React Components)
```

### Caching Strategy

- **ISR (Incremental Static Regeneration):** Used for listing pages
  - Product listings: 24 hours
  - Blog listings: 24 hours
  - Equipment: 1 hour
- **On-Demand Revalidation:** After CMS updates via dashboard

### SEO Integration

Every CMS page model includes:
- `seo.title` - Page title
- `seo.description` - Meta description
- `seo.ogImage` - OpenGraph image
- Some include `seo.keywords`, `seo.canonicalUrl`, `seo.noindex`

---

## Next Steps

1. Create seed scripts for remaining pages (About, Contact, FAQ, etc.)
2. Analyze reference website for each page's content structure
3. Import product data and categories
4. Import blog posts and news articles
5. Set up proper ISR revalidation for all pages

---

*Last updated: December 29, 2025*
