# Project Conversion Guide

> Step-by-step guide for cloning, refactoring, and redesigning this project into a new one.

---

## Overview

This guide is divided into **10 phases**. Each phase has:
- **What to do** (manual steps)
- **Claude Code prompts** (copy-paste ready)
- **Verification steps** (make sure it works)

---

## Phase 0: Project Setup

### Step 0.1: Clone the Project

```bash
# Navigate to your projects folder
cd ~/Projects/YourFolder

# Copy the entire project
cp -r /path/to/synos ./new-project-name

# Navigate into it
cd new-project-name

# Remove git history (start fresh)
rm -rf .git

# Initialize new git repo
git init
git add .
git commit -m "Initial commit: cloned from Synos template"
```

### Step 0.2: Update package.json

Open `package.json` and change:
```json
{
  "name": "your-new-project-name",
  "version": "0.1.0"
}
```

### Step 0.3: Install Dependencies

```bash
pnpm install
```

### Step 0.4: Create New Environment File

```bash
# Copy the example env (or create new)
cp .env .env.local

# Edit .env.local with your new values
```

**Required `.env.local` variables:**

```env
# Database (create new MongoDB database)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/new-db-name
MONGODB_DB=new-db-name

# Authentication (generate new secret)
BETTER_AUTH_SECRET=generate-a-new-64-char-secret-here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Site URL
SITE_URL=http://localhost:3000

# Server Actions Key (generate new)
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=generate-new-32-char-key

# Email (new - for SMTP)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@yourdomain.com

# Analytics (optional - add later)
# NEXT_PUBLIC_GTM_ID=
# NEXT_PUBLIC_FB_PIXEL_ID=
```

**Generate secrets:**
```bash
# Generate BETTER_AUTH_SECRET (64 chars)
openssl rand -base64 48

# Generate ENCRYPTION_KEY (32 chars)
openssl rand -base64 24
```

### Step 0.5: Verify Setup

```bash
# Run the development server
pnpm dev

# Should start on http://localhost:3000
# May show errors until database is connected - that's OK
```

### Verification Checklist
- [ ] Project folder created
- [ ] package.json updated
- [ ] Dependencies installed
- [ ] .env.local created with new values
- [ ] Dev server starts (even with errors)

---

## Phase 1: Database Setup

### Step 1.1: Create New MongoDB Database

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) (or your MongoDB provider)
2. Create a new cluster/database
3. Get the connection string
4. Update `MONGODB_URI` in `.env.local`

### Step 1.2: Seed Admin User

```bash
# Run the seed script
pnpm seed:admin
```

**Or create custom seed script - Claude Code Prompt:**

```
Create a new seed script at scripts/seed-admin.ts that creates an admin user with:
- Email: admin@newdomain.com
- Password: (prompt for input or use env variable)
- Name: Admin

Make sure to hash the password with bcrypt before saving.
```

### Step 1.3: Verify Database Connection

```bash
pnpm dev
# Visit http://localhost:3000
# Try to login with admin credentials
```

### Verification Checklist
- [ ] MongoDB database created
- [ ] Connection string updated in .env.local
- [ ] Admin user seeded
- [ ] Can login to dashboard

---

## Phase 2: Branding & Identity

### Step 2.1: Update Site Settings Model Defaults

**Claude Code Prompt:**

```
Update the default values in models/site-settings.model.ts:

Company Information:
- companyName: "[Your Company Name]"
- orgNumber: "[Your Org Number]"
- phone: "[Your Phone]"
- email: "[Your Email]"

Office Locations:
- Update the default offices array with your office(s)

Social Media:
- Update default social media URLs

SEO:
- siteName: "[Your Site Name]"
- siteDescription: "[Your site description - max 160 chars]"

Keep the same schema structure, just update the default values.
```

### Step 2.2: Update Design Tokens (Colors)

**First, analyze your reference website colors, then:**

**Claude Code Prompt:**

```
Update the design tokens in app/globals.css with new brand colors:

Primary color: #[HEX] (main brand color - buttons, links, accents)
Secondary color: #[HEX] (dark color - backgrounds, text)
Tertiary color: #[HEX] (accent color)

Background: #[HEX]
Muted background: #[HEX]
Border color: #[HEX]

Update all CSS variables in :root and @theme inline sections.
Make sure hover states and foreground colors have good contrast.
```

### Step 2.3: Update Fonts

**Claude Code Prompt:**

```
Update the fonts in the project:

1. In app/globals.css, update:
   --font-sans: "[Your Body Font]", system-ui, sans-serif;
   --font-heading: "[Your Heading Font]", system-ui, sans-serif;

2. In app/layout.tsx, update the Google Fonts imports to use:
   - Body font: [Font Name]
   - Heading font: [Font Name] (if different)

Make sure the fonts are properly imported from next/font/google.
```

### Step 2.4: Replace Logo

1. Add your logo to `public/storage/` (e.g., `your-logo.svg`)
2. **Claude Code Prompt:**

```
Update the logo references throughout the project:

1. In components/common/logo.tsx - update the default logo path
2. In models/site-settings.model.ts - update branding.logoUrl default
3. Make sure the logo component handles both light and dark variants if needed

New logo path: /storage/your-logo.svg
```

### Step 2.5: Update Favicon

**Claude Code Prompt:**

```
Update the favicon/icon generation in:
- app/icon.tsx
- app/apple-icon.tsx

Use the new brand colors:
- Background: #[HEX]
- Text/Icon color: #[HEX]
- First letter or icon: [Letter or describe icon]
```

### Verification Checklist
- [ ] Site settings defaults updated
- [ ] Colors updated in globals.css
- [ ] Fonts changed
- [ ] Logo replaced
- [ ] Favicon updated
- [ ] Run `pnpm dev` and verify visual changes

---

## Phase 3: Navigation & Routing

### Step 3.1: Update Navigation Structure

**Claude Code Prompt:**

```
Update the navigation in config/navigation-new.ts for the new site structure:

Main navigation items:
1. [Item 1] - href: /[path]
2. [Item 2] - href: /[path] (with dropdown items if needed)
3. [Item 3] - href: /[path]
... etc

For items with dropdowns, specify the sub-items.
For dynamic items (like Products), keep isDynamic: true.
```

### Step 3.2: Update/Remove Redirects

**Claude Code Prompt:**

```
Update next.config.ts redirects:

1. Remove all the WordPress migration redirects (they're specific to Synos)
2. Keep only redirects that are relevant to the new site
3. If you're keeping the /blogg to /nyheter redirect pattern, update it
4. Or remove all redirects if starting fresh

The current redirects are for WordPress URL migration - remove them.
```

### Step 3.3: Rename/Remove Routes

**If you need different page URLs:**

**Claude Code Prompt:**

```
Rename/restructure the following routes in app/(client)/:

Current -> New:
- /nyheter -> /[new-name] (or keep as blog)
- /produkter -> /[new-name] (or keep as products)
- /kategori -> /[new-name] (or keep as category)
- /starta-eget -> /[new-name] (or remove if not needed)
- /utbildningar -> /[new-name] (or remove if not needed)
- /om-oss -> /[new-name] (or keep as about)

For each rename:
1. Rename the folder
2. Update all internal links
3. Update navigation config
4. Update sitemap config
5. Update cache tags/paths in lib/revalidation/index.ts
```

### Step 3.4: Remove Unnecessary Pages

**Claude Code Prompt:**

```
Remove the following pages/routes that aren't needed for the new project:

Routes to remove:
- /starta-eget (and sub-pages) [if not needed]
- /utbildningar [if not needed]
- /om-oss/team [if not needed]
- [list other pages to remove]

For each removal:
1. Delete the page folder in app/(client)/
2. Delete the corresponding CMS page model in models/
3. Delete the repository in lib/repositories/
4. Delete the service in lib/services/
5. Delete the validation in lib/validations/
6. Delete the API route in app/api/
7. Delete the dashboard editor page in app/(dashboard)/
8. Remove from navigation config
9. Remove from sitemap config
10. Remove cache tags from lib/revalidation/index.ts
```

### Verification Checklist
- [ ] Navigation updated
- [ ] Redirects cleaned up
- [ ] Routes renamed (if needed)
- [ ] Unnecessary pages removed
- [ ] All internal links working
- [ ] Navigation dropdown works

---

## Phase 4: UI/UX Redesign

### Step 4.1: Analyze Reference Website

Before making changes, document what you want from the reference:
- Hero section style
- Card designs
- Button styles
- Layout patterns
- Spacing/typography
- Animations

### Step 4.2: Update Navbar

**Claude Code Prompt:**

```
Redesign the Navbar component in components/layout/Navbar.tsx:

Reference: [describe or share screenshot]

Changes needed:
- [Layout change: e.g., "logo on left, nav centered, CTA on right"]
- [Style change: e.g., "remove blur effect, use solid background"]
- [Mobile: e.g., "use drawer instead of dropdown"]
- [Add/remove elements]

Keep the existing functionality:
- Scroll behavior
- Mobile responsive
- Dynamic mega-menu for products
- Quote request modal
```

### Step 4.3: Update Footer

**Claude Code Prompt:**

```
Redesign the Footer component in components/layout/Footer.tsx:

Reference: [describe or share screenshot]

Changes needed:
- [Layout: e.g., "4 columns instead of 3"]
- [Add/remove sections]
- [Style changes]
- [Newsletter section: keep/modify/remove]

Keep dynamic data from footerSettings prop.
```

### Step 4.4: Update Hero Section

**Claude Code Prompt:**

```
Redesign the Hero component in components/home/Hero.tsx:

Reference: [describe or share screenshot]

Changes needed:
- [Layout: e.g., "split layout with image on right"]
- [Background: e.g., "gradient instead of image"]
- [Content: e.g., "add stats below headline"]
- [Animation: e.g., "fade in from left"]
- [CTA buttons: style/position]

The hero content should come from the HomePage CMS model.
```

### Step 4.5: Update Product Card

**Claude Code Prompt:**

```
Redesign the ProductCard component in components/products/ProductCard.tsx:

Reference: [describe or share screenshot]

Changes needed:
- [Layout: e.g., "vertical card with image on top"]
- [Hover effects: e.g., "scale image, show quick view button"]
- [Information shown: title, price, category, etc.]
- [Badge styles for certifications/tags]

Keep the link structure to product detail pages.
```

### Step 4.6: Update Other Components

Continue with other components as needed:

- `components/home/FeatureHighlights.tsx`
- `components/home/ProductShowcase.tsx`
- `components/home/Testimonials.tsx`
- `components/home/ProcessSteps.tsx`
- `components/products/ProductDetailSidebar.tsx`
- `components/products/ProductImageGallery.tsx`
- `components/forms/ContactInquiryForm.tsx`

**General prompt template:**

```
Redesign the [ComponentName] component in [path]:

Reference: [describe or share screenshot]

Changes needed:
- [List specific changes]

Keep existing:
- [List functionality to preserve]
```

### Step 4.7: Update Global Styles

**Claude Code Prompt:**

```
Update global utility styles in app/globals.css:

Changes needed:
- [Container max-width: e.g., "change from 1440px to 1280px"]
- [Section padding: e.g., "increase vertical padding"]
- [Glass effect: e.g., "remove or modify"]
- [Add new utility classes if needed]

Update these utilities:
- ._container
- .padding-top / .padding-bottom
- .section-padding
- .glass-card
```

### Verification Checklist
- [ ] Navbar redesigned
- [ ] Footer redesigned
- [ ] Hero section redesigned
- [ ] Product cards redesigned
- [ ] Home page sections redesigned
- [ ] Global styles updated
- [ ] Mobile responsive on all components
- [ ] No visual regressions

---

## Phase 5: Email System Setup

### Step 5.1: Install Nodemailer

**Claude Code Prompt:**

```
Set up email functionality using Nodemailer:

1. Install nodemailer and types:
   pnpm add nodemailer
   pnpm add -D @types/nodemailer

2. Create lib/email/index.ts with:
   - Email transporter configuration using SMTP env variables
   - Generic sendEmail function
   - Email templates for different types (inquiry, quote request, etc.)

3. Environment variables to use:
   - SMTP_HOST
   - SMTP_PORT
   - SMTP_USER
   - SMTP_PASSWORD
   - SMTP_FROM

4. Create email templates as functions that return HTML strings.
```

### Step 5.2: Create Email Templates

**Claude Code Prompt:**

```
Create email templates in lib/email/templates/:

1. inquiry-notification.ts - Sent to admin when new inquiry received
   - Include: name, email, phone, message, product (if applicable)
   - Professional HTML design with company branding

2. inquiry-confirmation.ts - Sent to customer confirming receipt
   - Thank them for contacting
   - Mention response time
   - Include their message summary

3. quote-request.ts - For quote requests
   - Include all quote details
   - Product information if applicable

Use the brand colors from CSS variables.
Templates should be responsive HTML emails.
```

### Step 5.3: Integrate Email with Form Submissions

**Claude Code Prompt:**

```
Update the form submission flow to send emails:

1. In lib/services/form-submission.service.ts:
   - After successfully saving to database
   - Send notification email to admin
   - Send confirmation email to customer
   - Handle email errors gracefully (don't fail the submission)

2. Update app/api/form-submissions/route.ts POST handler:
   - Ensure email sending is triggered
   - Log email success/failure

3. Add email status to FormSubmission model (optional):
   - emailSentToAdmin: boolean
   - emailSentToCustomer: boolean
   - emailError: string (if any)
```

### Step 5.4: Test Email Setup

```bash
# Add test SMTP credentials to .env.local
# Use services like Mailtrap for testing

# Create a test endpoint or use the contact form
```

### Verification Checklist
- [ ] Nodemailer installed
- [ ] Email service configured
- [ ] Email templates created
- [ ] Form submissions trigger emails
- [ ] Admin receives notification
- [ ] Customer receives confirmation
- [ ] Errors handled gracefully

---

## Phase 6: Content & Data Model Updates

### Step 6.1: Update Product Model (if needed)

**Claude Code Prompt:**

```
Update the Product model in models/product.model.ts:

Changes needed:
- [Add field: e.g., "price: number"]
- [Remove field: e.g., "rubric"]
- [Rename field: e.g., "treatments -> tags"]
- [Change field type: e.g., "make categories single instead of array"]

Also update:
- lib/validations/product.validation.ts
- lib/repositories/product.repository.ts
- lib/services/product.service.ts
- components/admin/ProductForm.tsx
- Product display components
```

### Step 6.2: Update Category Model (if needed)

**Claude Code Prompt:**

```
Update the Category model for your needs:

Changes:
- [List any changes needed]

Or keep as-is if the hierarchical category system works for you.
```

### Step 6.3: Update Blog Model (if needed)

**Claude Code Prompt:**

```
Update the BlogPost model in models/blog-post.model.ts:

Changes:
- [List changes if any]

Or rename "blog" to something else like "articles", "news", etc.
```

### Step 6.4: Update CMS Page Models

For each CMS page you're keeping, update the model to match your content needs:

**Claude Code Prompt:**

```
Update the [PageName] model in models/[page]-page.model.ts:

Current structure:
[describe current]

New structure needed:
[describe what you need]

Also update:
- The validation schema
- The service
- The API route
- The dashboard editor
- The public page
```

### Verification Checklist
- [ ] Product model updated
- [ ] Category model updated (if needed)
- [ ] Blog model updated (if needed)
- [ ] CMS page models updated
- [ ] All related files updated (validation, service, API, UI)
- [ ] Dashboard forms work correctly
- [ ] Public pages display correctly

---

## Phase 7: SEO & Metadata

### Step 7.1: Update Default Metadata

**Claude Code Prompt:**

```
Update SEO defaults in app/layout.tsx:

- Default keywords for your industry
- Default meta description
- OpenGraph defaults
- Twitter card defaults

Also update the DEFAULT_KEYWORDS array with relevant terms.
```

### Step 7.2: Update JSON-LD Structured Data

**Claude Code Prompt:**

```
Update lib/seo/product-jsonld.ts for your products:

- Update brand name
- Add/modify schema properties relevant to your products
- Update organization schema

If your products have prices, add:
- offers schema
- priceValidUntil
- availability
```

### Step 7.3: Update Sitemap Configuration

**Claude Code Prompt:**

```
Update sitemap configuration:

1. app/sitemap.ts - Update the sitemap index
2. app/sitemap/*.ts - Update individual sitemaps
3. lib/revalidation/index.ts - Update PATHS to match your routes

Remove entries for pages you deleted.
Add entries for any new pages.
```

### Step 7.4: Update robots.txt

**Claude Code Prompt:**

```
Update app/robots.ts:

- Update sitemap URL to your domain
- Add/remove disallow rules as needed
- Update for your production domain
```

### Verification Checklist
- [ ] Default metadata updated
- [ ] JSON-LD structured data updated
- [ ] Sitemap generates correctly
- [ ] robots.txt correct
- [ ] Test with Google Rich Results Test

---

## Phase 8: Admin Dashboard Updates

### Step 8.1: Update Sidebar Navigation

**Claude Code Prompt:**

```
Update the admin sidebar in components/admin/AdminSidebar.tsx:

- Update menu items to match your pages
- Remove items for deleted features
- Add items for new features
- Update icons if needed
- Update labels/text
```

### Step 8.2: Update Dashboard Home

**Claude Code Prompt:**

```
Update the dashboard home page at app/(dashboard)/dashboard/page.tsx:

- Update stats cards to show relevant metrics
- Update recent activity sections
- Update quick action buttons
- Match the design to your brand
```

### Step 8.3: Update Form Components

For each admin form (ProductForm, CategoryForm, etc.):

**Claude Code Prompt:**

```
Update [FormName] in components/admin/[FormName].tsx:

- Add/remove fields to match model changes
- Update labels to your language/terminology
- Update validation messages
- Update field help text
```

### Verification Checklist
- [ ] Sidebar navigation updated
- [ ] Dashboard home page updated
- [ ] All admin forms work correctly
- [ ] Can create/edit/delete content
- [ ] File uploads work

---

## Phase 9: Testing & Cleanup

### Step 9.1: Remove Synos-Specific Content

**Claude Code Prompt:**

```
Search and replace/remove all Synos-specific references:

1. Search for "Synos" in all files and replace with your company name
2. Search for "synos" (lowercase) in slugs, variables, etc.
3. Remove any hardcoded Swedish text that should be dynamic
4. Update cookie prefix in lib/db/auth.ts (cookiePrefix: "synos" -> "yourprefix")
5. Remove any Synos-specific assets from public/
```

### Step 9.2: Clean Up Unused Files

**Claude Code Prompt:**

```
Identify and remove unused files:

1. Components that aren't imported anywhere
2. Unused utility functions
3. Unused types/interfaces
4. Unused API routes
5. Unused models

Run: grep -r "ComponentName" to check if something is used.
```

### Step 9.3: Run Build and Fix Errors

```bash
# Run TypeScript check
pnpm exec tsc --noEmit

# Run build
pnpm build

# Fix any errors that come up
```

### Step 9.4: Test All Features

Manual testing checklist:

**Public Pages:**
- [ ] Home page loads correctly
- [ ] Product listing works
- [ ] Product detail pages work
- [ ] Category pages work
- [ ] Blog/news pages work
- [ ] Contact form submits
- [ ] Email is sent
- [ ] All CMS pages load

**Admin Dashboard:**
- [ ] Login works
- [ ] Dashboard home loads
- [ ] Can create product
- [ ] Can edit product
- [ ] Can delete product
- [ ] Can manage categories
- [ ] Can manage blog posts
- [ ] Can edit CMS pages
- [ ] Can manage site settings
- [ ] File upload works

**Responsive:**
- [ ] Mobile navigation works
- [ ] All pages look good on mobile
- [ ] Forms work on mobile

### Verification Checklist
- [ ] No Synos references remain
- [ ] Unused files removed
- [ ] Build passes
- [ ] All features tested
- [ ] Responsive design works

---

## Phase 10: Deployment Preparation

### Step 10.1: Update Production Environment

Create/update production environment variables:

```env
# Production .env
MONGODB_URI=your-production-mongodb-uri
MONGODB_DB=your-production-db

BETTER_AUTH_SECRET=production-secret
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com

SITE_URL=https://yourdomain.com

SMTP_HOST=your-production-smtp
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@yourdomain.com

# Analytics (if ready)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=your-pixel-id
```

### Step 10.2: Update next.config.ts for Production

**Claude Code Prompt:**

```
Update next.config.ts for production:

1. Update image remotePatterns with your production domains
2. Remove any development-only settings
3. Add any production-specific headers if needed
```

### Step 10.3: Final Build Test

```bash
# Build for production
pnpm build

# Test production build locally
pnpm start
```

### Step 10.4: Deploy

Deploy to your hosting platform (Vercel, etc.):

```bash
# If using Vercel
vercel

# Or push to connected repo
git add .
git commit -m "Ready for production"
git push
```

### Verification Checklist
- [ ] Production env variables set
- [ ] Build succeeds
- [ ] Production build tested locally
- [ ] Deployed successfully
- [ ] Production site works
- [ ] Emails work in production
- [ ] Analytics tracking (if set up)

---

## Quick Reference: Common Claude Code Prompts

### For UI Changes
```
Update [component] to match this design: [description]
Keep the existing functionality but change the visual style.
```

### For Adding Features
```
Add [feature] to [location]:
- [Requirement 1]
- [Requirement 2]
Follow the existing patterns in the codebase.
```

### For Removing Features
```
Remove [feature] completely:
- Delete the model
- Delete the repository
- Delete the service
- Delete the validation
- Delete the API routes
- Delete the UI components
- Remove from navigation
- Remove from sitemap
```

### For Refactoring
```
Refactor [component/module]:
- Current issue: [describe]
- Desired outcome: [describe]
- Keep backward compatibility with: [list]
```

### For Bug Fixes
```
Fix [issue] in [location]:
- Current behavior: [describe]
- Expected behavior: [describe]
```

---

## Tips for Working with Claude Code

1. **Be specific** - The more detail you provide, the better the result
2. **One thing at a time** - Don't combine too many changes in one prompt
3. **Verify after each change** - Run `pnpm dev` and check the result
4. **Use the blueprint** - Reference `docs/PROJECT_BLUEPRINT.md` for understanding
5. **Commit often** - Save your progress with git commits after each successful phase
6. **Test as you go** - Don't wait until the end to test

---

*Guide created for converting Synos Medical template to new projects.*
