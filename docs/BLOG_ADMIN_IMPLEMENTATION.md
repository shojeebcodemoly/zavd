# Blog Admin Dashboard Implementation Plan

## Overview

This document outlines the implementation plan for adding a dynamic blog management system to the Synos admin dashboard. The system will allow administrators to create, edit, and manage blog posts through a WordPress-like interface.

## Current State

| Component | Current Implementation |
|-----------|----------------------|
| Blog Data | Static file (`/data/blog/blog-data.ts`) |
| Database | MongoDB with Mongoose |
| Auth | Better Auth (session-based) |
| Admin Dashboard | Exists at `/dashboard` |
| Image Storage | Filesystem-based API |
| Rich Text Editor | SunEditor (used in ProductForm) |

## Requirements

Based on the WordPress screenshot analysis:

1. **Blog Post Fields:**
   - Title
   - Slug (auto-generated from title)
   - Content (Rich HTML via WYSIWYG editor)
   - Excerpt (short description)
   - Featured Image (main blog image)
   - Header Image (optional, for hero section)
   - Categories (multiple selection)
   - Tags (multiple tags)
   - Author (linked to User model)
   - SEO fields (title, description, keywords, og:image)
   - Publish status (draft/published/private)
   - Published date

2. **Blog Categories:**
   - Same structure as product categories (hierarchical)
   - Fields: name, slug, description, parent, image, order, isActive

3. **Author:**
   - Linked to existing User model
   - Uses user's name, email, image from User model
   - Additional bio from Profile model

---

## Implementation Plan

### Phase 1: Database Layer

#### 1.1 Create Blog Category Model
**File:** `models/blog-category.model.ts`

```typescript
interface IBlogCategory {
  _id: ObjectId;
  name: string;
  slug: string;
  description?: string;
  parent: ObjectId | null;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 1.2 Create Blog Post Model
**File:** `models/blog-post.model.ts`

```typescript
interface IBlogPost {
  _id: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Rich HTML
  featuredImage?: {
    url: string;
    alt: string;
  };
  headerImage?: {
    url: string;
    alt: string;
    showTitleOverlay: boolean;
  };
  author: ObjectId; // Reference to User
  categories: ObjectId[]; // References to BlogCategory
  tags: string[];
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
    noindex?: boolean;
  };
  publishType: 'draft' | 'publish' | 'private';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Phase 2: Data Access Layer

#### 2.1 Blog Category Repository
**File:** `lib/repositories/blog-category.repository.ts`

Methods:
- `create(data)` - Create category
- `findById(id)` - Find by ID
- `findBySlug(slug)` - Find by slug
- `findAll(options)` - List with pagination
- `update(id, data)` - Update category
- `delete(id)` - Delete category
- `buildTree()` - Get hierarchical tree

#### 2.2 Blog Post Repository
**File:** `lib/repositories/blog-post.repository.ts`

Methods:
- `create(data)` - Create post
- `findById(id)` - Find by ID with populated author/categories
- `findBySlug(slug)` - Find by slug for public display
- `findAll(options)` - List with filtering/pagination
- `update(id, data)` - Update post
- `delete(id)` - Delete post
- `findByCategory(categorySlug)` - Posts by category
- `findByTag(tag)` - Posts by tag
- `findByAuthor(authorId)` - Posts by author
- `getStats()` - Dashboard statistics

### Phase 3: Service Layer

#### 3.1 Blog Category Service
**File:** `lib/services/blog-category.service.ts`

#### 3.2 Blog Post Service
**File:** `lib/services/blog-post.service.ts`

### Phase 4: Validation Schemas

#### 4.1 Blog Category Validation
**File:** `lib/validations/blog-category.validation.ts`

#### 4.2 Blog Post Validation
**File:** `lib/validations/blog-post.validation.ts`

### Phase 5: API Routes

#### 5.1 Blog Categories API
**Location:** `app/api/blog-categories/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blog-categories` | List all categories |
| POST | `/api/blog-categories` | Create category |
| GET | `/api/blog-categories/[id]` | Get category |
| PUT | `/api/blog-categories/[id]` | Update category |
| DELETE | `/api/blog-categories/[id]` | Delete category |
| GET | `/api/blog-categories/tree` | Get category tree |

#### 5.2 Blog Posts API
**Location:** `app/api/blog-posts/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blog-posts` | List posts (with filters) |
| POST | `/api/blog-posts` | Create post |
| GET | `/api/blog-posts/[id]` | Get post by ID |
| PUT | `/api/blog-posts/[id]` | Update post |
| DELETE | `/api/blog-posts/[id]` | Delete post |
| GET | `/api/blog-posts/slug/[slug]` | Get post by slug |
| GET | `/api/blog-posts/stats` | Get statistics |

### Phase 6: Admin Dashboard UI

#### 6.1 Update Admin Sidebar
**File:** `components/admin/AdminSidebar.tsx`

Add "Blog" section with:
- Blog Posts
- Blog Categories

#### 6.2 Blog Posts List Page
**File:** `app/(dashboard)/dashboard/blog/page.tsx`

Features:
- List of all blog posts
- Search and filter
- Status tabs (All, Published, Draft, Private)
- Quick actions (edit, delete, view)
- Stats cards

#### 6.3 Blog Post Form
**File:** `components/admin/BlogPostForm.tsx`

Features:
- Title input with slug auto-generation
- Rich text editor (SunEditor)
- Featured image upload
- Header image upload with overlay toggle
- Category multi-select (tree structure)
- Tags input
- Excerpt textarea
- SEO section (collapsible)
- Publish settings (status, date)
- Save draft / Publish buttons

#### 6.4 Blog Categories Management
**Files:**
- `app/(dashboard)/dashboard/blog/categories/page.tsx`
- `app/(dashboard)/dashboard/blog/categories/new/page.tsx`
- `app/(dashboard)/dashboard/blog/categories/[id]/page.tsx`

### Phase 7: Update Public Blog Pages

#### 7.1 Update Blog Data Fetching
**Files to update:**
- `app/(client)/blogg/page.tsx` - Use database instead of static data
- `app/(client)/blogg/[slug]/page.tsx` - Fetch from database
- `app/(client)/blogg/category/[slug]/page.tsx` - Use BlogCategory
- `app/(client)/blogg/tag/[slug]/page.tsx` - Query by tag
- `app/(client)/blogg/author/[slug]/page.tsx` - Query by author

#### 7.2 Update Blog Components
- Ensure components work with new data structure
- Update author display to use User model data

### Phase 8: Data Migration

#### 8.1 Migration Script
**File:** `scripts/migrate-blog-data.ts`

Script to:
1. Create blog categories from existing static categories
2. Migrate existing blog articles to MongoDB
3. Map authors to existing users (or create placeholder)
4. Preserve slugs for SEO continuity

---

## File Structure (New Files)

```
synos/
├── models/
│   ├── blog-category.model.ts       # NEW
│   └── blog-post.model.ts           # NEW
├── lib/
│   ├── repositories/
│   │   ├── blog-category.repository.ts  # NEW
│   │   └── blog-post.repository.ts      # NEW
│   ├── services/
│   │   ├── blog-category.service.ts     # NEW
│   │   └── blog-post.service.ts         # NEW
│   └── validations/
│       ├── blog-category.validation.ts  # NEW
│       └── blog-post.validation.ts      # NEW
├── app/
│   ├── api/
│   │   ├── blog-categories/
│   │   │   ├── route.ts                 # NEW
│   │   │   ├── tree/route.ts            # NEW
│   │   │   └── [id]/route.ts            # NEW
│   │   └── blog-posts/
│   │       ├── route.ts                 # NEW
│   │       ├── stats/route.ts           # NEW
│   │       ├── [id]/route.ts            # NEW
│   │       └── slug/[slug]/route.ts     # NEW
│   └── (dashboard)/dashboard/
│       └── blog/
│           ├── page.tsx                 # NEW - Posts list
│           ├── new/page.tsx             # NEW - Create post
│           ├── [id]/page.tsx            # NEW - Edit post
│           ├── blog-posts-list.tsx      # NEW - Client component
│           └── categories/
│               ├── page.tsx             # NEW - Categories list
│               ├── new/page.tsx         # NEW - Create category
│               └── [id]/page.tsx        # NEW - Edit category
├── components/admin/
│   ├── BlogPostForm.tsx                 # NEW
│   └── BlogCategoryForm.tsx             # NEW
└── scripts/
    └── migrate-blog-data.ts             # NEW
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `components/admin/AdminSidebar.tsx` | Add Blog nav items |
| `app/(client)/blogg/page.tsx` | Fetch from DB |
| `app/(client)/blogg/[slug]/page.tsx` | Fetch from DB |
| `app/(client)/blogg/category/[slug]/page.tsx` | Use BlogCategory model |
| `app/(client)/blogg/tag/[slug]/page.tsx` | Query from DB |
| `app/(client)/blogg/author/[slug]/page.tsx` | Use User model |
| `types/article.ts` | Update to match new model |
| `app/sitemap/posts.xml/route.ts` | Fetch from DB |

---

## Database Indexes

### blog_posts collection
- `slug` (unique)
- `publishType`
- `publishedAt` (descending)
- `author`
- `categories`
- `tags`
- Text index on `title`, `excerpt`, `content`

### blog_categories collection
- `slug` (unique)
- `parent`, `order` (compound)
- `isActive`

---

## API Response Format

Consistent with existing API patterns:

```typescript
// Success
{
  success: true,
  data: { ... },
  meta?: { page, limit, total, totalPages }
}

// Error
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

---

## Security Considerations

1. **Authentication:** All admin routes require valid session
2. **Authorization:** Only authenticated users can create/edit posts
3. **Input Validation:** Zod schemas for all inputs
4. **XSS Prevention:** HTML sanitization for content
5. **CSRF Protection:** Better Auth handles this

---

## Implementation Order

1. ✅ Documentation (this file)
2. ⬜ Blog Category Model + Repository + Service
3. ⬜ Blog Post Model + Repository + Service
4. ⬜ Validation Schemas
5. ⬜ API Routes (Blog Categories)
6. ⬜ API Routes (Blog Posts)
7. ⬜ Admin Sidebar Update
8. ⬜ Blog Categories Admin Pages
9. ⬜ BlogCategoryForm Component
10. ⬜ Blog Posts Admin Pages
11. ⬜ BlogPostForm Component
12. ⬜ Update Public Blog Pages
13. ⬜ Migration Script
14. ⬜ Run Migration
15. ⬜ Testing

---

## Estimated Files

- **New files:** ~25 files
- **Modified files:** ~10 files

---

## Notes

- Reuse existing patterns from Product management
- Reuse SunEditor component for rich text
- Reuse TreeSelect for category selection
- Reuse TagInput for tags management
- Reuse ImageUrlList for image management
- Follow existing naming conventions
- Match existing UI/UX patterns
