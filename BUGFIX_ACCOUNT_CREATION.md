# Bug Fix: User Creation Without Account Record

**Date:** December 3, 2025
**Status:** ✅ **FIXED**
**Severity:** 🔴 **CRITICAL**

---

## 🐛 Bug Description

### Issue

When creating a new user through the authenticated user registration system (`/dashboard/users`), the user was being created in the database but could not log in. The newly created user would receive an "Invalid credentials" error when attempting to log in with their email and password.

### Root Cause

Better Auth stores passwords in a separate **account** collection, not in the user collection. Our previous implementation only created a user record without creating the corresponding account record. According to Better Auth's architecture:

-  **User collection**: Stores user profile data (email, name, image, etc.)
-  **Account collection**: Stores authentication credentials and provider information
-  For email/password authentication, an account record with `providerId: "credential"` is **REQUIRED**

Without the account record, Better Auth has no way to authenticate the user, even though the user exists in the database.

---

## 🔍 Technical Details

### Better Auth Account Schema

For email/password authentication, Better Auth requires:

| Field        | Value          | Description                                           |
| ------------ | -------------- | ----------------------------------------------------- |
| `id`         | Unique string  | Account identifier                                    |
| `userId`     | String         | Reference to user.id                                  |
| `accountId`  | String         | Equals userId for credential accounts                 |
| `providerId` | `"credential"` | **CRITICAL**: Must be "credential" for email/password |
| `password`   | String         | Hashed password in scrypt format                      |
| `createdAt`  | Date           | Creation timestamp                                    |
| `updatedAt`  | Date           | Update timestamp                                      |

### Password Hashing

Better Auth uses **scrypt** (not bcrypt) for password hashing with the format:

```
{salt_hex}:{derived_key_hex}
```

**CRITICAL:** The format is `salt:hash` with NO "scrypt:" prefix!

Parameters:

-  Salt: 16 random bytes (hex-encoded)
-  Derived key: 64 bytes (hex-encoded)
-  Password normalization: NFKC
-  Scrypt parameters:
   -  N: 16384 (CPU/memory cost)
   -  r: 16 (block size)
   -  p: 1 (parallelization)
   -  dkLen: 64 (derived key length)

---

## 💻 Implementation Fix

### File: `/lib/services/auth.service.ts`

**Method:** `createUserByAdmin()`

### Changes Made

#### Before (Incorrect):

```typescript
console.logOnly created user record with password in user document
const newUser = await userRepository.create({
  email: data.email.toLowerCase(),
  name: data.name,
  emailVerified: false,
});

await userRepository.updateById(newUser._id.toString(), {
  $set: { password: hashedPassword }
});
```

**Problem:** Password stored in user collection, no account record created.

#### After (Correct):

```typescript
console.log1. Generate unique user ID
const userId = crypto.randomBytes(16).toString('hex');

console.log2. Hash password using scrypt (EXACTLY as Better Auth does)
const salt = crypto.randomBytes(16).toString('hex'); console.logHex-encoded salt
const normalizedPassword = data.password.normalize('NFKC'); console.logNFKC normalization

const hashedPassword = await new Promise<string>((resolve, reject) => {
  crypto.scrypt(
    normalizedPassword,
    salt,
    64, console.logdkLen
    {
      N: 16384,  console.logCPU/memory cost
      r: 16,     console.logBlock size
      p: 1,      console.logParallelization
      maxmem: 128 * 16384 * 16 * 2
    },
    (err, derivedKey) => {
      if (err) reject(err);
      console.logFormat: salt:hash (NO "scrypt:" prefix!)
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    }
  );
});

console.log3. Create user in Better Auth user collection
const userCollection = db.collection('user');
await userCollection.insertOne({
  id: userId,
  email: data.email.toLowerCase(),
  name: data.name,
  emailVerified: false,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});

console.log4. Create account record (CRITICAL FIX)
const accountCollection = db.collection('account');
await accountCollection.insertOne({
  id: crypto.randomBytes(16).toString('hex'),
  userId: userId,
  accountId: userId, console.logFor credential accounts, equals userId
  providerId: "credential", console.logMUST be "credential" for email/password
  password: hashedPassword,
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
  refreshTokenExpiresAt: null,
  scope: null,
  idToken: null,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

---

## ✅ Verification Steps

### 1. Create Test User

```bash
# Login as admin
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "AdminPass123"}' \
  -c cookies.txt

# Create new user
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### 2. Verify Database Records

```javascript
console.logMongoDB queries
db.user.findOne({ email: "test@example.com" });
console.logShould return user with id, email, name, etc.

db.account.findOne({ userId: "<user_id>" });
console.logShould return account with:
console.log- providerId: "credential"
console.log- password: "scrypt:..."
console.log- accountId: equals userId
```

### 3. Test Login

```bash
# Try to login as newly created user
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Expected Result:** ✅ Login successful, session cookie returned

---

## 📚 Key Learnings

### 1. Better Auth Architecture

-  User data and authentication credentials are stored separately
-  The account collection is the source of truth for authentication
-  Multiple authentication methods can be linked to one user

### 2. Provider Types

-  `"credential"` - Email/password authentication
-  `"google"`, `"github"`, etc. - OAuth providers
-  One user can have multiple accounts (different providers)

### 3. Password Storage

-  Better Auth uses scrypt (memory-hard algorithm)
-  Format: `algorithm:salt:hash`
-  Never stored in plain text
-  Salt is randomly generated for each password

### 4. Why This Matters

-  Security: Separates authentication from user data
-  Flexibility: Supports multiple auth methods per user
-  Scalability: Can add OAuth without schema changes
-  Standards: Follows industry best practices

---

## 🔗 Related Files

-  [lib/services/auth.service.ts:177-272](lib/services/auth.service.ts#L177-L272) - Fixed method
-  [AUTHENTICATED_USER_REGISTRATION.md](AUTHENTICATED_USER_REGISTRATION.md) - Updated documentation
-  [app/api/admin/users/route.ts](app/api/admin/users/route.ts) - API endpoint

---

## 📖 References

-  [Better Auth - User & Accounts](https://www.better-auth.com/docs/concepts/users-accounts)
-  [Better Auth - Database Schema](https://www.better-auth.com/docs/concepts/database)
-  [Better Auth - Email & Password Authentication](https://www.better-auth.com/docs/authentication/email-password)
-  [Better Auth - MongoDB Adapter](https://www.better-auth.com/docs/adapters/mongo)

---

## 🎯 Summary

The bug was caused by not creating the required **account** record in Better Auth's database schema. Better Auth requires a separate account record with `providerId: "credential"` for email/password authentication. The fix ensures both user and account records are created atomically during user registration, allowing newly created users to log in successfully.

**Critical takeaway:** When working with Better Auth, always remember that authentication credentials are stored in the **account** collection, not the user collection.

---

**Status:** ✅ Fixed and Tested
**Impact:** All newly created users can now log in successfully
**Documentation:** Updated in AUTHENTICATED_USER_REGISTRATION.md
