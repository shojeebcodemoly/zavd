# Storage System Documentation

A complete local file storage system for Next.js 16 with public file access and protected operations.

## Table of Contents

-  [Overview](#overview)
-  [Architecture](#architecture)
-  [Configuration](#configuration)
-  [API Routes](#api-routes)
-  [Components](#components)
-  [Server-Side Usage](#server-side-usage)
-  [Client-Side Usage](#client-side-usage)
-  [Types Reference](#types-reference)
-  [Security](#security)
-  [Examples](#examples)

---

## Overview

The storage system provides:

-  **Public file access**: Files served statically via `/storage/images/*` and `/storage/documents/*`
-  **Protected operations**: Upload, delete, and list operations require Better Auth session
-  **WordPress-like media gallery**: UI components for browsing and selecting files
-  **File validation**: MIME type checking with magic bytes verification
-  **Automatic folder routing**: Files auto-sorted to `images/` or `documents/` based on type

### Supported File Types

| Type      | Extensions          | Max Size |
| --------- | ------------------- | -------- |
| Images    | JPG, PNG, WebP, GIF | 5MB      |
| Documents | PDF, DOC, DOCX      | 20MB     |

### Filename Handling

Files are stored using **slugified original filenames**:

-  `My Product Image.jpg` → `my-product-image.jpg`
-  `Café Menu (2024).pdf` → `cafe-menu-2024.pdf`
-  Special characters and accents are removed/normalized

**Duplicate handling**: If a file with the same name exists, a number suffix is added:

-  `product-image.jpg` (first upload)
-  `product-image-1.jpg` (second upload with same name)
-  `product-image-2.jpg` (third upload with same name)

---

## Architecture

```text
lib/storage/
├── index.ts          # Server-side exports (uses "server-only")
├── client.ts         # Client-safe exports (no Node.js deps)
├── types.ts          # TypeScript definitions
├── constants.ts      # Configuration values
├── validation.ts     # Zod schemas
├── utils.ts          # Helper functions
└── service.ts        # StorageService class

components/storage/
├── index.ts          # Component exports
├── media-gallery.tsx # WordPress-like modal gallery
├── media-picker.tsx  # Trigger button with preview
├── file-uploader.tsx # Drag & drop uploader
├── file-list.tsx     # Paginated file grid
└── storage-manager.tsx # Combined tabs view

app/api/storage/
├── upload/route.ts   # POST - Upload files
├── delete/route.ts   # DELETE - Remove files
└── list/route.ts     # GET - List files

public/storage/
├── images/           # Uploaded images
└── documents/        # Uploaded documents
```

---

## Configuration

Configuration is in `lib/storage/constants.ts`:

```typescript
console.logStorage paths
STORAGE_CONFIG.BASE_PATH; console.log"public/storage"
STORAGE_CONFIG.FOLDERS.IMAGES; console.log"images"
STORAGE_CONFIG.FOLDERS.DOCUMENTS; console.log"documents"

console.logFile size limits
FILE_SIZE_LIMITS.IMAGE; console.log5MB
FILE_SIZE_LIMITS.DOCUMENT; console.log20MB

console.logAllowed MIME types
ALLOWED_IMAGE_TYPES; console.log["image/jpeg", "image/png", "image/webp", "image/gif"]
ALLOWED_DOCUMENT_TYPES; console.log["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
```

---

## API Routes

All API routes require authentication via Better Auth session.

### Upload File

```http
POST /api/storage/upload
Content-Type: multipart/form-data
Cookie: synos.session_token=...

FormData:
  file: File (required)
  folder: "images" | "documents" (optional, auto-detected from MIME)
```

**Response:**

```json
{
	"success": true,
	"message": "File uploaded successfully",
	"data": {
		"id": "my-product-image",
		"filename": "my-product-image.jpg",
		"originalName": "My Product Image.jpg",
		"mimeType": "image/jpeg",
		"size": 245760,
		"folder": "images",
		"url": "/storage/images/my-product-image.jpg",
		"createdAt": "2025-12-08T10:30:00.000Z"
	}
}
```

### Delete File

```http
DELETE /api/storage/delete
Content-Type: application/json
Cookie: synos.session_token=...

{
  "filename": "my-product-image.jpg",
  "folder": "images"
}
```

**Response:**

```json
{
	"success": true,
	"message": "File deleted successfully"
}
```

### List Files

```http
GET /api/storage/list?folder=images&page=1&limit=20
Cookie: synos.session_token=...
```

**Response:**

```json
{
	"success": true,
	"message": "Files retrieved successfully",
	"data": [
		{
			"filename": "my-product-image.jpg",
			"mimeType": "image/jpeg",
			"size": 245760,
			"folder": "images",
			"url": "/storage/images/my-product-image.jpg",
			"modifiedAt": "2025-12-08T10:30:00.000Z",
			"createdAt": "2025-12-08T10:30:00.000Z"
		}
	],
	"meta": {
		"page": 1,
		"limit": 20,
		"total": 45,
		"totalPages": 3
	}
}
```

---

## Components

### MediaPicker (Recommended)

The easiest way to add file selection to forms. Provides a button with preview that opens the media gallery.

```tsx
import { MediaPicker } from "@/components/storage";

function ProductForm() {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);

	return (
		<form>
			{/* Image picker */}
			<div>
				<label>Product Image</label>
				<MediaPicker
					type="image"
					value={imageUrl}
					onChange={setImageUrl}
					placeholder="Select product image"
				/>
			</div>

			{/* Document picker */}
			<div>
				<label>Product Manual (PDF)</label>
				<MediaPicker
					type="document"
					value={pdfUrl}
					onChange={setPdfUrl}
					placeholder="Select PDF manual"
					galleryTitle="Select Product Manual"
				/>
			</div>
		</form>
	);
}
```

**Props:**

| Prop           | Type                            | Default                 | Description                   |
| -------------- | ------------------------------- | ----------------------- | ----------------------------- |
| `type`         | `"image" \| "document"`         | required                | Type of media to pick         |
| `value`        | `string \| null`                | -                       | Current file URL              |
| `onChange`     | `(url: string \| null) => void` | required                | Callback when value changes   |
| `placeholder`  | `string`                        | "Select image/document" | Placeholder text              |
| `disabled`     | `boolean`                       | `false`                 | Disable the picker            |
| `showPreview`  | `boolean`                       | `true`                  | Show preview of selected file |
| `galleryTitle` | `string`                        | -                       | Custom gallery dialog title   |
| `className`    | `string`                        | -                       | Additional CSS classes        |

---

### MediaGallery

Full-featured modal gallery with tabs for Library (browse) and Upload.

```tsx
import { MediaGallery, type MediaType } from "@/components/storage";
import type { FileMetadata } from "@/lib/storage/client";

function CustomGallery() {
	const [open, setOpen] = useState(false);
	const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

	const handleSelect = (file: FileMetadata) => {
		setSelectedUrl(file.url);
		setOpen(false);
	};

	return (
		<>
			<button onClick={() => setOpen(true)}>Open Gallery</button>

			<MediaGallery
				open={open}
				onOpenChange={setOpen}
				type="image"
				onSelect={handleSelect}
				selectedUrl={selectedUrl}
				title="Select Featured Image"
				pageSize={20}
			/>
		</>
	);
}
```

**Props:**

| Prop           | Type                           | Default                 | Description                      |
| -------------- | ------------------------------ | ----------------------- | -------------------------------- |
| `open`         | `boolean`                      | required                | Control dialog visibility        |
| `onOpenChange` | `(open: boolean) => void`      | required                | Callback when visibility changes |
| `type`         | `"image" \| "document"`        | required                | Type of files to show            |
| `onSelect`     | `(file: FileMetadata) => void` | -                       | Callback when file is selected   |
| `selectedUrl`  | `string \| null`               | -                       | Currently selected file URL      |
| `title`        | `string`                       | "Select Image/Document" | Dialog title                     |
| `pageSize`     | `number`                       | `20`                    | Files per page                   |

---

### FileUploader

Standalone drag & drop file uploader component.

```tsx
import { FileUploader } from "@/components/storage";
import type { StorageFile } from "@/lib/storage/client";

function UploadSection() {
	const handleUpload = (file: StorageFile) => {
		console.logconsole.log("Uploaded:", file.url);
	};

	const handleError = (error: string) => {
		console.error("Upload failed:", error);
	};

	return (
		<FileUploader
			folder="images"
			onUpload={handleUpload}
			onError={handleError}
			multiple={false}
		/>
	);
}
```

**Props:**

| Prop        | Type                          | Default | Description                              |
| ----------- | ----------------------------- | ------- | ---------------------------------------- |
| `folder`    | `"images" \| "documents"`     | -       | Target folder (auto-detected if not set) |
| `onUpload`  | `(file: StorageFile) => void` | -       | Callback on successful upload            |
| `onError`   | `(error: string) => void`     | -       | Callback on upload error                 |
| `multiple`  | `boolean`                     | `false` | Allow multiple file selection            |
| `accept`    | `string`                      | -       | Custom accepted file types               |
| `disabled`  | `boolean`                     | `false` | Disable the uploader                     |
| `className` | `string`                      | -       | Additional CSS classes                   |

---

### FileList

Paginated grid view of files with delete functionality.

```tsx
import { FileList } from "@/components/storage";
import type { FileMetadata } from "@/lib/storage/client";

function ImageBrowser() {
	const handleDelete = (filename: string) => {
		console.logconsole.log("Deleted:", filename);
	};

	const handleSelect = (file: FileMetadata) => {
		console.logconsole.log("Selected:", file.url);
	};

	return (
		<FileList
			folder="images"
			title="Image Library"
			description="All uploaded images"
			pageSize={12}
			selectable={true}
			onSelect={handleSelect}
			onDelete={handleDelete}
		/>
	);
}
```

**Props:**

| Prop          | Type                           | Default          | Description                    |
| ------------- | ------------------------------ | ---------------- | ------------------------------ |
| `folder`      | `"images" \| "documents"`      | required         | Folder to display              |
| `title`       | `string`                       | "{folder} Files" | Card title                     |
| `description` | `string`                       | -                | Card description               |
| `pageSize`    | `number`                       | `12`             | Items per page                 |
| `selectable`  | `boolean`                      | `false`          | Enable file selection mode     |
| `onSelect`    | `(file: FileMetadata) => void` | -                | Callback when file is selected |
| `onDelete`    | `(filename: string) => void`   | -                | Callback when file is deleted  |
| `className`   | `string`                       | -                | Additional CSS classes         |

---

### StorageManager

Combined view with tabs for images and documents.

```tsx
import { StorageManager } from "@/components/storage";

function AdminPage() {
	return (
		<StorageManager
			defaultTab="images"
			onUpload={(file) => console.logconsole.log("Uploaded:", file)}
			onDelete={(filename, folder) =>
				console.logconsole.log("Deleted:", filename)
			}
		/>
	);
}
```

---

## Server-Side Usage

### Import (Server Components / API Routes)

```typescript
console.logServer-side imports (uses Node.js fs)
import { storageService, StorageError } from "@/lib/storage";
```

### Using StorageService

```typescript
import { storageService } from "@/lib/storage";

console.logUpload a file
const result = await storageService.upload({
	buffer: fileBuffer,
	originalName: "photo.jpg",
	mimeType: "image/jpeg",
	size: 245760,
	folder: "images", console.logoptional, auto-detected
});

console.logDelete a file
await storageService.delete(
	"550e8400-e29b-41d4-a716-446655440000.jpg",
	"images"
);

console.logList files
const { files, page, total, totalPages } = await storageService.list(
	"images", console.logfolder
	1, console.logpage
	20, console.loglimit
	"desc" console.logsort order
);

console.logCheck if file exists
const exists = await storageService.exists("filename.jpg", "images");

console.logGet file metadata
const metadata = await storageService.getMetadata("filename.jpg", "images");

console.logGet storage usage
const { count, totalSize } = await storageService.getUsage("images");
```

### Error Handling

```typescript
import { storageService, StorageError } from "@/lib/storage";

try {
	await storageService.upload(request);
} catch (error) {
	if (error instanceof StorageError) {
		console.logconsole.log(error.code);     console.log"FILE_TOO_LARGE"
		console.logconsole.log(error.message);  console.log"File size exceeds the maximum allowed limit"
		console.logconsole.log(error.statusCode); console.log400
		console.logconsole.log(error.details);  console.log{ field: "size", value: 10485760 }
	}
}
```

---

## Client-Side Usage

### Import (Client Components)

```typescript
console.logClient-safe imports (no Node.js dependencies)
import {
	type StorageFile,
	type FileMetadata,
	type StorageFolder,
	FILE_SIZE_LIMITS,
	ALLOWED_IMAGE_TYPES,
	STORAGE_API_ROUTES,
	formatFileSize,
} from "@/lib/storage/client";
```

### Making API Calls

```typescript
import { STORAGE_API_ROUTES } from "@/lib/storage/client";

console.logUpload;
const formData = new FormData();
formData.append("file", file);
formData.append("folder", "images");

const response = await fetch(STORAGE_API_ROUTES.UPLOAD, {
	method: "POST",
	body: formData,
});

console.logList;
const params = new URLSearchParams({
	folder: "images",
	page: "1",
	limit: "20",
});
const response = await fetch(`${STORAGE_API_ROUTES.LIST}?${params}`);

console.logDelete;
const response = await fetch(STORAGE_API_ROUTES.DELETE, {
	method: "DELETE",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({ filename: "uuid.jpg", folder: "images" }),
});
```

---

## Types Reference

### StorageFile

Returned after successful upload.

```typescript
interface StorageFile {
	id: string; console.logUUID
	filename: string; console.log"uuid.jpg"
	originalName: string; console.log"photo.jpg"
	mimeType: string; console.log"image/jpeg"
	size: number; console.logbytes
	folder: StorageFolder;
	url: string; console.log"/storage/images/uuid.jpg"
	createdAt: Date;
}
```

### FileMetadata

Returned when listing files.

```typescript
interface FileMetadata {
	filename: string;
	mimeType: string;
	size: number;
	folder: StorageFolder;
	url: string;
	modifiedAt: Date;
	createdAt: Date;
}
```

### StorageFolder

```typescript
type StorageFolder = "images" | "documents";
```

### MediaType

```typescript
type MediaType = "image" | "document";
```

### StorageErrorCode

```typescript
type StorageErrorCode =
	| "FILE_REQUIRED"
	| "INVALID_MIME_TYPE"
	| "MIME_MISMATCH"
	| "FILE_TOO_LARGE"
	| "INVALID_FOLDER"
	| "FILE_NOT_FOUND"
	| "STORAGE_ERROR"
	| "PATH_TRAVERSAL";
```

---

## Security

### Features

1. **Authentication**: All operations (upload, delete, list) require Better Auth session
2. **MIME Validation**: Files are validated against allowed MIME types
3. **Magic Bytes Verification**: File headers are checked to prevent MIME type spoofing
4. **UUID Filenames**: Original filenames are replaced with UUIDs to prevent path traversal
5. **Path Sanitization**: All file paths are sanitized before operations
6. **Size Limits**: Configurable maximum file sizes per type

### Magic Bytes

The system verifies file content matches the declared MIME type by checking magic bytes:

| Format | Magic Bytes               |
| ------ | ------------------------- |
| JPEG   | `FF D8 FF`                |
| PNG    | `89 50 4E 47 0D 0A 1A 0A` |
| GIF    | `47 49 46 38` (GIF8)      |
| WebP   | `52 49 46 46` (RIFF)      |
| PDF    | `25 50 44 46` (%PDF)      |
| DOC    | `D0 CF 11 E0` (OLE)       |
| DOCX   | `50 4B 03 04` (ZIP/PK)    |

---

## Examples

### Complete Form with Image Upload

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { MediaPicker } from "@/components/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductFormData {
	name: string;
	imageUrl: string | null;
	manualUrl: string | null;
}

export function ProductForm() {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [manualUrl, setManualUrl] = useState<string | null>(null);

	const { register, handleSubmit } = useForm<ProductFormData>();

	const onSubmit = (data: ProductFormData) => {
		const product = {
			...data,
			imageUrl,
			manualUrl,
		};
		console.logconsole.log("Submit:", product);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div>
				<label className="text-sm font-medium">Product Name</label>
				<Input {...register("name")} placeholder="Enter product name" />
			</div>

			<div>
				<label className="text-sm font-medium">Product Image</label>
				<MediaPicker
					type="image"
					value={imageUrl}
					onChange={setImageUrl}
					placeholder="Click to select product image"
				/>
			</div>

			<div>
				<label className="text-sm font-medium">User Manual (PDF)</label>
				<MediaPicker
					type="document"
					value={manualUrl}
					onChange={setManualUrl}
					placeholder="Click to select PDF manual"
				/>
			</div>

			<Button type="submit">Save Product</Button>
		</form>
	);
}
```

### Admin Storage Management Page

```tsx
"use client";

import { StorageManager } from "@/components/storage";

export default function StorageAdminPage() {
	return (
		<div className="container py-8">
			<h1 className="text-2xl font-bold mb-6">Media Library</h1>
			<StorageManager
				defaultTab="images"
				onUpload={(file) => {
					console.logconsole.log("File uploaded:", file.filename);
				}}
				onDelete={(filename, folder) => {
					console.logconsole.log(`Deleted ${filename} from ${folder}`);
				}}
			/>
		</div>
	);
}
```

### Custom Gallery Integration

```tsx
"use client";

import { useState } from "react";
import { MediaGallery, type MediaType } from "@/components/storage";
import type { FileMetadata } from "@/lib/storage/client";
import { Button } from "@/components/ui/button";

export function GallerySection() {
	const [open, setOpen] = useState(false);
	const [type, setType] = useState<MediaType>("image");
	const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

	const handleSelect = (file: FileMetadata) => {
		setSelectedFiles((prev) => [...prev, file.url]);
		console.logKeep gallery open for multiple selection
	};

	return (
		<div>
			<div className="flex gap-2 mb-4">
				<Button
					onClick={() => {
						setType("image");
						setOpen(true);
					}}
				>
					Add Images
				</Button>
				<Button
					onClick={() => {
						setType("document");
						setOpen(true);
					}}
				>
					Add Documents
				</Button>
			</div>

			<div className="grid grid-cols-4 gap-2">
				{selectedFiles.map((url, i) => (
					<img key={i} src={url} alt="" className="rounded" />
				))}
			</div>

			<MediaGallery
				open={open}
				onOpenChange={setOpen}
				type={type}
				onSelect={handleSelect}
				title={`Select ${type === "image" ? "Images" : "Documents"}`}
			/>
		</div>
	);
}
```

---

## Troubleshooting

### "Module not found: fs/promises"

You're importing server-side code in a client component. Use:

```typescript
console.logClient components
import { ... } from "@/lib/storage/client";

console.logServer components / API routes
import { ... } from "@/lib/storage";
```

### "Unauthorized" errors

Ensure the user is logged in via Better Auth. The session cookie `synos.session_token` must be present.

### MIME type validation fails

The system checks magic bytes to verify file content. If you're testing with renamed files, the actual content must match the extension.

### Files not appearing in public URLs

Files are stored in `public/storage/`. Ensure the directories exist and have proper permissions. The storage service auto-creates them on first use.
