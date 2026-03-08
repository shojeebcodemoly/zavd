# Contact Form Implementation Guide

## Overview

The contact form is a fully functional, production-ready implementation with:

-  ✅ Form validation using Zod
-  ✅ React Hook Form for state management
-  ✅ Email sending via Resend API
-  ✅ Auto-reply to customers
-  ✅ GDPR compliance with consent checkboxes
-  ✅ Google Maps integration for office locations
-  ✅ Responsive design
-  ✅ Accessibility features
-  ✅ Swedish language throughout

---

## Files Created

### 1. **Validation Schema**

`lib/validations/contact.ts`

-  Zod schema for form validation
-  Swedish error messages
-  GDPR consent validation
-  Phone number regex validation

### 2. **Email Templates**

`lib/email/templates.ts`

-  HTML and plain text email templates
-  Contact notification email (to company)
-  Auto-reply email (to customer)
-  Professional styling with Synos branding

### 3. **Contact Form Component**

`components/forms/contact-form.tsx`

-  Client component with React Hook Form
-  Real-time validation
-  Loading states
-  Success/error messages
-  GDPR and marketing consent checkboxes

### 4. **API Route**

`app/api/contact/route.ts`

-  POST endpoint for form submissions
-  Validation using Zod
-  Email sending with Resend
-  Error handling
-  Development mode support (works without API key)

### 5. **Google Maps Component**

`components/shared/google-map.tsx`

-  Embedded Google Maps
-  Fallback for missing API key
-  Link to open in Google Maps app

### 6. **Contact Page**

`app/kontakt/page.tsx`

-  Complete contact page layout
-  Contact information cards
-  Contact form
-  Office locations with maps
-  FAQ section
-  SEO metadata

---

## Setup Instructions

### 1. **Environment Variables**

Create or update `.env.local`:

```bash
# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_here

# Google Maps (Optional)
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_api_key_here
```

### 2. **Get Resend API Key**

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (synos.se)
3. Create an API key
4. Add to `.env.local`

**Domain Verification:**

-  Add DNS records provided by Resend
-  Verify domain ownership
-  Update `from` addresses in `app/api/contact/route.ts` to use your verified domain

### 3. **Get Google Maps API Key** (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Maps Embed API
4. Create credentials (API Key)
5. Restrict API key to your domain
6. Add to `.env.local`

---

## How It Works

### Form Submission Flow

```
1. User fills out form
   ↓
2. Client-side validation (Zod)
   ↓
3. POST to /api/contact
   ↓
4. Server-side validation
   ↓
5. Send email to company (info@synos.se)
   ↓
6. Send auto-reply to customer
   ↓
7. Return success response
   ↓
8. Show success message to user
```

### Development Mode

The form works **without** Resend API key:

-  Form submissions are logged to console
-  No emails are sent
-  Success message is still shown
-  Perfect for testing and development

### Production Mode

With Resend API key configured:

-  Emails are sent to `info@synos.se`
-  Auto-reply sent to customer
-  Email IDs logged for tracking
-  Full error handling

---

## Form Fields

| Field             | Type     | Required | Validation                     |
| ----------------- | -------- | -------- | ------------------------------ |
| Name              | Text     | Yes      | 2-100 characters               |
| Email             | Email    | Yes      | Valid email format             |
| Phone             | Tel      | Yes      | 10-20 characters, numbers only |
| Company           | Text     | No       | Max 100 characters             |
| Subject           | Text     | Yes      | 3-200 characters               |
| Message           | Textarea | Yes      | 10-2000 characters             |
| GDPR Consent      | Checkbox | Yes      | Must be checked                |
| Marketing Consent | Checkbox | No       | Optional                       |

---

## Email Templates

### Company Notification Email

Sent to: `info@synos.se`

Contains:

-  Customer name
-  Email address (clickable)
-  Phone number (clickable)
-  Company (if provided)
-  Subject
-  Message
-  GDPR consent status
-  Marketing consent status
-  Timestamp

### Auto-Reply Email

Sent to: Customer's email

Contains:

-  Personalized greeting
-  Confirmation message
-  Opening hours
-  Contact information
-  Company details
-  Professional branding

---

## Customization

### Change Email Recipients

Edit `app/api/contact/route.ts`:

```typescript
const companyEmailResult = await resend.emails.send({
	from: "Synos Medical Kontaktformulär <noreply@synos.se>",
	to: "your-email@synos.se", console.logChange this
	console.log...
});
```

### Modify Form Fields

1. Update schema in `lib/validations/contact.ts`
2. Update form in `components/forms/contact-form.tsx`
3. Update email template in `lib/email/templates.ts`

### Change Email Styling

Edit `lib/email/templates.ts`:

-  Modify HTML structure
-  Update CSS styles
-  Change colors, fonts, layout

---

## GDPR Compliance

### Required Consent

The form includes a **required** GDPR consent checkbox:

-  User must explicitly agree to data processing
-  Links to privacy policy
-  Cannot submit without consent

### Optional Marketing Consent

Separate checkbox for marketing:

-  Not required to submit form
-  Clearly labeled as optional
-  Can be used for newsletter signup

### Data Processing

The form collects:

-  Personal information (name, email, phone)
-  Company information (optional)
-  Message content
-  Consent preferences

Data is:

-  Sent via email to company
-  Not stored in database (stateless)
-  Processed according to GDPR requirements

---

## Testing

### Test Form Locally

1. Start dev server: `pnpm dev`
2. Navigate to: `http://localhost:3000/kontakt`
3. Fill out form
4. Submit
5. Check console for logged data

### Test with Resend

1. Add `RESEND_API_KEY` to `.env.local`
2. Restart dev server
3. Submit form
4. Check email inbox
5. Verify both emails received

### Test Validation

Try submitting with:

-  Empty fields → Should show errors
-  Invalid email → Should show error
-  Invalid phone → Should show error
-  Without GDPR consent → Should show error
-  Valid data → Should succeed

---

## Troubleshooting

### Emails Not Sending

**Check:**

1. `RESEND_API_KEY` is set in `.env.local`
2. Domain is verified in Resend dashboard
3. `from` address uses verified domain
4. Check Resend dashboard for logs
5. Check server console for errors

### Form Not Submitting

**Check:**

1. Browser console for errors
2. Network tab for API response
3. Server console for validation errors
4. Form validation messages

### Maps Not Loading

**Check:**

1. `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is set
2. Maps Embed API is enabled
3. API key is not restricted too much
4. Check browser console for errors

---

## Security

### API Key Protection

-  `RESEND_API_KEY` is server-side only (no `NEXT_PUBLIC_` prefix)
-  Never exposed to client
-  Stored in `.env.local` (gitignored)

### Input Validation

-  Client-side validation with Zod
-  Server-side validation with Zod
-  Prevents malicious input
-  Sanitizes data before sending

### Rate Limiting

Consider adding rate limiting in production:

-  Limit submissions per IP
-  Prevent spam
-  Use middleware or Vercel Edge Config

---

## Analytics Integration

### Track Form Submissions

The API route includes a comment for Facebook Pixel tracking:

```typescript
console.logTrack with Facebook Pixel (if needed)
console.logconsole.log("Contact form conversion - track with FB Pixel");
```

To implement:

1. Add Facebook Pixel event in client component
2. Track successful submissions
3. Use for conversion tracking

### Google Analytics

Track form events:

-  Form view
-  Form start
-  Form submission
-  Form errors

---

## Production Checklist

Before deploying:

-  [ ] Add `RESEND_API_KEY` to production environment
-  [ ] Verify domain in Resend
-  [ ] Update `from` email addresses
-  [ ] Test email delivery
-  [ ] Add `NEXT_PUBLIC_GOOGLE_MAPS_KEY` (optional)
-  [ ] Test form submission
-  [ ] Test validation
-  [ ] Test GDPR compliance
-  [ ] Check mobile responsiveness
-  [ ] Test accessibility
-  [ ] Add rate limiting (recommended)
-  [ ] Set up email monitoring
-  [ ] Configure error tracking

---

## Future Enhancements

Potential improvements:

-  [ ] Add reCAPTCHA for spam protection
-  [ ] Store submissions in database
-  [ ] Add admin dashboard for viewing submissions
-  [ ] Implement email notifications for admins
-  [ ] Add file upload capability
-  [ ] Create CRM integration
-  [ ] Add multi-language support
-  [ ] Implement A/B testing

---

## Support

For issues or questions:

-  Check server console logs
-  Check browser console
-  Review Resend dashboard
-  Check this documentation
-  Review code comments

---

**Status:** ✅ Production Ready  
**Last Updated:** 2025-11-04  
**Version:** 1.0.0
