# Authenticated User Registration System Documentation

**Project:** Synos Medical Web Application
**Date:** December 3, 2025
**Status:** ✅ **PRODUCTION READY**

---

## 📋 Overview

This document describes the **authenticated user registration system** where only logged-in users can create new user accounts. Public registration has been disabled to maintain controlled access to the application.

---

## 🎯 Key Features

### 1. Restricted Registration

-  ✅ Public `/register` page disabled
-  ✅ Only authenticated users can create accounts
-  ✅ User creation through admin dashboard
-  ✅ Immediate account activation (no email verification required)

### 2. User Management Dashboard

-  ✅ Located at `/dashboard/users`
-  ✅ Create new users with name, email, and password
-  ✅ View all registered users in a table
-  ✅ Display user status (verified/pending)
-  ✅ Show creation date and last login
-  ✅ Real-time user list updates

### 3. Security Features

-  ✅ Session-based authentication required
-  ✅ Password validation (8+ chars, uppercase, lowercase, numbers)
-  ✅ Email uniqueness validation
-  ✅ Passwords hashed with bcrypt via Better Auth
-  ✅ Audit trail (creator tracking)

---

## 📝 API Endpoints

### 1. Create New User

**Endpoint:** `POST /api/admin/users`

**Authentication:** Required (must be logged in)

**Request Body:**

```json
{
	"name": "John Doe",
	"email": "john@example.com",
	"password": "SecurePass123"
}
```

**Response (Success):**

```json
{
	"success": true,
	"message": "User created successfully",
	"data": {
		"user": {
			"_id": "...",
			"name": "John Doe",
			"email": "john@example.com",
			"emailVerified": false,
			"createdAt": "2025-12-03T..."
		}
	}
}
```

**Response (Email Exists):**

```json
{
	"success": false,
	"message": "Email already exists"
}
```

**Response (Unauthorized):**

```json
{
	"success": false,
	"message": "Unauthorized. You must be logged in to create users."
}
```

**Response (Validation Error):**

```json
{
	"success": false,
	"message": "Validation failed",
	"errors": [
		{
			"path": ["password"],
			"message": "Password must contain at least one uppercase letter, one lowercase letter, and one number"
		}
	]
}
```

---

### 2. Get All Users

**Endpoint:** `GET /api/admin/users`

**Authentication:** Required (must be logged in)

**Query Parameters:**

-  `page` (optional): Page number for pagination (default: 1)
-  `limit` (optional): Number of users per page (default: 10)
-  `search` (optional): Search term for filtering users

**Example Request:**

```
GET /api/admin/users?page=1&limit=20&search=john
```

**Response (Success):**

```json
{
	"success": true,
	"data": {
		"users": [
			{
				"_id": "...",
				"name": "John Doe",
				"email": "john@example.com",
				"emailVerified": true,
				"createdAt": "2025-12-03T...",
				"lastLoginAt": "2025-12-03T..."
			}
		],
		"total": 50,
		"page": 1,
		"limit": 20,
		"totalPages": 3
	}
}
```

---

## 🔐 Validation Rules

### Name Validation

-  **Required**
-  **Min length:** 2 characters
-  **Max length:** 100 characters
-  **Trimmed:** Leading/trailing spaces removed

### Email Validation

-  **Required**
-  **Format:** Valid email format
-  **Unique:** Email must not already exist
-  **Lowercase:** Automatically converted to lowercase
-  **Trimmed:** Leading/trailing spaces removed

### Password Validation

-  **Required**
-  **Min length:** 8 characters
-  **Max length:** 128 characters
-  **Complexity:** Must contain:
   -  At least one uppercase letter (A-Z)
   -  At least one lowercase letter (a-z)
   -  At least one number (0-9)
-  **Regex:** `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/`

---

## 💻 Frontend Implementation

### User Management Page

**Location:** `/dashboard/users`

**Features:**

1. **Create User Form**

   -  Toggle button to show/hide form
   -  Name, email, and password fields
   -  Real-time validation
   -  Success/error notifications

2. **Users Table**

   -  Displays all registered users
   -  Shows name, email, status, created date, last login
   -  Responsive design
   -  Auto-refreshes after creating a user

3. **Navigation**
   -  Accessible from navbar "Users" link
   -  Protected by authentication (dashboard layout)

---

## 🗂️ File Structure

```
app/
├── api/
│   └── admin/
│       └── users/
│           └── route.ts              # POST create user, GET list users
│
├── (dashboard)/
│   └── dashboard/
│       └── users/
│           └── page.tsx              # User management page
│
├── (auth)/
│   └── register/
│       └── page.tsx                  # Disabled registration page
│
lib/
├── services/
│   └── auth.service.ts               # createUserByAdmin() method
│
components/
└── layout/
    └── ProtectedNavbar.tsx           # Updated with Users link
```

---

## 🔄 User Creation Flow

```
1. Authenticated user navigates to /dashboard/users
   ↓
2. Clicks "Add New User" button
   ↓
3. Fills out form (name, email, password)
   ↓
4. Frontend validates input (Zod schema)
   ↓
5. POST /api/admin/users
   ↓
6. API validates session (user must be logged in)
   ↓
7. API validates input data
   ↓
8. API checks if email already exists
   ↓
9. AuthService.createUserByAdmin()
   ↓
10. Generate unique user ID
   ↓
11. Hash password using scrypt (Better Auth format)
   ↓
12. Create user record in 'user' collection
   ↓
13. Create account record in 'account' collection
    - providerId: "credential"
    - password: hashed password
    - accountId: equals userId
   ↓
14. Profile created for new user
   ↓
15. Creator ID logged for audit trail
   ↓
16. Success response returned
   ↓
17. Users list refreshed automatically
   ↓
18. New user can log in immediately with email/password
```

---

## 🧪 Testing

### Test User Creation

```bash
# Login first to get session cookie
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123"
  }' \
  -c cookies.txt

# Create new user
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "JanePass123"
  }'
```

### Test Get All Users

```bash
# Get all users
curl -X GET http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -b cookies.txt

# Get users with pagination
curl -X GET "http://localhost:3000/api/admin/users?page=1&limit=10" \
  -H "Content-Type: application/json" \
  -b cookies.txt

# Search users
curl -X GET "http://localhost:3000/api/admin/users?search=jane" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Test Unauthorized Access

```bash
# Try to create user without authentication
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Should return 401 Unauthorized
```

---

## 🔐 Security Considerations

### 1. Authentication Required

-  ✅ All user management endpoints require valid session
-  ✅ Unauthenticated requests return 401 Unauthorized
-  ✅ Session validated on every request

### 2. Password Security

-  ✅ Passwords hashed with scrypt (Better Auth standard)
-  ✅ 64-byte derived key with random salt
-  ✅ Password stored in separate 'account' collection
-  ✅ Passwords never logged or exposed
-  ✅ Strong password policy enforced
-  ✅ Password complexity validated on client and server

### 3. Email Validation

-  ✅ Email uniqueness checked before creation
-  ✅ Prevents duplicate accounts
-  ✅ Case-insensitive email matching

### 4. Audit Trail

-  ✅ Creator ID logged when user is created
-  ✅ All operations logged for security audit
-  ✅ User creation tracked in logs

### 5. Input Validation

-  ✅ Zod schema validation on client and server
-  ✅ XSS prevention through input sanitization
-  ✅ SQL injection prevention via Mongoose ODM

---

## 📊 Database Schema

### User Collection (Better Auth managed)

```javascript
{
  id: String,                    console.logBetter Auth ID (hex string)
  _id: ObjectId,                 console.logMongoDB ID (same as 'id')
  email: String,                 console.logUnique, lowercase, indexed
  name: String,                  console.logUser's display name
  emailVerified: Boolean,        console.logEmail verification status
  image: String,                 console.logProfile image (base64 or URL)
  lastLoginAt: Date,            console.logLast login timestamp
  createdAt: Date,              console.logAccount creation date
  updatedAt: Date
}
```

### Account Collection (Better Auth managed) ⭐ CRITICAL

```javascript
{
  id: String,                    console.logUnique account ID
  userId: String,                console.logReference to user.id
  accountId: String,             console.logEquals userId for credential accounts
  providerId: String,            console.log"credential" for email/password
  password: String,              console.logHashed password (scrypt format)
  accessToken: String,           console.logOAuth access token (null for credentials)
  refreshToken: String,          console.logOAuth refresh token (null for credentials)
  accessTokenExpiresAt: Date,    console.logToken expiration (null for credentials)
  refreshTokenExpiresAt: Date,   console.logToken expiration (null for credentials)
  scope: String,                 console.logOAuth scope (null for credentials)
  idToken: String,               console.logOAuth ID token (null for credentials)
  createdAt: Date,
  updatedAt: Date
}
```

**IMPORTANT:** The account collection is **REQUIRED** for email/password authentication. Better Auth stores passwords in this collection, NOT in the user collection. Without an account record with `providerId: "credential"`, users cannot log in.

### Profile Collection (Application managed)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,              console.logReference to user._id
  bio: String,                   console.logOptional bio
  avatarUrl: String,             console.logOptional avatar URL
  phoneNumber: String,           console.logOptional phone
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎨 User Interface

### User Management Dashboard

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│ User Management                    [Add New User]   │
│ Create and manage user accounts                     │
├─────────────────────────────────────────────────────┤
│ ┌─ Create New User (collapsible) ─────────────────┐│
│ │ Full Name:    [________________]                ││
│ │ Email:        [________________]                ││
│ │ Password:     [________________]                ││
│ │               [Cancel]  [Create User]           ││
│ └─────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────┤
│ All Users (10)                                      │
│                                                      │
│ Name      Email         Status   Created  Last Login│
│ ───────────────────────────────────────────────────│
│ John Doe  john@ex.com   Verified 12/03   12/03     │
│ Jane Doe  jane@ex.com   Pending  12/02   Never     │
└─────────────────────────────────────────────────────┘
```

**Features:**

-  Toggle form visibility
-  Real-time validation feedback
-  Success/error notifications
-  Sortable table columns
-  Responsive design for mobile

---

## 🚫 Disabled Public Registration

### Old Flow (Disabled):

```
User → /register → Fill form → Create account
```

### New Flow (Active):

```
User → /register → "Registration Unavailable" page → Redirect to login
```

**Register Page Content:**

-  Clear message that public registration is disabled
-  Explanation that only authenticated users can create accounts
-  Link to login page for existing users
-  Link back to home page

---

## ✅ Implementation Checklist

-  [x] API endpoint for creating users (POST /api/admin/users)
-  [x] API endpoint for listing users (GET /api/admin/users)
-  [x] createUserByAdmin method in auth service
-  [x] User management dashboard page
-  [x] User creation form with validation
-  [x] Users table with all user data
-  [x] Navbar updated with Users link
-  [x] Public registration page disabled
-  [x] Session authentication on all endpoints
-  [x] Password validation and hashing
-  [x] Email uniqueness validation
-  [x] Audit trail logging
-  [x] Error handling and user feedback
-  [x] Responsive design
-  [x] Documentation

---

## 🚀 Usage Guide

### For Administrators/Authenticated Users

**Step 1: Login**

-  Navigate to `/login`
-  Enter your credentials
-  Access the dashboard

**Step 2: Navigate to User Management**

-  Click "Users" in the navbar
-  Or go to `/dashboard/users`

**Step 3: Create New User**

-  Click "Add New User" button
-  Fill in the form:
   -  Full Name (e.g., "Jane Doe")
   -  Email (e.g., "jane@example.com")
   -  Password (must meet complexity requirements)
-  Click "Create User"

**Step 4: View Users**

-  All users displayed in table
-  See user status, creation date, last login
-  Users list updates automatically

**Step 5: New User Can Login**

-  The newly created user can immediately log in
-  They use the email and password you set
-  They can update their profile and password after login

---

## 🔮 Future Enhancements

### Potential Features

-  [ ] Role-based access control (only admins can create users)
-  [ ] User invitation via email
-  [ ] Bulk user import from CSV
-  [ ] User deactivation/deletion
-  [ ] User role management (admin, user, viewer)
-  [ ] Password reset by admin
-  [ ] User activity logs
-  [ ] Export users to CSV
-  [ ] Advanced user filtering and sorting
-  [ ] User groups/teams

---

## 🐛 Common Issues & Solutions

### Issue 1: "Unauthorized" Error When Creating User

**Cause:** Not logged in or session expired
**Solution:** Log in again and try creating the user

### Issue 2: "Email Already Exists"

**Cause:** Email is already registered
**Solution:** Use a different email address

### Issue 3: Password Validation Fails

**Cause:** Password doesn't meet complexity requirements
**Solution:** Ensure password has:

-  At least 8 characters
-  One uppercase letter
-  One lowercase letter
-  One number

### Issue 4: Can't Access /dashboard/users

**Cause:** Not authenticated
**Solution:** Log in first, then navigate to the page

---

## 📚 Related Documentation

-  [PROFILE_PASSWORD_UPDATE_DOCS.md](PROFILE_PASSWORD_UPDATE_DOCS.md) - User profile management
-  [USER_DATA_FETCHING_DOCUMENTATION.md](USER_DATA_FETCHING_DOCUMENTATION.md) - User data flow
-  [DATABASE_MODEL_CRUD_GUIDE.md](DATABASE_MODEL_CRUD_GUIDE.md) - Database models

---

## 🎉 Summary

This implementation provides a **secure, controlled user registration system** where:

-  ✅ **Only authenticated users can create new accounts**
-  ✅ **Public registration is disabled**
-  ✅ **User management dashboard for easy account creation**
-  ✅ **Full validation and security measures**
-  ✅ **Audit trail for accountability**
-  ✅ **Immediate account activation**
-  ✅ **Professional UI with error handling**

The system ensures that user creation is controlled and audited, preventing unauthorized account creation while maintaining ease of use for authorized personnel.

---

**Document Version:** 1.0
**Last Updated:** December 3, 2025
**Author:** Claude (Anthropic AI Assistant)
**Status:** Production Ready
