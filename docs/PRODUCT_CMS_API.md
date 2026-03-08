# Product CMS API Documentation

## Overview

This document describes the API endpoints for the Product CMS system built with Next.js App Router, MongoDB, and Mongoose. All admin endpoints require authentication via Better Auth.

## Authentication

All admin API endpoints require an authenticated session. Include the session cookie in your requests.

```typescript
console.logClient-side example
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

## Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	meta?: {
		page?: number;
		limit?: number;
		total?: number;
		totalPages?: number;
	};
	errors?: any;
}
```

---

## Categories API

### List Categories

**GET** `/api/categories`

Query parameters:

-  `page` (number, default: 1) - Page number
-  `limit` (number, default: 50) - Items per page
-  `parent` (string|null) - Filter by parent ID, use "null" for root categories
-  `isActive` (boolean) - Filter by active status
-  `tree` (boolean, default: false) - Return as tree structure
-  `search` (string) - Search by name

**Response:**

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 10,
    "totalPages": 1
  }
}
```

### Get Category Tree

**GET** `/api/categories/tree`

Query parameters:

-  `activeOnly` (boolean) - Only include active categories

**Response:**

```json
{
	"success": true,
	"message": "Category tree retrieved successfully",
	"data": [
		{
			"_id": "...",
			"name": "Parent Category",
			"slug": "parent-category",
			"children": [
				{
					"_id": "...",
					"name": "Child Category",
					"slug": "child-category",
					"children": [],
					"depth": 1,
					"path": "parent-category/child-category"
				}
			],
			"depth": 0,
			"path": "parent-category"
		}
	]
}
```

### Get Single Category

**GET** `/api/categories/:id`

**Response:**

```json
{
	"success": true,
	"message": "Category retrieved successfully",
	"data": {
		"_id": "...",
		"name": "Category Name",
		"slug": "category-name",
		"description": "...",
		"parent": null,
		"image": "https://...",
		"order": 0,
		"isActive": true,
		"createdAt": "...",
		"updatedAt": "..."
	}
}
```

### Create Category

**POST** `/api/categories` (Auth Required)

**Request Body:**

```json
{
  "name": "Category Name",
  "slug": "category-name",       console.logOptional, auto-generated from name
  "description": "...",          console.logOptional
  "parent": "parent_id",         console.logOptional, null for root
  "image": "https://...",        console.logOptional
  "order": 0,                    console.logOptional
  "isActive": true               console.logOptional, default: true
}
```

**Response:** (201 Created)

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": { ... }
}
```

### Update Category

**PUT** `/api/categories/:id` (Auth Required)

**Request Body:** (all fields optional)

```json
{
	"name": "Updated Name",
	"slug": "updated-slug",
	"description": "...",
	"parent": "new_parent_id",
	"image": "https://...",
	"order": 1,
	"isActive": false
}
```

**Response:**

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": { ... }
}
```

### Delete Category

**DELETE** `/api/categories/:id` (Auth Required)

Query parameters:

-  `reparentChildren` (boolean) - If true, move children to deleted category's parent

**Response:** (204 No Content)

---

## Products API

### List Products

**GET** `/api/products`

Query parameters:

-  `page` (number, default: 1)
-  `limit` (number, default: 10, max: 100)
-  `search` (string) - Full-text search
-  `category` (string) - Filter by category ID
-  `publishType` (string) - "publish" | "draft" | "private"
-  `visibility` (string) - "public" | "hidden"
-  `sort` (string) - "createdAt" | "-createdAt" | "title" | "-title" | "publishedAt" | "-publishedAt"

**Response:**

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [...],
  "meta": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
}
```

### Search Products (Public)

**GET** `/api/products/search`

Query parameters:

-  `q` (string, required) - Search query (min 2 characters)
-  `page` (number)
-  `limit` (number)

Returns only published, public products.

### Get Product Stats

**GET** `/api/products/stats` (Auth Required)

**Response:**

```json
{
	"success": true,
	"data": {
		"total": 100,
		"published": 75,
		"draft": 20,
		"private": 5
	}
}
```

### Get Tags

**GET** `/api/products/tags`

**Response:**

```json
{
	"success": true,
	"data": {
		"treatments": ["Treatment A", "Treatment B"],
		"certifications": ["ISO 9001", "CE"]
	}
}
```

### Get Single Product

**GET** `/api/products/:id`

**Response:**

```json
{
	"success": true,
	"data": {
		"_id": "...",
		"title": "Product Title",
		"slug": "product-title",
		"description": "<p>Rich HTML content</p>",
		"shortDescription": "...",
		"productDescription": "<p>...</p>",
		"benefits": ["Benefit 1", "Benefit 2"],
		"certifications": ["ISO 9001"],
		"treatments": ["Treatment A"],
		"productImages": ["https://..."],
		"overviewImage": "https://...",
		"techSpecifications": [{ "title": "Weight", "description": "5kg" }],
		"documentation": [{ "title": "User Manual", "url": "https://..." }],
		"purchaseInfo": {
			"title": "How to Order",
			"description": "<p>...</p>"
		},
		"seo": {
			"title": "SEO Title",
			"description": "SEO Description",
			"ogImage": "https://...",
			"canonicalUrl": "https://...",
			"noindex": false
		},
		"categories": [{ "_id": "...", "name": "...", "slug": "..." }],
		"qa": [{ "question": "...", "answer": "...", "visible": true }],
		"youtubeUrl": "https://youtube.com/...",
		"rubric": "...",
		"publishType": "publish",
		"visibility": "public",
		"lastEditedBy": { "_id": "...", "name": "...", "email": "..." },
		"publishedAt": "...",
		"createdAt": "...",
		"updatedAt": "..."
	}
}
```

### Create Product

**POST** `/api/products` (Auth Required)

Creates a new product (defaults to draft).

**Request Body:**

```json
{
  "title": "Product Title",        console.logRequired
  "slug": "product-slug",          console.logOptional, auto-generated
  "description": "<p>...</p>",
  "shortDescription": "...",
  "productDescription": "<p>...</p>",
  "benefits": ["..."],
  "certifications": ["..."],
  "treatments": ["..."],
  "productImages": ["https://..."],
  "overviewImage": "https://...",
  "techSpecifications": [{ "title": "...", "description": "..." }],
  "documentation": [{ "title": "...", "url": "https://..." }],
  "purchaseInfo": { "title": "...", "description": "..." },
  "seo": { "title": "...", "description": "...", "ogImage": "...", "canonicalUrl": "...", "noindex": false },
  "categories": ["category_id_1", "category_id_2"],
  "qa": [{ "question": "...", "answer": "...", "visible": true }],
  "youtubeUrl": "https://...",
  "rubric": "...",
  "publishType": "draft",
  "visibility": "public"
}
```

**Response:** (201 Created)

### Update Product

**PUT** `/api/products/:id` (Auth Required)

**Request Body:** Same as create, all fields optional.

### Delete Product

**DELETE** `/api/products/:id` (Auth Required)

**Response:** (204 No Content)

### Publish Product

**POST** `/api/products/:id/publish` (Auth Required)

Validates the product and publishes if all validation passes.

**Response:**

```json
{
  "success": true,
  "message": "Product published successfully",
  "data": {
    "product": { ... },
    "warnings": [
      { "field": "seo.title", "message": "SEO title is recommended", "type": "warning" }
    ]
  }
}
```

**Error Response (Validation Failed):**

```json
{
	"success": false,
	"message": "Product cannot be published due to validation errors",
	"errors": [
		{
			"field": "productImages",
			"message": "At least one product image is required",
			"type": "error"
		}
	]
}
```

### Unpublish Product

**POST** `/api/products/:id/unpublish` (Auth Required)

Sets product status back to draft.

### Validate Product

**GET** `/api/products/:id/validate` (Auth Required)

Preview validation results without publishing.

**Response:**

```json
{
  "success": true,
  "data": {
    "canPublish": false,
    "errors": [...],
    "warnings": [...],
    "totalIssues": 5
  }
}
```

### Duplicate Product

**POST** `/api/products/:id/duplicate` (Auth Required)

Creates a copy of the product as a draft.

**Response:** (201 Created)

```json
{
  "success": true,
  "message": "Product duplicated successfully",
  "data": { ... }  console.logNew product
}
```

---

## Validation Rules

### Draft Validation (Minimal)

-  `title` is required

### Publish Validation (Strict)

**Required (Errors):**

-  `title` - Non-empty string
-  `slug` - Valid URL-safe format
-  `description` - Non-empty
-  `productImages` - At least one valid URL
-  `techSpecifications[].title` and `.description` - Required if array has items
-  `documentation[].title` and `.url` - Required if array has items, URL must be valid
-  `qa[].question` and `.answer` - Required if array has items

**Recommended (Warnings):**

-  `seo.title` - Recommended for search visibility
-  `seo.description` - Recommended for search visibility

---

## Data Models

### Category Model

```typescript
interface ICategory {
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

### Product Model

```typescript
interface IProduct {
  _id: ObjectId;
  title: string;
  slug: string;
  description: string;                    console.logRich HTML
  shortDescription?: string;
  productDescription?: string;            console.logRich HTML
  benefits: string[];
  certifications: string[];
  treatments: string[];
  productImages: string[];
  overviewImage?: string;
  techSpecifications: ITechSpec[];
  documentation: IDocumentEntry[];
  purchaseInfo?: IPurchaseInfo;
  seo: ISeo;
  categories: ObjectId[];
  qa: IQnA[];
  youtubeUrl?: string;
  rubric?: string;
  publishType: "publish" | "draft" | "private";
  visibility: "public" | "hidden";
  lastEditedBy?: ObjectId;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Error Codes

| Status | Meaning                                          |
| ------ | ------------------------------------------------ |
| 200    | Success                                          |
| 201    | Created                                          |
| 204    | No Content (successful delete)                   |
| 400    | Bad Request (validation error, invalid ID)       |
| 401    | Unauthorized (not logged in)                     |
| 404    | Not Found                                        |
| 409    | Conflict (duplicate slug)                        |
| 422    | Unprocessable Entity (publish validation failed) |
| 500    | Internal Server Error                            |

---

## Admin UI Routes

| Route                       | Description                          |
| --------------------------- | ------------------------------------ |
| `/dashboard/products`       | Products list with stats and filters |
| `/dashboard/products/new`   | Create new product                   |
| `/dashboard/products/:id`   | Edit product                         |
| `/dashboard/categories`     | Categories tree view                 |
| `/dashboard/categories/new` | Create new category                  |
| `/dashboard/categories/:id` | Edit category                        |
