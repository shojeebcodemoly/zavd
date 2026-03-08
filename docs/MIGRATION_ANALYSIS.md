# WordPress to Next.js Migration Analysis
## Synos Medical Website (www.synos.se)

**Date:** October 28, 2025  
**Current Site:** WordPress 6.8.3  
**Target:** Next.js 16 with App Router

---

## 1. SITE ANALYSIS

### 1.1 Business Overview
**Synos Medical AB** is Sweden's leading supplier of MDR-certified medical laser equipment for clinics and beauty salons. The company specializes in:
- Medical laser equipment sales
- Professional training and certification
- Support for entrepreneurs starting their own clinics
- 20+ years of industry experience

**Organization Number:** 556871-8075  
**Locations:** Stockholm & Linköping  
**Contact:** 010-205 15 01, info@synos.se

### 1.2 Site Structure & Navigation

#### Main Navigation Menu:
1. **Nyheter och artiklar** (News and Articles)
2. **Produkter** (Products) - Multi-level dropdown
   - Hårborttagning (Hair Removal)
   - Tatueringsborttagning (Tattoo Removal)
   - Hudföryngring/Hudåtstramning (Skin Rejuvenation)
   - CO2 Fraktionerad Laser
   - Kropp, muskler & fett (Body, Muscles & Fat)
   - Ansiktsbehandlingar (Facial Treatments)
   - Pigmentfläckar (Pigment Spots)
   - Akne, ärr och hudbristningar (Acne, Scars & Stretch Marks)
   - Ytliga blodkärl/angiom (Superficial Blood Vessels)
   - Kirurgi (Surgery)
3. **Starta eget** (Start Your Own Business)
   - Varför välja Synos Medical?
   - Köpguide
   - Miniutbildning
4. **Utbildningar** (Training)
5. **Om oss** (About Us)
   - FAQ
   - Lediga tjänster (Job Openings)
   - Juridisk information (Legal Information)
6. **Kontakt** (Contact)

#### Key Products Identified:
- MOTUS PRO
- Again PRO PLUS (Alexandrit/Nd:YAG)
- Motus AX med Moveoteknologi
- Motus AY
- TORO Pico Laser
- QTERRA Q10 Q-Switch
- SmartPICO
- Tetra PRO CO₂ Laser
- Jovena
- RedTouch PRO
- DUOGlide
- SmartXide Punto
- Vivace RF
- MPGUN
- Onda Coolwaves PRO

### 1.3 Content Types

#### Pages:
- **Homepage** - Hero section with featured products carousel
- **Product Category Pages** - Treatment-based organization
- **Individual Product Pages** - Detailed product information
- **Starta Eget** - Entrepreneurship support page with contact form
- **Utbildningar** - Training information
- **Om Oss** - Company information
- **Kontakt** - Contact page with form, team members, and Google Maps

#### Posts/Articles:
- Blog/news articles about treatments and technology
- Educational content about laser technology

#### Forms:
- Contact forms (Ninja Forms)
- Lead generation forms
- Privacy policy consent checkboxes

### 1.4 Design System

#### Colors:
- **Primary Brand Color:** #00949e (Teal/Cyan)
- **Secondary/Hover:** #0C2C46 (Dark Blue)
- **Text:** Standard dark colors
- **Background:** White/Light grays

#### Typography:
- **Primary Font:** Not explicitly defined in fetched content
- **Headings:** Likely custom font stack
- **Body:** Standard sans-serif

#### Layout Patterns:
- **Hero Sections:** Full-width with background images
- **Product Carousels:** Featured products on homepage
- **Card Layouts:** Product and service cards
- **Two-Column Layouts:** Content with sidebar navigation
- **Feature Grids:** 3-4 column grids for benefits/features
- **Team Member Cards:** Staff profiles with photos

#### Components:
- Navigation with mega-menu dropdowns
- Product carousels/sliders
- Contact forms
- Feature cards with icons
- Call-to-action buttons
- Breadcrumb navigation
- Social media links (Facebook, Instagram, Twitter, LinkedIn)
- Google Maps integration
- Cookie consent banner (Cookiebot)
- Facebook Messenger chat widget (Convolo.ai)

### 1.5 Features & Functionality

#### Core Features:
1. **Multi-level Navigation** - Complex product categorization
2. **Contact Forms** - Multiple forms throughout site (Ninja Forms)
3. **Product Showcase** - Carousel and grid displays
4. **Lead Generation** - Forms with privacy consent
5. **Team Directory** - Staff profiles with contact info
6. **Location Maps** - Google Maps integration
7. **Social Media Integration** - Links and sharing
8. **Search Functionality** - Site-wide search
9. **Mobile Menu** - Responsive hamburger menu

#### Third-Party Integrations:
1. **Facebook Pixel** - ID: 2886484504973538
2. **Google Tag Manager** - ID: GTM-PQ42DDZ
3. **Google Maps API** - Location display
4. **Cookiebot** - GDPR compliance
5. **Convolo.ai** - Chat widget (Key: 6d30f2bc306bc7a2b45b2bbfe479f60e)
6. **Ninja Forms** - Form builder
7. **Elementor** - Page builder (lazy loading)
8. **Facebook Messenger** - Customer chat

#### SEO Features:
- Schema.org structured data (Organization, WebPage, BreadcrumbList)
- Meta descriptions
- Open Graph tags
- XML sitemaps (likely)
- Breadcrumb navigation

### 1.6 Media Assets

#### Images:
- Product photos
- Hero/banner images
- Team member photos
- Icon sets
- Logo files (SVG)

#### Organization:
- WordPress media library structure
- Likely organized by upload date
- Various sizes/thumbnails generated

### 1.7 Technical Stack (Current)

#### WordPress:
- **Version:** 6.8.3
- **Theme:** Custom theme "synos"
- **Page Builder:** Elementor
- **Forms:** Ninja Forms
- **Language:** Swedish (sv_SE)

#### Performance:
- Lazy loading for images and Elementor sections
- Image optimization with srcset
- Prefetching for internal links
- Minified CSS/JS

#### Analytics & Tracking:
- Facebook Pixel with server-side events
- Google Tag Manager
- Cookie consent management
- GDPR compliance features

---

## 2. MIGRATION CHALLENGES

### 2.1 Content Migration
- **Challenge:** Extract ~15+ product pages with detailed specifications
- **Challenge:** Migrate blog/news articles with proper formatting
- **Challenge:** Preserve Swedish language content and special characters
- **Challenge:** Maintain SEO metadata and structured data

### 2.2 Forms
- **Challenge:** Replace Ninja Forms with Next.js solution
- **Challenge:** Maintain form validation and error messages in Swedish
- **Challenge:** Integrate with email service for form submissions
- **Challenge:** GDPR compliance and privacy consent handling

### 2.3 Third-Party Services
- **Challenge:** Migrate Facebook Pixel to Next.js
- **Challenge:** Implement Google Tag Manager properly
- **Challenge:** Integrate Cookiebot or alternative GDPR solution
- **Challenge:** Replace or integrate Convolo.ai chat widget
- **Challenge:** Google Maps API integration

### 2.4 Design & UX
- **Challenge:** Recreate complex mega-menu navigation
- **Challenge:** Build responsive product carousels
- **Challenge:** Maintain exact visual design and branding
- **Challenge:** Ensure mobile responsiveness

### 2.5 SEO
- **Challenge:** Maintain URL structure or implement proper redirects
- **Challenge:** Preserve all meta tags and structured data
- **Challenge:** Ensure no loss in search rankings
- **Challenge:** Implement proper sitemap generation

---

## 3. RECOMMENDATIONS

### 3.1 Content Management Strategy

**Option 1: Headless CMS (Recommended)**
- **Sanity.io** or **Contentful** for structured content
- **Pros:** Easy content updates, preview mode, versioning
- **Cons:** Additional service cost, learning curve

**Option 2: MDX Files**
- Store content as MDX files in repository
- **Pros:** Version controlled, no external dependencies
- **Cons:** Non-technical users can't update content easily

**Option 3: Hybrid Approach**
- Static MDX for pages that rarely change
- Headless CMS for products, blog posts, team members
- **Pros:** Best of both worlds
- **Cons:** More complex architecture

### 3.2 Recommended Tech Stack

#### Core:
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 (already in project)
- **State Management:** React Context + Server Components

#### Forms:
- **React Hook Form** - Form validation
- **Zod** - Schema validation
- **Resend** or **SendGrid** - Email delivery

#### CMS (if chosen):
- **Sanity.io** - Recommended for flexibility
- **@sanity/next-loader** - Next.js integration

#### Analytics & Tracking:
- **@next/third-parties** - Google Tag Manager
- **react-facebook-pixel** - Facebook Pixel
- **@cookiebot/react** - Cookie consent

#### UI Components:
- **Radix UI** - Accessible primitives
- **Framer Motion** - Animations
- **Swiper** or **Embla Carousel** - Product carousels
- **React Google Maps** - Maps integration

#### SEO:
- **next-sitemap** - Sitemap generation
- **next-seo** - SEO meta tags

---

*This analysis continues in MIGRATION_PLAN.md*

