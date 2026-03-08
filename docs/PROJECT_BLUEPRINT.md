# Synos Medical - Project Blueprint

> **Purpose**: This document serves as a comprehensive technical blueprint for converting/redesigning this project into another one. It covers architecture, patterns, data flow, styling, and all technical decisions that enable a smooth transformation.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Architecture Patterns](#4-architecture-patterns)
5. [Database & Models](#5-database--models)
6. [Authentication System](#6-authentication-system)
7. [API Layer](#7-api-layer)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Styling System](#9-styling-system)
10. [Component Library](#10-component-library)
11. [CMS System](#11-cms-system)
12. [File Storage](#12-file-storage)
13. [SEO & Metadata](#13-seo--metadata)
14. [Caching & Revalidation](#14-caching--revalidation)
15. [Navigation System](#15-navigation-system)
16. [Forms & Validation](#16-forms--validation)
17. [Analytics Integration](#17-analytics-integration)
18. [Environment Configuration](#18-environment-configuration)
19. [Conversion Checklist](#19-conversion-checklist)

---

## 1. Project Overview

### What This Project Is

A **Next.js 16 App Router** application for a Swedish medical equipment supplier (Synos Medical). It features:

- **Product catalog** with categories, detailed specifications, before/after galleries
- **Blog/News section** with categories, tags, and author pages
- **CMS-powered pages** (Home, About, FAQ, Contact, etc.)
- **Admin dashboard** for content management
- **User authentication** with protected routes
- **File storage system** for media management
- **Multi-office contact information** with Google Maps integration

### Key Characteristics

| Aspect | Description |
|--------|-------------|
| Language | Swedish (sv_SE locale) |
| Target Market | Sweden |
| Business Type | B2B Medical Equipment |
| Content Model | CMS-driven with database-stored content |
| Authentication | Email/password via Better Auth |

---

## 2. Technology Stack

### Core Framework

```json
{
  "next": "16.0.10",
  "react": "19.2.0",
  "typescript": "^5"
}
```

### Database

```json
{
  "mongoose": "^9.0.0",
  "mongodb": "^7.0.0"
}
```

### Authentication

```json
{
  "better-auth": "^1.4.4"
}
```

### UI Components

```json
{
  "@radix-ui/react-*": "various",
  "lucide-react": "^0.554.0",
  "framer-motion": "^12.23.24",
  "swiper": "^12.0.3"
}
```

### Forms & Validation

```json
{
  "react-hook-form": "^7.65.0",
  "zod": "^4.1.12",
  "@hookform/resolvers": "^5.2.2"
}
```

### Styling

```json
{
  "tailwindcss": "^4",
  "tailwind-merge": "^3.3.1",
  "class-variance-authority": "^0.7.1",
  "tw-animate-css": "^1.4.0"
}
```

### Rich Text Editor

```json
{
  "suneditor": "^2.47.8",
  "suneditor-react": "^3.6.1"
}
```

### Additional

```json
{
  "date-fns": "^4.1.0",
  "sanitize-html": "^2.17.0",
  "resend": "^6.3.0",
  "nuqs": "^2.8.4",
  "next-themes": "^0.4.6",
  "@react-google-maps/api": "^2.20.7"
}
```

---

## 3. Project Structure

```
synos/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group (login, register)
│   ├── (client)/                 # Public pages route group
│   ├── (dashboard)/              # Protected admin route group
│   ├── api/                      # API routes
│   ├── sitemap/                  # Dynamic sitemaps
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles & design tokens
│   ├── robots.ts                 # Dynamic robots.txt
│   ├── sitemap.ts                # Sitemap index
│   └── error.tsx                 # Error boundaries
│
├── components/                   # React components
│   ├── admin/                    # CMS/Dashboard components
│   ├── common/                   # Shared utilities (Logo, Container)
│   ├── forms/                    # Form components
│   ├── home/                     # Home page sections
│   ├── layout/                   # Navbar, Footer, Mobile nav
│   ├── products/                 # Product-related components
│   ├── search/                   # Search UI components
│   ├── storage/                  # File management UI
│   ├── ui/                       # shadcn/ui primitives
│   └── [feature]/                # Feature-specific components
│
├── lib/                          # Business logic
│   ├── analytics/                # GTM, Facebook Pixel
│   ├── context/                  # React contexts
│   ├── db/                       # Database connection & auth
│   ├── hooks/                    # Custom React hooks
│   ├── repositories/             # Data access layer
│   ├── revalidation/             # ISR cache management
│   ├── services/                 # Business logic layer
│   ├── seo/                      # SEO utilities & JSON-LD
│   ├── storage/                  # File storage service
│   ├── utils/                    # Utilities & helpers
│   └── validations/              # Zod schemas
│
├── models/                       # Mongoose schemas
├── config/                       # Configuration files
├── public/                       # Static assets
│   └── storage/                  # Uploaded files
├── scripts/                      # Seed scripts
├── types/                        # TypeScript definitions
└── docs/                         # Documentation
```

### Route Groups Explained

| Group | Purpose | Layout |
|-------|---------|--------|
| `(auth)` | Login/Register pages | Minimal layout |
| `(client)` | Public-facing pages | Navbar + Footer |
| `(dashboard)` | Admin panel | Dashboard shell with sidebar |

---

## 4. Architecture Patterns

### Repository Pattern

All database operations go through repositories that extend `BaseRepository`:

```typescript
// lib/repositories/base.repository.ts
export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  async findAll(filter, options): Promise<T[]>
  async findPaginated(filter, page, limit, sort): Promise<PaginatedResult<T>>
  async findOne(filter): Promise<T | null>
  async findById(id): Promise<T | null>
  async create(data): Promise<T>
  async updateById(id, update): Promise<T | null>
  async deleteById(id): Promise<T | null>
  async count(filter): Promise<number>
  async exists(filter): Promise<boolean>
}
```

**Usage Example:**

```typescript
// lib/repositories/product.repository.ts
export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(getProductModelSync());
  }

  // Custom methods specific to products
  async findBySlug(slug: string): Promise<IProduct | null> { }
  async findPublished(): Promise<IProduct[]> { }
}

export const productRepository = new ProductRepository();
```

### Service Layer

Services contain business logic and call repositories:

```typescript
// lib/services/product.service.ts
export const productService = {
  async getAll(options): Promise<IProduct[]> {
    // Business logic + validation
    return productRepository.findPaginated(...)
  },

  async create(data): Promise<IProduct> {
    // Validate with Zod
    const validated = productSchema.parse(data);
    // Create via repository
    const product = await productRepository.create(validated);
    // Trigger revalidation
    await revalidateProduct(product.slug);
    return product;
  }
}
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     API Route Handler                        │
│  app/api/products/route.ts                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│  lib/services/product.service.ts                            │
│  - Validation (Zod)                                         │
│  - Business logic                                           │
│  - Caching                                                  │
│  - Revalidation triggers                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Repository Layer                          │
│  lib/repositories/product.repository.ts                     │
│  - CRUD operations                                          │
│  - Query building                                           │
│  - Database connection management                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Mongoose Model                           │
│  models/product.model.ts                                    │
│  - Schema definition                                        │
│  - Indexes                                                  │
│  - Virtuals                                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Database & Models

### Connection Management

```typescript
// lib/db/db-connect.ts
declare global {
  var __mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    uri: string | null;
  } | undefined;
}

export async function connectMongoose() {
  // Singleton pattern with global caching
  // Handles reconnection on URI change
}
```

### Core Models

#### User Model (Better Auth Integration)

```typescript
interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;           // unique
  name: string;
  emailVerified: boolean;
  image?: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Product Model

```typescript
interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;                    // unique, URL-safe
  description: string;             // Rich HTML
  shortDescription?: string;
  productDescription?: string;     // Second rich HTML block
  benefits: string[];
  certifications: string[];        // Tags
  treatments: string[];            // Tags
  productImages: string[];         // URLs
  overviewImage?: string;
  beforeAfterImages: IBeforeAfterImage[];
  techSpecifications: ITechSpec[];
  documentation: IDocumentEntry[];
  purchaseInfo?: IPurchaseInfo;
  seo: ISeo;
  categories: ObjectId[];          // Multi-category support
  primaryCategory?: ObjectId;      // For URL generation
  qa: IQnA[];
  youtubeUrl?: string;
  publishType: "publish" | "draft" | "pending" | "private";
  visibility: "public" | "hidden";
  lastEditedBy?: ObjectId;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Sub-documents
interface IBeforeAfterImage {
  beforeImage: string;
  afterImage: string;
  label?: string;
}

interface ITechSpec {
  title: string;
  description: string;
}

interface IDocumentEntry {
  title: string;
  url: string;
}

interface ISeo {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}
```

#### Category Model

```typescript
interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;                   // unique
  description?: string;
  image?: string;
  parent?: ObjectId;              // For hierarchical categories
  order: number;
  isVisible: boolean;
  seo: ISeo;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Blog Post Model

```typescript
interface IBlogPost extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  content: string;               // Rich HTML
  excerpt: string;
  author: ObjectId;              // Reference to User
  category?: ObjectId;           // Reference to BlogCategory
  tags: string[];
  featuredImage?: string;
  published: boolean;
  publishedAt?: Date;
  seo: ISeo;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Site Settings Model (Singleton)

```typescript
interface ISiteSettings extends Document {
  companyName: string;
  orgNumber: string;
  vatNumber?: string;
  phone: string;
  email: string;
  noreplyEmail?: string;
  offices: IOffice[];
  socialMedia: ISocialMedia;
  seo: ISeoSettings;
  branding: IBrandingSettings;
  footer: IFooterSettings;
}

interface IOffice {
  name: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  isHeadquarters: boolean;
  isVisible: boolean;
  mapEmbedUrl?: string;
}
```

### All Models List

| Model | Collection | Purpose |
|-------|------------|---------|
| `User` | `user` | User accounts (Better Auth) |
| `Profile` | `profile` | Extended user data |
| `Product` | `products` | Product catalog |
| `Category` | `categories` | Product categories |
| `BlogPost` | `blog_posts` | Blog articles |
| `BlogCategory` | `blog_categories` | Blog categories |
| `BlogComment` | `blog_comments` | Blog comments |
| `FormSubmission` | `form_submissions` | Contact/inquiry forms |
| `SiteSettings` | `site_settings` | Global config (singleton) |
| `HomePage` | `home_page` | Home page CMS |
| `AboutPage` | `about_page` | About page CMS |
| `TeamPage` | `team_page` | Team page CMS |
| `LegalPage` | `legal_page` | Legal info CMS |
| `PrivacyPage` | `privacy_page` | Privacy policy CMS |
| `CareersPage` | `careers_page` | Careers page CMS |
| `FAQPage` | `faq_page` | FAQ page CMS |
| `KontaktPage` | `kontakt_page` | Contact page CMS |
| `StartaEgetPage` | `starta_eget_page` | Start your own CMS |
| `TrainingPage` | `training_page` | Training page CMS |
| `VarforValjaSynosPage` | `varfor_valja_synos_page` | Why choose Synos CMS |
| `KopguidePage` | `kopguide_page` | Buying guide CMS |
| `MiniutbildningPage` | `miniutbildning_page` | Mini training CMS |

---

## 6. Authentication System

### Better Auth Configuration

```typescript
// lib/db/auth.ts
betterAuth({
  appName: "Synos Medical",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,    // 7 days
    updateAge: 60 * 60 * 24,         // 24 hours
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },

  advanced: {
    cookiePrefix: "synos",
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  plugins: [nextCookies()],
})
```

### Client-side Auth

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { signIn, signUp, signOut, getSession, useSession } = authClient;
```

### Protected Routes

Dashboard routes are protected via a proxy middleware:

```typescript
// proxy.ts
// Checks session cookie before allowing access to /dashboard/*
```

---

## 7. API Layer

### API Response Pattern

All API responses follow a standard structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  errors?: FormattedValidationError[];
}

// Response helpers
successResponse(data, message, status, meta)
createdResponse(data, message)
badRequestResponse(message, errors)
unauthorizedResponse(message)
notFoundResponse(message)
paginatedResponse(data, page, limit, total)
internalServerErrorResponse(message)
```

### API Route Structure

```
app/api/
├── auth/
│   ├── [...all]/route.ts         # Better Auth catch-all
│   └── sync-user/route.ts        # Custom user sync
│
├── products/
│   ├── route.ts                  # GET (list), POST (create)
│   ├── [id]/route.ts             # GET, PATCH, DELETE
│   ├── [id]/publish/route.ts     # POST
│   ├── [id]/unpublish/route.ts   # POST
│   ├── [id]/duplicate/route.ts   # POST
│   ├── search/route.ts           # GET
│   ├── tags/route.ts             # GET
│   ├── stats/route.ts            # GET
│   └── client/[slug]/route.ts    # GET (public)
│
├── categories/
│   ├── route.ts                  # GET, POST
│   ├── [id]/route.ts             # GET, PATCH, DELETE
│   └── tree/route.ts             # GET (hierarchical)
│
├── blog-posts/
│   ├── route.ts                  # GET, POST
│   ├── [id]/route.ts             # GET, PATCH, DELETE
│   ├── [id]/publish/route.ts     # POST
│   ├── public/route.ts           # GET (public listing)
│   ├── public/category/[slug]/   # GET
│   ├── public/tag/[tag]/         # GET
│   └── public/author/[id]/       # GET
│
├── form-submissions/
│   ├── route.ts                  # GET, POST
│   ├── [id]/route.ts             # GET, PATCH, DELETE
│   ├── [id]/status/route.ts      # PATCH
│   ├── export/route.ts           # GET (CSV)
│   └── stats/route.ts            # GET
│
├── storage/
│   ├── upload/route.ts           # POST
│   ├── delete/route.ts           # DELETE
│   ├── list/route.ts             # GET
│   └── files/[...path]/route.ts  # GET (serve file)
│
├── site-settings/route.ts        # GET, PATCH
├── navigation/route.ts           # GET (navbar data)
│
└── [page-name]-page/route.ts     # CMS page endpoints
```

### API Route Example

```typescript
// app/api/products/route.ts
import { NextRequest } from "next/server";
import { productService } from "@/lib/services/product.service";
import { successResponse, badRequestResponse } from "@/lib/utils/api-response";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const result = await productService.getAll({ page, limit });

  return paginatedResponse(
    result.data,
    result.page,
    result.limit,
    result.total
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await productService.create(body);

  if (!result.success) {
    return badRequestResponse(result.message, result.errors);
  }

  return createdResponse(result.data);
}
```

---

## 8. Frontend Architecture

### Root Layout

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <head>
        {/* GTM Script */}
        {/* Facebook Pixel Script */}
      </head>
      <body>
        {/* GTM noscript */}
        <NuqsAdapter>{children}</NuqsAdapter>
        <ToasterProvider />
      </body>
    </html>
  );
}
```

### Client Layout (Public Pages)

```typescript
// app/(client)/layout.tsx
export default async function ClientLayout({ children }) {
  // Fetch settings from database
  const [siteConfig, brandingSettings, footerSettings] = await Promise.all([
    getLegacySiteConfig(),
    getBrandingSettings(),
    getFooterSettings(),
  ]);

  return (
    <CookieConsentProvider>
      <NavbarVariantProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar config={siteConfig} logoUrl={logoUrl} />
          <main className="flex-1 w-full">{children}</main>
          <Footer config={siteConfig} footerSettings={footerSettings} />
          <MobileBottomNav />
          <CallbackPopup />
          <CookieConsent />
        </div>
      </NavbarVariantProvider>
    </CookieConsentProvider>
  );
}
```

### Dashboard Layout

```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}
```

### Page Structure Pattern

```typescript
// app/(client)/produkter/page.tsx
export const metadata = { title: "Produkter" };

export default async function ProductsPage() {
  // Fetch data server-side
  const products = await productService.getPublished();

  return (
    <div className="padding-top padding-bottom">
      <div className="_container">
        <h1>Produkter</h1>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
```

### Dynamic Routes Pattern

```typescript
// app/(client)/kategori/[category]/[slug]/page.tsx
interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);

  return {
    title: product?.seo?.title || product?.title,
    description: product?.seo?.description,
    // ...
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const product = await productService.getBySlug(slug);

  // Render product details
}
```

---

## 9. Styling System

### Tailwind CSS v4 Setup

```css
/* app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";
```

### Design Tokens

```css
:root {
  /* Primary (Warm Tan/Beige) */
  --color-primary: #DCA783;
  --color-primary-foreground: #FFFFFF;
  --color-primary-hover: #2C2D38;

  /* Secondary (Dark Navy) */
  --color-secondary: #2C2D38;
  --color-secondary-foreground: #FFFFFF;

  /* Tertiary (Warm Accent) */
  --color-tertiary: #DFB294;
  --color-tertiary-foreground: #2C2D38;

  /* Backgrounds */
  --color-background: #FFFFFF;
  --color-foreground: #2C2D38;

  /* UI Elements */
  --color-muted: #F8EEE8;
  --color-muted-foreground: #3E414B;
  --color-card: #FFFFFF;
  --color-border: #E6C4AE;
  --color-input: #E6C4AE;
  --color-ring: #39898F;

  /* Status Colors */
  --color-success: #10B981;
  --color-warning: #DFB294;
  --color-error: #EF4444;
  --color-destructive: #EF4444;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Fonts */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-heading: "Plus Jakarta Sans", system-ui, sans-serif;
}
```

### Custom Utility Classes

```css
@layer utilities {
  /* Container */
  ._container {
    @apply max-w-[1440px] w-full mx-auto px-3 sm:px-5;
  }

  /* Page spacing (for fixed navbar) */
  .padding-top {
    @apply pt-32;
  }

  .padding-bottom {
    @apply pb-32;
  }

  /* Glassmorphism */
  .glass {
    @apply bg-white/70 backdrop-blur-md border border-white/20 shadow-sm;
  }

  .glass-card {
    @apply bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm
           hover:shadow-md transition-all duration-300;
  }

  /* Section spacing */
  .section-padding {
    @apply py-16 lg:py-24;
  }
}
```

### Color Mapping Guide (For Conversion)

When converting to a new brand, update these CSS variables:

| Variable | Current | Purpose |
|----------|---------|---------|
| `--color-primary` | `#DCA783` (tan) | Buttons, links, accents |
| `--color-secondary` | `#2C2D38` (navy) | Dark backgrounds, text |
| `--color-tertiary` | `#DFB294` (warm) | Secondary accents |
| `--color-muted` | `#F8EEE8` (cream) | Muted backgrounds |
| `--color-border` | `#E6C4AE` (light tan) | Borders, inputs |

---

## 10. Component Library

### UI Components (shadcn/ui)

The project uses shadcn/ui components based on Radix UI:

```
components/ui/
├── accordion.tsx      # Collapsible sections
├── avatar.tsx         # User avatars
├── badge.tsx          # Status badges
├── button.tsx         # Primary buttons
├── card.tsx           # Card containers
├── checkbox.tsx       # Checkboxes
├── command.tsx        # Command palette
├── confirm-modal.tsx  # Confirmation dialogs
├── dialog.tsx         # Modal dialogs
├── drawer.tsx         # Bottom drawers
├── dropdown-menu.tsx  # Dropdown menus
├── form.tsx           # Form primitives
├── input.tsx          # Text inputs
├── label.tsx          # Form labels
├── loading-button.tsx # Buttons with loading state
├── navigation-menu.tsx# Desktop navigation
├── popover.tsx        # Popovers
├── progress.tsx       # Progress bars
├── radio-group.tsx    # Radio buttons
├── search-input.tsx   # Search inputs
├── select.tsx         # Select dropdowns
├── separator.tsx      # Dividers
├── sheet.tsx          # Side panels
├── skeleton.tsx       # Loading skeletons
├── sonner.tsx         # Toast notifications
├── switch.tsx         # Toggle switches
├── tabs.tsx           # Tab navigation
└── textarea.tsx       # Multi-line inputs
```

### Component Configuration

```json
// components.json (shadcn/ui config)
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/lib/hooks"
  }
}
```

### Feature Components

#### Layout Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Navbar` | `components/layout/Navbar.tsx` | Main navigation with mega-menu |
| `MobileNavbar` | `components/layout/MobileNavbar.tsx` | Mobile hamburger menu |
| `MobileBottomNav` | `components/layout/MobileBottomNav.tsx` | Mobile bottom tab bar |
| `Footer` | `components/layout/Footer.tsx` | Site footer |
| `NavbarSearch` | `components/layout/NavbarSearch.tsx` | Search in navbar |
| `QuoteRequestModal` | `components/layout/QuoteRequestModal.tsx` | Request quote modal |

#### Home Page Components

| Component | Purpose |
|-----------|---------|
| `Hero` | Full-width hero section with CTA |
| `SearchSection` | Product search functionality |
| `FeatureHighlights` | Feature cards grid |
| `ProductShowcase` | Featured products carousel |
| `ProcessSteps` | How it works steps |
| `Testimonials` | Customer testimonials slider |
| `AboutSection` | Company about section |
| `CtaSection` | Call-to-action section |
| `ImageGallery` | Image gallery grid |
| `FloatingContactButton` | Floating contact button |

#### Product Components

| Component | Purpose |
|-----------|---------|
| `ProductCard` | Product listing card |
| `ProductImageGallery` | Product image carousel with zoom |
| `ProductDetailSidebar` | Product detail page sidebar |
| `ProductLongDescription` | Rich HTML product description |
| `ProductFAQ` | Product FAQ accordion |
| `ProductQnA` | Q&A section |
| `ProductReviews` | Reviews section |
| `ProductInquiryForm` | Contact form for products |
| `BeforeAfterShowcase` | Before/after image slider |
| `ProductShareButtons` | Social share buttons |

#### Admin Components

| Component | Purpose |
|-----------|---------|
| `DashboardShell` | Dashboard layout wrapper |
| `AdminSidebar` | Admin navigation sidebar |
| `ProductForm` | Product create/edit form |
| `CategoryForm` | Category create/edit form |
| `BlogPostForm` | Blog post editor |
| `RichTextEditor` | WYSIWYG editor (SunEditor) |
| `TreeSelect` | Hierarchical category selector |
| `TagInput` | Tag input with autocomplete |
| `MediaPicker` | File picker dialog |
| `SeoAnalysis` | SEO analysis panel |
| `SeoPreview` | Google/social preview |

---

## 11. CMS System

### Page Structure

Each CMS page follows the same pattern:

1. **Model** (`models/[page]-page.model.ts`)
2. **Validation** (`lib/validations/[page]-page.validation.ts`)
3. **Repository** (`lib/repositories/[page]-page.repository.ts`)
4. **Service** (`lib/services/[page]-page.service.ts`)
5. **API Route** (`app/api/[page]-page/route.ts`)
6. **Dashboard Editor** (`app/(dashboard)/dashboard/webbplats/[page]/page.tsx`)
7. **Public Page** (`app/(client)/[page]/page.tsx`)

### CMS Page Example (FAQ Page)

```typescript
// models/faq-page.model.ts
interface IFAQPage extends Document {
  title: string;
  subtitle?: string;
  heroImage?: string;
  categories: IFAQCategory[];
  seo: ISeo;
}

interface IFAQCategory {
  title: string;
  questions: IFAQQuestion[];
}

interface IFAQQuestion {
  question: string;
  answer: string;  // Rich HTML
}
```

### CMS Pages List

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page |
| About | `/om-oss` | About the company |
| Team | `/om-oss/team` | Team members |
| Legal | `/om-oss/juridisk-information` | Legal info |
| Privacy | `/integritetspolicy` | Privacy policy |
| Careers | `/om-oss/lediga-tjanster` | Job listings |
| FAQ | `/faq` | Frequently asked questions |
| Contact | `/kontakt` | Contact information |
| Starta Eget | `/starta-eget` | Start your own business |
| Why Choose | `/starta-eget/varfor-valja-synos` | Why choose Synos |
| Buying Guide | `/starta-eget/kopguide` | Buying guide |
| Mini Training | `/starta-eget/miniutbildning` | Mini training |
| Training | `/utbildningar` | Training programs |

---

## 12. File Storage

### Storage Service

```typescript
// lib/storage/service.ts
class StorageService {
  // Base path for all uploads
  private basePath = path.join(process.cwd(), "public", "storage");

  async upload(file: File, folder: string): Promise<StorageResult>
  async delete(filePath: string): Promise<void>
  async list(folder: string): Promise<FileInfo[]>
  getUrl(filePath: string): string
}
```

### Storage Structure

```
public/storage/
├── images/           # Product images, blog images
├── documents/        # PDFs, documentation
├── avatars/          # User profile pictures
└── [other-folders]/  # Custom folders
```

### File Upload Flow

```typescript
// API: POST /api/storage/upload
// 1. Validate file type and size
// 2. Generate unique filename
// 3. Save to public/storage/[folder]/
// 4. Return URL path

// Usage in forms
const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "images");

  const response = await fetch("/api/storage/upload", {
    method: "POST",
    body: formData,
  });

  const { data } = await response.json();
  return data.url; // "/storage/images/unique-filename.jpg"
};
```

### Storage UI Components

| Component | Purpose |
|-----------|---------|
| `FileUploader` | Drag-and-drop file upload |
| `MediaPicker` | Single file selection dialog |
| `MultiMediaPicker` | Multiple file selection |
| `MediaGallery` | Grid view of uploaded files |
| `StorageManager` | Full storage management UI |
| `FileList` | List view of files |

---

## 13. SEO & Metadata

### Dynamic Metadata Generation

```typescript
// app/layout.tsx
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(process.env.SITE_URL),
    title: {
      default: `${settings.seo.siteName} - Default Title`,
      template: `%s | ${settings.seo.siteName}`,
    },
    description: settings.seo.siteDescription,
    keywords: settings.seo.keywords,
    openGraph: {
      type: "website",
      locale: "sv_SE",
      images: [{ url: settings.seo.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      creator: settings.seo.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
```

### Page-specific Metadata

```typescript
// app/(client)/produkter/page.tsx
export const metadata: Metadata = {
  title: "Produkter",
  description: "Utforska vårt sortiment av medicinsk utrustning",
};
```

### JSON-LD Structured Data

```typescript
// lib/seo/product-jsonld.ts
export function generateProductJsonLd(product: IProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    image: product.productImages,
    brand: {
      "@type": "Brand",
      name: "Synos Medical",
    },
    // ...
  };
}
```

### Dynamic Sitemap

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await productService.getAllSlugs();
  const posts = await blogPostService.getAllSlugs();

  return [
    { url: `${baseUrl}`, lastModified: new Date() },
    { url: `${baseUrl}/produkter`, lastModified: new Date() },
    ...products.map((slug) => ({
      url: `${baseUrl}/kategori/${slug}`,
      lastModified: new Date(),
    })),
    // ...
  ];
}
```

---

## 14. Caching & Revalidation

### Cache Tags

```typescript
// lib/revalidation/index.ts
export const CACHE_TAGS = {
  // Products
  PRODUCTS: "products",
  PRODUCT: (slug: string) => `product-${slug}`,

  // Categories
  CATEGORIES: "categories",
  CATEGORY: (slug: string) => `category-${slug}`,

  // Blog
  BLOG_POSTS: "blog-posts",
  BLOG_POST: (slug: string) => `blog-post-${slug}`,
  BLOG_CATEGORIES: "blog-categories",

  // CMS Pages
  HOME_PAGE: "home-page",
  ABOUT_PAGE: "about-page",
  // ... other pages

  // Settings
  SITE_SETTINGS: "site-settings",
};
```

### Revalidation Paths

```typescript
export const PATHS = {
  HOME: "/",
  PRODUCTS: "/produkter",
  KATEGORI: "/kategori",
  NEWS: "/nyheter",
  // ... other paths
};
```

### Triggering Revalidation

```typescript
// lib/revalidation/actions.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateProduct(slug: string) {
  revalidateTag(CACHE_TAGS.PRODUCT(slug));
  revalidateTag(CACHE_TAGS.PRODUCTS);
  revalidatePath(PATHS.PRODUCTS);
}

export async function revalidateCategory(slug: string) {
  revalidateTag(CACHE_TAGS.CATEGORY(slug));
  revalidateTag(CACHE_TAGS.CATEGORIES);
  revalidatePath(`${PATHS.KATEGORI}/${slug}`);
}
```

### Usage in Services

```typescript
// lib/services/product.service.ts
export const productService = {
  async create(data) {
    const product = await productRepository.create(data);
    await revalidateProduct(product.slug);
    return product;
  },

  async update(id, data) {
    const product = await productRepository.updateById(id, data);
    await revalidateProduct(product.slug);
    return product;
  },
};
```

---

## 15. Navigation System

### Navigation Configuration

```typescript
// config/navigation-new.ts
interface NavItem {
  title: string;
  href: string;
  description?: string;
  items?: NavItem[];      // Sub-items for dropdowns
  isDynamic?: boolean;    // Load from database
}

export const mainNavNew: NavItem[] = [
  {
    title: "Nyheter och artiklar",
    href: "/nyheter",
  },
  {
    title: "Produkter",
    href: "/produkter",
    isDynamic: true,  // Loads categories from database
  },
  {
    title: "Starta Eget",
    href: "/starta-eget",
    items: [
      { title: "Varför välja Synos?", href: "/starta-eget/varfor-valja-synos" },
      { title: "Köpguide", href: "/starta-eget/kopguide" },
      { title: "Miniutbildning", href: "/starta-eget/miniutbildning" },
    ],
  },
  // ...
];
```

### Dynamic Navigation Data

```typescript
// lib/hooks/use-navigation.ts
export function useNavigation() {
  const [data, setData] = useState<NavigationData | null>(null);

  useEffect(() => {
    fetch("/api/navigation")
      .then((res) => res.json())
      .then((json) => setData(json.data));
  }, []);

  return { data };
}

// Response structure
interface NavigationData {
  categories: {
    _id: string;
    name: string;
    slug: string;
    products: {
      _id: string;
      title: string;
      slug: string;
      primaryCategorySlug: string;
    }[];
  }[];
}
```

### URL Redirects (WordPress Migration)

```typescript
// next.config.ts
redirects: [
  // Blog path change
  { source: "/blogg", destination: "/nyheter", permanent: true },
  { source: "/blogg/:slug", destination: "/nyheter/:slug", permanent: true },

  // Section restructuring
  { source: "/kopguide", destination: "/starta-eget/kopguide", permanent: true },
  { source: "/om-oss/jobba-hos-oss", destination: "/om-oss/lediga-tjanster", permanent: true },

  // Trailing slash variants
  { source: "/blogg/", destination: "/nyheter", permanent: true },
]
```

---

## 16. Forms & Validation

### Zod Schema Pattern

```typescript
// lib/validations/product.validation.ts
import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Titel krävs").max(200),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  shortDescription: z.string().max(1500).optional(),
  benefits: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  treatments: z.array(z.string()).optional(),
  productImages: z.array(z.string().url()).optional(),
  beforeAfterImages: z.array(z.object({
    beforeImage: z.string().url("Före-bild URL krävs"),
    afterImage: z.string().url("Efter-bild URL krävs"),
    label: z.string().optional(),
  })).optional(),
  techSpecifications: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  })).optional(),
  seo: z.object({
    title: z.string().max(70).optional(),
    description: z.string().max(160).optional(),
    ogImage: z.string().url().optional(),
    noindex: z.boolean().optional(),
  }).optional(),
  categories: z.array(z.string()).optional(),
  publishType: z.enum(["publish", "draft", "pending", "private"]),
  visibility: z.enum(["public", "hidden"]),
});

export type ProductInput = z.infer<typeof productSchema>;
```

### Form Component Pattern

```typescript
// components/admin/ProductForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductInput } from "@/lib/validations/product.validation";

export function ProductForm({ product, onSubmit }) {
  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      title: "",
      publishType: "draft",
      visibility: "public",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields... */}
      </form>
    </Form>
  );
}
```

### Contact Form Submission

```typescript
// lib/validations/form-submission.validation.ts
export const contactFormSchema = z.object({
  type: z.enum(["contact", "quote", "callback", "training"]),
  name: z.string().min(2, "Namn krävs"),
  email: z.string().email("Ogiltig e-postadress"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Meddelande krävs"),
  productId: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, "Samtycke krävs"),
});
```

---

## 17. Analytics Integration

### Google Tag Manager

```typescript
// lib/analytics/gtm.ts
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

// Loaded in app/layout.tsx
```

### Facebook Pixel

```typescript
// lib/analytics/facebook-pixel.ts
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "";

// Tracking functions
export const pageview = () => {
  window.fbq?.("track", "PageView");
};

export const event = (name: string, options = {}) => {
  window.fbq?.("track", name, options);
};
```

### Usage in Root Layout

```typescript
// app/layout.tsx
<Script id="gtm-script" strategy="afterInteractive">
  {`(function(w,d,s,l,i){...})(window,document,'script','dataLayer','${GTM_ID}')`}
</Script>

<Script id="fb-pixel" strategy="afterInteractive">
  {`!function(f,b,e,v,n,t,s){...}; fbq('init', '${FB_PIXEL_ID}');`}
</Script>
```

---

## 18. Environment Configuration

### Required Environment Variables

```bash
# Database
MONGODB_URI=mongodb+srv://...
MONGODB_DB=synos-db

# Authentication
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Site
SITE_URL=https://synos.se
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=your-encryption-key
```

### Optional Environment Variables

```bash
# Analytics
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=1234567890

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your-api-key

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxx

# Cookie Compliance
NEXT_PUBLIC_COOKIEBOT_ID=your-cookiebot-id

# Chat Widget
NEXT_PUBLIC_CONVOLO_WIDGET_KEY=your-widget-key
```

---

## 19. Conversion Checklist

When converting this project to a new brand/business, follow this checklist:

### Phase 1: Branding

- [ ] Update `globals.css` design tokens (colors, fonts)
- [ ] Replace logo in `public/storage/` and update `SiteSettings.branding.logoUrl`
- [ ] Update favicon (via `app/icon.tsx` and `app/apple-icon.tsx`)
- [ ] Update company information in `SiteSettings` model defaults
- [ ] Update meta keywords and descriptions

### Phase 2: Content Structure

- [ ] Modify `Product` model for new business needs
- [ ] Add/remove CMS page models as needed
- [ ] Update navigation in `config/navigation-new.ts`
- [ ] Modify redirects in `next.config.ts`
- [ ] Update sitemap configuration

### Phase 3: Features

- [ ] Enable/disable authentication features
- [ ] Modify form submission types
- [ ] Add/remove admin features
- [ ] Update email templates (if using Resend)

### Phase 4: Localization

- [ ] Update language in `app/layout.tsx` (`lang="sv"`)
- [ ] Update locale in OpenGraph (`sv_SE`)
- [ ] Translate field labels in `lib/utils/api-response.ts`
- [ ] Update validation error messages in Zod schemas

### Phase 5: Infrastructure

- [ ] Set up new MongoDB database
- [ ] Configure new environment variables
- [ ] Update GTM and Facebook Pixel IDs
- [ ] Set up new domain in `SITE_URL`
- [ ] Configure image remote patterns in `next.config.ts`

### Phase 6: Testing

- [ ] Run build (`pnpm build`)
- [ ] Test all routes
- [ ] Verify authentication flow
- [ ] Test form submissions
- [ ] Verify file uploads
- [ ] Check SEO metadata generation
- [ ] Test sitemap generation

---

## Quick Reference

### Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start

# Lint
pnpm lint

# Seed admin user
pnpm seed:admin
```

### Key Files to Modify for New Project

| File | What to Change |
|------|----------------|
| `app/globals.css` | Colors, fonts, design tokens |
| `config/navigation-new.ts` | Navigation structure |
| `next.config.ts` | Redirects, image domains |
| `models/site-settings.model.ts` | Default company info |
| `lib/utils/api-response.ts` | Field label translations |
| `.env` | All environment variables |

### API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET/POST` | `/api/products` | List/Create products |
| `GET/PATCH/DELETE` | `/api/products/[id]` | Single product CRUD |
| `GET/POST` | `/api/categories` | List/Create categories |
| `GET/POST` | `/api/blog-posts` | List/Create blog posts |
| `GET/PATCH` | `/api/site-settings` | Global settings |
| `POST` | `/api/storage/upload` | File upload |
| `POST` | `/api/form-submissions` | Submit contact forms |

---

*Document generated: 2025-12-30*
*Project: Synos Medical (synos.se)*
