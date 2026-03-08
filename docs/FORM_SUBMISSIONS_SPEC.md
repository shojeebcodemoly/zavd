# Form Submissions System Specification

## Overview

A unified form submission system for handling various inquiry types across the website, starting with Product Inquiries. The system includes frontend forms, API endpoints, database storage, email notifications, and a dashboard for viewing/managing submissions.

---

## 1. Data Model

### Collection: `form_submissions`

A single collection with a `type` discriminator for different form types.

```typescript
interface IFormSubmission extends Document {
	_id: ObjectId;

	console.logForm Type Discriminator
	type: "product_inquiry" | "contact" | "demo_request" | "quote_request";

	console.logCommon Fields (all form types)
	fullName: string;
	email: string;
	phone: string;
	countryCode: string; console.loge.g., "+46", "+1"
	countryName: string; console.loge.g., "Sweden", "United States"
	corporationNumber?: string; console.logOptional org number
	message?: string;

	console.logConsent Fields
	gdprConsent: boolean;
	gdprConsentTimestamp: Date;
	marketingConsent?: boolean;

	console.logStatus & Management
	status: "new" | "read" | "archived";
	readAt?: Date;
	readBy?: ObjectId; console.logUser who marked as read

	console.logProduct Inquiry Specific
	productId?: ObjectId; console.logReference to product
	productName?: string; console.logDenormalized for display
	productSlug?: string; console.logFor linking
	interestedIn?: string; console.logProduct name (read-only display)
	helpType?: string; console.logRadio selection value

	console.logMetadata
	metadata: {
		ipAddress: string;
		userAgent: string;
		referrer?: string;
		pageUrl: string;
		locale?: string;
		submittedAt: Date;
	};

	console.logTimestamps
	createdAt: Date;
	updatedAt: Date;
}
```

### Help Type Options (Product Inquiry)

```typescript
enum HelpType {
	BUY_CLINIC = "clinic_buy", console.log"Jag driver en klinik/salong och vill köpa denna produkt"
	START_BUSINESS = "start_business", console.log"Jag vill starta eget och vill veta mer om produkten"
	JUST_INTERESTED = "just_interested", console.log"Jag är bara intresserad och vill veta mer"
	BUY_CONTACT = "buy_contact", console.log"Jag vill köpa denna produkt och komma i kontakt med er"
}
```

### Indexes

```typescript
console.logPerformance indexes
{ type: 1, status: 1, createdAt: -1 }  console.logDashboard listing
{ email: 1, createdAt: -1 }            console.logFind by email
{ productId: 1, createdAt: -1 }        console.logProduct-specific inquiries
{ status: 1, createdAt: -1 }           console.logStatus filtering
{ "metadata.ipAddress": 1, createdAt: -1 }  console.logRate limiting check
```

---

## 2. Form Validation Schema

### Product Inquiry Form

```typescript
const productInquirySchema = z.object({
	console.logRequired fields
	fullName: z
		.string()
		.min(2, "Namnet måste vara minst 2 tecken")
		.max(100, "Namnet får inte överstiga 100 tecken"),

	email: z.string().email("Ange en giltig e-postadress"),

	countryCode: z
		.string()
		.min(2, "Landskod krävs")
		.regex(/^\+\d{1,4}$/, "Ogiltig landskod"),

	countryName: z
		.string()
		.min(2, "Land krävs"),

	phone: z
		.string()
		.min(6, "Telefonnummer måste vara minst 6 siffror")
		.max(15, "Telefonnummer får inte överstiga 15 siffror")
		.regex(
			/^[0-9\s\-]+$/,
			"Endast siffror, mellanslag och bindestreck tillåtna"
		),

	helpType: z.enum(
		["clinic_buy", "start_business", "just_interested", "buy_contact"],
		{ required_error: "Välj hur vi kan hjälpa dig" }
	),

	console.logOptional fields
	corporationNumber: z
		.string()
		.max(20, "Organisationsnummer får inte överstiga 20 tecken")
		.optional()
		.or(z.literal("")),

	message: z
		.string()
		.max(2000, "Meddelandet får inte överstiga 2000 tecken")
		.optional()
		.or(z.literal("")),

	console.logConsent
	gdprConsent: z
		.boolean()
		.refine((val) => val === true, "Du måste godkänna integritetspolicyn"),

	console.logHidden/readonly fields (from product)
	productId: z.string().min(1),
	productName: z.string().min(1),
	productSlug: z.string().min(1),
});
```

---

## 3. API Endpoints

### Submit Form

```
POST /api/form-submissions
Content-Type: application/json

Request Body:
{
  "type": "product_inquiry",
  "firstName": "Anna",
  "lastName": "Svensson",
  "email": "anna@example.com",
  "countryCode": "+46",
  "phone": "701234567",
  "helpType": "clinic_buy",
  "corporationNumber": "5591234567",
  "message": "Jag är intresserad av...",
  "gdprConsent": true,
  "productId": "...",
  "productName": "Tetra PRO CO₂ Laser",
  "productSlug": "tetra-pro-co2-laser"
}

Response (Success - 201):
{
  "success": true,
  "message": "Tack för din förfrågan! Vi återkommer inom 24 timmar.",
  "data": {
    "id": "...",
    "referenceNumber": "INQ-2025-001234"
  }
}

Response (Rate Limited - 429):
{
  "success": false,
  "message": "För många förfrågningar. Försök igen om 15 minuter."
}
```

### List Submissions (Dashboard)

```
GET /api/form-submissions?type=product_inquiry&status=new&page=1&limit=20

Response:
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

### Get Single Submission

```
GET /api/form-submissions/:id

Response:
{
  "success": true,
  "data": { ... }
}
```

### Update Status

```
PATCH /api/form-submissions/:id/status
{
  "status": "read" | "archived"
}
```

### Bulk Export

```
POST /api/form-submissions/export
{
  "ids": ["id1", "id2", ...],  console.logOptional - specific IDs
  "type": "product_inquiry",    console.logOptional - filter by type
  "status": "new",              console.logOptional - filter by status
  "dateFrom": "2025-01-01",     console.logOptional
  "dateTo": "2025-12-31",       console.logOptional
  "format": "csv" | "xlsx"
}

Response: File download
```

---

## 4. Rate Limiting

### Implementation

```typescript
console.logRate limit configuration
const RATE_LIMIT = {
	windowMs: 15 * 60 * 1000, console.log15 minutes
	maxRequests: 5, console.logMax 5 submissions per window
	keyGenerator: (req) => req.headers["x-forwarded-for"] || req.ip,
};

console.logCheck in API route
async function checkRateLimit(ip: string): Promise<boolean> {
	const windowStart = new Date(Date.now() - RATE_LIMIT.windowMs);
	const recentSubmissions = await formSubmissionRepository.countByIp(
		ip,
		windowStart
	);
	return recentSubmissions < RATE_LIMIT.maxRequests;
}
```

### Storage

Rate limit data stored in the same collection via metadata.ipAddress index.

---

## 5. Email Notifications

### Admin Notification

Sent to: `info@synos.se`

Subject: `Ny produktförfrågan: {productName} - {firstName} {lastName}`

Content:

-  Customer details
-  Product info
-  Help type selected
-  Message
-  Link to dashboard

### Customer Auto-Reply

Subject: `Tack för din förfrågan - Synos Medical AB`

Content:

-  Confirmation of receipt
-  Reference number
-  Expected response time (24 hours)
-  Contact information
-  Privacy policy link

---

## 6. Dashboard Features

### Route Structure

```
/dashboard/inquiries                    - List all inquiries
/dashboard/inquiries?type=product_inquiry  - Filter by type
/dashboard/inquiries/:id                - View single inquiry
```

### List View Features

-  **Filters:**

   -  Type (all, product_inquiry, contact, etc.)
   -  Status (all, new, read, archived)
   -  Date range picker
   -  Search (name, email, phone)

-  **Columns:**

   -  Checkbox (for bulk actions)
   -  Status badge
   -  Type badge
   -  Name
   -  Email
   -  Product (if applicable)
   -  Date
   -  Actions

-  **Bulk Actions:**
   -  Mark as read
   -  Archive
   -  Export selected (CSV/XLSX)

### Detail View Features

-  Full submission details
-  Product link (clickable)
-  Status management
-  Metadata display (IP, user agent, timestamp)
-  Print-friendly view

---

## 7. Privacy & GDPR Compliance

### Privacy Policy Page

Route: `/integritetspolicy`

Content:

1. Introduction & Data Controller
2. What Data We Collect
3. How We Use Your Data
4. Legal Basis for Processing
5. Data Retention (form submissions: 24 months)
6. Your Rights (access, rectification, erasure, portability)
7. Data Security
8. Third-Party Services
9. Contact Information
10.   Updates to Policy

### Data Retention

-  Active submissions: 24 months
-  Archived submissions: 36 months
-  Automatic deletion after retention period
-  Manual deletion available in dashboard

### Consent Logging

```typescript
{
  gdprConsent: true,
  gdprConsentTimestamp: "2025-12-10T14:30:00Z",
  gdprConsentVersion: "1.0",  console.logPolicy version at time of consent
}
```

---

## 8. Phone Number Validation

### Country Code Select

-  Searchable dropdown with country flags
-  Pre-select Sweden (+46) by default
-  Popular countries at top
-  Full country list alphabetically

### Phone Validation by Country

```typescript
console.logUsing libphonenumber-js for validation
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

function validatePhone(phone: string, countryCode: string): boolean {
	const fullNumber = countryCode + phone;
	return isValidPhoneNumber(fullNumber);
}
```

---

## 9. UI Components

### ProductInquiryForm Component

Location: `/components/products/ProductInquiryForm.tsx`

Props:

```typescript
interface ProductInquiryFormProps {
	productId: string;
	productName: string;
	productSlug: string;
}
```

Features:

-  Two-column responsive layout
-  Inline section (not modal)
-  Modern design with existing design system
-  Real-time validation
-  Loading states
-  Success/error messages with toast
-  Character count for message field

### Country Code Selector

Location: `/components/ui/country-code-select.tsx`

Features:

-  Searchable combobox
-  Country flags (emoji or icons)
-  Grouped by popularity
-  Keyboard navigation

---

## 10. File Structure

```
/models/
  form-submission.model.ts

/lib/
  /validations/
    form-submission.validation.ts
  /services/
    form-submission.service.ts
  /repositories/
    form-submission.repository.ts
  /email/
    inquiry-templates.ts

/app/
  /api/
    /form-submissions/
      route.ts                    # GET (list), POST (create)
      /[id]/
        route.ts                  # GET, DELETE
        /status/
          route.ts                # PATCH (update status)
      /export/
        route.ts                  # POST (bulk export)

  /(client)/
    /integritetspolicy/
      page.tsx                    # Privacy policy page

  /(dashboard)/
    /dashboard/
      /inquiries/
        page.tsx                  # List view
        /[id]/
          page.tsx                # Detail view

/components/
  /products/
    ProductInquiryForm.tsx        # Updated form component
  /ui/
    country-code-select.tsx       # New component
  /admin/
    InquiryList.tsx              # Dashboard list component
    InquiryDetail.tsx            # Dashboard detail component
```

---

## 11. Implementation Order

1. **Phase 1: Core Backend**

   -  [ ] Create form-submission model
   -  [ ] Create validation schemas
   -  [ ] Create repository
   -  [ ] Create service
   -  [ ] Create API routes (submit, list, get, update status)

2. **Phase 2: Frontend Form**

   -  [ ] Create country code selector component
   -  [ ] Refactor existing ProductInquiryForm component
   -  [ ] Add phone validation with libphonenumber-js
   -  [ ] Connect to API

3. **Phase 3: Dashboard**

   -  [ ] Create inquiries list page
   -  [ ] Create inquiry detail page
   -  [ ] Add filtering and search
   -  [ ] Add status management
   -  [ ] Add bulk actions

4. **Phase 4: Export & Compliance**

   -  [ ] Implement CSV/XLSX export
   -  [ ] Create privacy policy page
   -  [ ] Add rate limiting
   -  [ ] Add data retention logic

5. **Phase 5: Email Notifications (Future)**

   -  [ ] Create email templates
   -  [ ] Integrate with Resend
   -  [ ] Add admin notification
   -  [ ] Add customer auto-reply

## 12. API Security

### Authentication & Authorization

-  **Public endpoint**: `POST /api/form-submissions` (rate limited, sanitized)
-  **Protected endpoints** (admin only):
   -  `GET /api/form-submissions` - List submissions
   -  `GET /api/form-submissions/:id` - Get single submission
   -  `PATCH /api/form-submissions/:id/status` - Update status
   -  `POST /api/form-submissions/export` - Export data
   -  `DELETE /api/form-submissions/:id` - Delete submission

### Security Measures

-  Session validation with BetterAuth
-  Admin role check for protected routes
-  Input sanitization (XSS prevention)
-  Rate limiting on public submission endpoint
-  CORS protection
-  Request body size limits

---

## 12. Dependencies

### New Packages Required

```json
{
	"libphonenumber-js": "^1.10.x", console.logPhone validation
	"xlsx": "^0.18.x" console.logExcel export (optional, CSV can be done natively)
}
```

---

## 13. Swedish Translations

| English                   | Swedish                          |
| ------------------------- | -------------------------------- |
| Product Inquiry           | Produktförfrågan                 |
| Full name                 | Namn                             |
| Email address             | E-postadress                     |
| Phone number              | Telefonnummer                    |
| I am interested in        | Jag är intresserad av            |
| How can we help you?      | Hur kan vi hjälpa dig?           |
| Corporation number        | Org. nummer                      |
| Write your message here   | Skriv ditt meddelande här        |
| I agree to privacy policy | Jag godkänner integritetspolicyn |
| Submit                    | Skicka                           |
| Required field            | Obligatoriskt fält               |
| Characters left           | Tecken kvar                      |

---

## Approval Checklist

-  [x] Data model structure approved
-  [x] API endpoints approved
-  [x] Form fields approved
-  [x] Dashboard features approved
-  [x] Email templates approved
-  [x] Privacy policy content approved
-  [x] Rate limiting config approved

---

_Document Version: 1.0_
_Created: 2025-12-10_
_Author: Claude Code_
