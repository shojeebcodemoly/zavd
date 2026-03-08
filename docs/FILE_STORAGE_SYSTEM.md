# File Storage System Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Folder Structure](#folder-structure)
4. [Configuration](#configuration)
5. [API Endpoints](#api-endpoints)
6. [Upload Validation](#upload-validation)
7. [MIME Type Filtering](#mime-type-filtering)
8. [File Size Limits](#file-size-limits)
9. [Public URLs](#public-urls)
10.   [Security Considerations](#security-considerations)
11.   [Error Handling](#error-handling)
12.   [Best Practices](#best-practices)
13.   [Future Scaling](#future-scaling)
14.   [Frontend Usage](#frontend-usage)
15.   [Deployment Notes](#deployment-notes)

---

## Overview

This file storage system provides a simple, production-ready solution for managing file uploads within your Next.js 16 application. It leverages the Node.js runtime available in Next.js 16 API routes via `proxy.ts` for direct file system access.

### Key Features

-  **Local file storage** at project root (`/storage/images/`, `/storage/documents/`)
-  **Public file access** via direct URLs (no authentication required)
-  **Protected operations** (upload, delete, list) secured by Better Auth sessions
-  **Automatic folder creation** on application startup
-  **MIME type validation** for security
-  **File size limits** with configurable maximums
-  **UUID-based filenames** to prevent conflicts and enumeration attacks
-  **TypeScript throughout** with full type safety

### Why This Design Fits Next.js 16

Next.js 16 introduces significant improvements to API routes:

1. **Node.js Runtime Access**: API routes can use the full Node.js API including `fs`, `path`, and `crypto`
2. **Proxy.ts Pattern**: The `proxy.ts` file provides middleware-like functionality for request interception
3. **App Router**: Modern routing with RSC (React Server Components) support
4. **Streaming Support**: Native support for file streaming in responses

The `proxy.ts` file in your project ensures that protected routes are guarded at the edge, but file system operations still execute in the Node.js environment, giving us full access to `fs.promises` for file operations.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
          ▼                               ▼
┌─────────────────────┐       ┌─────────────────────┐
│   Public Access     │       │  Protected APIs     │
│   /storage/*        │       │  /api/storage/*     │
│   (Static Files)    │       │  (Upload/Delete/    │
│   No Auth Required  │       │   List)             │
└─────────────────────┘       └─────────┬───────────┘
                                        │
                              ┌─────────┴───────────┐
                              │   Better Auth       │
                              │   Session Check     │
                              └─────────┬───────────┘
                                        │
                              ┌─────────┴───────────┐
                              │   Storage Service   │
                              │   (lib/storage/)    │
                              └─────────┬───────────┘
                                        │
                              ┌─────────┴───────────┐
                              │   File System       │
                              │   /storage/         │
                              │   ├── images/       │
                              │   └── documents/    │
                              └─────────────────────┘
```

### Data Flow

1. **Upload Flow**:

   -  Client sends `FormData` with file to `/api/storage/upload`
   -  API validates session via Better Auth
   -  Service validates MIME type and file size
   -  File saved with UUID filename to appropriate folder
   -  Public URL returned to client

2. **Access Flow**:

   -  Client requests file via public URL `/storage/images/uuid.jpg`
   -  Next.js serves file statically from public folder
   -  No authentication check (public access)

3. **Delete Flow**:
   -  Client sends DELETE request to `/api/storage/delete`
   -  API validates session
   -  Service removes file from filesystem
   -  Success response returned

---

## Folder Structure

### Storage Folders (Auto-Created)

```
project-root/
├── public/
│   └── storage/           # Served statically by Next.js
│       ├── images/        # Image files (.jpg, .png, .webp, .gif)
│       └── documents/     # Document files (.pdf, .doc, .docx)
```

### Code Structure

```
lib/
└── storage/
    ├── index.ts          # Public exports
    ├── types.ts          # TypeScript interfaces
    ├── constants.ts      # Configuration constants
    ├── validation.ts     # Zod schemas
    ├── utils.ts          # Helper functions
    └── service.ts        # Core storage operations

app/
└── api/
    └── storage/
        ├── upload/
        │   └── route.ts  # POST - Upload files
        ├── delete/
        │   └── route.ts  # DELETE - Remove files
        └── list/
            └── route.ts  # GET - List files
```

---

## Configuration

### Environment Variables

No additional environment variables are required. The system uses sensible defaults that work in both development and production.

Optional configuration (add to `.env` if needed):

```env
# Optional: Custom storage path (defaults to 'public/storage')
# STORAGE_BASE_PATH=public/storage

# Optional: Custom max file size in bytes (defaults to 10MB)
# STORAGE_MAX_FILE_SIZE=10485760
```

### Constants (lib/storage/constants.ts)

```typescript
export const STORAGE_CONFIG = {
  console.logBase path relative to project root
  BASE_PATH: "public/storage",

  console.logSubdirectories
  FOLDERS: {
    IMAGES: "images",
    DOCUMENTS: "documents",
  },

  console.logFile size limits
  MAX_FILE_SIZE: 10 * 1024 * 1024,        console.log10MB default
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,         console.log5MB for images
  MAX_DOCUMENT_SIZE: 20 * 1024 * 1024,     console.log20MB for documents

  console.logAllowed MIME types
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ],

  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};
```

---

## API Endpoints

### POST /api/storage/upload

Upload one or more files.

**Authentication**: Required (Better Auth session)

**Request**:

```http
POST /api/storage/upload
Content-Type: multipart/form-data

file: <binary>
folder: "images" | "documents" (optional, auto-detected from MIME)
```

**Response (Success)**:

```json
{
	"success": true,
	"message": "File uploaded successfully",
	"data": {
		"id": "550e8400-e29b-41d4-a716-446655440000",
		"filename": "550e8400-e29b-41d4-a716-446655440000.jpg",
		"originalName": "my-photo.jpg",
		"mimeType": "image/jpeg",
		"size": 245678,
		"folder": "images",
		"url": "/storage/images/550e8400-e29b-41d4-a716-446655440000.jpg",
		"createdAt": "2025-12-08T10:30:00.000Z"
	}
}
```

**Response (Error)**:

```json
{
	"success": false,
	"message": "File type not allowed",
	"errors": {
		"mimeType": "application/x-executable",
		"allowed": ["image/jpeg", "image/png", "image/webp", "image/gif"]
	}
}
```

### DELETE /api/storage/delete

Delete a file by filename.

**Authentication**: Required (Better Auth session)

**Request**:

```http
DELETE /api/storage/delete
Content-Type: application/json

{
  "filename": "550e8400-e29b-41d4-a716-446655440000.jpg",
  "folder": "images"
}
```

**Response (Success)**:

```json
{
	"success": true,
	"message": "File deleted successfully"
}
```

### GET /api/storage/list

List files in a folder with optional pagination.

**Authentication**: Required (Better Auth session)

**Request**:

```http
GET /api/storage/list?folder=images&page=1&limit=20
```

**Response**:

```json
{
	"success": true,
	"message": "Files retrieved successfully",
	"data": [
		{
			"filename": "550e8400-e29b-41d4-a716-446655440000.jpg",
			"originalName": null,
			"mimeType": "image/jpeg",
			"size": 245678,
			"folder": "images",
			"url": "/storage/images/550e8400-e29b-41d4-a716-446655440000.jpg",
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

## Upload Validation

Files are validated at multiple levels:

### 1. Client-Side (Optional)

-  File type preview validation
-  Size check before upload
-  User feedback before network request

### 2. Server-Side (Required)

-  **MIME Type Validation**: File's actual MIME type is verified
-  **Magic Bytes Check**: First bytes of file are inspected to prevent MIME spoofing
-  **Size Validation**: File size checked against limits
-  **Filename Sanitization**: Original filename sanitized, stored file uses UUID

### Validation Flow

```typescript
console.logValidation order in service
1. Check file exists in request
2. Validate MIME type against whitelist
3. Validate magic bytes match declared MIME
4. Check file size against limit for type
5. Generate UUID filename
6. Save to appropriate folder
```

---

## MIME Type Filtering

### Allowed Image Types

| MIME Type  | Extension  | Max Size |
| ---------- | ---------- | -------- |
| image/jpeg | .jpg/.jpeg | 5MB      |
| image/png  | .png       | 5MB      |
| image/webp | .webp      | 5MB      |
| image/gif  | .gif       | 5MB      |

### Allowed Document Types

| MIME Type                                                               | Extension | Max Size |
| ----------------------------------------------------------------------- | --------- | -------- |
| application/pdf                                                         | .pdf      | 20MB     |
| application/msword                                                      | .doc      | 20MB     |
| application/vnd.openxmlformats-officedocument.wordprocessingml.document | .docx     | 20MB     |

### Magic Bytes Verification

To prevent MIME type spoofing, we verify the file's magic bytes:

```typescript
const MAGIC_BYTES = {
  "image/jpeg": [0xFF, 0xD8, 0xFF],
  "image/png": [0x89, 0x50, 0x4E, 0x47],
  "image/gif": [0x47, 0x49, 0x46],
  "image/webp": [0x52, 0x49, 0x46, 0x46], console.logRIFF
  "application/pdf": [0x25, 0x50, 0x44, 0x46], console.log%PDF
};
```

---

## File Size Limits

| Category  | Default Limit | Configurable |
| --------- | ------------- | ------------ |
| Images    | 5 MB          | Yes          |
| Documents | 20 MB         | Yes          |
| Any file  | 10 MB         | Yes          |

### Per-Request Limits

The Next.js 16 API route configuration includes body size limits:

```typescript
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb', console.logAllow for base64 overhead
    },
  },
};
```

---

## Public URLs

After upload, files are accessible at:

```
https://yourdomain.com/storage/{folder}/{filename}
```

### Examples

```
https://synos.se/storage/images/550e8400-e29b-41d4-a716-446655440000.jpg
https://synos.se/storage/documents/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf
```

### URL Generation

```typescript
console.logService generates URL
const url = `/storage/${folder}/${filename}`;

console.logFull URL (for API responses)
const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/storage/${folder}/${filename}`;
```

---

## Security Considerations

### 1. Authentication

-  All mutating operations (upload, delete) require valid Better Auth session
-  Session validated server-side via `auth.api.getSession()`
-  No client-side tokens or API keys exposed

### 2. File Validation

-  **MIME whitelist**: Only explicitly allowed types accepted
-  **Magic bytes verification**: Prevents MIME spoofing attacks
-  **No execution**: Storage folder configured without execute permissions

### 3. Filename Security

-  **UUID filenames**: Prevents directory traversal attacks
-  **No user-provided paths**: Folder parameter is enum-validated
-  **Original name sanitization**: Stored in metadata only

### 4. Path Traversal Prevention

```typescript
console.logGOOD - Safe path construction
const safePath = path.join(STORAGE_BASE, folder, filename);

console.logVerification
if (!safePath.startsWith(path.resolve(STORAGE_BASE))) {
  throw new Error("Invalid path");
}
```

### 5. Rate Limiting (Recommended)

Consider adding rate limiting for production:

```typescript
console.logFuture enhancement: Rate limit uploads per user/IP
console.logRecommended: 10 uploads per minute per user
```

### 6. Virus Scanning (Production Consideration)

For high-security environments, integrate with ClamAV or similar:

```typescript
console.logOptional: Virus scanning before saving
console.logawait scanFile(buffer);
```

---

## Error Handling

### Error Types

| Error Code          | HTTP Status | Description              |
| ------------------- | ----------- | ------------------------ |
| `FILE_REQUIRED`     | 400         | No file in request       |
| `INVALID_MIME_TYPE` | 400         | File type not allowed    |
| `FILE_TOO_LARGE`    | 400         | Exceeds size limit       |
| `INVALID_FOLDER`    | 400         | Invalid folder parameter |
| `UNAUTHORIZED`      | 401         | No valid session         |
| `FILE_NOT_FOUND`    | 404         | File doesn't exist       |
| `STORAGE_ERROR`     | 500         | Filesystem error         |

### Error Response Format

```json
{
	"success": false,
	"message": "Human readable message",
	"errors": {
		"field": "value",
		"details": "Additional info"
	}
}
```

---

## Best Practices

### 1. Upload Handling

```typescript
console.logAlways use try-catch with specific error handling
try {
  const result = await storageService.upload(file, folder);
  return createdResponse(result);
} catch (error) {
  if (error instanceof StorageError) {
    return badRequestResponse(error.message, error.details);
  }
  throw error;
}
```

### 2. Cleanup Failed Uploads

```typescript
console.logIf subsequent operations fail, clean up uploaded file
try {
  const file = await storageService.upload(file);
  await saveToDatabase(file.url); console.logIf this fails...
} catch (error) {
  await storageService.delete(file.filename, file.folder); console.log...clean up
  throw error;
}
```

### 3. Image Optimization (Optional)

```typescript
console.logConsider using sharp for image optimization
import sharp from 'sharp';

const optimized = await sharp(buffer)
  .resize(1920, 1080, { fit: 'inside' })
  .jpeg({ quality: 80 })
  .toBuffer();
```

### 4. Batch Operations

```typescript
console.logFor multiple file uploads, process in parallel
const results = await Promise.all(
  files.map(file => storageService.upload(file))
);
```

---

## Future Scaling

### Storage Adapter Architecture

While this implementation uses local filesystem storage, the architecture supports future abstraction to cloud providers without migration:

```typescript
console.logFuture: Storage adapter interface
interface StorageAdapter {
  upload(file: Buffer, filename: string, folder: string): Promise<StorageFile>;
  delete(filename: string, folder: string): Promise<void>;
  list(folder: string, options?: ListOptions): Promise<StorageFile[]>;
  getUrl(filename: string, folder: string): string;
}

console.logImplementations
class LocalStorageAdapter implements StorageAdapter { ... }
class S3StorageAdapter implements StorageAdapter { ... }
class CloudflareR2Adapter implements StorageAdapter { ... }
```

### Migration Path

1. **Phase 1** (Current): Local storage with public folder
2. **Phase 2**: Add adapter interface, keep local implementation
3. **Phase 3**: Add cloud adapter, use env to switch
4. **Phase 4**: Migrate existing files, switch to cloud

### CDN Integration

When scaling, consider:

```typescript
console.logFuture: CDN URL generation
const cdnUrl = process.env.CDN_URL
  ? `${process.env.CDN_URL}/storage/${folder}/${filename}`
  : `/storage/${folder}/${filename}`;
```

---

## Frontend Usage

### Upload Component Example

```tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";

export function FileUploader({ folder = "images" }: { folder?: string }) {
	const [uploading, setUploading] = useState(false);

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("folder", folder);

		try {
			const res = await fetch("/api/storage/upload", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message);
			}

			toast.success("File uploaded successfully");
			return data.data;
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Upload failed");
		} finally {
			setUploading(false);
		}
	};

	return <input type="file" onChange={handleUpload} disabled={uploading} />;
}
```

### Using Uploaded URLs

```tsx
console.logAfter upload, use the URL directly
<img src={uploadedFile.url} alt="Uploaded image" />

console.logOr with Next.js Image (add domain to next.config.ts)
import Image from "next/image";
<Image src={uploadedFile.url} width={200} height={200} alt="..." />
```

---

## Deployment Notes

### VPS Deployment

1. **Create storage directories** (auto-handled by bootstrap):

   ```bash
   mkdir -p public/storage/images public/storage/documents
   ```

2. **Set permissions**:

   ```bash
   chmod 755 public/storage
   chmod 755 public/storage/images
   chmod 755 public/storage/documents
   ```

3. **Persist storage volume** (Docker):
   ```yaml
   volumes:
      - ./public/storage:/app/public/storage
   ```

### Nginx Configuration (Production)

When using Nginx as reverse proxy:

```nginx
# Serve storage files directly (optional optimization)
location /storage/ {
    alias /var/www/synos/public/storage/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# Proxy API requests to Next.js
location /api/ {
    proxy_pass http://localhost:3000;
    # ... other proxy settings
}
```

### Backup Strategy

```bash
# Backup storage folder
tar -czf storage-backup-$(date +%Y%m%d).tar.gz public/storage/

# Restore
tar -xzf storage-backup-20251208.tar.gz -C ./
```

---

## Summary

This file storage system provides:

-  Simple, maintainable code following your project patterns
-  Secure file handling with multiple validation layers
-  Public access for files, protected access for operations
-  Full TypeScript support with proper types
-  Easy deployment with automatic folder creation
-  Clear path for future scaling without migration pain

The implementation respects your existing architecture:

-  Uses Better Auth for session validation
-  Follows repository/service patterns
-  Uses Zod for validation
-  Follows your response helper conventions
-  Integrates with your logging system
