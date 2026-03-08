# Synos.se Sitemap Structure Documentation

## Overview

This document provides a comprehensive analysis of the sitemap structure from `https://www.synos.se/sitemap_index.xml` and how it maps to the Next.js App Router folder structure in this project.

---

## Sitemap Index Structure

The main sitemap index contains **7 sub-sitemaps**:

| Sitemap | URL Count | Last Modified | Description |
|---------|-----------|---------------|-------------|
| post-sitemap.xml | 54 | 2025-11-27 | Blog posts |
| page-sitemap.xml | ~5 | 2025-10-08 | Static pages |
| product-sitemap.xml | 15 | 2025-12-10 | Products |
| category-sitemap.xml | 14 | 2025-11-27 | Blog categories |
| post_tag-sitemap.xml | 32 | 2024-05-13 | Blog tags |
| product_category-sitemap.xml | 10 | 2025-12-10 | Product categories |
| author-sitemap.xml | 2 | 2024-09-17 | Authors |

---

## URL Structure Analysis

### 1. Blog Posts (`/blogg/`)

**Pattern:** `/blogg/[slug]/`

**Examples:**
```
/blogg/                                    → Blog listing page
/blogg/varfor-ska-man-valja-lasermaskinen-motus-ax/
/blogg/vilken-laser-ar-bast-for-harborttagning/
/blogg/anteage-det-senaste-inom-stamcellsforskning/
```

**Total URLs:** 54 blog posts + 1 listing page

**Current Implementation:**
- `app/(client)/blogg/page.tsx` → Blog listing
- `app/(client)/blogg/[slug]/page.tsx` → Blog detail

---

### 2. Blog Categories (`/blogg/category/`)

**Pattern:** `/blogg/category/[slug]/`

**Categories (14):**
```
/blogg/category/artikelserier/        → Article series
/blogg/category/behandlingar/         → Treatments
/blogg/category/eftervard/            → Aftercare
/blogg/category/gynekologi/           → Gynecology
/blogg/category/harborttagning/       → Hair removal
/blogg/category/hudatstramning/       → Skin tightening
/blogg/category/hudforyngring/        → Skin rejuvenation
/blogg/category/inkontinens/          → Incontinence
/blogg/category/klinikutrustning/     → Clinic equipment
/blogg/category/muskelatstramning/    → Muscle tightening
/blogg/category/nyheter/              → News
/blogg/category/okategoriserade/      → Uncategorized
/blogg/category/produkter/            → Products
/blogg/category/tatueringsborttagning/ → Tattoo removal
```

**Needed Implementation:**
```
app/(client)/blogg/category/[slug]/page.tsx
```

---

### 3. Blog Tags (`/blogg/tag/`)

**Pattern:** `/blogg/tag/[slug]/`

**Tags (32):**
```
/blogg/tag/fore-och-efter-bilder/     → Before and after images
/blogg/tag/again-pro/                 → Again Pro (product)
/blogg/tag/aknearr/                   → Acne scars
/blogg/tag/co2-laser/                 → CO2 laser
/blogg/tag/coolpeel/                  → CoolPeel
/blogg/tag/duoglide/                  → DuoGlide
/blogg/tag/eftervard/                 → Aftercare
/blogg/tag/fodelsemarken/             → Birthmarks
/blogg/tag/fragor-och-svar/           → Q&A
/blogg/tag/fraknar/                   → Freckles
/blogg/tag/hudvard/                   → Skincare
/blogg/tag/koldioxidlaser/            → Carbon dioxide laser
/blogg/tag/kosmetiska-tatueringar/    → Cosmetic tattoos
/blogg/tag/leverflackar/              → Age spots
/blogg/tag/luxea/                     → Luxea
/blogg/tag/motus-ax/                  → Motus AX
/blogg/tag/motus-ay/                  → Motus AY
/blogg/tag/moveo/                     → Moveo
/blogg/tag/ndyag/                     → Nd:YAG
/blogg/tag/picolaser/                 → Pico laser
/blogg/tag/pigment/                   → Pigment
/blogg/tag/punto/                     → Punto
/blogg/tag/q-switching/               → Q-switching
/blogg/tag/q-terra/                   → Q-Terra
/blogg/tag/q-terra-q10/               → Q-Terra Q10
/blogg/tag/rynkor/                    → Wrinkles
/blogg/tag/smartpico/                 → SmartPico
/blogg/tag/tatueringar/               → Tattoos
/blogg/tag/tatueringsborttagning/     → Tattoo removal
/blogg/tag/vartor/                    → Warts
/blogg/tag/vinterhud/                 → Winter skin
/blogg/tag/vintertorrhud/             → Winter dry skin
```

**Needed Implementation:**
```
app/(client)/blogg/tag/[slug]/page.tsx
```

---

### 4. Blog Authors (`/blogg/author/`)

**Pattern:** `/blogg/author/[slug]/`

**Authors (2):**
```
/blogg/author/agnessynos-se/
/blogg/author/andreassynos-se/
```

**Needed Implementation:**
```
app/(client)/blogg/author/[slug]/page.tsx
```

---

### 5. Products (`/klinikutrustning/`)

**Pattern:** `/klinikutrustning/[category]/[product-slug]/`

**Products (15):**
```
/klinikutrustning/hudforyngring/mpgun/
/klinikutrustning/hudforyngring/ny-smartxide-punto/
/klinikutrustning/kropp-muskler-fett/onda-coolwaves-pro/
/klinikutrustning/co2laser/duoglide/
/klinikutrustning/tatueringsborttagning/smartpico/
/klinikutrustning/ansiktsbehandlingar/jovena/
/klinikutrustning/akne/vivace-rf-microneedling/
/klinikutrustning/hudforyngring/redtouch-pro/
/klinikutrustning/hudforyngring/tetra-pro/
/klinikutrustning/tatueringsborttagning/toro/
/klinikutrustning/harborttagning/motus-ay/
/klinikutrustning/harborttagning/harborttagningslaser-kopa-motus-ax/
/klinikutrustning/tatueringsborttagning/qterra-q10-tatueringsborttagning-laser-sverige/
/klinikutrustning/harborttagning/again-pro/
/klinikutrustning/harborttagning/motus-pro/
```

**Current Implementation (different URL):**
- `app/(client)/produkter/page.tsx` → Product listing
- `app/(client)/produkter/produkt/[slug]/page.tsx` → Product detail

**Note:** The current implementation uses `/produkter/produkt/[slug]` but the sitemap uses `/klinikutrustning/[category]/[slug]`

---

### 6. Product Categories (`/klinikutrustning/`)

**Pattern:** `/klinikutrustning/[category-slug]/`

**Categories (10):**
```
/klinikutrustning/harborttagning/          → Hair removal
/klinikutrustning/tatueringsborttagning/   → Tattoo removal
/klinikutrustning/hudforyngring/           → Skin rejuvenation
/klinikutrustning/co2laser/                → CO2 laser
/klinikutrustning/kropp-muskler-fett/      → Body, muscles, fat
/klinikutrustning/ansiktsbehandlingar/     → Facial treatments
/klinikutrustning/pigmentflackar/          → Pigment spots
/klinikutrustning/akne/                    → Acne
/klinikutrustning/ytliga-blodkarl-angiom/  → Superficial blood vessels, angiomas
/klinikutrustning/kirurgisk-utrustning/    → Surgical equipment
```

---

## Recommended Folder Structure

To match the sitemap URLs, here's the recommended Next.js App Router structure:

```
app/
├── (client)/
│   ├── blogg/
│   │   ├── page.tsx                    # /blogg/ - Blog listing
│   │   ├── [slug]/
│   │   │   └── page.tsx                # /blogg/[slug]/ - Blog post detail
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # /blogg/category/[slug]/ - Category archive
│   │   ├── tag/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # /blogg/tag/[slug]/ - Tag archive
│   │   └── author/
│   │       └── [slug]/
│   │           └── page.tsx            # /blogg/author/[slug]/ - Author archive
│   │
│   ├── klinikutrustning/               # NEW - Replaces /produkter/
│   │   ├── page.tsx                    # /klinikutrustning/ - All products
│   │   └── [category]/
│   │       ├── page.tsx                # /klinikutrustning/[category]/ - Category listing
│   │       └── [slug]/
│   │           └── page.tsx            # /klinikutrustning/[category]/[slug]/ - Product detail
│   │
│   ├── kontakt/
│   │   └── page.tsx                    # /kontakt/
│   ├── om-oss/
│   │   └── page.tsx                    # /om-oss/
│   ├── utbildningar/
│   │   └── page.tsx                    # /utbildningar/
│   ├── starta-eget/
│   │   └── page.tsx                    # /starta-eget/
│   ├── faq/
│   │   └── page.tsx                    # /faq/
│   ├── integritetspolicy/
│   │   └── page.tsx                    # /integritetspolicy/
│   ├── villkor/
│   │   └── page.tsx                    # /villkor/ (if needed)
│   └── page.tsx                        # / - Homepage
│
├── sitemap.ts                          # Dynamic sitemap generator
└── robots.ts                           # Robots.txt generator
```

---

## Data Models Required

### 1. Blog Post Model

```typescript
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  images: string[];
  author: {
    id: string;
    slug: string;
    name: string;
  };
  categories: {
    id: string;
    slug: string;
    name: string;
  }[];
  tags: {
    id: string;
    slug: string;
    name: string;
  }[];
  publishedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}
```

### 2. Blog Category Model

```typescript
interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  parentId?: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Blog Tag Model

```typescript
interface BlogTag {
  id: string;
  slug: string;
  name: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Author Model

```typescript
interface Author {
  id: string;
  slug: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
  postCount: number;
  createdAt: Date;
}
```

### 5. Product Model (Updated for new URL structure)

```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  featuredImage?: string;
  images: string[];
  category: {
    id: string;
    slug: string;     // Used in URL: /klinikutrustning/[category.slug]/[slug]
    name: string;
  };
  specifications?: Record<string, string>;
  features?: string[];
  status: 'draft' | 'published';
  publishedAt?: Date;
  updatedAt: Date;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}
```

### 6. Product Category Model

```typescript
interface ProductCategory {
  id: string;
  slug: string;          // e.g., "harborttagning", "tatueringsborttagning"
  name: string;          // e.g., "Hårborttagning", "Tatueringsborttagning"
  description?: string;
  image?: string;
  productCount: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                               │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP ROUTER                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Server Components                          │   │
│  │                                                               │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │   │
│  │  │ Blog Pages  │  │ Product     │  │ Category/Tag/       │  │   │
│  │  │             │  │ Pages       │  │ Author Pages        │  │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │   │
│  │         │                │                    │              │   │
│  └─────────┼────────────────┼────────────────────┼──────────────┘   │
│            │                │                    │                   │
│            ▼                ▼                    ▼                   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Repository Layer                           │   │
│  │                                                               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐    │   │
│  │  │ BlogRepo     │  │ ProductRepo  │  │ CategoryRepo    │    │   │
│  │  │              │  │              │  │ TagRepo         │    │   │
│  │  │ - getAll()   │  │ - getAll()   │  │ AuthorRepo      │    │   │
│  │  │ - getBySlug()│  │ - getBySlug()│  │                 │    │   │
│  │  │ - search()   │  │ - getByCat() │  │ - getBySlug()   │    │   │
│  │  └──────┬───────┘  └──────┬───────┘  └───────┬─────────┘    │   │
│  │         │                 │                  │               │   │
│  └─────────┼─────────────────┼──────────────────┼───────────────┘   │
│            │                 │                  │                    │
└────────────┼─────────────────┼──────────────────┼────────────────────┘
             │                 │                  │
             ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         MONGODB                                      │
│                                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │ blogposts  │  │ products   │  │ categories │  │ tags       │    │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘    │
│                                                                      │
│  ┌────────────┐  ┌────────────┐                                     │
│  │ authors    │  │ users      │                                     │
│  └────────────┘  └────────────┘                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Sitemap Generation Strategy

Create `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';
import { BlogRepository } from '@/lib/database/repositories/blog.repository';
import { ProductRepository } from '@/lib/database/repositories/product.repository';
// ... other repositories

const BASE_URL = 'https://www.synos.se';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogRepo = new BlogRepository();
  const productRepo = new ProductRepository();
  // ... initialize repositories

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/kontakt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/om-oss`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/utbildningar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blogg`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/klinikutrustning`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/integritetspolicy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Blog posts
  const posts = await blogRepo.getAllPublished();
  const blogPosts: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${BASE_URL}/blogg/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Blog categories
  const categories = await blogRepo.getAllCategories();
  const blogCategories: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${BASE_URL}/blogg/category/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Blog tags
  const tags = await blogRepo.getAllTags();
  const blogTags: MetadataRoute.Sitemap = tags.map(tag => ({
    url: `${BASE_URL}/blogg/tag/${tag.slug}`,
    lastModified: tag.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  // Products (with category in URL)
  const products = await productRepo.getAllPublished();
  const productPages: MetadataRoute.Sitemap = products.map(product => ({
    url: `${BASE_URL}/klinikutrustning/${product.category.slug}/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Product categories
  const productCategories = await productRepo.getAllCategories();
  const productCategoryPages: MetadataRoute.Sitemap = productCategories.map(cat => ({
    url: `${BASE_URL}/klinikutrustning/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Authors
  const authors = await blogRepo.getAllAuthors();
  const authorPages: MetadataRoute.Sitemap = authors.map(author => ({
    url: `${BASE_URL}/blogg/author/${author.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...blogPosts,
    ...blogCategories,
    ...blogTags,
    ...productPages,
    ...productCategoryPages,
    ...authorPages,
  ];
}
```

---

## Implementation Priority

### Phase 1: URL Migration (High Priority)
1. **Migrate products from `/produkter/` to `/klinikutrustning/`**
   - Update routing structure
   - Add redirects for old URLs
   - Update navigation config

### Phase 2: Blog System (High Priority)
2. **Create blog category pages**: `/blogg/category/[slug]/`
3. **Create blog tag pages**: `/blogg/tag/[slug]/`
4. **Create author pages**: `/blogg/author/[slug]/`

### Phase 3: Database Schema
5. **Create/update MongoDB schemas** for:
   - BlogPost
   - BlogCategory
   - BlogTag
   - Author

### Phase 4: Dynamic Sitemap
6. **Implement `app/sitemap.ts`** for automatic sitemap generation

---

## SEO Considerations

### URL Structure Best Practices
- Use Swedish slugs for consistency (e.g., `harborttagning` not `hair-removal`)
- Keep URLs lowercase
- Use hyphens for word separation
- Include category in product URLs for better context

### Metadata Generation
Each page should have dynamic metadata:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await blogRepo.getBySlug(params.slug);

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.seo?.ogImage || post.featuredImage].filter(Boolean),
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author.name],
    },
  };
}
```

---

## Migration Checklist

- [ ] Create `/klinikutrustning/` route structure
- [ ] Set up redirects from `/produkter/` to `/klinikutrustning/`
- [ ] Create `/blogg/category/[slug]/` pages
- [ ] Create `/blogg/tag/[slug]/` pages
- [ ] Create `/blogg/author/[slug]/` pages
- [ ] Create blog category database model
- [ ] Create blog tag database model
- [ ] Create author database model
- [ ] Update product model to include category slug in URL generation
- [ ] Implement dynamic sitemap.ts
- [ ] Add structured data (JSON-LD) for products
- [ ] Add structured data for blog posts
- [ ] Update navigation config with new URLs
- [ ] Test all redirects
- [ ] Submit new sitemap to Google Search Console

---

## Summary

The sitemap analysis reveals a well-structured Swedish e-commerce/blog site focused on clinic equipment. The main changes needed are:

1. **Product URL change**: `/produkter/` → `/klinikutrustning/[category]/[slug]/`
2. **New blog archive pages**: category, tag, and author archives
3. **Database models**: Blog-specific entities need to be created
4. **Dynamic sitemap**: Replace static with generated sitemap

The current project already has good foundations with product and category models, but needs expansion for the full blog system with categories, tags, and authors.
