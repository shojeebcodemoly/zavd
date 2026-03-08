# 📚 Synos Medical - Authentication System Implementation Documentation

**Project:** Synos Medical Web Application
**Feature:** MongoDB + Mongoose + Better Auth Integration
**Date:** December 2025
**Version:** 1.0

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Requirements Specification](#requirements-specification)
3. [Technology Stack](#technology-stack)
4. [Database Architecture](#database-architecture)
5. [Application Architecture](#application-architecture)
6. [API Documentation](#api-documentation)
7. [Authentication Flow](#authentication-flow)
8. [File Structure](#file-structure)
9. [Implementation Steps](#implementation-steps)
10.   [Testing Guide](#testing-guide)
11.   [Deployment Checklist](#deployment-checklist)

---

## 1. Project Overview

### 1.1 Purpose

Implement a complete authentication system for Synos Medical's web application using:

-  **MongoDB** as the database
-  **Mongoose** for ODM (Object Document Mapping)
-  **Better Auth** for authentication framework
-  **Next.js 16** App Router for the frontend/backend

### 1.2 Goals

-  ✅ Secure user registration and login
-  ✅ Session management (7-day expiration)
-  ✅ User profile management
-  ✅ Protected routes and API endpoints
-  ✅ Clean, maintainable, reusable code (DRY, KISS principles)
-  ✅ Industrial-grade architecture patterns

### 1.3 Scope

**In Scope:**

-  Email/password authentication
-  User registration and login
-  User profile with bio, avatar, phone, address
-  Dashboard for authenticated users
-  Profile editing
-  Session management
-  Protected routes

**Out of Scope (for now):**

-  Email verification
-  Social login (Google, GitHub, etc.)
-  Two-factor authentication (2FA)
-  Role-based access control (RBAC)
-  Password reset via email
-  Rate limiting

---

## 2. Requirements Specification

### 2.1 Functional Requirements

#### FR-1: User Registration

-  **Description:** Users can create an account with email, name, and password
-  **Input:** Email (valid format), Name (min 2 chars), Password (min 8 chars)
-  **Output:** User account created, session started
-  **Validation:**
   -  Email must be unique
   -  Email must be valid format
   -  Password must be at least 8 characters
   -  Name required

#### FR-2: User Login

-  **Description:** Users can log in with email and password
-  **Input:** Email, Password
-  **Output:** Session created, redirect to dashboard
-  **Validation:**
   -  Credentials must match existing user
   -  Account must exist

#### FR-3: User Logout

-  **Description:** Users can log out and end their session
-  **Input:** User action (button click)
-  **Output:** Session destroyed, redirect to homepage

#### FR-4: Session Management

-  **Description:** User sessions persist across page refreshes
-  **Duration:** 7 days
-  **Storage:** HTTP-only cookies
-  **Security:** CSRF protection, secure cookies in production

#### FR-5: Profile Management

-  **Description:** Users can view and edit their profile
-  **Fields:** Name, Email, Bio, Avatar, Phone Number, Address
-  **Operations:** View, Update, Upload avatar

#### FR-6: Protected Routes

-  **Description:** Certain pages require authentication
-  **Protected Pages:** `/dashboard`, `/dashboard/profile`
-  **Behavior:** Redirect to `/login` if not authenticated

### 2.2 Non-Functional Requirements

#### NFR-1: Security

-  Passwords hashed with bcrypt (handled by Better Auth)
-  HTTPS enforced in production
-  HTTP-only secure cookies
-  CSRF protection
-  SQL injection prevention (Mongoose parameterized queries)

#### NFR-2: Performance

-  Page load time < 3 seconds or lower
-  API response time < 500ms or lower
-  Database queries optimized with indexes
-  Connection pooling for MongoDB

#### NFR-3: Scalability

-  Repository pattern allows easy database migration
-  Service layer separates business logic
-  Stateless authentication (session in database)

#### NFR-4: Maintainability

-  TypeScript for type safety
-  Clean code principles (DRY, KISS, SOLID)
-  Comprehensive documentation
-  Consistent code style

#### NFR-5: Usability

-  Clear error messages
-  Form validation feedback
-  Loading states
-  Responsive design

---

## 3. Technology Stack

### 3.1 Core Technologies

| Layer          | Technology           | Version | Purpose                    |
| -------------- | -------------------- | ------- | -------------------------- |
| **Framework**  | Next.js              | 16.0.0  | Full-stack React framework |
| **Language**   | TypeScript           | 5.x     | Type-safe JavaScript       |
| **Database**   | MongoDB              | 7.0+    | Document database          |
| **ODM**        | Mongoose             | 9.0.0   | MongoDB object modeling    |
| **Auth**       | Better Auth          | 1.4.4   | Authentication framework   |
| **Validation** | Zod                  | 4.1.12  | Schema validation          |
| **Forms**      | React Hook Form      | 7.65.0  | Form state management      |
| **UI**         | Shadcn/UI + Radix UI | Latest  | Component library          |
| **Styling**    | Tailwind CSS         | 4.x     | Utility-first CSS          |

### 3.2 Dependencies

```json
{
	"dependencies": {
		"next": "16.0.0",
		"react": "19.2.0",
		"mongoose": "9.0.0",
		"mongodb": "7.0.0",
		"better-auth": "1.4.4",
		"zod": "4.1.12",
		"react-hook-form": "7.65.0",
		"@hookform/resolvers": "5.2.2"
	}
}
```

---

## 4. Database Architecture

### 4.1 Database Schema

#### 4.1.1 Better Auth Collections (Auto-created)

**Collection: `user`** (managed by Better Auth)

```javascript
{
  _id: ObjectId,
  id: String,              console.logBetter Auth user ID
  email: String,           console.logUnique, indexed
  emailVerified: Boolean,
  name: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Collection: `session`** (managed by Better Auth)

```javascript
{
  _id: ObjectId,
  id: String,
  userId: String,          console.logReference to user.id
  expiresAt: Date,
  token: String,
  ipAddress: String,
  userAgent: String
}
```

**Collection: `account`** (managed by Better Auth)

```javascript
{
  _id: ObjectId,
  id: String,
  userId: String,
  accountId: String,
  providerId: String,      console.log'credential' for email/password
  accessToken: String,
  refreshToken: String,
  expiresAt: Date
}
```

#### 4.1.2 Custom Mongoose Collections

**Collection: `users`** (custom, complements Better Auth)

```typescript
{
  _id: ObjectId,
  email: String,           console.logIndexed, unique, lowercase
  name: String,
  emailVerified: Boolean,
  image: String,
  betterAuthUserId: String, console.logReference to Better Auth user.id, indexed
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Collection: `profiles`** (user profile data)

```typescript
{
  _id: ObjectId,
  userId: ObjectId,        console.logReference to users._id, indexed, unique
  bio: String,             console.logMax 500 chars
  avatarUrl: String,
  phoneNumber: String,
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

### 4.2 Database Indexes

```javascript
console.logusers collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ betterAuthUserId: 1 });
db.users.createIndex({ createdAt: -1 });

console.logprofiles collection
db.profiles.createIndex({ userId: 1 }, { unique: true });
```

### 4.3 Entity Relationship Diagram

```
┌─────────────────────────┐
│   Better Auth: user     │
│─────────────────────────│
│ id (PK)                 │
│ email                   │
│ emailVerified           │
│ name                    │
│ image                   │
│ createdAt               │
│ updatedAt               │
└───────────┬─────────────┘
            │
            │ 1:1
            │
┌───────────▼─────────────┐
│   Mongoose: users       │
│─────────────────────────│
│ _id (PK)                │
│ email                   │
│ name                    │
│ emailVerified           │
│ image                   │
│ betterAuthUserId (FK)   │──── References Better Auth user.id
│ lastLoginAt             │
│ createdAt               │
│ updatedAt               │
└───────────┬─────────────┘
            │
            │ 1:1
            │
┌───────────▼─────────────┐
│  Mongoose: profiles     │
│─────────────────────────│
│ _id (PK)                │
│ userId (FK)             │──── References users._id
│ bio                     │
│ avatarUrl               │
│ phoneNumber             │
│ address                 │
│ createdAt               │
│ updatedAt               │
└─────────────────────────┘
```

### 4.4 Data Flow

```
Registration Flow:
1. User submits form → Better Auth creates user in `user` collection
2. Service layer creates corresponding record in `users` collection
3. Service layer creates default profile in `profiles` collection

Login Flow:
1. Better Auth validates credentials
2. Better Auth creates session in `session` collection
3. Service layer updates `lastLoginAt` in `users` collection
```

---

## 5. Application Architecture

### 5.1 Layered Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (React Components, Pages, Forms, UI)                        │
│                                                              │
│  - app/(auth)/login, register                                │
│  - app/(dashboard)/dashboard, profile                        │
│  - components/ui, forms                                      │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                       API LAYER                              │
│  (Next.js Route Handlers, Middleware)                        │
│                                                              │
│  - app/api/auth/[...all]/route.ts                            │
│  - app/api/user/me/route.ts                                  │
│  - app/api/user/profile/route.ts                             │
│  - middleware.ts (route protection)                          │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ Calls
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                     SERVICE LAYER                            │
│  (Business Logic, Orchestration)                             │
│                                                              │
│  - lib/services/auth.service.ts                              │
│  - lib/services/user.service.ts                              │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ Uses
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                   REPOSITORY LAYER                           │
│  (Data Access Abstraction)                                   │
│                                                              │
│  - lib/repositories/base.repository.ts                       │
│  - lib/repositories/user.repository.ts                       │
│  - lib/repositories/profile.repository.ts                    │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ Queries
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                      DATA LAYER                              │
│  (Database Models, Connections)                              │
│                                                              │
│  - models/user.model.ts                                      │
│  - models/profile.model.ts                                   │
│  - lib/db/db-connect.ts (Mongoose)                           │
│  - lib/db/mongo.ts (MongoDB driver)                          │
│  - lib/db/auth.ts (Better Auth)                              │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ Connects to
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                      MONGODB                                 │
│  (Database Server)                                           │
│                                                              │
│  - localhost:27017/synos-db                                  │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 Design Patterns Used

#### 5.2.1 Repository Pattern

**Purpose:** Separate data access logic from business logic

**Example:**

```typescript
console.logInstead of this in your API route:
const User = await getUserModel();
const user = await User.findOne({ email });

console.logUse this:
const user = await userRepository.findByEmail(email);
```

**Benefits:**

-  DRY: Write query once, reuse everywhere
-  Testable: Mock repositories easily
-  Flexible: Switch databases without changing business logic

#### 5.2.2 Service Layer Pattern

**Purpose:** Encapsulate business logic

**Example:**

```typescript
console.logService handles complex operations
class AuthService {
	async register(data) {
		console.log1. Validate data
		console.log2. Check if email exists
		console.log3. Create Better Auth user
		console.log4. Create Mongoose user record
		console.log5. Create default profile
		console.log6. Send welcome email
		return user;
	}
}
```

#### 5.2.3 Singleton Pattern

**Purpose:** One instance of database connection

**Example:**

```typescript
let connection = null;

export async function connectMongoose() {
	if (connection) return connection;
	connection = await mongoose.connect(URI);
	return connection;
}
```

#### 5.2.4 Factory Pattern

**Purpose:** Create model instances correctly

**Example:**

```typescript
export function getUserModelSync() {
	return mongoose.models.User || mongoose.model("User", UserSchema);
}
```

### 5.3 Folder Structure

```
synos/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (separate layout)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/              # Protected dashboard
│   │   ├── layout.tsx            # Dashboard layout with auth check
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   │
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   └── [...all]/
│   │   │       └── route.ts      # Better Auth handler
│   │   ├── user/
│   │   │   ├── me/
│   │   │   │   └── route.ts      # GET current user
│   │   │   └── profile/
│   │   │       └── route.ts      # GET/PATCH profile
│   │   └── health/
│   │       └── route.ts          # Health check
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   ├── forms/                    # Form components
│   ├── layout/                   # Layout components
│   └── dashboard/                # Dashboard components
│
├── lib/                          # Utility libraries
│   ├── auth/
│   │   ├── auth.ts               # Better Auth config
│   │   └── middleware.ts         # Auth middleware
│   │
│   ├── db/                       # Database connections
│   │   ├── db-connect.ts         # Mongoose connection
│   │   ├── mongo.ts              # MongoDB driver
│   │   └── auth.ts               # Better Auth instance
│   │
│   ├── repositories/             # Repository layer
│   │   ├── base.repository.ts    # Generic CRUD
│   │   ├── user.repository.ts    # User data access
│   │   ├── profile.repository.ts # Profile data access
│   │   └── index.ts              # Export all
│   │
│   ├── services/                 # Service layer
│   │   ├── auth.service.ts       # Auth business logic
│   │   ├── user.service.ts       # User business logic
│   │   └── index.ts              # Export all
│   │
│   ├── validations/              # Zod schemas
│   │   ├── auth.validation.ts    # Auth schemas
│   │   ├── user.validation.ts    # User schemas
│   │   └── index.ts              # Export all
│   │
│   └── utils/                    # Utility functions
│       ├── constants.ts          # App constants
│       ├── api-error.ts          # Custom errors
│       ├── api-response.ts       # Response helpers
│       └── logger.ts             # Logging utility
│
├── models/                       # Mongoose models
│   ├── user.model.ts
│   ├── profile.model.ts
│   └── index.ts
│
├── types/                        # TypeScript types
│   ├── auth.types.ts
│   ├── user.types.ts
│   └── api.types.ts
│
├── middleware.ts                 # Next.js middleware
├── .env                          # Environment variables
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## 6. API Documentation

### 6.1 Authentication Endpoints

#### POST `/api/auth/sign-up`

**Description:** Register a new user

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "SecurePass123!",
	"name": "John Doe"
}
```

**Response (200 OK):**

```json
{
	"success": true,
	"message": "Registration successful",
	"data": {
		"user": {
			"id": "user_123",
			"email": "user@example.com",
			"name": "John Doe",
			"emailVerified": false
		},
		"session": {
			"token": "session_token",
			"expiresAt": "2025-12-09T00:00:00.000Z"
		}
	}
}
```

**Error Responses:**

-  `400 Bad Request` - Invalid input
-  `409 Conflict` - Email already exists
-  `500 Internal Server Error` - Server error

---

#### POST `/api/auth/sign-in`

**Description:** Log in existing user

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "SecurePass123!"
}
```

**Response (200 OK):**

```json
{
	"success": true,
	"message": "Login successful",
	"data": {
		"user": {
			"id": "user_123",
			"email": "user@example.com",
			"name": "John Doe"
		},
		"session": {
			"token": "session_token",
			"expiresAt": "2025-12-09T00:00:00.000Z"
		}
	}
}
```

**Error Responses:**

-  `401 Unauthorized` - Invalid credentials
-  `500 Internal Server Error` - Server error

---

#### POST `/api/auth/sign-out`

**Description:** Log out current user

**Request Headers:**

```
Cookie: synos_session=session_token
```

**Response (200 OK):**

```json
{
	"success": true,
	"message": "Logout successful"
}
```

---

#### GET `/api/auth/get-session`

**Description:** Get current session

**Request Headers:**

```
Cookie: synos_session=session_token
```

**Response (200 OK):**

```json
{
	"success": true,
	"data": {
		"user": {
			"id": "user_123",
			"email": "user@example.com",
			"name": "John Doe"
		},
		"session": {
			"expiresAt": "2025-12-09T00:00:00.000Z"
		}
	}
}
```

**Error Responses:**

-  `401 Unauthorized` - No active session

---

### 6.2 User Endpoints

#### GET `/api/user/me`

**Description:** Get current authenticated user

**Request Headers:**

```
Cookie: synos_session=session_token
```

**Response (200 OK):**

```json
{
	"success": true,
	"data": {
		"_id": "507f1f77bcf86cd799439011",
		"email": "user@example.com",
		"name": "John Doe",
		"emailVerified": false,
		"image": null,
		"betterAuthUserId": "user_123",
		"lastLoginAt": "2025-12-02T10:30:00.000Z",
		"createdAt": "2025-12-01T00:00:00.000Z",
		"updatedAt": "2025-12-02T10:30:00.000Z",
		"profile": {
			"_id": "507f1f77bcf86cd799439012",
			"userId": "507f1f77bcf86cd799439011",
			"bio": "Medical professional",
			"avatarUrl": "https://example.com/avatar.jpg",
			"phoneNumber": "+46701234567",
			"address": {
				"street": "Storgatan 1",
				"city": "Stockholm",
				"postalCode": "111 22",
				"country": "Sweden"
			},
			"createdAt": "2025-12-01T00:00:00.000Z",
			"updatedAt": "2025-12-02T10:30:00.000Z"
		}
	}
}
```

**Error Responses:**

-  `401 Unauthorized` - Not authenticated
-  `404 Not Found` - User not found

---

#### GET `/api/user/profile`

**Description:** Get current user's profile

**Request Headers:**

```
Cookie: synos_session=session_token
```

**Response (200 OK):**

```json
{
	"success": true,
	"data": {
		"_id": "507f1f77bcf86cd799439012",
		"userId": "507f1f77bcf86cd799439011",
		"bio": "Medical professional",
		"avatarUrl": "https://example.com/avatar.jpg",
		"phoneNumber": "+46701234567",
		"address": {
			"street": "Storgatan 1",
			"city": "Stockholm",
			"postalCode": "111 22",
			"country": "Sweden"
		},
		"createdAt": "2025-12-01T00:00:00.000Z",
		"updatedAt": "2025-12-02T10:30:00.000Z"
	}
}
```

---

#### PATCH `/api/user/profile`

**Description:** Update current user's profile

**Request Headers:**

```
Cookie: synos_session=session_token
Content-Type: application/json
```

**Request Body:**

```json
{
	"bio": "Updated bio",
	"phoneNumber": "+46709876543",
	"address": {
		"street": "Nygatan 5",
		"city": "Gothenburg",
		"postalCode": "411 05",
		"country": "Sweden"
	}
}
```

**Response (200 OK):**

```json
{
	"success": true,
	"message": "Profile updated successfully",
	"data": {
		"_id": "507f1f77bcf86cd799439012",
		"userId": "507f1f77bcf86cd799439011",
		"bio": "Updated bio",
		"phoneNumber": "+46709876543",
		"address": {
			"street": "Nygatan 5",
			"city": "Gothenburg",
			"postalCode": "411 05",
			"country": "Sweden"
		},
		"updatedAt": "2025-12-02T11:00:00.000Z"
	}
}
```

**Error Responses:**

-  `401 Unauthorized` - Not authenticated
-  `422 Unprocessable Entity` - Validation error

---

### 6.3 Health Check

#### GET `/api/health`

**Description:** Check API and database health

**Response (200 OK):**

```json
{
	"success": true,
	"data": {
		"status": "healthy",
		"timestamp": "2025-12-02T12:00:00.000Z",
		"database": {
			"connected": true,
			"name": "synos-db"
		}
	}
}
```

---

## 7. Authentication Flow

### 7.1 Registration Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Fills registration form
     │    (email, password, name)
     ▼
┌─────────────────┐
│ Register Page   │
│ /register       │
└────┬────────────┘
     │
     │ 2. Client-side validation (Zod)
     │
     ▼
┌──────────────────────┐
│ authClient.signUp()  │
└────┬─────────────────┘
     │
     │ 3. POST /api/auth/sign-up
     │
     ▼
┌───────────────────────┐
│ Better Auth Handler   │
│ /api/auth/[...all]    │
└────┬──────────────────┘
     │
     │ 4. Hash password (bcrypt)
     │ 5. Create user in Better Auth `user` collection
     │ 6. Create session in `session` collection
     │
     ▼
┌──────────────────┐
│  Auth Service    │
└────┬─────────────┘
     │
     │ 7. Create user in Mongoose `users` collection
     │ 8. Create default profile in `profiles` collection
     │
     ▼
┌────────────────┐
│  User Repo     │
│  Profile Repo  │
└────┬───────────┘
     │
     │ 9. Insert into MongoDB
     │
     ▼
┌──────────────┐
│   MongoDB    │
└──────────────┘
     │
     │ 10. Return user data & session
     │
     ▼
┌─────────────────┐
│  Register Page  │
└────┬────────────┘
     │
     │ 11. Redirect to /dashboard
     │
     ▼
┌──────────────┐
│  Dashboard   │
└──────────────┘
```

### 7.2 Login Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Enters email & password
     │
     ▼
┌──────────────┐
│  Login Page  │
│  /login      │
└────┬─────────┘
     │
     │ 2. Client validation
     │
     ▼
┌──────────────────────┐
│ authClient.signIn()  │
└────┬─────────────────┘
     │
     │ 3. POST /api/auth/sign-in
     │
     ▼
┌───────────────────────┐
│ Better Auth Handler   │
└────┬──────────────────┘
     │
     │ 4. Find user by email
     │ 5. Verify password (bcrypt)
     │ 6. Create session
     │
     ▼
┌──────────────────┐
│  User Service    │
└────┬─────────────┘
     │
     │ 7. Update lastLoginAt
     │
     ▼
┌────────────────┐
│  User Repo     │
└────┬───────────┘
     │
     │ 8. Update in MongoDB
     │
     ▼
┌──────────────┐
│   MongoDB    │
└──────────────┘
     │
     │ 9. Return session
     │
     ▼
┌──────────────┐
│  Login Page  │
└────┬─────────┘
     │
     │ 10. Redirect to /dashboard
     │
     ▼
┌──────────────┐
│  Dashboard   │
└──────────────┘
```

### 7.3 Protected Route Access Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Navigates to /dashboard
     │
     ▼
┌────────────────────┐
│  Next.js Middleware│
│  middleware.ts     │
└────┬───────────────┘
     │
     │ 2. Check for session cookie
     │
     ▼
    ┌─┴──────────────┐
    │ Has session?   │
    └─┬──────────┬───┘
      │ Yes      │ No
      │          │
      │          ▼
      │    ┌──────────────┐
      │    │ Redirect to  │
      │    │ /login       │
      │    └──────────────┘
      │
      │ 3. Verify session with Better Auth
      │
      ▼
┌───────────────────────┐
│ Better Auth           │
│ auth.api.getSession() │
└────┬──────────────────┘
     │
     ▼
    ┌─┴──────────────┐
    │ Valid session? │
    └─┬──────────┬───┘
      │ Yes      │ No
      │          │
      │          ▼
      │    ┌──────────────┐
      │    │ Redirect to  │
      │    │ /login       │
      │    └──────────────┘
      │
      │ 4. Allow access
      │
      ▼
┌──────────────┐
│  Dashboard   │
│  /dashboard  │
└──────────────┘
```

### 7.4 Session Management

```
Session Cookie: synos_session
├── HTTP-only: true (prevents JavaScript access)
├── Secure: true (HTTPS only in production)
├── SameSite: Lax (CSRF protection)
├── Max-Age: 604800 seconds (7 days)
└── Path: / (available site-wide)

Session Data (in MongoDB):
{
  id: "session_xyz",
  userId: "user_123",
  expiresAt: Date (7 days from creation),
  token: "encrypted_token",
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}

Session Lifecycle:
1. Created on login/registration
2. Refreshed on each request (if > 24 hours old)
3. Expires after 7 days of inactivity
4. Deleted on logout
```

---

## 8. Implementation Steps

### Phase 1: Core Setup ✅ COMPLETED

#### Step 1.1: Configure Better Auth

-  [x] Create `lib/db/auth.ts`
-  [x] Set up MongoDB adapter
-  [x] Configure email/password plugin
-  [x] Set session duration to 7 days
-  [x] Configure secure cookies

#### Step 1.2: Update Environment Variables

-  [x] Add `MONGODB_URI`
-  [x] Add `MONGODB_DB`
-  [x] Add `BETTER_AUTH_SECRET`
-  [x] Add `BETTER_AUTH_URL`
-  [x] Add `NODE_ENV`

#### Step 1.3: Create Utility Functions

-  [x] Create `lib/utils/constants.ts` - App constants
-  [x] Create `lib/utils/api-error.ts` - Custom error classes
-  [x] Create `lib/utils/api-response.ts` - Response helpers
-  [x] Create `lib/utils/logger.ts` - Logging utility

#### Step 1.4: Create Database Models

-  [x] Create `models/user.model.ts` - User schema
-  [x] Create `models/profile.model.ts` - Profile schema
-  [x] Simplify models (remove role, status, preferences, socialLinks)

#### Step 1.5: Create Repository Layer

-  [x] Create `lib/repositories/base.repository.ts` - Generic CRUD
-  [x] Create `lib/repositories/user.repository.ts` - User operations
-  [x] Create `lib/repositories/profile.repository.ts` - Profile operations

---

### Phase 2: Validation & Services (NEXT)

#### Step 2.1: Create Validation Schemas

-  [ ] Create `lib/validations/auth.validation.ts`
   -  Register schema (email, password, name)
   -  Login schema (email, password)
   -  Update password schema
-  [ ] Create `lib/validations/user.validation.ts`
   -  Update profile schema
   -  Update address schema

#### Step 2.2: Create Service Layer

-  [ ] Create `lib/services/auth.service.ts`
   -  `register(data)` - Handle user registration
   -  `login(data)` - Handle user login
   -  `logout()` - Handle logout
-  [ ] Create `lib/services/user.service.ts`
   -  `getUserProfile(userId)` - Get user with profile
   -  `updateProfile(userId, data)` - Update profile
   -  `updateAvatar(userId, url)` - Update avatar

---

### Phase 3: API Endpoints

#### Step 3.1: Complete Auth API Handler

-  [ ] Update `app/api/auth/[...all]/route.ts`
   -  Initialize Better Auth properly
   -  Handle all Better Auth routes

#### Step 3.2: Create User Endpoints

-  [ ] Create `app/api/user/me/route.ts`
   -  GET: Return current user with profile
-  [ ] Create `app/api/user/profile/route.ts`
   -  GET: Return user profile
   -  PATCH: Update user profile

#### Step 3.3: Create Health Check

-  [ ] Create `app/api/health/route.ts`
   -  Check MongoDB connection
   -  Return status

---

### Phase 4: Middleware & Protection

#### Step 4.1: Create Auth Middleware

-  [ ] Create `lib/middleware/auth.middleware.ts`
   -  `requireAuth()` - Protect API routes
   -  Helper functions for session validation

#### Step 4.2: Create Next.js Middleware

-  [ ] Create `middleware.ts` at root
   -  Protect `/dashboard` routes
   -  Redirect unauthenticated users to `/login`
   -  Redirect authenticated users away from `/login`, `/register`

---

### Phase 5: Frontend Pages

#### Step 5.1: Create Login Page

-  [ ] Create `app/(auth)/login/page.tsx`
   -  Email/password form
   -  Form validation with Zod
   -  Error handling
   -  Link to register

#### Step 5.2: Update Register Page

-  [ ] Update `app/(auth)/register/page.tsx`
   -  Add proper error handling
   -  Add success feedback
   -  Redirect after registration

#### Step 5.3: Create Dashboard

-  [ ] Create `app/(dashboard)/layout.tsx`
   -  Dashboard layout with sidebar
   -  User menu with logout
-  [ ] Create `app/(dashboard)/dashboard/page.tsx`
   -  Welcome message
   -  User stats

#### Step 5.4: Create Profile Page

-  [ ] Create `app/(dashboard)/profile/page.tsx`
   -  View profile
   -  Edit profile form
   -  Update avatar

---

### Phase 6: Testing & Polish

#### Step 6.1: Manual Testing

-  [ ] Test registration flow
-  [ ] Test login flow
-  [ ] Test logout flow
-  [ ] Test protected routes
-  [ ] Test profile updates

#### Step 6.2: Error Handling

-  [ ] Test invalid credentials
-  [ ] Test duplicate email
-  [ ] Test expired session
-  [ ] Test network errors

---

## 9. Testing Guide

### 9.1 Manual Testing Checklist

#### Registration Testing

-  [ ] Can register with valid email, password, name
-  [ ] Cannot register with existing email
-  [ ] Cannot register with invalid email format
-  [ ] Cannot register with password < 8 characters
-  [ ] Cannot register without name
-  [ ] Session created after registration
-  [ ] Redirected to dashboard after registration

#### Login Testing

-  [ ] Can login with correct credentials
-  [ ] Cannot login with wrong password
-  [ ] Cannot login with non-existent email
-  [ ] Session created after login
-  [ ] `lastLoginAt` updated in database
-  [ ] Redirected to dashboard after login

#### Logout Testing

-  [ ] Can logout successfully
-  [ ] Session destroyed in database
-  [ ] Cookie cleared
-  [ ] Redirected to homepage

#### Protected Routes Testing

-  [ ] Cannot access `/dashboard` without login
-  [ ] Redirected to `/login` when accessing `/dashboard` unauthenticated
-  [ ] Can access `/dashboard` when authenticated
-  [ ] Session persists across page refreshes

#### Profile Testing

-  [ ] Can view profile data
-  [ ] Can update bio
-  [ ] Can update phone number
-  [ ] Can update address
-  [ ] Profile updates reflected in database
-  [ ] Validation errors shown for invalid data

### 9.2 Database Testing

```bash
# Connect to MongoDB
mongosh mongodb://127.0.0.1:27017/synos-db

# Check Better Auth collections
db.user.find().pretty()
db.session.find().pretty()
db.account.find().pretty()

# Check Mongoose collections
db.users.find().pretty()
db.profiles.find().pretty()

# Verify user-profile relationship
db.users.aggregate([
  {
    $lookup: {
      from: "profiles",
      localField: "_id",
      foreignField: "userId",
      as: "profile"
    }
  }
])
```

### 9.3 API Testing with curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt

# Get current user (with session cookie)
curl -X GET http://localhost:3000/api/user/me \
  -b cookies.txt

# Update profile
curl -X PATCH http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "bio": "Updated bio text",
    "phoneNumber": "+46701234567"
  }'

# Logout
curl -X POST http://localhost:3000/api/auth/sign-out \
  -b cookies.txt
```

---

## 10. Deployment Checklist

### 10.1 Pre-Deployment

-  [ ] Set `NODE_ENV=production`
-  [ ] Generate new `BETTER_AUTH_SECRET` for production
-  [ ] Update `BETTER_AUTH_URL` to production domain
-  [ ] Update `MONGODB_URI` to production MongoDB (MongoDB Atlas)
-  [ ] Remove all `console.logconsole.log` statements
-  [ ] Test in production-like environment

### 10.2 Security Checklist

-  [ ] HTTPS enabled (SSL certificate)
-  [ ] Environment variables secured (not in git)
-  [ ] Database credentials rotated
-  [ ] Secure cookies enabled (`useSecureCookies: true`)
-  [ ] CORS configured correctly
-  [ ] Rate limiting enabled (future)

### 10.3 Database Setup

-  [ ] Create MongoDB Atlas cluster (or production MongoDB)
-  [ ] Configure IP whitelist
-  [ ] Create database user with appropriate permissions
-  [ ] Set up database backups
-  [ ] Create indexes (automatically created by Mongoose)

### 10.4 Monitoring

-  [ ] Set up error logging (Sentry, LogRocket, etc.)
-  [ ] Monitor database performance
-  [ ] Set up uptime monitoring
-  [ ] Configure alerts for errors

---

## 11. Appendix

### 11.1 Common Issues & Solutions

**Issue:** "Cannot connect to MongoDB"

-  **Solution:** Check `MONGODB_URI` is correct, MongoDB server is running

**Issue:** "Session not persisting"

-  **Solution:** Check cookies are being set, verify `BETTER_AUTH_URL` matches your domain

**Issue:** "User created in Better Auth but not in Mongoose"

-  **Solution:** Check service layer is being called, verify database connection

**Issue:** "TypeScript errors in repositories"

-  **Solution:** Ensure `connectMongoose()` is called, check model exports

### 11.2 Environment Variables Reference

```bash
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
MONGODB_DB=synos-db

# Better Auth
BETTER_AUTH_SECRET=your_secret_here_generate_with_openssl
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### 11.3 Useful Commands

```bash
# Start MongoDB locally
mongod --dbpath /path/to/data

# Connect to MongoDB
mongosh mongodb://127.0.0.1:27017/synos-db

# Generate Better Auth secret
openssl rand -base64 32

# Run Next.js dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

**Document Version:** 1.0
**Last Updated:** December 2, 2025
**Author:** Claude (Anthropic AI Assistant)
**Project:** Synos Medical Authentication System

---
