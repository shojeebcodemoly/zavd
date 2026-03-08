# User Data Fetching from MongoDB - Complete Documentation

**Project:** Synos Medical Web Application
**Feature:** User Registration, Authentication, and Data Fetching
**Date:** December 3, 2025
**Version:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Overview](#architecture-overview)
3. [Database Schema Design](#database-schema-design)
4. [User Registration Flow](#user-registration-flow)
5. [User Login Flow](#user-login-flow)
6. [User Data Fetching Flow](#user-data-fetching-flow)
7. [Session Management](#session-management)
8. [Implementation Details](#implementation-details)
9. [Troubleshooting Guide](#troubleshooting-guide)
10.   [Best Practices](#best-practices)

---

## 1. Overview

### 1.1 Purpose

This document provides a comprehensive guide to understanding and implementing the user data fetching mechanism in the Synos Medical application. It covers the complete flow from user registration to authenticated data retrieval.

### 1.2 Key Components

The system uses a **hybrid approach** combining:

-  **Better Auth**: Handles authentication, password hashing, and session management
-  **MongoDB (via native driver)**: Stores Better Auth data (users, sessions, accounts)
-  **Mongoose**: Manages application-specific data (extended user info, profiles)

### 1.3 Why This Approach?

**Industrial Best Practice: Separation of Concerns**

```
┌─────────────────────────────────────────────────────────────┐
│  Better Auth (Authentication Layer)                         │
│  - Handles security (password hashing, session tokens)      │
│  - Manages authentication state                             │
│  - Industry-proven authentication patterns                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Provides authenticated user.id
                  │
┌─────────────────▼───────────────────────────────────────────┐
│  Application Layer (Business Logic)                         │
│  - Uses Better Auth ID as primary reference                 │
│  - Stores additional user data                              │
│  - Implements business-specific features                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Overview

### 2.1 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION                         │
└───────────────────┬──────────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │  1. Client: authClient.signUp │
    │     (email, password, name)   │
    └───────────┬───────────────────┘
                │
                ▼
    ┌───────────────────────────────────────┐
    │  2. Better Auth: Create User          │
    │     - Hash password                   │
    │     - Create in 'user' collection     │
    │     - Generate session token          │
    │     - Set cookies                     │
    │     - Return user.id                  │
    └───────────┬───────────────────────────┘
                │
                ▼
    ┌───────────────────────────────────────┐
    │  3. Auth Service Hook:                │
    │     - Receive Better Auth user.id     │
    │     - Create Mongoose user record     │
    │     - Link via betterAuthUserId       │
    │     - Create default profile          │
    └───────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      USER LOGIN                              │
└───────────────────┬──────────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │  1. Client: authClient.signIn │
    │     (email, password)         │
    └───────────┬───────────────────┘
                │
                ▼
    ┌───────────────────────────────────────┐
    │  2. Better Auth: Verify Credentials   │
    │     - Find user by email              │
    │     - Verify password hash            │
    │     - Create session                  │
    │     - Set cookies                     │
    │     - Return session + user.id        │
    └───────────┬───────────────────────────┘
                │
                ▼
    ┌───────────────────────────────────────┐
    │  3. Update Last Login:                │
    │     - Find Mongoose user by           │
    │       betterAuthUserId                │
    │     - Update lastLoginAt              │
    └───────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   USER DATA FETCHING                         │
└───────────────────┬──────────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  1. Client: Request /api/user/me │
    │     with session cookie           │
    └───────────┬───────────────────────┘
                │
                ▼
    ┌───────────────────────────────────────┐
    │  2. API Route:                        │
    │     - Extract session from cookies    │
    │     - Verify with Better Auth         │
    │     - Get authenticated user.id       │
    └───────────┬───────────────────────────┘
                │
                ▼
    ┌───────────────────────────────────────┐
    │  3. User Service:                     │
    │     getUserWithProfile(user.id)       │
    │     - Find Mongoose user by           │
    │       betterAuthUserId                │
    │     - Populate profile relation       │
    │     - Return user + profile           │
    └───────────────────────────────────────┘
```

### 2.2 Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (React Components)                      │
│  - Login/Register Forms                                     │
│  - Dashboard Pages                                          │
│  - Profile Management                                       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/Fetch Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  API LAYER (Next.js Route Handlers)                         │
│  - app/api/auth/[...all]/route.ts (Better Auth)            │
│  - app/api/user/me/route.ts (Get current user)             │
│  - app/api/user/profile/route.ts (Profile CRUD)            │
└────────────────────────┬────────────────────────────────────┘
                         │ Calls
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  SERVICE LAYER (Business Logic)                             │
│  - lib/services/auth.service.ts                             │
│  - lib/services/user.service.ts                             │
│  Purpose: Orchestrate complex operations, enforce rules     │
└────────────────────────┬────────────────────────────────────┘
                         │ Uses
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  REPOSITORY LAYER (Data Access)                             │
│  - lib/repositories/user.repository.ts                      │
│  - lib/repositories/profile.repository.ts                   │
│  Purpose: Abstract database operations, enable testability  │
└────────────────────────┬────────────────────────────────────┘
                         │ Queries
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  DATA LAYER (Models & Connections)                          │
│  - models/user.model.ts (Mongoose Schema)                   │
│  - models/profile.model.ts (Mongoose Schema)                │
│  - lib/db/mongo.ts (MongoDB Native Client)                 │
│  - lib/db/db-connect.ts (Mongoose Connection)              │
│  - lib/db/auth.ts (Better Auth Instance)                   │
└────────────────────────┬────────────────────────────────────┘
                         │ Connects to
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  DATABASE (MongoDB)                                          │
│  Collections:                                                │
│  - user (Better Auth)                                        │
│  - session (Better Auth)                                     │
│  - account (Better Auth)                                     │
│  - users (Mongoose - Extended user data)                    │
│  - profiles (Mongoose - User profiles)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema Design

### 3.1 Collections Overview

#### Better Auth Collections (Managed Automatically)

**Collection: `user`**

```javascript
{
  _id: ObjectId("674e1234567890abcdef1234"),
  id: "user_clx7k8j9f0000",              console.logBetter Auth generated ID (PRIMARY KEY)
  email: "user@example.com",             console.logUnique, indexed
  emailVerified: true,
  name: "John Doe",
  image: null,
  createdAt: ISODate("2025-12-01T10:00:00Z"),
  updatedAt: ISODate("2025-12-01T10:00:00Z")
}
```

**Collection: `session`**

```javascript
{
  _id: ObjectId("674e1234567890abcdef5678"),
  id: "session_clx7k9j9f0001",
  userId: "user_clx7k8j9f0000",           console.logReferences user.id
  token: "encrypted_session_token",
  expiresAt: ISODate("2025-12-08T10:00:00Z"), console.log7 days from creation
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  createdAt: ISODate("2025-12-01T10:00:00Z")
}
```

**Collection: `account`**

```javascript
{
  _id: ObjectId("674e1234567890abcdef9012"),
  id: "account_clx7k9j9f0002",
  userId: "user_clx7k8j9f0000",           console.logReferences user.id
  accountId: "user@example.com",
  providerId: "credential",               console.log'credential' for email/password
  password: "$2a$10$hashed_password...",  console.logBcrypt hashed
  createdAt: ISODate("2025-12-01T10:00:00Z")
}
```

---

#### Mongoose Collections (Application-Specific)

**Collection: `users`**

```typescript
{
  _id: ObjectId("674e1234567890abcdef3456"),
  email: "user@example.com",             console.logIndexed, unique, lowercase
  name: "John Doe",
  emailVerified: true,
  image: null,
  betterAuthUserId: "user_clx7k8j9f0000", console.logFOREIGN KEY to Better Auth user.id
  lastLoginAt: ISODate("2025-12-01T15:30:00Z"),
  createdAt: ISODate("2025-12-01T10:00:00Z"),
  updatedAt: ISODate("2025-12-01T15:30:00Z")
}
```

**Indexes:**

```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ betterAuthUserId: 1 }, { unique: true, sparse: true });
db.users.createIndex({ createdAt: -1 });
```

**Collection: `profiles`**

```typescript
{
  _id: ObjectId("674e1234567890abcdef7890"),
  userId: ObjectId("674e1234567890abcdef3456"), console.logFOREIGN KEY to users._id
  bio: "Healthcare professional passionate about medical technology",
  avatarUrl: "https://cdn.example.com/avatars/user123.jpg",
  phoneNumber: "+46701234567",
  address: {
    street: "Storgatan 1",
    city: "Stockholm",
    postalCode: "111 22",
    country: "Sweden"
  },
  createdAt: ISODate("2025-12-01T10:00:00Z"),
  updatedAt: ISODate("2025-12-02T14:20:00Z")
}
```

**Indexes:**

```javascript
db.profiles.createIndex({ userId: 1 }, { unique: true });
```

### 3.2 Entity Relationship Diagram

```
┌──────────────────────────────────────────┐
│  Better Auth: user                       │
│  (Authentication Provider)               │
├──────────────────────────────────────────┤
│  id (PK) "user_clx7k8j9f0000"           │ ◄─── PRIMARY KEY (Better Auth ID)
│  email: "user@example.com"               │
│  emailVerified: true                     │
│  name: "John Doe"                        │
│  image: null                             │
│  createdAt, updatedAt                    │
└───────────┬──────────────────────────────┘
            │
            │ Referenced by
            │
┌───────────▼──────────────────────────────┐
│  Mongoose: users                         │
│  (Extended User Information)             │
├──────────────────────────────────────────┤
│  _id (PK) ObjectId                       │ ◄─── Mongoose Document ID
│  email: "user@example.com"               │
│  name: "John Doe"                        │
│  emailVerified: true                     │
│  image: null                             │
│  betterAuthUserId (FK) ──────────────────┼──► Links to Better Auth user.id
│  lastLoginAt: Date                       │     (CRITICAL RELATIONSHIP)
│  createdAt, updatedAt                    │
└───────────┬──────────────────────────────┘
            │
            │ One-to-One relationship
            │
┌───────────▼──────────────────────────────┐
│  Mongoose: profiles                      │
│  (User Profile Data)                     │
├──────────────────────────────────────────┤
│  _id (PK) ObjectId                       │
│  userId (FK) ─────────────────────────────┼──► Links to users._id
│  bio: String                             │
│  avatarUrl: String                       │
│  phoneNumber: String                     │
│  address: {                              │
│    street, city, postalCode, country     │
│  }                                       │
│  createdAt, updatedAt                    │
└──────────────────────────────────────────┘
```

### 3.3 Key Relationships

**Critical Understanding:**

1. **Better Auth → Mongoose Users**

   -  `user.id` (Better Auth) ← → `users.betterAuthUserId` (Mongoose)
   -  This is the **primary link** between authentication and application data
   -  When Better Auth authenticates, we get `user.id`, which we use to find our Mongoose user

2. **Mongoose Users → Profiles**

   -  `users._id` (Mongoose) ← → `profiles.userId` (Mongoose)
   -  Standard Mongoose relationship using ObjectId references
   -  One user has exactly one profile

3. **Data Fetching Flow**
   ```
   Session Cookie → Better Auth validates → user.id
                                             ↓
   user.id → Find Mongoose user by betterAuthUserId
                                             ↓
   users._id → Populate profile by userId
                                             ↓
   Return complete user + profile data
   ```

---

## 4. User Registration Flow

### 4.1 Step-by-Step Registration Process

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: User Submits Registration Form                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    Component: app/(auth)/register/page.tsx
    ┌──────────────────────────────────────┐
    │ const handleRegister = async () => { │
    │   await authClient.signUp({          │
    │     email: "user@example.com",       │
    │     password: "SecurePass123!",      │
    │     name: "John Doe"                 │
    │   })                                 │
    │ }                                    │
    └────────────┬─────────────────────────┘
                 │
                 │ POST /api/auth/sign-up
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Better Auth Handles Authentication                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    File: app/api/auth/[...all]/route.ts
    ┌──────────────────────────────────────┐
    │ import { auth } from "@/lib/db/auth" │
    │                                      │
    │ export const { GET, POST } =         │
    │   await auth.handler                 │
    └────────────┬─────────────────────────┘
                 │
                 │ Better Auth internally:
                 ▼
    ┌─────────────────────────────────────────────────┐
    │ 1. Validate email format and uniqueness         │
    │ 2. Hash password with bcrypt (10 rounds)        │
    │ 3. Insert into 'user' collection:               │
    │    {                                            │
    │      id: "user_clx7k8j9f0000",  ← Generated ID │
    │      email: "user@example.com",                 │
    │      emailVerified: false,                      │
    │      name: "John Doe"                           │
    │    }                                            │
    │ 4. Insert into 'account' collection:            │
    │    {                                            │
    │      userId: "user_clx7k8j9f0000",             │
    │      providerId: "credential",                  │
    │      password: "$2a$10$hashed..."              │
    │    }                                            │
    │ 5. Create session in 'session' collection       │
    │ 6. Set HTTP-only cookie: synos.session_token   │
    │ 7. Return user object with user.id              │
    └────────────┬────────────────────────────────────┘
                 │
                 │ CRITICAL: user.id is now available
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Create Mongoose User Record (Auth Service Hook)    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    File: lib/services/auth.service.ts
    ┌──────────────────────────────────────────────────┐
    │ async createMongooseUser(betterAuthUser) {       │
    │   console.logFind if user already exists                 │
    │   let user = await userRepository                │
    │     .findByBetterAuthId(betterAuthUser.id)       │
    │                                                  │
    │   if (!user) {                                   │
    │     console.logCreate new Mongoose user                  │
    │     user = await userRepository.create({         │
    │       email: betterAuthUser.email,               │
    │       name: betterAuthUser.name,                 │
    │       emailVerified: betterAuthUser.emailVerified│
    │       image: betterAuthUser.image,               │
    │       betterAuthUserId: betterAuthUser.id ← KEY! │
    │     })                                           │
    │   }                                              │
    │   return user                                    │
    │ }                                                │
    └────────────┬─────────────────────────────────────┘
                 │
                 │ Result: Mongoose user created
                 ▼
    MongoDB 'users' collection now contains:
    ┌──────────────────────────────────────────┐
    │ {                                        │
    │   _id: ObjectId("674e...3456"),         │
    │   email: "user@example.com",            │
    │   name: "John Doe",                     │
    │   emailVerified: false,                 │
    │   betterAuthUserId: "user_clx7k8j9f0000"│ ← Links to Better Auth
    │ }                                        │
    └────────────┬───────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: Create Default Profile                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    File: lib/services/auth.service.ts
    ┌──────────────────────────────────────────────────┐
    │ async createDefaultProfile(userId) {             │
    │   const profile = await profileRepository        │
    │     .createForUser(userId, {                     │
    │       bio: "",                                   │
    │       avatarUrl: null,                           │
    │       phoneNumber: null,                         │
    │       address: {}                                │
    │     })                                           │
    │   return profile                                 │
    │ }                                                │
    └────────────┬─────────────────────────────────────┘
                 │
                 │ Result: Profile created
                 ▼
    MongoDB 'profiles' collection now contains:
    ┌──────────────────────────────────────────┐
    │ {                                        │
    │   _id: ObjectId("674e...7890"),         │
    │   userId: ObjectId("674e...3456"), ← Links to users._id
    │   bio: "",                              │
    │   avatarUrl: null,                      │
    │   phoneNumber: null,                    │
    │   address: {}                           │
    │ }                                        │
    └──────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: Registration Complete - User Logged In             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Registration Code Implementation

**File: `lib/services/auth.service.ts`**

```typescript
import { userRepository } from "@/lib/repositories/user.repository";
import { profileRepository } from "@/lib/repositories/profile.repository";
import { logger } from "@/lib/utils/logger";

class AuthService {
	/**
	 * Called after Better Auth creates a user
	 * Creates corresponding Mongoose user and profile
	 */
	async handleUserRegistration(betterAuthUser: {
		id: string;
		email: string;
		name: string;
		emailVerified: boolean;
		image?: string;
	}) {
		try {
			console.logStep 1: Create Mongoose user
			logger.info("Creating Mongoose user for Better Auth user", {
				betterAuthUserId: betterAuthUser.id,
			});

			const mongooseUser = await userRepository.create({
				email: betterAuthUser.email.toLowerCase(),
				name: betterAuthUser.name,
				emailVerified: betterAuthUser.emailVerified,
				image: betterAuthUser.image || null,
				betterAuthUserId: betterAuthUser.id, console.logCritical link!
			});

			logger.info("Mongoose user created", {
				mongooseUserId: mongooseUser._id,
				betterAuthUserId: betterAuthUser.id,
			});

			console.logStep 2: Create default profile
			const profile = await profileRepository.createForUser(
				mongooseUser._id,
				{
					bio: "",
					avatarUrl: null,
					phoneNumber: null,
					address: {
						street: "",
						city: "",
						postalCode: "",
						country: "",
					},
				}
			);

			logger.info("Profile created for user", {
				profileId: profile._id,
				userId: mongooseUser._id,
			});

			return { user: mongooseUser, profile };
		} catch (error) {
			logger.error("Error in handleUserRegistration", error);
			throw error;
		}
	}
}

export const authService = new AuthService();
```

---

## 5. User Login Flow

### 5.1 Step-by-Step Login Process

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: User Submits Login Form                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    Component: app/(auth)/login/page.tsx
    ┌──────────────────────────────────────┐
    │ const handleLogin = async () => {    │
    │   await authClient.signIn({          │
    │     email: "user@example.com",       │
    │     password: "SecurePass123!"       │
    │   })                                 │
    │ }                                    │
    └────────────┬─────────────────────────┘
                 │
                 │ POST /api/auth/sign-in
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Better Auth Validates Credentials                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    File: app/api/auth/[...all]/route.ts (Better Auth handler)
    ┌──────────────────────────────────────────────────┐
    │ Better Auth internally:                          │
    │ 1. Find user in 'user' collection by email       │
    │ 2. Get account from 'account' collection         │
    │ 3. Compare password hash with bcrypt             │
    │ 4. If valid:                                     │
    │    - Create new session in 'session' collection  │
    │    - Generate session token                      │
    │    - Set cookies:                                │
    │      * synos.session_token                       │
    │      * synos.session_data                        │
    │    - Return session + user object                │
    └────────────┬─────────────────────────────────────┘
                 │
                 │ Session created with user.id
                 ▼
    Response:
    ┌──────────────────────────────────────────┐
    │ {                                        │
    │   user: {                                │
    │     id: "user_clx7k8j9f0000",           │
    │     email: "user@example.com",          │
    │     name: "John Doe"                    │
    │   },                                    │
    │   session: {                            │
    │     token: "...",                       │
    │     expiresAt: "2025-12-08T10:00:00Z"  │
    │   }                                     │
    │ }                                       │
    └────────────┬───────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Update Last Login (Optional but Recommended)       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    File: lib/services/user.service.ts
    ┌──────────────────────────────────────────────────┐
    │ async updateLastLogin(betterAuthUserId) {        │
    │   console.logFind Mongoose user by Better Auth ID        │
    │   const user = await userRepository              │
    │     .findByBetterAuthId(betterAuthUserId)        │
    │                                                  │
    │   if (user) {                                    │
    │     await userRepository.updateById(user._id, {  │
    │       $set: { lastLoginAt: new Date() }          │
    │     })                                           │
    │   }                                              │
    │ }                                                │
    └──────────────────────────────────────────────────┘
```

### 5.2 Session Cookie Structure

**Cookie Name:** `synos.session_token` (primary session identifier)
**Cookie Name:** `synos.session_data` (encrypted session data)

**Properties:**

```javascript
{
  name: "synos.session_token",
  value: "encrypted_token_string",
  httpOnly: true,      console.logPrevents JavaScript access (XSS protection)
  secure: true,        console.logHTTPS only in production
  sameSite: "lax",     console.logCSRF protection
  maxAge: 604800,      console.log7 days in seconds
  path: "/"            console.logAvailable site-wide
}
```

---

## 6. User Data Fetching Flow

### 6.1 Complete Data Retrieval Process

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Client Requests User Data                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    Component: Any authenticated page
    ┌──────────────────────────────────────┐
    │ useEffect(() => {                    │
    │   fetch('/api/user/me', {            │
    │     credentials: 'include' ← Sends cookies
    │   })                                 │
    │ }, [])                               │
    └────────────┬─────────────────────────┘
                 │
                 │ GET /api/user/me
                 │ Headers: Cookie: synos.session_token=...
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: API Route Validates Session                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    File: app/api/user/me/route.ts
    ┌──────────────────────────────────────────────────┐
    │ export async function GET(request: NextRequest) {│
    │   console.logGet Better Auth instance                    │
    │   const auth = await getAuth()                   │
    │                                                  │
    │   console.logValidate session from cookies               │
    │   const session = await auth.api.getSession({    │
    │     headers: request.headers  ← Extracts cookies │
    │   })                                             │
    │                                                  │
    │   if (!session || !session.user) {               │
    │     return unauthorizedResponse()                │
    │   }                                              │
    │                                                  │
    │   console.logsession.user.id is the Better Auth user ID  │
    │   console.logconsole.log("Authenticated user:", session.user.id)
    │ }                                                │
    └────────────┬─────────────────────────────────────┘
                 │
                 │ session.user.id = "user_clx7k8j9f0000"
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Call User Service to Fetch Data                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    File: app/api/user/me/route.ts
    ┌──────────────────────────────────────────────────┐
    │ const { user, profile } =                        │
    │   await userService.getUserWithProfile(          │
    │     session.user.id  ← Better Auth ID            │
    │   )                                              │
    └────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: User Service Fetches from MongoDB                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    File: lib/services/user.service.ts
    ┌──────────────────────────────────────────────────┐
    │ async getUserWithProfile(betterAuthUserId) {     │
    │   console.logFind Mongoose user by Better Auth ID        │
    │   const user = await userRepository              │
    │     .findByBetterAuthIdWithProfile(              │
    │       betterAuthUserId                           │
    │     )                                            │
    │                                                  │
    │   if (!user) {                                   │
    │     throw new NotFoundError("User not found")    │
    │   }                                              │
    │                                                  │
    │   console.logGet or create profile                       │
    │   const profile = await profileRepository        │
    │     .findOrCreateForUser(user._id)               │
    │                                                  │
    │   return { user, profile }                       │
    │ }                                                │
    └────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: Repository Queries MongoDB                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    File: lib/repositories/user.repository.ts
    ┌──────────────────────────────────────────────────────┐
    │ async findByBetterAuthIdWithProfile(betterAuthUserId)│
    │ {                                                    │
    │   await this.ensureConnection()                      │
    │                                                      │
    │   const user = await this.model                      │
    │     .findOne({                                       │
    │       betterAuthUserId: betterAuthUserId ← CRITICAL  │
    │     })                                               │
    │     .populate('profile')  ← Join with profiles       │
    │     .exec()                                          │
    │                                                      │
    │   return user                                        │
    │ }                                                    │
    └────────────┬─────────────────────────────────────────┘
                 │
                 │ MongoDB Query:
                 ▼
    ┌──────────────────────────────────────────────────────┐
    │ db.users.findOne({                                   │
    │   betterAuthUserId: "user_clx7k8j9f0000"            │
    │ })                                                   │
    │                                                      │
    │ console.logThen populate profile:                            │
    │ db.profiles.findOne({                                │
    │   userId: ObjectId("674e...3456")                   │
    │ })                                                   │
    └────────────┬───────────────────────────────────────────┘
                 │
                 │ Result:
                 ▼
    ┌──────────────────────────────────────────────────────┐
    │ {                                                    │
    │   _id: ObjectId("674e...3456"),                     │
    │   email: "user@example.com",                        │
    │   name: "John Doe",                                 │
    │   betterAuthUserId: "user_clx7k8j9f0000",          │
    │   profile: {  ← Populated                           │
    │     _id: ObjectId("674e...7890"),                   │
    │     userId: ObjectId("674e...3456"),                │
    │     bio: "Healthcare professional",                 │
    │     avatarUrl: "https://...",                       │
    │     phoneNumber: "+46701234567",                    │
    │     address: { ... }                                │
    │   }                                                 │
    │ }                                                   │
    └────────────┬───────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 6: Return Data to Client                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    API Response:
    ┌──────────────────────────────────────────────────────┐
    │ {                                                    │
    │   success: true,                                     │
    │   data: {                                            │
    │     user: {                                          │
    │       _id: "674e...3456",                           │
    │       email: "user@example.com",                    │
    │       name: "John Doe",                             │
    │       emailVerified: true,                          │
    │       image: null,                                  │
    │       lastLoginAt: "2025-12-01T15:30:00Z",         │
    │       createdAt: "2025-12-01T10:00:00Z",           │
    │       updatedAt: "2025-12-01T15:30:00Z"            │
    │     },                                              │
    │     profile: {                                      │
    │       _id: "674e...7890",                          │
    │       userId: "674e...3456",                       │
    │       bio: "Healthcare professional",               │
    │       avatarUrl: "https://...",                     │
    │       phoneNumber: "+46701234567",                  │
    │       address: {                                    │
    │         street: "Storgatan 1",                      │
    │         city: "Stockholm",                          │
    │         postalCode: "111 22",                       │
    │         country: "Sweden"                           │
    │       },                                            │
    │       createdAt: "2025-12-01T10:00:00Z",           │
    │       updatedAt: "2025-12-02T14:20:00Z"            │
    │     }                                               │
    │   }                                                 │
    │ }                                                   │
    └──────────────────────────────────────────────────────┘
```

### 6.2 Key Methods Explained

#### Method: `getUserWithProfile(betterAuthUserId: string)`

**Purpose:** Retrieve complete user data with profile based on Better Auth user ID

**Parameters:**

-  `betterAuthUserId`: The `id` field from Better Auth's user collection (e.g., "user_clx7k8j9f0000")

**Returns:**

```typescript
{
	user: IUser; console.logMongoose user document
	profile: IProfile; console.logMongoose profile document
}
```

**Implementation Strategy:**

1. **Find by Better Auth ID**: Use `betterAuthUserId` to locate Mongoose user
2. **Populate Profile**: Use Mongoose `.populate()` to join profile data
3. **Auto-create if Missing**: If profile doesn't exist, create default one
4. **Error Handling**: Throw NotFoundError if user doesn't exist

**Why this approach?**

-  ✅ **Single Source of Truth**: Better Auth ID is the primary identifier
-  ✅ **Session-driven**: Works seamlessly with Better Auth sessions
-  ✅ **Decoupled**: Application data separate from auth data
-  ✅ **Scalable**: Easy to add more related collections

---

## 7. Session Management

### 7.1 Session Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│  SESSION CREATION (Login/Registration)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    Better Auth creates session:
    ┌──────────────────────────────────────────────────────┐
    │ 1. Generate unique session ID                        │
    │ 2. Generate encrypted token                          │
    │ 3. Insert into 'session' collection:                 │
    │    {                                                 │
    │      id: "session_clx7k9j9f0001",                   │
    │      userId: "user_clx7k8j9f0000",                  │
    │      token: "encrypted_string",                      │
    │      expiresAt: Date.now() + 7 days,                │
    │      ipAddress: request.ip,                          │
    │      userAgent: request.userAgent                    │
    │    }                                                 │
    │ 4. Set HTTP-only cookies:                            │
    │    - synos.session_token (main token)                │
    │    - synos.session_data (encrypted user data)        │
    └──────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  SESSION VALIDATION (Every Protected Request)               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    On each request to protected endpoint:
    ┌──────────────────────────────────────────────────────┐
    │ 1. Extract session token from cookie                 │
    │ 2. Decrypt and verify token                          │
    │ 3. Query 'session' collection:                       │
    │    db.session.findOne({                              │
    │      token: decryptedToken                           │
    │    })                                                │
    │ 4. Check if session exists and not expired:          │
    │    if (session.expiresAt < Date.now()) {             │
    │      console.logSession expired                              │
    │      return null                                     │
    │    }                                                 │
    │ 5. Get user data from Better Auth 'user' collection  │
    │ 6. Return session + user object                      │
    └──────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  SESSION REFRESH (Every 24 hours)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    If session is older than 24 hours (updateAge):
    ┌──────────────────────────────────────────────────────┐
    │ 1. Update session expiration:                         │
    │    db.session.updateOne(                             │
    │      { id: sessionId },                              │
    │      { $set: {                                       │
    │          expiresAt: Date.now() + 7 days              │
    │        }                                             │
    │      }                                               │
    │    )                                                 │
    │ 2. Refresh cookie maxAge                             │
    └──────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  SESSION TERMINATION (Logout)                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
    authClient.signOut() triggers:
    ┌──────────────────────────────────────────────────────┐
    │ 1. Delete from 'session' collection:                  │
    │    db.session.deleteOne({ token: sessionToken })     │
    │ 2. Clear cookies:                                     │
    │    - synos.session_token (set maxAge=0)              │
    │    - synos.session_data (set maxAge=0)               │
    │ 3. Redirect to /login or homepage                     │
    └──────────────────────────────────────────────────────┘
```

### 7.2 Cookie Configuration Details

**File: `lib/db/auth.ts`**

```typescript
export async function getAuth() {
	authInstance = betterAuth({
		advanced: {
			cookiePrefix: "synos", console.logResults in "synos.session_token"
			useSecureCookies: process.env.NODE_ENV === "production",
		},
		session: {
			expiresIn: 60 * 60 * 24 * 7, console.log7 days in seconds
			updateAge: 60 * 60 * 24, console.logRefresh after 24 hours
			cookieCache: {
				enabled: true,
				maxAge: 60 * 5, console.logCache for 5 minutes
			},
		},
	});
}
```

**Resulting Cookies:**

1. **synos.session_token**

   -  Contains: Encrypted session token
   -  HttpOnly: Yes (JavaScript cannot access)
   -  Secure: Yes (production only - HTTPS)
   -  SameSite: Lax
   -  MaxAge: 604800 seconds (7 days)

2. **synos.session_data** (Optional)
   -  Contains: Encrypted user data for quick access
   -  Same security properties as session_token
   -  Reduces database queries for basic user info

---

## 8. Implementation Details

### 8.1 Critical Files and Their Roles

#### 1. Authentication Configuration

**File:** `lib/db/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getMongoClient } from "./mongo";

export async function getAuth() {
	const client = await getMongoClient();
	const db = client.db(process.env.MONGODB_DB || "synos-db");

	authInstance = betterAuth({
		appName: "Synos Medical",
		baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
		secret: process.env.BETTER_AUTH_SECRET!,

		database: mongodbAdapter(db), console.logUses native MongoDB driver

		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
			minPasswordLength: 8,
		},

		session: {
			expiresIn: 60 * 60 * 24 * 7, console.log7 days
			updateAge: 60 * 60 * 24, console.logRefresh after 24 hours
		},

		advanced: {
			cookiePrefix: "synos", console.logCreates "synos.session_token"
			useSecureCookies: process.env.NODE_ENV === "production",
		},

		plugins: [nextCookies()],
	});

	return authInstance;
}
```

**Key Points:**

-  Uses MongoDB native driver (not Mongoose) for Better Auth tables
-  Singleton pattern prevents multiple instances
-  Cookie prefix creates `synos.session_token` and `synos.session_data`

#### 2. User Repository

**File:** `lib/repositories/user.repository.ts`

```typescript
export class UserRepository extends BaseRepository<IUser> {
	/**
	 * CRITICAL METHOD: Find Mongoose user by Better Auth ID
	 * This is the bridge between authentication and application data
	 */
	async findByBetterAuthId(betterAuthUserId: string): Promise<IUser | null> {
		try {
			return await this.findOne({ betterAuthUserId });
		} catch (error) {
			logger.error("Error finding user by Better Auth ID", error);
			throw error;
		}
	}

	/**
	 * Find user with profile populated
	 * Uses Mongoose virtual population
	 */
	async findByBetterAuthIdWithProfile(
		betterAuthUserId: string
	): Promise<IUser | null> {
		try {
			await this.ensureConnection();

			const user = await this.model
				.findOne({ betterAuthUserId })
				.populate("profile") console.logPopulates virtual field defined in schema
				.exec();

			return user;
		} catch (error) {
			logger.error("Error finding user with profile", error);
			throw error;
		}
	}
}
```

#### 3. User Service

**File:** `lib/services/user.service.ts`

```typescript
class UserService {
	/**
	 * Get user and profile by Better Auth user ID
	 * This is called by API routes after session validation
	 */
	async getUserWithProfile(betterAuthUserId: string): Promise<{
		user: IUser;
		profile: IProfile;
	}> {
		try {
			console.logFind Mongoose user by Better Auth ID
			const user = await userRepository.findByBetterAuthId(betterAuthUserId);

			if (!user) {
				throw new NotFoundError("User not found");
			}

			console.logGet or create profile
			const profile = await profileRepository.findOrCreateForUser(user._id);

			return { user, profile };
		} catch (error) {
			logger.error("Error getting user with profile", error);

			if (error instanceof NotFoundError) {
				throw error;
			}

			throw new DatabaseError("Failed to get user profile");
		}
	}
}
```

#### 4. API Route

**File:** `app/api/user/me/route.ts`

```typescript
export async function GET(request: NextRequest) {
	try {
		console.logGet Better Auth instance
		const auth = await getAuth();

		console.logValidate session from request headers (includes cookies)
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		console.logCheck authentication
		if (!session || !session.user) {
			return unauthorizedResponse("Unauthorized");
		}

		console.logFetch user data using Better Auth user ID
		const { user, profile } = await userService.getUserWithProfile(
			session.user.id console.logThis is the Better Auth user.id
		);

		return successResponse({ user, profile });
	} catch (error) {
		logger.error("Error in GET /api/user/me", error);
		return internalServerErrorResponse("Internal server error");
	}
}
```

### 8.2 Mongoose Schema Configuration

**File:** `models/user.model.ts`

```typescript
const UserSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		image: {
			type: String,
			default: null,
		},
		betterAuthUserId: {
			console.logCRITICAL FIELD
			type: String,
			index: true,
			sparse: true, console.logAllows null but indexes non-null values
		},
		lastLoginAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true, console.logAuto-manages createdAt, updatedAt
		collection: "users", console.logExplicit collection name
	}
);

console.logIndexes for performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ betterAuthUserId: 1 }, { unique: true, sparse: true });
UserSchema.index({ createdAt: -1 });

console.logVirtual for profile (enables .populate('profile'))
UserSchema.virtual("profile", {
	ref: "Profile",
	localField: "_id",
	foreignField: "userId",
	justOne: true,
});

console.logInclude virtuals in JSON output
UserSchema.set("toJSON", {
	virtuals: true,
	transform: function (doc, ret) {
		delete ret.__v;
		return ret;
	},
});
```

**Schema Options Explained:**

-  **timestamps: true**: Automatically adds `createdAt` and `updatedAt` fields
-  **collection: "users"**: Explicitly sets MongoDB collection name
-  **unique: true**: Ensures no duplicate values (database-level constraint)
-  **lowercase: true**: Converts value to lowercase before saving
-  **trim: true**: Removes whitespace from string values
-  **index: true**: Creates database index for faster queries
-  **sparse: true**: Index only documents where field exists (allows nulls)
-  **default**: Sets default value if not provided
-  **ref: "Model"**: Sets up relationship for population
-  **virtuals**: Define computed fields not stored in database

---

## 9. Troubleshooting Guide

### 9.1 Issue: User Data Returns Null

**Symptom:**

```javascript
const { user, profile } = await userService.getUserWithProfile(session.user.id);
console.loguser is null
```

**Root Causes:**

1. **Mongoose User Not Created During Registration**

   -  **Check**: Verify `users` collection in MongoDB

   ```bash
   mongosh
   use synos-db
   db.users.find().pretty()
   ```

   -  **Solution**: Implement auth service hook to create Mongoose user after Better Auth registration

2. **betterAuthUserId Mismatch**

   -  **Check**: Compare Better Auth `user.id` with Mongoose `betterAuthUserId`

   ```javascript
   console.logBetter Auth user
   db.user.findOne({ email: "test@example.com" });
   console.logReturns: { id: "user_clx7k8j9f0000", ... }

   console.logMongoose user
   db.users.findOne({ email: "test@example.com" });
   console.logShould have: { betterAuthUserId: "user_clx7k8j9f0000", ... }
   ```

   -  **Solution**: Ensure `betterAuthUserId` is correctly saved during user creation

3. **Database Connection Issues**

   -  **Check**: Verify Mongoose connection

   ```typescript
   import mongoose from "mongoose";
   console.logconsole.log(
   	"Mongoose connection state:",
   	mongoose.connection.readyState
   );
   (console.log0 = disconnected),
   	(1 = connected),
   	(2 = connecting),
   	(3 = disconnecting);
   ```

   -  **Solution**: Ensure `connectMongoose()` is called before queries

4. **Wrong User ID Being Passed**
   -  **Check**: Log the ID being used
   ```typescript
   console.logconsole.log(
   	"Looking for user with betterAuthUserId:",
   	session.user.id
   );
   ```
   -  **Solution**: Verify you're passing Better Auth `user.id`, not Mongoose `_id`

### 9.2 Issue: Session Not Persisting

**Symptom:**

-  User logs in successfully but session is lost on page refresh

**Solutions:**

1. **Check Cookie Settings**

   ```typescript
   console.logIn lib/db/auth.ts
   advanced: {
   	useSecureCookies: process.env.NODE_ENV === "production";
   }
   ```

   -  In development with HTTP, cookies must NOT be secure
   -  In production with HTTPS, cookies MUST be secure

2. **Verify BETTER_AUTH_URL**

   ```bash
   # .env
   BETTER_AUTH_URL=http://localhost:3000  # Must match your dev URL
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

3. **Check Browser Cookies**
   -  Open DevTools → Application → Cookies
   -  Look for `synos.session_token` and `synos.session_data`
   -  Verify they have correct domain and expiration

### 9.3 Issue: Profile Not Found

**Symptom:**

```javascript
const profile = await profileRepository.findOrCreateForUser(user._id);
console.logprofile is null or throws error
```

**Solutions:**

1. **Auto-create Profile**

   ```typescript
   console.logIn profileRepository
   async findOrCreateForUser(userId: string | ObjectId): Promise<IProfile> {
     let profile = await this.findByUserId(userId);

     if (!profile) {
       profile = await this.createForUser(userId);
       logger.info("Created profile for user", { userId });
     }

     return profile;
   }
   ```

2. **Verify userId Type**
   ```typescript
   console.logEnsure userId is ObjectId, not string
   const objectId =
   	typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;
   ```

### 9.4 Debugging Checklist

When user data fetching fails, check in this order:

```
✓ 1. Is Better Auth user created in 'user' collection?
   → db.user.findOne({ email: "..." })

✓ 2. Is Mongoose user created in 'users' collection?
   → db.users.findOne({ email: "..." })

✓ 3. Does Mongoose user have betterAuthUserId set?
   → db.users.findOne({ email: "..." }).betterAuthUserId

✓ 4. Does betterAuthUserId match Better Auth user.id?
   → Compare values from steps 1 and 3

✓ 5. Is session valid and returning user.id?
   → Log session object in API route

✓ 6. Is Mongoose connection active?
   → Check mongoose.connection.readyState

✓ 7. Is profile created for the user?
   → db.profiles.findOne({ userId: ObjectId("...") })

✓ 8. Are indexes created?
   → db.users.getIndexes()
   → db.profiles.getIndexes()
```

---

## 10. Best Practices

### 10.1 Industrial Architecture Patterns

1. **Separation of Concerns**

   ```
   ✓ Authentication (Better Auth) ≠ User Data (Mongoose)
   ✓ Each layer has single responsibility
   ✓ Services orchestrate, repositories access data
   ```

2. **Single Source of Truth**

   ```
   ✓ Better Auth user.id is the primary identifier
   ✓ All references use betterAuthUserId
   ✓ No duplicate storage of auth data
   ```

3. **Fail-Safe Defaults**

   ```typescript
   console.logAlways create profile if missing
   const profile = await profileRepository.findOrCreateForUser(userId);

   console.logAlways validate before throwing
   if (!user) {
   	throw new NotFoundError("User not found");
   }
   ```

4. **Comprehensive Logging**
   ```typescript
   logger.info("User login", {
   	userId: user._id,
   	betterAuthUserId: session.user.id,
   });
   ```

### 10.2 Security Best Practices

1. **Never Expose Sensitive Data**

   ```typescript
   console.log✗ BAD
   return { user: rawUserDocument };

   console.log✓ GOOD
   return {
   	user: {
   		_id: user._id,
   		email: user.email,
   		name: user.name,
   		console.logNo password, session tokens, etc.
   	},
   };
   ```

2. **Always Validate Sessions**

   ```typescript
   const session = await auth.api.getSession({ headers: request.headers });
   if (!session?.user) {
   	return unauthorizedResponse();
   }
   ```

3. **Use HTTP-Only Cookies**
   ```typescript
   console.logConfigured in Better Auth
   advanced: {
   	useSecureCookies: process.env.NODE_ENV === "production";
   }
   ```

### 10.3 Performance Optimization

1. **Use Indexes**

   ```typescript
   UserSchema.index({ betterAuthUserId: 1 });
   ProfileSchema.index({ userId: 1 });
   ```

2. **Populate Only When Needed**

   ```typescript
   console.logDon't always populate
   const user = await userRepository.findById(id); console.logFast

   console.logPopulate only when needed
   const userWithProfile = await userRepository.findByIdWithProfile(id); console.logSlower but complete
   ```

3. **Cache Session Data**
   ```typescript
   session: {
     cookieCache: {
       enabled: true,
       maxAge: 60 * 5 console.log5 minutes
     }
   }
   ```

### 10.4 Error Handling

1. **Use Custom Errors**

   ```typescript
   import { NotFoundError, DatabaseError } from "@/lib/utils/api-error";

   if (!user) {
   	throw new NotFoundError("User not found");
   }
   ```

2. **Handle All Cases**
   ```typescript
   try {
   	const user = await userRepository.findById(id);
   } catch (error) {
   	if (error instanceof NotFoundError) {
   		console.logHandle not found specifically
   	} else if (error instanceof DatabaseError) {
   		console.logHandle database errors
   	} else {
   		console.logHandle unknown errors
   		logger.error("Unexpected error", error);
   	}
   }
   ```

---

## Appendix A: Quick Reference

### A.1 Key Concepts

| Concept                 | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| **Better Auth user.id** | Primary authentication identifier (e.g., "user_clx7k8j9f0000") |
| **Mongoose users.\_id** | Application user document ID (ObjectId)                        |
| **betterAuthUserId**    | Field linking Mongoose user to Better Auth user                |
| **Session Cookie**      | `synos.session_token` - HTTP-only, secure, 7-day expiry        |
| **Profile**             | Extended user data linked to Mongoose user.\_id                |

### A.2 Common Queries

```javascript
console.logFind Better Auth user
db.user.findOne({ email: "user@example.com" });

console.logFind Mongoose user by email
db.users.findOne({ email: "user@example.com" });

console.logFind Mongoose user by Better Auth ID
db.users.findOne({ betterAuthUserId: "user_clx7k8j9f0000" });

console.logFind profile for user
db.profiles.findOne({ userId: ObjectId("674e...") });

console.logJoin user with profile
db.users.aggregate([
	{ $match: { email: "user@example.com" } },
	{
		$lookup: {
			from: "profiles",
			localField: "_id",
			foreignField: "userId",
			as: "profile",
		},
	},
]);

console.logCheck active sessions
db.session.find({ userId: "user_clx7k8j9f0000" });

console.logClean expired sessions
db.session.deleteMany({ expiresAt: { $lt: new Date() } });
```

### A.3 Environment Variables

```bash
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/?directConnection=true
MONGODB_DB=synos-db

# Better Auth
BETTER_AUTH_SECRET=your_secret_key_here_32_chars_minimum
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

---

**Document Version:** 1.0
**Last Updated:** December 3, 2025
**Author:** Claude (Anthropic AI Assistant)
**Project:** Synos Medical - User Data Fetching Documentation

---
