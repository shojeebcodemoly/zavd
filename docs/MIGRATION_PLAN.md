# Migration Plan: WordPress to Next.js
## Synos Medical Website

**Date:** October 28, 2025  
**Estimated Timeline:** 8-12 weeks  
**Team Size:** 1-2 developers

---

## PHASE 1: PREPARATION & SETUP (Week 1-2)

### 1.1 Content Audit & Export
**Duration:** 3-5 days

#### Tasks:
- [ ] **Export WordPress content**
  - Use WordPress export tool or WP All Export plugin
  - Export products, pages, posts, media
  - Export custom fields and metadata
  - Document current URL structure

- [ ] **Inventory all media assets**
  - Download all images from WordPress media library
  - Organize by type (products, team, icons, etc.)
  - Optimize images (compress, convert to WebP where appropriate)
  - Create image manifest with alt text and metadata

- [ ] **Document current functionality**
  - List all forms and their fields
  - Document email recipients and workflows
  - Map all third-party integrations
  - Note any custom WordPress plugins/features

**Deliverables:**
- Content export files (XML/JSON)
- Media assets folder structure
- Functionality documentation
- URL mapping spreadsheet

### 1.2 Development Environment Setup
**Duration:** 2-3 days

#### Tasks:
- [ ] **Initialize Next.js project** (Already done ✓)
  - Verify Next.js 16 installation
  - Configure TypeScript
  - Set up Tailwind CSS 4

- [ ] **Install core dependencies**
  ```bash
  pnpm add react-hook-form @hookform/resolvers zod
  pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
  pnpm add framer-motion swiper
  pnpm add resend
  pnpm add -D @types/node @types/react @types/react-dom
  ```

- [ ] **Set up development tools**
  - Configure ESLint rules
  - Set up Prettier
  - Configure Git hooks with Husky
  - Set up environment variables

- [ ] **Create folder structure**
  - Implement architecture from ARCHITECTURE_PROPOSAL.md
  - Create placeholder components
  - Set up routing structure

**Deliverables:**
- Configured development environment
- Folder structure in place
- Development dependencies installed
- Git repository configured

### 1.3 CMS Decision & Setup (Optional)
**Duration:** 2-3 days

#### Option A: Sanity.io (Recommended)
```bash
pnpm add @sanity/client @sanity/image-url next-sanity
pnpm create sanity@latest
```

#### Option B: No CMS (Static MDX)
```bash
pnpm add @next/mdx @mdx-js/loader @mdx-js/react
pnpm add gray-matter reading-time
```

#### Tasks:
- [ ] Choose CMS approach
- [ ] Set up CMS project (if using Sanity)
- [ ] Define content schemas
- [ ] Create sample content
- [ ] Test content fetching

**Deliverables:**
- CMS configured (if chosen)
- Content schemas defined
- Sample content created

---

## PHASE 2: CORE INFRASTRUCTURE (Week 3-4)

### 2.1 Layout & Navigation
**Duration:** 4-5 days

#### Tasks:
- [ ] **Create root layout**
  - Implement app/layout.tsx
  - Add fonts (Geist Sans/Mono)
  - Set up global styles
  - Add metadata configuration

- [ ] **Build header component**
  - Desktop navigation with mega-menu
  - Mobile hamburger menu
  - Search functionality
  - Contact info display

- [ ] **Build footer component**
  - Company information
  - Social media links
  - Navigation links
  - Copyright notice

- [ ] **Implement breadcrumbs**
  - Dynamic breadcrumb generation
  - Schema.org markup

**Deliverables:**
- Functional header with navigation
- Responsive footer
- Breadcrumb component
- Mobile menu working

### 2.2 UI Component Library
**Duration:** 3-4 days

#### Tasks:
- [ ] **Create base components**
  - Button (primary, secondary, outline variants)
  - Input, Textarea, Select
  - Card component
  - Modal/Dialog
  - Accordion

- [ ] **Style components with Tailwind**
  - Define color palette
  - Set up typography scale
  - Create spacing system
  - Add hover/focus states

- [ ] **Test accessibility**
  - Keyboard navigation
  - Screen reader compatibility
  - ARIA labels
  - Focus management

**Deliverables:**
- Reusable UI component library
- Storybook documentation (optional)
- Accessibility tested

### 2.3 SEO Foundation
**Duration:** 2-3 days

#### Tasks:
- [ ] **Configure metadata**
  - Root layout metadata
  - Dynamic metadata for pages
  - Open Graph tags
  - Twitter cards

- [ ] **Implement structured data**
  - Organization schema
  - Product schema
  - Breadcrumb schema
  - Article schema

- [ ] **Create sitemap**
  - Dynamic sitemap generation
  - Include all pages and products
  - Set priorities and change frequencies

- [ ] **Add robots.txt**
  - Configure crawling rules
  - Link to sitemap

**Deliverables:**
- SEO metadata configured
- Structured data implemented
- Sitemap generating correctly
- robots.txt created

---

## PHASE 3: CONTENT PAGES (Week 5-6)

### 3.1 Static Pages
**Duration:** 5-6 days

#### Tasks:
- [ ] **Homepage**
  - Hero section with CTA
  - Featured products carousel
  - Feature highlights (6 boxes)
  - Company overview
  - Contact CTA

- [ ] **About Us (Om Oss)**
  - Company story
  - Team member cards
  - Values and mission
  - Sidebar navigation

- [ ] **Contact (Kontakt)**
  - Contact form
  - Team directory
  - Google Maps integration
  - Office locations

- [ ] **Training (Utbildningar)**
  - Training overview
  - Course information
  - Contact form integration

- [ ] **Start Your Business (Starta Eget)**
  - Entrepreneurship support content
  - Buying guide links
  - Mini-training information
  - Lead generation form

**Deliverables:**
- All static pages completed
- Content migrated and formatted
- Forms functional
- Responsive design verified

### 3.2 Forms Implementation
**Duration:** 3-4 days

#### Tasks:
- [ ] **Contact form**
  - React Hook Form setup
  - Zod validation schema
  - Swedish error messages
  - Privacy consent checkbox
  - Subject dropdown (Köpa maskin, Utbildning, etc.)

- [ ] **API route for form submission**
  - Validate input server-side
  - Send email via Resend
  - Log submissions
  - Return success/error responses

- [ ] **Email templates**
  - HTML email template
  - Plain text fallback
  - Include all form data
  - Auto-reply to user (optional)

- [ ] **Form testing**
  - Test all validation rules
  - Test email delivery
  - Test error handling
  - Test GDPR compliance

**Deliverables:**
- Working contact forms
- Email delivery configured
- Validation working
- Error handling complete

---

## PHASE 4: PRODUCTS SECTION (Week 7-8)

### 4.1 Product Data Structure
**Duration:** 2-3 days

#### Tasks:
- [ ] **Define product schema**
  - Product type definitions
  - Category taxonomy
  - Treatment associations
  - Image handling

- [ ] **Migrate product data**
  - Extract from WordPress
  - Transform to new schema
  - Import to CMS or create MDX files
  - Verify all data migrated

- [ ] **Create product images**
  - Optimize all product images
  - Generate multiple sizes
  - Add to public/images/products
  - Create image manifest

**Deliverables:**
- Product data migrated
- Images optimized and organized
- Data structure validated

### 4.2 Product Pages
**Duration:** 4-5 days

#### Tasks:
- [ ] **Product listing page**
  - Grid layout
  - Product cards
  - Category filtering
  - Treatment filtering
  - Search functionality

- [ ] **Product detail pages**
  - Dynamic routes ([category]/[product])
  - Image gallery/carousel
  - Product specifications
  - Features list
  - Related products
  - Contact CTA

- [ ] **Category pages**
  - Category overview
  - Filtered product grid
  - Category description
  - Breadcrumbs

**Deliverables:**
- Product listing functional
- Product detail pages complete
- Category pages working
- Filtering and search operational

### 4.3 Product Components
**Duration:** 2-3 days

#### Tasks:
- [ ] **Product carousel**
  - Swiper integration
  - Responsive breakpoints
  - Touch/swipe support
  - Navigation arrows
  - Pagination dots

- [ ] **Product card**
  - Image with hover effect
  - Product name and category
  - Key features
  - CTA button
  - Link to detail page

- [ ] **Product filter**
  - Category filter
  - Treatment filter
  - Clear filters button
  - URL state management

**Deliverables:**
- Product carousel working
- Product cards styled
- Filtering functional

---

## PHASE 5: BLOG/NEWS (Week 9)

### 5.1 Blog Infrastructure
**Duration:** 3-4 days

#### Tasks:
- [ ] **Blog listing page**
  - Article grid
  - Pagination or infinite scroll
  - Featured article
  - Category filter

- [ ] **Article detail pages**
  - Dynamic routes ([slug])
  - Rich text rendering
  - Author information
  - Published date
  - Share buttons
  - Related articles

- [ ] **Migrate blog content**
  - Export WordPress posts
  - Convert to MDX or CMS format
  - Preserve formatting
  - Migrate images

**Deliverables:**
- Blog listing page
- Article detail pages
- Content migrated
- Rich text rendering working

---

## PHASE 6: INTEGRATIONS (Week 10)

### 6.1 Analytics & Tracking
**Duration:** 2-3 days

#### Tasks:
- [ ] **Google Tag Manager**
  - Install GTM script
  - Configure data layer
  - Test page views
  - Set up custom events

- [ ] **Facebook Pixel**
  - Install pixel code
  - Configure events
  - Test tracking
  - Verify in Events Manager

- [ ] **Cookie Consent**
  - Integrate Cookiebot
  - Configure consent categories
  - Test consent flow
  - Verify GDPR compliance

**Deliverables:**
- GTM tracking working
- Facebook Pixel firing
- Cookie consent functional

### 6.2 Third-Party Services
**Duration:** 2-3 days

#### Tasks:
- [ ] **Google Maps**
  - Get API key
  - Implement map component
  - Add location markers
  - Style map
  - Test responsiveness

- [ ] **Chat Widget (Convolo.ai)**
  - Integrate chat script
  - Configure widget settings
  - Test functionality
  - Verify mobile display

- [ ] **Social Media**
  - Add social share buttons
  - Link social profiles
  - Test sharing functionality

**Deliverables:**
- Google Maps working
- Chat widget integrated
- Social features functional

---

## PHASE 7: TESTING & OPTIMIZATION (Week 11)

### 7.1 Quality Assurance
**Duration:** 4-5 days

#### Tasks:
- [ ] **Cross-browser testing**
  - Chrome, Firefox, Safari, Edge
  - Test all major features
  - Fix browser-specific issues

- [ ] **Responsive testing**
  - Mobile (320px - 767px)
  - Tablet (768px - 1023px)
  - Desktop (1024px+)
  - Test all breakpoints

- [ ] **Accessibility audit**
  - Run Lighthouse audit
  - Test keyboard navigation
  - Test screen readers
  - Fix accessibility issues

- [ ] **Performance testing**
  - Run PageSpeed Insights
  - Optimize images
  - Minimize JavaScript
  - Improve Core Web Vitals

- [ ] **SEO audit**
  - Verify all meta tags
  - Check structured data
  - Test sitemap
  - Verify canonical URLs

**Deliverables:**
- Cross-browser compatibility verified
- Responsive design working
- Accessibility score >90
- Performance score >90
- SEO optimized

### 7.2 Content Review
**Duration:** 2-3 days

#### Tasks:
- [ ] **Content accuracy**
  - Verify all content migrated
  - Check for broken links
  - Verify images display correctly
  - Proofread Swedish text

- [ ] **Form testing**
  - Test all forms
  - Verify email delivery
  - Test validation
  - Test error messages

- [ ] **Product verification**
  - Verify all products present
  - Check product details
  - Test product images
  - Verify categories

**Deliverables:**
- Content verified
- Forms tested
- Products validated

---

## PHASE 8: DEPLOYMENT & LAUNCH (Week 12)

### 8.1 Pre-Launch Checklist
**Duration:** 2-3 days

#### Tasks:
- [ ] **Environment setup**
  - Configure production environment variables
  - Set up Vercel project
  - Configure custom domain
  - Set up SSL certificate

- [ ] **Final testing**
  - Test on production environment
  - Verify all integrations
  - Test forms in production
  - Check analytics tracking

- [ ] **SEO preparation**
  - Create 301 redirects for changed URLs
  - Submit sitemap to Google
  - Verify Search Console
  - Set up Analytics

- [ ] **Backup plan**
  - Keep WordPress site accessible
  - Document rollback procedure
  - Have DNS rollback ready

**Deliverables:**
- Production environment ready
- Final testing complete
- Redirects configured
- Backup plan documented

### 8.2 Launch
**Duration:** 1 day

#### Tasks:
- [ ] **Deploy to production**
  - Deploy to Vercel
  - Verify deployment successful
  - Test production site

- [ ] **DNS cutover**
  - Update DNS records
  - Point domain to Vercel
  - Monitor DNS propagation

- [ ] **Post-launch monitoring**
  - Monitor error logs
  - Check analytics
  - Monitor performance
  - Watch for issues

**Deliverables:**
- Site live on production
- DNS updated
- Monitoring in place

### 8.3 Post-Launch Support
**Duration:** 1-2 weeks

#### Tasks:
- [ ] **Monitor and fix issues**
  - Address any bugs
  - Fix broken links
  - Resolve user reports

- [ ] **Performance optimization**
  - Fine-tune caching
  - Optimize images further
  - Improve load times

- [ ] **Documentation**
  - Create content update guide
  - Document deployment process
  - Create troubleshooting guide

**Deliverables:**
- Issues resolved
- Performance optimized
- Documentation complete

---

## RISK MITIGATION

### Potential Challenges & Solutions

| Risk | Impact | Mitigation Strategy |
|------|--------|-------------------|
| Content migration errors | High | Thorough testing, manual verification |
| SEO ranking loss | High | Maintain URL structure, 301 redirects, sitemap |
| Form delivery issues | Medium | Test extensively, use reliable email service |
| Third-party integration failures | Medium | Test in staging, have fallback options |
| Performance issues | Medium | Optimize early, monitor Core Web Vitals |
| Browser compatibility | Low | Test early and often |
| Accessibility issues | Medium | Use semantic HTML, test with tools |

---

## SUCCESS METRICS

### Key Performance Indicators (KPIs)

- **Performance:**
  - Lighthouse score >90
  - First Contentful Paint <1.5s
  - Time to Interactive <3s

- **SEO:**
  - Maintain or improve search rankings
  - All pages indexed within 2 weeks
  - No broken links

- **User Experience:**
  - Form submission success rate >95%
  - Bounce rate maintained or improved
  - Mobile usability score 100%

- **Business:**
  - Lead generation maintained or increased
  - Contact form submissions tracked
  - User engagement metrics

---

## BUDGET ESTIMATE

### Development Costs
- **Developer time:** 8-12 weeks @ $X/hour
- **Design (if needed):** $X
- **Content migration:** Included

### Service Costs (Annual)
- **Vercel Pro:** ~$20/month = $240/year
- **Sanity.io (if used):** $0-$99/month = $0-$1,188/year
- **Resend (email):** $0-$20/month = $0-$240/year
- **Domain & SSL:** Existing
- **Google Maps API:** ~$0-$50/month = $0-$600/year

**Total Estimated Annual Cost:** $240 - $2,268

---

## NEXT STEPS

1. **Review this plan** with stakeholders
2. **Approve architecture** from ARCHITECTURE_PROPOSAL.md
3. **Decide on CMS** approach (Sanity vs. MDX)
4. **Set timeline** and milestones
5. **Begin Phase 1** - Preparation & Setup

---

**Questions or concerns?** Please review all three documents:
- MIGRATION_ANALYSIS.md
- ARCHITECTURE_PROPOSAL.md
- MIGRATION_PLAN.md (this document)

