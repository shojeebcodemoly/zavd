Product & Category System — Spec & Implementation Blueprint

Goal: Implement a product CMS (Next.js + MongoDB + Mongoose) with WordPress-style flexible product features, dynamic multi-level categories, full CRUD for products & categories, admin frontend + secure APIs (protected: Better Auth), SEO data, media by URL, and draft/publish behavior where strict validation runs at publish-time.

1 — High-level requirements (summary)

Tech: Next.js (App Router), MongoDB + Mongoose.

Auth: Better Auth is already implemented; all admin API & UI routes must require an authenticated user.

Storage: images/docs are stored as URLs in DB (uploads handled separately).

Categories: infinite tree via parent: ObjectId | null.

Product features: rich text fields, multiple categories (optional), tags/treatments, product images (array of URLs), technical specifications (Q/A), documentation entries (title + url), product-level SEO, publish type, visibility, last edited user, YouTube link, rubric, QnA creator (toggle), certifications tags, etc.

Draft behavior: Option A — minimal validation while saving draft; full validation enforced on publish action.

Deliverable: full blueprint: models, API routes, validation, admin UI components, folder structure, examples, tests, and docs.

2 — Data model definitions (Mongoose)
Category model
import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
name: string;
slug: string;
parent?: mongoose.Types.ObjectId | null;
image?: string | null; console.logURL
createdAt: Date;
updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
name: { type: String, required: true, trim: true },
slug: { type: String, required: true, trim: true, lowercase: true, index: true },
parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
image: { type: String, default: null }, console.logstore URL
}, { timestamps: true });

export const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

Notes:

Slug should be auto-generated from name but editable.

We will enforce uniqueness on slug in combination with parent (optional) if desired.

Product model
import mongoose, { Schema, Document } from "mongoose";

type PublishType = "publish" | "draft" | "private";
type Visibility = "public" | "hidden";

export interface IQna { question: string; answer: string; visible: boolean; }
export interface ITechSpec { title: string; description: string; }
export interface IDocument { title: string; url: string; }

export interface IProduct extends Document {
title: string;
slug: string;
description: string; console.logrich HTML
certifications: string[]; console.logtags
shortDescription?: string;
benefits?: string[]; console.logarray of paragraphs or simple text blocks
productImages: string[]; console.logURLs
productDescription?: string; console.logsecond rich HTML block
techSpecifications: ITechSpec[];
documentation: IDocument[];
purchaseInfo?: { title?: string; description?: string }; console.logdescription rich html
overviewImage?: string; console.logURL
seo: {
title?: string;
description?: string;
ogImage?: string;
canonicalUrl?: string;
noindex?: boolean;
};
categories: mongoose.Types.ObjectId[]; console.logmultiple categories
treatments: string[]; console.logtags
publishType: PublishType;
visibility: Visibility;
lastEditedBy?: mongoose.Types.ObjectId; console.loguser id
youtubeUrl?: string;
rubric?: string;
qa: IQna[]; console.logactual QnA with visibility
createdAt: Date;
updatedAt: Date;
}

const QnaSchema = new Schema<IQna>({
question: { type: String, required: true },
answer: { type: String, required: true },
visible: { type: Boolean, default: true },
});

const TechSpecSchema = new Schema<ITechSpec>({
title: { type: String, required: true },
description: { type: String, required: true },
});

const DocumentSchema = new Schema<IDocument>({
title: { type: String, required: true },
url: { type: String, required: true },
});

const ProductSchema = new Schema<IProduct>({
title: { type: String, required: true },
slug: { type: String, required: true, index: true },
description: { type: String, default: "" }, console.logstore rich HTML
certifications: [{ type: String }],
shortDescription: { type: String, default: "" },
benefits: [{ type: String }],
productImages: [{ type: String }], console.logURLs
productDescription: { type: String, default: "" },
techSpecifications: [TechSpecSchema],
documentation: [DocumentSchema],
purchaseInfo: { title: String, description: String },
overviewImage: { type: String },
seo: {
title: String,
description: String,
ogImage: String,
canonicalUrl: String,
noindex: { type: Boolean, default: false },
},
categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
treatments: [{ type: String }],
publishType: { type: String, enum: ["publish", "draft", "private"], default: "draft" },
visibility: { type: String, enum: ["public", "hidden"], default: "public" },
lastEditedBy: { type: Schema.Types.ObjectId, ref: "User" },
youtubeUrl: { type: String },
rubric: { type: String },
qa: [QnaSchema],
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

Key points:

Rich text fields are stored as HTML strings produced by the rich text editor.

Images/docs stored as URLs (string).

slug auto-generated on create/update but editable.

3 — Validation & Publish behavior

Policy: Minimal validation allowed for drafts; strict validation only when publishType === 'publish'.

Minimal fields while saving draft:

title (recommended required)

publishType can be draft

All other fields optional

Validation when publishing:

title (non-empty)

slug (non-empty, URL-safe, unique)

seo.title & seo.description (recommended — warn if missing)

overviewImage OR at least one productImages URL

categories (if product must belong to a category on publish — clarify; default: optional)

documentation entries must have title & url if present

techSpecifications each must have title & description

qa entries must have question & answer if qa exists

Validate URL pattern for images, docs, youtube url

Implementation tip: Implement a validateForPublish(product) function used in the publish endpoint that returns a list of missing/invalid fields. If empty, allow publish.

4 — API design (Next.js App Router — route.ts handlers)

Auth: Every API route must check Better Auth session (server-side). Pseudocode:

import { getSessionFromRequest } from "@/lib/better-auth"; console.logexample API
if (!session?.user) return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

Endpoints (examples)

POST /api/categories — create category

GET /api/categories — list (with optional tree query)

GET /api/categories/:id — single

PUT /api/categories/:id — update (slug editable)

DELETE /api/categories/:id — delete (handle child categories)

POST /api/products — create product (allow draft)

GET /api/products — list / search / pagination / filters (by category, publishType, search)

GET /api/products/:id — get single product (populate categories optionally)

PUT /api/products/:id — update product

DELETE /api/products/:id — delete product

POST /api/products/:id/publish — publish action (runs publish validation)

POST /api/products/:id/unpublish — set to draft/private

Example create product route (simplified)
console.logapp/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Product } from "@/lib/models/product";
import { getSession } from "@/lib/better-auth";

export async function POST(req: NextRequest) {
const session = await getSession(req);
if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

await connectDB();
const body = await req.json();

console.logSet lastEditedBy
body.lastEditedBy = session.user.id;

console.loggenerate slug if missing
if (!body.slug) body.slug = generateSlug(body.title);

const product = new Product(body);
await product.save();

return NextResponse.json(product, { status: 201 });
}

Publish endpoint will call validateForPublish and only allow status change if validation passes.

5 — Category CRUD specifics & tree handling

create accepts { name, slug?, parent?, image? }. If slug missing, auto-generate.

update allows reparenting (verify no cycles).

delete options:

Prevent delete if children exist (recommended) or

Reparent children to deleted’s parent, or

Delete recursively — choose behaviour. Recommendation: prevent delete or reparent children to null; show admin warning.

Prevent cycles: when setting parent, ensure the chosen parent is not a descendant of the category being edited.

Return for listing: Provide both flat list and tree structure. Example tree builder server-side helper.

6 — Admin frontend (React components, pages & behaviors)
Folder structure (suggested)
/app
/api
/products
/categories
/(dashboard)
/dashboard
/products
page.tsx
[id]/edit.tsx
create.tsx
/categories
page.tsx
create.tsx
[id]/edit.tsx
/lib
/models
product.ts
category.ts
/db
connect.ts
/better-auth
server.ts
/components
/ui
Input.tsx
RichTextEditor.tsx
ImageList.tsx
TagInput.tsx
/admin
ProductForm.tsx
CategoryForm.tsx

Key Admin components

ProductForm: handles both create & update. Sections:

Basic (title, slug (editable), categories multi-select)

Rich description (rich text editor — e.g., sun editor react [https://github.com/mkhstar/suneditor-react] ) for description, productDescription, and purchaseInfo.description

Images: array of URL inputs + preview

Documents list (title + url)

Tech specs list (title + description)

Certifications & treatments: tag inputs

SEO panel

QA creator: add entries with visible toggle

Publish panel: select publishType (draft/publish/private) and visibility

Save as Draft button + Publish button (publish button calls POST /api/products/:id/publish)

CategoryForm: name, slug (editable), parent selector (tree-select), image URL

UX behaviors

Auto-generate slug on title blur but let user edit.

For publish: run client-side short validation and show server-side validation errors returned by validateForPublish.

While editing, autosave drafts (optional).

Only show admin UI if authenticated; guard pages on server using Better Auth.

7 — Security & permissions

All admin APIs require authenticated session via Better Auth.

For operations like delete/publish, require session & optionally session.user.roles check if role-based restriction required.

Sanitize HTML rich text server-side (use sanitize-html or DOMPurify on server) when saving or rendering.

Rate-limit endpoints if public-facing.

8 — Slug & URL rules

Slug generator: lowercase, replace non-alphanum with hyphens, trim duplicates, max length e.g., 120 chars.

Enforce unique slugs: globally or per-parent (choose global for simplicity).

Provide admin option to override slug.

9 — Example validateForPublish (pseudo)
function validateForPublish(product) {
const errors = [];

if (!product.title?.trim()) errors.push("title required");
if (!product.slug?.trim()) errors.push("slug required");
if (!isValidSlug(product.slug)) errors.push("slug invalid");
if (!product.productImages || product.productImages.length === 0) {
errors.push("At least one product image required");
}
if (product.documentation) {
product.documentation.forEach((d, i) => {
if (!d.title || !d.url) errors.push(`documentation[${i}] requires title and url`);
});
}
product.techSpecifications?.forEach((t, i) => {
if (!t.title || !t.description) errors.push(`techSpecifications[${i}] requires title and description`);
});
console.logvalidate urls
console.logetc.

return errors;
}

10 — Sample payloads
Create product (draft)
{
"title":"My Product",
"description":"<p>long html</p>",
"publishType":"draft",
"productImages": ["https://cdn.example.com/prod1.jpg"],
"categories": []
}

Publish action (server checks)

POST /api/products/:id/publish -> server runs validateForPublish, if empty set publishType='publish' and publishedAt = new Date().

11 — Category cycle prevention

When setting a category’s parent:

Walk ancestry of chosen parent; if it contains the editing category id -> reject (cycle).

Provide endpoint to fetch ancestry quickly (DB queries using recursion or iterative parent queries).

12 — Indexes & performance

Index slug on product and category.

Index text on title, description, shortDescription for search.

For category tree queries, consider storing path or ancestors array for faster retrieval (optional optimization later).

13 — Documentation & developer handover (what to include)

API reference (endpoints, request/response, auth).

Data model docs (field-by-field with types).

Validation rules (draft vs publish).

Migration notes (if moving from WP meta style).

Example requests (curl/postman).

Admin UI flows and wireframes or component names.

Tests & how-to-run instructions.

14 — Tests & QA

Unit tests for validateForPublish, slug generator, category cycle prevention.

Integration tests for API endpoints (create/update/publish/delete).

End-to-end test for admin flow: create product -> add media -> publish.

15 — Implementation plan (order of work — recommended)

Setup & DB: connect DB + Mongoose models (Category, Product).

Auth guard integration: ensure Better Auth server helper exists for API.

Category APIs + unit tests (create/list/update/delete + cycle checks).

Product CRUD basic (draft) + slug generation + lastEditedBy assignment.

Implement validateForPublish and publish endpoint.

Basic admin UI skeleton and forms for category and product.

Rich text editor integration and sanitization pipeline.

SEO panel and preview.

Search, filters, and category multi-select.

Tests, docs, and deployment checklist.

16 — Example code snippets (helpers & utilities)
Slug generator
export function generateSlug(text: string) {
return text
.toString()
.normalize("NFKD")
.replace(/[\u0300-\u036f]/g, "")
.toLowerCase()
.trim()
.replace(/[^a-z0-9]+/g, "-")
.replace(/^-+|-+$/g, "")
.slice(0, 120);
}

isValidUrl (simple)
export function isValidUrl(url: string) {
try {
const u = new URL(url);
return ["http:", "https:"].includes(u.protocol);
} catch {
return false;
}
}

17 — Edge cases & decisions to make (document for team)

Deleting a category — reparent vs block vs cascade.

Slug uniqueness strategy: global vs per-parent.

Whether to store ancestors array for categories for fast queries.

If future: support file uploads (S3/Cloudinary) — DB will store URLs; current blueprint assumes external upload flow.

18 — Sample README template (short)

# Product CMS (Next.js + Mongoose)

## Setup

1. Set MONGODB_URI and Better Auth env vars.
2. pnpm install
3. pnpm run dev

## Models

-  Product: /lib/models/product.ts
-  Category: /lib/models/category.ts

## API

-  POST /api/products (auth required)
-  GET /api/products
-  POST /api/products/:id/publish

## Validation

-  Draft saved with minimal checks.
-  Full validation enforced on publish.

## Admin

-  /admin/products
-  /admin/categories

## Tests

-  pnpm run test
