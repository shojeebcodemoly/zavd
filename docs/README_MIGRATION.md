# Synos Medical - WordPress to Next.js Migration

Welcome to the comprehensive migration documentation for transforming the Synos Medical website from WordPress to Next.js 16.

## 📋 Documentation Overview

This migration project includes three detailed documents:

### 1. [MIGRATION_ANALYSIS.md](./MIGRATION_ANALYSIS.md)
**Complete analysis of the existing WordPress site**

- Business overview and site structure
- Content types and navigation mapping
- Design system documentation (colors, typography, components)
- Features and functionality inventory
- Third-party integrations catalog
- Technical stack analysis
- Migration challenges identified
- Technology recommendations

**Key Findings:**
- 15+ laser products across 10 treatment categories
- Complex mega-menu navigation
- Multiple contact forms with GDPR compliance
- 6 third-party integrations (GTM, Facebook Pixel, Cookiebot, etc.)
- Swedish language content throughout
- MDR-certified medical equipment focus

---

### 2. [ARCHITECTURE_PROPOSAL.md](./ARCHITECTURE_PROPOSAL.md)
**Comprehensive Next.js architecture design**

- Complete folder structure (App Router)
- Data models and TypeScript schemas
- Routing structure and URL mapping
- Component architecture (Server vs Client)
- State management strategy
- Styling approach with Tailwind CSS 4
- Third-party integration implementations
- SEO strategy and metadata configuration
- Performance optimization techniques
- Accessibility standards (WCAG 2.1 AA)
- Deployment strategy (Vercel)
- Security best practices

**Tech Stack:**
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Forms:** React Hook Form + Zod
- **Email:** Resend
- **CMS:** Sanity.io (recommended) or MDX
- **Analytics:** Google Tag Manager, Facebook Pixel
- **Maps:** Google Maps API
- **Deployment:** Vercel

---

### 3. [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)
**Detailed 8-12 week implementation roadmap**

#### Phase Breakdown:

**Phase 1: Preparation & Setup (Week 1-2)**
- Content audit and export
- Development environment setup
- CMS decision and configuration

**Phase 2: Core Infrastructure (Week 3-4)**
- Layout and navigation
- UI component library
- SEO foundation

**Phase 3: Content Pages (Week 5-6)**
- Static pages (Homepage, About, Contact, etc.)
- Forms implementation
- Email integration

**Phase 4: Products Section (Week 7-8)**
- Product data structure
- Product listing and detail pages
- Product components (carousel, cards, filters)

**Phase 5: Blog/News (Week 9)**
- Blog infrastructure
- Article pages
- Content migration

**Phase 6: Integrations (Week 10)**
- Analytics and tracking
- Third-party services (Maps, Chat, Social)

**Phase 7: Testing & Optimization (Week 11)**
- Quality assurance
- Performance optimization
- Content review

**Phase 8: Deployment & Launch (Week 12)**
- Pre-launch checklist
- Production deployment
- Post-launch support

---

## 🎯 Project Goals

1. **Modernize Technology Stack**
   - Move from WordPress to Next.js 16
   - Implement TypeScript for type safety
   - Use modern React patterns (Server Components)

2. **Improve Performance**
   - Target Lighthouse score >90
   - Optimize Core Web Vitals
   - Reduce page load times

3. **Maintain SEO Rankings**
   - Preserve URL structure or implement 301 redirects
   - Maintain all metadata and structured data
   - Ensure no ranking loss

4. **Enhance User Experience**
   - Responsive design across all devices
   - Faster page loads
   - Better accessibility (WCAG 2.1 AA)

5. **Simplify Content Management**
   - Modern CMS (Sanity.io) or Git-based workflow
   - Better developer experience
   - Easier deployments

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- pnpm package manager
- Git
- Vercel account (for deployment)

### Initial Setup

```bash
# Already initialized ✓
# Next.js 16 project with TypeScript and Tailwind CSS 4

# Install additional dependencies
pnpm add react-hook-form @hookform/resolvers zod
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
pnpm add framer-motion swiper
pnpm add resend
pnpm add @react-google-maps/api

# Development dependencies
pnpm add -D @types/node @types/react @types/react-dom

# Start development server
pnpm dev
```

### Environment Variables

Create a `.env.local` file:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.synos.se

# Analytics
NEXT_PUBLIC_GTM_ID=GTM-PQ42DDZ
NEXT_PUBLIC_FB_PIXEL_ID=2886484504973538

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key_here

# Email Service (Resend)
RESEND_API_KEY=your_key_here

# CMS (if using Sanity)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here
```

---

## 📊 Current Site Information

**WordPress Site:** https://www.synos.se

**Company:** Synos Medical AB  
**Org Number:** 556871-8075  
**Locations:** Stockholm & Linköping  
**Contact:** 010-205 15 01, info@synos.se

**Key Pages:**
- Homepage with product carousel
- 15+ product pages across 10 categories
- About Us with team directory
- Contact page with forms and maps
- Training information
- Start Your Business resources
- News/Blog articles

**Third-Party Services:**
- Google Tag Manager (GTM-PQ42DDZ)
- Facebook Pixel (2886484504973538)
- Cookiebot (GDPR compliance)
- Convolo.ai Chat Widget
- Google Maps
- Ninja Forms

---

## 🎨 Design System

### Colors
- **Primary:** #00949e (Teal/Cyan)
- **Primary Hover:** #0C2C46 (Dark Blue)
- **Text:** Dark grays
- **Background:** White/Light grays

### Typography
- **Sans Serif:** Geist Sans (already configured)
- **Monospace:** Geist Mono (already configured)

### Components
- Navigation with mega-menu
- Product carousels
- Contact forms
- Feature cards
- Team member cards
- Google Maps integration
- Cookie consent banner
- Chat widget

---

## 📈 Success Metrics

### Performance Targets
- Lighthouse Performance: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Cumulative Layout Shift: <0.1

### SEO Targets
- Maintain current search rankings
- All pages indexed within 2 weeks
- Zero broken links
- 100% mobile usability score

### Business Targets
- Maintain or increase lead generation
- Form submission success rate >95%
- Improved user engagement metrics

---

## 🛠️ Development Workflow

### Recommended Process

1. **Review Documentation**
   - Read all three migration documents
   - Understand architecture decisions
   - Familiarize with migration plan

2. **Set Up Development Environment**
   - Install dependencies
   - Configure environment variables
   - Set up CMS (if using Sanity)

3. **Follow Phase-by-Phase Plan**
   - Complete Phase 1 before moving to Phase 2
   - Test thoroughly at each phase
   - Document any deviations from plan

4. **Regular Testing**
   - Test on multiple browsers
   - Test responsive design
   - Run accessibility audits
   - Monitor performance

5. **Deployment**
   - Deploy to Vercel staging first
   - Test thoroughly in staging
   - Deploy to production
   - Monitor post-launch

---

## 📝 Important Notes

### Content Migration
- Export all WordPress content before starting
- Verify all images are downloaded
- Document any custom functionality
- Create URL mapping for redirects

### SEO Considerations
- Maintain URL structure where possible
- Create 301 redirects for changed URLs
- Preserve all meta tags and structured data
- Submit new sitemap to Google Search Console

### GDPR Compliance
- Maintain cookie consent functionality
- Include privacy policy links in forms
- Ensure data handling compliance
- Test consent flow thoroughly

### Swedish Language
- All content is in Swedish
- Form validation messages in Swedish
- Error messages in Swedish
- Maintain Swedish locale (sv_SE)

---

## 🤝 Team & Contacts

**Development Team:**
- 1-2 developers recommended
- Frontend expertise required
- Next.js experience preferred

**Synos Medical Team:**
- **Andreas Tanzi** - VD & Grundare
- **Jakob Malmsten** - Produktspecialist / Kundansvarig (+46 764 959 466)
- **Linn Danielsson** - Utbildare (073 8661 588)

---

## 📅 Timeline

**Estimated Duration:** 8-12 weeks

**Key Milestones:**
- Week 2: Development environment ready
- Week 4: Core infrastructure complete
- Week 6: Content pages migrated
- Week 8: Products section complete
- Week 9: Blog migrated
- Week 10: Integrations complete
- Week 11: Testing and optimization
- Week 12: Launch

---

## 💰 Budget Estimate

### Development
- 8-12 weeks of development time

### Annual Service Costs
- **Vercel Pro:** ~$240/year
- **Sanity.io:** $0-$1,188/year (optional)
- **Resend:** $0-$240/year
- **Google Maps API:** $0-$600/year

**Total Annual:** $240 - $2,268

---

## 🔗 Resources

### Documentation
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Hook Form](https://react-hook-form.com)
- [Sanity.io Documentation](https://www.sanity.io/docs)

### Tools
- [Vercel](https://vercel.com)
- [Google Tag Manager](https://tagmanager.google.com)
- [Facebook Business](https://business.facebook.com)
- [Google Search Console](https://search.google.com/search-console)

---

## ✅ Next Steps

1. **Review all documentation** (this file + 3 detailed docs)
2. **Approve architecture proposal**
3. **Decide on CMS approach** (Sanity vs. MDX)
4. **Set project timeline**
5. **Begin Phase 1** of migration plan

---

## 📞 Questions?

If you have any questions about the migration:
1. Review the detailed documentation
2. Check the architecture proposal
3. Consult the migration plan
4. Contact the development team

---

**Last Updated:** October 28, 2025  
**Status:** Planning Phase - Ready to Begin Implementation

